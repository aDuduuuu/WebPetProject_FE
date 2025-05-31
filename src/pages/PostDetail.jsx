import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import clientApi from '../client-api/rest-client';
import { useTranslation } from 'react-i18next';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const apipost = clientApi.service('posts');
        const response = await apipost.get(id);
        if (response && response.EC === 200) {
          setPost(response.DT);
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
        <p className="text-lg font-bold text-gray-600">Loading post details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-lg font-bold text-red-600">{error}</p>
      </div>
    );
  }

  const postDescriptions = {
    'Healthy Treats for Dogs': t('POST_Healthy_Treats_for_Dogs'),
    'Top 5 Tricks to Teach Your Dog': t('POST_Top_5_Tricks_to_Teach_Your_Dog'),
    'How to Socialize Your Puppy': t('POST_How_to_Socialize_Your_Puppy'),
    'The Importance of Regular Vet Checkups': t('POST_The_Importance_of_Regular_Vet_Checkups'),
    'Best Toys for Your Dog': t('POST_Best_Toys_for_Your_Dog'),
    'Top 5 Guard Dogs for Security': t('POST_Top_5_Guard_Dogs_for_Security'),
    'Top 10 Dog Parks in the City': t('POST_Top_10_Dog_Parks_in_the_City'),
    'The Benefits of Owning a Dog': t('POST_The_Benefits_of_Owning_a_Dog'),
    'How to Adopt a Rescue Dog': t('POST_How_to_Adopt_a_Rescue_Dog'),
    'Understanding Dog Behavior': t('POST_Understanding_Dog_Behavior'),
    "Best Food for Your Dog's Health": t('POST_Best_Food_for_Your_Dogs_Health'),
    'Top 5 Dog Breeds for Families': t('POST_Top_5_Dog_Breeds_for_Families'),
    'How to Train Your Dog Effectively': t('POST_How_to_Train_Your_Dog_Effectively'),
    'Best Dog Breeds for Families': t('POST_Best_Dog_Breeds_for_Families'),
    'How to Train Your Dog to Sit': t('POST_How_to_Train_Your_Dog_to_Sit'),
    'The Best Dog Breeds for Families': t('POST_The_Best_Dog_Breeds_for_Families'),
    'Essential Care Tips for Senior Dogs': t('POST_Essential_Care_Tips_for_Senior_Dogs'),
    'Why Training is Important for Your Dog': t('POST_Why_Training_is_Important_for_Your_Dog'),
    'Common Health Issues in Dogs': t('POST_Common_Health_Issues_in_Dogs'),
    'How to Adopt a Dog from a Shelter': t('POST_How_to_Adopt_a_Dog_from_a_Shelter'),
    'Creating a Dog-Friendly Home': t('POST_Creating_a_Dog_Friendly_Home'),
    'How to Spot Signs of Illness in Dogs': t('POST_How_to_Spot_Signs_of_Illness_in_Dogs'),
    'Socializing Your Dog with Other Pets': t('POST_Socializing_Your_Dog_with_Other_Pets'),
    'How to Choose the Right Dog Food': t('POST_How_to_Choose_the_Right_Dog_Food'),
    'Understanding Dog Behavior: Why Dogs Bark': t('POST_Understanding_Dog_Behavior_Why_Dogs_Bark'),
    'Choosing the Right Dog Bed for Your Pet': t('POST_Choosing_the_Right_Dog_Bed_for_Your_Pet'),
    'Preparing for a New Dog: What You Need to Know': t('POST_Preparing_for_a_New_Dog_What_You_Need_to_Know'),
    'Understanding Dog Allergies: Symptoms and Treatment': t('POST_Understanding_Dog_Allergies_Symptoms_and_Treatment'),
    'How to Manage Your Dog’s Separation Anxiety': t('POST_How_to_Manage_Your_Dogs_Separation_Anxiety'),
    'What to Do If Your Dog Gets Lost': t('POST_What_to_Do_If_Your_Dog_Gets_Lost'),
    'Preparing Your Dog for a Long Trip': t('POST_Preparing_Your_Dog_for_a_Long_Trip'),
    'How to Prevent Obesity in Dogs': t('POST_How_to_Prevent_Obesity_in_Dogs'),
    'Dog Training: The Importance of Positive Reinforcement': t('POST_Dog_Training_The_Importance_of_Positive_Reinforcement'),
    'Dog Safety: Protecting Your Dog from Dangerous Foods': t('POST_Dog_Safety_Protecting_Your_Dog_from_Dangerous_Foods'),
  };  

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 md:px-10 py-10">
        <article className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl overflow-hidden transition hover:shadow-xl duration-300">
          <div className="p-6 md:p-10">
            {/* Tiêu đề bài viết */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-2 md:space-y-0">
              <h1 className="text-4xl font-bold text-teal-700 leading-tight">{t(post.title)}</h1>
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

            {/* Tác giả và ngày đăng */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
              <span>✍️ {post.author}</span>
              <span>📅 {new Date(post.datePosted).toLocaleDateString()}</span>
            </div>

            {/* Ảnh đại diện bài viết */}
            <div className="rounded-xl overflow-hidden mb-8 border border-gray-200">
              <img
                src={post.image || 'https://via.placeholder.com/1200x600?text=No+Image'}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Nội dung được định dạng với typography */}
            <div
              className="prose prose-lg prose-teal max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: postDescriptions[post.title] || post.content }}
            />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default PostDetail;
