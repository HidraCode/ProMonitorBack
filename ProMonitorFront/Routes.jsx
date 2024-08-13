import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './src/pages/auth/signup';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path='/auth/signup' element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;