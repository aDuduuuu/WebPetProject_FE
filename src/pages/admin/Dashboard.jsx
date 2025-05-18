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
  const [totalSpas, setTotalSpas] = useState(0);
  const [spaProvinceStats, setSpaProvinceStats] = useState([]);
  const [spaServiceStats, setSpaServiceStats] = useState([]);

  const [totalTrainers, setTotalTrainers] = useState(0);
  const [trainerProvinceStats, setTrainerProvinceStats] = useState([]);
  const [trainerServiceStats, setTrainerServiceStats] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'manager') navigate('/');
  }, []);

  useEffect(() => {
    fetchDogBreedStats();
    fetchSpaStats();
    fetchTrainerStats();
  }, []);

  const fetchDogBreedStats = async () => {
    try {
      const response = await clientApi.service('dogbreeds').find({ page: 1, limit: 1000 });
      if (response.EC === 0) {
        const breeds = response.DT;
        setTotalBreeds(response.totalBreeds || breeds.length);

        const groupCounts = {};
        breeds.forEach((breed) => {
          const group = breed.group || 'Unknown';
          groupCounts[group] = (groupCounts[group] || 0) + 1;
        });

        const groupData = Object.entries(groupCounts).map(([name, count]) => ({ name, count }));
        setGroupStats(groupData);
      }
    } catch (error) {
      console.error('Failed to fetch dog breed stats:', error);
    }
  };

  const fetchSpaStats = async () => {
    try {
      const response = await clientApi.service('spas').find({ page: 1, limit: 1000 });
      if (response.EC === 0) {
        const spas = response.DT;
        setTotalSpas(response.totalSpas || spas.length);

        const provinceCounts = {};
        const serviceCounts = {};

        spas.forEach((spa) => {
          const province = spa.location?.province || 'Unknown';
          provinceCounts[province] = (provinceCounts[province] || 0) + 1;

          spa.services?.forEach((service) => {
            const name = service.trim();
            if (!name) return;
            serviceCounts[name] = (serviceCounts[name] || 0) + 1;
          });
        });

        const provinceData = Object.entries(provinceCounts)
          .map(([province, count]) => ({ province, count }))
          .sort((a, b) => b.count - a.count);

        const serviceData = Object.entries(serviceCounts)
          .map(([service, count]) => ({ service, count }))
          .sort((a, b) => b.count - a.count);

        setSpaProvinceStats(provinceData);
        setSpaServiceStats(serviceData);
      }
    } catch (error) {
      console.error('Failed to fetch spa stats:', error);
    }
  };

  const fetchTrainerStats = async () => {
    try {
      const response = await clientApi.service('trainers').find({ page: 1, limit: 1000 });
      if (response.EC === 0) {
        const trainers = response.DT;
        setTotalTrainers(response.totalTrainers || trainers.length);

        const provinceCounts = {};
        const serviceCounts = {};

        trainers.forEach((trainer) => {
          const province = trainer.location?.province || 'Unknown';
          provinceCounts[province] = (provinceCounts[province] || 0) + 1;

          trainer.services?.forEach((service) => {
            const name = service.trim();
            if (!name) return;
            serviceCounts[name] = (serviceCounts[name] || 0) + 1;
          });
        });

        const provinceData = Object.entries(provinceCounts)
          .map(([province, count]) => ({ province, count }))
          .sort((a, b) => b.count - a.count);

        const serviceData = Object.entries(serviceCounts)
          .map(([service, count]) => ({ service, count }))
          .sort((a, b) => b.count - a.count);

        setTrainerProvinceStats(provinceData);
        setTrainerServiceStats(serviceData);
      }
    } catch (error) {
      console.error('Failed to fetch trainer stats:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-1 text-[#184440]">Welcome, Manager 👋</h2>
        <p className="text-gray-600">This is your dashboard. You can monitor app statistics here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p className="text-gray-500 text-sm">Total Dog Breeds</p>
          <h2 className="text-4xl font-bold text-[#184440] mt-2">{totalBreeds}</h2>
        </div>
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p className="text-gray-500 text-sm">Total Spas</p>
          <h2 className="text-4xl font-bold text-[#184440] mt-2">{totalSpas}</h2>
        </div>
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p className="text-gray-500 text-sm">Total Trainers</p>
          <h2 className="text-4xl font-bold text-[#184440] mt-2">{totalTrainers}</h2>
        </div>
      </div>

      {/* Dog Breed Stats */}
      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">🐶 Dog Breeds by Group</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={groupStats} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" height={100} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#184440" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Spa Stats */}
      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">🚖 Spas by Province</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={spaProvinceStats} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="province" interval={0} angle={-30} textAnchor="end" height={100} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#145c54" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">🛁 Spas by Service</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={spaServiceStats} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="service" interval={0} angle={-30} textAnchor="end" height={100} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#e97451" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Trainer Stats */}
      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">📍 Trainers by Province</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={trainerProvinceStats} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="province" interval={0} angle={-30} textAnchor="end" height={100} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#1e9e8d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">🏷️ Trainers by Service</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={trainerServiceStats} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="service" interval={0} angle={-30} textAnchor="end" height={100} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
