import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer và toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của react-toastify
import { register } from '../client-api/rest-client-api';
import dogBackground from '../pictures/Home.jpg';
import dogImage2 from '../pictures/dog2.jpg';
import exitIcon from '../pictures/exit.png';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    passwordConfirm: '',
    role: 'customer',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await register(formData);
    if (response.EC === 0) {
      toast.success(response.EM); 
      setError('');
    } else {
      setError(response.EM); 
    }
  };

  const handleExit = () => {
    navigate('/authentication');
  };

  return (
    <div
      className="register-container h-screen flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${dogBackground})` }}
    >
      <div
        className="register-box bg-white bg-opacity-60 backdrop-blur-md rounded-lg shadow-lg flex overflow-hidden relative"
        style={{ width: '900px', height: '650px' }}
      >
        <button onClick={handleExit} className="absolute top-4 right-4">
          <img src={exitIcon} alt="Exit" className="w-6 h-6" />
        </button>

        <div className="register-form w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Đăng ký</h2>
          <p className="text-gray-600 mb-6">Cùng khám phá dịch vụ và thông tin dành cho thú cưng yêu quý</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4 relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="Example@gmail.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4 relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                name="firstName"
                placeholder="Họ"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4 relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                name="lastName"
                placeholder="Tên"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4 relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <select
                name="role"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-700"
                onChange={handleChange}
              >
                <option value="customer">Khách hàng</option>
                <option value="manager">Quản lý</option>
              </select>
            </div>
            <div className="mb-4 relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4 relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                name="passwordConfirm"
                placeholder="Nhập lại mật khẩu"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={handleChange}
              />
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition duration-300 mb-4">
              Đăng ký
            </button>
          </form>

          <p className="text-center text-gray-500 mt-4">
            Bạn đã có tài khoản?{' '}
            <button onClick={() => navigate('/authentication')} className="text-teal-600 font-semibold underline">
              Đăng nhập
            </button>
          </p>
        </div>

        <div className="register-image w-1/2 flex items-center justify-center p-4">
          <img src={dogImage2} alt="Dog" className="rounded-lg shadow-md w-8/10 h-5/6 object-cover" />
        </div>
      </div>
      {/* Component ToastContainer để hiển thị các thông báo */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
};

export default Register;
