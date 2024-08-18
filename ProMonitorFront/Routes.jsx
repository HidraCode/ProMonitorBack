import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './src/pages/auth/cadastro/Signup';
import Login from './src/pages/auth/login/Login';
import RecuperarSenha from './src/pages/auth/login/RecuperarSenha';
import VerificarCodigo from './src/pages/auth/login/VerificarCodigo';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path='/auth/signup' element={<Signup />} />
        <Route path='/auth/login' element={<Login />} />
        <Route path='/auth/pass-recovery' element={<RecuperarSenha />} />
        <Route path='auth/pass-recovery/verify-code' element={<VerificarCodigo />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;