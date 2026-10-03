# Audit V2 — Roll20Projet

## Verdict

La distribution V2 est **cohérente statiquement, chargeable et synchronisée**. Les trois scripts passent la compilation JavaScript et un smoke-load dans une sandbox Roll20 minimale ; le modèle de prix externe et celui embarqué dans CoFItem sont comparés automatiquement à chaque validation.

Cette refonte privilégie la stabilité de campagne : le moteur COFantasy reste un script Roll20 monolithique, car une modularisation agressive de ses ~59 000 lignes apporterait beaucoup plus de risque de régression que de gain d’exécution dans la sandbox. La V2 nettoie la distribution, les sources de vérité et les interfaces entre scripts sans supprimer les chemins de compatibilité actifs.

## Mesures avant / après

| Indicateur | Version précédente | V2 |
|---|---:|---:|
| Scripts API | 3 | 3 |
| Lignes JS | 66 981 | 65 409 |
| Taille JS | 3 369 019 octets | 3 208 758 octets |
| Lignes de commentaires de maintenance | ~2 338 | 9 (en-têtes uniquement) |
| Documentation Markdown | 1 fichier | 6 fichiers |
| Classeur Monster Creator inclus | non | oui |
| Validateur automatisé | non | oui |

Le projet V2 est légèrement plus volumineux au total parce qu’il inclut désormais le dernier Monster Creator et les annexes exhaustives, tout en réduisant le code API distribué.

## Corrections et refonte

- `COFantasy-V2.0.0.js`, `CoFItem-V2.0.0.js`, `COAlaric-V2.0.0.js` remplacent les anciens noms de distribution.
- Changelogs historiques, commentaires morts et blocs de maintenance ont été retirés des scripts ; l’information utile est déplacée dans la documentation.
- Les chemins de compatibilité fonctionnels ont été conservés.
- Le `scriptVersion` interne de COFantasy reste **3.15** afin de ne pas provoquer artificiellement une migration de `state` : V2 est une version de distribution, pas un nouveau schéma de campagne.
- Le transfert d’équipement/consommables CoFItem affiche une confirmation `✅ Transfert effectué` après succès.
- Le catalogue V2 est la source commune des objets et affixes.
- Correction d’audit : **A112 Héliolite (+1d4 Lumière) = P2** dans le classeur, le modèle JSON et le modèle embarqué.
- Courbes de prix synchronisées : Q = **3 / 10 / 30 / 90 / 300 PO**, P = **4 / 15 / 50 / 180 / 600 PO**.
- `Catalogue_pricing_model.json` contient **55 bases et 569 affixes** ; le validateur vérifie chaque base/affixe contre CoFItem.
- Le dernier classeur fourni par l’utilisateur est inclus byte-pour-byte comme `Monster_Creator_V2.xlsx`.

## Documentation utilisateur

`README.md` est maintenant le manuel central et couvre : fiche Roll20, COFantasy, CoFItem, COAlaric, combat/AO, effets, zones, téléportation, invocations, équipement, consommables, pause/repos, loot, commerce, marchandage, vol, ardoise, prédicats, capacités/sorts et Monster Creator.

Annexes générées depuis les sources :

- **252 commandes COFantasy** ;
- **65 commandes CoFItem** ;
- **41 sous-commandes COAlaric** ;
- **331 prédicats/familles** ;
- **569 affixes** avec P, coefficient et effet ;
- manuel détaillé du Monster Creator.

## Monster Creator

Le classeur fourni contient 18 onglets, dont `Creator`, `Moteur`, `Export_Statsblock`, les références NC/profils/tailles/armures/capacités/sorts/danger/Roll20 et `Simulateur_Rencontre`. Les formules ont été contrôlées sans erreur `#REF!`, `#VALUE!`, `#NAME?` ou `#N/A` détectée lors de l’audit. Les commandes générées utilisent des options reconnues par COFantasy V2 (`--cone`, `--psave`, `--recharge`, types de dégâts, etc.).

## Contrôles automatisés

Exécuter :

```bash
node tools/validate-v2.mjs
```

Le validateur vérifie :

1. présence des scripts, fiche, catalogue, Monster Creator et documentation ;
2. syntaxe des trois scripts ;
3. smoke-load des trois scripts dans un environnement Roll20 minimal ;
4. export global de `COFantasy`, `COFantasyItems` et `COAlaric` ;
5. structure du modèle de prix et courbes Q/P ;
6. parité des **55 bases** et **569 affixes** entre JSON et CoFItem ;
7. A112/P2 ;
8. présence de la confirmation de transfert ;
9. absence de fichiers temporaires de build.

## Limite de l’audit

L’environnement de cette refonte n’est pas une partie Roll20 active et n’a pas accès à une instance Supabase de production. Les contrôles couvrent donc structure, syntaxe, chargement, données et cohérence inter-modules. Avant remplacement définitif dans une campagne importante, faire un smoke test live sur une copie : initiative/attaque, équipement/transfert, consommable, `!cof-undo`, achat COAlaric, marchandage, vente, vol et import d’un monstre.
