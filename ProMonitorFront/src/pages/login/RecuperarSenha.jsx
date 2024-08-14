import React from "react";
import { Col, Row, Form, Button, Input } from 'antd';
import logoPreta from '../../assets/logoPreta.svg'

const RecuperarSenha = () => {
    return (
    <Row justify="center" className="items-center h-screen">
            <Col span={6} justify="center" className="text-center space-y-6" >
                    <img src={logoPreta} alt="Logo ProMonitor" className="mx-auto"/>
                    <h1  className="mt-0 text-4xl font-bold">Recuperar senha</h1>
                    <p className="font-medium w-2/3 mx-auto">Para redefinir sua senha, informe o e-mail cadastrado na sua conta e lhe enviaremos um link com as instruções.</p>
                <Form className="justify-center space-y-5" layout="vertical" >
                    <Form.Item layout="vertical" label={<span>E-mail:</span>} className="justify-center">
                        <Input placeholder="Digite seu e-mail" className="w-full bg-gray-100 p-2 border-none" required/>
                    </Form.Item>
                    <Form.Item>
                        <Button className="w-full bg-custom-dark-blue text-white p-5 font-semibold border-none hover:bg-custom-dark-blue">Enviar</Button>
                    </Form.Item>
                </Form>
            </Col>
       </Row>
);
};

export default RecuperarSenha;
