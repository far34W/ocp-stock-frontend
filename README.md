# 🏭 OCP Stock Management — Frontend React

Application complète de gestion de stock pour OCP Benguérir.

## 🛠 Tech Stack
- **React.js** 18 avec hooks
- **Tailwind CSS** pour le design
- **Chart.js** pour les graphiques
- **QRCode.js + JsBarcode** pour les étiquettes
- **React Router v6** pour la navigation
- **Axios** pour les requêtes API
- **React Hot Toast** pour les notifications

## 📁 Structure du projet

```
src/
├── components/
│   └── layout/
│       ├── Layout.jsx      — Layout principal (sidebar + topbar)
│       └── Sidebar.jsx     — Menu latéral vert OCP
├── context/
│   └── AuthContext.jsx     — Gestion de l'authentification
├── pages/
│   ├── LoginPage.jsx           — Page de connexion
│   ├── DashboardPage.jsx       — Tableau de bord complet
│   ├── ArticlesPage.jsx        — Liste articles + filtres + cartes
│   ├── AddArticlePage.jsx      — Formulaire ajout article
│   ├── EditArticlePage.jsx     — Formulaire modification
│   ├── ArticleDetailPage.jsx   — Détail article + QR + barcode
│   ├── TransferPage.jsx        — Formulaire transfert
│   ├── ScanPage.jsx            — Scanner code-barres
│   ├── PrintArticlesPage.jsx   — Impression tableau articles
│   ├── PrintQRPage.jsx         — Impression QR + codes-barres
│   ├── TrashedArticlesPage.jsx — Corbeille + restauration
│   ├── CategoriesPage.jsx      — CRUD catégories
│   ├── TransfersHistoryPage.jsx— Historique + bon de décharge
│   ├── UsersPage.jsx           — Gestion utilisateurs
│   └── ProfilePage.jsx         — Profil + mot de passe
└── services/
    └── api.js              — Tous les appels API (axios)
```

## 🚀 Installation et lancement

### Prérequis
- Node.js >= 16
- npm ou yarn
- Backend Laravel en cours d'exécution sur `http://localhost:8000`

### Étapes

```bash
# 1. Se placer dans le dossier
cd ocp-stock-frontend

# 2. Installer les dépendances
npm install

# 3. Lancer en développement
npm start
```

L'application sera disponible sur **http://localhost:3000**

## 🔗 Configuration API

Par défaut, l'API est configurée sur `http://localhost:8000/api`.

Pour changer, modifier `src/services/api.js` :
```js
const API = axios.create({
  baseURL: 'http://VOTRE_URL/api',
  ...
});
```

## 📋 Routes API attendues (Laravel)

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /api/login | Connexion |
| POST | /api/logout | Déconnexion |
| GET | /api/dashboard/stats | Statistiques dashboard |
| GET | /api/dashboard/transfers-chart | Graphique 7 jours |
| GET | /api/dashboard/categories | Répartition catégories |
| GET | /api/dashboard/recent-articles | Articles récents |
| GET | /api/dashboard/recent-movements | Mouvements récents |
| GET | /api/dashboard/top-transferred | Produits les plus transférés |
| GET | /api/dashboard/alerts | Alertes stock |
| GET | /api/articles | Liste articles (avec filtres: ?search=&status=&category_id=) |
| POST | /api/articles | Créer article |
| GET | /api/articles/{id} | Détail article |
| PUT | /api/articles/{id} | Modifier article |
| DELETE | /api/articles/{id} | Soft delete |
| GET | /api/articles/trashed | Corbeille |
| PUT | /api/articles/{id}/restore | Restaurer |
| DELETE | /api/articles/{id}/force | Supprimer définitivement |
| GET | /api/articles/scan/{code} | Scan par code |
| POST | /api/articles/{id}/transfer | Transférer |
| GET | /api/transfers | Historique transferts |
| GET | /api/transfers/{id} | Détail transfert |
| GET | /api/categories | Liste catégories |
| POST | /api/categories | Créer catégorie |
| PUT | /api/categories/{id} | Modifier catégorie |
| DELETE | /api/categories/{id} | Supprimer catégorie |
| GET | /api/users | Liste utilisateurs |
| POST | /api/users | Créer utilisateur |
| PUT | /api/users/{id} | Modifier utilisateur |
| DELETE | /api/users/{id} | Supprimer utilisateur |
| GET | /api/profile | Mon profil |
| PUT | /api/profile | Mettre à jour profil |
| PUT | /api/profile/password | Changer mot de passe |

## 🎨 Design

- **Couleurs** : Vert OCP (#16a34a / #166534) + fond gris clair
- **Fonts** : Sora (titres) + DM Sans (texte)
- **Composants** : Cards arrondies, badges colorés, sidebar verte
- **Alertes** : Rouge automatique quand quantité ≤ seuil minimum
- **Responsive** : Mobile et desktop

## 🖨 Fonctionnalités d'impression

- **Imprimer articles** : Tableau complet imprimable
- **QR Codes + Code-barres** : Étiquettes par article (utilise `window.print()`)
- **Bon de décharge** : Pour chaque transfert depuis l'historique
