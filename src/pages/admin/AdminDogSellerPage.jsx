import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import clientApi from '../../client-api/rest-client';
import Card from '../../components/Card';

const AdminDogSellerPage = () => {
  const [dogSellerList, setDogSellerList] = useState([]);
  const [page, setPage] = useState(1);
  const dogSellerPerPage = 8;
  const [totalDogSellers, setTotalDogSellers] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();
  const primaryColor = '#184440';

  useEffect(() => {
    const fetchDogSellers = async () => {
      try {
        let result;

        if (searchKeyword.trim() !== '') {
          const searchApi = clientApi.service('dogsellers/search/by-name');
          result = await searchApi.find({
            keyword: searchKeyword,
            page,
            limit: dogSellerPerPage,
          });
        } else {
          const dogSellerApi = clientApi.service('dogsellers');
          result = await dogSellerApi.find({
            page,
            limit: dogSellerPerPage,
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
  }, [page, searchKeyword]);

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    setPage(1);
  };

  const totalPages = Math.ceil(totalDogSellers / dogSellerPerPage);

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
              🐶 Dog Seller Management
            </h2>
            <div className="inline-block bg-[#184440] text-white text-lg font-semibold px-4 py-1 rounded-md shadow">
              Total sellers: {totalDogSellers}
            </div>
          </div>
          <button
            onClick={() => navigate('/dogsellers/add')}
            className="text-white px-4 py-2 rounded-lg hover:bg-[#145c54]"
            style={{ backgroundColor: primaryColor }}
          >
            + Add New Dog Seller
          </button>
        </div>

        {/* Tìm kiếm theo tên */}
        <div className="mb-6">
          <input
            type="text"
            value={searchKeyword}
            onChange={handleSearchChange}
            placeholder="Search dog seller by name..."
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Danh sách seller */}
        {dogSellerList.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
    </AdminLayout>
  );
};

export default AdminDogSellerPage;
