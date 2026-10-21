# NOIRÉ — Haute Parfumerie & Personnalisation 3D

Boutique e-commerce de parfums d'exception avec studio de personnalisation 3D en temps réel et commandes directes WhatsApp pour les 58 Wilayas d'Algérie.

## ✨ Fonctionnalités Clés

1. **Expérience 3D & Vidéo d'Arrière-Plan :**
   - Arrière-plan cinématique avec la vidéo 3D fournie (`gemini_generated_video_eaf3c7e6.mp4`).
   - Contrôles audio/pause discrets et élégants.
   - Studio de visualisation 3D propulsé par **Three.js** avec éclairage studio, refractions et textures physiques.

2. **Studio de Personnalisation 3D en Direct :**
   - **Gravure en temps réel :** Le nom saisi (ex: *Lina*, *Amine*, *سارة*) et le mot doux sont gravés directement sur la plaque du flacon via un canvas 2D haute définition mappé en 3D.
   - **Formes de flacon :** Carré Impérial, Cylindre Royal, Octogone Précieux.
   - **Teintes du verre :** Noir Fumé, Cristal Pur, Ambre Doré, Bleu Nuit, Émeraude.
   - **Finitions du bouchon :** Or Brossé 24K, Or Rose, Onyx Noir, Platine Miroir.
   - **Interactivité :** Rotation 360°, zoom molette, réinitialisation de la vue, capture photo haute définition.

3. **Collection de Parfums Privée :**
   - 6 créations rares avec pyramide olfactive complète (tête, cœur, fond), longévité et sillage.
   - Filtres par univers olfactif (Oriental, Boisé, Floral, Frais).
   - Intégration des visuels fournis dans `images/`.

4. **Expérience Coffret Cadeau de Luxe :**
   - Sélection d'occasions (Anniversaire, Mariage, Amour, Aïd, Réussite).
   - Écrin en velours noir rigide avec ruban de soie personnalisable et sceau de cire.
   - Carte de vœux calligraphiée avec texte sur-mesure.

5. **Tunnel de Commande WhatsApp & 58 Wilayas :**
   - Calcul dynamique des frais de livraison pour l'ensemble des **58 Wilayas algériennes**.
   - Génération instantanée du message WhatsApp pré-formaté comprenant tous les détails de la commande, de la gravure et de la livraison.
   - Célébration visuelle par confettis dorés lors de la confirmation.

6. **Bilingue & Configuration Marchand :**
   - Bascule fluide Français / Arabe (Français & العربية) avec adaptation RTL.
   - Modal de réglages pour modifier et tester le numéro WhatsApp marchand à tout moment sans toucher au code.

---

## 🚀 Démarrage Rapide

```bash
# Installation des dépendances
npm install

# Lancement du serveur de développement (Port 5180)
npm run dev

# Création du build de production (statique pour Cloudflare Pages / Vercel)
npm run build
```

---

## 🌐 Déploiement Statique sur Cloudflare Pages

Le projet est 100% statique et optimisé pour **Cloudflare Pages**, **Vercel** ou **Netlify** :
- **Build command :** `npm run build`
- **Output directory :** `dist`
- **Node version :** `18+` ou `20+`
