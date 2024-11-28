import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import clientApi from '../client-api/rest-client';
import { Modal, message } from 'antd'; // Import Modal và message từ Ant Design


const FavorCard = ({ id, name, image, price, favoriteID }) => {
    const navigate = useNavigate();

    // Dẫn đến trang chi tiết sản phẩm
    const handleCardClick = () => {
        navigate(`/products/${id}`);
    };

    // Xoá sản phẩm yêu thích
    const handleDelete = async (e) => {
        e.stopPropagation(); // Ngăn không cho sự kiện click được kích hoạt trên card
    
        // Hiển thị modal xác nhận trước khi xoá
        Modal.confirm({
            title: 'Are you sure you want to remove this item from favorites?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                try {
                    const response = await clientApi.service('favorites').delete(favoriteID);
                    if (response && response.EC === 0) {
                        message.success('Product removed from favorites'); // Thông báo thành công
                        window.location.reload(); // Reload lại trang sau khi xoá
                    } else {
                        message.error('Failed to remove the product'); // Thông báo thất bại
                    }
                } catch (error) {
                    console.error('Failed to delete product:', error);
                    message.error('Error deleting product'); // Thông báo lỗi
                }
            },
            onCancel: () => {
                // Nếu người dùng huỷ, không làm gì cả
            }
        });
    };

    return (
        <div
            className="card bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer relative"
            onClick={handleCardClick}
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
                {/* Hiển thị giá sản phẩm */}
                <p className="text-xl text-gray-800 mt-2">${price}</p>
            </div>

            {/* Hiển thị nút xoá ở góc phải dưới */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
                <button
                    className="p-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
                    onClick={handleDelete}
                >
                    <FaTrashAlt size={20} />
                </button>
            </div>
        </div>
    );
};

export default FavorCard;
