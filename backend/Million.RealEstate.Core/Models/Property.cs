namespace Million.RealEstate.Core.Models;

// public class Property
// {
//     public string Id { get; set; } = default!;
//     public string IdOwner { get; set; } = default!;
//     public string Name { get; set; } = default!;
//     public string AddressProperty { get; set; } = default!;
//     public decimal PriceProperty { get; set; }
//     public string ImageUrl { get; set; } = default!;
// }

using System.Text.Json.Serialization;

public class Property
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = default!;

    [JsonPropertyName("idOwner")]
    public string IdOwner { get; set; } = default!;

    [JsonPropertyName("name")]
    public string Name { get; set; } = default!;

    [JsonPropertyName("addressProperty")]
    public string AddressProperty { get; set; } = default!;

    [JsonPropertyName("priceProperty")]
    public decimal PriceProperty { get; set; }

    [JsonPropertyName("imageUrl")]
    public string ImageUrl { get; set; } = default!;
}
