CREATE DATABASE IF NOT EXISTS promonitor;
USE promonitor;

DROP TABLE IF exists USUARIO;
CREATE TABLE USUARIO (
    codigo_usuario INT PRIMARY KEY auto_increment,
    nome VARCHAR(100),
    email VARCHAR(100),
    telefone VARCHAR(20),
    endereco VARCHAR(255),
    data_nascimento DATE,
    departamento VARCHAR(100), -- departamento associado ao usuário
    ativo BOOLEAN DEFAULT TRUE,
    senha VARCHAR(100) NOT NULL
);

DROP TABLE IF EXISTS ALUNO;
CREATE TABLE ALUNO (
    codigo_aluno INT PRIMARY KEY auto_increment,
    codigo_usuario INT,
    comprovante_vinculo TEXT,
    historico_escolar TEXT,
    FOREIGN KEY (codigo_usuario) REFERENCES USUARIO(codigo_usuario)
);

DROP TABLE IF EXISTS PROFESSOR;
CREATE TABLE PROFESSOR (
    codigo_professor INT PRIMARY KEY auto_increment,
    codigo_usuario INT,
    is_coordenador BOOLEAN DEFAULT FALSE, -- indica se o professor é também coordenador
    FOREIGN KEY (codigo_usuario) REFERENCES USUARIO(codigo_usuario)
);