import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import Footer from "../components/Footer";

const FindBestDog = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <div className="bg-C4DACB min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Language Buttons dưới Header */}
      <div className="px-6 pt-4 flex justify-end">
        <div className="flex space-x-2">
          <button
            onClick={() => i18n.changeLanguage("en")}
            className="px-3 py-1 bg-[#16423C] text-white rounded shadow hover:bg-[#1f5e52] transition"
          >
            EN
          </button>
          <button
            onClick={() => i18n.changeLanguage("vi")}
            className="px-3 py-1 bg-[#16423C] text-white rounded shadow hover:bg-[#1f5e52] transition"
          >
            VI
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow flex justify-center items-center px-4">
        <div className="max-w-2xl text-center">
          <div className="mb-6">
            <img
              src="https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2022/11/16151133/Welcome-Illustration%402x.png"
              alt="Woman walking a dog"
              className="mx-auto max-w-full h-auto mt-20"
            />
          </div>
          <h1 className="text-4xl font-bold text-16423C mb-4">
            {t("findDog.title")}
          </h1>
          <p className="text-16423C text-lg leading-relaxed mb-4">
            {t("findDog.description1")}
          </p>
          <p className="text-16423C text-lg leading-relaxed mb-6">
            {t("findDog.description2")}
          </p>
          <button
            className="bg-16423C text-C4DACB font-bold uppercase text-lg py-2 px-4 rounded mb-20"
            onClick={() => navigate("/question1")}
          >
            {t("findDog.letsGo")}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FindBestDog;
