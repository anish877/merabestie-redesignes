import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Heart, Minus, Plus, Star, ChevronRight } from 'lucide-react';
import Navbar from '../../components/user/navbar/navbar';
import ImageGallery from '../../components/user/Imagegallery';

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
      <div className='grid grid-cols-12 p-8 pb-20 border-b border-gray-200'>
        <ImageGallery images={product?.images || [product?.img]} />
        <div className='col-span-7 pl-32 pt-14'>
          <div className='flex flex-col justify-start border-b border-gray-200 pb-8 gap-4'>
            <p className='text-4xl tracking-wider font-medium'>{product?.name}</p>
            <p className='text-[#be7474] text-4xl font-semibold tracking-wider'>₹{product?.price}</p>
          </div>
          <div className='flex pt-6 pb-6 border-b border-gray-200'>
            {[...Array(5)].map((_, index) => (
              <Star 
                key={index} 
                className={`h-4 ${index < (product?.rating || 5) ? 'fill-yellow-400' : 'fill-gray-200'}`} 
                strokeWidth={0}
              />
            ))}
          </div>
          <p className='text-gray-500 pb-8 pt-10 border-b-4 font- border-gray-200 border-dotted tracking-wide'>
            {product.description?product.description:'An dico accommodare ius, porro mnesarchum pro in. Cetero fierent urbanitas eam id, sed movet voluptua ut. Eu agam malorum nec. Eu has vide putent, dico option nominati no eam. Ea erant impetus consequuntur eos, velit congue vidisse eos ne.'}
          </p>
          <div className='flex pt-10 pb-14 gap-7 items-center border-b-4 font- border-gray-200 border-dotted'>
            <p>Quantity :</p>
            <div className='flex p-3 gap-4 border border-gray-300 items-center'>
              <Minus className='h-5 cursor-pointer' onClick={() => handleQuantityChange(-1)}/>
              <p className='text-gray-400'>{quantity}</p>
              <Plus className='h-5 cursor-pointer' onClick={() => handleQuantityChange(1)}/>
            </div>
            <p 
              className='text-sm tracking-widest border-b-4 border-[#ffabab] pb-1 border-dotted cursor-pointer'
              onClick={handleAddToCart}
            >
              ADD TO CART
            </p>
            <Heart className='h-4 cursor-pointer'/>
          </div>
          <div className='flex pt-10 gap-10'>
            <p className='font-light'>
              Categories: <span className='text-gray-400 font-normal'>{product?.category}</span>
            </p>
          </div>
        </div>
      </div>

      {recentlyViewed.length > 0 && (
        <div className='flex flex-col gap-10 pt-10 justify-center'>
          <div className='text-4xl tracking-widest font-normal flex justify-center'>
            <p>Recent Views</p>
          </div>
          <div className='grid grid-cols-3'>
            {recentlyViewed.map((item, index) => (
              <Link to={`/product/${item.productId}`} key={index}>
                <div className='flex flex-col justify-center items-center gap-2 p-4'>
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className='h-72 hover:scale-110 transition-all duration-800'
                  />
                  <p className='font-medium tracking-wider'>₹{item.price}</p>
                  <p className='font-medium tracking-wider'>{item.name}</p>
                  <div className='flex gap-.5 justify-center items-center'>
                    {[...Array(5)].map((_, idx) => (
                      <Star 
                        key={idx}
                        className={`h-4 ${idx < (item.rating || 5) ? 'fill-yellow-400' : 'fill-gray-200'}`} 
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
    </>
  );
};

export default ProductDetail;