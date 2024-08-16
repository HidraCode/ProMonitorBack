import React, { useState } from 'react';
import { Form, Input, Switch, Button } from 'antd';

const SignupForm = () => {
  const [isEmployee, setIsEmployee] = useState(false);

  const onSwitchChange = (checked) => {
    setIsEmployee(checked);
  };

  const onFinish = (values) => {
    console.log('Form values:', values);
  };

  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div
        className="w-1/2 flex flex-col items-center justify-center"
        style={{
          backgroundImage: "url('http://localhost:5173/assets/bg_esquerda.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-center bg-opacity-75 bg-black p-8 rounded-lg">
          <img src="/path/to/logo.png" alt="Logo" className="w-24 mx-auto mb-4" />
          <h1 className="text-white text-3xl mb-6">Título Aqui</h1>
          <Switch
            checkedChildren="Sou Funcionário"
            unCheckedChildren="Sou Aluno"
            onChange={onSwitchChange}
            className="bg-white"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 bg-gray-100 flex items-center justify-center">
        <Form
          className="w-3/4 bg-white p-8 rounded-lg shadow-md"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item label="Nome completo" name="fullName" rules={[{ required: true, message: 'Por favor, insira seu nome completo!' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Matrícula" name="matricula" rules={[{ required: true, message: 'Por favor, insira sua matrícula!' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="CPF" name="cpf" rules={[{ required: true, message: 'Por favor, insira seu CPF!' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Telefone" name="phone" rules={[{ required: true, message: 'Por favor, insira seu telefone!' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Data de Nascimento" name="birthdate" rules={[{ required: true, message: 'Por favor, insira sua data de nascimento!' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Por favor, insira um email válido!' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Senha" name="password" rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item label="Confirmar Senha" name="confirmPassword" dependencies={['password']} rules={[
            { required: true, message: 'Por favor, confirme sua senha!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('As senhas não coincidem!'));
              },
            }),
          ]}>
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Registrar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignupForm;
