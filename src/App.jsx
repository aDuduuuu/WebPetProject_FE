// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Account from './pages/Account.jsx';
import AuthRoutes from './routes/authRoute.jsx';
import BreedList from './pages/BreedList.jsx'; // Import the new BreedList component

const App = () => (
  <Router>
    <Routes>
      <Route path="/*" element={<AuthRoutes />} />
      <Route path="/account" element={<Account />} />
      <Route path="/breed-list" element={<BreedList />} />
    </Routes>
  </Router>
);

export default App;
