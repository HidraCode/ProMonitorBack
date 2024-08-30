CREATE DATABASE IF NOT EXISTS promonitor;
USE promonitor;

DROP TABLE IF exists USUARIO;
CREATE TABLE USUARIO (
    codigo_usuario INT PRIMARY KEY AUTO_INCREMENT,
    tipo ENUM('aluno', 'professor', 'coordenador') NOT NULL,
    nome VARCHAR(100) NOT NULL,
    matricula VARCHAR(20) NOT NULL,
    cpf VARCHAR(11) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    data_nascimento DATE NOT NULL,
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(100) NOT NULL,
    UNIQUE(cpf),
    UNIQUE(matricula)
);

DROP TABLE IF EXISTS EDITAL;
CREATE TABLE EDITAL (
    codigo_edital INT PRIMARY KEY AUTO_INCREMENT,
    codigo_professor INT NOT NULL, -- Coordenador que postou o edital
    titulo VARCHAR(40) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    descricao TEXT,
    link VARCHAR(50) NOT NULL,
    publico BOOLEAN DEFAULT TRUE, -- Indica se o edital está disponível publicamente
    FOREIGN KEY (codigo_professor) REFERENCES USUARIO(codigo_usuario)
);

DROP TABLE IF EXISTS MONITOR;
CREATE TABLE MONITOR ( 
    codigo_monitor INT PRIMARY KEY AUTO_INCREMENT, 
    codigo_aluno INT, 
    ativo BOOLEAN, 
    codigo_edital INT, 
    tipo_monitoria ENUM('bolsista', 'voluntario'), -- 'bolsista' ou 'voluntário' 
    FOREIGN KEY (codigo_aluno) REFERENCES USUARIO(codigo_usuario),
    FOREIGN KEY (codigo_edital) REFERENCES EDITAL(codigo_edital)
);

-- Outras entidades
DROP TABLE IF EXISTS DISCIPLINA;
CREATE TABLE DISCIPLINA (
    codigo_disciplina INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100)
);

DROP TABLE IF EXISTS INSCRICAO;
CREATE TABLE INSCRICAO (
    codigo_inscricao INT PRIMARY KEY auto_increment,
    codigo_edital INT,
    codigo_aluno INT,
    data_inscricao DATE,
    estado ENUM('inscrito', 'analise', 'aceito', 'recusado'),
    FOREIGN KEY (codigo_edital) REFERENCES EDITAL(codigo_edital),
    FOREIGN KEY (codigo_aluno) REFERENCES USUARIO(codigo_usuario)
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
    FOREIGN KEY (codigo_professor) REFERENCES USUARIO(codigo_usuario)
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
    FOREIGN KEY (codigo_professor) REFERENCES USUARIO(codigo_usuario)
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