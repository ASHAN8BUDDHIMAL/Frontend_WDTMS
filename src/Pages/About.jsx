import React, { useState } from "react";
import { FaHandshake, FaUsers, FaShieldAlt, FaStar, FaMapMarkerAlt, FaWallet } from "react-icons/fa";

const About = () => {
  const [activeTab, setActiveTab] = useState("mission");

  const stats = [
    { value: "10,00+", label: "Tasks Completed" },
    { value: "2,50+", label: "Trusted Workers" },
    { value: "95%", label: "Satisfaction Rate" },
  ];

  const team = [
    { name: "Alex Chen", role: "Founder & CEO", bio: "Former community organizer passionate about local economies" },
    { name: "Jamila K.", role: "Head of Operations", bio: "Background in gig economy platforms and worker advocacy" },
    { name: "Miguel R.", role: "Tech Lead", bio: "Built marketplace platforms for 8+ years" },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 min-h-screen text-gray-800">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-r from-sky-600 to-teal-700 text-white py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-1/3 w-40 h-40 bg-indigo-300 rounded-full filter blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in">
            We're Reinventing Local Help
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Connecting communities through trusted, neighbor-to-neighbor services
          </p>
          {/* <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-white text-sky-700 font-medium rounded-full shadow-lg hover:bg-gray-100 transition">
              Meet Our Team
            </button>
            <button className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-full hover:bg-white hover:text-sky-700 transition">
              How We Verify Workers
            </button>
          </div> */}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white py-8 shadow-sm -mt-1">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {stats.map((stat, index) => (
              <div key={index} className="px-6 py-4 text-center">
                <p className="text-3xl font-bold text-sky-700">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission/Story Tabs */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`px-6 py-3 font-medium ${activeTab === "mission" ? "text-sky-600 border-b-2 border-sky-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("mission")}
          >
            Our Mission
          </button>
          <button
            className={`px-6 py-3 font-medium ${activeTab === "story" ? "text-sky-600 border-b-2 border-sky-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("story")}
          >
            Our Story
          </button>
          <button
            className={`px-6 py-3 font-medium ${activeTab === "values" ? "text-sky-600 border-b-2 border-sky-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("values")}
          >
            Core Values
          </button>
        </div>

        <div className="min-h-[300px]">
          {activeTab === "mission" && (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Building Community Through Service</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We believe neighborhoods thrive when people help each other. Our platform makes it safe and easy to
                  connect with local skilled individuals for everyday tasks — creating jobs, building trust, and
                  strengthening communities.
                </p>
              </div>
              <div className="bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl p-8 shadow-inner">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Community helping each other"
                  className="rounded-lg shadow-md w-full h-auto"
                />
              </div>
            </div>
          )}

          {activeTab === "story" && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">From Frustration to Solution</h2>
              <div className="space-y-6">
                <p className="text-lg text-gray-700">
                  Founded in 2025 after our CEO struggled to find reliable help for simple home tasks, we set out to
                  create a better way. What started as a local bulletin board is now a thriving platform serving
                  communities across the country.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="italic text-blue-800">
                    "We're not just connecting workers with jobs — we're helping neighbors rediscover the power of
                    community."
                  </p>
                  <p className="font-medium mt-2">— Ashan Buddhimal, Founder</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "values" && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <FaHandshake className="text-sky-600 text-3xl mb-3" />
                <h3 className="text-xl font-semibold mb-2">Trust First</h3>
                <p className="text-gray-600">
                  Every worker is verified through our multi-step screening process.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <FaUsers className="text-indigo-600 text-3xl mb-3" />
                <h3 className="text-xl font-semibold mb-2">Community Focus</h3>
                <p className="text-gray-600">
                  We prioritize local connections over corporate scalability.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <FaShieldAlt className="text-teal-600 text-3xl mb-3" />
                <h3 className="text-xl font-semibold mb-2">Fair Practices</h3>
                <p className="text-gray-600">
                  Workers keep 90% of earnings — one of the highest rates in the industry.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      
    </div>
  );
};

export default About;