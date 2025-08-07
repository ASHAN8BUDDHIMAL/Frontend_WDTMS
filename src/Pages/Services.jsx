import React, { useState } from "react";

const servicesData = [
  {
    category: "Home Assistance",
    icon: "🏠",
    color: "from-blue-100 via-blue-50 to-blue-200",
    hoverColor: "hover:from-blue-200 hover:to-blue-300",
    services: ["Furniture Moving", "House Painting", "Appliance Setup", "Wall Mounting", "Smart Home Installation", "Interior Design"],
    popular: true
  },
  {
    category: "Cleaning Services",
    icon: "🧹",
    color: "from-green-100 via-teal-50 to-teal-200",
    hoverColor: "hover:from-green-200 hover:to-teal-300",
    services: ["Deep Cleaning", "Window Washing", "Carpet Cleaning", "Post-Construction Clean", "Office Cleaning", "Disinfection"],
    popular: false
  },
  {
    category: "Repairs & Maintenance",
    icon: "🔧",
    color: "from-amber-100 via-orange-50 to-orange-200",
    hoverColor: "hover:from-amber-200 hover:to-orange-300",
    services: ["Electrical Repairs", "Plumbing", "AC Maintenance", "Roof Leak Fix", "Appliance Repair", "Handyman Services"],
    popular: true
  },
  {
    category: "Outdoor Help",
    icon: "🌳",
    color: "from-emerald-100 via-cyan-50 to-cyan-200",
    hoverColor: "hover:from-emerald-200 hover:to-cyan-300",
    services: ["Landscaping", "Lawn Care", "Fence Repair", "Gutter Cleaning", "Tree Trimming", "Deck Staining"],
    popular: false
  },
  {
    category: "Personal Assistance",
    icon: "🛍️",
    color: "from-purple-100 via-violet-50 to-violet-200",
    hoverColor: "hover:from-purple-200 hover:to-violet-300",
    services: ["Shopping Help", "Errand Running", "Moving Assistance", "Senior Care", "Pet Care", "Meal Prep"],
    popular: true
  },
  {
    category: "Tech Services",
    icon: "💻",
    color: "from-indigo-100 via-blue-50 to-blue-200",
    hoverColor: "hover:from-indigo-200 hover:to-blue-300",
    services: ["Computer Repair", "TV Mounting", "Network Setup", "Smart Home Config", "Data Recovery", "Tech Tutoring"],
    popular: false
  },
  {
    category: "Event Services",
    icon: "🎉",
    color: "from-pink-100 via-rose-50 to-rose-200",
    hoverColor: "hover:from-pink-200 hover:to-rose-300",
    services: ["Party Setup", "Event Cleaning", "Catering Help", "Decoration", "Photography", "Valet Parking"],
    popular: true
  },
  {
    category: "Automotive Help",
    icon: "🚗",
    color: "from-red-100 via-orange-50 to-orange-200",
    hoverColor: "hover:from-red-200 hover:to-orange-300",
    services: ["Car Washing", "Auto Detailing", "Basic Maintenance", "Tire Change", "Jump Start", "Oil Change"],
    popular: false
  }
];

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = servicesData.filter(service => 
    service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

 return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
      }}
    >
      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 to-gray-900/70"></div>
      
      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Search */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Discover Our Services
            </h1>
            <p className="text-lg text-gray-200 mb-6">
              Professional help for all your needs
            </p>
            
            <div className="max-w-md mx-auto relative">
              <input
                type="text"
                placeholder="Search services..."
                className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white/90 backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="w-5 h-5 absolute right-6 top-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Popular Tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button 
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow hover:shadow-md transition"
              onClick={() => setSearchTerm("")}
            >
              All Services
            </button>
            {servicesData.filter(s => s.popular).map((service, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-white/90 backdrop-blur-sm border border-white/20 rounded-full shadow-sm hover:bg-white transition text-gray-800"
                onClick={() => setSearchTerm(service.category)}
              >
                {service.category}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((section, index) => (
              <div
                key={index}
                className={`bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-white/20`}
                onClick={() => setSelectedCategory(selectedCategory === index ? null : index)}
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{section.icon}</span>
                  <h2 className="text-xl font-bold text-gray-800">{section.category}</h2>
                  {section.popular && (
                    <span className="ml-auto px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                
                <ul className="space-y-2">
                  {section.services.slice(0, selectedCategory === index ? section.services.length : 4).map((service, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-2 h-2 mt-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                      <span className="text-gray-700">{service}</span>
                    </li>
                  ))}
                </ul>
                
                {section.services.length > 4 && (
                  <button 
                    className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(selectedCategory === index ? null : index);
                    }}
                  >
                    {selectedCategory === index ? 'Show Less' : `+${section.services.length - 4} More`}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredServices.length === 0 && (
            <div className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-xl max-w-2xl mx-auto">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No services found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;