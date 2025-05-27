import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import clientApi from '../../client-api/rest-client';
import './DogFoodPage.css'; // Flip card CSS

const DogFoodPage = () => {
  const [dogFoods, setDogFoods] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFoods, setTotalFoods] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const itemsPerPage = 8;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDogFoods();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchDogFoods = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await clientApi.service('dogfoods').find({
        page: currentPage,
        limit: itemsPerPage,
        name: searchTerm,
        category: selectedCategory,
      });

      if (response.EC === 0) {
        setDogFoods(response.DT || []);
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4 text-center text-green-800">
          🍖 Dog Food Guide
        </h1>

        {/* Search and Filter */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search by food name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#184440]"
          />
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#184440]"
          >
            <option value="">All Categories</option>
            <option value="Meat">Meat</option>
            <option value="Vegetable">Vegetable</option>
            <option value="Fruit">Fruit</option>
            <option value="Fish">Fish</option>
            <option value="Snack">Snack</option>
            <option value="Grain">Grain</option>
            <option value="Sweets">Sweets</option>
            <option value="Spice">Spice</option>
            <option value="Supplement">Supplement</option>
            <option value="Protein">Protein</option>
          </select>
        </div>

        {/* Result */}
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <>
            {dogFoods.length === 0 ? (
              <p className="text-center text-gray-600 italic">No dog food found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {dogFoods.map((food) => (
                  <div key={food._id} className="flip-card">
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="p-4 text-center">
                          <h2 className="text-lg font-semibold text-gray-800">{food.name}</h2>
                        </div>
                      </div>
                      <div className="flip-card-back p-4">
                        <h2 className="text-xl font-bold mb-2">{food.name}</h2>
                        <p><strong>Safe:</strong> {food.isSafe ? '✅ Yes' : '❌ No'}</p>
                        <p><strong>Category:</strong> {food.category || 'N/A'}</p>
                        <p><strong>Effects:</strong> {food.effects}</p>
                        {food.note && <p><strong>Note:</strong> {food.note}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10 flex-wrap">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-md bg-[#184440] text-white disabled:opacity-50"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-md border ${
                        page === currentPage
                          ? 'bg-green-800 text-white font-bold'
                          : 'bg-white text-gray-700 hover:bg-green-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-md bg-[#184440] text-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default DogFoodPage;
