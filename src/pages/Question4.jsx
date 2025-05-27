import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAnswers } from "../context/AnswerContext";
import { useTranslation } from "react-i18next";

const Question4 = () => {
  const { answers, setAnswers } = useAnswers();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const options = [
    { label: t("question4.option1"), value: 5 },
    { label: t("question4.option2"), value: 4 },
    { label: t("question4.option3"), value: 3 },
    { label: t("question4.option4"), value: 2 },
    { label: t("question4.option5"), value: 1 },
    { label: t("question4.option6"), value: 0 }
  ];

  const handleOptionClick = (value) => {
    setAnswers((prev) => ({ ...prev, coatGroomingFrequency: value }));
  };

  const handleContinue = () => {
    navigate("/question5");
  };

  const handleBack = () => {
    navigate("/question3");
  };

  return (
    <div>
      <Header />

      {/* Language Switcher */}
      <div className="px-6 pt-4 flex justify-end bg-gray-100">
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

      <div className="bg-gray-100 min-h-screen p-6 flex flex-col">
        {/* Progress bar */}
        <div className="flex items-center mb-8">
          <span className="text-gray-700 font-medium mr-4">{t("progress.label")}</span>
          <div className="w-full bg-gray-300 rounded-full h-2.5 flex items-center">
            <div
              className="bg-16423C h-2.5 rounded-full"
              style={{ width: "66.67%" }}
            ></div>
          </div>
          <span className="text-gray-700 font-medium ml-4">4/6</span>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {t("question4.title")}
          </h1>
          <p className="text-gray-600">{t("question4.description")}</p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {options.map((option) => (
            <div
              key={option.value}
              className={`flex items-center border-2 rounded-lg px-4 py-3 cursor-pointer transition ${
                answers.coatGroomingFrequency === option.value
                  ? "border-blue-600 bg-blue-100"
                  : "border-gray-300"
              }`}
              onClick={() => handleOptionClick(option.value)}
            >
              <input
                type="radio"
                name="coatGroomingFrequency"
                checked={answers.coatGroomingFrequency === option.value}
                readOnly
                className="mr-3 w-5 h-5 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-800">{option.label}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center">
          <button className="text-16423C hover:underline" onClick={handleBack}>
            {t("back")}
          </button>
          <button
            className={`font-semibold py-2 px-6 rounded-lg transition ${
              answers.coatGroomingFrequency !== null
                ? "bg-16423C text-white hover:bg-C4DACB hover:text-16423C"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={answers.coatGroomingFrequency === null}
            onClick={handleContinue}
          >
            {t("continue")}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Question4;
