import React from 'react';
import logo from "../../../public/logo.svg";
import { Image, Button, Layout } from 'antd';

const { Header } = Layout;

const AppHeader = ({ logoColor, button }) => {
  return (
    <Header className="h-[50px] w-full bg-custom-dark-blue flex justify-between items-center px-4">
      {/* Logo and Title */}
      <div className="flex items-center">
        {/* Prop para escolher entre os diferentes tipos de logo */}
        { logoColor || (<Image
          src={logo}
          preview={false}
          width={40}
          alt="Logo"
          className="mr-2"
        />)}
        <span className="text-white text-lg font-semibold ml-4">ProMonitor</span>
      </div>

      {/* Prop para adicionar um botão qualquer */}
      {button || (
        <Button type="link" className="text-white">
          Login
        </Button>
      )}
    </Header>
  );
};

export default AppHeader;
