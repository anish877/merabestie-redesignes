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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        handleClose();
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
    if (isMobile) {
      document.body.style.overflow = 'hidden';
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    setInputValue('');
    setSearchResult([]);
    if (isMobile) {
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <div ref={searchRef} className="relative flex items-center">
      {!isExpanded ? (
        <button
          onClick={handleSearchClick}
          className="p-2 hover:text-pink-600 transition-colors duration-200"
          aria-label="Open search"
        >
          <Search size={24} />
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`${
            isMobile
              ? 'fixed inset-0 bg-white z-50'
              : 'relative w-96'
          }`}
        >
          <div className={`
            flex items-center
            ${isMobile ? 'p-4 border-b border-gray-200' : 'rounded-lg shadow-md'}
          `}>
            <Search 
              className="text-gray-400 shrink-0" 
              size={20} 
            />
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-3 py-2 focus:outline-none bg-transparent"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus
            />
            <button 
              onClick={handleClose}
              className="p-2 hover:text-[#be7474] transition-colors duration-200 shrink-0"
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </div>

          <AnimatePresence>
            {(searchResult.length > 0 || isLoading) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`
                  bg-white shadow-xl overflow-hidden
                  ${isMobile 
                    ? 'fixed left-0 right-0 bottom-0 top-16 overflow-y-auto'
                    : 'absolute z-50 top-full left-0 right-0 mt-2 rounded-lg max-h-96 overflow-y-auto'}
                `}
              >
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    Searching...
                  </div>
                ) : (
                  <ul>
                    {searchResult.map((result) => (
                      <Link 
                        to={`/${result._id}`} 
                        key={result._id}
                        onClick={handleClose}
                      >
                        <li className="flex items-center p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0">
                          <img 
                            src={result.img} 
                            alt={result.name} 
                            className="w-16 h-16 object-cover rounded-md mr-4 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
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
        </motion.div>
      )}
    </div>
  );
};

export default IntegratedSearchBar;