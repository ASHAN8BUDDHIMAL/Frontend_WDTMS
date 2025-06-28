import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const tasks = [
   { name: "Plumbing", image: "/images/Plumbing.jpeg" },
  { name: "Gardening", image: "/images/Gardening.jpeg" },
  { name: "Electrician", image: "/images/Electrician.jpeg" },
  ];

  const topWorkers = [
    {
      name: "John Doe",
      role: "Plumber",
      rating: 4.9,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Sarah Lee",
      role: "Electrician",
      rating: 4.8,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Michael Chan",
      role: "Gardener",
      rating: 4.7,
      image: "https://randomuser.me/api/portraits/men/53.jpg",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-sky-500 to-teal-700 text-white py-16 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Find Trusted Local Workers</h1>
        <p className="text-lg mb-6">Quickly connect with skilled professionals near you</p>
        <Link
          to="/registration"
          className="bg-white text-indigo-700 font-semibold px-6 py-2 rounded-lg shadow hover:bg-indigo-100 transition"
        >
          Get Started
        </Link>
      </section>

      {/* Popular Local Tasks */}
      <section className="py-14 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-10">Popular Local Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="bg-sky-50 border border-sky-200 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img src={task.image} alt={task.name} className="w-full h-48 object-cover" />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-sky-800">{task.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Rated Workers */}
      <section className="py-14 px-6 bg-cyan-50">
        <h2 className="text-3xl font-bold text-center text-teal-800 mb-10">Top Rated Workers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {topWorkers.map((worker, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition text-center border-t-4 border-teal-400"
            >
              <img
                src={worker.image}
                alt={worker.name}
                className="w-24 h-24 mx-auto rounded-full mb-4 border-4 border-teal-200"
              />
              <h3 className="text-lg font-semibold text-gray-800">{worker.name}</h3>
              <p className="text-gray-500">{worker.role}</p>
              <p className="text-yellow-500 font-medium mt-2">⭐ {worker.rating}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
