import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Post from '../pages/Post';
import PostDetail from '../pages/PostDetail';
import AddPost from '../pages/AddPost';

const PostRoutes = () => (
  <Routes>
    <Route path="/" element={<Post />} /> 
    <Route path="/add" element={<AddPost />} /> 
    <Route path="/:id" element={<PostDetail />} />
  </Routes>
);

export default PostRoutes;
