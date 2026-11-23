# Le Gardien des saisons

Ressources de départ pour construire une île flottante interactive avec Blender et Three.js.

## Démarrer

Installer Node.js 22 ou ultérieur, ouvrir ce dossier dans l’éditeur et lancer dans son terminal :

```bash
node server.mjs
```

Ouvrir http://localhost:8080. Il n’y a aucune installation npm à effectuer. L’écran initial confirme que les ressources sont disponibles. Les parties du guide remplacent progressivement cet écran.

## Ressources

| Dossier | Contenu |
| --- | --- |
| assets | Scène assemblée et modèles GLB séparés, aperçu rendu dans Blender |
| blender | Scène complète et fichiers Blender de chaque élément |
| vendor | Three.js 0.160.1, GLTFLoader, OrbitControls et licence MIT |
| fonts | Comfortaa et sa licence OFL |

`assets/gardien.glb` est la scène utilisée dans l’application. Les fichiers GLB séparés partagent le même repère pour pouvoir se réassembler sans décalage. Les groupes `Tree`, `Shrine`, `Crystals` et `Snow` ainsi que les matériaux `Leaf_0` à `Leaf_4`, `Ground`, `Grass` et `Crystal` sont utilisés par le code.

La neige est présente dans les exports mais masquée par l’application jusqu’au choix Hiver. Dans les fichiers Blender, elle est masquée à l’ouverture. Les matériaux sont fournis sans texture externe.

Les modèles et le visuel Blender sont des créations originales fournies avec ce projet. Les bibliothèques et la police conservent leurs licences respectives.
