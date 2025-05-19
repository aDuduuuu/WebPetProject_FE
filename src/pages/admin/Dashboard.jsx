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

  const [totalDogSellers, setTotalDogSellers] = useState(0);
  const [dogSellerProvinceStats, setDogSellerProvinceStats] = useState([]);
  const [dogSellerBreedStats, setDogSellerBreedStats] = useState([]);

  const [totalProducts, setTotalProducts] = useState(0);
  const [productTypeStats, setProductTypeStats] = useState([]);

  const [totalPosts, setTotalPosts] = useState(0);
  const [postCategoryStats, setPostCategoryStats] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'manager') navigate('/');
  }, []);

  useEffect(() => {
    fetchDogBreedStats();
    fetchSpaStats();
    fetchTrainerStats();
    fetchDogSellerStats();
    fetchProductStats();
    fetchPostStats();
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

  const fetchDogSellerStats = async () => {
    try {
      const response = await clientApi.service('dogsellers').find({ page: 1, limit: 1000 });
      if (response.EC === 0 || response.EC === 200) {
        const sellers = Array.isArray(response.DT) ? response.DT : [];
        setTotalDogSellers(sellers.length);
  
        const provinceCounts = {};
        const breedCounts = {};
  
        sellers.forEach((seller) => {
          const province = seller.location?.province || seller.province || 'Unknown';
          provinceCounts[province] = (provinceCounts[province] || 0) + 1;
  
          seller.breeds?.forEach((breed) => {
            const breedName = typeof breed === 'string' ? breed : breed?.name || 'Unknown';
            breedCounts[breedName] = (breedCounts[breedName] || 0) + 1;
          });
        });
  
        const provinceData = Object.entries(provinceCounts)
          .map(([province, count]) => ({ province, count }))
          .sort((a, b) => b.count - a.count);
  
        const breedData = Object.entries(breedCounts)
          .map(([breed, count]) => ({ breed, count }))
          .sort((a, b) => b.count - a.count);
  
        setDogSellerProvinceStats(provinceData);
        setDogSellerBreedStats(breedData);
      } else {
        setTotalDogSellers(0);
        setDogSellerProvinceStats([]);
        setDogSellerBreedStats([]);
      }
    } catch (error) {
      console.error('Failed to fetch dog seller stats:', error);
      setTotalDogSellers(0);
      setDogSellerProvinceStats([]);
      setDogSellerBreedStats([]);
    }
  };  

  const fetchProductStats = async () => {
    try {
      const response = await clientApi.service('products').find({ page: 1, limit: 1000 });
      if (response.EC === 0 || response.EC === 200) {
        const products = Array.isArray(response.DT) ? response.DT : [];
        setTotalProducts(response.totalProducts || products.length);
  
        const typeCounts = {};
        products.forEach((product) => {
          const type = product.productType || 'Unknown';
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        });
  
        const typeData = Object.entries(typeCounts)
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count);
  
        setProductTypeStats(typeData);
      } else {
        setTotalProducts(0);
        setProductTypeStats([]);
      }
    } catch (error) {
      console.error('Failed to fetch product stats:', error);
      setTotalProducts(0);
      setProductTypeStats([]);
    }
  };  

  const fetchPostStats = async () => {
    try {
      const response = await clientApi.service('posts').find({ page: 1, limit: 1000 });
      if (response.EC === 0 || response.EC === 200) {
        const posts = Array.isArray(response.DT) ? response.DT : [];
        setTotalPosts(response.totalPosts || posts.length);
  
        const categoryCounts = {};
        posts.forEach((post) => {
          const category = post.category || 'Uncategorized';
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
  
        const categoryData = Object.entries(categoryCounts)
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count);
  
        setPostCategoryStats(categoryData);
      } else {
        setTotalPosts(0);
        setPostCategoryStats([]);
      }
    } catch (error) {
      console.error('Failed to fetch post stats:', error);
      setTotalPosts(0);
      setPostCategoryStats([]);
    }
  };  

  return (
    <AdminLayout>
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-1 text-[#184440]">Welcome, Manager 👋</h2>
        <p className="text-gray-600">This is your dashboard. You can monitor app statistics here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Dog Breeds" value={totalBreeds} />
        <StatCard label="Total Spas" value={totalSpas} />
        <StatCard label="Total Trainers" value={totalTrainers} />
        <StatCard label="Total Dog Sellers" value={totalDogSellers} />
        <StatCard label="Total Products" value={totalProducts} />
        <StatCard label="Total Posts" value={totalPosts} />
      </div>

      <StatChart title="🐶 Dog Breeds by Group" data={groupStats} dataKey="name" barKey="count" barColor="#184440" />
      <StatChart title="🚖 Spas by Province" data={spaProvinceStats} dataKey="province" barKey="count" barColor="#145c54" />
      <StatChart title="🛁 Spas by Service" data={spaServiceStats} dataKey="service" barKey="count" barColor="#e97451" />
      <StatChart title="📍 Trainers by Province" data={trainerProvinceStats} dataKey="province" barKey="count" barColor="#1e9e8d" />
      <StatChart title="🏷️ Trainers by Service" data={trainerServiceStats} dataKey="service" barKey="count" barColor="#f59e0b" />
      <StatChart title="🐾 Dog Sellers by Breed" data={dogSellerBreedStats} dataKey="breed" barKey="count" barColor="#10b981" />
      <StatChart title="📦 Products by Type" data={productTypeStats} dataKey="type" barKey="count" barColor="#6366f1" />
      <StatChart title="📰 Posts by Category" data={postCategoryStats} dataKey="category" barKey="count" barColor="#7c3aed" />
    </AdminLayout>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white shadow rounded-xl p-6 text-center">
    <p className="text-gray-500 text-sm">{label}</p>
    <h2 className="text-4xl font-bold text-[#184440] mt-2">{value}</h2>
  </div>
);

const StatChart = ({ title, data, dataKey, barKey, barColor }) => (
  <div className="bg-white shadow rounded-xl p-6 mb-8">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={dataKey} interval={0} angle={-30} textAnchor="end" height={100} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey={barKey} fill={barColor} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default Dashboard;
