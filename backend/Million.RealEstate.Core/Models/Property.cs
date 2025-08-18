namespace Million.RealEstate.Core.Models;

public class Property
{
    public string Id { get; set; } = default!;
    public string IdOwner { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string AddressProperty { get; set; } = default!;
    public decimal PriceProperty { get; set; }
    public string ImageUrl { get; set; } = default!;
}
