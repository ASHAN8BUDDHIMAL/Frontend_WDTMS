import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const tasks = [
    { name: "Plumbing", image: "/images/Plumbing.jpeg" },
    { name: "Gardening", image: "/images/Gardening.jpeg" },
    { name: "Electrician", image: "/images/Electrician.jpeg" },
  ];

  const steps = [
    {
      title: "Create Your Task",
      description: "Describe what you need help with",
      icon: "📝"
    },
    {
      title: "Assign task to the workers",
      description: "Compare profiles and reviews",
      icon: "🔍"
    },
    {
      title: "Choose Your task Accepted Worker",
      description: "After accepting task comfrom the worker",
      icon: "🤝"
    },
    {
      title: "Get the Job Done",
      description: "Your project completed to your satisfaction",
      icon: "✅"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
        {/* Hero Section */}
        <section 
          className="relative py-24 px-6 text-center text-white"
          style={{
            backgroundImage: "linear-gradient(to right, rgba(2, 132, 199, 0.8), rgba(17, 94, 89, 0.8)), url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            backgroundRepeat: "no-repeat"
          }}
        >
          <div className="max-w-4xl mx-auto relative z-10">
            <h1 className="text-5xl font-bold mb-4">Find Trusted Local Workers</h1>
            <p className="text-xl mb-8">Quickly connect with skilled professionals near you for all your home improvement needs</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/registration"
                className="bg-white text-indigo-700 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-indigo-100 transition transform hover:-translate-y-1"
              >
                Get Started
              </Link>
              <Link
                to="/services"
                className="bg-transparent border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-indigo-700 transition"
              >
                Browse Services
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-white transform skew-y-2 origin-bottom"></div>
        </section>

      {/* Popular Local Tasks */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-800 mb-4">Services We Offer</h2>
          <p className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Discover the most requested services in your neighborhood
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tasks.map((task, index) => (
              <div
                key={index}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:border-sky-500"
              >
                <div className="relative overflow-hidden h-60">
                  <img 
                    src={task.image} 
                    alt={task.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">{task.name}</h3>
                </div>
                {/* <div className="p-6">
                  <Link 
                    to={`/services/${task.name.toLowerCase()}`} 
                    className="inline-block mt-2 px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
                  >
                    View Professionals
                  </Link>
                </div> */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section 
        className="relative py-24 px-6 text-white"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-xl text-center mb-16 max-w-3xl mx-auto">
            Simple steps to find the perfect professional for your project
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/20 transition"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="text-2xl font-semibold mb-2">{step.title}</div>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers who found the perfect professional for their needs</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/registration"
              className="bg-white text-indigo-700 font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-indigo-100 transition transform hover:-translate-y-1 text-lg"
            >
              Get Started Today
            </Link>
            <Link
              to="/help"
              className="bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-indigo-700 transition text-lg"
            >
             Help
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4">LocalWork</h3>
              <p className="text-gray-400">
                Connecting homeowners with trusted local professionals since 2023.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Plumbing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Electrical</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Gardening</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Cleaning</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="/services" className="text-gray-400 hover:text-white transition">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Safety</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Community Guidelines</a></li>
                {/* <li><a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a></li> */}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2023 LocalWork. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;