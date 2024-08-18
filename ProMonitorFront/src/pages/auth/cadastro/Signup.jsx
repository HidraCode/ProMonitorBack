import { React, useState } from 'react';
import InputMask from 'react-input-mask'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Row, Col, Form, Input, Button, Image, Space, Switch } from 'antd';
import logo from "../../../../public/logo.svg"
import bg_esquerda from "../../../assets/bg_esquerda.png"
import AppHeader from '../../../components/layout/Header';

const Signup = () => {  

  const [form] = Form.useForm();
  const [password, setPassword] = useState('');
  const [isStudent, setIsStudent] = useState(true);

  const validateConfirmPassword = (_, value) => {
    if (value === password) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('As senhas não são iguais!'));
  };

  const handleSwitchChange = (checked, unchecked) => {
    setIsStudent(checked);
    setIsEmployee(unchecked)
  };


  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
      <>
      <AppHeader />
      <Row className="w-full max-w-screen-xl">
        {/* Left Side */}
        <Col
          span={12}
          className="flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${bg_esquerda})`, background: "cover" }}
        >
          <div className="text-white text-center p-8 bg-opacity-75">
            <Row>
              <Col span={4} />
              <Col span={8}>
                <Image src={logo} preview={false} width={120} />
              </Col>
              <Col span={12}>
                <div className='flex items-center justify-center h-full'>
                  <h1 className="text-4xl text-balance text-left font-bold">
                    {isStudent ? "ProMonitor Alunos" : "ProMonitor Funcionários"}
                  </h1>
                </div>
              </Col>
            </Row>
            <div className="mt-8">
              <Switch 
                className='bg-custom-dark-blue' 
                checkedChildren="Sou Aluno" 
                unCheckedChildren="Sou Funcionário" 
                defaultChecked 
                onChange={handleSwitchChange}
              />
            </div>
          </div>
        </Col>

        {/* Right Side */}
        <Col span={12} className="flex items-center justify-center bg-white">
          <Form
            layout="vertical"
            className="w-full max-w-md p-8"
            form={form}
            onFinish={handleSubmit}
          >
            <h2 className="flex items-center justify-center text-2xl font-bold mb-6">Cadastre-se:</h2>

                {/* Nome completo */}
              <Form.Item 
                label="Nome completo"
                name="nome"
                rules={[{ required: true, message: 'Por favor, insira seu nome completo!' }, { max: 100, message: 'O nome completo não pode exceder 100 caracteres!' }]}
              >
                <Input />
              </Form.Item>

                <Row gutter={16}>
                  {/* Matrícula */}
                  <Col span={12}>
                    <Form.Item 
                      label="Matrícula"
                      name="matricula"
                      rules={[{ required: true, message: 'Por favor, insira sua matrícula!' }, { min: 10, message: 'A matrícula deve possuir no mínimo 10 caracteres!' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  {/* CPF */}
                  <Col span={12}>
                    <Form.Item 
                      label="CPF"
                      name="cpf"
                      rules={[{ required: true, message: 'Por favor, insira seu CPF!' }]}
                    >
                      <InputMask mask="999.999.999-99">
                        {(inputProps) => <Input {...inputProps} />}
                      </InputMask>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  {/* Telefone */}
                  <Col span={12}>
                    <Form.Item 
                      label="Telefone"
                      name="telefone"
                      rules={[{ required: true, message: 'Por favor, insira seu telefone!' }]}
                    >
                      <InputMask mask="(99) 9 9999-9999">
                        {(inputProps) => <Input {...inputProps} />}
                      </InputMask>
                    </Form.Item>
                  </Col>

                  {/* Data de nascimento */}
                  <Col span={12}>
                    <Form.Item 
                      label="Data de nascimento"
                      name="data_nascimento"
                      rules={[{ required: true, message: 'Por favor, insira sua data de nascimento!' } ]}
                    >
                      <InputMask mask="99/99/9999">
                        {(inputProps) => <Input {...inputProps} />}
                      </InputMask>
                    </Form.Item>
                  </Col>
                </Row>

                {/* Email */}
                <Form.Item 
                  label="Digite seu email"
                  name="email"
                  rules={[{ required: true, message: 'Por favor, insira seu email!' }]}
                >
                  <Input />
                </Form.Item>

                <Row gutter={16}>
                  {/* Senha */}
                  <Col span={12}>
                    <Form.Item 
                      label="Senha"
                      name="senha"
                      rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
                    >
                      <Input.Password onChange={e => setPassword(e.target.value)} />
                    </Form.Item>
                  </Col>

                  {/* Confirmar senha */}
                  <Col span={12}>
                    <Form.Item 
                      label="Confirmar senha"
                      name="confirmar_senha"
                      rules={[{ required: true, message: 'Por favor, confirme sua senha!' }, { validator: validateConfirmPassword }]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>
                </Row>

              <Button type="primary" className="w-full mt-4 bg-custom-dark-blue" htmlType="submit">Entrar</Button>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default Signup;
