# Use a imagem oficial do Node.js como base
FROM node:22

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o arquivo package.json e yarn.lock para o diretório de trabalho
COPY package.json yarn.lock ./

# Instale as dependências usando Yarn
RUN npm rebuild bcrypt --build-from-source
RUN yarn install

# Copie todo o código da aplicação para o diretório de trabalho
COPY . .

# Exponha a porta que a aplicação utiliza
EXPOSE 3000

# Comando para iniciar a aplicação no modo de desenvolvimento
CMD ["yarn", "dev"]
