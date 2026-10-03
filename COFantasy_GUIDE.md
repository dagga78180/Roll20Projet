# COFantasy V2 — Guide de jeu et moteur de règles

COFantasy est le **moteur de règles** du pack. Son rôle n’est pas seulement de lancer des dés : il relie la fiche, les tokens, les états, les ressources, le tour de combat, les effets temporaires et les capacités pour que tous parlent le même langage.

Ce guide est pensé dans l’ordre d’une partie réelle : **préparer → entrer en combat → agir → subir des états/blessures → récupérer → diagnostiquer**.

## 1. Ce que COFantasy automatise — et pourquoi

Sur table, le MJ peut garder mentalement une durée, se souvenir qu’un personnage est à terre, vérifier qui menace qui et recalculer chaque modificateur. Sur Roll20, ces informations sont réparties entre fiches, tokens, macros et chat. COFantasy sert à **centraliser cette mémoire de règles**.

Le script automatise notamment :

- les jets et attaques ;
- la lecture des armes et prédicats de la fiche ;
- initiative et tours ;
- états et effets temporaires ;
- dégâts, résistances, soins et ressources ;
- blessures à 0 PV ;
- attaques d’opportunité ;
- zones, pièges et déplacements surveillés ;
- tests collectifs et défis ;
- téléportations et invocations ;
- historique et `!cof-undo`.

**Le script n’est pas le MJ.** Si la fiction rend une règle inapplicable, le MJ peut ignorer un bouton, retirer un état ou utiliser Undo.

---

## 2. Préparer correctement une fiche

### 2.1 Token et barres

Le token doit représenter une fiche de personnage. La convention attendue est :

- **barre 1 : PV** ;
- **barre 2 : PM** lorsqu’ils sont utilisés, sinon la configuration historique de dommages temporaires ;
- **barre 3 : modificateur temporaire d’attaque**.

Éviter de créer des attributs « presque identiques » à ceux de la fiche : COFantasy et CoFItem modifient les attributs officiels.

### 2.2 Diagnostic initial

```text
!cof-doctor
!cof-statut
!cof-statut-ressources
!cof-options
```

`!cof-doctor` recherche les incohérences. `--repair` est un outil de réparation, pas une commande à lancer systématiquement sans lire le diagnostic.

### 2.3 Macros

```text
!cof-set-macros
```

Cette commande crée/actualise les macros principales. Elle permet aux joueurs d’utiliser le système via des boutons plutôt que de mémoriser les commandes techniques.

---

## 3. Comprendre le tour de combat

Le flux normal est :

1. le MJ démarre l’initiative ;
2. le personnage actif choisit une action de fiche ou une commande ;
3. COFantasy vérifie les états/effets/prédicats qui peuvent empêcher ou modifier l’action ;
4. l’action est résolue ;
5. les effets de tour, zones, blessures et ressources sont mis à jour ;
6. le tour passe au suivant.

Commandes centrales :

```text
!cof-init
!cof-liste-actions
!cof-attack @{selected|token_id} @{target|token_id} -1
!cof-tour-suivant
!cof-fin-combat
!cof-undo
```

`-1` signifie **arme principale actuellement en main**. `-2` désigne la main gauche dans les contextes qui la supportent.

### Pourquoi l’initiative compte pour le moteur

Plusieurs règles ont besoin de savoir si un combat est actif : attaques d’opportunité, durée « jusqu’au prochain tour », certaines réactions, saignements de blessure, effets de combat et retrait d’un personnage stabilisé du tracker. Lancer une scène tactique sans initiative peut donc volontairement désactiver certaines automatisations.

---

## 4. États : ce qu’ils veulent dire en jeu

Un **état** n’est pas seulement un marqueur visuel. Il sert de donnée de règles : COFantasy peut interdire une action, appliquer un malus, modifier la DEF ou empêcher une attaque d’opportunité.

Commande manuelle :

```text
!cof-set-state ETAT true --target TOKEN_ID
!cof-set-state ETAT false --target TOKEN_ID
```

La fiche, les capacités et les boutons utilisent généralement ces commandes automatiquement.

### 4.1 États refondus de la V2

| État | Conséquence utilisée par COFantasy | Intention de jeu |
|---|---|---|
| **Aveuglé** | -20 % aux attaques au contact ; impossible d’attaquer une cible à plus de 3 cases. | La perception visuelle devient le facteur limitant. |
| **Étourdi** | Passe son prochain tour. | Représente une perte d’action complète mais courte. |
| **Paralysé** | Aucun déplacement ni action physique ; parole/réflexion/capacités sans mouvement possibles ; DEF -20 %. | Distingue immobilité physique et capacités purement mentales. |
| **Immobilisé** | Aucun déplacement ; les autres actions restent possibles. | Bloque le mouvement sans « éteindre » le personnage. |
| **Entravé** | Déplacement ÷2 ; Sprint impossible. | Gêne forte mais non totale. |
| **Renversé** | DEF -20 % ; une action de mouvement est nécessaire pour se relever avant toute autre action. | Rend la chute tactiquement importante. |
| **Agrippé** | Ne peut pas s’éloigner de l’agrippeur ; peut agir ou tenter de se libérer. | Le lien entre deux adversaires est conservé sans supprimer toutes les actions. |
| **Désarmé** | L’arme tombe dans une case adjacente ; mouvement pour la récupérer ; une autre arme peut être utilisée. | Rend le choix d’équipement pertinent. |
| **Débordé** | Aucune attaque d’opportunité. | Le personnage est trop occupé pour contrôler sa zone. |
| **Provoqué** | Désavantage aux attaques visant une autre entité que le provocateur mémorisé. | Matérialise une « aggro » tactique sans forcer le joueur. |
| **Effrayé** | Le mouvement sert à s’éloigner de la source à Déplacement ÷2 ; les autres actions restent possibles. | La peur force le positionnement mais n’annule pas toute décision. |
| **Charmé** | Mouvement vers le charmeur à Déplacement ÷2 ; désavantage aux actions hostiles contre lui. | Conserve une marge d’action tout en représentant l’influence. |
| **Confus** | Début du tour : 1d6. 1–2 perd le mouvement ; 3–4 perd l’action principale ; 5–6 agit normalement. | État imprévisible mais jouable. |
| **Silencieux** | Aucun sort nécessitant une incantation. | Rend le silence utile sans bloquer les actions non verbales. |
| **Sommeil** | Ne peut ni agir ni se déplacer ; réveil par dégâts ou action d’une entité adjacente. | Sommeil comme contrôle, pas comme mort. |
| **Surpris** | Premier round : n’agit pas et DEF -20 %. | Rend l’embuscade significative au premier round. |
| **Exposé** | Subit +20 % de dégâts. | Vulnérabilité générique temporaire. |
| **Volant** | Ne peut pas être ciblé par une attaque au contact ; une attaque de contact effectuée par le volant le fait redescendre jusqu’au début de son prochain tour. | Gère l’altitude sans simulation 3D lourde. |
| **Affaibli** | Tous les tests subissent un malus de 1d6. | Malus générique simple à mémoriser. |

### 4.2 Mort, inconscience et états temporaires

`mort` est un état spécial historique. Dans la V2, les **PJ à 0 PV utilisent d’abord le système de blessures** décrit plus bas ; ils ne deviennent pas automatiquement « morts » comme un PNJ.

De nombreux états existent aussi sous forme temporaire (`...Temp`). Leur durée est gérée par le moteur et l’état permanent est retiré à la fin prévue. Ne dupliquez pas manuellement un état permanent et sa variante temporaire sauf si vous savez pourquoi.

### 4.3 Pourquoi les cartes d’état sont utiles

Lorsqu’un état est appliqué, le chat peut rappeler sa conséquence et proposer le retrait. C’est volontaire : le marqueur sur le token dit **« quelque chose est actif »**, la carte dit **« ce que cela change »**.

---

## 5. Blessures des PJ : le système complet

La V2 utilise un système de blessures persistant pour éviter que **0 PV = simple interrupteur on/off**. Tomber à 0 doit créer une conséquence qui continue d’exister après le soin.

### 5.1 Première chute à 0 PV

Quand un PJ tombe à 0 PV :

1. il devient **Inconscient** ;
2. une des huit familles de blessure est choisie si le personnage n’en avait pas déjà une ;
3. cette première blessure est **niveau 1 / bénigne** ;
4. les compteurs de survie commencent ;
5. le marqueur Blessé reste après le réveil tant que la blessure n’est pas remise à zéro.

Au niveau 1 :

- les **soins normaux peuvent relever** le personnage ;
- **3 réussites** aux tests de survie le relèvent à 1 PV ;
- **3 échecs** font passer la blessure au niveau 2 au lieu de tuer immédiatement.

### 5.2 Deuxième niveau / blessure maligne

Une nouvelle chute alors qu’une blessure existe fait passer la blessure au **niveau 2 / maligne**.

Au niveau 2 :

- les soins normaux **ne peuvent plus relever** le personnage à 0 PV ;
- **3 réussites** stabilisent à 1 PV ;
- un **Parchemin de stabilisation** stabilise immédiatement ;
- **3 échecs** entraînent la mort.

Un personnage stabilisé est mis à **1 PV, hors combat et invulnérable jusqu’à la fin du combat**. Le moteur refuse les soins supplémentaires pendant ce combat : la stabilisation n’est pas un moyen de revenir immédiatement dans la mêlée.

### 5.3 Test de survie

```text
!cof-test-mort TOKEN_ID
```

Le jet est :

```text
1d20 + modificateur de CON contre DD 10
```

Le compteur est affiché sous la forme `réussites/3 — échecs/3`.

### 5.4 Les huit blessures possibles

| Famille | Niveau 1 | Niveau 2 | Effet |
|---|---|---|---|
| Vitalité | Contusions multiples | Traumatisme interne | PV MAX limités à 75 % / 50 %. |
| Attaque | Élongation musculaire | Déchirure musculaire | Attaque -25 % / -50 %. |
| Mobilité | Entorse | Fracture | Déplacement ÷2 / ÷3 et Sprint impossible au niveau 2. |
| Concentration | Commotion cérébrale | Traumatisme crânien | Capacités R4+ impossibles / capacités R2+ impossibles. |
| Défense | Côtes fêlées | Fractures costales | DEF -25 % / -50 %. |
| Initiative | Vertiges | Commotion sévère | Initiative -25 % / -50 %. |
| Dégâts | Contracture musculaire | Lésion musculaire sévère | Dégâts -25 % / -50 %. |
| Saignement | Plaie ouverte | Hémorragie sévère | 1 DV + 5 % PV MAX / tour ; 2 DV + 10 % PV MAX / tour, sans descendre sous 1 PV. |

### 5.5 Les chutes répétées deviennent plus dangereuses

Le nombre de chutes est mémorisé :

- 1re–2e chute : aucun échec initial ;
- 3e chute : commence avec **1 échec** ;
- 4e chute et suivantes : commence avec **2 échecs**.

Un coup qui ferait théoriquement descendre très bas sous 0 peut également coûter des **PR** : jusqu’à 1 PR vers -10 PV théoriques et 2 PR vers -20, dans la limite des PR disponibles. Le but est de distinguer une chute « juste à 0 » d’un choc extrêmement violent.

### 5.6 Quand une blessure disparaît-elle ?

La blessure persiste après le réveil : c’est précisément son intérêt. La V2 remet automatiquement ce suivi à zéro lors d’une **montée de niveau**. Le MJ peut aussi le faire manuellement :

```text
!cof-blessure-recap TOKEN_ID
!cof-blessure-reset ...
!cof-blessure-markers
!cof-stabiliser-blessure ...
```

`!cof-blessure-markers` vérifie les Token Markers personnalisés. Le système cherche notamment :

- `cof-blesse`
- `cof-inconscient` (et compatibilité avec l’ancienne faute `cof-inconsient`)
- `cof-stabilised`

Si ces markers ne sont pas installés dans la campagne, le moteur avertit le MJ.

### 5.7 Pourquoi ce système est séparé de « Mort »

Un PNJ à 0 PV peut être traité comme mort rapidement. Pour un PJ, la campagne a besoin d’un espace entre « debout » et « mort ». Les blessures créent cet espace : risque croissant, coût en ressources et séquelles mécaniques, sans transformer chaque 0 PV en décès immédiat.

---

## 6. Attaques d’opportunité : la règle tactique réellement appliquée

Le moteur d’AO vise à représenter le **contrôle de l’espace**. Un adversaire au contact n’est pas seulement « adjacent » : tant qu’il est capable d’attaquer, quitter sa zone ou ignorer sa menace peut avoir un coût.

### 6.1 Quand une AO est proposée

En combat, COFantasy peut créer une AO lorsqu’une cible :

- **quitte** normalement une zone de menace ;
- effectue une **attaque à distance** sous menace ;
- lance un **sort non-contact** sous menace.

Le joueur qui contrôle l’attaquant reçoit une carte : **Attaquer** ou **Ignorer**. Le script ne force pas l’AO : ne pas la prendre peut être un choix tactique.

### 6.2 Quelle attaque est utilisée ?

L’AO utilise :

1. l’**arme principale de contact en main** ;
2. à défaut, une **attaque naturelle** valide.

Pas d’AO avec :

- une arme principale à distance ;
- un sort ;
- la main gauche seule ;
- aucune attaque de contact disponible.

### 6.3 Quand un personnage ne peut pas faire d’AO

Le moteur bloque l’AO si l’attaquant est notamment :

- mort ou inactif ;
- Renversé ;
- Débordé ;
- Désarmé ;
- Volant ;
- Inconscient ;
- endormi.

Il doit aussi **percevoir** la cible : une cible invisible n’est normalement pas menacée, sauf détection appropriée (par exemple détection de l’invisible ou prédicat compatible).

Les murs/portes fermées sont pris en compte : la menace n’est pas censée traverser un obstacle bloquant le contact.

### 6.4 Combien d’AO ?

Par défaut : **1 attaque d’opportunité par round**.

Prédicats avancés :

```text
attaquesOpportunite:2
allongeOpportunite:2
pasAttaqueOpportunite
neProvoquePasAttaqueOpportunite
```

- `attaquesOpportunite:N` augmente la limite ;
- `allongeOpportunite:N` étend la zone ;
- `pasAttaqueOpportunite` empêche ce personnage d’en réaliser ;
- `neProvoquePasAttaqueOpportunite` sert à exempter certains déplacements/cas prévus par le moteur.

### 6.5 Déplacements qui ne provoquent pas

Une **téléportation** ne provoque pas d’AO et ne déclenche pas les zones traversées : seul le point d’arrivée compte. Les déplacements techniques internes sont également exclus lorsque le moteur les identifie comme tels.

Pour une capacité qui doit explicitement ignorer la menace :

```text
--sansAO
```

### 6.6 Pourquoi l’AO est un prompt et non une attaque automatique

Une réaction peut être une ressource tactique. L’automatiser sans demander empêcherait le joueur de conserver sa réaction pour une cible plus importante et rendrait certaines scènes difficiles à arbitrer. Le bouton rend la menace automatique, mais **la décision reste humaine**.

---

## 7. Attaques, dégâts et sauvegardes

### 7.1 Attaque depuis la fiche

```text
!cof-attack @{selected|token_id} @{target|token_id} -1
```

La ligne d’attaque fournit le toucher, critique, dégâts, portée, type, options et prédicats. Les options peuvent ensuite ajouter des dégâts, une sauvegarde, une zone ou un état.

### 7.2 Vocabulaire de dégâts V2

**Physiques :** Tranchant, Contondant, Perçant.  
**Affinités :** Feu, Eau, Air, Terre, Ombre, Lumière, Force.  
**Spéciaux :** Toxique, Psychique, Drain.

Les anciens mots-clés (`froid`, `électrique`, `acide`, `nécrotique`, `radiant`, `arcane`, etc.) restent lus pour compatibilité, mais ne doivent pas être utilisés pour de nouvelles capacités.

### 7.3 Exemples utiles

Attaque normale :

```text
!cof-attack @{selected|token_id} @{target|token_id} -1
```

Attaque avec dégâts supplémentaires :

```text
!cof-attack @{selected|token_id} @{target|token_id} -1 --plus 1d6 --feu
```

Sort de zone avec sauvegarde :

```text
!cof-attack @{selected|token_id} @{target|token_id} Boule de feu --toucher [[@{selected|ATKMAG}]] --dm 4d6+[[@{selected|INT}]] --feu --magique --portee 30 --sortilege --demiAuto --disque 6 --psave DEX [[10+@{selected|INT}]] --mana 2 --rang 4
```

État sur échec de sauvegarde :

```text
!cof-attack @{selected|token_id} @{target|token_id} Onde de choc --auto --dm 2d6 --contondant --disque 3 --saufAllies --etat renverse --save FOR 15
```

---

## 8. Effets, durées et ressources

Familles de commandes :

```text
!cof-effet
!cof-effet-temp
!cof-effet-combat
!cof-soin
```

- **effet** : modification persistante selon la commande ;
- **effet-temp** : effet avec durée gérée ;
- **effet-combat** : effet lié au combat en cours ;
- **soin** : passe par le moteur de soin, donc respecte les blessures et limites de PV.

Pourquoi passer par ces commandes plutôt que modifier les attributs à la main ? Parce que COFantasy enregistre alors la source, la durée, les messages, l’Undo et les interactions avec d’autres règles.

---

## 9. Prédicats : écrire une règle sur la fiche

Un prédicat est une petite déclaration lue par le moteur. Il permet d’ajouter une propriété sans coder une nouvelle fonction.

```text
volant
bonusAttaqueMagique:2
attaquesOpportunite:2
allongeOpportunite:1
```

Règles de saisie :

- un prédicat par ligne est le format le plus lisible ;
- `nom:valeur` pour les prédicats numériques ;
- `// commentaire` pour documenter la fiche ;
- ne pas inventer un nom : s’il n’est pas lu par le moteur, il ne fera rien.

La référence complète des prédicats effectivement rencontrés dans le moteur est intégrée aux sections 22 et 27 de cette page.

### Pourquoi les prédicats sont importants

Les affixes CoFItem, le Monster Creator et les capacités de classe peuvent tous produire des prédicats. Ils sont le **contrat commun** entre la donnée (« ce personnage a Allonge +1 ») et la règle (« l’AO doit avoir une zone plus grande »).

---

## 9A. Affinités, immunités, résistances, vulnérabilités et absorption — référence V2

C’est la partie à utiliser quand tu construis un monstre, un objet ou une capacité qui doit réagir à un **type de dégâts**. Ces prédicats se placent dans `predicats_script` (ou sont injectés par CoFItem/Monster Creator).

### 9A.1 Familles de prédicats de dégâts

| Forme | Effet moteur | Exemple |
|---|---|---|
| `immunite_<type>` | Les dégâts compatibles avec ce type sont annulés avant mitigation. | `immunite_feu` |
| `absorptionA_<type>` | Les dégâts compatibles sont absorbés : le moteur appelle le chemin de soin au lieu d’infliger les dégâts. | `absorptionA_ombre` |
| `resistanceA_<type>` | Ajoute un niveau de division. Une résistance seule fait typiquement `DM / 2`; plusieurs sources de division font `/3`, `/4`, etc. | `resistanceA_feu` |
| `diviseEffet_<type>` | Même logique de division que la résistance, utilisée par certaines capacités/effets. | `diviseEffet_elementaire` |
| `vulnerableA_<type>` | Multiplie les dégâts par **1,5**. | `vulnerableA_eau` |
| `faiblesseMajeureA_<type>` | Multiplie les dégâts par **2** et prend priorité sur `vulnerableA_<type>`. | `faiblesseMajeureA_lumiere` |
| `protectionDMZone_<type>` | Ajoute une division contre les dégâts de zone de ce type. | `protectionDMZone_feu` |
| `resistanceA_nonMagique` | Ajoute une division aux dégâts non magiques. | `resistanceA_nonMagique` |
| `immunite_nonMagique` | Annule les dégâts non magiques. | `immunite_nonMagique` |
| `immunite_magique` | Annule les dégâts considérés magiques. | `immunite_magique` |

**Exemple complet de créature de feu :**

```text
absorptionA_feu
resistanceA_terre
vulnerableA_eau
faiblesseMajeureA_froid
```

**Exemple physique :**

```text
resistanceA_tranchant
immunite_percant
vulnerableA_contondant
```

Le moteur teste également les types physiques ajoutés à une attaque (`--tranchant`, `--percant`, `--contondant`) même lorsque la composante principale a un autre type.

### 9A.2 Types V2 et alias historiques

| Domaine/Type conseillé | Alias historiques compris par le moteur |
|---|---|
| `feu` | — |
| `air` | `electrique`, `sonique` |
| `eau` | `froid` |
| `terre` | `acide` |
| `ombre` | `necrotique` |
| `lumiere` | `radiant` |
| `force` | `arcane`, `energie`, `magique` |
| `toxique` | `poison`, `maladie` |
| `psychique` | `mental` |
| `nature` | — |
| `drain` | — |
| `argent` | — |
| `tranchant` | physique |
| `percant` | physique |
| `contondant` | physique |

Les alias restent valides pour les anciennes macros. Pour les nouvelles créations, utiliser le vocabulaire V2 permet d’éviter les ambiguïtés.

### 9A.3 Ordre utile à connaître

Pour une composante de dégâts, le moteur vérifie notamment : immunités et cas spéciaux → absorption → divisions/résistances → faiblesse majeure ou vulnérabilité → résistances supplémentaires (non-magique, zone, éléments, capacités) → RD et dégâts finaux. Cette distinction explique pourquoi **absorption**, **immunité**, **résistance** et **vulnérabilité** ne sont pas interchangeables.

## 10. Tests, compétences et scènes hors combat

```text
!cof-jet
!cof-test-collectif
!cof-defi
```

Compétences par caractéristique :

- FOR : Athlétisme, Puissance, Protection
- DEX : Acrobaties, Discrétion, Adresse
- CON : Endurance, Résistance, Sang-froid, Récupération
- INT : Arcanes, Histoire, Religion, Nature, Investigation, Technique
- SAG : Perception, Perspicacité, Survie, Médecine, Instinct
- CHA : Persuasion, Intimidation, Supercherie, Représentation, Commandement

Un **test collectif** répond à « est-ce que le groupe réussit ensemble ? ». Un **Défi** sert plutôt à suivre plusieurs réussites/échecs dans une scène prolongée. Le script automatise les compteurs ; le MJ garde le choix du DD et de la conséquence fictionnelle.

---

## 11. Zones, pièges et mouvement

```text
!cof-zone
!cof-zones
```

Un piège peut être représenté par un token sur le calque MJ. Sa taille et sa rotation définissent réellement sa surface. Les modes Entrée/Sortie/Traversée servent à distinguer **ce qui déclenche** la zone.

Une téléportation :

```text
!cof-teleportation TOKEN_ID [PORTEE]
```

ne parcourt pas l’espace intermédiaire : pas d’AO sur le trajet et pas de zone traversée, uniquement les règles du point d’arrivée.

---

## 12. Invocations

Les modèles d’invocation sont des fiches dont le nom commence par `[INVOC]` et qui possèdent un token par défaut.

```text
!cof-invocations
!cof-invoquer @{selected|token_id} Nom du modèle
!cof-renvoyer-invocation TOKEN_ID
```

Le moteur peut gérer quantité, durée, initiative, hostilité, placement et coût en mana. L’intérêt est d’éviter de créer à la main des copies de token sans lien avec les règles.

---

## 12A. Classes et voies — automatisations spécifiques présentes dans le moteur

Cette section sert de **point d’entrée par classe**, comme dans une documentation de jeu : elle ne remplace pas les règles du livre, mais dit comment traduire les capacités dans COFantasy. Pour chaque classe, les prédicats listés sont ceux que le moteur sait lire et les commandes listées sont les points d’entrée dédiés. Une capacité qui n’a pas de commande dédiée se construit avec `!cof-attack`, `!cof-effet-temp`, `!cof-effet-combat`, `!cof-effet`, `!cof-soin`, les prédicats et la grammaire d’auteur des sections 13A, 18, 22 et 27.

**Méthode de création :** 1) chercher d’abord un prédicat passif ; 2) chercher une commande dédiée ci-dessous ; 3) sinon construire la capacité avec `!cof-attack`/effets ; 4) tester la ressource, la durée et les sauvegardes ; 5) ajouter une Ability/token-action Roll20.


### Arquebusier

**Prédicats/crochets utiles :** `poudre`, `tirDeBarrage`, `grenaille`, `boutefeu`, `poudrePuissante`, `asDeLaGachette`.


| Commande | Syntaxe de départ | Quand l’utiliser |
|---|---|---|
| `!cof-recharger` | `!cof-recharger <arg1>` | Commande dédiée gérée par `recharger` ; la fiche technique complète se trouve en section 27. |
| `!cof-poser-bombe` | `!cof-poser-bombe <arg1> <arg2> <arg3> <arg4> [arg5]` | Commande dédiée gérée par `poserBombe` ; la fiche technique complète se trouve en section 27. |
| `!cof-huile-instable` | `!cof-huile-instable <arg1>` | Commande dédiée gérée par `huileInstable` ; la fiche technique complète se trouve en section 27. |

Les prédicats sont préférables pour un bonus permanent ou contextuel : ils évitent de dupliquer la règle dans toutes les attaques. Pour une commande avec identifiant d’événement/session, utiliser le bouton généré par le moteur plutôt que fabriquer l’identifiant à la main.

### Barbare

**Prédicats/crochets utiles :** `peauDePierre`, `durACuire`, `peutEnrager`, `rageDuBerserkAmelioree`, `tourDeForce`.


| Commande | Syntaxe de départ | Quand l’utiliser |
|---|---|---|
| `!cof-rage-du-berserk` | `!cof-rage-du-berserk` | Commande dédiée gérée par `parseRageDuBerserk` ; la fiche technique complète se trouve en section 27. |
| `!cof-tour-de-force` | `!cof-tour-de-force [arg1]` | Commande dédiée gérée par `parseTourDeForce` ; la fiche technique complète se trouve en section 27. |
| `!cof-resister-a-la-magie` | `!cof-resister-a-la-magie` | Commande dédiée gérée par `resisterALaMagie` ; la fiche technique complète se trouve en section 27. |

Les prédicats sont préférables pour un bonus permanent ou contextuel : ils évitent de dupliquer la règle dans toutes les attaques. Pour une commande avec identifiant d’événement/session, utiliser le bouton généré par le moteur plutôt que fabriquer l’identifiant à la main.

### Barde

**Prédicats/crochets utiles :** `dentellesEtRapiere`, `hausserLeTon`, `chantDesHeros`.


| Commande | Syntaxe de départ | Quand l’utiliser |
|---|---|---|
| `!cof-arme-secrete` | `!cof-arme-secrete <arg1> <arg2>` | Commande dédiée gérée par `parseArmeSecrete` ; la fiche technique complète se trouve en section 27. |
| `!cof-provocation` | `!cof-provocation <arg1> <arg2> [arg3]` | Commande dédiée gérée par `parseProvocation` ; la fiche technique complète se trouve en section 27. |

Les prédicats sont préférables pour un bonus permanent ou contextuel : ils évitent de dupliquer la règle dans toutes les attaques. Pour une commande avec identifiant d’événement/session, utiliser le bouton généré par le moteur plutôt que fabriquer l’identifiant à la main.

### Chevalier

**Prédicats/crochets utiles :** `cavalierEmerite`, `monture`, `montureLoyale`, `exemplaire`, `voieDuMeneurDHomme`.


| Commande | Syntaxe de départ | Quand l’utiliser |
|---|---|---|
| `!cof-en-selle` | `!cof-en-selle <arg1> <arg2>` | Commande dédiée gérée par `enSelle` ; la fiche technique complète se trouve en section 27. |
| `!cof-proteger-un-allie` | `!cof-proteger-un-allie <arg1> <arg2>` | Commande dédiée gérée par `protegerUnAllie` ; la fiche technique complète se trouve en section 27. |
| `!cof-intercepter` | `!cof-intercepter <arg1> <arg2>` | Commande dédiée gérée par `intercepter` ; la fiche technique complète se trouve en section 27. |

Les prédicats sont préférables pour un bonus permanent ou contextuel : ils évitent de dupliquer la règle dans toutes les attaques. Pour une commande avec identifiant d’événement/session, utiliser le bouton généré par le moteur plutôt que fabriquer l’identifiant à la main.

### Druide

**Prédicats/crochets utiles :** `marcheSylvestre`, `natureNourriciereBaies`, `formeHybrideSuperieure`, `voieDesForets`, `voieDesVegetaux`.


| Commande | Syntaxe de départ | Quand l’utiliser |
|---|---|---|
| `!cof-creer-baies` | `!cof-creer-baies [arg1]` | Commande dédiée gérée par `creerBaies` ; la fiche technique complète se trouve en section 27. |
| `!cof-distribuer-baies` | `!cof-distribuer-baies` | Commande dédiée gérée par `distribuerBaies` ; la fiche technique complète se trouve en section 27. |
| `!cof-changer-de-forme` | `!cof-changer-de-forme <arg1>` | Commande dédiée gérée par `changerDeForme` ; la fiche technique complète se trouve en section 27. |

Les prédicats sont préférables pour un bonus permanent ou contextuel : ils évitent de dupliquer la règle dans toutes les attaques. Pour une commande avec identifiant d’événement/session, utiliser le bouton généré par le moteur plutôt que fabriquer l’identifiant à la main.

### Ensorceleur

**Prédicats/crochets utiles :** `magieEnArmure`, `critiqueEpiqueSorts`.


| Commande | Syntaxe de départ | Quand l’utiliser |
|---|---|---|
| `!cof-effet-temp` | `!cof-effet-temp <arg1> <arg2>` | Capacité de buff/debuff ou état sans attaque. |
| `!cof-attack` | `!cof-attack <arg1> <arg2>` | Capacité offensive générique : toucher, dégâts, types, états, saves, zones, ressources. |
| `!cof-soin` | `!cof-soin <arg1> [arg2] [arg3] [--plusSoinSiPredicat]` | Capacité de soin/récupération. |

Les prédicats sont préférables pour un bonus permanent ou contextuel : ils évitent de dupliquer la règle dans toutes les attaques. Pour une commande avec identifiant d’événement/session, utiliser le bouton généré par le moteur plutôt que fabriquer l’identifiant à la main.

### Forgesort

**Prédicats/crochets utiles :** `voieDesRunes`, `voieDesElixirs`, `batonDesRunesMortes`, `runeDePuissance`.


| Commande | Syntaxe de départ | Quand l’utiliser |
|---|---|---|
| `!cof-runes` | `!cof-runes` | Commande dédiée gérée par `gestionRunes` ; la fiche technique complète se trouve en section 27. |
| `!cof-creer-rune` | `!cof-creer-rune <arg1> <arg2> <arg3> <arg4>` | Commande dédiée gérée par `creerRune` ; la fiche technique complète se trouve en section 27. |
| `!cof-elixirs` | `!cof-elixirs [--feu]` | Commande dédiée gérée par `gestionElixir` ; la fiche technique complète se trouve en section 27. |
| `!cof-creer-elixir` | `!cof-creer-elixir <arg1> <arg2> [--feu]` | Commande dédiée gérée par `creerElixir` ; la fiche technique complète se trouve en section 27. |
| `!cof-animation-des-objets` | `!cof-animation-des-objets <arg1> <arg2> [arg3]` | Commande dédiée gérée par `animationDesObjets` ; la fiche technique complète se trouve en section 27. |

Les prédicats sont préférables pour un bonus permanent ou contextuel : ils évitent de dupliquer la règle dans toutes les attaques. Pour une commande avec identifiant d’événement/session, utiliser le bouton généré par le moteur plutôt que fabriquer l’identifiant à la main.

### Guerrier

**Prédicats/crochets utiles :** `voieDuSoldat`, `specialisationGuerrier`, `scienceDuCritique`, `armureLourdeGuerrier`, `expertDuCombat`, `combatEnPhalange`, `prouesse`, `durACuire`.


| Commande | Syntaxe de départ | Quand l’utiliser |
|---|---|---|
| `!cof-proteger-un-allie` | `!cof-proteger-un-allie <arg1> <arg2>` | Commande dédiée gérée par `protegerUnAllie` ; la fiche technique complète se trouve en section 27. |
| `!cof-desarmer` | `!cof-desarmer <arg1> <arg2> [arg3]` | Commande dédiée gérée par `desarmer` ; la fiche technique complète se trouve en section 27. |
| `!cof-posture-de-combat` | `!cof-posture-de-combat <arg1> <arg2> <arg3>` | Commande dédiée gérée par `postureDeCombat` ; la fiche technique complète se trouve en section 27. |
| `!cof-attaque-a-outrance` | `!cof-attaque-a-outrance <arg1>` | Commande dédiée gérée par `attaqueAOutrance` ; la fiche technique complète se trouve en section 27. |
| `!cof-expert-combat` | `!cof-expert-combat [arg1]` | Commande dédiée gérée par `expertDuCombat` ; la fiche technique complète se trouve en section 27. |
| `!cof-expert-combat-touche` | `!cof-expert-combat-touche [arg1]` | Commande dédiée gérée par `expertDuCombat` ; la fiche technique complète se trouve en section 27. |
| `!cof-expert-combat-dm` | `!cof-expert-combat-dm [arg1]` | Commande dédiée gérée par `expertDuCombat` ; la fiche technique complète se trouve en section 27. |
| `!cof-expert-combat-def` | `!cof-expert-combat-def <arg1> <arg2>` | Commande dédiée gérée par `expertDuCombatDEF` ; la fiche technique complète se trouve en section 27. |
| `!cof-riposte-defi` | `!cof-riposte-defi <arg1> <arg2>` | Commande dédiée gérée par `riposteDefiGuerrier` ; la fiche technique complète se trouve en section 27. |

Les prédicats sont préférables pour un bonus permanent ou contextuel : ils évitent de dupliquer la règle dans toutes les attaques. Pour une commande avec identifiant d’événement/session, utiliser le bouton généré par le moteur plutôt que fabriquer l’identifiant à la main.

### Invocateur

**Prédicats/crochets utiles :** `voieDeLaConjuration`, `familier`.


| Commande | Syntaxe de départ | Quand l’utiliser |
|---|---|---|
| `!cof-invoquer` | `!cof-invoquer [--placement]` | Commande dédiée gérée par `cofInvoquer` ; la fiche technique complète se trouve en section 27. |
| `!cof-invocations` | `!cof-invocations` | Commande dédiée gérée par `cofInvocations` ; la fiche technique complète se trouve en section 27. |
| `!cof-renvoyer-invocation` | `!cof-renvoyer-invocation` | Commande dédiée gérée par `cofRenvoyerInvocation` ; la fiche technique complète se trouve en section 27. |
| `!cof-conjuration-de-predateur` | `!cof-conjuration-de-predateur [arg1] [--si]` | Commande dédiée gérée par `conjurationPredateur` ; la fiche technique complète se trouve en section 27. |
| `!cof-conjuration-armee` | `!cof-conjuration-armee [arg1] [--allonge]` | Commande dédiée gérée par `conjurationArmee` ; la fiche technique complète se trouve en section 27. |

Les prédicats sont préférables pour un bonus permanent ou contextuel : ils évitent de dupliquer la règle dans toutes les attaques. Pour une commande avec identifiant d’événement/session, utiliser le bouton généré par le moteur plutôt que fabriquer l’identifiant à la main.

### Magicien

**Prédicats/crochets utiles :** `magieDeCombat`, `magieEnArmure`, `critiqueEpiqueSorts`.


| Commande | Syntaxe de départ | Quand l’utiliser |
|---|---|---|
| `!cof-attack` | `!cof-attack <arg1> <arg2>` | Capacité offensive générique : toucher, dégâts, types, états, saves, zones, ressources. |
| `!cof-effet-temp` | `!cof-effet-temp <arg1> <arg2>` | Capacité de buff/debuff ou état sans attaque. |
| `!cof-effet-combat` | `!cof-effet-combat <arg1>` | Capacité de buff/debuff ou état sans attaque. |

Les prédicats sont préférables pour un bonus permanent ou contextuel : ils évitent de dupliquer la règle dans toutes les attaques. Pour une commande avec identifiant d’événement/session, utiliser le bouton généré par le moteur plutôt que fabriquer l’identifiant à la main.

### Moine

**Prédicats/crochets utiles :** `espritVide`, `paradeDeProjectiles`, `pasDuVent`.


| Commande | Syntaxe de départ | Quand l’utiliser |
|---|---|---|
| `!cof-parade-projectiles` | `!cof-parade-projectiles [arg1]` | Commande dédiée gérée par `doParadeProjectiles` ; la fiche technique complète se trouve en section 27. |
| `!cof-esquive-fatale` | `!cof-esquive-fatale <arg1> <arg2>` | Commande dédiée gérée par `doEsquiveFatale` ; la fiche technique complète se trouve en section 27. |

Les prédicats sont préférables pour un bonus permanent ou contextuel : ils évitent de dupliquer la règle dans toutes les attaques. Pour une commande avec identifiant d’événement/session, utiliser le bouton généré par le moteur plutôt que fabriquer l’identifiant à la main.

### Nécromancien

**Prédicats/crochets utiles :** `necromancien`, `energieImpie`, `energieDeLaMort`, `siphonDesAmes`.


| Commande | Syntaxe de départ | Quand l’utiliser |
|---|---|---|
| `!cof-animer-cadavre` | `!cof-animer-cadavre <arg1> <arg2>` | Commande dédiée gérée par `animerCadavre` ; la fiche technique complète se trouve en section 27. |
| `!cof-animer-mort` | `!cof-animer-mort <arg1>` | Commande dédiée gérée par `animerMort` ; la fiche technique complète se trouve en section 27. |
| `!cof-strangulation` | `!cof-strangulation <arg1> <arg2>` | Commande dédiée gérée par `strangulation` ; la fiche technique complète se trouve en section 27. |
| `!cof-defense-armee-des-morts` | `!cof-defense-armee-des-morts <arg1>` | Commande dédiée gérée par `defenseArmeeDesMorts` ; la fiche technique complète se trouve en section 27. |

Les prédicats sont préférables pour un bonus permanent ou contextuel : ils évitent de dupliquer la règle dans toutes les attaques. Pour une commande avec identifiant d’événement/session, utiliser le bouton généré par le moteur plutôt que fabriquer l’identifiant à la main.

### Prêtre

**Prédicats/crochets utiles :** `voieDesSoins`, `voieDuGuerisseur`, `voieDeLArchange`, `phenix`.


| Commande | Syntaxe de départ | Quand l’utiliser |
|---|---|---|
| `!cof-guerison` | `!cof-guerison <arg1> <arg2>` | Commande dédiée gérée par `guerison` ; la fiche technique complète se trouve en section 27. |
| `!cof-intervention-divine` | `!cof-intervention-divine <arg1>` | Commande dédiée gérée par `interventionDivine` ; la fiche technique complète se trouve en section 27. |
| `!cof-cercle-protection` | `!cof-cercle-protection` | Commande dédiée gérée par `cercleDeProtection` ; la fiche technique complète se trouve en section 27. |
| `!cof-zone-de-vie` | `!cof-zone-de-vie <arg1>` | Commande dédiée gérée par `lancerZoneDeVie` ; la fiche technique complète se trouve en section 27. |
| `!cof-immunite-guerisseur` | `!cof-immunite-guerisseur <arg1>` | Commande dédiée gérée par `immuniteDuGuerisseur` ; la fiche technique complète se trouve en section 27. |

Les prédicats sont préférables pour un bonus permanent ou contextuel : ils évitent de dupliquer la règle dans toutes les attaques. Pour une commande avec identifiant d’événement/session, utiliser le bouton généré par le moteur plutôt que fabriquer l’identifiant à la main.

### Psionique

**Prédicats/crochets utiles :** `bouclierPsi`, `radarMental`, `combatKinetique`, `dominationPsy`, `prescience`.


| Commande | Syntaxe de départ | Quand l’utiliser |
|---|---|---|
| `!cof-attack` | `!cof-attack <arg1> <arg2>` | Capacité offensive générique : toucher, dégâts, types, états, saves, zones, ressources. |
| `!cof-effet-temp` | `!cof-effet-temp <arg1> <arg2>` | Capacité de buff/debuff ou état sans attaque. |

Les prédicats sont préférables pour un bonus permanent ou contextuel : ils évitent de dupliquer la règle dans toutes les attaques. Pour une commande avec identifiant d’événement/session, utiliser le bouton généré par le moteur plutôt que fabriquer l’identifiant à la main.

### Rôdeur

**Prédicats/crochets utiles :** `chasseurEmerite`, `ennemiJure`, `sensAffutes`.


| Commande | Syntaxe de départ | Quand l’utiliser |
|---|---|---|
| `!cof-attack` | `!cof-attack <arg1> <arg2>` | Capacité offensive générique : toucher, dégâts, types, états, saves, zones, ressources. |
| `!cof-compagnon-animal` | `!cof-compagnon-animal` | Commande de capacité ; rechercher son nom dans la section 23/27 pour la syntaxe complète. |

Les prédicats sont préférables pour un bonus permanent ou contextuel : ils évitent de dupliquer la règle dans toutes les attaques. Pour une commande avec identifiant d’événement/session, utiliser le bouton généré par le moteur plutôt que fabriquer l’identifiant à la main.

### Samouraï

**Prédicats/crochets utiles :** `techniqueDuSabre`, `sangFroid`.


| Commande | Syntaxe de départ | Quand l’utiliser |
|---|---|---|
| `!cof-defi-samourai` | `!cof-defi-samourai` | Commande dédiée gérée par `lancerDefiSamourai` ; la fiche technique complète se trouve en section 27. |
| `!cof-attack` | `!cof-attack <arg1> <arg2>` | Capacité offensive générique : toucher, dégâts, types, états, saves, zones, ressources. |

Les prédicats sont préférables pour un bonus permanent ou contextuel : ils évitent de dupliquer la règle dans toutes les attaques. Pour une commande avec identifiant d’événement/session, utiliser le bouton généré par le moteur plutôt que fabriquer l’identifiant à la main.

### Voleur

**Prédicats/crochets utiles :** `attaqueSournoise`, `sournoisesParTour`, `esquiveVoleur`, `graceFelineVoleur`, `pirouettes`, `connaissanceDuPoison`.


| Commande | Syntaxe de départ | Quand l’utiliser |
|---|---|---|
| `!cof-provocation` | `!cof-provocation <arg1> <arg2> [arg3]` | Commande dédiée gérée par `parseProvocation` ; la fiche technique complète se trouve en section 27. |
| `!cof-attack` | `!cof-attack <arg1> <arg2>` | Capacité offensive générique : toucher, dégâts, types, états, saves, zones, ressources. |
| `!cof-enduire-poison` | `!cof-enduire-poison <arg1> <arg2> <arg3> <arg4>` | Commande dédiée gérée par `parseEnduireDePoison` ; la fiche technique complète se trouve en section 27. |

Les prédicats sont préférables pour un bonus permanent ou contextuel : ils évitent de dupliquer la règle dans toutes les attaques. Pour une commande avec identifiant d’événement/session, utiliser le bouton généré par le moteur plutôt que fabriquer l’identifiant à la main.

## 13. Monster Creator V2 : créer un adversaire qui parle COFantasy

Le classeur `Monster_Creator_V2.xlsx` est une **interface de conception**, pas un moteur parallèle. Il prépare un monstre, estime son danger puis exporte les données que la fiche et COFantasy savent déjà lire.

### 13.1 Pourquoi distinguer NC de création et NC réel

Le NC saisi est une **cible de conception**. Une fois les PV, DEF, attaques, signatures, capacités, sorts et affinités choisis, le **NC réel** vérifie le résultat final. Cela évite qu’un monstre annoncé NC 5 devienne mécaniquement NC 8 simplement parce qu’on lui a ajouté plusieurs capacités fortes.

### 13.2 Flux conseillé

1. `Creator` : nom, NC, famille, sous-famille, taille, profil, archétypes, armure, affinités.
2. Lire les statistiques calculées et budgets.
3. Vérifier les signatures automatiques.
4. Choisir attaques/capacités/sorts dans les budgets.
5. Contrôler Danger réel et NC réel.
6. Copier `Export_Statsblock` dans l’onglet Statblock du PNJ.
7. Copier les commandes COFantasy générées si vous voulez des abilities dédiées.
8. Tester la rencontre avec `Simulateur_Rencontre`.

### 13.3 Onglets essentiels

| Onglet | Rôle |
|---|---|
| Creator | Interface principale. |
| Moteur | Calculs intermédiaires. |
| Export_Statsblock | JSON et commandes Roll20. |
| Ref_Signatures | Pouvoirs automatiques de famille/sous-famille. |
| Ref_Capacites | Capacités supplémentaires et poids de danger. |
| Ref_Sorts | Sorts, rangs, usages et poids. |
| Ref_Danger | Courbes de danger. |
| Simulateur_Rencontre | Danger cumulé ennemis vs puissance groupe. |
| Ref_Roll20 | Mapping vers la fiche. |

La référence détaillée du Monster Creator est intégrée dans la **section 24** de cette même page : capacités, sorts, signatures et exemple d’export y sont listés.

---

## 13A. Grammaire d’auteur — construire une commande sans connaître le code

### 13A.1 Convention générale

Les options COFantasy sont séparées par `--` :

```text
!cof-attack ATTAQUANT CIBLE NOM --dm 2d6+3 --feu --portee 20 --psave DEX 13
```

- `@{selected|token_id}` : le token qui lance l’action ;
- `@{target|token_id}` : Roll20 demande une cible ;
- les expressions de dés acceptent les formes usuelles `2d6+3`, `1d8`, `5` ;
- `d4?` est un **dé évolutif V2** : d4 niveau 1–5, d6 niveau 6–9, d8 niveau 10–14, d10 niveau 15–19, d12 niveau 20 ;
- plusieurs options peuvent être combinées ; l’ordre compte pour certaines options « locales » comme `--plus`, `--effet`, `--valeur`, `--save`.

### 13A.2 Sauvegardes

Forme de base :

```text
--psave DEX 13
--saveDM CON 15
--save SAG 14
```

`--psave` = sauvegarde partielle ; `--saveDM` = sauvegarde totale des dégâts ; `--save` se rattache au dernier effet. Les options supplémentaires de save utilisent `+option`, par exemple la grammaire interne accepte notamment `+tempete N` et `+contact DD`.

### 13A.3 Conditions

Les options `--if … --else --endif` permettent d’écrire une capacité conditionnelle. Conditions explicitement reconnues :

- `crit` / `critique` ;
- `etat ETAT` sur l’attaquant ;
- `etatCible ETAT` ;
- `attribut NOM VALEUR [local|fiche ...]` ;
- `attributCible NOM VALEUR [local|fiche ...]` ;
- `predicatCible NOM [VALEUR]` ;
- `typeCible TYPE` ;
- `distanceCibleSup M` / `distanceCibleInf M` ;
- `premiereAttaque` ;
- `moitieMoins ATTR` ;
- `deAttaque SEUIL`.

Exemple :

```text
!cof-attack @{selected|token_id} @{target|token_id} Lame solaire --dm 1d8+3 --lumiere --if typeCible mortVivant --plus 1d6 --endif
```

### 13A.4 Limites et recharges

```text
--limiteParTour 1 nom_ressource
--limiteParCombat 1 nom_ressource
--limiteParJour 3 nom_ressource
--recharge 5 souffle
```

Pour les limites, la première valeur peut également être un **nom de prédicat** au lieu d’un entier. `--recharge 5` signifie recharge sur 5–6 ; le seuil accepté va de 2 à 6.

### 13A.5 Effets

```text
--effet etourdi 1 --save CON 14
--effet poison 3 --valeur 1d6 toxique
--etat renverse
--finEtat renverse
```

Si le nom est un état reconnu et qu’une durée est fournie, COFantasy utilise automatiquement sa variante temporaire. Un nom non répertorié peut devenir un effet générique quand la commande le permet.

## 14. Livre de recettes : construire des capacités

### Charge brutale

```text
!cof-attack @{selected|token_id} @{target|token_id} -1 --deplaceDe 5 20 --bonusAttaque 2 --plus 1d6
```

### Cône de froid (affinité Eau dans la V2)

```text
!cof-attack @{selected|token_id} @{target|token_id} Cône de froid --toucher [[@{selected|ATKMAG}]] --auto --dm 2d6+[[@{selected|INT}]] --eau --portee 20 --sortilege --cone 30 --ifSaveFails CON 13 --effet ralentiTemp 1 --else --diviseDmg 2 --endif
```

### Frappe anti-mort-vivant

```text
!cof-attack @{selected|token_id} @{target|token_id} -1 --if typeCible mort-vivant --plus 2d6 --lumiere --endif
```

### Capacité limitée par combat

```text
!cof-attack @{selected|token_id} @{target|token_id} Onde solaire --toucher [[@{selected|ATKMAG}]] --dm 3d6 --lumiere --portee 20 --sortilege --limiteParCombat 1 ondeSolaire --tempsRecharge rechargeGen(OndeSolaire) 2
```

La règle de conception est : **décrire l’intention avec les options les plus simples possibles**. N’ajoutez pas trois mécanismes différents si un état ou une sauvegarde suffit à exprimer la capacité.

---

## 15. Undo et correction d’erreur

```text
!cof-undo
```

Utilisez Undo immédiatement après un clic erroné plutôt que d’essayer de remettre à la main PV, états, inventaire et ressources. Plus vous modifiez des données manuellement après l’erreur, moins le rollback peut être intuitif.

---

## 16. Dépannage orienté jeu

### « Mon personnage ne peut pas agir »

Vérifier : Étourdi, Paralysé, Sommeil, Surpris, blessure/inconscience et effets temporaires. `!cof-statut` donne un résumé.

### « Je n’ai pas eu d’attaque d’opportunité »

Vérifier : combat actif, arme principale de contact, limite d’AO du round, état Renversé/Débordé/Désarmé/Volant, visibilité de la cible et présence d’un mur.

### « Le soin ne relève pas le PJ »

S’il est **Blessé niveau 2**, c’est voulu : soins normaux interdits à 0 PV. Utiliser les tests de survie ou un Parchemin de stabilisation.

### « Le marqueur de blessure ne s’affiche pas »

```text
!cof-blessure-markers
```

Puis installer/corriger les markers personnalisés indiqués par le diagnostic.

### « Une vieille macro utilise froid/acide/radiant… »

Elle reste comprise pour compatibilité. Pour les nouvelles capacités, utiliser Eau/Terre/Lumière/etc.

---

## 17. Commandes principales à retenir

```text
!cof-init
!cof-attack
!cof-jet
!cof-effet
!cof-effet-temp
!cof-effet-combat
!cof-soin
!cof-set-state
!cof-statut
!cof-statut-ressources
!cof-test-collectif
!cof-defi
!cof-zone
!cof-teleportation
!cof-invocations
!cof-doctor
!cof-undo
```

Les boutons du chat utilisent beaucoup d’autres commandes internes. Elles sont listées ci-dessous pour audit et macros avancées.

---

## 18. Référence d’auteur exhaustive — `!cof-attack`

La commande ci-dessous est le **langage de construction principal**. Les options listées sont extraites du parseur V2 actuel ; les alias sont volontairement conservés pour que la page soit utilisable comme dictionnaire.

```text
!cof-attack <attaquant> <cible> <label/arme> [--option ...]
```

| Option reconnue | Famille | Syntaxe | Effet / usage |
|---|---|---|---|
| `enflamme` | Spécial | `--enflamme` | Drapeau spécialisé sans argument ; active la logique `enflamme` dans la résolution de l’attaque. |
| `ignoreMoitieRD` | Dégâts | `--ignoreMoitieRD` | active la règle qui ignore la moitié de la RD. |
| `malediction` | Spécial | `--malediction` | Drapeau spécialisé sans argument ; active la logique `malediction` dans la résolution de l’attaque. |
| `pressionMortelle` | Spécial | `--pressionMortelle` | Drapeau spécialisé sans argument ; active la logique `pressionMortelle` dans la résolution de l’attaque. |
| `pietine` | Spécial | `--pietine` | Drapeau spécialisé sans argument ; active la logique `pietine` dans la résolution de l’attaque. |
| `percute` | Spécial | `--percute` | Drapeau spécialisé sans argument ; active la logique `percute` dans la résolution de l’attaque. |
| `maxDmg` | Spécial | `--maxDmg` | Drapeau spécialisé sans argument ; active la logique `maxDmg` dans la résolution de l’attaque. |
| `ouvertureMortelle` | Spécial | `--ouvertureMortelle` | Drapeau spécialisé sans argument ; active la logique `ouvertureMortelle` dans la résolution de l’attaque. |
| `seulementVivant` | Spécial | `--seulementVivant` | Drapeau spécialisé sans argument ; active la logique `seulementVivant` dans la résolution de l’attaque. |
| `etreinteImmole` | Spécial | `--etreinteImmole` | Drapeau spécialisé sans argument ; active la logique `etreinteImmole` dans la résolution de l’attaque. |
| `etreinteScorpion` | Spécial | `--etreinteScorpion` | Drapeau spécialisé sans argument ; active la logique `etreinteScorpion` dans la résolution de l’attaque. |
| `seulementDistance` | Spécial | `--seulementDistance` | Drapeau spécialisé sans argument ; active la logique `seulementDistance` dans la résolution de l’attaque. |
| `seulementContact` | Spécial | `--seulementContact` | Drapeau spécialisé sans argument ; active la logique `seulementContact` dans la résolution de l’attaque. |
| `tempDmg` | Spécial | `--tempDmg` | Drapeau spécialisé sans argument ; active la logique `tempDmg` dans la résolution de l’attaque. |
| `eclairDEnergie` | Spécial | `--eclairDEnergie` | Drapeau spécialisé sans argument ; active la logique `eclairDEnergie` dans la résolution de l’attaque. |
| `attaqueOpportunite` | AO | `--attaqueOpportunite [id]` | marque la résolution comme attaque d’opportunité. |
| `sansAO` | AO | `--sansAO` | empêche cette action de provoquer une AO. |
| `sansAo` | AO | `--sansAo` | alias de --sansAO. |
| `sansao` | AO | `--sansao` | alias de --sansAO. |
| `affute` | Spécial | `--affute` | Drapeau spécialisé sans argument ; active la logique `affute` dans la résolution de l’attaque. |
| `arc` | Spécial | `--arc` | Drapeau spécialisé sans argument ; active la logique `arc` dans la résolution de l’attaque. |
| `arbalete` | Spécial | `--arbalete` | Drapeau spécialisé sans argument ; active la logique `arbalete` dans la résolution de l’attaque. |
| `armeDArgent` | Spécial | `--armeDArgent` | Drapeau spécialisé sans argument ; active la logique `armeDArgent` dans la résolution de l’attaque. |
| `artificiel` | Spécial | `--artificiel` | Drapeau spécialisé sans argument ; active la logique `artificiel` dans la résolution de l’attaque. |
| `attaqueAssuree` | Spécial | `--attaqueAssuree` | Drapeau spécialisé sans argument ; active la logique `attaqueAssuree` dans la résolution de l’attaque. |
| `attaqueFlamboyante` | Spécial | `--attaqueFlamboyante` | Drapeau spécialisé sans argument ; active la logique `attaqueFlamboyante` dans la résolution de l’attaque. |
| `attaqueRisquee` | Spécial | `--attaqueRisquee` | Drapeau spécialisé sans argument ; active la logique `attaqueRisquee` dans la résolution de l’attaque. |
| `attaqueOptions` | Spécial | `--attaqueOptions` | Drapeau spécialisé sans argument ; active la logique `attaqueOptions` dans la résolution de l’attaque. |
| `beni` | Spécial | `--beni` | Drapeau spécialisé sans argument ; active la logique `beni` dans la résolution de l’attaque. |
| `choc` | Spécial | `--choc` | Drapeau spécialisé sans argument ; active la logique `choc` dans la résolution de l’attaque. |
| `dominationPsy` | Spécial | `--dominationPsy` | Drapeau spécialisé sans argument ; active la logique `dominationPsy` dans la résolution de l’attaque. |
| `peutAgripper` | Spécial | `--peutAgripper` | Drapeau spécialisé sans argument ; active la logique `peutAgripper` dans la résolution de l’attaque. |
| `spectral` | Spécial | `--spectral` | Drapeau spécialisé sans argument ; active la logique `spectral` dans la résolution de l’attaque. |
| `epieu` | Spécial | `--epieu` | Drapeau spécialisé sans argument ; active la logique `epieu` dans la résolution de l’attaque. |
| `hache` | Spécial | `--hache` | Drapeau spécialisé sans argument ; active la logique `hache` dans la résolution de l’attaque. |
| `marteau` | Spécial | `--marteau` | Drapeau spécialisé sans argument ; active la logique `marteau` dans la résolution de l’attaque. |
| `vicieux` | Spécial | `--vicieux` | Drapeau spécialisé sans argument ; active la logique `vicieux` dans la résolution de l’attaque. |
| `attaqueMentale` | Spécial | `--attaqueMentale` | Drapeau spécialisé sans argument ; active la logique `attaqueMentale` dans la résolution de l’attaque. |
| `auto` | Résolution | `--auto` | utilise les données fournies sans demander l’arme de fiche quand le contexte le permet. |
| `avecd12` | Spécial | `--avecd12` | Drapeau spécialisé sans argument ; active la logique `avecd12` dans la résolution de l’attaque. |
| `demiAuto` | Spécial | `--demiAuto` | Drapeau spécialisé sans argument ; active la logique `demiAuto` dans la résolution de l’attaque. |
| `energiePositive` | Spécial | `--energiePositive` | Drapeau spécialisé sans argument ; active la logique `energiePositive` dans la résolution de l’attaque. |
| `explodeMax` | Spécial | `--explodeMax` | Drapeau spécialisé sans argument ; active la logique `explodeMax` dans la résolution de l’attaque. |
| `explosion` | Spécial | `--explosion` | Drapeau spécialisé sans argument ; active la logique `explosion` dans la résolution de l’attaque. |
| `feinte` | Spécial | `--feinte` | Drapeau spécialisé sans argument ; active la logique `feinte` dans la résolution de l’attaque. |
| `ignoreObstacles` | Spécial | `--ignoreObstacles` | Drapeau spécialisé sans argument ; active la logique `ignoreObstacles` dans la résolution de l’attaque. |
| `mainsDEnergie` | Spécial | `--mainsDEnergie` | Drapeau spécialisé sans argument ; active la logique `mainsDEnergie` dans la résolution de l’attaque. |
| `pasDeDmg` | Spécial | `--pasDeDmg` | Drapeau spécialisé sans argument ; active la logique `pasDeDmg` dans la résolution de l’attaque. |
| `pointsVitaux` | Spécial | `--pointsVitaux` | Drapeau spécialisé sans argument ; active la logique `pointsVitaux` dans la résolution de l’attaque. |
| `poudre` | Spécial | `--poudre` | Drapeau spécialisé sans argument ; active la logique `poudre` dans la résolution de l’attaque. |
| `metal` | Spécial | `--metal` | Drapeau spécialisé sans argument ; active la logique `metal` dans la résolution de l’attaque. |
| `adamantium` | Spécial | `--adamantium` | Drapeau spécialisé sans argument ; active la logique `adamantium` dans la résolution de l’attaque. |
| `ferFroid` | Spécial | `--ferFroid` | Drapeau spécialisé sans argument ; active la logique `ferFroid` dans la résolution de l’attaque. |
| `reroll1` | Spécial | `--reroll1` | Drapeau spécialisé sans argument ; active la logique `reroll1` dans la résolution de l’attaque. |
| `reroll2` | Spécial | `--reroll2` | Drapeau spécialisé sans argument ; active la logique `reroll2` dans la résolution de l’attaque. |
| `semonce` | Spécial | `--semonce` | Drapeau spécialisé sans argument ; active la logique `semonce` dans la résolution de l’attaque. |
| `sortilege` | Spécial | `--sortilege` | Drapeau spécialisé sans argument ; active la logique `sortilege` dans la résolution de l’attaque. |
| `strigeSuce` | Spécial | `--strigeSuce` | Drapeau spécialisé sans argument ; active la logique `strigeSuce` dans la résolution de l’attaque. |
| `tirDeBarrage` | Spécial | `--tirDeBarrage` | Drapeau spécialisé sans argument ; active la logique `tirDeBarrage` dans la résolution de l’attaque. |
| `test` | Spécial | `--test` | Drapeau spécialisé sans argument ; active la logique `test` dans la résolution de l’attaque. |
| `traquenard` | Spécial | `--traquenard` | Drapeau spécialisé sans argument ; active la logique `traquenard` dans la résolution de l’attaque. |
| `tueurDeGeants` | Spécial | `--tueurDeGeants` | Drapeau spécialisé sans argument ; active la logique `tueurDeGeants` dans la résolution de l’attaque. |
| `tueurDeGrands` | Spécial | `--tueurDeGrands` | Drapeau spécialisé sans argument ; active la logique `tueurDeGrands` dans la résolution de l’attaque. |
| `grenaille` | Spécial | `--grenaille` | Drapeau spécialisé sans argument ; active la logique `grenaille` dans la résolution de l’attaque. |
| `attaqueArmeeConjuree` | Spécial | `--attaqueArmeeConjuree` | Drapeau spécialisé sans argument ; active la logique `attaqueArmeeConjuree` dans la résolution de l’attaque. |
| `difficultePVmax` | Spécial | `--difficultePVmax` | Drapeau spécialisé sans argument ; active la logique `difficultePVmax` dans la résolution de l’attaque. |
| `difficultePV` | Spécial | `--difficultePV` | Drapeau spécialisé sans argument ; active la logique `difficultePV` dans la résolution de l’attaque. |
| `lamesJumelles` | Spécial | `--lamesJumelles` | Drapeau spécialisé sans argument ; active la logique `lamesJumelles` dans la résolution de l’attaque. |
| `riposte` | Spécial | `--riposte` | Drapeau spécialisé sans argument ; active la logique `riposte` dans la résolution de l’attaque. |
| `secret` | Spécial | `--secret` | Drapeau spécialisé sans argument ; active la logique `secret` dans la résolution de l’attaque. |
| `saufAllies` | Ciblage | `--saufAllies` | exclut les alliés d’une résolution de zone quand supporté. |
| `tirAveugle` | Spécial | `--tirAveugle` | Drapeau spécialisé sans argument ; active la logique `tirAveugle` dans la résolution de l’attaque. |
| `attaqueBouclierRenverse` | Spécial | `--attaqueBouclierRenverse` | Drapeau spécialisé sans argument ; active la logique `attaqueBouclierRenverse` dans la résolution de l’attaque. |
| `necromancie` | Spécial | `--necromancie` | Drapeau spécialisé sans argument ; active la logique `necromancie` dans la résolution de l’attaque. |
| `runeDePuissance` | Spécial | `--runeDePuissance` | Drapeau spécialisé sans argument ; active la logique `runeDePuissance` dans la résolution de l’attaque. |
| `aussiArmeDeJet` | Arme | `--aussiArmeDeJet LABEL` | associe une version d’arme de jet. |
| `m2d20` | Spécial | `--m2d20` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `m2d20` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `avantage` | Spécial | `--avantage` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `avantage` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `désavantage` | Spécial | `--désavantage` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `désavantage` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `desavantage` | Spécial | `--desavantage` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `desavantage` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `avecd12crit` | Spécial | `--avecd12crit` | Drapeau spécialisé sans argument ; active la logique `avecd12crit` dans la résolution de l’attaque. |
| `tranchant` | Type physique | `--tranchant` | définit le type physique ; un seul des trois est actif. |
| `contondant` | Type physique | `--contondant` | définit le type physique ; un seul des trois est actif. |
| `percant` | Type physique | `--percant` | définit le type physique ; un seul des trois est actif. |
| `nom` | Affichage | `--nom TEXTE` | définit un nom/texte spécial associé à l’attaque. |
| `special` | Affichage | `--special TEXTE` | définit un nom/texte spécial associé à l’attaque. |
| `toucher` | Attaque | `--toucher N` | force/ajoute la valeur de toucher utilisée par l’attaque. |
| `modifiePortee` | Portée | `--modifiePortee N` | modifie la portée de N unités selon la résolution. |
| `crit` | Critique | `--crit N` | définit le seuil de critique (borné de 2 à 20). |
| `dm` | Dégâts | `--dm 2d6+3` | définit l’expression de dégâts principale. |
| `portee` | Portée | `--portee M` | définit la portée en mètres. |
| `frappeDesArcanes` | Spécial | `--frappeDesArcanes [N]` | active Frappe des arcanes ; valeur 2 par défaut. |
| `attaqueMagiqueDe` | Attaque | `--attaqueMagiqueDe NOM_PERSONNAGE` | utilise le score d’attaque magique d’une autre fiche nommée. |
| `imparable` | Spécial | `--imparable` | Drapeau spécialisé sans argument ; active la logique `imparable` dans la résolution de l’attaque. |
| `tirDouble` | Attaque | `--tirDouble [LABEL]` | programme une seconde attaque selon la capacité Tir double. |
| `secondTir` | Spécial | `--secondTir` | Drapeau spécialisé sans argument ; active la logique `secondTir` dans la résolution de l’attaque. |
| `ignoreRD` | Dégâts | `--ignoreRD [N]` | ignore N points de RD ; sans valeur, ignore toute la RD. |
| `tueurDe` | Cible | `--tueurDe TYPE` | ajoute un type de créature traité comme cible privilégiée. |
| `magique` | Dégâts | `--magique [niveau]` | marque les dégâts comme magiques ; niveau 1 par défaut. |
| `si` | Spécial | `--si` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `si` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `recharge` | Ressource | `--recharge 2..6 [id]` | capacité à recharge : seuil de 2 à 6, identifiant optionnel. |
| `tempsRecharge` | Ressource | `--tempsRecharge EFFET DUREE` | utilise un effet temporaire comme délai de recharge. |
| `plus` | Dégâts | `--plus EXP` | ajoute une composante de dégâts du type courant. |
| `plusCrit` | Dégâts | `--plusCrit EXP` | ajoute des dégâts seulement sur critique. |
| `dmSiRate` | Dégâts | `--dmSiRate EXP` | inflige une composante même si l’attaque principale rate, selon la résolution spécialisée. |
| `dmCible` | Dégâts | `--dmCible EXP` | ajoute des dégâts associés à la cible selon la capacité. |
| `icone` | Affichage | `--icone MARQUEUR` | ajoute un status marker via le parseur de marqueur. |
| `icône` | Affichage | `--icône MARQUEUR` | ajoute un status marker via le parseur de marqueur. |
| `marker` | Affichage | `--marker MARQUEUR` | ajoute un status marker via le parseur de marqueur. |
| `marqueur` | Affichage | `--marqueur MARQUEUR` | ajoute un status marker via le parseur de marqueur. |
| `attr` | Effet | `--attr ATTR VALEUR [DUREE]` | modifie temporairement un attribut. |
| `attribut` | Effet | `--attribut ATTR VALEUR [DUREE]` | alias de --attr. |
| `carac` | Effet | `--carac ATTR VALEUR [DUREE]` | alias de modification temporaire d’attribut. |
| `caracteristique` | Effet | `--caracteristique ATTR VALEUR [DUREE]` | alias ASCII de modification temporaire. |
| `caractéristique` | Effet | `--caractéristique ATTR VALEUR [DUREE]` | alias accentué. |
| `effet` | Effet | `--effet NOM [DUREE|fin]` | ajoute un état/effet temporaire, de combat, indéterminé ou générique. |
| `finEffet` | Effet | `--finEffet NOM` | retire l’effet nommé. |
| `valeur` | Effet | `--valeur VALEUR [MAX|TYPE]` | donne une valeur à l’effet précédent ; pour certains DOT, le 2e argument fixe le type. |
| `accumuleDuree` | Effet | `--accumuleDuree N` | autorise l’accumulation de durée de l’effet précédent. |
| `optionEffet` | Effet | `--optionEffet OPTION...` | ajoute une option au dernier effet configuré. |
| `etatSi` | État | `--etatSi ETAT CONDITION` | applique l’état selon la condition parsée par le moteur. |
| `etat` | État | `--etat ETAT [CARAC DD]` | applique un état reconnu ; peut inclure une sauvegarde. |
| `finEtat` | État | `--finEtat ETAT` | retire l’état temporaire correspondant. |
| `peur` | Effet | `--peur SEUIL DUREE` | configure la peur avec seuil et durée. |
| `feu` | Type de dégâts | `--feu` | définit le type de dégâts courant. |
| `air` | Type de dégâts | `--air` | définit le type de dégâts courant. |
| `eau` | Type de dégâts | `--eau` | définit le type de dégâts courant. |
| `terre` | Type de dégâts | `--terre` | définit le type de dégâts courant. |
| `ombre` | Type de dégâts | `--ombre` | définit le type de dégâts courant. |
| `lumiere` | Type de dégâts | `--lumiere` | définit le type de dégâts courant. |
| `force` | Type de dégâts | `--force` | définit le type de dégâts courant. |
| `toxique` | Type de dégâts | `--toxique` | définit le type de dégâts courant. |
| `psychique` | Type de dégâts | `--psychique` | définit le type de dégâts courant. |
| `nature` | Type de dégâts | `--nature` | définit le type de dégâts courant. |
| `necrotique` | Type de dégâts | `--necrotique` | définit le type de dégâts courant. Alias historique automatiquement rattaché à son domaine V2. |
| `radiant` | Type de dégâts | `--radiant` | définit le type de dégâts courant. Alias historique automatiquement rattaché à son domaine V2. |
| `arcane` | Type de dégâts | `--arcane` | définit le type de dégâts courant. Alias historique automatiquement rattaché à son domaine V2. |
| `froid` | Type de dégâts | `--froid` | définit le type de dégâts courant. Alias historique automatiquement rattaché à son domaine V2. |
| `acide` | Type de dégâts | `--acide` | définit le type de dégâts courant. Alias historique automatiquement rattaché à son domaine V2. |
| `electrique` | Type de dégâts | `--electrique` | définit le type de dégâts courant. Alias historique automatiquement rattaché à son domaine V2. |
| `sonique` | Type de dégâts | `--sonique` | définit le type de dégâts courant. Alias historique automatiquement rattaché à son domaine V2. |
| `poison` | Type de dégâts | `--poison` | définit le type de dégâts courant. Alias historique automatiquement rattaché à son domaine V2. |
| `maladie` | Type de dégâts | `--maladie` | définit le type de dégâts courant. Alias historique automatiquement rattaché à son domaine V2. |
| `argent` | Type de dégâts | `--argent` | définit le type de dégâts courant. |
| `drain` | Type de dégâts | `--drain` | définit le type de dégâts courant. |
| `energie` | Type de dégâts | `--energie` | définit le type de dégâts courant. Alias historique automatiquement rattaché à son domaine V2. |
| `sombracier` | Dégâts/soin | `--sombracier [N]` | active le soin Sombracier, valeur 1 par défaut. |
| `cordeJumelle` | Spécial | `--cordeJumelle` | Drapeau spécialisé sans argument ; active la logique `cordeJumelle` dans la résolution de l’attaque. |
| `salve` | Attaque | `--salve [MALUS] [DISTANCE]` | attaque secondaire de salve ; valeurs par défaut -5 et 5 m. |
| `salveSecondaire` | Spécial | `--salveSecondaire` | Drapeau spécialisé sans argument ; active la logique `salveSecondaire` dans la résolution de l’attaque. |
| `naturel` | Spécial | `--naturel` | Drapeau spécialisé sans argument ; active la logique `naturel` dans la résolution de l’attaque. |
| `sourceNaturelle` | Spécial | `--sourceNaturelle` | Drapeau spécialisé sans argument ; active la logique `sourceNaturelle` dans la résolution de l’attaque. |
| `vampirise` | Dégâts | `--vampirise [POURCENT]` | soigne l’attaquant d’un pourcentage des dégâts selon la capacité. |
| `sournoise` | Dégâts | `--sournoise [N]` | ajoute les dés d’attaque sournoise ; sans N lit le prédicat attaqueSournoise. |
| `bondFelis` | Mouvement | `--bondFelis M` | configure un bond et un déplacement en saut. |
| `attaqueAcrobatique` | Voleur | `--attaqueAcrobatique [N]` | utilise N dés, ou le prédicat `attaqueSournoise` si omis. |
| `disparition` | Spécial | `--disparition N` | ajoute la valeur de disparition utilisée par la capacité. |
| `fx` | Affichage | `--fx NOM|custom NOM` | effet visuel à l’origine. |
| `targetFx` | Affichage | `--targetFx NOM|custom NOM` | effet visuel sur la cible. |
| `psave` | Sauvegarde | `--psave CARAC DD [+options]` | sauvegarde partielle : réussite réduit l’effet/dégâts selon le contexte. |
| `saveDM` | Sauvegarde | `--saveDM CARAC DD [+options]` | sauvegarde totale des dégâts : réussite annule la composante concernée. |
| `save` | Sauvegarde | `--save CARAC DD [+options]` | attache une sauvegarde à l’effet défini juste avant. |
| `saveParTour` | Sauvegarde | `--saveParTour CARAC DD` | permet une sauvegarde à chaque tour contre l’effet précédent. |
| `saveActifParTour` | Sauvegarde | `--saveActifParTour CARAC DD` | sauvegarde active à chaque tour contre l’effet précédent. |
| `saveParJour` | Sauvegarde | `--saveParJour CARAC DD` | sauvegarde journalière contre l’effet précédent. |
| `retourneEnMain` | Arme | `--retourneEnMain [CARAC DD]` | fait revenir une arme en main, éventuellement avec condition. |
| `mana` | Ressource | `--mana COUT` | ajoute un coût de mana. |
| `magieRapide` | Ressource | `--magieRapide [COUT]` | active la magie rapide et ajoute son coût. |
| `tempeteDeMana` | Ressource | `--tempeteDeMana [options]` | active le sous-système de tempête de mana. |
| `magieEnArmure` | Spécial | `--magieEnArmure` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `magieEnArmure` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `rang` | Ressource | `--rang N` | indique le rang de capacité/sort. |
| `bonusAttaque` | Attaque | `--bonusAttaque N` | ajoute N au jet d’attaque. |
| `bonusContreBouclier` | Attaque | `--bonusContreBouclier N` | bonus conditionnel contre une cible au bouclier. |
| `bonusContreArmure` | Attaque | `--bonusContreArmure N` | bonus conditionnel contre une cible en armure. |
| `bonusCritique` | Critique | `--bonusCritique N` | modifie le critique selon le moteur. |
| `attaqueDeGroupe` | Attaque | `--attaqueDeGroupe N` | indique le nombre de membres participant à l’attaque de groupe. |
| `puissant` | Sort | `--puissant [oui|non|duree|portee|PREDICAT]` | gère la version puissante : effet global, durée ou portée. |
| `oui` | Spécial | `--oui` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `oui` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `Oui` | Spécial | `--Oui` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `Oui` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `non` | Spécial | `--non` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `non` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `Non` | Spécial | `--Non` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `Non` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `duree` | Spécial | `--duree` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `duree` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `rate` | MJ/Test | `--rate` | force un résultat de résolution ; option réservée au MJ. |
| `touche` | MJ/Test | `--touche` | force un résultat de résolution ; option réservée au MJ. |
| `critique` | MJ/Test | `--critique` | force un résultat de résolution ; option réservée au MJ. |
| `echecCritique` | MJ/Test | `--echecCritique` | force un résultat de résolution ; option réservée au MJ. |
| `pasDEchecCritique` | MJ/Test | `--pasDEchecCritique` | force un résultat de résolution ; option réservée au MJ. |
| `munition` | Arme | `--munition LABEL [perte%]` | consomme une munition de fiche ou une munition nommée. |
| `ligne` | Zone | `--ligne` | zone en ligne. |
| `effigieAOE` | Zone | `--effigieAOE R [CARAC DD]` | zone autour d’une effigie, avec sauvegarde partielle optionnelle. |
| `disque` | Zone | `--disque R [souffleDeMort]` | zone circulaire de rayon R. |
| `cone` | Zone | `--cone [ANGLE]` | zone conique ; 90° par défaut. |
| `target` | Ciblage | `--target TOKEN_ID` | ajoute une cible supplémentaire explicite. |
| `canaliseParFamilier` | Ciblage | `--canaliseParFamilier` | utilise le familier actif comme origine. |
| `ricochets` | Ciblage | `--ricochets N [TOKEN_ID ...]` | configure N ricochets et une chaîne de cibles. |
| `ciblesDansDisque` | Zone | `--ciblesDansDisque R` | contraint/sélectionne des cibles dans un disque de rayon R selon la capacité. |
| `limiteParJour` | Ressource | `--limiteParJour N|PREDICAT [ressource]` | limite journalière ; peut être numérique ou pilotée par prédicat. |
| `limiteParCombat` | Ressource | `--limiteParCombat [N|PREDICAT] [ressource]` | limite par combat ; sans valeur = 1. |
| `limiteParTour` | Ressource | `--limiteParTour [N|PREDICAT] [ressource]` | limite par tour ; sans valeur = 1. |
| `decrAttribute` | Ressource | `--decrAttribute ATTR [N]` | décrémente un attribut ressource après utilisation. |
| `decrLimitePredicatParTour` | Ressource | `--decrLimitePredicatParTour PREDICAT` | décrémente une limite par tour stockée en prédicat. |
| `forceMinimum` | Attaque | `--forceMinimum N` | exige une FOR minimale. |
| `arcComposite` | Attaque | `--arcComposite N` | bonus d’arc composite. |
| `incrDmgCoef` | Dégâts | `--incrDmgCoef [N]` | augmente le coefficient de dégâts (de 1 par défaut). |
| `toucheDoubleDmg` | Dégâts | `--toucheDoubleDmg` | augmente le coefficient de dégâts sur touche selon le moteur. |
| `diviseDmg` | Dégâts | `--diviseDmg [N]` | divise les dégâts (par 2 par défaut). |
| `divisePortee` | Portée | `--divisePortee [N]` | divise la portée (par 2 par défaut). |
| `incrCritCoef` | Critique | `--incrCritCoef [N]` | augmente le multiplicateur de critique. |
| `if` | Condition | `--if CONDITION` | ouvre une branche conditionnelle. |
| `ifSaveFails` | Condition | `--ifSaveFails CARAC DD` | ouvre une branche exécutée si la sauvegarde échoue. |
| `endif` | Condition | `--endif` | ferme le bloc conditionnel. |
| `else` | Condition | `--else` | branche alternative du dernier --if. |
| `message` | Affichage | `--message TEXTE` | ajoute un message de résolution. |
| `allonge` | Portée | `--allonge M` | définit l’allonge de l’attaque. |
| `enveloppe` | Contrôle | `--enveloppe [DD] [TYPE EXPRESSION]` | configure une enveloppe/engloutissement générique ; DD 15 par défaut. |
| `etreinte` | Contrôle | `--etreinte [DD] [DM]` | configure une étreinte ; DD 15 et 1d6 par défaut. |
| `imgAttack` | Affichage | `--imgAttack URL` | définit l’image utilisée pour ce résultat d’attaque. |
| `imgAttackEchec` | Affichage | `--imgAttackEchec URL` | définit l’image utilisée pour ce résultat d’attaque. |
| `imgAttackEchecCritique` | Affichage | `--imgAttackEchecCritique URL` | définit l’image utilisée pour ce résultat d’attaque. |
| `imgAttackEchecClignotement` | Affichage | `--imgAttackEchecClignotement URL` | définit l’image utilisée pour ce résultat d’attaque. |
| `imgAttackSucces` | Affichage | `--imgAttackSucces URL` | définit l’image utilisée pour ce résultat d’attaque. |
| `imgAttackSuccesChampion` | Affichage | `--imgAttackSuccesChampion URL` | définit l’image utilisée pour ce résultat d’attaque. |
| `imgAttackSuccesCritique` | Affichage | `--imgAttackSuccesCritique URL` | définit l’image utilisée pour ce résultat d’attaque. |
| `soundAttack` | Affichage | `--soundAttack SON` | définit le son utilisé pour ce résultat d’attaque. |
| `soundAttackEchec` | Affichage | `--soundAttackEchec SON` | définit le son utilisé pour ce résultat d’attaque. |
| `soundAttackEchecCritique` | Affichage | `--soundAttackEchecCritique SON` | définit le son utilisé pour ce résultat d’attaque. |
| `soundAttackEchecClignotement` | Affichage | `--soundAttackEchecClignotement SON` | définit le son utilisé pour ce résultat d’attaque. |
| `soundAttackSucces` | Affichage | `--soundAttackSucces SON` | définit le son utilisé pour ce résultat d’attaque. |
| `soundAttackSuccesChampion` | Affichage | `--soundAttackSuccesChampion SON` | définit le son utilisé pour ce résultat d’attaque. |
| `soundAttackSuccesCritique` | Affichage | `--soundAttackSuccesCritique SON` | définit le son utilisé pour ce résultat d’attaque. |
| `img-attack-echec-critique` | Affichage | `--img-attack-echec-critique URL` | définit l’image utilisée pour ce résultat d’attaque. |
| `img-attack-echec` | Affichage | `--img-attack-echec URL` | définit l’image utilisée pour ce résultat d’attaque. |
| `img-attack-echec-clignotement` | Affichage | `--img-attack-echec-clignotement URL` | définit l’image utilisée pour ce résultat d’attaque. |
| `img-attack-normal-touch` | Affichage | `--img-attack-normal-touch URL` | définit l’image utilisée pour ce résultat d’attaque. |
| `img-attack-succes` | Affichage | `--img-attack-succes URL` | définit l’image utilisée pour ce résultat d’attaque. |
| `img-attack-champion-succes` | Affichage | `--img-attack-champion-succes URL` | définit l’image utilisée pour ce résultat d’attaque. |
| `img-attack-succes-champion` | Affichage | `--img-attack-succes-champion URL` | définit l’image utilisée pour ce résultat d’attaque. |
| `img-attack-succes-critique` | Affichage | `--img-attack-succes-critique URL` | définit l’image utilisée pour ce résultat d’attaque. |
| `sound-attack-echec-critique` | Affichage | `--sound-attack-echec-critique SON` | définit le son utilisé pour ce résultat d’attaque. |
| `sound-attack-echec` | Affichage | `--sound-attack-echec SON` | définit le son utilisé pour ce résultat d’attaque. |
| `sound-attack-echec-clignotement` | Affichage | `--sound-attack-echec-clignotement SON` | définit le son utilisé pour ce résultat d’attaque. |
| `sound-attack-normal-touch` | Affichage | `--sound-attack-normal-touch SON` | définit le son utilisé pour ce résultat d’attaque. |
| `sound-attack-succes` | Affichage | `--sound-attack-succes SON` | définit le son utilisé pour ce résultat d’attaque. |
| `sound-attack-champion-succes` | Affichage | `--sound-attack-champion-succes SON` | définit le son utilisé pour ce résultat d’attaque. |
| `sound-attack-succes-champion` | Affichage | `--sound-attack-succes-champion SON` | définit le son utilisé pour ce résultat d’attaque. |
| `sound-attack-succes-critique` | Affichage | `--sound-attack-succes-critique SON` | définit le son utilisé pour ce résultat d’attaque. |
| `affaiblirCarac` | Effet | `--affaiblirCarac CARAC EXP` | affaiblit une caractéristique (ou random). |
| `dexterite` | Spécial | `--dexterite` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `dexterite` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `constitution` | Spécial | `--constitution` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `constitution` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `sagesse` | Spécial | `--sagesse` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `sagesse` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `intelligence` | Spécial | `--intelligence` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `intelligence` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `charisme` | Spécial | `--charisme` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `charisme` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `random` | Spécial | `--random` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `random` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `FOR` | Spécial | `--FOR` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `FOR` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `dextérité` | Spécial | `--dextérité` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `dextérité` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `DEX` | Spécial | `--DEX` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `DEX` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `CON` | Spécial | `--CON` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `CON` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `SAG` | Spécial | `--SAG` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `SAG` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `INT` | Spécial | `--INT` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `INT` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `CHA` | Spécial | `--CHA` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `CHA` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `rand` | Spécial | `--rand` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `rand` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `RAND` | Spécial | `--RAND` | Option reconnue par le parseur d’attaque. Elle pilote la logique spécialisée `RAND` ; utiliser sans argument sauf si la capacité ou le tableau ci-dessus précise une valeur. |
| `difficulteCarac` | Attaque | `--difficulteCarac CARAC` | utilise une caractéristique pour déterminer la difficulté opposée. |
| `attackId` | Interne | `--attackId ID` | identifiant stable de l’attaque pour les capacités qui ont besoin de retrouver la résolution. |
| `terrainDifficile` | Terrain | `--terrainDifficile [DUREE] [NOM_sans_espace] [IMG]` | crée un terrain difficile lié à l’attaque. |
| `deplaceDe` | Mouvement | `--deplaceDe MAX | --deplaceDe MIN MAX [saut]` | impose/autorise un déplacement avant l’attaque. |
| `draineMana` | Ressource | `--draineMana EXP` | draine des points de mana. |
| `+N` | Arme magique | `--+N` | déclare un bonus magique d’arme ; augmente aussi la portée des armes à distance selon la logique du moteur. |
| `flammeJumelle` | Spécial | `--flammeJumelle [Equipe]` | cible ennemie = attaque ; cible alliée = soin défini par --dm + régénération. |

## 19. Options génériques communes aux effets, soins et commandes de capacité

Les commandes qui utilisent `parseOptions` acceptent le vocabulaire ci-dessous. Une option inconnue peut parfois devenir un drapeau booléen interne ; pour une création durable, utiliser en priorité les formes documentées.

| Option | Forme / sens |
|---|---|
| `attaqueMentale` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `seulementVivant` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `repos` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `secret` | --secret : résultat chuchoté/masqué selon la commande. |
| `magique` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `sortilege` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `montreActions` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `brumes` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `silencieuxSiPasAffecte` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `regard` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `reaction` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `sansAO` | --sansAO : ne déclenche pas d’attaque d’opportunité. |
| `sansAo` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `sansao` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `lanceur` | --lanceur TOKEN_ID|NOM : précise l’origine d’un effet/soin. |
| `puissant` | --puissant [oui|non|duree|portee]. |
| `oui` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `non` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `duree` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `portee` | --portee M : portée maximale. |
| `mana` | --mana [LANCEUR] COUT : coût de mana. |
| `magieRapide` | --magieRapide [COUT] : magie rapide. |
| `tempeteDeMana` | --tempeteDeMana ... : paramètres de tempête de mana. |
| `rang` | --rang N : rang de la capacité. |
| `limiteParJour` | --limiteParJour N|PRED [ressource]. |
| `depasseLimite` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `limiteSoinsParJour` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `limiteCibleParJour` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `limiteParCombat` | --limiteParCombat [N|PRED] [ressource]. |
| `limiteParTour` | --limiteParTour [N|PRED] [ressource]. |
| `recharge` | --recharge 2..6 [id]. |
| `tempsRecharge` | --tempsRecharge EFFET DUREE. |
| `saveParTour` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `saveActifParTour` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `save` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `dose` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `decrAttribute` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `icone` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `icône` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `marker` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `marqueur` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `attr` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `attribut` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `carac` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `caracteristique` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `caractéristique` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `valeur` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `accumuleDuree` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `optionEffet` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `nonVivant` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `fx` | --fx NOM|custom NOM. |
| `targetFx` | --targetFx NOM|custom NOM. |
| `classeEffet` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `message` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `messageMJ` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `image` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `son` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `feu` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `air` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `eau` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `terre` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `ombre` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `lumiere` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `force` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `toxique` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `psychique` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `nature` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `necrotique` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `radiant` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `arcane` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `froid` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `acide` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `electrique` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `sonique` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `poison` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `maladie` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `drain` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `mental` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `argent` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `energie` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `bonus` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `rayon` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `etat` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `degainer` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `plusSoinSiPredicat` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `soin` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `dm` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `malusRepetition` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `magieEnArmure` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `tokenSide` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `terrainDifficile` | --terrainDifficile [duree] [nom] [image]. |
| `depensePR` | --depensePR [N] [PV_si_absence_PR] : dépense de PR avec coût de secours. |
| `activation` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `actif` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `fin` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `gardeCarac` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |
| `gardeCaracSiMeilleure` | Option générique reconnue par le moteur ; voir la capacité qui l’emploie pour sa valeur éventuelle. |

## 20. États reconnus — index complet

| État technique | Effet / rôle dans le moteur | Prédicat d’immunité typique |
|---|---|---|
| `assomme` | État historique incapacitant : le personnage est considéré inactif ; le token est verrouillé et certaines actions/trajectoires l’ignorent comme obstacle actif. | `immunite_assomme` quand la capacité teste cette famille |
| `mort` | État de mort ; retire le personnage de nombreuses résolutions actives. Les PJ utilisent d’abord le système V2 de blessures à 0 PV. | `immunite_mort` quand la capacité teste cette famille |
| `surpris` | Premier round : n’agit pas et DEF -20 % dans la refonte V2. | `immunite_surpris` quand la capacité teste cette famille |
| `renverse` | DEF -20 % ; action de mouvement pour se relever avant toute autre action. | `immunite_renverse` quand la capacité teste cette famille |
| `aveugle` | -20 % aux attaques au contact ; ne peut pas attaquer une cible à plus de 3 cases dans la refonte V2. | `immunite_aveugle` quand la capacité teste cette famille |
| `affaibli` | Tous les tests subissent -1d6. | `immunite_affaibli` quand la capacité teste cette famille |
| `etourdi` | Passe son prochain tour. | `immunite_etourdi` quand la capacité teste cette famille |
| `paralyse` | Pas de mouvement ni action physique ; actions mentales/parole possibles selon capacité ; DEF -20 %. | `immunite_paralyse` quand la capacité teste cette famille |
| `ralenti` | État d’entrave historique reconnu par les sauvegardes et Liberté d’action ; utilisé par plusieurs capacités anciennes. | `immunite_ralenti` quand la capacité teste cette famille |
| `immobilise` | Aucun déplacement ; les autres actions restent possibles. | `immunite_immobilise` quand la capacité teste cette famille |
| `endormi` | État historique de sommeil : personnage inactif/verrouillé ; plusieurs effets et immunités le ciblent. | `immunite_endormi` quand la capacité teste cette famille |
| `apeure` | État historique de peur incapacitant utilisé par d’anciennes capacités ; distinct de `effraye` V2. | `immunite_apeure` quand la capacité teste cette famille |
| `invisible` | Cible invisible : +10 DEF contre distance (+5 au contact), sauf détection/radar/tir aveugle ; attaquer depuis l’invisibilité peut donner +5 attaque et peut la rompre. | `immunite_invisible` quand la capacité teste cette famille |
| `blesse` | Marqueur persistant du système de blessure PJ. | `immunite_blesse` quand la capacité teste cette famille |
| `entrave` | Déplacement ÷2 ; Sprint impossible. | `immunite_entrave` quand la capacité teste cette famille |
| `agrippe` | Ne peut pas s’éloigner de l’agrippeur ; peut agir ou tenter de se libérer. | `immunite_agrippe` quand la capacité teste cette famille |
| `desarme` | Arme lâchée dans une case adjacente ; mouvement pour la récupérer. | `immunite_desarme` quand la capacité teste cette famille |
| `deborde` | Ne peut pas faire d’attaque d’opportunité. | `immunite_deborde` quand la capacité teste cette famille |
| `provoque` | Désavantage aux attaques ne visant pas le provocateur mémorisé. | `immunite_provoque` quand la capacité teste cette famille |
| `effraye` | Le mouvement doit éloigner de la source à déplacement ÷2 ; autres actions possibles. | `immunite_effraye` quand la capacité teste cette famille |
| `charme` | Mouvement vers le charmeur à déplacement ÷2 ; désavantage aux actions hostiles contre lui. | `immunite_charme` quand la capacité teste cette famille |
| `confus` | Début de tour 1d6 : 1–2 perd mouvement ; 3–4 perd action principale ; 5–6 normal. | `immunite_confus` quand la capacité teste cette famille |
| `silencieux` | Empêche les sorts nécessitant une incantation. | `immunite_silencieux` quand la capacité teste cette famille |
| `sommeil` | Pas d’action ni déplacement ; réveil par dégâts ou action adjacente. | `immunite_sommeil` quand la capacité teste cette famille |
| `expose` | Subit +20 % de dégâts. | `immunite_expose` quand la capacité teste cette famille |
| `volant` | Hors cible des attaques de contact ; une attaque de contact du volant suspend le vol jusqu’au tour suivant. | `immunite_volant` quand la capacité teste cette famille |
| `inconscient` | Marqueur V2 d’un PJ à 0 PV/non stabilisé ; utilisé avec les tests de survie. | `immunite_inconscient` quand la capacité teste cette famille |
| `stabilise` | PJ hors combat stabilisé ; en combat il ignore de nouveaux dégâts dans la logique V2. | `immunite_stabilise` quand la capacité teste cette famille |
| `encombre` | Pénalise notamment les tests de DEX dans le moteur. | `immunite_encombre` quand la capacité teste cette famille |
| `penombre` | État de luminosité ; intervient notamment sur les attaques à distance et effets de vision. | `immunite_penombre` quand la capacité teste cette famille |
| `enseveli` | Empêche l’attaque ; le moteur propose des jets pour se dégager. | `immunite_enseveli` quand la capacité teste cette famille |
| `TempeteCanalise` | Marqueur interne/état lié aux tempêtes canalisées. | `immunite_TempeteCanalise` quand la capacité teste cette famille |
| `chef` | Marque un leader/capitaine ; utilisé par les règles de commandement et certaines cibles de capacités. | `immunite_chef` quand la capacité teste cette famille |

## 21. Effets reconnus — noms utilisables dans les commandes

Ces noms sont les identifiants **exactement reconnus** par le moteur. Ils servent notamment avec `--effet`, `!cof-effet-temp`, `!cof-effet-combat` ou `!cof-effet`. Les effets génériques restent possibles dans les chemins qui les acceptent, mais ces listes sont les effets natifs.

### Temporaires (166)

`entraveTemp`, `renverseTemp`, `agrippeTemp`, `desarmeTemp`, `debordeTemp`, `provoqueTemp`, `effrayeTemp`, `charmeTemp`, `confusTemp`, `silencieuxTemp`, `sommeilTemp`, `surprisTemp`, `exposeTemp`, `aCouvert`, `affecteParAura`, `affaibliTemp`, `apeureTemp`, `assommeTemp`, `attaqueADistanceRatee`, `aveugleTemp`, `benediction`, `blessureSanglante`, `carquoisMagique`, `chantDesHeros`, `drainDeForce`, `drainDeForceSup`, `effetTempGenerique`, `modAttributTemp`, `endormiTemp`, `etourdiTemp`, `formeDAnge`, `formeHybride`, `formeOurs`, `formeTigre`, `formeAigle`, `marqueArcanique`, `marqueVindicte`, `sceauxVindicte`, `TempeteCanalise`, `TempeteFoudre`, `FrissonSylvestre`, `marqueduTraqueur`, `frappeDesArcanes`, `frenesieMinotaure`, `inspiration`, `imageDecalee`, `immobiliseTemp`, `immuniteAmaladie`, `immuniteApoison`, `lycanthropie`, `paradeCroisee`, `paralyseTemp`, `paralyseGoule`, `peauDEcorce`, `peauDEcorceAmeLiee`, `penombreTemp`, `peurEtourdi`, `poisonAffaiblissantLatent`, `poisonParalysant`, `protectionContreLesProjectiles`, `ralentiTemp`, `rapideCommeLeVent`, `rayonAffaiblissant`, `rituelAssure`, `secoue`, `secretsDeLAuDela`, `souffleDeMort`, `tremblementMineur`, `ventDesAmes`, `zoneDeVie`, `nauseeuxTemp`, `invisibleTemp`, `aveugleManoeuvre`, `bloqueManoeuvre`, `diversionManoeuvre`, `menaceManoeuvre`, `tenuADistanceManoeuvre`, `epeeDansante`, `rapiereDansante`, `putrefaction`, `forgeron`, `armeEnflammee`, `armeElectrique`, `armesEnflammees`, `dotGen`, `rechargeGen`, `dmgArme`, `flou`, `agrandissement`, `formeGazeuse`, `intangible`, `intangibleInvisible`, `sousTension`, `strangulation`, `ombreMortelle`, `dedoublement`, `zoneDeSilence`, `danseIrresistible`, `confusion`, `murDeForce`, `asphyxie`, `forceDeGeant`, `saignementsSang`, `encaisserUnCoup`, `seulContreTous`, `absorberUnCoup`, `absorberUnSort`, `nueeDInsectes`, `nueeDeCriquets`, `nueeDeScorpions`, `toiles`, `prisonVegetale`, `protectionContreLesElements`, `masqueMortuaire`, `masqueMortuaireAmeLiee`, `armeBrulante`, `armureBrulante`, `masqueDuPredateur`, `masqueDuPredateurAmeLiee`, `aspectDeLaSuccube`, `aspectDuDemon`, `sangMordant`, `armeSecreteBarde`, `regeneration`, `arbreAnime`, `objetAnime`, `magnetisme`, `hate`, `ailesCelestes`, `sanctuaire`, `rechargeSouffle`, `paralysieRoublard`, `mutationOffensive`, `formeDArbre`, `statueDeBois`, `clignotement`, `agitAZeroPV`, `predateurConjure`, `invocationGenerique`, `champDeProtection`, `attaqueArmeeConjuree`, `rechargeDuKiai`, `memePasMalBonus`, `attaqueRisquee`, `bondFelisDEF`, `peauDePierreMag`, `expose`, `effetRetarde`, `messageRetarde`, `detectionDeLInvisible`, `bonusAttaqueTemp`, `enerve`, `cercleDeProtection`, `tenebres`, `brumes`, `progresserACouvert`, `cyclone`, `momentDePerfection`, `armeeDesMorts`, `demonInvoque`, `degradationZombie`, `hemorragie`, `lienDeSang`, `tenirADistance`, `defieParGuerrier`, `reactionViolente`

### De combat (40)

`a0PVDepuis`, `armureMagique`, `armureDuFeu`, `ManteauRadieux`, `armureDuMage`, `armureDEau`, `armeDArgent`, `attaqueAOutrance`, `blessureQuiSaigne`, `bonusInitEmbuscade`, `bonusInitVariable`, `criDeGuerre`, `criDuPredateur`, `danseDesLames`, `detournerLeRegard`, `enflamme`, `enrage`, `fureurDrakonideCritique`, `malchance`, `protectionContreLeMal`, `putrefactionOutreTombe`, `rage`, `rageDuBerserk`, `defiDuelliste`, `defiSamourai`, `agrippe`, `estAgrippePar`, `devore`, `estDevorePar`, `ecrase`, `estEcrasePar`, `aGobe`, `estGobePar`, `inconfort`, `noyade`, `poisonAffaiblissant`, `jugeVindicte`, `ascensionSolaire`, `marqueVindicte`, `sceauxVindicte`

### À durée indéterminée (29)

`armesNaturelles`, `armureDeFeu`, `ManteauRadieux`, `charme`, `conditionsHostiles`, `constructionTailleHumaine`, `dominationPsy`, `fievreux`, `foretVivanteEnnemie`, `grandeTaille`, `lameDeLigneePerdue`, `marcheSylvestre`, `mutationCuirasse`, `mutationEcaillesRouges`, `mutationFourrureViolette`, `mutationMusclesHypertrophies`, `mutationOuies`, `mutationSangNoir`, `mutationSilhouetteFiliforme`, `mutationSilhouetteMassive`, `presenceGlaciale`, `sensDuDevoir`, `sixiemeSens`, `espaceExigu`, `sangDeLArbreCoeur`, `ondesCorruptrices`, `petrifie`, `poisonAffaiblissantLong`, `reactionAllergique`


## 22. Prédicats — grammaire et familles dynamiques

Le champ `predicats_script` est parsé ligne par ligne. Séparateurs acceptés : espaces et virgules. Les commentaires commencent par `//`. Les formes utiles sont :

```text
predicatBool
predicatNumerique:3
predicatComplexe::texte avec espaces
// commentaire
```

Si un prédicat numérique apparaît plusieurs fois, `predicateAsInt` retient la **plus grande valeur**. Les prédicats issus de l’arme active, de la main gauche, de la transformation et des objets peuvent être fusionnés avec ceux de la fiche.

### Familles paramétrées à connaître

| Famille | Valeur | Exemple | Rôle |
|---|---:|---|---|
| `immunite_<type>` | bool | `immunite_feu` | annule les dégâts de ce type compatible |
| `absorptionA_<type>` | bool | `absorptionA_feu` | transforme la composante reçue en absorption/soin |
| `resistanceA_<type>` | bool | `resistanceA_feu` | ajoute une division de dégâts |
| `vulnerableA_<type>` | bool | `vulnerableA_feu` | ×1,5 dégâts |
| `faiblesseMajeureA_<type>` | bool | `faiblesseMajeureA_feu` | ×2 dégâts, prioritaire sur vulnérabilité |
| `protectionDMZone_<type>` | bool | `protectionDMZone_feu` | division supplémentaire contre une zone |
| `diviseEffet_<type>` | bool | `diviseEffet_feu` | division spécialisée |
| `bonusSaveContre_<etat/type>` | entier | `bonusSaveContre_etourdi:2` | bonus aux sauvegardes correspondantes |
| `bonusTests_<competence/carac>` | entier | `bonusTests_PERCEPTION:2` | bonus aux tests ciblés |
| `bonus_<CARAC>` | entier | `bonus_FOR:1` | bonus au modificateur de caractéristique |
| `actionDegainerN` | texte/labels | `actionDegainer1::epee` | décrit une action de dégainage proposée par le moteur |


### Index de tous les identifiants/familles connus de la V2

| Prédicat / famille | Forme | Emploi moteur (premières occurrences) |
|---|---|---|
| `aberration` | Booléen ou valeur selon capacité | L12183: `case 'aberration':`; L12184: `return raceIs(perso, 'aberration') \|\| predicateAsBool(perso, 'aberration');` |
| `absorptionA_` | Famille paramétrée | L23990: `return predicateOrAttributeAsBool(target, 'absorptionA_' + type);` |
| `absorptionEnergie` | Booléen ou valeur selon capacité | L22350: `let absorptionEnergie = predicateAsInt(attaquant, 'absorptionEnergie', 0, 5);` |
| `actionDegainer` | Booléen ou valeur selon capacité | L30386: `let labels = predicateAsBool(perso, 'actionDegainer' + i);` |
| `actionLibre` | Booléen ou valeur selon capacité | L22114: `(predicateAsBool(target, 'actionLibre') && (ce.etat == 'ralenti' \|\| ce.etat == 'immobilise' \|\| ce.etat == 'paralyse')) \|`; L22222: `(predicateAsBool(target, 'liberteDAction') \|\| predicateAsBool(target, 'actionLibre'))` |
| `actionsPossiblesTransforme` | Booléen ou valeur selon capacité | L17480: `let p = predicateAsBool(perso, 'actionsPossiblesTransforme');` |
| `adaptable` | Booléen ou valeur selon capacité | L8252: `let adaptable = predicateAsInt(personnage, 'adaptable', 0);` |
| `agripper` | Booléen ou valeur selon capacité | L19758: `if (predicateAsBool(attaquant, 'agripper') \|\| options.peutAgripper)` |
| `allongeOpportunite` | Booléen ou valeur selon capacité | L51954: `let allonge = predicateAsInt(attacker, 'allongeOpportunite', 0, 1);` |
| `ambidextreDuelliste` | Booléen ou valeur selon capacité | L14583: `if (predicateAsBool(attaquant, 'ambidextreDuelliste')) {` |
| `ambidextrie` | Booléen ou valeur selon capacité | L11824: `if (predicateAsBool(perso, 'ambidextrie') \|\| predicateAsBool(perso, 'combatADeuxArmesAmeliore')) return;`; L11832: `if (predicateAsBool(perso, 'ambidextrie')) return;` |
| `ameFeline` | Booléen ou valeur selon capacité | L7272: `let a = predicateAsInt(personnage, 'ameFeline', 0);`; L12835: `init += predicateAsInt(perso, 'ameFeline', 0);` |
| `ameLieeAvec` | Booléen ou valeur selon capacité | L5457: `let lie = predicateAsBool(perso, 'ameLieeAvec');` |
| `ancreInvincible` | Booléen ou valeur selon capacité | L21120: `if (predicateAsBool(attaquant, 'perteDeSubstance') && !predicateAsBool(attaquant, 'ancreInvincible')) {`; L25388: `if (!target.perteDeSubstance && options.attaquant && predicateAsBool(target, 'ancreInvincible')) {` |
| `animal` | Booléen ou valeur selon capacité | L12175: `case 'animal':`; L19072: `if (predicateAsBool(perso, 'animal')) return true;` |
| `anneauProtection` | Booléen ou valeur selon capacité | L18013: `} else if (predicateAsBool(target, 'anneauProtection')) {` |
| `apparition` | Booléen ou valeur selon capacité | L17940: `(predicateAsBool(target, 'apparition') && !options.energiePositive)) {` |
| `arcDeMaitre` | Booléen ou valeur selon capacité | L6418: `if (weaponStats.arc && predicateAsBool(perso, 'arcDeMaitre')) {` |
| `argumentDeTaille` | Booléen ou valeur selon capacité | L7638: `if (predicateAsBool(perso, 'argumentDeTaille')) {`; L7663: `if (!predicateAsBool(allie, 'argumentDeTaille')) return;` |
| `armeDeLEte` | Booléen ou valeur selon capacité | L14388: `if (attaquant && predicateAsBool(target, 'armeDeLEte') && predicateAsBool(attaquant, 'creatureDeLHiver')) {`; L17977: `if (options.attaquant && predicateAsBool(options.attaquant, 'creatureDeLHiver') && predicateAsBool(target, 'armeDeLEte')` |
| `armeDePredilection` | Booléen ou valeur selon capacité | L14751: `let armeDePredilection = predicateAsBool(attaquant, 'armeDePredilection');` |
| `armeParDefaut` | Booléen ou valeur selon capacité | L26814: `let arme = predicateAsBool(persoTest, 'armeParDefaut');`; L56867: `let arme = predicateAsBool(perso, 'armeParDefaut');` |
| `armureDeVent` | Booléen ou valeur selon capacité | L13925: `defense += predicateAsInt(target, 'armureDeVent', 0);` |
| `armureLourdeGuerrier` | Booléen ou valeur selon capacité | L17997: `if (predicateAsBool(target, 'armureLourdeGuerrier') &&` |
| `armureProtection` | Booléen ou valeur selon capacité | L18007: `if (predicateAsBool(target, 'armureProtection') && ficheAttributeAsBool(target, 'defarmureon', false)) {` |
| `ascensionSolaire` | Booléen ou valeur selon capacité | L2246: `case 'ascensionSolaire':`; L14450: `return predicateAsBool(perso, 'ascensionSolaire') \|\|` |
| `asDeLaGachette` | Booléen ou valeur selon capacité | L18534: `return predicateAsBool(perso, 'asDeLaGachette') &&`; L58918: `if (c && c.includes('asDeLaGachette')) {` |
| `attaqueAuBouclier` | Booléen ou valeur selon capacité | L6524: `let attaqueBouclier = predicateAsBool(perso, 'attaqueAuBouclier');`; L11825: `if (predicateAsBool(perso, 'coupDeBouclier') && perso.armeGauche.label == predicateAsBool(perso, 'attaqueAuBouclier')) r` |
| `attaqueEnMeute` | Booléen ou valeur selon capacité | L17172: `let attaqueEnMeute = predicateAsInt(attaquant, 'attaqueEnMeute', 0, 2);`; L30181: `attaqueEnMeute = attaqueEnMeute \|\| charPredicateAsBool(charId, 'attaqueEnMeute');` |
| `attaquesOpportunite` | Booléen ou valeur selon capacité | L51900: `let p = predicateAsInt(attacker, 'attaquesOpportunite', 0, 1);` |
| `attaqueSournoise` | Booléen ou valeur selon capacité | L10740: `scope.sournoise += predicateAsInt(attaquant, 'attaqueSournoise', 1);`; L10773: `options.attaqueAcrobatique = predicateAsInt(attaquant, 'attaqueSournoise', 1);` |
| `attaqueViolente` | Booléen ou valeur selon capacité | L19764: `if (predicateAsBool(attaquant, 'attaqueViolente'))` |
| `aucuneActionCombat` | Booléen ou valeur selon capacité | L12926: `if (predicateAsBool(perso, 'aucuneActionCombat')) return;` |
| `auDessusDeLaMelee` | Booléen ou valeur selon capacité | L24088: `if (options.attaquant && predicateAsBool(target, 'auDessusDeLaMelee')) {` |
| `auraDeProfanation` | Booléen ou valeur selon capacité | L23503: `return predicateAsBool(p, 'auraDeProfanation');` |
| `auraDrainDeForce` | Booléen ou valeur selon capacité | L4160: `(predicateAsBool(personnage, 'auraDrainDeForce') \|\| attributeAsBool(personnage, 'aura'))`; L12998: `} else if (predicateAsBool(perso, 'auraDrainDeForce')) {` |
| `auraDrainDeForceSup` | Booléen ou valeur selon capacité | L12989: `if (predicateAsBool(perso, 'auraDrainDeForceSup')) {`; L28616: `case 'auraDrainDeForceSup':` |
| `autoriteNaturelle` | Booléen ou valeur selon capacité | L7360: `if (predicateAsBool(personnage, 'autoriteNaturelle')) {`; L12854: `if (predicateAsBool(perso, 'autoriteNaturelle')) {` |
| `baroudHonneur` | Booléen ou valeur selon capacité | L25265: `if (predicateAsBool(target, 'baroudHonneur')) {` |
| `batonDesRunesMortes` | Booléen ou valeur selon capacité | L7355: `if (predicateAsBool(personnage, 'batonDesRunesMortes') &&`; L13323: `if (predicateAsBool(perso, 'batonDesRunesMortes') && attributeAsBool(perso, 'runeMelianil')) {` |
| `benedictionSuperieure` | Booléen ou valeur selon capacité | L12043: `let bene = predicateAsInt(attaquant, 'benedictionSuperieure', 0);` |
| `blessureSanglante` | Booléen ou valeur selon capacité | L20711: `case 'blessureSanglante':`; L25658: `predicateAsBool(options.attaquant, 'blessureSanglante') &&` |
| `bonus_` | Famille paramétrée | L1094: `mod += predicateAsInt(perso, 'bonus_' + modCarac, 0);`; L31944: `let b = attributeAsInt(perso, 'bonus_' + c, 0);` |
| `bonus_DEF` | Valeur attendue | L14386: `defense += predicateAsInt(target, 'bonus_DEF', 0);` |
| `bonus_DEF(anneau)` | Booléen ou valeur selon capacité | L14387: `defense += predicateAsInt(target, 'bonus_DEF(anneau)', 0);` |
| `bonus_RD` | Valeur attendue | L23810: `predicatesNamed(perso, 'bonus_RD').forEach(function (r) {` |
| `bonusAttaqueBouclier` | Booléen ou valeur selon capacité | L38100: `attBonus += predicateAsInt(lanceur, 'bonusAttaqueBouclier', 0);` |
| `bonusAttaqueMagique` | Booléen ou valeur selon capacité | L6289: `attDiv += predicateAsInt(attaquant, 'bonusAttaqueMagique', 0);`; L18336: `atkmag += predicateAsInt(attaquant, 'bonusAttaqueMagique', 0);` |
| `bonusDMSous50PV` | Booléen ou valeur selon capacité | L17915: `let bonusDMSous50PV = predicateAsInt(options.attaquant, 'bonusDMSous50PV', 0);` |
| `bonusFeinte` | Booléen ou valeur selon capacité | L15295: `let bonusFeinte = predicateAsInt(attaquant, 'bonusFeinte', 5);`; L58634: `if (nom == 'bonusFeinte') {` |
| `bonusInitiative` | Valeur attendue | L12861: `init += predicateAsInt(perso, 'bonusInitiative', 0);` |
| `bonusSaveContre_` | Famille paramétrée | L22612: `bonus: predicateAsInt(target, 'bonusSaveContre_' + ce.etat, 0),`; L23649: `bonusPreds.push('bonusSaveContre_' + options.type);` |
| `bonusSlotsConsommables` | Booléen ou valeur selon capacité | famille construite dynamiquement ou alimentée par CoFItem/Monster Creator |
| `bonusTests_` | Famille paramétrée | L7247: `let bonus = predicateAsInt(personnage, 'bonusTests_' + comp, 0);`; L7253: `bonus += predicateAsInt(personnage, 'bonusTests_' + compNormalisee, 0);` |
| `bonusTests_CHA` | Booléen ou valeur selon capacité | L7833: `let bonusCHA = predicateAsInt(personnage, 'bonusTests_CHA', 0) + predicateAsInt(personnage, 'bonusTests_charisme', 0);` |
| `bonusTests_charisme` | Booléen ou valeur selon capacité | L7833: `let bonusCHA = predicateAsInt(personnage, 'bonusTests_CHA', 0) + predicateAsInt(personnage, 'bonusTests_charisme', 0);` |
| `bonusTests_CON` | Booléen ou valeur selon capacité | L7862: `let bonusCON = predicateAsInt(personnage, 'bonusTests_CON', 0) + predicateAsInt(personnage, 'bonusTests_constitution', 0` |
| `bonusTests_constitution` | Booléen ou valeur selon capacité | L7862: `let bonusCON = predicateAsInt(personnage, 'bonusTests_CON', 0) + predicateAsInt(personnage, 'bonusTests_constitution', 0` |
| `bonusTests_DEX` | Booléen ou valeur selon capacité | L7695: `let bonusDEX = predicateAsInt(personnage, 'bonusTests_DEX', 0) + Math.max(predicateAsInt(personnage, 'bonusTests_dexteri` |
| `bonusTests_dexterite` | Booléen ou valeur selon capacité | L7695: `let bonusDEX = predicateAsInt(personnage, 'bonusTests_DEX', 0) + Math.max(predicateAsInt(personnage, 'bonusTests_dexteri` |
| `bonusTests_dexterité` | Booléen ou valeur selon capacité | L7695: `let bonusDEX = predicateAsInt(personnage, 'bonusTests_DEX', 0) + Math.max(predicateAsInt(personnage, 'bonusTests_dexteri` |
| `bonusTests_FOR` | Booléen ou valeur selon capacité | L7749: `let bonusFOR = predicateAsInt(personnage, 'bonusTests_FOR', 0) + predicateAsInt(personnage, 'bonusTests_force', 0);` |
| `bonusTests_force` | Booléen ou valeur selon capacité | L7749: `let bonusFOR = predicateAsInt(personnage, 'bonusTests_FOR', 0) + predicateAsInt(personnage, 'bonusTests_force', 0);` |
| `bonusTests_INT` | Booléen ou valeur selon capacité | L7816: `let bonusINT = predicateAsInt(personnage, 'bonusTests_INT', 0) + predicateAsInt(personnage, 'bonusTests_intelligence', 0` |
| `bonusTests_intelligence` | Booléen ou valeur selon capacité | L7816: `let bonusINT = predicateAsInt(personnage, 'bonusTests_INT', 0) + predicateAsInt(personnage, 'bonusTests_intelligence', 0` |
| `bonusTests_SAG` | Booléen ou valeur selon capacité | L7897: `let bonusSAG = predicateAsInt(personnage, 'bonusTests_SAG', 0) + predicateAsInt(personnage, 'bonusTests_sagesse', 0);` |
| `bonusTests_sagesse` | Booléen ou valeur selon capacité | L7897: `let bonusSAG = predicateAsInt(personnage, 'bonusTests_SAG', 0) + predicateAsInt(personnage, 'bonusTests_sagesse', 0);` |
| `bonusTousTests` | Valeur attendue | L7477: `let bonus = predicateAsInt(personnage, 'bonusTousTests', 0);` |
| `botteMortelle` | Booléen ou valeur selon capacité | L19911: `predicateAsBool(attaquant, 'botteMortelle')) {` |
| `botteMortelleEtFeinte` | Booléen ou valeur selon capacité | L19927: `} else if (predicateAsBool(attaquant, 'botteMortelleEtFeinte') && target.feinte) {` |
| `botteSecrete` | Booléen ou valeur selon capacité | L21594: `if (target.critique && sournoise === 0 && predicateAsBool(attaquant, 'botteSecrete')) {` |
| `bouclierDeLaFoi` | Booléen ou valeur selon capacité | L13714: `defense += predicateAsInt(perso, 'bouclierDeLaFoi', 0, 1);`; L14008: `else defBouclierProtecteur = ficheAttributeAsInt(protecteur, 'defbouclier', 0) + predicateAsInt(protecteur, 'bouclierDeL` |
| `bouclierProtection` | Booléen ou valeur selon capacité | L18010: `} else if (predicateAsBool(target, 'bouclierProtection') && ficheAttributeAsInt(target, 'defbouclieron', 0)) {`; L18017: `if (predicateAsBool(target, 'bouclierProtection') && ficheAttributeAsBool(target, 'defbouclieron', false)) {` |
| `bouclierPsi` | Booléen ou valeur selon capacité | L13956: `if ((options.attaqueMentale \|\| options.psychique) && predicateAsBool(target, 'bouclierPsi')) {` |
| `boutefeu` | Booléen ou valeur selon capacité | L14712: `if (options.sortilege && options.type == 'feu' && predicateAsBool(attaquant, 'boutefeu')) {`; L21228: `if (predicateAsBool(attaquant, 'boutefeu')) {` |
| `braiseSolaire` | Booléen ou valeur selon capacité | L14489: `if (!predicateAsBool(attaquant, 'braiseSolaire')) return;`; L15638: `if (opt.predicat === 'braiseSolaire')` |
| `briseurDOs` | Booléen ou valeur selon capacité | L18236: `(predicateAsBool(attaquant, 'morsureDuSerpent') \|\| predicateAsBool(attaquant, 'briseurDOs'))) \|\|`; L19828: `if (predicateAsBool(attaquant, 'briseurDOs')) {` |
| `bucheron` | Booléen ou valeur selon capacité | L21749: `if (predicateAsBool(attaquant, 'bucheron')) {` |
| `cavalierEmerite` | Booléen ou valeur selon capacité | L14877: `let cavalierEm = predicateAsInt(attaquant, 'cavalierEmerite');` |
| `chairACanon` | Booléen ou valeur selon capacité | L14191: `if (capaciteDisponible(target, 'chairACanon', 'tour')) {`; L20159: `if (capaciteDisponible(target, 'chairACanon', 'tour') &&` |
| `champion` | Booléen ou valeur selon capacité | L19755: `if (predicateAsBool(attaquant, 'champion'))` |
| `chasseurDeSorciere` | Booléen ou valeur selon capacité | L14044: `if (predicateAsBool(target, 'chasseurDeSorciere')) {`; L21664: `if (predicateAsBool(attaquant, 'chasseurDeSorciere') && predicateAsBool(target, 'necromancien')) {` |
| `chasseurEmerite` | Booléen ou valeur selon capacité | L14990: `predicateAsBool(attaquant, 'chasseurEmerite') && estAnimal(target);` |
| `chatimentDuMale` | Booléen ou valeur selon capacité | L17227: `if (predicateAsBool(attaquant, 'chatimentDuMale')) options.chatimentDuMale = true;` |
| `chimiste` | Booléen ou valeur selon capacité | L19466: `if (options.poudre && !predicateAsBool(attaquant, 'chimiste')) {` |
| `ciblesMultiples` | Booléen ou valeur selon capacité | L25651: `if (!options.aoe && dmgTotal > 1 && predicateAsBool(target, 'ciblesMultiples')) {` |
| `coefPVMana` | Valeur attendue | L6461: `degats = Math.ceil(degats / predicateAsInt(personnage, 'coefPVMana', 1));` |
| `combatADeuxArmes` | Booléen ou valeur selon capacité | L30892: `if (predicateAsBool(perso, 'combatADeuxArmes')) {` |
| `combatADeuxArmesAmeliore` | Booléen ou valeur selon capacité | L11824: `if (predicateAsBool(perso, 'ambidextrie') \|\| predicateAsBool(perso, 'combatADeuxArmesAmeliore')) return;` |
| `combatEnPhalange` | Booléen ou valeur selon capacité | L14088: `let combatEnPhalange = predicateAsBool(target, 'combatEnPhalange');`; L15359: `if (predicateAsBool(attaquant, 'combatEnPhalange')) {` |
| `combatKinetique` | Booléen ou valeur selon capacité | L25411: `if (target.attaquant && predicateAsBool(target, 'combatKinetique') &&` |
| `combattreLaCorruption` | Booléen ou valeur selon capacité | L15114: `predicateAsInt(attaquant, 'combattreLaCorruption', 0, 1);` |
| `commandant` | Booléen ou valeur selon capacité | L13337: `if (bonusCapitaine > 2) msgCapitaine += "commandant";`; L25537: `if (predicateAsBool(target, 'commandant')) {` |
| `connaissanceDuPoison` | Booléen ou valeur selon capacité | L38841: `if (predicateAsBool(perso, 'connaissanceDuPoison')) {` |
| `controleDuMetabolisme` | Booléen ou valeur selon capacité | L7871: `if (predicateAsBool(personnage, 'controleDuMetabolisme')) {`; L12819: `if (predicateAsBool(perso, 'controleDuMetabolisme')) {` |
| `controleSanguin` | Booléen ou valeur selon capacité | L17829: `if (predicateOrAttributeAsBool(target, 'controleSanguin')) return true;`; L20504: `predicateAsBool(perso, 'controleSanguin');` |
| `corpsElementaire` | Booléen ou valeur selon capacité | L19164: `let typeCorpsElem = predicateAsBool(attaquant, 'corpsElementaire');`; L22554: `let typeCorpsElem = predicateAsBool(target, 'corpsElementaire');` |
| `corrompu` | Booléen ou valeur selon capacité | L15116: `(predicateAsBool(target, 'corrompu') \|\|`; L48217: `if (tr.reussite \|\| !predicateAsBool(cible, 'corrompu')) {` |
| `coupDeBouclier` | Booléen ou valeur selon capacité | L11825: `if (predicateAsBool(perso, 'coupDeBouclier') && perso.armeGauche.label == predicateAsBool(perso, 'attaqueAuBouclier')) r` |
| `courage` | Booléen ou valeur selon capacité | L34476: `optionsPeur.bonus += predicateAsInt(target, 'courage', 0);` |
| `creatureArtificielle` | Booléen ou valeur selon capacité | L12195: `return raceIs(perso, 'artificiel') \|\| predicateAsBool(perso, 'creatureArtificielle');`; L17827: `if (predicateAsBool(target, 'creatureArtificielle')) return true;` |
| `creatureDeLHiver` | Booléen ou valeur selon capacité | L14388: `if (attaquant && predicateAsBool(target, 'armeDeLEte') && predicateAsBool(attaquant, 'creatureDeLHiver')) {`; L17977: `if (options.attaquant && predicateAsBool(options.attaquant, 'creatureDeLHiver') && predicateAsBool(target, 'armeDeLEte')` |
| `creatureIntangible` | Booléen ou valeur selon capacité | L13732: `if (target.defautCuirasse === undefined && (!attaquant \|\| !predicateAsBool(attaquant, 'creatureIntangible'))) {`; L13733: `if (!attaquant \|\| !predicateAsBool(attaquant, 'creatureIntangible')) {` |
| `critiqueEpiqueSorts` | Booléen ou valeur selon capacité | L18066: `if (options.sortilege && options.attaquant && predicateAsBool(options.attaquant, 'critiqueEpiqueSorts')) {`; L18254: `if (predicateAsBool(attaquant, 'critiqueEpiqueSorts')) crit -= 2;` |
| `crocEnJambe` | Booléen ou valeur selon capacité | L19785: `predicateAsBool(attaquant, 'crocEnJambe') && !predicateAsBool(target, 'volant')) {` |
| `deCanalisation` | Booléen ou valeur selon capacité | L47033: `let deParPM = predicateAsBool(pretre, 'deCanalisation');` |
| `DEF` | Valeur attendue | L14019: `if (posture.startsWith('DEF')) {`; L14023: `} else if (posture.endsWith('DEF')) {` |
| `DEF_magie` | Valeur attendue | L14043: `defense += predicateAsInt(target, 'DEF_magie', 0);` |
| `defDeriveeDe` | Booléen ou valeur selon capacité | L13795: `let defDerivee = predicateAsBool(target, 'defDeriveeDe');` |
| `defenseIntuitive` | Booléen ou valeur selon capacité | L13936: `if (predicateAsBool(target, 'defenseIntuitive')) {` |
| `defierLaMort` | Booléen ou valeur selon capacité | L25317: `if (predicateAsBool(target, 'defierLaMort')) {`; L25318: `let defierLaMort = charAttributeAsInt(target, 'defierLaMort', 10);` |
| `dentellesEtRapiere` | Booléen ou valeur selon capacité | L13927: `defense += predicateAsInt(target, 'dentellesEtRapiere', 0);` |
| `devorer` | Booléen ou valeur selon capacité | L19760: `if (predicateAsBool(attaquant, 'devorer'))` |
| `difficulteOmbreMouvante` | Booléen ou valeur selon capacité | L45425: `let difficulte = predicateAsInt(voleur, 'difficulteOmbreMouvante', 10);` |
| `diviseEffet_` | Famille paramétrée | L20589: `(predicateAsBool(target, 'diviseEffet_' + ef.typeDmg) \|\|`; L23997: `predicateAsBool(target, 'diviseEffet_' + type);` |
| `diviseEffet_elementaire` | Booléen ou valeur selon capacité | L20590: `(estElementaire(ef.typeDmg) && predicateAsBool(target, 'diviseEffet_elementaire')))`; L24046: `if (predicateAsBool(target, 'invulnerable') \|\| predicateAsBool(target, 'diviseEffet_elementaire')) {` |
| `dragon` | Booléen ou valeur selon capacité | L12207: `case 'dragon':`; L18838: `if (predicateAsBool(perso, 'dragon')) return true;` |
| `dragonInvincble` | Booléen ou valeur selon capacité | L25389: `if (predicateAsBool(options.attaquant, 'dragonInvincble')) {` |
| `dragonInvincible` | Booléen ou valeur selon capacité | L19586: `if (predicateAsBool(attaquant, 'dragonInvincible')) {` |
| `drainDeSang` | Booléen ou valeur selon capacité | L20713: `if (ef.attaquant && predicateAsBool(ef.attaquant, 'drainDeSang')) {` |
| `durACuire` | Booléen ou valeur selon capacité | L25279: `} else if ((attributeAsBool(target, 'enrage') \|\| predicateAsBool(target, 'durACuire')) &&` |
| `démon` | Booléen ou valeur selon capacité | L12205: `case 'démon':`; L18818: `if (predicateAsBool(perso, 'démon')) return true;` |
| `ecraser` | Booléen ou valeur selon capacité | L19780: `let ecraser = predicateAsBool(attaquant, 'ecraser');`; L30713: `let ecraser = predicateAsBool(perso, 'ecraser');` |
| `ecuyer` | Booléen ou valeur selon capacité | L18237: `(crit == 20 && predicateAsBool(attaquant, 'ecuyer'))) crit -= 1;` |
| `ecuyerDe` | Booléen ou valeur selon capacité | L28223: `let ecuyerDe = predicateAsBool(perso, 'ecuyerDe');` |
| `effigie` | Booléen ou valeur selon capacité | L16250: `if (predicateAsBool(effigie, 'effigie')) return true;` |
| `elfe` | Booléen ou valeur selon capacité | L13583: `case 'elfe':`; L18940: `if (predicateAsBool(perso, 'elfe')) return true;` |
| `elfeNoir` | Booléen ou valeur selon capacité | L18923: `if (predicateAsBool(perso, 'elfeNoir')) return true;` |
| `embuscade` | Booléen ou valeur selon capacité | L7343: `if (predicateAsBool(personnage, 'embuscade')) {`; L12846: `init += predicateAsInt(perso, 'embuscade', 0, 0);` |
| `emissaireDuDragonInvincible` | Booléen ou valeur selon capacité | L25392: `} else if (predicateAsBool(options.attaquant, 'emissaireDuDragonInvincible')) {` |
| `enchainement` | Booléen ou valeur selon capacité | L23213: `predicateAsBool(attaquant, 'enchainement')) {` |
| `energieDeLaMort` | Booléen ou valeur selon capacité | L24519: `if (predicateAsBool(personnage, 'energieDeLaMort')) {` |
| `energieImpie` | Booléen ou valeur selon capacité | L14514: `let energieImpie = attributeAsInt(attaquant, 'energieImpie', 0);`; L17879: `if (predicateAsBool(d.drainDeSang, 'energieImpie')) {` |
| `ennemiDuBatonDesRunesMortes` | Booléen ou valeur selon capacité | L17805: `predicateAsBool(target, 'ennemiDuBatonDesRunesMortes');`; L17966: `predicateAsBool(options.attaquant, 'ennemiDuBatonDesRunesMortes') &&` |
| `espritVide` | Booléen ou valeur selon capacité | L12837: `init += predicateAsInt(perso, 'espritVide', 0, 3);` |
| `esquive` | Booléen ou valeur selon capacité | L23469: `bonus1 += predicateAsInt(personnage, 'esquive', 0);`; L23475: `bonus2 += predicateAsInt(personnage, 'esquive', 0);` |
| `esquiveDeLaMagie` | Booléen ou valeur selon capacité | L17981: `if (options.sortilege && predicateAsBool(target, 'esquiveDeLaMagie'))`; L20102: `if (options.sortilege && predicateAsBool(target, 'esquiveDeLaMagie')) {` |
| `esquiveVoleur` | Booléen ou valeur selon capacité | L13929: `defense += predicateAsInt(target, 'esquiveVoleur', 0);`; L23468: `bonus1 += predicateAsInt(personnage, 'esquiveVoleur', 0);` |
| `estUneIllusion` | Booléen ou valeur selon capacité | L20034: `} else if (predicateAsBool(target, 'estUneIllusion')) {` |
| `exemplaire` | Booléen ou valeur selon capacité | L17177: `predicateAsBool(attaquant, 'exemplaire')) {`; L20888: `if (!charPredicateAsBool(charId, 'exemplaire')) return;` |
| `expertDuCombat` | Booléen ou valeur selon capacité | L20088: `if (predicateAsBool(target, 'expertDuCombat') &&`; L23190: `if (predicateAsInt(perso, 'expertDuCombat', 0) > 0 &&` |
| `expertiseSpecialisee` | Booléen ou valeur selon capacité | L7460: `predicateAsBool(personnage, 'expertiseSpecialisee');`; L14567: `if (predicateAsBool(attaquant, 'expertiseSpecialisee') == 'furieDuBerserk') bonus += 2;` |
| `explosionFinale` | Booléen ou valeur selon capacité | L4102: `if (predicateAsBool(personnage, 'explosionFinale')) {`; L4103: `let label = predicateAsBool(personnage, 'explosionFinale');` |
| `exsangue` | Booléen ou valeur selon capacité | L25295: `} else if (predicateAsBool(target, 'exsangue') && !attributeAsBool(target, 'etatExsangue')) {` |
| `faiblesseMajeureA_` | Famille paramétrée | L24005: `return predicateOrAttributeAsBool(target, 'faiblesseMajeureA_' + type);` |
| `faireMouche` | Booléen ou valeur selon capacité | L15045: `let faireMouche = predicateAsInt(attaquant, 'faireMouche', 0);`; L19825: `faireMouche = predicateAsInt(attaquant, 'faireMouche', 0);` |
| `familier` | Booléen ou valeur selon capacité | L11149: `let origine = compagnonPresent(attaquant, 'familier');`; L12802: `if (compagnonPresent(perso, 'familier')) init += 2;` |
| `fauchage` | Booléen ou valeur selon capacité | L16280: `let deFauchage = predicateAsInt(attaquant, 'fauchage', 0, 15);`; L42069: `name: 'fauchage',` |
| `fievreChene` | Booléen ou valeur selon capacité | L23785: `if (predicateAsBool(perso, 'fievreChene')) res.feu = (res.feu \|\| 0) + 5;` |
| `formeHybrideSuperieure` | Booléen ou valeur selon capacité | L7741: `if (predicateAsBool(personnage, 'formeHybrideSuperieure')) b = 4;`; L12848: `if (predicateAsBool(perso, 'formeHybrideSuperieure')) init += 10;` |
| `fortifiantAvance` | Booléen ou valeur selon capacité | L39799: `if (predicateAsBool(forgesort, 'fortifiantAvance')) {` |
| `frappeChirurgicale` | Booléen ou valeur selon capacité | L18240: `if (options.contact && !weaponStats.armeGauche && predicateAsBool(attaquant, 'frappeChirurgicale'))` |
| `frappeDuVide` | Booléen ou valeur selon capacité | L3476: `predicateAsBool(perso, 'frappeDuVide') &&`; L17165: `if (options.contact && weaponStats.arme && predicateAsBool(attaquant, 'frappeDuVide')) {` |
| `frenesie` | Booléen ou valeur selon capacité | L14910: `let frenesie = predicateAsInt(attaquant, 'frenesie', 0);` |
| `fureurDrakonide` | Booléen ou valeur selon capacité | L14741: `if (predicateAsBool(attaquant, 'fureurDrakonide')) {`; L18050: `if (predicateAsBool(target, 'fureurDrakonide')) {` |
| `fée` | Booléen ou valeur selon capacité | L12213: `case 'fée':`; L18798: `if (predicateAsBool(perso, 'fée')) return true;` |
| `gardeEliteVengeance` | Booléen ou valeur selon capacité | L14136: `return predicateAsBool(p, 'gardeEliteVengeance');` |
| `generalVengeance` | Booléen ou valeur selon capacité | L14089: `let generalVengeance = predicateAsBool(target, 'generalVengeance');`; L24022: `if (predicateAsBool(target, 'generalVengeance')) {` |
| `gobelin` | Booléen ou valeur selon capacité | L12218: `case 'gobelin':`; L18898: `if (predicateAsBool(perso, 'gobelin')) return true;` |
| `gober` | Booléen ou valeur selon capacité | L19762: `if (predicateAsBool(attaquant, 'gober'))` |
| `graceFeline` | Booléen ou valeur selon capacité | L12808: `if (predicateAsBool(perso, 'graceFeline')) {`; L13930: `if (predicateAsBool(target, 'graceFeline')) {` |
| `graceFelineVoleur` | Booléen ou valeur selon capacité | L7261: `if (predicateAsBool(personnage, 'graceFelineVoleur')) {` |
| `grosMonstreGrosseArme` | Booléen ou valeur selon capacité | L21764: `if (predicateAsBool(attaquant, 'grosMonstreGrosseArme')) {` |
| `grosseTete` | Booléen ou valeur selon capacité | L7781: `if (predicateAsBool(personnage, 'grosseTete')) {` |
| `guetteur` | Booléen ou valeur selon capacité | L7411: `if (compagnonPresent(personnage, 'guetteur')) {`; L7416: `if (lie && compagnonPresent(lie, 'guetteur')) {` |
| `géant` | Booléen ou valeur selon capacité | L12215: `case 'géant':`; L18877: `if (predicateAsBool(perso, 'géant')) return true;` |
| `hachesEtMarteaux` | Booléen ou valeur selon capacité | L14685: `if ((options.marteau \|\| options.hache) && predicateAsBool(attaquant, 'hachesEtMarteaux')) {` |
| `hausserLeTon` | Booléen ou valeur selon capacité | L14728: `if (predicateAsBool(attaquant, 'hausserLeTon')) {`; L25406: `if (predicateAsBool(target, 'hausserLeTon')) {` |
| `hemorragiePestrilax` | Booléen ou valeur selon capacité | L22172: `if (predicateAsBool(attaquant, 'hemorragiePestrilax') && !immuniseAuxSaignements(target)) {` |
| `horsDePortee` | Booléen ou valeur selon capacité | L13965: `if (options.contact && predicateAsBool(target, "horsDePortee")) {` |
| `humanoide` | Booléen ou valeur selon capacité | L12201: `case 'humanoide':`; L12203: `return raceIs(perso, 'humanoide') \|\| raceIs(perso, 'humanoïde');` |
| `ignorerLaDouleur` | Booléen ou valeur selon capacité | L23264: `predicateAsBool(target, 'ignorerLaDouleur') &&` |
| `imageDecaleeAvancee` | Booléen ou valeur selon capacité | L20022: `(!options.aoe \|\| !persoArran(target) \|\| predicateAsBool(target, 'imageDecaleeAvancee'))` |
| `immunite_` | Famille paramétrée | L3674: `if (value && predicateAsBool(personnage, 'immunite_' + etat)) {`; L17808: `return predicateAsBool(target, 'immunite_' + type);` |
| `immunite_contondant` | Booléen ou valeur selon capacité | L17816: `if (options.contondant && predicateAsBool(target, 'immunite_contondant')) return true;` |
| `immunite_destruction` | Booléen ou valeur selon capacité | L38614: `if (predicateAsBool(cible, 'immunite_destruction')) {` |
| `immunite_endormi` | Booléen ou valeur selon capacité | L35171: `if (estNonVivant(perso) \|\| predicateAsBool(perso, 'immunite_endormi')) {` |
| `immunite_magique` | Booléen ou valeur selon capacité | L17959: `if (degatsMagiques && predicateAsBool(target, 'immunite_magique')) {` |
| `immunite_mental` | Booléen ou valeur selon capacité | L16857: `if (predicateAsBool(target, 'immunite_mental')) {`; L17850: `if ((options.attaqueMentale \|\| options.psychique) && (predicateAsBool(target, 'immunite_mental') \|\| predicateAsBool(targ` |
| `immunite_percant` | Booléen ou valeur selon capacité | L17817: `if (options.percant && predicateAsBool(target, 'immunite_percant')) return true;` |
| `immunite_petrification` | Booléen ou valeur selon capacité | L20463: `predicateAsBool(target, 'immunite_petrification')) return true;` |
| `immunite_peur` | Booléen ou valeur selon capacité | L34421: `predicateAsBool(target, 'immunite_peur') \|\|`; L58347: `parChar[charId].add('immunite_peur');` |
| `immunite_psychique` | Booléen ou valeur selon capacité | L17850: `if ((options.attaqueMentale \|\| options.psychique) && (predicateAsBool(target, 'immunite_mental') \|\| predicateAsBool(targ` |
| `immunite_surpris` | Booléen ou valeur selon capacité | L29994: `if (predicateAsBool(perso, 'immunite_surpris')) {`; L58355: `parChar[charId].add('immunite_surpris');` |
| `immunite_tranchant` | Booléen ou valeur selon capacité | L17815: `if (options.tranchant && predicateAsBool(target, 'immunite_tranchant')) return true;` |
| `immunite_tueurFantasmagorique` | Booléen ou valeur selon capacité | L34910: `if (predicateAsBool(cible, 'immunite_tueurFantasmagorique')) {` |
| `immuniteAbsorptionVampire` | Booléen ou valeur selon capacité | L22353: `(predicateAsBool(attaquant, 'vampire') && predicateAsBool(target, 'immuniteAbsorptionVampire'))` |
| `immuniteAuxArmes` | Booléen ou valeur selon capacité | L20417: `if (!options.sortilege && predicateAsBool(target, 'immuniteAuxArmes')) {`; L21859: `predicateAsBool(target, 'immuniteAuxArmes')) {` |
| `immuniteAuxCritiques` | Booléen ou valeur selon capacité | L18001: `} else if (predicateAsBool(target, 'immuniteAuxCritiques')) {` |
| `immuniteAuxSournoises` | Booléen ou valeur selon capacité | L21618: `if (predicateAsBool(target, 'immuniteAuxSournoises')) {` |
| `immuniteMagieGolem` | Booléen ou valeur selon capacité | L21435: `predicateAsBool(target, 'immuniteMagieGolem') &&`; L23541: `if (options.magique && predicateAsBool(target, 'immuniteMagieGolem')) {` |
| `immuniteSaignement` | Booléen ou valeur selon capacité | L20503: `return predicateAsBool(perso, 'immuniteSaignement') \|\|`; L55503: `if (charPredicateAsBool(charId, 'immuniteSaignement') \|\|` |
| `increvable` | Booléen ou valeur selon capacité | L25271: `} else if (predicateAsBool(target, 'increvable') && attributeAsInt(target, 'limiteParCombat__increvable', predicateAsInt`; L25276: `let restants = attributeAsInt(target, 'limiteParCombat__increvable', predicateAsInt(target, 'increvable', 1));` |
| `increvableHumain` | Booléen ou valeur selon capacité | L25818: `predicateAsBool(target, 'increvableHumain') &&` |
| `inderacinable` | Booléen ou valeur selon capacité | L21475: `if (predicateAsBool(target, 'inderacinable')) {` |
| `initiativeDeriveeDe` | Booléen ou valeur selon capacité | L12699: `let initDerivee = predicateAsBool(perso, 'initiativeDeriveeDe');`; L12723: `let nomSource = predicateAsBool(perso, 'initiativeDeriveeDe');` |
| `insecte` | Booléen ou valeur selon capacité | L12220: `case 'insecte':`; L18951: `if (predicateAsBool(perso, 'insecte')) return true;` |
| `insensibleAffaibli` | Booléen ou valeur selon capacité | L7978: `if ((estAffaibli(personnage) && !predicateAsBool(personnage, 'insensibleAffaibli')) \|\|`; L8275: `if (estAffaibli(personnage) && predicateAsBool(personnage, 'insensibleAffaibli')) bonusCarac -= 2;` |
| `insignifiant` | Booléen ou valeur selon capacité | L14251: `if (attaquant && predicateAsBool(target, 'insignifiant')) {` |
| `instinctDeSurvie` | Booléen ou valeur selon capacité | L14035: `let instinctSurvie = predicateAsInt(target, 'instinctDeSurvie', 0, niveau * 5);` |
| `instinctDeSurvieHumain` | Booléen ou valeur selon capacité | L25713: `predicateAsBool(target, 'instinctDeSurvieHumain')) {` |
| `intelligenceDuCombat` | Booléen ou valeur selon capacité | L12829: `if (predicateAsBool(perso, 'intelligenceDuCombat')) {`; L13939: `if (predicateAsBool(target, 'intelligenceDuCombat')) {` |
| `interchangeable` | Booléen ou valeur selon capacité | L30055: `let limite = predicateAsInt(target, 'interchangeable', 0);` |
| `invisibleEnCombat` | Booléen ou valeur selon capacité | L18153: `if (getState(attaquant, 'invisible') && !predicateAsBool(attaquant, 'invisibleEnCombat')) {` |
| `invulnerable` | Booléen ou valeur selon capacité | L24046: `if (predicateAsBool(target, 'invulnerable') \|\| predicateAsBool(target, 'diviseEffet_elementaire')) {`; L24070: `if (predicateAsBool(target, 'invulnerable') \|\|` |
| `joliCoup` | Booléen ou valeur selon capacité | L14174: `if (attaquant && predicateAsBool(attaquant, 'joliCoup')) {`; L26134: `if (ignoreObstacles \|\| predicateAsBool(perso1, 'joliCoup'))` |
| `laissezLeMoi` | Booléen ou valeur selon capacité | L21789: `if (predicateAsBool(attaquant, 'laissezLeMoi') &&`; L58821: `preds = preds.replace('laissez-le-moi', 'laissezLeMoi');` |
| `lameConsacree` | Booléen ou valeur selon capacité | L14451: `predicateAsBool(perso, 'lameConsacree');` |
| `langageSombreHetre` | Booléen ou valeur selon capacité | L14271: `if (attaquant && predicateAsBool(target, 'langageSombreHetre') && estElfeNoir(attaquant)) {`; L21784: `if (predicateAsBool(attaquant, 'langageSombreHetre') && estElfeNoir(target)) {` |
| `liberateurDAnathazerin` | Booléen ou valeur selon capacité | L15098: `if (predicateAsBool(attaquant, 'liberateurDAnathazerin') && (estInsecte(target) \|\| estElfeNoir(target))) {`; L23583: `if (predicateAsBool(target, 'liberateurDAnathazerin')) {` |
| `liberateurDeDorn` | Booléen ou valeur selon capacité | L14333: `if (predicateAsBool(target, 'liberateurDeDorn') && estGeant(attaquant)) {`; L15090: `if (predicateAsBool(attaquant, 'liberateurDeDorn') && estGeant(target)) {` |
| `liberateurDeKerserac` | Booléen ou valeur selon capacité | L15094: `if (predicateAsBool(attaquant, 'liberateurDeKerserac') && (estGeant(target) \|\| estInsecte(target) \|\| estElfeNoir(target)` |
| `liberteDAction` | Booléen ou valeur selon capacité | L22106: `((predicateAsBool(target, 'liberteDAction') && (`; L22212: `(predicateAsBool(target, 'liberteDAction') && (` |
| `lienEpique` | Booléen ou valeur selon capacité | L17174: `options.lienEpique = predicateAsBool(attaquant, 'lienEpique');`; L21310: `if (charPredicateAsBool(ch.id, 'lienEpique') != options.lienEpique) return;` |
| `loupParmiLesLoups` | Booléen ou valeur selon capacité | L21779: `let loupParmiLesLoups = predicateAsInt(attaquant, 'loupParmiLesLoups', 0);` |
| `lutinGrosBill` | Booléen ou valeur selon capacité | L6305: `if (!predicateAsBool(perso, 'lutinGrosBill') \|\| weaponStats.attCarBonus == '@{FOR}')` |
| `lycanthrope` | Booléen ou valeur selon capacité | L17993: `if (predicateAsBool(target, 'lycanthrope')) {` |
| `lycanthropeEventre` | Booléen ou valeur selon capacité | L21528: `if (predicateAsBool(attaquant, 'lycanthropeEventre') && attributeAsBool(attaquant, 'lycanthropie')) {` |
| `magieDeCombat` | Booléen ou valeur selon capacité | L18253: `crit -= predicateAsInt(attaquant, 'magieDeCombat', 0, 1);` |
| `magieEnArmure` | Booléen ou valeur selon capacité | L10907: `case 'magieEnArmure':`; L14953: `let magieEnArmure = predicateAsInt(attaquant, 'magieEnArmure', 0);` |
| `magieEnArmureFacilitee` | Booléen ou valeur selon capacité | L14958: `if (magieEnArmure > 0 && predicateAsBool(attaquant, 'magieEnArmureFacilitee')) {`; L15698: `if (magieEnArmure > 0 && predicateAsBool(perso, 'magieEnArmureFacilitee')) {` |
| `manoeuvreDuelliste` | Booléen ou valeur selon capacité | L30995: `let manoeuvreDuelliste = predicateAsBool(perso, 'manoeuvreDuelliste');`; L41568: `let manoeuvreDuelliste = effet.duelliste && predicateAsBool(attaquant, 'manoeuvreDuelliste');` |
| `marcheSylvestre` | Booléen ou valeur selon capacité | L7727: `if (conditions > 0 && (!predicateAsBool(personnage, 'marcheSylvestre') \|\| conditions > 4)) {`; L13206: `if (attributeAsBool(perso, 'marcheSylvestre')) return true;` |
| `massacrerLaPietaille` | Booléen ou valeur selon capacité | L21543: `if (predicateAsBool(attaquant, 'massacrerLaPietaille') &&` |
| `mauvais` | Booléen ou valeur selon capacité | L12222: `case 'mauvais':`; L19136: `if (predicateAsBool(perso, 'mauvais')) return true;` |
| `memePasMal` | Booléen ou valeur selon capacité | L18054: `if (predicateAsBool(target, 'memePasMal')) {` |
| `messageSiCritique` | Booléen ou valeur selon capacité | L18048: `let messageCrit = predicateAsBool(target, 'messageSiCritique');` |
| `monture` | Booléen ou valeur selon capacité | L39595: `if (monture === undefined \|\| !predicateAsBool(monture, 'monture')) {` |
| `montureDe` | Booléen ou valeur selon capacité | L27082: `let montureDe = predicateAsBool(cible, 'montureDe');` |
| `montureLoyale` | Booléen ou valeur selon capacité | L13961: `if (predicateAsBool(target, 'montureLoyale')) {`; L14889: `if (predicateAsBool(attaquant, 'montureLoyale')) {` |
| `montureMagique` | Booléen ou valeur selon capacité | L28298: `if (bar1 < pvmax && predicateAsBool(perso, 'montureMagique')) {` |
| `morsureDuSerpent` | Booléen ou valeur selon capacité | L18236: `(predicateAsBool(attaquant, 'morsureDuSerpent') \|\| predicateAsBool(attaquant, 'briseurDOs'))) \|\|` |
| `mortDemandeConfirmation` | Booléen ou valeur selon capacité | L25257: `if (!really && predicateAsBool(target, 'mortDemandeConfirmation')) {` |
| `mortVivant` | Booléen ou valeur selon capacité | L18856: `if (predicateAsBool(perso, 'mortVivant')) return true;`; L57213: `if (attrName == 'mort-vivant') attr.set('name', 'mortVivant');` |
| `nAbandonneJamais` | Booléen ou valeur selon capacité | L25287: `} else if (predicateAsBool(target, 'nAbandonneJamais')) {` |
| `natureNourriciereBaies` | Booléen ou valeur selon capacité | L36125: `let trouveBaies = predicateAsBool(perso, 'natureNourriciereBaies');` |
| `nbCorpsElementaire` | Booléen ou valeur selon capacité | L19166: `let nbDes = predicateAsInt(attaquant, 'nbCorpsElementaire', 1);`; L22557: `let nbDes = predicateAsInt(target, 'nbCorpsElementaire', 1);` |
| `nbDesFeinte` | Booléen ou valeur selon capacité | L15052: `let desFeinte = predicateAsInt(attaquant, 'nbDesFeinte', 2);` |
| `necromancien` | Booléen ou valeur selon capacité | L21664: `if (predicateAsBool(attaquant, 'chasseurDeSorciere') && predicateAsBool(target, 'necromancien')) {` |
| `neProvoquePasAttaqueOpportunite` | Booléen ou valeur selon capacité | L51942: `if (!options.ignoreTargetNoAO && predicateAsBool(cible, 'neProvoquePasAttaqueOpportunite')) return false;`; L52097: `if (predicateAsBool(cible, 'neProvoquePasAttaqueOpportunite')) return;` |
| `nonVivant` | Booléen ou valeur selon capacité | L18916: `return (predicateAsBool(perso, 'nonVivant') \|\|`; L27504: `case "nonVivant":` |
| `ordreDuChevalierDragon` | Booléen ou valeur selon capacité | L7350: `if (predicateAsBool(personnage, 'ordreDuChevalierDragon') && attributeAsBool(personnage, 'monteSur')) {` |
| `pacifisme` | Booléen ou valeur selon capacité | L13846: `let pacifisme = predicateAsInt(target, 'pacifisme', 0, 5);`; L18157: `if (predicateAsBool(attaquant, 'pacifisme') &&` |
| `pacteSanglant` | Booléen ou valeur selon capacité | L8370: `let pacteSanglant = predicateAsInt(personnage, 'pacteSanglant', 0);`; L8567: `let pacteSanglant = predicateAsInt(perso, 'pacteSanglant', 0);` |
| `pasAttaqueOpportunite` | Booléen ou valeur selon capacité | L51941: `if (predicateAsBool(attacker, 'pasAttaqueOpportunite')) return false;` |
| `pasDuVent` | Booléen ou valeur selon capacité | L12838: `init += predicateAsInt(perso, 'pasDuVent', 0, 1);` |
| `peauDEcorceAvancee` | Booléen ou valeur selon capacité | L23587: `if (predicateAsBool(target, 'peauDEcorceAvancee') && attributeAsBool(target, 'peauDEcorce')) {` |
| `peauDePierre` | Booléen ou valeur selon capacité | L13933: `if (predicateAsBool(target, 'peauDePierre')) {` |
| `pecheThassilion` | Booléen ou valeur selon capacité | L13612: `let peche = predicateAsBool(perso, 'pecheThassilion');` |
| `perteDeSubstance` | Booléen ou valeur selon capacité | L7211: `if (predicateAsBool(perso, 'perteDeSubstance'))`; L7212: `perteDeSubstance = attributeAsInt(perso, 'perteDeSubstance', 0);` |
| `petiteTaille` | Booléen ou valeur selon capacité | L7334: `} else if (predicateAsBool(personnage, 'petiteTaille')) {`; L13569: `if (predicateAsBool(perso, 'petiteTaille')) return 3;` |
| `peutEnrager` | Booléen ou valeur selon capacité | L25766: `predicateAsBool(target, 'peutEnrager') &&`; L41977: `curreent: 'peutEnrager',` |
| `phylactereNegatif` | Booléen ou valeur selon capacité | L47037: `else phylactere = predicateAsBool(pretre, 'phylactereNegatif');` |
| `phylacterePositif` | Booléen ou valeur selon capacité | L47036: `if (positif) phylactere = predicateAsBool(pretre, 'phylacterePositif');` |
| `piquresDInsectes` | Booléen ou valeur selon capacité | L25429: `let piqures = predicateAsInt(target, 'piquresDInsectes', 0);` |
| `pirouettes` | Booléen ou valeur selon capacité | L7268: `if (predicateAsBool(personnage, 'pirouettes') && malusArmure(personnage) <= 4) {`; L14337: `let pirouettes = predicateAsInt(target, 'pirouettes', 0);` |
| `plusViteQueSonOmbre` | Booléen ou valeur selon capacité | L15973: `let p = predicateAsBool(perso, 'plusViteQueSonOmbre');` |
| `porteurDuBouclierDeGrabuge` | Booléen ou valeur selon capacité | L7558: `!predicateAsBool(personnage, 'porteurDuBouclierDeGrabuge') &&`; L13501: `!predicateAsBool(personnage, 'porteurDuBouclierDeGrabuge')) {` |
| `poudrePuissante` | Booléen ou valeur selon capacité | L6421: `if (weaponStats.poudre && predicateAsBool(perso, 'poudrePuissante')) {` |
| `projection` | Booléen ou valeur selon capacité | L19529: `} else if (predicateAsBool(attaquant, 'projection') && !options.sortilege) {` |
| `proprioception` | Booléen ou valeur selon capacité | L16231: `} else if (predicateAsBool(perso, 'proprioception')) {`; L34422: `predicateAsBool(target, 'proprioception') \|\|` |
| `protectionDMZone` | Booléen ou valeur selon capacité | L23981: `(predicateAsBool(target, 'protectionDMZone') \|\|` |
| `protectionDMZone_` | Famille paramétrée | L23983: `return predicateAsBool(target, 'protectionDMZone_' + type);` |
| `protectionSouffleDeDragon` | Booléen ou valeur selon capacité | L25370: `if (options.partialSave && estSouffleDeDragon(options) && predicateAsBool(target, 'protectionSouffleDeDragon')) {` |
| `protegerUnAllieAvance` | Booléen ou valeur selon capacité | L36777: `if (predicateAsBool(protecteur, 'protegerUnAllieAvance')) {` |
| `PVPartagesAvec` | Booléen ou valeur selon capacité | L2981: `let nomPersoLie = predicateAsBool(perso, 'PVPartagesAvec');`; L4226: `if (estPJ(personnage) \|\| predicateAsBool(personnage, 'PVPartagesAvec')) {` |
| `quadrupede` | Booléen ou valeur selon capacité | L19016: `if (predicateAsBool(perso, 'quadrupede')) return true;`; L42191: `setPredicate(persoPredateur, 'quadrupede', evt);` |
| `radarMental` | Booléen ou valeur selon capacité | L13896: `if (!(options.contact && predicateAsBool(target, 'radarMental') && attaquant && !estNonVivant(attaquant))) {`; L13909: `if (attaquant && predicateAsBool(attaquant, 'radarMental') && !estNonVivant(target)) {` |
| `rageDuBerserkAmelioree` | Booléen ou valeur selon capacité | L14079: `if (predicateAsBool(target, 'rageDuBerserkAmelioree')) {` |
| `raillerieImpossible` | Booléen ou valeur selon capacité | L39440: `if (predicateAsBool(cible, 'raillerieImpossible')) {` |
| `rapideCommeSonOmbre` | Booléen ou valeur selon capacité | L7338: `let rapideCommeSonOmbre = predicateAsInt(personnage, 'rapideCommeSonOmbre', 0, 3);`; L12845: `init += predicateAsInt(perso, 'rapideCommeSonOmbre', 0, 3);` |
| `RD_critique` | Valeur attendue | L25421: `let rdCrit = predicateAsInt(target, 'RD_critique', 0);`; L57238: `if (attrName == 'RD_critique') return;` |
| `rdSouffleDeDragon` | Booléen ou valeur selon capacité | L24155: `if (predicateAsBool(target, 'rdSouffleDeDragon') && estSouffleDeDragon(options))`; L24156: `rdMain += predicateAsInt(target, 'rdSouffleDeDragon', 0);` |
| `reduireLaDistance` | Booléen ou valeur selon capacité | L14236: `if (attaquant && predicateAsBool(target, 'reduireLaDistance')) {` |
| `reflexesFelins` | Booléen ou valeur selon capacité | L12833: `init += predicateAsInt(perso, 'reflexesFelins', 0);`; L23467: `bonus1 += predicateAsInt(personnage, 'reflexesFelins', 0);` |
| `regardPetrifiant` | Booléen ou valeur selon capacité | L20916: `return predicateAsBool(target, 'regardPetrifiant');`; L20921: `let seuil = predicateAsInt(regardPetrifiant, 'regardPetrifiant', 0, 16) - 4;` |
| `resistanceA_` | Famille paramétrée | L23996: `return predicateOrAttributeAsBool(target, 'resistanceA_' + type) \|\|` |
| `riposte` | Booléen ou valeur selon capacité | L10101: `case 'riposte':`; L17171: `let riposte = predicateAsBool(attaquant, 'riposte');` |
| `saisirEtBroyer` | Booléen ou valeur selon capacité | L19527: `if (predicateAsBool(attaquant, 'saisirEtBroyer')) {` |
| `sangDeFerIf` | Booléen ou valeur selon capacité | L17830: `if (attaquant && predicateAsBool(target, 'sangDeFerIf')) {` |
| `sangFroid` | Booléen ou valeur selon capacité | L47782: `if (predicateAsBool(perso, 'sangFroid')) de = 4;` |
| `sansEsprit` | Booléen ou valeur selon capacité | L16849: `if (predicateAsBool(target, 'sansEsprit')) {`; L23452: `sansEsprit = predicateAsBool(personnage, 'sansEsprit') \|\|` |
| `sansPeur` | Booléen ou valeur selon capacité | L34420: `if (predicateAsBool(target, 'sansPeur') \|\|`; L34446: `if (charPredicateAsBool(cid, 'sansPeur')) {` |
| `scienceDuCritique` | Booléen ou valeur selon capacité | L18234: `if (predicateAsBool(attaquant, 'scienceDuCritique') \|\|` |
| `secondeChanceObjet` | Booléen ou valeur selon capacité | L25250: `if (predicateAsBool(target, 'secondeChanceObjet') &&` |
| `secondSouffle` | Booléen ou valeur selon capacité | L26755: `if (!predicateAsBool(perso, 'secondSouffle')) return;`; L30919: `if (actionsParDefaut && predicateAsBool(perso, 'secondSouffle') &&` |
| `sensAffutes` | Booléen ou valeur selon capacité | L12811: `if (predicateAsBool(perso, 'sensAffutes')) {`; L21110: `if (weaponStats.arc && predicateAsBool(attaquant, 'sensAffutes')) {` |
| `sergent` | Booléen ou valeur selon capacité | L25812: `if (predicateAsBool(target, 'sergent') &&` |
| `siphonDesAmes` | Booléen ou valeur selon capacité | L4215: `if (predicateAsBool(p, 'siphonDesAmes')) {`; L4228: `let bonus = predicateAsInt(siphoneur, 'siphonDesAmes', 0);` |
| `siphonDesAmesPrioritaire` | Booléen ou valeur selon capacité | L4218: `priorite: predicateAsInt(p, 'siphonDesAmesPrioritaire', 0)` |
| `sournoisesParTour` | Booléen ou valeur selon capacité | L21612: `let limiteSournoisesParTour = predicateAsInt(attaquant, 'sournoisesParTour', 1);` |
| `specialisationGuerrier` | Booléen ou valeur selon capacité | L14771: `let bonusDM = predicateAsInt(attaquant, 'specialisationGuerrier', 0, 2);` |
| `tailleFauchage` | Booléen ou valeur selon capacité | L16282: `let tailleFauchage = predicateAsInt(attaquant, 'tailleFauchage', 0);` |
| `techniqueDuSabre` | Booléen ou valeur selon capacité | L20395: `if (weaponStats.sabre && predicateAsBool(attaquant, 'techniqueDuSabre') && weaponStats.attCarBonus == '@{FOR}' && !(opti`; L20397: `let bonus = predicateAsInt(attaquant, 'techniqueDuSabre', 0, 1);` |
| `tenacite` | Booléen ou valeur selon capacité | L15472: `if (predicateAsBool(attaquant, 'tenacite')) {`; L18370: `if (!predicateAsBool(attaquant, 'tenacite')) return;` |
| `tirDeSemonce` | Booléen ou valeur selon capacité | L20005: `if (options.distance && predicateAsBool(attaquant, 'tirDeSemonce')) {`; L30904: `if (predicateAsBool(perso, 'tirDeSemonce') && armePrincipale &&` |
| `tirDouble` | Booléen ou valeur selon capacité | L10238: `case 'tirDouble':`; L11826: `if (predicateAsBool(perso, 'tirDouble') && perso.armeGauche.poudre && perso.arme.poudre) return;` |
| `tirFatal` | Booléen ou valeur selon capacité | L18242: `let armeTirFatal = predicateAsBool(attaquant, 'tirFatal');` |
| `tirParabolique` | Booléen ou valeur selon capacité | L16931: `if (predicateAsBool(attaquant, 'tirParabolique')) porteeMax = 3 * portee;`; L26124: `let tirParabolique = predicateAsBool(perso1, 'tirParabolique');` |
| `tirPrecis` | Booléen ou valeur selon capacité | L21583: `let tirPrecis = predicateAsInt(attaquant, 'tirPrecis', 0);` |
| `tokenFormeDArbre` | Booléen ou valeur selon capacité | L1272: `let imageArbre = predicateAsBool(personnage, 'tokenFormeDArbre');` |
| `tour` | Booléen ou valeur selon capacité | L7178: `case 'tour':`; L8362: `capaciteDisponible(personnage, 'prouesse', 'tour') &&` |
| `tourDeForce` | Booléen ou valeur selon capacité | L8367: `if (predicateAsBool(personnage, 'tourDeForce') && carac == 'FOR') {`; L8564: `if (caracteristique == 'FOR' && predicateAsBool(perso, 'tourDeForce')) {` |
| `toutPetit` | Booléen ou valeur selon capacité | L7331: `if (predicateAsBool(personnage, 'toutPetit') && !attributeAsBool(personnage, 'grandeTaille')) {`; L14368: `if (predicateAsBool(target, 'toutPetit') && !attributeAsBool(target, 'grandeTaille')) {` |
| `transformationRegeneratrice` | Booléen ou valeur selon capacité | L30967: `if (predicateAsBool(perso, 'transformationRegeneratrice')) {`; L31897: `if (predicateAsBool(perso, 'transformationRegeneratrice'))` |
| `tropPetit` | Booléen ou valeur selon capacité | L6301: `if (!predicateAsBool(perso, 'tropPetit')) return;`; L16349: `if (predicateAsBool(attaquant, 'tropPetit') && !attributeAsBool(attaquant, 'grandeTaille')) {` |
| `vampire` | Booléen ou valeur selon capacité | L18869: `case 'vampire':`; L22353: `(predicateAsBool(attaquant, 'vampire') && predicateAsBool(target, 'immuniteAbsorptionVampire'))` |
| `vegetatif` | Booléen ou valeur selon capacité | L12186: `return raceIs(perso, 'plante') \|\| predicateAsBool(perso, 'vegetatif');`; L16853: `if (predicateAsBool(target, 'vegetatif')) {` |
| `ventreMou` | Booléen ou valeur selon capacité | L25397: `if (rd > 0 && !options.aoe && options.attaquant && predicateAsBool(options.attaquant, 'ventreMou')) {` |
| `vetementsSacres` | Booléen ou valeur selon capacité | L13924: `defense += predicateAsInt(target, 'vetementsSacres', 0);` |
| `vieArtificielle` | Booléen ou valeur selon capacité | L4456: `if (predicateAsBool(perso, 'vieArtificielle')) {` |
| `violenceCiblee` | Booléen ou valeur selon capacité | L30811: `if (predicateAsBool(perso, 'violenceCiblee') && !attributeAsBool(perso, 'reactionViolente')) {`; L31725: `if (predicateAsBool(perso, 'violenceCiblee')) {` |
| `visionDansLeNoir` | Booléen ou valeur selon capacité | L48763: `let visionNoir = predicateAsInt(perso, 'visionDansLeNoir', 0);` |
| `vitaliteEpique` | Booléen ou valeur selon capacité | L4373: `if (!options.ignoreVitaliteEpique && predicateAsBool(perso, 'vitaliteEpique')) soins *= 2;` |
| `vitaliteSurnaturelle` | Booléen ou valeur selon capacité | L16097: `predicatesNamed(cible, 'vitaliteSurnaturelle').some(function (a) {`; L24243: `predicatesNamed(target, 'vitaliteSurnaturelle').forEach(function (a) {` |
| `vitesseDuFelin` | Booléen ou valeur selon capacité | L7297: `a = predicateAsInt(personnage, 'vitesseDuFelin', 0);`; L12836: `init += predicateAsInt(perso, 'vitesseDuFelin', 0);` |
| `voieDeLaConjuration` | Booléen ou valeur selon capacité | L42136: `renforce = predicateAsInt(invocateur, 'voieDeLaConjuration', 0);`; L42377: `let rang = predicateAsInt(invocateur, 'voieDeLaConjuration', 3);` |
| `voieDeLAlchimie` | Booléen ou valeur selon capacité | L39640: `voieDesElixirs = predicateAsInt(perso, 'voieDeLAlchimie', 0);` |
| `voieDeLaMagieElementaliste` | Booléen ou valeur selon capacité | L22411: `if (predicateAsInt(target, 'voieDeLaMagieElementaliste', 0) > 3)`; L24126: `let v = predicateAsInt(target, 'voieDeLaMagieElementaliste');` |
| `voieDeLArcEtDuCheval` | Booléen ou valeur selon capacité | L18248: `if (predicateAsInt(attaquant, 'voieDeLArcEtDuCheval', 3) > 4)` |
| `voieDeLArchange` | Booléen ou valeur selon capacité | L12269: `return attributeAsBool(attaquant, 'formeDAnge') && predicateAsInt(attaquant, 'voieDeLArchange', 1) > 2;`; L17848: `return predicateAsInt(target, 'voieDeLArchange', 1) > 2 && attributeAsBool(target, 'formeDAnge');` |
| `voieDeLaSurvie` | Booléen ou valeur selon capacité | L36105: `let voieDeLaSurvie = predicateAsInt(lanceur, 'voieDeLaSurvie', 0);`; L36124: `let voieDeLaSurvie = predicateAsInt(perso, 'voieDeLaSurvie', 0);` |
| `voieDesElixirs` | Booléen ou valeur selon capacité | L39642: `voieDesElixirs = predicateAsInt(perso, 'voieDesElixirs', 0);`; L39643: `} else voieDesElixirs = predicateAsInt(perso, 'voieDesElixirs', 0);` |
| `voieDesExplosifs` | Booléen ou valeur selon capacité | L31697: `let voieDesExplosifs = predicateAsInt(perso, 'voieDesExplosifs', 0);`; L49142: `} else rang = predicateAsInt(arquebusier, 'voieDesExplosifs', 2, 2);` |
| `voieDesForets` | Booléen ou valeur selon capacité | L13855: `let v = predicateAsInt(target, 'voieDesForets', 0);`; L23589: `if (bonusPeau == 2 && predicateAsInt(target, 'voieDesForets', 0) > 3)` |
| `voieDesRunes` | Booléen ou valeur selon capacité | L14154: `defense += predicateAsInt(target, 'voieDesRunes', 0, 1);`; L40069: `let voieDesRunes = predicateAsInt(forgesort, 'voieDesRunes', 0);` |
| `voieDesSoins` | Booléen ou valeur selon capacité | L6634: `let rangSoin = predicateAsInt(perso, 'voieDesSoins', 0);`; L35471: `rangSoin = predicateAsInt(soigneur, 'voieDesSoins', 0);` |
| `voieDesVegetaux` | Booléen ou valeur selon capacité | L1352: `let valeur = getIntValeurOfEffet(personnage, 'peauDEcorce', 1, 'voieDesVegetaux');`; L13853: `let bonusPeau = getIntValeurOfEffet(target, 'peauDEcorce', 1, 'voieDesVegetaux');` |
| `voieDuGuerisseur` | Booléen ou valeur selon capacité | L35486: `let bonusLeger = niveau + predicateAsInt(soigneur, 'voieDuGuerisseur', 0);`; L35503: `let bonusModere = niveau + predicateAsInt(soigneur, 'voieDuGuerisseur', 0);` |
| `voieDuMeneurDHomme` | Booléen ou valeur selon capacité | L29602: `let voieMeneur = predicateAsInt(chevalier, 'voieDuMeneurDHomme', 2);` |
| `voieDuSoldat` | Booléen ou valeur selon capacité | L37499: `let rang = predicateAsInt(guerrier, "voieDuSoldat", 0);` |
| `voieOutreTombe` | Booléen ou valeur selon capacité | L42798: `let rangVoie = predicateAsInt(necromant, 'voieOutreTombe', 1);` |
| `volant` | Booléen ou valeur selon capacité | L569: `return predicateAsBool(perso, 'volant');`; L573: `if (!getState(perso, 'volant')) return false;` |
| `vulnerableA_` | Famille paramétrée | L24008: `return predicateOrAttributeAsBool(target, 'vulnerableA_' + type);` |
| `vulnerableCritique` | Booléen ou valeur selon capacité | L25751: `let vulnerableCritique = predicateAsInt(target, 'vulnerableCritique', 0);` |

## 23. Atlas exhaustif des commandes COFantasy

Le dispatcher V2 expose **252 commandes**. Le tableau indique la syntaxe la plus précise trouvée dans le code ; quand une capacité est normalement appelée par un bouton de fiche, la colonne Notes l’indique via le handler et les validations du moteur.

| Commande | Syntaxe / minimum | Rôle | Notes / contraintes |
|---|---|---|---|
| `!cof-a-couvert` | `!cof-a-couvert <arg1>` | A couvert. | moteur: `aCouvert` (ligne 33146); validation : Pas assez d'arguments pour !cof-a-couvert: |
| `!cof-affaiblir-carac` | `!cof-affaiblir-carac carac valeur` | Affaiblir carac. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `parseAffaiblirCarac` (ligne 47497); validation : La valeur d'affaiblissement doit être un nombre positif |
| `!cof-agrandir-page` | `!cof-agrandir-page` | Agrandir page. | MJ/GM selon le chemin utilisé; moteur: `agrandirPage` (ligne 47928); validation : Il manque le facteur d'agrandissement / Commande réservée aux MJs |
| `!cof-aile-forge-runique` | `!cof-aile-forge-runique <arg1>` | Aile forge runique. | MJ/GM selon le chemin utilisé; moteur: `entrerAileForgeRunique` (ligne 45690); validation : Option de !cof-aile-forge-runique non reconnue |
| `!cof-animation-des-objets` | `!cof-animation-des-objets @{selected|token_id} niveau` | Animation des objets. | accepte les options génériques `--…`; moteur: `animationDesObjets` (ligne 47260); validation : Le niveau de l'objet animé doit être un nombre positif |
| `!cof-armure-magique` | `!cof-armure-magique` | Armure magique. | moteur: `armureMagique` (ligne 32085) |
| `!cof-attack` | `!cof-attack <attaquant_token_id> <cible_token_id> <label_arme|-1|-2|nom> [--options...]` | Résout une attaque complète (touche, critique, dégâts, types, effets, sauvegardes, zones et ressources). | MJ/GM selon le chemin utilisé; moteur: `parseAttack` (ligne 11772); validation : Pas assez d'arguments pour !cof-attack: / Le premier argument de !cof-attack n'est pas un token valide |
| `!cof-attaque-opportunite` | `!cof-attaque-opportunite <attaquant_token_id> <cible_token_id> [identifiant]` | Résout une attaque d’opportunité proposée par le moteur. | moteur: `cofAttaqueOpportunite` (ligne 52138); validation : !cof-attack |
| `!cof-attaque-opportunite-ignorer` | `!cof-attaque-opportunite-ignorer` | Attaque opportunite ignorer. | moteur: `cofAttaqueOpportuniteIgnorer` (ligne 52162) |
| `!cof-attack-line` | `!cof-attack-line <arg1>` | Attack line. | MJ/GM selon le chemin utilisé; moteur: `attaqueLigneBouger` (ligne 48389); validation : Il manque un argument à !cof-attack-line / Le premier argument de !cof-attack-line n'est pas un token valide |
| `!cof-attack-line-from` | `!cof-attack-line-from <arg1> <arg2> <arg3> [--options...]` | Attack line from. | MJ/GM selon le chemin utilisé; moteur: `attaqueLigne` (ligne 48437); validation : Pas assez d'arguments pour !cof-attack-line: / Le premier argument de !cof-attack-line n'est pas un token valide |
| `!cof-attendre` | `!cof-attendre <arg1>` | Attendre. | utilise la sélection de tokens; moteur: `attendreInit` (ligne 31258); validation : La fonction !cof-attendre : rien à faire, pas de token selectionné |
| `!cof-observation` | `!cof-observation <arg1> <arg2> <arg3>` | Observation. | moteur: `observation` (ligne 31490); validation : !cof-observation attend le type (danger ou etat), l'observateur et la cible |
| `!cof-bonus-couvert` | `!cof-bonus-couvert [--options...] (sélection Roll20)` | Bonus couvert. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `bonusCouvert` (ligne 44286); validation : Il faut un argument positif pour !cof-bonus-couvert / pas de token sélectionné pour !cof-bonus-couvert |
| `!cof-bouger` | `!cof-bouger (sélection Roll20)` | Bouger. | MJ/GM selon le chemin utilisé; utilise la sélection de tokens; moteur: `decoincer` (ligne 47993) |
| `!cof-bouton-chance` | `!cof-bouton-chance <arg1>` | Bouton chance. | moteur: `boutonChance` (ligne 28712); validation : La fonction !cof-bouton-chance n'a pas assez d'arguments |
| `!cof-bouton-pousser-kiai` | `!cof-bouton-pousser-kiai <arg1>` | Bouton pousser kiai. | moteur: `kiai` (ligne 29445); validation : Il manque l'id de l'attaque sur laquelle pousser le kiai |
| `!cof-buf-def` | `!cof-buf-def <arg1>` | Buf def. | utilise la sélection de tokens; moteur: `bufDef` (ligne 32090); validation : La fonction !cof-buf-def attend un argument / Argument de !cof-buf-def invalide |
| `!cof-canaliser` | `!cof-canaliser <arg1> [--options...]` | Canaliser. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `canaliser` (ligne 46990); validation : Il manque le type de canalisation / Rien à canaliser. Il faut préciser un montant de soins ou de dégâts |
| `!cof-changer-de-forme` | `!cof-changer-de-forme <arg1> [--options...]` | Changer de forme. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `changerDeForme` (ligne 49539); validation : Il manque le nom de la forme pour !cof-changer-de-forme / Utilisation de !cof-changer-de-forme sans sélection de token |
| `!cof-clean-global-state` | `!cof-clean-global-state` | Clean global state. | moteur: `cleanGlobalState` (ligne 49064) |
| `!cof-confirmer-attaque` | `!cof-confirmer-attaque <arg1>` | Confirmer attaque. | MJ/GM selon le chemin utilisé; moteur: `confirmerAttaque` (ligne 6100); validation : Pas assez d'arguments pour !cof-confirmer-attaque |
| `!cof-creer-baies` | `!cof-creer-baies [--options...] (sélection Roll20)` | Creer baies. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `creerBaies` (ligne 48244); validation : Utilisation de !cof-creer-baies sans sélection de token / !cof-consommer-baie |
| `!cof-degainer` | `!cof-degainer [--options...] (sélection Roll20)` | Degainer. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `parseDegainer` (ligne 32982); validation : commande non formée / Qui doit dégainer ? |
| `!cof-division-vase` | `!cof-division-vase (sélection Roll20)` | Division vase. | utilise la sélection de tokens; moteur: `divisionVase` (ligne 49698) |
| `!cof-braise-solaire` | `!cof-braise-solaire <arg1> <arg2>` | Braise solaire. | moteur: `braiseSolaireReaction` (ligne 32320); validation : Commande Braise solaire mal formée |
| `!cof-dmg` | `!cof-dmg <expression> [--type] [--options...]` | Inflige directement des dégâts sans jet d’attaque ; accepte les types, sauvegardes et modificateurs de dégâts. | MJ/GM selon le chemin utilisé; utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `parseDmgDirects` (ligne 32268) |
| `!cof-echange-init` | `!cof-echange-init <arg1> <arg2> [--options...]` | Echange init. | accepte les options génériques `--…`; moteur: `echangeInit` (ligne 33066); validation : Pas assez d'arguments pour !cof-echange-init |
| `!cof-effet-chaque-d20` | `!cof-effet-chaque-d20 <arg1>` | Effet chaque d20. | MJ/GM selon le chemin utilisé; moteur: `setEffetChaqueD20` (ligne 47843); validation : Commande réservée au MJ / Il manque l'effet |
| `!cof-effet-combat` | `!cof-effet-combat <effet> [true|false] [--options...]` | Pose/retire un effet qui dure le combat. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `effetCombat` (ligne 33759); validation : Pas assez d'arguments pour !cof-effet-combat |
| `!cof-effet-temp` | `!cof-effet-temp <effet> <duree> [--valeur X] [--save CARAC DD] [--options...]` | Pose/retire un effet temporaire avec durée, valeur, sauvegarde et options de portée/ressource. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `parseEffetTemporaire` (ligne 33209); validation : Pas assez d'arguments pour !cof-effet-temp / doit manier un bouclier pour lancer le défi |
| `!cof-expert-combat` | `!cof-expert-combat (sélection Roll20)` | Expert combat. | utilise la sélection de tokens; moteur: `expertDuCombat` (ligne 29168); validation : Pas de token sélectionné pour !cof-expert-combat-touche |
| `!cof-expert-combat-touche` | `!cof-expert-combat-touche (sélection Roll20)` | Expert combat touche. | utilise la sélection de tokens; moteur: `expertDuCombat` (ligne 29168); validation : Pas de token sélectionné pour !cof-expert-combat-touche |
| `!cof-expert-combat-dm` | `!cof-expert-combat-dm (sélection Roll20)` | Expert combat dm. | utilise la sélection de tokens; moteur: `expertDuCombat` (ligne 29168); validation : Pas de token sélectionné pour !cof-expert-combat-touche |
| `!cof-expert-combat-def` | `!cof-expert-combat-def <arg1> <arg2>` | Expert combat def. | moteur: `expertDuCombatDEF` (ligne 29223); validation : La fonction !cof-expert-combat-def n'a pas assez d'arguments |
| `!cof-expert-combat-bousculer` | `!cof-expert-combat-bousculer <arg1> <arg2>` | Expert combat bousculer. | moteur: `expertDuCombatBousculer` (ligne 41631); validation : On ne peut utiliser !cof-expert-combat-bousculer qu'en combat / Il manque des arguments à !cof-expert-combat-bousculer |
| `!cof-explosion` | `!cof-explosion (sélection Roll20)` | Explosion. | utilise la sélection de tokens; moteur: `attaqueExplosion` (ligne 47797); validation : Il manque le label de l'attaque à utiliser pour !cof-explosion / !cof-attack |
| `!cof-fin-changement-de-forme` | `!cof-fin-changement-de-forme [--options...] (sélection Roll20)` | Fin changement de forme. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `finChangementDeForme` (ligne 49640); validation : Utilisation de !cof-fin-changement-de-forme sans sélection de token |
| `!cof-hors-combat` | `!cof-hors-combat [--options...]` | Hors combat. | moteur: `sortirDuCombat` (ligne 26635) |
| `!cof-fin-combat` | `!cof-fin-combat` | Fin combat. | moteur: `sortirDuCombat` (ligne 26635) |
| `!cof-fin-reaction-violente` | `!cof-fin-reaction-violente token_id` | Fin reaction violente. | accepte les options génériques `--…`; moteur: `finReactionViolente` (ligne 47747); validation : Le premier argument de !cof-fin-reaction-violente n'est pas un token valide |
| `!cof-foudre-du-temps` | `!cof-foudre-du-temps <arg1>` | Foudre du temps. | MJ/GM selon le chemin utilisé; moteur: `setEffetChaqueD20` (ligne 47843); validation : Commande réservée au MJ / Il manque l'effet |
| `!cof-gerer-runes-mortes` | `!cof-gerer-runes-mortes <arg1>` | Gerer runes mortes. | moteur: `gererRunesMortes` (ligne 48695); validation : il manque l'id du personnage qui gère ses runes mortes / Il faut préciser le token à qui donner la rune |
| `!cof-huile-instable` | `!cof-huile-instable <arg1> [--options...]` | Huile instable. | accepte les options génériques `--…`; moteur: `huileInstable` (ligne 36295); validation : La fonction !cof-huile-instable attend en argument la personne dont il faut enflammer l'arme / Doit tenir son arme en main pour qu'on puisse appliquer l'huile instable |
| `!cof-immunite-guerisseur` | `!cof-immunite-guerisseur <arg1> [--options...]` | Immunite guerisseur. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `immuniteDuGuerisseur` (ligne 48940); validation : Il manque un argument à !cof-immunite-guerisseur / Utilisation de !cof-immunite-guerisseur sans sélection de token |
| `!cof-init` | `!cof-init (tokens sélectionnés)` | Ajoute les tokens sélectionnés au combat et initialise le suivi d’initiative. | MJ/GM selon le chemin utilisé; utilise la sélection de tokens; moteur: `initiativeInterface` (ligne 13123); validation : Dans !cof-init : rien à faire, pas de token selectionné |
| `!cof-jet` | `!cof-jet <CARAC|competence> [DD] [--options...]` | Jet. | utilise la sélection de tokens; moteur: `jet` (ligne 9245); validation : Il manque un argument à l'option / Le bonus doit être un nombre |
| `!cof-liste-actions` | `!cof-liste-actions [--options...] (sélection Roll20)` | Liste actions. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `apiTurnAction` (ligne 31077) |
| `!cof-mettre-a-zero-pv` | `!cof-mettre-a-zero-pv` | Mettre a zero pv. | moteur: `interfaceMettreAZeroPV` (ligne 25221); validation : Il faut 3 ou 4 arguments pour !cof-mettre-a-zero-pv / Impossible de trouver le token du personnage qui doit mourrir |
| `!cof-mettre-casque` | `!cof-mettre-casque [--options...] (sélection Roll20)` | Mettre casque. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `mettreCasque` (ligne 49256) |
| `!cof-montrer-resultats-attaque` | `!cof-montrer-resultats-attaque` | Montrer resultats attaque. | moteur: `montrerResultatsAttaque` (ligne 22927) |
| `!cof-montrer-resultats-jet` | `!cof-montrer-resultats-jet <arg1>` | Montrer resultats jet. | moteur: `montrerResultatJet` (ligne 8437); validation : manque l'argument de !cof-montrer-resultats-jet |
| `!cof-nouveau-jour` | `!cof-nouveau-jour [--options...] (sélection Roll20)` | Nouveau jour. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `parseNouveauJour` (ligne 28095) |
| `!cof-open-door` | `!cof-open-door <arg1> [--options...]` | Open door. | accepte les options génériques `--…`; moteur: `openDoor` (ligne 48369); validation : Il manque un argument à !cof-open-door |
| `!cof-options` | `!cof-options` | Ouvre/configure les options de règles et d’affichage. | MJ/GM selon le chemin utilisé; moteur: `setCofOptions` (ligne 43333); validation : !cof-options / !cof-jouer-son |
| `!cof-pathfinder1` | `!cof-pathfinder1 (sélection Roll20)` | Pathfinder1. | utilise la sélection de tokens; moteur: `translateFromPathfinder1` (ligne 45909) |
| `!cof-pause` | `!cof-pause` | Pause. | MJ/GM selon le chemin utilisé; moteur: `pauseGame` (ligne 48079); validation : !cof-pause |
| `!cof-poser-bombe` | `!cof-poser-bombe <arg1> <arg2> [--options...]` | Poser bombe. | accepte les options génériques `--…`; moteur: `poserBombe` (ligne 49102); validation : Il manque des arguments pour !cof-poser-bombe / Le premier argument de !cof-poser-bombe n'est pas un token valide |
| `!cof-recharger` | `!cof-recharger <arg1> [--options...]` | Recharger. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `recharger` (ligne 28425); validation : La fonction !cof-recharger attend au moins un argument / !cof-recharger sans sélection de tokens |
| `!cof-riposte-defi` | `!cof-riposte-defi <arg1> <arg2>` | Riposte defi. | moteur: `riposteDefiGuerrier` (ligne 18671); validation : Commande de posture de riposte incomplète / doit manier un bouclier pour utiliser sa posture de riposte |
| `!cof-recuperation` | `!cof-recuperation (sélection Roll20)` | Recuperation. | utilise la sélection de tokens; moteur: `parseRecuperer` (ligne 28147); validation : !cof-recuperation sans sélection de tokens / !cof-recuperation requiert des tokens sélectionnés |
| `!cof-recupere-mana` | `!cof-recupere-mana <arg1> [--options...]` | Recupere mana. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `recupereMana` (ligne 49311); validation : Il manque le montant de mana à récupérer pour !cof-recupere-mana |
| `!cof-remove-buf-def` | `!cof-remove-buf-def (sélection Roll20)` | Remove buf def. | utilise la sélection de tokens; moteur: `removeBufDef` (ligne 32126); validation : Pas de token sélectionné pour !cof-remove-buf-def |
| `!cof-resultat-jet` | `!cof-resultat-jet <arg1> <arg2>` | Resultat jet. | moteur: `resultatJet` (ligne 9401); validation : La fonction !cof-resultat-jet n'a pas assez d'arguments |
| `!cof-retour-boomerang` | `!cof-retour-boomerang <arg1> <arg2> [--options...]` | Retour boomerang. | accepte les options génériques `--…`; moteur: `retourBoomerang` (ligne 48345); validation : Il manque des arguments à !cof-retour-boomerang |
| `!cof-rune-protection` | `!cof-rune-protection [--options...] (sélection Roll20)` | Rune protection. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `runeProtection` (ligne 40735) |
| `!cof-rune-puissance` | `!cof-rune-puissance <arg1>` | Rune puissance. | utilise la sélection de tokens; moteur: `runePuissance` (ligne 29374); validation : Il faut spécifier le label de l'arme sur laquelle la rune de puissance est inscrite / Pas de token sélectionné pour !cof-rune-puissance |
| `!cof-bouton-rune-puissance` | `!cof-bouton-rune-puissance <arg1>` | Bouton rune puissance. | utilise la sélection de tokens; moteur: `runePuissance` (ligne 29374); validation : Il faut spécifier le label de l'arme sur laquelle la rune de puissance est inscrite / Pas de token sélectionné pour !cof-rune-puissance |
| `!cof-rune-energie` | `!cof-rune-energie (sélection Roll20)` | Rune energie. | utilise la sélection de tokens; moteur: `runeEnergie` (ligne 29279); validation : Pas de token sélectionné pour !cof-rune-energie |
| `!cof-bouton-rune-energie` | `!cof-bouton-rune-energie (sélection Roll20)` | Bouton rune energie. | utilise la sélection de tokens; moteur: `runeEnergie` (ligne 29279); validation : Pas de token sélectionné pour !cof-rune-energie |
| `!cof-sentir-la-corruption` | `!cof-sentir-la-corruption token_id token_id` | Sentir la corruption. | accepte les options génériques `--…`; moteur: `parseSentirLaCorruption` (ligne 48138); validation : Le premier argument de !cof-sentir-la-corruption n'est pas un token valide / Le deuxième argument de !cof-sentir-la-corruption n'est pas un token valide |
| `!cof-set-state` | `!cof-set-state <etat> <true|false|CARAC DD> [--target TOKEN_ID] [--options...]` | Modifie explicitement un état COFantasy. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `parseSetState` (ligne 32524); validation : Pas assez d'arguments pour !cof-set-state / Le premier argument de !cof-set-state n'est pas un état valide |
| `!cof-jet-confusion` | `!cof-jet-confusion [--options...] (sélection Roll20)` | Jet confusion. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `parseJetConfusion` (ligne 32504) |
| `!cof-skip-attack` | `!cof-skip-attack <arg1>` | Skip attack. | moteur: `skipAttack` (ligne 48611); validation : Il manque l'id dans !cof-skip-attack |
| `!cof-soigner-affaiblissement` | `!cof-soigner-affaiblissement carac valeur` | Soigner affaiblissement. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `soignerAffaiblissement` (ligne 47405); validation : La valeur de soin d'affaiblissement doit être un nombre positif |
| `!cof-sphere-de-feu` | `!cof-sphere-de-feu [--options...] (sélection Roll20)` | Sphere de feu. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `sphereDeFeu` (ligne 42223); validation : Pas de commande |
| `!cof-save-effet` | `!cof-save-effet <arg1> <arg2> [--options...]` | Save effet. | accepte les options génériques `--…`; moteur: `parseSaveEffet` (ligne 32841); validation : Paramètres de !cof-save-effet incorrects |
| `!cof-save-state` | `!cof-save-state <arg1> <arg2> <arg3> [--options...]` | Save state. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `parseSaveState` (ligne 32716); validation : Paramètres de !cof-save-state incorrects |
| `!cof-mission-config` | `!cof-mission-config` | Mission config. | MJ/GM selon le chemin utilisé; moteur: `cofMissionConfig` (ligne 50431) |
| `!cof-mission-show` | `!cof-mission-show` | Mission show. | MJ/GM selon le chemin utilisé; moteur: `cofMissionShow` (ligne 50445) |
| `!cof-mission-participants` | `!cof-mission-participants` | Mission participants. | MJ/GM selon le chemin utilisé; moteur: `cofMissionParticipantsUI` (ligne 50450) |
| `!cof-mission-participant-toggle` | `!cof-mission-participant-toggle` | Mission participant toggle. | MJ/GM selon le chemin utilisé; moteur: `cofMissionParticipantToggle` (ligne 50456) |
| `!cof-mission-tests` | `!cof-mission-tests` | Mission tests. | MJ/GM selon le chemin utilisé; moteur: `cofMissionTestsUI` (ligne 50463) |
| `!cof-mission-test-toggle` | `!cof-mission-test-toggle` | Mission test toggle. | MJ/GM selon le chemin utilisé; moteur: `cofMissionTestToggle` (ligne 50469) |
| `!cof-mission-tests-all` | `!cof-mission-tests-all` | Mission tests all. | MJ/GM selon le chemin utilisé; moteur: `cofMissionTestsAll` (ligne 50476) |
| `!cof-mission-launch` | `!cof-mission-launch` | Mission launch. | MJ/GM selon le chemin utilisé; moteur: `cofMissionDraftLaunch` (ligne 50485) |
| `!cof-mission-cancel` | `!cof-mission-cancel` | Mission cancel. | MJ/GM selon le chemin utilisé; moteur: `cofMissionDraftCancel` (ligne 50507) |
| `!cof-test-collectif` | `!cof-test-collectif` | Test collectif. | MJ/GM selon le chemin utilisé; moteur: `cofTestCollectif` (ligne 50568) |
| `!cof-test-collectif-roll` | `!cof-test-collectif-roll` | Test collectif roll. | moteur: `cofTestCollectifRoll` (ligne 50602) |
| `!cof-test-collectif-afficher` | `!cof-test-collectif-afficher` | Test collectif afficher. | MJ/GM selon le chemin utilisé; moteur: `cofTestCollectifAfficher` (ligne 50595) |
| `!cof-defi` | `!cof-defi` | Defi. | MJ/GM selon le chemin utilisé; moteur: `cofDefi` (ligne 50688) |
| `!cof-defi-test` | `!cof-defi-test` | Defi test. | moteur: `cofDefiTest` (ligne 50734) |
| `!cof-defi-afficher` | `!cof-defi-afficher` | Defi afficher. | MJ/GM selon le chemin utilisé; moteur: `cofDefiAfficher` (ligne 50727) |
| `!cof-defi-supprimer` | `!cof-defi-supprimer` | Defi supprimer. | MJ/GM selon le chemin utilisé; moteur: `cofDefiSupprimer` (ligne 50775) |
| `!cof-zone` | `!cof-zone` | Zone. | MJ/GM selon le chemin utilisé; moteur: `cofZone` (ligne 51194) |
| `!cof-zone-config` | `!cof-zone-config` | Zone config. | MJ/GM selon le chemin utilisé; moteur: `cofZoneConfig` (ligne 51094) |
| `!cof-zone-wizard` | `!cof-zone-wizard` | Zone wizard. | MJ/GM selon le chemin utilisé; moteur: `cofZoneWizardShow` (ligne 51135) |
| `!cof-zone-effets` | `!cof-zone-effets` | Zone effets. | MJ/GM selon le chemin utilisé; moteur: `cofZoneEffetsUI` (ligne 51134) |
| `!cof-zone-effet-add` | `!cof-zone-effet-add` | Zone effet add. | MJ/GM selon le chemin utilisé; moteur: `cofZoneEffetAdd` (ligne 51136) |
| `!cof-zone-effet-del` | `!cof-zone-effet-del` | Zone effet del. | MJ/GM selon le chemin utilisé; moteur: `cofZoneEffetDel` (ligne 51142) |
| `!cof-zone-activer` | `!cof-zone-activer` | Zone activer. | MJ/GM selon le chemin utilisé; moteur: `cofZoneActiver` (ligne 51143) |
| `!cof-zone-annuler` | `!cof-zone-annuler` | Zone annuler. | MJ/GM selon le chemin utilisé; moteur: `cofZoneAnnuler` (ligne 51147) |
| `!cof-zones` | `!cof-zones` | Zones. | MJ/GM selon le chemin utilisé; moteur: `cofZones` (ligne 51240); validation : !cof-zone-info / !cof-zone-modifier |
| `!cof-zone-test` | `!cof-zone-test` | Zone test. | MJ/GM selon le chemin utilisé; moteur: `cofZoneTest` (ligne 51313) |
| `!cof-zone-info` | `!cof-zone-info` | Zone info. | MJ/GM selon le chemin utilisé; moteur: `cofZoneInfo` (ligne 51256) |
| `!cof-zone-modifier` | `!cof-zone-modifier` | Zone modifier. | MJ/GM selon le chemin utilisé; moteur: `cofZoneModifier` (ligne 51264) |
| `!cof-zone-commande` | `!cof-zone-commande` | Zone commande. | MJ/GM selon le chemin utilisé; moteur: `cofZoneCommande` (ligne 51272); validation : !cof-zone-commande / ?{Commande(s) COF — séparer plusieurs commandes par ;;\|AUCUNE} |
| `!cof-zone-reset` | `!cof-zone-reset` | Zone reset. | MJ/GM selon le chemin utilisé; moteur: `cofZoneReset` (ligne 51298) |
| `!cof-zone-supprimer` | `!cof-zone-supprimer` | Zone supprimer. | MJ/GM selon le chemin utilisé; moteur: `cofZoneSupprimer` (ligne 51306) |
| `!cof-teleportation` | `!cof-teleportation` | Teleportation. | moteur: `cofTeleportation` (ligne 51452); validation : !cof-teleportation-annuler |
| `!cof-teleportation-annuler` | `!cof-teleportation-annuler` | Teleportation annuler. | moteur: `cofTeleportationAnnuler` (ligne 51483) |
| `!cof-invoquer` | `<b>!cof-invoquer TOKEN_ID Nom du modèle</b><br>` | Invoquer. | moteur: `cofInvoquer` (ligne 51779); validation : </b> introuvable. Utilisez <b>!cof-invocations</b> pour afficher les modèles. |
| `!cof-invocations` | `!cof-invocations` | Invocations. | moteur: `cofInvocations` (ligne 51761) |
| `!cof-renvoyer-invocation` | `!cof-renvoyer-invocation` | Renvoyer invocation. | MJ/GM selon le chemin utilisé; moteur: `cofRenvoyerInvocation` (ligne 51860) |
| `!cof-statut` | `!cof-statut [--target TOKEN_ID]` | Statut. | MJ/GM selon le chemin utilisé; utilise la sélection de tokens; moteur: `statut` (ligne 31754); validation : Dans !cof-statut : rien à faire, pas de token selectionné / !cof-effet |
| `!cof-statut-ressources` | `!cof-statut-ressources [--target TOKEN_ID]` | Statut ressources. | MJ/GM selon le chemin utilisé; moteur: `statutRessources` (ligne 31737) |
| `!cof-surprise` | `!cof-surprise [--options...] (sélection Roll20)` | Surprise. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `parseSurprise` (ligne 29928); validation : !cof-surprise sans sélection de token / !cof-surprise requiert de sélectionner des tokens |
| `!cof-tenebres-magiques` | `!cof-tenebres-magiques` | Tenebres magiques. | MJ/GM selon le chemin utilisé; moteur: `tenebresMagiques` (ligne 45653); validation : Option de !cof-tenebres-magiques non reconnue |
| `!cof-tp-auto` | `!cof-tp-auto [--options...] (sélection Roll20)` | Tp auto. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `setTPAuto` (ligne 37384); validation : Argument de !cof-tp-auto invalide ( / Aucun token sélectionné pour !cof-tp-auto |
| `!cof-undo` | `!cof-undo` | Annule la dernière opération enregistrée par le moteur. | moteur: `undoEvent` (ligne 5791) |
| `!cof-vision-nocturne` | `!cof-vision-nocturne <arg1> [--options...]` | Vision nocturne. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `ajouterVisionNocturne` (ligne 48627); validation : Il manque un argument à !cof-vision-nocturne / Utilisation de !cof-vision-nocturne sans sélection de token |
| `!cof-zone-de-vie` | `!cof-zone-de-vie <arg1> [--options...]` | Zone de vie. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `lancerZoneDeVie` (ligne 48994); validation : Il manque un argument à !cof-zone-de-vie / Utilisation de !cof-zone-de-vie sans sélection de token |
| `!cof-effet` | `!cof-effet <effet_indetermine> <true|false> [--target TOKEN_ID] [--options...]` | Pose/retire un effet à durée indéterminée. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `parseEffetIndetermine` (ligne 34014); validation : Pas assez d'arguments pour !cof-effet / On ne peut sélectionner qu'un token si on ne précise pas si il faut activer ou désactiver l'effet |
| `!cof-fin-classe-effet` | `!cof-fin-classe-effet <arg1>` | Fin classe effet. | utilise la sélection de tokens; moteur: `finClasseDEffet` (ligne 34379); validation : Il manque l'argument de !cof-fin-classe-effet |
| `!cof-attaque-magique` | `!cof-attaque-magique <arg1> <arg2> [--options...]` | Attaque magique. | accepte les options génériques `--…`; moteur: `parseAttaqueMagique` (ligne 34662); validation : Il faut au moins 2 arguments à !cof-attaque-magique / Arguments de !cof-attaque-magique |
| `!cof-injonction` | `!cof-injonction <arg1> <arg2> [--options...]` | Injonction. | accepte les options génériques `--…`; moteur: `parseAttaqueMagique` (ligne 34662); validation : Il faut au moins 2 arguments à !cof-attaque-magique / Arguments de !cof-attaque-magique |
| `!cof-sommeil` | `!cof-sommeil <arg1> [--options...]` | Sommeil. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `parseSommeil` (ligne 35104); validation : La fonction !cof-sommeil a besoin du nom ou de l'id du lanceur de sort |
| `!cof-attaque-magique-contre-pv` | `!cof-attaque-magique-contre-pv <arg1> <arg2> [--options...]` | Attaque magique contre pv. | accepte les options génériques `--…`; moteur: `attaqueMagiqueContrePV` (ligne 35267); validation : Il faut au moins 2 arguments à !cof-attaque-magique-contre-pv / Arguments de !cof-attaque-magique-contre-pv incorrects |
| `!cof-transe-guerison` | `!cof-transe-guerison [--options...] (sélection Roll20)` | Transe guerison. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `transeGuerison` (ligne 35347) |
| `!cof-soin` | `!cof-soin <soigneur_token_id> <cible_token_id> <expression> [--options...]` | Applique un soin à une cible avec gestion des PV, blessures et limites de ressource. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `soigner` (ligne 35423); validation : Il faut au moins un argument à !cof-soin / Trop d'arguments à !cof-soin |
| `!cof-soins` | `!cof-soins <soigneur_token_id> <cible_token_id> <expression> [--options...]` | Soins. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `soigner` (ligne 35423); validation : Il faut au moins un argument à !cof-soin / Trop d'arguments à !cof-soin |
| `!cof-nature-nourriciere` | `!cof-nature-nourriciere [--options...] (sélection Roll20)` | Nature nourriciere. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `parseNatureNourriciere` (ligne 36101) |
| `!cof-ignorer-la-douleur` | `!cof-ignorer-la-douleur [--options...] (sélection Roll20)` | Ignorer la douleur. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `ignorerLaDouleur` (ligne 36164) |
| `!cof-fortifiant` | `!cof-fortifiant <arg1> [--options...]` | Fortifiant. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `fortifiant` (ligne 36258); validation : La fonction !cof-fortifiant attend en argument le rang dans la Voie des élixirs du créateur |
| `!cof-intercepter` | `!cof-intercepter <arg1> <arg2> [--options...]` | Intercepter. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `intercepter` (ligne 29575); validation : L'argument de !cof-intercepter n'est pas une id de token valide (personnage non défini) |
| `!cof-interposer` | `!cof-interposer (sélection Roll20)` | Interposer. | utilise la sélection de tokens; moteur: `interposer` (ligne 29675); validation : L'argument de !cof-interposer n'est pas une id de token valide (personnage non défini) |
| `!cof-esquive-fatale` | `!cof-esquive-fatale <arg1> <arg2>` | Esquive fatale. | moteur: `doEsquiveFatale` (ligne 29504); validation : Il manque des arguments à !cof-esquive-fatale / Il faut cibler un token valide |
| `!cof-exemplaire` | `!cof-exemplaire [--options...] (sélection Roll20)` | Exemplaire. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `exemplaire` (ligne 29739) |
| `!cof-intervention-divine` | `!cof-intervention-divine <arg1> [--options...]` | Intervention divine. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `interventionDivine` (ligne 29787); validation : Il manque l'option rate ou touche à Intervention Divine |
| `!cof-lancer-sort` | `!cof-lancer-sort [--options...] (sélection Roll20)` | Lancer sort. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `lancerSort` (ligne 36324); validation : Pas de token sélectionée pour !cof-lancer-sort |
| `!cof-as` | `!cof-as <arg1>` | As. | moteur: `emulerAs` (ligne 36414); validation : Il manque le nom du personnage pour !cof-as |
| `!cof-peur` | `!cof-peur <arg1> <arg2> [--options...]` | Peur. | utilise la sélection de tokens; moteur: `parsePeur` (ligne 34521); validation : Pas assez d'arguments pour !cof-peur / Le premier argument de !cof-peur, la difficulté du test de résistance, n'est pas un nombre |
| `!cof-distribuer-baies` | `!cof-distribuer-baies (sélection Roll20)` | Distribuer baies. | utilise la sélection de tokens; moteur: `distribuerBaies` (ligne 36648); validation : Pour utiliser !cof-distribuer-baies, il faut sélectionner un token / Erreur de sélection dans !cof-distribuer-baies |
| `!cof-consommer-baie` | `!cof-consommer-baie <arg1> [--options...]` | Consommer baie. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `consommerBaie` (ligne 36681); validation : Il faut un argument à !cof-consommer-baie / L'argument de !cof-consommer-baie doit être un nombre positif |
| `!cof-proteger-un-allie` | `!cof-proteger-un-allie <arg1> <arg2>` | Proteger un allie. | moteur: `protegerUnAllie` (ligne 36738); validation : Pas assez d'arguments pour !cof-proteger-un-allie: |
| `!cof-corde-jumelle` | `!cof-corde-jumelle <arg1> [--options...]` | Corde jumelle. | accepte les options génériques `--…`; moteur: `cordeJumelle` (ligne 36823) |
| `!cof-action-defensive` | `!cof-action-defensive [--options...] (sélection Roll20)` | Action defensive. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `actionDefensive` (ligne 36858); validation : Il faut entrer en combat pour se défendre / Argument de !cof-action-defensive non reconnu |
| `!cof-strangulation` | `!cof-strangulation <arg1> <arg2>` | Strangulation. | moteur: `strangulation` (ligne 36909); validation : Pas assez d'arguments pour !cof-strangulation: / ne peut pas maintenir la strangulation. Il faut (re)lancer le sort |
| `!cof-ombre-mortelle` | `!cof-ombre-mortelle <arg1> <arg2> <arg3> [--options...]` | Ombre mortelle. | accepte les options génériques `--…`; moteur: `ombreMortelle` (ligne 36970); validation : La durée doit être un nombre positif |
| `!cof-escalier` | `!cof-escalier (sélection Roll20)` | Escalier. | utilise la sélection de tokens; moteur: `escalier` (ligne 37291); validation : Pas de sélection de token pour !cof-escalier / !cof-escalier requiert de sélectionner des tokens |
| `!cof-defaut-dans-la-cuirasse` | `!cof-defaut-dans-la-cuirasse <arg1> <arg2>` | Defaut dans la cuirasse. | moteur: `defautDansLaCuirasse` (ligne 37445); validation : Pas assez d'arguments pour !cof-defaut-dans-la-cuirasse |
| `!cof-posture-de-combat` | `!cof-posture-de-combat [--options...] (sélection Roll20)` | Posture de combat. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `postureDeCombat` (ligne 37470); validation : Impossible de trouve la commande ! / Pas assez d'arguments pour !cof-posture-de-combat |
| `!cof-attaque-a-outrance` | `!cof-attaque-a-outrance <arg1>` | Attaque a outrance. | utilise la sélection de tokens; moteur: `attaqueAOutrance` (ligne 37549); validation : Pas assez d'arguments pour !cof-attaque-a-outrance |
| `!cof-mur-de-force` | `!cof-mur-de-force [--options...] (sélection Roll20)` | Mur de force. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `murDeForce` (ligne 36475); validation : Le deuxième argument de !cof-mur-de-force doit être une durée |
| `!cof-capitaine` | `!cof-capitaine <arg1>` | Capitaine. | utilise la sélection de tokens; moteur: `devientCapitaine` (ligne 36587); validation : La fonction !cof-capitaine attend en argument l'id du capitaine / Le premier argument de !cof-capitaine doit être un token |
| `!cof-tueur-fantasmagorique` | `!cof-tueur-fantasmagorique <arg1> <arg2> [--options...]` | Tueur fantasmagorique. | accepte les options génériques `--…`; moteur: `parseAttaqueMagique` (ligne 34662); validation : Il faut au moins 2 arguments à !cof-attaque-magique / Arguments de !cof-attaque-magique |
| `!cof-enkystement-lointain` | `!cof-enkystement-lointain <arg1> <arg2> [--options...]` | Enkystement lointain. | accepte les options génériques `--…`; moteur: `parseAttaqueMagique` (ligne 34662); validation : Il faut au moins 2 arguments à !cof-attaque-magique / Arguments de !cof-attaque-magique |
| `!cof-injonction-mortelle` | `!cof-injonction-mortelle <arg1> <arg2> [--options...]` | Injonction mortelle. | accepte les options génériques `--…`; moteur: `parseInjonctionMortelle` (ligne 35001); validation : Il faut au moins 2 arguments à !cof-injonction-mortelle / Arguments de !cof-injonction-mortelle |
| `!cof-tour-de-force` | `!cof-tour-de-force [--options...] (sélection Roll20)` | Tour de force. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `parseTourDeForce` (ligne 37589); validation : Il manque un argument à !cof-tour-de-force / le seuil de difficulté du tour de force doit être un nombre |
| `!cof-prouesse` | `!cof-prouesse <arg1>` | Prouesse. | moteur: `boutonProuesse` (ligne 28777); validation : La fonction !cof-prouesse n'a pas assez d'arguments |
| `!cof-tour-force` | `!cof-tour-force <arg1>` | Tour force. | moteur: `boutonTourDeForce` (ligne 29022); validation : La fonction !cof-tour-force n'a pas assez d'arguments |
| `!cof-pacte-sanglant` | `!cof-pacte-sanglant <arg1> <arg2>` | Pacte sanglant. | moteur: `boutonPacteSanglant` (ligne 28861); validation : La fonction !cof-pacte-sanglant n'a pas assez d'arguments / Il manque un choix de bonus au Pacte sanglant |
| `!cof-pacte-sanglant-def` | `!cof-pacte-sanglant-def <arg1> <arg2> <arg3>` | Pacte sanglant def. | moteur: `boutonPacteSanglantDef` (ligne 28951); validation : La fonction !cof-pacte-sanglant-def n'a pas assez d'arguments / Il manque un choix de bonus au Pacte sanglant |
| `!cof-encaisser-un-coup` | `!cof-encaisser-un-coup [--options...] (sélection Roll20)` | Encaisser un coup. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `doEncaisserUnCoup` (ligne 37667) |
| `!cof-devier-les-coups` | `!cof-devier-les-coups [--options...] (sélection Roll20)` | Devier les coups. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `doDevierLesCoups` (ligne 37734) |
| `!cof-parade-projectiles` | `!cof-parade-projectiles [--options...] (sélection Roll20)` | Parade projectiles. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `doParadeProjectiles` (ligne 37799) |
| `!cof-parade-au-bouclier` | `!cof-parade-au-bouclier` | Parade au bouclier. | moteur: `doParadeAuBouclier` (ligne 38253) |
| `!cof-esquive-acrobatique` | `!cof-esquive-acrobatique` | Esquive acrobatique. | moteur: `doEsquiveAcrobatique` (ligne 38222) |
| `!cof-esquive-de-la-magie` | `!cof-esquive-de-la-magie` | Esquive de la magie. | moteur: `doEsquiveDeLaMagie` (ligne 38230) |
| `!cof-resister-a-la-magie` | `!cof-resister-a-la-magie` | Resister a la magie. | moteur: `resisterALaMagie` (ligne 38203) |
| `!cof-cercle-protection` | `!cof-cercle-protection` | Cercle protection. | moteur: `cercleDeProtection` (ligne 38212) |
| `!cof-parade-magistrale` | `!cof-parade-magistrale` | Parade magistrale. | moteur: `doParadeMagistrale` (ligne 38244) |
| `!cof-esquive-magistrale` | `!cof-esquive-magistrale` | Esquive magistrale. | moteur: `doEsquiveMagistrale` (ligne 38235) |
| `!cof-absorber-au-bouclier` | `!cof-absorber-au-bouclier` | Absorber au bouclier. | moteur: `absorberCoupAuBouclier` (ligne 38169) |
| `!cof-absorber-coup-au-bouclier` | `!cof-absorber-coup-au-bouclier` | Absorber coup au bouclier. | moteur: `absorberCoupAuBouclier` (ligne 38169) |
| `!cof-absorber-sort-au-bouclier` | `!cof-absorber-sort-au-bouclier` | Absorber sort au bouclier. | moteur: `absorberSortAuBouclier` (ligne 38186) |
| `!cof-chair-a-canon` | `!cof-chair-a-canon <arg1> <arg2> [--options...]` | Chair a canon. | accepte les options génériques `--…`; moteur: `doChairACanon` (ligne 38262); validation : pas assez d'argumennts pour !cof-chair-a-canon / Le premier argument de !cof-chair-a-canon n'est pas un token de personnage |
| `!cof-demarrer-statistiques` | `!cof-demarrer-statistiques` | Demarrer statistiques. | moteur: `displayStatistics` (ligne 38438) |
| `!cof-arreter-statistiques` | `!cof-arreter-statistiques` | Arreter statistiques. | moteur: `displayStatistics` (ligne 38438) |
| `!cof-pause-statistiques` | `!cof-pause-statistiques` | Pause statistiques. | moteur: `displayStatistics` (ligne 38438) |
| `!cof-statistiques` | `!cof-statistiques` | Statistiques. | moteur: `displayStatistics` (ligne 38438) |
| `!cof-doctor` | `!cof-doctor [--repair]` | Diagnostique les incohérences de fiches/tokens ; --repair applique les réparations supportées. | MJ/GM selon le chemin utilisé; moteur: `cofDoctor` (ligne 49999); validation : Seul le MJ peut lancer !cof-doctor. |
| `!cof-destruction-des-morts-vivants` | `!cof-destruction-des-morts-vivants <arg1> [--options...]` | Destruction des morts vivants. | MJ/GM selon le chemin utilisé; utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `parseDestructionDesMortsVivants` (ligne 38483); validation : Il faut au moins un argument à !cof-destruction-des-morts-vivants / Il faut sélectionner le lanceur de la destruction des morts-vivants |
| `!cof-enduire-poison` | `!cof-enduire-poison L type force save` | Enduire poison. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `parseEnduireDePoison` (ligne 38683); validation : Le dernier argument non optionnel doit être la difficulté du test de CON / Il faut un argument à --testINT |
| `!cof-consommables` | `!cof-consommables (sélection Roll20)` | Consommables. | utilise la sélection de tokens; moteur: `listeConsommables` (ligne 39043); validation : !cof-echange-consommable |
| `!cof-utilise-consommable` | `!cof-utilise-consommable <arg1> <arg2>` | Utilise consommable. | moteur: `utiliseConsommable` (ligne 39151) |
| `!cof-echange-consommable` | `!cof-echange-consommable <arg1> <arg2> <arg3>` | Echange consommable. | moteur: `echangeConsommable` (ligne 39231) |
| `!cof-provocation` | `!cof-provocation <arg1> <arg2> [--options...]` | Provocation. | accepte les options génériques `--…`; moteur: `parseProvocation` (ligne 39417); validation : La commande !cof-provocation requiert 2 arguments / Le premier argument de !cof-provocation n'est pas un token valide |
| `!cof-en-selle` | `!cof-en-selle <arg1> <arg2> [--options...]` | En selle. | accepte les options génériques `--…`; moteur: `enSelle` (ligne 39555); validation : Il faut 2 arguments pour !cof-en-selle / Premier argument de !cof-en-selle incorrect |
| `!cof-creer-elixir` | `!cof-creer-elixir <arg1> <arg2> [--options...]` | Creer elixir. | accepte les options génériques `--…`; moteur: `creerElixir` (ligne 39654); validation : Pas assez d'arguments pour !cof-creer-elixir |
| `!cof-elixirs` | `!cof-elixirs (sélection Roll20)` | Elixirs. | utilise la sélection de tokens; moteur: `gestionElixir` (ligne 39788); validation : !cof-creer-elixir |
| `!cof-runes` | `!cof-runes (sélection Roll20)` | Runes. | utilise la sélection de tokens; moteur: `gestionRunes` (ligne 40061); validation : !cof-creer-rune |
| `!cof-creer-rune` | `!cof-creer-rune <arg1> <arg2> <arg3> [--options...]` | Creer rune. | accepte les options génériques `--…`; moteur: `creerRune` (ligne 40092); validation : Pas assez d'arguments pour !cof-creer-rune |
| `!cof-rage-du-berserk` | `!cof-rage-du-berserk [--options...] (sélection Roll20)` | Rage du berserk. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `parseRageDuBerserk` (ligne 40308) |
| `!cof-arme-secrete` | `!cof-arme-secrete <arg1> <arg2> [--options...]` | Arme secrete. | accepte les options génériques `--…`; moteur: `parseArmeSecrete` (ligne 40376); validation : Il faut deux arguments à !cof-arme-secrete |
| `!cof-animer-arbre` | `!cof-animer-arbre <arg1> <arg2> [--options...]` | Animer arbre. | accepte les options génériques `--…`; moteur: `animerUnArbre` (ligne 40637); validation : Le premier argument de !cof-animer-arbre n'est pas un token valide / Le deuxième argument de !cof-animer-arbre n'est pas un token |
| `!cof-delivrance` | `!cof-delivrance <arg1> [--options...]` | Delivrance. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `delivrance` (ligne 40801); validation : Le premier argument de !cof-delivrance n'est pas un token valide / Le deuxième argument de !cof-delivrance n'est pas un token valide |
| `!cof-guerir` | `!cof-guerir <arg1> [--options...]` | Guerir. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `delivrance` (ligne 40801); validation : Le premier argument de !cof-delivrance n'est pas un token valide / Le deuxième argument de !cof-delivrance n'est pas un token valide |
| `!cof-guerison` | `!cof-guerison <arg1> [--options...]` | Guerison. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `guerison` (ligne 40997); validation : Le premier argument de !cof-guerison n'est pas un token valide / Le deuxième argument de !cof-guerison n'est pas un token valide |
| `!cof-test-attaque-opposee` | `!cof-test-attaque-opposee <arg1> <arg2>` | Test attaque opposee. | moteur: `testAttaqueOpposee` (ligne 41226); validation : Il faut 2 personnages pour un test d'attaque en opposition / Le premier argument de !cof-test-attaque-opposee doit être un token valide |
| `!cof-etat-oppose` | `!cof-etat-oppose <arg1> <arg2> <arg3> <arg4> <arg5> [--options...]` | Etat oppose. | accepte les options génériques `--…`; moteur: `cofEtatOppose` (ligne 41488); validation : !cof-etat-oppose attend : attaquant cible état caracAttaquant caracCible / !cof-etat-oppose : attaquant ou cible invalide |
| `!cof-manoeuvre` | `!cof-manoeuvre <arg1> <arg2> <arg3> [--options...]` | Manoeuvre. | accepte les options génériques `--…`; moteur: `manoeuvreRisquee` (ligne 41529); validation : Le premier argument de !cof-manoeuvre n'est pas un token valide / Le deuxième argument de !cof-manoeuvre n'est pas un token valide |
| `!cof-appliquer-manoeuvre` | `!cof-appliquer-manoeuvre <arg1> <arg2> <arg3> <arg4>` | Appliquer manoeuvre. | moteur: `appliquerManoeuvre` (ligne 41453); validation : Le premier argument de !cof-appliquer-manoeuvre n'est pas un token valide / Le deuxième argument de !cof-appliquer-manoeuvre n'est pas un token valide |
| `!cof-desarmer` | `!cof-desarmer <arg1> <arg2>` | Desarmer. | moteur: `desarmer` (ligne 41264); validation : Il manque des arguments à !cof-desarmer / Le premier argument de !cof-desarmer n'est pas un token valide |
| `!cof-tempete-de-mana` | `!cof-tempete-de-mana <arg1> <arg2>` | Tempete de mana. | moteur: `optionsDeTempeteDeMana` (ligne 9443); validation : Il manque l'id du token pour l'option altruiste de la tempete de mana / Argument de !cof-tempete-de-mana inconnu |
| `!cof-test-mort` | `!cof-test-mort [--options...]` | Test mort. | accepte les options génériques `--…`; moteur: `blessurePJTestMort` (ligne 25046) |
| `!cof-blessure-recap` | `!cof-blessure-recap [--options...]` | Blessure recap. | MJ/GM selon le chemin utilisé; accepte les options génériques `--…`; moteur: `blessurePJRecapCommande` (ligne 25116) |
| `!cof-blessure-reset` | `!cof-blessure-reset [--options...]` | Blessure reset. | MJ/GM selon le chemin utilisé; accepte les options génériques `--…`; moteur: `blessurePJResetCommande` (ligne 24836) |
| `!cof-blessure-markers` | `!cof-blessure-markers` | Blessure markers. | MJ/GM selon le chemin utilisé; moteur: `blessurePJMarkersDiagnostic` (ligne 24824) |
| `!cof-stabiliser-blessure` | `!cof-stabiliser-blessure [--options...]` | Stabiliser blessure. | accepte les options génériques `--…`; moteur: `blessurePJStabiliser` (ligne 25016) |
| `!cof-tour-suivant` | `!cof-tour-suivant` | Tour suivant. | moteur: `tourSuivant` (ligne 55887) |
| `!cof-multi-command` | `!cof-multi-command` | Multi command. | moteur: `multiCommand` (ligne 41703) |
| `!cof-conjuration-de-predateur` | `!cof-conjuration-de-predateur [--options...] (sélection Roll20)` | Conjuration de predateur. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `conjurationPredateur` (ligne 42079); validation : Pas de commande / Il faut un nombre comme premier argument de !cof-conjuration-de-predateur |
| `!cof-conjuration-armee` | `!cof-conjuration-armee [--options...] (sélection Roll20)` | Conjuration armee. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `conjurationArmee` (ligne 42317); validation : Il faut sélectionner le lanceur de la conjuration d'arméé / Il faut sélectionner un seul token pour les options de tempête de mana |
| `!cof-set-macros` | `!cof-set-macros` | Set macros. | MJ/GM selon le chemin utilisé; moteur: `setGameMacros` (ligne 43002) |
| `!cof-lumiere` | `!cof-lumiere <arg1> <arg2> [--options...]` | Lumiere. | accepte les options génériques `--…`; moteur: `ajouteLumiere` (ligne 43035); validation : Il faut au moins 2 arguments à !cof-lumiere / le premier argument de !cof-lumière doit être un token |
| `!cof-eteindre-lumiere` | `!cof-eteindre-lumiere [--options...] (sélection Roll20)` | Eteindre lumiere. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `eteindreLumieres` (ligne 43140); validation : Pas de cible sélectionnée pour !cof-eteindre-lumiere |
| `!cof-torche` | `!cof-torche <arg1> [--options...]` | Torche. | accepte les options génériques `--…`; moteur: `switchTorche` (ligne 43233); validation : Il faut préciser le token en argument de !cof-torche / Le deuxième argument de !cof-torche doit être un nombre strictement positif |
| `!cof-defi-duelliste` | `!cof-defi-duelliste` | Defi duelliste. | moteur: `lancerDefiDuelliste` (ligne 43529) |
| `!cof-defi-samourai` | `!cof-defi-samourai` | Defi samourai. | moteur: `lancerDefiSamourai` (ligne 43524) |
| `!cof-enveloppement` | `!cof-enveloppement <arg1> <arg2> <arg3> <arg4> <arg5> [--options...]` | Enveloppement. | accepte les options génériques `--…`; moteur: `parseEnveloppement` (ligne 43534); validation : Il manque des arguments à !cof-enveloppement |
| `!cof-echapper-enveloppement` | `!cof-echapper-enveloppement [--options...] (sélection Roll20)` | Echapper enveloppement. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `parseEchapperEnveloppement` (ligne 43651); validation : !cof-echapper-enveloppement sans sélection de token / !cof-echapper-enveloppement requiert de sélectionner des tokens |
| `!cof-liberer-agrippe` | `!cof-liberer-agrippe <arg1> [--options...]` | Liberer agrippe. | accepte les options génériques `--…`; moteur: `parseLibererAgrippe` (ligne 43760); validation : Il faut l'id du token en argument de !cof-liberer-agrippe |
| `!cof-liberer-ecrase` | `!cof-liberer-ecrase <arg1> [--options...]` | Liberer ecrase. | accepte les options génériques `--…`; moteur: `parseLibererEcrase` (ligne 43921); validation : Il faut l'id du token en argument de !cof-liberer-ecrase |
| `!cof-animer-cadavre` | `!cof-animer-cadavre <arg1> <arg2> [--options...]` | Animer cadavre. | accepte les options génériques `--…`; moteur: `animerCadavre` (ligne 44030); validation : Le premier argument de !cof-animer-cadavre n'est pas un token valide / Le deuxième argument de !cof-animer-cadavre n'est pas un token valide |
| `!cof-vapeurs-ethyliques` | `!cof-vapeurs-ethyliques [--options...] (sélection Roll20)` | Vapeurs ethyliques. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `parseVapeursEthyliques` (ligne 44107) |
| `!cof-desaouler` | `!cof-desaouler (sélection Roll20)` | Desaouler. | utilise la sélection de tokens; moteur: `desaouler` (ligne 44179); validation : Aucune sélection pour !cof-desaouler |
| `!cof-boire-alcool` | `!cof-boire-alcool [--options...] (sélection Roll20)` | Boire alcool. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `parseBoireAlcool` (ligne 44198) |
| `!cof-jouer-son` | `!cof-jouer-son` | Jouer son. | moteur: `jouerSon` (ligne 44258) |
| `!cof-bouton-echec-total` | `!cof-bouton-echec-total <arg1>` | Bouton echec total. | moteur: `echecTotal` (ligne 29105); validation : La fonction !cof-bouton-echec-total n'a pas assez d'arguments |
| `!cof-usure-off` | `!cof-usure-off` | Usure off. |  |
| `!cof-set-attribute` | `!cof-set-attribute <arg1> <arg2> [--options...]` | Set attribute. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `setAttributeInterface` (ligne 44325); validation : Pas assez d'arguments pour !cof-set-attribute / pas de token sélectionné pour !cof-set-attribute |
| `!cof-set-predicate` | `!cof-set-predicate <arg1> [--options...]` | Set predicate. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `setPredicateInterface` (ligne 44375); validation : Pas assez d'arguments pour !cof-set-predicate / pas de token sélectionné pour !cof-set-predicate |
| `!cof-options-d-attaque` | `!cof-options-d-attaque [--options...] (sélection Roll20)` | Options d attaque. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `optionsDAttaque` (ligne 44490); validation : Argument de !cof-options-d-attaque non reconnu / !cof-options-d-attaque reset --target |
| `!cof-petit-veinard` | `!cof-petit-veinard [--options...] (sélection Roll20)` | Petit veinard. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `petitVeinard` (ligne 29843); validation : Pas de token sélectionné pour !cof-petit-veinard |
| `!cof-bouton-petit-veinard` | `!cof-bouton-petit-veinard [--options...] (sélection Roll20)` | Bouton petit veinard. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `petitVeinard` (ligne 29843); validation : Pas de token sélectionné pour !cof-petit-veinard |
| `!cof-suivre` | `!cof-suivre <arg1> <arg2> [--options...]` | Suivre. | accepte les options génériques `--…`; moteur: `suivre` (ligne 44737); validation : Pas assez d'arguments pour !cof-suivre / Token sélectionne incorrect pour !cof-suivre |
| `!cof-centrer-sur-token` | `!cof-centrer-sur-token <arg1>` | Centrer sur token. | MJ/GM selon le chemin utilisé; moteur: `centrerSurToken` (ligne 44798); validation : Il faut préciser un token sur lequel se centrer / Impossible de trouver le joueur qui a lancé la commande |
| `!cof-bourse` | `!cof-bourse <arg1> <arg2>` | Bourse. | utilise la sélection de tokens; moteur: `gestionBourse` (ligne 44891); validation : Il faut spécifier un montant à / Il faut préciser les unités pour !cof-bourse fixer |
| `!cof-mot-de-pouvoir-immobilise` | `!cof-mot-de-pouvoir-immobilise [--options...] (sélection Roll20)` | Mot de pouvoir immobilise. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `motDePouvoirImmobilise` (ligne 45089) |
| `!cof-charge-fantastique` | `!cof-charge-fantastique <arg1> [--options...]` | Charge fantastique. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `chargeFantastque` (ligne 45195); validation : Pas assez d'arguments pour !cof-charge-fantastique / pas de token sélectionné pour !cof-charge-fantastique |
| `!cof-next-charge-fantastique` | `!cof-next-charge-fantastique` | Next charge fantastique. | moteur: `nextTurnChargeFantastique` (ligne 45133); validation : !cof-next-charge-fantastique |
| `!cof-tenebres` | `!cof-tenebres <arg1> [--options...]` | Tenebres. | accepte les options génériques `--…`; moteur: `tenebres` (ligne 42443); validation : !cof-tenebres mal formé, il faut un token comme premier argument / Le premier argument de !cof-tenebres n'est pas un token valide |
| `!cof-defense-armee-des-morts` | `!cof-defense-armee-des-morts <arg1> [--options...]` | Defense armee des morts. | accepte les options génériques `--…`; moteur: `defenseArmeeDesMorts` (ligne 44447); validation : Pas assez d'arguments pour !cof-defense-armee-des-morts / Le token renseigné pour !cof-defense-armee-des-morts est inconnu |
| `!cof-invoquer-demon` | `!cof-invoquer-demon <arg1> [--options...]` | Invoquer demon. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `invocationDemon` (ligne 42655); validation : !cof-invoquer-demon mal formé, il faut un token comme premier argument / Le premier argument de !cof-invoquer-demon n'est pas un token valie |
| `!cof-animer-mort` | `!cof-animer-mort <arg1> [--options...]` | Animer mort. | accepte les options génériques `--…`; moteur: `animerMort` (ligne 42784); validation : !cof-animer-mort mal formé, il faut un token comme premier argument / Le premier argument de !cof-animer-mort n'est pas un token valie |
| `!cof-prescience` | `!cof-prescience <arg1> [--options...]` | Prescience. | accepte les options génériques `--…`; moteur: `utiliserPrescience` (ligne 45268); validation : Pas assez d'arguments pour !cof-prescience |
| `!cof-multi-cartes` | `!cof-multi-cartes [--options...] (sélection Roll20)` | Multi cartes. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `multiCartes` (ligne 45343); validation : Aucun token selectionné pour !cof-multi-cartes |
| `!cof-ombre-mouvante` | `!cof-ombre-mouvante [--options...] (sélection Roll20)` | Ombre mouvante. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `ombreMouvante` (ligne 45396); validation : Pas de token sélectionné pour !cof-ombre-mouvante |
| `!cof-reveler-nom` | `!cof-reveler-nom [--options...] (sélection Roll20)` | Reveler nom. | utilise la sélection de tokens; accepte les options génériques `--…`; moteur: `revelerNom` (ligne 45462); validation : Pas de token sélectionné pour !cof-reveler-nom / , ce n'est pas encore géré dans !cof-reveler-nom |
| `!cof-fiole-de-lumiere` | `!cof-fiole-de-lumiere <arg1>` | Fiole de lumiere. | utilise la sélection de tokens; moteur: `fioleDeLumiere` (ligne 45740); validation : Il faut un argument à !cof-fiole-de-lumiere / La distance de vue de la lumière assombrie doit être un nombre |
| `!cof-agripper-de-demon` | `!cof-agripper-de-demon <arg1> <arg2>` | Agripper de demon. | moteur: `agripperDeDemon` (ligne 45792); validation : Il faut spécifier un attaquant et un défenseur pour !cof-agripper-de-demon / Le premier argument de !cof-agripper-de-demon doit être un token valide |

## 24. Monster Creator V2 — bibliothèques complètes

Le Monster Creator exporte des statistiques, des prédicats et des commandes qui utilisent **exactement** le vocabulaire documenté ci-dessus. Une affinité de créature peut donc produire `resistanceA_*`, `immunite_*`, `absorptionA_*`, `vulnerableA_*` ou `faiblesseMajeureA_*`.

### Capacités disponibles
| Nom | Cout | Categorie | Usage | Carac | Resolution | DM_mult | Effet | Danger_% |
|---|---|---|---|---|---|---|---|---|
| Attaque en meute | 1 | Passive | Libre |  | Passif | 0 | +1 Toucher si allié menace la cible | 5.0% |
| Charge | 1 | Attaque | Libre | FOR | Attaque | 1.5 | +50% DM après déplacement en ligne droite | 5.0% |
| Piqué | 1 | Attaque | Libre | DEX | Attaque | 1.5 | +50% DM après déplacement en vol | 5.0% |
| Frappe lourde | 1 | Attaque | Libre | FOR | Attaque | 1.25 | Attaque renforcée | 5.0% |
| Frappe précise | 1 | Attaque | Libre | DEX | Attaque | 75.0% | +1 Toucher | 2.5% |
| Balayage | 1 | Attaque | Libre | FOR | Attaque | 75.0% | Seconde cible proche | 5.0% |
| Venin | 1 | Attaque | Libre | CON | DD capacité | 50.0% | Dégâts Toxiques additionnels | 5.0% |
| Drain mineur | 1 | Attaque | Libre | CHA | Attaque | 75.0% | Soigne 25% dégâts | 5.0% |
| Renversement | 1 | Contrôle | Libre | FOR | Test opposé | 1 | Renversé | 5.0% |
| Agrippement | 1 | Contrôle | Libre | FOR | Test opposé | 0 | Agrippé | 5.0% |
| Entrave | 1 | Contrôle | Libre | DEX | Test opposé | 0 | Entravé | 5.0% |
| Toile | 1 | Contrôle | Libre | DEX | Test opposé | 0 | Entravé à distance | 5.0% |
| Projection | 1 | Contrôle | Libre | FOR | Test opposé | 50.0% | Repousse | 5.0% |
| Peur mineure | 1 | Contrôle | Libre | CHA | DD capacité | 0 | Effrayé | 5.0% |
| Bond | 1 | Mobilité | 1/tour | DEX | — | 0 | Déplacement amélioré | 0 |
| Téléportation courte | 1 | Mobilité | 1/tour | INT | — | 0 | Déplacement instantané | 0 |
| Repli mobile | 1 | Mobilité | 1/tour | DEX | — | 0 | Sans attaque d'opportunité | 0 |
| Parade | 1 | Défense | 1/tour | DEX | Réaction | 0 | +2 DEF contre une attaque | 5.0% |
| Régénération faible | 1 | Défense | 1/tour | CON | Passif | 0 | 5% PV max/tour | 5.0% |
| Aura mineure | 1 | Aura | Libre | CON | DD capacité | 50.0% | Effet faible autour du monstre | 5.0% |
| Multiattaque | 2 | Attaque | Libre |  | Attaques | 0 | Plusieurs attaques/action | 10.0% |
| Souffle | 2 | Attaque | Recharge 5-6 | CON | DD capacité | 1 | Zone ; moitié sur réussite | 10.0% |
| Onde de choc | 2 | Attaque | Recharge 5-6 | FOR | DD capacité | 75.0% | Zone + Renversé | 10.0% |
| Explosion élémentaire | 2 | Attaque | Recharge 5-6 | INT | DD capacité | 75.0% | Zone élémentaire | 10.0% |
| Frappe dévastatrice | 2 | Attaque | 1/combat | FOR | Attaque | 1.5 | Attaque majeure | 7.5% |
| Drain vital majeur | 2 | Attaque | Recharge 5-6 | CHA | Attaque | 1 | Soigne 50% dégâts | 10.0% |
| Étourdissement | 2 | Contrôle | 1/combat | CON | DD capacité | 1 | Étourdi | 10.0% |
| Paralysie | 2 | Contrôle | 1/combat | CON | DD capacité | 0 | Paralysé | 10.0% |
| Engloutissement | 2 | Contrôle | Libre | FOR | Test opposé | 1 | Englouti | 10.0% |
| Aura de terreur | 2 | Aura | Libre | CHA | DD capacité | 0 | Effrayé en zone | 10.0% |
| Régénération forte | 2 | Défense | 1/tour | CON | Passif | 0 | 10% PV max/tour | 10.0% |
| Résistance légendaire | 2 | Défense | 1/combat |  | Réaction | 0 | Ignore un effet | 10.0% |
| Action de boss | 2 | Boss | 1/tour |  | Hors tour | 0 | Capacité mineure hors tour | 15.0% |
| Réaction offensive | 2 | Boss | 1/tour | FOR | Réaction | 1 | Attaque hors tour | 10.0% |
| Invocation | 2 | Boss | 1/combat | CHA | — | 0 | Invoque des sbires | 15.0% |

### Sorts disponibles
| Nom | Rang | Cout | Type | Carac | Portee | Resolution | DM_mult | Effet | Usage | Danger_% |
|---|---|---|---|---|---|---|---|---|---|---|
| Projectile magique | 1 | 1 | Offensif | INT | Moyenne | Attaque | 75.0% | — | Libre | 5.0% |
| Trait élémentaire | 1 | 1 | Offensif | INT | Moyenne | Attaque | 1 | Élément choisi | Libre | 5.0% |
| Rayon de force | 1 | 1 | Offensif | INT | Longue | Attaque | 1 | Force | Libre | 5.0% |
| Onde élémentaire | 1 | 1 | Offensif | CON | Courte | DD capacité | 75.0% | Petite zone élémentaire | Recharge 5-6 | 5.0% |
| Entrave magique | 1 | 1 | Contrôle | INT | Moyenne | DD capacité | 0 | Entravé | Libre | 5.0% |
| Peur | 1 | 1 | Contrôle | CHA | Moyenne | DD capacité | 0 | Effrayé | Libre | 5.0% |
| Bouclier magique | 1 | 1 | Défense | INT | Soi | Réaction | 0 | +2 DEF contre une attaque | 1/tour | 5.0% |
| Téléportation courte | 1 | 1 | Mobilité | INT | Soi | — | 0 | Déplacement instantané | 1/tour | 0 |
| Illusion mineure | 1 | 1 | Utilitaire | INT | Moyenne | DD capacité | 0 | Illusion simple | Libre | 2.5% |
| Soin mineur | 1 | 1 | Soutien | SAG | Courte | — | 0 | Soigne 10% PV max | Recharge 5-6 | 5.0% |
| Explosion élémentaire | 2 | 2 | Offensif | INT | Moyenne | DD capacité | 75.0% | Zone élémentaire ; moitié réussite | Recharge 5-6 | 10.0% |
| Éclair en ligne | 2 | 2 | Offensif | INT | Longue | DD capacité | 1 | Air ; moitié réussite | Recharge 5-6 | 10.0% |
| Rayon d'ombre | 2 | 1 | Offensif | CHA | Moyenne | Attaque | 1 | Ombre | Libre | 5.0% |
| Rayon de lumière | 2 | 1 | Offensif | SAG | Moyenne | Attaque | 1 | Lumière | Libre | 5.0% |
| Silence | 2 | 1 | Contrôle | SAG | Moyenne | DD capacité | 0 | Silencieux en zone | Recharge 5-6 | 7.5% |
| Charme | 2 | 1 | Contrôle | CHA | Moyenne | DD capacité | 0 | Charmé | 1/combat | 7.5% |
| Invisibilité | 2 | 1 | Défense | INT | Soi | — | 0 | Invisible | 1/combat | 5.0% |
| Soin majeur | 3 | 2 | Soutien | SAG | Moyenne | — | 0 | Soigne 20% PV max | 1/combat | 10.0% |
| Confusion | 3 | 2 | Contrôle | CHA | Moyenne | DD capacité | 0 | Confus en zone | 1/combat | 10.0% |
| Paralysie | 3 | 2 | Contrôle | SAG | Moyenne | DD capacité | 0 | Paralysé | 1/combat | 10.0% |
| Tempête élémentaire | 4 | 2 | Offensif | INT | Longue | DD capacité | 1 | Grande zone ; moitié réussite | 1/combat | 10.0% |
| Domination | 4 | 2 | Contrôle | CHA | Moyenne | DD capacité | 0 | Domination brève | 1/combat | 15.0% |
| Téléportation majeure | 4 | 2 | Mobilité | INT | Longue | — | 0 | Téléportation groupe | 1/combat | 2.5% |
| Désintégration | 5 | 2 | Offensif | INT | Moyenne | DD capacité | 1.5 | Force ; moitié réussite | 1/combat | 15.0% |
| Résurrection / Retour | 5 | 2 | Soutien | SAG | Contact | — | 0 | Relève une cible selon scénario | 1/combat | 5.0% |

### Signatures automatiques
| Key | Sous_famille | Signature | Type | Usage | Carac | Resolution | DM_mult | Effet | DEF_mod | Reach_mod | Danger_% |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Gobelinoïde\|1 | Gobelinoïde | Repli malin | Active | 1/tour |  |  | 0 | Après une attaque : déplacement 2 m sans attaque d'opportunité | 0 | 0 | 0 |
| Saurien\|1 | Saurien | Amphibie | Passive |  |  |  | 0 | Respire et agit normalement sous l'eau | 0 | 0 | 0 |
| Orcoïde\|1 | Orcoïde | Rage | Passive |  |  |  | 0 | Sous 50% PV : +20% DM | 0 | 0 | 5.0% |
| Squelette\|1 | Squelette | Sans organes | Passive |  |  |  | 0 | Immunisé aux effets nécessitant sang, respiration ou organes | 0 | 0 | 2.5% |
| Charogne\|1 | Charogne | Infection | Passive |  | CON | DD capacité | 50.0% | Dégâts Toxiques mineurs sur attaques naturelles | 0 | 0 | 5.0% |
| Noble mort-vivant\|1 | Noble mort-vivant | Drain vital | Active | Recharge 5-6 | CHA | Attaque | 1 | Soigne 50% des dégâts infligés | 0 | 0 | 7.5% |
| Prédateur\|1 | Prédateur | Attaque en meute | Passive |  |  |  | 0 | +1 Toucher si un allié menace la cible | 0 | 0 | 5.0% |
| Volante\|1 | Volante | Volant | Passive |  |  |  | 0 | Vol naturel ; si aucune attaque CAC, hors d'atteinte du CAC en vol | 0 | 0 | 5.0% |
| Massive\|1 | Massive | Charge | Active | Libre | FOR | Attaque | 1.5 | Après déplacement en ligne droite : +50% DM | 0 | 0 | 5.0% |
| Cuirassée\|1 | Cuirassée | Carapace | Passive |  |  |  | 0 | +1 DEF | 1 | 0 | 0 |
| Venimeuse\|1 | Venimeuse | Venin | Passive |  | CON | DD capacité | 50.0% | Dégâts Toxiques mineurs | 0 | 0 | 5.0% |
| Insectoïde\|1 | Insectoïde | Chitine | Passive |  |  |  | 0 | +1 DEF | 1 | 0 | 0 |
| Arachnide\|1 | Arachnide | Toile | Active | Libre | DEX | Test opposé | 0 | Entravé | 0 | 0 | 5.0% |
| Fouisseuse\|1 | Fouisseuse | Embuscade | Active | Libre | DEX | Attaque | 1.5 | Première attaque après sortie du sol : +50% DM | 0 | 0 | 5.0% |
| Parasite\|1 | Parasite | Fixation | Active | Libre | FOR | Test opposé | 0 | Agrippé | 0 | 0 | 5.0% |
| Nuée\|1 | Nuée | Corps de nuée | Passive |  |  |  | 0 | Règles spéciales de Nuée | 0 | 0 | 7.5% |
| Prédateur marin\|1 | Prédateur marin | Frénésie aquatique | Passive |  |  |  | 0 | Dans l'eau : +1 Toucher | 0 | 0 | 2.5% |
| Amphibien intelligent\|1 | Amphibien intelligent | Amphibie | Passive |  |  |  | 0 | Respire et agit normalement terre/eau | 0 | 0 | 0 |
| Carapacé\|1 | Carapacé | Carapace | Passive |  |  |  | 0 | +1 DEF | 1 | 0 | 0 |
| Abyssal\|1 | Abyssal | Terreur abyssale | Passive |  |  |  | 0 | +1 DD aux capacités de Peur | 0 | 0 | 2.5% |
| Mutante\|1 | Mutante | Mutation | Passive |  |  |  | 0 | Choisit +1 DEF, +2 m mouvement, +1 Toucher ou mode de déplacement | 0 | 0 | 5.0% |
| Tentaculaire\|1 | Tentaculaire | Tentacules | Passive |  |  |  | 0 | +1 m d'allonge | 0 | 1 | 2.5% |
| Mentaliste\|1 | Mentaliste | Impulsion psychique | Active | Libre | INT | Attaque | 1 | Dégâts Psychiques | 0 | 0 | 7.5% |
| Amorphe\|1 | Amorphe | Corps amorphe | Passive |  |  |  | 0 | Corps déformable | 0 | 0 | 5.0% |
| Parasitaire\|1 | Parasitaire | Implantation | Active | Libre | FOR | Test opposé | 0 | Sur cible Agrippée : effet parasitaire | 0 | 0 | 7.5% |
| Végétal animé\|1 | Végétal animé | Enracinement | Passive |  |  |  | 0 | +2 contre Renversé/déplacement forcé | 0 | 0 | 2.5% |
| Fongique\|1 | Fongique | Spores | Active | Recharge 5-6 | CON | DD capacité | 50.0% | Zone Toxique mineure | 0 | 0 | 5.0% |
| Carnivore\|1 | Carnivore | Dévorer | Active | Libre | FOR | Attaque | 1.5 | Contre cible Agrippée | 0 | 0 | 7.5% |
| Arborescente\|1 | Arborescente | Racines | Active | Recharge 5-6 | FOR | Test opposé | 0 | Entravé | 0 | 0 | 5.0% |
| Sylvestre\|1 | Sylvestre | Camouflage naturel | Passive |  |  |  | 0 | Bonus discrétion en milieu naturel | 0 | 0 | 0 |
| Sombre\|1 | Sombre | Pas d'ombre | Active | 1/tour | DEX |  | 0 | Téléportation courte entre ombres | 0 | 0 | 0 |
| Noble féerique\|1 | Noble féerique | Présence féerique | Passive |  |  |  | 0 | +1 DD Charme/Peur/Illusion | 0 | 0 | 2.5% |
| Illusionniste\|1 | Illusionniste | Illusion mineure | Active | Libre | INT | DD capacité | 0 | Crée une illusion simple | 0 | 0 | 2.5% |
| Bestiale\|1 | Bestiale | Bond | Active | 1/tour | DEX |  | 0 | Bond amélioré | 0 | 0 | 0 |
| Prédateur monstrueux\|1 | Prédateur monstrueux | Attaque en meute | Passive |  |  |  | 0 | +1 Toucher si un allié menace la cible | 0 | 0 | 5.0% |
| Hybride\|1 | Hybride | Trait hybride | Passive |  |  |  | 0 | Choisit un trait naturel simple | 0 | 0 | 5.0% |
| Régénérant\|1 | Régénérant | Régénération | Passive | 1/tour | CON |  | 0 | 5% PV max/tour | 0 | 0 | 5.0% |
| Cuirassé\|1 | Cuirassé | Carapace | Passive |  |  |  | 0 | +1 DEF | 1 | 0 | 0 |
| Volant\|1 | Volant | Volant | Passive |  |  |  | 0 | Vol naturel ; si aucune attaque CAC, hors d'atteinte du CAC en vol | 0 | 0 | 5.0% |
| Venimeux\|1 | Venimeux | Venin | Passive |  | CON | DD capacité | 50.0% | Dégâts Toxiques mineurs | 0 | 0 | 5.0% |
| Gélatineuse\|1 | Gélatineuse | Engloutissement | Active | Libre | FOR | Test opposé | 1 | Cible Engloutie | 0 | 0 | 10.0% |
| Corrosive\|1 | Corrosive | Corrosion | Passive |  |  |  | 0 | Attaques naturelles Terre/acide | 0 | 0 | 5.0% |
| Mimétique\|1 | Mimétique | Mimétisme | Passive |  |  |  | 0 | Imite un objet simple immobile | 0 | 0 | 0 |
| Démon mineur\|1 | Démon mineur | Flamme infernale | Passive |  |  |  | 0 | Attaques naturelles peuvent infliger Feu | 0 | 0 | 5.0% |
| Brute infernale\|1 | Brute infernale | Rage infernale | Passive |  |  |  | 0 | Sous 50% PV : +20% DM | 0 | 0 | 5.0% |
| Corrupteur\|1 | Corrupteur | Corruption | Active | Recharge 5-6 | CHA | DD capacité | 0 | Affaibli | 0 | 0 | 5.0% |
| Tentateur\|1 | Tentateur | Charme | Active | 1/combat | CHA | DD capacité | 0 | Charmé | 0 | 0 | 7.5% |
| Prédateur infernal\|1 | Prédateur infernal | Traque | Passive |  |  |  | 0 | +1 Toucher contre cible désignée | 0 | 0 | 2.5% |
| Ogre\|1 | Ogre | Grande allonge | Passive |  |  |  | 0 | +1 m d'allonge | 0 | 1 | 2.5% |
| Géant véritable\|1 | Géant véritable | Projection | Active | Libre | FOR | Test opposé | 50.0% | Repousse la cible | 0 | 0 | 5.0% |
| Titanide\|1 | Titanide | Frappe titanesque | Active | Recharge 5-6 | FOR | Attaque | 1.5 | Attaque majeure | 0 | 0 | 7.5% |
| Runique\|1 | Runique | Rune active | Passive/Active | Recharge 5-6 | CON | DD capacité | 1 | Affinité + attaque élémentaire | 0 | 0 | 7.5% |
| Feu\|1 | Feu | Absorption Feu | Passive |  |  |  | 0 | Dégâts Feu reçus soignent selon Soin | 0 | 0 | 0 |
| Feu\|2 | Feu | Brûlure | Passive |  | CON | DD capacité | 50.0% | Attaques Feu appliquent brûlure | 0 | 0 | 5.0% |
| Air\|1 | Air | Absorption Air | Passive |  |  |  | 0 | Dégâts Air reçus soignent selon Soin | 0 | 0 | 0 |
| Air\|2 | Air | Intangible | Passive |  |  |  | 0 | Corps diffus/intangible | 0 | 0 | 10.0% |
| Air\|3 | Air | Rafale | Active | Recharge 5-6 | CON | DD capacité | 75.0% | Renversé | 0 | 0 | 5.0% |
| Eau\|1 | Eau | Absorption Eau | Passive |  |  |  | 0 | Dégâts Eau reçus soignent selon Soin | 0 | 0 | 0 |
| Eau\|2 | Eau | Intangible | Passive |  |  |  | 0 | Corps fluide/intangible | 0 | 0 | 10.0% |
| Eau\|3 | Eau | Lenteur aqueuse | Active | Recharge 5-6 | CON | DD capacité | 50.0% | Entravé | 0 | 0 | 5.0% |
| Terre\|1 | Terre | Absorption Terre | Passive |  |  |  | 0 | Dégâts Terre reçus soignent selon Soin | 0 | 0 | 0 |
| Terre\|2 | Terre | Stabilité | Passive |  |  |  | 0 | +2 contre Renversé/déplacement forcé | 0 | 0 | 2.5% |
| Ombre\|1 | Ombre | Absorption Ombre | Passive |  |  |  | 0 | Dégâts Ombre reçus soignent selon Soin | 0 | 0 | 0 |
| Ombre\|2 | Ombre | Intangible | Passive |  |  |  | 0 | Corps intangible | 0 | 0 | 10.0% |
| Ombre\|3 | Ombre | Pas d'ombre | Active | 1/tour | DEX |  | 0 | Téléportation courte entre ombres | 0 | 0 | 0 |
| Lumière\|1 | Lumière | Absorption Lumière | Passive |  |  |  | 0 | Dégâts Lumière reçus soignent selon Soin | 0 | 0 | 0 |
| Lumière\|2 | Lumière | Intangible | Passive |  |  |  | 0 | Corps énergétique intangible | 0 | 0 | 10.0% |
| Lumière\|3 | Lumière | Éblouissement | Active | Recharge 5-6 | SAG | DD capacité | 50.0% | Aveuglé | 0 | 0 | 7.5% |
| Force\|1 | Force | Absorption Force | Passive |  |  |  | 0 | Dégâts Force reçus soignent selon Soin | 0 | 0 | 0 |
| Force\|2 | Force | Intangible | Passive |  |  |  | 0 | Corps énergétique intangible | 0 | 0 | 10.0% |
| Force\|3 | Force | Impact de force | Active | Recharge 5-6 | CON | DD capacité | 75.0% | Renversé/repoussé | 0 | 0 | 5.0% |
| Messager divin\|1 | Messager divin | Aura inspirante | Passive |  |  |  | 0 | Alliés proches +1 contre Peur | 0 | 0 | 2.5% |
| Gardien sacré\|1 | Gardien sacré | Interception | Réaction | 1/tour | DEX | Réaction | 0 | Prend une attaque destinée à un allié proche | 0 | 0 | 5.0% |
| Avatar\|1 | Avatar | Présence divine | Passive |  |  |  | 0 | +1 DD pouvoirs sacrés | 0 | 0 | 2.5% |
| Objet animé\|1 | Objet animé | Sans biologie | Passive |  |  |  | 0 | Immunités biologiques logiques | 0 | 0 | 2.5% |
| Automate\|1 | Automate | Programmation | Passive |  |  |  | 0 | Résiste aux effets mentaux simples | 0 | 0 | 2.5% |
| Golem\|1 | Golem | Inarrêtable | Passive |  |  |  | 0 | +2 contre Renversé/Agrippé/déplacement forcé | 0 | 0 | 5.0% |
| Gardien\|1 | Gardien | Interception | Réaction | 1/tour | DEX | Réaction | 0 | Protège un allié proche | 0 | 0 | 5.0% |
| Arcanique\|1 | Arcanique | Noyau magique | Active | Libre | INT | Attaque | 1 | Attaque de Force | 0 | 0 | 5.0% |
| Esprit lié\|1 | Esprit lié | Ancrage | Passive |  |  |  | 0 | Lié à un lieu ou objet | 0 | 0 | 0 |
| Spectre\|1 | Spectre | Intangibilité | Passive |  |  |  | 0 | Traverse les obstacles | 0 | 0 | 10.0% |
| Poltergeist\|1 | Poltergeist | Télékinésie | Active | Libre | SAG | Test opposé | 0 | Déplace cible/objet | 0 | 0 | 5.0% |
| Possesseur\|1 | Possesseur | Possession | Active | 1/combat | CHA | DD capacité | 0 | Possession | 0 | 0 | 10.0% |
| Revenant\|1 | Revenant | Retour surnaturel | Passive |  |  |  | 0 | Peut revenir tant que condition non résolue | 0 | 0 | 2.5% |
| Dragon mineur\|1 | Dragon mineur | Souffle mineur | Active | Recharge 5-6 | CON | DD capacité | 75.0% | Zone ; moitié sur réussite | 0 | 0 | 5.0% |
| Dragon élémentaire\|1 | Dragon élémentaire | Souffle élémentaire | Active | Recharge 5-6 | CON | DD capacité | 1 | Élément associé ; moitié sur réussite | 0 | 0 | 7.5% |
| Dragon de métal\|1 | Dragon de métal | Écailles métalliques | Passive |  |  |  | 0 | +1 DEF | 1 | 0 | 0 |
| Dragon de gemme\|1 | Dragon de gemme | Impulsion psychique | Active | Recharge 5-6 | SAG | DD capacité | 1 | Dégâts Psychiques | 0 | 0 | 7.5% |
| Dragon nécrotique\|1 | Dragon nécrotique | Souffle nécrotique | Active | Recharge 5-6 | CON | DD capacité | 1 | Ombre ; moitié sur réussite | 0 | 0 | 7.5% |
| Dragon primordial\|1 | Dragon primordial | Souffle primordial | Active | Recharge 5-6 | CON | DD capacité | 1.5 | Grande zone ; moitié sur réussite | 0 | 0 | 10.0% |

### Exemple complet exporté

```text
Predicats : resistanceA_tranchant resistanceA_percant absorptionA_feu faiblesseMajeureA_eau

!cof-attack @{selected|token_id} @{target|token_id} Souffle élémentaire --auto --dm 2d12+1 --portee 15 --feu --cone 90 --psave DEX 13 --recharge 5 MC_SIG1
```

Cet exemple montre pourquoi la référence des prédicats de dégâts et la grammaire `!cof-attack` sont documentées ensemble : le Monster Creator ne produit pas une magie séparée, il produit des entrées COFantasy standard.


## 25. Options de règles V2

Les options sont accessibles par `!cof-options`. Les valeurs suivantes sont les valeurs par défaut du script distribué.

| Option | Défaut | Type | Rôle |
|---|---:|---|---|
| `forme_d_arbre_amelioree` | `true` | bool | +50 % à Peau d’écorce en forme d’arbre. |
| `poudre_explosif` | `true` | bool | Les armes à poudre utilisent les dégâts explosifs. |
| `interchangeable_attaque` | `true` | bool | Interchangeable échange une partie de DEF contre de l’attaque. |
| `coups_critiques_etendus` | `false` | bool | Critique si l’attaque dépasse DEF +10. |
| `echec_critique_boule_de_feu` | `12` | int | Déviation aléatoire maximale d’une boule de feu sur échec critique. |
| `blessures_graves` | `true` | bool | Active les conséquences graves/PR à 0 PV et sur chocs importants. |
| `degats_importants` | `3` | int | Seuil complémentaire de dégâts importants ; 0 désactive la règle. |
| `dm_minimum` | `0` | int | Dégâts minimum d’une source. |
| `crit_elementaire` | `false` | bool | Multiplie aussi certains dégâts constants secondaires sur critique. |
| `max_rune_protection` | `true` | bool | Limite l’absorption de Rune de protection à 10×rang. |
| `dm_explosifs` | `false` | bool | Tous les dés de dégâts deviennent explosifs. |
| `usure_DEF` | `6` | int | -2 DEF tous les N tours ; 0 désactive. |
| `bonus_attaque_groupe` | `2` | int | Bonus de touche par créature supplémentaire dans une attaque de groupe. |
| `crit_attaque_groupe` | `5` | int | Dépassement de DEF qui double les dégâts d’une attaque de groupe ; 0 jamais. |
| `initiative_variable` | `false` | bool | Ajoute 1d6 à l’initiative par type de créature. |
| `initiative_variable_individuelle` | `false` | bool | Lance l’initiative variable par créature. |
| `joueurs_lancent_init` | `false` | bool | Propose aux joueurs de lancer leur initiative variable. |
| `mana_totale` | `false` | bool | Tous les sorts ont un coût ; tempête de mana ×3. |
| `PR_rend_mana` | `false` | bool | Dépenser un PR au repos rend aussi de la mana. |
| `contrecoup` | `false` | bool | Déficit de PM payé en PV avec Mana totale. |
| `brulure_de_magie` | `false` | bool | Autorise le paiement de mana en PV ; incompatible avec Mana totale. |
| `elixirs_sorts` | `true` | bool | Les élixirs sont traités comme sorts pour les coûts de mana. |
| `MJ_voit_actions` | `false` | bool | Montre le choix d’actions des PJ au MJ. |
| `MJ_valide_affichage_attaques` | `false` | bool | Résultat d’attaque d’abord privé au MJ. |
| `MJ_valide_affichage_jets` | `false` | bool | Jets de caractéristiques d’abord privés au MJ. |
| `avatar_dans_cadres` | `true` | bool | Utilise l’avatar plutôt que l’image du token. |
| `manoeuvres` | `true` | bool | Affiche les manœuvres dans la liste d’actions. |
| `actions_par_defaut` | `true` | bool | Sans ability #Actions#, affiche les abilities. |
| `montre_def` | `true` | bool | Affiche la DEF adverse dans les cadres de combat. |
| `duree_effets` | `false` | bool | Affiche la durée des effets liés aux tokens. |
| `init_dynamique` | `true` | bool | Aura dynamique sur le token actif. |
| `markers_personnalises` | `true` | bool | Utilise les status markers personnalisés `cof...`. |
| `table_crit` | `false` | bool | Utilise la table Roll20 `Echec-Critique-Contact`. |
| `depense_mana` | `false` | bool | Affiche chaque dépense de mana dans le chat. |

## 26. Recettes de création — modèles copiables

### Attaque simple
```text
!cof-attack @{selected|token_id} @{target|token_id} Coup --auto --toucher 6 --dm 1d8+3 --tranchant
```

### Attaque élémentaire avec vulnérabilités automatiques
```text
!cof-attack @{selected|token_id} @{target|token_id} Trait de feu --auto --toucher 7 --dm 2d6+2 --feu --portee 20
```
La cible `vulnerableA_feu` prend ×1,5 ; `faiblesseMajeureA_feu` prend ×2 ; `resistanceA_feu` ajoute une division ; `absorptionA_feu` absorbe.

### Cône avec demi-dégâts sur sauvegarde
```text
!cof-attack @{selected|token_id} @{target|token_id} Souffle --auto --dm 4d6 --feu --cone 90 --portee 12 --psave DEX 15 --recharge 5 souffle
```

### Paralysie sans dégâts
```text
!cof-attack @{selected|token_id} @{target|token_id} Regard paralysant --auto --pasDeDmg --effet paralyse 2 --save CON 15 --limiteParCombat 1 regard_paralysant
```

### Dégâts supplémentaires seulement contre un type
```text
!cof-attack @{selected|token_id} @{target|token_id} Lame sacrée --auto --dm 1d8+3 --tranchant --if typeCible mortVivant --plus 2d6 --lumiere --endif
```

### Buff temporaire
```text
!cof-effet-temp bonusDefense 3 --valeur 2 --lanceur @{selected|token_id} --target @{selected|token_id}
```

### Prédicats de monstre
```text
creatureArtificielle
immunite_toxique
resistanceA_tranchant
vulnerableA_force
bonusSaveContre_etourdi:2
bonusTests_PERCEPTION:3
```

---

---

---

---

---

## 27. Fiches techniques des 252 commandes — arguments réellement lus par les handlers

Cette section complète l’atlas : elle est générée depuis les handlers V2. Elle sert surtout quand une commande spécialisée n’a pas de recette dédiée plus haut. Les mentions `arg1`, `arg2` sont conservées **uniquement** lorsque le code ne donne pas de nom explicite à la valeur ; les flags, valeurs de `switch`, contrôles de token/personnage/événement et restrictions MJ sont extraits du code. Les commandes déclenchées normalement par un bouton peuvent contenir des identifiants internes (`event_id`, session, transaction) qu’il vaut mieux ne pas fabriquer à la main.

### `!cof-a-couvert`

```text
!cof-a-couvert <arg1> [arg2] [--secret]
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage).

Flags/options observés : `--secret`.

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Le premier argument n / Le second argument n.

**Moteur :** `aCouvert` (ligne 33146).

### `!cof-affaiblir-carac`

```text
!cof-affaiblir-carac carac valeur
```

Arguments positionnels lus : arg1, arg2.

Valeurs littérales acceptées dans le handler : `FOR`, `force`, `DEX`, `dexterite`, `dexterité`, `dextérité`, `dextérite`, `CON`, `constution`, `INT`, `intelligence`, `SAG`, `sagesse`, `CHA`, `charisme`, `RAND`, `rand`, `random`.

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Pas de cible sélectionée pour l / Impossible de savoir l.

**Moteur :** `parseAffaiblirCarac` (ligne 47497).

### `!cof-agrandir-page`

```text
!cof-agrandir-page [arg1]
```

Arguments positionnels lus : arg1 (nombre).

Le code exige au minimum 0 argument(s) après le nom de commande dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Il manque le facteur d / Commande réservée aux MJs / Impossible de trouver la page.

**Moteur :** `agrandirPage` (ligne 47928).

### `!cof-aile-forge-runique`

```text
!cof-aile-forge-runique <arg1>
```

Arguments positionnels lus : arg1.

Valeurs littérales acceptées dans le handler : `paresse`, `orgueil`, `gourmandise`, `colere`, `luxure`, `avarice`, `envie`, `colère`, `non`, `sortir`, `false`, `fin`.

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

**Moteur :** `entrerAileForgeRunique` (ligne 45690).

### `!cof-animation-des-objets`

```text
!cof-animation-des-objets @{selected|token_id} niveau
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (entier, niveauObjet), arg3.

Valeurs littérales acceptées dans le handler : `très petite`, `petite`, `grande`.

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Impossible d / Impossible de créer le token.

**Moteur :** `animationDesObjets` (ligne 47260).

### `!cof-armure-magique`

```text
!cof-armure-magique
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `armureMagique` (ligne 32085).

### `!cof-attack`

```text
!cof-attack <arg1> <arg2>
```

Arguments positionnels lus : arg1 (token/personnage), arg2.

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Le premier argument de !cof-attack n / le second argument de !cof-attack doit être un token.

**Moteur :** `parseAttack` (ligne 11772).

### `!cof-attaque-opportunite`

```text
!cof-attaque-opportunite
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `cofAttaqueOpportunite` (ligne 52138).

### `!cof-attaque-opportunite-ignorer`

```text
!cof-attaque-opportunite-ignorer
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `cofAttaqueOpportuniteIgnorer` (ligne 52162).

### `!cof-attack-line`

```text
!cof-attack-line <arg1>
```

Arguments positionnels lus : arg1 (token/personnage).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Il manque un argument à !cof-attack-line / Le premier argument de !cof-attack-line n.

**Moteur :** `attaqueLigneBouger` (ligne 48389).

### `!cof-attack-line-from`

```text
!cof-attack-line-from <arg1> <arg2> <arg3>
```

Arguments positionnels lus : arg1 (entier, originLeft), arg2 (entier, originTop), arg3 (token/personnage).

Le code exige au minimum 3 argument(s) après le nom de commande dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Le premier argument de !cof-attack-line n / Il manque un argument à --distanceMax.

**Moteur :** `attaqueLigne` (ligne 48437).

### `!cof-attendre`

```text
!cof-attendre <arg1> [sélection Roll20]
```

Arguments positionnels lus : arg1 (entier, newInit).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : La fonction !cof-attendre : rien à faire, pas de token selectionné.

**Moteur :** `attendreInit` (ligne 31258).

### `!cof-observation`

```text
!cof-observation <arg1> <arg2> <arg3>
```

Arguments positionnels lus : arg1 (typeObservation), arg2 (token/personnage), arg3 (token/personnage).

Le code exige au minimum 3 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Impossible de trouver le personnage qui observe. / Impossible de trouver la cible observée. / Impossible d.

**Moteur :** `observation` (ligne 31490).

### `!cof-bonus-couvert`

```text
!cof-bonus-couvert [arg1] [sélection Roll20]
```

Arguments positionnels lus : arg1 (entier).

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Il faut un argument positif pour !cof-bonus-couvert / pas de token sélectionné pour !cof-bonus-couvert.

**Moteur :** `bonusCouvert` (ligne 44286).

### `!cof-bouger`

```text
!cof-bouger [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Pas de token sélectionné / Action réservée au MJ / Impossible de créer de token pour décoincer.

**Moteur :** `decoincer` (ligne 47993).

### `!cof-bouton-chance`

```text
!cof-bouton-chance <arg1> [arg2]
```

Arguments positionnels lus : arg1 (event_id), arg2.

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

**Moteur :** `boutonChance` (ligne 28712).

### `!cof-bouton-pousser-kiai`

```text
!cof-bouton-pousser-kiai <arg1>
```

Arguments positionnels lus : arg1 (event_id).

Valeurs littérales acceptées dans le handler : `Attaque`.

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il manque l / Impossible de relancer l.

**Moteur :** `kiai` (ligne 29445).

### `!cof-buf-def`

```text
!cof-buf-def <arg1> [sélection Roll20]
```

Arguments positionnels lus : arg1 (buf, entier).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : La fonction !cof-buf-def attend un argument / Argument de !cof-buf-def invalide / Pas de token sélectionné pour !cof-buf-def.

**Moteur :** `bufDef` (ligne 32090).

### `!cof-canaliser`

```text
!cof-canaliser <arg1> [sélection Roll20]
```

Arguments positionnels lus : arg1.

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Il manque le type de canalisation / Rien à canaliser. Il faut préciser un montant de soins ou de dégâts / Il faut sélectionner un personnage.

**Moteur :** `canaliser` (ligne 46990).

### `!cof-changer-de-forme`

```text
!cof-changer-de-forme <arg1> [sélection Roll20]
```

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Il manque le nom de la forme pour !cof-changer-de-forme / Impossible trouver de fiche pour \ / Utilisation de !cof-changer-de-forme sans sélection de token.

**Moteur :** `changerDeForme` (ligne 49539).

### `!cof-clean-global-state`

```text
!cof-clean-global-state
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `cleanGlobalState` (ligne 49064).

### `!cof-confirmer-attaque`

```text
!cof-confirmer-attaque <arg1>
```

Arguments positionnels lus : arg1 (event_id).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `confirmerAttaque` (ligne 6100).

### `!cof-creer-baies`

```text
!cof-creer-baies [arg1] [sélection Roll20]
```

Arguments positionnels lus : arg1 (entier).

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Utilisation de !cof-creer-baies sans sélection de token.

**Moteur :** `creerBaies` (ligne 48244).

### `!cof-degainer`

```text
!cof-degainer [arg1] [arg2] [sélection Roll20]
```

Arguments positionnels lus : arg1, arg2.

Valeurs littérales acceptées dans le handler : `faible`, `gauche`, `droite`, `dominant`, `dominante`, `principal`, `principale`, `2mains`.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : commande non formée / Qui doit dégainer ?.

**Moteur :** `parseDegainer` (ligne 32982).

### `!cof-division-vase`

```text
!cof-division-vase [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

**Moteur :** `divisionVase` (ligne 49698).

### `!cof-braise-solaire`

```text
!cof-braise-solaire <arg1> <arg2>
```

Arguments positionnels lus : arg1 (entier, eventId), arg2 (targetId).

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Commande Braise solaire mal formée.

**Moteur :** `braiseSolaireReaction` (ligne 32320).

### `!cof-dmg`

```text
!cof-dmg <arg1> [sélection Roll20]
```

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : cof-dmg prend les dégats en argument, avant les options.

**Moteur :** `parseDmgDirects` (ligne 32268).

### `!cof-echange-init`

```text
!cof-echange-init <arg1> <arg2> [arg3]
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage), arg3 (entier).

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : le premier argument n / le second argument n / Le troisième argument n.

**Moteur :** `echangeInit` (ligne 33066).

### `!cof-effet-chaque-d20`

```text
!cof-effet-chaque-d20 <arg1> [arg2] [arg3]
```

Arguments positionnels lus : arg1 (typeEffet), arg2 (entier), arg3 (entier).

Valeurs littérales acceptées dans le handler : `true`, `oui`, `non`, `sortir`, `false`, `fin`.

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Commande réservée au MJ / Il manque l / Le premier argument de !cof-effet-chaque-d20 est invalide.

**Moteur :** `setEffetChaqueD20` (ligne 47843).

### `!cof-effet-combat`

```text
!cof-effet-combat <arg1> [sélection Roll20]
```

Arguments positionnels lus : arg1 (effet).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Pas de cible sélectionée pour l / Impossible de savoir l.

**Moteur :** `effetCombat` (ligne 33759).

### `!cof-effet-temp`

```text
!cof-effet-temp <arg1> <arg2> [sélection Roll20]
```

Arguments positionnels lus : arg1 (effet), arg2 (entier).

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Impossible de trouver l / Pas de cible sélectionée pour l / Impossible de savoir l.

**Moteur :** `parseEffetTemporaire` (ligne 33209).

### `!cof-expert-combat`

```text
!cof-expert-combat [arg1] [sélection Roll20]
```

Arguments positionnels lus : arg1 (event_id).

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Impossible de relancer l / Pas de token sélectionné pour !cof-expert-combat-touche.

**Moteur :** `expertDuCombat` (ligne 29168).

### `!cof-expert-combat-touche`

```text
!cof-expert-combat-touche [arg1] [sélection Roll20]
```

Arguments positionnels lus : arg1 (event_id).

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Impossible de relancer l / Pas de token sélectionné pour !cof-expert-combat-touche.

**Moteur :** `expertDuCombat` (ligne 29168).

### `!cof-expert-combat-dm`

```text
!cof-expert-combat-dm [arg1] [sélection Roll20]
```

Arguments positionnels lus : arg1 (event_id).

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Impossible de relancer l / Pas de token sélectionné pour !cof-expert-combat-touche.

**Moteur :** `expertDuCombat` (ligne 29168).

### `!cof-expert-combat-def`

```text
!cof-expert-combat-def <arg1> <arg2>
```

Arguments positionnels lus : arg1 (event_id), arg2 (token/personnage).

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

**Moteur :** `expertDuCombatDEF` (ligne 29223).

### `!cof-expert-combat-bousculer`

```text
!cof-expert-combat-bousculer <arg1> <arg2>
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage).

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il manque des arguments à !cof-expert-combat-bousculer / Le premier argument de !cof-expert-combat-bousculer n / Le deuxième argument de !cof-expert-combat-bousculer n.

**Moteur :** `expertDuCombatBousculer` (ligne 41631).

### `!cof-explosion`

```text
!cof-explosion [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Il manque le label de l.

**Moteur :** `attaqueExplosion` (ligne 47797).

### `!cof-fin-changement-de-forme`

```text
!cof-fin-changement-de-forme [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Utilisation de !cof-fin-changement-de-forme sans sélection de token / Impossible de trouver les PVs du moment de la transformation.

**Moteur :** `finChangementDeForme` (ligne 49640).

### `!cof-hors-combat`

```text
!cof-hors-combat
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `sortirDuCombat` (ligne 26635).

### `!cof-fin-combat`

```text
!cof-fin-combat
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `sortirDuCombat` (ligne 26635).

### `!cof-fin-reaction-violente`

```text
!cof-fin-reaction-violente token_id
```

Arguments positionnels lus : arg1 (token/personnage).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Le premier argument de !cof-fin-reaction-violente n.

**Moteur :** `finReactionViolente` (ligne 47747).

### `!cof-foudre-du-temps`

```text
!cof-foudre-du-temps <arg1> [arg2] [arg3]
```

Arguments positionnels lus : arg1 (typeEffet), arg2 (entier), arg3 (entier).

Valeurs littérales acceptées dans le handler : `true`, `oui`, `non`, `sortir`, `false`, `fin`.

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Commande réservée au MJ / Il manque l / Le premier argument de !cof-effet-chaque-d20 est invalide.

**Moteur :** `setEffetChaqueD20` (ligne 47843).

### `!cof-gerer-runes-mortes`

```text
!cof-gerer-runes-mortes <arg1> <arg2> <arg3> [arg4]
```

Arguments positionnels lus : arg1 (token/personnage), arg2, arg3, arg4 (token/personnage).

Valeurs littérales acceptées dans le handler : `activer`, `desactiver`, `donner`, `recuperer`.

Le code exige au minimum 3 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : il manque l / Il faut préciser le token à qui donner la rune / Impossible de trouver à qui donner la rune.

**Moteur :** `gererRunesMortes` (ligne 48695).

### `!cof-huile-instable`

```text
!cof-huile-instable <arg1>
```

Arguments positionnels lus : arg1 (token/personnage).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : La fonction !cof-huile-instable attend en argument la personne dont il faut enflammer l.

**Moteur :** `huileInstable` (ligne 36295).

### `!cof-immunite-guerisseur`

```text
!cof-immunite-guerisseur <arg1> [sélection Roll20]
```

Arguments positionnels lus : arg1 (duree, entier).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Il manque un argument à !cof-immunite-guerisseur / Utilisation de !cof-immunite-guerisseur sans sélection de token.

**Moteur :** `immuniteDuGuerisseur` (ligne 48940).

### `!cof-init`

```text
!cof-init [--aura] [sélection Roll20]
```

Flags/options observés : `--aura`.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Dans !cof-init : rien à faire, pas de token selectionné.

**Moteur :** `initiativeInterface` (ligne 13123).

### `!cof-jet`

```text
!cof-jet <arg1> [arg2] [sélection Roll20]
```

Arguments positionnels lus : arg1 (bonus, caracteristique, entier, plageEC), arg2 (entier).

Valeurs littérales acceptées dans le handler : `nom`, `attribut`, `predicat`, `bonus`, `secret`, `competences`, `plageEchecCritique`, `succes`, `a`, `e`, `i`, `o`, `u`.

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Il manque un argument à l / Le bonus doit être un nombre / Utilisation de !cof-jet sans sélection de token.

**Moteur :** `jet` (ligne 9245).

### `!cof-liste-actions`

```text
!cof-liste-actions [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

**Moteur :** `apiTurnAction` (ligne 31077).

### `!cof-mettre-a-zero-pv`

```text
!cof-mettre-a-zero-pv [arg1] [arg2] [arg3]
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (event_id), arg3 (entier).

Contrôles utiles : Il faut 3 ou 4 arguments pour !cof-mettre-a-zero-pv / Impossible de trouver le token du personnage qui doit mourrir / Impossible de trouver l.

**Moteur :** `interfaceMettreAZeroPV` (ligne 25221).

### `!cof-mettre-casque`

```text
!cof-mettre-casque [arg1] [sélection Roll20]
```

Arguments positionnels lus : arg1.

Travaille avec la sélection Roll20 dans au moins un chemin.

**Moteur :** `mettreCasque` (ligne 49256).

### `!cof-montrer-resultats-attaque`

```text
!cof-montrer-resultats-attaque
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `montrerResultatsAttaque` (ligne 22927).

### `!cof-montrer-resultats-jet`

```text
!cof-montrer-resultats-jet <arg1>
```

Arguments positionnels lus : arg1.

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : manque l.

**Moteur :** `montrerResultatJet` (ligne 8437).

### `!cof-nouveau-jour`

```text
!cof-nouveau-jour [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

**Moteur :** `parseNouveauJour` (ligne 28095).

### `!cof-open-door`

```text
!cof-open-door <arg1>
```

Arguments positionnels lus : arg1.

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il manque un argument à !cof-open-door / Impossible de trouver la porte.

**Moteur :** `openDoor` (ligne 48369).

### `!cof-options`

```text
!cof-options
```

Valeurs littérales acceptées dans le handler : `bool`, `oui`, `true`, `1`, `non`, `false`, `0`, `int`, `options`, `image`, `son`.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : inconnue dans les options par défaut / inconnue..

**Moteur :** `setCofOptions` (ligne 43333).

### `!cof-pathfinder1`

```text
!cof-pathfinder1 [--incrCritCoef] [--target] [sélection Roll20]
```

Flags/options observés : `--incrCritCoef`, `--target`.

Le handler contient 230 branches de valeurs littérales ; voir les sous-commandes/options documentées dans les sections dédiées.

Travaille avec la sélection Roll20 dans au moins un chemin.

**Moteur :** `translateFromPathfinder1` (ligne 45909).

### `!cof-pause`

```text
!cof-pause
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `pauseGame` (ligne 48079).

### `!cof-poser-bombe`

```text
!cof-poser-bombe <arg1> <arg2> <arg3> <arg4> [arg5]
```

Arguments positionnels lus : arg1 (token/personnage), arg2, arg3 (entier), arg4, arg5 (entier).

Valeurs littérales acceptées dans le handler : `demolition`, `démolition`, `piege`, `piège`, `retard`, `retardé`, `intrusion`, `detection`, `détection`.

Le code exige au minimum 4 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il manque des arguments pour !cof-poser-bombe / Le premier argument de !cof-poser-bombe n / Impossible de créer le token de la bombe.

**Moteur :** `poserBombe` (ligne 49102).

### `!cof-recharger`

```text
!cof-recharger <arg1> [sélection Roll20]
```

Arguments positionnels lus : arg1 (attackLabel).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : La fonction !cof-recharger attend au moins un argument / !cof-recharger sans sélection de tokens.

**Moteur :** `recharger` (ligne 28425).

### `!cof-riposte-defi`

```text
!cof-riposte-defi <arg1> <arg2>
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage).

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Commande de posture de riposte incomplète / Impossible de retrouver les participants de la riposte.

**Moteur :** `riposteDefiGuerrier` (ligne 18671).

### `!cof-recuperation`

```text
!cof-recuperation [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : impossible de se reposer en combat / !cof-recuperation sans sélection de tokens.

**Moteur :** `parseRecuperer` (ligne 28147).

### `!cof-recupere-mana`

```text
!cof-recupere-mana <arg1> [sélection Roll20]
```

Arguments positionnels lus : arg1.

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Il manque le montant de mana à récupérer pour !cof-recupere-mana.

**Moteur :** `recupereMana` (ligne 49311).

### `!cof-remove-buf-def`

```text
!cof-remove-buf-def [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Pas de token sélectionné pour !cof-remove-buf-def.

**Moteur :** `removeBufDef` (ligne 32126).

### `!cof-resultat-jet`

```text
!cof-resultat-jet <arg1> <arg2>
```

Arguments positionnels lus : arg1 (event_id), arg2.

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

**Moteur :** `resultatJet` (ligne 9401).

### `!cof-retour-boomerang`

```text
!cof-retour-boomerang <arg1> <arg2>
```

Arguments positionnels lus : arg1 (token/personnage), arg2.

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il manque des arguments à !cof-retour-boomerang.

**Moteur :** `retourBoomerang` (ligne 48345).

### `!cof-rune-protection`

```text
!cof-rune-protection [arg1] [sélection Roll20]
```

Arguments positionnels lus : arg1 (event_id).

Travaille avec la sélection Roll20 dans au moins un chemin.

**Moteur :** `runeProtection` (ligne 40735).

### `!cof-rune-puissance`

```text
!cof-rune-puissance <arg1> [arg2] [arg3] [sélection Roll20]
```

Arguments positionnels lus : arg1 (labelArme), arg2 (event_id), arg3.

Valeurs littérales acceptées dans le handler : `Attaque`.

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Il faut spécifier le label de l / Impossible de relancer l / Pas de token sélectionné pour !cof-rune-puissance.

**Moteur :** `runePuissance` (ligne 29374).

### `!cof-bouton-rune-puissance`

```text
!cof-bouton-rune-puissance <arg1> [arg2] [arg3] [sélection Roll20]
```

Arguments positionnels lus : arg1 (labelArme), arg2 (event_id), arg3.

Valeurs littérales acceptées dans le handler : `Attaque`.

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Il faut spécifier le label de l / Impossible de relancer l / Pas de token sélectionné pour !cof-rune-puissance.

**Moteur :** `runePuissance` (ligne 29374).

### `!cof-rune-energie`

```text
!cof-rune-energie [arg1] [arg2] [sélection Roll20]
```

Arguments positionnels lus : arg1 (event_id), arg2.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Impossible de relancer l / Pas de token sélectionné pour !cof-rune-energie.

**Moteur :** `runeEnergie` (ligne 29279).

### `!cof-bouton-rune-energie`

```text
!cof-bouton-rune-energie [arg1] [arg2] [sélection Roll20]
```

Arguments positionnels lus : arg1 (event_id), arg2.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Impossible de relancer l / Pas de token sélectionné pour !cof-rune-energie.

**Moteur :** `runeEnergie` (ligne 29279).

### `!cof-sentir-la-corruption`

```text
!cof-sentir-la-corruption token_id token_id
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage).

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Le premier argument de !cof-sentir-la-corruption n / Le deuxième argument de !cof-sentir-la-corruption n.

**Moteur :** `parseSentirLaCorruption` (ligne 48138).

### `!cof-set-state`

```text
!cof-set-state <arg1> <arg2> <arg3> [sélection Roll20]
```

Arguments positionnels lus : arg1 (etat), arg2 (valeur), arg3 (entier, token/personnage).

Valeurs littérales acceptées dans le handler : `apeure`, `effraye`, `endormi`, `sommeil`, `paralyse`, `immobilise`, `entrave`, `agrippe`, `ralenti`.

Le code exige au minimum 3 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Le premier argument de !cof-set-state n / Il manque la difficulté du jet de sauvegarde..

**Moteur :** `parseSetState` (ligne 32524).

### `!cof-jet-confusion`

```text
!cof-jet-confusion [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

**Moteur :** `parseJetConfusion` (ligne 32504).

### `!cof-skip-attack`

```text
!cof-skip-attack <arg1>
```

Arguments positionnels lus : arg1.

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il manque l.

**Moteur :** `skipAttack` (ligne 48611).

### `!cof-soigner-affaiblissement`

```text
!cof-soigner-affaiblissement carac valeur
```

Arguments positionnels lus : arg1, arg2 (entier, valeur).

Valeurs littérales acceptées dans le handler : `FOR`, `force`, `DEX`, `dexterite`, `dexterité`, `dextérité`, `dextérite`, `CON`, `constution`, `INT`, `intelligence`, `SAG`, `sagesse`, `CHA`, `charisme`.

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Pas de cible sélectionée pour le soin d / Impossible de savoir l.

**Moteur :** `soignerAffaiblissement` (ligne 47405).

### `!cof-sphere-de-feu`

```text
!cof-sphere-de-feu [--saveDM] [sélection Roll20]
```

Flags/options observés : `--saveDM`.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Pas de commande / Impossible de trouver le personnage de / Impossible de créer le token de la sphère de feu.

**Moteur :** `sphereDeFeu` (ligne 42223).

### `!cof-save-effet`

```text
!cof-save-effet <arg1> <arg2>
```

Arguments positionnels lus : arg1 (token/personnage), arg2.

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Impossible de trouver le personnage ou l / Impossible de trouver l.

**Moteur :** `parseSaveEffet` (ligne 32841).

### `!cof-save-state`

```text
!cof-save-state <arg1> <arg2> <arg3> [arg4] [sélection Roll20]
```

Arguments positionnels lus : arg1 (etat), arg2 (carac), arg3 (entier, seuil, token/personnage), arg4.

Le code exige au minimum 3 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Pas de token sélectionné.

**Moteur :** `parseSaveState` (ligne 32716).

### `!cof-mission-config`

```text
!cof-mission-config
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofMissionConfig` (ligne 50431).

### `!cof-mission-show`

```text
!cof-mission-show
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofMissionShow` (ligne 50445).

### `!cof-mission-participants`

```text
!cof-mission-participants
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofMissionParticipantsUI` (ligne 50450).

### `!cof-mission-participant-toggle`

```text
!cof-mission-participant-toggle
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofMissionParticipantToggle` (ligne 50456).

### `!cof-mission-tests`

```text
!cof-mission-tests
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofMissionTestsUI` (ligne 50463).

### `!cof-mission-test-toggle`

```text
!cof-mission-test-toggle
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofMissionTestToggle` (ligne 50469).

### `!cof-mission-tests-all`

```text
!cof-mission-tests-all
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofMissionTestsAll` (ligne 50476).

### `!cof-mission-launch`

```text
!cof-mission-launch
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofMissionDraftLaunch` (ligne 50485).

### `!cof-mission-cancel`

```text
!cof-mission-cancel
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofMissionDraftCancel` (ligne 50507).

### `!cof-test-collectif`

```text
!cof-test-collectif
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofTestCollectif` (ligne 50568).

### `!cof-test-collectif-roll`

```text
!cof-test-collectif-roll
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `cofTestCollectifRoll` (ligne 50602).

### `!cof-test-collectif-afficher`

```text
!cof-test-collectif-afficher
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofTestCollectifAfficher` (ligne 50595).

### `!cof-defi`

```text
!cof-defi
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofDefi` (ligne 50688).

### `!cof-defi-test`

```text
!cof-defi-test
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `cofDefiTest` (ligne 50734).

### `!cof-defi-afficher`

```text
!cof-defi-afficher
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofDefiAfficher` (ligne 50727).

### `!cof-defi-supprimer`

```text
!cof-defi-supprimer
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofDefiSupprimer` (ligne 50775).

### `!cof-zone`

```text
!cof-zone
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofZone` (ligne 51194).

### `!cof-zone-config`

```text
!cof-zone-config
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofZoneConfig` (ligne 51094).

### `!cof-zone-wizard`

```text
!cof-zone-wizard
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofZoneWizardShow` (ligne 51135).

### `!cof-zone-effets`

```text
!cof-zone-effets
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofZoneEffetsUI` (ligne 51134).

### `!cof-zone-effet-add`

```text
!cof-zone-effet-add
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofZoneEffetAdd` (ligne 51136).

### `!cof-zone-effet-del`

```text
!cof-zone-effet-del
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofZoneEffetDel` (ligne 51142).

### `!cof-zone-activer`

```text
!cof-zone-activer
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofZoneActiver` (ligne 51143).

### `!cof-zone-annuler`

```text
!cof-zone-annuler
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofZoneAnnuler` (ligne 51147).

### `!cof-zones`

```text
!cof-zones
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofZones` (ligne 51240).

### `!cof-zone-test`

```text
!cof-zone-test
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofZoneTest` (ligne 51313).

### `!cof-zone-info`

```text
!cof-zone-info
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofZoneInfo` (ligne 51256).

### `!cof-zone-modifier`

```text
!cof-zone-modifier
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofZoneModifier` (ligne 51264).

### `!cof-zone-commande`

```text
!cof-zone-commande
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofZoneCommande` (ligne 51272).

### `!cof-zone-reset`

```text
!cof-zone-reset
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofZoneReset` (ligne 51298).

### `!cof-zone-supprimer`

```text
!cof-zone-supprimer
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofZoneSupprimer` (ligne 51306).

### `!cof-teleportation`

```text
!cof-teleportation
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `cofTeleportation` (ligne 51452).

### `!cof-teleportation-annuler`

```text
!cof-teleportation-annuler
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `cofTeleportationAnnuler` (ligne 51483).

### `!cof-invoquer`

```text
<b>!cof-invoquer TOKEN_ID Nom du modèle</b><br>
```

Flags/options observés : `--placement`.

**Moteur :** `cofInvoquer` (ligne 51779).

### `!cof-invocations`

```text
!cof-invocations
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `cofInvocations` (ligne 51761).

### `!cof-renvoyer-invocation`

```text
!cof-renvoyer-invocation
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofRenvoyerInvocation` (ligne 51860).

### `!cof-statut`

```text
!cof-statut [sélection Roll20]
```

Valeurs littérales acceptées dans le handler : `DEF`, `ATT`, `_DM`, `DM_`.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Dans !cof-statut : rien à faire, pas de token selectionné.

**Moteur :** `statut` (ligne 31754).

### `!cof-statut-ressources`

```text
!cof-statut-ressources [arg1]
```

Arguments positionnels lus : arg1 (token/personnage).

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `statutRessources` (ligne 31737).

### `!cof-surprise`

```text
!cof-surprise [arg1] [sélection Roll20]
```

Arguments positionnels lus : arg1 (entier).

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : !cof-surprise sans sélection de token / Pas de cible valable sélectionnée pour la surprise.

**Moteur :** `parseSurprise` (ligne 29928).

### `!cof-tenebres-magiques`

```text
!cof-tenebres-magiques [arg1]
```

Arguments positionnels lus : arg1.

Valeurs littérales acceptées dans le handler : `true`, `oui`, `noir`, `non`, `sortir`, `false`, `fin`.

**Moteur :** `tenebresMagiques` (ligne 45653).

### `!cof-tp-auto`

```text
!cof-tp-auto [arg1] [sélection Roll20]
```

Arguments positionnels lus : arg1 (nombre).

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Argument de !cof-tp-auto invalide ( / Aucun token sélectionné pour !cof-tp-auto.

**Moteur :** `setTPAuto` (ligne 37384).

### `!cof-undo`

```text
!cof-undo
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `undoEvent` (ligne 5791).

### `!cof-vision-nocturne`

```text
!cof-vision-nocturne <arg1> [sélection Roll20]
```

Arguments positionnels lus : arg1 (distance, entier).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Il manque un argument à !cof-vision-nocturne / Utilisation de !cof-vision-nocturne sans sélection de token.

**Moteur :** `ajouterVisionNocturne` (ligne 48627).

### `!cof-zone-de-vie`

```text
!cof-zone-de-vie <arg1> [sélection Roll20]
```

Arguments positionnels lus : arg1 (duree, entier).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Il manque un argument à !cof-zone-de-vie / Utilisation de !cof-zone-de-vie sans sélection de token / Impossible de créer l.

**Moteur :** `lancerZoneDeVie` (ligne 48994).

### `!cof-effet`

```text
!cof-effet <arg1> [sélection Roll20]
```

Arguments positionnels lus : arg1 (effet).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Pas de cible sélectionée pour l / Impossible de savoir l / On ne peut sélectionner qu.

**Moteur :** `parseEffetIndetermine` (ligne 34014).

### `!cof-fin-classe-effet`

```text
!cof-fin-classe-effet <arg1> [sélection Roll20]
```

Arguments positionnels lus : arg1 (classeEffet).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Il manque l / Pas de cible sélectionnée pour la fin d.

**Moteur :** `finClasseDEffet` (ligne 34379).

### `!cof-attaque-magique`

```text
!cof-attaque-magique <arg1> <arg2>
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage).

Valeurs littérales acceptées dans le handler : `tueurFantasmagorique`, `enkystementLointain`, `injonction`.

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il faut au moins 2 arguments à !cof-attaque-magique / Arguments de !cof-attaque-magique.

**Moteur :** `parseAttaqueMagique` (ligne 34662).

### `!cof-injonction`

```text
!cof-injonction <arg1> <arg2>
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage).

Valeurs littérales acceptées dans le handler : `tueurFantasmagorique`, `enkystementLointain`, `injonction`.

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il faut au moins 2 arguments à !cof-attaque-magique / Arguments de !cof-attaque-magique.

**Moteur :** `parseAttaqueMagique` (ligne 34662).

### `!cof-sommeil`

```text
!cof-sommeil <arg1> [sélection Roll20]
```

Arguments positionnels lus : arg1 (token/personnage).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Pas de cible sélectionnée pour le sort de sommeil.

**Moteur :** `parseSommeil` (ligne 35104).

### `!cof-attaque-magique-contre-pv`

```text
!cof-attaque-magique-contre-pv <arg1> <arg2>
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage).

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il faut au moins 2 arguments à !cof-attaque-magique-contre-pv / Arguments de !cof-attaque-magique-contre-pv incorrects.

**Moteur :** `attaqueMagiqueContrePV` (ligne 35267).

### `!cof-transe-guerison`

```text
!cof-transe-guerison [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Pas de cible sélectionnée pour la transe de guérison.

**Moteur :** `transeGuerison` (ligne 35347).

### `!cof-soin`

```text
!cof-soin <arg1> [arg2] [arg3] [--plusSoinSiPredicat] [sélection Roll20]
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage), arg3.

Flags/options observés : `--plusSoinSiPredicat`.

Valeurs littérales acceptées dans le handler : `leger`, `modere`, `souffleDeVie`, `premiersSoins`, `groupe`, `secondSouffle`.

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Il faut au moins un argument à !cof-soin / arguments à !cof-soin / Le premier argument n.

**Moteur :** `soigner` (ligne 35423).

### `!cof-soins`

```text
!cof-soins <arg1> [arg2] [arg3] [--plusSoinSiPredicat] [sélection Roll20]
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage), arg3.

Flags/options observés : `--plusSoinSiPredicat`.

Valeurs littérales acceptées dans le handler : `leger`, `modere`, `souffleDeVie`, `premiersSoins`, `groupe`, `secondSouffle`.

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Il faut au moins un argument à !cof-soin / arguments à !cof-soin / Le premier argument n.

**Moteur :** `soigner` (ligne 35423).

### `!cof-nature-nourriciere`

```text
!cof-nature-nourriciere [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

**Moteur :** `parseNatureNourriciere` (ligne 36101).

### `!cof-ignorer-la-douleur`

```text
!cof-ignorer-la-douleur [arg1] [sélection Roll20]
```

Arguments positionnels lus : arg1 (event_id).

Travaille avec la sélection Roll20 dans au moins un chemin.

**Moteur :** `ignorerLaDouleur` (ligne 36164).

### `!cof-fortifiant`

```text
!cof-fortifiant <arg1> [sélection Roll20]
```

Arguments positionnels lus : arg1 (entier, rang).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : La fonction !cof-fortifiant attend en argument le rang dans la Voie des élixirs du créateur.

**Moteur :** `fortifiant` (ligne 36258).

### `!cof-intercepter`

```text
!cof-intercepter <arg1> <arg2> [sélection Roll20]
```

Arguments positionnels lus : arg1, arg2.

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : argument de !cof-intercepter n / Impossible de retrouver la cible de l.

**Moteur :** `intercepter` (ligne 29575).

### `!cof-interposer`

```text
!cof-interposer [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : argument de !cof-interposer n.

**Moteur :** `interposer` (ligne 29675).

### `!cof-esquive-fatale`

```text
!cof-esquive-fatale <arg1> <arg2>
```

Arguments positionnels lus : arg1 (event_id), arg2 (token/personnage).

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il manque des arguments à !cof-esquive-fatale / Impossible d / Il faut cibler un token valide.

**Moteur :** `doEsquiveFatale` (ligne 29504).

### `!cof-exemplaire`

```text
!cof-exemplaire [arg1] [sélection Roll20]
```

Arguments positionnels lus : arg1.

Travaille avec la sélection Roll20 dans au moins un chemin.

**Moteur :** `exemplaire` (ligne 29739).

### `!cof-intervention-divine`

```text
!cof-intervention-divine <arg1> [sélection Roll20]
```

Arguments positionnels lus : arg1.

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Il manque l / Impossible de relancer l.

**Moteur :** `interventionDivine` (ligne 29787).

### `!cof-lancer-sort`

```text
!cof-lancer-sort [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Pas de token sélectionée pour !cof-lancer-sort.

**Moteur :** `lancerSort` (ligne 36324).

### `!cof-as`

```text
!cof-as <arg1>
```

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il manque le nom du personnage pour !cof-as.

**Moteur :** `emulerAs` (ligne 36414).

### `!cof-peur`

```text
!cof-peur <arg1> <arg2> [sélection Roll20]
```

Arguments positionnels lus : arg1 (difficulte, entier), arg2.

Valeurs littérales acceptées dans le handler : `resisteAvecForce`, `etourdi`, `ralenti`, `effroi`, `secoue`, `paralyse`, `portee`, `lanceur`, `titre`, `immuniseSiResiste`.

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Le premier argument de !cof-peur, la difficulté du test de résistance, n / Le second argument de !cof-peur, la durée, n / Il manque l.

**Moteur :** `parsePeur` (ligne 34521).

### `!cof-distribuer-baies`

```text
!cof-distribuer-baies [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Pour utiliser !cof-distribuer-baies, il faut sélectionner un token / Erreur de sélection dans !cof-distribuer-baies.

**Moteur :** `distribuerBaies` (ligne 36648).

### `!cof-consommer-baie`

```text
!cof-consommer-baie <arg1> [sélection Roll20]
```

Arguments positionnels lus : arg1 (baie, entier).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Il faut un argument à !cof-consommer-baie / argument de !cof-consommer-baie doit être un nombre positif / Pas de token sélectionné pour !cof-consommer-baie.

**Moteur :** `consommerBaie` (ligne 36681).

### `!cof-proteger-un-allie`

```text
!cof-proteger-un-allie <arg1> <arg2>
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage).

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Le premier argument n / Le deuxième argument n.

**Moteur :** `protegerUnAllie` (ligne 36738).

### `!cof-corde-jumelle`

```text
!cof-corde-jumelle <arg1>
```

Arguments positionnels lus : arg1 (event_id).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Impossible de relancer l.

**Moteur :** `cordeJumelle` (ligne 36823).

### `!cof-action-defensive`

```text
!cof-action-defensive [arg1] [sélection Roll20]
```

Arguments positionnels lus : arg1.

Valeurs littérales acceptées dans le handler : `totale`, `simple`.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Il faut entrer en combat pour se défendre / Argument de !cof-action-defensive non reconnu.

**Moteur :** `actionDefensive` (ligne 36858).

### `!cof-strangulation`

```text
!cof-strangulation <arg1> <arg2>
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage).

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Le premier argument n / Le deuxième argument n.

**Moteur :** `strangulation` (ligne 36909).

### `!cof-ombre-mortelle`

```text
!cof-ombre-mortelle <arg1> <arg2> <arg3>
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage), arg3 (duree, entier).

Le code exige au minimum 3 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Le premier argument n / La durée doit être un nombre positif.

**Moteur :** `ombreMortelle` (ligne 36970).

### `!cof-escalier`

```text
!cof-escalier [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Pas de sélection de token pour !cof-escalier.

**Moteur :** `escalier` (ligne 37291).

### `!cof-defaut-dans-la-cuirasse`

```text
!cof-defaut-dans-la-cuirasse <arg1> <arg2>
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage).

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Le premier argument n.

**Moteur :** `defautDansLaCuirasse` (ligne 37445).

### `!cof-posture-de-combat`

```text
!cof-posture-de-combat <arg1> <arg2> <arg3> [sélection Roll20]
```

Arguments positionnels lus : arg1 (bonus, entier), arg2 (attrDebuf), arg3 (attrBuf).

Valeurs littérales acceptées dans le handler : `DEF`, `ATT`, `DM`.

Le code exige au minimum 3 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Impossible de trouve la commande !.

**Moteur :** `postureDeCombat` (ligne 37470).

### `!cof-attaque-a-outrance`

```text
!cof-attaque-a-outrance <arg1> [sélection Roll20]
```

Arguments positionnels lus : arg1 (bonus, entier).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

**Moteur :** `attaqueAOutrance` (ligne 37549).

### `!cof-mur-de-force`

```text
!cof-mur-de-force [arg1] [arg2] [sélection Roll20]
```

Arguments positionnels lus : arg1, arg2 (entier).

Valeurs littérales acceptées dans le handler : `mur`, `noImage`, `vent`.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Le deuxième argument de !cof-mur-de-force doit être une durée / Aucun personnage sélectionné pour lancer le mur de / Impossible de créer l.

**Moteur :** `murDeForce` (ligne 36475).

### `!cof-capitaine`

```text
!cof-capitaine <arg1> [arg2] [--aucun] [sélection Roll20]
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (entier).

Flags/options observés : `--aucun`.

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : La fonction !cof-capitaine attend en argument l / Le premier argument de !cof-capitaine doit être un token / Le bonus de capitaine (second argument) doit être un nombre positif.

**Moteur :** `devientCapitaine` (ligne 36587).

### `!cof-tueur-fantasmagorique`

```text
!cof-tueur-fantasmagorique <arg1> <arg2>
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage).

Valeurs littérales acceptées dans le handler : `tueurFantasmagorique`, `enkystementLointain`, `injonction`.

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il faut au moins 2 arguments à !cof-attaque-magique / Arguments de !cof-attaque-magique.

**Moteur :** `parseAttaqueMagique` (ligne 34662).

### `!cof-enkystement-lointain`

```text
!cof-enkystement-lointain <arg1> <arg2>
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage).

Valeurs littérales acceptées dans le handler : `tueurFantasmagorique`, `enkystementLointain`, `injonction`.

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il faut au moins 2 arguments à !cof-attaque-magique / Arguments de !cof-attaque-magique.

**Moteur :** `parseAttaqueMagique` (ligne 34662).

### `!cof-injonction-mortelle`

```text
!cof-injonction-mortelle <arg1> <arg2>
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage).

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il faut au moins 2 arguments à !cof-injonction-mortelle / Arguments de !cof-injonction-mortelle.

**Moteur :** `parseInjonctionMortelle` (ligne 35001).

### `!cof-tour-de-force`

```text
!cof-tour-de-force [arg1] [sélection Roll20]
```

Arguments positionnels lus : arg1 (entier, seuil).

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Il manque un argument à !cof-tour-de-force / le seuil de difficulté du tour de force doit être un nombre.

**Moteur :** `parseTourDeForce` (ligne 37589).

### `!cof-prouesse`

```text
!cof-prouesse <arg1> [arg2]
```

Arguments positionnels lus : arg1 (event_id), arg2.

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

**Moteur :** `boutonProuesse` (ligne 28777).

### `!cof-tour-force`

```text
!cof-tour-force <arg1> [arg2]
```

Arguments positionnels lus : arg1 (event_id), arg2.

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

**Moteur :** `boutonTourDeForce` (ligne 29022).

### `!cof-pacte-sanglant`

```text
!cof-pacte-sanglant <arg1> <arg2> [arg3]
```

Arguments positionnels lus : arg1 (event_id), arg2 (bonus, entier), arg3.

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il manque un choix de bonus au Pacte sanglant.

**Moteur :** `boutonPacteSanglant` (ligne 28861).

### `!cof-pacte-sanglant-def`

```text
!cof-pacte-sanglant-def <arg1> <arg2> <arg3>
```

Arguments positionnels lus : arg1 (event_id), arg2 (bonus, entier), arg3 (token/personnage).

Le code exige au minimum 3 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il manque un choix de bonus au Pacte sanglant.

**Moteur :** `boutonPacteSanglantDef` (ligne 28951).

### `!cof-encaisser-un-coup`

```text
!cof-encaisser-un-coup [arg1] [sélection Roll20]
```

Arguments positionnels lus : arg1 (event_id).

Travaille avec la sélection Roll20 dans au moins un chemin.

**Moteur :** `doEncaisserUnCoup` (ligne 37667).

### `!cof-devier-les-coups`

```text
!cof-devier-les-coups [arg1] [sélection Roll20]
```

Arguments positionnels lus : arg1 (event_id).

Travaille avec la sélection Roll20 dans au moins un chemin.

**Moteur :** `doDevierLesCoups` (ligne 37734).

### `!cof-parade-projectiles`

```text
!cof-parade-projectiles [arg1] [sélection Roll20]
```

Arguments positionnels lus : arg1 (event_id).

Travaille avec la sélection Roll20 dans au moins un chemin.

**Moteur :** `doParadeProjectiles` (ligne 37799).

### `!cof-parade-au-bouclier`

```text
!cof-parade-au-bouclier
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `doParadeAuBouclier` (ligne 38253).

### `!cof-esquive-acrobatique`

```text
!cof-esquive-acrobatique
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `doEsquiveAcrobatique` (ligne 38222).

### `!cof-esquive-de-la-magie`

```text
!cof-esquive-de-la-magie
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `doEsquiveDeLaMagie` (ligne 38230).

### `!cof-resister-a-la-magie`

```text
!cof-resister-a-la-magie
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `resisterALaMagie` (ligne 38203).

### `!cof-cercle-protection`

```text
!cof-cercle-protection
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `cercleDeProtection` (ligne 38212).

### `!cof-parade-magistrale`

```text
!cof-parade-magistrale
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `doParadeMagistrale` (ligne 38244).

### `!cof-esquive-magistrale`

```text
!cof-esquive-magistrale
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `doEsquiveMagistrale` (ligne 38235).

### `!cof-absorber-au-bouclier`

```text
!cof-absorber-au-bouclier
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `absorberCoupAuBouclier` (ligne 38169).

### `!cof-absorber-coup-au-bouclier`

```text
!cof-absorber-coup-au-bouclier
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `absorberCoupAuBouclier` (ligne 38169).

### `!cof-absorber-sort-au-bouclier`

```text
!cof-absorber-sort-au-bouclier
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `absorberSortAuBouclier` (ligne 38186).

### `!cof-chair-a-canon`

```text
!cof-chair-a-canon <arg1> <arg2> [arg3]
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage), arg3 (event_id).

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Le premier argument de !cof-chair-a-canon n / Le second argument de !cof-chair-a-canon n / Impossible de trouver.

**Moteur :** `doChairACanon` (ligne 38262).

### `!cof-demarrer-statistiques`

```text
!cof-demarrer-statistiques
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `displayStatistics` (ligne 38438).

### `!cof-arreter-statistiques`

```text
!cof-arreter-statistiques
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `displayStatistics` (ligne 38438).

### `!cof-pause-statistiques`

```text
!cof-pause-statistiques
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `displayStatistics` (ligne 38438).

### `!cof-statistiques`

```text
!cof-statistiques
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `displayStatistics` (ligne 38438).

### `!cof-doctor`

```text
!cof-doctor
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cofDoctor` (ligne 49999).

### `!cof-destruction-des-morts-vivants`

```text
!cof-destruction-des-morts-vivants <arg1> [sélection Roll20]
```

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Il faut au moins un argument à !cof-destruction-des-morts-vivants / Il faut sélectionner le lanceur de la destruction des morts-vivants / Ne sélectionner qu.

**Moteur :** `parseDestructionDesMortsVivants` (ligne 38483).

### `!cof-enduire-poison`

```text
!cof-enduire-poison L type force save
```

Arguments positionnels lus : arg1 (entier, label), arg2 (typePoison), arg3 (forcePoison), arg4 (entier, savePoison).

Valeurs littérales acceptées dans le handler : `rapide`, `affaiblissant`, `paralysant`, `rapideAffaiblissant`, `testINT`.

Le code exige au minimum 4 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Le dernier argument non optionnel doit être la difficulté du test de CON / Il faut un argument à --testINT / Argument de --testINT invalide.

**Moteur :** `parseEnduireDePoison` (ligne 38683).

### `!cof-consommables`

```text
!cof-consommables [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

**Moteur :** `listeConsommables` (ligne 39043).

### `!cof-utilise-consommable`

```text
!cof-utilise-consommable <arg1> <arg2>
```

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Impossible de trouver le nom du consommable.

**Moteur :** `utiliseConsommable` (ligne 39151).

### `!cof-echange-consommable`

```text
!cof-echange-consommable <arg1> <arg2> <arg3>
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage), arg3.

Le code exige au minimum 3 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Impossible de trouver le nom ou l.

**Moteur :** `echangeConsommable` (ligne 39231).

### `!cof-provocation`

```text
!cof-provocation <arg1> <arg2> [arg3]
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage), arg3.

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : La commande !cof-provocation requiert 2 arguments / Le premier argument de !cof-provocation n / Le deuxième argument de !cof-provocation n.

**Moteur :** `parseProvocation` (ligne 39417).

### `!cof-en-selle`

```text
!cof-en-selle <arg1> <arg2>
```

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il faut 2 arguments pour !cof-en-selle / Premier argument de !cof-en-selle incorrect.

**Moteur :** `enSelle` (ligne 39555).

### `!cof-creer-elixir`

```text
!cof-creer-elixir <arg1> <arg2> [--feu]
```

Arguments positionnels lus : arg1 (token/personnage), arg2.

Flags/options observés : `--feu`.

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Impossible de savoir qui crée l.

**Moteur :** `creerElixir` (ligne 39654).

### `!cof-elixirs`

```text
!cof-elixirs [--feu] [sélection Roll20]
```

Flags/options observés : `--feu`.

Travaille avec la sélection Roll20 dans au moins un chemin.

**Moteur :** `gestionElixir` (ligne 39788).

### `!cof-runes`

```text
!cof-runes [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Impossible de trouver le joueur.

**Moteur :** `gestionRunes` (ligne 40061).

### `!cof-creer-rune`

```text
!cof-creer-rune <arg1> <arg2> <arg3> <arg4>
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage), arg3, arg4 (entier).

Le code exige au minimum 4 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Impossible de savoir qui crée la rune / Impossible de savoir à qui octroyer la rune.

**Moteur :** `creerRune` (ligne 40092).

### `!cof-rage-du-berserk`

```text
!cof-rage-du-berserk [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Pas de token sélectionné pour la rage.

**Moteur :** `parseRageDuBerserk` (ligne 40308).

### `!cof-arme-secrete`

```text
!cof-arme-secrete <arg1> <arg2>
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage).

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il faut deux arguments à !cof-arme-secrete.

**Moteur :** `parseArmeSecrete` (ligne 40376).

### `!cof-animer-arbre`

```text
!cof-animer-arbre <arg1> <arg2> [arg3]
```

Arguments positionnels lus : arg1 (token/personnage), arg2, arg3 (cmd3, entier).

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : cof-animer-arbre attend 2 arguments / Le premier argument de !cof-animer-arbre n / Le deuxième argument de !cof-animer-arbre n.

**Moteur :** `animerUnArbre` (ligne 40637).

### `!cof-delivrance`

```text
!cof-delivrance <arg1> [arg2] [sélection Roll20]
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : cof-delivrance attend un argument / Le premier argument de !cof-delivrance n / Le deuxième argument de !cof-delivrance n.

**Moteur :** `delivrance` (ligne 40801).

### `!cof-guerir`

```text
!cof-guerir <arg1> [arg2] [sélection Roll20]
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : cof-delivrance attend un argument / Le premier argument de !cof-delivrance n / Le deuxième argument de !cof-delivrance n.

**Moteur :** `delivrance` (ligne 40801).

### `!cof-guerison`

```text
!cof-guerison <arg1> <arg2> [sélection Roll20]
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage).

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : cof-guerison attend le lanceur en argument / Le premier argument de !cof-guerison n / cof-guerison attend le lanceur et la cible en argument.

**Moteur :** `guerison` (ligne 40997).

### `!cof-test-attaque-opposee`

```text
!cof-test-attaque-opposee <arg1> <arg2> [arg3]
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage), arg3.

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il faut 2 personnages pour un test d / Le premier argument de !cof-test-attaque-opposee doit être un token valide / Le deuxième argument de !cof-test-attaque-opposee doit être un token valide.

**Moteur :** `testAttaqueOpposee` (ligne 41226).

### `!cof-etat-oppose`

```text
!cof-etat-oppose <arg1> <arg2> <arg3> <arg4> <arg5>
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage), arg3 (etat), arg4, arg5.

Le code exige au minimum 5 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : !cof-etat-oppose : attaquant ou cible invalide / !cof-etat-oppose : caractéristique invalide.

**Moteur :** `cofEtatOppose` (ligne 41488).

### `!cof-manoeuvre`

```text
!cof-manoeuvre <arg1> <arg2> <arg3>
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage), arg3.

Le code exige au minimum 3 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : cof-manoeuvre attend 3 arguments / Le premier argument de !cof-manoeuvre n / Le deuxième argument de !cof-manoeuvre n.

**Moteur :** `manoeuvreRisquee` (ligne 41529).

### `!cof-appliquer-manoeuvre`

```text
!cof-appliquer-manoeuvre <arg1> <arg2> <arg3> <arg4>
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage), arg3, arg4.

Le code exige au minimum 4 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : cof-appliquer-manoeuvre attend 4 arguments / Le premier argument de !cof-appliquer-manoeuvre n / Le deuxième argument de !cof-appliquer-manoeuvre n.

**Moteur :** `appliquerManoeuvre` (ligne 41453).

### `!cof-desarmer`

```text
!cof-desarmer <arg1> <arg2> [arg3]
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage), arg3.

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il manque des arguments à !cof-desarmer / Le premier argument de !cof-desarmer n / Le deuxième argument de !cof-desarmer n.

**Moteur :** `desarmer` (ligne 41264).

### `!cof-tempete-de-mana`

```text
!cof-tempete-de-mana <arg1> <arg2> [--tempeteDeMana]
```

Arguments positionnels lus : arg1 (entier, it, opt), arg2 (token/personnage).

Flags/options observés : `--tempeteDeMana`.

Valeurs littérales acceptées dans le handler : `duree`, `portee`, `rapide`, `-duree`, `-portee`, `-rapide`, `-altruiste`, `altruiste`.

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il manque l / Argument de !cof-tempete-de-mana inconnu.

**Moteur :** `optionsDeTempeteDeMana` (ligne 9443).

### `!cof-test-mort`

```text
!cof-test-mort [arg1]
```

Arguments positionnels lus : arg1.

**Moteur :** `blessurePJTestMort` (ligne 25046).

### `!cof-blessure-recap`

```text
!cof-blessure-recap [arg1]
```

Arguments positionnels lus : arg1 (token/personnage).

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `blessurePJRecapCommande` (ligne 25116).

### `!cof-blessure-reset`

```text
!cof-blessure-reset [arg1]
```

Arguments positionnels lus : arg1 (token/personnage).

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Sélectionnez au moins un PJ ou utilisez --target @{target|token_id}..

**Moteur :** `blessurePJResetCommande` (ligne 24836).

### `!cof-blessure-markers`

```text
!cof-blessure-markers
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `blessurePJMarkersDiagnostic` (ligne 24824).

### `!cof-stabiliser-blessure`

```text
!cof-stabiliser-blessure [arg1]
```

Arguments positionnels lus : arg1.

**Moteur :** `blessurePJStabiliser` (ligne 25016).

### `!cof-tour-suivant`

```text
!cof-tour-suivant
```

Contrôles utiles : Impossible de trouver le personnage actif / Tour invalide.

**Moteur :** `tourSuivant` (ligne 55887).

### `!cof-multi-command`

```text
!cof-multi-command
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `multiCommand` (ligne 41703).

### `!cof-conjuration-de-predateur`

```text
!cof-conjuration-de-predateur [arg1] [--si] [sélection Roll20]
```

Arguments positionnels lus : arg1 (entier).

Flags/options observés : `--si`.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Pas de commande / Il faut un nombre comme premier argument de !cof-conjuration-de-predateur.

**Moteur :** `conjurationPredateur` (ligne 42079).

### `!cof-conjuration-armee`

```text
!cof-conjuration-armee [arg1] [--allonge] [sélection Roll20]
```

Arguments positionnels lus : arg1.

Flags/options observés : `--allonge`.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Il faut sélectionner le lanceur de la conjuration d.

**Moteur :** `conjurationArmee` (ligne 42317).

### `!cof-set-macros`

```text
!cof-set-macros [--force]
```

Flags/options observés : `--force`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `setGameMacros` (ligne 43002).

### `!cof-lumiere`

```text
!cof-lumiere <arg1> <arg2> [arg3] [arg4]
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (entier, radius), arg3 (entier), arg4.

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il faut au moins 2 arguments à !cof-lumiere / le premier argument de !cof-lumière doit être un token / La distance de vue de la lumière doit être positive.

**Moteur :** `ajouteLumiere` (ligne 43035).

### `!cof-eteindre-lumiere`

```text
!cof-eteindre-lumiere [arg1] [sélection Roll20]
```

Arguments positionnels lus : arg1.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Pas de cible sélectionnée pour !cof-eteindre-lumiere.

**Moteur :** `eteindreLumieres` (ligne 43140).

### `!cof-torche`

```text
!cof-torche <arg1> [arg2]
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (entier).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il faut préciser le token en argument de !cof-torche / Token invalide / Le deuxième argument de !cof-torche doit être un nombre strictement positif.

**Moteur :** `switchTorche` (ligne 43233).

### `!cof-defi-duelliste`

```text
!cof-defi-duelliste
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `lancerDefiDuelliste` (ligne 43529).

### `!cof-defi-samourai`

```text
!cof-defi-samourai
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `lancerDefiSamourai` (ligne 43524).

### `!cof-enveloppement`

```text
!cof-enveloppement <arg1> <arg2> <arg3> <arg4> <arg5>
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage), arg3 (difficulte, entier), arg4, arg5.

Valeurs littérales acceptées dans le handler : `label`, `ability`, `etreinte`.

Le code exige au minimum 5 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il manque des arguments à !cof-enveloppement / Impossible de déterminer les dégâts quand enveloppé.

**Moteur :** `parseEnveloppement` (ligne 43534).

### `!cof-echapper-enveloppement`

```text
!cof-echapper-enveloppement [arg1] [sélection Roll20]
```

Arguments positionnels lus : arg1.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : !cof-echapper-enveloppement sans sélection de token.

**Moteur :** `parseEchapperEnveloppement` (ligne 43651).

### `!cof-liberer-agrippe`

```text
!cof-liberer-agrippe <arg1> [arg2]
```

Arguments positionnels lus : arg1 (token/personnage), arg2.

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il faut l / Token invalide.

**Moteur :** `parseLibererAgrippe` (ligne 43760).

### `!cof-liberer-ecrase`

```text
!cof-liberer-ecrase <arg1>
```

Arguments positionnels lus : arg1 (token/personnage).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il faut l.

**Moteur :** `parseLibererEcrase` (ligne 43921).

### `!cof-animer-cadavre`

```text
!cof-animer-cadavre <arg1> <arg2>
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage).

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : cof-animer-cadavre attend 2 arguments / Le premier argument de !cof-animer-cadavre n / Le deuxième argument de !cof-animer-cadavre n.

**Moteur :** `animerCadavre` (ligne 44030).

### `!cof-vapeurs-ethyliques`

```text
!cof-vapeurs-ethyliques [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

**Moteur :** `parseVapeursEthyliques` (ligne 44107).

### `!cof-desaouler`

```text
!cof-desaouler [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Aucune sélection pour !cof-desaouler.

**Moteur :** `desaouler` (ligne 44179).

### `!cof-boire-alcool`

```text
!cof-boire-alcool [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

**Moteur :** `parseBoireAlcool` (ligne 44198).

### `!cof-jouer-son`

```text
!cof-jouer-son
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `jouerSon` (ligne 44258).

### `!cof-bouton-echec-total`

```text
!cof-bouton-echec-total <arg1>
```

Arguments positionnels lus : arg1 (event_id).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

**Moteur :** `echecTotal` (ligne 29105).

### `!cof-usure-off`

```text
!cof-usure-off
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `sendChat` (ligne None).

### `!cof-set-attribute`

```text
!cof-set-attribute <arg1> <arg2> [arg3] [sélection Roll20]
```

Arguments positionnels lus : arg1, arg2, arg3.

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : pas de token sélectionné pour !cof-set-attribute.

**Moteur :** `setAttributeInterface` (ligne 44325).

### `!cof-set-predicate`

```text
!cof-set-predicate <arg1> [arg2] [sélection Roll20]
```

Arguments positionnels lus : arg1 (predicat), arg2.

Valeurs littérales acceptées dans le handler : `true`, `vrai`, `oui`, `false`, `faux`, `non`.

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : pas de token sélectionné pour !cof-set-predicate / argument de.

**Moteur :** `setPredicateInterface` (ligne 44375).

### `!cof-options-d-attaque`

```text
!cof-options-d-attaque [arg1] [arg2] [sélection Roll20]
```

Arguments positionnels lus : arg1, arg2 (entier, nadg, naep).

Valeurs littérales acceptées dans le handler : `attaque_en_puissance_check`, `attaque_risquee_check`, `attaque_assuree_check`, `attaque_dm_temp_check`, `attaque_de_groupe`, `attaque_en_puissance`.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Argument de !cof-options-d-attaque non reconnu.

**Moteur :** `optionsDAttaque` (ligne 44490).

### `!cof-petit-veinard`

```text
!cof-petit-veinard [arg1] [arg2] [sélection Roll20]
```

Arguments positionnels lus : arg1 (event_id), arg2.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Impossible de relancer l / Pas de token sélectionné pour !cof-petit-veinard.

**Moteur :** `petitVeinard` (ligne 29843).

### `!cof-bouton-petit-veinard`

```text
!cof-bouton-petit-veinard [arg1] [arg2] [sélection Roll20]
```

Arguments positionnels lus : arg1 (event_id), arg2.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Impossible de relancer l / Pas de token sélectionné pour !cof-petit-veinard.

**Moteur :** `petitVeinard` (ligne 29843).

### `!cof-suivre`

```text
!cof-suivre <arg1> <arg2>
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage).

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Token sélectionne incorrect pour !cof-suivre.

**Moteur :** `suivre` (ligne 44737).

### `!cof-centrer-sur-token`

```text
!cof-centrer-sur-token <arg1>
```

Arguments positionnels lus : arg1 (token/personnage).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Il faut préciser un token sur lequel se centrer / Impossible de trouver le joueur qui a lancé la commande / Impossible de trouver le personnage sur lequel se centrer.

**Moteur :** `centrerSurToken` (ligne 44798).

### `!cof-bourse`

```text
!cof-bourse <arg1> <arg2> [arg3] [sélection Roll20]
```

Arguments positionnels lus : arg1, arg2 (entier), arg3.

Valeurs littérales acceptées dans le handler : `depenser`, `dépenser`, `gagner`, `fixer`.

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Il faut spécifier un montant à / Il faut préciser les unités pour !cof-bourse fixer / Pas de personnage sélectionné pour !cof-bourse.

**Moteur :** `gestionBourse` (ligne 44891).

### `!cof-mot-de-pouvoir-immobilise`

```text
!cof-mot-de-pouvoir-immobilise [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

**Moteur :** `motDePouvoirImmobilise` (ligne 45089).

### `!cof-charge-fantastique`

```text
!cof-charge-fantastique <arg1> [sélection Roll20]
```

Arguments positionnels lus : arg1 (token/personnage).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Le token sélectionné ne représente pas un personnage / pas de token sélectionné pour !cof-charge-fantastique.

**Moteur :** `chargeFantastque` (ligne 45195).

### `!cof-next-charge-fantastique`

```text
!cof-next-charge-fantastique
```

Aucun argument supplémentaire n’est lu directement par le handler ; cette commande est généralement pilotée par l’interface ou un bouton interne.

**Moteur :** `nextTurnChargeFantastique` (ligne 45133).

### `!cof-tenebres`

```text
!cof-tenebres <arg1> [arg2]
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : !cof-tenebres mal formé, il faut un token comme premier argument / Le premier argument de !cof-tenebres n / Le second argument de !cof-tenebres n.

**Moteur :** `tenebres` (ligne 42443).

### `!cof-defense-armee-des-morts`

```text
!cof-defense-armee-des-morts <arg1>
```

Arguments positionnels lus : arg1 (token/personnage).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Le token renseigné pour !cof-defense-armee-des-morts est inconnu.

**Moteur :** `defenseArmeeDesMorts` (ligne 44447).

### `!cof-invoquer-demon`

```text
!cof-invoquer-demon <arg1> [sélection Roll20]
```

Arguments positionnels lus : arg1 (token/personnage).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : !cof-invoquer-demon mal formé, il faut un token comme premier argument / Le premier argument de !cof-invoquer-demon n.

**Moteur :** `invocationDemon` (ligne 42655).

### `!cof-animer-mort`

```text
!cof-animer-mort <arg1>
```

Arguments positionnels lus : arg1 (token/personnage).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : !cof-animer-mort mal formé, il faut un token comme premier argument / Le premier argument de !cof-animer-mort n.

**Moteur :** `animerMort` (ligne 42784).

### `!cof-prescience`

```text
!cof-prescience <arg1>
```

Arguments positionnels lus : arg1 (token/personnage).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Impossible de trouver le personnage qui utilise prescience / Impossible d / Impossible de trouver le début du tour dans l.

**Moteur :** `utiliserPrescience` (ligne 45268).

### `!cof-multi-cartes`

```text
!cof-multi-cartes [arg1] [sélection Roll20]
```

Arguments positionnels lus : arg1.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Aucun token selectionné pour !cof-multi-cartes.

**Moteur :** `multiCartes` (ligne 45343).

### `!cof-ombre-mouvante`

```text
!cof-ombre-mouvante [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Pas de token sélectionné pour !cof-ombre-mouvante.

**Moteur :** `ombreMouvante` (ligne 45396).

### `!cof-reveler-nom`

```text
!cof-reveler-nom [sélection Roll20]
```

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Pas de token sélectionné pour !cof-reveler-nom / Attention, on ne peut sélectionner qu / Pas de token par défaut pour.

**Moteur :** `revelerNom` (ligne 45462).

### `!cof-fiole-de-lumiere`

```text
!cof-fiole-de-lumiere <arg1> [arg2] [arg3] [sélection Roll20]
```

Arguments positionnels lus : arg1 (distance, entier), arg3 (entier).

Le code exige au minimum 1 argument(s) après le nom de commande dans au moins un chemin.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contrôles utiles : Il faut un argument à !cof-fiole-de-lumiere / Aucun personnage sélectionné / La distance de vue de la lumière assombrie doit être un nombre.

**Moteur :** `fioleDeLumiere` (ligne 45740).

### `!cof-agripper-de-demon`

```text
!cof-agripper-de-demon <arg1> <arg2> [arg3]
```

Arguments positionnels lus : arg1 (token/personnage), arg2 (token/personnage), arg3.

Le code exige au minimum 2 argument(s) après le nom de commande dans au moins un chemin.

Contrôles utiles : Il faut spécifier un attaquant et un défenseur pour !cof-agripper-de-demon / Le premier argument de !cof-agripper-de-demon doit être un token valide / Le deuxième argument de !cof-agripper-de-demon doit être un token valide.

**Moteur :** `agripperDeDemon` (ligne 45792).
