import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import ProfessionalNavbar from '../../components/user/navbar/navbar';
import Footer from '../../components/user/footer/footer';

const Login = () => {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Placeholder for login logic
      console.log('Login attempt:', { emailOrMobile, password });
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <>
      <ProfessionalNavbar />
      <div className="min-h-screen bg-[#f8f8f8]">
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        {/* Navbar placeholder */}
        <div className="h-16"></div>
      </div>
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-[#c17979] mt-2 font-light tracking-wide">
                Sign in to your account
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-[#c17979]" size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Email or Mobile Number"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-[#fed2cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c17979] transition duration-300"
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-[#c17979]" size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-12 py-3 border border-[#fed2cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c17979] transition duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#c17979] hover:text-[#be5959] transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-[#c17979] border-[#fed2cb] rounded focus:ring-[#c17979]"
                    id="remember-me"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-gray-600">
                    Remember me
                  </label>
                </div>
                <a href="/forgot-password" className="text-[#c17979] hover:text-[#be5959]">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-[#c17979] text-white py-3 rounded-lg font-semibold hover:bg-[#be5959] transition duration-300 transform active:scale-95"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="text-[#c17979] hover:text-[#be5959] font-semibold">
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Login;