using Million.RealEstate.Core.Models;
using Million.RealEstate.Core.Dtos;

namespace Million.RealEstate.Core;

public static class Mapping
{
    public static PropertyDto ToDto(this Property p) =>
        new(p.Id, p.IdOwner, p.Name, p.AddressProperty, p.PriceProperty, p.ImageUrl);
}
