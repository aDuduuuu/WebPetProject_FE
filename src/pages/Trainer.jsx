import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import ProvinceFilter from '../components/ProvinceFilter';
import clientApi from '../client-api/rest-client';

const Trainer = () => {
  const [trainerList, setTrainerList] = useState([]); // Danh sách trainer
  const [page, setPage] = useState(1); // Trang hiện tại
  const trainersPerPage = 16; // Số trainer mỗi lần tải
  const [hasMore, setHasMore] = useState(true); // Trạng thái còn dữ liệu
  const [filters, setFilters] = useState({ province: '', services: [] }); // Bộ lọc
  const isFirstLoad = useRef(true); // Đánh dấu lần tải đầu tiên

  useEffect(() => {
    const fetchTrainers = async () => {
      const params = { 
        page, 
        limit: trainersPerPage, 
        location: filters.province, 
        services: filters.services.join(',') // Chuyển mảng services thành chuỗi phân cách bằng dấu phẩy
      };
      console.log('Fetching trainers with params:', params); // Debug params
      try {
        let trainer = clientApi.service('trainers');
        const result = await trainer.find(params);
        console.log('API result:', result); // Debug kết quả API

        if (result && result.EC === 0) {
          // Kiểm tra và lấy danh sách trainer từ `result.DT`
          const newTrainers = Array.isArray(result.DT) 
            ? result.DT 
            : result.DT.trainers || []; // Nếu DT không chứa trainers, trả về mảng rỗng
          
          if (newTrainers.length < trainersPerPage) {
            setHasMore(false); // Không còn dữ liệu để tải thêm
          }

          // Map lại dữ liệu nếu cần
          const mappedTrainers = newTrainers.map(trainer => ({
            _id: trainer._id || trainer.id, // Đảm bảo có `_id`
            name: trainer.name || "Unknown Trainer",
            location: trainer.location || { province: "Unknown", district: "Unknown" },
            image: trainer.image || "https://via.placeholder.com/150?text=Not+Available"
          }));

          setTrainerList((prevList) => (page === 1 ? mappedTrainers : [...prevList, ...mappedTrainers]));
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching trainers:', error);
        setHasMore(false);
      }
    };

    fetchTrainers();
  }, [page, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset về trang đầu tiên
    setHasMore(true); // Reset trạng thái có thêm dữ liệu
    setTrainerList([]); // Clear danh sách hiện tại
  };

  return (
    <div className="trainer-container flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <div className="w-1/4 bg-white p-6 shadow-lg">
          <ProvinceFilter onFilter={handleFilterChange} type="trainer" />
        </div>
        <div className="w-3/4 p-6">
          {trainerList.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {trainerList.map((trainer) => (
                  <Card
                    key={trainer._id}
                    id={trainer._id}
                    image={trainer.image}
                    name={trainer.name}
                    location={`${trainer.location.province || ''}, ${trainer.location.district || ''}`}
                    nameClass="text-lg font-semibold text-teal-500"
                    type="trainers"
                  />
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <button
                    className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-lg text-gray-600">No Trainers found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trainer;
