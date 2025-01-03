import React, { useState, useEffect } from "react";
import { faTrash, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import emptyCart from '../../Images/empty_cart.webp';
import { Link } from 'react-router-dom';

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
      // Fetch cart for logged-in user
      try {
        const cartResponse = await fetch(`https://ecommercebackend-8gx8.onrender.com/cart/get-cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId })
        });
        const cartData = await cartResponse.json();

        if (!cartData.success) {
          setError(cartData.message || 'Failed to fetch cart');
          setLoading(false);
          return;
        }

        // Get product details for each cart item
        const productPromises = cartData.cart.productsInCart.map(async (item) => {
          const productResponse = await fetch('https://ecommercebackend-8gx8.onrender.com/:productId', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId: item.productId })
          });
          const productData = await productResponse.json();

          if (productData.success) {
            return {
              ...productData.product,
              quantity: item.productQty,
              cartItemId: item._id
            };
          }
          return null;
        });

        const products = await Promise.all(productPromises);
        setCartItems(products.filter(product => product !== null));
      } catch (err) {
        setError('Error fetching cart items');
      }
    } else {
      // Load cart from localStorage for guest user
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

    // Update UI immediately
    const updatedItems = cartItems.map(cartItem => {
      if ((cartItem._id === itemId) || (cartItem.productId === itemId)) {
        return { ...cartItem, quantity: newQuantity };
      }
      return cartItem;
    });
    setCartItems(updatedItems);

    if (userId) {
      // Update quantity for logged-in user
      try {
        const response = await fetch('https://ecommercebackend-8gx8.onrender.com/cart/update-quantity', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            productId: item.productId,
            productQty: newQuantity
          })
        });

        if (!response.ok) {
          console.error('Failed to update quantity on server');
        }
      } catch (err) {
        console.error('Error updating quantity:', err);
      }
    } else {
      // Update quantity in localStorage for guest user
      try {
        localStorage.setItem('guestCart', JSON.stringify(updatedItems));
      } catch (err) {
        console.error('Error updating local cart:', err);
      }
    }
  };

  const handleRemoveItem = async (itemId) => {
    const userId = sessionStorage.getItem('userId');
    const item = cartItems.find(item => item._id === itemId || item.productId === itemId);

    // Update UI immediately
    setCartItems(prevItems => prevItems.filter(cartItem => 
      (cartItem._id !== itemId) && (cartItem.productId !== itemId)
    ));

    if (userId) {
      // Remove item for logged-in user
      try {
        const response = await fetch('https://ecommercebackend-8gx8.onrender.com/cart/delete-items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            productId: item.productId
          })
        });
        
        if (!response.ok) {
          console.error('Failed to remove item from server');
        }
      } catch (err) {
        console.error('Error removing item:', err);
      }
    } else {
      // Remove item from localStorage for guest user
      try {
        const updatedCart = cartItems.filter(cartItem => 
          (cartItem._id !== itemId) && (cartItem.productId !== itemId)
        );
        localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      } catch (err) {
        console.error('Error updating local cart:', err);
      }
    }
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity);
    }, 0);
    const discountedTotal = subtotal * (1 - (discountInfo.percentage / 100));
    return discountedTotal.toFixed(2);
  };

  const handleVoucherRedeem = async () => {
    try {
      const response = await fetch('https://ecommercebackend-8gx8.onrender.com/coupon/verify-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: voucher
        })
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"></div>
      </div>
    );
  }

  if (error || cartItems.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center">
        <img src={emptyCart} alt="Empty Cart" className="w-48 h-48 mb-4" />
        <p className="text-lg text-gray-600 mb-4">{error || 'Your cart is empty'}</p>
        <Link 
          to="/shop" 
          className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
        </div>
        <div className="p-4 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id || item.productId}
              className="flex flex-col md:flex-row items-center justify-between border-b pb-4 last:border-b-0"
            >
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full">
                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
                  <div>
                    <h3 className="font-semibold text-base">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full mt-4 md:mt-0">
                    <span className="font-medium text-base">Rs. {item.price}</span>
                    
                    <div className="flex items-center border rounded-md">
                      <button 
                        onClick={() => handleQuantityChange(item._id || item.productId, -1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faMinus} className="text-sm" />
                      </button>
                      <input
                        type="text"
                        value={item.quantity}
                        readOnly
                        className="w-12 text-center border-none text-sm"
                      />
                      <button 
                        onClick={() => handleQuantityChange(item._id || item.productId, 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faPlus} className="text-sm" />
                      </button>
                    </div>
                    
                    <span className="font-medium text-base">
                      Rs. {(parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity).toFixed(2)}
                    </span>
                    
                    <button 
                      onClick={() => handleRemoveItem(item._id || item.productId)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
            <input
              type="text"
              placeholder="Enter voucher code"
              value={voucher}
              onChange={(e) => setVoucher(e.target.value)}
              className="flex-grow border rounded-md px-3 py-2"
            />
            <button 
              className="w-full md:w-auto bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600" 
              onClick={handleVoucherRedeem}
            >
              Redeem
            </button>
          </div>
          
          {discountInfo.message && (
            <div className={`text-sm ${discountInfo.code ? 'text-green-600' : 'text-red-600'}`}>
              {discountInfo.message}
            </div>
          )}
          
          <div className="space-y-2 text-sm">
            <div className="flex flex-col md:flex-row justify-between">
              <span>Subtotal</span>
              <span>Rs. {cartItems.reduce((total, item) => 
                total + (parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity), 
                0).toFixed(2)}</span>
            </div>
            {discountInfo.percentage > 0 && (
              <div className="flex flex-col md:flex-row justify-between text-green-600">
                <span>Discount ({discountInfo.percentage}%)</span>
                <span>- Rs. {(cartItems.reduce((total, item) => 
                  total + (parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity), 
                  0) * (discountInfo.percentage / 100)).toFixed(2)}</span>
              </div>
            )}
            <div className="flex flex-col md:flex-row justify-between">
              <span>Shipping</span>
              <span>Rs. 0.00</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between font-bold text-base">
              <span>Total</span>
              <span>Rs. {calculateTotal()}</span>
            </div>
          </div>
          
          <Link 
            to={'/checkout'}
            state={{
              total: calculateTotal(),
              discount: discountInfo.percentage
            }}
            className="block"
          >
            <button className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartItems;