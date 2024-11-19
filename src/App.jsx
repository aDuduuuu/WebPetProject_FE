// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Account from "./pages/Account.jsx";
import AuthRoutes from "./routes/authRoute.jsx";
import FilterSection from "./pages/BreedList.jsx";
import DogBreedDetail from "./pages/DogBreedDetail.jsx";
import FindBestDog from "./pages/FindBestDog.jsx";
import Question1 from "./pages/Question1";
import Question2 from "./pages/Question2";
import Question3 from "./pages/Question3";
import Question4 from "./pages/Question4";
import Question5 from "./pages/Question5";
import Question6 from "./pages/Question6";
import Question7 from "./pages/Question7";
import { AnswerProvider } from "./context/AnswerContext"; // Import AnswerProvider

const App = () => (
  <AnswerProvider>
    <Router>
      <Routes>
        <Route path="/*" element={<AuthRoutes />} />
        <Route path="/account" element={<Account />} />
        <Route path="/breed-list" element={<FilterSection />} />
        <Route path="/dogbreeds/:breedId" element={<DogBreedDetail />} />
        <Route path="/find-best-dog" element={<FindBestDog />} />
        <Route path="/question1" element={<Question1 />} />
        <Route path="/question2" element={<Question2 />} />
        <Route path="/question3" element={<Question3 />} />
        <Route path="/question4" element={<Question4 />} />
        <Route path="/question5" element={<Question5 />} />
        <Route path="/question6" element={<Question6 />} />
        <Route path="/question7" element={<Question7 />} />
      </Routes>
    </Router>
  </AnswerProvider>
);

export default App;
