import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import clientApi from '../client-api/rest-client';
import { message, Progress } from 'antd';  // Thêm các thành phần của antd để xử lý thông báo và thanh tiến trình
import { uploadToCloudinary } from '../utils/uploadToCloudinary';  // Import hàm uploadToCloudinary
import Footer from '../components/Footer';
import AdminLayout from '../components/admin/AdminLayout';

const AddPost = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy thông tin từ navigate state
  const [postInfo, setPostInfo] = useState({
    id: '',
    postID: '',
    title: '',
    category: '',
    sdescription: '',
    author: '',
    content: '',
    image: 'https://via.placeholder.com/150?text=Not+Available',  // Đặt ảnh mặc định
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);  // Tiến trình tải ảnh
  const [uploading, setUploading] = useState(false);  // Trạng thái tải ảnh

  const categories = [
    "Adoption",
    "Behavior",
    "Breed",
    "Care",
    "Health",
    "Lifestyle",
    "Places",
    "Training"
  ];

  // Lấy dữ liệu từ state nếu type là "update"
  useEffect(() => {
    if (location.state?.type === 'update') {
      setPostInfo((prevState) => ({
        id: location.state.id || prevState.id,
        postID: location.state.postID || prevState.postID,
        title: location.state.title || prevState.title,
        category: location.state.category || prevState.category,
        sdescription: location.state.sdescription || prevState.sdescription,
        author: location.state.author || prevState.author,
        content: location.state.content || prevState.content,
        image: location.state.image || prevState.image
      }));
    }
  }, [location.state]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostInfo((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Hàm tải ảnh lên và cập nhật state image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    // Nếu không chọn ảnh, sử dụng ảnh mặc định
    if (!file) {
      setPostInfo((prevState) => ({
        ...prevState,
        image: "https://via.placeholder.com/150?text=Not+Available"
      }));
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Gọi API tải ảnh lên Cloudinary
      const url = await uploadToCloudinary(file, 'posts', (progress) => {
        setUploadProgress(progress);
      });

      // Cập nhật URL ảnh trong state
      setPostInfo((prevState) => ({
        ...prevState,
        image: url,
      }));
      message.success('Image uploaded successfully!');
    } catch (error) {
      // Nếu có lỗi trong quá trình tải lên, sử dụng ảnh mặc định
      setPostInfo((prevState) => ({
        ...prevState,
        image: "https://via.placeholder.com/150?text=Not+Available",
      }));
      message.error('Error uploading image.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // Xử lý gửi dữ liệu
  // Hàm xử lý gửi dữ liệu (sửa lại)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!postInfo.title || !postInfo.category || !postInfo.sdescription || !postInfo.author || !postInfo.content) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (postInfo.image === 'https://via.placeholder.com/150?text=Not+Available') {
      message.error('Please upload an image!');
      setLoading(false);
      return;
    }

    try {
      let response;
      const api = clientApi.service('posts');

      if (location.state?.type === 'update') {
        // Cập nhật bài viết
        response = await api.patch(postInfo.id, postInfo);
      } else {
        // Tạo bài viết mới
        response = await api.create(postInfo);
      }

      if (response.EC === 0) {
        message.success('Action successfully!');
        setSuccess('Post saved successfully!');
        navigate('/posts'); // Điều hướng về trang /posts
      } else {
        setError(response.EM || 'An error occurred while saving the post.');
      }
    } catch (err) {
      console.error('Error while submitting the post:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <AdminLayout>
      <div className="post-container flex flex-col min-h-screen bg-gray-100">
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
          <h1 className="text-3xl font-semibold text-teal-700 mb-6">
            {location.state?.type === 'update' ? 'Update Post' : 'Add New Post'}
          </h1>

          {error && <div className="text-red-500 text-lg mb-4">{error}</div>}
          {success && <div className="text-green-500 text-lg mb-4">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Post ID */}
            <div>
              <label htmlFor="postID" className="block text-lg font-medium text-teal-500 mb-2">
                Post ID
              </label>
              <input
                type="text"
                id="postID"
                name="postID"
                value={postInfo.postID}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
                disabled={location.state?.type === 'update'}
              />
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-lg font-medium text-teal-500 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={postInfo.title}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-lg font-medium text-teal-500 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={postInfo.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Short Description */}
            <div>
              <label htmlFor="sdescription" className="block text-lg font-medium text-teal-500 mb-2">
                Short Description
              </label>
              <textarea
                id="sdescription"
                name="sdescription"
                value={postInfo.sdescription}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows="3"
                required
              />
            </div>

            {/* Author */}
            <div>
              <label htmlFor="author" className="block text-lg font-medium text-teal-500 mb-2">
                Author
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={postInfo.author}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-lg font-medium text-teal-500 mb-2">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={postInfo.content}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows="6"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-lg font-medium text-teal-500 mb-2">
                Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageUpload}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
                accept="image/*"
              />
              {uploading && (
                <div className="w-full mt-4">
                  <Progress percent={uploadProgress} status="active" />
                </div>
              )}
              <div className="mt-4">
                <img
                  src={postInfo.image || "https://via.placeholder.com/150?text=Not+Available"}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg shadow-md"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => navigate('/posts')}
                className="p-3 bg-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-3 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 transition ${loading || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading || uploading}
              >
                {loading ? 'Saving...' : location.state?.type === 'update' ? 'Update Post' : 'Add Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );

};

export default AddPost;