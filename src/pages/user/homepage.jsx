import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/footer";
import { Gift, Heart, PartyPopper, ShoppingBasket, Star, ThumbsUp, View } from "lucide-react";
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
        const response = await fetch('https://ecommercebackend-8gx8.onrender.com/get-product');
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

  const handleCartIconClick = ()=>{
    
  }

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-12 bg-[#f8f8f8]">
        {/* Main Content */}
        <div className="order-1 md:order-2 md:col-span-9 p-4 md:m-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
            {/* Hero Section - Unique Gifts */}
            <div className="order-1 md:col-span-12 md:row-span-4 ">
              <div className="flex flex-col justify-center items-center gap-2 bg-white p-4 md:p-5 rounded-2xl">
                <p className="text-xs tracking-widest">xSTATIONERYx</p>
                <div className="relative flex justify-center items-center">
                  <div className="absolute z-10 flex flex-col justify-center items-center bg-[#fae6ce] p-8 md:p-20 gap-4 text-center">
                    <p className="text-3xl md:text-5xl font-bold tracking-wider">Unique Gifts</p>
                    <p className="text-lg md:text-xl font-extralight tracking-widest">FOR EVERY OCCASION</p>
                  </div>
                  <img src={h1Slider2} alt="" className="h-full w-full"/>
                </div>
                <p className="text-sm tracking-widest font-light">from ₹2.90</p>
              </div>
            </div>

            {/* Featured Items - Moved up for mobile */}
            <div className="order-3 md:order-4 md:col-span-12 md:row-span-3 bg-white rounded-xl flex flex-col items-center pt-6 md:pt-10 pb-10" >
              <p className="text-3xl md:text-4xl font-thin border-b-4 border-dotted pb-4">Feature items</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-40 p-4 md:p-0">
                {products.map((item, index) => (
                  <div key={index} className="flex flex-col justify-center items-center gap-3">
                    <div className="relative group">
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white py-2 px-3 rounded-full flex gap-5 border border-gray-200">
                          <Link to={`/${item._id}`}>
                            <View className="h-5 hover:text-[#be5959] transition-all duration-300 ease-in-out text-gray-500" strokeWidth={1.5}/>
                          </Link>
                          
                          <Heart className="h-5 hover:fill-red-400 hover:text-red-400 transition-all duration-300 ease-in-out text-gray-500" strokeWidth={1.5}/>
                        </div>
                      </div>
                      <img src={item.img || "https://demo2.themelexus.com/gifymo/wp-content/uploads/2021/05/21.jpg"} 
                        alt={item.name} className="h-52 w-full object-contain" />
                    </div>
                    <div className="flex flex-col justify-center items-center text-center">
                      <p>₹{item.price}</p>
                      <p>{item.name}</p>
                    </div>
                    <div className="flex gap-0.5 justify-center items-center">
                      {[...Array(5)].map((_, index) => (
                        <Star key={index} className="fill-yellow-400 h-4" strokeWidth={0}/>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Banner Sections */}
            <div className="order-4 md:order-2 md:col-span-7 md:row-span-2 bg-[url(https://demo2.themelexus.com/gifymo/wp-content/uploads/2021/05/h1-banner1.jpg)] rounded-xl bg-cover p-8 flex items-center ">
              <div className="flex flex-col justify-center items-center gap-4 md:gap-5 font-light tracking-widest text-center">
                <p>Clearance Sale</p>
                <p className="font-base text-3xl md:text-5xl tracking-wider pb-2">Women's Day</p>
                <Link to={"/shop"}>
                  <p className="p-2 border-b-2 border-[#be5959] text-xs border-dashed">SHOP NOW</p>
                </Link>
              </div>
            </div>

            <div className="order-5 md:order-3 md:col-span-5 md:row-span-2 bg-[url(https://demo2.themelexus.com/gifymo/wp-content/uploads/2021/05/h1-banner2.jpg)] rounded-xl bg-cover flex justify-center items-center">
              <div className="bg-white p-8 md:p-14 text-center">
                <p>Holiday Offers</p>
                <p className="text-2xl md:text-4xl font">Sale 50% Off</p>
                <p className="border-b font-extralight tracking-wider text-sm border-black">CODE: GRS18</p>
              </div>
            </div>

            {/* Bottom Banners */}
            <div className="order-6 md:order-5 md:col-span-4 md:row-span-2">
              <div className="bg-[url('https://demo2.themelexus.com/gifymo/wp-content/uploads/2021/05/h1-banner3.jpg')] flex flex-col justify-center items-center h-full w-full gap-4 md:gap-5 pb-12 md:pb-24 bg-cover rounded-xl font-extralight text-center">
                <p>Shop Online Gifts Under</p>
                <p className="text-3xl md:text-4xl font-semibold">₹19.99</p>
                <Link to={"/shop"}>
                  <p className="text-xs pb-2 border-b-2 border-[#c17979] border-dotted font-normal">SHOP NOW</p>
                </Link>
              </div>
            </div>

            <div className="order-7 md:order-6 md:col-span-8 md:row-span-2">
              <div className="bg-[url('https://demo2.themelexus.com/gifymo/wp-content/uploads/2021/05/h1-banner4.jpg')] flex flex-col gap-4 md:gap-5 w-full h-full justify-center items-center rounded-xl text-center">
                <p>AMAZING GIFTS</p>
                <p className="text-3xl md:text-4xl font-semibold">30% Off home decor</p>
                <Link to={"/shop"}>
                  <p className="border-b-2 border-dashed pb-2 border-yellow-400">SHOP NOW</p>  
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Left Sidebar - Categories */}
        <div className="order-2 md:order-1 md:col-span-3 p-4 md:m-6">
          {/* Categories Menu */}
          <div className="p-4 md:p-8 md:pt-8 md:pb-8 md:pr-16 flex flex-col justify-start text-lg bg-[#fed2cb] rounded-xl">
            <Link to={"/shop"}>
              <p className="transition-all border-b-4 border-dotted border-[#e7c1ba] text-[#c17979] text-lg font pb-4 pt-4 hover:text-[#be5959]">Stationery</p>
            </Link>
            <Link to={"/shop"}>
              <p className="transition-all border-b-4 border-dotted border-[#e7c1ba] text-[#c17979] text-lg font pb-4 pt-4 hover:text-[#be5959]">Greeting Cards</p>
            </Link>
            <Link to={"/shop"}>
              <p className="transition-all border-b-4 border-dotted border-[#e7c1ba] text-[#c17979] text-lg font pb-4 pt-4 hover:text-[#be5959]">Gift Items</p>
            </Link>
            <Link to={"/shop"}>
              <p className="text-[#c17979] text-lg font pb-3 pt-3">Uncategorized</p>
            </Link>
          </div>

          {/* Rest of the content */}
          <div className="p-4 md:p-8 mt-6 md:mt-10 bg-white rounded-xl">
            {/* Features boxes */}
            <div className="flex flex-col justify-center items-center p-4 md:p-8 border-b-4 border-dotted border-gray-200 gap-2">
              <div className="transition-all ease-in-out duration-2000 bg-[#d5dbe6] rounded-full p-5 w-fit hover:bg-[#e2e9f5] hover:p-6">
                <Gift size={48} strokeWidth={.8}/>
              </div>
              <p className="transition-all ease-in-out duration-2000 font-semibold text-center hover:text-[#c17979] hover:font-bold">Delivering quality gifts</p>
              <p className="text-sm font-light text-gray-400 text-center">information on its origins</p>
            </div>
            <div className="flex flex-col justify-center items-center p-4 md:p-8 border-b-4 border-dotted border-gray-200 gap-2">
              <div className="bg-[#fae6ce] rounded-full p-5 w-fit hover:bg-[#ffeed8] transition-all ease-in-out duration-2000 hover:p-6">
                <ThumbsUp size={48} strokeWidth={.8}/>
              </div>
              <p className="transition-all ease-in-out duration-2000 font-semibold text-center hover:text-[#c17979] hover:font-bold">Gifts for all occasions</p>
              <p className="text-sm font-light text-gray-400 text-center">Variants and technical</p>
            </div>
            <div className="flex flex-col justify-center items-center p-4 md:p-8 gap-2">
              <div className="bg-[#fed2cb] rounded-full p-5 w-fit transition-all ease-in-out duration-2000 hover:p-6 hover:bg-[#fcdbd6]">
                <PartyPopper size={48} strokeWidth={.8}/>
              </div>
              <p className="transition-all ease-in-out duration-2000 font-semibold text-center hover:text-[#c17979] hover:font-bold">Great Customer Service</p>
              <p className="text-sm font-light text-gray-400 text-center">random Lipsum Generator</p>
            </div>
          </div>

          {/* Holiday Banner */}
          <div className="flex flex-col justify-center items-center gap-4 md:gap-8 p-4 md:p-8 mt-6 bg-white rounded-xl">
            <div className="flex flex-col justify-center items-center text-center">
              <p className="text-2xl md:text-3xl font-semibold tracking-widest">Top Holiday</p>
              <p className="text font-semibold tracking-widest">GIFT IDEAS</p>
            </div>
            <img src={h1Banner5} alt="" className="h-60 md:h-80 hover:scale-110 transition-all duration-200"/>
            <Link to={"/shop"}>
              <p className="text-xs border-b-2 border-dashed border-[#c17979] p-2 pl-0 pr-0 tracking-wide hover:text-[#be5959]">SHOP NOW</p>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;