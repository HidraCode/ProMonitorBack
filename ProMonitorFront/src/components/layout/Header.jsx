import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import logo from "../../../public/logo.svg";
import { Image, Button, Layout } from 'antd';

const { Header } = Layout;

const AppHeader = ({ logoColor }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Handlers for button clicks
  const handleLoginClick = () => {
    navigate('/auth/login');
  };

  const handleSignupClick = () => {
    navigate('/auth/signup');
  };

  const handleLogoClick = () => {
    navigate('/'); // Navigate to the home page
  };

  return (
    <Header className="h-16 w-full bg-custom-dark-blue flex justify-between items-center px-4 sm:px-6">
      {/* Logo and Title */}
      <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
        {/* Prop para escolher entre os diferentes tipos de logo */}
        {logoColor || (
          <Image
            src={logo}
            preview={false}
            width={32} // Adjusted size for better mobile view
            alt="Logo"
            className="mr-2"
          />
        )}
        <span className="text-white text-lg sm:text-xl font-semibold ml-2 sm:ml-4">ProMonitor</span>
      </div>

      {/* Buttons for Login and Signup */}
      <div className="hidden sm:flex space-x-4">
        <Button
          type="link"
          className="text-white hover:text-gray-300"
          onClick={handleLoginClick}
        >
          Login
        </Button>
        <Button
          type="primary"
          className="text-white bg-indigo-600 hover:bg-indigo-500"
          onClick={handleSignupClick}
        >
          Cadastro
        </Button>
      </div>

      {/* Mobile menu toggle button */}
      <div className="flex sm:hidden space-x-2">
        <Button
          type="link"
          className="text-white hover:text-gray-300"
          onClick={handleLoginClick}
        >
          Login
        </Button>
        <Button
          type="primary"
          className="text-white bg-indigo-600 hover:bg-indigo-500"
          onClick={handleSignupClick}
        >
          Cadastro
        </Button>
      </div>
    </Header>
  );
};

export default AppHeader;
