import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import clientApi from '../../client-api/rest-client';
import PostCard from '../../components/PostCard';

const AdminPostPage = () => {
  const [postList, setPostList] = useState([]);
  const [page, setPage] = useState(1);
  const postsPerPage = 8;
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();
  const primaryColor = '#184440';

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let result;
        if (searchKeyword.trim() !== '') {
          const searchService = clientApi.service('posts/search/by-title');
          result = await searchService.find({
            keyword: searchKeyword,
            page,
            limit: postsPerPage,
          });
        } else {
          const postService = clientApi.service('posts');
          result = await postService.find({
            page,
            limit: postsPerPage,
          });
        }

        if (result && result.EC === 200) {
          const posts = result.DT.map((post) => ({
            _id: post._id || post.id,
            postID: post.postID,
            title: post.title || 'Untitled',
            image: post.image || 'https://via.placeholder.com/150?text=No+Image',
            sdescription: post.sdescription || 'No description available.',
            author: post.author || '',
            content: post.content || '',
            category: post.category || '',
          }));

          setPostList(posts);
          setTotalPosts(result.totalPosts || 0);
        } else {
          setPostList([]);
          setTotalPosts(0);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPostList([]);
        setTotalPosts(0);
      }
    };

    fetchPosts();
  }, [page, searchKeyword]);

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    setPage(1);
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-8 space-x-2">
        <button
          className="px-3 py-1 border rounded bg-white text-teal-600 border-teal-500 hover:bg-teal-100"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          « Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`px-3 py-1 border rounded ${
              page === num
                ? 'bg-teal-500 text-white'
                : 'bg-white text-teal-600 border-teal-500 hover:bg-teal-100'
            }`}
            onClick={() => setPage(num)}
          >
            {num}
          </button>
        ))}
        <button
          className="px-3 py-1 border rounded bg-white text-teal-600 border-teal-500 hover:bg-teal-100"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next »
        </button>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight mb-1">
              📰 Post Management
            </h2>
            <div className="inline-block bg-[#184440] text-white text-lg font-semibold px-4 py-1 rounded-md shadow">
              Total posts: {totalPosts}
            </div>
          </div>
          <button
            onClick={() => navigate('/posts/add')}
            className="text-white px-4 py-2 rounded-lg hover:bg-[#145c54]"
            style={{ backgroundColor: primaryColor }}
          >
            + Add New Post
          </button>
        </div>

        {/* Search box */}
        <div className="mb-6">
          <input
            type="text"
            value={searchKeyword}
            onChange={handleSearchChange}
            placeholder="Search post by title..."
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Post List */}
        {postList.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {postList.map((post) => (
                <PostCard
                  key={post._id}
                  id={post._id}
                  postID={post.postID}
                  image={post.image}
                  title={post.title}
                  sdescription={post.sdescription}
                  author={post.author}
                  content={post.content}
                  category={post.category}
                  type="posts"
                  action="update"
                  role={userRole}
                />
              ))}
            </div>
            {renderPagination()}
          </>
        ) : (
          <p className="text-lg text-gray-600 mt-4">No Posts found.</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPostPage;
