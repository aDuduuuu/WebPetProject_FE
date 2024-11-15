import React from 'react';
import Header from '../components/Header';

const FilterSection = () => {
  return (
    <div className="home-container text-white flex flex-col min-h-screen">
      <Header />
      <div className="filter-section p-6 bg-white rounded-lg shadow-lg w-80">
        {/* Tìm kiếm bằng tên giống */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">FIND BY BREED NAME</h4>
          <select className="w-full p-2 border border-gray-300 rounded-md text-gray-700">
            <option value="">Select a breed</option>
            {/* Thêm các giống chó vào đây */}
            <option value="affenpinscher">Affenpinscher</option>
            <option value="akita">Akita</option>
            <option value="beagle">Beagle</option>
            <option value="bulldog">Bulldog</option>
            {/* ... các giống chó khác */}
          </select>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">FILTER BREEDS</h3>
          <button className="text-sm text-teal-600 hover:underline">CLEAR ALL</button>
        </div>

        {/* GROUP */}
        <div className="filter-group mb-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">GROUP</h4>
          <div className="grid grid-cols-2 gap-y-2">
            {["Sporting Group", "Hound Group", "Working Group", "Terrier Group", "Toy Group", "Non-Sporting Group", "Herding Group", "Miscellaneous Class", "Foundation Stock Service"].map((label) => (
              <label key={label} className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2" /> {label}
              </label>
            ))}
          </div>
        </div>

        {/* Mức độ hoạt động */}
        <div className="filter-group mb-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">MỨC ĐỘ HOẠT ĐỘNG</h4>
          <div className="grid grid-cols-2 gap-y-2">
            {["Cần nhiều hoạt động", "Năng động", "Tập thể dục đều đặn", "Điềm tĩnh"].map((label) => (
              <label key={label} className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2" /> {label}
              </label>
            ))}
          </div>
        </div>

        {/* Mức độ sủa */}
        <div className="filter-group mb-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">MỨC ĐỘ SỦA</h4>
          <div className="grid grid-cols-2 gap-y-2">
            {["Khi cần thiết", "Trung bình", "Ít sủa", "Thường xuyên", "Thích sủa"].map((label) => (
              <label key={label} className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2" /> {label}
              </label>
            ))}
          </div>
        </div>

        {/* Đặc điểm */}
        <div className="filter-group mb-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">ĐẶC ĐIỂM</h4>
          <div className="grid grid-cols-2 gap-y-2">
            {["Nhỏ nhất", "Giống chó trung bình", "Lớn nhất", "Thông minh nhất", "Ít gây dị ứng", "Phù hợp với gia đình nhất", "Giữ nhà tốt nhất", "Tốt nhất cho trẻ em", "Không lông", "Phù hợp cho căn hộ", "Giống chó lớn"].map((label) => (
              <label key={label} className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2" /> {label}
              </label>
            ))}
          </div>
        </div>

        {/* Loại lông */}
        <div className="filter-group mb-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">LOẠI LÔNG</h4>
          <div className="grid grid-cols-2 gap-y-2">
            {["Không lông", "Lông ngắn", "Lông trung bình", "Lông dài", "Lông mượt", "Lông thô", "Lông mềm mại", "Lông kép", "Lông xoăn", "Lông gợn sóng", "Lông cứng", "Lông dày"].map((label) => (
              <label key={label} className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2" /> {label}
              </label>
            ))}
          </div>
        </div>

        {/* Mức độ rụng lông */}
        <div className="filter-group mb-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">MỨC ĐỘ RỤNG LÔNG</h4>
          <div className="grid grid-cols-2 gap-y-2">
            {["Thường xuyên", "Hiếm khi", "Theo mùa", "Rụng nhiều", "Thỉnh thoảng"].map((label) => (
              <label key={label} className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2" /> {label}
              </label>
            ))}
          </div>
        </div>

        {/* Kích thước */}
        <div className="filter-group mb-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">KÍCH THƯỚC</h4>
          <div className="grid grid-cols-2 gap-y-2">
            {["Rất lớn", "Rất nhỏ", "Nhỏ", "Trung bình", "Lớn"].map((label) => (
              <label key={label} className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2" /> {label}
              </label>
            ))}
          </div>
        </div>

        {/* Khả năng huấn luyện */}
        <div className="filter-group mb-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">KHẢ NĂNG HUẤN LUYỆN</h4>
          <div className="grid grid-cols-2 gap-y-2">
            {["Có thể cứng đầu", "Dễ chịu", "Ham muốn làm hài lòng", "Độc lập", "Dễ huấn luyện"].map((label) => (
              <label key={label} className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2" /> {label}
              </label>
            ))}
          </div>
        </div>

        {/* Nút Lọc và Xóa tất cả */}
        <div className="flex justify-between mt-4">
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg">Lọc</button>
          <button className="text-sm text-teal-600 hover:underline">Xóa tất cả</button>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
