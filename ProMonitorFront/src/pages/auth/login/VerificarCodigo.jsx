import React from "react";
import { Col, Row, Form, Button, Input } from 'antd';
import logoPreta from '../../../assets/logoPreta.svg';
import { LeftOutlined } from '@ant-design/icons';

const VerificarCodigo = () => {
    const [form] = Form.useForm();

    // Função chamada quando o formulário é enviado com sucesso
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
                // Se a resposta for bem-sucedida, lida com o sucesso (ex: redireciona, mostra mensagem)
                console.log('Code verification successful:', data);
                form.resetFields(); // Limpa os campos do formulário
            } else {
                // Se houver um erro, lida com ele (ex: mostra mensagem de erro)
                console.error('Code verification failed:', data);
                form.resetFields(); // Limpa os campos do formulário
            }
        } catch (error) {
            // Lida com erros de rede ou outros tipos de erro
            console.error('Error:', error);
            form.resetFields(); // Limpa os campos do formulário
        }
    };

    return (
        <section className="relative h-screen">
            {/* Botão de voltar */}
            <Button
                type="text"
                className="font-medium absolute top-5 left-5"
                icon={<LeftOutlined />}>
                Voltar
            </Button>
            <Row // Ajustes para que a Row fique centralizada
                justify="center"
                align="middle"
                className="h-full">
                <Col xs={16} sm={16} md={16} lg={12} xl={6} // Ajuste na responsividade
                    className="text-center space-y-6"
                >    {/* Logo do ProMonitor */}
                    <img src={logoPreta} alt="Logo ProMonitor" className="mx-auto size-5/12" />
                    <h1 className="md:text-3xl text-2xl font-bold">Verificar código</h1>
                    <p className="font-medium sm:text-xs lg:text-sm w-2/3 mx-auto">
                        Digite o código enviado para o seu e-mail: teste123@gmail.com, se não houver nada, solicite o reenvio do código.
                    </p>
                    <Form
                        form={form}
                        className="space-y-5"
                        layout="vertical"
                        onFinish={handleSubmit}>
                        {/* Campo para inserir o código. Inicialmente suporta letras e números*/}
                        <Form.Item name="verification_code"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor, digite o código.',
                                },
                            ]}
                        >
                            <Input placeholder="Insira o código" className="appearance-none w-full bg-gray-100 p-2 border-none"
                            />
                        </Form.Item>
                        {/* Botão de enviar o código recebido*/}
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="w-full mb-2 bg-custom-dark-blue text-white p-5 font-semibold border-none hover:bg-custom-dark-blue">
                                Enviar
                            </Button>
                            <Button type="text">Reenviar código</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </section>
    );
};

export default VerificarCodigo;
