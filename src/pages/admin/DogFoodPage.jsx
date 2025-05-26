import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import clientApi from '../../client-api/rest-client';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const DogFoodPage = () => {
  const navigate = useNavigate();
  const [dogFoods, setDogFoods] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFoods, setTotalFoods] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 8;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const primaryColor = '#184440';

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'manager') {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    fetchDogFoods();
  }, [currentPage, searchTerm]);

  const fetchDogFoods = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await clientApi.service('dogfoods').find({
        page: currentPage,
        limit: itemsPerPage,
        name: searchTerm,
      });

      if (response.EC === 0) {
        setDogFoods(response.DT);
        setTotalFoods(response.totalFoods || 0);
      } else {
        setError(response.EM || 'Failed to fetch dog foods');
      }
    } catch (err) {
      setError('Server error while fetching dog foods');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalFoods / itemsPerPage);

  const handleViewDetails = (foodId) => {
    navigate(`/dashboard/dog-foods/detail/${foodId}`);
  };

  const handleDelete = async (foodId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    try {
      const response = await clientApi.service('dogfoods').delete(foodId);
      if (response.EC === 0) {
        Swal.fire('Deleted!', 'Dog food has been deleted.', 'success');
        fetchDogFoods();
      } else {
        Swal.fire('Failed', response.EM || 'Failed to delete dog food', 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Something went wrong while deleting.', 'error');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight mb-1">
            🍖 Dog Foods Management
          </h2>
          <div className="inline-block bg-[#184440] text-white text-lg font-semibold px-4 py-1 rounded-md shadow">
            Total foods: {totalFoods}
          </div>
        </div>
        <button
          onClick={() => navigate('/dashboard/dog-foods/add')}
          className="text-white px-4 py-2 rounded-lg hover:bg-[#145c54]"
          style={{ backgroundColor: primaryColor }}
        >
          + Add New Food
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by food name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#184440]"
        />
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : dogFoods.length === 0 ? (
          <p className="text-gray-600 italic">No dog food entries found. Please add some.</p>
        ) : (
          <>
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="border px-4 py-2">Image</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Category</th>
                  <th className="border px-4 py-2">Safe?</th>
                  <th className="border px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dogFoods.map((food) => (
                  <tr key={food._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">
                      <img src={food.image} alt={food.name} className="w-16 h-16 object-cover rounded" />
                    </td>
                    <td className="border px-4 py-2 font-semibold">{food.name}</td>
                    <td className="border px-4 py-2">{food.category || 'N/A'}</td>
                    <td className="border px-4 py-2">
                      {food.isSafe ? (
                        <span className="text-green-600 font-bold">Yes</span>
                      ) : (
                        <span className="text-red-600 font-bold">No</span>
                      )}
                    </td>
                    <td className="border px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(food._id)}
                        className="p-2 rounded bg-[#184440] text-white hover:bg-[#145c54]"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/dog-foods/update/${food._id}`)}
                        className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(food._id)}
                        className="p-2 rounded bg-red-600 text-white hover:bg-red-700"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-white rounded-lg disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
              >
                Prev
              </button>
              <span className="text-gray-700 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-white rounded-lg disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default DogFoodPage;
