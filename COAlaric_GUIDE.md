# COAlaric V2 — Guide du commerce et de la boutique

COAlaric ajoute une couche **sociale et économique** autour de CoFItem. Un achat n’est plus seulement « retirer des pièces et donner un objet » : la relation avec Alaric, le marchandage, une dette éventuelle et le risque d’un vol peuvent influencer la transaction.

COAlaric ne remplace ni CoFItem ni COFantasy :

- **CoFItem** sait ce qu’est l’objet et comment le donner/retirer ;
- **COFantasy** sait faire les jets et fournit l’Undo ;
- **COAlaric** orchestre la transaction.

---

## 1. Pourquoi séparer le commerce du catalogue

Le catalogue répond à « **qu’est-ce que cet objet ?** ». Le commerce répond à « **dans quelles conditions ce personnage peut-il l’obtenir ?** ».

Cette séparation permet d’utiliser le même objet dans plusieurs contextes sans changer ses règles : prix négocié, dette, cadeau, vol ou revente ne modifient pas la définition mécanique de l’objet.

---

## 2. Pré-requis

- COFantasy V2 actif ;
- CoFItem V2 actif ;
- COAlaric V2 actif ;
- PJ représenté par une fiche valide ;
- joueur contrôlant le PJ pour les choix joueur.

Diagnostic :

```text
!co-alaric diagnostic
```

Menu MJ :

```text
!co-alaric
```

---

## 3. Flux normal d’un achat

1. Le site Alaric prépare un panier et génère **Copier pour Roll20**.
2. Le MJ colle la commande dans le chat.
3. Le panier est associé au PJ concerné.
4. Le joueur choisit acheter, marchander ou tenter un vol selon les options proposées.
5. COAlaric vérifie à nouveau monnaie/conditions au moment de valider.
6. CoFItem distribue l’objet.
7. COAlaric débite la monnaie et enregistre la transaction.
8. En cas d’échec intermédiaire, l’opération est rollbackée.

Pourquoi revérifier au dernier moment ? Parce qu’un joueur peut dépenser des pièces ou modifier son inventaire entre l’ouverture du panier et le clic final.

---

## 4. Achat direct

L’achat direct est la voie sans test : si le PJ peut acheter et possède les fonds, le prix est payé et l’objet est remis via CoFItem.

La monnaie est gérée en PP/PO/PA/PC. La conversion est faite par le script pour éviter les erreurs de calcul manuel.

Une **ardoise** peut appliquer une majoration au prix. Cette majoration sert simultanément à rembourser une partie de la dette restante.

---

## 5. Marchandage : pourquoi le DD dépend de la remise

Le marchandage mesure non pas « est-ce que le PJ est sympathique ? », mais **jusqu’où il essaie de pousser le marchand**. Une petite remise est plausible ; une remise énorme devient difficile.

| Remise demandée | DD de base Persuasion |
|---:|---:|
| ≤ 5 % | 10 |
| ≤ 10 % | 14 |
| ≤ 15 % | 18 |
| ≤ 20 % | 22 |
| ≤ 25 % | 26 |
| ≤ 30 % | 30 |

Au-delà de 30 %, le MJ reprend la main : refuser, fixer un prix ou autoriser un DD spécial.

L’**affinité commerciale** modifie la situation. Elle ne remplace pas le jet : elle représente la relation accumulée avec Alaric.

---

## 6. Affinité commerciale

Attribut : `coalaric_affinite`, de -3 à +3.

| Valeur | Relation |
|---:|---|
| -3 | Rupture |
| -2 | Mauvaise relation |
| -1 | Méfiance |
| 0 | Neutre |
| +1 | Apprécié |
| +2 | Très apprécié |
| +3 | Favori |

Commande MJ :

```text
!co-alaric affinite --target CHARACTER_ID
```

Pourquoi un score persistant ? Pour que la relation commerciale soit une conséquence de campagne et pas seulement un jet isolé à chaque visite.

Une affinité négative peut bloquer le marchandage. Associée à une ardoise active, elle peut suspendre les achats/ventes ordinaires.

---

## 7. Ardoise : une dette qui modifie réellement les prix

COAlaric utilise :

- `coalaric_ardoise_initiale` ;
- `coalaric_ardoise_restante`.

Commande :

```text
!co-alaric ardoise --target CHARACTER_ID
```

Majoration selon la proportion encore due :

| Dette restante | Majoration |
|---:|---:|
| > 75 % de l’ardoise initiale | +40 % |
| > 50 % | +30 % |
| > 25 % | +20 % |
| ≤ 25 % | +10 % |

L’objectif est que la dette soit visible dans le jeu : elle ne se contente pas d’être un chiffre caché, elle affecte les transactions suivantes jusqu’à remboursement.

---

## 8. Vol : risque, accès et exposition

Le vol est volontairement un flux **MJ → réglages → jet**, car le DD dépend de la situation physique du magasin.

Trois facteurs de 0 à 3 :

- accès ;
- exposition ;
- encombrement.

Formule :

```text
DD = 10 + 2 × (accès + exposition + encombrement)
```

Le MJ peut ajouter un modificateur circonstanciel de -4, -2, 0, +2 ou +4.

Le test utilise **Adresse**. Une marge positive réussit. Une marge de -1 à -4 donne une chance de sauvetage (17+ sur 1d20).

En cas d’échec, le script peut **proposer** une modification d’ardoise/affinité, mais le MJ conserve la décision finale. C’est important : la conséquence sociale d’un vol dépend de la fiction, pas seulement d’une formule.

---

## 9. Revente

```text
!co-alaric vendre --target CHARACTER_ID
```

L’offre de base vaut **50 % de la valeur catalogue**.

Si le joueur marchande sa revente :

| Prix demandé / catalogue | DD |
|---:|---:|
| 55 % | 10 |
| 60 % | 14 |
| 65 % | 18 |
| 70 % | 22 |
| 75 % | 26 |
| 80 % | 30 |

Après accord, CoFItem retire l’objet et COAlaric crédite la monnaie ou rembourse l’ardoise selon le choix.

Pourquoi ne pas revendre à 100 % ? Parce qu’Alaric assume ensuite le risque, l’immobilisation du stock et la marge commerciale.

---

## 10. Undo et sécurité transactionnelle

```text
!cof-undo
```

Une transaction comporte souvent plusieurs mutations : monnaie, inventaire, dette. COAlaric essaye de les traiter comme une seule opération logique. En cas d’échec technique, il rollbacke. En cas d’erreur utilisateur après succès, `!cof-undo` est le premier outil à utiliser.

---

## 11. Ce que le joueur voit / ce que le MJ décide

### Joueur

- choisir les objets ;
- accepter un achat ;
- demander un marchandage ;
- tenter un vol lorsque proposé ;
- accepter/refuser certaines propositions.

### MJ

- contexte de transaction ;
- autoriser/refuser les demandes extrêmes ;
- régler les facteurs d’un vol ;
- décider des conséquences sociales ;
- ajuster affinité et ardoise.

Cette séparation évite que le script « joue Alaric » à la place du MJ.

---

## 12. Commandes courantes

```text
!co-alaric
!co-alaric diagnostic
!co-alaric affinite --target CHARACTER_ID
!co-alaric ardoise --target CHARACTER_ID
!co-alaric vendre --target CHARACTER_ID
```

Les commandes `sale-*`, `haggle-*`, `theft-*`, `select-*` et autres sous-commandes sont surtout des routes de boutons. Les saisir manuellement est rarement utile.

---

## 13. Dépannage

### « L’achat a débité mais l’objet n’est pas là »

C’est une situation anormale. Vérifier la sandbox et utiliser `!cof-undo` avant de modifier manuellement la monnaie/inventaire.

### « Le PJ ne peut pas marchander »

Vérifier l’affinité et l’existence d’une ardoise. Une relation négative peut volontairement interdire le marchandage.

### « Le prix du site et le prix Roll20 divergent »

Les deux doivent utiliser le même modèle de prix. Vérifier `Catalogue_pricing_model.json` et la version de CoFItem/du site déployée.

### « Le panier est ancien »

Le prix/les fonds sont revérifiés au moment du paiement. Recréer un panier est préférable après une modification importante du catalogue.

---

## 14. Référence exhaustive des sous-commandes COAlaric

| Commande | Usage |
|---|---|
| `!co-alaric` | Menu principal. |
| `!co-alaric affinite` | Flux commerce : affinite. |
| `!co-alaric affinity-delta` | Flux commerce : affinity delta. |
| `!co-alaric affinity-set` | Flux commerce : affinity set. |
| `!co-alaric ardoise` | Flux commerce : ardoise. |
| `!co-alaric buy-offer` | Flux commerce : buy offer. |
| `!co-alaric debt-clear` | Flux commerce : debt clear. |
| `!co-alaric debt-pay` | Flux commerce : debt pay. |
| `!co-alaric debt-refuse` | Flux commerce : debt refuse. |
| `!co-alaric debt-request` | Flux commerce : debt request. |
| `!co-alaric debt-set` | Flux commerce : debt set. |
| `!co-alaric diagnostic` | Flux commerce : diagnostic. |
| `!co-alaric haggle-force-roll` | Flux commerce : haggle force roll. |
| `!co-alaric haggle-offer` | Flux commerce : haggle offer. |
| `!co-alaric haggle-resolve` | Flux commerce : haggle resolve. |
| `!co-alaric menu` | Flux commerce : menu. |
| `!co-alaric panier` | Flux commerce : panier. |
| `!co-alaric purchase-accept` | Flux commerce : purchase accept. |
| `!co-alaric sale-accept-offer` | Flux commerce : sale accept offer. |
| `!co-alaric sale-ask` | Flux commerce : sale ask. |
| `!co-alaric sale-force-roll` | Flux commerce : sale force roll. |
| `!co-alaric sale-haggle` | Flux commerce : sale haggle. |
| `!co-alaric sale-open` | Flux commerce : sale open. |
| `!co-alaric sale-payout` | Flux commerce : sale payout. |
| `!co-alaric sale-player-accept` | Flux commerce : sale player accept. |
| `!co-alaric sale-price` | Flux commerce : sale price. |
| `!co-alaric sale-resolve` | Flux commerce : sale resolve. |
| `!co-alaric select-all` | Flux commerce : select all. |
| `!co-alaric select-cancel` | Flux commerce : select cancel. |
| `!co-alaric select-confirm` | Flux commerce : select confirm. |
| `!co-alaric select-none` | Flux commerce : select none. |
| `!co-alaric select-start` | Flux commerce : select start. |
| `!co-alaric select-toggle` | Flux commerce : select toggle. |
| `!co-alaric theft-abort` | Flux commerce : theft abort. |
| `!co-alaric theft-debt` | Flux commerce : theft debt. |
| `!co-alaric theft-finish-failure` | Flux commerce : theft finish failure. |
| `!co-alaric theft-roll` | Flux commerce : theft roll. |
| `!co-alaric theft-set` | Flux commerce : theft set. |
| `!co-alaric theft-stolen-only` | Flux commerce : theft stolen only. |
| `!co-alaric tx-block` | Flux commerce : tx block. |
| `!co-alaric tx-cancel` | Flux commerce : tx cancel. |
| `!co-alaric vendre` | Flux commerce : vendre. |

---

## 15. Contrat complet d’intégration avec CoFItem

COAlaric ne doit pas écrire directement les bonus d’un objet sur un PJ. Il valide/prépare le `cofSpec`, demande à CoFItem de donner l’objet, puis enregistre la transaction afin que `!cof-undo` puisse revenir en arrière lorsque le pont est disponible. Le prix affiché dans Roll20 doit provenir du même modèle catalogue que le site Alaric.

Une entrée de panier exploitable contient au minimum l’identité de l’objet, son prix, sa rareté et `cofSpec.base`. `cofSpec.quality`, `cofSpec.affixes` et `cofSpec.mode` ne sont présents que lorsque nécessaires. Le nom/prix/rareté de haut niveau et ceux de `cofSpec` doivent rester cohérents.

## 16. Flux de création/test complet

1. Générer ou choisir un article sur le site Alaric.
2. Importer le panier avec `!co-alaric panier`.
3. Utiliser le menu pour choisir l’acheteur et l’action (achat, marchandage, vol, dette).
4. Laisser COAlaric calculer/valider le prix et créer la transaction.
5. Laisser CoFItem créer/transférer l’objet : ne pas dupliquer l’objet à la main.
6. Vérifier le message de succès et, en cas d’erreur, utiliser le diagnostic ou `!cof-undo` plutôt que corriger les attributs au hasard.

---

---

---

---

---

## 17. Fiches techniques des sous-commandes COAlaric

Cette partie montre les flags réellement lus par chaque étape de transaction. Les commandes contenant `--tx` manipulent une transaction temporaire générée par COAlaric : en usage normal, utilisez les boutons du menu afin de ne pas réutiliser un identifiant expiré.

### `!co-alaric`

```text
!co-alaric
```

Cette entrée ouvre un menu ou un flux sans paramètre direct supplémentaire.

**Moteur :** `mainMenu`.

### `!co-alaric affinite`

```text
!co-alaric affinite [--target VALEUR]
```

Flags/options observés : `--target`.

**Moteur :** `affinityMenu`.

### `!co-alaric affinity-delta`

```text
!co-alaric affinity-delta [--delta VALEUR] [--tx VALEUR]
```

Flags/options observés : `--delta`, `--tx`.

**Moteur :** `affinityDelta`.

### `!co-alaric affinity-set`

```text
!co-alaric affinity-set [--target VALEUR] [--value VALEUR]
```

Flags/options observés : `--target`, `--value`.

**Moteur :** `affinitySet`.

### `!co-alaric ardoise`

```text
!co-alaric ardoise [--target VALEUR]
```

Flags/options observés : `--target`.

**Moteur :** `slateMenu`.

### `!co-alaric buy-offer`

```text
!co-alaric buy-offer [--tx VALEUR]
```

Flags/options observés : `--tx`.

**Moteur :** `buyOffer`.

### `!co-alaric debt-clear`

```text
!co-alaric debt-clear [--amount VALEUR] [--target VALEUR]
```

Flags/options observés : `--amount`, `--target`.

**Moteur :** `debtSet`.

### `!co-alaric debt-pay`

```text
!co-alaric debt-pay [--amount VALEUR] [--target VALEUR]
```

Flags/options observés : `--amount`, `--target`.

**Moteur :** `debtPay`.

### `!co-alaric debt-refuse`

```text
!co-alaric debt-refuse [--target VALEUR]
```

Flags/options observés : `--target`.

**Moteur :** `debtRefuse`.

### `!co-alaric debt-request`

```text
!co-alaric debt-request [--target VALEUR]
```

Flags/options observés : `--target`.

**Moteur :** `debtRequest`.

### `!co-alaric debt-set`

```text
!co-alaric debt-set [--amount VALEUR] [--target VALEUR]
```

Flags/options observés : `--amount`, `--target`.

**Moteur :** `debtSet`.

### `!co-alaric diagnostic`

```text
!co-alaric diagnostic
```

Cette entrée ouvre un menu ou un flux sans paramètre direct supplémentaire.

**Moteur :** `diagnostic`.

### `!co-alaric haggle-force-roll`

```text
!co-alaric haggle-force-roll [--dd VALEUR] [--tx VALEUR]
```

Flags/options observés : `--dd`, `--tx`.

**Moteur :** `forceHaggleRoll`.

### `!co-alaric haggle-offer`

```text
!co-alaric haggle-offer [--offer VALEUR] [--tx VALEUR]
```

Flags/options observés : `--offer`, `--tx`.

**Moteur :** `haggleOffer`.

### `!co-alaric haggle-resolve`

```text
!co-alaric haggle-resolve [--price VALEUR] [--tx VALEUR]
```

Flags/options observés : `--price`, `--tx`.

**Moteur :** `haggleResolve`.

### `!co-alaric menu`

```text
!co-alaric menu
```

Cette entrée ouvre un menu ou un flux sans paramètre direct supplémentaire.

**Moteur :** `mainMenu`.

### `!co-alaric panier`

```text
!co-alaric panier [--data VALEUR] [--target VALEUR]
```

Flags/options observés : `--data`, `--target`.

**Moteur :** `importCart`.

### `!co-alaric purchase-accept`

```text
!co-alaric purchase-accept [--tx VALEUR]
```

Flags/options observés : `--tx`.

Contrôles utiles : Paiement impossible.

**Moteur :** `purchaseAccept`.

### `!co-alaric sale-accept-offer`

```text
!co-alaric sale-accept-offer [--price VALEUR] [--tx VALEUR]
```

Flags/options observés : `--price`, `--tx`.

**Moteur :** `saleAcceptOffer`.

### `!co-alaric sale-ask`

```text
!co-alaric sale-ask [--ask VALEUR] [--tx VALEUR]
```

Flags/options observés : `--ask`, `--tx`.

**Moteur :** `saleAsk`.

### `!co-alaric sale-force-roll`

```text
!co-alaric sale-force-roll [--dd VALEUR] [--tx VALEUR]
```

Flags/options observés : `--dd`, `--tx`.

**Moteur :** `saleForceRoll`.

### `!co-alaric sale-haggle`

```text
!co-alaric sale-haggle [--tx VALEUR]
```

Flags/options observés : `--tx`.

**Moteur :** `saleHaggle`.

### `!co-alaric sale-open`

```text
!co-alaric sale-open [--i VALEUR] [--pick VALEUR] [--qty VALEUR] [--ref VALEUR] [--target VALEUR]
```

Flags/options observés : `--i`, `--pick`, `--qty`, `--ref`, `--target`.

Contrôles utiles : Référence de bouton invalide. Relance le menu de vente. / Cible PJ invalide dans le bouton. Relance le menu de vente..

**Moteur :** `saleOpen`.

### `!co-alaric sale-payout`

```text
!co-alaric sale-payout [--mode VALEUR] [--tx VALEUR]
```

Flags/options observés : `--mode`, `--tx`.

**Moteur :** `salePayout`.

### `!co-alaric sale-player-accept`

```text
!co-alaric sale-player-accept [--tx VALEUR]
```

Flags/options observés : `--tx`.

**Moteur :** `salePlayerAcceptCmd`.

### `!co-alaric sale-price`

```text
!co-alaric sale-price [--price VALEUR] [--tx VALEUR]
```

Flags/options observés : `--price`, `--tx`.

**Moteur :** `salePrice`.

### `!co-alaric sale-resolve`

```text
!co-alaric sale-resolve [--price VALEUR] [--tx VALEUR]
```

Flags/options observés : `--price`, `--tx`.

**Moteur :** `saleResolve`.

### `!co-alaric select-all`

```text
!co-alaric select-all [--tx VALEUR]
```

Flags/options observés : `--tx`.

**Moteur :** `selectAll`.

### `!co-alaric select-cancel`

```text
!co-alaric select-cancel [--tx VALEUR]
```

Flags/options observés : `--tx`.

**Moteur :** `selectCancel`.

### `!co-alaric select-confirm`

```text
!co-alaric select-confirm [--tx VALEUR]
```

Flags/options observés : `--tx`.

**Moteur :** `selectConfirm`.

### `!co-alaric select-none`

```text
!co-alaric select-none [--tx VALEUR]
```

Flags/options observés : `--tx`.

**Moteur :** `selectAll`.

### `!co-alaric select-start`

```text
!co-alaric select-start [--mode VALEUR] [--tx VALEUR]
```

Flags/options observés : `--mode`, `--tx`.

**Moteur :** `selectStart`.

### `!co-alaric select-toggle`

```text
!co-alaric select-toggle [--index VALEUR] [--tx VALEUR]
```

Flags/options observés : `--index`, `--tx`.

**Moteur :** `selectToggle`.

### `!co-alaric theft-abort`

```text
!co-alaric theft-abort [--tx VALEUR]
```

Flags/options observés : `--tx`.

**Moteur :** `theftAbort`.

### `!co-alaric theft-debt`

```text
!co-alaric theft-debt [--amount VALEUR] [--tx VALEUR]
```

Flags/options observés : `--amount`, `--tx`.

**Moteur :** `theftDebt`.

### `!co-alaric theft-finish-failure`

```text
!co-alaric theft-finish-failure [--tx VALEUR]
```

Flags/options observés : `--tx`.

**Moteur :** `theftFinishFailure`.

### `!co-alaric theft-roll`

```text
!co-alaric theft-roll [--tx VALEUR]
```

Flags/options observés : `--tx`.

**Moteur :** `theftRoll`.

### `!co-alaric theft-set`

```text
!co-alaric theft-set [--field VALEUR] [--tx VALEUR] [--value VALEUR]
```

Flags/options observés : `--field`, `--tx`, `--value`.

**Moteur :** `theftSet`.

### `!co-alaric theft-stolen-only`

```text
!co-alaric theft-stolen-only [--tx VALEUR]
```

Flags/options observés : `--tx`.

**Moteur :** `stolenOnly`.

### `!co-alaric tx-block`

```text
!co-alaric tx-block [--tx VALEUR]
```

Flags/options observés : `--tx`.

**Moteur :** `blockTx`.

### `!co-alaric tx-cancel`

```text
!co-alaric tx-cancel [--tx VALEUR]
```

Flags/options observés : `--tx`.

Contient un contrôle MJ/GM dans au moins un chemin.

**Moteur :** `cancelTx`.

### `!co-alaric vendre`

```text
!co-alaric vendre [--target VALEUR]
```

Flags/options observés : `--target`.

**Moteur :** `saleMenu`.
