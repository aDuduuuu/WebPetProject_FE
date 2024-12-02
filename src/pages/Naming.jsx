import { GiBatMask, GiClown } from "react-icons/gi";
import { HiOutlineHeart } from "react-icons/hi";
import { PiBaby, PiFilmSlateDuotone } from "react-icons/pi";
import { IoGameControllerOutline } from "react-icons/io5";
import { LuSparkles } from "react-icons/lu";
import { FaRegGrinStars } from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import Header from '../components/Header'; // Đảm bảo đường dẫn chính xác
import clientApi from '../client-api/rest-client'; // API client để lấy danh sách tên
import Footer from '../components/Footer';

const NamePage = () => {
  const [selectedOption, setSelectedOption] = useState(null); // Chỉ lưu 1 lựa chọn
  const [dogNames, setDogNames] = useState([]); // Danh sách tên chó
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [hasMore, setHasMore] = useState(true); // Kiểm tra xem còn thẻ nào để load thêm
  const [page, setPage] = useState(1); // Trang hiện tại

  // Hàm lấy danh sách tên chó từ API
  const fetchDogNames = async (category, page = 1) => {
    setLoading(true);
    try {
      const params = {
        category: category || '', // Nếu không có category, lấy tất cả
        page,
        limit: 16, // Giới hạn 16 thẻ mỗi lần load
      };
      const result = await clientApi.service('dognames').find(params); // Gọi API lấy danh sách tên chó
      if (result && result.EC === 0) {
        const newDogNames = result.DT;
        setDogNames((prev) => (page === 1 ? newDogNames : [...prev, ...newDogNames])); // Cập nhật danh sách tên chó

        // Kiểm tra nếu số lượng tên ít hơn 16 hoặc là trang cuối
        if (newDogNames.length < 16 || page * 16 >= result.totalCount) {
          // Nếu ít hơn 16 thẻ, không còn thẻ để load hoặc đây là trang cuối
          setHasMore(false);
        }
      } else {
        setDogNames([]); // Nếu không có kết quả, gán mảng rỗng
        setHasMore(false); // Nếu không có kết quả, không còn thẻ để load
      }
    } catch (error) {
      console.error("Error fetching dog names:", error);
      setDogNames([]); // Nếu có lỗi, gán mảng rỗng
      setHasMore(false); // Nếu có lỗi, không còn thẻ để load
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi bấm vào category
  const handleButtonClick = (option) => {
    setSelectedOption(option === selectedOption ? null : option); // Nếu nút đã chọn, bỏ chọn, nếu chưa chọn thì chọn
    setPage(1); // Reset lại trang khi chọn category mới
    fetchDogNames(option === selectedOption ? null : option, 1); // Tải lại tên theo category
    setHasMore(true); // Đặt lại trạng thái có thêm thẻ để load
  };

  const icons = {
    Baby: <PiBaby className="w-10 h-10" />,
    Celebrity: <LuSparkles className="w-10 h-10" />,
    Cute: <HiOutlineHeart className="w-10 h-10" />,
    Superhero: <GiBatMask className="w-10 h-10" />,
    Trendy: <FaRegGrinStars className="w-10 h-10" />,
    Videogame: <IoGameControllerOutline className="w-10 h-10" />,
    Movie: <PiFilmSlateDuotone className="w-10 h-10" />,
    Silly: <GiClown className="w-10 h-10" />
  };

  useEffect(() => {
    fetchDogNames(); // Lấy danh sách tên chó khi trang load
  }, []);

  // Hàm xử lý load thêm thẻ
  const handleLoadMore = () => {
    setPage((prev) => prev + 1); // Tăng trang hiện tại lên 1
    fetchDogNames(selectedOption, page + 1); // Lấy thêm dữ liệu cho trang tiếp theo
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex justify-center p-6">
        <div className="w-full max-w-5xl bg-white p-8 rounded-lg">
          <h2 className="text-3xl font-semibold mb-6">Search by Category</h2>
          <div className="grid grid-cols-4 gap-6 mb-6">
            {['Baby', 'Celebrity', 'Cute', 'Superhero', 'Trendy', 'Videogame', 'Movie', 'Silly'].map((option) => (
              <button
                key={option}
                onClick={() => handleButtonClick(option)}
                className={`p-5 rounded-lg border flex flex-col items-center justify-center 
                  ${selectedOption === option 
                    ? 'bg-teal-500 text-white'  // Nút đã chọn, giữ nguyên
                    : 'bg-white text-teal-500 border-teal-500 hover:bg-gray-300'}  // Nút chưa chọn, hover làm nền xám
                `}
              >
                <div className="mb-2">{icons[option]}</div>
                <span className="capitalize text-xl">{option}</span>
              </button>
            ))}
          </div>

          {/* Divider giữa Category và Tên */}
          <div className="border-t-2 border-gray-300 my-6"></div> {/* Divider có viền mỏng */}

          {/* Danh sách tên chó */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              {dogNames.length > 0 ? (
                <>
                  <h3 className="text-2xl font-semibold mb-4">Name:</h3> {/* Dòng "Name:" */}
                  <div className="grid grid-cols-4 gap-4">
                    {dogNames.map((dogName) => (
                      <div
                        key={dogName._id}
                        className="flex justify-center items-center p-3 border text-xs text-gray-600" // Chữ nhỏ hơn và màu xám
                      >
                        {dogName.name}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-center text-lg text-gray-600">No dog names found.</p>
              )}
            </div>
          )}

          {/* Nút Load More */}
          {hasMore && !loading && (
            <div className="flex justify-center mt-6">
              <button
                className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                onClick={handleLoadMore}
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NamePage;
