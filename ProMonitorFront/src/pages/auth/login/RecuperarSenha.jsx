import React from "react";
import { Col, Row, Form, Button, Input } from 'antd';
import logoPreta from '../../../assets/logoPreta.svg'
import { LeftOutlined } from '@ant-design/icons';

const RecuperarSenha = () => {

    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
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
                // Se a resposta for bem-sucedida, redireciona para a página VerificarCodigo
                console.error('Password recovery successful:', data);
                form.resetFields(); // Limpa os campos do formulário
            } else {
                // Se houver um erro, lida com ele (ex: mostra mensagem de erro)
                console.error('Password recovery failed:', data);
                form.resetFields(); // Limpa os campos do formulário
            }
        } catch (error) {
            // Lida com erros de rede ou outros tipos de erro
            console.error('Error:', error);
            form.resetFields(); // Limpa os campos do formulário
        }
    }

    return (
        <section className="relative h-screen">
            {/* Botão de voltar */}
            <Button
                type="text"
                className="absolute font-medium lg:text-sm sm:text-xs justify-start m-5 absolute"
                icon={<LeftOutlined />}>
                Voltar
            </Button>
            <Row // Ajustes para que a Row fique centralizada
                justify="center"
                align="middle"
                className="h-full">
                <Col xs={16} sm={16} md={16} lg={12} xl={6} // Ajuste na responsividade
                    justify="center"
                    className="text-center space-y-6" >
                    {/* Logo do ProMonitor */}
                    <img src={logoPreta}
                        alt="Logo ProMonitor"
                        className="mx-auto size-5/12" />
                    <h1 className="mt-0 md:text-3xl text-2xl font-bold">Recuperar senha</h1>
                    <p className="font-medium lg:text-sm sm:text-xs w-2/3 mx-auto">Para redefinir sua senha,
                        informe o e-mail cadastrado na sua conta e lhe enviaremos um link com as instruções.</p>
                    <Form
                        form={form}
                        className="justify-center space-y-5"
                        layout="vertical"
                        onFinish={handleSubmit}
                        requiredMark={false}>
                        {/* Campo para inserir e-mail com obrigatoriedade*/}
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor, insira seu email!',
                                },
                                {
                                    type: 'email',
                                    message: 'O input não é um email válido!',
                                }
                            ]}
                            layout="vertical"
                            label={<span className="font-medium">E-mail:</span>}
                            className="justify-center"
                        >
                            <Input
                                placeholder="Digite seu e-mail"
                                className="w-full bg-gray-100 p-2 border-none" />
                        </Form.Item>
                        {/*Botão para envio do formulário*/}
                        <Form.Item >
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="w-full bg-custom-dark-blue text-white p-5 font-semibold border-none">
                                Enviar</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </section>
    );
};

export default RecuperarSenha;
