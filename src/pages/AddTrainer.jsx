import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import clientApi from '../client-api/rest-client';
import Header from '../components/Header';

const AddTrainer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for trainer information
  const [trainerInfo, setTrainerInfo] = useState({
    name: '',
    image: '',
    location: { province: '', district: '', ward: '', street: '' },
    services: [''],
    contactInfo: { phone: '', email: '' },
  });

  const [isUpdate, setIsUpdate] = useState(false); // Determine if this is an update
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Provinces dropdown options
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

  // Populate fields if editing an existing trainer
  useEffect(() => {
    if (location.state?.action === 'update' && location.state?.type === 'trainers') {
      setTrainerInfo({
        name: location.state.name || '',
        image: location.state.image || '',
        location: location.state.location || { province: '', district: '', ward: '', street: '' },
        services: location.state.services || [''],
        contactInfo: location.state.contactInfo || { phone: '', email: '' },
        id: location.state.id, // Save the trainer ID for updates
      });
      setIsUpdate(true); // Set to update mode
    }
  }, [location.state]);

  // Handle changes in form fields
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'service') {
      const updatedServices = [...trainerInfo.services];
      updatedServices[index] = value;
      setTrainerInfo({ ...trainerInfo, services: updatedServices });
    } else if (name.startsWith('location')) {
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
      setTrainerInfo((prevState) => ({
        ...prevState,
        contactInfo: {
          ...prevState.contactInfo,
          [contactField]: value,
        },
      }));
    } else {
      setTrainerInfo((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Add a new service input
  const handleAddService = () => {
    setTrainerInfo((prevState) => ({
      ...prevState,
      services: [...prevState.services, ''], // Add an empty input
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const trainerService = clientApi.service('trainers');
      if (isUpdate) {
        // Update existing trainer
        await trainerService.patch(trainerInfo.id, trainerInfo);
        alert('Trainer updated successfully!');
      } else {
        // Create new trainer
        await trainerService.create(trainerInfo);
        alert('Trainer added successfully!');
      }
      navigate('/trainers'); // Redirect to the trainer list
    } catch (err) {
      console.error('Error saving trainer:', err);
      setError('An error occurred while saving the trainer.');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    navigate('/trainers');
  };

  return (
    <div className="trainer-container flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">{isUpdate ? 'Update Trainer' : 'Add New Trainer'}</h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
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

          {/* Image */}
          <div>
            <label htmlFor="image" className="block font-bold">Image URL</label>
            <input
              type="text"
              id="image"
              name="image"
              value={trainerInfo.image}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {trainerInfo.image && (
              <img src={trainerInfo.image} alt="Preview" className="mt-2 w-40 h-40 object-cover rounded" />
            )}
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
                  name="service"
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

          {/* Contact Info */}
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
    </div>
  );
};

export default AddTrainer;
