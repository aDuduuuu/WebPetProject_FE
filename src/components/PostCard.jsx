import React from 'react';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ id, image, title, sdescription }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/posts/${id}`); // Navigate to the detailed post page using _id
  };

  return (
    <div
      className="card bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <img
        src={image}
        alt={title}
        className="w-full h-40 object-cover rounded-t-md mb-4"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/150?text=No+Image';
        }}
      />
      <h2 className="text-lg font-semibold text-teal-600 mb-2">{title}</h2>
      <p className="text-sm text-gray-600">{sdescription}</p> {/* Hiển thị shortdescription */}
    </div>
  );
};

export default PostCard;
