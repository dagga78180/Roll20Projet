#!/usr/bin/env python3
from pathlib import Path
import json,re,sys
ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'docs/doc_data.json').read_text(encoding='utf-8'))
MON=json.loads((ROOT/'docs/monster_data.json').read_text(encoding='utf-8'))
cof=(ROOT/'COFantasy_GUIDE.md').read_text(encoding='utf-8')
coi=(ROOT/'CoFItem_GUIDE.md').read_text(encoding='utf-8')
ala=(ROOT/'COAlaric_GUIDE.md').read_text(encoding='utf-8')
coi_js=(ROOT/'CoFItem-V2.0.0.js').read_text(encoding='utf-8')
ala_js=(ROOT/'COAlaric-V2.0.0.js').read_text(encoding='utf-8')
pred_ref=(ROOT/'docs/PREDICATS_REFERENCE.md').read_text(encoding='utf-8')
aff_ref=(ROOT/'docs/AFFIXES_REFERENCE.md').read_text(encoding='utf-8')

def uniq(xs):
    o=[]
    for x in xs:
        if x and x not in o:o.append(x)
    return o

def present(doc,items): return [x for x in items if x not in doc]

checks=[]
# COFantasy public dispatcher commands
cof_cmd=uniq([x['command'] for x in DATA['commands']])
checks.append(('COFantasy commandes dispatchées',len(cof_cmd),present(cof,cof_cmd)))
# Attack options as --name. Some source cases can be +N special tokens; accept name literal if not standard option.
attack=uniq(DATA['attack_options'])
missing=[]
for x in attack:
    if ('--'+x) not in cof and ('`'+x+'`') not in cof and x not in cof:missing.append(x)
checks.append(('Options !cof-attack / alias',len(attack),missing))
# States
states=uniq(DATA['states']); checks.append(('États reconnus',len(states),present(cof,states)))
# Effects
for key,label in [('messageEffetTemp','Effets temporaires'),('messageEffetCombat','Effets de combat'),('messageEffetIndetermine','Effets indéterminés')]:
    vals=uniq(DATA['effects'][key]); checks.append((label,len(vals),present(cof,vals)))
# Authoritative generated predicate names
preds=uniq(re.findall(r'^\| `([^`]+)` \|',pred_ref,re.M))
# Required dynamic families explicitly recognized by mitigation/parser
preds=uniq(preds+DATA.get('predicate_families',[])+['immunite_nonMagique','immunite_magique','resistanceA_nonMagique'])
checks.append(('Prédicats / familles V2',len(preds),present(cof,preds)))
# Rule options
rule_opts=['forme_d_arbre_amelioree','poudre_explosif','interchangeable_attaque','coups_critiques_etendus','echec_critique_boule_de_feu','blessures_graves','degats_importants','dm_minimum','crit_elementaire','max_rune_protection','dm_explosifs','usure_DEF','bonus_attaque_groupe','crit_attaque_groupe','initiative_variable','initiative_variable_individuelle','joueurs_lancent_init','mana_totale','PR_rend_mana','contrecoup','brulure_de_magie','elixirs_sorts','MJ_voit_actions','MJ_valide_affichage_attaques','MJ_valide_affichage_jets','avatar_dans_cadres','manoeuvres','actions_par_defaut','montre_def','duree_effets','init_dynamique','markers_personnalises','table_crit','depense_mana']
checks.append(('Options de règles',len(rule_opts),present(cof,rule_opts)))
# CoFItem command strings that really begin !coi-
coi_cmd=uniq(sorted(set(re.findall(r"['\"](!coi-[a-z0-9-]+)",coi_js))))
checks.append(('CoFItem commandes',len(coi_cmd),present(coi,coi_cmd)))
# COAlaric public subcommands from dispatcher
subs=uniq(re.findall(r"if\s*\(\s*cmd\s*===\s*['\"]([^'\"]+)['\"]",ala_js))
ala_cmd=['!co-alaric']+['!co-alaric '+x for x in subs if x]
checks.append(('COAlaric commandes/sous-commandes',len(ala_cmd),present(ala,ala_cmd)))
# Affixes
ids=uniq(re.findall(r'^\| `([^`]+)` \|',aff_ref,re.M))
checks.append(('Affixes catalogue',len(ids),present(coi,ids)))
# Monster creator libraries: ignore header/empty
for key,label in [('capacites','Monster Creator capacités'),('sorts','Monster Creator sorts'),('signatures','Monster Creator signatures')]:
    vals=[]
    col = 2 if key == 'signatures' else 0
    for row in MON[key][1:]:
        if len(row)>col and row[col] and str(row[col]).strip(): vals.append(str(row[col]).strip())
    vals=uniq(vals)
    checks.append((label,len(vals),present(cof,vals)))

failed=False
lines=['# Couverture documentaire V2','', 'Validation automatique : le build documentaire échoue si une interface reconnue par le moteur disparaît de la documentation.', '', '| Domaine | Attendus | Documentés | Manquants |','|---|---:|---:|---:|']
for label,total,miss in checks:
    documented=total-len(miss)
    lines.append(f'| {label} | {total} | {documented} | {len(miss)} |')
    if miss:
        failed=True
        lines += ['',f'## Manquants — {label}','', '`, `'.join(['`'+x for x in miss[:200]])+'`']
lines += ['', '## Résultat', '', ('**ÉCHEC** — au moins une interface du code n’est pas documentée.' if failed else '**OK — couverture documentaire automatique complète sur tous les domaines contrôlés.**'), '', 'Ce contrôle garantit la **présence** dans le guide. La description sémantique reste auditée séparément : les fiches techniques sont générées depuis les handlers et les chapitres de jeu expliquent les mécaniques importantes.', '']
(ROOT/'docs/DOC_COVERAGE.md').write_text('\n'.join(lines),encoding='utf-8')
print('\n'.join(f'{label}: {total-len(miss)}/{total}' + (f' MISSING={len(miss)}' if miss else '') for label,total,miss in checks))
if failed:sys.exit(1)
