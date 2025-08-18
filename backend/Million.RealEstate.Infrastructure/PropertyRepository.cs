using MongoDB.Driver;
using Million.RealEstate.Core.Interfaces;
using Million.RealEstate.Core.Models;

namespace Million.RealEstate.Infrastructure;

public class MongoSettings
{
    public string ConnectionString { get; set; } = "mongodb://localhost:27017";
    public string Database { get; set; } = "million_realestate";
    public string Collection { get; set; } = "properties";
}

public class PropertyRepository : IPropertyRepository
{
    private readonly IMongoCollection<Property> _collection;

    public PropertyRepository(MongoSettings settings)
    {
        var client = new MongoClient(settings.ConnectionString);
        var db = client.GetDatabase(settings.Database);
        _collection = db.GetCollection<Property>(settings.Collection);
    }

    public async Task<(IReadOnlyList<Property> Items, long Total)> GetAsync(PropertyFilter filter, CancellationToken ct)
    {
        var builder = Builders<Property>.Filter;
        var filters = new List<FilterDefinition<Property>>();

        if (!string.IsNullOrWhiteSpace(filter.Name))
        {
            filters.Add(builder.Regex(p => p.Name, new MongoDB.Bson.BsonRegularExpression(filter.Name, "i")));
        }
        if (!string.IsNullOrWhiteSpace(filter.Address))
        {
            filters.Add(builder.Regex(p => p.AddressProperty, new MongoDB.Bson.BsonRegularExpression(filter.Address, "i")));
        }
        if (filter.MinPrice.HasValue)
        {
            filters.Add(builder.Gte(p => p.PriceProperty, filter.MinPrice.Value));
        }
        if (filter.MaxPrice.HasValue)
        {
            filters.Add(builder.Lte(p => p.PriceProperty, filter.MaxPrice.Value));
        }

        var finalFilter = filters.Count > 0 ? builder.And(filters) : FilterDefinition<Property>.Empty;

        var total = await _collection.CountDocumentsAsync(finalFilter, cancellationToken: ct);

        var items = await _collection
            .Find(finalFilter)
            .SortBy(p => p.PriceProperty)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Limit(filter.PageSize)
            .ToListAsync(ct);

        return (items, total);
    }

    public async Task<Property?> GetByIdAsync(string id, CancellationToken ct)
        => await _collection.Find(x => x.Id == id).FirstOrDefaultAsync(ct);

    public async Task SeedIfEmptyAsync(IEnumerable<Property> items, CancellationToken ct)
    {
        var count = await _collection.CountDocumentsAsync(Builders<Property>.Filter.Empty, cancellationToken: ct);
        if (count == 0 && items.Any())
        {
            await _collection.InsertManyAsync(items, cancellationToken: ct);
        }
    }
}
