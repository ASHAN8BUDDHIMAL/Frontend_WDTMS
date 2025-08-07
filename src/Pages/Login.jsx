import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userType', data.userType);

        alert('Login successful');
        sessionStorage.setItem("email", data.email);
        
        switch (data.userType.toLowerCase()) {
          case 'admin':
            navigate('/admin/manage-users');
            break;
          case 'worker':
            navigate('/worker/tasks-assigned');
            break;
          case 'customer':
            navigate('/Tasks');
            break;
          default:
            setErrorMessage('Unknown user type');
        }
      } else {
        setErrorMessage(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ 
       backgroundImage: "url('https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')",
      }}
    >
      {/* Darker overlay for better text contrast */}
      <div className="absolute inset-0 bg-gray-900/60"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl p-8 sm:p-10 w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">FindWorker Login</h2>
            <p className="text-gray-600 mt-2">Access your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-red-600 text-center py-2">{errorMessage}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
            >
              Log In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a 
                href="/registration" 
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition"
              >
                Sign up here
              </a>
            </p>
            {/* <a 
              href="/forgot-password" 
              className="inline-block mt-2 text-sm text-gray-600 hover:text-blue-600 hover:underline transition"
            >
              Forgot password?
            </a> */}
          </div>
        </div>
      </div>
    </div>
  );
}