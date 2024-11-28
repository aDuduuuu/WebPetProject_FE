import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaWrench } from 'react-icons/fa';
import clientApi from '../client-api/rest-client';
import { message,Modal } from 'antd';

const PostCard = ({ id, image, title, sdescription, author, content, category, postID }) => {
  const navigate = useNavigate();
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    setIsManager(role === 'manager'); // Kiểm tra role có phải manager hay không
  }, []);

  const handleCardClick = () => {
    navigate(`/posts/${id}`);
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
          const api = clientApi.service('posts');  // Gọi API service với loại đối tượng cần xóa
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

  const handleUpdate = (e) => {
    e.stopPropagation();

    navigate('/posts/add', {
      state: {
        type: 'update',
        id,
        postID,
        title,
        sdescription,
        author,
        content,
        image,
        category,
      },
    });
  };

  return (
    <div
      className="card bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer relative"
      onClick={handleCardClick}
      style={{ minHeight: '300px' }}
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
      <div className="mb-16">
        <h2 className="text-lg font-semibold text-teal-600 mb-2">{title}</h2>
        <p className="text-sm text-gray-600">{sdescription}</p>
      </div>

      {isManager && (
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button
            className="p-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
            onClick={handleUpdate}
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

export default PostCard;
