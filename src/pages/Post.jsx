import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import PostFilter from '../components/PostFilter';
import PostCard from '../components/PostCard';
import clientApi from '../client-api/rest-client';

const Post = () => {
  const [postList, setPostList] = useState([]); // Danh sách bài đăng
  const [categories, setCategories] = useState([]); // Danh sách danh mục
  const [selectedCategory, setSelectedCategory] = useState(''); // Danh mục đã chọn
  const [sortBy, setSortBy] = useState('time'); // Mặc định sắp xếp theo 'time' (mới nhất)
  const [page, setPage] = useState(1); // Trang hiện tại
  const postsPerPage = 16; // Số bài đăng mỗi lần tải
  const [hasMore, setHasMore] = useState(true); // Trạng thái còn dữ liệu để tải
  const [isLoading, setIsLoading] = useState(false); // Trạng thái đang tải dữ liệu
  const [userRole, setUserRole] = useState(''); // Vai trò người dùng

  const fetchPosts = async (category = selectedCategory, sortOption = sortBy, isNewCategoryOrSort = false) => {
    setIsLoading(true); // Đặt trạng thái đang tải
    const params = {
      page,
      limit: postsPerPage,
      category,
      sortBy: sortOption,
    };
  
    try {
      let post = clientApi.service('posts'); // Đặt đường dẫn API
      const result = await post.find(params); // Gọi API
      console.log('API result for posts:', result); // Debug kết quả API
  
      if (result && result.EC === 200) {
        const newPosts = result.DT.map((post) => ({
          _id: post._id || post.id, // Đảm bảo có ID
          postID: post.postID,
          title: post.title || 'Untitled', // Tiêu đề bài viết
          image: post.image || 'https://via.placeholder.com/150?text=No+Image', // URL ảnh
          sdescription: post.sdescription || 'No description available.', // Mô tả ngắn
          author: post.author || '', // Tác giả
          content: post.content || '', // Nội dung
          category: post.category || '', // Danh mục
        }));
  
        if (isNewCategoryOrSort) {
          // Reset danh sách nếu thay đổi danh mục hoặc sắp xếp
          setPostList(newPosts);
        } else {
          // Thêm bài đăng mới vào danh sách hiện tại
          setPostList((prevList) => [...prevList, ...newPosts]);
        }
        setHasMore(newPosts.length === postsPerPage); // Kiểm tra còn dữ liệu hay không
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false); // Reset trạng thái tải
    }
  };
  

  // Fetch categories từ API
  const fetchCategories = async () => {
    try {
      let categoryClient = clientApi.service('filters/posts'); // Đường dẫn API cho danh mục
      const result = await categoryClient.find({});
      console.log('API result for categories:', result); // Debug kết quả API

      if (result && result.EC === 0) {
        setCategories(result.DT); // Lưu danh mục vào state
      } else {
        console.error('Failed to fetch categories:', result.EM);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Xử lý khi thay đổi danh mục
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1); // Reset về trang đầu tiên
    fetchPosts(category, sortBy, true); // Fetch bài đăng cho danh mục mới
  };

  // Xử lý khi thay đổi sắp xếp
  const handleSortByChange = (sortOption) => {
    setSortBy(sortOption);
    setPage(1); // Reset về trang đầu tiên
    fetchPosts(selectedCategory, sortOption, true); // Fetch bài đăng theo sắp xếp mới
  };

  // Tải thêm bài đăng khi nhấn "Load More"
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // Fetch danh mục và bài đăng lần đầu
  useEffect(() => {
    fetchCategories();
    fetchPosts(selectedCategory, 'time', true); // Mặc định sắp xếp theo 'time'
  }, []);

  // Fetch bài đăng khi `page` thay đổi
  useEffect(() => {
    if (page === 1) {
      fetchPosts(selectedCategory, sortBy, true); // Reset danh sách nếu page = 1
    } else {
      fetchPosts(selectedCategory, sortBy);
    }
  }, [page]);

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
        </div>
        <div className="w-3/4 p-6">
          {postList.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {postList.map((post) => (
                  <PostCard
                  key={post._id}
                  id={post._id}
                  postID={post.postID}
                  image={post.image || 'https://via.placeholder.com/150?text=No+Image'}
                  title={post.title}
                  sdescription={post.sdescription}
                  author={post.author} // Tác giả bài viết
                  content={post.content} // Nội dung bài viết
                  category={post.category} // Danh mục bài viết
                />
                
                ))}
              </div>
              {hasMore && !isLoading && (
                <div className="flex justify-center mt-6">
                  <button
                    className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                    onClick={handleLoadMore}
                  >
                    Load More
                  </button>
                </div>
              )}
              {isLoading && <p className="text-center text-gray-500 mt-4">Loading...</p>}
            </>
          ) : (
            <p className="text-lg text-gray-600">No Posts found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
