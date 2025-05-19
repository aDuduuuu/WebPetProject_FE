import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import clientApi from '../../client-api/rest-client';
import { message } from 'antd';
import {
  GiBatMask, GiClown,
} from 'react-icons/gi';
import {
  HiOutlineHeart,
} from 'react-icons/hi';
import {
  PiBaby, PiFilmSlateDuotone,
} from 'react-icons/pi';
import {
  IoGameControllerOutline,
} from 'react-icons/io5';
import {
  LuSparkles,
} from 'react-icons/lu';
import {
  FaRegGrinStars,
} from 'react-icons/fa';

const categoryList = ['Baby', 'Celebrity', 'Cute', 'Superhero', 'Trendy', 'Videogame', 'Movie', 'Silly'];

const icons = {
  Baby: <PiBaby className="w-6 h-6" />,
  Celebrity: <LuSparkles className="w-6 h-6" />,
  Cute: <HiOutlineHeart className="w-6 h-6" />,
  Superhero: <GiBatMask className="w-6 h-6" />,
  Trendy: <FaRegGrinStars className="w-6 h-6" />,
  Videogame: <IoGameControllerOutline className="w-6 h-6" />,
  Movie: <PiFilmSlateDuotone className="w-6 h-6" />,
  Silly: <GiClown className="w-6 h-6" />,
};

const AdminNamePage = () => {
  const [dogNames, setDogNames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalNames, setTotalNames] = useState(0);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Baby');
  const namesPerPage = 16;

  const fetchNames = async (category = '', page = 1) => {
    try {
      const res = await clientApi.service('dognames').find({
        category,
        page,
        limit: namesPerPage,
      });
      if (res && res.EC === 0) {
        setDogNames(res.DT || []);
        setTotalNames(res.totalCount || res.DT.length);
      } else {
        setDogNames([]);
        setTotalNames(0);
      }
    } catch (error) {
      console.error('Error fetching dog names:', error);
    }
  };

  const handleAddName = async () => {
    if (!newName.trim()) return message.error('Please enter a name');
    try {
      const res = await clientApi.service('dognames').create({
        name: newName.trim(),
        category: newCategory,
      });
      if (res.EC === 0) {
        message.success('Name added successfully');
        setNewName('');
        fetchNames(selectedCategory, page);
      } else {
        message.error('Failed to add name');
      }
    } catch (err) {
      message.error('Error adding name');
    }
  };

  useEffect(() => {
    fetchNames(selectedCategory, page);
  }, [selectedCategory, page]);

  const totalPages = Math.ceil(totalNames / namesPerPage);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#184440] mb-1">🐶 Dog Name Management</h2>
          <p className="text-gray-600">Manage dog names by category.</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categoryList.map((cat) => (
            <button
              key={cat}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg 
                ${selectedCategory === cat ? 'bg-teal-500 text-white' : 'bg-white border-teal-500 text-teal-600 hover:bg-gray-100'}`}
              onClick={() => {
                setSelectedCategory(cat === selectedCategory ? '' : cat);
                setPage(1);
              }}
            >
              {icons[cat]} <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Add Name Form */}
        <div className="bg-white p-4 rounded shadow mb-8 flex items-center gap-4">
          <select
            className="border p-2 rounded w-1/4"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          >
            {categoryList.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="text"
            className="border p-2 rounded w-1/3"
            placeholder="Enter new dog name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <button
            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
            onClick={handleAddName}
          >
            Add Name
          </button>
        </div>

        {/* Name List */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {dogNames.map((item) => (
            <div key={item._id} className="border rounded p-2 text-center text-gray-700 bg-white shadow-sm">
              {item.name}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
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
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminNamePage;
