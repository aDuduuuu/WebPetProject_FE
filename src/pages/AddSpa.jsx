import React, { useState } from 'react';
import clientApi from '../client-api/rest-client'; // Import clientApi
import { useNavigate } from "react-router-dom";
import Header from '../components/Header';

const AddSpa = () => {
  // Trạng thái để lưu trữ giá trị của các trường nhập liệu
  const [spaInfo, setSpaInfo] = useState({
    name: '',
    image: '',
    location: {
      province: '',
      district: '',
      ward: '',
      street: ''
    },
    services: [''], // Mảng dịch vụ, bắt đầu với 1 ô input
    contactInfo: {
      phone: '',
      email: ''
    }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Danh sách các tỉnh thành Việt Nam
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

  // Hàm xử lý thay đổi trong các trường nhập liệu
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'service') {
      const updatedServices = [...spaInfo.services];
      updatedServices[index] = value;
      setSpaInfo({ ...spaInfo, services: updatedServices });
    } else if (name.startsWith('location')) {
      const locationField = name.split('.')[1]; // Lấy phần sau dấu '.'
      setSpaInfo((prevState) => ({
        ...prevState,
        location: {
          ...prevState.location,
          [locationField]: value
        }
      }));
    } else if (name.startsWith('contactInfo')) {
      const contactField = name.split('.')[1]; // Lấy phần sau dấu '.'
      setSpaInfo((prevState) => ({
        ...prevState,
        contactInfo: {
          ...prevState.contactInfo,
          [contactField]: value
        }
      }));
    } else {
      setSpaInfo((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  // Hàm thêm một ô input dịch vụ mới
  const handleAddService = () => {
    setSpaInfo((prevState) => ({
      ...prevState,
      services: [...prevState.services, ''] // Thêm ô input trống
    }));
  };

  // Hàm gửi dữ liệu tới backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sử dụng clientApi để gọi API tạo mới spa
      const response = await clientApi.service('spas').create(spaInfo);

      if (response.EC === 0) {
        alert('Spa added successfully!');
        setSpaInfo({
          name: '',
          image: '',
          location: { province: '', district: '', ward: '', street: '' },
          services: [''], // Reset lại mảng dịch vụ
          contactInfo: { phone: '', email: '' }
        });
      } else {
        setError(response.EM);
      }
    } catch (err) {
      console.error('Error adding spa:', err);
      setError('An error occurred while adding the spa.');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    navigate("/spas");
  };

  const buttonColor = '#00b3b3'; // Màu sắc cho các nút
  const inputBorderColor = '#16423C'; // Màu cho viền của các trường nhập liệu
  const labelColor = '#16423C'; // Màu cho tên các mục như "Spa Name", "Location", v.v.

  return (
    <div className="spa-container flex flex-col min-h-screen bg-gray-100">
      <Header /> {/* Thêm Header vào đây */}
    <div className="container mx-auto p-6">
    
      <h1 className="text-2xl font-bold mb-4" style={{ color: labelColor }}>Add New Spa</h1>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block font-bold" style={{ color: labelColor }}>Spa Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={spaInfo.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            style={{ borderColor: inputBorderColor }}
            required
          />
        </div>

        {/* Image */}
        <div>
          <label htmlFor="image" className="block font-bold" style={{ color: labelColor }}>Image URL</label>
          <input
            type="text"
            id="image"
            name="image"
            value={spaInfo.image}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            style={{ borderColor: inputBorderColor }}
          />
        </div>

        {/* Location */}
        <div>
          <label className="block font-bold" style={{ color: labelColor }}>Location</label>
          
          {/* Province (dropdown) */}
          <select
            name="location.province"
            value={spaInfo.location.province}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            style={{ borderColor: inputBorderColor }}
            required
          >
            <option value="">Select Province</option>
            {provinces.map((province) => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>

          {/* District */}
          <input
            type="text"
            name="location.district"
            value={spaInfo.location.district}
            onChange={handleChange}
            placeholder="District"
            className="w-full p-2 border rounded mb-2"
            style={{ borderColor: inputBorderColor }}
            required
          />
          {/* Ward */}
          <input
            type="text"
            name="location.ward"
            value={spaInfo.location.ward}
            onChange={handleChange}
            placeholder="Ward"
            className="w-full p-2 border rounded mb-2"
            style={{ borderColor: inputBorderColor }}
          />
          {/* Street */}
          <input
            type="text"
            name="location.street"
            value={spaInfo.location.street}
            onChange={handleChange}
            placeholder="Street"
            className="w-full p-2 border rounded mb-2"
            style={{ borderColor: inputBorderColor }}
          />
        </div>

        {/* Services */}
        <div>
          <label htmlFor="services" className="block font-bold" style={{ color: labelColor }}>Services</label>
          {spaInfo.services.map((service, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                name="service"
                value={service}
                onChange={(e) => handleChange(e, index)}
                placeholder="Service"
                className="w-full p-2 border rounded mr-2"
                style={{ borderColor: inputBorderColor }}
              />
              {/* Button thêm dịch vụ */}
              {index === spaInfo.services.length - 1 && (
                <button
                  type="button"
                  onClick={handleAddService}
                  className="p-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                >
                  +
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div>
          <label htmlFor="phone" className="block font-bold" style={{ color: labelColor }}>Phone</label>
          <input
            type="text"
            id="phone"
            name="contactInfo.phone"
            value={spaInfo.contactInfo.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            style={{ borderColor: inputBorderColor }}
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-bold" style={{ color: labelColor }}>Email</label>
          <input
            type="email"
            id="email"
            name="contactInfo.email"
            value={spaInfo.contactInfo.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            style={{ borderColor: inputBorderColor }}
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
            {loading ? 'Adding...' : 'Add Spa'}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default AddSpa;
