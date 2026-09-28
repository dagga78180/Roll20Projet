# COFantasy Roll20 — Guide d’utilisation

**COFantasy + CoFItem + fiche de personnage Chroniques Oubliées**

Ce document est un **manuel d’utilisation**, pas un journal de modifications. Il décrit comment les deux scripts et la fiche travaillent ensemble, puis regroupe les commandes utiles et les interfaces disponibles.

Le pack complet contient également :

- `Catalogue_objet_Magique.xlsx` : catalogue des objets, affixes, matériaux d’affinité et traitements anti-famille ;
- `Monster_Creator_Affinites.xlsx` : créateur de monstres aligné sur le même référentiel ;
- `MIGRATION.md` : table de correspondance destinée uniquement à la migration et à la compatibilité des anciennes données.

## 1. Les trois éléments du système

| Élément | Rôle principal |
|---|---|
| **Fiche Chroniques Oubliées** | Stocke les caractéristiques, PV/PR/PC/PM, attaques, équipements, prédicats, listes d’actions et fiches OBJET. |
| **COFantasy** | Moteur de règles : combat, attaques, états, dégâts, soins, initiative, jets, mouvements, AO, zones, tests collectifs, défis, téléportations, invocations, Undo… |
| **CoFItem** | Couche objets et logistique : catalogue, affixes, fiches OBJET, consommables, ceinture/sac, échanges, pause de 5 minutes, repos, hébergements, butin et loot. |

Schéma logique :

```text
FICHE DE PERSONNAGE
   ↕ attributs / attaques / prédicats / inventaire
COFANTASY  ←→  COFITEM
 règles          objets / repos / loot
   ↖________ !cof-undo commun ________/
```

CoFItem est conçu pour être chargé à côté de COFantasy. Lorsque le pont entre les deux est disponible, les opérations CoFItem compatibles sont enregistrées dans l’historique COFantasy et peuvent être annulées avec `!cof-undo`.

## 2. Installation et mise en place

1. Installer `ChroniquesOubliees-Sheet.html` et `ChroniquesOubliees-Sheet.css` comme **fiche Chroniques Oubliées personnalisée** dans la partie Roll20.
2. Ajouter `COFantasy.js` dans les scripts API Roll20.
3. Ajouter `CoFItem.js` dans les scripts API de la même partie.
4. Sauvegarder les scripts puis ouvrir une fiche de personnage pour laisser les sheetworkers synchroniser les champs dérivés.
5. Côté MJ, lancer `!cof-set-macros` pour créer/actualiser les macros proposées par COFantasy.
6. Créer un handout nommé **`Equipe PJ`** lorsque les fonctions de groupe sont utilisées : tests collectifs, distributions, pause/repos et butin s’appuient sur cette notion de groupe.

Commandes de contrôle utiles : `!cof-options`, `!cof-doctor`, `!coi-equipe`, `!cof-statut`, `!cof-statut-ressources`.

## 3. La fiche de personnage et ses liens avec les scripts

### 3.1 Tokens et ressources

Pour qu’un token soit exploitable par les scripts, il doit représenter une fiche de personnage. La fiche fournit notamment les ressources **PV**, **PR**, **PC** et **PM**. COFantasy et CoFItem lisent et modifient ces mêmes attributs ; il ne faut donc pas créer des doublons manuels portant des noms proches.

La configuration historique des barres reste importante : **barre 1 = PV**, **barre 2 = PM lorsqu’ils sont utilisés, sinon dommages temporaires selon la configuration**, **barre 3 = modificateur temporaire d’attaque**.

Le bouton **Pause 5 min** de la fiche appelle CoFItem et ouvre la pause de groupe. La commande `!cof-pause`, elle, est une pause technique de la partie qui verrouille le mouvement : ce sont deux fonctions différentes.

### 3.2 Attaques de la fiche → COFantasy

Chaque ligne d’attaque de la fiche alimente directement le moteur `!cof-attack`. Les champs importants sont :

- **Type d’attaque** : Naturel, Arme 1 main, Arme 2 mains, Sortilège, Arme gauche ou Arme de jet.
- **Modificateurs** : options sans argument comme `avantage`, `désavantage`, `auto`, `poudre`, `pasDeDmg`…
- **Type de dégâts** : Tranchant, Contondant, Perçant, Feu, Eau, Air, Terre, Ombre, Lumière, Force, Toxique, Psychique ou Drain. Les anciens noms de dégâts ne sont plus proposés dans la fiche.
- **Options d’attaque** : options COFantasy nécessitant des arguments (`--mana`, `--rang`, `--portee`, `--plus`, `--save`, `--effet`…).
- **Prédicats si porté** : prédicats actifs uniquement lorsque l’arme concernée est portée/équipée.

La valeur `-1` dans `!cof-attack` signifie « arme principale actuellement en main ». La main gauche utilise `-2`, mais la mécanique d’attaque d’opportunité ne se sert pas de la main gauche.

### 3.3 Onglet Script → prédicats et listes d’actions

Le champ **Prédicats** de l’onglet Script est une des principales interfaces entre la fiche et COFantasy. Un prédicat est un mot-clé, éventuellement suivi d’une valeur avec `:`. Les commentaires de ligne peuvent utiliser `//`.

Exemples :

```text
volant
bonusAttaqueMagique:2
attaquesOpportunite:2
// commentaire
```

Les **listes d’actions** de la fiche peuvent contenir des attaques, macros, abilities et commandes API. `!cof-liste-actions` affiche ces actions dans le chat pour le personnage concerné.

### 3.4 Équipement, consommables et actions d’objet → CoFItem

CoFItem alimente les sections d’équipement de la fiche et les fiches **OBJET / COMPENDIUM**. Les armes, armures et accessoires peuvent être donnés puis équipés ; les consommables sont empilés dans `repeating_equipement`, décrémentés à l’utilisation et peuvent exécuter une commande COFantasy. Les actions portées par un objet équipé sont également remontées vers le porteur lorsque la fiche le permet.

Les commandes importantes sont `!coi-give`, `!coi-give-all-pj`, `!coi-use-conso`, `!coi-show`, `!coi-affixes` et `!coi-catalogue`. Les commandes de boutons techniques (`!coi-equip-choice`, `!coi-delete-conso`, etc.) sont normalement générées par l’interface et n’ont pas à être saisies à la main.

### 3.5 Fiches OBJET → CoFItem → COFantasy

La fiche possède un mode **OBJET / COMPENDIUM**. Une fiche OBJET peut représenter une arme, une armure/bouclier, un accessoire, un consommable, du matériel ou un hébergement.

Les boutons de la fiche OBJET sont directement reliés à CoFItem :

| Bouton / champ de la fiche | Action |
|---|---|
| **Afficher** | `!coi-show --character @{character_id}` |
| **Affixes** | `!coi-affixes --item @{character_id}` |
| **Catalogue** | `!coi-catalogue` |
| **Afficher un hébergement** | `!coi-hebergement-show --character @{character_id}` |
| **Commande COFantasy à l’utilisation** d’un consommable | Exécute la commande `!cof-*` stockée sur l’objet lors de son utilisation. |
| **Actions de l’objet** | Les actions générées ou personnalisées d’un objet équipé peuvent être proposées au porteur. |
| **Prédicats générés/manuels** | CoFItem les calcule/stocke ; COFantasy les exploite lorsque l’objet est porté dans le contexte prévu. |

Une **commande personnalisée** saisie sur une action d’objet est prioritaire sur la commande générée automatiquement. Cela permet d’utiliser le catalogue comme base tout en adaptant une capacité particulière sans modifier le script.

### 3.6 Référentiel actuel des dégâts et affinités

La fiche, COFantasy, CoFItem, le catalogue d’objets et le Monster Creator utilisent le même vocabulaire mécanique.

#### Dégâts physiques

- **Tranchant**
- **Contondant**
- **Perçant**

#### Affinités

- **Feu**
- **Eau**
- **Air**
- **Terre**
- **Ombre**
- **Lumière**
- **Force**

Les six premières correspondent aux affinités planaires. **Force** représente une énergie magique brute sans affinité planaire. La propriété `--magique` reste indépendante : une attaque peut être magique et posséder n’importe quelle affinité.

#### Types particuliers

- **Toxique** : dégâts liés aux toxines, poisons ou maladies lorsqu’ils sont exprimés sous forme de dégâts.
- **Psychique** : dégâts visant l’esprit ; COFantasy active également la logique d’attaque mentale associée.
- **Drain** : type particulier conservé comme mécanique distincte.

**Nature n’est pas une affinité.** Une capacité de thème naturel reçoit l’affinité correspondant réellement à son effet : Terre pour certaines racines ou pierres, Air pour une tempête, Eau pour du froid ou de l’eau, etc. Une capacité naturelle peut aussi ne recevoir aucune affinité particulière.

#### Compatibilité des anciennes fiches et macros

Les anciens noms ne sont **plus affichés dans les listes de la fiche ni utilisés pour les nouveaux objets**. COFantasy continue néanmoins de les comprendre en interne afin de ne pas casser une ancienne macro ou une ancienne ligne d’attaque.

| Ancien mot-clé | Interprétation actuelle |
|---|---|
| `froid` | Eau |
| `electrique` | Air |
| `sonique` | Air |
| `acide` | Terre |
| `necrotique` | Ombre |
| `radiant` | Lumière |
| `arcane` / `energie` | Force |
| `poison` / `maladie` | Toxique |
| `mental` | Psychique |
| `nature` | ancien type autonome, accepté uniquement pour compatibilité |

Cette compatibilité est volontairement **invisible côté utilisateur** : pour toute nouvelle capacité, utiliser les noms du référentiel actuel.

### 3.7 Matériaux d’affinité du catalogue

Les matériaux ci-dessous sont des noms RP portant une **affinité de dégâts**. Ils n’accordent aucune autre propriété implicite.

| Affinité | Matériau RP |
|---|---|
| Feu | **Phospharium** |
| Eau | **Hybberium** |
| Air | **Fulgurium** |
| Terre | **Tellurite** |
| Ombre | **Sombracier** |
| Lumière | **Héliolite** |
| Force | **Arcanite** |

Le **Laënk** est volontairement séparé de cette table : il sert à l’**éclairage** et ne confère pas de dégâts Lumière.

### 3.8 Traitements anti-famille

Ces noms sont des matériaux, poudres, incrustations ou traitements RP. Leur seul rôle mécanique est le bonus contre la famille indiquée. Ils existent pour les armes de mêlée et pour les armes à distance/munitions ; dans ce dernier cas, le texte RP décrit généralement une pointe, un projectile, une poudre ou un traitement de munition.

| Famille | Matériau / traitement RP | `typeCible` |
|---|---|---|
| Humanoïde | **Hématite rouge** | `humanoide` |
| Mort-vivant | **Argent alchimique** | `mort-vivant` |
| Bête | **Cornaline brute** | `bete` |
| Vermine | **Soufre blanc** | `vermine` |
| Aquatique | **Corail noir** | `aquatique` |
| Aberration | **Verre torsadé** | `aberration` |
| Plante | **Sève noire** | `plante` |
| Fée | **Poussière d’argent froid** | `fee` |
| Monstre | **Ferrite noire** | `monstre` |
| Vase | **Sel vitrifié** | `vase` |
| Démon | **Fer froid** | `demon` |
| Géant | **Osmium noir** | `geant` |
| Élémentaire | **Verre astral** | `elementaire` |
| Céleste | **Malachium** | `celeste` |
| Artificiel | **Magnétite vive** | `artificiel` |
| Esprit | **Étherium** | `esprit` |
| Dragon | **Dracacier** | `dragon` |

Le modèle standard du catalogue est un bonus conditionnel contre la famille correspondante, par exemple :

```text
--if typeCible celeste --bonusAttaque 1 --plus 1d6 --endif
```

**Malachium est uniquement anti-Céleste.** Il ne donne pas automatiquement les propriétés Profane, Ombre ou une quelconque affinité.

### 3.9 Monster Creator

Le Monster Creator fourni avec le pack emploie les affinités **Feu, Eau, Air, Terre, Ombre, Lumière et Force** pour ses nouvelles résistances, vulnérabilités et affinités. Les familles de créatures correspondent aux catégories utilisées par les traitements anti-famille du catalogue.

Les anciennes colonnes ou formules conservées pour compatibilité ne doivent pas servir de vocabulaire de référence pour de nouveaux monstres.

## 4. Macros, sélection et syntaxe commune

### 4.1 Sélection et ciblage

Les commandes utilisent souvent `@{selected|token_id}` pour l’acteur et `@{target|token_id}` pour une cible. Plusieurs commandes COFantasy acceptent également `--target TOKEN_ID`, ainsi que des sélections de groupe comme `--allies`, `--equipe`, `--self`, `--disque` ou `--enVue` selon la commande.

### 4.2 Mana et sorts

Les options usuelles sont `--mana N`, `--rang N`, `--sortilege`, et les options de magie propres aux capacités. `--sansAO` indique qu’une action ne provoque pas l’attaque d’opportunité liée au fait de tirer ou d’incanter sous menace au contact.

### 4.3 Undo commun

`!cof-undo` est le point de retour commun. Les transactions CoFItem qui utilisent le pont Undo (distribution, déplacement/transfert d’inventaire, pause/récupération, repos, loot, etc.) sont enregistrées pour pouvoir être annulées avec la même commande.

## 5. COFantasy — utilisation courante

### 5.1 Combat

```text
!cof-init
!cof-attack @{selected|token_id} @{target|token_id} -1
!cof-liste-actions
!cof-tour-suivant
!cof-fin-combat
!cof-undo
```

Une attaque utilise les données de l’attaque de la fiche : score, critique, dégâts, portée, type, options et prédicats. Les attaques à distance sont reconnues par leur portée ; les sortilèges par leur type/options.

### 5.2 Menace et attaques d’opportunité

Une AO de contact utilise uniquement **l’arme principale actuellement équipée**. Si aucune arme n’est équipée, une attaque naturelle disponible peut être utilisée. Pas d’AO avec la main gauche, avec une arme à distance équipée, en étant désarmé, ou lorsque la menace est bloquée par les états ou la géométrie prévue. L’état **Volant** (`cof-afly`) empêche les AO de contact concernées.

Les AO peuvent être provoquées par un déplacement normal qui quitte une menace, par une attaque à distance réalisée sous menace ou par un sort non-contact lancé sous menace. Le tir ou le sort se résout normalement puis les AO encore valides sont proposées. `--sansAO` exempte l’action.

### 5.3 États, statut et ressources

```text
!cof-statut
!cof-statut-ressources
!cof-set-state ...
!cof-doctor
!cof-doctor --repair
```

Le statut synthétise les états et effets. Le Doctor sert au MJ pour détecter les incohérences de ressources et de liens de barres.

### 5.4 Test collectif et Défi

`!cof-test-collectif` et `!cof-defi` ouvrent des assistants de configuration dans le chat. Les PJ principaux de **Equipe PJ** sont proposés par défaut ; les participants et les tests autorisés peuvent être modifiés par boutons. Le DD reste côté MJ.

Les 26 compétences disponibles sont regroupées par caractéristique :

- **FOR** : Athlétisme, Puissance, Protection
- **DEX** : Acrobaties, Discrétion, Adresse
- **CON** : Endurance, Résistance, Sang-froid, Récupération
- **INT** : Arcanes, Histoire, Religion, Nature, Investigation, Technique
- **SAG** : Perception, Perspicacité, Survie, Médecine, Instinct
- **CHA** : Persuasion, Intimidation, Supercherie, Représentation, Commandement

### 5.5 Zones et pièges

1. Placer le token du piège sur le **calque MJ**.
2. Le sélectionner puis lancer `!cof-zone`.
3. Configurer Déclencheur, Cibles, Zone d’effet, Test/DD, Utilisations et Effets.
4. Activer le piège.

La surface de déclenchement correspond à l’**emprise réelle orientée du token du piège**. La taille et la rotation du token mobile sont prises en compte : un grand token déclenche dès qu’une partie de son emprise pénètre réellement dans la zone. Entrée, Sortie et Traversée sont distinguées.

L’assistant permet d’ajouter des dégâts et états sans écrire de commande. Les commandes COFantasy brutes restent disponibles dans la partie avancée pour les effets particuliers.

### 5.6 Téléportation

```text
!cof-teleportation TOKEN_ID [PORTÉE] [--fx EFFET] [--fxDepart EFFET] [--fxArrivee EFFET]
```

La téléportation ne provoque pas d’AO, n’active pas les zones du trajet et traite uniquement l’arrivée.

### 5.7 Invocations génériques

Les modèles sont des fiches dont le nom commence par `[INVOC]` et qui possèdent un token par défaut.

```text
!cof-invocations
!cof-invoquer @{selected|token_id} Nom du modèle [options]
!cof-renvoyer-invocation [TOKEN_ID]
```

Options importantes : `--quantite`, `--duree`, `--dureeCombat`, `--initiative`, `--sansInitiative`, `--hostile`, `--placement adjacent|surplace|libre|cible`, `--mana`, `--sortilege`, `--rang`, `--sansAO` et limites de ressources compatibles.

## 6. CoFItem — catalogue, objets et affixes

### 6.1 Entrée principale

```text
!coi-objets
!coi-catalogue
!coi-affix-index
```

`!coi-objets` affiche les fiches OBJET présentes. `!coi-catalogue` permet de parcourir ou rechercher les bases d’objets et d’ouvrir les hébergements. `!coi-affix-index` donne une vue du catalogue d’affixes par type et famille.

### 6.1.1 Affinités et anti-familles dans le catalogue

Pour les nouvelles armes, choisir les **affinités actuelles** et les **traitements anti-famille** décrits aux sections 3.7 et 3.8. Les anciens affixes fondés sur froid, électrique, acide, sonique, nécrotique, radiant, arcane, poison ou maladie ne constituent plus le vocabulaire de création courant ; leur lecture reste assurée par COFantasy lorsque nécessaire pour la compatibilité.

Les matériaux n’infèrent jamais une propriété cachée : un matériau d’affinité donne l’affinité explicitement prévue ; un traitement anti-famille donne uniquement son effet anti-famille ; un matériau utilitaire conserve uniquement son effet propre.

### 6.2 Créer et personnaliser un objet

```text
!coi-new --name ?{Nom|Nouvel objet}
!coi-new-conso --name ?{Nom|Nouvelle potion}
!coi-new-hebergement --name ?{Nom|Auberge}
```

La méthode recommandée reste le **Catalogue** : créer la fiche depuis une base, ouvrir **Affixes**, choisir les propriétés compatibles, puis ajuster la fiche OBJET si nécessaire. Les affixes peuvent générer des prédicats, options d’arme, effets, commandes ou actions d’objet.

### 6.3 Donner et équiper

Depuis les cartes CoFItem, **Donner** utilise `!coi-give --item … --target …`, **Donner + équiper** ajoute `--equip`, et les consommables acceptent `--qty N`. `!coi-give-all-pj` distribue un consommable à chaque PJ principal détecté dans **Equipe PJ**. Lorsqu’un emplacement d’équipement est déjà occupé, CoFItem peut proposer le remplacement via ses boutons internes.

### 6.4 Consommables

Un consommable possède un texte lisible et une **Commande COFantasy à l’utilisation**. Lorsqu’il est utilisé, CoFItem décrémente la pile et exécute la commande COFantasy correspondante. Les rations peuvent être identifiées pour les fonctions de repos.

## 7. CoFItem — pause, repos et hébergements

### 7.1 Pause de 5 minutes

```text
!coi-pause
```

La commande représente la décision collective de faire une pause. Chaque personnage du groupe peut choisir individuellement de dépenser **1 PR** pour effectuer sa récupération de PV ; ceux qui ne récupèrent pas conservent leur PR. Mana, rations et buffs de repos ne sont pas modifiés par cette pause.

### 7.2 Repos de groupe

```text
!coi-repos
```

L’assistant permet de gérer bivouac, rations, chasse, hébergement, paiement et récupération. Il utilise le groupe détecté via **Equipe PJ**. Les étapes techniques `!coi-rest-*` et `!coi-hunt-*` sont normalement déclenchées par les boutons de l’assistant.

### 7.3 Hébergements

Les fiches OBJET de catégorie **Hébergement** stockent coût, monnaie, tarification, repas compris, récupération PV/PM/PR et éventuellement un buff jusqu’au prochain repos. Elles sont accessibles avec `!coi-hebergements` et peuvent être utilisées directement dans le flux de repos.

## 8. CoFItem — butin et loot

### 8.1 Partage simple de monnaie

```text
!coi-butin
!coi-butin 120 PA
```

Le partage simple cible les PJ principaux de **Equipe PJ** et exclut les familiers du partage de monnaie.

### 8.2 Loot attaché aux tokens

```text
!coi-loot
!coi-loot-help
```

Le système peut lire des blocs `[LOOT]` dans les GM Notes des tokens, afficher le contenu au MJ/joueurs, distribuer objets et monnaie, ajouter des lignes manuelles, archiver ce qui a été pris et réinitialiser un loot si nécessaire.

## 9. Exemples de chaînes fiche → script

### Une arme magique

```text
Fiche OBJET (CoFItem)
  → base Épée longue
  → affixe ajouté
  → prédicats/options générés
  → objet donné et équipé au PJ
  → attaque visible sur la fiche du PJ
  → !cof-attack lit l’arme en main et ses options
```

### Une potion

```text
Fiche OBJET consommable
  → Commande COFantasy : !cof-soin 1d8
  → CoFItem donne la potion au PJ
  → ceinture ou sac
  → Utiliser
  → quantité -1
  → COFantasy applique le soin
  → !cof-undo peut annuler l’opération compatible
```

### Un hébergement

```text
Fiche OBJET Hébergement
  → coût / repas / récupérations / buff
  → !coi-repos
  → choix de l’hébergement
  → paiement
  → récupération du groupe
  → éventuel prédicat de buff appliqué jusqu’au prochain repos
```

## 10. Référence pratique des commandes et options COFantasy

Cette partie remplace l’ancienne lecture « index brut ». L’idée est de partir d’une commande utile, puis de voir ses options par famille. Les options ci-dessous sont celles que le script courant reconnaît ; les alias purement internes et les options extrêmement spécialisées restent dans l’index technique à la fin.

### 10.1 `!cof-attack` — syntaxe générale

```text
!cof-attack ATTAQUANT_ID CIBLE_ID [LABEL_OU_NOM] [options]
```

Avec la fiche, `-1` désigne l’arme principale en main et `-2` la main gauche. Dans une **liste d’actions** de la fiche, la forme `#Attaque ...` appelle le même moteur en réutilisant automatiquement le personnage actif.

#### Définir ou modifier l’attaque

| Option | Effet |
|---|---|
| `--nom TEXTE` | Nom affiché pour l’attaque. |
| `--toucher N` | Remplace le bonus de base de l’attaque. Les macros peuvent utiliser `@{ATKCAC}`, `@{ATKTIR}` ou `@{ATKMAG}`. |
| `--crit N` | Seuil de critique, borné par le moteur. |
| `--dm EXPR` | Dégâts de base (`1d8+2`, `2d6`, etc.). |
| `--portee N` | Portée en mètres. Une portée non nulle fait traiter l’action comme une attaque à distance. |
| `--special TEXTE` | Texte spécial affiché avec l’attaque. |
| `--bonusAttaque N` | Ajoute un bonus ou malus au jet d’attaque. |
| `--bonusCritique N` | Élargit la plage de critique. |
| `--modifiePortee N` | Ajoute N mètres à la portée. |
| `--divisePortee N` | Divise la portée de base avant les autres modifications. |
| `--allonge N` | Ajoute une allonge à une attaque de contact. |
| `--seulementContact` / `--seulementDistance` | Interdit l’utilisation si la cible n’est pas dans le bon mode de distance. |

#### Dés, réussite et dégâts

| Option | Effet |
|---|---|
| `--avantage` / `--m2d20` | Ajoute un dé et garde le meilleur ; plusieurs niveaux se cumulent. |
| `--desavantage` | Ajoute un dé et garde le moins bon ; annule d’abord un avantage éventuel. |
| `--avecd12` | Utilise un d12 au lieu du d20. |
| `--avecd12crit` | Comme `--avecd12`, avec adaptation de la plage de critique. |
| `--auto` | L’attaque réussit automatiquement ; utile pour les sorts/effets sans jet d’attaque. |
| `--demiAuto` | En cas d’échec, les sauvegardes partielles sont considérées réussies : pratique pour les effets qui font au moins la moitié des dégâts. |
| `--pasDeDmg` | Aucun dégât de base ; utile pour les attaques qui ne servent qu’à appliquer un état/effet. |
| `--tempDmg` | Dégâts temporaires. |
| `--plus EXPR` | Ajoute une composante de dégâts. |
| `--plusCrit EXPR` | Ajoute des dégâts seulement sur critique. |
| `--dmSiRate EXPR` | Inflige une valeur spécifique même si l’attaque rate. |
| `--toucheDoubleDmg` | Dégâts normaux sur échec et dégâts doublés sur réussite ; à ne pas combiner avec les autres modes d’échec. |
| `--maxDmg` | Maximise les dés de dégâts de base. |
| `--diviseDmg N` | Divise les dégâts de base. |
| `--incrDmgCoef N` | Augmente le coefficient des dégâts de base. |
| `--incrCritCoef N` | Augmente le coefficient critique. |
| `--reroll1` | Relance les 1 sur les dés de dégâts de base. |
| `--explodeMax` | Les valeurs maximales des dés de dégâts de base explosent. |
| `--vampirise [POURCENT]` | Soigne l’attaquant d’une part des dégâts infligés ; sans argument, 100 %. |
| `--draineMana EXPR` | Retire de la mana à la cible si l’attaque touche. |

#### Types de dégâts, magie et résistances

| Option | Effet |
|---|---|
| `--tranchant` / `--percant` / `--contondant` | Types physiques de l’arme, utilisés notamment par les RD. |
| `--feu` / `--eau` / `--air` / `--terre` | Affinités élémentaires classiques. Le type se rapporte au dernier bloc de dégâts concerné. |
| `--ombre` / `--lumiere` | Affinités planaires liées respectivement à l’Ombre et à la Lumière. |
| `--force` | Énergie magique brute sans affinité planaire. COFantasy la traite comme magique, mais elle reste distincte de la propriété générale `--magique`. |
| `--toxique` | Type particulier pour les dégâts toxiques. |
| `--psychique` | Type particulier pour les dégâts psychiques et active la logique d’attaque mentale. |
| `--drain` | Type particulier de drain, conservé séparément. |
| `--magique [N]` | Marque la source comme magique ; N peut préciser le niveau de magie. Ce n’est pas une affinité. |
| `--beni` | Marque la source comme bénie/sainte pour les résistances correspondantes. |
| `--spectral` | Permet de toucher les créatures intangibles. |
| `--ignoreRD [N]` | Sans argument, ignore toute la RD ; avec N, ignore jusqu’à N points. |
| `--ignoreMoitieRD` | Ignore la moitié de la RD. |
| `--adamantium`, `--ferFroid`, `--metal` | Propriétés spécifiques encore utilisées par différentes résistances/capacités ; elles ne définissent pas l’affinité des dégâts. |

Pour les anciennes macros seulement, COFantasy accepte encore `--froid`, `--electrique`, `--sonique`, `--acide`, `--necrotique`, `--radiant`, `--arcane`, `--energie`, `--poison`, `--maladie` et `--mental`, puis les interprète selon la table de compatibilité de la section 3.6.

#### Sauvegardes, états et effets

| Option | Effet |
|---|---|
| `--psave CARAC DD [options]` | Sauvegarde partielle : sur réussite, dégâts divisés par 2. Une double caractéristique (`FORDEX`) choisit la meilleure. |
| `--saveDM CARAC DD` | Sauvegarde qui annule les dégâts. |
| `--save CARAC DD [demiDuree]` | Sauvegarde appliquée au dernier état/effet ajouté. |
| `--saveParTour CARAC DD` | Nouvelle sauvegarde en fin de tour. |
| `--saveActifParTour CARAC DD` | Ajoute un bouton permettant au joueur de faire la sauvegarde à son tour. |
| `--saveParJour CARAC DD` | Sauvegarde renouvelée à la fin de chaque jour. |
| `--etat ETAT [CARAC DD]` | Applique un état sur touche ; certains états peuvent recevoir leur propre test de sortie. |
| `--finEtat ETAT` | Retire un état. |
| `--effet EFFET [DUREE]` | Applique un effet temporaire à la cible. |
| `--finEffet EFFET` | Retire un effet temporaire. |
| `--valeur ...` | Donne une valeur au dernier effet configuré. |
| `--optionEffet OPTION ...` | Ajoute une option au dernier effet. |
| `--peur DD DUREE` | Ajoute un effet de peur avec test de résistance. |
| `--affaiblirCarac CARAC N` | Diminue une caractéristique ; `random` sélectionne aléatoirement. |
| `--enflamme` | Enflamme la cible et applique les dégâts périodiques gérés par COFantasy. |
| `--malediction` | Applique la malédiction gérée par le moteur. |

#### Ressources, sorts et limites

| Option | Effet |
|---|---|
| `--sortilege` | Indique qu’il s’agit d’un sortilège et active les interactions magiques du moteur. |
| `--sansAO` | Cette action ne provoque pas l’AO liée au tir ou à l’incantation sous menace. |
| `--mana N` | Coût en PM ; même `--mana 0` identifie l’action comme liée à un lanceur de magie pour certaines gestions. |
| `--rang N` | Rang de la capacité/sort, utilisé par plusieurs mécaniques de mana. |
| `--magieRapide [N]` | Traite l’action comme une magie rapide et ajuste le coût selon la configuration. |
| `--tempeteDeMana ...` | Active les options de Tempête de Mana (intensité, durée, portée, rapide, altruiste…). |
| `--magieEnArmure [mana|N]` | Applique la gestion de magie en armure ; le mode `mana` transforme la gêne en coût supplémentaire lorsque prévu. |
| `--puissant [oui|non|duree|portee|EFFET]` | Active les variantes de magie/attaque puissante ; `portee` augmente la portée, `duree` la durée selon la capacité. |
| `--limiteParJour N [RESSOURCE]` | Nombre maximal d’utilisations par jour ; une ressource nommée peut être partagée entre plusieurs capacités. |
| `--limiteParCombat [N] [RESSOURCE]` | Même principe, réinitialisé par combat. |
| `--limiteParTour [N] [RESSOURCE]` | Même principe, réinitialisé par tour. |
| `--tempsRecharge EFFET DUREE` | Bloque l’action tant que l’effet de recharge est actif puis crée cet effet pour la durée indiquée. |
| `--decrAttribute NOM [N]` | Exige une ressource attribut positive puis la décrémente. |
| `--decrLimitePredicatParTour NOM` | Utilise la valeur d’un prédicat comme nombre maximal d’utilisations par tour. |
| `--munition LABEL` | Consomme les munitions associées au label. |
| `--retourneEnMain` | Une arme de jet revient immédiatement en main. |

#### Zones, cibles et mouvement

| Option | Effet |
|---|---|
| `--ligne` | Cible les créatures sur la ligne jusqu’à la portée de l’attaque. |
| `--disque R` | Zone circulaire de rayon R autour du token ciblé. |
| `--cone [ANGLE]` | Cône depuis l’attaquant ; angle par défaut géré par le moteur. |
| `--explosion` | Transforme l’attaque en explosion/disque basé sur sa portée. |
| `--target TOKEN_ID` | Ajoute explicitement une cible supplémentaire. |
| `--saufAllies` | Exclut les alliés de la sélection/zone. |
| `--dmCible EXPR` | Dans une AOE, remplace les dégâts spécifiquement pour la cible principale. |
| `--ciblesDansDisque R` | Impose que les différentes cibles soient regroupées dans un disque de rayon R. |
| `--ricochets N` | Autorise N ricochets avec l’arme de jet. |
| `--canaliseParFamilier` | Utilise le familier comme point d’origine lorsque la capacité le prévoit. |
| `--deplaceDe MAX` / `--deplaceDe MIN MAX [saut]` | Autorise un déplacement préalable pour arriver à portée ; le mouvement spécial ne provoque pas d’AO. |
| `--terrainDifficile DUREE [NOM] [IMAGE]` | Une AOE en disque crée une zone de terrain difficile temporaire. |

#### Conditions et branches

Les blocs conditionnels permettent d’éviter de dupliquer les attaques :

```text
--if CONDITION
  ... options appliquées si vrai ...
--else
  ... options alternatives ...
--endif
```

| Condition | Usage |
|---|---|
| `--si CONDITION` | Conditionne l’utilisation de l’attaque elle-même. |
| `--if CONDITION ... --endif` | Conditionne seulement un bloc d’options. |
| `--ifSaveFails CARAC DD ... --else ... --endif` | Branche selon le résultat d’une sauvegarde. |
| `etat ETAT` / `etatCible ETAT` | Teste un état sur l’attaquant ou la cible. |
| `attribut NOM VALEUR` / `attributCible ...` | Teste un attribut. |
| `predicatCible PREDICAT [VALEUR]` | Teste un prédicat de la cible. |
| `typeCible TYPE` | Teste la catégorie/race de la cible. |
| `deAttaque N`, `touche`, `critique`, `echecCritique` | Teste le résultat de l’attaque. |
| `premiereAttaque` | Teste si c’est la première attaque du combat. |

#### Présentation et média

| Option | Effet |
|---|---|
| `--fx EFFET` | FX directionnel de l’attaquant vers la cible. |
| `--targetFx EFFET` | FX joué directement sur la cible. |
| `--message TEXTE` | Ajoute un message dans la carte de résolution. |
| `--secret` | Réduit la visibilité de l’action aux personnes concernées et au MJ. |
| `--soundAttack... SON` | Sons généraux ou spécifiques au résultat (succès, critique, échec…). |
| `--imgAttack... IMAGE` | Images générales ou spécifiques au résultat. |

#### Options tactiques spécialisées

| Option | Effet |
|---|---|
| `--attaqueAssuree` | Bonus d’attaque avec dégâts réduits et critique neutralisé selon la règle intégrée. |
| `--attaqueRisquee` | Bonus offensif au prix d’un malus temporaire de DEF. |
| `--attaqueDeGroupe N` | Résolution d’une attaque menée par plusieurs créatures. |
| `--attaqueAcrobatique [N]` | Test d’acrobatie puis dégâts de type sournoise en cas de réussite. |
| `--feinte` | Prépare une attaque ultérieure contre la même cible. |
| `--tirDouble [LABEL]` | Effectue un second tir, éventuellement avec une autre attaque. |
| `--tirDeBarrage` | Mode de barrage spécialisé géré par le script. |
| `--semonce` | Mode de semonce spécialisé. |
| `--grenaille` | Mode de tir en cône pour les armes compatibles. |
| `--arcComposite N` | Ajoute la FOR aux dégâts jusqu’à N et applique le malus prévu si la FOR est insuffisante. |
| `--aussiArmeDeJet LABEL` | Associe une version de jet à une arme normalement utilisée au contact. |
| `--affute` | Améliore critique et dégâts critiques selon la règle intégrée. |
| `--vicieux` | Ajoute des dégâts en infligeant aussi un contrecoup à l’attaquant. |
| `--pietine` / `--percute` | Résolutions de choc avec opposition, renversement et effets de projection. |
| `--peutAgripper` | Autorise l’agrippement via l’attaque. |
| `--ouvertureMortelle` | Résolution spéciale de coup automatique/critique et interaction avec la sournoise. |

### 10.2 `!cof-effet`, `!cof-effet-temp` et `!cof-effet-combat`

```text
!cof-effet EFFET [oui|non] [options]
!cof-effet-temp EFFET DUREE [options]
!cof-effet-combat EFFET [options]
```

Les trois commandes partagent une grande partie des options génériques. `DUREE` peut être un nombre, une expression Roll20 ou `fin`/`0` pour terminer certains effets temporaires.

| Option | Usage |
|---|---|
| `--lanceur TOKEN_ID` | Identifie explicitement la source de l’effet. |
| `--target TOKEN_ID` | Ajoute une cible précise. |
| `--self`, `--allies`, `--alliesEnVue`, `--equipe NOM`, `--enVue` | Méthodes de sélection de groupe lorsque la commande les accepte. |
| `--portee [TOKEN_ID] N` | Limite les cibles à portée du lanceur ou du token indiqué. |
| `--mana N`, `--rang N`, `--magieRapide`, `--tempeteDeMana`, `--magieEnArmure` | Gestion des ressources et règles de magie. |
| `--limiteParJour`, `--limiteParCombat`, `--limiteParTour`, `--tempsRecharge` | Limites d’utilisation. |
| `--save`, `--saveParTour`, `--saveActifParTour` | Sauvegardes liées à l’effet. |
| `--valeur ...`, `--optionEffet ...`, `--accumuleDuree` | Paramétrage avancé de l’effet. |
| `--fx`, `--targetFx`, `--message`, `--messageMJ`, `--image`, `--son` | Présentation. |
| `--dose NOM`, `--decrAttribute NOM [N]`, `--depensePR [N] [PV]` | Ressources génériques. |
| `--degainer LABEL` | Peut faire dégainer une arme dans le contexte d’une capacité. |
| `--sansAO` | Empêche cette action magique de provoquer l’AO d’incantation sous menace. |

### 10.3 `!cof-jet` — tests et compétences

```text
!cof-jet CARAC [DD] [options]
```

| Option | Effet |
|---|---|
| `--bonus N` | Bonus numérique au test. |
| `--attribut NOM` | Ajoute la valeur d’un attribut ; peut être répété. |
| `--predicat NOM` | Ajoute la valeur d’un prédicat ; peut être répété. |
| `--nom TEXTE` | Nom affiché et recherche d’une compétence/prédicat du même nom. |
| `--competences` | Propose le choix d’une compétence compatible avec la caractéristique. |
| `--secret` | Résultat privé aux personnes concernées / MJ. |
| `--plageEchecCritique N` | Étend la plage d’échec critique. |
| `--succes TEXTE` | Message affiché en cas de réussite lorsque le DD est défini. |

Exemple :
```text
!cof-jet SAG 18 --predicat controleLoupGarou --nom Résister --succes évite de se transformer
```

### 10.4 Téléportation et invocation

**Téléportation**
```text
!cof-teleportation TOKEN_ID [PORTÉE] [--fx FX] [--fxDepart FX] [--fxArrivee FX]
```
`--fx` applique le même FX au départ et à l’arrivée ; les deux options spécialisées permettent de les différencier. Une portée de `0` signifie que la commande n’impose pas de limite de distance. La téléportation ne provoque pas d’AO de déplacement et ne traite que les zones d’arrivée.

**Invocation générique**
```text
!cof-invoquer TOKEN_ID "Nom du modèle" [options]
```

| Option | Effet |
|---|---|
| `--quantite N` | Crée de 1 à 20 exemplaires. |
| `--duree N` | Durée en tours. |
| `--dureeCombat` | Persiste jusqu’à la fin du combat. |
| `--initiative` / `--sansInitiative` | Force ou empêche l’ajout au tracker selon le contexte. |
| `--hostile` | Ne crée pas la relation d’allié avec l’invocateur. |
| `--placement adjacent` | Cherche une case libre adjacente. |
| `--placement surplace` | Crée sur la position de l’invocateur. |
| `--placement libre PORTÉE` | Crée puis arme un placement libre dans la portée. |
| `--placement cible TOKEN_ID` | Crée sur le token ciblé. |
| `--nom TEXTE` | Nom personnalisé de l’invocation. |
| `--mana N`, `--sortilege`, `--rang N`, `--magieEnArmure` | Intègre l’invocation au système de ressources magiques. |
| `--limiteParJour/Combat/Tour`, `--tempsRecharge` | Limites de capacité avant la création. |
| `--sansAO` | Le lancement ne provoque pas d’AO d’incantation. |

## 11. Livre de recettes — exemples de capacités

Ces recettes sont volontairement variées. Certaines reprennent des usages déjà documentés dans l’ancien manuel, d’autres sont des exemples techniques construits uniquement avec des options reconnues par les scripts. Elles servent surtout à montrer **comment combiner la fiche, les listes d’actions, COFantasy et CoFItem**.

### 11.1 Charge brutale

**Montre :** Déplacement spécial + attaque + bonus + dégâts supplémentaires.

```text
#Attaque -1 --deplaceDe 5 20 --bonusAttaque 2 --plus 1d6
```

À placer dans une liste d’actions. Le moteur déplace l’attaquant pour atteindre la cible puis résout l’attaque.

### 11.2 Flèche enflammée

**Montre :** Attaque magique à distance + dégâts feu + FX + effet périodique + mana.

```text
#Attaque Flèche enflammée --toucher [[@{selected|ATKMAG}]] --dm 1d6+[[@{selected|INT}]] --portee 30 --sortilege --feu --enflamme --fx beam-fire --mana 1 --rang 2
```

Montre une attaque complètement décrite par options plutôt qu’une ligne d’arme complexe.

### 11.3 Boule de feu

**Montre :** Attaque automatique + disque + sauvegarde partielle + FX de cible.

```text
#Attaque Boule de feu --toucher [[@{selected|ATKMAG}]] --dm 4d6+[[@{selected|INT}]] --feu --magique --portee 30 --sortilege --demiAuto --disque 6 --psave DEX [[10+@{selected|INT}]] --targetFx explode-fire --mana 2 --rang 4
```

Exemple de gros sort de zone. Sous menace au contact il provoque une AO, sauf ajout explicite de `--sansAO`.

### 11.4 Cône de froid

**Montre :** Cône d’affinité Eau + sauvegarde conditionnelle + ralenti ou dégâts divisés.

```text
#Attaque Cône de froid --toucher [[@{selected|ATKMAG}]] --auto --dm 2d6+[[@{selected|INT}]] --eau --portee 20 --sortilege --cone 30 --fx breath-frost --ifSaveFails CON 13 --effet ralentiTemp 1 --else --diviseDmg 2 --endif
```

Montre les branches `--ifSaveFails / --else / --endif`.

### 11.5 Foudre traversante

**Montre :** Ligne + sauvegarde partielle + affinité Air (l’effet RP est un éclair).

```text
#Attaque Foudre --toucher [[@{selected|ATKMAG}]] --dm 4d6+[[@{selected|CHA}]] --portee 10 --sortilege --air --psave DEX [[12+@{selected|DEX}]] --ligne --fx beam-holy --mana 2
```

La même commande peut toucher plusieurs tokens alignés.

### 11.6 Onde de choc

**Montre :** AOE centrée sur la cible + renversement sauvegardable + alliés exclus.

```text
#Attaque Onde de choc --toucher [[@{selected|ATKMAG}]] --auto --dm 2d6 --contondant --portee 20 --sortilege --disque 3 --saufAllies --etat renverse --save FOR 15 --targetFx explode-smoke
```

Exemple technique : les dégâts restent automatiques, tandis que le dernier état reçoit sa sauvegarde.

### 11.7 Frappe consacrée

**Montre :** Bonus conditionnel contre une catégorie de cible + affinité Lumière.

```text
#Attaque -1 --if typeCible mort-vivant --plus 2d6 --lumiere --endif
```

Montre comment enrichir une attaque existante sans créer une seconde arme.

### 11.8 Bénédiction de groupe

**Montre :** Effet temporaire sur alliés visibles + soi.

```text
!cof-effet-temp benediction [[3+@{selected|SAG}]] --alliesEnVue --self --mana 0
```

Exemple de sélection de groupe sans jet d’attaque.

### 11.9 Arme enflammée

**Montre :** Effet temporaire sur une cible précise avec lanceur, portée et mana.

```text
!cof-effet-temp armeEnflammee [[5+@{selected|INT}]] --lanceur @{selected|token_id} --target @{target|token_id} --portee 0 --mana 1
```

Montre le lien entre un effet, son lanceur et la cible.

### 11.10 Soins de groupe

**Montre :** Commande de soin spécialisée + mana.

```text
!cof-soin @{selected|token_id} groupe --mana 1
```

Utilise la relation d’alliés du script au lieu de cibler les personnages un par un.

### 11.11 Pouvoir limité

**Montre :** Limite par combat + recharge de plusieurs tours.

```text
#Attaque Onde solaire --toucher [[@{selected|ATKMAG}]] --dm 3d6 --lumiere --portee 20 --sortilege --limiteParCombat 1 ondeSolaire --tempsRecharge rechargeGen(OndeSolaire) 2
```

Montre deux systèmes de ressources différents ; en pratique on choisit l’un ou l’autre selon la capacité à modéliser.

### 11.12 Invocation sur une cible

**Montre :** Invocation générique + placement cible + coût de sort + durée de combat.

```text
!cof-invoquer @{selected|token_id} "Gardiens Invoquées" --placement cible @{target|token_id} --mana 3 --sortilege --rang 3 --dureeCombat
```

Le modèle doit être une fiche `[INVOC] Gardiens Invoquées` avec token par défaut. Ajouter `--sansAO` si la capacité est explicitement conçue pour ne pas provoquer d’AO.

### 11.13 Pas dimensionnel

**Montre :** Téléportation avec limite et FX distincts.

```text
!cof-teleportation @{selected|token_id} 20 --fxDepart smoke --fxArrivee magic
```

Après la commande, le joueur déplace son token vers la destination.

### 11.14 Résister à une transformation

**Montre :** Test de caractéristique + prédicat + message de réussite.

```text
!cof-jet SAG 18 --predicat controleLoupGarou --nom Résister --succes évite de se transformer
```

Montre que `!cof-jet` peut assembler caractéristique, compétence/prédicat et narration.

### 11.15 Potion de soin

**Montre :** Fiche OBJET consommable → commande COFantasy.

```text
!cof-soin 1d8
```

Dans le champ **Commande COFantasy à l’utilisation** de la fiche OBJET. CoFItem résout le porteur/cible et décrémente la ressource lors de l’utilisation.

### 11.16 Piège de flammes

**Montre :** Assistant Zone/Piège + effets simples + commande avancée.

```text
Échec : 2d6 feu + Renversé` puis, si besoin, `!cof-set-state ...` en commande avancée
```

Ici la bonne pratique est de configurer les dégâts/états avec l’assistant ; les commandes brutes servent seulement pour les cas qui sortent des effets proposés.

### Comment choisir où écrire la capacité ?

| Si la capacité… | Emplacement conseillé |
|---|---|
| modifie toujours le personnage | Prédicat de la fiche |
| ne vaut que lorsque l’arme est portée | Prédicat / options de l’arme |
| est une attaque alternative | Liste d’actions avec `#Attaque` |
| applique un buff/debuff sans attaque | `!cof-effet*` |
| est un simple test | `!cof-jet` |
| est portée par un objet magique | Action d’une fiche OBJET CoFItem |
| est consommable | Fiche OBJET consommable + commande COFantasy |
| est une invocation | Modèle `[INVOC]` + `!cof-invoquer` |
| est un piège/zone de scène | Assistant `!cof-zone` |

## 12. CoFItem — syntaxes et options utiles

| Commande / syntaxe | Usage |
|---|---|
| `!coi-objets` | Ouvre le compendium des fiches OBJET. |
| `!coi-catalogue [--cat CAT] [--search TEXTE] [--page N]` | Parcourt le catalogue. `CAT` : armes, armures, accessoires, consommables, divers. |
| `!coi-affix-index [--cat CAT] [--section S] [--family F] [--group G] [--search TEXTE] [--page N]` | Explore les affixes par catégorie/famille/groupe ou recherche. |
| `!coi-affixes --item CHARACTER_ID [--page N] [--family F] [--group G] [--search TEXTE]` | Ouvre les affixes compatibles avec une fiche OBJET. |
| `!coi-quality --item ID --value 0..5` | Change la qualité +N d’une arme ou armure/bouclier et recalcule ses données. |
| `!coi-new --name NOM` | Crée une fiche OBJET vide. |
| `!coi-new-conso --name NOM` | Crée un consommable vide. |
| `!coi-from-base --id BASE_ID` | Crée une fiche depuis une base du catalogue. |
| `!coi-show --character CHARACTER_ID` | Affiche la carte d’un objet. |
| `!coi-give --item ITEM_ID --target CHARACTER_ID [--equip] [--qty N]` | Donne l’objet au PJ ; `--equip` équipe si possible, `--qty` sert surtout aux consommables. |
| `!coi-give-all-pj --item ITEM_ID [--qty N]` | Distribue le consommable à tous les PJ principaux du groupe. |
| `!coi-use-conso --target TOKEN_ID --attr ATTR_ID` | Commande normalement appelée par le bouton du consommable ; décrémente la pile et lance l’effet COFantasy. |
| `!coi-import --cat all --confirm yes` | Importe les bases du catalogue. |
| `!coi-refresh-bases --confirm yes` | Actualise les fiches importées et reconstruit les données dérivées. |
| `!coi-butin [MONTANT] [PP|PO|PA|PC]` | Partage la monnaie entre les PJ principaux. Ex. `!coi-butin 120 PA`. |
| `!coi-prmax --value N --character ID` | Règle le maximum de PR d’un personnage. |
| `!coi-prmax --value N --all` | Règle le maximum de PR pour le groupe géré par CoFItem. |
| `!coi-pause` | Pause de 5 minutes avec choix individuel de dépense de PR. |
| `!coi-repos` | Assistant de repos long du groupe. |
| `!coi-hebergements` | Bibliothèque des hébergements. |
| `!coi-new-hebergement --name NOM [--preset PRESET]` | Crée une fiche d’hébergement. |
| `!coi-loot` | Affiche le loot des tokens sélectionnés. |
| `!coi-loot-add --text TEXTE` | Ajoute une ligne de loot au token sélectionné. |
| `!coi-loot-clear` | Vide le loot spécifique sélectionné. |
| `!coi-loot-reset` | Réinitialise les loots/sessions des tokens sélectionnés. |
| `!coi-loot-help` | Affiche le format `[LOOT]` et les commandes de gestion. |

### Fiche OBJET : où les scripts se rejoignent

La fiche OBJET fournit directement **Afficher**, **Affixes** et **Catalogue**. Elle stocke aussi les prédicats générés/manuels et les commandes d’action. Une commande personnalisée d’action est prioritaire sur la commande générée ; un consommable possède son propre champ **Commande COFantasy à l’utilisation**. Cela permet à CoFItem de préparer l’objet et à COFantasy de résoudre l’effet en jeu.

## 13. Aide rapide — commandes à connaître

### COFantasy
- `!cof-attack` — Attaque et moteur d’options principal.
- `!cof-jet` — Tests de caractéristiques/compétences.
- `!cof-effet`, `!cof-effet-temp`, `!cof-effet-combat` — Buffs, debuffs et effets.
- `!cof-soin` — Soins.
- `!cof-init` / `!cof-tour-suivant` / `!cof-fin-combat` — Combat et initiative.
- `!cof-statut` / `!cof-statut-ressources` — Diagnostic du personnage.
- `!cof-doctor` — Audit/réparation des données.
- `!cof-zone` / `!cof-zones` — Pièges et zones.
- `!cof-test-collectif` / `!cof-defi` — Assistants de groupe.
- `!cof-teleportation` — Téléportation contrôlée.
- `!cof-invocations` / `!cof-invoquer` — Invocations génériques.
- `!cof-undo` — Annule le dernier événement compatible.

### CoFItem
- `!coi-objets` / `!coi-catalogue` — Compendium et catalogue.
- `!coi-affix-index` / `!coi-affixes` — Affixes.
- `!coi-give` / `!coi-give-all-pj` — Distribution.
- `!coi-pause` / `!coi-repos` — Récupération et repos.
- `!coi-hebergements` — Hébergements.
- `!coi-butin` — Partage de monnaie.
- `!coi-loot` / `!coi-loot-help` — Loot de tokens.

## 14. Annexe technique — index exhaustif des commandes

Cet index sert surtout au diagnostic, à la maintenance et aux macros avancées. Pour apprendre à utiliser les scripts, il vaut mieux passer par les sections **Référence des options** et **Livre de recettes** ci-dessus.

### 14.1 COFantasy

| Commande | Famille | Type |
|---|---|---|
| `!cof-a-couvert` | Combat | Spécialisée |
| `!cof-absorber-au-bouclier` | Capacités / sorts | Spécialisée |
| `!cof-absorber-coup-au-bouclier` | Capacités / sorts | Spécialisée |
| `!cof-absorber-sort-au-bouclier` | Capacités / sorts | Spécialisée |
| `!cof-action-defensive` | Capacités / sorts | Spécialisée |
| `!cof-affaiblir-carac` | Capacités / sorts | Spécialisée |
| `!cof-agrandir-page` | Capacités / sorts | Spécialisée |
| `!cof-agripper-de-demon` | Capacités / sorts | Spécialisée |
| `!cof-aile-forge-runique` | Capacités / sorts | Spécialisée |
| `!cof-animation-des-objets` | Capacités / sorts | Spécialisée |
| `!cof-animer-arbre` | Capacités / sorts | Spécialisée |
| `!cof-animer-cadavre` | Capacités / sorts | Spécialisée |
| `!cof-animer-mort` | Capacités / sorts | Spécialisée |
| `!cof-appliquer-manoeuvre` | Combat | Spécialisée |
| `!cof-arme-secrete` | Capacités / sorts | Spécialisée |
| `!cof-armure-magique` | Capacités / sorts | Spécialisée |
| `!cof-arreter-statistiques` | Administration | Spécialisée |
| `!cof-as` | Capacités / sorts | Spécialisée |
| `!cof-attack` | Combat | Commande principale |
| `!cof-attack-line` | Combat | Spécialisée |
| `!cof-attack-line-from` | Combat | Spécialisée |
| `!cof-attaque-a-outrance` | Combat | Spécialisée |
| `!cof-attaque-magique` | Combat | Spécialisée |
| `!cof-attaque-magique-contre-pv` | Combat | Spécialisée |
| `!cof-attaque-opportunite` | Combat | Interface / bouton |
| `!cof-attaque-opportunite-ignorer` | Combat | Interface / bouton |
| `!cof-attendre` | Capacités / sorts | Spécialisée |
| `!cof-blessure-markers` | Soins / ressources | Spécialisée |
| `!cof-blessure-recap` | Soins / ressources | Spécialisée |
| `!cof-blessure-reset` | Soins / ressources | Spécialisée |
| `!cof-boire-alcool` | Capacités / sorts | Spécialisée |
| `!cof-bonus-couvert` | Combat | Spécialisée |
| `!cof-bouger` | Capacités / sorts | Spécialisée |
| `!cof-bourse` | Capacités / sorts | Spécialisée |
| `!cof-bouton-chance` | Capacités / sorts | Interface / bouton |
| `!cof-bouton-echec-total` | Capacités / sorts | Interface / bouton |
| `!cof-bouton-petit-veinard` | Capacités / sorts | Interface / bouton |
| `!cof-bouton-pousser-kiai` | Capacités / sorts | Interface / bouton |
| `!cof-bouton-rune-energie` | Capacités / sorts | Interface / bouton |
| `!cof-bouton-rune-puissance` | Capacités / sorts | Interface / bouton |
| `!cof-buf-def` | Capacités / sorts | Spécialisée |
| `!cof-canaliser` | Capacités / sorts | Spécialisée |
| `!cof-capitaine` | Capacités / sorts | Spécialisée |
| `!cof-centrer-sur-token` | Capacités / sorts | Spécialisée |
| `!cof-cercle-protection` | Capacités / sorts | Spécialisée |
| `!cof-chair-a-canon` | Capacités / sorts | Spécialisée |
| `!cof-changer-de-forme` | Capacités / sorts | Spécialisée |
| `!cof-charge-fantastique` | Capacités / sorts | Spécialisée |
| `!cof-clean-global-state` | États / données | Spécialisée |
| `!cof-confirmer-attaque` | Combat | Interface / bouton |
| `!cof-conjuration-armee` | Capacités / sorts | Spécialisée |
| `!cof-conjuration-de-predateur` | Capacités / sorts | Spécialisée |
| `!cof-consommables` | Capacités / sorts | Spécialisée |
| `!cof-consommer-baie` | Capacités / sorts | Spécialisée |
| `!cof-corde-jumelle` | Capacités / sorts | Spécialisée |
| `!cof-creer-baies` | Capacités / sorts | Spécialisée |
| `!cof-creer-elixir` | Capacités / sorts | Spécialisée |
| `!cof-creer-rune` | Capacités / sorts | Spécialisée |
| `!cof-defaut-dans-la-cuirasse` | Capacités / sorts | Spécialisée |
| `!cof-defense-armee-des-morts` | Capacités / sorts | Spécialisée |
| `!cof-defi` | Exploration / scènes | Commande principale |
| `!cof-defi-afficher` | Exploration / scènes | Interface / bouton |
| `!cof-defi-duelliste` | Exploration / scènes | Interface / bouton |
| `!cof-defi-samourai` | Exploration / scènes | Interface / bouton |
| `!cof-defi-supprimer` | Exploration / scènes | Interface / bouton |
| `!cof-defi-test` | Exploration / scènes | Interface / bouton |
| `!cof-degainer` | Combat | Spécialisée |
| `!cof-delivrance` | Capacités / sorts | Spécialisée |
| `!cof-demarrer-statistiques` | Administration | Spécialisée |
| `!cof-desaouler` | Capacités / sorts | Spécialisée |
| `!cof-desarmer` | Capacités / sorts | Spécialisée |
| `!cof-destruction-des-morts-vivants` | Capacités / sorts | Spécialisée |
| `!cof-devier-les-coups` | Capacités / sorts | Spécialisée |
| `!cof-distribuer-baies` | Capacités / sorts | Spécialisée |
| `!cof-division-vase` | Lumière / vision | Spécialisée |
| `!cof-dmg` | Combat | Spécialisée |
| `!cof-doctor` | États / données | Commande principale |
| `!cof-echange-consommable` | Capacités / sorts | Spécialisée |
| `!cof-echange-init` | Capacités / sorts | Spécialisée |
| `!cof-echapper-enveloppement` | Capacités / sorts | Spécialisée |
| `!cof-effet` | États / données | Commande principale |
| `!cof-effet-chaque-d20` | États / données | Spécialisée |
| `!cof-effet-combat` | Combat | Commande principale |
| `!cof-effet-temp` | États / données | Commande principale |
| `!cof-elixirs` | Capacités / sorts | Spécialisée |
| `!cof-en-selle` | Capacités / sorts | Spécialisée |
| `!cof-encaisser-un-coup` | Capacités / sorts | Spécialisée |
| `!cof-enduire-poison` | Capacités / sorts | Spécialisée |
| `!cof-enkystement-lointain` | Capacités / sorts | Spécialisée |
| `!cof-enveloppement` | Capacités / sorts | Spécialisée |
| `!cof-escalier` | Capacités / sorts | Spécialisée |
| `!cof-esquive-acrobatique` | Combat | Spécialisée |
| `!cof-esquive-de-la-magie` | Combat | Spécialisée |
| `!cof-esquive-fatale` | Combat | Spécialisée |
| `!cof-esquive-magistrale` | Combat | Spécialisée |
| `!cof-eteindre-lumiere` | Lumière / vision | Spécialisée |
| `!cof-exemplaire` | Capacités / sorts | Spécialisée |
| `!cof-expert-combat` | Combat | Spécialisée |
| `!cof-expert-combat-bousculer` | Combat | Spécialisée |
| `!cof-expert-combat-def` | Combat | Spécialisée |
| `!cof-expert-combat-dm` | Combat | Spécialisée |
| `!cof-expert-combat-touche` | Combat | Spécialisée |
| `!cof-explosion` | Capacités / sorts | Spécialisée |
| `!cof-fin-changement-de-forme` | Capacités / sorts | Spécialisée |
| `!cof-fin-classe-effet` | États / données | Spécialisée |
| `!cof-fin-combat` | Combat | Commande principale |
| `!cof-fin-reaction-violente` | Capacités / sorts | Spécialisée |
| `!cof-fiole-de-lumiere` | Lumière / vision | Spécialisée |
| `!cof-fortifiant` | Capacités / sorts | Spécialisée |
| `!cof-foudre-du-temps` | Capacités / sorts | Spécialisée |
| `!cof-gerer-runes-mortes` | Capacités / sorts | Spécialisée |
| `!cof-guerir` | Soins / ressources | Spécialisée |
| `!cof-guerison` | Soins / ressources | Spécialisée |
| `!cof-hors-combat` | Combat | Spécialisée |
| `!cof-huile-instable` | Capacités / sorts | Spécialisée |
| `!cof-ignorer-la-douleur` | Capacités / sorts | Spécialisée |
| `!cof-immunite-guerisseur` | Soins / ressources | Spécialisée |
| `!cof-init` | Combat | Commande principale |
| `!cof-injonction` | Capacités / sorts | Spécialisée |
| `!cof-injonction-mortelle` | Capacités / sorts | Spécialisée |
| `!cof-intercepter` | Combat | Spécialisée |
| `!cof-interposer` | Capacités / sorts | Spécialisée |
| `!cof-intervention-divine` | Capacités / sorts | Spécialisée |
| `!cof-invocations` | Exploration / scènes | Commande principale |
| `!cof-invoquer` | Exploration / scènes | Commande principale |
| `!cof-invoquer-demon` | Capacités / sorts | Spécialisée |
| `!cof-jet` | Capacités / sorts | Commande principale |
| `!cof-jet-confusion` | Capacités / sorts | Spécialisée |
| `!cof-jouer-son` | Capacités / sorts | Spécialisée |
| `!cof-lancer-sort` | Capacités / sorts | Spécialisée |
| `!cof-liberer-agrippe` | Capacités / sorts | Spécialisée |
| `!cof-liberer-ecrase` | Capacités / sorts | Spécialisée |
| `!cof-liste-actions` | Capacités / sorts | Spécialisée |
| `!cof-lumiere` | Lumière / vision | Spécialisée |
| `!cof-manoeuvre` | Combat | Spécialisée |
| `!cof-mettre-a-zero-pv` | Capacités / sorts | Spécialisée |
| `!cof-mettre-casque` | Capacités / sorts | Spécialisée |
| `!cof-mission-cancel` | Capacités / sorts | Spécialisée |
| `!cof-mission-config` | Capacités / sorts | Spécialisée |
| `!cof-mission-launch` | Capacités / sorts | Spécialisée |
| `!cof-mission-participant-toggle` | Capacités / sorts | Spécialisée |
| `!cof-mission-participants` | Capacités / sorts | Spécialisée |
| `!cof-mission-show` | Capacités / sorts | Spécialisée |
| `!cof-mission-test-toggle` | Capacités / sorts | Spécialisée |
| `!cof-mission-tests` | Capacités / sorts | Spécialisée |
| `!cof-mission-tests-all` | Capacités / sorts | Spécialisée |
| `!cof-montrer-resultats-attaque` | Combat | Spécialisée |
| `!cof-montrer-resultats-jet` | Capacités / sorts | Spécialisée |
| `!cof-mot-de-pouvoir-immobilise` | Capacités / sorts | Spécialisée |
| `!cof-multi-cartes` | Capacités / sorts | Spécialisée |
| `!cof-multi-command` | Capacités / sorts | Spécialisée |
| `!cof-mur-de-force` | Capacités / sorts | Spécialisée |
| `!cof-nature-nourriciere` | Capacités / sorts | Spécialisée |
| `!cof-next-charge-fantastique` | Capacités / sorts | Spécialisée |
| `!cof-nouveau-jour` | Capacités / sorts | Spécialisée |
| `!cof-observation` | Capacités / sorts | Spécialisée |
| `!cof-ombre-mortelle` | Capacités / sorts | Spécialisée |
| `!cof-ombre-mouvante` | Capacités / sorts | Spécialisée |
| `!cof-open-door` | Capacités / sorts | Spécialisée |
| `!cof-options` | Administration | Commande principale |
| `!cof-options-d-attaque` | Combat | Spécialisée |
| `!cof-pacte-sanglant` | Capacités / sorts | Spécialisée |
| `!cof-pacte-sanglant-def` | Capacités / sorts | Spécialisée |
| `!cof-parade-au-bouclier` | Combat | Spécialisée |
| `!cof-parade-magistrale` | Combat | Spécialisée |
| `!cof-parade-projectiles` | Combat | Spécialisée |
| `!cof-pathfinder1` | Administration | Spécialisée |
| `!cof-pause` | Capacités / sorts | Spécialisée |
| `!cof-pause-statistiques` | Administration | Spécialisée |
| `!cof-petit-veinard` | Capacités / sorts | Spécialisée |
| `!cof-peur` | Capacités / sorts | Spécialisée |
| `!cof-poser-bombe` | Capacités / sorts | Spécialisée |
| `!cof-posture-de-combat` | Combat | Spécialisée |
| `!cof-prescience` | Capacités / sorts | Spécialisée |
| `!cof-proteger-un-allie` | Capacités / sorts | Spécialisée |
| `!cof-prouesse` | Capacités / sorts | Spécialisée |
| `!cof-provocation` | Capacités / sorts | Spécialisée |
| `!cof-rage-du-berserk` | Capacités / sorts | Spécialisée |
| `!cof-recharger` | Combat | Spécialisée |
| `!cof-recuperation` | Soins / ressources | Spécialisée |
| `!cof-recupere-mana` | Soins / ressources | Spécialisée |
| `!cof-remove-buf-def` | Capacités / sorts | Spécialisée |
| `!cof-renvoyer-invocation` | Exploration / scènes | Commande principale |
| `!cof-resister-a-la-magie` | Capacités / sorts | Spécialisée |
| `!cof-resultat-jet` | Capacités / sorts | Spécialisée |
| `!cof-retour-boomerang` | Capacités / sorts | Spécialisée |
| `!cof-reveler-nom` | Capacités / sorts | Spécialisée |
| `!cof-riposte-defi` | Combat | Spécialisée |
| `!cof-rune-energie` | Capacités / sorts | Spécialisée |
| `!cof-rune-protection` | Capacités / sorts | Spécialisée |
| `!cof-rune-puissance` | Capacités / sorts | Spécialisée |
| `!cof-runes` | Capacités / sorts | Spécialisée |
| `!cof-save-effet` | États / données | Spécialisée |
| `!cof-save-state` | États / données | Spécialisée |
| `!cof-sentir-la-corruption` | Capacités / sorts | Spécialisée |
| `!cof-set-attribute` | États / données | Spécialisée |
| `!cof-set-macros` | Administration | Commande principale |
| `!cof-set-predicate` | États / données | Spécialisée |
| `!cof-set-state` | États / données | Spécialisée |
| `!cof-skip-attack` | Combat | Interface / bouton |
| `!cof-soigner-affaiblissement` | Capacités / sorts | Spécialisée |
| `!cof-soin` | Soins / ressources | Commande principale |
| `!cof-soins` | Soins / ressources | Spécialisée |
| `!cof-sommeil` | Capacités / sorts | Spécialisée |
| `!cof-sphere-de-feu` | Capacités / sorts | Spécialisée |
| `!cof-stabiliser-blessure` | Soins / ressources | Spécialisée |
| `!cof-statistiques` | Administration | Spécialisée |
| `!cof-statut` | États / données | Commande principale |
| `!cof-statut-ressources` | États / données | Commande principale |
| `!cof-strangulation` | Capacités / sorts | Spécialisée |
| `!cof-suivre` | Capacités / sorts | Spécialisée |
| `!cof-surprise` | Capacités / sorts | Spécialisée |
| `!cof-teleportation` | Exploration / scènes | Commande principale |
| `!cof-teleportation-annuler` | Capacités / sorts | Interface / bouton |
| `!cof-tempete-de-mana` | Soins / ressources | Spécialisée |
| `!cof-tenebres` | Lumière / vision | Spécialisée |
| `!cof-tenebres-magiques` | Lumière / vision | Spécialisée |
| `!cof-test-attaque-opposee` | Combat | Spécialisée |
| `!cof-test-collectif` | Exploration / scènes | Commande principale |
| `!cof-test-collectif-afficher` | Exploration / scènes | Interface / bouton |
| `!cof-test-collectif-roll` | Exploration / scènes | Interface / bouton |
| `!cof-test-mort` | Soins / ressources | Spécialisée |
| `!cof-torche` | Lumière / vision | Spécialisée |
| `!cof-tour-de-force` | Capacités / sorts | Spécialisée |
| `!cof-tour-force` | Capacités / sorts | Spécialisée |
| `!cof-tour-suivant` | Combat | Commande principale |
| `!cof-tp-auto` | Capacités / sorts | Spécialisée |
| `!cof-transe-guerison` | Soins / ressources | Spécialisée |
| `!cof-tueur-fantasmagorique` | Capacités / sorts | Spécialisée |
| `!cof-undo` | Combat | Commande principale |
| `!cof-usure-off` | Capacités / sorts | Spécialisée |
| `!cof-utilise-consommable` | Capacités / sorts | Spécialisée |
| `!cof-vapeurs-ethyliques` | Capacités / sorts | Spécialisée |
| `!cof-vision-nocturne` | Lumière / vision | Spécialisée |
| `!cof-zone` | Exploration / scènes | Commande principale |
| `!cof-zone-activer` | Exploration / scènes | Interface / bouton |
| `!cof-zone-annuler` | Exploration / scènes | Interface / bouton |
| `!cof-zone-commande` | Exploration / scènes | Interface / bouton |
| `!cof-zone-config` | Exploration / scènes | Interface / bouton |
| `!cof-zone-de-vie` | Exploration / scènes | Interface / bouton |
| `!cof-zone-effet-add` | Exploration / scènes | Interface / bouton |
| `!cof-zone-effet-del` | Exploration / scènes | Interface / bouton |
| `!cof-zone-effets` | Exploration / scènes | Interface / bouton |
| `!cof-zone-info` | Exploration / scènes | Interface / bouton |
| `!cof-zone-modifier` | Exploration / scènes | Interface / bouton |
| `!cof-zone-reset` | Exploration / scènes | Interface / bouton |
| `!cof-zone-supprimer` | Exploration / scènes | Interface / bouton |
| `!cof-zone-test` | Exploration / scènes | Interface / bouton |
| `!cof-zone-wizard` | Exploration / scènes | Interface / bouton |
| `!cof-zones` | Exploration / scènes | Commande principale |

### 14.2 CoFItem

| Commande | Type |
|---|---|
| `!coi-affix-add` | Interface / bouton ou spécialisée |
| `!coi-affix-detail` | Interface / bouton ou spécialisée |
| `!coi-affix-index` | Commande principale |
| `!coi-affix-mode` | Interface / bouton ou spécialisée |
| `!coi-affix-name` | Interface / bouton ou spécialisée |
| `!coi-affix-remove` | Interface / bouton ou spécialisée |
| `!coi-affixes` | Commande principale |
| `!coi-butin` | Commande principale |
| `!coi-catalogue` | Commande principale |
| `!coi-delete-conso` | Interface / bouton ou spécialisée |
| `!coi-equip-choice` | Interface / bouton ou spécialisée |
| `!coi-equipe` | Interface / bouton ou spécialisée |
| `!coi-from-base` | Commande principale |
| `!coi-give` | Commande principale |
| `!coi-give-all-pj` | Commande principale |
| `!coi-hebergement-show` | Interface / bouton ou spécialisée |
| `!coi-hebergements` | Commande principale |
| `!coi-hunt-env` | Interface / bouton ou spécialisée |
| `!coi-hunt-run` | Interface / bouton ou spécialisée |
| `!coi-hunt-set` | Interface / bouton ou spécialisée |
| `!coi-hunt-toggle` | Interface / bouton ou spécialisée |
| `!coi-import` | Interface / bouton ou spécialisée |
| `!coi-loot` | Commande principale |
| `!coi-loot-add` | Commande principale |
| `!coi-loot-clear` | Commande principale |
| `!coi-loot-details` | Interface / bouton ou spécialisée |
| `!coi-loot-give` | Interface / bouton ou spécialisée |
| `!coi-loot-give-item` | Interface / bouton ou spécialisée |
| `!coi-loot-help` | Commande principale |
| `!coi-loot-money` | Interface / bouton ou spécialisée |
| `!coi-loot-reset` | Commande principale |
| `!coi-loot-show` | Interface / bouton ou spécialisée |
| `!coi-loot-take` | Interface / bouton ou spécialisée |
| `!coi-loot-take-all` | Interface / bouton ou spécialisée |
| `!coi-new` | Commande principale |
| `!coi-new-conso` | Commande principale |
| `!coi-new-hebergement` | Commande principale |
| `!coi-objets` | Commande principale |
| `!coi-pause` | Commande principale |
| `!coi-prmax` | Commande principale |
| `!coi-quality` | Commande principale |
| `!coi-refresh-bases` | Interface / bouton ou spécialisée |
| `!coi-repos` | Commande principale |
| `!coi-rest-bivouac` | Interface / bouton ou spécialisée |
| `!coi-rest-camp-prepare` | Interface / bouton ou spécialisée |
| `!coi-rest-final` | Interface / bouton ou spécialisée |
| `!coi-rest-food-confirm` | Interface / bouton ou spécialisée |
| `!coi-rest-food-menu` | Interface / bouton ou spécialisée |
| `!coi-rest-food-toggle` | Interface / bouton ou spécialisée |
| `!coi-rest-hunt-confirm` | Interface / bouton ou spécialisée |
| `!coi-rest-lodging` | Interface / bouton ou spécialisée |
| `!coi-rest-lodging-direct` | Interface / bouton ou spécialisée |
| `!coi-rest-lodging-food` | Interface / bouton ou spécialisée |
| `!coi-rest-lodgings` | Interface / bouton ou spécialisée |
| `!coi-rest-pay` | Interface / bouton ou spécialisée |
| `!coi-show` | Commande principale |
| `!coi-use-conso` | Interface / bouton ou spécialisée |

## 15. Dépannage

- **Une attaque ne réagit pas comme prévu** : vérifier d’abord le type d’attaque, la portée, les modificateurs, puis les options de la ligne d’attaque. Les options de la section 10 donnent l’ordre logique de contrôle.
- **Une capacité complexe devient illisible** : déplacer la partie permanente dans un prédicat, laisser seulement les options contextuelles dans la liste d’actions.
- **Un sort de zone touche mal les cibles** : vérifier `--ligne`, `--cone`, `--disque`, `--saufAllies` et la portée avant d’ajouter des conditions.
- **Un objet n’applique pas son effet** : ouvrir sa fiche OBJET et contrôler la commande générée, la commande personnalisée, les prédicats générés et le champ du consommable.
- **Un groupe inclut les mauvaises fiches** : vérifier le handout `Equipe PJ` et utiliser `!coi-equipe`.
- **Une ressource est incohérente** : `!cof-doctor`, puis `!cof-doctor --repair` uniquement après lecture du diagnostic.
- **Retour arrière** : `!cof-undo` pour les opérations couvertes par l’historique commun.

> Règle de conception : **la fiche décrit le personnage**, **CoFItem construit et transporte les objets**, **COFantasy résout les règles**. Une bonne capacité répartit l’information au bon endroit plutôt que de tout mettre dans une seule macro.
