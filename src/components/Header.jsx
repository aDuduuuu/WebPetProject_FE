import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaUserCircle, FaHeart, FaBalanceScale } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../pictures/heart-with-dog.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBreedMenuOpen, setIsBreedMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const breedMenuRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        breedMenuRef.current && !breedMenuRef.current.contains(event.target) &&
        menuRef.current && !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
        setIsBreedMenuOpen(false);
      } else if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      } else if (breedMenuRef.current && !breedMenuRef.current.contains(event.target)) {
        setIsBreedMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsBreedMenuOpen(false); // Close breed menu if user menu is opened
  };

  const toggleBreedMenu = () => {
    setIsBreedMenuOpen((prev) => !prev);
    setIsMenuOpen(false); // Close user menu if breed menu is opened
  };

  const handleLogin = () => {
    navigate('/authentication');
    setIsMenuOpen(false);
  };

  const handleAccount = () => {
    navigate('/account');
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleViewAllBreeds = () => {
    navigate('/breed-list'); // Change '/breed-list' to your actual route
    setIsBreedMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="w-full bg-[#16423C] p-4 flex justify-between items-center text-white relative">
      <div className="text-2xl font-bold flex items-center cursor-pointer" onClick={handleLogoClick}>
        <img src={logo} alt="WoofHaven Logo" className="w-10 h-10 mr-2" />
        WoofHaven
      </div>

      <nav className="flex gap-6 text-lg relative">
        <button onClick={toggleBreedMenu} className="hover:text-teal-400 relative">
          Breeds
        </button>
        <a href="#" className="hover:text-teal-400">Services</a>
        <a href="#" className="hover:text-teal-400">Store</a>
        <a href="#" className="hover:text-teal-400">Trainer</a>

        {/* Breed Menu */}
        {isBreedMenuOpen && (
          <div
            ref={breedMenuRef}
            className="absolute top-14 left-0 w-[900px] h-[200px] bg-white text-gray-700 p-6 rounded-lg shadow-lg z-10 flex justify-around"
          >
            <div className="flex flex-col items-start">
              <button onClick={handleViewAllBreeds} className="text-teal-600 font-bold mb-2">Explore dog breeds</button>
              <input type="text" placeholder="Choose a dog breed" className="p-2 border border-gray-300 rounded-md" />
              <button onClick={handleViewAllBreeds} className="mt-2 px-4 py-2 bg-teal-500 text-white rounded-lg">
                See all
              </button>
            </div>
            <div className="flex flex-col items-start mx-6">
              <button className="flex items-center text-teal-600 font-bold mb-2">
                <FaHeart className="mr-2" /> Find your match
              </button>
              <span className="text-sm text-gray-500">Answer a few simple questions and find the right dog for you</span>
              <button className="flex items-center mt-2 text-teal-600 font-bold">
                <FaBalanceScale className="mr-2" /> Compare breeds
              </button>
              <span className="text-sm text-gray-500">Compare up to 5 different breeds side by side</span>
            </div>
            <div className="flex flex-col items-start">
              <button className="text-teal-600 font-bold mb-2">Prospective owners</button>
              <span className="text-sm text-gray-500">Choose your breed</span>
              <span className="text-sm text-gray-500">Why get a dog?</span>
              <span className="text-sm text-gray-500">All about puppies</span>
            </div>
          </div>
        )}
      </nav>

      <div className="flex items-center gap-4 relative">
        <div className="relative flex items-center">
          <FaSearch className="absolute left-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <FaUserCircle className="text-3xl cursor-pointer" onClick={toggleMenu} />

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
                    Account
                  </li>
                  <li
                    className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </>
              ) : (
                <li
                  className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
                  onClick={handleLogin}
                >
                  Login
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
