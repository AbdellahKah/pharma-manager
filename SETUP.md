# 🚀 Guide d'installation Avancé — PharmaManager

Ce fichier contient les instructions pour utiliser l'installation automatique et la containerisation (Docker / Podman).

---

## ⚡ Option 1 : Lancement Automatique (setup.sh)
Le script automatique configure les variables d'environnement backend et frontend, initialise les bases de données, installe les dépendances et charge les fixtures.

```bash
chmod +x setup.sh && ./setup.sh
```

### 🏃 Lancement de l'application après installation :
*   **Backend Django :**
    ```bash
    cd backend
    source venv/bin/activate
    python manage.py runserver
    ```
*   **Frontend React :**
    ```bash
    cd frontend
    npm run dev
    ```

---

## 🐳 Option 2 : Lancement avec Docker / Podman (Linux / macOS)
Si vous préférez exécuter l'application sous forme de conteneurs :

1. **Libérer le port 5432 :**
   ```bash
   sudo systemctl stop postgresql # Libérer le port PostgreSQL local sous Linux
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

---

## 🪟 🐳 Option 3 : Guide Spécifique pour Windows + Git Bash + Docker
Si vous êtes sur **Windows** et que vous utilisez **Git Bash** pour lancer le projet avec **Docker Desktop**, suivez attentivement cette procédure :

### 1. Cloner le projet et lancer les conteneurs
Dans votre terminal Git Bash :
```bash
# 1. Cloner le projet
git clone https://github.com/AbdellahKah/pharma-manager.git
cd pharma-manager

# 2. Lancer les conteneurs avec Docker Compose
docker compose up --build
```
*(Attendez que les serveurs finissent de démarrer. Le frontend sera accessible sur `http://localhost:5173`).*

### 2. Créer votre compte administrateur (Gotcha Git Bash ⚠️)
Dans Git Bash, l'envoi d'entrées interactives à Docker requiert un terminal de type TTY. Si vous lancez la commande classique, elle échouera avec l'erreur `the input device is not a TTY`.

**Solution :** Ouvrez un **nouveau** terminal Git Bash à la racine et utilisez obligatoirement le préfixe **`winpty`** :
```bash
winpty docker compose exec backend python manage.py createsuperuser
```
Entrez ensuite votre nom d'utilisateur, email et mot de passe directement dans Git Bash !

### 3. Résolution des problèmes courants sur Windows
* **Port déjà utilisé (5432) :** Si les conteneurs échouent à démarrer à cause du port `5432`, cela signifie qu'un PostgreSQL local tourne déjà sur votre machine Windows. 
  * Ouvrez le menu Démarrer, tapez **Services**, cherchez le service `postgresql` ou `pg_ctl`, faites un clic droit et cliquez sur **Arrêter**.
* **Problèmes de retour chariot (CRLF vs LF) :** Si des scripts shell se plaignent d'erreurs de syntaxe, lancez cette commande dans Git Bash avant de lancer Docker pour normaliser les fins de lignes :
  ```bash
  git config --global autocrlf input
  ```
