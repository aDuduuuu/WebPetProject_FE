import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import clientApi from '../client-api/rest-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CompareBreeds = () => {
  const [dogNames, setDogNames] = useState([]);
  const [selectedBreeds, setSelectedBreeds] = useState({
    breed1: '',
    breed2: '',
    breed3: '',
    breed4: '',
    breed5: '',
  });
  const [dogDetails, setDogDetails] = useState({
    breed1: null,
    breed2: null,
    breed3: null,
    breed4: null,
    breed5: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Lấy danh sách tên giống chó
  const fetchDogNames = async () => {
    let authen = clientApi.service('dogbreeds');

    try {
      const response = await authen.find();
      if (response.EC === 0) {
        const breeds = response.DT.map((breed) => breed.name);
        setDogNames(breeds);
      } else {
        setError(response.EM);
        setDogNames([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('No dog breeds match the filters.');
      setDogNames([]);
    }
  };

  // Lấy thông tin chi tiết giống chó khi người dùng nhấn So sánh
  const fetchBreedDetails = async (breedName, breedKey) => {
    if (!breedName) return;

    setLoading(true);
    setError(null);

    let authen = clientApi.service('dogbreeds');

    // Tạo object filter cho giống chó
    const requestPayload = {
      name: breedName, // Lọc theo tên giống chó
    };

    try {
      const response = await authen.find(requestPayload);
      console.log(`API response for ${breedName}:`, response);

      // Kiểm tra nếu API trả về thông tin của giống chó
      if (response && response.EC === 0 && response.DT && response.DT.length > 0) {
        // Tìm giống chó chính xác dựa trên tên
        const breedDetails = response.DT.filter((breed) => breed.name === breedName);

        if (breedDetails.length > 0) {
          setDogDetails((prevState) => ({
            ...prevState,
            [breedKey]: breedDetails[0], // Cập nhật thông tin giống chó
          }));
        } else {
          setDogDetails((prevState) => ({
            ...prevState,
            [breedKey]: null, // Nếu không tìm thấy giống chó, trả về null
          }));
          toast.error(`No details found for ${breedName}`);
        }
      } else {
        setDogDetails((prevState) => ({
          ...prevState,
          [breedKey]: null, // Nếu không tìm thấy giống chó, trả về null
        }));
        toast.error(`No details found for ${breedName}`);
      }
    } catch (err) {
      console.error('Error fetching breed details:', err);
      setError('Failed to fetch breed details.');
    } finally {
      setLoading(false);
    }
  };

  // Handle khi người dùng nhấn nút So sánh
  const handleCompareClick = () => {
    const selectedValues = Object.values(selectedBreeds).filter((breed) => breed !== '');

    if (selectedValues.length < 2) {
      toast.error('Please select at least 2 breeds before comparing.');
      return;
    }

    selectedValues.forEach((breed) => {
      fetchBreedDetails(breed, `breed${selectedValues.indexOf(breed) + 1}`);
    });
  };

  // Lấy danh sách giống chó đã chọn từ localStorage
  useEffect(() => {
    const savedSelectedBreeds = JSON.parse(localStorage.getItem('selectedBreedsDetails')) || [];
    if (savedSelectedBreeds.length > 0) {
      const updatedSelectedBreeds = { ...selectedBreeds };
      savedSelectedBreeds.forEach((breed, index) => {
        updatedSelectedBreeds[`breed${index + 1}`] = breed.name;
      });
      setSelectedBreeds(updatedSelectedBreeds);
    }
  }, []);

  // Cập nhật danh sách giống chó và lấy thông tin chi tiết khi trang được tải
  useEffect(() => {
    fetchDogNames();
  }, []);

  // Cập nhật thông tin chi tiết giống chó khi selectedBreeds thay đổi
  useEffect(() => {
    Object.values(selectedBreeds).forEach((breedName, index) => {
      if (breedName) {
        fetchBreedDetails(breedName, `breed${index + 1}`);
      }
    });
  }, [selectedBreeds]);

  return (
    <div className="home-container text-[#16423C] flex flex-col min-h-screen bg-[#F9F9F9]">
      <Header />

      <div className="flex justify-center items-center mt-6">
        <button
          onClick={handleCompareClick}
          className="px-8 py-3 bg-[#16423C] text-white rounded-lg text-lg hover:bg-[#C4DACB] hover:text-[#16423C] transition-all duration-300"
        >
          Compare
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-8 mt-8">
        {[...Array(5)].map((_, index) => {
          const breedKey = `breed${index + 1}`;
          return (
            <div key={breedKey} className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-[275px]">
              <div className="bg-[#F0F0F0] p-4 border border-gray-300 rounded-md w-full flex justify-center">
                {/* Hiển thị ảnh của giống chó nếu có */}
                {dogDetails[breedKey] && dogDetails[breedKey].image ? (
                  <img
                    src={dogDetails[breedKey].image}
                    alt={`Breed ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                ) : (
                  <img
                    src="https://th.bing.com/th/id/OIP.C8pS8_-qe11wEe8U6V4r-wHaF8?rs=1&pid=ImgDetMain"
                    alt={`Breed ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                )}
              </div>
              <select
                value={selectedBreeds[breedKey]}
                onChange={(e) => {
                  setSelectedBreeds((prevState) => ({
                    ...prevState,
                    [breedKey]: e.target.value,
                  }));
                }}
                className="mt-4 p-2 bg-white text-[#16423C] rounded-md w-full border border-[#C4DACB]"
              >
                <option value="">Select a breed</option>
                {dogNames.length > 0 ? (
                  dogNames.map((name, index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))
                ) : (
                  <option>Loading breeds...</option>
                )}
              </select>

              {/* Hiển thị thông tin giống chó nếu có */}
              {dogDetails[breedKey] && dogDetails[breedKey] !== null && (
                <div className="mt-6 bg-white p-6 border border-gray-300 rounded-lg shadow-lg w-full">
                  <h3 className="font-semibold text-[#16423C] text-xl mb-6">{selectedBreeds[breedKey]}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">Height:</span>
                      <span>{dogDetails[breedKey].height.min} - {dogDetails[breedKey].height.max} inches</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">Weight:</span>
                      <span>{dogDetails[breedKey].weight.min} - {dogDetails[breedKey].weight.max} lbs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">Lifespan:</span>
                      <span>{dogDetails[breedKey].lifespan.min} - {dogDetails[breedKey].lifespan.max} years</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">Affective with Family:</span>
                      <span>{dogDetails[breedKey].affectionateWithFamily}/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">Good with Other Dogs:</span>
                      <span>{dogDetails[breedKey].goodWithOtherDogs}/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">Good with Young Children:</span>
                      <span>{dogDetails[breedKey].goodWithYoungChildren}/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">Shedding Level:</span>
                      <span>{dogDetails[breedKey].sheddingLevel}/5</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">Openness to Strangers:</span>
                      <span>{dogDetails[breedKey].opennessToStrangers}/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">Watchdog Protective Nature:</span>
                      <span>{dogDetails[breedKey].watchdogProtectiveNature}/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">Playfulness Level:</span>
                      <span>{dogDetails[breedKey].playfulnessLevel}/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">Adaptability Level:</span>
                      <span>{dogDetails[breedKey].adaptabilityLevel}/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">Trainability Level:</span>
                      <span>{dogDetails[breedKey].trainabilityLevel}/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">Barking Level:</span>
                      <span>{dogDetails[breedKey].barkingLevel}/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">Energy Level:</span>
                      <span>{dogDetails[breedKey].energyLevel}/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">Mental Stimulation Needs:</span>
                      <span>{dogDetails[breedKey].mentalStimulationNeeds}/5</span>
                    </div>

                    {/* Coat Type & Coat Length được xử lý đặc biệt vì chúng có thể chứa nhiều giá trị */}
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-gray-800">Coat Type:</span>
                      <div className="text-gray-700">
                        <ul className="list-disc pl-6">
                          {dogDetails[breedKey].coatType.map((type, index) => (
                            <li key={index}>{type}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-gray-800">Coat Length:</span>
                      <div className="text-gray-700">
                        <ul className="list-disc pl-6">
                          {dogDetails[breedKey].coatLength.map((length, index) => (
                            <li key={index}>{length}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                  </div>
                </div>
              )}



            </div>
          );
        })}
      </div>

      <Footer />

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
};

export default CompareBreeds;
