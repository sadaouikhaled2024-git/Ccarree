# 🛡️ CCarré - Plateforme Sécurisée avec Modération Avancée

## 📋 Vue d'ensemble

Ce projet implémente une plateforme **fiable et sécurisée** avec les fonctionnalités suivantes :
- ✅ Dashboard admin complet
- ✅ Détection automatique d'arnaques
- ✅ Messagerie sécurisée avec avertissements
- ✅ Système de modération intelligent
- ✅ Analytics détaillées
- ✅ Gestion des utilisateurs (bannissement)

---

## 🔧 Changements Backend (Node.js/Express)

### 1️⃣ **Nouveaux Modèles**

#### ✨ Améliorations au modèle `User`
```typescript
// Champs ajoutés:
- role: 'user' | 'admin'
- isBanned: boolean
- bannedReason?: string
- riskScore: number (0-100)
- reportCount: number
- blockedUsers: ObjectId[]
- messageCount: number
- announcementCount: number
```

#### ✨ Améliorations au modèle `Annonce`
```typescript
// Champs ajoutés:
- reportCount: number
- riskScore: number (0-100)
- isSuspicious: boolean
- suspiciousReasons: string[]
- status: 'supprimee' (nouvelle valeur)
```

#### 🆕 Nouveau modèle `Report`
```typescript
// Signalements avec détails:
- type: 'annonce' | 'user' | 'message'
- reason: arnaque | contenu_offensant | spam | contact_externe | prix_suspect
- status: 'ouvert' | 'en_cours' | 'resolu' | 'rejete'
- priority: 'low' | 'normal' | 'high' | 'urgent'
- adminNotes?: string
- resolvedBy?: ObjectId
```

#### 🆕 Nouveau modèle `Block`
```typescript
// Gestion des blocages d'utilisateurs:
- blocker: ObjectId
- blocked: ObjectId
- reason?: string
```

### 2️⃣ **Utilitaires de Sécurité** (`src/utils/security.ts`)

```typescript
// Détection de mots suspects
detectScamKeywords(text) // Whatsapp, urgent, paiement externe, etc.

// Détection de contacts externes
detectPhoneNumbers(text)    // +33, 06, 07, etc.
detectEmails(text)          // Expressions rationnelles
detectExternalLinks(text)   // URLs/liens

// Analyse complète
performSecurityAnalysis(title, description)
calculateAnnonceRiskScore({keywordRiskScore, reportCount, ownerRiskScore})
```

### 3️⃣ **Middlewares Admin** (`src/middlewares/admin.middleware.ts`)

```typescript
isAdmin()              // Vérifier rôle admin
logAdminAction()       // Logger les actions admin
createRateLimiter()    // Anti-spam (100 req/15min par défaut)
sanitizeInputs()       // Protection XSS
```

### 4️⃣ **Contrôleurs Admin** (`src/controllers/admin.controller.ts`)

#### Dashboard
- `getDashboardStats()` - Statistiques globales

#### Annonces
- `listAnnonces(filter)` - Liste avec filtres (all/reported/suspicious/high-risk)
- `getAnnonceDetail(id)` - Détails + signalements
- `deleteAnnonce(id)` - Suppression avec raison
- `updateAnnonceRiskScore(id)` - Mise à jour manuelle du score

#### Utilisateurs
- `listUsers(filter)` - Liste (all/banned/high-risk/suspected)
- `banUser(userId, reason)` - Bannir un utilisateur
- `unbanUser(userId)` - Débannir

#### Signalements
- `listReports(status, priority)` - Liste avec filtres
- `updateReportStatus(id)` - Changer statut/priorité
- `deleteReport(id)` - Supprimer signalement

#### Messages
- `listMessages()` - Voir tous les messages
- `deleteMessage(id)` - Supprimer message

#### Blocages
- `listBlockedUsers()` - Liste des blocages
- `unblockUser(blockId)` - Débloquer utilisateur

#### Analytics
- `getAnalytics(period)` - Statistiques sur 7d/30d/90d

### 5️⃣ **Contrôleur Reports** (`src/controllers/report.controller.ts`)

```typescript
createReport()      // Utilisateurs peuvent signaler
getMyReports()      // Voir ses propres signalements
getReportDetail()   // Détails d'un signalement
```

### 6️⃣ **Contrôleur Messagerie Sécurisée** (`src/controllers/secure-message.controller.ts`)

```typescript
createMessage()     // Créer message (analyse sécurité)
getMessages()       // Récupérer conversation
deleteMessage()     // Supprimer message
blockUser()         // Bloquer utilisateur
unblockUser()       // Débloquer
getBlockedUsers()   // Liste des bloqués
```

### 7️⃣ **Routes**

#### Admin (`/api/admin/`)
```
GET    /dashboard/stats
GET    /annonces?filter=all&page=1
GET    /annonces/:id
DELETE /annonces/:id
PATCH  /annonces/:id/risk-score
GET    /users?filter=all&page=1
POST   /users/:userId/ban
POST   /users/:userId/unban
GET    /reports?status=all&priority=all
PATCH  /reports/:reportId
DELETE /reports/:reportId
GET    /messages
DELETE /messages/:messageId
GET    /blocked-users
DELETE /blocked-users/:blockId
GET    /analytics?period=7d
```

#### Reports (`/api/reports/`)
```
POST   /                    // Créer signalement
GET    /                    // Voir ses signalements
GET    /:reportId           // Détail signalement
```

#### Messagerie Sécurisée (`/api/secure-messages/`)
```
POST   /                           // Créer message
GET    /:echangeId                 // Voir conversation
DELETE /:messageId                 // Supprimer message
POST   /block/:targetUserId        // Bloquer utilisateur
DELETE /block/:blockId             // Débloquer
GET    /blocks/list                // Liste blocages
```

---

## 🎨 Changements Frontend (Next.js/React)

### 1️⃣ **API Client Admin** (`lib/admin-api.ts`)

Interface TypeScript complète avec tous les endpoints admin.

### 2️⃣ **Pages Admin**

#### 📊 Dashboard (`/admin`)
- Statistiques globales (cartes)
- Graphiques pie chart (risques, urgences)
- Menus rapides vers les pages de gestion

#### 📋 Gestion Annonces (`/admin/annonces`)
- Tableau avec filtres (all/reported/suspicious/high-risk)
- Affichage: titre, propriétaire, signalements, score risque
- Actions: Voir détail, Supprimer
- Modal détail avec signalements associés
- Pagination

#### 👥 Gestion Utilisateurs (`/admin/users`)
- Tableau avec filtres (all/banned/high-risk/suspected)
- Affichage: nom, email, score risque, statut
- Actions: Bannir, Débannir
- Modal bannissement avec raison

#### 🚩 Gestion Signalements (`/admin/reports`)
- Tableau avec filtres (statut + priorité)
- Affichage: type, raison, signalé par, statut, priorité
- Actions: Modifier, Supprimer
- Modal mise à jour (statut, priorité, notes)

#### 📊 Analytics (`/admin/analytics`)
- Sélection de période (7d/30d/90d)
- 6 cartes métriques (suppressions, bans, messages, etc.)
- Graphique bar chart activité globale
- Section tendances avec résumés

---

## 🔐 Sécurité Implémentée

### Backend ✅
1. **Authentification JWT** - Vérification requise
2. **Rôle Admin** - Seuls les admins accèdent aux endpoints
3. **Rate Limiting** - 100 req/15min pour anti-spam
4. **Sanitisation** - Suppression des balises HTML/XSS
5. **Validation** - Vérification côté serveur uniquement
6. **Détection Arnaques** - Automatique dès la création
7. **Vérification Bans** - Les utilisateurs bannis ne peuvent pas créer

### Frontend 🎨
1. **Protection Routes** - Vérifier le rôle admin avant accès
2. **Avertissements** - Liens externes, numéros, emails détectés
3. **Confirmation** - Avant suppression/bannissement
4. **Feedback** - Messages de confirmation

---

## 📊 Système de Risk Score

### Calcul pour Annonces
```
riskScore = 
  + mots_suspects (0-100)
  + (reportCount × 10)      [capped à 40]
  + (userRiskScore × 0.5)
  + (jeune_compte ? 15 : 0)

Suspicious si: riskScore >= 40
```

### Détection de Mots Suspects
- **Communication externe**: WhatsApp, Telegram, numéros
- **Urgence**: urgent, dépêchez-vous, immédiat
- **Paiement externe**: virement, PayPal, crypto, Bitcoin
- **Prix anormal**: gratuit, trop bon, promo, solde

---

## 🚀 Déploiement

### Backend
```bash
cd ccarre
npm install
npm run build
npm start  # ou npm run dev
```

### Frontend
```bash
cd ccarre-front
npm install
npm run build
npm start  # ou npm run dev
```

### Variables d'environnement requises

**Backend (.env)**
```
NODE_ENV=development
DATABASE_URL=mongodb://...
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📝 Exemples d'Utilisation

### Créer un Signalement (Utilisateur)
```bash
POST /api/reports
{
  "type": "annonce",
  "targetId": "507f1f77bcf86cd799439011",
  "reason": "arnaque",
  "description": "Prix suspect et contact WhatsApp"
}
```

### Bannir Utilisateur (Admin)
```bash
POST /api/admin/users/507f1f77bcf86cd799439012/ban
{
  "reason": "Arnaques répétées"
}
```

### Bloquer Utilisateur (Utilisateur normal)
```bash
POST /api/secure-messages/block/507f1f77bcf86cd799439013
{
  "reason": "Harcèlement"
}
```

---

## 🐛 Dépannage

### L'admin ne voit pas le dashboard
- ✅ Vérifier le JWT dans l'Authorization header
- ✅ Vérifier que `role = 'admin'` en base de données
- ✅ Vérifier les logs du serveur

### Les annonces ne sont pas marquées comme suspectes
- ✅ Vérifier que les mots suspects sont reconnus (case-insensitive)
- ✅ Vérifier le calcul du risk score
- ✅ Voir la console pour les logs de détection

### Les blocages ne fonctionnent pas
- ✅ Vérifier que le modèle Block existe
- ✅ Vérifier que l'utilisateur a les droits
- ✅ Vérifier l'ID de l'utilisateur bloqué

---

## 📚 Fichiers Créés/Modifiés

### Backend
✅ `src/models/user.model.ts` - Amélioré
✅ `src/models/annonce.model.ts` - Amélioré
✅ `src/models/report.model.ts` - **Créé**
✅ `src/models/block.model.ts` - **Créé**
✅ `src/utils/security.ts` - **Créé**
✅ `src/middlewares/admin.middleware.ts` - **Créé**
✅ `src/middlewares/auth.middleware.ts` - Amélioré
✅ `src/controllers/admin.controller.ts` - **Créé**
✅ `src/controllers/report.controller.ts` - **Créé**
✅ `src/controllers/secure-message.controller.ts` - **Créé**
✅ `src/controllers/annonce.controller.ts` - Amélioré (sécurité)
✅ `src/routes/admin.routes.ts` - **Créé**
✅ `src/routes/report.routes.ts` - **Créé**
✅ `src/routes/secure-message.routes.ts` - **Créé**
✅ `src/routes/index.ts` - Amélioré

### Frontend
✅ `lib/admin-api.ts` - **Créé**
✅ `app/admin/page.tsx` - **Créé** (Dashboard)
✅ `app/admin/annonces/page.tsx` - **Créé**
✅ `app/admin/users/page.tsx` - **Créé**
✅ `app/admin/reports/page.tsx` - **Créé**
✅ `app/admin/analytics/page.tsx` - **Créé**

---

## 🎯 Prochaines Étapes (Optionnelles)

- [ ] Ajouter 2FA pour les admins
- [ ] Intégrer un système d'email pour les notifications admin
- [ ] Ajouter les logs des actions admin en base de données
- [ ] Créer des alertes temps réel (WebSocket)
- [ ] Importer/exporter données (CSV)
- [ ] Dashboard mobile
- [ ] Tests unitaires et e2e
- [ ] CI/CD pipeline

---

## 📞 Support

Pour toute question ou problème, consulter les logs du serveur :
```bash
tail -f logs/admin.log
```

---

**Version**: 1.0.0  
**Dernière mise à jour**: Avril 2026  
**Auteur**: AI Assistant (GitHub Copilot)
