# Documentation technique — API et Design de la section « Recherche »

## Vue d’ensemble
- Objectif: permettre des recherches de décès en temps réel via un proxy PHP côté hébergement (SmarterASP.NET), avec une UI premium et robuste.
- Architecture: le frontend collecte les champs, normalise/valide, appelle le proxy `api.php` qui relaie la requête à l’API externe (AWS), ajoute l’en-tête `x-api-key`, puis renvoie la réponse JSON au frontend.

Schéma rapide:
- Utilisateur → Formulaire (JS) → `GET /api.php?...` → Proxy PHP → API externe (AWS) → Proxy → Frontend → Rendu des résultats.

---

## 1) API – Fonctionnement complet

### 1.1 Fichiers impliqués
- Frontend JS: `script.js`
- Proxy PHP: `smarterasp-deploy/api.php`
- Configuration: `smarterasp-deploy/config.php`
- Page: `index.html` (contient le formulaire et la section Recherche)

### 1.2 Paramètres attendus (obligatoires côté proxy)
- `fname` (First name)
- `lname` (Last name)
- `city`
- `state` (code USA à 2 lettres)
- `dob` (format attendu par l’API: `YYYYMMDD`)
- Optionnel: `mname` (Middle name)

Note: Le champ `dob` saisi via `<input type="date">` produit `YYYY-MM-DD`. Le JS normalise en `YYYYMMDD` avant l’appel.

### 1.3 Flux côté frontend
- Soumission: `handleDirectPaymentSearch` ouvre un paiement simulé, puis `executeSearchDirect` exécute la recherche.
- Normalisation: prénoms/nom en MAJUSCULES; `dob` converti `YYYY-MM-DD` → `YYYYMMDD`.
- Fallbacks (sécurité UX) dans `executeSearchDirect` si vides:
  - `dob`: `19500101`
  - `city`: `Chicago`
  - `state`: `IL`
- Appel réseau: `callDeathCheckAPI(searchParams)` vers `BACKEND_SEARCH_URL`:
  - Production: `'/api.php'`
  - Local (dev): `http://localhost:3000/api/death-check/search`
- Traitement: `processAPIResponse` homogénéise la réponse, `displayResults` rend les cartes, défilement vers résultats avec offset du header.

Exemple (détermination URL backend):
```javascript
const BACKEND_SEARCH_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api/death-check/search'
  : '/api.php';
```

Conversion de la date:
```javascript
if (searchParams.dob && /\d{4}-\d{2}-\d{2}/.test(searchParams.dob)) {
  const [y, m, d] = searchParams.dob.split('-');
  searchParams.dob = `${y}${m}${d}`; // ex: 19180901
}
```

### 1.4 Flux côté proxy PHP (`smarterasp-deploy/api.php`)
- En-têtes CORS + JSON, charge la config, valide la présence des paramètres requis.
- Construit l’URL API externe et exécute cURL avec l’en-tête `x-api-key` depuis `config.php`.
- Relaie le code HTTP (ex: 400, 403, 500) et le JSON au frontend.

Validation et en-tête clé (extraits):
```php
if (empty($fname) || empty($lname) || empty($city) || empty($state) || empty($dob)) {
  http_response_code(400);
  echo json_encode(['error' => 'First name, last name, city, state, and date of birth are required']);
  exit();
}

curl_setopt_array($curl, [
  // ...
  CURLOPT_HTTPHEADER => [
    'Accept: application/json',
    'Content-Type: application/json',
    'x-api-key: ' . DEATH_CHECK_API_KEY
  ]
]);
```

Configuration de la clé et de l’URL (`smarterasp-deploy/config.php`):
```php
define('DEATH_CHECK_API_URL', 'https://93e08lwg2l.execute-api.us-east-1.amazonaws.com/version_one');
// La clé est définie ici et injectée côté serveur (ne jamais exposer dans le JS)
define('DEATH_CHECK_API_KEY', '••••••••••••••••••••');
```

### 1.5 Contrat d’API
- Méthode: `GET /api.php?fname=...&lname=...&city=...&state=...&dob=YYYYMMDD[&mname=...]`
- Authentification: gérée côté serveur par `api.php` via l’en-tête `x-api-key`.
- Réponse: JSON. Indicateur de succès: `result` (`"True"`/`true`). Champs possibles: `dod`, `dod_precision`, `url`, `article`, indicateurs de présence/qualité.

Exemple cURL (via proxy côté hébergement):
```bash
curl -i "https://votre-domaine.com/api.php?fname=CLAIRE&lname=FRENCH&dob=19180901&city=OSAGE&state=IA"
```

### 1.6 Gestion des erreurs
- 400: paramètres manquants → message JSON explicite.
- 403: rejet par l’API externe (clé invalide/quotas) → le proxy relaie `403` et « API returned error: 403 ».
- 500: erreur cURL/transport ou JSON invalide.
- Frontend: notification utilisateur, squelette de chargement, bouton désactivé pendant la requête, scroll contrôlé.

### 1.7 Sécurité et déploiement
- Clé API côté serveur uniquement (`config.php`).
- CORS: `Access-Control-Allow-Origin: *` (pouvant être restreint).
- Production: `ENVIRONMENT = 'production'` désactive l’affichage des erreurs et journalise dans `error.log`.
- Build: `create-smarterasp-package.sh` prépare `smarterasp-deploy/` (PHP, config, `web.config`, `.htaccess`, frontend).

---

## 2) Design exact — Section « Death Record Search »

La section Recherche est placée immédiatement sous le H1 de la hero et applique un style premium, cohérent desktop/mobile, avec styles inline critiques pour fiabilité en production.

### 2.1 Structure HTML (emplacement et blocs)
- Emplacement: `index.html` → `.hero-section` → `.search-section`
- Blocs:
  - `.form-container` (carte principale: gradient blanc/bleu très léger, rayon 20px, ombres premium)
  - `.search-header` (bandeau glassy avec gradient bleu/vert subtil, flou)
  - `<form id="searchForm">` → `.form-grid` (6 champs) + `.search-actions`
  - `.payment-info` (badges « PayPal Verified » et « SSL Secure »)

Extrait essentiel (styles inline prioritaires):
```html
<section class="search-section">
  <div class="form-container" style="transform: perspective(1200px) rotateX(0deg) rotateY(0deg) !important; background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 50%, #F0F4FF 100%) !important; border: 1px solid rgba(37,99,235,0.08) !important; box-shadow: 0 20px 40px rgba(15,23,42,0.06), 0 4px 12px rgba(37,99,235,0.04) !important; border-radius: 20px !important; transition: all 300ms ease !important; padding: 2rem !important;">
    <div class="search-header" style="background: linear-gradient(90deg, rgba(37,99,235,0.04) 0%, rgba(16,185,129,0.04) 100%) !important; border: 1px solid rgba(15,23,42,0.04) !important; border-radius: 16px !important; padding: 1rem 1.5rem !important; margin-bottom: 1.5rem !important; backdrop-filter: blur(10px) !important;">
      <h2 class="form-title"><i class="fas fa-search"></i> Death Record Search</h2>
      <div class="pricing-info">
        <div class="price-tag" style="display: flex !important; align-items: center !important; gap: 0.5rem !important; background: linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%) !important; color: #9A3412 !important; border: 1px solid #FED7AA !important; border-radius: 9999px !important; padding: 0.5rem 1rem !important; font-weight: 700 !important; box-shadow: 0 2px 8px rgba(245,158,11,0.15) !important;">
          <span class="price" style="font-size: 1rem; color: #EA580C;">only $0.99</span>
          <span class="price-label" style="font-size: 0.8rem; opacity: 0.8;">per search</span>
        </div>
      </div>
    </div>
    <!-- ... formulaire ... -->
  </div>
</section>
```

### 2.2 Styles globaux (complémentaires)
- `.form-container` (extrait `styles.css`): gradient blanc, radius 20px, ombres fortes, blur, transition tilt.
- `.form-grid`: grille auto-fit responsive.
- `.field-icon`: icône intérieure alignée à gauche.

```css
.form-container {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transform: perspective(1200px) rotateX(0deg) rotateY(0deg);
  transition: transform 400ms ease, box-shadow 300ms ease;
}

.field-icon {
  position: absolute;
  left: 1rem;
  top: 2.8rem; /* Desktop alignement fin */
  color: #9ca3af;
  pointer-events: none;
}
```

- Mobile: inline CSS force l’alignement plus bas pour répondre aux retours visuels (ex: `top: 3.75rem` sur mobile).

### 2.3 Champs et grille
- Champs (6): `fname`, `mname`, `lname`, `dob` (date), `city`, `state` (liste).
- Grille: `.form-grid` 1–2 colonnes selon la largeur.
- Labels forts, inputs radius 12px, focus visible (halo bleu).

### 2.4 Bouton et interactions
- `.search-btn`: gradient PayPal-like `#0070ba → #005ea6`, ombre, loader circulaire interne, états `loading/hover/active`.
- Soumission: modal de paiement simulé (PayPal) puis exécution de la recherche.
- Défilement: offset automatique prenant en compte le header sticky.

### 2.5 Bandeau de prix
- `.search-header`: gradient `rgba(37,99,235,0.04) → rgba(16,185,129,0.04)`, flou 10px, bord arrondi 16px.
- `price-tag`: pastille ambre dégradée, bord `#FED7AA`, radius full, typographie forte.

### 2.6 Accessibilité et erreurs
- Focus visible partout (`*:focus-visible`).
- Erreurs inline sous chaque champ `.error-message`.
- Validation côté JS puis côté proxy (double barrière).

### 2.7 Résultats et squelettes
- Pré-réponse: squelettes `.skeleton-card` (shimmer).
- Résultats: cartes `.result-card` (statut, DOB, localisation, précision, source cliquable si dispo).
- Confiance: `calculateMatchConfidence` plafonné à 99%.

---

## 3) Notes de maintenance & déploiement
- Toujours uploader le dossier `smarterasp-deploy/` pour la prod SmarterASP.NET.
- Vérifier `config.php` contient la bonne clé avant mise en ligne (ne pas exposer côté client).
- Si 403 persiste: revérifier la clé, les paramètres (tous requis), tester en cURL.
- Les styles critiques sont dupliqués inline dans `index.html` pour contourner d’éventuelles purges CSS côté hébergeur.

## 4) Tests rapides
- Proxy via cURL:
```bash
curl -i "https://votre-domaine.com/api.php?fname=CLAIRE&lname=FRENCH&dob=19180901&city=OSAGE&state=IA"
```
- UI: saisir `fname`/`lname` (et idéalement DOB/city/state), suivre le flux de paiement simulé, vérifier l’apparition des squelettes puis des résultats.

