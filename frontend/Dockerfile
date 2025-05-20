# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

# Não copie tudo - em vez disso, monte como volume no docker-compose
# COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]