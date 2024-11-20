import React, { useState, useEffect } from 'react';
import clientApi from '../client-api/rest-client';

const ProvinceFilter = ({ onFilter, type }) => {
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
    'Yen Bai'
  ];

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch services or breeds based on type
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
              if (!id) return null; // Kiểm tra id hợp lệ
              try {
                const breedApi = clientApi.service(`dogbreeds`);
                const breedResult = await breedApi.get(id); // Lấy thông tin giống chó dựa trên ID
                return { id, name: breedResult?.DT?.name || 'Unknown' };
              } catch (error) {
                console.error(`Error fetching breed with id ${id}:`, error);
                return null; // Xử lý lỗi cho từng ID
              }
            })
          );
          setItems(breedNames.filter(Boolean)); // Lọc các giá trị null
        } else {
          console.error('Error fetching breeds:', result.EM);
        }
      } else {
        setItems([]); // Clear items for unsupported types
      }
    };

    fetchItems();
  }, [type]);

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
  };

  const handleItemChange = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleFilterClick = () => {
    if (type === 'spa' || type === 'trainer') {
      onFilter({ province: selectedProvince, services: selectedItems });
    } else if (type === 'dogsellers') {
      onFilter({ province: selectedProvince, breeds: selectedItems });
    } else {
      onFilter({ province: selectedProvince }); // Default case
    }
  };

  const handleResetClick = () => {
    setSelectedProvince('');
    setSelectedItems([]);
    onFilter({ province: '', ...(type === 'spa' || type === 'trainer' ? { services: [] } : { breeds: [] }) });
  };

  return (
    <div className="filter-group mb-6">
      <h4 className="text-sm font-semibold text-gray-600 mb-2">Select Province</h4>
      <select
        className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
        value={selectedProvince}
        onChange={handleProvinceChange}
      >
        <option value="">All Province</option>
        {provinces.map((province) => (
          <option key={province} value={province}>
            {province}
          </option>
        ))}
      </select>

      {(type === 'spa' || type === 'trainer') && (
        <>
          <h4 className="text-sm font-semibold text-gray-600 mt-4 mb-2">Select Services</h4>
          <div className="grid grid-cols-2 gap-2">
            {items.map((service) => (
              <label key={service} className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  value={service}
                  checked={selectedItems.includes(service)}
                  onChange={() => handleItemChange(service)}
                  className="mr-2"
                />
                {service}
              </label>
            ))}
          </div>
        </>
      )}

      {type === 'dogsellers' && (
        <>
          <h4 className="text-sm font-semibold text-gray-600 mt-4 mb-2">Select Breeds</h4>
          <div className="grid grid-cols-2 gap-2">
            {items.map((breed) => (
              <label key={breed.id} className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  value={breed.id}
                  checked={selectedItems.includes(breed.id)}
                  onChange={() => handleItemChange(breed.id)}
                  className="mr-2"
                />
                {breed.name}
              </label>
            ))}
          </div>
        </>
      )}

      <div className="flex mt-4">
        <button
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 mr-2"
          onClick={handleFilterClick}
        >
          Filter
        </button>
        <button
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          onClick={handleResetClick}
        >
          <i className="fas fa-sync-alt mr-2"></i> Reset
        </button>
      </div>
    </div>
  );
};

export default ProvinceFilter;
