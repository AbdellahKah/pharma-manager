# PharmaManager
Application de gestion de pharmacie — Développé dans le cadre du test technique SMARTHOLOL

## Stack Technique
- Backend : Django 6.x + Django REST Framework + PostgreSQL
- Frontend : React.js (Vite)
- Documentation API : Swagger (drf-spectacular)

## Installation Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Configurer les variables
python manage.py migrate
python manage.py loaddata fixtures/initial_data.json  # Données de test
python manage.py createsuperuser
python manage.py runserver
...
```

## Variables d'Environnement (.env)
```
...
DEBUG=True
SECRET_KEY=votre-secret-key
DB_NAME=pharma_db
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
...
```

## Installation Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
...
```

## Lancement avec Docker / Podman
Si vous préférez lancer l'application instantanément avec Docker ou Podman :

1. **Libérer le port 5432 (si PostgreSQL local est actif) :**
   ```bash
   sudo systemctl stop postgresql # Libérer le port PostgreSQL sous Linux
   ```
2. **Lancer les conteneurs :**
   ```bash
   docker compose up --build       # Avec Docker
   # ou
   podman-compose up --build      # Avec Podman (Fedora)
   ```
3. **Créer votre compte Administrateur :**
   ```bash
   docker compose exec backend python manage.py createsuperuser
   # ou
   podman compose exec backend python manage.py createsuperuser
   ```

## Documentation API
Swagger UI disponible sur : http://localhost:8000/api/schema/swagger-ui/
