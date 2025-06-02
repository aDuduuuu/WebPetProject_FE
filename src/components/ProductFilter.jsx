import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProductFilter = ({ onFilter }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [selectedProductType, setSelectedProductType] = useState('');
  const [openMenu, setOpenMenu] = useState({ dog: false, you: false });
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    setIsManager(role === 'manager');
  }, []);

  const handleToggleMenu = (menu) => {
    setOpenMenu((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleProductTypeClick = (type) => {
    setSelectedProductType(type); // ❗️Chỉ cập nhật state
  };

  const handleFilterClick = () => {
    onFilter({ productType: selectedProductType, minPrice, maxPrice, sortBy });
  };

  const handleResetClick = () => {
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
    setSelectedProductType('');
    setOpenMenu({ dog: false, you: false });
    onFilter({ productType: '', minPrice: '', maxPrice: '', sortBy: '' });
  };

  const handleAddProductClick = () => {
    navigate('/products/add');
  };

  const validatePrice = (value) => /^[0-9]*$/.test(value);

  return (
    <div className="filter-group mb-6">
      {/* Product Type */}
      <h4 className="text-sm font-semibold text-gray-600 mb-4">{t('productFilter.productType')}</h4>
      <div className="flex flex-col space-y-2 mb-4">
        <div>
          <button
            onClick={() => handleToggleMenu('dog')}
            className="w-full text-left p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {t('productFilter.forDog')}
          </button>
          {openMenu.dog && (
            <div className="ml-4 mt-2 space-y-2">
              {['Food', 'Accessory', 'Clothes', 'Toy'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleProductTypeClick(type)}
                  className={`w-full text-left p-2 rounded-md ${
                    selectedProductType === type ? 'bg-teal-500 text-white' : 'text-gray-700'
                  }`}
                >
                  {t(`productTypes.${type}`)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => handleToggleMenu('you')}
            className="w-full text-left p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {t('productFilter.forYou')}
          </button>
          {openMenu.you && (
            <div className="ml-4 mt-2 space-y-2">
              {['Human Clothes', 'Human Accessory'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleProductTypeClick(type)}
                  className={`w-full text-left p-2 rounded-md ${
                    selectedProductType === type ? 'bg-teal-500 text-white' : 'text-gray-700'
                  }`}
                >
                  {t(`productTypes.${type}`)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Price Range */}
      <h4 className="text-sm font-semibold text-gray-600 mb-4">{t('productFilter.priceRange')}</h4>
      <div className="flex space-x-2 mb-4">
        <input
          type="number"
          placeholder={t('productFilter.minPrice')}
          value={minPrice}
          onChange={(e) => {
            if (validatePrice(e.target.value)) {
              setMinPrice(e.target.value);
            }
          }}
          className="w-1/2 p-2 border border-gray-300 rounded-md"
        />
        <input
          type="number"
          placeholder={t('productFilter.maxPrice')}
          value={maxPrice}
          onChange={(e) => {
            if (validatePrice(e.target.value)) {
              setMaxPrice(e.target.value);
            }
          }}
          className="w-1/2 p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Sort Options */}
      <h4 className="text-sm font-semibold text-gray-600 mb-4">{t('productFilter.sortOptions')}</h4>
      <div className="flex flex-col space-y-2 mb-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">{t('productFilter.sort.none')}</option>
          <option value="aprice">{t('productFilter.sort.lowToHigh')}</option>
          <option value="dprice">{t('productFilter.sort.highToLow')}</option>
          <option value="time">{t('productFilter.sort.newest')}</option>
          <option value="otime">{t('productFilter.sort.oldest')}</option>
        </select>
      </div>

      {/* Filter and Reset Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 w-full"
          onClick={handleFilterClick}
        >
          {t('actions.filter')}
        </button>
        <button
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 w-full"
          onClick={handleResetClick}
        >
          {t('actions.reset')}
        </button>
      </div>

      {/* Add Product Button */}
      {isManager && (
        <div className="flex mb-4">
          <button
            className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 w-full"
            onClick={handleAddProductClick}
          >
            {t('actions.addProduct')}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;
