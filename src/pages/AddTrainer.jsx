
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { message, Progress } from 'antd';  // Thêm các thành phần của antd để xử lý thông báo và thanh tiến trình
import { uploadToCloudinary } from '../utils/uploadToCloudinary';  // Import hàm uploadToCloudinary
import clientApi from '../client-api/rest-client';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AddTrainer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State cho thông tin huấn luyện viên
  const [trainerInfo, setTrainerInfo] = useState({
    name: '',
    image: 'https://via.placeholder.com/150?text=Not+Available',
    location: { province: '', district: '', ward: '', street: '' },
    services: [''],
    contactInfo: { phone: '', email: '' },
    description: '',
  });

  const [isUpdate, setIsUpdate] = useState(false); // Kiểm tra xem có phải cập nhật hay không
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // State cho tiến trình tải ảnh
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

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

  useEffect(() => {
    if (location.state?.action === 'update' && location.state?.type === 'trainers') {
      setTrainerInfo({
        name: location.state.name || '',
        image: location.state.image || 'https://via.placeholder.com/150?text=Not+Available',
        location: location.state.location || { province: '', district: '', ward: '', street: '' },
        services: location.state.services || [''],
        contactInfo: location.state.contactInfo || { phone: '', email: '' },
        description: location.state.description || '',
        id: location.state.id, // Save the trainer ID for updates
      });
      setIsUpdate(true); // Đặt trạng thái là update
    }
  }, [location.state]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    if (name.startsWith('location')) {
      const locationField = name.split('.')[1];
      setTrainerInfo((prevState) => ({
        ...prevState,
        location: {
          ...prevState.location,
          [locationField]: value,
        },
      }));
    } else if (name.startsWith('contactInfo')) {
      const contactField = name.split('.')[1];

      if (contactField === 'phone' && !/^\d+$/.test(value)) {
        message.error('Phone number must be a valid number!');
        return;
      }

      setTrainerInfo((prevState) => ({
        ...prevState,
        contactInfo: {
          ...prevState.contactInfo,
          [contactField]: value,
        },
      }));
    } else if (name.startsWith('services')) {
      const serviceIndex = parseInt(name.split('.')[1], 10);  // Lấy chỉ số dịch vụ
      const updatedServices = [...trainerInfo.services];
      updatedServices[serviceIndex] = value;  // Cập nhật dịch vụ ở chỉ số tương ứng

      if (updatedServices[serviceIndex].trim() === '') {
        message.error('Service cannot be empty!');
        return;  // Ngừng cập nhật nếu dịch vụ trống
      }

      setTrainerInfo((prevState) => ({
        ...prevState,
        services: updatedServices,
      }));
    } else if (name === 'description') {
      // Cập nhật description khi người dùng nhập vào
      setTrainerInfo((prevState) => ({
        ...prevState,
        description: value,
      }));
    } else {
      setTrainerInfo((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };



  const handleAddService = () => {
    // Kiểm tra nếu có dịch vụ trống thì không thêm
    if (trainerInfo.services.some(service => service.trim() === '')) {
      message.error('All services must be filled!');
      return;
    }

    setTrainerInfo((prevState) => ({
      ...prevState,
      services: [...prevState.services, ''],  // Thêm một dịch vụ trống
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Kiểm tra các trường location có bị bỏ trống không
    if (
      !trainerInfo.location.province.trim() ||
      !trainerInfo.location.district.trim() ||
      !trainerInfo.location.ward.trim() ||
      !trainerInfo.location.street.trim()
    ) {
      message.error('All location fields must be filled!');
      setLoading(false);
      return;  // Dừng việc gửi form nếu có trường location trống
    }

    // Kiểm tra nếu có dịch vụ trống
    if (trainerInfo.services.some(service => service.trim() === '')) {
      message.error('All services must be filled!');
      setLoading(false);
      return;  // Dừng việc gửi form nếu có dịch vụ trống
    }

    if (!trainerInfo.description.trim()) {
      message.error('Description field must be filled!');
      setLoading(false);
      return;  // Dừng việc gửi form nếu có trường location trống
    }

    // Kiểm tra nếu số điện thoại không hợp lệ
    if (!/^\d+$/.test(trainerInfo.contactInfo.phone)) {
      message.error('Phone number must be a valid number!');
      setLoading(false);
      return;  // Dừng việc gửi form nếu số điện thoại không hợp lệ
    }

    // Kiểm tra dữ liệu trainerInfo trước khi gửi
    console.log('Trainer Data to Send:', trainerInfo);

    try {
      const trainerService = clientApi.service('trainers');
      if (isUpdate) {
        await trainerService.patch(trainerInfo.id, trainerInfo);
        message.success('Trainer updated successfully!');
      } else {
        await trainerService.create(trainerInfo);  // Thêm trainer mới
        message.success('Trainer added successfully!');
      }
      navigate('/trainers');
    } catch (err) {
      console.error('Error saving trainer:', err);  // Ghi chi tiết lỗi ra console
      setError('An error occurred while saving the trainer.');
      message.error('An error occurred while saving the trainer.');
    }
    setLoading(false);
  };



  const handleCancel = () => {
    navigate('/trainers');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    // Nếu không có file được chọn, sử dụng URL mặc định
    if (!file) {
      setTrainerInfo((prevState) => ({
        ...prevState,
        image: "https://via.placeholder.com/150?text=Not+Available",
      }));
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Tải ảnh lên Cloudinary và lấy URL
      const url = await uploadToCloudinary(file, 'trainers', (progress) => {
        setUploadProgress(progress);
      });

      // Cập nhật URL ảnh vào state
      setTrainerInfo((prevState) => ({
        ...prevState,
        image: url,  // Lưu URL ảnh vào state nếu tải lên thành công
      }));
      message.success('Ảnh đã được tải lên thành công!');
    } catch (error) {
      // Nếu xảy ra lỗi trong quá trình tải lên
      setTrainerInfo((prevState) => ({
        ...prevState,
        image: "https://via.placeholder.com/150?text=Not+Available", // Dùng URL mặc định nếu lỗi
      }));
      message.error('Có lỗi xảy ra khi tải ảnh lên.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className="trainer-container flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">{isUpdate ? 'Update Trainer' : 'Add New Trainer'}</h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-bold">Trainer Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={trainerInfo.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Tải ảnh */}
          <div>
            <label htmlFor="image" className="block font-bold">Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageUpload}
              className="w-full p-2 border rounded"
              accept="image/*"
            />
            {uploading && (
              <div style={{ marginTop: '20px', width: '100%' }}>
                <Progress percent={uploadProgress} status="active" />
              </div>
            )}
            <div className="mt-2">
              <img
                src={trainerInfo.image || "https://via.placeholder.com/150?text=Not+Available"}  // Hiển thị ảnh mặc định nếu không có ảnh
                alt="Preview"
                className="w-40 h-40 object-cover rounded"
              />
            </div>
          </div>


          {/* Location */}
          <div>
            <label className="block font-bold">Location</label>
            <select
              name="location.province"
              value={trainerInfo.location.province}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2"
              required
            >
              <option value="">Select Province</option>
              {provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="location.district"
              value={trainerInfo.location.district}
              onChange={handleChange}
              placeholder="District"
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              name="location.ward"
              value={trainerInfo.location.ward}
              onChange={handleChange}
              placeholder="Ward"
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              name="location.street"
              value={trainerInfo.location.street}
              onChange={handleChange}
              placeholder="Street"
              className="w-full p-2 border rounded mb-2"
            />
          </div>

          {/* Services */}
          <div>
            <label htmlFor="services" className="block font-bold">Services</label>
            {trainerInfo.services.map((service, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  name={`services.${index}`}
                  value={service}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Service"
                  className="w-full p-2 border rounded mr-2"
                />
                {index === trainerInfo.services.length - 1 && (
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

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block font-bold">Phone</label>
            <input
              type="text"
              id="phone"
              name="contactInfo.phone"
              value={trainerInfo.contactInfo.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-bold">Email</label>
            <input
              type="email"
              id="email"
              name="contactInfo.email"
              value={trainerInfo.contactInfo.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-bold">Description</label>
            <textarea
              id="description"
              name="description"
              value={trainerInfo.description}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2"
              placeholder="Enter a description for the trainer"
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
              {loading ? 'Saving...' : isUpdate ? 'Update Trainer' : 'Add Trainer'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AddTrainer;
