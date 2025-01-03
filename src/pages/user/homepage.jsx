import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { Helmet } from "react-helmet";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/footer";
import { FaStar, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Gift, PartyPopper, ThumbsUp, Triangle } from "lucide-react";
import h1Banner5 from "../../assets/h1-banner5.jpg"
import h1Slider2 from "../../assets/h1-slider2.jpg"

// Scroll Progress Bar Component
const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentScroll = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((currentScroll / scrollHeight) * 100);
    };

    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
    <motion.div
      style={{ scaleX: scrollProgress / 100 }}
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-pink-500 to-blue-500 origin-left z-50"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: scrollProgress / 100 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    />
  );
};

// Custom Left Arrow Component
const CustomLeftArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 text-pink-500 rounded-full p-2 shadow-md z-10"
    aria-label="Previous Slide"
  >
    <FaArrowLeft size={20} />
  </button>
);

// Custom Right Arrow Component
const CustomRightArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 text-pink-500 rounded-full p-2 shadow-md z-10"
    aria-label="Next Slide"
  >
    <FaArrowRight size={20} />
  </button>
);

// Custom Dot Component for Carousel
const CustomDot = ({ onClick, active }) => (
  <button
    onClick={onClick}
    className={`w-2 h-2 rounded-full mx-1 focus:outline-none transition-colors duration-300 ${
      active ? 'bg-pink-700' : 'bg-pink-500 opacity-75'
    }`}
    aria-label="Carousel Dot"
  />
);

const HomePage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-in-out-cubic",
      once: true,
    });
  }, []);

  const reviews = [
    {
      name: 'John Doe',
      rating: 4,
      reviewText: 'Great product! Really useful and high quality.'
    },
    {
      name: 'Jane Smith',
      rating: 5,
      reviewText: 'Exceeded my expectations. Worth every penny!'
    },
    {
      name: 'Alex Johnson',
      rating: 3,
      reviewText: 'It’s okay, but I was expecting more features.'
    },
    {
      name: 'Emily Davis',
      rating: 5,
      reviewText: 'Absolutely love it! Will definitely buy again.'
    },
    {
      name: 'Michael Brown',
      rating: 4,
      reviewText: 'Very good quality and fast shipping.'
    },
    {
      name: 'Sarah Wilson',
      rating: 5,
      reviewText: 'Fantastic! Highly recommend to everyone.'
    },
    {
      name: 'David Lee',
      rating: 2,
      reviewText: 'Not what I expected. Quality could be better.'
    },
    // Add more reviews as needed
  ];

  const productCategories = [
    {
      img: "https://images.pexels.com/photos/269887/pexels-photo-269887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Gift Boxes
      title: "Gift Boxes",
      category: "Gift-Boxes",
      description: "Huge collection of Gift Boxes for every occasion.",
    },
    {
      img: "https://i.pinimg.com/originals/96/24/6e/96246e3c133e6cb5ae4c7843f9e45b22.jpg", // Stationery
      title: "Stationery",
      category: "Stationery",
      description: "Elegant and functional stationery items for every occasion."
    },
    {
      img: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Books
      title: "Books",
      category: "Books",
      description: "A diverse collection of books to inspire and educate."
    }
  ];

  // Separate responsive configuration for Product Categories Carousel
  const categoryResponsive = {
    desktop: {
      breakpoint: { max: 3000, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  // Existing responsive configuration for Reviews Carousel
  const reviewResponsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 2,
      slidesToSlide: 2,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 2,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  const newArrivals = [
    {
      img: "https://images.pexels.com/photos/269887/pexels-photo-269887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Gift Boxes
      title: "Gift Boxes",
      category: "Gift-Boxes"
    },
    {
      img: "https://i.pinimg.com/originals/96/24/6e/96246e3c133e6cb5ae4c7843f9e45b22.jpg", // Stationery
      title: "Stationery",
      category: "Stationery"
    },
    {
      img: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Books
      title: "Books",
      category: "Books"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-12 bg-[#f8f8f8]">
        <div className="col-span-3 m-6">
          <div className="p-8 pt-8 pb-8 pr-16 flex flex-col justify-start text-lg bg-[#fed2cb] rounded-xl">
            <p className=" transition-all border-b-4 border-dotted border-[#e7c1ba] text-[#c17979] text-lg font pb-4 pt-4 hover:text-[#be5959]">Garment Care</p>
            <p className="transition-all border-b-4 border-dotted border-[#e7c1ba] text-[#c17979] text-lg font pb-4 pt-4 hover:text-[#be5959]">Home & Living</p>
            <p className="transition-all border-b-4 border-dotted border-[#e7c1ba] text-[#c17979] text-lg font pb-4 pt-4 hover:text-[#be5959]">Jewelry and Accessories</p>
            <p className="transition-all border-b-4 border-dotted border-[#e7c1ba] text-[#c17979] text-lg font pb-4 pt-4 hover:text-[#be5959]">Ocassion Gifts</p>
            <p className="transition-all border-b-4 border-dotted border-[#e7c1ba] text-[#c17979] text-lg font pb-4 pt-4 hover:text-[#be5959]">Office & Stationery</p>
            <p className="transition-all border-b-4 border-dotted border-[#e7c1ba] text-[#c17979] text-lg font pb-4 pt-4 hover:text-[#be5959]">Personalised Gifts</p>
            <p className="text-[#c17979] text-lg font pb-3 pt-3">Uncategorized</p>
          </div>
          <div className="p-8 pt-8 pb-8 pr-8 mt-10 bg-white rounded-xl">
            <div className="flex flex-col justify-center items-center p-8 border-b-4 border-dotted border-gray-200 gap-2">
              <div className="transition-all ease-in-out duration-2000 bg-[#d5dbe6] rounded-full p-5 w-fit hover:bg-[#e2e9f5] hover:p-6">
                <Gift size={48} strokeWidth={.8}/>
              </div>
              <p className="transition-all ease-in-out duration-2000 font-semibold text hover:text-[#c17979] hover:font-bold">Delivering quality gifts</p>
              <p className="text-sm font-light text-gray-400">information on its origins</p>
            </div>
            <div className="flex flex-col justify-center items-center p-8 border-b-4 border-dotted border-gray-200 gap-2">
              <div className="bg-[#fae6ce] rounded-full p-5 w-fit hover:bg-[#ffeed8] transition-all ease-in-out duration-2000 hover:p-6">
                <ThumbsUp size={48} strokeWidth={.8}/>
              </div>
              <p className="transition-all ease-in-out duration-2000 font-semibold text hover:text-[#c17979] hover:font-bold">Gifs for all ocassion</p>
              <p className="text-sm font-light text-gray-400">Variants and technical</p>
            </div>
            <div className="flex flex-col justify-center items-center p-8 gap-2">
              <div className="bg-[#fed2cb] rounded-full p-5 w-fit transition-all ease-in-out duration-2000 hover:p-6 hover:bg-[#fcdbd6]">
                  <PartyPopper size={48} strokeWidth={.8}/>
              </div>
              <p className="transition-all ease-in-out duration-2000 font-semibold text hover:text-[#c17979] hover:font-bold">Great Customer Service</p>
              <p className="text-sm font-light text-gray-400">random Lipsum Generator</p>
            </div>
          </div>
        <div>
          <div className="flex flex-col justify-center items-center gap-8 p-8 pt-8 pb-8 pl-2 pr-2 mt-6 bg-white rounded-xl">
            <div className="flex flex-col justify-center items-center">
              <p className="text-3xl font-semibold tracking-widest">Top Holiday</p>
              <p className="text font-semibold tracking-widest">GIFT IDEAS</p>
            </div>
            <img src={h1Banner5} alt="" className="h-80 hover:scale-110 transition-all duration-200"/>
            <p className="text-xs border-b-2 border-dashed border-[#c17979] p-2 pl-0 pr-0 tracking-wide hover:text-[#be5959]">SHOP NOW</p>
          </div>
          </div>
        </div>
        <div className="col-span-9 m-6 grid grid-cols-12 grid-rows-11 gap-5">
          <div className="flex flex-col justify-center items-center gap-2 bg-white p-5 rounded-2xl col-span-12 row-span-4">
            <p className="text-xs tracking-widest">xSTATIONERYx</p>
            <div className="relative flex justify-center items-center">
              <div className="absolute z-100 flex flex-col justify-center items-center bg-[#fae6ce] p-20 gap-4">
                <p className="text-5xl font-bold tracking-wider">Unique Gifts</p>
                <p className="text-xl font-extralight tracking-widest">FOR EVERY OCCASION</p>
              </div>
              <img src={h1Slider2} alt="" className="h-100 w-full"/>
            </div>
            <p className="text-sm tracking-widest font-light">from $2.90</p>
          </div>
          <div className="col-span-7 row-span-2 bg-[url(https://demo2.themelexus.com/gifymo/wp-content/uploads/2021/05/h1-banner1.jpg)]  rounded-xl bg-auto pl-16 flex items-center">
          <div className="flex flex-col justify-center items-center gap-5 font-light tracking-widest">
            <p>Clearance Sale</p>
            <p className="font-base text-5xl tracking-wider pb-2">Women's Day</p>
            <p className="p-2 border-b-2 border-[#be5959] text-xs border-dashed">SHOP NOW</p>
          </div>
          </div>
          <div className="col-span-5 row-span-2 bg-[url(https://demo2.themelexus.com/gifymo/wp-content/uploads/2021/05/h1-banner2.jpg)] rounded-xl bg-auto flex justify-center items-center">
            <div className="bg-white p-14 pl-16 pr-16 flex flex-col justify-center items-center gap-3">
              <p className="">Holiday Offers</p>
              <p className="text-4xl font ">Sale 50% Off</p>
              <p className="border-b font-extralight tracking-wider text-sm border-black">CODE: GRS18</p>
            </div>
          </div>
          <div className="col-span-12 row-span-3 bg-white rounded-xl flex flex-col items-center pt-10">
            <p className="text-4xl font-thin">Feature items</p>
            <div className="grid grid-cols-3 h-full gap-40">
            <div className="flex flex-col justify-center items-center gap-1">
                <div className="relative"> 
                  <div className="absolute transition-all hidden">
                    <p>Buy Now</p>
                    <p>Add to Cart</p>
                  </div>
                  <img src="https://demo2.themelexus.com/gifymo/wp-content/uploads/2021/05/21.jpg" alt="" className="h-44"/>
                </div>
                <p>$132</p>
                <p>Hallmark Stuffed Snoopy</p>
              </div>
              <div className="flex flex-col justify-center items-center gap-1">
                <div className="relative"> 
                  <div className="absolute transition-all hidden">
                    <p>Buy Now</p>
                    <p>Add to Cart</p>
                  </div>
                  <img src="https://demo2.themelexus.com/gifymo/wp-content/uploads/2021/05/21.jpg" alt="" className="h-44"/>
                </div>
                <p>$132</p>
                <p>Hallmark Stuffed Snoopy</p>
              </div>
              <div className="flex flex-col justify-center items-center gap-1">
                <div className="relative"> 
                  <div className="absolute transition-all hidden">
                    <p>Buy Now</p>
                    <p>Add to Cart</p>
                  </div>
                  <img src="https://demo2.themelexus.com/gifymo/wp-content/uploads/2021/05/21.jpg" alt="" className="h-44"/>
                </div>
                <p>$132</p>
                <p>Hallmark Stuffed Snoopy</p>
              </div>
            </div>
          </div>
          <div className="col-span-4 row-span-2">
            <div className="bg-[url('https://demo2.themelexus.com/gifymo/wp-content/uploads/2021/05/h1-banner3.jpg')] flex flex-col justify-center items-center h-full w-full gap-5 pb-24 bg-auto rounded-xl font-extralight">
              <p>Shop Online Gifts Under</p>
              <p className="text-4xl font-semibold">$19.99</p>
              <p className="text-xs pb-2 border-b-2 border-[#c17979] border-dotted font-normal">SHOP NOW</p>
            </div>
          </div>
          <div className="col-span-8 row-span-2">
            <div className="bg-[url('https://demo2.themelexus.com/gifymo/wp-content/uploads/2021/05/h1-banner4.jpg')] flex flex-col gap-5 w-full h-full justify-center items-center rounded-xl">
              <p>AMAZING GIFTS</p>
              <p className="text-4xl font-semibold">30% Off home decor</p>
              <p className="border-b-2 border-dashed pb-2 border-yellow-400">SHOP NOW</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;

// {/* <>
//       <Helmet>
//         <title>Mera Bestie | Unique Gifting Experience</title>
//         <meta
//           name="description"
//           content="Discover unique gifts and thoughtful collections for every occasion."
//         />
//       </Helmet>
//       <ScrollProgress />
//       <Navbar />
//       <div className="w-full bg-white overflow-hidden mt-16">
//                 {/* Product Categories Section */}
//                 <section className="px-0 pt-0 py-20 bg-gray-50">
//           <div className="w-full">
//             <Carousel
//               responsive={categoryResponsive}
//               infinite={true}
//               autoPlay={true}
//               autoPlaySpeed={3000}
//               keyBoardControl={true}
//               customTransition="transform 0.5s ease-in-out"
//               transitionDuration={500}
//               containerClass="carousel-container relative w-full"
//               removeArrowOnDeviceType={[]}
//               showDots={false}
//               arrows={true}
//               customDot={<CustomDot />}
//               dotListClass="flex justify-center mt-4"
//               renderDotsOutside={false}
//               customLeftArrow={<CustomLeftArrow />}
//               customRightArrow={<CustomRightArrow />}
//               itemClass="carousel-item"
//             >
//               {productCategories.map((category, index) => (
//                 <Link
//                 to={`/${category.category}`}
//                   key={index}
//                   className="relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105"
//                 >
//                   <img
//                     src={category.img}
//                     alt={category.title}
//                     className="object-cover w-full h-96 transition-transform duration-500 ease-in-out transform hover:scale-110"
//                   />
//                   <div className="absolute inset-0 flex flex-col justify-end items-center bg-gradient-to-t from-black/85 via-transparent to-transparent pt-4 pb-8">
//                     <h3 className="text-5xl font-extrabold text-white text-center mb-2">{category.title}</h3>
//                     <button
//                       onClick={() => (window.location.href = `/${category.category}`)}
//                       className="mt-4 bg-pink-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-pink-700 transition"
//                     >
//                       Shop Now
//                     </button>
//                   </div>
//                 </Link>
//               ))}
//             </Carousel>
//           </div>
//         </section>

    
//         {/* Hero Section with Modern Glassmorphism Design */}

//         {/* Product Categories Section with Refined Styling */}
//         {/* Removed duplicate closing section tag */}

//     {/* Optional: Remove the additional "Shop Now" button below the carousel if not needed */}
//     {/* <div className="text-center mt-8">
//       <button
//         onClick={() => window.location.href="#shop"}
//         className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:opacity-90 transition"
//       >
//         Shop Now
//       </button>
//     </div> */}

// <section className="px-0 py-20 bg-white">
//           <div className="container mx-auto max-w-6xl">
//             <motion.div
//               className="text-center mb-12"
//               initial={{ opacity: 0, y: -50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 1 }}
//             >
//               <h2 className="text-4xl font-bold mb-4 text-pink-500">New Arrivals</h2>
//               <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-blue-500 mx-auto mb-6"></div>
//             </motion.div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {newArrivals.map((item, index) => (
//                 <Link
//                   to={`/${item.category}`}
//                   key={index}
//                   className="bg-pink-500 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105"
//                 >
//                   <div className="relative w-full h-60 overflow-hidden rounded-md">
//                     <img
//                       src={item.img}
//                       alt={item.title}
//                       className="object-cover w-full h-full transition-transform duration-500 ease-in-out transform hover:scale-110"
//                     />
//                   </div>
//                   <div className="mt-4 text-center">
//                     <h3 className="text-xl font-semibold text-white mb-4">{item.title}</h3>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </section>




//         {/* New Arrivals Section */}
        
        
// <section
//   className="relative min-h-[80vh] flex items-center py-16 sm:py-20 md:py-24 lg:py-28" // Updated padding
//   data-aos="fade-up"
// >
//   <div className="absolute inset-0 z-0">
//     <img
//       src="https://tse3.mm.bing.net/th?id=OIP.RNJBshhRJcxPoSt2Slj5bAHaEK&pid=Api&P=0&h=180"
//       alt="Vision Background"
//       className="w-full h-full object-cover filter brightness-50"
//       loading="lazy"
//     />
//   </div>

//   <div className="container relative z-10 mx-auto max-w-6xl px-4">
//     <motion.div
//       className="bg-white/20 backdrop-blur-md border border-white/30 p-16 md:p-20 rounded-3xl max-w-2xl mx-auto text-center shadow-2xl" // Increased padding
//       initial={{ opacity: 0, scale: 0.9 }}
//       whileInView={{ opacity: 1, scale: 1 }}
//       viewport={{ once: true }}
//       transition={{ duration: 1, ease: "easeOut" }}
//     >
//       <h2 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
//         Our Vision
//       </h2>
//       <p className="text-xl text-white/90 mb-10 leading-relaxed">
//         We believe in creating more than just products – we craft
//         experiences that connect hearts, celebrate relationships, and
//         turn ordinary moments into extraordinary memories. Our mission
//         is to be your partner in expressing love, appreciation, and
//         thoughtfulness.
//       </p>
//       <Link to="/about">
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:opacity-90 px-12 py-4 rounded-full uppercase text-sm tracking-wider font-semibold shadow-xl transition-all"
//         >
//           Our Journey
//         </motion.button>
//       </Link>
//     </motion.div>
//   </div>
// </section>

//         {/* Reviews Section */}
//         <div className="mt-12 max-w-7xl mx-auto p-9">
//           <h2 className="text-4xl font-semibold text-gray-900 mb-6">Customer Reviews</h2>
//           <Carousel
//             responsive={reviewResponsive} // Use separate responsive settings for reviews
//             infinite={true}
//             autoPlay={true}
//             autoPlaySpeed={1500} // Faster timing
//             keyBoardControl={true}
//             customTransition="transform 0.5s ease-in-out"
//             transitionDuration={500}
//             containerClass="carousel-container w-full" 
//             removeArrowOnDeviceType={["tablet", "mobile"]}
//             showDots={false} // Hide dots if desired
//             arrows={false} // Hide navigation arrows
//             // Removed dotListClass since showDots is false
//             itemClass="carousel-item px-4" 
//           >
//             {reviews.map((review, index) => (
//               <div
//                 key={index}
//                 className="bg-gray-50 p-8 rounded-xl shadow-md w-full"
//               >
//                 <span className="font-semibold text-lg">{review.name}</span>
//                 <div className="flex items-center mt-3">
//                   {[...Array(5)].map((_, idx) => (
//                     <FaStar
//                       key={idx}
//                       className={`ml-1 ${idx < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
//                     />
//                   ))}
//                 </div>
//                 <p className="mt-3 text-gray-700 text-lg">{review.reviewText}</p>
//               </div>
//             ))}
//           </Carousel>
//         </div>

//         <Footer />
//       </div>
//     </> */}