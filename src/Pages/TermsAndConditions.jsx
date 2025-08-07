import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCheck, FiCheckCircle } from 'react-icons/fi';

const TermsAndConditions = () => {
  const [termsData, setTermsData] = useState({
    content: '',
    lastUpdated: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/terms');
        setTermsData({
          content: response.data.content,
          lastUpdated: response.data.lastUpdated
        });
      } catch (err) {
        setError(err.response?.data?.message || 
               err.message || 
               'Failed to load terms and conditions');
        console.error('Error details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const points = termsData.content.split('\n\n').filter(point => point.trim() !== '');

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ 
      backgroundImage: "url('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-gray-900/50"></div>
      
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Terms Content */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8">
              {/* Header Card */}
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800">Terms and Conditions</h1>
                <div className="flex items-center justify-center mt-3 text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">
                    Last updated: {new Date(termsData.lastUpdated).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="space-y-8">
                {points.map((point, index) => (
                  <div key={`point-${index}`} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600 mr-4">
                        <FiCheck className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {point}
                      </p>
                      {index < points.length - 1 && (
                        <div className="border-b border-gray-100 mt-6"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50/80 px-8 py-6 border-t border-gray-200">
              <div className="flex items-center justify-center">
                <FiCheckCircle className="h-6 w-6 text-green-500 mr-2" />
                <p className="text-sm text-gray-700">
                  By using our services, you agree to these terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;