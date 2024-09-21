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
    disciplina VARCHAR(40) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    descricao TEXT,
    link VARCHAR(50) NOT NULL,
    publico BOOLEAN DEFAULT TRUE, -- Indica se o edital está disponível publicamente
    FOREIGN KEY (codigo_professor) REFERENCES USUARIO(codigo_usuario)
);

DROP TABLE IF EXISTS CODIGO_RECUPERACAO;
CREATE TABLE CODIGO_RECUPERACAO (
    id INT NOT NULL auto_increment,
    codigo_usuario INT NOT NULL UNIQUE,
    codigo_esperado CHAR(6) NOT NULL,
    expira_em TIMESTAMP NOT NULL,
    PRIMARY KEY (id), -- Define a chave primária
    FOREIGN KEY (codigo_usuario) REFERENCES USUARIO(codigo_usuario) -- Relaciona com a tabela USUARIO
);
DROP TABLE IF EXISTS MONITOR;
CREATE TABLE MONITOR ( 
    codigo_monitor INT PRIMARY KEY AUTO_INCREMENT, 
    codigo_aluno INT, 
    ativo BOOLEAN, 
    codigo_edital INT, 
    disciplina VARCHAR(40),
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
    codigo_monitoria INT PRIMARY KEY AUTO_INCREMENT,
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
    codigo_tarefa INT PRIMARY KEY AUTO_INCREMENT,
    codigo_monitoria INT NOT NULL,
    codigo_professor INT NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    data_prazo DATE,
    data_atribuicao DATE NOT NULL,
    data_conclusao DATE,
    anexos_professor LONGBLOB DEFAULT NULL,
    status ENUM('concluida', 'pendente', 'atrasada') NOT NULL,  
    FOREIGN KEY (codigo_monitoria) REFERENCES MONITORIA(codigo_monitoria),
    FOREIGN KEY (codigo_professor) REFERENCES USUARIO(codigo_usuario)
);

DROP TABLE IF EXISTS ANEXOS_RESPOSTAS;
CREATE TABLE ANEXOS_RESPOSTAS (
    codigo_tarefa INT,
    codigo_monitoria INT,
    anexos_monitor LONGBLOB NOT NULL,
    PRIMARY KEY (codigo_tarefa, codigo_monitoria),
    FOREIGN KEY (codigo_tarefa) REFERENCES TAREFA(codigo_tarefa),
    FOREIGN KEY (codigo_monitoria) REFERENCES MONITORIA(codigo_monitoria)
);

DROP TABLE IF EXISTS DESEMPENHO;
CREATE TABLE DESEMPENHO (
    codigo_desempenho INT AUTO_INCREMENT,
    codigo_monitor INT,
    codigo_professor INT,
    comentario TEXT,
    data_avaliacao DATE,
    PRIMARY KEY (codigo_desempenho),
    FOREIGN KEY (codigo_monitor) REFERENCES MONITOR(codigo_monitor),
    FOREIGN KEY (codigo_professor) REFERENCES USUARIO(codigo_usuario)
);

-- tabela para armazenar os documentos de frequência
CREATE TABLE FREQUENCIA (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_aluno INT,
    codigo_professor INT,
    dados_form TEXT NULL, -- armazena os dados da frequencia para persistir no envio do monitor ao professor
    pdf LONGBLOB,
    assinatura_professor TEXT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    data_assinatura TIMESTAMP NULL,
    FOREIGN KEY (codigo_aluno) REFERENCES USUARIO(codigo_usuario),
    FOREIGN KEY (codigo_professor) REFERENCES USUARIO(codigo_usuario)
);

-- tabela para armazenar os documentos de relatório final
CREATE TABLE RELATORIO (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_aluno INT,
    codigo_professor INT,
    dados_form TEXT NULL, -- armazena os dados da frequencia para persistir no envio do monitor ao professor
    pdf LONGBLOB,
    assinatura_professor TEXT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    data_assinatura TIMESTAMP NULL,
    FOREIGN KEY (codigo_aluno) REFERENCES USUARIO(codigo_usuario),
    FOREIGN KEY (codigo_professor) REFERENCES USUARIO(codigo_usuario)
);

-- tabela para armazenar as chaves dos professores
CREATE TABLE CHAVES_PROFESSOR (
    codigo_professor INT PRIMARY KEY,
    chave_publica TEXT NOT NULL,
    chave_privada TEXT NOT NULL
);