#!/bin/bash

# Script d'installation automatique pour PharmaManager

echo "🚀 Initialisation de PharmaManager..."

# 1. Configuration Backend

echo "📦 Configuration du Backend..."

cd backend

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt

# Création du .env si absent

if [ ! -f .env ]; then

echo "📝 Création du fichier .env..."

grep -v '^#' .env.example | grep -v '^ *#' | sed '/^$/d' > .env

SECRET_KEY="django-insecure-$(date +%s)-$(openssl rand -hex 12)"

sed -i "s|SECRET_KEY=.*|SECRET_KEY=$SECRET_KEY|" .env

CURRENT_USER=$(whoami)

sed -i "s|DB_USER=.*|DB_USER=$CURRENT_USER|" .env

sed -i "s|DB_HOST=.*|DB_HOST=|" .env

fi

echo "🗄️ Migration de la base de données..."

python manage.py migrate

python manage.py loaddata initial_data

echo "👤 Création de votre compte administrateur..."
python manage.py createsuperuser

# 2. Configuration Frontend

echo "🎨 Configuration du Frontend..."

cd ../frontend

if [ ! -f .env ]; then
    echo "📝 Création du fichier .env pour le Frontend..."
    cp .env.example .env
fi

npm install

echo "✅ Installation terminée !"
echo "👉 Pour lancer le projet :"
echo "   Terminal 1 : cd backend && source venv/bin/activate && python manage.py runserver"
echo "   Terminal 2 : cd frontend && npm run dev"