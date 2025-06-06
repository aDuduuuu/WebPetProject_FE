import React, { useEffect } from "react";
import "../css/BotpressPage.css";
import Header from '../components/Header';
import Footer from '../components/Footer';
import dogVideo from '../pictures/Dog10.mp4';
import logo from '../pictures/heart-with-dog.png';
import { useTranslation } from 'react-i18next';

const BotpressPage = () => {
  useEffect(() => {
    if (window.botpress) {
      window.botpress.open();
      return;
    }

    const existingScript = document.querySelector('script[src="https://cdn.botpress.cloud/webchat/v2.4/inject.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.botpress) {
          window.botpress.init({
            botId: "342c967c-daad-4d2d-8931-b23a0f75e7b0",
            clientId: "5d3dfeb5-eb4b-4180-8346-f5ca3e4312f9",
            selector: "#webchat",
            configuration: {
              version: "v1",
              color: "#1a73e8",
              variant: "solid",
              headerVariant: "glass",
              themeMode: "light",
              fontFamily: "Inter",
              radius: 6,
              feedbackEnabled: false,
            }
          });
          window.botpress.open();
        }
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.botpress.cloud/webchat/v2.4/inject.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.botpress.init({
        botId: "342c967c-daad-4d2d-8931-b23a0f75e7b0",
        clientId: "5d3dfeb5-eb4b-4180-8346-f5ca3e4312f9",
        selector: "#webchat",
        configuration: {
          version: "v1",
          color: "#00796b",
          variant: "solid",
          headerVariant: "glass",
          themeMode: "light",
          fontFamily: "inter", 
          radius: 4,           
          feedbackEnabled: false,
          botName: "WoofHaven AI",
          avatarUrl: logo
        }
      });
      window.botpress.open();
    };
  }, []);

  const { t, i18n } = useTranslation();

  return (
    <div className="botpress-page-container">
      <Header />

      <div className="language-switcher">
        <button
          onClick={() => i18n.changeLanguage('en')}
          className="lang-btn"
        >
          EN
        </button>
        <button
          onClick={() => i18n.changeLanguage('vi')}
          className="lang-btn"
        >
          VI
        </button>
      </div>

      <main className="content-container">
        <div className="left-panel">
          <section className="intro-section">
            <h2>{t('intro.title')}</h2>
            <p>{t('intro.description1')}</p>
            <p>{t('intro.description2')}</p>
          </section>

          <section className="video-section">
            <video
              src={dogVideo}
              autoPlay
              loop
              muted
              playsInline
              className="video-player"
            />
          </section>
        </div>

        <div className="right-panel">
          <div id="webchat"></div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BotpressPage;
