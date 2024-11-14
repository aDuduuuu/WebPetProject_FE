import React from 'react';
import Header from '../components/Header';
import '../css/Home.css';

const Home = () => {
  return (
    <div className="home-container text-white flex flex-col min-h-screen">
      <Header />
      
      {/* Phần Hero */}
      <div className="hero-section h-screen bg-cover bg-center flex flex-col justify-center items-end p-20 lg:p-30">
        <div className="max-w-lg text-left space-y-4"> 
          <h1 className="text-4xl lg:text-5xl font-bold">
            Nơi trú ẩn an toàn cho người bạn lông xù của bạn
          </h1>
          <button className="mt-4 px-6 py-3 bg-teal-500 rounded-lg text-lg font-semibold hover:bg-teal-700 transition duration-300">
            Mua hàng
          </button>
        </div>
      </div>

      {/* Phần Nội dung Bổ sung */}
      <div className="additional-content bg-gray-100 text-gray-800 p-8 lg:p-20 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-4">Tại sao chọn WoofHaven?</h2>
        <p className="text-lg max-w-2xl text-center mb-6">
          WoofHaven là nơi mang đến sự an toàn và thoải mái cho người bạn lông xù của bạn. Chúng tôi cung cấp các dịch vụ chăm sóc thú cưng với tiêu chuẩn cao nhất, đảm bảo sức khỏe và hạnh phúc cho thú cưng của bạn.
        </p>
        <button className="px-6 py-3 bg-teal-500 rounded-lg text-lg font-semibold hover:bg-teal-700 transition duration-300">
          Tìm hiểu thêm
        </button>
      </div>
    </div>
  );
};

export default Home;
