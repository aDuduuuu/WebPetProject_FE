import React from 'react';
import { useNavigate } from 'react-router-dom';

const Card = ({ id, image, name, location, nameClass, type }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/${type}/${id}`); // Sử dụng type để xác định là spa hay trainer
  };

  return (
    <div
      className="card bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <img
        src={image}
        alt={name}
        className="w-full h-40 object-cover rounded-t-md mb-4"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/150?text=Not+Available';
        }}
      />
      <h2 className={`text-lg font-semibold ${nameClass}`}>{name}</h2>
      <p className="text-sm text-gray-600">{location}</p>
    </div>
  );
};

export default Card;
