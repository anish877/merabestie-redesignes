import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  RiSearchLine, 
  RiCloseLine,  
  RiFileList3Line,
  RiLogoutBoxRLine,
  RiLoginBoxLine,
  RiUserAddLine,
  RiStore2Line,
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
  const searchRef = useRef();
  const profileRef = useRef();
  
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const fetchCartItems = async () => {
      const userId = sessionStorage.getItem("userId");
      if (!userId) return;

      try {
        const cartResponse = await fetch(
          `https://ecommercebackend-8gx8.onrender.com/cart/get-cart`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
          }
        );
        const cartData = await cartResponse.json();
        
        if (cartData.success && cartData.cart && Array.isArray(cartData.cart.productsInCart)) {
          const total = cartData.cart.productsInCart.reduce((sum, item) => sum + 1, 0);
          const cartTotal = cartData.cart.productsInCart.reduce((sum, item) => sum + item.price, 0);
          setCartItemCount(total);
          setCartTotal(cartTotal);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCartItems();
  }, []);

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
            `https://ecommercebackend-8gx8.onrender.com/auth/user/${userId}`
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

  return (
    <div>
      <div className="border-b border-gray-200 flex gap-4 p-4 text-sm justify-end pr-10">
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
          <>
            <Link to="/login" className="hover:text-[#be7474]">Login</Link>
            <Link to="/Signup" className="hover:text-[#be7474]">Register</Link>
            <Link to="/seller/login" className="hover:text-[#be7474]">Seller</Link>
          </>
        )}
        <Link to="/about" className="font-light text-gray-500 hover:text-[#be7474]">About Us</Link>
        <button className="font-light text-gray-500 hover:text-[#be7474]">Track Orders</button>
        <button className="font-light text-gray-500 hover:text-[#be7474]">FAQ</button>
      </div>
      <div className="grid grid-cols-4 justify-center items-center p-4 pl-8 pr-0 pb-12 pt-12 border-b-4 border-gray-200 border-dotted">
        <Link to={"/"}>
          <div className="col-span-1 flex justify-start items-center text-5xl font-extrabold text-[#be7474] italic">
            <h1>mera<span className="text-black">bestie</span></h1>
          </div>
        </Link>
        
        <div className="col-span-1 flex justify-center gap-4 items-center">
          <Truck size={40} strokeWidth={1} className="hover:text-[#be7474]"/>
          <div className="flex flex-col gap-1.5 font-light">
            <p className="text-xs text-gray-500 hover:text-[#be7474]">Free standard shipping</p>
            <p>on all orders over $99</p>
          </div>
        </div>
        <div className="col-span-1 flex justify-center gap-4 items-center">
          <Headset size={40} strokeWidth={1} className="hover:text-[#be7474]"/>
          <div className="flex flex-col gap-1.5 font-light">
            <p className="text-xs text-gray-500 hover:text-[#be7474]">support@example.com</p>
            <p>012 - 345 - 6789</p>
          </div>
        </div>
        <Link to="/cart" className="col-span-1 flex justify-center gap-4 items-center">
          <div className="relative">
            <ShoppingCart size={40} strokeWidth={1} className="hover:text-[#be7474]"/>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#be7474] text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5 font-light">
            <p className="text-xs text-gray-500 hover:text-[#be7474]">Cart: {cartItemCount} items</p>
          </div>
        </Link>
      </div>
      <div className="flex items-center justify-between pl-10 pr-10 pt-6 pb-6 border-b-4 border-dotted">
        <div className="flex gap-8">
          <Link to={"/"}>
            <div className="flex gap-1 items-center hover:bg-[#ffa7a781] hover:text-[#8b5858] p-1.5 px-2 transition-all duration-500 rounded-xl">
              <p className="font- cursor-pointer">HOME</p>
              <ChevronDownIcon size={15} className="text-gray-600" strokeWidth={2.5}/>
            </div>
          </Link>
          
          <Link to={"/shop"} className="p-0 m-0">
            <div className="flex gap-1 items-center hover:bg-[#ffa7a781] hover:text-[#8b5858] p-1.5 px-2 transition-all duration-500 rounded-xl">
              <p className="font- cursor-pointer">SHOP</p>
              <ChevronDownIcon size={15} className="text-gray-600" strokeWidth={2.5}/>
            </div>
          </Link>
          <div className="flex gap-1 items-center hover:bg-[#ffa7a781] hover:text-[#8b5858] p-1.5 px-2 transition-all duration-500 rounded-xl">
            <p className="font- cursor-pointer">PAGES</p>
            <ChevronDownIcon size={15} className="text-gray-600" strokeWidth={2.5}/>
          </div>
          <div className="flex gap-1 items-center hover:bg-[#ffa7a781] hover:text-[#8b5858] p-1.5 px-2 transition-all duration-500 rounded-xl">
            <p className="font- cursor-pointer">OUR STORY</p>
          </div>
          <div className="flex gap-1 items-center hover:bg-[#ffa7a781] hover:text-[#8b5858] p-1.5 px-2 transition-all duration-500 rounded-xl">
            <p className="font- cursor-pointer">BLOG</p>
            <ChevronDownIcon size={15} className="text-gray-600" strokeWidth={2.5}/>
          </div>
          <Link to="/contact">
            <div className="flex gap-1 items-center hover:bg-[#ffa7a781] hover:text-[#8b5858] p-1.5 px-2 transition-all duration-500 rounded-xl">
              <p className="font- cursor-pointer">CONTACT</p>
            </div>
          </Link>
        </div>
        <button onClick={toggleSearch} className="hover:text-[#be7474]">
          <RiSearchLine size={24} />
        </button>
      </div>

      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-full max-w-md mx-4" ref={searchRef}>
            <SearchBar />
            <button 
              onClick={toggleSearch}
              className="mt-2 text-gray-600 hover:text-[#be7474] flex items-center justify-center w-full"
            >
              <RiCloseLine className="w-4 h-4 mr-2" />
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalNavbar;