import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import ProvinceFilter from '../components/ProvinceFilter';
import clientApi from '../client-api/rest-client';

const Spa = () => {
  const [spaList, setSpaList] = useState([]);
  const [page, setPage] = useState(1);
  const spaPerPage = 16;
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({ province: '', services: [] });
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const fetchSpas = async () => {
      const params = { 
        page, 
        limit: spaPerPage, 
        location: filters.province, 
        services: filters.services.join(',') // Chuyển mảng thành chuỗi
      };
      console.log('Fetching spas with params:', params); // Debug params
      try {
        let spa = clientApi.service('spas');
        console.log("Sending request with params:", params); // Debug params
        const result = await spa.find(params);
        console.log('API result:', result); // Debug kết quả API
        if (result && result.EC === 0) {
          const newSpas = Array.isArray(result.DT) 
            ? result.DT 
            : result.DT.spas || []; // Nếu DT không chứa trainers, trả về mảng rỗng
    //      const newSpas = result.DT.spas || [];
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
        </div>
      </div>
    </div>
  );
};

export default Spa;
