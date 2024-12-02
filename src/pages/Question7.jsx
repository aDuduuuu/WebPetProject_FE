import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAnswers } from "../context/AnswerContext"; // Import context
import clientApi from "../client-api/rest-client"; // Import API client
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Button } from "antd";

const Question7 = () => {
  const { answers } = useAnswers(); // Lấy câu trả lời từ context
  const [matches, setMatches] = useState([]); // Lưu kết quả từ API
  const [selectedMatch, setSelectedMatch] = useState(0); // Lựa chọn giống chó hiện tại
  const [loading, setLoading] = useState(false); // Trạng thái tải
  const [error, setError] = useState(null); // Lỗi nếu có
  const navigate = useNavigate(); // Khởi tạo navigate

  const fetchDogBreeds = async () => {
    setLoading(true);
    setError(null);

    let authen = clientApi.service("dogbreeds");

    const requestPayload = {
      trainabilityLevel: answers.trainabilityLevel,
      energyLevel: answers.energyLevel,
      sheddingLevel: answers.sheddingLevel,
      coatGroomingFrequency: answers.coatGroomingFrequency,
      barkingLevel: answers.barkingLevel,
      size: answers.size,
    };

    try {
      const response = await authen.find(requestPayload);
      console.log("API Response:", response); // Ghi log để kiểm tra dữ liệu trả về

      if (response.EC === 0) {
        // Tạo danh sách giống chó với số lượng thuộc tính khớp
        const updatedMatches = response.DT.map((match) => {
          const characteristics = [
            {
              label: "Trainability",
              value: match.trainabilityLevel,
              match: match.trainabilityLevel === answers.trainabilityLevel,
            },
            {
              label: "Energy Level",
              value: match.energyLevel,
              match: match.energyLevel === answers.energyLevel,
            },
            {
              label: "Shedding Level",
              value: match.sheddingLevel,
              match: match.sheddingLevel === answers.sheddingLevel,
            },
            {
              label: "Coat Grooming Frequency",
              value: match.coatGroomingFrequency,
              match: match.coatGroomingFrequency === answers.coatGroomingFrequency,
            },
            {
              label: "Barking Level",
              value: match.barkingLevel,
              match: match.barkingLevel === answers.barkingLevel,
            },
            {
              label: "Size",
              value: match.size,
              match: match.size === answers.size,
            },
          ];

          // Tính tổng số lượng thuộc tính match
          const matchCount = characteristics.filter((char) => char.match).length;

          return {
            ...match,
            characteristics,
            matchCount, // Thêm tổng số lượng match vào object
          };
        });

        // Sắp xếp danh sách theo số lượng thuộc tính khớp giảm dần
        const sortedMatches = updatedMatches.sort((a, b) => b.matchCount - a.matchCount);

        console.log("Sorted Matches:", sortedMatches); // Kiểm tra danh sách đã sắp xếp
        setMatches(sortedMatches.slice(0, 5)); // Lấy top 5 kết quả
      } else {
        setError(response.EM || "No matching breeds found.");
        setMatches([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch dog breeds.");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDogBreeds();
  }, [answers]);

  const handleMatchClick = (index) => {
    setSelectedMatch(index);
  };

  const currentMatch = matches[selectedMatch];

  const handleFindPuppies = () => {
    navigate(`/dogbreeds/${currentMatch.id}`); // Điều hướng đến trang chi tiết với `id`
  };

  const handleViewDetails = (breedId) => {
    navigate(`/dogbreeds/${breedId}`);
  };

  return (
    <div>
      <Header />
      <div className="bg-gray-100 min-h-screen p-6 flex flex-col">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Top 5 Matches
        </h1>

        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && !error && matches.length > 0 && (
          <>
            <div className="flex items-center gap-4 mb-6">
              {matches.map((match, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 rounded-full cursor-pointer ${selectedMatch === index ? "border-16423C border-4" : ""
                    }`}
                  onClick={() => handleMatchClick(index)}
                >
                  <img
                    src={match.image || "https://via.placeholder.com/300"}
                    alt={match.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                  <div className="text-center text-sm font-bold">
                    Top {index + 1} ({match.matchCount} matches) {/* Hiển thị số lượng match */}
                  </div>
                  {match.rare && (
                    <div className="text-yellow-600 text-xs text-center mt-1">
                      Rare Breed
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex">
              {/* Left Section */}
              <div className="w-2/3">
                <div className="flex items-center mb-4 mt-10">
                <div className="bg-[#C4DACB] p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-bold text-[#16423C] mb-7">
                    {currentMatch.name}
                  </h2>
                  <p className="text-[#16423C]">{currentMatch.description}</p>
                </div>
                </div>
                <div className="w-full h-90 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
                  <img
                    src={currentMatch.image || "https://via.placeholder.com/300"}
                    alt={currentMatch.name}
                    className="max-w-full max-h-full"
                  />
                </div>
                <div className="mt-4 flex justify-center">
                  <button 
                    onClick={() => handleViewDetails(currentMatch._id)}
                    className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>  
              </div>

              {/* Right Section */}
              <div className="w-1/3 bg-white rounded-lg shadow-lg p-4 ml-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Breed Characteristics</h3>
                <div className="space-y-4">
                  {currentMatch.characteristics?.map((char, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 rounded-lg p-3 shadow-sm"
                    >
                      {/* Characteristic Label and Value */}
                      <div className="flex flex-col">
                        <span className="text-gray-600 font-semibold">{char.label || "Unknown Characteristic"}:</span>
                        <span className="text-gray-800">{char.value || "Not Available"}</span>
                      </div>

                      {/* Match Indicator */}
                      {char.match !== null && (
                        <div
                          className={`ml-4 px-3 py-1 text-sm font-bold rounded-lg ${char.match ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                            }`}
                        >
                          {char.match
                            ? `${char.label} matches your preference ✔`
                            : `${char.label} doesn't match your preference ✘`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Question7;
