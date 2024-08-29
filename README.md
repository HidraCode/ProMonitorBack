# ProMonitorAPI

## Pré-requisitos

Antes de começar, verifique se você tem as seguintes ferramentas instaladas:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Instalação

1. **Clone o Repositório**

   ```bash
   git clone -b back-end https://github.com/HidraCode/GestaoMonitoria
   cd GestaoMonitoria

2. **Construir e iniciar o container**

   ```
   docker-compose up --build
   ```
3. **Uso e interrupção**

  - A API estará acessível em `http://localhost:3000`
  - Para interromper, use o comando:

   ```
   docker-compose down
   ```
