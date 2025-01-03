import React, { useState } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
// import { Alert, AlertDescription } from '@/components/ui/alert';

const AddProductDialog = ({ isOpen, onClose, onSubmit }) => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    images: [],
    category: '',
    rating: 0,
    productId: '',
    inStockValue: 0,
    soldStockValue: 0,
    specifications: [],
    variants: []
  });
  const [currentImagePreview, setCurrentImagePreview] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const categories = [
    'Electronics', 'Clothing', 'Home & Garden', 'Beauty',
    'Sports', 'Books', 'Toys', 'Others'
  ];

  const generateProductId = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `PRD-${timestamp}-${random}`;
  };

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setCurrentImagePreview(reader.result);
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result
        // const response = await cloudinary.uploader.upload(base64)
        // console.log(response)
      }
    }
  };

  const addImage = () => {
    if (currentImagePreview && productData.images.length < 5) {
      setProductData({
        ...productData,
        images: [...productData.images, currentImagePreview]
      });
      setCurrentImagePreview('');
    }
  };

  const removeImage = (index) => {
    setProductData({
      ...productData,
      images: productData.images.filter((_, i) => i !== index)
    });
  };

  const addSpecification = () => {
    setProductData({
      ...productData,
      specifications: [...productData.specifications, { key: '', value: '' }]
    });
  };

  const handleSubmit = () => {
    if (!productData.name || !productData.price || productData.images.length === 0) {
      setErrorMessage('Please fill in all required fields and add at least one image');
      return;
    }
    onSubmit({
      ...productData,
      productId: generateProductId()
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                value={productData.name}
                onChange={(e) => setProductData({...productData, name: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={productData.description}
                onChange={(e) => setProductData({...productData, description: e.target.value})}
                className="w-full p-2 border rounded-lg h-32 focus:ring-2 focus:ring-pink-500"
                placeholder="Detailed product description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  value={productData.price}
                  onChange={(e) => setProductData({...productData, price: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={productData.category}
                  onChange={(e) => setProductData({...productData, category: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  In Stock
                </label>
                <input
                  type="number"
                  value={productData.inStockValue}
                  onChange={(e) => setProductData({...productData, inStockValue: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Rating
                </label>
                <input
                  type="number"
                  value={productData.rating}
                  onChange={(e) => setProductData({...productData, rating: parseFloat(e.target.value)})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Images & Specifications */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Images * (Max 5)
              </label>
              <div className="border-2 border-dashed rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {productData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {productData.images.length < 5 && (
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      onChange={handleImagePreview}
                      accept="image/*"
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-pink-500"
                    >
                      <Upload className="h-6 w-6 text-gray-400" />
                    </label>
                    {currentImagePreview && (
                      <button
                        onClick={addImage}
                        className="bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specifications
              </label>
              {productData.specifications.map((spec, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Key"
                    value={spec.key}
                    onChange={(e) => {
                      const newSpecs = [...productData.specifications];
                      newSpecs[index].key = e.target.value;
                      setProductData({...productData, specifications: newSpecs});
                    }}
                    className="w-1/2 p-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={spec.value}
                    onChange={(e) => {
                      const newSpecs = [...productData.specifications];
                      newSpecs[index].value = e.target.value;
                      setProductData({...productData, specifications: newSpecs});
                    }}
                    className="w-1/2 p-2 border rounded-lg"
                  />
                </div>
              ))}
              <button
                onClick={addSpecification}
                className="w-full mt-2 p-2 border border-pink-500 text-pink-500 rounded-lg hover:bg-pink-50"
              >
                Add Specification
              </button>
            </div>
          </div>
        </div>

        {/* {errorMessage && (
          <Alert className="mx-6 mb-4" variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )} */}

        <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductDialog;