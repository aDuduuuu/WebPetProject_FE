import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Spa from '../pages/Spa';
import DetailPage from '../pages/DetailPage';
import AddSpa from '../pages/AddSpa';

const SpaRoutes = () => (
  <Routes>
    <Route path="/add" element={<AddSpa />} /> {/* Trang Spa */}
    <Route path="/" element={<Spa />} /> {/* Trang Spa */}
    <Route path="/:id" element={<DetailPage type="spa" />} /> {/* Route chi tiết của spa */}
  </Routes>
);

export default SpaRoutes;
