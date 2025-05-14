import React from 'react';

const AdminHeader = () => {
  return (
    <header className="bg-gray-900 shadow px-6 py-4 flex justify-between items-center border-b border-gray-700">
      <h1 className="text-2xl font-semibold text-white">Home</h1>
      <button
        className="text-sm bg-gradient-to-r from-green-400 to-teal-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition duration-200"
        onClick={() => {
          localStorage.clear();
          window.location.href = '/';
        }}
      >
        Logout
      </button>
    </header>
  );
};

export default AdminHeader;
