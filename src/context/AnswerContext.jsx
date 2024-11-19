import React, { createContext, useState, useContext } from "react";

// Tạo AnswerContext
const AnswerContext = createContext();

// Provider để quản lý trạng thái toàn cục
export const AnswerProvider = ({ children }) => {
  const [answers, setAnswers] = useState({
    trainabilityLevel: null,
    energyLevel: null,
    sheddingLevel: null,
    coatGroomingFrequency: null,
    barkingLevel: null,
    size: null,
    // Thêm các câu trả lời khác nếu cần
  });

  // Hàm cập nhật câu trả lời theo key-value
  const updateAnswer = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <AnswerContext.Provider value={{ answers, setAnswers, updateAnswer }}>
      {children}
    </AnswerContext.Provider>
  );
};

// Custom hook để sử dụng AnswerContext
export const useAnswers = () => useContext(AnswerContext);
