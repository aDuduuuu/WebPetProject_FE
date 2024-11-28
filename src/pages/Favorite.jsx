import React, { useState, useEffect } from 'react';
import clientApi from '../client-api/rest-client';
import FavorCard from '../components/FavorCard'; // Giả sử bạn đã tạo component FavorCard
import Header from '../components/Header'; // Import Header từ component

const Favorite = () => {
  const [favorList, setFavorList] = useState([]); // Danh sách sản phẩm yêu thích
  const [userID, setUserID] = useState(localStorage.getItem('id'));
  const [loading, setLoading] = useState(true); // Để hiển thị loading khi đang fetch data

  // Lấy danh sách yêu thích và thông tin sản phẩm khi component load
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const id = localStorage.getItem('id');
        const response = await clientApi.service('favorites').get(id); // Lấy danh sách yêu thích

        if (response && response.EC === 0) {
          const favoriteItems = Array.isArray(response.DT) ? response.DT : response.DT.items || [];

          // Lọc ra các mục yêu thích có type là "Product"
          const filteredFavorites = favoriteItems.filter(item => item.type === 'Product');

          // Lặp qua danh sách yêu thích, lấy chi tiết sản phẩm từ API
          const favorListWithDetails = await Promise.all(
            filteredFavorites.map(async (item) => {
              // Gọi API để lấy thông tin chi tiết của sản phẩm
              const productResponse = await clientApi.service('products').get(item.referenceID); // Truyền _id của sản phẩm
              return {
                id: productResponse.DT._id, // Lưu _id của sản phẩm
                name: productResponse.DT.name, // Lưu tên của sản phẩm
                image: productResponse.DT.image || 'https://via.placeholder.com/150', // Lưu hình ảnh hoặc placeholder nếu không có
                price: productResponse.DT.price, // Lưu giá của sản phẩm
                favoriteID: item._id, // Thêm _id của mục yêu thích vào
              };
            })
          );

          setFavorList(favorListWithDetails);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching favorite items:', error);
        setLoading(false);
      }
    };

    if (userID) {
      fetchFavorites();
    }
  }, [userID]);

  if (loading) {
    return (
      <div className="favorite-container flex flex-col min-h-screen bg-gray-100">
        <Header />
        <div className="w-full p-6 text-center">
          <p className="text-lg text-gray-600">Loading your favorite products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorite-container flex flex-col min-h-screen bg-gray-100">
      <Header /> {/* Thêm header */}
      <div className="w-full p-6">
        <h2 className="text-2xl font-bold mb-6">Your Favorite Products</h2>

        {favorList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {favorList.map((item, index) => (
              <FavorCard
                key={index}
                id={item.id}
                name={item.name}
                image={item.image}
                price={item.price} // Truyền giá sản phẩm
                favoriteID={item.favoriteID} // Truyền _id của favorite vào card
              />
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-600">You don't have any favorite products yet.</p>
        )}
      </div>
    </div>
  );
};

export default Favorite;
