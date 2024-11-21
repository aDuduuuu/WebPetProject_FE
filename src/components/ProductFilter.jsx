import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductFilter = ({ onFilter }) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [selectedProductType, setSelectedProductType] = useState('');
  const [openMenu, setOpenMenu] = useState({ dog: false, you: false }); // Manage menu toggle
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    setIsManager(role === 'manager'); // Kiểm tra role có phải manager hay không
  }, []);

  const navigate = useNavigate(); // To handle navigation for Add Product

  const handleToggleMenu = (menu) => {
    setOpenMenu((prev) => ({ ...prev, [menu]: !prev[menu] })); // Toggle menu
  };

  const handleProductTypeClick = (type) => {
    setSelectedProductType(type);
    onFilter({ Type: type, minPrice, maxPrice, sortBy });
  };

  const handleFilterClick = () => {
    onFilter({ Type: selectedProductType, minPrice, maxPrice, sortBy });
  };

  const handleResetClick = () => {
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
    setSelectedProductType('');
    setOpenMenu({ dog: false, you: false }); // Reset menu state
    onFilter({ Type: '', minPrice: '', maxPrice: '', sortBy: '' });
  };

  const handleAddProductClick = () => {
    navigate('/products/add'); // Redirect to Add Product page
  };

  return (
    <div className="filter-group mb-6">
      {/* Product Type */}
      <h4 className="text-sm font-semibold text-gray-600 mb-4">Product Type</h4>
      <div className="flex flex-col space-y-2 mb-4">
        <div>
          <button
            onClick={() => handleToggleMenu('dog')}
            className="w-full text-left p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            For Your Dog
          </button>
          {openMenu.dog && (
            <div className="ml-4 mt-2 space-y-2">
              <button
                onClick={() => handleProductTypeClick('Food')}
                className={`w-full text-left p-2 rounded-md ${
                  selectedProductType === 'Food' ? 'bg-teal-500 text-white' : 'text-gray-700'
                }`}
              >
                Food
              </button>
              <button
                onClick={() => handleProductTypeClick('Accessory')}
                className={`w-full text-left p-2 rounded-md ${
                  selectedProductType === 'Accessory' ? 'bg-teal-500 text-white' : 'text-gray-700'
                }`}
              >
                Accessory
              </button>
              <button
                onClick={() => handleProductTypeClick('Clothes')}
                className={`w-full text-left p-2 rounded-md ${
                  selectedProductType === 'Clothes' ? 'bg-teal-500 text-white' : 'text-gray-700'
                }`}
              >
                Clothes
              </button>
              <button
                onClick={() => handleProductTypeClick('Toy')}
                className={`w-full text-left p-2 rounded-md ${
                  selectedProductType === 'Toy' ? 'bg-teal-500 text-white' : 'text-gray-700'
                }`}
              >
                Toy
              </button>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => handleToggleMenu('you')}
            className="w-full text-left p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            For You
          </button>
          {openMenu.you && (
            <div className="ml-4 mt-2 space-y-2">
              <button
                onClick={() => handleProductTypeClick('Human Clothes')}
                className={`w-full text-left p-2 rounded-md ${
                  selectedProductType === 'Human Clothes' ? 'bg-teal-500 text-white' : 'text-gray-700'
                }`}
              >
                Human Clothes
              </button>
              <button
                onClick={() => handleProductTypeClick('Human Accessory')}
                className={`w-full text-left p-2 rounded-md ${
                  selectedProductType === 'Human Accessory' ? 'bg-teal-500 text-white' : 'text-gray-700'
                }`}
              >
                Human Accessory
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Price Range */}
      <h4 className="text-sm font-semibold text-gray-600 mb-4">Price Range</h4>
      <div className="flex space-x-2 mb-4">
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-1/2 p-2 border border-gray-300 rounded-md"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-1/2 p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Sort Options */}
      <h4 className="text-sm font-semibold text-gray-600 mb-4">Sort Options</h4>
      <div className="flex flex-col space-y-2 mb-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">None</option>
          <option value="aprice">Price: Low to High</option>
          <option value="dprice">Price: High to Low</option>
          <option value="time">Time: Newest</option>
          <option value="otime">Time: Oldest</option>
        </select>
      </div>

      {/* Filter and Reset Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 w-full"
          onClick={handleFilterClick}
        >
          Filter
        </button>
        <button
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 w-full"
          onClick={handleResetClick}
        >
          Reset
        </button>
      </div>
    
      {/* Add Product Button */}
      {isManager && (

      <div className="flex mb-4">
        <button
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 w-full"
          onClick={handleAddProductClick}
        >
          Add Product
        </button>
      </div>
      )}
    </div>
  );
};

export default ProductFilter;
