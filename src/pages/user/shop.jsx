import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Grid2x2, List, Star, ChevronLeft, X, Filter, ChevronDown, View, Heart, Eye } from 'lucide-react';
import Navbar from '../../components/user/navbar/navbar';
import Footer from '../../components/user/footer/footer';

const Shop = ({ category }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('rating');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: null,
    priceRange: null,
    rating: [],
  });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);

  const categories = [
    'Books',
    'Cards',
    'Accessories',
    'Uncategorized'
  ];

  const { categoryName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://merabestie-backend.onrender.com/get-product');
        const data = await response.json();
        if (data.success) {
          const validProducts = data.products.filter(
            product =>
              product.name &&
              product.price &&
              product.img &&
              product.category &&
              product.productId &&
              (product.visibility === 'on' || product.visibility === 'true')
          );
          setProducts(validProducts);
          setFilteredProducts(validProducts);
          setBestSellers(validProducts.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (categoryName) {
      const formattedCategoryName = categoryName.replace(/-/g, ' ');
      if (categories.includes(formattedCategoryName)) {
        setSelectedCategory(formattedCategoryName);
        handleCategoryFilter(formattedCategoryName);
      } else {
        setSelectedCategory('404');
      }
    }
  }, [categoryName]);

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  const handleCategoryFilter = (category) => {
    setCurrentPage(1);
    setActiveFilters(prev => ({
      ...prev,
      category: category === 'all' ? null : category
    }));
    applyFilters({ ...activeFilters, category: category === 'all' ? null : category });
    setIsMobileFilterOpen(false); // Close mobile filter after selection
  };

  const handleRatingFilter = (rating) => {
    setCurrentPage(1);
    const updatedRatings = activeFilters.rating.includes(rating)
      ? activeFilters.rating.filter(r => r !== rating)
      : [...activeFilters.rating, rating];
    
    setActiveFilters(prev => ({
      ...prev,
      rating: updatedRatings
    }));
    applyFilters({ ...activeFilters, rating: updatedRatings });
  };

  const removeFilter = (filterType, value) => {
    let updatedFilters = { ...activeFilters };
    
    if (filterType === 'rating') {
      updatedFilters.rating = activeFilters.rating.filter(r => r !== value);
    } else {
      updatedFilters[filterType] = null;
    }
    
    setActiveFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const clearAllFilters = () => {
    const resetFilters = {
      category: null,
      priceRange: null,
      rating: [],
    };
    setActiveFilters(resetFilters);
    setFilteredProducts(products);
    setCurrentPage(1);
    setIsMobileFilterOpen(false);
  };

  const applyFilters = (filters) => {
    let filtered = [...products];
    
    if (filters.category) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    if (filters.rating.length > 0) {
      filtered = filtered.filter(product => 
        filters.rating.some(rating => {
          const minRating = parseInt(rating.split(' ')[0]);
          return product.rating >= minRating;
        })
      );
    }
    
    setFilteredProducts(filtered);
  };

  const handleSort = (value) => {
    setSortBy(value);
    let sorted = [...filteredProducts];
    
    switch(value) {
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    
    setFilteredProducts(sorted);
    setCurrentPage(1);
  };

  const FilterTags = () => {
    const hasActiveFilters = activeFilters.category || 
                           activeFilters.priceRange || 
                           activeFilters.rating.length > 0;
    
    if (!hasActiveFilters) return null;

    return (
      <div className="flex flex-wrap gap-2 px-4 py-3">
        {activeFilters.category && (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-gray-600 border border-gray-200 rounded-full text-sm">
            Category: {activeFilters.category}
            <X 
              className="h-4 w-4 cursor-pointer hover:text-[#be7474]"
              onClick={() => removeFilter('category', activeFilters.category)}
            />
          </span>
        )}
        
        {activeFilters.rating.map((rating) => (
          <span 
            key={rating}
            className="inline-flex items-center gap-1 px-3 py-1 text-gray-600 border border-gray-200 rounded-full text-sm"
          >
            Rating: {rating}
            <X 
              className="h-4 w-4 cursor-pointer hover:text-[#be7474]"
              onClick={() => removeFilter('rating', rating)}
            />
          </span>
        ))}
        
        <button
          onClick={clearAllFilters}
          className="px-3 py-1 text-gray-700 rounded-full text-sm hover:text-[#be7474]"
        >
          Clear All
        </button>
      </div>
    );
  };

  const Sidebar = ({ isMobile }) => (
    <div className={`
      ${isMobile 
        ? 'fixed inset-0 bg-white z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out'
        : 'hidden md:block md:col-span-3 p-4 pr-4'}
      ${isMobile && !isMobileFilterOpen ? 'translate-x-full' : 'translate-x-0'}
    `}>
      {isMobile && (
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Filters</h2>
          <X onClick={toggleMobileFilter} className="h-6 w-6 cursor-pointer" />
        </div>
      )}
      
      <div className="p-4">
        <p className='text-2xl font-normal pb-4 border-b-2 border-gray-200 border-dotted border-spacing tracking-wider'>
          Product Categories
        </p>
        <ul className='pt-4 pb-4'>
          {categories.map((cat, index) => (
            <li 
              key={index}
              onClick={() => handleCategoryFilter(cat)}
              className={`
                ${index !== categories.length - 1 ? 'border-b-2 border-gray-200 border-dotted border-spacing' : ''}
                pt-4 pb-4 ml-4 text-sm font-light cursor-pointer hover:text-pink-600
                ${activeFilters.category === cat ? 'text-pink-600' : ''}
              `}
            >
              {cat}
            </li>
          ))}
        </ul>
        
        <p className='text-2xl font-normal pb-4 border-b-2 border-gray-200 border-dotted border-spacing tracking-wider'>
          Filter By Review
        </p>
        <div className='flex flex-col gap-5 pl-4 pt-4'>
          {['4 and above', '3 and above', '2 and above'].map((rating, index) => (
            <label key={index} className='flex gap-2 text-gray-500 font-light text-sm'>
              <input 
                type="checkbox"
                checked={activeFilters.rating.includes(rating)}
                onChange={() => handleRatingFilter(rating)}
              />
              {rating}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const ProductCard = ({ product }) => {
    return (
      <div className="group">
        <div className="relative mb-4 overflow-hidden rounded-xl">
          <img 
            src={product.img || "https://demo2.themelexus.com/gifymo/wp-content/uploads/2021/05/21.jpg"}
            alt={product.name}
            className="w-full h-56 object-cover"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white rounded-full p-3 flex gap-4 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <Link to={`/${product._id}`}>
                <Eye className="h-5 w-5 hover:text-[#be5959] transition-colors" strokeWidth={1.5} />
              </Link>
              <Heart className="h-5 w-5 hover:text-red-400 transition-colors" strokeWidth={1.5} />
            </div>
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium">{product.name}</h3>
          <p className="text-[#c17979] font-semibold">₹{product.price}</p>
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400" strokeWidth={0} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const Pagination = () => (
    <div className="flex justify-center md:justify-start items-center gap-1 mt-8 mb-8 px-4">
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-full ${
          currentPage === 1 
            ? 'hidden' 
            : 'hover:text-[#be7474]'
        }`}
      >
        <div className='flex items-center gap-1 text-sm'>
          <ChevronLeft className="h-3 w-3" />
          <p className='font-semibold'>PREV</p> 
        </div>
      </button>
      
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => paginate(index + 1)}
          className={`px-3 py-1 rounded-full ${
            currentPage === index + 1
              ? 'bg-[#be7474] text-white'
              : 'bg-white hover:bg-[#be7474] text-[#be7474] hover:text-white'
          }`}
        >
          {index + 1}
        </button>
      ))}
      
      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-full ${
          currentPage === totalPages 
            ? 'hidden' 
            : 'hover:text-[#be7474]'
        }`}
      >
        <div className='flex items-center gap-1 text-sm'>
          <p className='font-semibold'>NEXT</p>
          <ChevronRight className="h-3 w-3" />
        </div>
      </button>
    </div>
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (selectedCategory === '404') {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-pink-50 to-pink-100">
        <h1 className="text-4xl font-bold text-pink-900">404 Not Found</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className='flex gap-.5 items-center p-4 pt-8 pb-2'>
        <p className='text text-gray-500 font-light'>Merabestie</p>
        <ChevronRight className='h-3'/>
        <p className='text font-medium'>Shop</p>
      </div>
      
      <div className='grid grid-cols-12'>
        {/* Mobile Filter Button */}
        <button 
          onClick={toggleMobileFilter}
          className="md:hidden fixed bottom-4 right-4 bg-[#be7474] text-white p-3 rounded-full shadow-lg z-50"
        >
          <Filter className="h-6 w-6" />
        </button>

        {/* Sidebar for both mobile and desktop */}
        <Sidebar isMobile={true} />
        <Sidebar isMobile={false} />

        {/* Main Content */}
        <div className='col-span-12 md:col-span-9'>
          <div className='flex flex-col md:flex-row md:justify-between p-4 border-b border-gray-200 items-start md:items-center gap-4 md:gap-0'>
            <p className='text-gray-500 text-sm md:text font-extralight'>
              Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} results
            </p>
            <div className='flex justify-end gap-2 items-center'>
              <Grid2x2 
                className={`cursor-pointer ${viewMode === 'grid' ? 'text-pink-600' : ''}`}
                onClick={() => setViewMode('grid')}
              />
              <List 
                className={`cursor-pointer ${viewMode === 'list' ? 'text-pink-600' : ''}`}
                onClick={() => setViewMode('list')}
              />
              <select 
                className='border border-black rounded-full p-2 text-sm'
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="rating">Sort by rating</option>
                <option value="price-low">Sort by price: low to high</option>
                <option value="price-high">Sort by price: high to low</option>
              </select>
            </div>
          </div>
          
          <FilterTags />
          
          <div className={`grid ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' 
              : 'grid-cols-1'
          } gap-6 gap-x-12`}>
            {currentProducts.map((product, index) => (
              <Link key={product._id} to={`/${product._id}`} className="w-full">
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
          
          <Pagination />
        </div>
      </div>

      {/* Overlay for mobile filter */}
      {isMobileFilterOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileFilter}
        />
      )}
      
      <Footer/>
    </>
  );
};

export default Shop;