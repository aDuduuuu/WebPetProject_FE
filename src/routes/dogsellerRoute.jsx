import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dogseller from '../pages/Dogseller';
import DogSellerDetail from '../pages/DogSellerDetail';
import AddDogSeller from '../pages/AddDogSeller';


const DogsellerRoutes = () => (
  <Routes>
    <Route path="/add" element={<AddDogSeller />} /> {/* Trang Spa */}
    <Route path="/" element={<Dogseller />} /> 
    <Route path="/:id" element={<DogSellerDetail />} /> 
  </Routes>
);

export default DogsellerRoutes;
