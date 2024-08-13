import { React } from "react";
import { Row, Col, Typography, Image, Input, Button, Form } from "antd"
import { useForm } from "antd/es/form/Form";
import isValidCPF from "../../utils/validateCpf";
import InputMask from 'react-input-mask';
import isValidBirthDate from "../../utils/validateBirthDate";

const { Title } = Typography

const Signup = () => {

  const [form] = useForm()

  const handleSubmit = (values) => {
      console.log('form data:', values)
  }

  return (
    <Row>
      <Col span={12} >
        <Image />
      </Col>
      <Col>
        <Form 
          form={form}
          name="basic"  
          onFinish={handleSubmit}
          layout="vertical"
        > 
          <Row>
            <Col span={24}>
              <Form.Item 
                label="Nome completo" 
                name="nome" 
                rules={[{ required: true, message: "Por favor, insira seu nome" }]} 
              >
                <Input />
              </Form.Item>  
            </Col>
          </Row>
          <Row gutter={5} >
            <Col span={12}>
              <Form.Item 
                label="Matrícula" 
                name="matricula" 
                rules={[
                  { required: true, message: "Por favor, insira sua matrícula" },
                  { min: 11, message: "Por favor, digite uma matrícula válida" }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label="CPF" 
                name="cpf" 
                rules={[
                  { required: true, message: "Por favor, insira seu cpf" },
                  {validator: (_,value) =>
                    isValidCPF(value)
                      ? Promise.resolve()
                      : Promise.reject("CPF inválido")
                  }
                ]}
              >
                <InputMask mask="999.999.999-99">
                  {(inputProps) => <Input {...inputProps} />}
                </InputMask>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={5} >
            <Col span={12}>
              <Form.Item 
                label="Telefone" 
                name="phone" 
                rules={[{ required: true, message: "Por favor, insira seu número de telefone" }]} 
              >
                <InputMask mask="(99) 99999-9999">
                  {(inputProps) => <Input {...inputProps} />}
                </InputMask>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label="Data de nascimento" 
                name="birthDate" 
                rules={[
                  { required: true, message: "Por favor, insira sua data de nascimento" },
                  {
                    validator: (_, value) =>
                      isValidBirthDate(value)
                        ? Promise.resolve()
                        : Promise.reject("Data de nascimento inválida")
                  }
                ]}
              >
                <InputMask mask="99/99/9999">
                  {(inputProps) => <Input {...inputProps} />}
                </InputMask>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}
export default Signup