import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import clientApi from '../client-api/rest-client';

const PostDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const apipost =  clientApi.service('posts');
        const response = await apipost.get(id); // Gọi API với id
        if (response && response.EC === 200) {
          setPost(response.DT); // Lưu thông tin bài viết vào state
        } else {
          setError(response.EM || 'Failed to fetch post details.');
        }
      } catch (err) {
        setError('An error occurred while fetching the post.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-lg font-bold text-gray-700">Loading post details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-lg font-bold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="post-detail-container flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="post-detail-content bg-white shadow-lg rounded-lg mx-10 my-6 p-10">
        <h1 className="text-4xl font-bold text-teal-600 mb-4">{post.title}</h1>
        <p className="text-lg text-gray-500 mb-2">By: {post.author}</p>
        <p className="text-sm text-gray-400 mb-6">Posted on: {new Date(post.datePosted).toLocaleDateString()}</p>
        <img
          src={post.image || 'https://via.placeholder.com/1200x600?text=No+Image'}
          alt={post.title}
          className="w-full h-auto rounded-lg mb-6 object-cover"
        />
        {/* Hiển thị đầy đủ nội dung */}
        <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
