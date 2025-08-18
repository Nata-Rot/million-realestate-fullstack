using Million.RealEstate.Core.Models;

namespace Million.RealEstate.Core.Interfaces;

public class PropertyFilter
{
    public string? Name { get; init; }
    public string? Address { get; init; }
    public decimal? MinPrice { get; init; }
    public decimal? MaxPrice { get; init; }
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}

public interface IPropertyRepository
{
    Task<(IReadOnlyList<Property> Items, long Total)> GetAsync(PropertyFilter filter, CancellationToken ct);
    Task<Property?> GetByIdAsync(string id, CancellationToken ct);
    Task SeedIfEmptyAsync(IEnumerable<Property> items, CancellationToken ct);
}
