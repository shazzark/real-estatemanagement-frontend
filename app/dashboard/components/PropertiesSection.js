"use client";

const PropertiesSection = () => {
  // Mock properties data
  const properties = [
    {
      id: 1,
      title: "Modern Downtown Apartment",
      price: "$450,000",
      status: "Available",
      beds: 2,
      baths: 2,
      sqft: "1,200",
      type: "Apartment",
    },
    {
      id: 2,
      title: "Luxury Beach Villa",
      price: "$1.2M",
      status: "Sold",
      beds: 4,
      baths: 3,
      sqft: "3,500",
      type: "Villa",
    },
    {
      id: 3,
      title: "Suburban Family Home",
      price: "$750,000",
      status: "Pending",
      beds: 3,
      baths: 2,
      sqft: "2,100",
      type: "House",
    },
    {
      id: 4,
      title: "City Center Loft",
      price: "$650,000",
      status: "Available",
      beds: 1,
      baths: 1,
      sqft: "900",
      type: "Loft",
    },
    {
      id: 5,
      title: "Mountain Retreat",
      price: "$950,000",
      status: "Available",
      beds: 3,
      baths: 3,
      sqft: "2,800",
      type: "Cabin",
    },
    {
      id: 6,
      title: "Commercial Office Space",
      price: "$2.1M",
      status: "Available",
      beds: "-",
      baths: "-",
      sqft: "5,000",
      type: "Commercial",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "Sold":
        return "bg-gray-100 text-gray-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Properties</h2>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
          Add Property
        </button>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => (
          <div
            key={property.id}
            className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-foreground">{property.title}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  property.status
                )}`}
              >
                {property.status}
              </span>
            </div>

            <p className="text-2xl font-bold text-foreground mb-3">
              {property.price}
            </p>

            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <span className="mr-4">{property.beds} Beds</span>
              <span className="mr-4">{property.baths} Baths</span>
              <span>{property.sqft} sqft</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">{property.type}</span>
              <button className="text-sm text-primary hover:text-primary/80">
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-8 p-4 border border-border rounded-lg bg-secondary">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">6</p>
            <p className="text-sm text-muted-foreground">Total Properties</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">3</p>
            <p className="text-sm text-muted-foreground">Available</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">1</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">1</p>
            <p className="text-sm text-muted-foreground">Sold</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesSection;
