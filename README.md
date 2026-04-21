# Royal Connect — Royal Beauty

**Royal Connect** est une plateforme web statique de démonstration pour un
institut de beauté et de bien-être fictif, **Royal Beauty**.

Le projet est **100 % front-end** (HTML, CSS, JavaScript vanilla) — aucune
dépendance, aucun backend. La persistance des données est simulée via le
`LocalStorage` du navigateur.

---

## 🎯 Fonctionnalités

- 🏠 **Page d’accueil** : présentation de l’institut, hero élégant, aperçu
  des services phares.
- 💅 **Page services** : catalogue complet des prestations avec images,
  descriptions et tarifs.
- 📅 **Page réservation** : formulaire de prise de rendez-vous (nom,
  téléphone, service, date, heure).
- 🔐 **Connexion admin** (démo front-end) : page dédiée avec identifiants.
- 💻 **Tableau de bord admin** : liste des réservations, validation,
  suppression, filtres (toutes / en attente / validées), statistiques.
- 🔔 Toasts de notification élégants à la place des `alert()`.
- 🪟 **Modales de confirmation stylées** à la place des `confirm()` natifs.
- 📱 Design responsive (mobile, tablette, desktop).

---

## 🔐 Identifiants admin (démo)

| Champ         | Valeur      |
|---------------|-------------|
| Identifiant   | `admin`     |
| Mot de passe  | `royal2025` |

> La session est stockée dans `sessionStorage` (clé `rb_admin_auth`) et
> expire à la fermeture de l'onglet. Toute tentative d'accès à
> `dashboard.html` sans être connecté redirige automatiquement vers
> `login.html`.

---

## 📁 Structure du projet

```
royal-connect/
├── index.html          # Page d'accueil
├── services.html       # Catalogue de services
├── booking.html        # Formulaire de réservation
├── login.html          # Connexion admin (démo front-end)
├── dashboard.html      # Tableau de bord admin (protégé)
├── css/
│   └── style.css       # Styles (palette or / bordeaux / rose)
├── js/
│   ├── app.js          # UI commune : navbar, toasts, auth, modal
│   ├── storage.js      # Couche LocalStorage
│   ├── booking.js      # Logique du formulaire
│   └── admin.js        # Logique du dashboard
├── images/             # Photos des prestations
└── README.md
```

---

## 🚀 Lancement

Aucune installation n’est requise.

1. Ouvrir `index.html` directement dans un navigateur moderne
   (Chrome, Firefox, Edge, Safari).
2. Naviguer via la barre de menu.

> Astuce : pour éviter certains comportements CORS, vous pouvez servir le
> dossier via un petit serveur statique, par exemple :
> `python3 -m http.server 8000` puis ouvrir `http://localhost:8000`.

---

## 🧪 Parcours de démonstration

1. Ouvrir **index.html** (page d’accueil).
2. Cliquer sur **Services** pour voir le catalogue.
3. Cliquer sur **Réserver** sur une carte service (ou aller directement
   sur **Réservation**).
4. Remplir le formulaire et valider → une notification confirme
   l’enregistrement.
5. Cliquer sur **Admin** → la page de connexion apparaît.
6. Saisir `admin` / `royal2025` → accès au tableau de bord.
7. La réservation est listée : **Valider** (✓) ou **Supprimer** (✕).
   Une modale stylée demande confirmation avant suppression.
8. Utiliser les filtres **En attente / Validées** pour trier.
9. Cliquer sur **Déconnexion** pour revenir à l'écran de login.

---

## 🎨 Charte graphique

| Couleur     | Code      |
|-------------|-----------|
| Or          | `#C9A227` |
| Bordeaux    | `#6B0F1A` |
| Rose clair  | `#F8E1E7` |
| Blanc       | `#FFFFFF` |

Polices : **Playfair Display** (titres) & **Poppins** (texte) via Google Fonts.

---

## 🧠 API JavaScript (storage.js)

| Fonction | Description |
|----------|-------------|
| `getBookings()` | Retourne le tableau des réservations. |
| `saveBooking(booking)` | Ajoute une réservation (ajoute `id` + `createdAt`). |
| `deleteBooking(index)` | Supprime la réservation à l’index donné. |
| `updateBooking(index, data)` | Met à jour partiellement une réservation. |
| `clearBookings()` | Vide toutes les réservations. |

Clé LocalStorage utilisée : **`bookings`**.

---

## ♻️ Réinitialiser les données

Dans la console du navigateur :
```js
localStorage.removeItem("bookings");
```
ou utiliser le bouton **« Tout supprimer »** du tableau de bord.

---

## 🐳 Déploiement Docker + Nginx (VPS)

Le projet est livré avec un `Dockerfile`, une configuration Nginx
optimisée (`nginx.conf`) et un `docker-compose.yml`.

### Fichiers

| Fichier              | Rôle                                                      |
|----------------------|-----------------------------------------------------------|
| `Dockerfile`         | Image basée sur `nginx:1.27-alpine`, copie du site.       |
| `nginx.conf`         | Gzip, cache long sur assets, en-têtes de sécurité.        |
| `docker-compose.yml` | Orchestration (port, restart, healthcheck).               |
| `.dockerignore`      | Exclut `.git`, docs, fichiers éditeur du build.           |

### Build & run local

```bash
# Depuis la racine du projet
docker compose up -d --build
```

Le site est ensuite accessible sur : **http://localhost:8080**

Pour arrêter :
```bash
docker compose down
```

### Déploiement sur le VPS

```bash
# 1. Copier le projet sur le VPS (exemple via scp)
scp -r royal-connect/ user@mon-vps:/srv/

# 2. Se connecter au VPS
ssh user@mon-vps

# 3. Construire et lancer
cd /srv/royal-connect
docker compose up -d --build

# 4. Vérifier
docker compose ps
docker compose logs -f
```

Le site tourne sur le port **8080** du VPS. Ajuster dans
`docker-compose.yml` si besoin :
```yaml
ports:
  - "80:80"     # exposer directement sur le port 80
```

### Derrière un reverse-proxy (Traefik, Caddy, Nginx hôte)

Si vous utilisez déjà un reverse-proxy sur le VPS (recommandé pour le
HTTPS Let's Encrypt), supprimez la section `ports:` de
`docker-compose.yml` et ajoutez votre proxy sur le réseau `web`. Le
conteneur expose le port `80` en interne.

Exemple minimal Nginx hôte :
```nginx
server {
    listen 443 ssl http2;
    server_name royalbeauty.example.com;
    # ... ssl_certificate, ssl_certificate_key ...

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Mise à jour

```bash
cd /srv/royal-connect
git pull                          # ou re-upload des fichiers
docker compose up -d --build
```

---

## 📜 Licence

Projet pédagogique à but de démonstration — libre d’utilisation.
