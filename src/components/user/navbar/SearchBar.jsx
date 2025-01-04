import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IntegratedSearchBar = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (inputValue.trim()) {
        fetchProducts(inputValue);
      } else {
        setSearchResult([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false);
        setInputValue('');
        setSearchResult([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchProducts = async (input) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://merabestie-backend.onrender.com/get-product');
      const data = await response.json();
      if (data.success) {
        const validProducts = data.products.filter(product => 
          (product?.name?.toLowerCase().includes(input.toLowerCase()) || 
           product?.category?.toLowerCase().includes(input.toLowerCase())) &&
          product.price && 
          product.img && 
          product._id &&
          product.visibility === "on" || "true"
        );
        setSearchResult(validProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchClick = () => {
    setIsExpanded(true);
  };

  const clearSearch = () => {
    setInputValue('');
    setSearchResult([]);
    setIsExpanded(false);
  };

  return (
    <div ref={searchRef} className="relative flex items-center">
      <motion.div
        initial={false}
        animate={{ 
          width: isExpanded ? '100%' : 'auto',
          position: isExpanded ? 'fixed' : 'relative',
          top: isExpanded ? '0' : 'auto',
          left: isExpanded ? '0' : 'auto',
          right: isExpanded ? '0' : 'auto',
          zIndex: isExpanded ? 50 : 'auto',
        }}
        className="md:relative flex items-center"
      >
        {!isExpanded ? (
          <button
            onClick={handleSearchClick}
            className="p-2 hover:text-pink-600 transition-colors duration-200"
          >
            <Search size={24} />
          </button>
        ) : (
          <div className="w-full flex items-center bg-white shadow-md">
            <Search className="ml-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search gifts..."
              className="w-full px-3 py-3 md:py-2 focus:outline-none"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus
            />
            <button 
              onClick={clearSearch}
              className="p-3 md:p-2 hover:text-pink-600 transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {isExpanded && (searchResult.length > 0 || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed md:absolute left-0 md:left-auto right-0 top-12 md:top-full 
                     w-full md:w-[400px] bg-white shadow-xl overflow-hidden z-50 
                     max-h-[80vh] md:max-h-96 md:mt-2 md:rounded-lg"
          >
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                Searching...
              </div>
            ) : (
              <ul className="overflow-y-auto max-h-[calc(80vh-4rem)] md:max-h-96">
                {searchResult.map((result) => (
                  <Link 
                    to={`/${result._id}`} 
                    key={result._id}
                    onClick={clearSearch}
                  >
                    <li className="flex items-center p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0">
                      <img 
                        src={result.img} 
                        alt={result.name} 
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-light tracking-widest text-gray-800 truncate">
                          {result.name}
                        </h3>
                        <p className="text-[#be7474]">
                          {result.price}
                        </p>
                        <span className="text-xs text-gray-500">
                          {result.category}
                        </span>
                      </div>
                    </li>
                  </Link>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntegratedSearchBar;