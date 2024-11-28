import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Favorite from '../pages/Favorite';


const FavorRoutes = () => (
  <Routes>
    <Route path="/:id" element={<Favorite />} />
  </Routes>
);

export default FavorRoutes;
