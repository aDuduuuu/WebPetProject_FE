import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';

const DogBreedPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'manager') {
      navigate('/');
    }
  }, []);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">🐾 Dog Breeds Management</h2>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
          + Add New Breed
        </button>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <p className="text-gray-600">Here you can view, add, edit, or delete dog breeds.</p>
        {/* TODO: Replace with breed list table or card grid */}
        <div className="mt-4 text-sm text-gray-500 italic">
          No dog breeds found. Please add some.
        </div>
      </div>
    </AdminLayout>
  );
};

export default DogBreedPage;
