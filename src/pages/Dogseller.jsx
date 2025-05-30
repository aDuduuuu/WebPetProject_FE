import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import ProvinceFilter from '../components/ProvinceFilter';
import clientApi from '../client-api/rest-client';
import { useTranslation } from 'react-i18next';

const DogSeller = () => {
  const [dogSellerList, setDogSellerList] = useState([]);
  const [page, setPage] = useState(1);
  const dogSellerPerPage = 8;
  const [totalDogSellers, setTotalDogSellers] = useState(0);
  const [filters, setFilters] = useState({ province: '', breeds: [] });
  const [searchKeyword, setSearchKeyword] = useState('');
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchDogSellers = async () => {
      try {
        let result;

        if (searchKeyword.trim() !== '') {
          const searchApi = clientApi.service('dogsellers/search/by-name');
          result = await searchApi.find({
            keyword: searchKeyword,
            page,
            limit: dogSellerPerPage
          });
        } else {
          const dogSellerApi = clientApi.service('dogsellers');
          result = await dogSellerApi.find({
            page,
            limit: dogSellerPerPage,
            location: filters.province,
            breed: filters.breeds.join(','),
          });
        }

        if (result && (result.EC === 0 || result.EC === 200)) {
          const sellers = Array.isArray(result.DT) ? result.DT : [];
          setDogSellerList(sellers);
          setTotalDogSellers(result.totalDogSellers || 0);
        } else {
          setDogSellerList([]);
          setTotalDogSellers(0);
        }
      } catch (error) {
        console.error('Error fetching dog sellers:', error);
        setDogSellerList([]);
        setTotalDogSellers(0);
      }
    };

    fetchDogSellers();
  }, [page, filters, searchKeyword]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    setPage(1);
  };

  const totalPages = Math.ceil(totalDogSellers / dogSellerPerPage);

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
    <div className="dog-seller-container flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        {/* Bộ lọc + tìm kiếm */}
        <div className="w-1/4 bg-white p-6 shadow-lg">
          <ProvinceFilter onFilter={handleFilterChange} type="dogsellers" />

          {/* Ô tìm kiếm */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">
              {t('searchDogSellerTitle')}
            </h4>
            <input
              type="text"
              value={searchKeyword}
              onChange={handleSearchChange}
              placeholder={t('searchTrainerPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Danh sách dog sellers */}
        <div className="w-3/4 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">
              {t('spaList.title3')}
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
                    action="update"
                    data={dogSeller}
                  />
                ))}
              </div>
              {renderPagination()}
            </>
          ) : (
            <p className="text-lg text-gray-600 mt-4">No Dog Sellers found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DogSeller;
