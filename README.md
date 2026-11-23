# Le Gardien des saisons

Une île flottante interactive réalisée avec Blender et Three.js. Choisissez
une saison, explorez le diorama et réveillez les cristaux du sanctuaire.

## Lancer l’application

Node.js 22 ou ultérieur est nécessaire.

```bash
node server.mjs
```

Ouvrir http://localhost:8080. Toutes les ressources sont locales. Aucun `npm
install` n’est nécessaire. Le navigateur doit pouvoir créer un contexte
WebGL.

## Utilisation

| Action | Commande |
| --- | --- |
| Observer l’île | Glisser avec la souris ou un doigt |
| Zoomer | Molette ou pincement tactile |
| Changer de saison | Boutons Printemps, Été, Automne et Hiver |
| Éveiller le sanctuaire | Cliquer sur ses pierres ou cristaux, ou utiliser le bouton |
| Rotation automatique | Bouton Rotation auto |
| Revenir à la présentation initiale | Réinitialiser |

Les boutons sont accessibles avec Tab puis Entrée. Les animations respectent
la préférence de réduction des mouvements. La neige apparaît en hiver et les
matériaux changent progressivement de couleur.

## Structure

| Chemin | Rôle |
| --- | --- |
| src/scene.js | Rendu, caméra, commandes orbitales et lumières |
| src/model.js | Chargement du GLB et préparation des matériaux |
| src/seasons.js | Palettes et transitions |
| src/effects.js | Particules, flottement et cristaux |
| src/interaction.js | Sélection du sanctuaire avec un rayon |
| src/interface.js | Boutons, reset et accessibilité |
| src/main.js | Assemblage et état de chargement |
| assets et blender | Modèles intégrés et sources éditables |

## Vérifier

```bash
node --test tests/contrat-assets.mjs
```

Les tests contrôlent les groupes et matériaux des GLB, les quatre saisons et
les exports séparés. Le contrôle du rendu s’effectue dans un navigateur
compatible WebGL.

## Parcours Git

| Repère | Réalisation |
| --- | --- |
| partie-01 | Interface et structure du projet |
| partie-02 | Scène et caméra |
| partie-03 | Modèle Blender intégré |
| partie-04 | Saisons et matériaux |
| partie-05 | Particules et éveil |
| partie-06 | Sélection du sanctuaire |
| partie-07 | Interface complète et adaptation aux écrans |
| partie-08 | Validation et finition |

`git log --reverse --oneline` affiche la progression. `git show
partie-04:src/main.js` lit un fichier à une étape précise. Pour essayer un
état antérieur, créer un dossier de travail séparé avec `git worktree add
../essai-saisons partie-04`.

Les modèles et les visuels Blender sont des créations originales fournies
avec le projet. Three.js 0.160.1 et les fichiers complémentaires conservent
leur licence MIT. Comfortaa est fournie sous licence OFL.