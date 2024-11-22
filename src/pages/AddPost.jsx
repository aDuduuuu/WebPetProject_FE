import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import clientApi from '../client-api/rest-client';

const AddPost = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy thông tin từ navigate state
  const [postInfo, setPostInfo] = useState({
    postID: '',
    title: '',
    category: '',
    sdescription: '',
    author: '',
    content: '',
    image: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

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
        postID: location.state.id || prevState.postID,
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

  // Xử lý gửi dữ liệu
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

    try {
      let response;
      if (location.state?.type === 'update') {
        // Cập nhật bài viết
        const api = clientApi.service('posts');
        response = await api.patch(postInfo.postID, postInfo); // Cập nhật bài viết dựa vào ID
      } else {
        // Tạo bài viết mới
        response = await clientApi.service('posts').create(postInfo);
      }

      if (response.EC === 0) {
        setSuccess(location.state?.type === 'update' ? 'Post updated successfully!' : 'Post added successfully!');
        navigate('/posts'); // Quay lại danh sách bài viết
      } else {
        setError(response.EM);
      }
    } catch (err) {
      console.error('Error saving post:', err);
      setError('An error occurred while saving the post.');
    }

    setLoading(false);
  };

  return (
    <div className="post-container flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">
          {location.state?.type === 'update' ? 'Update Post' : 'Add New Post'}
        </h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block font-bold">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={postInfo.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block font-bold">Category</label>
            <select
              id="category"
              name="category"
              value={postInfo.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
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
            <label htmlFor="sdescription" className="block font-bold">Short Description</label>
            <textarea
              id="sdescription"
              name="sdescription"
              value={postInfo.sdescription}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
              required
            />
          </div>

          {/* Author */}
          <div>
            <label htmlFor="author" className="block font-bold">Author</label>
            <input
              type="text"
              id="author"
              name="author"
              value={postInfo.author}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block font-bold">Content</label>
            <textarea
              id="content"
              name="content"
              value={postInfo.content}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="6"
              required
            />
          </div>

          {/* Image */}
          <div>
            <label htmlFor="image" className="block font-bold">Image URL</label>
            <input
              type="text"
              id="image"
              name="image"
              value={postInfo.image}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => navigate('/posts')}
              className="px-4 py-2 bg-white border border-teal-500 text-teal-500 rounded hover:bg-teal-500 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Saving...' : location.state?.type === 'update' ? 'Update Post' : 'Add Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
