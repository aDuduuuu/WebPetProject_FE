// TrainerRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Trainer from '../pages/Trainer';
import DetailPage from '../pages/DetailPage';
import AddTrainer from '../pages/AddTrainer';

const TrainerRoutes = () => (
  <Routes>
    <Route path="/add" element={<AddTrainer />} /> {/* Trang Spa */}
    <Route path="/" element={<Trainer />} /> {/* Trang Trainer */}
    <Route path="/:id" element={<DetailPage type="trainer" />} /> {/* Route chi tiết của trainer */}
  </Routes>
);

export default TrainerRoutes;
