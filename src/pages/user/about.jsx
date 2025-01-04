import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/footer";
import { Building2, Users2, Target, Rocket } from "lucide-react";

const AboutPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-in-out-cubic",
      once: true,
    });
  }, []);

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-12 bg-[#f8f8f8]">
        {/* Main Content */}
        <div className="order-1 md:order-2 md:col-span-9 p-4 md:m-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
            {/* Hero Section
            <div className="order-1 md:col-span-12 md:row-span-4">
              <div className="flex flex-col justify-center items-center gap-2 bg-white p-4 md:p-5 rounded-2xl">
                <p className="text-xs tracking-widest">ABOUT US</p>
                <div className="relative flex justify-center items-center">
                  <div className="absolute z-10 flex flex-col justify-center items-center bg-[#fae6ce] p-8 md:p-20 gap-4 text-center">
                    <p className="text-3xl md:text-5xl font-bold tracking-wider">Our Story</p>
                    <p className="text-lg md:text-xl font-extralight tracking-widest">CREATING MEMORABLE EXPERIENCES</p>
                  </div>
                  <img src="/api/placeholder/1200/600" alt="About Us" className="h-full w-full"/>
                </div>
              </div>
            </div> */}

            {/* Vision & Mission */}
            <div className="order-2 md:col-span-6 bg-white rounded-xl p-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <Target className="h-8 w-8 text-[#be5959]" />
                  <h2 className="text-2xl font-semibold">Our Vision</h2>
                </div>
                <p className="text-gray-600">To be the leading platform that connects people through meaningful gifts and creates transformative experiences that empower individuals.</p>
              </div>
            </div>

            <div className="order-3 md:col-span-6 bg-white rounded-xl p-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <Rocket className="h-8 w-8 text-[#be5959]" />
                  <h2 className="text-2xl font-semibold">Our Mission</h2>
                </div>
                <p className="text-gray-600">To leverage creativity and human-centric design to deliver exceptional gifting experiences and foster meaningful connections.</p>
              </div>
            </div>

            {/* Company Values */}
            <div className="order-4 md:col-span-12 bg-white rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-8 text-center">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Quality First",
                    description: "We prioritize excellence in every product and service we offer."
                  },
                  {
                    title: "Customer Focus",
                    description: "Your satisfaction drives every decision we make."
                  },
                  {
                    title: "Innovation",
                    description: "Constantly evolving to meet changing needs and preferences."
                  }
                ].map((value, index) => (
                  <div key={index} className="flex flex-col items-center text-center gap-4 p-6 bg-[#f8f8f8] rounded-xl">
                    <h3 className="text-xl font-semibold">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Left Sidebar */}
        <div className="order-2 md:order-1 md:col-span-3 p-4 md:m-6">
          <div className="p-4 md:p-8 bg-white rounded-xl">
            <div className="flex flex-col justify-center items-center p-4 md:p-8 border-b-2 border-dotted border-gray-200 gap-2">
              <div className="transition-all ease-in-out duration-500 bg-[#d5dbe6] rounded-full p-5 w-fit hover:bg-[#e2e9f5]">
                <Building2 size={48} strokeWidth={0.8}/>
              </div>
              <p className="transition-all duration-500 font-semibold text-center hover:text-[#c17979]">
                Established 2020
              </p>
            </div>
            <div className="flex flex-col justify-center items-center p-4 md:p-8 gap-2">
              <div className="bg-[#fed2cb] rounded-full p-5 w-fit transition-all duration-500 hover:bg-[#fcdbd6]">
                <Users2 size={48} strokeWidth={0.8}/>
              </div>
              <p className="transition-all duration-500 font-semibold text-center hover:text-[#c17979]">
                Growing Community
              </p>
            </div>
          </div>

          <div className="mt-6 bg-[#fed2cb] rounded-xl p-8">
            <div className="flex flex-col gap-4 text-center">
              <h3 className="text-2xl font-semibold">Contact Us</h3>
              <p className="text-gray-700">Have questions? We're here to help!</p>
              <Link to="/contact">
                <button className="bg-white text-[#c17979] px-6 py-2 rounded-full hover:bg-[#c17979] hover:text-white transition-all duration-300">
                  Get in Touch
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;