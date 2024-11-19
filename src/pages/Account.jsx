import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../client-api/rest-client-api';
import dogBackground from '../pictures/Home.jpg';
import dogImage2 from '../pictures/dog2.jpg';
import exitIcon from '../pictures/exit.png';
import clientApi from '../client-api/rest-client';

const Account = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    email: '',
    fullName: '',
    role: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      let authen = clientApi.service('users');
      try {
        const response = await authen.find();
        if (response.EC === 0) {
          const { firstName, lastName, email, role } = response.DT;
          setUserInfo({
            email,
            fullName: `${firstName} ${lastName}`,
            role,
          });
        } else {
          console.error(response.EM);
        }
      } catch (err) {
        console.error('Error during login:', err);
        setError('Something went wrong. Please try again later.');
      }
    };

    fetchUserProfile();
  }, []);

  const handleExit = () => {
    navigate('/');
  };

  return (
    <div
      className="account-container h-screen flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${dogBackground})` }}
    >
      <div
        className="account-box bg-white bg-opacity-60 backdrop-blur-md rounded-lg shadow-lg flex overflow-hidden relative"
        style={{ width: '800px', height: '400px' }}
      >
        <button onClick={handleExit} className="absolute top-4 right-4">
          <img src={exitIcon} alt="Exit" className="w-6 h-6" />
        </button>

        <div className="account-form w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Tài khoản của bạn</h2>
          <p className="text-gray-600 mb-6">Thông tin cá nhân của bạn</p>

          {/* Email Field */}
          <div className="mb-4 relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={userInfo.email}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none bg-gray-200 text-gray-700"
              readOnly
            />
          </div>

          {/* Full Name Field */}
          <div className="mb-4 relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={userInfo.fullName}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none bg-gray-200 text-gray-700"
              readOnly
            />
          </div>
        </div>

        {/* Image Section */}
        <div className="account-image w-1/2 flex items-center justify-center p-4">
          <img src={dogImage2} alt="Dog" className="rounded-lg shadow-md w-8/10 h-5/6 object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Account;
