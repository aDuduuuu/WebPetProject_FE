import React, { useState, useEffect } from 'react';
import clientApi from '../client-api/rest-client';
import { useNavigate } from 'react-router-dom';
import '../css/ProvinceFilter.css'
import { useTranslation } from 'react-i18next';

const ProvinceFilter = ({ onFilter, type }) => {
  const navigate = useNavigate();

  const provinces = [
    'An Giang', 'Ba Ria - Vung Tau', 'Bac Lieu', 'Bac Giang', 'Bac Kan',
    'Bac Ninh', 'Ben Tre', 'Binh Duong', 'Binh Dinh', 'Binh Phuoc',
    'Binh Thuan', 'Ca Mau', 'Cao Bang', 'Can Tho', 'Da Nang', 'Dak Lak',
    'Dak Nong', 'Dien Bien', 'Dong Nai', 'Dong Thap', 'Gia Lai', 'Ha Giang',
    'Ha Nam', 'Ha Noi', 'Ha Tinh', 'Hai Duong', 'Hai Phong', 'Hau Giang',
    'Hoa Binh', 'Hung Yen', 'Khanh Hoa', 'Kien Giang', 'Kon Tum', 'Lai Chau',
    'Lam Dong', 'Lang Son', 'Lao Cai', 'Long An', 'Nam Dinh', 'Nghe An',
    'Ninh Binh', 'Ninh Thuan', 'Phu Tho', 'Phu Yen', 'Quang Binh', 'Quang Nam',
    'Quang Ngai', 'Quang Ninh', 'Quang Tri', 'Soc Trang', 'Son La', 'Tay Ninh',
    'Thai Binh', 'Thai Nguyen', 'Thanh Hoa', 'Thua Thien Hue', 'Tien Giang',
    'TP Ho Chi Minh', 'Tra Vinh', 'Tuyen Quang', 'Vinh Long', 'Vinh Phuc',
    'Yen Bai',
  ];

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState([]);
  const [userRole, setUserRole] = useState(null); // State để lưu role
  const [visibleCount, setVisibleCount] = useState(6);
  const { t } = useTranslation();

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      if (type === 'spa' || type === 'trainer') {
        const serviceApi = clientApi.service(`filters/${type}s`);
        const result = await serviceApi.find();
        if (result && result.EC === 0) {
          setItems(result.DT || []);
        } else {
          console.error('Error fetching services:', result.EM);
        }
      } else if (type === 'dogsellers') {
        const breedApi = clientApi.service('filters/dogsellers');
        const result = await breedApi.find();
        if (result && result.EC === 0) {
          const breedIds = result.DT || [];
          const breedNames = await Promise.all(
            breedIds.map(async (id) => {
              if (!id) return null;
              try {
                const breedApi = clientApi.service(`dogbreeds`);
                const breedResult = await breedApi.get(id);
                return { id, name: breedResult?.DT?.name || 'Unknown' };
              } catch (error) {
                console.error(`Error fetching breed with id ${id}:`, error);
                return null;
              }
            })
          );
          setItems(breedNames.filter(Boolean));
        } else {
          console.error('Error fetching breeds:', result.EM);
        }
      } else {
        setItems([]);
      }
    };

    fetchItems();
  }, [type]);

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 6); // Tăng thêm 6 mỗi lần
  };

  const handleItemChange = (value) => {
    setSelectedItems((prevItems) => {
      if (prevItems.includes(value)) {
        return prevItems.filter((item) => item !== value);
      } else {
        return [...prevItems, value];
      }
    });
  };

  const handleFilterClick = () => {
    if (type === 'spa' || type === 'trainer') {
      onFilter({ province: selectedProvince, services: selectedItems });
    } else if (type === 'dogsellers') {
      onFilter({ province: selectedProvince, breeds: selectedItems });
    } else {
      onFilter({ province: selectedProvince });
    }
  };

  const handleResetClick = () => {
    setSelectedProvince('');
    setSelectedItems([]);
    onFilter({ province: '', ...(type === 'spa' || type === 'trainer' ? { services: [] } : { breeds: [] }) });
  };

  const handleAddSpa = () => {
    navigate('/spas/add');
  };

  const handleAddTrainer = () => {
    navigate('/trainers/add');
  };

  const handleAddSeller = () => {
    navigate('/dogsellers/add');
  };

  return (
    <div className="filter-group mb-6">
      <h4 className="text-sm font-semibold text-gray-600 mb-2">{t('provinceFilter.selectProvince')}</h4>
      <select
        className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
        value={selectedProvince}
        onChange={handleProvinceChange}
      >
        <option value="">{t('provinceFilter.allProvinces')}</option>
        {provinces.map((province) => (
          <option key={province} value={province}>
            {t(`provinceFilter.provinces.${province}`)}
          </option>
        ))}
      </select>

      {(type === 'spa' || type === 'trainer') && (
        <>
          <h4 className="text-sm font-semibold text-gray-600 mt-4 mb-2">{t('provinceFilter.selectServices')}</h4>
          <div className="grid grid-cols-1 gap-4 justify-start">
            {items.map((service) => (
              <label key={service} className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  value={service}
                  checked={selectedItems.includes(service)}
                  onChange={() => handleItemChange(service)}
                  className="custom-checkbox mr-2"
                />
                {t(`services.${service}`, service)}
              </label>
            ))}
          </div>
        </>
      )}

      {type === 'dogsellers' && (
        <>
          <h4 className="text-sm font-semibold text-gray-600 mt-4 mb-2">{t('provinceFilter.selectBreeds')}</h4>
          <div className="grid grid-cols-1 gap-4 justify-start">
            {items.slice(0, visibleCount).map((breed) => (
              <label key={breed.id} className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  value={breed.id}
                  checked={selectedItems.includes(breed.id)}
                  onChange={() => handleItemChange(breed.id)}
                  className="custom-checkbox mr-2"
                />
                {breed.name}
              </label>
            ))}
          </div>
          {visibleCount < items.length && (
            <div
              onClick={handleLoadMore}
              className="cursor-pointer mt-4 text-teal-500 flex items-center gap-1 hover:underline"
            >
              <span>{t('provinceFilter.more')}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          )}
        </>
      )}

      {/* Thêm khoảng cách ở đây */}
      <div className="flex mt-6 mb-4 gap-2">
        <button
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 w-full"
          onClick={handleFilterClick}
        >
          {t('provinceFilter.filter')}
        </button>
        <button
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 w-full"
          onClick={handleResetClick}
        >
          {t('provinceFilter.reset')}
        </button>
      </div>

      {userRole === 'manager' && (
        <div className="flex mb-4 gap-2">
          {type === 'spa' && (
            <button
              className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 w-full"
              onClick={handleAddSpa}
            >
              {t('provinceFilter.addSpa')}
            </button>
          )}
          {type === 'trainer' && (
            <button
              className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 w-full"
              onClick={handleAddTrainer}
            >
              {t('provinceFilter.addTrainer')}
            </button>
          )}
          {type === 'dogsellers' && (
            <button
              className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 w-full"
              onClick={handleAddSeller}
            >
              {t('provinceFilter.addSeller')}
            </button>
          )}
        </div>
      )}
    </div>
  );


};

export default ProvinceFilter;