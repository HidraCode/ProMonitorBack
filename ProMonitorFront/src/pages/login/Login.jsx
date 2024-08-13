import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd'; 
import { AiOutlineEye, AiFillEye } from 'react-icons/ai'; 

const Login = () => {
  
  // Hook useState para controlar a visibilidade da senha
  const [showPassword, setShowPassword] = useState(false);
  
  // Cria uma instância do formulário usando o hook Form.useForm do Ant Design
  const [form] = Form.useForm();

  // Função que alterna a visibilidade da senha
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Função chamada quando o formulário é enviado com sucesso
  const handleLoginSubmit = async (values) => {
    console.log('Received values of form: ', values);
    try {
      // Envia uma requisição POST para o backend com os dados do formulário
      const response = await fetch('http://your-backend-api.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      // Processa a resposta da API
      const data = await response.json();
      if (response.ok) {
        // Se a resposta for bem-sucedida, lida com o sucesso (ex: redireciona, mostra mensagem)
        console.log('Login successful:', data);
        form.resetFields(); // Limpa os campos do formulário
      } else {
        // Se houver um erro, lida com ele (ex: mostra mensagem de erro)
        console.error('Login failed:', data);
        form.resetFields(); // Limpa os campos do formulário
      }
    } catch (error) {
      // Lida com erros de rede ou outros tipos de erro
      console.error('Error:', error);
      form.resetFields(); // Limpa os campos do formulário
    }
  };

  // Renderiza o componente de login
  return (
    <section className='w-screen h-screen flex flex-col justify-center items-center'>
      <div className='w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 h-auto flex justify-center items-center pt-16'>
        <Form
          name="login"
          form={form} // Associa a instância do formulário ao componente
          initialValues={{
            remember: true, // Define o valor inicial do campo "remember"
          }}
          className="w-full h-full flex flex-col justify-center p-8"
          onFinish={handleLoginSubmit} // Define a função a ser chamada quando o formulário é enviado com sucesso
        >
          {/* Título do formulário */}
          <h2 className="text-center text-2xl font-semibold mb-6">Login</h2>
          
          {/* Campo de entrada para o email */}
          <Form.Item
            name="username"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="mb-4"
            rules={[
              {
                required: true, // Torna o campo obrigatório
                message: 'Por favor, insira seu email!', // Mensagem de erro se o campo estiver vazio
              },
              {
                type: 'email', // Validação para verificar se o input é um email válido
                message: 'O input não é um email válido!', // Mensagem de erro se o input não for um email
              }
            ]}
          >
            <div className="flex flex-col">
              <div className="text-sm text-gray-700 mb-1">Email:</div>
              <Input 
                prefix={<UserOutlined />} // Ícone do usuário antes do input
                placeholder="Digite seu email" 
                className="h-10 pl-4"
              />
            </div>
          </Form.Item>

          {/* Campo de entrada para a senha */}
          <Form.Item
            name="password"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="mb-4"
            rules={[
              {
                required: true, // Torna o campo obrigatório
                message: 'Por favor, insira sua senha!', // Mensagem de erro se o campo estiver vazio
              },
            ]}
          >
            <div className="flex flex-col">
              <div className="text-sm text-gray-700 mb-1">Senha:</div>
              <div className="relative">
                <Input 
                  prefix={<LockOutlined />} // Ícone de cadeado antes do input
                  type={showPassword ? "text" : "password"} // Alterna o tipo de input entre "text" e "password"
                  placeholder="Digite sua senha" 
                  className="h-10 pl-4"
                />
                <div 
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={handleTogglePassword} // Chama a função para alternar a visibilidade da senha
                >
                  {showPassword ? <AiFillEye /> : <AiOutlineEye />}
                </div>
              </div>
            </div>
          </Form.Item>

          {/* Campo para lembrar da senha e link para recuperação de senha */}
          <Form.Item>
            <div className="flex justify-between items-center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Lembre-se da minha senha!</Checkbox>
              </Form.Item>
              <a href="">Esqueceu a senha?</a>
            </div>
          </Form.Item>

          {/* Botão de login e link para registro */}
          <Form.Item className="text-center">
            <Button 
              block 
              type="primary" 
              htmlType="submit" 
              className="mb-4 bg-[#0F1035] hover:bg-[#0A0B2A] h-10"
            >
              Entrar
            </Button>
            Não possui cadastro? <a href="">Cadastre-se aqui!</a>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default Login;
