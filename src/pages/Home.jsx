import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Đảm bảo import AOS stylesheet
import '../css/Home.css';
import clientApi from '../client-api/rest-client';
import { Link } from 'react-router-dom';
import { FaPaw, FaSearch, FaBalanceScale, FaDog } from 'react-icons/fa'; // Icons for buttons

const Home = () => {
  const [postList, setPostList] = useState([]);
  const [randomDogBreed, setRandomDogBreed] = useState(null);

  useEffect(() => {
    // Khởi tạo AOS
    AOS.init({
      duration: 1200,  // Thời gian cho mỗi animation
      easing: 'ease-out-back',
    });

    // Fetch bài đăng từ API
    const fetchPosts = async () => {
      try {
        const result = await clientApi.service('posts').find({ limit: 50 });
        if (result && result.EC === 200) {
          const newPosts = result.DT.map(post => ({
            _id: post._id || post.id,
            title: post.title || 'Untitled',
            image: post.image || 'https://via.placeholder.com/150?text=No+Image',
            category: post.category || 'Uncategorized',
            datePosted: post.datePosted || '2024-01-01T00:00:00.000+00:00',
          }));

          newPosts.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
          const latestPosts = newPosts.slice(0, 5);
          setPostList(latestPosts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    // Fetch thông tin giống chó ngẫu nhiên
    const fetchRandomDogBreed = async () => {
      try {
        const result = await clientApi.service('dogbreeds').find({ limit: 100 });
        if (result && result.EC === 0 && result.DT.length > 0) {
          const randomIndex = Math.floor(Math.random() * result.DT.length);
          const randomDog = result.DT[randomIndex];
          setRandomDogBreed(randomDog);
        }
      } catch (error) {
        console.error('Error fetching dog breeds:', error);
      }
    };

    fetchPosts();
    fetchRandomDogBreed();
  }, []);

  return (
    <div className="home-container text-white flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <div className="hero-section h-screen bg-cover bg-center flex flex-col justify-center items-center relative p-20 lg:p-30">
        <div className="hero-overlay absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50"></div>
        <div className="max-w-lg text-center space-y-4 z-10">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4" data-aos="fade-up">
            A Safe Haven for Your Furry Friend
          </h1>
          <p className="text-lg mb-6" data-aos="fade-up" data-aos-delay="200">
            Provide your pet with the best care and attention they deserve at WoofHaven.
          </p>
          <button 
            className="mt-4 px-6 py-3 bg-teal-500 rounded-lg text-lg font-semibold hover:bg-teal-700 transition duration-300" 
            data-aos="fade-up" 
            data-aos-delay="400"
            onClick={() => window.location.href = '/products'} // Điều hướng đến trang /products
          >
            Purchase
          </button>
        </div>
      </div>

      {/* Additional Content Section */}
      <div className="additional-content bg-gray-100 text-gray-800 p-8 lg:p-20 flex flex-col items-center space-y-8">
        <h2 className="text-3xl font-bold mb-4" data-aos="fade-up">
          Latest Stories
        </h2>

        {/* Display Latest Posts */}
        <div className="posts-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
          {postList.map((post, index) => (
            <Link to={`/posts/${post._id}`} key={post._id} className="post-link">
              <div className="card-home" data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                <img src={post.image} alt={post.title} />
                <div className="content p-4">
                  <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{post.category}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="about-section bg-gray-100 text-gray-800 p-8 lg:p-20 flex flex-col items-center space-y-8">
        {/* Title */}
        <h2 className="text-3xl font-bold mb-4 text-center" data-aos="fade-up">
          Welcome to WoofHaven
        </h2>
        
        {/* Description */}
        <p 
          className="text-lg text-center max-w-3xl" 
          data-aos="fade-up" 
          data-aos-delay="200"
        >
          At WoofHaven, we are dedicated to providing your furry friends with the best care and attention they deserve.
          Whether you're looking for expert grooming, training, or simply the perfect breed for your family, we've got you covered.
          Join our community and give your pet the life they deserve!
        </p>

        {/* Image Gallery */}
        <div className="image-gallery flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
          <img 
            src="https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2021/01/18151213/Alaskan-Klee-Kai-head-portrait-outdoors-11.jpg" 
            alt="Alaskan Klee Kai 1" 
            className="w-full md:w-1/2 rounded-lg shadow-lg"
            data-aos="zoom-in" 
            data-aos-delay="400"
          />
          <img 
            src="https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2021/01/18151226/Alaskan-Klee-Kai-head-portrait-outdoors1.jpg" 
            alt="Alaskan Klee Kai 2" 
            className="w-full md:w-1/2 rounded-lg shadow-lg"
            data-aos="zoom-in" 
            data-aos-delay="600"
          />
        </div>
      </div>

      {/* Featured Dog Breed Section */}
      {randomDogBreed && (
        <div className="random-dog-section bg-[#C4DACB] text-[#16423C] p-8 lg:p-20 flex flex-col items-center space-y-8" data-aos="fade-up" data-aos-duration="1500">
          <h2 className="text-3xl font-bold mb-4 text-center" data-aos="fade-up" data-aos-delay="200">
            Meet Our Featured Dog Breed: <span className="text-teal-600">{randomDogBreed.name}</span>
          </h2>
          <Link to={`/dogbreeds/${randomDogBreed._id}`} className="dog-link w-full text-center" data-aos="zoom-in" data-aos-delay="400">
            <div className="dog-details flex flex-col items-center cursor-pointer hover:opacity-80">
              <img src={randomDogBreed.image} alt={randomDogBreed.name} className="w-72 h-72 object-cover rounded-lg shadow-xl mb-4" />
              <p className="text-lg text-[#16423C] text-center" data-aos="fade-up" data-aos-delay="600">
                Breed Name: <span className="font-semibold">{randomDogBreed.name}</span>
              </p>
              <p className="text-sm text-[#16423C] mt-2 text-center" data-aos="fade-up" data-aos-delay="800">
                Discover more about this friendly and loving breed!
              </p>
            </div>
          </Link>

          {/* Breed Functionality Buttons */}
          <div className="breed-buttons grid grid-cols-2 gap-6 mt-8">
            <Link to="/breedList" className="breed-button p-6 bg-teal-500 text-white rounded-lg text-center flex flex-col items-center hover:bg-teal-700 transition duration-300" data-aos="fade-up" data-aos-delay="100">
              <FaPaw className="text-3xl mb-2" />
              <span>EXPLORE BREED</span>
            </Link>
            <Link to="/bestDog" className="breed-button p-6 bg-teal-500 text-white rounded-lg text-center flex flex-col items-center hover:bg-teal-700 transition duration-300" data-aos="fade-up" data-aos-delay="200">
              <FaSearch className="text-3xl mb-2" />
              <span>FIND YOUR MATCH</span>
            </Link>
            <Link to="/compareDogs" className="breed-button p-6 bg-teal-500 text-white rounded-lg text-center flex flex-col items-center hover:bg-teal-700 transition duration-300" data-aos="fade-up" data-aos-delay="300">
              <FaBalanceScale className="text-3xl mb-2" />
              <span>COMPARE BREED</span>
            </Link>
            <Link to="/dog-name-finder" className="breed-button p-6 bg-teal-500 text-white rounded-lg text-center flex flex-col items-center hover:bg-teal-700 transition duration-300" data-aos="fade-up" data-aos-delay="400">
              <FaDog className="text-3xl mb-2" />
              <span>DOG NAME FINDER</span>
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
