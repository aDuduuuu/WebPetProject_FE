import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import clientApi from '../client-api/rest-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

const CompareBreeds = () => {
  const [dogNames, setDogNames] = useState([]);
  const { t, i18n } = useTranslation();
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

      <div className="relative bg-[#C4DACB] text-[#16423C] py-16 px-8 rounded-b-lg shadow-lg">
        {/* Language Switch Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={() => i18n.changeLanguage('en')}
            className="px-4 py-2 border !border-[#16423C] text-[#16423C] rounded-md text-sm font-semibold transition-all duration-200 hover:bg-[#16423C] hover:text-white"
          >
            EN
          </button>
          <button
            onClick={() => i18n.changeLanguage('vi')}
            className="px-4 py-2 border !border-[#16423C] text-[#16423C] rounded-md text-sm font-semibold transition-all duration-200 hover:bg-[#16423C] hover:text-white"
          >
            VI
          </button>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            {t('compare.title')}
          </h1>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            {t('compare.description')}
          </p>
          <p className="text-lg font-medium max-w-2xl mx-auto">
            {t('compare.note')}
          </p>
        </div>
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
                <option value="">{t('selectBreed')}</option>
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

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{t('detail.height')}:</span>
                      <span>{dogDetails[breedKey].height.min} - {dogDetails[breedKey].height.max} inches</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{t('detail.weight')}:</span>
                      <span>{dogDetails[breedKey].weight.min} - {dogDetails[breedKey].weight.max} lbs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{t('detail.lifespan')}:</span>
                      <span>{dogDetails[breedKey].lifespan.min} - {dogDetails[breedKey].lifespan.max} {t('YEAR')}</span>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {/* Affective with Family */}
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">{t('detail.affectionateWithFamily')}:</span>
                      </div>
                      <div className="flex items-center">
                        {/* Mỗi thanh màu sẽ được lặp qua mức độ từ 1 đến 5 */}
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-6 h-2 mx-1 rounded-full ${level <= dogDetails[breedKey].affectionateWithFamily ? 'bg-[#16423C]' : 'bg-[#C4DACB]'}`}
                          ></div>
                        ))}
                        {/* Hiển thị mức độ */}
                        <span className="ml-2 text-gray-600">{dogDetails[breedKey].affectionateWithFamily}/5</span>
                      </div>

                      {/* Good with Other Dogs */}
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">{t('detail.goodWithOtherDogs')}:</span>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-6 h-2 mx-1 rounded-full ${level <= dogDetails[breedKey].goodWithOtherDogs ? 'bg-[#16423C]' : 'bg-[#C4DACB]'}`}
                          ></div>
                        ))}
                        <span className="ml-2 text-gray-600">{dogDetails[breedKey].goodWithOtherDogs}/5</span>
                      </div>

                      {/* Good with Young Children */}
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">{t('detail.goodWithYoungChildren')}:</span>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-6 h-2 mx-1 rounded-full ${level <= dogDetails[breedKey].goodWithYoungChildren ? 'bg-[#16423C]' : 'bg-[#C4DACB]'}`}
                          ></div>
                        ))}
                        <span className="ml-2 text-gray-600">{dogDetails[breedKey].goodWithYoungChildren}/5</span>
                      </div>

                      {/* Shedding Level */}
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">{t('detail.sheddingLevel')}:</span>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-6 h-2 mx-1 rounded-full ${level <= dogDetails[breedKey].sheddingLevel ? 'bg-[#16423C]' : 'bg-[#C4DACB]'}`}
                          ></div>
                        ))}
                        <span className="ml-2 text-gray-600">{dogDetails[breedKey].sheddingLevel}/5</span>
                      </div>

                      {/* Coat Grooming Frequency */}
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">{t('detail.coatGroomingFrequency')}:</span>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-6 h-2 mx-1 rounded-full ${level <= dogDetails[breedKey].coatGroomingFrequency ? 'bg-[#16423C]' : 'bg-[#C4DACB]'}`}
                          ></div>
                        ))}
                        <span className="ml-2 text-gray-600">{dogDetails[breedKey].coatGroomingFrequency}/5</span>
                      </div>

                      {/* Drooling Level */}
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">{t('detail.droolingLevel')}:</span>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-6 h-2 mx-1 rounded-full ${level <= dogDetails[breedKey].droolingLevel ? 'bg-[#16423C]' : 'bg-[#C4DACB]'}`}
                          ></div>
                        ))}
                        <span className="ml-2 text-gray-600">{dogDetails[breedKey].droolingLevel}/5</span>
                      </div>

                      {/* Openness to Strangers */}
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">{t('detail.opennessToStrangers')}:</span>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-6 h-2 mx-1 rounded-full ${level <= dogDetails[breedKey].opennessToStrangers ? 'bg-[#16423C]' : 'bg-[#C4DACB]'}`}
                          ></div>
                        ))}
                        <span className="ml-2 text-gray-600">{dogDetails[breedKey].opennessToStrangers}/5</span>
                      </div>

                      {/* Watchdog Protective Nature */}
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">{t('detail.watchdogProtectiveNature')}:</span>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-6 h-2 mx-1 rounded-full ${level <= dogDetails[breedKey].watchdogProtectiveNature ? 'bg-[#16423C]' : 'bg-[#C4DACB]'}`}
                          ></div>
                        ))}
                        <span className="ml-2 text-gray-600">{dogDetails[breedKey].watchdogProtectiveNature}/5</span>
                      </div>

                      {/* Playfulness Level */}
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">{t('detail.playfulnessLevel')}:</span>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-6 h-2 mx-1 rounded-full ${level <= dogDetails[breedKey].playfulnessLevel ? 'bg-[#16423C]' : 'bg-[#C4DACB]'}`}
                          ></div>
                        ))}
                        <span className="ml-2 text-gray-600">{dogDetails[breedKey].playfulnessLevel}/5</span>
                      </div>

                      {/* Adaptability Level */}
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">{t('detail.adaptabilityLevel')}:</span>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-6 h-2 mx-1 rounded-full ${level <= dogDetails[breedKey].adaptabilityLevel ? 'bg-[#16423C]' : 'bg-[#C4DACB]'}`}
                          ></div>
                        ))}
                        <span className="ml-2 text-gray-600">{dogDetails[breedKey].adaptabilityLevel}/5</span>
                      </div>

                      {/* Trainability Level */}
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">{t('detail.trainabilityLevel')}:</span>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-6 h-2 mx-1 rounded-full ${level <= dogDetails[breedKey].trainabilityLevel ? 'bg-[#16423C]' : 'bg-[#C4DACB]'}`}
                          ></div>
                        ))}
                        <span className="ml-2 text-gray-600">{dogDetails[breedKey].trainabilityLevel}/5</span>
                      </div>

                      {/* Barking Level */}
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">{t('detail.barkingLevel')}:</span>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-6 h-2 mx-1 rounded-full ${level <= dogDetails[breedKey].barkingLevel ? 'bg-[#16423C]' : 'bg-[#C4DACB]'}`}
                          ></div>
                        ))}
                        <span className="ml-2 text-gray-600">{dogDetails[breedKey].barkingLevel}/5</span>
                      </div>

                      {/* Energy Level */}
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">{t('detail.energyLevel')}:</span>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-6 h-2 mx-1 rounded-full ${level <= dogDetails[breedKey].energyLevel ? 'bg-[#16423C]' : 'bg-[#C4DACB]'}`}
                          ></div>
                        ))}
                        <span className="ml-2 text-gray-600">{dogDetails[breedKey].energyLevel}/5</span>
                      </div>

                      {/* Mental Stimulation Needs */}
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">{t('detail.mentalStimulationNeeds')}:</span>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-6 h-2 mx-1 rounded-full ${level <= dogDetails[breedKey].mentalStimulationNeeds ? 'bg-[#16423C]' : 'bg-[#C4DACB]'}`}
                          ></div>
                        ))}
                        <span className="ml-2 text-gray-600">{dogDetails[breedKey].mentalStimulationNeeds}/5</span>
                      </div>
                    </div>

                    {/* Coat Type & Coat Length được xử lý đặc biệt vì chúng có thể chứa nhiều giá trị */}
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-gray-800">{t('detail.coatType')}:</span>
                      <div className="text-gray-700">
                        <ul className="list-disc pl-6">
                          {dogDetails[breedKey].coatType.map((type, index) => (
                            <li key={index}>{t(type)}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-gray-800">{t('detail.coatLength')}:</span>
                      <div className="text-gray-700">
                        <ul className="list-disc pl-6">
                          {dogDetails[breedKey].coatLength.map((length, index) => (
                            <li key={index}>{t(length)}</li>
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
