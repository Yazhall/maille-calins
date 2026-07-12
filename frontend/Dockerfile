FROM node:20-alpine

WORKDIR /app

# Copie uniquement les manifests d'abord pour profiter du cache docker
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
