// app.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AuthRoutes from './routes/authRoute.jsx';

const App = () => (
  <Router>
    <AuthRoutes />
  </Router>
);

export default App;
