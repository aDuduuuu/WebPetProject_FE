import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import PostFilter from '../components/PostFilter';
import PostCard from '../components/PostCard';
import clientApi from '../client-api/rest-client';
import Footer from '../components/Footer';

const Post = () => {
  const [postList, setPostList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('time');
  const [page, setPage] = useState(1);
  const postsPerPage = 8;
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [userRole, setUserRole] = useState('');

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const fetchPosts = async (
    category = selectedCategory,
    sortOption = sortBy,
    isNewQuery = false
  ) => {
    setIsLoading(true);

    const params = {
      page,
      limit: postsPerPage,
    };

    let result;

    try {
      if (searchKeyword.trim() !== '') {
        const searchService = clientApi.service('posts/search/by-title');
        result = await searchService.find({
          keyword: searchKeyword,
          page,
          limit: postsPerPage,
        });
      } else {
        params.category = category;
        params.sortBy = sortOption;

        const postService = clientApi.service('posts');
        result = await postService.find(params);
      }

      if (result && result.EC === 200) {
        const newPosts = result.DT.map((post) => ({
          _id: post._id || post.id,
          postID: post.postID,
          title: post.title || 'Untitled',
          image: post.image || 'https://via.placeholder.com/150?text=No+Image',
          sdescription: post.sdescription || 'No description available.',
          author: post.author || '',
          content: post.content || '',
          category: post.category || '',
        }));

        setPostList(isNewQuery ? newPosts : [...postList, ...newPosts]);
        setTotalPosts(result.totalPosts || 0);
      } else {
        setPostList([]);
        setTotalPosts(0);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setPostList([]);
      setTotalPosts(0);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoryClient = clientApi.service('filters/posts');
      const result = await categoryClient.find({});
      if (result && result.EC === 0) {
        setCategories(result.DT);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
    fetchPosts(category, sortBy, true);
  };

  const handleSortByChange = (sortOption) => {
    setSortBy(sortOption);
    setPage(1);
    fetchPosts(selectedCategory, sortOption, true);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    setPage(1);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts(selectedCategory, sortBy, true);
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    fetchPosts(selectedCategory, sortBy, searchKeyword.trim() !== '');
  }, [page, searchKeyword]);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="flex justify-center mt-8 space-x-2">
        <button
          className="px-3 py-1 border rounded bg-white text-teal-600 border-teal-500 hover:bg-teal-100"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          « Prev
        </button>

        {pageNumbers.map((num) => (
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
    <div className="post-container flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        {/* Sidebar bộ lọc và tìm kiếm */}
        <div className="w-1/4 bg-white p-6 shadow-lg">
          <PostFilter
            categories={categories}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            onCategoryChange={handleCategoryChange}
            onSortByChange={handleSortByChange}
          />
          <div className="mt-6">
            <input
              type="text"
              value={searchKeyword}
              onChange={handleSearchChange}
              placeholder="Search posts by title..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Content chính */}
        <div className="w-3/4 p-6">
          {postList.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
                  />
                ))}
              </div>
              {renderPagination()}
              {isLoading && <p className="text-center text-gray-500 mt-4">Loading...</p>}
            </>
          ) : (
            <p className="text-lg text-gray-600 mt-4">No Posts found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Post;
