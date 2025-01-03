import React from "react";
import { Link } from "react-router-dom";
import CartItems from "../../components/user/cart/Cartitems";
import RecentlyViewed from "../../components/user/cart/recentlyviewed";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "../../components/user/navbar/navbar";
import { Helmet } from "react-helmet";
import Footer from "../../components/user/footer/footer";

const ShoppingCartPage = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Shopping Cart | Mera Bestie</title>
      </Helmet>
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 space-y-6 mt-16">
  <div className="bg-white shadow-md rounded-lg">
  </div>
   <div className="">
    <CartItems />
  </div>
</div>
<Footer/>
    </div>
  );
};

export default ShoppingCartPage;