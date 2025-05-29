import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import ProvinceFilter from '../components/ProvinceFilter';
import clientApi from '../client-api/rest-client';
import { useTranslation } from 'react-i18next';

const Spa = () => {
  const [spaList, setSpaList] = useState([]);
  const [page, setPage] = useState(1);
  const spaPerPage = 8;
  const [totalSpas, setTotalSpas] = useState(0);
  const [filters, setFilters] = useState({ province: '', services: [] });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [userRole, setUserRole] = useState(null);
  const { t, i18n } = useTranslation();

  // Lấy role người dùng
  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  // Gọi API lấy danh sách spa
  useEffect(() => {
    const fetchSpas = async () => {
      try {
        let result;
        if (searchKeyword.trim() !== '') {
          const spa = clientApi.service('spas-search/by-name');
          result = await spa.find({
            keyword: searchKeyword,
            page,
            limit: spaPerPage,
          });
        } else {
          const spa = clientApi.service('spas');
          result = await spa.find({
            page,
            limit: spaPerPage,
            location: filters.province,
            services: filters.services.join(','),
          });
        }

        if (result && result.EC === 0) {
          const data = Array.isArray(result.DT) ? result.DT : result.DT;
          setSpaList(data);
          setTotalSpas(result.totalSpas || 0);
        } else {
          setSpaList([]);
          setTotalSpas(0);
        }
      } catch (error) {
        console.error('Error fetching spas:', error);
        setSpaList([]);
        setTotalSpas(0);
      }
    };

    fetchSpas();
  }, [page, filters, searchKeyword]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    setPage(1);
  };

  const totalPages = Math.ceil(totalSpas / spaPerPage);

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
          « {t('spaList.prev')}
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
          {t('spaList.next')} »
        </button>
      </div>
    );
  };

  return (
    <div className="spa-container flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        {/* Bộ lọc */}
        <div className="w-1/4 bg-white p-6 shadow-lg">
          <ProvinceFilter onFilter={handleFilterChange} type="spa" />

          {/* Ô tìm kiếm tên spa */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('spaList.searchLabel')}</label>
            <input
              type="text"
              value={searchKeyword}
              onChange={handleSearchChange}
              placeholder={t('spaList.searchPlaceholder')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Danh sách spa */}
        <div className="w-3/4 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">
              {t('spaList.title')}
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
          {spaList.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {spaList.map((spa) => (
                  <Card
                    key={spa._id}
                    id={spa._id}
                    image={spa.image || 'https://via.placeholder.com/150?text=Not+Available'}
                    name={spa.name}
                    location={spa.location}
                    services={spa.services}
                    contactInfo={spa.contactInfo}
                    type="spas"
                    action="update"
                    description={spa.description}
                    role={userRole}
                    workingHours={spa.workingHours} 
                  />
                ))}
              </div>

              {/* Phân trang */}
              {renderPagination()}
            </>
          ) : (
            <p className="text-lg text-gray-600 mt-4">{t('spaList.noResults')}</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Spa;
