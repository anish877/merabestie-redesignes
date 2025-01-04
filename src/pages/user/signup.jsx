import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Lock } from 'lucide-react';
import AOS from "aos";
import "aos/dist/aos.css";
import ProfessionalNavbar from '../../components/user/navbar/navbar';
import Footer from '../../components/user/footer/footer';
import { useAuth } from '../../context/AuthContext';

const SignUp = () => {
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-in-out-cubic",
      once: true,
    });
  }, []);

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
      await signup(formData.name, formData.email, formData.email, formData.mobile);
    } catch (error) {
      setError('Error signing up. Please try again.');
    }
  };

  return (
    <>
      <ProfessionalNavbar />
      <div className="grid grid-cols-1 md:grid-cols-12 bg-[#f8f8f8] min-h-screen">
        <div className="md:col-span-9 p-4 md:m-6">
          <div className="bg-white rounded-xl p-8 md:p-12" data-aos="fade-up">
            <div className="text-center mb-8">
              <p className="text-xs tracking-widest text-gray-500">JOIN OUR COMMUNITY</p>
              <h2 className="text-4xl font-thin border-b-2 border-dotted pb-4 mt-2">
                Create Account
              </h2>
            </div>

            {error && (
              <div className="bg-[#fed2cb] text-[#c17979] px-6 py-4 rounded-xl mb-8 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 max-w-md mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="text-[#c17979]" strokeWidth={1.5} />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  className="w-full pl-12 pr-4 py-4 border-b-2 border-dotted border-[#e7c1ba] rounded-xl focus:outline-none focus:border-[#c17979] transition duration-300 bg-[#fff]"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="text-[#c17979]" strokeWidth={1.5} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  className="w-full pl-12 pr-4 py-4 border-b-2 border-dotted border-[#e7c1ba] rounded-xl focus:outline-none focus:border-[#c17979] transition duration-300 bg-[#fff]"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="text-[#c17979]" strokeWidth={1.5} />
                </div>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                  required
                  className="w-full pl-12 pr-4 py-4 border-b-2 border-dotted border-[#e7c1ba] rounded-xl focus:outline-none focus:border-[#c17979] transition duration-300 bg-[#fff]"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-[#c17979]" strokeWidth={1.5} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  required
                  className="w-full pl-12 pr-12 py-4 border-b-2 border-dotted border-[#e7c1ba] rounded-xl focus:outline-none focus:border-[#c17979] transition duration-300 bg-[#fff]"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#c17979] hover:text-[#be5959] transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-[#c17979]" strokeWidth={1.5} />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  className="w-full pl-12 pr-4 py-4 border-b-2 border-dotted border-[#e7c1ba] rounded-xl focus:outline-none focus:border-[#c17979] transition duration-300 bg-[#fff]"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#c17979] hover:bg-[#be5959] text-white py-4 rounded-xl font-light tracking-wider transition duration-300 transform active:scale-95"
              >
                CREATE ACCOUNT
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-3 p-4 md:m-6">
          <div className="bg-[#fed2cb] rounded-xl p-8 text-center" data-aos="fade-left">
            <h3 className="text-2xl font-thin text-[#c17979] mb-6">Already Registered?</h3>
            <p className="text-[#c17979] font-light mb-6">
              Sign in to your account to start shopping for amazing gifts.
            </p>
            <div className="border-b-2 border-dotted border-[#e7c1ba] w-full mb-6"></div>
            <a 
              href="/login"
              className="text-[#c17979] hover:text-[#be5959] font-light text-sm tracking-wider"
            >
              SIGN IN NOW
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignUp;