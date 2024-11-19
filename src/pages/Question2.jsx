import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAnswers } from "../context/AnswerContext"; // Import context

const Question2 = () => {
  const { answers, setAnswers } = useAnswers(); // Sử dụng context để lấy và cập nhật câu trả lời
  const navigate = useNavigate();

  const options = [
    { label: "Very High Energy (60-120 minutes daily exercise)", value: 5 },
    { label: "Energetic (60-90 minutes daily exercise)", value: 4 },
    { label: "Moderate energy (30-60 mins daily exercise)", value: 3 },
    { label: "Low energy (30-45 mins daily exercise)", value: 2 },
    { label: "Calm (20-30 mins daily exercise)", value: 1 },
    { label: "No preference", value: 0 },
  ];

  const handleOptionClick = (value) => {
    setAnswers((prev) => ({ ...prev, energyLevel: value })); // Lưu giá trị vào context
  };

  const handleContinue = () => {
    navigate("/question3");
  };

  const handleBack = () => {
    navigate("/question1");
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
              style={{ width: "33.33%" }}
            ></div>
          </div>
          <span className="text-gray-700 font-medium ml-4">2/6</span>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            How energetic would you like your dog to be?
          </h1>
          <p className="text-gray-600">
            High-energy dog breeds are ready to go and eager for their next
            adventure. They'll spend their time running, jumping, and playing
            throughout the day. Low-energy breeds are usually happy to simply
            hang out with you and snooze.
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {options.map((option) => (
            <div
              key={option.value}
              className={`flex items-center border-2 rounded-lg px-4 py-3 cursor-pointer transition ${
                answers.energyLevel === option.value
                  ? "border-blue-600 bg-blue-100"
                  : "border-gray-300"
              }`}
              onClick={() => handleOptionClick(option.value)}
            >
              <input
                type="radio"
                name="energyLevel"
                checked={answers.energyLevel === option.value}
                readOnly
                className="mr-3 w-5 h-5 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-800">{option.label}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center">
          <button
            className="text-16423C hover:underline"
            onClick={handleBack}
          >
            Back
          </button>
          <button
            className={`font-semibold py-2 px-6 rounded-lg transition ${
              answers.energyLevel !== null
                ? "bg-16423C text-white hover:bg-C4DACB hover:text-16423C"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={answers.energyLevel === null}
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Question2;
