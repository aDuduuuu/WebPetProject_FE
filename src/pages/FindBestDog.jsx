import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import Header from "../components/Header"; // Assuming Header is in the same folder

const FindBestDog = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  return (
    <div className="bg-C4DACB min-h-screen flex flex-col">
      {/* Add Header at the top */}
      <Header />

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
            Find the Best Dog Breed for You!
          </h1>
          <p className="text-16423C text-lg leading-relaxed mb-4">
            Answer a series of quick questions to help us find your best dog
            breed matches! We’ll ask about your preferences and needs for your
            new dog, and we’ll ask about your everyday lifestyle. The more
            questions you answer, the better matches we can make.
          </p>
          <p className="text-16423C text-lg leading-relaxed mb-6">
            Keep in mind that these matches are a great starting point, but we
            always encourage you to meet your favorite breeds in person, and
            talk with people who own or breed them to learn more!
          </p>
          <button
            className="bg-16423C text-C4DACB font-bold uppercase text-lg py-2 px-4 rounded mb-20"
            onClick={() => navigate("/question1")} // Navigate to Question1 page
          >
            Let's Go
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindBestDog;
