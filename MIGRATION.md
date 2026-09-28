# Migration du référentiel de dégâts

Ce document récapitule les modifications fonctionnelles apportées à l’écosystème.

## COFantasy

- Nouveau référentiel d’affinités : Feu, Eau, Air, Terre, Ombre, Lumière, Force.
- Ombre et Lumière sont des affinités élémentaires planaires ; Force est magique non élémentaire.
- Ajout des types `ombre`, `lumiere`, `force`, `toxique` et `psychique` aux parseurs de dégâts.
- Compatibilité interne entre anciens types et nouvelles affinités : les anciennes valeurs restent comprises par le moteur mais ne sont plus exposées dans les interfaces courantes.
- `necrotique → ombre`, `radiant → lumiere`, `arcane → force`.
- `froid → eau`, `electrique/sonique → air`, `acide → terre`.
- `poison/maladie → toxique` ; leurs protections et immunités historiques restent reconnues.
- `mental → psychique` pour le type de dégâts ; les règles d’attaque mentale restent appliquées.
- `nature` reste historique et n’est pas forcé vers Terre.
- Les catégories `bete`, `vermine`, `aquatique`, `aberration`, `plante`, `monstre`, `vase`, `celeste`, `artificiel`, `esprit`, `elementaire`, `humanoide`, `demon`, `dragon`, `fee`, `geant` et `mort-vivant` sont utilisables par `typeCible`.

## Fiche

- Le menu de dégâts affiche uniquement le référentiel courant : physiques, sept affinités, Toxique, Psychique et Drain.
- Les anciennes valeurs ont été retirées des listes visibles.
- Une ancienne valeur déjà stockée reste interprétable par COFantasy grâce aux alias internes.
- Même référentiel sur la fiche d’arme des objets.

## CoFItem et catalogue

- Synchronisation des données embarquées de CoFItem avec le catalogue fourni.
- Anti-familles harmonisés pour CAC et distance.
- Les noms de matériaux/traitements anti-famille sont purement RP : ils n’ajoutent aucune propriété cachée.
- Malachium devient uniquement anti-Céleste.
- Laënk solaire reste uniquement un matériau lumineux.
- Matériaux d’affinité : Phospharium/Feu, Hybberium/Eau, Fulgurium/Air, Tellurite/Terre, Sombracier/Ombre, Héliolite/Lumière, Arcanite/Force.
- Les anciennes entrées devenues obsolètes restent conservées hors catalogue lorsqu’elles sont nécessaires à la compatibilité historique.
- Le catalogue contient un onglet `Référentiel` récapitulant les correspondances.

## Monster Creator

- Remplacement du bloc d’affinités ancien par Feu/Air/Eau/Terre/Ombre/Lumière/Force.
- Nature reste une colonne historique de compatibilité, non exportée comme affinité nouvelle.
- Nécrotique/Radiant/Arcane ont été migrés vers Ombre/Lumière/Force dans les familles et sous-familles.
- Les descriptions RP et prédicats générés ont été alignés sur les nouvelles appellations.
