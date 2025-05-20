# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de package.json primeiro para aproveitar o cache do Docker
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 5001

# Comando para iniciar o servidor
CMD ["npm", "start"]