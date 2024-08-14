import React from "react";
import { Col, Row, Form, Button, Input } from 'antd';
import logoPreta from '../../assets/logoPreta.svg'

const VerificarCodigo = () => {
    return (
        <Row justify="center" className="items-center h-screen">
            <Col span={6} justify="center" className="text-center space-y-6" >
                    <img src={logoPreta} alt="Logo ProMonitor" className="mx-auto"/>
                    <h1  className="mt-0 text-4xl font-bold">Verificar código</h1>
                    <p className="font-medium w-2/3 mx-auto">Digite o código enviado para o seu e-mail: teste123@gmail.com, se não houver nada, solicite o reenvio do código.</p>
                <Form className="justify-center space-y-5" layout="vertical" >
                    <Form.Item layout="vertical" className="justify-center">
                        <Input placeholder="Insira o código" className="w-full bg-gray-100 p-2 border-none" required/>
                    </Form.Item>
                    <Form.Item>
                        <Button className="w-full bg-custom-dark-blue text-white p-5 font-semibold border-none hover:bg-custom-dark-blue">Enviar</Button>
                    </Form.Item>
                </Form>
            </Col>
       </Row>
    );
};

export default VerificarCodigo;
