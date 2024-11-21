import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaWrench } from 'react-icons/fa'; // Import các icon
import clientApi from '../client-api/rest-client';

const Card = ({ id, image, name, location, nameClass, type }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/${type}/${id}`); // Sử dụng type để xác định là spa hay trainer
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
  
    // Hỏi người dùng xác nhận trước khi xóa
    const isConfirmed = window.confirm('Are you sure you want to delete this item?');
    if (!isConfirmed) return; // Nếu người dùng không xác nhận, không làm gì cả
  
    try {
      let api = clientApi.service(type);
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
      className="card bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer relative"
      onClick={handleCardClick}
    >
      {/* Hình ảnh và thông tin tên, vị trí */}
      <div className="mb-4">
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
    onClick={handleDelete} // Ngăn nút kích hoạt sự kiện click vào card
  >
    <FaTrashAlt size={20} />
  </button>
</div>

    </div>
  );
};

export default Card;
