import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import clientApi from '../../client-api/rest-client';
import './DogFoodPage.css'; // Flip card CSS

const DogFoodPage = () => {
  const { t, i18n } = useTranslation();

  const [dogFoods, setDogFoods] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFoods, setTotalFoods] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const itemsPerPage = 8;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [safetyFilter, setSafetyFilter] = useState('');

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
        setError(response.EM || t('fetchError'));
      }
    } catch (err) {
      setError(t('serverError'));
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

  const categories = [
    'Meat', 'Vegetable', 'Fruit', 'Fish', 'Snack',
    'Grain', 'Sweets', 'Spice', 'Supplement', 'Protein', 'Nuts'
  ];

  const filteredFoods = dogFoods.filter((food) => {
    if (safetyFilter === 'safe') return food.isSafe;
    if (safetyFilter === 'unsafe') return !food.isSafe;
    return true;
  });

  return (
    <>
      <Header />
      <div className="flex justify-end px-6 mt-4">
        <div className="flex space-x-2">
          <button
            onClick={() => i18n.changeLanguage("en")}
            className="px-3 py-1 bg-[#16423C] text-white rounded shadow hover:bg-[#1f5e52] transition"
          >
            EN
          </button>
          <button
            onClick={() => i18n.changeLanguage("vi")}
            className="px-3 py-1 bg-[#16423C] text-white rounded shadow hover:bg-[#1f5e52] transition"
          >
            VI
          </button>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4 text-center text-green-800">
          🍖 {t('dogFoodGuide')}
        </h1>

        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#184440]"
          />
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#184440]"
          >
            <option value="">{t('allCategories')}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{t(cat)}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-center gap-4 mb-8">
            <button
              className={`px-4 py-2 rounded-lg border ${
                safetyFilter === '' ? 'bg-[#16423C] text-white' : 'bg-white text-[#16423C]'
              }`}
              onClick={() => setSafetyFilter('')}
            >
              {t('all')}
            </button>
            <button
              className={`px-4 py-2 rounded-lg border ${
                safetyFilter === 'safe' ? 'bg-green-700 text-white' : 'bg-white text-green-700'
              }`}
              onClick={() => setSafetyFilter('safe')}
            >
              ✅ {t('safeFoods')}
            </button>
            <button
              className={`px-4 py-2 rounded-lg border ${
                safetyFilter === 'unsafe' ? 'bg-red-700 text-white' : 'bg-white text-red-700'
              }`}
              onClick={() => setSafetyFilter('unsafe')}
            >
              ❌ {t('unsafeFoods')}
            </button>
          </div>

        {loading ? (
          <p className="text-center text-gray-600">{t('loading')}</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <>
            {filteredFoods.length === 0 ? (
              <p className="text-center text-gray-600 italic">{t('noResults')}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredFoods.map((food) => (
                  <div key={food._id} className="flip-card">
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                        <img
                          src={food.image}
                          alt={t(`foodNames.${food.name}`, { defaultValue: food.name })}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="p-4 text-center">
                          <h2 className="text-lg font-semibold text-gray-800">{t(`foodNames.${food.name}`, { defaultValue: food.name })}</h2>
                        </div>
                      </div>
                      <div className="flip-card-back p-4">
                        <h2 className="text-xl font-bold mb-2">{food.name}</h2>
                        <p><strong>{t('safe')}:</strong> {food.isSafe ? `✅ ${t('yes')}` : `❌ ${t('no')}`}</p>
                        <p>
                          <strong>{t('category')}:</strong>{" "}
                          {food.category ? t(`categories.${food.category}`) : t('notAvailable')}
                        </p>
                        <p>
                          <strong>{t('effectsLabel')}:</strong>{" "}
                          {t(`effects.${food.name}`, { defaultValue: food.effects })}
                        </p>
                        {food.note && (
                          <p>
                            <strong>{t('note')}:</strong>{" "}
                            {t(`notes.${food.name}`, { defaultValue: food.note })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-md bg-[#184440] text-white disabled:opacity-50"
                >
                  {t('prev')}
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .filter((page) => (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  ))
                  .reduce((acc, page, index, array) => {
                    if (index > 0 && page - array[index - 1] > 1) {
                      acc.push('ellipsis');
                    }
                    acc.push(page);
                    return acc;
                  }, [])
                  .map((item, index) =>
                    item === 'ellipsis' ? (
                      <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => handlePageChange(item)}
                        className={`px-4 py-2 rounded-md border ${
                          item === currentPage
                            ? 'bg-green-800 text-white font-bold'
                            : 'bg-white text-gray-700 hover:bg-green-100'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-md bg-[#184440] text-white disabled:opacity-50"
                >
                  {t('next')}
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
