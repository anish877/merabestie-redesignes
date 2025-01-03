import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Lock } from 'lucide-react';
import ProfessionalNavbar from '../../components/user/navbar/navbar';
import Footer from '../../components/user/footer/footer';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      console.log('Signup attempt:', formData);
    } catch (error) {
      setError('Error signing up. Please try again.');
    }
  };

  return (
    <>
      <ProfessionalNavbar/>
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
                Create Account
              </h2>
              <p className="text-[#c17979] mt-2 font-light tracking-wide">
                Join our community
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
                  <User className="text-[#c17979]" size={20} />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-[#fed2cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c17979] transition duration-300"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-[#c17979]" size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-[#fed2cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c17979] transition duration-300"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="text-[#c17979]" size={20} />
                </div>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-[#fed2cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c17979] transition duration-300"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-[#c17979]" size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-12 py-3 border border-[#fed2cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c17979] transition duration-300"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#c17979] hover:text-[#be5959] transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-[#c17979]" size={20} />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-[#fed2cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c17979] transition duration-300"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  className="w-full bg-[#c17979] text-white py-3 rounded-lg font-semibold hover:bg-[#be5959] transition duration-300 transform active:scale-95"
                >
                  Create Account
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-[#c17979] hover:text-[#be5959] font-semibold">
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default SignUp;