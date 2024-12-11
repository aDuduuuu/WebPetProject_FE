import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import ProvinceFilter from '../components/ProvinceFilter';
import clientApi from '../client-api/rest-client';

const DogSeller = () => {
  const [dogSellerList, setDogSellerList] = useState([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ province: '', breeds: [] });
  const dogSellerPerPage = 16;
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchDogSellers = async () => {
      const params = {
        page,
        limit: dogSellerPerPage,
        location: filters.province,
        breed: filters.breeds.join(','),
      };
      try {
        let dogSeller = clientApi.service('dogsellers');
        const result = await dogSeller.find(params);
        if (result && (result.EC === 0 || result.EC === 200)) {
          const newDogSellers = Array.isArray(result.DT) ? result.DT : [];
          if (newDogSellers.length < dogSellerPerPage) {
            setHasMore(false);
          }
          setDogSellerList((prevList) => (page === 1 ? newDogSellers : [...prevList, ...newDogSellers]));
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error:', error);
        setHasMore(false);
      }
    };
    fetchDogSellers();
  }, [page, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    setHasMore(true);
    setDogSellerList([]);
  };

  return (
    <div className="dog-seller-container flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <div className="w-1/4 bg-white p-6 shadow-lg">
          <ProvinceFilter onFilter={handleFilterChange} type="dogsellers" />
        </div>
        <div className="w-3/4 p-6">
          {dogSellerList.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {dogSellerList.map((dogSeller) => (
                  <Card
                    key={dogSeller._id}
                    id={dogSeller._id}
                    image={dogSeller.image || 'https://via.placeholder.com/150?text=Not+Available'}
                    name={dogSeller.name}
                    location={dogSeller.location}
                    nameClass="text-lg font-semibold text-teal-500"
                    breeds={dogSeller.breeds}
                    type="dogsellers"
                    action="update" // Pass 'update' action for editing
                    data={dogSeller} // Pass full dogSeller data to Card
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
            <p className="text-lg text-gray-600">No Dog Sellers found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DogSeller;
