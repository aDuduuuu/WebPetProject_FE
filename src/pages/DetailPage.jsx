import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import clientApi from '../client-api/rest-client';
import { useTranslation } from 'react-i18next';


const DetailPage = ({ type }) => {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const apiService = type === 'spa' ? clientApi.service('spas') : clientApi.service('trainers');
        const response = await apiService.get(id);
        if (response.EC === 0) {
          setDetail(response.DT);
        } else {
          setError(response.EM);
        }
      } catch (err) {
        setError('Failed to fetch details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, type]);

  if (loading || !detail) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-lg font-medium text-gray-600">Loading details...</p>
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

  const {
    name,
    image,
    location = {},
    services = [],
    contactInfo = {},
    description,
    workingHours = {},
  } = detail;

  const getServiceIcon = (service) => {
    switch (service.toLowerCase()) {
      case 'caring':
        return '🫶';
      case 'grooming':
        return '✂️';
      case 'hair trimming':
        return '💇';
      case 'massaging':
        return '💆';
      case 'medicines':
        return '💊';
      case 'running':
        return '🏃';
      case 'showering':
        return '🚿';
      default:
        return '🔹'; // fallback icon
    }
  };
  

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
                <h1 className="text-4xl font-bold text-teal-700">{t(`names.${name}`, name)}</h1>
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
                  {[location.street, location.ward, location.district, location.province]
                    .filter(Boolean)
                    .join(', ') || t('infoSection.noLocation')}
                </p>
              </div>

              {/* Services */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">🛎 {t('infoSection.services')}</h2>
                {services.length ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-gray-700">
                    {services.map((s, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-md bg-teal-50 border border-teal-200 shadow-sm"
                      >
                        <span>{getServiceIcon(s)}</span>
                        <span className="font-medium">{t(`services.${s}`, s)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">{t('infoSection.noServices')}</p>
                )}
              </div>

              {/* Contact */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800">📞 {t('infoSection.contact')}</h2>
                <p className="text-gray-600 mt-1">
                  <span>{t('infoSection.phone')}: {contactInfo.phone || t('infoSection.noValue')}</span><br />
                  <span>{t('infoSection.email')}: {contactInfo.email || t('infoSection.noValue')}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t p-6 bg-gray-50">
            {/* Working Hours */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">🕒 {t('infoSection.workingHours')}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {['monday','tuesday','wednesday','thursday','friday','saturday','sunday'].map((day) => {
                  const hours = workingHours[day];
                  const isClosed = !hours || hours.trim().toLowerCase() === 'closed';
                  const displayText = isClosed ? t('infoSection.noSchedule') : hours;

                  return (
                    <div
                      key={day}
                      className={`rounded-xl p-3 border shadow-sm text-sm ${
                        isClosed
                          ? 'bg-gray-100 text-gray-400 border-gray-200'
                          : 'bg-teal-50 text-gray-800 border-teal-300'
                      }`}
                    >
                      <div className="font-medium capitalize">{t(`days.${day}`)}</div>
                      <div>{displayText}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">📝 {t('infoSection.description')}</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {t(`descriptions.${name}`, description || t('infoSection.noDescription'))}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DetailPage;
