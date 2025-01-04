import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Gift, Minus, Plus, Trash2 } from "lucide-react";
import emptyCart from '../../Images/empty_cart.webp';

const CartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voucher, setVoucher] = useState('');
  const [discountInfo, setDiscountInfo] = useState({
    code: '',
    percentage: 0,
    message: ''
  });

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const userId = sessionStorage.getItem('userId');

    if (userId) {
      try {
        const cartResponse = await fetch(`https://merabestie-backend.onrender.com/cart/get-cart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        const cartData = await cartResponse.json();

        if (!cartData.success) {
          setError(cartData.message || 'Failed to fetch cart');
          setLoading(false);
          return;
        }

        const productPromises = cartData.cart.productsInCart.map(async (item) => {
          const productResponse = await fetch('https://merabestie-backend.onrender.com/:productId', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: item.productId })
          });
          const productData = await productResponse.json();

          return productData.success ? {
            ...productData.product,
            quantity: item.productQty,
            cartItemId: item._id
          } : null;
        });

        const products = await Promise.all(productPromises);
        setCartItems(products.filter(product => product !== null));
      } catch (err) {
        setError('Error fetching cart items');
      }
    } else {
      try {
        const localCart = JSON.parse(localStorage.getItem('guestCart')) || [];
        setCartItems(localCart);
      } catch (err) {
        setError('Error loading local cart');
      }
    }
    setLoading(false);
  };

  const handleQuantityChange = async (itemId, change) => {
    const userId = sessionStorage.getItem('userId');
    const item = cartItems.find(item => item._id === itemId || item.productId === itemId);
    const newQuantity = item.quantity + change;

    if (newQuantity < 1) return;

    const updatedItems = cartItems.map(cartItem => {
      if ((cartItem._id === itemId) || (cartItem.productId === itemId)) {
        return { ...cartItem, quantity: newQuantity };
      }
      return cartItem;
    });
    setCartItems(updatedItems);

    if (userId) {
      try {
        await fetch('https://merabestie-backend.onrender.com/cart/update-quantity', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            productId: item.productId,
            productQty: newQuantity
          })
        });
      } catch (err) {
        console.error('Error updating quantity:', err);
      }
    } else {
      localStorage.setItem('guestCart', JSON.stringify(updatedItems));
    }
  };

  const handleRemoveItem = async (itemId) => {
    const userId = sessionStorage.getItem('userId');
    const item = cartItems.find(item => item._id === itemId || item.productId === itemId);

    setCartItems(prevItems => prevItems.filter(cartItem => 
      (cartItem._id !== itemId) && (cartItem.productId !== itemId)
    ));

    if (userId) {
      try {
        await fetch('https://merabestie-backend.onrender.com/cart/delete-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            productId: item.productId
          })
        });
      } catch (err) {
        console.error('Error removing item:', err);
      }
    } else {
      const updatedCart = cartItems.filter(cartItem => 
        (cartItem._id !== itemId) && (cartItem.productId !== itemId)
      );
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
    }
  };

  const handleVoucherRedeem = async () => {
    try {
      const response = await fetch('https://merabestie-backend.onrender.com/coupon/verify-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: voucher })
      });

      const data = await response.json();

      if (data.message === 'Invalid coupon code') {
        setDiscountInfo({
          code: '',
          percentage: 0,
          message: 'Invalid coupon code'
        });
      } else if (data.discountPercentage) {
        setDiscountInfo({
          code: voucher,
          percentage: data.discountPercentage,
          message: `${data.discountPercentage}% discount applied!`
        });
      }
    } catch (err) {
      console.error('Error verifying coupon:', err);
      setDiscountInfo({
        code: '',
        percentage: 0,
        message: 'Error verifying coupon'
      });
    }
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity);
    }, 0);
    const discountedTotal = subtotal * (1 - (discountInfo.percentage / 100));
    return discountedTotal.toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#f8f8f8]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#c17979]"></div>
      </div>
    );
  }

  if (error || cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl p-8 flex flex-col items-center justify-center m-4 sm:m-6 shadow-sm">
        <img src={emptyCart} alt="Empty Cart" className="w-48 h-48 mb-6" />
        <p className="text-lg text-gray-600 mb-6">{error || 'Your cart is empty'}</p>
        <Link 
          to="/shop" 
          className="px-8 py-4 bg-[#fed2cb] text-[#c17979] rounded-xl hover:bg-[#fcdbd6] transition-all duration-200 text-lg"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b-2 border-dotted border-gray-200">
              <h2 className="text-2xl font-light tracking-wider text-gray-800">YOUR CART</h2>
            </div>
            <div className="divide-y divide-dotted divide-[#e7c1ba]">
              {cartItems.map((item) => (
                <div key={item._id || item.productId} className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="w-24 h-24 flex-shrink-0 bg-[#f8f8f8] rounded-xl overflow-hidden">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <h3 className="text-xl font-normal tracking-wide text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                      <div className="flex flex-wrap items-center gap-6 pt-2">
                        <span className="text-lg font-light text-gray-700">Rs. {item.price}</span>
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button 
                            onClick={() => handleQuantityChange(item._id || item.productId, -1)}
                            className="p-3 hover:bg-[#fcdbd6] rounded-l-lg transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-16 text-center text-gray-700">{item.quantity}</span>
                          <button 
                            onClick={() => handleQuantityChange(item._id || item.productId, 1)}
                            className="p-3 hover:bg-[#fcdbd6] rounded-r-lg transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <span className="text-lg font-medium tracking-wide">
                          Rs. {(parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity).toFixed(2)}
                        </span>
                        <button 
                          onClick={() => handleRemoveItem(item._id || item.productId)}
                          className="p-3 rounded-lg hover:bg-[#fed2cb] hover:text-white transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl shadow-sm sticky top-8">
            <div className="p-6 border-b-2 border-dotted border-gray-200">
              <h2 className="text-2xl font-light tracking-wider text-gray-800">ORDER SUMMARY</h2>
            </div>
            <div className="p-6 space-y-8">
              {/* Voucher Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Enter voucher code"
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value)}
                    className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:border-[#c17979] text-gray-700"
                  />
                  <div className="flex justify-center items-center"><button 
                    onClick={handleVoucherRedeem}
                    className="px-1 w-fit py-1 border-b border-dashed font-light tracking-wider border-[#ff7f6b] hover:text-[#fcdbd6] transition-colors whitespace-nowrap"
                  >
                    APPLY
                  </button></div>
                  
                </div>
                {discountInfo.message && (
                  <p className={`text-sm ${discountInfo.code ? 'text-green-600' : 'text-red-600'}`}>
                    {discountInfo.message}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4">
                <div className="flex justify-between text-gray-700">
                  <span className="font-light">Subtotal</span>
                  <span className="font-light tracking-wider">
                    Rs. {cartItems.reduce((total, item) => 
                      total + (parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity), 
                      0).toFixed(2)}
                  </span>
                </div>
                {discountInfo.percentage > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="font-light">Discount ({discountInfo.percentage}%)</span>
                    <span className="font-light tracking-wider">
                      Rs. {(cartItems.reduce((total, item) => 
                        total + (parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity), 
                        0) * (discountInfo.percentage / 100)).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span className="font-light">Shipping</span>
                  <span className="font-light tracking-wider">Rs. 0.00</span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-dotted border-[#e7c1ba]">
                  <span className="text-sm font-light text-gray-700">Total</span>
                  <span className="text-2xl tracking-wider font-light text-gray-800">
                    Rs. {calculateTotal()}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link 
                to="/checkout" 
                state={{ total: calculateTotal(), discount: discountInfo.percentage }}
                className="block"
              >
                <button className="w-full py-4 text-xl font-light tracking-wider rounded-xl bg-white hover:bg-[#fff5f3] hover:text-[#ff7c62] transition-colors border border-gray-200 text-gray-800">
                  <div className="flex justify-center items-center gap-3">
                    CHECKOUT
                    <Gift size={20} />
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;