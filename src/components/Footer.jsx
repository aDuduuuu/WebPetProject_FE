import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-16423C text-C4DACB py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul>
              <li><a href="#" className="text-C4DACB hover:text-white">{t('footer.aboutUs')}</a></li>
              <li><a href="#" className="text-C4DACB hover:text-white">{t('footer.services')}</a></li>
              <li><a href="#" className="text-C4DACB hover:text-white">{t('footer.contact')}</a></li>
              <li><a href="#" className="text-C4DACB hover:text-white">{t('footer.privacyPolicy')}</a></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-semibold mb-4">{t('footer.help')}</h3>
            <ul>
              <li><a href="#" className="text-C4DACB hover:text-white">{t('footer.advise')}</a></li>
              <li><a href="#" className="text-C4DACB hover:text-white">{t('footer.serviceSupport')}</a></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-semibold mb-4">{t('footer.followUs')}</h3>
            <div className="flex space-x-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-C4DACB hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-C4DACB hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-C4DACB hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-C4DACB hover:text-white">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-C4DACB pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} WoofHaven. {t('footer.rightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
