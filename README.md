# PharmaManager
Application de gestion de pharmacie — Développé dans le cadre du test technique SMARTHOLOL

## Stack Technique
- Backend : Django 6.x + Django REST Framework + SimpleJWT + PostgreSQL
- Frontend : React.js (Vite) + Context API + Axios
- DevOps : Docker Compose + Django TestCase (Unit Tests)
- Documentation API : Swagger (drf-spectacular)

## Installation Rapide (Docker)
```bash
docker compose up --build
# Dans un autre terminal :
docker compose exec backend python manage.py createsuperuser
```

## Installation Manuelle
### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata initial_data
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Authentification & Tests
1. Créez un compte via `createsuperuser`.
2. Connectez-vous sur `http://localhost:5173`.
3. **Tests recommandés :** 
   - Recherche/Filtrage dans le catalogue.
   - Ajout/Modification d'un médicament (via Modal).
   - Création d'une vente (vérification de la déduction automatique du stock).
   - Annulation d'une vente (réintégration du stock).

## Documentation API
Swagger UI disponible sur : http://localhost:8000/api/schema/swagger-ui/
