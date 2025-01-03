import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
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
        const cartResponse = await fetch(`https://ecommercebackend-8gx8.onrender.com/cart/get-cart`, {
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
          const productResponse = await fetch('https://ecommercebackend-8gx8.onrender.com/:productId', {
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
        await fetch('https://ecommercebackend-8gx8.onrender.com/cart/update-quantity', {
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
        await fetch('https://ecommercebackend-8gx8.onrender.com/cart/delete-items', {
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
      const response = await fetch('https://ecommercebackend-8gx8.onrender.com/coupon/verify-coupon', {
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
      <div className="flex justify-center items-center h-screen bg-[#f8f8f8]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#c17979]"></div>
      </div>
    );
  }

  if (error || cartItems.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 flex flex-col items-center justify-center m-6">
        <img src={emptyCart} alt="Empty Cart" className="w-48 h-48 mb-4" />
        <p className="text-lg text-gray-600 mb-4">{error || 'Your cart is empty'}</p>
        <Link 
          to="/shop" 
          className="px-6 py-3 bg-[#fed2cb] text-[#c17979] rounded-xl hover:bg-[#fcdbd6] transition-all duration-200"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 bg-[#f8f8f8] p-6 gap-6">
      <div className="col-span-12 lg:col-span-8">
        <div className="bg-white rounded-xl">
          <div className="p-6 border-b border-dotted border-[#e7c1ba]">
            <h2 className="text-2xl font-semibold text-[#c17979]">Your Cart</h2>
          </div>
          <div className="p-6 space-y-6">
            {cartItems.map((item) => (
              <div key={item._id || item.productId} className="flex flex-col md:flex-row items-center gap-4 pb-6 border-b border-dotted border-[#e7c1ba] last:border-b-0">
                <div className="w-24 h-24 bg-[#f8f8f8] rounded-xl overflow-hidden">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-[#c17979]">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="font-medium">Rs. {item.price}</span>
                    <div className="flex items-center bg-[#fed2cb] rounded-lg">
                      <button onClick={() => handleQuantityChange(item._id || item.productId, -1)}
                        className="p-2 hover:bg-[#fcdbd6] rounded-l-lg transition-colors">
                        <Minus size={16} className="text-[#c17979]" />
                      </button>
                      <span className="w-12 text-center text-[#c17979]">{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item._id || item.productId, 1)}
                        className="p-2 hover:bg-[#fcdbd6] rounded-r-lg transition-colors">
                        <Plus size={16} className="text-[#c17979]" />
                      </button>
                    </div>
                    <span className="font-medium text-[#c17979]">
                      Rs. {(parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity).toFixed(2)}
                    </span>
                    <button onClick={() => handleRemoveItem(item._id || item.productId)}
                      className="p-2 text-[#c17979] hover:bg-[#fed2cb] rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4">
        <div className="bg-white rounded-xl">
          <div className="p-6 border-b border-dotted border-[#e7c1ba]">
            <h2 className="text-2xl font-semibold text-[#c17979]">Order Summary</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter voucher code"
                  value={voucher}
                  onChange={(e) => setVoucher(e.target.value)}
                  className="flex-1 border border-[#e7c1ba] rounded-lg px-4 py-2 focus:outline-none focus:border-[#c17979]"
                />
                <button 
                  onClick={handleVoucherRedeem}
                  className="px-4 py-2 bg-[#fed2cb] text-[#c17979] rounded-lg hover:bg-[#fcdbd6] transition-colors"
                >
                  Apply
                </button>
              </div>
              {discountInfo.message && (
                <p className={`text-sm ${discountInfo.code ? 'text-green-600' : 'text-red-600'}`}>
                  {discountInfo.message}
                </p>
              )}
            </div>

            <div className="space-y-4 text-[#c17979]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {cartItems.reduce((total, item) => 
                  total + (parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity), 
                  0).toFixed(2)}</span>
              </div>
              {discountInfo.percentage > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discountInfo.percentage}%)</span>
                  <span>- Rs. {(cartItems.reduce((total, item) => 
                    total + (parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity), 
                    0) * (discountInfo.percentage / 100)).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Rs. 0.00</span>
              </div>
              <div className="flex justify-between text-xl font-semibold border-t border-dotted border-[#e7c1ba] pt-4">
                <span>Total</span>
                <span>Rs. {calculateTotal()}</span>
              </div>
            </div>

            <Link to="/checkout" state={{ total: calculateTotal(), discount: discountInfo.percentage }}>
              <button className="w-full py-3 bg-[#fed2cb] text-[#c17979] rounded-xl hover:bg-[#fcdbd6] transition-colors">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;