import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';

const AuthRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/authentication" element={<Login />} />
    <Route path="/register" element={<Register />} />
  </Routes>
);

export default AuthRoutes;
