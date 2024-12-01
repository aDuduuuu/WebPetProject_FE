import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAnswers } from "../context/AnswerContext";

const Question6 = () => {
  const { answers, setAnswers } = useAnswers(); // Sử dụng context để lấy và lưu câu trả lời
  const navigate = useNavigate();

  const options = [
    { label: "X-Large", value: "X-Large" },
    { label: "Large", value: "Large" },
    { label: "Medium", value: "Medium" },
    { label: "Small", value: "Small" },
    { label: "X-Small", value: "X-Small" },
    { label: "No preference", value: "No preference" },
  ];

  const handleOptionClick = (value) => {
    setAnswers((prev) => ({ ...prev, size: value })); // Lưu giá trị vào context
  };

  const handleContinue = () => {
    navigate("/question7");
  };

  const handleBack = () => {
    navigate("/question5");
  };

  return (
    <div>
      <Header />
      <div className="bg-gray-100 min-h-screen p-6 flex flex-col">
        {/* Progress bar */}
        <div className="flex items-center mb-8">
          <span className="text-gray-700 font-medium mr-4">Progress</span>
          <div className="w-full bg-gray-300 rounded-full h-2.5 flex items-center">
            <div
              className="bg-16423C h-2.5 rounded-full"
              style={{ width: "100%" }}
            ></div>
          </div>
          <span className="text-gray-700 font-medium ml-4">6/6</span>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            What size dog do you want?
          </h1>
          <p className="text-gray-600">
            From extra small to extra large (and all sizes in between), there’s
            an ideal fit for every dog-loving household. Big size doesn’t always
            equal big energy, so some large breeds can live just about anywhere.
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {options.map((option) => (
            <div
              key={option.value}
              className={`flex items-center border-2 rounded-lg px-4 py-3 cursor-pointer transition ${
                answers.size === option.value
                  ? "border-blue-600 bg-blue-100"
                  : "border-gray-300"
              }`}
              onClick={() => handleOptionClick(option.value)}
            >
              <input
                type="radio"
                name="size"
                checked={answers.size === option.value}
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
            Back
          </button>
          <button
            className={`font-semibold py-2 px-6 rounded-lg transition ${
              answers.size !== null
                ? "bg-16423C text-white hover:bg-C4DACB hover:text-16423C"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={answers.size === null}
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Question6;
