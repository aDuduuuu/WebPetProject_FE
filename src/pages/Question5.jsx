import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAnswers } from "../context/AnswerContext";

const Question5 = () => {
  const { answers, setAnswers } = useAnswers(); // Sử dụng context để lấy và lưu câu trả lời
  const navigate = useNavigate();

  const options = [
    { label: "Very vocal", value: 5 },
    { label: "Frequent barking", value: 4 },
    { label: "Some barking", value: 3 },
    { label: "Infrequent barking", value: 2 },
    { label: "Quiet most of the time", value: 1 },
    { label: "No preference", value: 0 },
  ];

  const handleOptionClick = (value) => {
    setAnswers((prev) => ({ ...prev, barkingLevel: value })); // Lưu giá trị vào context
  };

  const handleContinue = () => {
    navigate("/question6");
  };

  const handleBack = () => {
    navigate("/question4");
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
              style={{ width: "83.33%" }}
            ></div>
          </div>
          <span className="text-gray-700 font-medium ml-4">5/6</span>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            How much barking or other vocalizations are you okay with?
          </h1>
          <p className="text-gray-600">
            While some breeds will bark at every passer-by or bird in the
            window, others will only bark in particular situations. Some
            “barkless” breeds can still be vocal, using other sounds to express
            themselves.
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {options.map((option) => (
            <div
              key={option.value}
              className={`flex items-center border-2 rounded-lg px-4 py-3 cursor-pointer transition ${
                answers.barkingLevel === option.value
                  ? "border-blue-600 bg-blue-100"
                  : "border-gray-300"
              }`}
              onClick={() => handleOptionClick(option.value)}
            >
              <input
                type="radio"
                name="barkingLevel"
                checked={answers.barkingLevel === option.value}
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
              answers.barkingLevel !== null
                ? "bg-16423C text-white hover:bg-C4DACB hover:text-16423C"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={answers.barkingLevel === null}
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

export default Question5;
