FROM python:3.14-slim

# Empêche Python d'écrire des fichiers .pyc
ENV PYTHONDONTWRITEBYTECODE=1
# Empêche Python de mettre en mémoire tampon stdout et stderr
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Dépendances système pour psycopg2
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Installation des dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie du projet
COPY . .

EXPOSE 8000
