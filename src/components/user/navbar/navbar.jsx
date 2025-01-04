import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  RiSearchLine, 
  RiCloseLine,  
  RiFileList3Line,
  RiLogoutBoxRLine,
  RiMenu2Line
} from "react-icons/ri";
import SearchBar from "./SearchBar";
import { ChevronDownIcon, Headset, ShoppingCart, Truck } from "lucide-react";

const ProfessionalNavbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef();
  const profileRef = useRef();
  
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const fetchCartItems = async () => {
      // First check localStorage
      const localCartItems = localStorage.getItem('guestCart');
      let localCount = 0;
      let localTotal = 0;

      if (localCartItems) {
        try {
          const parsedLocalCart = JSON.parse(localCartItems);
          localCount = Array.isArray(parsedLocalCart) ? parsedLocalCart.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;
          localTotal = Array.isArray(parsedLocalCart) ? parsedLocalCart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0) : 0;
        } catch (error) {
          console.error("Error parsing localStorage cart:", error);
        }
      }

      // Then check sessionStorage for logged-in user's cart
      const userId = sessionStorage.getItem("userId");
      if (userId) {
        try {
          const cartResponse = await fetch(
            `https://merabestie-backend.onrender.com/cart/get-cart`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ userId })
            }
          );
          const cartData = await cartResponse.json();
          
          if (cartData.success && cartData.cart && Array.isArray(cartData.cart.productsInCart)) {
            const serverCount = cartData.cart.productsInCart.reduce((sum, item) => sum + 1, 0);
            const serverTotal = cartData.cart.productsInCart.reduce((sum, item) => sum + item.price, 0);
            
            // Use server data if available, otherwise use localStorage data
            setCartItemCount(serverCount);
            setCartTotal(serverTotal);
            return;
          }
        } catch (error) {
          console.error("Error fetching cart from server:", error);
        }
      }

      // If no server data is available, use localStorage counts
      setCartItemCount(localCount);
      setCartTotal(localTotal);
    };

    fetchCartItems();

    // Add localStorage event listener
    const handleStorageChange = (e) => {
      if (e.key === 'cartItems') {
        fetchCartItems();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Rest of the component remains the same
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      const userId = sessionStorage.getItem("userId");
      if (userId) {
        try {
          const response = await fetch(
            `https://merabestie-backend.onrender.com/auth/user/${userId}`
          );
          const data = await response.json();
          setUserName(data.name);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserName();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    window.location.reload();
  };

  const userId = sessionStorage.getItem("userId");

  const NavLinks = () => (
    <>
      <Link to={"/"}>
        <div className="flex gap-1 items-center hover:bg-[#ffa7a781] hover:text-[#8b5858] p-1.5 px-2 transition-all duration-500 rounded-xl">
          <p className="cursor-pointer">HOME</p>
          <ChevronDownIcon size={15} className="text-gray-600" strokeWidth={2.5}/>
        </div>
      </Link>
      <Link to={"/shop"}>
        <div className="flex gap-1 items-center hover:bg-[#ffa7a781] hover:text-[#8b5858] p-1.5 px-2 transition-all duration-500 rounded-xl">
          <p className="cursor-pointer">SHOP</p>
          <ChevronDownIcon size={15} className="text-gray-600" strokeWidth={2.5}/>
        </div>
      </Link>
      <Link to={"/about"}>
        <div className="flex gap-1 items-center hover:bg-[#ffa7a781] hover:text-[#8b5858] p-1.5 px-2 transition-all duration-500 rounded-xl">
        <p className="cursor-pointer">OUR STORY</p>
      </div>
      </Link>
      
      <Link to="/contact">
        <div className="flex gap-1 items-center hover:bg-[#ffa7a781] hover:text-[#8b5858] p-1.5 px-2 transition-all duration-500 rounded-xl">
          <p className="cursor-pointer">CONTACT</p>
        </div>
      </Link>
    </>
  );

  return (
    <div className="relative">
      {/* Top Bar */}
      <div className="border-b border-gray-200 flex flex-wrap gap-2 p-2 md:p-4 text-sm justify-end pr-4 md:pr-10">
        {userId ? (
          <div className="relative" ref={profileRef}>
            <button onClick={toggleProfileMenu} className="hover:text-[#be7474]">Hi, {userName}</button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                <Link to="/orders" className="flex items-center px-4 py-2 hover:bg-[#ffa7a781] transition">
                  <RiFileList3Line className="w-4 h-4 mr-2" />
                  My Orders
                </Link>
                <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 hover:bg-[#ffa7a781] transition">
                  <RiLogoutBoxRLine className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2 flex-wrap">
            <Link to="/login" className="hover:text-[#be7474]">Login</Link>
            <Link to="/Signup" className="hover:text-[#be7474]">Register</Link>
            <Link to="/seller/login" className="hover:text-[#be7474]">Seller</Link>
          </div>
        )}
        <div className="flex gap-2 flex-wrap">
          <Link to="/about" className="font-light text-gray-500 hover:text-[#be7474]">About Us</Link>
          <button className="font-light text-gray-500 hover:text-[#be7474]">Track Orders</button>
          <button className="font-light text-gray-500 hover:text-[#be7474]">FAQ</button>
        </div>
      </div>

      {/* Main Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-center items-center p-4 md:p-8 border-b-2 border-gray-200 border-dotted">
        <Link to={"/"} className="col-span-1">
          <div className="flex justify-start items-center text-3xl md:text-5xl font-extrabold text-[#be7474] italic">
            <h1>mera<span className="text-black">bestie</span></h1>
          </div>
        </Link>
        
        <div className="hidden md:flex col-span-1 justify-center gap-4 items-center">
          <Truck size={40} strokeWidth={1} className="hover:text-[#be7474]"/>
          <div className="flex flex-col gap-1.5 font-light">
            <p className="text-xs text-gray-500 hover:text-[#be7474]">Free standard shipping</p>
            <p>on all orders over $99</p>
          </div>
        </div>
        
        <div className="hidden md:flex col-span-1 justify-center gap-4 items-center">
          <Headset size={40} strokeWidth={1} className="hover:text-[#be7474]"/>
          <div className="flex flex-col gap-1.5 font-light">
            <p className="text-xs text-gray-500 hover:text-[#be7474]">support@example.com</p>
            <p>012 - 345 - 6789</p>
          </div>
        </div>

        <Link to="/cart" className="col-span-1 flex justify-end md:justify-center gap-4 items-center">
          <div className="relative">
            <ShoppingCart size={32} strokeWidth={1} className="hover:text-[#be7474]"/>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#be7474] text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
          <div className="hidden md:flex flex-col gap-1.5 font-light">
            <p className="text-xs text-gray-500 hover:text-[#be7474]">Cart: {cartItemCount} items</p>
            {cartTotal > 0 && (
              <p className="text-xs text-gray-500">${cartTotal.toFixed(2)}</p>
            )}
          </div>
        </Link>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center justify-between px-4 md:px-10 py-4 md:py-6 ">
        <button onClick={toggleMobileMenu} className="md:hidden">
          <RiMenu2Line size={24} />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8">
          <NavLinks />
        </div>

        <SearchBar />
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 md:hidden">
          <div className="p-4">
            <button onClick={toggleMobileMenu} className="mb-4">
              <RiCloseLine size={24} />
            </button>
            <div className="flex flex-col gap-4">
              <NavLinks />
            </div>
          </div>
        </div>
      )}
        <div>
            
        </div>
      
    </div>
  );
};

export default ProfessionalNavbar;