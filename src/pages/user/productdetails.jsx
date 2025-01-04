import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Heart, Minus, Plus, Star, Eye } from 'lucide-react';
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
        const response = await fetch(`https://merabestie-backend.onrender.com/product/${productId}`);
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
        const response = await fetch('https://merabestie-backend.onrender.com/cart/addtocart', {
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
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/cart')}>
              <span>Added to cart</span>
              <span className="text-sm">→</span>
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
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/cart')}>
            <span>Added to cart</span>
            <span className="text-sm">→</span>
          </div>
        );
      } catch (error) {
        toast.error('Error adding product to local cart');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ 
            repeat: Infinity, 
            duration: 1, 
            ease: "linear" 
          }}
          className="w-12 h-12 border-4 border-t-[#be7474] border-pink-200 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <ToastContainer position="bottom-right" />
      
      {/* Main Product Section */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="w-full">
            <ImageGallery images={product?.images || [product?.img]} />
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Product Title and Price */}
            <div className="space-y-4 pb-6 border-b border-gray-200">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-gray-900">
                {product?.name}
              </h1>
              <p className="text-2xl sm:text-3xl font-semibold text-[#be7474]">
                ₹{product?.price}
              </p>
            </div>

            {/* Rating Stars */}
            <div className="flex gap-1 py-4">
              {[...Array(5)].map((_, index) => (
                <Star 
                  key={index} 
                  className={`h-5 w-5 ${index < (product?.rating || 5) ? 'fill-yellow-400' : 'fill-gray-200'}`} 
                  strokeWidth={0}
                />
              ))}
            </div>

            {/* Description */}
            <div className="prose prose-sm sm:prose">
              <p className="text-gray-600 leading-relaxed">
                {product?.description || 'An dico accommodare ius, porro mnesarchum pro in. Cetero fierent urbanitas eam id, sed movet voluptua ut. Eu agam malorum nec. Eu has vide putent, dico option nominati no eam.'}
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-wrap items-center gap-6 py-6 border-t border-b border-gray-200">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Quantity</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button 
                    className="p-2 hover:bg-gray-50"
                    onClick={() => handleQuantityChange(-1)}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-gray-600">{quantity}</span>
                  <button 
                    className="p-2 hover:bg-gray-50"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <button 
                className="flex-1 sm:flex-none px-6 py-3 bg-[#be7474] text-white text-sm font-medium rounded-md hover:bg-[#a65959] transition-colors duration-200"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              
              <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
                <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
              </button>
            </div>

            {/* Categories */}
            <div className="pt-6">
              <p className="text-sm text-gray-600">
                Category: <span className="font-medium text-gray-900">{product?.category}</span>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-medium text-center mb-12">
              Recently Viewed
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentlyViewed.map((item, index) => (
                <div key={index} className="group bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative aspect-w-4 aspect-h-3">
                    <img 
                      src={item.img || "https://demo2.themelexus.com/gifymo/wp-content/uploads/2021/05/21.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300">
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <div className="flex gap-4 bg-white rounded-full p-3 shadow-lg">
                          <Link to={`/${item._id}`}>
                            <Eye className="h-5 w-5 text-gray-600 hover:text-[#be5959]" />
                          </Link>
                          <button>
                            <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-[#c17979] font-semibold mb-3">₹{item.price}</p>
                    <div className="flex justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400" strokeWidth={0} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
};

export default ProductDetail;