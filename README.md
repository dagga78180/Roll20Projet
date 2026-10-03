# Roll20Projet V2 — point d’entrée

Ce dépôt réunit **trois scripts qui travaillent ensemble**, mais chacun répond à un besoin différent. La documentation est donc volontairement séparée en **trois guides utilisateur**, un par script.

| Guide | À lire si vous voulez… |
|---|---|
| **[COFantasy — Guide de jeu et moteur](COFantasy_GUIDE.md)** | Comprendre le combat, les états, blessures, opportunités, jets, dégâts, soins, effets, zones, sorts, prédicats, initiative et le Monster Creator. |
| **[CoFItem — Guide des objets et de la logistique](CoFItem_GUIDE.md)** | Créer/donner/équiper des objets, comprendre Q/P, affixes, prix, consommables, transferts, repos, hébergements et loot. |
| **[COAlaric — Guide du commerce](COAlaric_GUIDE.md)** | Utiliser la boutique Alaric : achats, ventes, marchandage, vol, affinité, ardoise et rollback. |

L’objectif n’est pas seulement de donner des commandes. Chaque guide explique **ce que la mécanique représente en jeu, pourquoi elle existe, ce que le script automatise et ce qui reste une décision du MJ**.

## Installation recommandée

1. Installer `ChroniquesOubliees-Sheet.html` et `ChroniquesOubliees-Sheet.css` comme fiche personnalisée Roll20.
2. Ajouter les scripts API dans la même campagne :
   1. `COFantasy-V2.0.0.js`
   2. `CoFItem-V2.0.0.js`
   3. `COAlaric-V2.0.0.js`
3. Redémarrer la sandbox API.
4. Lancer `!cof-doctor`, puis `!cof-doctor --repair` uniquement si le diagnostic le conseille.
5. Lancer `!cof-set-macros` côté MJ.
6. Vérifier `!cof-options`, `!coi-equipe` et `!co-alaric diagnostic`.
7. Pour les fonctions de groupe, créer un handout **`Equipe PJ`** et y maintenir les PJ principaux.

## Fichiers importants

| Fichier | Rôle |
|---|---|
| `COFantasy-V2.0.0.js` | Moteur de règles et de combat. |
| `CoFItem-V2.0.0.js` | Catalogue, objets, inventaire, repos et loot. |
| `COAlaric-V2.0.0.js` | Commerce Alaric. |
| `Monster_Creator_V2.xlsx` | Création de monstres et export Roll20/COFantasy. |
| `Catalogue_Objets_Magiques_V2.xlsx` | Source humaine du catalogue. |
| `Catalogue_pricing_model.json` | Référentiel de prix machine. |
| `docs/COMMANDES_REFERENCE.md` | Index exhaustif des commandes détectées dans les trois routeurs. |
| `docs/PREDICATS_REFERENCE.md` | Référence exhaustive des prédicats lus par COFantasy. |
| `docs/AFFIXES_REFERENCE.md` | Référence exhaustive des affixes du catalogue. |
| `docs/MONSTER_CREATOR.md` | Référence technique du classeur Monster Creator. |

## Comment lire cette documentation

Pour une première installation, lire les guides dans cet ordre : **COFantasy → CoFItem → COAlaric**. COFantasy définit le vocabulaire de jeu ; CoFItem fabrique et transporte les objets qui alimentent ce vocabulaire ; COAlaric orchestre des transactions utilisant les deux autres scripts.

Les commandes dites **techniques** sont volontairement documentées mais ne sont généralement pas à taper à la main : elles sont émises par les boutons de chat, la fiche ou un autre script. Lorsqu’une commande est prévue pour être utilisée directement par le joueur/MJ, le guide le précise.

## Philosophie de la V2

La V2 suit quatre principes :

- **Une seule source de vérité** : mêmes états, types de dégâts, affixes et prix d’un bout à l’autre.
- **Le chat explique ce qui se passe** : le script doit produire des cartes/boutons lisibles plutôt que demander de connaître les internals.
- **Le MJ garde les décisions fictionnelles** : le moteur résout la mécanique, mais ne décide pas à la place du MJ de la narration, d’une conséquence sociale ou d’une exception de règle.
- **Undo commun** : lorsqu’une opération est enregistrée dans l’historique COFantasy, `!cof-undo` doit être le premier réflexe après une erreur de clic.

## Diagnostic rapide

```text
!cof-doctor
!cof-statut
!cof-statut-ressources
!coi-equipe
!co-alaric diagnostic
```

Si la question est « quelle commande existe ? », consulter `docs/COMMANDES_REFERENCE.md`. Si la question est « comment jouer cette situation ? », lire d’abord le guide du script concerné.
