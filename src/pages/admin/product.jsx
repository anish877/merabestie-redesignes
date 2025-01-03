import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/sidebar';
import { Pencil, Save, Search, ArrowUpDown, X } from 'lucide-react';
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from 'react-router-dom';

const Product = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editValues, setEditValues] = useState({
    name: '',
    category: '',
    price: '',
    inStockValue: '',
    soldStockValue: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  useEffect(() => {
    const verifySeller = async () => {
      if (!sellerId) {
        navigate('/seller/login');
        return;
      }

      try {
        const response = await fetch('https://merabestie-backend.onrender.com/admin/verify-seller', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sellerId })
        });

        const data = await response.json();
        
        if (data.loggedIn !== 'loggedin') {
          navigate('/seller/login');
        }
      } catch (error) {
        console.error('Error verifying seller:', error);
        navigate('/seller/login');
      }
    };

    verifySeller();
  }, [sellerId, navigate]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://merabestie-backend.onrender.com/get-product');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.productId);
    setEditValues({
      name: product.name || '',
      category: product.category || '',
      price: product.price || 0,
      inStockValue: product.inStockValue || 0,
      soldStockValue: product.soldStockValue || 0
    });
  };

  const handleSave = async (productId) => {
    try {
      const response = await fetch('https://merabestie-backend.onrender.com/instock-update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          name: editValues.name || '',
          category: editValues.category || '',
          price: editValues.price || 0,
          inStockValue: editValues.inStockValue || 0,
          soldStockValue: editValues.soldStockValue || 0
        })
      });

      if (response.ok) {
        setEditingId(null);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error updating stock values:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const closeDetailView = () => {
    setSelectedProduct(null);
  };

  const sortedProducts = React.useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    let sortableProducts = [...products];
    if (sortConfig.key !== null) {
      sortableProducts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableProducts;
  }, [products, sortConfig]);

  const filteredProducts = sortedProducts.filter(product => 
    product.productId?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditInModal = () => {
    if (selectedProduct) {
      handleEdit(selectedProduct);
    }
  };

  const handleSaveInModal = () => {
    if (selectedProduct) {
      handleSave(selectedProduct.productId);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="flex">
      <Helmet>
        <title>Products | Admin | Mera Bestie</title>
      </Helmet>
      <Sidebar />
      <div className="flex-1 p-8 ml-[5rem] lg:ml-64 bg-pink-50 min-h-screen">
        <div className="mb-6 flex justify-between items-center">
          <div className="relative">
            <div className={`flex items-center ${isSearchExpanded ? 'w-full md:w-64' : 'w-10 md:w-64'} transition-all duration-300`}>
              <button 
                className="md:hidden absolute left-2 z-10"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              >
                <Search size={20} />
              </button>
              <input
                type="text"
                placeholder="Search by product ID or name..."
                className={`pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                  isSearchExpanded ? 'w-full opacity-100' : 'w-0 md:w-full opacity-0 md:opacity-100'
                } transition-all duration-300`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-pink-100">
              <tr>
                <th onClick={() => handleSort('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    Product
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th onClick={() => handleSort('category')} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    Category
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th onClick={() => handleSort('price')} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    Price
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th onClick={() => handleSort('inStockValue')} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    In Stock
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th onClick={() => handleSort('soldStockValue')} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    Sold
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr 
                  key={product.productId}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.price || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.inStockValue || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.soldStockValue || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product);
                        handleEditInModal();
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Pencil size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingId === selectedProduct.productId ? 'Edit Product' : 'Product Details'}
                  </h2>
                  <button
                    onClick={closeDetailView}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-gray-100 rounded-lg p-2">
                      <img
                        src={selectedProduct.img || "/api/placeholder/400/400"}
                        alt={selectedProduct.name}
                        className="w-full h-80 object-cover rounded-lg shadow-md"
                      />
                    </div>
                    
                    {editingId !== selectedProduct.productId && (
                      <div className="bg-pink-50 p-6 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-lg mb-4">Inventory Status</h3>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-gray-600 text-sm">In Stock</p>
                            <p className="text-2xl font-bold text-gray-800">{selectedProduct.inStockValue}</p>
                            <div className="mt-2 bg-green-100 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full"
                                style={{width: `${(selectedProduct.inStockValue / (selectedProduct.inStockValue + selectedProduct.soldStockValue)) * 100}%`}}
                              />
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-gray-600 text-sm">Sold</p>
                            <p className="text-2xl font-bold text-gray-800">{selectedProduct.soldStockValue}</p>
                            <div className="mt-2 bg-blue-100 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full"
                                style={{width: `${(selectedProduct.soldStockValue / (selectedProduct.inStockValue + selectedProduct.soldStockValue)) * 100}%`}}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {editingId === selectedProduct.productId ? (
                      <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                              type="text"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                              value={editValues.name}
                              onChange={(e) => setEditValues({...editValues, name: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <input
                              type="text"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                              value={editValues.category}
                              onChange={(e) => setEditValues({...editValues, category: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                              type="number"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                              value={editValues.price}
                              onChange={(e) => setEditValues({...editValues, price: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Stock</label>
                            <input
                              type="number"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                              value={editValues.inStockValue}
                              onChange={(e) => setEditValues({...editValues, inStockValue: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Sold</label>
                            <input
                              type="number"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                              value={editValues.soldStockValue}
                              onChange={(e) => setEditValues({...editValues, soldStockValue: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h3>
                        <div className="space-y-4">
                          <div className="border-b pb-4">
                            <p className="text-gray-600 text-sm">Product ID</p>
                            <p className="font-medium text-gray-800">{selectedProduct.productId}</p>
                          </div>
                          
                          <div className="border-b pb-4">
                            <p className="text-gray-600 text-sm">Category</p>
                            <p className="font-medium text-gray-800 capitalize">{selectedProduct.category}</p>
                          </div>

                          <div className="border-b pb-4">
                            <p className="text-gray-600 text-sm">Price</p>
                            <p className="text-3xl font-bold text-pink-600">₹{selectedProduct.price}</p>
                          </div>

                          <div>
                            <p className="text-gray-600 text-sm mb-2">Sales Performance</p>
                            <div className="bg-gray-100 p-4 rounded-lg">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-600">Total Value</p>
                                  <p className="text-lg font-bold text-gray-800">
                                    ₹{(selectedProduct.soldStockValue * selectedProduct.price).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">Stock Value</p>
                                  <p className="text-lg font-bold text-gray-800">
                                    ₹{(selectedProduct.inStockValue * selectedProduct.price).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {selectedProduct.description && (
                            <div className="border-t pt-4">
                              <p className="text-gray-600 text-sm mb-2">Description</p>
                              <p className="text-gray-800">{selectedProduct.description}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      {editingId === selectedProduct.productId ? (
                        <>
                          <button
                            onClick={handleSaveInModal}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full"
                          >
                            <Save size={16} />
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors w-full"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={handleEditInModal}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full"
                          >
                            <Pencil size={16} />
                            Edit Product
                          </button>
                          <button
                            onClick={closeDetailView}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors w-full"
                          >
                            Close
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;