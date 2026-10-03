# CoFItem V2 — Guide des objets, affixes et de la logistique

CoFItem transforme l’équipement en **données jouables**. Un objet n’est pas seulement un nom dans un inventaire : il peut porter une qualité, des affixes, des prédicats, une action, un prix, un emplacement et une commande COFantasy.

L’idée centrale est simple : **CoFItem prépare et transporte l’objet ; COFantasy résout ses effets en jeu**.

## 1. Pourquoi utiliser des fiches OBJET

Une fiche OBJET sert de source réutilisable. Elle permet de :

- conserver le nom, la description, le prix et la rareté ;
- stocker la base catalogue et les affixes ;
- calculer les bonus de qualité ;
- générer les prédicats/options nécessaires à COFantasy ;
- donner l’objet à un PJ sans recopier manuellement ses données ;
- garder une trace cohérente lors d’un transfert, d’un loot ou d’une vente.

Le flux normal est :

```text
Catalogue → fiche OBJET → affixes/qualité → donner → équiper → COFantasy lit les effets
```

---

## 2. Entrées principales

```text
!coi-objets
!coi-catalogue
!coi-affix-index
```

- `!coi-objets` : compendium des fiches OBJET déjà créées ;
- `!coi-catalogue` : bases d’armes, armures, accessoires, consommables, matériel ;
- `!coi-affix-index` : affixes, familles et recherche.

Pour un MJ qui ne veut pas toucher au code, **le Catalogue doit être le point de départ**.

---

## 3. Créer un objet

### 3.1 Depuis une base

```text
!coi-from-base --id BASE_ID
```

ou utiliser les boutons de `!coi-catalogue`.

### 3.2 Objet vide

```text
!coi-new --name ?{Nom|Nouvel objet}
!coi-new-conso --name ?{Nom|Nouvelle potion}
!coi-new-hebergement --name ?{Nom|Auberge}
```

Un objet vide est utile pour un artefact narratif ou une création hors catalogue, mais une base catalogue offre davantage de cohérence et de contrôles.

---

## 4. Qualité Q : fabrication physique

La **qualité** représente la fabrication, l’équilibrage, les matériaux et la finition. Elle ne représente pas l’enchantement.

Effet mécanique du catalogue actuel :

- arme Qn : bonus de qualité appliqué à l’arme selon le modèle de fiche ;
- armure/bouclier Qn : bonus de DEF au-dessus de la base ;
- accessoires et consommables : pas de qualité sauf définition spécifique.

Courbe économique de référence :

| Q | Coût de référence |
|---:|---:|
| Q1 | 3 PO |
| Q2 | 10 PO |
| Q3 | 30 PO |
| Q4 | 90 PO |
| Q5 | 300 PO |

La matière du support garde une influence, mais de manière **compressée** pour éviter qu’une armure chère fasse exploser le prix de façon linéaire.

Formule utilisée pour le coût Q :

```text
coût Q = référence_Q × (prix_base_PA / 5 PA)^0,25
```

Puis le prix de base de l’objet est ajouté.

Pourquoi une racine quatrième ? Parce que le prix de base représente déjà la quantité/valeur de matière, mais cette matière ne doit pas multiplier tout le prix magique ou artisanal.

---

## 5. Puissance P et affixes : la valeur magique

Un affixe possède :

- un **palier P1 à P5** ;
- un **coefficient de valeur** issu de son apport réel ;
- la **difficulté d’enchantement** du support ;
- une petite variation de prix de **±5 %**.

Courbe de référence :

| P | Coût de référence |
|---:|---:|
| P1 | 4 PO |
| P2 | 15 PO |
| P3 | 50 PO |
| P4 | 180 PO |
| P5 | 600 PO |

Formule d’un affixe :

```text
coût affixe = référence_P × difficulté_support × coefficient_affixe × aléa
```

avec `aléa` entre `0,95` et `1,05`.

### Pourquoi le coefficient d’affixe existe

Deux P2 ne sont pas forcément aussi utiles. Un bonus permanent très universel peut valoir davantage qu’un effet situationnel. Le P fixe la **classe de puissance**, le coefficient positionne l’affixe **à l’intérieur de sa classe**.

Le scoring utilisé pour classer les affixes tient compte de :

- impact ;
- fréquence d’utilisation ;
- universalité ;
- fiabilité ;
- contraintes/conditions.

### Difficulté d’enchantement

Ce coefficient ne représente pas la masse de matière. Il représente la difficulté à stabiliser de la magie sur le support. Exemple : un anneau contient peu de matière, mais concentrer une magie complexe dans un petit support peut être plus difficile qu’enchanter une arme classique.

---

## 6. Choisir des affixes

```text
!coi-affixes --item CHARACTER_ID
```

Le catalogue filtre les affixes compatibles avec la base et le mode de l’objet. Les groupes servent à empêcher certaines combinaisons redondantes ou incompatibles.

Le vocabulaire actuel des affinités est :

- Feu, Eau, Air, Terre, Ombre, Lumière, Force ;
- physiques : Tranchant, Contondant, Perçant ;
- spéciaux : Toxique, Psychique, Drain.

Matériaux d’affinité :

| Affinité | Matériau |
|---|---|
| Feu | Phospharium |
| Eau | Hybberium |
| Air | Fulgurium |
| Terre | Tellurite |
| Ombre | Sombracier |
| Lumière | Héliolite |
| Force | Arcanite |

`Laënk` reste un matériau d’éclairage et ne donne pas automatiquement des dégâts Lumière.

La référence exhaustive des **569 affixes** est intégrée plus bas dans cette page.

---

## 7. Donner, équiper et transférer

### 7.1 Donner

```text
!coi-give --item ITEM_ID --target CHARACTER_ID
!coi-give --item ITEM_ID --target CHARACTER_ID --equip
!coi-give --item ITEM_ID --target CHARACTER_ID --qty N
```

`--equip` demande l’équipement immédiat si l’emplacement le permet. `--qty` sert surtout aux consommables.

### 7.2 Pourquoi l’équipement est un état important

Un affixe peut produire un prédicat **uniquement quand l’objet est porté**. Donner un objet et l’équiper ne sont donc pas la même action. Cette distinction évite qu’un objet au fond du sac donne encore un bonus de DEF, une résistance ou une action.

### 7.3 Remplacement d’emplacement

Si un emplacement est occupé, CoFItem peut proposer le remplacement. Le moteur doit retirer proprement les effets de l’ancien équipement avant d’activer ceux du nouveau.

### 7.4 Confirmation de transfert

Après un transfert réussi, CoFItem affiche explicitement :

```text
✅ Transfert effectué.
Nom de l’objet → Nom du personnage
```

Cette confirmation est volontaire : une opération d’inventaire peut modifier plusieurs attributs invisibles et il doit être évident dans le chat qu’elle a réellement abouti.

Les transferts compatibles avec le pont Undo peuvent être annulés par :

```text
!cof-undo
```

---

## 8. Consommables

Un consommable contient :

- quantité ;
- texte d’effet ;
- éventuellement une **commande COFantasy à l’utilisation**.

À l’utilisation, CoFItem :

1. vérifie la pile ;
2. décrémente la quantité ;
3. exécute la commande COFantasy ;
4. enregistre l’opération lorsque le pont Undo le permet.

Commande technique principale :

```text
!coi-use-conso --target TOKEN_ID --attr ATTR_ID
```

Dans l’usage normal, le joueur clique le bouton du consommable au lieu de saisir cette commande.

---

## 9. Pause de 5 minutes : récupération rapide

```text
!coi-pause
```

La pause représente une **décision courte et individuelle** : chaque PJ choisit s’il dépense 1 PR pour récupérer des PV. Elle ne doit pas être confondue avec un repos long.

Pourquoi ne pas rendre automatiquement tout le groupe ? Parce que le PR est une ressource : le choix de le conserver ou non fait partie de la gestion de l’aventure.

La commande historique `!cof-pause` de COFantasy est différente : elle sert à une pause technique/verrouillage de partie, pas à la récupération CoFItem.

---

## 10. Repos long : logistique de groupe

```text
!coi-repos
```

Le repos long est un assistant MJ qui peut intégrer :

- groupe `Equipe PJ` ;
- rations ;
- chasse/survie ;
- hébergement ;
- paiement ;
- récupération PV/PM/PR ;
- buffs d’hébergement.

### Pourquoi ce flux est guidé

Un repos touche plusieurs personnages et plusieurs ressources. Une série de boutons avec récapitulatif évite les erreurs de saisie et permet au MJ de vérifier le coût avant validation.

### Chasse et nourriture

La chasse utilise notamment la compétence Survie. Un repos sans nourriture suffisante peut réduire la récupération. Les chasseurs peuvent également récupérer moins, car ils ont consacré une partie du temps de repos à l’activité.

---

## 11. Hébergements

```text
!coi-hebergements
!coi-new-hebergement --name NOM [--preset PRESET]
```

Une fiche Hébergement peut stocker :

- prix et monnaie ;
- tarification par personne ou groupe ;
- repas inclus ;
- nombre de récupérations PV/PM ;
- PR rendus ;
- récupération au maximum ;
- buff jusqu’au prochain repos.

L’hébergement sert donc à transformer « nous dormons à l’auberge » en une vraie décision économique et mécanique.

---

## 12. Butin et loot

### 12.1 Partage simple de monnaie

```text
!coi-butin
!coi-butin 120 PA
```

Les PJ principaux de `Equipe PJ` sont utilisés ; les familiers ne reçoivent pas automatiquement une part monétaire.

### 12.2 Loot attaché aux tokens

```text
!coi-loot
!coi-loot-help
```

Les GM Notes d’un token peuvent contenir un bloc `[LOOT]`. Le système sait afficher, distribuer, archiver et réinitialiser ces loots.

Pourquoi attacher le loot au token ? Parce que l’inventaire d’un ennemi reste alors lié à la scène qui l’a produit et n’a pas besoin d’être recopié dans un handout séparé.

---

## 13. Fiche OBJET : où CoFItem rejoint COFantasy

Une fiche OBJET peut stocker :

- base catalogue ;
- qualité ;
- affixes ;
- prédicats générés/manuels ;
- options d’arme ;
- action personnalisée ;
- commande de consommable.

Une **commande personnalisée** d’action est prioritaire sur la commande générée. Cela permet au MJ de garder la commodité du catalogue tout en écrivant une capacité unique.

---

## 14. Rareté

La rareté suit le rang le plus élevé de l’objet (qualité ou puissance d’affixe dans le modèle actuel). Elle sert surtout à présenter et filtrer ; elle ne remplace pas le prix, car deux affixes du même P peuvent avoir des coefficients différents.

---

## 15. Import et maintenance du catalogue

```text
!coi-import --cat all --confirm yes
!coi-refresh-bases --confirm yes
```

Ces commandes sont des outils MJ. `refresh` recalcule les données dérivées des bases existantes. Faire une sauvegarde/duplication de campagne avant une migration massive reste une bonne pratique.

---

## 16. Dépannage

### « L’objet est donné mais son bonus ne s’applique pas »

Vérifier qu’il est **équipé** et que l’emplacement est correct. Les prédicats « si porté » ne sont pas actifs dans le sac.

### « Le prix semble étrange »

Vérifier la base, le Q, les IDs d’affixe et la difficulté d’enchantement. Le prix ne correspond plus à l’ancien système `prix de base × énorme multiplicateur`.

### « Le transfert n’a pas l’air d’avoir marché »

Attendre la carte `✅ Transfert effectué`. Si elle n’apparaît pas, ne considérez pas l’opération comme confirmée et vérifiez le chat/API.

### « J’ai donné le mauvais objet »

Utiliser `!cof-undo` immédiatement si l’opération a été enregistrée dans le pont Undo.

---

## 17. Commandes principales à retenir

```text
!coi-objets
!coi-catalogue
!coi-affix-index
!coi-affixes
!coi-give
!coi-give-all-pj
!coi-pause
!coi-repos
!coi-hebergements
!coi-butin
!coi-loot
!coi-loot-help
```

---

## 18. Référence exhaustive des commandes CoFItem

| Commande | Usage |
|---|---|
| `!coi-affix-add` | Commande/interface CoFItem : Affix add. |
| `!coi-affix-detail` | Commande/interface CoFItem : Affix detail. |
| `!coi-affix-index` | Consulter l’index des affixes. |
| `!coi-affix-mode` | Commande/interface CoFItem : Affix mode. |
| `!coi-affix-name` | Commande/interface CoFItem : Affix name. |
| `!coi-affix-remove` | Commande/interface CoFItem : Affix remove. |
| `!coi-affixes` | Modifier les affixes d’une fiche OBJET. |
| `!coi-bag-to-belt` | Commande/interface CoFItem : Bag to belt. |
| `!coi-belt-to-bag` | Commande/interface CoFItem : Belt to bag. |
| `!coi-butin` | Distribution simple de monnaie. |
| `!coi-catalogue` | Parcourir le catalogue et les bases d’objets. |
| `!coi-delete-bag` | Commande/interface CoFItem : Delete bag. |
| `!coi-delete-conso` | Commande/interface CoFItem : Delete conso. |
| `!coi-equip-choice` | Commande/interface CoFItem : Equip choice. |
| `!coi-equipe` | Afficher l’équipe PJ gérée. |
| `!coi-from-base` | Commande/interface CoFItem : From base. |
| `!coi-give` | Donner un objet à un PJ. |
| `!coi-give-all-pj` | Distribuer un objet à tous les PJ principaux. |
| `!coi-give-spec` | Commande/interface CoFItem : Give spec. |
| `!coi-hebergement-show` | Commande/interface CoFItem : Hebergement show. |
| `!coi-hebergements` | Commande/interface CoFItem : Hebergements. |
| `!coi-hunt-env` | Commande/interface CoFItem : Hunt env. |
| `!coi-hunt-run` | Commande/interface CoFItem : Hunt run. |
| `!coi-hunt-set` | Commande/interface CoFItem : Hunt set. |
| `!coi-hunt-toggle` | Commande/interface CoFItem : Hunt toggle. |
| `!coi-import` | Commande/interface CoFItem : Import. |
| `!coi-loot` | Assistant de loot tokenisé. |
| `!coi-loot-add` | Commande/interface CoFItem : Loot add. |
| `!coi-loot-clear` | Commande/interface CoFItem : Loot clear. |
| `!coi-loot-details` | Commande/interface CoFItem : Loot details. |
| `!coi-loot-give` | Commande/interface CoFItem : Loot give. |
| `!coi-loot-give-item` | Commande/interface CoFItem : Loot give item. |
| `!coi-loot-help` | Commande/interface CoFItem : Loot help. |
| `!coi-loot-money` | Commande/interface CoFItem : Loot money. |
| `!coi-loot-reset` | Commande/interface CoFItem : Loot reset. |
| `!coi-loot-show` | Commande/interface CoFItem : Loot show. |
| `!coi-loot-take` | Commande/interface CoFItem : Loot take. |
| `!coi-loot-take-all` | Commande/interface CoFItem : Loot take all. |
| `!coi-new` | Commande/interface CoFItem : New. |
| `!coi-new-conso` | Commande/interface CoFItem : New conso. |
| `!coi-new-hebergement` | Commande/interface CoFItem : New hebergement. |
| `!coi-objets` | Lister les fiches OBJET. |
| `!coi-pause` | Pause de groupe de 5 minutes. |
| `!coi-prmax` | Commande/interface CoFItem : Prmax. |
| `!coi-quality` | Commande/interface CoFItem : Quality. |
| `!coi-refresh-bases` | Commande/interface CoFItem : Refresh bases. |
| `!coi-repos` | Assistant de repos. |
| `!coi-rest-bivouac` | Commande/interface CoFItem : Rest bivouac. |
| `!coi-rest-camp-prepare` | Commande/interface CoFItem : Rest camp prepare. |
| `!coi-rest-final` | Commande/interface CoFItem : Rest final. |
| `!coi-rest-food-confirm` | Commande/interface CoFItem : Rest food confirm. |
| `!coi-rest-food-menu` | Commande/interface CoFItem : Rest food menu. |
| `!coi-rest-food-toggle` | Commande/interface CoFItem : Rest food toggle. |
| `!coi-rest-hunt-confirm` | Commande/interface CoFItem : Rest hunt confirm. |
| `!coi-rest-lodging` | Commande/interface CoFItem : Rest lodging. |
| `!coi-rest-lodging-direct` | Commande/interface CoFItem : Rest lodging direct. |
| `!coi-rest-lodging-food` | Commande/interface CoFItem : Rest lodging food. |
| `!coi-rest-lodgings` | Commande/interface CoFItem : Rest lodgings. |
| `!coi-rest-pay` | Commande/interface CoFItem : Rest pay. |
| `!coi-show` | Afficher une fiche OBJET. |
| `!coi-transfer-armor` | Commande/interface CoFItem : Transfer armor. |
| `!coi-transfer-bag` | Commande/interface CoFItem : Transfer bag. |
| `!coi-transfer-belt` | Commande/interface CoFItem : Transfer belt. |
| `!coi-transfer-weapon` | Commande/interface CoFItem : Transfer weapon. |
| `!coi-use-conso` | Commande/interface CoFItem : Use conso. |

---

## 19. Catalogue des affixes — référence intégrée

Le catalogue V2 contient les affixes réellement utilisables par CoFItem. **P** est le palier de puissance validé ; le coefficient module le prix à l’intérieur du palier. Les compatibilités base/affixe restent contrôlées par CoFItem.

## Prix magique

`coût magique = base du palier P × difficulté d’enchantement du support × coefficient de valeur × aléa fixe du référentiel`

Paliers : **P1 4 PO · P2 15 PO · P3 50 PO · P4 180 PO · P5 600 PO**.

## Accessoire

| ID | Nom | P | Coef | Effet |
|---|---|---:|---:|---|
| `AX_IMM_SURPRIS` | Vigilance éternelle | P2 | 1.054 | Immunité à l’état surpris. |
| `AX_IMM_ASSOMME` | Crâne de fer | P4 | 1.100 | Immunité à l’état étourdi. |
| `AX_IMM_RENVERSE` | Ancrage inébranlable | P2 | 1.019 | Immunité à l’état renversé. |
| `AX_IMM_AVEUGLE` | Vision intérieure | P3 | 1.102 | Immunité à l’état aveuglé. |
| `AX_IMM_AFFAIBLI` | Vitalité inaltérable | P3 | 1.078 | Immunité à l’état affaibli. |
| `AX_IMM_PARALYSE` | Liberté du corps | P4 | 1.072 | Immunité à l’état paralysé. |
| `AX_IMM_ENDORMI` | Veille éternelle | P3 | 1.024 | Immunité à l’état sommeil. |
| `AX_IMM_APEURE` | Cœur intrépide | P2 | 1.043 | Immunité à l’état effrayé. |
| `AX_PROTECTRICE` | Protectrice | P2 | 1.042 | Réduit les dégâts supplémentaires d’un critique et d’une attaque sournoise selon la mécanique Anneau de protection. |
| `AX_SECONDE_CHANCE` | Seconde chance | P4 | 0.952 | La première fois que le porteur devrait tomber à 0 PV et mourir, il reste à 1 PV. Effet consommé pour ce personnage. |
| `AXST_STAT_FOR_1` | Force du Titan | P2 | 1.150 | +1 FOR |
| `AXST_STAT_DEX_1` | Grâce du Félin | P2 | 1.150 | +1 DEX |
| `AXST_STAT_CON_1` | Vigueur de l’Ours | P2 | 1.150 | +1 CON |
| `AXST_STAT_INT_1` | Esprit du Sage | P2 | 1.150 | +1 INT |
| `AXST_STAT_SAG_1` | Clairvoyance de l’Oracle | P2 | 1.150 | +1 SAG |
| `AXST_STAT_CHA_1` | Présence du Souverain | P2 | 1.150 | +1 CHA |
| `AXMOVE_1` | Pas du voyageur | P1 | 0.982 | +1 Initiative, +1 m de déplacement |
| `AXSK_ATHLETISME_2` | Élan de l’Athlète | P1 | 0.993 | +2 aux tests de Athlétisme |
| `AXSK_PUISSANCE_2` | Poigne du Colosse | P1 | 0.993 | +2 aux tests de Puissance |
| `AXSK_PROTECTION_2` | Garde du Rempart | P1 | 0.993 | +2 aux tests de Protection |
| `AXSK_ACROBATIES_2` | Grâce de l’Acrobate | P1 | 0.993 | +2 aux tests de Acrobaties |
| `AXSK_DISCRETION_2` | Pas de l’Ombre | P1 | 1.017 | +2 aux tests de Discrétion |
| `AXSK_ADRESSE_2` | Main du Virtuose | P1 | 0.993 | +2 aux tests de Adresse |
| `AXSK_ENDURANCE_2` | Souffle du Marathonien | P1 | 0.993 | +2 aux tests de Endurance |
| `AXSK_RESISTANCE_2` | Cœur de Fer | P1 | 0.993 | +2 aux tests de Résistance |
| `AXSK_SANG_FROID_2` | Nerfs d’Acier | P1 | 0.993 | +2 aux tests de Sang-eau |
| `AXSK_RECUPERATION_2` | Second Souffle | P1 | 0.993 | +2 aux tests de Récupération |
| `AXSK_ARCANES_2` | Savoir de l’Arcaniste | P1 | 0.993 | +2 aux tests de Arcanes |
| `AXSK_HISTOIRE_2` | Mémoire des Âges | P1 | 0.993 | +2 aux tests de Histoire |
| `AXSK_RELIGION_2` | Savoir du Théologien | P1 | 0.993 | +2 aux tests de Religion |
| `AXSK_NATURE_2` | Instinct du Naturaliste | P1 | 0.993 | +2 aux tests de Nature |
| `AXSK_INVESTIGATION_2` | Œil de l’Enquêteur | P1 | 0.993 | +2 aux tests de Investigation |
| `AXSK_TECHNIQUE_2` | Main de l’Artisan | P1 | 0.993 | +2 aux tests de Technique |
| `AXSK_PERCEPTION_2` | Œil du Guetteur | P1 | 0.993 | +2 aux tests de Perception |
| `AXSK_PERSPICACITE_2` | Regard du Juge | P1 | 0.993 | +2 aux tests de Perspicacité |
| `AXSK_SURVIE_2` | Instinct du Pisteur | P1 | 0.993 | +2 aux tests de Survie |
| `AXSK_MEDECINE_2` | Main du Guérisseur | P1 | 0.993 | +2 aux tests de Médecine |
| `AXSK_INSTINCT_2` | Sixième Sens | P1 | 0.993 | +2 aux tests de Instinct |
| `AXSK_PERSUASION_2` | Voix d’Argent | P1 | 0.993 | +2 aux tests de Persuasion |
| `AXSK_INTIMIDATION_2` | Aura du Prédateur | P1 | 0.993 | +2 aux tests de Intimidation |
| `AXSK_SUPERCHERIE_2` | Langue du Renard | P1 | 0.993 | +2 aux tests de Supercherie |
| `AXSK_REPRESENTATION_2` | Grâce de l’Artiste | P1 | 0.993 | +2 aux tests de Représentation |
| `AXSK_COMMANDEMENT_2` | Voix du Commandant | P1 | 0.993 | +2 aux tests de Commandement |
| `AXST_STAT_FOR_2` | Force du Titan | P3 | 1.150 | +2 FOR |
| `AXST_STAT_DEX_2` | Grâce du Félin | P3 | 1.150 | +2 DEX |
| `AXST_STAT_CON_2` | Vigueur de l’Ours | P3 | 1.150 | +2 CON |
| `AXST_STAT_INT_2` | Esprit du Sage | P3 | 1.150 | +2 INT |
| `AXST_STAT_SAG_2` | Clairvoyance de l’Oracle | P3 | 1.150 | +2 SAG |
| `AXST_STAT_CHA_2` | Présence du Souverain | P3 | 1.150 | +2 CHA |
| `AXRD_FEU_2` | Garde des braises | P1 | 1.000 | RD 2 contre les DM de feu. |
| `AXRD_AIR_2` | Garde des vents | P1 | 1.000 | RD 2 contre les DM de air. |
| `AXRD_EAU_2` | Garde des marées | P1 | 1.000 | RD 2 contre les DM de eau. |
| `AXRD_TERRE_2` | Garde de pierre | P1 | 1.000 | RD 2 contre les DM de terre. |
| `AXRD_NECROTIQUE_2` | Garde funéraire | P1 | 1.000 | RD 2 contre les DM de ombre. |
| `AXRD_RADIANT_2` | Garde solaire | P1 | 1.000 | RD 2 contre les DM de lumière. |
| `AXRD_ARCANE_2` | Garde arcanique | P1 | 1.000 | RD 2 contre les DM de force. |
| `AXRD_POISON_2` | Garde du serpent | P1 | 1.000 | RD 2 contre les DM de toxique. |
| `AXRD_DRAIN_2` | Garde vitale | P1 | 1.000 | RD 2 contre les DM de drain. |
| `AXRD_MENTAL_2` | Garde de l’esprit | P1 | 1.000 | RD 2 contre les DM de psychique. |
| `AXRD_TRANCHANT_2` | Garde des lames | P1 | 1.000 | RD 2 contre les DM de tranchant. |
| `AXRD_PERCANT_2` | Garde des pointes | P1 | 1.000 | RD 2 contre les DM de percant. |
| `AXRD_CONTONDANT_2` | Garde du roc | P1 | 1.000 | RD 2 contre les DM de contondant. |
| `AXMOVE_2` | Pas du voyageur | P2 | 0.965 | +2 Initiative, +2 m de déplacement |
| `AX_ANTICRIT_2` | Anti-critique | P1 | 0.944 | RD 2 supplémentaire uniquement contre les coups critiques. |
| `AXSK_ATHLETISME_4` | Élan de l’Athlète | P2 | 1.000 | +4 aux tests de Athlétisme |
| `AXSK_PUISSANCE_4` | Poigne du Colosse | P2 | 1.000 | +4 aux tests de Puissance |
| `AXSK_PROTECTION_4` | Garde du Rempart | P2 | 1.000 | +4 aux tests de Protection |
| `AXSK_ACROBATIES_4` | Grâce de l’Acrobate | P2 | 1.000 | +4 aux tests de Acrobaties |
| `AXSK_DISCRETION_4` | Pas de l’Ombre | P2 | 1.048 | +4 aux tests de Discrétion |
| `AXSK_ADRESSE_4` | Main du Virtuose | P2 | 1.000 | +4 aux tests de Adresse |
| `AXSK_ENDURANCE_4` | Souffle du Marathonien | P2 | 1.000 | +4 aux tests de Endurance |
| `AXSK_RESISTANCE_4` | Cœur de Fer | P2 | 1.000 | +4 aux tests de Résistance |
| `AXSK_SANG_FROID_4` | Nerfs d’Acier | P2 | 1.000 | +4 aux tests de Sang-eau |
| `AXSK_RECUPERATION_4` | Second Souffle | P2 | 1.000 | +4 aux tests de Récupération |
| `AXSK_ARCANES_4` | Savoir de l’Arcaniste | P2 | 1.000 | +4 aux tests de Arcanes |
| `AXSK_HISTOIRE_4` | Mémoire des Âges | P2 | 1.000 | +4 aux tests de Histoire |
| `AXSK_RELIGION_4` | Savoir du Théologien | P2 | 1.000 | +4 aux tests de Religion |
| `AXSK_NATURE_4` | Instinct du Naturaliste | P2 | 1.000 | +4 aux tests de Nature |
| `AXSK_INVESTIGATION_4` | Œil de l’Enquêteur | P2 | 1.000 | +4 aux tests de Investigation |
| `AXSK_TECHNIQUE_4` | Main de l’Artisan | P2 | 1.000 | +4 aux tests de Technique |
| `AXSK_PERCEPTION_4` | Œil du Guetteur | P2 | 1.000 | +4 aux tests de Perception |
| `AXSK_PERSPICACITE_4` | Regard du Juge | P2 | 1.000 | +4 aux tests de Perspicacité |
| `AXSK_SURVIE_4` | Instinct du Pisteur | P2 | 1.000 | +4 aux tests de Survie |
| `AXSK_MEDECINE_4` | Main du Guérisseur | P2 | 1.000 | +4 aux tests de Médecine |
| `AXSK_INSTINCT_4` | Sixième Sens | P2 | 1.000 | +4 aux tests de Instinct |
| `AXSK_PERSUASION_4` | Voix d’Argent | P2 | 1.000 | +4 aux tests de Persuasion |
| `AXSK_INTIMIDATION_4` | Aura du Prédateur | P2 | 1.000 | +4 aux tests de Intimidation |
| `AXSK_SUPERCHERIE_4` | Langue du Renard | P2 | 1.000 | +4 aux tests de Supercherie |
| `AXSK_REPRESENTATION_4` | Grâce de l’Artiste | P2 | 1.000 | +4 aux tests de Représentation |
| `AXSK_COMMANDEMENT_4` | Voix du Commandant | P2 | 1.000 | +4 aux tests de Commandement |
| `AXRD_FEU_4` | Garde des braises | P2 | 1.000 | RD 4 contre les DM de feu. |
| `AXRD_AIR_4` | Garde des vents | P2 | 1.000 | RD 4 contre les DM de air. |
| `AXRD_EAU_4` | Garde des marées | P2 | 1.000 | RD 4 contre les DM de eau. |
| `AXRD_TERRE_4` | Garde de pierre | P2 | 1.000 | RD 4 contre les DM de terre. |
| `AXRD_NECROTIQUE_4` | Garde funéraire | P2 | 1.000 | RD 4 contre les DM de ombre. |
| `AXRD_RADIANT_4` | Garde solaire | P2 | 1.000 | RD 4 contre les DM de lumière. |
| `AXRD_ARCANE_4` | Garde arcanique | P2 | 1.000 | RD 4 contre les DM de force. |
| `AXRD_POISON_4` | Garde du serpent | P2 | 1.000 | RD 4 contre les DM de toxique. |
| `AXRD_DRAIN_4` | Garde vitale | P2 | 1.000 | RD 4 contre les DM de drain. |
| `AXRD_MENTAL_4` | Garde de l’esprit | P2 | 1.000 | RD 4 contre les DM de psychique. |
| `AXRD_TRANCHANT_4` | Garde des lames | P2 | 1.000 | RD 4 contre les DM de tranchant. |
| `AXRD_PERCANT_4` | Garde des pointes | P2 | 1.000 | RD 4 contre les DM de percant. |
| `AXRD_CONTONDANT_4` | Garde du roc | P2 | 1.000 | RD 4 contre les DM de contondant. |
| `AX_ANTICRIT_4` | Anti-critique | P2 | 0.900 | RD 4 supplémentaire uniquement contre les coups critiques. |
| `A214` | Précision du duelliste | P2 | 1.075 | +1 aux tests d’attaque |
| `A216` | Présence du Souverain | P2 | 1.150 | +1 CHA |
| `A218` | Vigueur de l’Ours | P2 | 1.150 | +1 CON |
| `A220` | Égide du gardien | P2 | 1.087 | +1 DEF |
| `A222` | Grâce du Félin | P2 | 1.150 | +1 DEX |
| `A226` | Force du Titan | P2 | 1.150 | +1 FOR |
| `A228` | Esprit du Sage | P2 | 1.150 | +1 INT |
| `A229` | Pas du voyageur | P1 | 0.949 | +1 m de déplacement |
| `A231` | Égide de l’alchimiste | P1 | 1.000 | RD 2 contre les DM d'terre |
| `A232` | Égide du roc | P1 | 1.000 | RD 2 contre les DM contondants |
| `A233` | Égide des braises | P1 | 1.000 | RD 2 contre les DM de feu |
| `A234` | Égide de l’orage | P1 | 1.000 | RD 2 contre les DM de air |
| `A235` | Égide du givre | P1 | 1.000 | RD 2 contre les DM de eau |
| `A236` | Égide des pointes | P1 | 1.000 | RD 2 contre les DM perforants |
| `A237` | Égide du serpent | P1 | 1.000 | RD 2 contre les DM de toxique |
| `A238` | Égide des lames | P1 | 1.000 | RD 2 contre les DM tranchants |
| `A242` | Clairvoyance de l’Oracle | P2 | 1.150 | +1 SAG |
| `A248` | Présence du Souverain | P3 | 1.150 | +2 CHA |
| `A250` | Vigueur de l’Ours | P3 | 1.150 | +2 CON |
| `A252` | Égide du gardien | P3 | 1.180 | +2 DEF |
| `A254` | Grâce du Félin | P3 | 1.150 | +2 DEX |
| `A258` | Force du Titan | P3 | 1.150 | +2 FOR |
| `A259` | Liberté de mouvement | P3 | 1.091 | Immunité à l’état immobilisé. |
| `A260` | Vivacité inaltérable | P2 | 1.043 | Immunité à l’état entravé. |
| `A262` | Esprit du Sage | P3 | 1.150 | +2 INT |
| `A263` | Pas du voyageur | P1 | 0.916 | +3 m de déplacement |
| `A265` | Égide de l’alchimiste | P2 | 1.000 | RD 4 contre les DM d'terre |
| `A266` | Égide du roc | P2 | 1.000 | RD 4 contre les DM contondants |
| `A267` | Égide des braises | P2 | 1.000 | RD 4 contre les DM de feu |
| `A268` | Égide de l’orage | P2 | 1.000 | RD 4 contre les DM de air |
| `A269` | Égide du givre | P2 | 1.000 | RD 4 contre les DM de eau |
| `A270` | Égide des pointes | P2 | 1.000 | RD 4 contre les DM perforants |
| `A271` | Égide du serpent | P2 | 1.000 | RD 4 contre les DM de toxique |
| `A272` | Égide des lames | P2 | 1.000 | RD 4 contre les DM tranchants |
| `A276` | Clairvoyance de l’Oracle | P3 | 1.150 | +2 SAG |
| `A278` | Précision du duelliste | P3 | 1.024 | +2 aux tests d’attaque |
| `A288` | CON de base | P3 | 1.150 | CON de base : Mod +2 |
| `A289` | CON en plus | P2 | 1.150 | +1 CON |
| `A290` | Consommables équipables | P1 | 1.003 | +1 consommable équipable |
| `A291` | DEX de base | P3 | 1.150 | DEX de base : Mod +2 |
| `A292` | DEX en plus | P2 | 1.150 | +1 DEX |
| `A293` | FOR de base | P3 | 1.150 | FOR de base : Mod +2 |
| `A294` | FOR en plus | P2 | 1.150 | +1 FOR |
| `A295` | CON de base | P4 | 1.150 | CON de base : Mod +3 |
| `A296` | CON en plus | P3 | 1.150 | +2 CON |
| `A297` | Consommables équipables | P2 | 1.006 | +2 consommable équipable |
| `A298` | DEX de base | P4 | 1.150 | DEX de base : Mod +3 |
| `A299` | DEX en plus | P3 | 1.150 | +2 DEX |
| `A300` | FOR de base | P4 | 1.150 | FOR de base : Mod +3 |
| `A301` | FOR en plus | P3 | 1.150 | +2 FOR |
| `A302` | CON de base | P5 | 1.150 | CON de base : Mod +4 |
| `A303` | Consommables équipables | P3 | 1.000 | +3 consommable équipable |
| `A304` | DEX de base | P5 | 1.150 | DEX de base : Mod +4 |
| `A305` | FOR de base | P5 | 1.150 | FOR de base : Mod +4 |
| `A306` | Héritage de classe | P2 | 1.100 | Capacité de Classe Rang 1 |
| `A307` | Héritage de classe | P3 | 1.100 | Capacité de Classe Rang 2 |
| `A308` | Héritage de classe | P4 | 1.100 | Capacité de Classe Rang 3 |
| `A309` | Héritage de classe | P5 | 1.100 | Capacité de Classe Rang 4 |
| `A310` | Héritage de classe | P5 | 1.100 | Capacité de Classe Rang 5 |
| `A311` | Discrétion | P1 | 1.017 | +2 aux tests de Discrétion |
| `A312` | RD Terre | P1 | 1.000 | RD 2 contre les DM d'terre |
| `A313` | RD Feu | P1 | 1.000 | RD 2 contre les DM de feu |
| `A314` | RD Air | P1 | 1.000 | RD 2 contre les DM de air |
| `A315` | RD Eau | P1 | 1.000 | RD 2 contre les DM de eau |
| `A316` | RD Toxique | P1 | 1.000 | RD 2 contre les DM de toxique |
| `A317` | Représentation | P1 | 0.993 | +2 aux tests de Représentation |
| `A318` | Résistance | P1 | 0.993 | +2 aux tests de Résistance |
| `A319` | Survie | P1 | 0.993 | +2 aux tests de Survie |
| `A320` | Discrétion | P2 | 1.048 | +4 aux tests de Discrétion |
| `A321` | RD Terre | P2 | 1.000 | RD 4 contre les DM d'terre |
| `A322` | RD Feu | P2 | 1.000 | RD 4 contre les DM de feu |
| `A323` | RD Air | P2 | 1.000 | RD 4 contre les DM de air |
| `A324` | RD Eau | P2 | 1.000 | RD 4 contre les DM de eau |
| `A325` | RD Toxique | P2 | 1.000 | RD 4 contre les DM de toxique |
| `A326` | Représentation | P2 | 1.000 | +4 aux tests de Représentation |
| `A327` | Résistance | P2 | 1.000 | +4 aux tests de Résistance |
| `A328` | Survie | P2 | 1.000 | +4 aux tests de Survie |
| `A329` | Adresse | P1 | 0.993 | +2 aux tests de Adresse |
| `A330` | Athlétisme | P1 | 0.993 | +2 aux tests de Athlétisme |
| `A331` | Attaque | P2 | 1.075 | +1 aux tests d’attaque |
| `A332` | DEF | P2 | 1.087 | +1 DEF |
| `A334` | Puissance | P1 | 0.993 | +2 aux tests de Puissance |
| `A336` | Adresse | P2 | 1.000 | +4 aux tests de Adresse |
| `A337` | Athlétisme | P2 | 1.000 | +4 aux tests de Athlétisme |
| `A338` | DEF | P3 | 1.180 | +2 DEF |
| `A340` | Puissance | P2 | 1.000 | +4 aux tests de Puissance |
| `A341` | Attaque | P3 | 1.024 | +2 aux tests d’attaque |
| `A345` | Mouvement | P1 | 0.949 | +1 m de déplacement |
| `A346` | RD Terre | P1 | 1.000 | RD 2 contre les DM d'terre |
| `A347` | RD Contondant | P1 | 1.000 | RD 2 contre les DM contondants |
| `A348` | RD Feu | P1 | 1.000 | RD 2 contre les DM de feu |
| `A349` | RD Air | P1 | 1.000 | RD 2 contre les DM de air |
| `A350` | RD Eau | P1 | 1.000 | RD 2 contre les DM de eau |
| `A351` | RD Perforant | P1 | 1.000 | RD 2 contre les DM perforants |
| `A352` | RD Toxique | P1 | 1.000 | RD 2 contre les DM de toxique |
| `A353` | RD Tranchant | P1 | 1.000 | RD 2 contre les DM tranchants |
| `A356` | Immunité immobilisé | P3 | 1.091 | Immunité à l’état immobilisé. |
| `A357` | Immunité ralenti | P2 | 1.043 | Immunité à l’état entravé. |
| `A358` | Mouvement | P1 | 0.916 | +3 m de déplacement |
| `A359` | RD Terre | P2 | 1.000 | RD 4 contre les DM d'terre |
| `A360` | RD Contondant | P2 | 1.000 | RD 4 contre les DM contondants |
| `A361` | RD Feu | P2 | 1.000 | RD 4 contre les DM de feu |
| `A362` | RD Air | P2 | 1.000 | RD 4 contre les DM de air |
| `A363` | RD Eau | P2 | 1.000 | RD 4 contre les DM de eau |
| `A364` | RD Perforant | P2 | 1.000 | RD 4 contre les DM perforants |
| `A365` | RD Toxique | P2 | 1.000 | RD 4 contre les DM de toxique |
| `A366` | RD Tranchant | P2 | 1.000 | RD 4 contre les DM tranchants |
| `A369` | CHA de base | P3 | 1.150 | CHA de base : Mod +2 |
| `A370` | CHA en plus | P2 | 1.150 | +1 CHA |
| `A371` | INT de base | P3 | 1.150 | INT de base : Mod +2 |
| `A372` | INT en plus | P2 | 1.150 | +1 INT |
| `A373` | RD Contondant | P1 | 1.000 | RD 2 contre les DM contondants |
| `A374` | RD Perforant | P1 | 1.000 | RD 2 contre les DM perforants |
| `A375` | RD Tranchant | P1 | 1.000 | RD 2 contre les DM tranchants |
| `A376` | SAG de base | P3 | 1.150 | SAG de base : Mod +2 |
| `A377` | SAG en plus | P2 | 1.150 | +1 SAG |
| `A378` | CHA de base | P4 | 1.150 | CHA de base : Mod +3 |
| `A379` | CHA en plus | P3 | 1.150 | +2 CHA |
| `A380` | INT de base | P4 | 1.150 | INT de base : Mod +3 |
| `A381` | INT en plus | P3 | 1.150 | +2 INT |
| `A382` | RD Contondant | P2 | 1.000 | RD 4 contre les DM contondants |
| `A383` | RD Perforant | P2 | 1.000 | RD 4 contre les DM perforants |
| `A384` | RD Tranchant | P2 | 1.000 | RD 4 contre les DM tranchants |
| `A385` | SAG de base | P4 | 1.150 | SAG de base : Mod +3 |
| `A386` | SAG en plus | P3 | 1.150 | +2 SAG |
| `A387` | CHA de base | P5 | 1.150 | CHA de base : Mod +4 |
| `A388` | INT de base | P5 | 1.150 | INT de base : Mod +4 |
| `A389` | SAG de base | P5 | 1.150 | SAG de base : Mod +4 |
| `A525` | Égide des vents | P1 | 1.000 | RD 2 contre les DM d’air |
| `A526` | Égide des vents | P2 | 1.000 | RD 4 contre les DM d’air |
| `A527` | Égide des marées | P1 | 1.000 | RD 2 contre les DM d’eau |
| `A528` | Égide des marées | P2 | 1.000 | RD 4 contre les DM d’eau |
| `A529` | Égide de pierre | P1 | 1.000 | RD 2 contre les DM de terre |
| `A530` | Égide de pierre | P2 | 1.000 | RD 4 contre les DM de terre |
| `A533` | Égide funéraire | P1 | 1.000 | RD 2 contre les DM ombre |
| `A534` | Égide funéraire | P2 | 1.000 | RD 4 contre les DM ombre |
| `A535` | Égide solaire | P1 | 1.000 | RD 2 contre les DM lumière |
| `A536` | Égide solaire | P2 | 1.000 | RD 4 contre les DM lumière |
| `A537` | Égide arcanique | P1 | 1.000 | RD 2 contre les DM force |
| `A538` | Égide arcanique | P2 | 1.000 | RD 4 contre les DM force |
| `A539` | Égide du silence | P1 | 1.000 | RD 2 contre les DM air |
| `A540` | Égide du silence | P2 | 1.000 | RD 4 contre les DM air |
| `A543` | Égide vitale | P1 | 1.000 | RD 2 contre les DM de drain |
| `A544` | Égide vitale | P2 | 1.000 | RD 4 contre les DM de drain |
| `A545` | Égide de l’esprit | P1 | 1.000 | RD 2 contre les DM psychique |
| `A546` | Égide de l’esprit | P2 | 1.000 | RD 4 contre les DM psychique |
| `A547` | Réserve de mana | P2 | 0.983 | 1 fois par jour, récupère 1 dé de mana. |
| `A548` | Réserve de mana | P2 | 1.054 | 2 fois par jour, récupère 1 dé de mana. |
| `A549` | Réserve de mana | P3 | 1.024 | 3 fois par jour, récupère 1 dé de mana. |

## Armes

| ID | Nom | P | Coef | Effet |
|---|---|---:|---:|---|
| `A001` | Affûté | P2 | 1.043 | +1 à la plage de critique. |
| `A002` | Gardienne | P2 | 1.087 | +1 DEF tant que l’arme est tenue en main. |
| `WSKM_ATHLETISME_2` | Élan de l’Athlète | P1 | 0.993 | +2 aux tests de Athlétisme |
| `WSKM_PUISSANCE_2` | Poigne du Colosse | P1 | 0.993 | +2 aux tests de Puissance |
| `WSKM_ADRESSE_2` | Main du Virtuose | P1 | 0.993 | +2 aux tests de Adresse |
| `WSKM_ACROBATIES_2` | Grâce de l’Acrobate | P1 | 0.993 | +2 aux tests de Acrobaties |
| `WSKD_ADRESSE_2` | Main du Virtuose | P1 | 0.993 | +2 aux tests de Adresse |
| `WSKD_ACROBATIES_2` | Grâce de l’Acrobate | P1 | 0.993 | +2 aux tests de Acrobaties |
| `WSKD_PERCEPTION_2` | Œil du Guetteur | P1 | 0.993 | +2 aux tests de Perception |
| `WSKD_SURVIE_2` | Instinct du Pisteur | P1 | 0.993 | +2 aux tests de Survie |
| `WSKD_TECHNIQUE_2` | Main de l’Artisan | P1 | 0.993 | +2 aux tests de Technique |
| `WSKD_NATURE_2` | Instinct du Naturaliste | P1 | 0.993 | +2 aux tests de Nature |
| `WSKF_PERCEPTION_2` | Œil du Guetteur | P1 | 0.993 | +2 aux tests de Perception |
| `WSKF_TECHNIQUE_2` | Main de l’Artisan | P1 | 0.993 | +2 aux tests de Technique |
| `WSKF_ARCANES_2` | Savoir de l’Arcaniste | P1 | 0.993 | +2 aux tests de Arcanes |
| `WSKF_RELIGION_2` | Savoir du Théologien | P1 | 0.993 | +2 aux tests de Religion |
| `WSKF_NATURE_2` | Instinct du Naturaliste | P1 | 0.993 | +2 aux tests de Nature |
| `WSKF_INVESTIGATION_2` | Œil de l’Enquêteur | P1 | 0.993 | +2 aux tests de Investigation |
| `A003` | Équilibrée | P2 | 1.075 | +1 en attaque avec cette arme. |
| `WSKM_ATHLETISME_4` | Élan de l’Athlète | P2 | 1.000 | +4 aux tests de Athlétisme |
| `WSKM_PUISSANCE_4` | Poigne du Colosse | P2 | 1.000 | +4 aux tests de Puissance |
| `WSKM_ADRESSE_4` | Main du Virtuose | P2 | 1.000 | +4 aux tests de Adresse |
| `WSKM_ACROBATIES_4` | Grâce de l’Acrobate | P2 | 1.000 | +4 aux tests de Acrobaties |
| `WSKD_ADRESSE_4` | Main du Virtuose | P2 | 1.000 | +4 aux tests de Adresse |
| `WSKD_ACROBATIES_4` | Grâce de l’Acrobate | P2 | 1.000 | +4 aux tests de Acrobaties |
| `WSKD_PERCEPTION_4` | Œil du Guetteur | P2 | 1.000 | +4 aux tests de Perception |
| `WSKD_SURVIE_4` | Instinct du Pisteur | P2 | 1.000 | +4 aux tests de Survie |
| `WSKD_TECHNIQUE_4` | Main de l’Artisan | P2 | 1.000 | +4 aux tests de Technique |
| `WSKD_NATURE_4` | Instinct du Naturaliste | P2 | 1.000 | +4 aux tests de Nature |
| `WSKF_PERCEPTION_4` | Œil du Guetteur | P2 | 1.000 | +4 aux tests de Perception |
| `WSKF_TECHNIQUE_4` | Main de l’Artisan | P2 | 1.000 | +4 aux tests de Technique |
| `WSKF_ARCANES_4` | Savoir de l’Arcaniste | P2 | 1.000 | +4 aux tests de Arcanes |
| `WSKF_RELIGION_4` | Savoir du Théologien | P2 | 1.000 | +4 aux tests de Religion |
| `WSKF_NATURE_4` | Instinct du Naturaliste | P2 | 1.000 | +4 aux tests de Nature |
| `WSKF_INVESTIGATION_4` | Œil de l’Enquêteur | P2 | 1.000 | +4 aux tests de Investigation |
| `A005` | Cornaline brute | P3 | 1.120 | +1 attaque, +1d6 DM contre les bêtes. |
| `A006` | Soufre blanc | P2 | 0.960 | +1 attaque, +1d6 DM contre les vermines. |
| `A007` | Argent alchimique | P3 | 1.150 | +1 attaque, +1d6 DM contre les mort-vivants. |
| `A008` | Hématite rouge | P3 | 1.200 | +1 attaque, +1d6 DM contre les humanoïdes. |
| `A009` | Corail noir | P2 | 0.940 | +1 attaque, +1d6 DM contre les créatures aquatiques. |
| `A010` | Dracacier | P2 | 0.920 | +1 attaque, +1d6 DM contre les dragons. |
| `A011` | Fer froid | P3 | 1.080 | +1 attaque, +1d6 DM contre les démons. |
| `A012` | Laënk solaire | P1 | 0.955 | Éclaire sur 10 m ; aucune affinité de dégâts. |
| `A013` | Magnétite vive | P2 | 1.060 | +1 attaque, +1d6 DM contre les créatures artificielles. |
| `A014` | Poussière d’argent froid | P2 | 1.030 | +1 attaque, +1d6 DM contre les fées. |
| `A015` | Sève noire | P2 | 0.960 | +1 attaque, +1d6 DM contre les plantes. |
| `A016` | Osmium noir | P2 | 1.050 | +1 attaque, +1d6 DM contre les géants. |
| `A017` | Verre astral | P2 | 1.030 | +1 attaque, +1d6 DM contre les élémentaires. |
| `A018` | Verre torsadé | P2 | 1.000 | +1 attaque, +1d6 DM contre les aberrations. |
| `A019` | Finesse | P2 | 1.043 | Le porteur peut utiliser son mod. de DEX à la place de son mod. de FOR comme Carac. de dommage avec cette arme. |
| `A020` | Gardienne | P3 | 1.120 | +2 DEF tant que l’arme est tenue en main. |
| `A022` | Adamantium | P2 | 0.995 | Ignore 2 points de RD. +2 aux tests pour briser objets, armes, boucliers ou portes. |
| `A023` | Arcanite | P2 | 0.965 | +1d4 DM d’affinité Force. |
| `A024` | en durium | P1 | 0.959 | -1 attaque, mais le dé de DM augmente d’une catégorie. Arme quasi indestructible. |
| `A025` | Fulgurium | P2 | 0.965 | +1d4 DM d’affinité Air. |
| `A026` | Hybberium | P2 | 0.965 | +1d4 DM d’affinité Eau. |
| `A027` | Laënk solaire | P1 | 0.899 | Éclaire sur 20 m ; aucune affinité de dégâts. |
| `A028` | Malachium | P2 | 0.900 | +1 attaque, +1d6 DM contre les célestes. |
| `A029` | Mithral | P1 | 0.978 | +2 m de déplacement, +2 initiative. |
| `A030` | Phospharium | P2 | 0.965 | +1d4 DM d’affinité Feu. |
| `A031` | Tellurite | P2 | 0.965 | +1d4 DM d’affinité Terre. |
| `A032` | Sombracier | P2 | 0.965 | +1d4 DM d’affinité Ombre. |
| `A034` | Héliolite | P2 | 0.965 | +1d4 DM d’affinité Lumière. |
| `A035` | Double chasse | P3 | 1.050 | +1 attaque, +1d6 DM contre deux types de créatures cohérents. |
| `A037` | Adamantium | P3 | 1.102 | Ignore 4 points de RD. +4 aux tests pour briser objets, armes, boucliers ou portes. |
| `A038` | Arcanite | P2 | 0.988 | +1d6 DM d’affinité Force. |
| `A039` | Fulgurium | P2 | 0.988 | +1d6 DM d’affinité Air. |
| `A040` | Hybberium | P2 | 0.988 | +1d6 DM d’affinité Eau. |
| `A042` | Mithral | P3 | 1.068 | +4 m de déplacement, +4 initiative. |
| `A043` | Phospharium | P2 | 0.988 | +1d6 DM d’affinité Feu. |
| `A044` | Tellurite | P2 | 0.988 | +1d6 DM d’affinité Terre. |
| `A045` | Sombracier | P2 | 0.988 | +1d6 DM d’affinité Ombre. |
| `A047` | Héliolite | P2 | 0.988 | +1d6 DM d’affinité Lumière. |
| `A050` | canalisatrice | P2 | 1.075 | +1 aux tests d’attaque magique |
| `A051` | Héritage de classe | P2 | 1.100 | Capacité de Classe Rang 1 |
| `A052` | sort mineur lié | P2 | 1.063 | 1 fois par jour, permet de lancer un sort de rang 1 sans dépenser de PM. |
| `A053` | Canalisation feu | P1 | 0.947 | +1d4 DM de feu aux sorts offensifs canalisés via l’arme. |
| `A055` | Canalisation toxique | P1 | 0.947 | +1d4 DM de toxique aux sorts offensifs canalisés via l’arme. |
| `A058` | Canalisation force | P1 | 0.947 | +1d4 DM force aux sorts offensifs canalisés via l’arme. |
| `A061` | canalisatrice supérieure | P3 | 1.120 | +2 aux tests d’attaque magique |
| `A062` | de puissance arcanique | P4 | 1.180 | Categorie de dés des sort +1 1d4 => 1d6 |
| `A063` | Héritage de classe | P3 | 1.100 | Capacité de Classe Rang 2 |
| `A064` | réserve de mana | P2 | 0.983 | Peut etre utiliser 1 fois par jour pour recuperer 1dMana |
| `A065` | sort lié | P3 | 1.100 | 1 fois par jour, permet de lancer un sort de rang 2 ou 3 sans dépenser de PM. |
| `A066` | Canalisation feu | P2 | 1.006 | +2d4 DM de feu aux sorts offensifs canalisés via l’arme. |
| `A068` | Canalisation toxique | P2 | 1.006 | +2d4 DM de toxique aux sorts offensifs canalisés via l’arme. |
| `A071` | Canalisation force | P2 | 1.006 | +2d4 DM force aux sorts offensifs canalisés via l’arme. |
| `A074` | de puissance arcanique supérieure | P5 | 1.200 | Categorie de dés des sort +2 1d4 => 1d8 |
| `A075` | Héritage de classe | P4 | 1.100 | Capacité de Classe Rang 3 |
| `A076` | réserve de mana supérieure | P2 | 1.054 | Peut etre utiliser 2 fois par jour pour recuperer 1dMana |
| `A077` | Héritage de classe | P5 | 1.100 | Capacité de Classe Rang 4 |
| `A078` | réserve de mana majeure | P3 | 1.024 | Peut etre utiliser 3 fois par jour pour recuperer 1dMana |
| `A079` | sort majeur lié | P4 | 1.100 | 1 fois par jour, permet de lancer un sort de rang 4 ou 5 sans dépenser de PM. |
| `A080` | Héritage de classe | P5 | 1.100 | Capacité de Classe Rang 5 |
| `A081` | corde de tendon d’ogre | P1 | 0.800 | +1 DM, mais -1 attaque à distance. |
| `A083` | Visée juste | P2 | 1.075 | +1 en attaque à distance avec cette arme. |
| `A084` | Cornaline brute | P3 | 1.120 | +1 attaque, +1d6 DM contre les bêtes. |
| `A085` | Soufre blanc | P2 | 0.960 | +1 attaque, +1d6 DM contre les vermines. |
| `A086` | Argent alchimique | P3 | 1.150 | +1 attaque, +1d6 DM contre les mort-vivants. |
| `A087` | Hématite rouge | P3 | 1.200 | +1 attaque, +1d6 DM contre les humanoïdes. |
| `A088` | Corail noir | P2 | 0.940 | +1 attaque, +1d6 DM contre les créatures aquatiques. |
| `A089` | Dracacier | P2 | 0.920 | +1 attaque, +1d6 DM contre les dragons. |
| `A090` | Fer froid | P3 | 1.080 | +1 attaque, +1d6 DM contre les démons. |
| `A091` | Magnétite vive | P2 | 1.060 | +1 attaque, +1d6 DM contre les créatures artificielles. |
| `A092` | Poussière d’argent froid | P2 | 1.030 | +1 attaque, +1d6 DM contre les fées. |
| `A093` | Sève noire | P2 | 0.960 | +1 attaque, +1d6 DM contre les plantes. |
| `A094` | Osmium noir | P2 | 1.050 | +1 attaque, +1d6 DM contre les géants. |
| `A095` | Verre astral | P2 | 1.030 | +1 attaque, +1d6 DM contre les élémentaires. |
| `A096` | Verre torsadé | P2 | 1.000 | +1 attaque, +1d6 DM contre les aberrations. |
| `A097` | corde de nerf de dragon | P1 | 0.965 | +5 m portée et +1 DM. |
| `A098` | corde jumelle | P2 | 1.049 | 1 fois par combat, peut relancer un jet d’attaque à distance raté de 1 ou 2 points. |
| `A100` | Visée juste | P3 | 1.120 | +2 en attaque à distance avec cette arme. |
| `A101` | Arcanite | P2 | 0.965 | +1d4 DM d’affinité Force. |
| `A102` | en bois de chêne | P1 | 0.947 | Portée divisée par 2, mais le dé de DM augmente de 2 catégorie. |
| `A103` | en bois de fer | P2 | 1.043 | Ajoute la FOR aux mod de degats |
| `A104` | en bois de saule | P2 | 1.043 | Ajoute la DEX aux mod de degats |
| `A105` | Bois d’if | P1 | 0.978 | +2 m de déplacement, +2 initiative tant que l’arme est portée ou prête. |
| `A106` | Fulgurium | P2 | 0.965 | +1d4 DM d’affinité Air. |
| `A107` | Hybberium | P2 | 0.965 | +1d4 DM d’affinité Eau. |
| `A108` | Malachium | P2 | 0.900 | +1 attaque, +1d6 DM contre les célestes. |
| `A109` | Phospharium | P2 | 0.965 | +1d4 DM d’affinité Feu. |
| `A110` | Tellurite | P2 | 0.965 | +1d4 DM d’affinité Terre. |
| `A112` | Héliolite | P2 | 0.965 | +1d4 DM d’affinité Lumière. |
| `A113` | fidèle | P1 | 0.971 | Une arme de lancer revient immédiatement dans la main du porteur après l’attaque. |
| `A114` | Tir imperturbable | P2 | 1.031 | Ignore les malus d'obstacle |
| `A115` | Double chasse | P3 | 1.050 | +1 attaque, +1d6 DM contre deux types de créatures cohérents. |
| `A116` | Salve enchaînée | P2 | 1.000 | Une fois par combat, après une attaque réussie, permet une seconde attaque à -5 contre une autre cible située à 5 m maximum de la première. |
| `A117` | Arcanite | P2 | 0.988 | +1d6 DM d’affinité Force. |
| `A118` | Bois d’if | P3 | 1.068 | +4 m de déplacement, +4 initiative tant que l’arme est portée ou prête. |
| `A119` | Fulgurium | P2 | 0.988 | +1d6 DM d’affinité Air. |
| `A120` | Hybberium | P2 | 0.988 | +1d6 DM d’affinité Eau. |
| `A122` | Phospharium | P2 | 0.988 | +1d6 DM d’affinité Feu. |
| `A123` | Tellurite | P2 | 0.988 | +1d6 DM d’affinité Terre. |
| `A125` | Héliolite | P2 | 0.988 | +1d6 DM d’affinité Lumière. |
| `A126` | Tir imperturbable | P3 | 1.100 | Ignore les malus d'obstacle et +1 attaque |
| `A127` | Salve enchaînée | P2 | 0.910 | Une fois par combat, permet une seconde attaque à -2 contre une autre cible située à 5 m maximum de la première. |
| `A470` | Mordant | P1 | 0.975 | +1d6 DM supplémentaires sur un coup critique. |
| `A503` | Canalisation air | P1 | 0.947 | +1d4 DM d’air aux sorts offensifs canalisés via l’arme. |
| `A504` | Canalisation eau | P1 | 0.947 | +1d4 DM d’eau aux sorts offensifs canalisés via l’arme. |
| `A505` | Canalisation terre | P1 | 0.947 | +1d4 DM de terre aux sorts offensifs canalisés via l’arme. |
| `A507` | Canalisation ombre | P1 | 0.947 | +1d4 DM ombre aux sorts offensifs canalisés via l’arme. |
| `A508` | Canalisation lumière | P1 | 0.947 | +1d4 DM lumière aux sorts offensifs canalisés via l’arme. |
| `A509` | Canalisation drain | P1 | 0.947 | +1d4 DM de drain aux sorts offensifs canalisés via l’arme. |
| `A510` | Canalisation psychique | P1 | 0.947 | +1d4 DM psychique aux sorts offensifs canalisés via l’arme. |
| `A511` | Canalisation tranchant | P1 | 0.947 | +1d4 DM tranchants aux sorts offensifs canalisés via l’arme. |
| `A512` | Canalisation perçant | P1 | 0.947 | +1d4 DM perçants aux sorts offensifs canalisés via l’arme. |
| `A513` | Canalisation contondant | P1 | 0.947 | +1d4 DM contondants aux sorts offensifs canalisés via l’arme. |
| `A514` | Canalisation air | P2 | 1.006 | +2d4 DM d’air aux sorts offensifs canalisés via l’arme. |
| `A515` | Canalisation eau | P2 | 1.006 | +2d4 DM d’eau aux sorts offensifs canalisés via l’arme. |
| `A516` | Canalisation terre | P2 | 1.006 | +2d4 DM de terre aux sorts offensifs canalisés via l’arme. |
| `A518` | Canalisation ombre | P2 | 1.006 | +2d4 DM ombre aux sorts offensifs canalisés via l’arme. |
| `A519` | Canalisation lumière | P2 | 1.006 | +2d4 DM lumière aux sorts offensifs canalisés via l’arme. |
| `A520` | Canalisation drain | P2 | 1.006 | +2d4 DM de drain aux sorts offensifs canalisés via l’arme. |
| `A521` | Canalisation psychique | P2 | 1.006 | +2d4 DM psychique aux sorts offensifs canalisés via l’arme. |
| `A522` | Canalisation tranchant | P2 | 1.006 | +2d4 DM tranchants aux sorts offensifs canalisés via l’arme. |
| `A523` | Canalisation perçant | P2 | 1.006 | +2d4 DM perçants aux sorts offensifs canalisés via l’arme. |
| `A524` | Canalisation contondant | P2 | 1.006 | +2d4 DM contondants aux sorts offensifs canalisés via l’arme. |
| `A550` | Fiable | P2 | 0.995 | Relance les résultats de 1 sur les dés de DM de base de l’arme. |
| `A551` | Fiable | P2 | 0.995 | Relance les résultats de 1 sur les dés de DM de base de l’arme. |
| `A552` | Perce-cœur | P2 | 1.043 | +1 à la plage de critique. |
| `A553` | Fracassant | P2 | 1.043 | +1 à la plage de critique. |
| `A554` | Empaleur | P1 | 0.975 | +1d6 DM supplémentaires sur un coup critique. |
| `A555` | Écrasant | P1 | 0.975 | +1d6 DM supplémentaires sur un coup critique. |
| `A556` | Brise-armure | P2 | 0.995 | Ignore 2 points de RD. |
| `A557` | Perce-armure | P2 | 0.995 | Ignore 2 points de RD. |
| `A558` | Ferrite noire | P3 | 1.180 | +1 attaque, +1d6 DM contre les monstres. |
| `A559` | Ferrite noire | P3 | 1.180 | +1 attaque, +1d6 DM contre les monstres. |
| `A560` | Sel vitrifié | P2 | 0.920 | +1 attaque, +1d6 DM contre les vases. |
| `A561` | Sel vitrifié | P2 | 0.920 | +1 attaque, +1d6 DM contre les vases. |
| `A562` | Étherium | P3 | 1.100 | +1 attaque, +1d6 DM contre les esprits. |
| `A563` | Étherium | P3 | 1.100 | +1 attaque, +1d6 DM contre les esprits. |

## Armure / Bouclier

| ID | Nom | P | Coef | Effet |
|---|---|---:|---:|---|
| `AR_IMM_APEURE` | Cœur intrépide | P2 | 1.043 | Immunité à l’état effrayé. |
| `AR_IMM_ENDORMI` | Veille éternelle | P3 | 1.024 | Immunité à l’état sommeil. |
| `AR_IMM_ETOURDI` | Esprit lucide | P4 | 1.100 | Immunité à l’état étourdi. |
| `AR_IMM_RALENTI` | Pas infatigable | P2 | 1.043 | Immunité à l’état entravé. |
| `AR_IMM_RENVERSE` | Ancrage inébranlable | P2 | 1.019 | Immunité à l’état renversé. |
| `AR_IMM_AFFAIBLI` | Vitalité inaltérable | P3 | 1.078 | Immunité à l’état affaibli. |
| `AR_PROTECTRICE` | Protectrice | P2 | 1.042 | Réduit les dégâts supplémentaires des critiques et attaques sournoises lorsque l’armure est portée. |
| `AR_BOUCLIER_PROTECTEUR` | Protecteur | P2 | 1.042 | Réduit les dégâts supplémentaires des critiques et attaques sournoises lorsque le bouclier est porté. |
| `AR_TISSU_BOUCLIER_PSI` | Voile psychique | P3 | 1.050 | +5 DEF contre les attaques psychiquees. |
| `ARD_CLOTH_TRANCHANT_1` | RD Tranchant | P1 | 0.965 | RD 1 contre les DM tranchant |
| `ARD_CLOTH_PERCANT_1` | RD Perçant | P1 | 0.965 | RD 1 contre les DM perçant |
| `ARD_CLOTH_CONTONDANT_1` | RD Contondant | P1 | 0.965 | RD 1 contre les DM contondant |
| `AR_STAT_INT_1` | Esprit du Sage | P2 | 1.150 | +1 INT |
| `AR_STAT_SAG_1` | Clairvoyance de l’Oracle | P2 | 1.150 | +1 SAG |
| `AR_STAT_CHA_1` | Présence du Souverain | P2 | 1.150 | +1 CHA |
| `AR_STAT_DEX_1` | Grâce du Félin | P2 | 1.150 | +1 DEX |
| `AR_STAT_FOR_1` | Force du Titan | P2 | 1.150 | +1 FOR |
| `AR_STAT_CON_1` | Vigueur de l’Ours | P2 | 1.150 | +1 CON |
| `AR_BOUCLIER_PERCUTEUR_1` | Percuteur | P2 | 1.019 | +1 aux attaques réalisées avec le bouclier. |
| `ARD_AIR_2` | RD Air | P1 | 1.000 | RD 2 contre les DM air |
| `ARD_EAU_2` | RD Eau | P1 | 1.000 | RD 2 contre les DM eau |
| `ARD_TERRE_2` | RD Terre | P1 | 1.000 | RD 2 contre les DM terre |
| `ARD_NECROTIQUE_2` | RD Ombre | P1 | 1.000 | RD 2 contre les DM ombre |
| `ARD_RADIANT_2` | RD Lumière | P1 | 1.000 | RD 2 contre les DM lumière |
| `ARD_ARCANE_2` | RD Force | P1 | 1.000 | RD 2 contre les DM force |
| `ARD_MALADIE_2` | RD Toxique | P1 | 1.000 | RD 2 contre les DM toxique |
| `ARD_DRAIN_2` | RD Drain | P1 | 1.000 | RD 2 contre les DM drain |
| `ARD_MENTAL_2` | RD Psychique | P1 | 1.000 | RD 2 contre les DM psychique |
| `ARD_CLOTH_TRANCHANT_2` | RD Tranchant | P1 | 0.931 | RD 2 contre les DM tranchant |
| `ARD_CLOTH_PERCANT_2` | RD Perçant | P1 | 0.931 | RD 2 contre les DM perçant |
| `ARD_CLOTH_CONTONDANT_2` | RD Contondant | P1 | 0.931 | RD 2 contre les DM contondant |
| `AR_STAT_INT_2` | Esprit du Sage | P3 | 1.150 | +2 INT |
| `AR_STAT_SAG_2` | Clairvoyance de l’Oracle | P3 | 1.150 | +2 SAG |
| `AR_STAT_CHA_2` | Présence du Souverain | P3 | 1.150 | +2 CHA |
| `AR_STAT_DEX_2` | Grâce du Félin | P3 | 1.150 | +2 DEX |
| `AR_STAT_FOR_2` | Force du Titan | P3 | 1.150 | +2 FOR |
| `AR_STAT_CON_2` | Vigueur de l’Ours | P3 | 1.150 | +2 CON |
| `ARSK_ARCANES_2` | Savoir de l’Arcaniste | P1 | 0.993 | +2 aux tests de Arcanes |
| `ARSK_RELIGION_2` | Savoir du Théologien | P1 | 0.993 | +2 aux tests de Religion |
| `ARSK_HISTOIRE_2` | Mémoire des Âges | P1 | 0.993 | +2 aux tests de Histoire |
| `ARSK_NATURE_2` | Instinct du Naturaliste | P1 | 0.993 | +2 aux tests de Nature |
| `ARSK_SANG_FROID_2` | Nerfs d’Acier | P1 | 0.993 | +2 aux tests de Sang-eau |
| `ARSK_RESISTANCE_2` | Cœur de Fer | P1 | 0.993 | +2 aux tests de Résistance |
| `ARSK_ACROBATIES_2` | Grâce de l’Acrobate | P1 | 0.993 | +2 aux tests de Acrobaties |
| `ARSK_DISCRETION_2` | Pas de l’Ombre | P1 | 1.017 | +2 aux tests de Discrétion |
| `ARSK_ADRESSE_2` | Main du Virtuose | P1 | 0.993 | +2 aux tests de Adresse |
| `ARSK_ATHLETISME_2` | Élan de l’Athlète | P1 | 0.993 | +2 aux tests de Athlétisme |
| `ARSK_SURVIE_2` | Instinct du Pisteur | P1 | 0.993 | +2 aux tests de Survie |
| `ARSK_PERCEPTION_2` | Œil du Guetteur | P1 | 0.993 | +2 aux tests de Perception |
| `ARSK_PUISSANCE_2` | Poigne du Colosse | P1 | 0.993 | +2 aux tests de Puissance |
| `ARSK_ENDURANCE_2` | Souffle du Marathonien | P1 | 0.993 | +2 aux tests de Endurance |
| `ARSK_INTIMIDATION_2` | Aura du Prédateur | P1 | 0.993 | +2 aux tests de Intimidation |
| `ARSK_PROTECTION_2` | Garde du Rempart | P1 | 0.993 | +2 aux tests de Protection |
| `AR_ANTICRIT_2` | Anti-critique | P1 | 0.944 | RD 2 supplémentaire uniquement contre les coups critiques. |
| `AR_BOUCLIER_PERCUTEUR_2` | Percuteur | P3 | 1.024 | +2 aux attaques réalisées avec le bouclier. |
| `ARD_AIR_4` | RD Air | P2 | 1.000 | RD 4 contre les DM air |
| `ARD_EAU_4` | RD Eau | P2 | 1.000 | RD 4 contre les DM eau |
| `ARD_TERRE_4` | RD Terre | P2 | 1.000 | RD 4 contre les DM terre |
| `ARD_NECROTIQUE_4` | RD Ombre | P2 | 1.000 | RD 4 contre les DM ombre |
| `ARD_RADIANT_4` | RD Lumière | P2 | 1.000 | RD 4 contre les DM lumière |
| `ARD_ARCANE_4` | RD Force | P2 | 1.000 | RD 4 contre les DM force |
| `ARD_MALADIE_4` | RD Toxique | P2 | 1.000 | RD 4 contre les DM toxique |
| `ARD_DRAIN_4` | RD Drain | P2 | 1.000 | RD 4 contre les DM drain |
| `ARD_MENTAL_4` | RD Psychique | P2 | 1.000 | RD 4 contre les DM psychique |
| `ARSK_ARCANES_4` | Savoir de l’Arcaniste | P2 | 1.000 | +4 aux tests de Arcanes |
| `ARSK_RELIGION_4` | Savoir du Théologien | P2 | 1.000 | +4 aux tests de Religion |
| `ARSK_HISTOIRE_4` | Mémoire des Âges | P2 | 1.000 | +4 aux tests de Histoire |
| `ARSK_NATURE_4` | Instinct du Naturaliste | P2 | 1.000 | +4 aux tests de Nature |
| `ARSK_SANG_FROID_4` | Nerfs d’Acier | P2 | 1.000 | +4 aux tests de Sang-eau |
| `ARSK_RESISTANCE_4` | Cœur de Fer | P2 | 1.000 | +4 aux tests de Résistance |
| `ARSK_ACROBATIES_4` | Grâce de l’Acrobate | P2 | 1.000 | +4 aux tests de Acrobaties |
| `ARSK_DISCRETION_4` | Pas de l’Ombre | P2 | 1.048 | +4 aux tests de Discrétion |
| `ARSK_ADRESSE_4` | Main du Virtuose | P2 | 1.000 | +4 aux tests de Adresse |
| `ARSK_ATHLETISME_4` | Élan de l’Athlète | P2 | 1.000 | +4 aux tests de Athlétisme |
| `ARSK_SURVIE_4` | Instinct du Pisteur | P2 | 1.000 | +4 aux tests de Survie |
| `ARSK_PERCEPTION_4` | Œil du Guetteur | P2 | 1.000 | +4 aux tests de Perception |
| `ARSK_PUISSANCE_4` | Poigne du Colosse | P2 | 1.000 | +4 aux tests de Puissance |
| `ARSK_ENDURANCE_4` | Souffle du Marathonien | P2 | 1.000 | +4 aux tests de Endurance |
| `ARSK_INTIMIDATION_4` | Aura du Prédateur | P2 | 1.000 | +4 aux tests de Intimidation |
| `ARSK_PROTECTION_4` | Garde du Rempart | P2 | 1.000 | +4 aux tests de Protection |
| `AR_ANTICRIT_4` | Anti-critique | P2 | 0.900 | RD 4 supplémentaire uniquement contre les coups critiques. |
| `A134` | Protection renforcée | P2 | 1.087 | +1 DEF |
| `A135` | Allègement | P1 | 1.015 | Réduit le malus d'armure de 1 |
| `A136` | Mobilité | P1 | 0.982 | +1 Initiative, +1 m de déplacement |
| `A137` | RD Terre | P1 | 1.000 | RD 2 contre les DM d'terre |
| `A138` | RD Contondant | P1 | 0.965 | RD 1 contre les DM contondants |
| `A139` | RD Feu | P1 | 1.000 | RD 2 contre les DM de feu |
| `A140` | RD Air | P1 | 1.000 | RD 2 contre les DM de air |
| `A141` | RD Eau | P1 | 1.000 | RD 2 contre les DM de eau |
| `A142` | RD Perforant | P1 | 0.965 | RD 1 contre les DM perforants |
| `A143` | RD Toxique | P1 | 1.000 | RD 2 contre les DM de toxique |
| `A144` | RD Tranchant | P1 | 0.965 | RD 1 contre les DM tranchants |
| `A145` | Protection renforcée | P3 | 1.180 | +2 DEF |
| `A146` | Égide runique | P2 | 1.060 | 1 fois par combat, lorsque le porteur est pris pour cible par une attaque, il peut se placer immédiatement en défense simple jusqu'au début de son prochain tour. |
| `A147` | Allègement | P2 | 1.030 | Réduit le malus d'armure de 2 |
| `A148` | Mobilité | P1 | 0.965 | +2 Initiative, +2 m de déplacement |
| `A149` | RD Terre | P2 | 1.000 | RD 4 contre les DM d'terre |
| `A150` | RD Contondant | P1 | 0.931 | RD 2 contre les DM contondants |
| `A151` | RD Feu | P2 | 1.000 | RD 4 contre les DM de feu |
| `A152` | RD Air | P2 | 1.000 | RD 4 contre les DM de air |
| `A153` | RD Eau | P2 | 1.000 | RD 4 contre les DM de eau |
| `A154` | RD Perforant | P1 | 0.931 | RD 2 contre les DM perforants |
| `A155` | RD Toxique | P2 | 1.000 | RD 4 contre les DM de toxique |
| `A156` | RD Tranchant | P1 | 0.931 | RD 2 contre les DM tranchants |
| `A157` | Égide runique | P3 | 1.050 | 1 fois par combat, lorsque le porteur est pris pour cible par une attaque, il peut se placer immédiatement en défense totale jusqu'au début de son prochain tour. |
| `A158` | Protection renforcée | P2 | 1.087 | +1 DEF |
| `A159` | Silencieuse | P2 | 1.060 | +3 aux tests de discrétion |
| `A160` | Allègement | P1 | 1.015 | Réduit le malus d'armure de 1 |
| `A161` | Mobilité | P1 | 0.982 | +1 Initiative, +1 m de déplacement |
| `A162` | RD Terre | P1 | 1.000 | RD 2 contre les DM d'terre |
| `A163` | RD Contondant | P1 | 0.965 | RD 1 contre les DM contondants |
| `A164` | RD Feu | P1 | 1.000 | RD 2 contre les DM de feu |
| `A165` | RD Air | P1 | 1.000 | RD 2 contre les DM de air |
| `A166` | RD Eau | P1 | 1.000 | RD 2 contre les DM de eau |
| `A167` | RD Perforant | P1 | 0.965 | RD 1 contre les DM perforants |
| `A168` | RD Toxique | P1 | 1.000 | RD 2 contre les DM de toxique |
| `A169` | RD Tranchant | P1 | 0.965 | RD 1 contre les DM tranchants |
| `A170` | Protection renforcée | P3 | 1.180 | +2 DEF |
| `A172` | Silencieuse | P3 | 1.078 | +5 aux tests de discrétion |
| `A173` | Allègement | P2 | 1.030 | Réduit le malus d'armure de 2 |
| `A174` | Mobilité | P1 | 0.965 | +2 Initiative, +2 m de déplacement |
| `A175` | RD Terre | P2 | 1.000 | RD 4 contre les DM d'terre |
| `A176` | RD Contondant | P1 | 0.931 | RD 2 contre les DM contondants |
| `A177` | RD Feu | P2 | 1.000 | RD 4 contre les DM de feu |
| `A178` | RD Air | P2 | 1.000 | RD 4 contre les DM de air |
| `A179` | RD Eau | P2 | 1.000 | RD 4 contre les DM de eau |
| `A180` | RD Perforant | P1 | 0.931 | RD 2 contre les DM perforants |
| `A181` | RD Toxique | P2 | 1.000 | RD 4 contre les DM de toxique |
| `A182` | RD Tranchant | P1 | 0.931 | RD 2 contre les DM tranchants |
| `A186` | Protection renforcée | P2 | 1.087 | +1 DEF |
| `A187` | Silencieuse | P2 | 1.060 | +3 aux tests de discrétion |
| `A189` | Mobilité | P1 | 0.982 | +1 Initiative, +1 m de déplacement |
| `A190` | RD Terre | P1 | 1.000 | RD 2 contre les DM d'terre |
| `A192` | RD Feu | P1 | 1.000 | RD 2 contre les DM de feu |
| `A193` | RD Air | P1 | 1.000 | RD 2 contre les DM de air |
| `A194` | RD Eau | P1 | 1.000 | RD 2 contre les DM de eau |
| `A196` | RD Toxique | P1 | 1.000 | RD 2 contre les DM de toxique |
| `A198` | Protection renforcée | P3 | 1.180 | +2 DEF |
| `A200` | Silencieuse | P3 | 1.078 | +5 aux tests de discrétion |
| `A202` | Mobilité | P1 | 0.965 | +2 Initiative, +2 m de déplacement |
| `A203` | RD Terre | P2 | 1.000 | RD 4 contre les DM d'terre |
| `A205` | RD Feu | P2 | 1.000 | RD 4 contre les DM de feu |
| `A206` | RD Air | P2 | 1.000 | RD 4 contre les DM de air |
| `A207` | RD Eau | P2 | 1.000 | RD 4 contre les DM de eau |
| `A209` | RD Toxique | P2 | 1.000 | RD 4 contre les DM de toxique |



## 20. Règle d’auteur CoFItem

Pour créer un objet sans aide extérieure : choisir une base valide, définir `Q`, choisir uniquement des affixes compatibles, renseigner le mode/commande des affixes manuels, puis utiliser les commandes `!coi-show`, `!coi-affixes`, `!coi-quality` et `!coi-give`. CoFItem reconstruit les prédicats et commandes injectés sur la fiche du porteur ; **ne pas recopier manuellement** un bonus d’affixe dans `predicats_script` si l’objet le fournit déjà.

---

---

---

---

---

## 21. Fiches techniques des commandes CoFItem

Référence générée depuis les handlers de CoFItem. Les commandes de transfert, repos, loot et édition d’affixes utilisent souvent des identifiants de session/ligne créés par les menus : quand un bouton existe, il est plus sûr de l’utiliser ; la syntaxe ci-dessous permet néanmoins de comprendre exactement les flags attendus.

### `!coi-affix-`

```text
!coi-affix- [--character VALEUR] [--entry VALEUR] [--item VALEUR] [--sid VALEUR] [--target VALEUR] [--token VALEUR] [--value VALEUR] [sélection Roll20]
```

Flags/options observés : `--all`, `--character`, `--entry`, `--item`, `--name`, `--sid`, `--target`, `--text`, `--token`, `--value`.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Le partage de butin est réservé au MJ. / Format inconnu. Utilise <code>!coi-butin</code>, <code>!coi-butin 120</code> ou <code>!coi-butin 120 PA</code>. / Le montant doit être supérieur à 0..

**Moteur :** `chat`.

### `!coi-affix-add`

```text
!coi-affix-add [--affix VALEUR] [--family VALEUR] [--group VALEUR] [--item VALEUR] [--page VALEUR] [--type1 VALEUR] [--type2 VALEUR]
```

Flags/options observés : `--affix`, `--family`, `--group`, `--item`, `--page`, `--type1`, `--type2`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `changeAffix`.

### `!coi-affix-detail`

```text
!coi-affix-detail [--affix VALEUR] [--family VALEUR] [--group VALEUR] [--item VALEUR] [--page VALEUR]
```

Flags/options observés : `--affix`, `--family`, `--group`, `--item`, `--page`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `affixDetail`.

### `!coi-affix-index`

```text
!coi-affix-index [--cat VALEUR] [--family VALEUR] [--group VALEUR] [--page VALEUR] [--section VALEUR]
```

Flags/options observés : `--cat`, `--family`, `--group`, `--page`, `--section`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `affixIndex`.

### `!coi-affix-mode`

```text
!coi-affix-mode [--confirm VALEUR] [--item VALEUR] [--value VALEUR]
```

Flags/options observés : `--confirm`, `--item`, `--value`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `changeAffixMode`.

### `!coi-affix-name`

```text
!coi-affix-name [--affix VALEUR] [--item VALEUR] [--page VALEUR]
```

Flags/options observés : `--affix`, `--item`, `--page`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `setNameAffix`.

### `!coi-affix-remove`

```text
!coi-affix-remove [--affix VALEUR] [--family VALEUR] [--group VALEUR] [--item VALEUR] [--page VALEUR] [--type1 VALEUR] [--type2 VALEUR]
```

Flags/options observés : `--affix`, `--family`, `--group`, `--item`, `--page`, `--type1`, `--type2`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `changeAffix`.

### `!coi-affixes`

```text
!coi-affixes
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `affixMenu`.

### `!coi-bag-to-belt`

```text
!coi-bag-to-belt [--attr VALEUR] [--character VALEUR] [--qty VALEUR] [--row VALEUR] [--target VALEUR]
```

Flags/options observés : `--attr`, `--character`, `--qty`, `--row`, `--target`.

**Moteur :** `moveInventory`.

### `!coi-belt-to-bag`

```text
!coi-belt-to-bag [--attr VALEUR] [--character VALEUR] [--qty VALEUR] [--row VALEUR] [--target VALEUR]
```

Flags/options observés : `--attr`, `--character`, `--qty`, `--row`, `--target`.

**Moteur :** `moveInventory`.

### `!coi-butin`

```text
!coi-butin
```

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Le partage de butin est réservé au MJ. / Format inconnu. Utilise <code>!coi-butin</code>, <code>!coi-butin 120</code> ou <code>!coi-butin 120 PA</code>. / Le montant doit être supérieur à 0..

**Moteur :** `distributeLoot`.

### `!coi-catalogue`

```text
!coi-catalogue [--cat VALEUR] [--page VALEUR]
```

Flags/options observés : `--cat`, `--page`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `catalogue`.

### `!coi-delete-bag`

```text
!coi-delete-bag [--attr VALEUR] [--character VALEUR] [--row VALEUR]
```

Flags/options observés : `--attr`, `--character`, `--row`.

**Moteur :** `deleteBagItem`.

### `!coi-delete-conso`

```text
!coi-delete-conso [--attr VALEUR] [--character VALEUR] [--row VALEUR]
```

Flags/options observés : `--attr`, `--character`, `--row`.

**Moteur :** `deleteConsumable`.

### `!coi-equip-choice`

```text
!coi-equip-choice [--new VALEUR] [--old VALEUR] [--target VALEUR]
```

Flags/options observés : `--new`, `--old`, `--target`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `equipChoice`.

### `!coi-equipe`

```text
!coi-equipe
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `partyDiagnostic`.

### `!coi-from-base`

```text
!coi-from-base
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `createFromBase`.

### `!coi-give`

```text
!coi-give [--item VALEUR] [--qty VALEUR] [--target VALEUR]
```

Flags/options observés : `--equip`, `--item`, `--qty`, `--target`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `give`.

### `!coi-give-all-pj`

```text
!coi-give-all-pj [--item VALEUR] [--qty VALEUR]
```

Flags/options observés : `--item`, `--qty`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `giveConsumableToAllPJ`.

### `!coi-give-spec`

```text
!coi-give-spec [--data VALEUR] [--target VALEUR]
```

Flags/options observés : `--data`, `--target`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `giveSpec`.

### `!coi-hebergement-show`

```text
!coi-hebergement-show [--character VALEUR] [--entry VALEUR] [--item VALEUR] [--sid VALEUR] [--target VALEUR] [--token VALEUR] [--value VALEUR] [sélection Roll20]
```

Flags/options observés : `--all`, `--character`, `--entry`, `--item`, `--name`, `--sid`, `--target`, `--text`, `--token`, `--value`.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Le partage de butin est réservé au MJ. / Format inconnu. Utilise <code>!coi-butin</code>, <code>!coi-butin 120</code> ou <code>!coi-butin 120 PA</code>. / Le montant doit être supérieur à 0..

**Moteur :** `chat`.

### `!coi-hebergements`

```text
!coi-hebergements
```

Commande principalement pilotée par l’interface ; aucun argument utilisateur supplémentaire n’est détecté dans le handler direct.

**Moteur :** `lodgingLibrary`.

### `!coi-hunt-env`

```text
!coi-hunt-env
```

Commande principalement pilotée par l’interface ; aucun argument utilisateur supplémentaire n’est détecté dans le handler direct.

**Moteur :** `huntEnvMenu`.

### `!coi-hunt-run`

```text
!coi-hunt-run
```

Commande principalement pilotée par l’interface ; aucun argument utilisateur supplémentaire n’est détecté dans le handler direct.

**Moteur :** `runHunt`.

### `!coi-hunt-set`

```text
!coi-hunt-set [--character VALEUR] [--entry VALEUR] [--item VALEUR] [--sid VALEUR] [--target VALEUR] [--token VALEUR] [--value VALEUR] [sélection Roll20]
```

Flags/options observés : `--all`, `--character`, `--entry`, `--item`, `--name`, `--sid`, `--target`, `--text`, `--token`, `--value`.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Le partage de butin est réservé au MJ. / Format inconnu. Utilise <code>!coi-butin</code>, <code>!coi-butin 120</code> ou <code>!coi-butin 120 PA</code>. / Le montant doit être supérieur à 0..

**Moteur :** `chat`.

### `!coi-hunt-toggle`

```text
!coi-hunt-toggle [--character VALEUR] [--entry VALEUR] [--item VALEUR] [--sid VALEUR] [--target VALEUR] [--token VALEUR] [--value VALEUR] [sélection Roll20]
```

Flags/options observés : `--all`, `--character`, `--entry`, `--item`, `--name`, `--sid`, `--target`, `--text`, `--token`, `--value`.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Le partage de butin est réservé au MJ. / Format inconnu. Utilise <code>!coi-butin</code>, <code>!coi-butin 120</code> ou <code>!coi-butin 120 PA</code>. / Le montant doit être supérieur à 0..

**Moteur :** `chat`.

### `!coi-import`

```text
!coi-import [--cat VALEUR] [--confirm VALEUR]
```

Flags/options observés : `--cat`, `--confirm`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `importBases`.

### `!coi-loot`

```text
!coi-loot
```

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : <b>🎁 Loot :</b> sélectionne un ou plusieurs tokens..

**Moteur :** `render`.

### `!coi-loot-add`

```text
!coi-loot-add [--token VALEUR] [sélection Roll20]
```

Flags/options observés : `--token`.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Sélectionne exactement un token..

**Moteur :** `add`.

### `!coi-loot-clear`

```text
!coi-loot-clear [--token VALEUR] [sélection Roll20]
```

Flags/options observés : `--token`.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Sélectionne au moins un token..

**Moteur :** `clear`.

### `!coi-loot-details`

```text
!coi-loot-details [--sid VALEUR]
```

Flags/options observés : `--sid`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `details`.

### `!coi-loot-give`

```text
!coi-loot-give [--entry VALEUR] [--sid VALEUR] [--target VALEUR]
```

Flags/options observés : `--entry`, `--sid`, `--target`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `giveEntry`.

### `!coi-loot-give-item`

```text
!coi-loot-give-item [--item VALEUR] [--sid VALEUR] [--target VALEUR]
```

Flags/options observés : `--item`, `--sid`, `--target`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `giveItem`.

### `!coi-loot-help`

```text
!coi-loot-help
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `help`.

### `!coi-loot-money`

```text
!coi-loot-money [--sid VALEUR] [--target VALEUR]
```

Flags/options observés : `--sid`, `--target`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `money`.

### `!coi-loot-reset`

```text
!coi-loot-reset [--token VALEUR] [sélection Roll20]
```

Flags/options observés : `--token`.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Sélectionne au moins un token..

**Moteur :** `reset`.

### `!coi-loot-show`

```text
!coi-loot-show [--sid VALEUR]
```

Flags/options observés : `--sid`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `showPlayers`.

### `!coi-loot-take`

```text
!coi-loot-take [--entry VALEUR] [--sid VALEUR]
```

Flags/options observés : `--entry`, `--sid`.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Impossible de retirer ce loot..

**Moteur :** `takeEntry`.

### `!coi-loot-take-all`

```text
!coi-loot-take-all [--sid VALEUR]
```

Flags/options observés : `--sid`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `takeAll`.

### `!coi-new`

```text
!coi-new
```

Flags/options observés : `--name`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `match`.

### `!coi-new-conso`

```text
!coi-new-conso
```

Flags/options observés : `--name`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `match`.

### `!coi-new-hebergement`

```text
!coi-new-hebergement [--character VALEUR] [--entry VALEUR] [--item VALEUR] [--sid VALEUR] [--target VALEUR] [--token VALEUR] [--value VALEUR] [sélection Roll20]
```

Flags/options observés : `--all`, `--character`, `--entry`, `--item`, `--name`, `--sid`, `--target`, `--text`, `--token`, `--value`.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Le partage de butin est réservé au MJ. / Format inconnu. Utilise <code>!coi-butin</code>, <code>!coi-butin 120</code> ou <code>!coi-butin 120 PA</code>. / Le montant doit être supérieur à 0..

**Moteur :** `chat`.

### `!coi-objets`

```text
!coi-objets
```

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `library`.

### `!coi-pause`

```text
!coi-pause
```

Contrôles utiles : Impossible de faire une pause pendant un combat. / Personnage invalide pour une pause..

**Moteur :** `pause`.

### `!coi-prmax`

```text
!coi-prmax [--character VALEUR] [--value VALEUR]
```

Flags/options observés : `--all`, `--character`, `--value`.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Personnage invalide..

**Moteur :** `setPRMax`.

### `!coi-quality`

```text
!coi-quality [--family VALEUR] [--group VALEUR] [--item VALEUR] [--page VALEUR] [--value VALEUR]
```

Flags/options observés : `--family`, `--group`, `--item`, `--page`, `--value`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `changeQuality`.

### `!coi-refresh-bases`

```text
!coi-refresh-bases [--confirm VALEUR]
```

Flags/options observés : `--confirm`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `refreshImportedBases`.

### `!coi-repos`

```text
!coi-repos
```

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Impossible de lancer un repos long pendant un combat..

**Moteur :** `restMenu`.

### `!coi-rest-bivouac`

```text
!coi-rest-bivouac
```

Commande principalement pilotée par l’interface ; aucun argument utilisateur supplémentaire n’est détecté dans le handler direct.

**Moteur :** `bivouacMenu`.

### `!coi-rest-camp-prepare`

```text
!coi-rest-camp-prepare
```

Commande principalement pilotée par l’interface ; aucun argument utilisateur supplémentaire n’est détecté dans le handler direct.

**Moteur :** `prepareCamp`.

### `!coi-rest-final`

```text
!coi-rest-final
```

Contrôles utiles : Impossible de valider pendant un combat. / Paiement devenu impossible pour.

**Moteur :** `finalizeRest`.

### `!coi-rest-food-confirm`

```text
!coi-rest-food-confirm [--character VALEUR] [--entry VALEUR] [--item VALEUR] [--sid VALEUR] [--target VALEUR] [--token VALEUR] [--value VALEUR] [sélection Roll20]
```

Flags/options observés : `--all`, `--character`, `--entry`, `--item`, `--name`, `--sid`, `--target`, `--text`, `--token`, `--value`.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Le partage de butin est réservé au MJ. / Format inconnu. Utilise <code>!coi-butin</code>, <code>!coi-butin 120</code> ou <code>!coi-butin 120 PA</code>. / Le montant doit être supérieur à 0..

**Moteur :** `chat`.

### `!coi-rest-food-menu`

```text
!coi-rest-food-menu
```

Commande principalement pilotée par l’interface ; aucun argument utilisateur supplémentaire n’est détecté dans le handler direct.

**Moteur :** `foodMenu`.

### `!coi-rest-food-toggle`

```text
!coi-rest-food-toggle
```

Commande principalement pilotée par l’interface ; aucun argument utilisateur supplémentaire n’est détecté dans le handler direct.

**Moteur :** `foodToggle`.

### `!coi-rest-hunt-confirm`

```text
!coi-rest-hunt-confirm
```

Commande principalement pilotée par l’interface ; aucun argument utilisateur supplémentaire n’est détecté dans le handler direct.

**Moteur :** `prepareHuntCamp`.

### `!coi-rest-lodging`

```text
!coi-rest-lodging [--character VALEUR] [--entry VALEUR] [--item VALEUR] [--sid VALEUR] [--target VALEUR] [--token VALEUR] [--value VALEUR] [sélection Roll20]
```

Flags/options observés : `--all`, `--character`, `--entry`, `--item`, `--name`, `--sid`, `--target`, `--text`, `--token`, `--value`.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Le partage de butin est réservé au MJ. / Format inconnu. Utilise <code>!coi-butin</code>, <code>!coi-butin 120</code> ou <code>!coi-butin 120 PA</code>. / Le montant doit être supérieur à 0..

**Moteur :** `chat`.

### `!coi-rest-lodging-direct`

```text
!coi-rest-lodging-direct [--character VALEUR] [--entry VALEUR] [--item VALEUR] [--sid VALEUR] [--target VALEUR] [--token VALEUR] [--value VALEUR] [sélection Roll20]
```

Flags/options observés : `--all`, `--character`, `--entry`, `--item`, `--name`, `--sid`, `--target`, `--text`, `--token`, `--value`.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Le partage de butin est réservé au MJ. / Format inconnu. Utilise <code>!coi-butin</code>, <code>!coi-butin 120</code> ou <code>!coi-butin 120 PA</code>. / Le montant doit être supérieur à 0..

**Moteur :** `chat`.

### `!coi-rest-lodging-food`

```text
!coi-rest-lodging-food [--character VALEUR] [--entry VALEUR] [--item VALEUR] [--sid VALEUR] [--target VALEUR] [--token VALEUR] [--value VALEUR] [sélection Roll20]
```

Flags/options observés : `--all`, `--character`, `--entry`, `--item`, `--name`, `--sid`, `--target`, `--text`, `--token`, `--value`.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Le partage de butin est réservé au MJ. / Format inconnu. Utilise <code>!coi-butin</code>, <code>!coi-butin 120</code> ou <code>!coi-butin 120 PA</code>. / Le montant doit être supérieur à 0..

**Moteur :** `chat`.

### `!coi-rest-lodgings`

```text
!coi-rest-lodgings
```

Commande principalement pilotée par l’interface ; aucun argument utilisateur supplémentaire n’est détecté dans le handler direct.

**Moteur :** `lodgingList`.

### `!coi-rest-pay`

```text
!coi-rest-pay [--character VALEUR] [--entry VALEUR] [--item VALEUR] [--sid VALEUR] [--target VALEUR] [--token VALEUR] [--value VALEUR] [sélection Roll20]
```

Flags/options observés : `--all`, `--character`, `--entry`, `--item`, `--name`, `--sid`, `--target`, `--text`, `--token`, `--value`.

Travaille avec la sélection Roll20 dans au moins un chemin.

Contient un contrôle MJ/GM dans au moins un chemin.

Contrôles utiles : Le partage de butin est réservé au MJ. / Format inconnu. Utilise <code>!coi-butin</code>, <code>!coi-butin 120</code> ou <code>!coi-butin 120 PA</code>. / Le montant doit être supérieur à 0..

**Moteur :** `chat`.

### `!coi-show`

```text
!coi-show
```

Commande principalement pilotée par l’interface ; aucun argument utilisateur supplémentaire n’est détecté dans le handler direct.

**Moteur :** `showItem`.

### `!coi-transfer-armor`

```text
!coi-transfer-armor [--character VALEUR] [--label VALEUR] [--target VALEUR]
```

Flags/options observés : `--character`, `--label`, `--target`.

**Moteur :** `transferEquipment`.

### `!coi-transfer-bag`

```text
!coi-transfer-bag [--attr VALEUR] [--character VALEUR] [--qty VALEUR] [--row VALEUR] [--target VALEUR]
```

Flags/options observés : `--attr`, `--character`, `--qty`, `--row`, `--target`.

**Moteur :** `moveInventory`.

### `!coi-transfer-belt`

```text
!coi-transfer-belt [--attr VALEUR] [--character VALEUR] [--qty VALEUR] [--row VALEUR] [--target VALEUR]
```

Flags/options observés : `--attr`, `--character`, `--qty`, `--row`, `--target`.

**Moteur :** `moveInventory`.

### `!coi-transfer-weapon`

```text
!coi-transfer-weapon [--character VALEUR] [--label VALEUR] [--target VALEUR]
```

Flags/options observés : `--character`, `--label`, `--target`.

**Moteur :** `transferEquipment`.

### `!coi-use-conso`

```text
!coi-use-conso [--attr VALEUR] [--row VALEUR] [--target VALEUR] [--victim VALEUR]
```

Flags/options observés : `--attr`, `--row`, `--target`, `--victim`.

**Moteur :** `useConsumable`.
