import React, { useState, useEffect } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/footer";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-in-out-cubic",
      once: true,
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://ecommercebackend-8gx8.onrender.com/complaints/post-complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userType: 'unregistered'
        })
      });

      const data = await response.json();

      if (response.ok && data.message === "Complaint registered successfully") {
        setShowSuccess(true);
        setFormData({ name: "", email: "", message: "" });
        
        setTimeout(() => {
          setShowSuccess(false);
          window.location.href = '/contact';
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#f8f8f8] min-h-screen mt-16">
        <div className="container mx-auto px-4 py-16">
          {showSuccess && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
              <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md">
                <div className="w-32 h-32 mx-auto mb-6 text-[#c17979]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-[#c17979] mb-4">Thank You!</h3>
                <p className="text-gray-700 mb-2">Your message has been received.</p>
                <p className="text-gray-600 text-sm">We'll get back to you soon.</p>
              </div>
            </div>
          )}

          <div className="text-center mb-16" data-aos="fade-down">
            <h1 className="text-5xl font-bold mb-4 text-[#c17979]">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're here to help and answer any questions you may have.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="md:col-span-7" data-aos="fade-right">
              <div className="bg-white rounded-xl p-8 shadow-xl">
                <div className="flex items-center mb-6">
                  <FaPaperPlane className="text-[#c17979] mr-4 text-3xl" />
                  <h2 className="text-3xl font-bold text-gray-800">Send a Message</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c17979] transition-all duration-300"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c17979] transition-all duration-300"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c17979] transition-all duration-300"
                      placeholder="Your message here..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#c17979] hover:bg-[#be5959] text-white py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="md:col-span-5" data-aos="fade-left">
              <div className="bg-white rounded-xl p-8 shadow-xl h-full">
                <div>
                  <div className="flex items-center mb-6">
                    <FaMapMarkerAlt className="text-[#c17979] mr-4 text-3xl" />
                    <h2 className="text-3xl font-bold text-gray-800">Find Us</h2>
                  </div>
                  <div className="space-y-6 mb-8">
                    {[
                      { 
                        icon: <FaPhone className="text-[#c17979] text-2xl" />, 
                        title: "Phone", 
                        detail: "+1 (555) 123-4567" 
                      },
                      { 
                        icon: <FaEnvelope className="text-[#c17979] text-2xl" />, 
                        title: "Email", 
                        detail: "support@merabestie.com" 
                      },
                      { 
                        icon: <FaMapMarkerAlt className="text-[#c17979] text-2xl" />, 
                        title: "Address", 
                        detail: "123 Gift Street, Creative Quarter, NY 10001" 
                      }
                    ].map((contact, index) => (
                      <div 
                        key={index}
                        className="flex items-center space-x-4 bg-[#fed2cb] bg-opacity-20 p-4 rounded-xl hover:bg-opacity-30 transition-all duration-300"
                      >
                        <div className="p-3 bg-white rounded-full shadow-md">
                          {contact.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{contact.title}</h3>
                          <p className="text-gray-600">{contact.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-xl shadow-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.982135436!2d-73.98823922400567!3d40.748817671411!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1698352689255!5m2!1sen!2sus"
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    className="w-full"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16 max-w-3xl mx-auto" data-aos="fade-up">
            <h2 className="text-4xl font-bold mb-4 text-[#c17979]">
              Let's Create Something Amazing Together
            </h2>
            <p className="text-xl text-gray-600">
              Whether you have a question, feedback, or just want to say hello,
              we're always excited to hear from you.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;