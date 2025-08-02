import React, { useState } from 'react';

const HelpCenter = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Go to **Login > Forgot Password** and follow the email instructions.",
    },
    {
      question: "How are workers matched with tasks?",
      answer: "The system uses skills, location, availability, and past performance ratings.",
    },
    {
      question: "Can I manually assign tasks?",
      answer: "Yes, admins can override auto-assignments in the **Dashboard**.",
    },
  ];

  const docs = [
    { title: "Worker Onboarding Guide", link: "#", bgColor: "bg-purple-100", textColor: "text-purple-800" },
    { title: "Admin Dashboard Manual", link: "#", bgColor: "bg-amber-100", textColor: "text-amber-800" },
    { title: "API Integration", link: "#", bgColor: "bg-emerald-100", textColor: "text-emerald-800" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">Help Center</h1>
          <p className="text-xl text-indigo-700">
            Get instant help and resources
          </p>
        </div>

        {/* Admin Contact Card */}
        <div className="mb-12 p-6 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Admin Support</h2>
          <p className="mb-4">For urgent issues or account assistance</p>
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="font-mono">findworker@gmail.com</span>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mb-16 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h2 className="text-2xl font-semibold text-white">FAQs</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6 hover:bg-indigo-50 transition-colors">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center text-left"
                >
                  <span className="text-lg font-medium text-gray-900">
                    {faq.question}
                  </span>
                  <span className="ml-4 text-indigo-600 font-bold">
                    {activeFaq === index ? '−' : '+'}
                  </span>
                </button>
                {activeFaq === index && (
                  <div className="mt-4 text-gray-600 pl-2 border-l-4 border-indigo-300">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Documentation Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-4 rounded-t-xl">
            <h2 className="text-2xl font-semibold text-white">Documentation</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-b-xl">
            {docs.map((doc, index) => (
              <a
                key={index}
                href={doc.link}
                className={`${doc.bgColor} ${doc.textColor} p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1`}
              >
                <h3 className="font-bold text-lg mb-2">{doc.title}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">View Guide</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default HelpCenter;