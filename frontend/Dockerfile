FROM node:20-slim

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du projet
COPY . .

EXPOSE 5173

# Commande par défaut pour le développement
CMD ["npm", "run", "dev", "--", "--host"]
