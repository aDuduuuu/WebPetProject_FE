import React, { useState, useEffect, useRef } from "react";
import { FaPaw, FaSearch, FaUserCircle, FaHeart, FaBalanceScale,FaUser,  FaSignOutAlt, FaClipboardList } from "react-icons/fa";
import { IoSparklesOutline } from "react-icons/io5";
import { GiWhistle } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import logo from "../pictures/heart-with-dog.png";
import { LuDog } from "react-icons/lu";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBreedMenuOpen, setIsBreedMenuOpen] = useState(false);
  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const breedMenuRef = useRef(null);
  const serviceMenuRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        breedMenuRef.current && !breedMenuRef.current.contains(event.target) &&
        menuRef.current && !menuRef.current.contains(event.target) &&
        serviceMenuRef.current && !serviceMenuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
        setIsBreedMenuOpen(false);
        setIsServiceMenuOpen(false);
      } else if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      } else if (breedMenuRef.current && !breedMenuRef.current.contains(event.target)) {
        setIsBreedMenuOpen(false);
      } else if (serviceMenuRef.current && !serviceMenuRef.current.contains(event.target)) {
        setIsServiceMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsBreedMenuOpen(false);
    setIsServiceMenuOpen(false);
  };

  const toggleBreedMenu = () => {
    setIsBreedMenuOpen((prev) => !prev);
    setIsMenuOpen(false);
    setIsServiceMenuOpen(false);

  };

  const toggleServiceMenu = () => {
    setIsServiceMenuOpen((prev) => !prev);
    setIsMenuOpen(false);
    setIsBreedMenuOpen(false);
  };

  const handleLogin = () => {
    navigate("/authentication");
    setIsMenuOpen(false);
  };

  const handleAccount = () => {
    navigate("/account");
    setIsMenuOpen(false);
  };

  const handleFavor = () => {
    const id = localStorage.getItem("id");
    navigate(`/favorites/${id}`);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    toast.success('You are logged out!'); 
    navigate("/");
  };

  const handleViewAllBreeds = () => {
    navigate("/breedList");
    setIsBreedMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSpa = () => {
    navigate('/spas');
    setIsServiceMenuOpen(false);
  };

  const handleStore = () => {
    navigate('/products');
    setIsServiceMenuOpen(false);
  };

  const handleTrainer = () => {
    navigate('/trainers');
    setIsServiceMenuOpen(false);
  };

  const handleDogseller = () => {
    navigate('/dogsellers');
    setIsServiceMenuOpen(false);
  };

  const handlePost = () => {
    navigate('/posts');
    setIsServiceMenuOpen(false);
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
        <button onClick={toggleServiceMenu} className="hover:text-teal-400 relative">
          Services
        </button>
        <button onClick={handleStore} className="hover:text-teal-400 relative">
          Store
        </button>
        <button onClick={handlePost} className="hover:text-teal-400 relative">
          Post
        </button>
        <button onClick={() => navigate("/cart")} className="hover:text-teal-400 relative">
          Cart
        </button>
        {isBreedMenuOpen && (
          <div
            ref={breedMenuRef}
            className="absolute top-14 left-0 w-[900px] h-[200px] bg-white text-gray-700 p-6 rounded-lg shadow-lg z-10 flex justify-around"
          >
            <div className="flex flex-col items-start">
              <button onClick={handleViewAllBreeds} className="text-teal-600 font-bold mb-2">
                Explore dog breeds
              </button>
              <button onClick={handleViewAllBreeds} className="mt-2 px-4 py-2 bg-teal-500 text-white rounded-lg">
                See all
              </button>
            </div>
            <div className="flex flex-col items-start mx-6">
              <button
                onClick={() => navigate("/bestDog")} // Navigate to FindBestDog page
                className="flex items-center text-teal-600 font-bold mb-2"
              >
                <FaHeart className="mr-2" /> Find your match
              </button>
              <span className="text-sm text-gray-500">
                Answer a few simple questions and find the right dog for you
              </span>
              <button 
                onClick={() => navigate("/compareDogs")}
                className="flex items-center mt-2 text-teal-600 font-bold"
              >
                <FaBalanceScale className="mr-2" /> Compare breeds
              </button>
              <span className="text-sm text-gray-500">
                Compare up to 5 different breeds side by side
              </span>
              <button
                onClick={() => navigate("/dog-name-finder")} // Navigate to Dog Name Finder page
                className="flex items-center mt-2 text-teal-600 font-bold"
              >
                <FaPaw className="mr-2" /> Dog name finder
              </button>
              <span className="text-sm text-gray-500">
                Find the perfect name for your dog
              </span>
            </div>
          </div>
        )}

        {isServiceMenuOpen && (
          <div
            ref={serviceMenuRef}
            className="absolute top-14 left-0 w-[300px] bg-white text-gray-700 p-4 rounded-lg shadow-lg z-10"
          >
            <p className="text-teal-600 font-bold mb-2">Looking for:</p>
            <button
              onClick={handleSpa}
              className="flex items-center w-full text-left px-4 py-2 font-bold mb-2 hover:bg-gray-200"
            >
              <IoSparklesOutline className="text-teal-500 mr-2" />
              <span className="text-gray-600">Spa</span>
            </button>
            <button
              onClick={handleTrainer}
              className="flex items-center w-full text-left px-4 py-2 font-bold mb-2 hover:bg-gray-200"
            >
              <GiWhistle className="text-teal-500 mr-2" />
              <span className="text-gray-600">Trainer</span>
            </button>
            <button
              onClick={handleDogseller}
              className="flex items-center w-full text-left px-4 py-2 font-bold mb-2 hover:bg-gray-200"
            >
              <LuDog className="text-teal-500 mr-2" />
              <span className="text-gray-600">Dog seller</span>
            </button>
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
            <FaUser className="inline-block mr-2 text-gray-600" /> Account
          </li>
          <li
            className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
            onClick={() => navigate("/orderList")}
          >
            <FaClipboardList className="inline-block mr-2 text-gray-600" /> Your order
          </li>
          <li
            className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
            onClick={handleFavor}
          >
            <FaHeart className="inline-block mr-2 text-red-500" /> Favorite
          </li>
          <li
            className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="inline-block mr-2 text-gray-600" /> Logout
          </li>
          
        </>
      ) : (
        <li
          className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
          onClick={handleLogin}
        >
          <FaUser className="inline-block mr-2 text-gray-600" /> Login
        </li>
      )}
    </ul>
  </div>
)}
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      </div>
    </header>
  );
};

export default Header;
