# COFantasy / CoFItem — guide d’installation et référentiel commun

Ce pack aligne **COFantasy**, **CoFItem**, la **fiche Chroniques Oubliées**, le **catalogue d’objets** et le **Monster Creator** sur le même référentiel de dégâts et d’affinités.

## Installation Roll20

1. Remplacer le script principal par `COFantasy.js`.
2. Remplacer le script objets par `CoFItem.js`.
3. Remplacer le HTML et le CSS de la fiche par `ChroniquesOubliees-Sheet.html` et `ChroniquesOubliees-Sheet.css`.
4. Conserver `Catalogue_objet_Magique.xlsx` comme référentiel des objets/affixes.
5. Utiliser `Monster_Creator_Affinites.xlsx` pour les nouvelles créations de monstres.

Les anciennes fiches, macros et objets ne nécessitent pas de conversion immédiate : **COFantasy garde les anciens mots-clés uniquement comme alias internes de compatibilité**. Ils ne sont plus proposés dans les menus de la fiche ni dans le catalogue courant.

## Référentiel courant

### Dégâts physiques

- Tranchant
- Contondant
- Perçant

### Affinités

- Feu
- Eau
- Air
- Terre
- Ombre
- Lumière
- Force

**Force** désigne l’énergie magique brute sans affinité planaire. Elle ne remplace pas la propriété `--magique` : une attaque peut être magique et posséder une autre affinité.

Les six affinités planaires considérées comme élémentaires sont **Feu, Eau, Air, Terre, Ombre et Lumière**. Force reste une affinité magique non élémentaire.

### Types particuliers

- `toxique` regroupe le nouveau traitement mécanique commun au poison et à la maladie ; les anciens types `poison` et `maladie` restent acceptés.
- `psychique` remplace le type de dégâts `mental` pour les nouvelles entrées ; `mental` reste accepté.
- `drain` et `nature` restent compris pour compatibilité mais ne font pas partie des sept affinités nouvelles.

## Compatibilité des anciens types

| Ancien type | Référentiel courant |
|---|---|
| froid | Eau |
| électrique | Air |
| sonique | Air |
| acide | Terre |
| nécrotique | Ombre |
| radiant | Lumière |
| arcane | Force |
| énergie | Force |
| poison | Toxique |
| maladie | Toxique |
| mental | Psychique |
| nature | ancien type autonome, pas de conversion automatique |

Une résistance nouvelle reconnaît également les anciens types compatibles, et une ancienne attaque bénéficie des nouvelles résistances correspondantes. Une RD précise et une RD d’affinité ne sont pas additionnées entre elles : COFantasy retient la meilleure protection applicable comme auparavant.

## Matériaux d’affinité du catalogue

| Affinité | Matériau RP |
|---|---|
| Feu | Phospharium |
| Eau | Hybberium |
| Air | Fulgurium |
| Terre | Tellurite |
| Ombre | Sombracier |
| Lumière | Héliolite |
| Force | Arcanite |

Les matériaux n’accordent **aucune propriété implicite** autre que l’effet explicitement écrit dans l’affixe.

Le **Laënk solaire** reste volontairement un matériau d’éclairage : il éclaire, mais ne donne pas de dégâts Lumière.

## Anti-familles

Les noms ci-dessous sont des matériaux ou traitements RP. Leur seul effet mécanique est le bonus anti-famille indiqué. Ils existent pour les armes de mêlée et les armes à distance/munitions.

| Famille | Matériau / traitement RP | `typeCible` |
|---|---|---|
| Humanoïde | Hématite rouge | `humanoide` |
| Mort-vivant | Argent alchimique | `mort-vivant` |
| Bête | Cornaline brute | `bete` |
| Vermine | Soufre blanc | `vermine` |
| Aquatique | Corail noir | `aquatique` |
| Aberration | Verre torsadé | `aberration` |
| Plante | Sève noire | `plante` |
| Fée | Poussière d’argent froid | `fee` |
| Monstre | Ferrite noire | `monstre` |
| Vase | Sel vitrifié | `vase` |
| Démon | Fer froid | `demon` |
| Géant | Osmium noir | `geant` |
| Élémentaire | Verre astral | `elementaire` |
| Céleste | Malachium | `celeste` |
| Artificiel | Magnétite vive | `artificiel` |
| Esprit | Étherium | `esprit` |
| Dragon | Dracacier | `dragon` |

Le bonus standard du catalogue est `+1 attaque, +1d6 DM` uniquement contre la famille correspondante. Par exemple :

```text
--if typeCible celeste --bonusAttaque 1 --plus 1d6 --endif
```

## Fiche de personnage

Le sélecteur de type de dégâts affiche uniquement le référentiel courant :

- physiques : Tranchant, Contondant, Perçant ;
- affinités : Feu, Eau, Air, Terre, Ombre, Lumière, Force ;
- spéciaux : Toxique, Psychique, Drain.

**Les anciens types ne sont plus visibles dans les listes.** Si une ancienne fiche contient encore une valeur telle que `electrique`, `froid`, `necrotique` ou `arcane`, COFantasy la reconnaît toujours en interne et l’interprète selon la table de compatibilité ci-dessus.

## Monster Creator

Le créateur travaille désormais avec : `Aff_feu`, `Aff_air`, `Aff_eau`, `Aff_terre`, `Aff_ombre`, `Aff_lumiere`, `Aff_force`.

La colonne historique Nature est conservée uniquement pour lecture/compatibilité et n’est plus exportée automatiquement comme nouvelle affinité. Les prédicats produits sont par exemple `resistanceA_ombre`, `vulnerableA_lumiere` ou `resistanceA_force`.

## Vérifications réalisées

- contrôle syntaxique JavaScript de COFantasy et CoFItem ;
- chargement simultané des deux scripts dans un environnement Roll20 simulé ;
- contrôle de l’absence d’erreur de formule dans le catalogue modifié ;
- contrôle du référentiel d’affinités et des anti-familles dans le catalogue ;
- conservation des alias historiques côté COFantasy.

Le Monster Creator contient des formules Excel dynamiques historiques représentées par `__xludf.DUMMYFUNCTION` hors Excel ; elles existaient dans le classeur source et ne proviennent pas de cette harmonisation.
