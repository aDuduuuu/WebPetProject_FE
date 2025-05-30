import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import clientApi from '../client-api/rest-client';
import { useTranslation } from 'react-i18next';

const DogSellerDetail = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchDogSeller = async () => {
      try {
        const sellerResponse = await clientApi.service('dogsellers').get(id);

        if (sellerResponse.EC === 200) {
          setDetail(sellerResponse.DT);
          const breedIds = (sellerResponse.DT.breeds || []).map((b) => b._id || b);

          if (breedIds.length > 0) {
            const breedResponses = await Promise.all(
              breedIds.map((id) => clientApi.service('dogbreeds').get(id))
            );
            const breedNames = breedResponses.map((res) => res.DT.name);
            setBreeds(breedNames);
          }
        } else {
          setError(sellerResponse.EM || 'Failed to fetch dog seller details.');
        }
      } catch (err) {
        setError('An error occurred while fetching the dog seller.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDogSeller();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-lg font-medium text-gray-600">{t('loading')}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-red-600">Error</h1>
            <p className="text-gray-600 mt-2">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg font-bold text-gray-700">{t('noDetails')}</p>
      </div>
    );
  }

  const { name, image, location, contactInfo = '' } = detail;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="grid md:grid-cols-3 gap-6 p-6">
            {/* Image */}
            <div className="col-span-1 w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={image || 'https://via.placeholder.com/400?text=No+Image'}
                alt={name}
                className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400?text=No+Image';
                }}
              />
            </div>

            {/* Info */}
            <div className="col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-teal-700">{name}</h1>
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

              {/* Location */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800">📍 {t('infoSection.location')}</h2>
                <p className="text-gray-600 mt-1">
                  {typeof location === 'string'
                    ? location
                    : [location.street, location.ward, location.district, location.province]
                        .filter(Boolean)
                        .join(', ') || t('infoSection.noLocation')}
                </p>
              </div>

              {/* Breeds */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800">🐶 {t('infoSection.breeds')}</h2>
                {breeds.length > 0 ? (
                  <ul className="flex flex-wrap gap-2 text-sm text-gray-700">
                    {breeds.map((b, i) => (
                      <li key={i} className="px-3 py-1 bg-teal-50 rounded-full border border-teal-200">
                        {b}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">{t('infoSection.noBreeds')}</p>
                )}
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800">📞 {t('infoSection.contact')}</h2>
                <p className="text-gray-600 mt-1">
                  {contactInfo || t('infoSection.noValue')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DogSellerDetail;
