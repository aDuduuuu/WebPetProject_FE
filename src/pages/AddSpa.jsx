import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import clientApi from '../client-api/rest-client'; // Import clientApi
import Header from '../components/Header';

const AddSpa = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for spa information
  const [spaInfo, setSpaInfo] = useState({
    name: '',
    image: '',
    location: { province: '', district: '', ward: '', street: '' },
    services: [''],
    contactInfo: { phone: '', email: '' },
  });

  const [isUpdate, setIsUpdate] = useState(false); // State to check if it's an update
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

  // Populate fields if editing an existing spa
  useEffect(() => {
    if (location.state?.action === 'update' && location.state?.type === 'spas') {
      setSpaInfo({
        name: location.state.name || '',
        image: location.state.image || '',
        location: location.state.location || { province: '', district: '', ward: '', street: '' },
        services: location.state.services || [''],
        contactInfo: location.state.contactInfo || { phone: '', email: '' },
        id: location.state.id, // Keep the ID for updating
      });
      setIsUpdate(true); // Set the form to update mode
    }
  }, [location.state]);

  // Handle changes in form fields
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'service') {
      const updatedServices = [...spaInfo.services];
      updatedServices[index] = value;
      setSpaInfo({ ...spaInfo, services: updatedServices });
    } else if (name.startsWith('location')) {
      const locationField = name.split('.')[1]; // Get the part after '.'
      setSpaInfo((prevState) => ({
        ...prevState,
        location: {
          ...prevState.location,
          [locationField]: value,
        },
      }));
    } else if (name.startsWith('contactInfo')) {
      const contactField = name.split('.')[1]; // Get the part after '.'
      setSpaInfo((prevState) => ({
        ...prevState,
        contactInfo: {
          ...prevState.contactInfo,
          [contactField]: value,
        },
      }));
    } else {
      setSpaInfo((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Add a new input for services
  const handleAddService = () => {
    setSpaInfo((prevState) => ({
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
      const spaService = clientApi.service('spas');
      if (isUpdate) {
        // If updating an existing spa
        await spaService.patch(spaInfo.id, spaInfo);
        alert('Spa updated successfully!');
      } else {
        // If creating a new spa
        await spaService.create(spaInfo);
        alert('Spa added successfully!');
      }
      navigate('/spas'); // Navigate back to the spa list
    } catch (err) {
      console.error('Error saving spa:', err);
      setError('An error occurred while saving the spa.');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    navigate('/spas');
  };

  return (
    <div className="spa-container flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">
          {isUpdate ? 'Update Spa' : 'Add New Spa'}
        </h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block font-bold">Spa Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={spaInfo.name}
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
              value={spaInfo.image}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block font-bold">Location</label>
            <select
              name="location.province"
              value={spaInfo.location.province}
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
              value={spaInfo.location.district}
              onChange={handleChange}
              placeholder="District"
              className="w-full p-2 border rounded mb-2"
              required
            />
            <input
              type="text"
              name="location.ward"
              value={spaInfo.location.ward}
              onChange={handleChange}
              placeholder="Ward"
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              name="location.street"
              value={spaInfo.location.street}
              onChange={handleChange}
              placeholder="Street"
              className="w-full p-2 border rounded mb-2"
            />
          </div>

          {/* Services */}
          <div>
            <label htmlFor="services" className="block font-bold">Services</label>
            {spaInfo.services.map((service, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  name="service"
                  value={service}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Service"
                  className="w-full p-2 border rounded mr-2"
                />
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
            <label htmlFor="phone" className="block font-bold">Phone</label>
            <input
              type="text"
              id="phone"
              name="contactInfo.phone"
              value={spaInfo.contactInfo.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-bold">Email</label>
            <input
              type="email"
              id="email"
              name="contactInfo.email"
              value={spaInfo.contactInfo.email}
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
              {loading ? 'Saving...' : isUpdate ? 'Update Spa' : 'Add Spa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSpa;
