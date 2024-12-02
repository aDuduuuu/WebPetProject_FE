import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Statistics from '../pages/Statistics';


const StatisticsRoutes = () => (
  <Routes>
    
    <Route path="/" element={<Statistics />} /> {/* Trang Spa */}
    
  </Routes>
);

export default StatisticsRoutes;
