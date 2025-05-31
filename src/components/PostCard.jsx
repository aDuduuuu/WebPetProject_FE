import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaWrench } from 'react-icons/fa';
import clientApi from '../client-api/rest-client';
import { message, Modal } from 'antd';
import { useTranslation } from 'react-i18next';

const PostCard = ({ id, image, title, sdescription, author, content, category, postID }) => {
  const navigate = useNavigate();
  const [isManager, setIsManager] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const role = localStorage.getItem('role');
    setIsManager(role === 'manager');
  }, []);

  const handleCardClick = () => {
    navigate(`/posts/${id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();

    Modal.confirm({
      title: t('confirm_delete_title'),
      content: t('confirm_delete_description'),
      okText: t('yes'),
      cancelText: t('no'),
      onOk: async () => {
        try {
          const api = clientApi.service('posts');
          await api.delete(id);
          message.success(t('delete_success'));
          window.location.reload();
        } catch (error) {
          console.error('Failed to delete item:', error);
          message.error(t('delete_error'));
        }
      },
      onCancel: () => {
        message.info(t('delete_cancelled'));
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
