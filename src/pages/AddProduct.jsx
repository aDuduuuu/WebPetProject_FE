import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import clientApi from '../client-api/rest-client';
import Header from '../components/Header';

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for product information
  const [productInfo, setProductInfo] = useState({
    name: '',
    productCode: '',
    image: '',
    productType: '',
    price: '',
    quantity: '',
    description: '',
  });

  const [isUpdate, setIsUpdate] = useState(false); // Determine if this is an update
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Available product types
  const productTypes = ['Food', 'Accessory', 'Clothes', 'Toy', 'Human Clothes', 'Human Accessory'];

  // Populate fields if editing an existing product
  useEffect(() => {
    if (location.state?.action === 'update' && location.state?.type === 'products') {
      setProductInfo({
        name: location.state.name || '',
        productCode: location.state.productCode || '',
        image: location.state.image || '',
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
    setProductInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
        alert('Product updated successfully!');
      } else {
        // Create new product
        await productService.create(productInfo);
        alert('Product added successfully!');
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
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">{isUpdate ? 'Update Product' : 'Add New Product'}</h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block font-bold">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={productInfo.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Product Code */}
          <div>
            <label htmlFor="productCode" className="block font-bold">Product Code</label>
            <input
              type="text"
              id="productCode"
              name="productCode"
              value={productInfo.productCode}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              disabled={isUpdate} // Disable editing Product Code in update mode
            />
          </div>

          {/* Image */}
          <div>
            <label htmlFor="image" className="block font-bold">Image URL</label>
            <input
              type="text"
              id="image"
              name="image"
              value={productInfo.image}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {productInfo.image && (
              <img src={productInfo.image} alt="Preview" className="mt-2 w-40 h-40 object-cover rounded" />
            )}
          </div>

          {/* Product Type */}
          <div>
            <label htmlFor="productType" className="block font-bold">Product Type</label>
            <select
              id="productType"
              name="productType"
              value={productInfo.productType}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Product Type</option>
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block font-bold">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={productInfo.price}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block font-bold">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={productInfo.quantity}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-bold">Description</label>
            <textarea
              id="description"
              name="description"
              value={productInfo.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-white border border-teal-500 text-teal-500 rounded hover:bg-teal-500 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Saving...' : isUpdate ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
