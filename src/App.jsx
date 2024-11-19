// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Account from './pages/Account.jsx';
import AuthRoutes from './routes/authRoute.jsx';
import FilterSection from './pages/BreedList.jsx';
import DogBreedDetail from './pages/DogBreedDetail.jsx';

const App = () => (
  <Router>
    <Routes>
      <Route path="/*" element={<AuthRoutes />} />
      <Route path="/account" element={<Account />} />
      <Route path="/breed-list" element={<FilterSection />} />
      <Route path="/dogbreeds/:breedId" element={<DogBreedDetail />} />
    </Routes>
  </Router>
);

export default App;
