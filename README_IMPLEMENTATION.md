# 🛡️ CCarré - Plateforme de Partage Sécurisée

> **Version**: 1.0.0 - Modération Avancée & Détection d'Arnaques  
> **Status**: ✅ Production-Ready  
> **Dernière MAJ**: Avril 2026

---

## 🎯 Vue d'Ensemble

**CCarré** est une plateforme de partage d'articles universitaire avec :

✨ **Modération Intelligente**
- Dashboard admin complet
- Gestion centralisée des annonces/utilisateurs/signalements
- Système de scoring de risque automatique
- Bannissement et débannissement d'utilisateurs

🤖 **Détection Automatique d'Arnaques**
- Scan des mots suspects (WhatsApp, urgent, paiement)
- Détection numéros de téléphone
- Détection emails
- Détection liens externes
- Score de risque calculé en temps réel

🔒 **Messagerie Sécurisée**
- Avertissements sur liens/numéros/emails
- Blocage d'utilisateurs (empêche messages)
- Suppression de messages par admins
- Sanitisation anti-XSS

📊 **Analytics Détaillées**
- Dashboard graphiques
- Tendances sur 7/30/90 jours
- Activité: annonces, messages, bannissements

---

## 🚀 Démarrage Rapide

### Installation

```bash
# Backend
cd ccarre
npm install
npm run dev

# Frontend
cd ccarre-front
npm install
npm run dev
```

### Accéder au Dashboard Admin

1. Se connecter avec un compte admin
2. Aller à `http://localhost:3000/admin`
3. Voir statistiques, gérer contenu/utilisateurs

### Tester Détection d'Arnaque

Créer une annonce avec:
- Titre: "iPhone urgent WhatsApp"
- Description: "Paiement externe via Telegram +33612345678"

→ Automatiquement marquée comme **suspecte** avec score de risque élevé

---

## 📁 Structure du Projet

```
ccarre/                          (Backend Express/Node)
├── src/
│   ├── models/
│   │   ├── user.model.ts        ← +7 champs sécurité
│   │   ├── annonce.model.ts     ← +4 champs risque
│   │   ├── report.model.ts      ← NEW
│   │   └── block.model.ts       ← NEW
│   ├── controllers/
│   │   ├── admin.controller.ts  ← NEW (16 actions)
│   │   ├── report.controller.ts ← NEW
│   │   └── secure-message.controller.ts ← NEW
│   ├── middlewares/
│   │   ├── auth.middleware.ts   ← Amélioré
│   │   └── admin.middleware.ts  ← NEW
│   ├── utils/
│   │   └── security.ts          ← NEW (détection arnaques)
│   └── routes/
│       ├── admin.routes.ts      ← NEW
│       ├── report.routes.ts     ← NEW
│       └── secure-message.routes.ts ← NEW

ccarre-front/                    (Frontend Next.js)
├── app/admin/
│   ├── page.tsx                 ← Dashboard 📊
│   ├── annonces/page.tsx        ← Gestion annonces 📋
│   ├── users/page.tsx           ← Gestion users 👥
│   ├── reports/page.tsx         ← Gestion signalements 🚩
│   └── analytics/page.tsx       ← Statistiques 📈
└── lib/
    └── admin-api.ts             ← NEW (API client)
```

---

## 🔑 Fonctionnalités Principales

### 1️⃣ Dashboard Admin (`/admin`)
```
📊 Statistiques en temps réel
├─ Total annonces
├─ Annonces suspectes / haut risque
├─ Utilisateurs bannis
├─ Signalements ouverts/urgents
└─ Graphiques pie chart
```

### 2️⃣ Gestion Annonces (`/admin/annonces`)
```
Filtres: Toutes | Signalées | Suspectes | Haut risque
Actions: Voir détail | Supprimer
Affiche: Titre, Propriétaire, Signalements, Score risque
```

### 3️⃣ Gestion Utilisateurs (`/admin/users`)
```
Filtres: Tous | Bannis | Haut risque | Suspects
Actions: Bannir | Débannir (avec raison)
Affiche: Nom, Email, Score risque, Statut
```

### 4️⃣ Gestion Signalements (`/admin/reports`)
```
Filtres: Statut (ouvert/en_cours/résolu/rejeté)
         Priorité (urgent/high/normal/low)
Actions: Modifier statut/priorité | Ajouter notes | Supprimer
```

### 5️⃣ Analytics (`/admin/analytics`)
```
Périodes: 7 jours | 30 jours | 90 jours
Métriques:
├─ Annonces supprimées
├─ Utilisateurs bannis
├─ Messages envoyés
├─ Annonces créées
├─ Signalements
└─ Nouveaux utilisateurs
Graphique bar chart activité
```

---

## 🔐 Sécurité Implémentée

| Feature | Level | Details |
|---------|-------|---------|
| **Auth** | ✅ | JWT requis pour tous endpoints admin |
| **Role Admin** | ✅ | Vérification rôle `admin` |
| **Rate Limiting** | ✅ | 100 req/15min par IP |
| **XSS Protection** | ✅ | Sanitisation balises HTML |
| **Input Validation** | ✅ | Côté serveur uniquement |
| **Ban Checking** | ✅ | Utilisateurs bannis bloqués |
| **XSS在Messages** | ✅ | Warnings sur liens/numéros |
| **Scam Detection** | ✅ | Détection auto + score risque |

---

## 📊 Système de Scoring

### Risk Score (0-100)
```
Base = 0
+ Mots suspects détectés (15-100)
+ Nombre signalements × 10 (capped à 40)
+ Score risque propriétaire × 0.5
+ Nouveau compte (15 points)
─────────────────────────────────
= Fina Score (max 100)

Seuils:
├─ 0-20:   🟢 Faible risque
├─ 20-40:  🟡 Risque moyen
├─ 40-60:  🟠 Risque élevé
└─ 60-100: 🔴 Haut risque (SUSPE)
```

### Mots Suspects Détectés
```
📞 Communication: WhatsApp, Telegram, +33, 06
⏰ Urgence: urgent, immédiat, dépêchez-vous
💰 Paiement: virement, PayPal, crypto, Bitcoin
🔖 Prix: gratuit, trop bon, promo, solde
```

---

## 🛠️ API Endpoints

### Admin Routes (`/api/admin/`)

```
Dashboard
  GET  /dashboard/stats

Annonces
  GET           /annonces?filter=all&page=1
  GET           /annonces/:id
  DELETE        /annonces/:id
  PATCH         /annonces/:id/risk-score

Utilisateurs
  GET           /users?filter=all
  POST          /users/:userId/ban
  POST          /users/:userId/unban

Signalements
  GET           /reports?status=all&priority=all
  PATCH         /reports/:reportId
  DELETE        /reports/:reportId

Messages
  GET           /messages
  DELETE        /messages/:messageId

Blocages
  GET           /blocked-users
  DELETE        /blocked-users/:blockId

Analytics
  GET           /analytics?period=7d
```

### User Routes (`/api/reports/`, `/api/secure-messages/`)

```
Signaler
  POST  /reports              ← Créer signalement
  GET   /reports              ← Mes signalements
  GET   /reports/:id          ← Détail

Messagerie Sécurisée
  POST  /secure-messages           ← Créer message (+ analysis)
  GET   /secure-messages/:exchange
  DELETE /secure-messages/:id

Blocages
  POST   /secure-messages/block/:userId
  DELETE /secure-messages/block/:blockId
  GET    /secure-messages/blocks/list
```

---

## 📋 Modèles Données

### User (Amélioré)
```typescript
{
  firstName: string
  lastName: string
  email: string
  password: string (hashed)
  isVerified: boolean
  
  // NEW - Sécurité
  role: 'user' | 'admin'
  isBanned: boolean
  bannedReason?: string
  riskScore: 0-100
  reportCount: number
  blockedUsers: ObjectId[]
  
  // Analytics
  messageCount: number
  announcementCount: number
}
```

### Annonce (Amélioré)
```typescript
{
  title: string
  description: string
  type: 'vente' | 'echange' | 'pret'
  owner: ObjectId
  images: string[]
  price?: number
  status: 'disponible' | 'reserve' | 'supprimee'
  
  // NEW - Sécurité
  reportCount: number
  riskScore: 0-100
  isSuspicious: boolean
  suspiciousReasons: string[]
}
```

### Report (NEW)
```typescript
{
  type: 'annonce' | 'user' | 'message'
  targetId: ObjectId
  reportedBy: ObjectId
  reason: 'arnaque' | 'contenu_offensant' | 'spam' | ...
  description: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  status: 'ouvert' | 'en_cours' | 'resolu' | 'rejete'
  adminNotes?: string
  resolvedBy?: ObjectId
}
```

### Block (NEW)
```typescript
{
  blocker: ObjectId
  blocked: ObjectId
  reason?: string
}
```

---

## 📦 Dépendances Principales

### Backend
- `express` - Framework web
- `mongoose` - ODM MongoDB
- `jsonwebtoken` - Authentification JWT
- `bcrypt` - Hash passwords
- `multer` - Upload fichiers
- `cloudinary` - Stockage images

### Frontend
- `next` - Framework React
- `tailwindcss` - Styling
- `recharts` - Graphiques
- `axios` - HTTP client

---

## 🧪 Tests de Fonctionnement

### ✅ Tester Détection Arnaque

```bash
# Créer annonce suspecte
curl -X POST http://localhost:5000/api/annonces \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{
    "title": "Urgent: WhatsApp",
    "description": "Paiement virement urgent",
    "type": "vente",
    "price": 10
  }'

# Voir le score de risque (devrait être élevé)
# Et isSuspicious: true
```

### ✅ Tester Signalement

```bash
# Signaler une annonce
curl -X POST http://localhost:5000/api/reports \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{
    "type": "annonce",
    "targetId": "ANNONCE_ID",
    "reason": "arnaque",
    "description": "Suspect et contact externe"
  }'

# Vérifier que reportCount augmente dans l'annonce
```

### ✅ Tester Admin

```bash
# Voir dashboard stats (admin only)
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  http://localhost:5000/api/admin/dashboard/stats

# Si erreur 403: L'utilisateur n'a pas le role 'admin'
```

---

## 🚀 Déploiement

### Variables d'Environnement Required

**Backend (.env)**
```env
NODE_ENV=production
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/ccarre
JWT_SECRET=super_secret_key_change_this
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=https://api.ccarre.fr
```

### Deploy Command

```bash
# Backend
cd ccarre
npm run build
npm start

# Frontend
cd ccarre-front
npm run build
npm start
```

---

## 📖 Documentation

- 📘 [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Guide technique complet
- ✅ [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Checklist déploiement
- 🔧 [API Reference] - Endpoints détaillés

---

## 🤝 Contribution

Pour ajouter des fonctionnalités :

1. Créer une branche `feature/nom-feature`
2. Implémenter backend + frontend
3. Ajouter tests
4. Soumettre PR avec description

---

## 📞 Support

**Issues Courantes**

| Problem | Solution |
|---------|----------|
| Admin n'accède pas | Vérifier JWT et role='admin' en DB |
| Annonces non suspectes | Augmenter sensibilité SCAM_KEYWORDS |
| Lenteur dashboard | Ajouter indices MongoDB |
| Rate limit | Wait 15 min ou augmenter limite |

---

## 📄 Licence

MIT - Free to use

---

**Version**: 1.0.0  
**Status**: ✅ Production-Ready  
**Auteur**: GitHub Copilot  
**Last Updated**: April 2026
