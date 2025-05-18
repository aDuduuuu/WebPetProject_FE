import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import clientApi from '../../client-api/rest-client';
import Card from '../../components/Card';

const AdminTrainerPage = () => {
  const [trainerList, setTrainerList] = useState([]);
  const [page, setPage] = useState(1);
  const trainersPerPage = 8;
  const [totalTrainers, setTotalTrainers] = useState(0);
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
          const trainerService = clientApi.service('trainers');
          result = await trainerService.find({
            page,
            limit: trainersPerPage,
            location: filters.province,
            services: filters.services.join(','),
          });
        }

        if (result && result.EC === 0) {
          const data = Array.isArray(result.DT) ? result.DT : [];
          setTrainerList(data);
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

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const totalPages = Math.ceil(totalTrainers / trainersPerPage);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-8 space-x-2">
        <button
          className="px-3 py-1 border rounded bg-white text-teal-600 border-teal-500 hover:bg-teal-100"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          « Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight mb-1">
              🏋️ Trainer Management
            </h2>
            <div className="inline-block bg-[#184440] text-white text-lg font-semibold px-4 py-1 rounded-md shadow">
              Total trainers: {totalTrainers}
            </div>
          </div>
          <button
            onClick={() => navigate('/trainers/add')}
            className="text-white px-4 py-2 rounded-lg hover:bg-[#145c54]"
            style={{ backgroundColor: primaryColor }}
          >
            + Add New Trainer
          </button>
        </div>

        {/* Ô tìm kiếm */}
        <div className="mb-6">
          <input
            type="text"
            value={searchKeyword}
            onChange={handleSearchChange}
            placeholder="Search trainer by name..."
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Danh sách trainer */}
        {trainerList.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                />
              ))}
            </div>
            {renderPagination()}
          </>
        ) : (
          <p className="text-lg text-gray-600 mt-4">No Trainers found.</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTrainerPage;
