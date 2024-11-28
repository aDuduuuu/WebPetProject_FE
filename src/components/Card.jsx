import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaWrench } from 'react-icons/fa';
import clientApi from '../client-api/rest-client';
import { message,Modal } from 'antd';

const Card = ({ id, image, name, location, services, contactInfo, price, type, action, data, quantity ,description}) => {
  const navigate = useNavigate();
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    // Lấy role từ localStorage
    const role = localStorage.getItem('role');
    setIsManager(role === 'manager'); // Kiểm tra nếu role là manager
  }, []);

  const handleCardClick = () => {
    navigate(`/${type}/${id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
  
    // Sử dụng Modal.confirm để yêu cầu xác nhận
    Modal.confirm({
      title: 'Are you sure you want to delete this item?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          const api = clientApi.service(type);  // Gọi API service với loại đối tượng cần xóa
          await api.delete(id);  // Thực hiện xóa
          message.success('Item deleted successfully!');  // Hiển thị thông báo thành công
          window.location.reload();  // Làm mới trang sau khi xóa
        } catch (error) {
          console.error('Failed to delete item:', error);
          message.error('Error deleting item');  // Hiển thị thông báo lỗi
        }
      },
      onCancel: () => {
        message.info('Deletion cancelled');  // Hiển thị thông báo khi người dùng hủy
      },
    });
  };
  
  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/${type}/add`, {
      state: {
        type,
        action,
        id,
        name,
        location,
        services,
        contactInfo,
        image,
        price,
        data,
        quantity,
        description,
      },
    });
  };

  const renderDetails = () => {
    if (type === 'products') {
      return (
        <>
          <p className="text-sm text-gray-600">Price: ${price}</p>
        </>
      );
    }
    if (type === 'dogsellers') {
      return <p className="text-sm text-gray-600">{location}</p>;
    }
    if (type === 'spas' || type === 'trainers') {
      return (
        <p className="text-sm text-gray-600">
          {location.province}, {location.district}
        </p>
      );
    }
    return null;
  };

  return (
    <div
  className="card bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer relative"
  onClick={handleCardClick}
  style={{ minHeight: '350px' }}  // Thêm min-height cho thẻ card
>
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
    <h2 className="text-lg font-semibold">{name}</h2>
    {renderDetails()}
  </div>

  {isManager && (
    <div className="absolute bottom-4 right-4 flex space-x-2">
      <button
        className="p-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
        onClick={handleEdit}
      >
        <FaWrench size={20} />
      </button>
      <button
        className="p-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
        onClick={handleDelete}
      >
        <FaTrashAlt size={20} />
      </button>
    </div>
  )}
</div>

  );
};
export default Card;
