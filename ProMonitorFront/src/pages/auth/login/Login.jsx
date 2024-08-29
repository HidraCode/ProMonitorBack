import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { AiOutlineEye, AiFillEye } from 'react-icons/ai';
import AppHeader from '../../../components/layout/Header';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form] = Form.useForm();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginSubmit = async (values) => {
    console.log('Dados enviados:', values);
    // Você pode adicionar um request para o backend aqui
  };

  return (
    <>
      <AppHeader />
      <section className="flex flex-col min-h-screen">
        <div className="flex flex-1 flex-col justify-center items-center px-4">
          <div className="w-full max-w-md bg-white p-6 rounded-lg">
            <Form
              name="login"
              form={form}
              className="w-full"
              onFinish={handleLoginSubmit}
            >
              <h2 className="text-center text-2xl font-semibold mb-6">Login</h2>

              <Form.Item
                name="username"
                className="mb-4"
                rules={[
                  { required: true, message: 'Por favor, insira seu email!' },
                  { type: 'email', message: 'O input não é um email válido!' }
                ]}
              >
                <div className="flex flex-col">
                  <div className="text-sm text-gray-700 mb-1">Email:</div>
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="Digite seu email" 
                    className="h-10 pl-4"
                  />
                </div>
              </Form.Item>

              <Form.Item
                name="password"
                className="mb-4"
                rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
              >
                <div className="flex flex-col">
                  <div className="text-sm text-gray-700 mb-1">Senha:</div>
                  <div className="relative">
                    <Input 
                      prefix={<LockOutlined />} 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Digite sua senha" 
                      className="h-10 pl-4"
                    />
                    <div 
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                      onClick={handleTogglePassword}
                    >
                      {showPassword ? <AiFillEye /> : <AiOutlineEye />}
                    </div>
                  </div>
                </div>
              </Form.Item>

              <Form.Item>
                <div className="flex flex-row justify-between items-center">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Lembre-se da minha senha!</Checkbox>
                  </Form.Item>
                  <a href="#" className="text-blue-500 hover:underline">Esqueceu a senha?</a>
                </div>
              </Form.Item>

              <Form.Item className="text-center">
                <Button 
                  block 
                  type="primary" 
                  htmlType="submit" 
                  className="mb-4 bg-[#0F1035] hover:bg-[#0A0B2A] h-10"
                >
                  Entrar
                </Button>
                Não possui cadastro? <a href="#" className="text-blue-500 hover:underline">Cadastre-se aqui!</a>
              </Form.Item>
            </Form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
