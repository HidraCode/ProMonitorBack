import React from 'react';
import AppHeader from '../components/layout/Header.jsx';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignUpClick = () => {
    navigate('/auth/signup'); // Navigate to the signup page
  };

  return (
    <div className="bg-white h-screen w-screen flex flex-col">
      <AppHeader />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-2xl px-6">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Gerencie processos de monitoria com eficiência
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            O ProMonitor facilita a seleção e o acompanhamento das atividades dos monitores,
            proporcionando uma experiência integrada e automatizada para instituições de ensino.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={handleSignUpClick}
              className="rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:bg-indigo-700 transition duration-300"
            >
              Cadastre-se Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
