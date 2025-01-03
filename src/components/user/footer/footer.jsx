import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white py-8 md:py-16 text-black border-gray-200 border-t-4 border-dotted">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-10">
          {/* Logo and Social Media Section */}
          <div className="flex flex-col items-center md:items-start gap-4">
            {/* Logo */}
            <div className="text-4xl md:text-5xl font-extrabold text-[#be7474] italic">
              <h1>mera<span className="text-black">bestie</span></h1>
            </div>
            
            {/* Description */}
            <p className="text-gray-600 text-center md:text-left text-sm md:text-base">
              Your one-stop destination for thoughtful and unique gifts.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-6 text-2xl md:text-3xl mt-2">
              <a 
                href="https://www.facebook.com/merabestie" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
              >
                <FaFacebook className="text-gray-500 hover:text-[#be7474]" />
              </a>
              <a 
                href="https://www.instagram.com/merabestie" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
              >
                <FaInstagram className="text-gray-500 hover:text-[#be7474]" />
              </a>
              <a 
                href="https://www.twitter.com/merabestie" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
              >
                <FaTwitter className="text-gray-500 hover:text-[#be7474]" />
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center md:text-right mt-6 md:mt-0">
            <h5 className="text-xl md:text-2xl font-bold text-gray-500 mb-4">
              Contact Us
            </h5>
            <div className="text-gray-600 text-sm md:text-base space-y-2">
              <p>3181 Street Name, City, India</p>
              <p>
                Email: 
                <a 
                  href="mailto:support@merabestie.com" 
                  className="hover:text-[#be7474] ml-1"
                >
                  support@merabestie.com
                </a>
              </p>
              <p>
                Phone: 
                <a 
                  href="tel:+911234567890" 
                  className="hover:text-[#be7474] ml-1"
                >
                  +91 1234567890
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-gray-500 text-xs md:text-sm">
          <p>&copy; {new Date().getFullYear()} MERA Bestie. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;