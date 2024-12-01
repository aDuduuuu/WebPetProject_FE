import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import clientApi from '../client-api/rest-client';

const DogSellerDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [detail, setDetail] = useState(null); // State lưu thông tin seller
  const [breeds, setBreeds] = useState([]); // State lưu tên giống chó
  const [loading, setLoading] = useState(true); // State hiển thị trạng thái tải
  const [error, setError] = useState(null); // State lưu lỗi

  // Fetch thông tin seller và giống chó
  useEffect(() => {
    const fetchDogSeller = async () => {
      try {
        console.log('Fetching dog seller with ID:', id);
        const sellerResponse = await clientApi.service('dogsellers').get(id);

        if (sellerResponse.EC === 200) {
          setDetail(sellerResponse.DT); // Cập nhật thông tin seller
          const breedIds = (sellerResponse.DT.breeds || []).map((breed) => breed._id || breed); // Lấy danh sách breed IDs

          if (breedIds.length > 0) {
            // Fetch tên giống chó từ breed IDs
            const breedResponses = await Promise.all(
              breedIds.map((breedId) => clientApi.service('dogbreeds').get(breedId))
            );
            const breedNames = breedResponses.map((res) => res.DT.name); // Lấy tên giống chó từ API
            setBreeds(breedNames); // Cập nhật tên giống chó vào state
          }
        } else {
          setError(sellerResponse.EM || 'Failed to fetch dog seller details.');
        }
      } catch (err) {
        setError('An error occurred while fetching the dog seller.');
        console.error('Error fetching dog seller:', err);
      } finally {
        setLoading(false); // Tắt trạng thái loading
      }
    };

    fetchDogSeller();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-lg font-bold text-gray-700">Loading dog seller details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-lg font-bold text-red-500">{error}</p>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-lg font-bold text-gray-700">No details available for this dog seller.</p>
      </div>
    );
  }

  return (
    <div className="dog-seller-detail-container flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="dog-seller-detail-content bg-white shadow-lg rounded-lg mx-10 my-6 p-10">
        <h1 className="text-4xl font-bold text-teal-600 mb-4">{detail.name}</h1>
        <p className="text-lg text-gray-500 mb-2">Location: {detail.location}</p>
        <img
          src={detail.image || 'https://via.placeholder.com/1200x600?text=No+Image'}
          alt={detail.name}
          className="w-full h-auto rounded-lg mb-6 object-cover"
        />
        <p className="text-lg text-gray-700 mb-4">
          <span className="font-semibold">Breeds: </span>
          {breeds.length > 0 ? breeds.join(', ') : 'No breeds available'}
        </p>
        <p className="text-lg text-gray-700 mb-4">
          <span className="font-semibold">Contact Info: </span>
          {detail.contactInfo || 'No contact information available'}
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default DogSellerDetail;
