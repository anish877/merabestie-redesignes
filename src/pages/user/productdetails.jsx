import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Heart, Minus, Plus, Star, ChevronRight } from 'lucide-react';
import Navbar from '../../components/user/navbar/navbar';
import ImageGallery from '../../components/user/Imagegallery';
import Footer from '../../components/user/footer/footer';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [stockStatus, setStockStatus] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://ecommercebackend-8gx8.onrender.com/product/${productId}`);
        const data = await response.json();
        if (data.success) {
          setProduct(data.product);
          calculateStockStatus(data.product);
          updateRecentlyViewed(data.product);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const calculateStockStatus = (productData) => {
    const stock = productData?.inStockValue || 0;
    setStockStatus({ stock });
  };

  const updateRecentlyViewed = (productData) => {
    let viewedProducts = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    viewedProducts = viewedProducts.filter((p) => p.productId !== productData.productId);
    viewedProducts.unshift(productData);
    if (viewedProducts.length > 3) {
      viewedProducts = viewedProducts.slice(0, 3);
    }
    localStorage.setItem('recentlyViewed', JSON.stringify(viewedProducts));
    setRecentlyViewed(viewedProducts);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (stockStatus?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    const userId = sessionStorage.getItem('userId');
    
    if (stockStatus?.stock === 0) {
      toast.error('Sorry, this product is currently out of stock');
      return;
    }

    const cartItem = {
      productId: product.productId,
      name: product.name,
      price: product.price,
      img: product.img,
      quantity: quantity,
      category: product.category,
      stock: stockStatus?.stock || 0
    };

    if (userId) {
      try {
        const response = await fetch('https://ecommercebackend-8gx8.onrender.com/cart/addtocart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            productId: product.productId,
            quantity,
          }),
        });

        const data = await response.json();

        if (data.success) {
          toast.success(
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/cart')}>
              Go to Cart →
            </div>
          );
        } else {
          toast.error(data.message || 'Product not saved to cart');
        }
      } catch (error) {
        toast.error('Error adding product to cart');
      }
    } else {
      try {
        const localCart = JSON.parse(localStorage.getItem('guestCart')) || [];
        const existingItemIndex = localCart.findIndex(item => item.productId === product.productId);
        
        if (existingItemIndex !== -1) {
          const newQuantity = localCart[existingItemIndex].quantity + quantity;
          if (newQuantity > stockStatus?.stock) {
            toast.warning('Cannot add more items than available in stock');
            return;
          }
          localCart[existingItemIndex].quantity = newQuantity;
        } else {
          localCart.push(cartItem);
        }
        
        localStorage.setItem('guestCart', JSON.stringify(localCart));
        toast.success(
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/cart')}>
            Added to Cart - View Cart →
          </div>
        );
      } catch (error) {
        toast.error('Error adding product to local cart');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ 
            repeat: Infinity, 
            duration: 1, 
            ease: "linear" 
          }}
          className="w-16 h-16 border-4 border-t-4 border-t-[#be7474] border-pink-200 rounded-full"
        />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <ToastContainer />
      
      {/* Main Product Section */}
      <div className='grid grid-cols-1 md:grid-cols-12 p-4 md:p-8 pb-10 md:pb-20 border-b border-gray-200'>
        {/* Image Gallery */}
        <div className="col-span-1 md:col-span-5">
          <ImageGallery images={product?.images || [product?.img]} />
        </div>

        {/* Product Details */}
        <div className='col-span-1 md:col-span-7 px-4 md:pl-32 pt-8 md:pt-14'>
          {/* Product Title and Price */}
          <div className='flex flex-col justify-start border-b border-gray-200 pb-6 md:pb-8 gap-4'>
            <h1 className='text-2xl md:text-4xl tracking-wider font-medium'>{product?.name}</h1>
            <p className='text-[#be7474] text-2xl md:text-4xl font-semibold tracking-wider'>₹{product?.price}</p>
          </div>

          {/* Rating Stars */}
          <div className='flex pt-4 md:pt-6 pb-4 md:pb-6 border-b border-gray-200'>
            {[...Array(5)].map((_, index) => (
              <Star 
                key={index} 
                className={`h-4 ${index < (product?.rating || 5) ? 'fill-yellow-400' : 'fill-gray-200'}`} 
                strokeWidth={0}
              />
            ))}
          </div>

          {/* Description */}
          <p className='text-gray-500 text-sm md:text-base pb-6 md:pb-8 pt-6 md:pt-10 border-b-4 border-gray-200 border-dotted tracking-wide'>
            {product?.description || 'An dico accommodare ius, porro mnesarchum pro in. Cetero fierent urbanitas eam id, sed movet voluptua ut. Eu agam malorum nec. Eu has vide putent, dico option nominati no eam.'}
          </p>

          {/* Quantity and Add to Cart */}
          <div className='flex flex-wrap gap-4 md:gap-7 pt-6 md:pt-10 pb-8 md:pb-14 border-b-4 border-gray-200 border-dotted items-center'>
            <div className="flex items-center gap-4">
              <p className="whitespace-nowrap">Quantity:</p>
              <div className='flex p-2 md:p-3 gap-4 border border-gray-300 items-center'>
                <Minus className='h-4 md:h-5 cursor-pointer' onClick={() => handleQuantityChange(-1)}/>
                <p className='text-gray-400'>{quantity}</p>
                <Plus className='h-4 md:h-5 cursor-pointer' onClick={() => handleQuantityChange(1)}/>
              </div>
            </div>
            
            <button 
              className='text-sm md:text-base tracking-widest border-b-4 border-[#ffabab] pb-1 border-dotted cursor-pointer hover:text-[#be7474]'
              onClick={handleAddToCart}
            >
              ADD TO CART
            </button>
            
            <Heart className='h-4 md:h-5 cursor-pointer hover:fill-red-400 hover:text-red-400 transition-colors'/>
          </div>

          {/* Categories */}
          <div className='flex pt-6 md:pt-10 gap-4 md:gap-10'>
            <p className='text-sm md:text-base font-light'>
              Categories: <span className='text-gray-400 font-normal'>{product?.category}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <div className='flex flex-col gap-6 md:gap-10 pt-8 md:pt-10 justify-center px-4 md:px-8 mb-32'>
          <div className='text-2xl md:text-4xl tracking-widest font-normal flex justify-center'>
            <p>Recent Views</p>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
            {recentlyViewed.map((item, index) => (
              <Link to={`/${item._id}`} key={index}>
                <div className='flex flex-col justify-center items-center gap-2 p-4'>
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className='w-full h-48 md:h-72 object-cover hover:scale-105 transition-all duration-800'
                  />
                  <p className='font-medium tracking-wider text-center'>₹{item.price}</p>
                  <p className='font-medium tracking-wider text-center text-sm md:text-base'>{item.name}</p>
                  <div className='flex gap-.5 justify-center items-center'>
                    {[...Array(5)].map((_, idx) => (
                      <Star 
                        key={idx}
                        className={`h-3 md:h-4 ${idx < (item.rating || 5) ? 'fill-yellow-400' : 'fill-gray-200'}`} 
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <Footer/>
    </>
  );
};

export default ProductDetail;