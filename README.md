# Les cuisines de Sandrine

Site statique (Vite + TypeScript) pour cuisine maison — livraison et click-and-collect.

## Démarrage

```bash
npm create vite@latest sandrine -- --template vanilla-ts
cd sandrine
npm i
npm run dev
```

## Scripts
- `dev`: lance le serveur de dev
- `build`: génère `dist/`
- `preview`: prévisualise le build

## Déploiement (Netlify)
- Fichier `netlify.toml` fourni.
- Build command: `npm run build`
- Publish directory: `dist`

## Configuration
Modifier `src/ts/config.ts` (téléphone, email, adresse, zone de livraison, frais, minimum, SITE_URL, horaires).

## Formulaire
- Envoi via Formspree: remplacer l'ID dans `src/ts/main.ts` (`formspreeEndpoint`).
- Fallback: mailto.
- Brouillon: LocalStorage automatique.

## Accessibilité
- Navigation clavier, focus visible, `aria-live` sur statut du formulaire.

## SEO
- Métas OG/Twitter, `link rel=canonical`, JSON-LD Restaurant.

## À faire (prochaines étapes)
- ESLint/Prettier/Stylelint, Husky/lint-staged
- Playwright E2E + CI GitHub Actions + Lighthouse CI
- Images optimisées et logo
