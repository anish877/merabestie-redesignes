import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/footer";
import { Eye, Gift, Heart, PartyPopper, ShoppingBasket, Star, ThumbsUp, View } from "lucide-react";
import h1Banner5 from "../../assets/h1-banner5.jpg"
import h1Slider2 from "../../assets/h1-slider2.jpg"

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-in-out-cubic",
      once: true,
    });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://merabestie-backend.onrender.com/get-product');
        const data = await response.json();
        if (data.success) {
          const validProducts = data.products.filter(
            product =>
              product.name &&
              product.price &&
              product.img &&
              product.category &&
              product.productId &&
              (product.visibility === 'on' || product.visibility === 'true')
          );
          setProducts(validProducts.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts()
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-6 bg-[#f8f8f8]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Categories */}
          <aside className="lg:col-span-3 space-y-8">
            {/* Categories Menu */}
            <div className="bg-[#fed2cb] rounded-2xl overflow-hidden">
              <h2 className="text-xl font-semibold px-6 pt-6 pb-4 text-[#333] border-b border-[#e7c1ba]">
                Categories
              </h2>
              <div className="p-6 pt-4 space-y-2">
                {['Stationery', 'Greeting Cards', 'Gift Items', 'Uncategorized'].map((category, index, arr) => (
                  <Link key={category} to="/shop">
                    <div className={`py-3 ${
                      index !== arr.length - 1 ? 'border-b border-[#e7c1ba]' : ''
                    } text-[#c17979] hover:text-[#be5959] transition-colors duration-200`}>
                      <span className="text-lg">{category}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Features boxes */}
            <div className="bg-white rounded-2xl p-6 space-y-6">
              {[
                { Icon: Gift, bg: "bg-[#d5dbe6]", hover: "hover:bg-[#e2e9f5]", title: "Delivering quality gifts" },
                { Icon: ThumbsUp, bg: "bg-[#fae6ce]", hover: "hover:bg-[#ffeed8]", title: "Gifts for all occasions" },
                { Icon: PartyPopper, bg: "bg-[#fed2cb]", hover: "hover:bg-[#fcdbd6]", title: "Great Customer Service" }
              ].map(({ Icon, bg, hover, title }, index, arr) => (
                <div key={index} 
                     className={`text-center space-y-4 pb-6 ${
                       index !== arr.length - 1 ? 'border-b border-gray-100' : ''
                     }`}>
                  <div className={`${bg} ${hover} rounded-full p-5 w-fit mx-auto transition-all duration-300`}>
                    <Icon size={40} strokeWidth={1} />
                  </div>
                  <h3 className="font-medium text-lg text-gray-800">{title}</h3>
                  <p className="text-sm text-gray-500">Premium service guaranteed</p>
                </div>
              ))}
            </div>

            {/* Holiday Banner */}
            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="space-y-3 mb-6">
                <h2 className="text-2xl font-semibold">Top Holiday</h2>
                <p className="text-lg font-medium tracking-wide">GIFT IDEAS</p>
              </div>
              <div className="overflow-hidden rounded-xl mb-6">
                <img 
                  src={h1Banner5} 
                  alt="Holiday gifts" 
                  className="w-full h-auto hover:scale-105 transition-transform duration-300"
                />
              </div>
              <Link to="/shop">
                <span className="inline-block border-b-2 border-[#c17979] text-sm hover:text-[#be5959] transition-colors duration-200 pb-1">
                  SHOP NOW
                </span>
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 space-y-8">
            {/* Hero Section */}
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="relative">
                <img src={h1Slider2} alt="Hero banner" className="w-full h-auto" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-[#fae6ce]/90 px-12 py-10 rounded-lg text-center space-y-4">
                    <p className="text-sm tracking-widest">STATIONERY</p>
                    <h1 className="text-4xl lg:text-5xl font-bold tracking-wide">Unique Gifts</h1>
                    <p className="text-lg tracking-wider font-light">FOR EVERY OCCASION</p>
                    <p className="text-sm tracking-wide mt-4">from ₹2.90</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-7 bg-[url(https://demo2.themelexus.com/gifymo/wp-content/uploads/2021/05/h1-banner1.jpg)] rounded-2xl bg-cover min-h-[300px] flex items-center justify-center">
                <div className="bg-white/90 p-8 rounded-lg text-center space-y-4">
                  <p className="text-lg tracking-wide">Clearance Sale</p>
                  <h2 className="text-4xl font-semibold">Women's Day</h2>
                  <Link to="/shop">
                    <span className="inline-block border-b-2 border-[#be5959] text-sm hover:text-[#be5959] transition-colors duration-200 pb-1">
                      SHOP NOW
                    </span>
                  </Link>
                </div>
              </div>

              <div className="md:col-span-5 bg-[url(https://demo2.themelexus.com/gifymo/wp-content/uploads/2021/05/h1-banner2.jpg)] rounded-2xl bg-cover min-h-[300px] flex items-center justify-center">
                <div className="bg-white/90 p-8 rounded-lg text-center space-y-3">
                  <p className="text-lg">Holiday Offers</p>
                  <p className="text-3xl font-semibold">Sale 50% Off</p>
                  <p className="text-sm tracking-wider border-b border-black pb-1">CODE: GRS18</p>
                </div>
              </div>
            </div>

            {/* Featured Items */}
            <div className="bg-white rounded-2xl p-8">
              <h2 className="text-3xl font-semibold text-center mb-12 pb-4 border-b font-mono">Featured Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {products.map((item, index) => (
                  <div key={index} className="group">
                    <div className="relative mb-4 overflow-hidden rounded-xl">
                      <img 
                        src={item.img || "https://demo2.themelexus.com/gifymo/wp-content/uploads/2021/05/21.jpg"}
                        alt={item.name}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white rounded-full p-3 flex gap-4 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <Link to={`/${item._id}`}>
                            <Eye className="h-5 w-5 hover:text-[#be5959] transition-colors" strokeWidth={1.5} />
                          </Link>
                          <Heart className="h-5 w-5 hover:text-red-400 transition-colors" strokeWidth={1.5} />
                        </div>
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <p className="text-[#c17979] font-semibold">₹{item.price}</p>
                      <div className="flex justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400" strokeWidth={0} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Banners */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4">
                <div className="bg-[url('https://demo2.themelexus.com/gifymo/wp-content/uploads/2021/05/h1-banner3.jpg')] rounded-2xl bg-cover min-h-[300px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <p className="text-lg">Shop Online Gifts Under</p>
                    <p className="text-3xl font-semibold">₹19.99</p>
                    <Link to="/shop">
                      <span className="inline-block border-b-2 border-[#c17979] text-sm hover:text-[#be5959] transition-colors duration-200 pb-1">
                        SHOP NOW
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="md:col-span-8">
                <div className="bg-[url('https://demo2.themelexus.com/gifymo/wp-content/uploads/2021/05/h1-banner4.jpg')] rounded-2xl bg-cover min-h-[300px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <p className="text-lg">AMAZING GIFTS</p>
                    <p className="text-3xl font-semibold">30% Off Home Decor</p>
                    <Link to="/shop">
                      <span className="inline-block border-b-2 border-yellow-400 text-sm hover:text-yellow-600 transition-colors duration-200 pb-1">
                        SHOP NOW
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;