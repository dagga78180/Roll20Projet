# Roll20Projet V2 — documentation complète

Ce paquet contient trois scripts qui coopèrent mais ont des responsabilités distinctes. **Chaque guide est autonome et doit permettre de configurer/utiliser le script sans autre documentation.**

## Les 3 manuels

1. **[COFantasy — moteur de règles, commandes, prédicats, capacités et Monster Creator](COFantasy_GUIDE.md)**  
   Combat, états, blessures, opportunités, dégâts, affinités, vulnérabilités, sauvegardes, effets, options d’attaque, classes, 252 commandes et Monster Creator.
2. **[CoFItem — objets, inventaire, affixes, prix, repos et loot](CoFItem_GUIDE.md)**  
   Création/équipement/transfert, Q/P, compatibilités, consommables, repos/hébergement/chasse, loot et catalogue complet des 569 affixes.
3. **[COAlaric — boutique, achats, marchandage, ardoise, vol et revente](COAlaric_GUIDE.md)**  
   Toute la logique commerciale et l’intégration avec CoFItem/COFantasy.

Les versions HTML (`COFantasy_GUIDE.html`, `CoFItem_GUIDE.html`, `COAlaric_GUIDE.html`) offrent une table des matières cliquable proche d’un manuel web.

## Installation minimale

Charge les scripts API dans cet ordre recommandé : `COFantasy-V2.0.0.js`, `CoFItem-V2.0.0.js`, `COAlaric-V2.0.0.js`. Utilise la fiche fournie `ChroniquesOubliees-Sheet.html/.css`. Après démarrage, lance `!cof-doctor`, puis `!cof-set-macros` si les macros doivent être installées/actualisées.

## Vérification de la documentation

`tools/validate-doc-coverage.py` compare les guides au code distribué. Le but est qu’une nouvelle commande/option/prédicat/affixe ajoutée au code rende la validation rouge tant qu’elle n’est pas documentée.

La version livrée passe actuellement la couverture suivante : **252/252 commandes COFantasy, 269/269 options/alias `!cof-attack`, 337/337 prédicats/familles, 33/33 états, 235/235 effets, 66/66 commandes CoFItem, 42/42 commandes COAlaric et 569/569 affixes**. Le rapport détaillé est dans `docs/DOC_COVERAGE.md`.

Pour les résistances/vulnérabilités, chercher directement dans le guide COFantasy : `resistanceA_<type>`, `vulnerableA_<type>`, `faiblesseMajeureA_<type>`, `absorptionA_<type>`, `immunite_<type>`, `protectionDMZone_<type>` et `diviseEffet_<type>`.
