import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import ProvinceFilter from '../components/ProvinceFilter';
import clientApi from '../client-api/rest-client';

const Trainer = () => {
  const [trainerList, setTrainerList] = useState([]);
  const [page, setPage] = useState(1);
  const trainersPerPage = 16;
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({ province: '', services: [] });

  useEffect(() => {
    const fetchTrainers = async () => {
      const params = {
        page,
        limit: trainersPerPage,
        location: filters.province,
        services: filters.services.join(','),
      };
      try {
        let trainer = clientApi.service('trainers');
        const result = await trainer.find(params);

        if (result && result.EC === 0) {
          const newTrainers = Array.isArray(result.DT)
            ? result.DT
            : result.DT.trainers || [];

          if (newTrainers.length < trainersPerPage) {
            setHasMore(false);
          }

          setTrainerList((prevList) =>
            page === 1 ? newTrainers : [...prevList, ...newTrainers]
          );
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
    setPage(1);
    setHasMore(true);
    setTrainerList([]);
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
                    location={trainer.location}
                    services={trainer.services}
                    contactInfo={trainer.contactInfo}
                    description={trainer.description}
                    type="trainers"
                    action="update"
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
      <Footer />
    </div>
  );
};

export default Trainer;
