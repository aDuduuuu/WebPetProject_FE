import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dogseller from '../pages/Dogseller';
import DogSellerDetail from '../pages/DogSellerDetail';


const DogsellerRoutes = () => (
  <Routes>
    <Route path="/" element={<Dogseller />} /> 
    <Route path="/:id" element={<DogSellerDetail />} /> 
  </Routes>
);

export default DogsellerRoutes;
