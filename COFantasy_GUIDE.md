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

La référence complète des prédicats effectivement rencontrés dans le moteur se trouve dans **[docs/PREDICATS_REFERENCE.md](docs/PREDICATS_REFERENCE.md)**.

### Pourquoi les prédicats sont importants

Les affixes CoFItem, le Monster Creator et les capacités de classe peuvent tous produire des prédicats. Ils sont le **contrat commun** entre la donnée (« ce personnage a Allonge +1 ») et la règle (« l’AO doit avoir une zone plus grande »).

---

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

Le manuel technique détaillé reste disponible dans **[docs/MONSTER_CREATOR.md](docs/MONSTER_CREATOR.md)**.

---

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

## 18. Référence exhaustive des commandes COFantasy

| Commande | Usage |
|---|---|
| `!cof-a-couvert` | Commande spécialisée : A couvert. |
| `!cof-absorber-au-bouclier` | Commande spécialisée : Absorber au bouclier. |
| `!cof-absorber-coup-au-bouclier` | Commande spécialisée : Absorber coup au bouclier. |
| `!cof-absorber-sort-au-bouclier` | Commande spécialisée : Absorber sort au bouclier. |
| `!cof-action-defensive` | Commande spécialisée : Action defensive. |
| `!cof-affaiblir-carac` | Commande spécialisée : Affaiblir carac. |
| `!cof-agrandir-page` | Commande spécialisée : Agrandir page. |
| `!cof-agripper-de-demon` | Commande spécialisée : Agripper de demon. |
| `!cof-aile-forge-runique` | Commande spécialisée : Aile forge runique. |
| `!cof-animation-des-objets` | Commande spécialisée : Animation des objets. |
| `!cof-animer-arbre` | Commande spécialisée : Animer arbre. |
| `!cof-animer-cadavre` | Commande spécialisée : Animer cadavre. |
| `!cof-animer-mort` | Commande spécialisée : Animer mort. |
| `!cof-appliquer-manoeuvre` | Commande spécialisée : Appliquer manoeuvre. |
| `!cof-arme-secrete` | Commande spécialisée : Arme secrete. |
| `!cof-armure-magique` | Commande spécialisée : Armure magique. |
| `!cof-arreter-statistiques` | Commande spécialisée : Arreter statistiques. |
| `!cof-as` | Commande spécialisée : As. |
| `!cof-attack` | Attaque générique : fiche, attaque ad hoc, zones, sauvegardes et dégâts. |
| `!cof-attack-line` | Commande spécialisée : Attack line. |
| `!cof-attack-line-from` | Commande spécialisée : Attack line from. |
| `!cof-attaque-a-outrance` | Commande spécialisée : Attaque a outrance. |
| `!cof-attaque-magique` | Commande spécialisée : Attaque magique. |
| `!cof-attaque-magique-contre-pv` | Commande spécialisée : Attaque magique contre pv. |
| `!cof-attaque-opportunite` | Commande spécialisée : Attaque opportunite. |
| `!cof-attaque-opportunite-ignorer` | Commande spécialisée : Attaque opportunite ignorer. |
| `!cof-attendre` | Commande spécialisée : Attendre. |
| `!cof-blessure-markers` | Commande spécialisée : Blessure markers. |
| `!cof-blessure-recap` | Commande spécialisée : Blessure recap. |
| `!cof-blessure-reset` | Commande spécialisée : Blessure reset. |
| `!cof-boire-alcool` | Commande spécialisée : Boire alcool. |
| `!cof-bonus-couvert` | Commande spécialisée : Bonus couvert. |
| `!cof-bouger` | Commande spécialisée : Bouger. |
| `!cof-bourse` | Commande spécialisée : Bourse. |
| `!cof-bouton-chance` | Commande spécialisée : Bouton chance. |
| `!cof-bouton-echec-total` | Commande spécialisée : Bouton echec total. |
| `!cof-bouton-petit-veinard` | Commande spécialisée : Bouton petit veinard. |
| `!cof-bouton-pousser-kiai` | Commande spécialisée : Bouton pousser kiai. |
| `!cof-bouton-rune-energie` | Commande spécialisée : Bouton rune energie. |
| `!cof-bouton-rune-puissance` | Commande spécialisée : Bouton rune puissance. |
| `!cof-braise-solaire` | Commande spécialisée : Braise solaire. |
| `!cof-buf-def` | Commande spécialisée : Buf def. |
| `!cof-canaliser` | Commande spécialisée : Canaliser. |
| `!cof-capitaine` | Commande spécialisée : Capitaine. |
| `!cof-centrer-sur-token` | Commande spécialisée : Centrer sur token. |
| `!cof-cercle-protection` | Commande spécialisée : Cercle protection. |
| `!cof-chair-a-canon` | Commande spécialisée : Chair a canon. |
| `!cof-changer-de-forme` | Commande spécialisée : Changer de forme. |
| `!cof-charge-fantastique` | Commande spécialisée : Charge fantastique. |
| `!cof-clean-global-state` | Commande spécialisée : Clean global state. |
| `!cof-confirmer-attaque` | Commande spécialisée : Confirmer attaque. |
| `!cof-conjuration-armee` | Commande spécialisée : Conjuration armee. |
| `!cof-conjuration-de-predateur` | Commande spécialisée : Conjuration de predateur. |
| `!cof-consommables` | Commande spécialisée : Consommables. |
| `!cof-consommer-baie` | Commande spécialisée : Consommer baie. |
| `!cof-corde-jumelle` | Commande spécialisée : Corde jumelle. |
| `!cof-creer-baies` | Commande spécialisée : Creer baies. |
| `!cof-creer-elixir` | Commande spécialisée : Creer elixir. |
| `!cof-creer-rune` | Commande spécialisée : Creer rune. |
| `!cof-defaut-dans-la-cuirasse` | Commande spécialisée : Defaut dans la cuirasse. |
| `!cof-defense-armee-des-morts` | Commande spécialisée : Defense armee des morts. |
| `!cof-defi` | Assistant de défi. |
| `!cof-defi-afficher` | Commande spécialisée : Defi afficher. |
| `!cof-defi-duelliste` | Commande spécialisée : Defi duelliste. |
| `!cof-defi-samourai` | Commande spécialisée : Defi samourai. |
| `!cof-defi-supprimer` | Commande spécialisée : Defi supprimer. |
| `!cof-defi-test` | Commande spécialisée : Defi test. |
| `!cof-degainer` | Commande spécialisée : Degainer. |
| `!cof-delivrance` | Commande spécialisée : Delivrance. |
| `!cof-demarrer-statistiques` | Commande spécialisée : Demarrer statistiques. |
| `!cof-desaouler` | Commande spécialisée : Desaouler. |
| `!cof-desarmer` | Commande spécialisée : Desarmer. |
| `!cof-destruction-des-morts-vivants` | Commande spécialisée : Destruction des morts vivants. |
| `!cof-devier-les-coups` | Commande spécialisée : Devier les coups. |
| `!cof-distribuer-baies` | Commande spécialisée : Distribuer baies. |
| `!cof-division-vase` | Commande spécialisée : Division vase. |
| `!cof-dmg` | Commande spécialisée : Dmg. |
| `!cof-doctor` | Diagnostic et réparation prudente des fiches. |
| `!cof-echange-consommable` | Commande spécialisée : Echange consommable. |
| `!cof-echange-init` | Commande spécialisée : Echange init. |
| `!cof-echapper-enveloppement` | Commande spécialisée : Echapper enveloppement. |
| `!cof-effet` | Commande spécialisée : Effet. |
| `!cof-effet-chaque-d20` | Commande spécialisée : Effet chaque d20. |
| `!cof-effet-combat` | Commande spécialisée : Effet combat. |
| `!cof-effet-temp` | Commande spécialisée : Effet temp. |
| `!cof-elixirs` | Commande spécialisée : Elixirs. |
| `!cof-en-selle` | Commande spécialisée : En selle. |
| `!cof-encaisser-un-coup` | Commande spécialisée : Encaisser un coup. |
| `!cof-enduire-poison` | Commande spécialisée : Enduire poison. |
| `!cof-enkystement-lointain` | Commande spécialisée : Enkystement lointain. |
| `!cof-enveloppement` | Commande spécialisée : Enveloppement. |
| `!cof-escalier` | Commande spécialisée : Escalier. |
| `!cof-esquive-acrobatique` | Commande spécialisée : Esquive acrobatique. |
| `!cof-esquive-de-la-magie` | Commande spécialisée : Esquive de la magie. |
| `!cof-esquive-fatale` | Commande spécialisée : Esquive fatale. |
| `!cof-esquive-magistrale` | Commande spécialisée : Esquive magistrale. |
| `!cof-etat-oppose` | Commande spécialisée : Etat oppose. |
| `!cof-eteindre-lumiere` | Commande spécialisée : Eteindre lumiere. |
| `!cof-exemplaire` | Commande spécialisée : Exemplaire. |
| `!cof-expert-combat` | Commande spécialisée : Expert combat. |
| `!cof-expert-combat-bousculer` | Commande spécialisée : Expert combat bousculer. |
| `!cof-expert-combat-def` | Commande spécialisée : Expert combat def. |
| `!cof-expert-combat-dm` | Commande spécialisée : Expert combat dm. |
| `!cof-expert-combat-touche` | Commande spécialisée : Expert combat touche. |
| `!cof-explosion` | Commande spécialisée : Explosion. |
| `!cof-fin-changement-de-forme` | Commande spécialisée : Fin changement de forme. |
| `!cof-fin-classe-effet` | Commande spécialisée : Fin classe effet. |
| `!cof-fin-combat` | Commande spécialisée : Fin combat. |
| `!cof-fin-reaction-violente` | Commande spécialisée : Fin reaction violente. |
| `!cof-fiole-de-lumiere` | Commande spécialisée : Fiole de lumiere. |
| `!cof-fortifiant` | Commande spécialisée : Fortifiant. |
| `!cof-foudre-du-temps` | Commande spécialisée : Foudre du temps. |
| `!cof-gerer-runes-mortes` | Commande spécialisée : Gerer runes mortes. |
| `!cof-guerir` | Commande spécialisée : Guerir. |
| `!cof-guerison` | Commande spécialisée : Guerison. |
| `!cof-hors-combat` | Commande spécialisée : Hors combat. |
| `!cof-huile-instable` | Commande spécialisée : Huile instable. |
| `!cof-ignorer-la-douleur` | Commande spécialisée : Ignorer la douleur. |
| `!cof-immunite-guerisseur` | Commande spécialisée : Immunite guerisseur. |
| `!cof-init` | Démarre/actualise l’initiative. |
| `!cof-injonction` | Commande spécialisée : Injonction. |
| `!cof-injonction-mortelle` | Commande spécialisée : Injonction mortelle. |
| `!cof-intercepter` | Commande spécialisée : Intercepter. |
| `!cof-interposer` | Commande spécialisée : Interposer. |
| `!cof-intervention-divine` | Commande spécialisée : Intervention divine. |
| `!cof-invocations` | Commande spécialisée : Invocations. |
| `!cof-invoquer` | Commande spécialisée : Invoquer. |
| `!cof-invoquer-demon` | Commande spécialisée : Invoquer demon. |
| `!cof-jet` | Commande spécialisée : Jet. |
| `!cof-jet-confusion` | Commande spécialisée : Jet confusion. |
| `!cof-jouer-son` | Commande spécialisée : Jouer son. |
| `!cof-lancer-sort` | Commande spécialisée : Lancer sort. |
| `!cof-liberer-agrippe` | Commande spécialisée : Liberer agrippe. |
| `!cof-liberer-ecrase` | Commande spécialisée : Liberer ecrase. |
| `!cof-liste-actions` | Affiche les actions disponibles de la fiche. |
| `!cof-lumiere` | Commande spécialisée : Lumiere. |
| `!cof-manoeuvre` | Commande spécialisée : Manoeuvre. |
| `!cof-mettre-a-zero-pv` | Commande spécialisée : Mettre a zero pv. |
| `!cof-mettre-casque` | Commande spécialisée : Mettre casque. |
| `!cof-mission-cancel` | Commande spécialisée : Mission cancel. |
| `!cof-mission-config` | Commande spécialisée : Mission config. |
| `!cof-mission-launch` | Commande spécialisée : Mission launch. |
| `!cof-mission-participant-toggle` | Commande spécialisée : Mission participant toggle. |
| `!cof-mission-participants` | Commande spécialisée : Mission participants. |
| `!cof-mission-show` | Commande spécialisée : Mission show. |
| `!cof-mission-test-toggle` | Commande spécialisée : Mission test toggle. |
| `!cof-mission-tests` | Commande spécialisée : Mission tests. |
| `!cof-mission-tests-all` | Commande spécialisée : Mission tests all. |
| `!cof-montrer-resultats-attaque` | Commande spécialisée : Montrer resultats attaque. |
| `!cof-montrer-resultats-jet` | Commande spécialisée : Montrer resultats jet. |
| `!cof-mot-de-pouvoir-immobilise` | Commande spécialisée : Mot de pouvoir immobilise. |
| `!cof-multi-cartes` | Commande spécialisée : Multi cartes. |
| `!cof-multi-command` | Commande spécialisée : Multi command. |
| `!cof-mur-de-force` | Commande spécialisée : Mur de force. |
| `!cof-nature-nourriciere` | Commande spécialisée : Nature nourriciere. |
| `!cof-next-charge-fantastique` | Commande spécialisée : Next charge fantastique. |
| `!cof-nouveau-jour` | Commande spécialisée : Nouveau jour. |
| `!cof-observation` | Commande spécialisée : Observation. |
| `!cof-ombre-mortelle` | Commande spécialisée : Ombre mortelle. |
| `!cof-ombre-mouvante` | Commande spécialisée : Ombre mouvante. |
| `!cof-open-door` | Commande spécialisée : Open door. |
| `!cof-options` | Affiche les options du moteur. |
| `!cof-options-d-attaque` | Commande spécialisée : Options d attaque. |
| `!cof-pacte-sanglant` | Commande spécialisée : Pacte sanglant. |
| `!cof-pacte-sanglant-def` | Commande spécialisée : Pacte sanglant def. |
| `!cof-parade-au-bouclier` | Commande spécialisée : Parade au bouclier. |
| `!cof-parade-magistrale` | Commande spécialisée : Parade magistrale. |
| `!cof-parade-projectiles` | Commande spécialisée : Parade projectiles. |
| `!cof-pathfinder1` | Commande spécialisée : Pathfinder1. |
| `!cof-pause` | Commande spécialisée : Pause. |
| `!cof-pause-statistiques` | Commande spécialisée : Pause statistiques. |
| `!cof-petit-veinard` | Commande spécialisée : Petit veinard. |
| `!cof-peur` | Commande spécialisée : Peur. |
| `!cof-poser-bombe` | Commande spécialisée : Poser bombe. |
| `!cof-posture-de-combat` | Commande spécialisée : Posture de combat. |
| `!cof-prescience` | Commande spécialisée : Prescience. |
| `!cof-proteger-un-allie` | Commande spécialisée : Proteger un allie. |
| `!cof-prouesse` | Commande spécialisée : Prouesse. |
| `!cof-provocation` | Commande spécialisée : Provocation. |
| `!cof-rage-du-berserk` | Commande spécialisée : Rage du berserk. |
| `!cof-recharger` | Commande spécialisée : Recharger. |
| `!cof-recuperation` | Commande spécialisée : Recuperation. |
| `!cof-recupere-mana` | Commande spécialisée : Recupere mana. |
| `!cof-remove-buf-def` | Commande spécialisée : Remove buf def. |
| `!cof-renvoyer-invocation` | Commande spécialisée : Renvoyer invocation. |
| `!cof-resister-a-la-magie` | Commande spécialisée : Resister a la magie. |
| `!cof-resultat-jet` | Commande spécialisée : Resultat jet. |
| `!cof-retour-boomerang` | Commande spécialisée : Retour boomerang. |
| `!cof-reveler-nom` | Commande spécialisée : Reveler nom. |
| `!cof-riposte-defi` | Commande spécialisée : Riposte defi. |
| `!cof-rune-energie` | Commande spécialisée : Rune energie. |
| `!cof-rune-protection` | Commande spécialisée : Rune protection. |
| `!cof-rune-puissance` | Commande spécialisée : Rune puissance. |
| `!cof-runes` | Commande spécialisée : Runes. |
| `!cof-save-effet` | Commande spécialisée : Save effet. |
| `!cof-save-state` | Commande spécialisée : Save state. |
| `!cof-sentir-la-corruption` | Commande spécialisée : Sentir la corruption. |
| `!cof-set-attribute` | Commande spécialisée : Set attribute. |
| `!cof-set-macros` | Crée/actualise les macros de campagne. |
| `!cof-set-predicate` | Commande spécialisée : Set predicate. |
| `!cof-set-state` | Commande spécialisée : Set state. |
| `!cof-skip-attack` | Commande spécialisée : Skip attack. |
| `!cof-soigner-affaiblissement` | Commande spécialisée : Soigner affaiblissement. |
| `!cof-soin` | Commande spécialisée : Soin. |
| `!cof-soins` | Commande spécialisée : Soins. |
| `!cof-sommeil` | Commande spécialisée : Sommeil. |
| `!cof-sphere-de-feu` | Commande spécialisée : Sphere de feu. |
| `!cof-stabiliser-blessure` | Commande spécialisée : Stabiliser blessure. |
| `!cof-statistiques` | Commande spécialisée : Statistiques. |
| `!cof-statut` | Résumé d’état du personnage. |
| `!cof-statut-ressources` | Commande spécialisée : Statut ressources. |
| `!cof-strangulation` | Commande spécialisée : Strangulation. |
| `!cof-suivre` | Commande spécialisée : Suivre. |
| `!cof-surprise` | Commande spécialisée : Surprise. |
| `!cof-teleportation` | Commande spécialisée : Teleportation. |
| `!cof-teleportation-annuler` | Commande spécialisée : Teleportation annuler. |
| `!cof-tempete-de-mana` | Commande spécialisée : Tempete de mana. |
| `!cof-tenebres` | Commande spécialisée : Tenebres. |
| `!cof-tenebres-magiques` | Commande spécialisée : Tenebres magiques. |
| `!cof-test-attaque-opposee` | Commande spécialisée : Test attaque opposee. |
| `!cof-test-collectif` | Assistant de test collectif. |
| `!cof-test-collectif-afficher` | Commande spécialisée : Test collectif afficher. |
| `!cof-test-collectif-roll` | Commande spécialisée : Test collectif roll. |
| `!cof-test-mort` | Commande spécialisée : Test mort. |
| `!cof-torche` | Commande spécialisée : Torche. |
| `!cof-tour-de-force` | Commande spécialisée : Tour de force. |
| `!cof-tour-force` | Commande spécialisée : Tour force. |
| `!cof-tour-suivant` | Commande spécialisée : Tour suivant. |
| `!cof-tp-auto` | Commande spécialisée : Tp auto. |
| `!cof-transe-guerison` | Commande spécialisée : Transe guerison. |
| `!cof-tueur-fantasmagorique` | Commande spécialisée : Tueur fantasmagorique. |
| `!cof-undo` | Annule la dernière transaction compatible. |
| `!cof-usure-off` | Commande spécialisée : Usure off. |
| `!cof-utilise-consommable` | Commande spécialisée : Utilise consommable. |
| `!cof-vapeurs-ethyliques` | Commande spécialisée : Vapeurs ethyliques. |
| `!cof-vision-nocturne` | Commande spécialisée : Vision nocturne. |
| `!cof-zone` | Assistant de zones/pièges. |
| `!cof-zone-activer` | Commande spécialisée : Zone activer. |
| `!cof-zone-annuler` | Commande spécialisée : Zone annuler. |
| `!cof-zone-commande` | Commande spécialisée : Zone commande. |
| `!cof-zone-config` | Commande spécialisée : Zone config. |
| `!cof-zone-de-vie` | Commande spécialisée : Zone de vie. |
| `!cof-zone-effet-add` | Commande spécialisée : Zone effet add. |
| `!cof-zone-effet-del` | Commande spécialisée : Zone effet del. |
| `!cof-zone-effets` | Commande spécialisée : Zone effets. |
| `!cof-zone-info` | Commande spécialisée : Zone info. |
| `!cof-zone-modifier` | Commande spécialisée : Zone modifier. |
| `!cof-zone-reset` | Commande spécialisée : Zone reset. |
| `!cof-zone-supprimer` | Commande spécialisée : Zone supprimer. |
| `!cof-zone-test` | Commande spécialisée : Zone test. |
| `!cof-zone-wizard` | Commande spécialisée : Zone wizard. |
| `!cof-zones` | Commande spécialisée : Zones. |

---

## 19. Références complémentaires

- [Prédicats exhaustifs](docs/PREDICATS_REFERENCE.md)
- [Commandes des trois scripts](docs/COMMANDES_REFERENCE.md)
- [Monster Creator](docs/MONSTER_CREATOR.md)
- [Guide CoFItem](CoFItem_GUIDE.md)
- [Guide COAlaric](COAlaric_GUIDE.md)
