import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Product from '../pages/Product';
import ProductDetail from '../pages/ProductDetail';
import AddProduct from '../pages/AddProduct';

const ProductRoutes = () => (
  <Routes>
    <Route path="/add" element={<AddProduct />}/>
    <Route path="/" element={<Product />} />
    <Route path="/:id" element={<ProductDetail />} />
  </Routes>
);

export default ProductRoutes;
