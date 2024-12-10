import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import clientApi from '../client-api/rest-client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';  // Import hàm uploadToCloudinary
import { message, Progress } from 'antd';  // Thêm các thành phần của antd để xử lý thông báo và thanh tiến trình
import { text } from '@fortawesome/fontawesome-svg-core';

const AddDogSeller = () => {
  const [dogSellerInfo, setDogSellerInfo] = useState({
    sellerID: '',
    name: '',
    image: '',
    location: '',
    breeds: [''],
    contactInfo: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [breedsList, setBreedsList] = useState([]);
  const [locations] = useState([
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
  ]);

  const navigate = useNavigate();
  const location = useLocation();
  const isUpdate = location.state?.action === 'update';
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);


  // Load initial data if updating
  useEffect(() => {
    if (isUpdate && location.state?.data) {
      setDogSellerInfo(location.state.data);
    }
  }, [isUpdate, location.state]);

  // Fetch breed list
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const breedApi = clientApi.service('dogbreeds');
        const result = await breedApi.find();
        if (result.EC === 0) {
          setBreedsList(result.DT);
        } else {
          setError('Failed to fetch dog breeds');
        }
      } catch (err) {
        setError('Error fetching dog breeds');
      }
    };
    fetchBreeds();
  }, []);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'breeds') {
      const updatedBreeds = [...dogSellerInfo.breeds];
      updatedBreeds[index] = value;
      setDogSellerInfo({ ...dogSellerInfo, breeds: updatedBreeds });
    } else {
      setDogSellerInfo({ ...dogSellerInfo, [name]: value });
    }
  };

  const handleAddBreed = () => {
    setDogSellerInfo((prevState) => ({
      ...prevState,
      breeds: [...prevState.breeds, ''],
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setDogSellerInfo((prevState) => ({
        ...prevState,
        image: "https://via.placeholder.com/150?text=Not+Available",  // Sử dụng ảnh mặc định nếu không có file
      }));
      return;
    }
  
    setUploading(true);
    setUploadProgress(0);
  
    try {
      const url = await uploadToCloudinary(file, 'spas', (progress) => {
        setUploadProgress(progress);
      });
      
      setDogSellerInfo((prevState) => ({
        ...prevState,
        image: url,
      }));
      message.success('Image uploaded successfully!');
    } catch (error) {
      setDogSellerInfo((prevState) => ({
        ...prevState,
        image: "https://via.placeholder.com/150?text=Not+Available",  // Nếu lỗi, sử dụng ảnh mặc định
      }));
      message.error('Error uploading image.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dogSellerService = clientApi.service('dogsellers');
      if (isUpdate) {
        await dogSellerService.patch(dogSellerInfo._id, dogSellerInfo);
        message.success('Dog seller updated successfully!');
      } else {
        console.log(dogSellerInfo);
        await dogSellerService.create(dogSellerInfo);
        message.success('Dog seller added successfully!');
      }
      navigate('/dogsellers');
    } catch (err) {
      setError(err.response?.data?.EM || 'An unexpected error occurred');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    navigate('/dogsellers');
  };

  return (
    <div className="dog-seller-container flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
        <h1 className="text-3xl font-semibold text-teal-700 mb-6">
          {isUpdate ? 'Update Dog Seller' : 'Add New Dog Seller'}
        </h1>
  
        {error && <div className="text-red-500 text-lg mb-4">{error}</div>}
  
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seller ID */}
          <div>
            <label htmlFor="sellerID" className="block text-lg font-medium text-teal-500 mb-2">
              Seller ID
            </label>
            <input
              type="text"
              id="sellerID"
              name="sellerID"
              value={dogSellerInfo.sellerID}
              onChange={(e) => setDogSellerInfo({ ...dogSellerInfo, sellerID: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
              disabled={isUpdate}
            />
          </div>
  
          {/* Seller Name */}
          <div>
            <label htmlFor="name" className="block text-lg font-medium text-teal-500 mb-2">
              Seller Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={dogSellerInfo.name}
              onChange={(e) => setDogSellerInfo({ ...dogSellerInfo, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
  
          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-lg font-medium text-teal-500 mb-2">
              Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageUpload}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm mb-4"
              accept="image/*"
            />
            {uploading && (
              <div className="w-full mt-4">
                <Progress percent={uploadProgress} status="active" />
              </div>
            )}
            <div className="mt-4">
              <img
                src={dogSellerInfo.image || "https://via.placeholder.com/150?text=Not+Available"}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
  
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-lg font-medium text-teal-500 mb-2">
              Location
            </label>
            <select
              id="location"
              name="location"
              value={dogSellerInfo.location}
              onChange={(e) => setDogSellerInfo({ ...dogSellerInfo, location: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm mb-4"
              required
            >
              <option value="">Select Location</option>
              {locations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
  
          {/* Breeds */}
          <div>
            <label className="block text-lg font-medium text-teal-500 mb-2">Breeds</label>
            {dogSellerInfo.breeds.map((breeds, index) => (
              <div key={index} className="flex items-center space-x-2 mb-4">
                <select
                  name="breeds"  
                  value={breeds._id}
                  onChange={(e) => handleChange(e, index)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  required
                >
                  <option value="">Select Breed</option>
                  {breedsList.map((breedItem) => (
                    <option key={breedItem._id} value={breedItem._id}>
                      {breedItem.name}
                    </option>
                  ))}
                </select>
                {index === dogSellerInfo.breeds.length - 1 && (
                  <button
                    type="button"
                    onClick={handleAddBreed}
                    className="p-3 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 transition"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>
  
          {/* Contact Information */}
          <div>
            <label htmlFor="contactInfo" className="block text-lg font-medium text-teal-500 mb-2">
              Contact Information
            </label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              value={dogSellerInfo.contactInfo}
              onChange={(e) => setDogSellerInfo({ ...dogSellerInfo, contactInfo: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm mb-4"
              required
            />
          </div>
  
          {/* Action Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-white border border-teal-500 text-teal-500 rounded-lg hover:bg-teal-500 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-3 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default AddDogSeller;
