import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../pictures/heart-with-dog.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Kiểm tra trạng thái đăng nhập từ localStorage hoặc API
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Điều hướng đến trang đăng nhập
  const handleLogin = () => {
    navigate('/authentication');
    setIsMenuOpen(false);
  };

  // Điều hướng đến trang tài khoản
  const handleAccount = () => {
    navigate('/account');
    setIsMenuOpen(false);
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="w-full bg-opacity-75 bg-gray-800 p-4 flex justify-between items-center text-white relative">
      <div className="text-2xl font-bold flex items-center">
        <img src={logo} alt="WoofHaven Logo" className="w-10 h-10 mr-2" />
        WoofHaven
      </div>

      <nav className="flex gap-6 text-lg">
        <a href="#" className="hover:text-teal-400">Giống chó</a>
        <a href="#" className="hover:text-teal-400">Dịch vụ</a>
        <a href="#" className="hover:text-teal-400">Cửa hàng</a>
        <a href="#" className="hover:text-teal-400">Huấn luyện</a>
      </nav>

      <div className="flex items-center gap-4 relative">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <FaSearch className="absolute left-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        {/* User Icon */}
        <FaUserCircle className="text-3xl cursor-pointer" onClick={toggleMenu} />

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 mt-16 w-40 bg-white rounded-md shadow-lg z-10 transform translate-y-5"
          >
            <ul className="py-2">
              {isLoggedIn ? (
                <>
                  <li
                    className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
                    onClick={handleAccount}
                  >
                    Tài khoản
                  </li>
                  <li
                    className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </li>
                </>
              ) : (
                <li
                  className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
                  onClick={handleLogin}
                >
                  Đăng nhập
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
