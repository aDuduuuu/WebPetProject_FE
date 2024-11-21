import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import ProvinceFilter from '../components/ProvinceFilter';
import clientApi from '../client-api/rest-client';
import axios from 'axios';

const Spa = () => {
  const [spaList, setSpaList] = useState([]);
  const [page, setPage] = useState(1);
  const spaPerPage = 16;
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({ province: '', services: [] });
  const [userRole, setUserRole] = useState(null);  // Trạng thái để lưu role người dùng
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa và lấy role
    const fetchUserRole = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        console.log("loggedin");
        try {
          const response = await axios.get('/api/users', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const role = response.data.role; // Giả sử backend trả về role
          setUserRole(role);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserRole(null);  // Nếu không lấy được dữ liệu người dùng, set role là null
        }
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchSpas = async () => {
      const params = { 
        page, 
        limit: spaPerPage, 
        location: filters.province, 
        services: filters.services.join(',') // Chuyển mảng thành chuỗi
      };
    
      try {
        let spa = clientApi.service('spas');
        console.log("Sending request with params:", params); // Debug params
        const result = await spa.find(params);
        if (result && result.EC === 0) {
          const newSpas = Array.isArray(result.DT) 
            ? result.DT 
            : result.DT.spas || [];
          if (newSpas.length < spaPerPage) {
            setHasMore(false);
          }
          setSpaList((prevList) => (page === 1 ? newSpas : [...prevList, ...newSpas]));
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching spas:", error);
        setHasMore(false);
      }
    };
    fetchSpas();
  }, [page, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    setHasMore(true);
    setSpaList([]);
  };

  return (
    <div className="spa-container flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <div className="w-1/4 bg-white p-6 shadow-lg">
          <ProvinceFilter onFilter={handleFilterChange} type="spa" />
        </div>
        <div className="w-3/4 p-6">
          {spaList.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {spaList.map((spa) => (
                  <Card
                    key={spa._id}
                    id={spa._id}
                    image={spa.image || 'https://via.placeholder.com/150?text=Not+Available'}
                    name={spa.name}
                    location={`${spa.location.province || ''}, ${spa.location.district || ''}`}
                    nameClass="text-lg font-semibold text-teal-500"
                    type="spas"
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
            <p className="text-lg text-gray-600">No Spas found.</p>
          )}

          {/* Hiển thị nút "Thêm Spa" nếu người dùng là admin */}
          {userRole === 'admin' && (
            <div className="flex justify-center mt-6">
              <button className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600">
                Thêm Spa
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Spa;
