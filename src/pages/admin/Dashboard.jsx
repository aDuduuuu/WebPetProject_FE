import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'manager') {
      navigate('/'); // chỉ cho phép truy cập nếu là manager
    }
  }, []);

  return (
    <AdminLayout>
      <h2 className="text-xl font-bold mb-4">Welcome, Manager 👋</h2>
      <p>This is your dashboard. You can manage the app from here.</p>
    </AdminLayout>
  );
};

export default Dashboard;
