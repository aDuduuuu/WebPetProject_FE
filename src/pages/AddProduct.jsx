import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import clientApi from '../client-api/rest-client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { message, Progress } from 'antd';  // Thêm các thành phần của antd để xử lý thông báo và thanh tiến trình
import { uploadToCloudinary } from '../utils/uploadToCloudinary';  // Import hàm uploadToCloudinary
import "../css/NumberType.css"
const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for product information
  const [productInfo, setProductInfo] = useState({
    name: '',
    productCode: '',
    image: 'https://via.placeholder.com/150?text=Not+Available', // Đặt ảnh mặc định
    productType: '',
    price: '',
    quantity: '',
    description: '',
  });

  const [isUpdate, setIsUpdate] = useState(false); // Determine if this is an update
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);  // Tiến trình tải ảnh
  const [uploading, setUploading] = useState(false); // Trạng thái tải ảnh

  // Available product types
  const productTypes = ['Food', 'Accessory', 'Clothes', 'Toy', 'Human Clothes', 'Human Accessory'];

  // Populate fields if editing an existing product
  useEffect(() => {
    if (location.state?.action === 'update' && location.state?.type === 'products') {
      setProductInfo({
        name: location.state.name || '',
        productCode: location.state.productCode || '',
        image: location.state.image || 'https://via.placeholder.com/150?text=Not+Available',
        productType: location.state.productType || '',
        price: location.state.price || '',
        quantity: location.state.quantity || '',
        description: location.state.description || '',
        id: location.state.id, // Save the product ID for updates
      });
      setIsUpdate(true); // Set to update mode
    }
  }, [location.state]);

  // Handle changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'price' || name === 'quantity') && value < 0) {
      return;  // Prevent negative values for price and quantity
    }
    setProductInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      setProductInfo((prevState) => ({
        ...prevState,
        image: 'https://via.placeholder.com/150?text=Not+Available',  // Nếu không có ảnh chọn, sử dụng ảnh mặc định
      }));
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload the image to Cloudinary
      const url = await uploadToCloudinary(file, 'products', (progress) => {
        setUploadProgress(progress);
      });

      setProductInfo((prevState) => ({
        ...prevState,
        image: url, // Update the image URL in the state
      }));
      message.success('Image uploaded successfully!');
    } catch (error) {
      setProductInfo((prevState) => ({
        ...prevState,
        image: 'https://via.placeholder.com/150?text=Not+Available', // Use default image if upload fails
      }));
      message.error('Error uploading image.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const productService = clientApi.service('products');
      if (isUpdate) {
        // Update existing product
        await productService.patch(productInfo.id, productInfo);
        message.success('Product updated successfully!');
      } else {
        // Create new product
        await productService.create(productInfo);
        message.success('Product added successfully!');
      }
      navigate('/products'); // Redirect to the product list
    } catch (err) {
      console.error('Error saving product:', err);
      setError('An error occurred while saving the product.');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <div className="product-container flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
        <h1 className="text-3xl font-semibold text-teal-700 mb-6">
          {isUpdate ? 'Update Product' : 'Add New Product'}
        </h1>

        {error && <div className="text-red-500 text-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-lg font-medium text-teal-500 mb-2">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={productInfo.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Product Code */}
          {!isUpdate && (
            <div>
              <label htmlFor="productCode" className="block text-lg font-medium text-teal-500 mb-2">
                Product Code
              </label>
              <input
                type="text"
                id="productCode"
                name="productCode"
                value={productInfo.productCode}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          )}

          {/* Image */}
          <div>
            <label htmlFor="image" className="block text-lg font-medium text-teal-500 mb-2">
              Product Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageUpload}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
              accept="image/*"
            />
            {uploading && (
              <div className="w-full mt-4">
                <Progress percent={uploadProgress} status="active" />
              </div>
            )}
            <div className="mt-4">
              <img
                src={productInfo.image || 'https://via.placeholder.com/150?text=Not+Available'}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Product Type */}
          <div>
            <label htmlFor="productType" className="block text-lg font-medium text-teal-500 mb-2">
              Product Type
            </label>
            <select
              id="productType"
              name="productType"
              value={productInfo.productType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Select Product Type</option>
              {productTypes.map((productType,index) => (
                <option key={index} value={productType}>
                  {productType}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-lg font-medium text-teal-500 mb-2">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={productInfo.price}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
              min="0"
            />
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-lg font-medium text-teal-500 mb-2">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={productInfo.quantity}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
              min="0"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-lg font-medium text-teal-500 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={productInfo.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="p-3 bg-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-3 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 transition ${loading || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading || uploading}
            >
              {isUpdate ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );

};

export default AddProduct;
