using Microsoft.OpenApi.Models;
using Million.RealEstate.Core;
using Million.RealEstate.Core.Dtos;
using Million.RealEstate.Core.Interfaces;
using Million.RealEstate.Core.Models;
using Million.RealEstate.Infrastructure;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Bind Mongo settings from config/environment
var mongoSettings = new MongoSettings();
builder.Configuration.GetSection("Mongo").Bind(mongoSettings);

builder.Services.AddSingleton(mongoSettings);
builder.Services.AddSingleton<IPropertyRepository, PropertyRepository>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Million RealEstate API", Version = "v1" });
});

var app = builder.Build();

// Swagger
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

// GET /api/properties with filters
app.MapGet("/api/properties", async (IPropertyRepository repo, string? name, string? address, decimal? minPrice, decimal? maxPrice, int page = 1, int pageSize = 20, CancellationToken ct = default) =>
{
    var filter = new PropertyFilter
    {
        Name = name,
        Address = address,
        MinPrice = minPrice,
        MaxPrice = maxPrice,
        Page = page,
        PageSize = Math.Clamp(pageSize, 1, 100)
    };

    var (items, total) = await repo.GetAsync(filter, ct);
    var data = items.Select(i => i.ToDto());
    return Results.Ok(new { total, page, pageSize, data });
})
.WithName("GetProperties")
.Produces(StatusCodes.Status200OK);

// GET /api/properties/{id}
app.MapGet("/api/properties/{id}", async (IPropertyRepository repo, string id, CancellationToken ct) =>
{
    var item = await repo.GetByIdAsync(id, ct);
    return item is null ? Results.NotFound() : Results.Ok(item.ToDto());
})
.WithName("GetPropertyById")
.Produces<PropertyDto>(StatusCodes.Status200OK)
.Produces(StatusCodes.Status404NotFound);

// Seed endpoint (dev only)
app.MapPost("/api/dev/seed", async (IPropertyRepository repo, IConfiguration config, CancellationToken ct) =>
{
    var path = config["Seed:Path"] ?? "data/seed/properties.json";
    if (!File.Exists(path)) return Results.NotFound(new { message = $"Seed file not found: {path}" });
    var json = await File.ReadAllTextAsync(path, ct);
    var items = JsonSerializer.Deserialize<List<Property>>(json) ?? new();
    await repo.SeedIfEmptyAsync(items, ct);
    return Results.Ok(new { inserted = items.Count });
})
.WithName("Seed")
.Produces(StatusCodes.Status200OK);

app.Run();
