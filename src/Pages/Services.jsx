import React from "react";

const servicesData = [
  {
    category: "Home Assistance",
    color: "from-blue-100 to-blue-200",
    services: ["Furniture Moving", "House Painting", "Appliance Setup", "Wall Mounting"],
  },
  {
    category: "Cleaning Services",
    color: "from-green-100 to-teal-200",
    services: ["House Cleaning", "Window Washing", "Carpet Cleaning", "Garage Cleanup"],
  },
  {
    category: "Repairs & Maintenance",
    color: "from-yellow-100 to-orange-200",
    services: ["Electrical Repairs", "Plumbing", "AC Maintenance", "Roof Leak Fix"],
  },
  {
    category: "Outdoor Help",
    color: "from-sky-100 to-indigo-200",
    services: ["Gardening", "Lawn Mowing", "Fence Repair", "Gutter Cleaning"],
  },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">Our Services</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((section, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${section.color} p-6 rounded-2xl shadow hover:shadow-xl transition duration-300`}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{section.category}</h2>
              <ul className="space-y-2 text-gray-700">
                {section.services.map((service, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
