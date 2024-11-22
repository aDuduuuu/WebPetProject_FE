import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import clientApi from '../client-api/rest-client'; // Import RestClient
import dogBackground from '../pictures/Home.jpg';
import dogImage1 from '../pictures/dog1.jpg';
import exitIcon from '../pictures/exit.png';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await clientApi.authenticate(formData); // Sử dụng RestClient's authenticate method
      console.log(response);
      localStorage.setItem('token', response.DT.token);
      localStorage.setItem('role', response.DT.role);
      if (response.EC === 0) {
        localStorage.setItem('token', response.DT.token); // Lưu token vào localStorage
        navigate('/'); // Điều hướng đến trang chủ
      } else {
        setError(response.EM); // Hiển thị thông báo lỗi nếu có
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('Something went wrong. Please try again later.');
    }
  };

  const handleExit = () => {
    navigate('/');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div
      className="login-container h-screen flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${dogBackground})` }}
    >
      <div
        className="login-box bg-white bg-opacity-60 backdrop-blur-md rounded-lg shadow-lg flex overflow-hidden relative"
        style={{ width: '800px', height: '500px' }}
      >
        <button onClick={handleExit} className="absolute top-4 right-4">
          <img src={exitIcon} alt="Exit" className="w-6 h-6" />
        </button>

        <div className="login-form w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Login</h2>
          <p className="text-gray-600 mb-6">Let's explore services and information for your beloved pets</p>

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
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={handleChange}
              />
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition duration-300 mb-4">
              Login
            </button>
          </form>

          <p className="text-center text-gray-500 mt-4">
            Already have an account?{' '}
            <button onClick={handleRegister} className="text-teal-600 font-semibold underline">
              Register
            </button>
          </p>
        </div>

        <div className="login-image w-1/2 flex items-center justify-center p-4">
          <img src={dogImage1} alt="Dog" className="rounded-lg shadow-md w-8/10 h-5/6 object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Login;
