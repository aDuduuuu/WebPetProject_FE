import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import clientApi from '../../client-api/rest-client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [totalBreeds, setTotalBreeds] = useState(0);
  const [groupStats, setGroupStats] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'manager') {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await clientApi.service('dogbreeds').find({ page: 1, limit: 1000 });
      if (response.EC === 0) {
        const breeds = response.DT;
        setTotalBreeds(response.totalBreeds);

        const groupCounts = {};
        breeds.forEach((breed) => {
          const group = breed.group || 'Unknown';
          groupCounts[group] = (groupCounts[group] || 0) + 1;
        });

        const groupData = Object.entries(groupCounts).map(([name, count]) => ({ name, count }));
        setGroupStats(groupData);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4 text-[#184440]">Welcome, Manager 👋</h2>
      <p className="mb-6 text-gray-700">This is your dashboard. You can manage the app from here.</p>

      {/* Stat Card for Total Breeds */}
      <div className="bg-white shadow rounded-xl p-6 mb-6 text-center">
        <p className="text-gray-500 text-sm">Total Breeds</p>
        <h2 className="text-4xl font-bold text-[#184440] mt-2">{totalBreeds}</h2>
      </div>

      {/* Bar Chart for Group Stats */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Breeds by Group</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={groupStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" height={100} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#184440" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
