import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PostFilter = ({ categories, selectedCategory, sortBy, onCategoryChange, onSortByChange }) => {
  const navigate = useNavigate();
  const [isManager, setIsManager] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const role = localStorage.getItem('role');
    setIsManager(role === 'manager');
  }, []);

  const handleCategoryClick = (category) => {
    if (onCategoryChange) {
      onCategoryChange(category === 'all' ? '' : category);
    }
  };

  const handleSortByChange = (e) => {
    if (onSortByChange) {
      onSortByChange(e.target.value);
    }
  };

  const handleAddPost = () => {
    navigate('/posts/add');
  };

  return (
    <div className="filter-group">
      <h4 className="text-sm font-semibold text-gray-600 mb-4">{t('select_category')}</h4>
      <div className="flex flex-col space-y-2">
        <button
          key="all"
          className={`text-left p-2 rounded-lg ${selectedCategory === '' ? 'bg-teal-500 text-white' : 'text-gray-700'}`}
          onClick={() => handleCategoryClick('all')}
        >
          {t('all')}
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`text-left p-2 rounded-lg ${selectedCategory === category ? 'bg-teal-500 text-white' : 'text-gray-700'}`}
            onClick={() => handleCategoryClick(category)}
          >
            {t(`post_categories.${category}`)}
          </button>
        ))}
      </div>
      <div className="flex mt-6 mb-4 items-center gap-3">
        <h4 className="text-sm font-semibold text-gray-600 mt-0 mb-0">{t('sort_by')}</h4>
        <select
          value={sortBy}
          onChange={handleSortByChange}
          className="p-2 border border-gray-300 rounded-md text-gray-700 flex-grow"
        >
          <option value="time">{t('newest')}</option>
          <option value="otime">{t('oldest')}</option>
        </select>
      </div>

      {isManager && (
        <div className="flex mb-4">
          <button
            className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 w-full"
            onClick={handleAddPost}
          >
            {t('add_post')}
          </button>
        </div>
      )}
    </div>
  );
};

export default PostFilter;
