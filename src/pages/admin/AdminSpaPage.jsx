import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useNavigate } from 'react-router-dom';
import clientApi from '../../client-api/rest-client';
import Card from '../../components/Card';

const AdminSpaPage = () => {
  const [spaList, setSpaList] = useState([]);
  const [page, setPage] = useState(1);
  const spaPerPage = 10;
  const [totalSpas, setTotalSpas] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filters, setFilters] = useState({ province: '', services: [] });
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const primaryColor = '#184440';

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  useEffect(() => {
    const fetchSpas = async () => {
      try {
        let result;

        if (searchKeyword.trim() !== '') {
          const spaSearch = clientApi.service('spas-search/by-name');
          result = await spaSearch.find({
            keyword: searchKeyword,
            page,
            limit: spaPerPage,
          });
        } else {
          const spaService = clientApi.service('spas');
          result = await spaService.find({
            page,
            limit: spaPerPage,
            location: filters.province,
            services: filters.services.join(','),
          });
        }

        if (result && result.EC === 0) {
          const data = Array.isArray(result.DT) ? result.DT : [];
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

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
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
    <AdminLayout>
      <div className="p-6">
        {/* Tiêu đề và nút thêm */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight mb-1">
              🧖 Spa Management
            </h2>
            <div className="inline-block bg-[#184440] text-white text-lg font-semibold px-4 py-1 rounded-md shadow">
              Total spas: {totalSpas}
            </div>
          </div>
          <button
            onClick={() => navigate('/spas/add')}
            className="text-white px-4 py-2 rounded-lg hover:bg-[#145c54]"
            style={{ backgroundColor: primaryColor }}
          >
            + Add New Spa
          </button>
        </div>

        {/* Ô tìm kiếm */}
        <div className="mb-6">
          <input
            type="text"
            value={searchKeyword}
            onChange={handleSearchChange}
            placeholder="Search spa by name..."
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Danh sách spa */}
        {spaList.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                />
              ))}
            </div>
            {renderPagination()}
          </>
        ) : (
          <p className="text-lg text-gray-600 mt-4">No Spas found.</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSpaPage;
