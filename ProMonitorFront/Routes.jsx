import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './src/pages/auth/cadastro/signup';
import Login from './src/pages/auth/login/Login';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path='/auth/signup' element={<Signup />} />
        <Route path='/auth/login' element={<Login />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;