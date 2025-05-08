import React from "react";

const About = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-sky-100 to-indigo-100 min-h-screen text-gray-800">
      {/* Header */}
      <section className="bg-gradient-to-r from-sky-600 to-blue-700 text-white py-14 px-6 text-center shadow">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Who We Are</h1>
        <p className="text-lg max-w-3xl mx-auto">
          Helping neighbors help each other — Find trusted local workers for everyday tasks.
        </p>
      </section>

      {/* Introduction */}
      <section className="py-12 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Built for the community</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          We started this platform with one simple idea: make it easy for people to find someone nearby to help with
          small tasks. Whether it’s fixing a tap, moving furniture, or painting a room — we connect you with local,
          trustworthy people ready to lend a hand.
        </p>
      </section>

      {/* How It Works */}
      <section className="bg-white py-12 px-6 shadow-inner">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">How It Works</h2>
          <ul className="grid md:grid-cols-3 gap-8 text-center">
            <li className="p-6 bg-sky-50 rounded-xl border border-blue-100 shadow-sm">
              <h3 className="text-xl font-semibold text-sky-700 mb-2">Post a Task</h3>
              <p className="text-gray-600">Tell us what you need done — no job is too small.</p>
            </li>
            <li className="p-6 bg-blue-50 rounded-xl border border-indigo-100 shadow-sm">
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">Find Nearby Helpers</h3>
              <p className="text-gray-600">Get matched with people near you with the right skills.</p>
            </li>
            <li className="p-6 bg-indigo-50 rounded-xl border border-sky-100 shadow-sm">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Get the Job Done</h3>
              <p className="text-gray-600">Schedule, chat, and pay securely — all in one place.</p>
            </li>
          </ul>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-sky-700 mb-4">Why People Trust Us</h2>
        <p className="text-gray-700 text-lg">
          We're not a corporation — we're a platform built by locals, for locals. Simple. Reliable. Community-first.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white text-center py-6 mt-10">
        <p className="text-sm">&copy; {new Date().getFullYear()} FindWorker | Made with heart for everyday help.</p>
      </footer>
    </div>
  );
};

export default About;
