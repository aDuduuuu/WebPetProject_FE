import React from 'react';

const PostFilter = ({ categories, selectedCategory, sortBy, onCategoryChange, onSortByChange }) => {
  const handleCategoryClick = (category) => {
    if (onCategoryChange) {
      onCategoryChange(category === 'all' ? '' : category); // Nếu "all", gửi giá trị rỗng (không có bộ lọc category)
    }
  };

  const handleSortByChange = (e) => {
    if (onSortByChange) {
      onSortByChange(e.target.value); // Gọi callback khi chọn cách sắp xếp
    }
  };

  return (
    <div className="filter-group">
      <h4 className="text-sm font-semibold text-gray-600 mb-4">Select Category</h4>
      <div className="flex flex-col space-y-2">
        {/* Nút "All" cho tất cả thể loại */}
        <button
          key="all"
          className={`text-left p-2 rounded-lg ${selectedCategory === '' ? 'bg-teal-500 text-white' : 'text-gray-700'}`}
          onClick={() => handleCategoryClick('all')}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`text-left p-2 rounded-lg ${selectedCategory === category ? 'bg-teal-500 text-white' : 'text-gray-700'}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <h4 className="text-sm font-semibold text-gray-600 mt-6 mb-2">Sort By</h4>
      <select
        value={sortBy}
        onChange={handleSortByChange}
        className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
      >
        <option value="time">Newest</option>
        <option value="otime">Oldest</option>
      </select>
    </div>
  );
};

export default PostFilter;
