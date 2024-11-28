import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NamePage from '../pages/Naming';


const NameRoutes = () => (
  <Routes>
    <Route path="/" element={<NamePage />} />
  </Routes>
);

export default NameRoutes;
