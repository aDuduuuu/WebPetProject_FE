import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaWrench } from 'react-icons/fa'; // Import các icon
import clientApi from '../client-api/rest-client';

const PostCard = ({ id, image, title, sdescription }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/posts/${id}`); // Navigate to the detailed post page using _id
  };
  const handleDelete = async (e) => {
    e.stopPropagation();
  
    // Hỏi người dùng xác nhận trước khi xóa
    const isConfirmed = window.confirm('Are you sure you want to delete this item?');
    if (!isConfirmed) return; // Nếu người dùng không xác nhận, không làm gì cả
  
    try {
      let api = clientApi.service('posts');
      const response = await api.delete(id); // Gọi API xóa item
  
      // Xóa thành công, tải lại trang ngay lập tức
      window.location.reload(); // Reload trang để cập nhật dữ liệu
  
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Error deleting item'); // Nếu có lỗi, hiển thị thông báo lỗi
    }
  };
  return (
    <div
      className="card bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="mb-4">
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
    {/* Bộ phận chứa các nút */}
    <div className="flex justify-end space-x-2 mt-4"> {/* Sử dụng flexbox để đặt các nút */}
    <button
      className="p-2 bg-teal-500 text-white rounded-md hover:bg-teal-600" // Đổi màu nền thành teal-500, màu hover là teal-600
      onClick={(e) => e.stopPropagation()} // Ngăn nút kích hoạt sự kiện click vào card
    >
      <FaWrench size={20} />
    </button>
    <button
      className="p-2 bg-teal-500 text-white rounded-md hover:bg-teal-600" // Đổi màu nền thành teal-500, màu hover là teal-600
      onClick={handleDelete} 
    >
      <FaTrashAlt size={20} />
    </button>
  </div>
  </div>
  );
};

export default PostCard;
