import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import PostFilter from '../components/PostFilter';
import PostCard from '../components/PostCard';
import clientApi from '../client-api/rest-client';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

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
  const { t, i18n } = useTranslation();

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const fetchPosts = async (
    category = selectedCategory,
    sortOption = sortBy,
    _isNewQuery = false
  ) => {
    setIsLoading(true);
    const params = {
      page,
      limit: postsPerPage,
      category,
      sortBy: sortOption,
    };
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
        result = await postService.find(params);
      }

      if (result && result.EC === 200) {
        const newPosts = result.DT.map((post) => ({
          _id: post._id || post.id,
          postID: post.postID,
          title: t(post.title) || t('untitled'),
          image: post.image || 'https://via.placeholder.com/150?text=No+Image',
          sdescription: t(post.sdescription) || t('no_description'),
          author: post.author || '',
          content: post.content || '',
          category: post.category || '',
        }));

        setPostList(newPosts);
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
          « {t('prev')}
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
          {t('next')} »
        </button>
      </div>
    );
  };

  return (
    <div className="post-container flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
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
              placeholder={t('search_placeholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="w-3/4 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">
              {t('post_list')}
            </h1>

            <div className="flex space-x-2">
              <button
                onClick={() => i18n.changeLanguage('en')}
                className="px-3 py-1 border border-teal-500 text-teal-700 rounded text-sm hover:bg-teal-100"
              >
                EN
              </button>
              <button
                onClick={() => i18n.changeLanguage('vi')}
                className="px-3 py-1 border border-teal-500 text-teal-700 rounded text-sm hover:bg-teal-100"
              >
                VI
              </button>
            </div>
          </div>

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
              {isLoading && <p className="text-center text-gray-500 mt-4">{t('loading')}</p>}
            </>
          ) : (
            <p className="text-lg text-gray-600 mt-4">{t('no_posts')}</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Post;
