import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Spa from '../pages/Spa';
import DetailPage from '../pages/DetailPage';

const SpaRoutes = () => (
  <Routes>
    <Route path="/" element={<Spa />} /> {/* Trang Spa */}
    <Route path="/:id" element={<DetailPage type="spa" />} /> {/* Route chi tiết của spa */}
  </Routes>
);

export default SpaRoutes;
