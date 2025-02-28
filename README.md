# ProduitPremium - Landing Page E-commerce

Une landing page e-commerce moderne, performante et complète avec une page de checkout sécurisée intégrant Stripe pour le paiement.

_A modern, high-performance, and comprehensive e-commerce landing page with a secure checkout page integrating Stripe for payment._

## Fonctionnalités | Features

**FR:**

- Design responsive et moderne avec Tailwind CSS
- Animations fluides avec Framer Motion
- Gestion d'état avec Zustand
- Validation de formulaire avec React Hook Form et Zod
- Intégration de paiement avec Stripe
- Backend Express pour gérer les paiements et les emails
- Mode sombre/clair
- Panier d'achat interactif
- Processus de paiement en plusieurs étapes

**EN:**

- Responsive and modern design with Tailwind CSS
- Smooth animations with Framer Motion
- State management with Zustand
- Form validation with React Hook Form and Zod
- Payment integration with Stripe
- Express backend for handling payments and emails
- Dark/light mode
- Interactive shopping cart
- Multi-step checkout process

## Installation

**FR:**

1. Clonez le dépôt
2. Installez les dépendances

```bash
npm install
```

3. Créez un fichier `.env` à partir du fichier `.env.example`

```bash
cp .env.example .env
```

4. Configurez vos clés Stripe et autres variables d'environnement dans le fichier `.env`

**EN:**

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Create a `.env` file from the `.env.example` file

```bash
cp .env.example .env
```

4. Configure your Stripe keys and other environment variables in the `.env` file

## Développement | Development

**FR:**
Pour lancer le serveur de développement frontend:

```bash
npm run dev
```

Pour lancer le serveur backend:

```bash
npm run server
```

Pour lancer les deux simultanément:

```bash
npm run dev:full
```

**EN:**
To start the frontend development server:

```bash
npm run dev
```

To start the backend server:

```bash
npm run server
```

To start both simultaneously:

```bash
npm run dev:full
```

## Production

**FR:**
Pour construire l'application pour la production:

```bash
npm run build
```

Pour prévisualiser la version de production:

```bash
npm run preview
```

**EN:**
To build the application for production:

```bash
npm run build
```

To preview the production version:

```bash
npm run preview
```

## Cartes de test Stripe | Stripe Test Cards

**FR:**
Pour tester les paiements sans utiliser de vraies cartes, utilisez les cartes de test Stripe suivantes:

| Numéro de carte     | Date d'expiration | CVC        | Code postal |
| ------------------- | ----------------- | ---------- | ----------- |
| 4242 4242 4242 4242 | Date future       | 3 chiffres | 5 chiffres  |
| 4000 0025 0000 3155 | Date future       | 3 chiffres | 5 chiffres  |

**Scénarios de test:**

- `4242 4242 4242 4242`: Paiement réussi
- `4000 0025 0000 3155`: Nécessite une authentification 3D Secure

**EN:**
To test payments without using real cards, use the following Stripe test cards:

| Card Number         | Expiration Date | CVC      | Postal Code |
| ------------------- | --------------- | -------- | ----------- |
| 4242 4242 4242 4242 | Future date     | 3 digits | 5 digits    |
| 4000 0025 0000 3155 | Future date     | 3 digits | 5 digits    |

**Test Scenarios:**

- `4242 4242 4242 4242`: Successful payment
- `4000 0025 0000 3155`: Requires 3D Secure authentication

## Mises à jour récentes | Recent Updates

**FR:**

- Correction du problème de code pays dans l'intégration Stripe
- Utilisation des codes ISO à 2 caractères pour les pays (FR, BE, CH, CA)
- Amélioration de la gestion des erreurs de paiement
- Optimisation du processus de checkout

**EN:**

- Fixed country code issue in Stripe integration
- Using 2-character ISO codes for countries (FR, BE, CH, CA)
- Improved payment error handling
- Optimized checkout process

## Structure du projet | Project Structure

**FR:**

- `src/` - Code source frontend (React)
  - `components/` - Composants React
  - `store/` - Gestion d'état avec Zustand
  - `api/` - Services d'API pour communiquer avec le backend
- `server/` - Code source backend (Express)
  - `config/` - Configuration du serveur
  - `controllers/` - Contrôleurs pour gérer les requêtes
  - `middleware/` - Middleware Express
  - `models/` - Modèles de données MongoDB
  - `routes/` - Routes API
  - `services/` - Services métier

**EN:**

- `src/` - Frontend source code (React)
  - `components/` - React components
  - `store/` - State management with Zustand
  - `api/` - API services to communicate with the backend
- `server/` - Backend source code (Express)
  - `config/` - Server configuration
  - `controllers/` - Controllers to handle requests
  - `middleware/` - Express middleware
  - `models/` - MongoDB data models
  - `routes/` - API routes
  - `services/` - Business services

## Technologies utilisées | Technologies Used

### Frontend

- React + Vite
- Tailwind CSS
- Framer Motion
- Zustand
- React Hook Form + Zod
- Stripe Elements

### Backend

- Express.js
- MongoDB + Mongoose
- Stripe API
- Nodemailer