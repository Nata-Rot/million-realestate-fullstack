using Microsoft.OpenApi.Models;
using Million.RealEstate.Core;
using Million.RealEstate.Core.Dtos;
using Million.RealEstate.Core.Interfaces;
using Million.RealEstate.Core.Models;
using Million.RealEstate.Infrastructure;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// -------------------- Mongo Settings --------------------
var mongoSettings = new MongoSettings();
builder.Configuration.GetSection("Mongo").Bind(mongoSettings);

builder.Services.AddSingleton(mongoSettings);
builder.Services.AddSingleton<IPropertyRepository, PropertyRepository>();

// -------------------- CORS --------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

app.UseCors("AllowFrontend");

// -------------------- Swagger --------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Million RealEstate API",
        Version = "v1",
        Description = "API para gestionar propiedades de la app Million RealEstate."
    });
});

var app = builder.Build();

// -------------------- Middleware --------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Habilitar CORS antes de los endpoints
app.UseCors("AllowFrontend");

// -------------------- Endpoints --------------------

// GET /api/properties (con filtros y paginación)
app.MapGet("/api/properties", async (
    IPropertyRepository repo,
    string? name,
    string? address,
    decimal? minPrice,
    decimal? maxPrice,
    int page = 1,
    int pageSize = 20,
    CancellationToken ct = default) =>
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
    return item is null
        ? Results.NotFound(new { message = $"No se encontró propiedad con id {id}" })
        : Results.Ok(item.ToDto());
})
.WithName("GetPropertyById")
.Produces<PropertyDto>(StatusCodes.Status200OK)
.Produces(StatusCodes.Status404NotFound);

// POST /api/dev/seed → Cargar datos de `properties.json` si la colección está vacía
app.MapPost("/api/dev/seed", async (IPropertyRepository repo, IConfiguration config, CancellationToken ct) =>
{
    var path = config["Seed:Path"] ?? "data/seed/properties.json";
    if (!File.Exists(path))
        return Results.NotFound(new { message = $"Archivo seed no encontrado: {path}" });

    var json = await File.ReadAllTextAsync(path, ct);
    var items = JsonSerializer.Deserialize<List<Property>>(json) ?? new();
    await repo.SeedIfEmptyAsync(items, ct);

    return Results.Ok(new { inserted = items.Count });
})
.WithName("SeedProperties")
.Produces(StatusCodes.Status200OK);

app.Run();
