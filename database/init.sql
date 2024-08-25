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

DROP TABLE IF EXISTS MONITOR;
CREATE TABLE MONITOR ( 
    codigo_monitor INT PRIMARY KEY auto_increment, 
    codigo_aluno INT, 
    ativo BOOLEAN, 
    curso VARCHAR(100), 
    tipo_monitoria VARCHAR(50), -- 'Bolsista' ou 'Voluntário' 
    FOREIGN KEY (codigo_aluno) REFERENCES ALUNO(codigo_aluno)
);

-- Outras entidades
DROP TABLE IF EXISTS DISCIPLINA;
CREATE TABLE DISCIPLINA (
    codigo_disciplina INT PRIMARY KEY,
    nome VARCHAR(100)
);

DROP TABLE IF EXISTS EDITAL;
CREATE TABLE EDITAL (
    codigo_edital INT PRIMARY KEY auto_increment,
    codigo_professor INT, -- Coordenador que postou o edital
    data_postagem DATE,
    descricao TEXT,
    publico BOOLEAN DEFAULT TRUE, -- Indica se o edital está disponível publicamente
    FOREIGN KEY (codigo_professor) REFERENCES PROFESSOR(codigo_professor)
);

DROP TABLE IF EXISTS INSCRICAO;
CREATE TABLE INSCRICAO (
    codigo_inscricao INT PRIMARY KEY,
    codigo_edital INT,
    codigo_aluno INT,
    data_inscricao DATE,
    FOREIGN KEY (codigo_edital) REFERENCES EDITAL(codigo_edital),
    FOREIGN KEY (codigo_aluno) REFERENCES ALUNO(codigo_aluno)
);

DROP TABLE IF EXISTS MONITORIA;
CREATE TABLE MONITORIA (
    codigo_monitoria INT PRIMARY KEY,
    codigo_monitor INT,
    codigo_disciplina INT,
    data_inicio DATE,
    data_fim DATE,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (codigo_monitor) REFERENCES MONITOR(codigo_monitor),
    FOREIGN KEY (codigo_disciplina) REFERENCES DISCIPLINA(codigo_disciplina)
);

DROP TABLE IF EXISTS TAREFA;
CREATE TABLE TAREFA (
    codigo_tarefa INT PRIMARY KEY,
    codigo_monitoria INT,
    codigo_professor INT, -- Professor que postou a tarefa
    descricao TEXT,
    data_atribuicao DATE,
    data_conclusao DATE,
    status VARCHAR(50),
    FOREIGN KEY (codigo_monitoria) REFERENCES MONITORIA(codigo_monitoria),
    FOREIGN KEY (codigo_professor) REFERENCES PROFESSOR(codigo_professor)
);

DROP TABLE IF EXISTS DESEMPENHO;
CREATE TABLE DESEMPENHO (
    codigo_desempenho INT,
    codigo_monitoria INT,
    codigo_professor INT,
    nota INT,
    comentario TEXT,
    data_avaliacao DATE,
    PRIMARY KEY (codigo_desempenho, codigo_monitoria),
    FOREIGN KEY (codigo_monitoria) REFERENCES MONITORIA(codigo_monitoria),
    FOREIGN KEY (codigo_professor) REFERENCES PROFESSOR(codigo_professor)
);

DROP TABLE IF EXISTS RELATORIO;
CREATE TABLE RELATORIO (
    codigo_relatorio INT,
    codigo_monitoria INT,
    codigo_monitor INT,
    descricao TEXT,
    data_postagem DATE,
    PRIMARY KEY (codigo_relatorio, codigo_monitoria),
    FOREIGN KEY (codigo_monitoria) REFERENCES MONITORIA(codigo_monitoria),
    FOREIGN KEY (codigo_monitor) REFERENCES MONITOR(codigo_monitor)
);