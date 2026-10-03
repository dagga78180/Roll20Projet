# Monster Creator V2 — manuel complet

Le fichier `Monster_Creator_V2.xlsx` est la source de création de PNJ/monstres incluse dans la V2. Il ne remplace pas COFantasy : il prépare un bloc cohérent, calcule son danger puis génère les données et commandes que la fiche/COFantasy exécutent.

## Flux recommandé

1. Dans **Creator**, renseigner le nom, le NC, la famille/sous-famille, taille, profil, archétypes, armure, rareté de composant et affinités.
2. Lire les **statistiques calculées** : caractéristiques, PV, DEF, initiative, mouvements, allonge, toucher, dégâts de référence, budget de capacités et rang maximal de sort.
3. Vérifier les **signatures automatiques**. Elles sont gratuites en budget mais intégrées au danger réel.
4. Définir jusqu’aux attaques prévues, puis choisir des **capacités supplémentaires** et des **sorts** dans les listes proposées. Le budget restant est affiché.
5. Vérifier **Danger réel** et **NC réel** : le calcul tient compte du châssis statistique, des signatures, capacités, sorts et affinités sans recompter les effets déjà intégrés aux PV/DEF/Toucher/DM.
6. Copier la chaîne de **Export_Statsblock** dans l’onglet Statblock de la fiche PNJ Roll20.
7. Les commandes COFantasy générées dans le même onglet peuvent être copiées dans les actions/abilities si nécessaire.
8. Pour préparer une scène, utiliser **Simulateur_Rencontre** avec les niveaux et modificateurs de puissance des PJ puis les dangers individuels des ennemis.

## Onglets

| Onglet | Rôle |
|---|---|
| `Creator` | Interface principale de création et contrôle du danger réel. |
| `Moteur` | Calculs intermédiaires : pools de caractéristiques, statistiques, DD, budgets, affinités, loot et danger. |
| `Export_Statsblock` | JSON à coller dans la fiche PNJ + commandes COFantasy générées. |
| `Ref_NC` | Courbe de référence par NC. |
| `Ref_Profils` | Profils statistiques. |
| `Ref_Tailles` | Modificateurs de taille. |
| `Ref_Armures` | Choix d’armure. |
| `Ref_SousFamilles` | Sous-familles et signatures/affinités associées. |
| `Ref_Allocations` | Allocations d’archétypes et caractéristiques. |
| `Ref_Signatures` | Capacités automatiques liées aux familles/sous-familles. |
| `Ref_Capacites` | Bibliothèque de capacités supplémentaires et leur poids de danger. |
| `Ref_Sorts` | Bibliothèque de sorts, rangs, usages et poids de danger. |
| `Ref_Des` | Tables de dés/valeurs moyennes. |
| `Ref_Loot` | Paramètres de loot. |
| `Ref_Danger` | Courbes et coefficients du danger réel. |
| `Simulateur_Rencontre` | Compare le danger d’une rencontre à la puissance du groupe. |
| `Ref_Roll20` | Mapping exhaustif vers la fiche Roll20. |
| `Export_Roll20_Helper` | Construction technique de l’export Roll20. |

## Affinités

Le vocabulaire courant est : **Feu, Eau, Air, Terre, Ombre, Lumière, Force**, complété par les dégâts physiques et spéciaux supportés par COFantasy. Les notations d’affinité du créateur alimentent les prédicats exportés : résistances, immunités, soins/absorptions, vulnérabilités et faiblesses majeures.

## Danger réel et rencontre

Le créateur distingue le **NC de création** du **NC réel**. Le NC réel est un résultat d’audit : il monte ou descend si le monstre final s’écarte de la courbe de référence. Le simulateur compare ensuite le danger cumulé des ennemis à la puissance réelle du groupe, en pondérant aussi l’économie d’actions par la présence effective d’ennemis.

## Exemple d’export

Une signature de souffle peut produire une commande de la forme :

```text
!cof-attack @{selected|token_id} @{target|token_id} Souffle élémentaire --auto --dm 2d12+1 --portee 15 --feu --cone 90 --psave DEX 13 --recharge 5 MC_SIG1
```

COFantasy V2 reconnaît ces options. Le JSON du Statblock transporte également les prédicats, mouvements, capacités, loot, métadonnées de création et avatar.
