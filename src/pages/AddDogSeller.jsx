import React, { useState, useEffect } from 'react';
import clientApi from '../client-api/rest-client'; // Import clientApi
import { useNavigate } from "react-router-dom";
import Header from '../components/Header';

const AddDogSeller = () => {
  const [dogSellerInfo, setDogSellerInfo] = useState({
    sellerId: '',    // Thêm sellerId
    name: '',
    image: '',
    location: '',    // Sử dụng dropdown cho location
    breeds: [''],    // Mảng giống chó ban đầu, bắt đầu với một ô chọn giống chó
    contactInfo: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [breedsList, setBreedsList] = useState([]);
  const [locations, setLocations] = useState([
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
  ]);
  const navigate = useNavigate();

  // Fetch dog breeds from API when the component mounts
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const breedApi = clientApi.service('dogbreeds');
        const result = await breedApi.find();
        if (result && result.EC === 0) {
          setBreedsList(result.DT || []);
        } else {
          setError('Failed to fetch dog breeds');
        }
      } catch (err) {
        setError('Error fetching dog breeds');
      }
    };
    fetchBreeds();
  }, []);

  // Handle input changes
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'breed') {
      const updatedBreeds = [...dogSellerInfo.breeds];
      updatedBreeds[index] = value;
      setDogSellerInfo({ ...dogSellerInfo, breeds: updatedBreeds });
    } else {
      setDogSellerInfo({ ...dogSellerInfo, [name]: value });
    }
  };

  // Add a new breed dropdown
  const handleAddBreed = () => {
    setDogSellerInfo((prevState) => ({
      ...prevState,
      breeds: [...prevState.breeds, '']
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
  
    // Kiểm tra tất cả các trường bắt buộc
    if (
      !dogSellerInfo.sellerId ||
      !dogSellerInfo.name ||
      !dogSellerInfo.location ||
      !dogSellerInfo.contactInfo ||
      dogSellerInfo.breeds.some(breed => !breed) // Kiểm tra xem có giống chó nào bị bỏ trống không
    ) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }
  
    // Chuyển tên giống chó thành _id
    const updatedBreeds = dogSellerInfo.breeds.map(breedName => {
      const breed = breedsList.find(b => b.name === breedName); // Tìm giống chó theo tên
      return breed ? breed._id : null; // Lấy _id nếu tìm thấy giống chó
    });
  
    const updatedSellerInfo = {
      ...dogSellerInfo,
      breeds: updatedBreeds.filter(breedId => breedId !== null), // Lọc bỏ các giống chó không hợp lệ
    };
  
    try {
      const response = await clientApi.service('dogsellers').create(updatedSellerInfo);
  
      if (response.EC === 0) {
        setSuccess('Dog seller added successfully!');
        setDogSellerInfo({
          sellerId: '',
          name: '',
          image: '',
          location: '',
          breeds: [''], // Reset breeds to the default state
          contactInfo: '',
        });
      } else {
        setError(response.EM);
      }
    } catch (err) {
      console.error('Error adding dog seller:', err);
      setError('An error occurred while adding the dog seller.');
    }
  
    setLoading(false);
  };
  
  

  const handleCancel = () => {
    navigate("/dogsellers");
  };

  return (
    <div className="dog-seller-container flex flex-col min-h-screen bg-gray-100">
      <Header /> {/* Add Header */}
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Add New Dog Seller</h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Seller ID */}
          <div>
            <label htmlFor="sellerId" className="block font-bold">Seller ID</label>
            <input
              type="text"
              id="sellerId"
              name="sellerId"
              value={dogSellerInfo.sellerId}
              onChange={e => setDogSellerInfo({ ...dogSellerInfo, sellerId: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Seller Name */}
          <div>
            <label htmlFor="name" className="block font-bold">Seller Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={dogSellerInfo.name}
              onChange={e => handleChange(e, 0)}
              className="w-full p-2 border rounded"
              required
            />
        </div>

        <div>
          <label htmlFor="image" className="block font-bold" >Image URL</label>
          <input
            type="text"
            id="image"
            name="image"
            value={dogSellerInfo.image}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
          {/* Location */}
          <div>
            <label htmlFor="location" className="block font-bold">Location</label>
            <select
              id="location"
              name="location"
              value={dogSellerInfo.location}
              onChange={e => setDogSellerInfo({ ...dogSellerInfo, location: e.target.value })}
              className="w-full p-2 border rounded"
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
            <label className="block font-bold">Breeds</label>
            {dogSellerInfo.breeds.map((breed, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <select
                  name="breed"
                  value={breed}
                  onChange={(e) => handleChange(e, index)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Breed</option>
                  {breedsList.length > 0 ? (
                    breedsList.map((breedItem) => (
                      <option key={breedItem._id} value={breedItem._id}>
                        {breedItem.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No breeds available</option>
                  )}
                </select>

                {index === dogSellerInfo.breeds.length - 1 && (
                  <button
                    type="button"
                    onClick={handleAddBreed}
                    className="p-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                    style={{
                      width: '40px',
                      height: '40px',
                      padding: '0',
                      textAlign: 'center',
                      fontSize: '20px',
                    }}
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div>
            <label htmlFor="contactInfo" className="block font-bold">Contact Information</label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              value={dogSellerInfo.contactInfo}
              onChange={e => setDogSellerInfo({ ...dogSellerInfo, contactInfo: e.target.value })}
              className="w-full p-2 border rounded"
              required
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
              {loading ? 'Adding...' : 'Add Dog Seller'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDogSeller;