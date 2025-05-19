import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt, FaUserTie, FaDog,
  FaWallet, FaPaw, FaSpa, FaBox, FaNewspaper, FaClipboardList 
} from 'react-icons/fa';

const menuItems = [
  { name: 'Dashboards', icon: <FaTachometerAlt />, path: '/dashboard' },
  { name: 'Dog Breeds', icon: <FaPaw  />, path: '/dashboard/dog-breeds' },
  { name: 'Spa Management', icon: <FaSpa />, path: '/dashboard/spas' },
  { name: 'Trainer Management', icon: <FaUserTie />, path: '/dashboard/trainers' },
  { name: 'Dog Seller Management', icon: <FaDog />, path: '/dashboard/dogsellers' },
  { name: 'Product Management', icon: <FaBox />, path: '/dashboard/products' },
  { name: 'Post Management', icon: <FaNewspaper />, path: '/dashboard/posts' },
  { name: 'Dog Names', icon: <FaDog />, path: '/dashboard/dognames' },
  { name: 'Orders', icon: <FaClipboardList />, path: '/dashboard/orders' },
  { name: 'Statistics', icon: <FaWallet />, path: '/dashboard/statistics' },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen overflow-y-auto p-4">
      <div className="text-xl font-bold mb-8">Admin Panel</div>
      <nav className="flex flex-col gap-2">
        {menuItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-md'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
              {item.name !== 'Dashboards' && (
                <span className="ml-auto text-sm text-gray-400">{'>'}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
