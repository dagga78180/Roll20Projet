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

La référence exhaustive des **569 affixes** est dans **[docs/AFFIXES_REFERENCE.md](docs/AFFIXES_REFERENCE.md)**.

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

## 19. Références complémentaires

- [Affixes exhaustifs](docs/AFFIXES_REFERENCE.md)
- [Commandes des trois scripts](docs/COMMANDES_REFERENCE.md)
- [Guide COFantasy](COFantasy_GUIDE.md)
- [Guide COAlaric](COAlaric_GUIDE.md)
