import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAnswers } from "../context/AnswerContext";

const Question4 = () => {
  const { answers, setAnswers } = useAnswers();
  const navigate = useNavigate();

  const options = [
    { label: "Monthly", value: 5 },
    { label: "Twice a month", value: 4 },
    { label: "Every week", value: 3 },
    { label: "Two to three times a week", value: 2 },
    { label: "Every day", value: 1 },
    { label: "No preference", value: 0 },
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
      <div className="bg-gray-100 min-h-screen p-6 flex flex-col">
        {/* Progress bar */}
        <div className="flex items-center mb-8">
          <span className="text-gray-700 font-medium mr-4">Progress</span>
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
            How frequently can you care for your dog’s grooming needs?
          </h1>
          <p className="text-gray-600">
            Consider how much time, patience, and budget you have for
            professional grooming when you make this selection. All breeds
            require regular nail trimming, and if you’re really motivated, you
            can learn some grooming techniques to do safely at home.
          </p>
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
            Back
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
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Question4;
