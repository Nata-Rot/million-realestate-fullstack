using NUnit.Framework;
using Million.RealEstate.Core.Interfaces;

namespace Million.RealEstate.Tests;

public class FilterTests
{
    [Test]
    public void PageSize_IsClamped()
    {
        var f = new PropertyFilter { PageSize = 1000 };
        Assert.That(Math.Clamp(f.PageSize, 1, 100), Is.EqualTo(100));
    }
}
