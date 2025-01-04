import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail, User, Phone } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../user/navbar/navbar";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [sellerId, setSellerId] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-in-out-cubic",
      once: true,
    });
  }, []);

  const handleLogin = async () => {
    if (!sellerId || !emailOrPhone || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5173/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sellerId,
            emailOrPhone,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.message === "Login successful") {
        navigate(`/admin/${data.sellerId}`);
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-12 bg-[#f8f8f8] min-h-screen">
        {/* Main Content */}
        <div className="md:col-span-9 p-4 md:m-6">
          <div className="bg-white rounded-xl p-8 md:p-12">
            <div className="text-center mb-8" data-aos="fade-down">
              <p className="text-xs tracking-widest text-gray-500">ADMIN PORTAL</p>
              <h2 className="text-4xl font-thin border-b-2 border-dotted pb-4 mt-2">
                Admin Login
              </h2>
            </div>

            {error && (
              <div className="bg-[#fed2cb] text-[#c17979] px-6 py-4 rounded-xl mb-8 text-center" data-aos="fade-up">
                {error}
              </div>
            )}

            <div className="space-y-8 max-w-md mx-auto" data-aos="fade-up">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="text-[#c17979]" strokeWidth={1.5} />
                </div>
                <input
                  type="text"
                  placeholder="Seller ID"
                  required
                  className="w-full pl-12 pr-4 py-4 border-b-2 border-dotted border-[#e7c1ba] rounded-xl focus:outline-none focus:border-[#c17979] transition duration-300 bg-[#fff]"
                  value={sellerId}
                  onChange={(e) => setSellerId(e.target.value)}
                />
              </div>

              {!selectedMethod ? (
                <div className="flex justify-center gap-8" data-aos="fade-up">
                  <button
                    onClick={() => setSelectedMethod("emailId")}
                    className="flex flex-col items-center p-6 bg-[#fae6ce] rounded-xl hover:bg-[#ffeed8] transition-all duration-300"
                  >
                    <Mail size={36} className="text-[#c17979] mb-2" strokeWidth={1.5} />
                    <span className="text-[#c17979]">Email</span>
                  </button>
                  <button
                    onClick={() => setSelectedMethod("phone")}
                    className="flex flex-col items-center p-6 bg-[#fed2cb] rounded-xl hover:bg-[#fcdbd6] transition-all duration-300"
                  >
                    <Phone size={36} className="text-[#c17979] mb-2" strokeWidth={1.5} />
                    <span className="text-[#c17979]">Phone</span>
                  </button>
                </div>
              ) : selectedMethod === "emailId" ? (
                <div className="relative" data-aos="fade-up">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-[#c17979]" strokeWidth={1.5} />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    className="w-full pl-12 pr-4 py-4 border-b-2 border-dotted border-[#e7c1ba] rounded-xl focus:outline-none focus:border-[#c17979] transition duration-300 bg-[#fff]"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                  />
                </div>
              ) : (
                <div className="relative" data-aos="fade-up">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <div className="flex items-center">
                      <span className="mr-1">🇮🇳</span>
                      <span className="text-[#c17979]">+91</span>
                    </div>
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    maxLength="10"
                    pattern="[0-9]{10}"
                    className="w-full pl-20 pr-4 py-4 border-b-2 border-dotted border-[#e7c1ba] rounded-xl focus:outline-none focus:border-[#c17979] transition duration-300 bg-[#fff]"
                    value={emailOrPhone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 10) {
                        setEmailOrPhone(value);
                      }
                    }}
                  />
                </div>
              )}

              <div className="relative" data-aos="fade-up">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-[#c17979]" strokeWidth={1.5} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="w-full pl-12 pr-12 py-4 border-b-2 border-dotted border-[#e7c1ba] rounded-xl focus:outline-none focus:border-[#c17979] transition duration-300 bg-[#fff]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#c17979] hover:text-[#be5959] transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                </button>
              </div>

              <button
                type="button"
                className="w-full bg-[#c17979] hover:bg-[#be5959] text-white py-4 rounded-xl font-light tracking-wider transition duration-300 transform active:scale-95"
                onClick={handleLogin}
                data-aos="fade-up"
              >
                LOGIN TO DASHBOARD
              </button>
            </div>
          </div>
        </div>

        {/* Side Content */}
        <div className="md:col-span-3 p-4 md:m-6">
          <div className="bg-[#fed2cb] rounded-xl p-8 text-center" data-aos="fade-left">
            <h3 className="text-2xl font-thin text-[#c17979] mb-6">Welcome Back!</h3>
            <p className="text-[#c17979] font-light mb-4">
              Access your admin dashboard to manage products, orders, and more.
            </p>
            <div className="border-b-2 border-dotted border-[#e7c1ba] w-full mb-6"></div>
            <p className="text-sm text-[#c17979]">
              Need help? Contact support
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;