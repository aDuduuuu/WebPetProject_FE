import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import ProvinceFilter from '../components/ProvinceFilter';
import clientApi from '../client-api/rest-client';
import { useTranslation } from 'react-i18next';

const Trainer = () => {
  const [trainerList, setTrainerList] = useState([]);
  const [page, setPage] = useState(1);
  const trainersPerPage = 8;
  const [totalTrainers, setTotalTrainers] = useState(0);
  const [filters, setFilters] = useState({ province: '', services: [] });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [userRole, setUserRole] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        let result;

        if (searchKeyword.trim() !== '') {
          const trainerSearch = clientApi.service('trainers/search/by-name');
          result = await trainerSearch.find({
            keyword: searchKeyword,
            page,
            limit: trainersPerPage,
          });
        } else {
          const trainerApi = clientApi.service('trainers');
          result = await trainerApi.find({
            page,
            limit: trainersPerPage,
            location: filters.province,
            services: filters.services.join(','),
          });
        }

        if (result && result.EC === 0) {
          const trainers = Array.isArray(result.DT) ? result.DT : [];
          setTrainerList(trainers);
          setTotalTrainers(result.totalTrainers || 0);
        } else {
          setTrainerList([]);
          setTotalTrainers(0);
        }
      } catch (error) {
        console.error('Error fetching trainers:', error);
        setTrainerList([]);
        setTotalTrainers(0);
      }
    };

    fetchTrainers();
  }, [page, filters, searchKeyword]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    setPage(1);
  };

  const totalPages = Math.ceil(totalTrainers / trainersPerPage);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="flex justify-center mt-8 space-x-2">
        <button
          className="px-3 py-1 border rounded bg-white text-teal-600 border-teal-500 hover:bg-teal-100"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          « Prev
        </button>

        {pageNumbers.map((num) => (
          <button
            key={num}
            className={`px-3 py-1 border rounded ${
              page === num
                ? 'bg-teal-500 text-white'
                : 'bg-white text-teal-600 border-teal-500 hover:bg-teal-100'
            }`}
            onClick={() => setPage(num)}
          >
            {num}
          </button>
        ))}

        <button
          className="px-3 py-1 border rounded bg-white text-teal-600 border-teal-500 hover:bg-teal-100"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next »
        </button>
      </div>
    );
  };

  return (
    <div className="trainer-container flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        {/* Bộ lọc + tìm kiếm */}
        <div className="w-1/4 bg-white p-6 shadow-lg">
          <ProvinceFilter onFilter={handleFilterChange} type="trainer" />

          {/* Ô tìm kiếm - cập nhật giao diện giống admin */}
          <div className="mt-6">
            <input
              type="text"
              value={searchKeyword}
              onChange={handleSearchChange}
              placeholder={t('searchTrainerPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Danh sách trainer */}
        <div className="w-3/4 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">
              {t('spaList.title2')}
            </h1>

            <div className="flex space-x-2">
              <button
                onClick={() => i18n.changeLanguage('en')}
                className="px-3 py-1 border border-teal-500 text-teal-700 rounded text-sm hover:bg-teal-100"
              >
                EN
              </button>
              <button
                onClick={() => i18n.changeLanguage('vi')}
                className="px-3 py-1 border border-teal-500 text-teal-700 rounded text-sm hover:bg-teal-100"
              >
                VI
              </button>
            </div>
          </div>
          {trainerList.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {trainerList.map((trainer) => (
                  <Card
                    key={trainer._id}
                    id={trainer._id}
                    image={trainer.image || 'https://via.placeholder.com/150?text=Not+Available'}
                    name={trainer.name}
                    location={trainer.location}
                    services={trainer.services}
                    contactInfo={trainer.contactInfo}
                    description={trainer.description}
                    type="trainers"
                    action="update"
                    role={userRole}
                    workingHours={trainer.workingHours} 
                  />
                ))}
              </div>
              {renderPagination()}
            </>
          ) : (
            <p className="text-lg text-gray-600 mt-4">No Trainers found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Trainer;
