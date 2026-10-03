/* CoFItem V2.0.0 — catalogue, objets, inventaire, repos et loot.
 * Documentation : README.md · Audit : AUDIT_V2.md
 */
var COFantasyItemsUndoBridge = COFantasyItemsUndoBridge || {
  available: function () {
    return (typeof COFantasy !== 'undefined' && COFantasy &&
      typeof COFantasy.coiBeginUndo === 'function' &&
      typeof COFantasy.coiCommitUndo === 'function');
  },
  begin: function (type, charIds, scope) {
    if (!this.available()) return null;
    try {
      return COFantasy.coiBeginUndo(type, charIds, scope);
    } catch (e) {
      log('COFantasy Items : impossible de démarrer l\'undo natif : ' + e.message);
      return null;
    }
  },
  commit: function (transaction, options) {
    if (!transaction || !this.available()) return false;
    try {
      return COFantasy.coiCommitUndo(transaction, options || {});
    } catch (e) {
      log('COFantasy Items : impossible d\'enregistrer l\'undo natif : ' + e.message);
      return false;
    }
  }
};

var COFantasyItems = COFantasyItems || (function(){
'use strict';
var SCRIPT='COFantasy Items', VERSION='V2.0.0', OBJET_TYPE='OBJET', CONSUMABLE_TYPE='CONSOMMABLE';
var BASES=[{"id":"B001","category":"arme","subcategory":"Armes d’attaque au contact","name":"Bâton","price":"0.4 pa","description":"Arme à deux mains. DM temporaires possibles. Bâton simple. Données catalogue : 1d4 — FOR aux DM ; type : Contondants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"contact","weaponType":"Arme 2 mains","weaponDmCar":"FOR","weaponDamageType":"contondant","weaponDmNb":1,"weaponDmDie":4,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["magique"],"affixModeDefault":"magique","baseTags":["staff","blunt","twohand","magic_focus"]},{"id":"B002","category":"arme","subcategory":"Armes d’attaque au contact","name":"Bâton ferré","price":"1 pa","description":"Arme à deux mains. Bâton adapté au combat. Données catalogue : 1d6 — FOR aux DM ; type : Contondants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"contact","weaponType":"Arme 2 mains","weaponDmCar":"FOR","weaponDamageType":"contondant","weaponDmNb":1,"weaponDmDie":6,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["cac","magique"],"affixModeDefault":"cac","baseTags":["staff","blunt","twohand","melee","magic_focus_candidate"]},{"id":"B003","category":"arme","subcategory":"Armes d’attaque au contact","name":"Dague","price":"1.5 pa","description":"Arme légère. Données catalogue : 1d4 — FOR aux DM ; type : Perforants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"contact","weaponType":"Arme 1 main","weaponDmCar":"FOR","weaponDamageType":"percant","weaponDmNb":1,"weaponDmDie":4,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["cac","magique"],"affixModeDefault":"cac","baseTags":["dagger","piercing","light","finesse","melee","magic_focus_candidate"]},{"id":"B004","category":"arme","subcategory":"Armes d’attaque au contact","name":"Hache","price":"2.5 pa","description":"Arme de contact. Données catalogue : 1d8 — FOR aux DM ; type : Tranchants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"contact","weaponType":"Arme 1 main","weaponDmCar":"FOR","weaponDamageType":"tranchant","weaponDmNb":1,"weaponDmDie":8,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["cac"],"affixModeDefault":"cac","baseTags":["axe","slashing","melee","onehand","metal_weapon"]},{"id":"B005","category":"arme","subcategory":"Armes d’attaque au contact","name":"Hache à deux mains","price":"8 pa","description":"Arme à deux mains. Données catalogue : 2d6 — FOR aux DM ; type : Tranchants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"contact","weaponType":"Arme 2 mains","weaponDmCar":"FOR","weaponDamageType":"tranchant","weaponDmNb":2,"weaponDmDie":6,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["cac"],"affixModeDefault":"cac","baseTags":["axe","slashing","melee","twohand","heavy","metal_weapon"]},{"id":"B006","category":"arme","subcategory":"Armes d’attaque au contact","name":"Lance","price":"1.5 pa","description":"Arme à une ou deux mains ; peut être lancée (1d6 DM à 10 m). Portée 2M Données catalogue : 1d6/1d10 — FOR aux DM ; type : Perforants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"contact","weaponType":"Arme 2 mains","weaponDmCar":"FOR","weaponDamageType":"percant","weaponRange":"2 m","weaponDmNb":1,"weaponDmDie":6,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["cac"],"affixModeDefault":"cac","baseTags":["spear","piercing","melee","reach","throwing","metal_weapon"]},{"id":"B007","category":"arme","subcategory":"Armes d’attaque au contact","name":"Marteau","price":"1.2 pa","description":"Arme de contact. Données catalogue : 1d6 — FOR aux DM ; type : Contondants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"contact","weaponType":"Arme 1 main","weaponDmCar":"FOR","weaponDamageType":"contondant","weaponDmNb":1,"weaponDmDie":6,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["cac"],"affixModeDefault":"cac","baseTags":["hammer","blunt","melee","onehand","metal_weapon"]},{"id":"B064","category":"arme","subcategory":"Armes d’attaque au contact","name":"Marteau à deux mains","price":"8 pa","description":"Arme lourde à deux mains. Profil ajouté au catalogue : 2d6 — FOR aux DM ; type : Contondants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"contact","weaponType":"Arme 2 mains","weaponDmCar":"FOR","weaponDamageType":"contondant","weaponDmNb":2,"weaponDmDie":6,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["cac"],"affixModeDefault":"cac","baseTags":["hammer","blunt","melee","twohand","heavy","metal_weapon"]},{"id":"B008","category":"arme","subcategory":"Armes d’attaque au contact","name":"Masse","price":"2 pa","description":"Arme de contact. Données catalogue : 1d6 — FOR aux DM ; type : Contondants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"contact","weaponType":"Arme 1 main","weaponDmCar":"FOR","weaponDamageType":"contondant","weaponDmNb":1,"weaponDmDie":6,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["cac","magique"],"affixModeDefault":"cac","baseTags":["mace","blunt","melee","onehand","metal_weapon","magic_focus_candidate"]},{"id":"B065","category":"arme","subcategory":"Armes d’attaque au contact","name":"Pioche","price":"2.5 pa","description":"Outil lourd utilisable comme arme à deux mains. Profil ajouté au catalogue : 1d8 — FOR aux DM ; type : Perforants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"contact","weaponType":"Arme 2 mains","weaponDmCar":"FOR","weaponDamageType":"percant","weaponDmNb":1,"weaponDmDie":8,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["cac"],"affixModeDefault":"cac","baseTags":["pickaxe","piercing","melee","twohand","heavy","metal_weapon"]},{"id":"B009","category":"arme","subcategory":"Armes d’attaque au contact","name":"Rapière","price":"5 pa","description":"Arme légère ; critique sur 19-20. Données catalogue : 1d6 — FOR aux DM ; type : Perforants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"contact","weaponType":"Arme 1 main","weaponDmCar":"FOR","weaponDamageType":"percant","weaponDmNb":1,"weaponDmDie":6,"weaponCrit":19,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["cac","magique"],"affixModeDefault":"cac","baseTags":["rapier","piercing","light","finesse","melee","metal_weapon","magic_focus_candidate"]},{"id":"B010","category":"arme","subcategory":"Armes d’attaque au contact","name":"Épée bâtarde","price":"8 pa","description":"Arme à une ou deux mains. Données catalogue : 1d8/1d12 — FOR aux DM ; type : Tranchants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"contact","weaponType":"Arme 2 mains","weaponDmCar":"FOR","weaponDamageType":"tranchant","weaponDmNb":1,"weaponDmDie":8,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["cac","magique"],"affixModeDefault":"cac","baseTags":["sword","slashing","melee","versatile","metal_weapon","magic_focus_candidate"]},{"id":"B011","category":"arme","subcategory":"Armes d’attaque au contact","name":"Épée courte","price":"3 pa","description":"Arme légère. Données catalogue : 1d6 — FOR aux DM ; type : Perforants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"contact","weaponType":"Arme 1 main","weaponDmCar":"FOR","weaponDamageType":"percant","weaponDmNb":1,"weaponDmDie":6,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["cac","magique"],"affixModeDefault":"cac","baseTags":["sword","piercing","light","finesse","melee","metal_weapon","magic_focus_candidate"]},{"id":"B012","category":"arme","subcategory":"Armes d’attaque au contact","name":"Épée longue","price":"5 pa","description":"Arme de contact classique. Données catalogue : 1d8 — FOR aux DM ; type : Tranchants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"contact","weaponType":"Arme 1 main","weaponDmCar":"FOR","weaponDamageType":"tranchant","weaponDmNb":1,"weaponDmDie":8,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["cac","magique"],"affixModeDefault":"cac","baseTags":["sword","slashing","melee","onehand","metal_weapon","magic_focus_candidate"]},{"id":"B013","category":"arme","subcategory":"Armes d’attaque au contact","name":"Épée à deux mains","price":"10 pa","description":"Arme à deux mains. Données catalogue : 2d6 — FOR aux DM ; type : Tranchants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"contact","weaponType":"Arme 2 mains","weaponDmCar":"FOR","weaponDamageType":"tranchant","weaponDmNb":2,"weaponDmDie":6,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["cac","magique"],"affixModeDefault":"cac","baseTags":["sword","slashing","melee","twohand","heavy","metal_weapon","magic_focus_candidate"]},{"id":"B014","category":"arme","subcategory":"Armes d’attaque à distance","name":"Arbalète de poing","price":"6 pa","description":"Portée 10 m. Action de mouvement pour être rechargée. Données catalogue : 1d6 — Aucune carac. aux DM ; type : Perforants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"distance","weaponType":"Arme 1 main","weaponDmCar":"AUCUN","weaponDamageType":"percant","weaponRange":"10 m","weaponDmNb":1,"weaponDmDie":6,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["distance"],"affixModeDefault":"distance","baseTags":["crossbow","projectile","string","distance","onehand"]},{"id":"B015","category":"arme","subcategory":"Armes d’attaque à distance","name":"Arbalète lourde","price":"15 pa","description":"Portée 30 m. Nécessite une action limitée pour être rechargée ; arme tenue à deux mains. Données catalogue : 2d6 — Aucune carac. aux DM ; type : Perforants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"distance","weaponType":"Arme 2 mains","weaponDmCar":"AUCUN","weaponDamageType":"percant","weaponRange":"30 m","weaponDmNb":2,"weaponDmDie":6,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["distance"],"affixModeDefault":"distance","baseTags":["crossbow","projectile","string","distance","twohand","heavy"]},{"id":"B016","category":"arme","subcategory":"Armes d’attaque à distance","name":"Arbalète légère","price":"10 pa","description":"Portée 15 m. Nécessite une action de mouvement pour être rechargée ; arme tenue à deux mains. Données catalogue : 2d4 — Aucune carac. aux DM ; type : Perforants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"distance","weaponType":"Arme 2 mains","weaponDmCar":"AUCUN","weaponDamageType":"percant","weaponRange":"15 m","weaponDmNb":2,"weaponDmDie":4,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["distance"],"affixModeDefault":"distance","baseTags":["crossbow","projectile","string","distance","twohand"]},{"id":"B017","category":"arme","subcategory":"Armes d’attaque à distance","name":"Arc court","price":"4 pa","description":"Portée 15 m. Arme tenue à deux mains. Données catalogue : 1d6 — Aucune carac. aux DM ; type : Perforants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"distance","weaponType":"Arme 2 mains","weaponDmCar":"AUCUN","weaponDamageType":"percant","weaponRange":"15 m","weaponDmNb":1,"weaponDmDie":6,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["distance"],"affixModeDefault":"distance","baseTags":["bow","projectile","string","wood","distance","twohand"]},{"id":"B018","category":"arme","subcategory":"Armes d’attaque à distance","name":"Arc long","price":"6 pa","description":"Portée 30 m. Arme tenue à deux mains ; FOR minimale +1. Données catalogue : 1d8 — Aucune carac. aux DM ; type : Perforants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"distance","weaponType":"Arme 2 mains","weaponDmCar":"AUCUN","weaponDamageType":"percant","weaponRange":"30 m","weaponDmNb":1,"weaponDmDie":8,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["distance"],"affixModeDefault":"distance","baseTags":["bow","projectile","string","wood","distance","twohand","longrange"]},{"id":"B019","category":"arme","subcategory":"Armes d’attaque à distance","name":"Couteaux de lancer","price":"3 pa","description":"Portée 10 m. Données catalogue : 1d4 — Aucune carac. aux DM ; type : Perforants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"distance","weaponType":"Arme de jet","weaponDmCar":"AUCUN","weaponDamageType":"percant","weaponRange":"10 m","weaponDmNb":1,"weaponDmDie":4,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["distance"],"affixModeDefault":"distance","baseTags":["dagger","throwing","piercing","light","distance"]},{"id":"B020","category":"arme","subcategory":"Armes d’attaque à distance","name":"Javelot","price":"1.5 pa","description":"Portée 20 m. Données catalogue : 1d6 — Aucune carac. aux DM ; type : Perforants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"distance","weaponType":"Arme de jet","weaponDmCar":"AUCUN","weaponDamageType":"percant","weaponRange":"20 m","weaponDmNb":1,"weaponDmDie":6,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["distance"],"affixModeDefault":"distance","baseTags":["spear","throwing","piercing","distance"]},{"id":"B021","category":"arme","subcategory":"Armes d’attaque à distance","name":"Mousquet","price":"100 pa","description":"Portée 50 m. Nécessite une action limitée pour être rechargée ; arme tenue à deux mains. Données catalogue : 2d6 — Aucune carac. aux DM ; type : Perforants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"distance","weaponType":"Arme 2 mains","weaponDmCar":"AUCUN","weaponDamageType":"percant","weaponRange":"50 m","weaponModifiers":"poudre","weaponDmNb":2,"weaponDmDie":6,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["distance"],"affixModeDefault":"distance","baseTags":["firearm","projectile","powder","distance","twohand","metal_weapon","longrange"]},{"id":"B022","category":"arme","subcategory":"Armes d’attaque à distance","name":"Pétoire","price":"50 pa","description":"Portée 20 m. Nécessite une action limitée pour être rechargée. Données catalogue : 1d10 — Aucune carac. aux DM ; type : Perforants.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"distance","weaponType":"Arme 1 main","weaponDmCar":"AUCUN","weaponDamageType":"percant","weaponRange":"20 m","weaponModifiers":"poudre","weaponDmNb":1,"weaponDmDie":10,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["distance"],"affixModeDefault":"distance","baseTags":["firearm","projectile","powder","distance","onehand","metal_weapon"]},{"id":"B060","category":"arme","subcategory":"Armes magiques","name":"Sceptre","price":"1 pa","description":"Focus magique à une main. Hypothèse de base : 1d4 contondant ; ces statistiques peuvent être ajustées sur la fiche OBJET si nécessaire.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"contact","weaponType":"Arme 1 main","weaponDmCar":"FOR","weaponDamageType":"contondant","weaponDmNb":1,"weaponDmDie":4,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["magique"],"affixModeDefault":"magique","baseTags":["sceptre","blunt","magic_focus"]},{"id":"B062","category":"arme","subcategory":"Armes magiques","name":"Dague magique","price":"1.5 pa","description":"Dague pouvant servir de focus magique. Profil de base : 1d4 perforant, arme légère à une main.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"contact","weaponType":"Arme 1 main","weaponDmCar":"FOR","weaponDamageType":"percant","weaponDmNb":1,"weaponDmDie":4,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["magique"],"affixModeDefault":"magique","baseTags":["dagger","piercing","light","finesse","melee","magic_focus"]},{"id":"B063","category":"arme","subcategory":"Armes magiques","name":"Épée magique","price":"5 pa","description":"Épée pouvant servir de focus magique. Profil de base : 1d8 tranchant, arme à une main.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Autre","weaponAttack":"contact","weaponType":"Arme 1 main","weaponDmCar":"FOR","weaponDamageType":"tranchant","weaponDmNb":1,"weaponDmDie":8,"weaponCrit":20,"weaponAttackBonus":0,"weaponDmBonus":0,"affixModes":["magique"],"affixModeDefault":"magique","baseTags":["sword","slashing","melee","onehand","metal_weapon","magic_focus"]},{"id":"B023","category":"armure","subcategory":"Armures","name":"Armure de plaques","price":"60 pa","description":"Armure. Données catalogue : +6 — Malus d’armure : +6 à la difficulté des tests d’DEX ; DEX max +2.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Torse","armorBonus":6,"armorMalus":6,"affixModes":["maille"],"affixModeDefault":"maille","baseTags":["armor","plate","heavy_armor","metal_armor"]},{"id":"B024","category":"armure","subcategory":"Armures","name":"Chemise de mailles","price":"15 pa","description":"Armure. Données catalogue : +4 — Malus d’armure : +4 à la difficulté des tests d’DEX ; DEX max +4.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Torse","armorBonus":4,"armorMalus":4,"affixModes":["maille"],"affixModeDefault":"maille","baseTags":["armor","mail","medium_armor","metal_armor"]},{"id":"B025","category":"armure","subcategory":"Armures","name":"Cotte de mailles","price":"25 pa","description":"Armure. Données catalogue : +5 — Malus d’armure : +5 à la difficulté des tests d’DEX ; DEX max +3.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Torse","armorBonus":5,"armorMalus":5,"affixModes":["maille"],"affixModeDefault":"maille","baseTags":["armor","mail","medium_armor","metal_armor"]},{"id":"B026","category":"armure","subcategory":"Armures","name":"Cuir renforcé, broigne","price":"8 pa","description":"Armure. Données catalogue : +3 — Malus d’armure : +3 à la difficulté des tests d’DEX ; DEX max +5.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Torse","armorBonus":3,"armorMalus":3,"affixModes":["cuir"],"affixModeDefault":"cuir","baseTags":["armor","leather","light_armor"]},{"id":"B027","category":"armure","subcategory":"Armures","name":"Cuir simple","price":"4 pa","description":"Armure. Données catalogue : +2 — Malus d’armure : +2 à la difficulté des tests d’DEX ; DEX max +6.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Torse","armorBonus":2,"armorMalus":2,"affixModes":["cuir"],"affixModeDefault":"cuir","baseTags":["armor","leather","light_armor"]},{"id":"B031","category":"armure","subcategory":"Armures","name":"Tissus matelassés, fourrures","price":"2 pa","description":"Armure légère. Données catalogue : +1 — Malus d’armure : +1 à la difficulté des tests d’DEX ; DEX max +7.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Torse","armorBonus":1,"armorMalus":1,"affixModes":["tissu"],"affixModeDefault":"tissu","baseTags":["armor","cloth","light_armor"]},{"id":"B028","category":"armure","subcategory":"Boucliers","name":"Grand bouclier","price":"4 pa","description":"Bouclier. Bonus de DEF. Données catalogue : +2 — Aucun malus d’armure indiqué ; DEX max —.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Bouclier","armorBonus":2,"armorMalus":0,"affixModes":["bouclier","bouclier_magique"],"affixModeDefault":"bouclier","baseTags":["shield","large_shield","metal_armor"]},{"id":"B029","category":"armure","subcategory":"Boucliers","name":"Petit bouclier","price":"2 pa","description":"Bouclier. Bonus de DEF. Données catalogue : +1 — Aucun malus d’armure indiqué ; DEX max —.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Bouclier","armorBonus":1,"armorMalus":0,"affixModes":["bouclier","bouclier_magique"],"affixModeDefault":"bouclier","baseTags":["shield","small_shield"]},{"id":"B032","category":"accessoire","subcategory":"Anneau","name":"Anneau / bague","price":"5 pa","description":"Support d’accessoire extrait du catalogue magique.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Anneau","armorBonus":0,"armorMalus":0,"affixModes":["accessoire_anneau"],"affixModeDefault":"accessoire_anneau","baseTags":[]},{"id":"B033","category":"accessoire","subcategory":"Ceinture","name":"Ceinture / baudrier","price":"0.2 pa","description":"Support d’accessoire extrait du catalogue magique.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Ceinture","armorBonus":0,"armorMalus":0,"affixModes":["accessoire_ceinture"],"affixModeDefault":"accessoire_ceinture","baseTags":[]},{"id":"B034","category":"accessoire","subcategory":"Cou","name":"Collier / amulette","price":"8 pa","description":"Support d’accessoire extrait du catalogue magique.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Cou","armorBonus":0,"armorMalus":0,"affixModes":["accessoire_cou"],"affixModeDefault":"accessoire_cou","baseTags":[]},{"id":"B035","category":"accessoire","subcategory":"Dos","name":"Cape / manteau","price":"0.3 pa","description":"Support d’accessoire extrait du catalogue magique.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Dos","armorBonus":0,"armorMalus":0,"affixModes":["accessoire_dos"],"affixModeDefault":"accessoire_dos","baseTags":[]},{"id":"B036","category":"accessoire","subcategory":"Gants","name":"Gants / gantelets","price":"0.2 pa","description":"Support d’accessoire extrait du catalogue magique.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Gants","armorBonus":0,"armorMalus":0,"affixModes":["accessoire_gants"],"affixModeDefault":"accessoire_gants","baseTags":[]},{"id":"B037","category":"accessoire","subcategory":"Pieds","name":"Bottes / sandales / chausses","price":"0.4 pa","description":"Support d’accessoire extrait du catalogue magique.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Pieds","armorBonus":0,"armorMalus":0,"affixModes":["accessoire_pieds"],"affixModeDefault":"accessoire_pieds","baseTags":[]},{"id":"B038","category":"accessoire","subcategory":"Tête","name":"Casque / coiffe / diadème / couronne / serre-tête","price":"2 pa","description":"Support d’accessoire extrait du catalogue magique.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Casque","armorBonus":0,"armorMalus":0,"affixModes":["accessoire_tete"],"affixModeDefault":"accessoire_tete","baseTags":[]},{"id":"B061","category":"accessoire","subcategory":"Main gauche","name":"Focus / objet de main gauche","price":"0.5 pa","description":"Objet tenu en main gauche servant de focus magique. Aucun bonus intrinsèque.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"Main gauche","armorBonus":0,"armorMalus":0,"affixModes":["main_gauche_magique"],"affixModeDefault":"main_gauche_magique","baseTags":["focus_left","magic_focus"]},{"id":"B039","category":"consommable","subcategory":"Fiole / dose","name":"Poison","price":"Voir Consommables","description":"Inflige 1d4 DM variables. Test de CON : mineur 15, virulent 10, mortel 5. toxique de contact ou appliqué sur une arme.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"","consumableContext":"Poison de contact ou appliqué sur une arme. DD CON : mineur 15 ; virulent 10 ; mortel 5.","consumableEffectText":"Inflige 1d4 DM variables. DD fixés selon virulence : 15 / 10 / 5.","affixModes":["consommable"],"affixModeDefault":"consommable","baseTags":[]},{"id":"B040","category":"consommable","subcategory":"Fiole / potion","name":"Potion de caractéristique temporaire","price":"Voir Consommables","description":"Bonus temporaire de +1 à une caractéristique. La caractéristique et la durée dépendent de la variante choisie.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"","consumableEffectText":"Bonus temporaire de +1 à une caractéristique. La caractéristique et la durée dépendent de la variante choisie.","affixModes":["consommable"],"affixModeDefault":"consommable","baseTags":[]},{"id":"B041","category":"consommable","subcategory":"Fiole / potion","name":"Potion de célérité","price":"Voir Consommables","description":"+1 action par tour pendant 2 tours.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"","consumableCommand":"!cof-effet-temp hate 2","consumableEffectText":"+1 action par tour pendant 2 tours.","affixModes":["consommable"],"affixModeDefault":"consommable","baseTags":[]},{"id":"B042","category":"consommable","subcategory":"Fiole / potion","name":"Potion de mana","price":"Voir Consommables","description":"Rend 1d4 + niveau points de mana.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"","consumableCommand":"!cof-recupere-mana 1d4+@{selected|niveau}","consumableEffectText":"Rend 1d4 + niveau points de mana.","affixModes":["consommable"],"affixModeDefault":"consommable","baseTags":[]},{"id":"B043","category":"consommable","subcategory":"Fiole / potion","name":"Potion de résistance magique","price":"Voir Consommables","description":"Confère une résistance magique : bonus de RD magique +4 (effet à gérer selon la variante/règle retenue).","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"","consumableEffectText":"Confère une résistance magique : bonus de RD magique +4 (effet à gérer selon la variante/règle retenue).","affixModes":["consommable"],"affixModeDefault":"consommable","baseTags":[]},{"id":"B044","category":"consommable","subcategory":"Fiole / potion","name":"Potion de résistance physique","price":"Voir Consommables","description":"Confère une résistance physique : bonus de RD physique +4 (effet à gérer selon la variante/règle retenue).","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"","consumableEffectText":"Confère une résistance physique : bonus de RD physique +4 (effet à gérer selon la variante/règle retenue).","affixModes":["consommable"],"affixModeDefault":"consommable","baseTags":[]},{"id":"B045","category":"consommable","subcategory":"Fiole / potion","name":"Potion de soins","price":"Voir Consommables","description":"Rend 1d4 + niveau PV. Une seule potion par récupération rapide.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"","consumableContext":"Une seule potion par récupération rapide.","consumableCommand":"!cof-soin 1d4+@{selected|niveau}","consumableEffectText":"Rend 1d4 + niveau PV.","affixModes":["consommable"],"affixModeDefault":"consommable","baseTags":[]},{"id":"B046","category":"consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade","price":"Voir Consommables","description":"Inflige 2d4 DM variables. Portée 10 m, zone de 4 m de diamètre (rayon 2 m).","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"","consumableContext":"Portée 10 m, diamètre 4 m, rayon technique 2 m.","consumableEffectText":"Inflige 2d4 DM variables dans une zone de 4 m de diamètre.","affixModes":["consommable"],"affixModeDefault":"consommable","baseTags":[]},{"id":"B047","category":"consommable","subcategory":"Parchemin","name":"Parchemin de capacité","price":"Voir Consommables","description":"Permet d’utiliser une capacité ou un sort selon le rang du parchemin. Le parchemin est consommé après usage.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"","consumableContext":"Le parchemin est consommé après usage.","consumableEffectText":"Permet d’utiliser une capacité ou un sort selon le rang du parchemin.","affixModes":["consommable"],"affixModeDefault":"consommable","baseTags":[]},{"id":"B066","category":"consommable","subcategory":"Parchemin","name":"Parchemin de stabilisation","price":"150 pa","description":"Stabilise immédiatement un PJ en blessure maligne. Le personnage reste au sol jusqu’à la fin du combat.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"","consumableCommand":"!cof-stabiliser-blessure","consumableEffectText":"Stabilise immédiatement un PJ en blessure maligne. Le personnage reste au sol jusqu’à la fin du combat.","consumableContext":"À partir de la 2e chute. Usage unique.","affixModes":["consommable"],"affixModeDefault":"consommable","baseTags":[]},{"id":"B057","category":"consommable","subcategory":"Provision","name":"Ration","price":"0.04 pa","description":"Ration de voyage pour une personne. Utilisée automatiquement lors d’un repos avec nourriture.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"","consumableContext":"Consommée automatiquement par le système de repos.","consumableEffectText":"Provision pour un repos nourri.","affixModes":["consommable"],"affixModeDefault":"consommable","baseTags":[]},{"id":"B048","category":"divers","subcategory":"Matériel","name":"Briquet à silex","price":"0.05 pa","description":"Objet de base issu de la liste d’équipement.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"","affixModes":["divers"],"affixModeDefault":"divers","baseTags":[]},{"id":"B049","category":"divers","subcategory":"Matériel","name":"Carquois de 20 flèches","price":"0.2 pa","description":"Objet de base issu de la liste d’équipement.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"","affixModes":["divers"],"affixModeDefault":"divers","baseTags":[]},{"id":"B050","category":"divers","subcategory":"Matériel","name":"Corde 15 m","price":"0.1 pa","description":"Objet de base issu de la liste d’équipement.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"","affixModes":["divers"],"affixModeDefault":"divers","baseTags":[]},{"id":"B051","category":"divers","subcategory":"Matériel","name":"Couverture","price":"0.08 pa","description":"Objet de base issu de la liste d’équipement.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"","affixModes":["divers"],"affixModeDefault":"divers","baseTags":[]},{"id":"B052","category":"divers","subcategory":"Matériel","name":"Grappin","price":"0.15 pa","description":"Objet de base issu de la liste d’équipement.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"","affixModes":["divers"],"affixModeDefault":"divers","baseTags":[]},{"id":"B053","category":"divers","subcategory":"Matériel","name":"Huile pour lanterne","price":"0.02 pa","description":"Une dose permet à une lanterne d’éclairer 6 h dans un rayon de 10 m.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"","affixModes":["divers"],"affixModeDefault":"divers","baseTags":[]},{"id":"B054","category":"divers","subcategory":"Matériel","name":"Lanterne à huile","price":"0.15 pa","description":"Éclaire dans un rayon de 10 m ; 1 h pour une torche, 6 h pour une lanterne avec 1 dose d’huile.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"","affixModes":["divers"],"affixModeDefault":"divers","baseTags":[]},{"id":"B055","category":"divers","subcategory":"Matériel","name":"Matériel d’écriture","price":"0.15 pa","description":"Objet de base issu de la liste d’équipement.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"","affixModes":["divers"],"affixModeDefault":"divers","baseTags":[]},{"id":"B056","category":"divers","subcategory":"Matériel","name":"Outils de crochetage","price":"0.5 pa","description":"Sans ces outils, pénalité de -10 aux tests d’AGI (Crocheter).","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"","affixModes":["divers"],"affixModeDefault":"divers","baseTags":[]},{"id":"B058","category":"divers","subcategory":"Matériel","name":"Sac à dos","price":"0.1 pa","description":"Objet de base issu de la liste d’équipement.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"","affixModes":["divers"],"affixModeDefault":"divers","baseTags":[]},{"id":"B059","category":"divers","subcategory":"Matériel","name":"Torches (x3)","price":"0.02 pa","description":"Éclaire dans un rayon de 10 m ; 1 h pour une torche, 6 h pour une lanterne avec 1 dose d’huile.","source":"Catalogue_objets_magiques_complet_avec_stabilisation_B066.xlsx","slot":"","affixModes":["divers"],"affixModeDefault":"divers","baseTags":[]}];
var AFFIXES=[{"id":"A001","category":"Armes","subcategory":"Armes de mêlée","name":"Affûté","power":1,"effect":"+1 à la plage de critique.","rp":"Le fil semble toujours fraîchement aiguisé et cherche naturellement les ouvertures.","example":"affûtée","support":"Arme | Base","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--bonusCritique 1","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Utilise nativement --bonusCritique 1. Les +1d6 DM sur critique sont séparés dans A470.","uiFamily":"critique","compatProfile":"CAC","catalogVisible":true,"requiredTagsAny":["sword","dagger","rapier"],"displayName":"Affûté","uiGroup":"critique_tranchant_1","uiTierLabel":"+1 plage de critique","crossWeaponMode":true},{"id":"A002","category":"Armes","subcategory":"Armes de mêlée","name":"de parade","power":1,"effect":"+1 DEF tant que l’arme est tenue en main.","rp":"Garde large, hampe renforcée ou contrepoids pensé pour détourner les coups.","example":"de parade","support":"Arme | Base","rarity":"","status":"Prédicat direct","mechanism":"Prédicat équipé/tenu","predicates":"bonus_DEF:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Bonus de DEF actif uniquement quand l'objet est équipé/tenu.","uiFamily":"defense","compatProfile":"CAC","catalogVisible":true,"displayName":"Gardienne","uiGroup":"garde_arme","uiTierLabel":"+1 DEF tant que l’arme est tenue en main.","requiredTagsAny":["sword","rapier","staff","spear"],"crossWeaponMode":false},{"id":"A003","category":"Armes","subcategory":"Armes de mêlée","name":"de précision","power":1,"effect":"+1 en attaque avec cette arme.","rp":"Arme très bien équilibrée, poignée ajustée, ligne de frappe nette.","example":"équilibrée","support":"Arme | Base","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--bonusAttaque 1","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Bonus local à cette arme.","uiFamily":"combat","compatProfile":"CAC","catalogVisible":true,"displayName":"Équilibrée","uiTierLabel":"","requiredTagsAny":["dagger","rapier","sword","spear"],"crossWeaponMode":false},{"id":"A004","category":"Armes","subcategory":"Armes de mêlée","name":"du \"Classe\" Novice","power":1,"effect":"Capacité de Classe Rang 1","rp":"Arme d’initiation marquée du symbole d’une école, d’un ordre ou d’un mentor.","example":"d’héritage héroïque","support":"Arme | classe/profil choisi | Bonus de classe","rarity":"","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"CAC","catalogVisible":false,"displayName":"Héritage de classe","uiGroup":"heritage_classe_cac","uiTierLabel":"Rang 1"},{"id":"A005","category":"Armes","subcategory":"Armes de mêlée","name":"en cornaline brute","power":1,"effect":"+1 attaque, +1d6 DM contre les bêtes.","rp":"Incrustations rouge-orangé issues d’une pierre dense, polie avec des graisses de chasse.","example":"en cornaline brute","support":"Arme | Anti-bêtes","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible bete --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_PARAMETRE","actionObjects":"NON","undo":"AUCUN","params":"Cible avec Race/prédicat inconnue","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"CAC","catalogVisible":true,"displayName":"Cornaline brute","uiTierLabel":"Anti-bêtes","uiGroup":"anti_bete"},{"id":"A006","category":"Armes","subcategory":"Armes de mêlée","name":"traitée au soufre blanc","power":1,"effect":"+1 attaque, +1d6 DM contre les vermines.","rp":"Traitement minéral pâle et âcre, fixé sur le fil ou les pointes.","example":"traitée au soufre blanc","support":"Arme | Anti-vermines","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible vermine --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"CAC","catalogVisible":true,"displayName":"Soufre blanc","uiTierLabel":"Anti-vermines","uiGroup":"anti_vermine"},{"id":"A007","category":"Armes","subcategory":"Armes de mêlée","name":"en argent alchimique","power":1,"effect":"+1 attaque, +1d6 DM contre les mort-vivants.","rp":"Argent pâle injecté dans le métal, souvent gravé de prières funéraires.","example":"en argent alchimique","support":"Arme | Anti-mort-vivants","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible mort-vivant --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"CAC","catalogVisible":true,"displayName":"Argent alchimique","uiTierLabel":"Anti-mort-vivants","uiGroup":"anti_mort-vivant"},{"id":"A008","category":"Armes","subcategory":"Armes de mêlée","name":"en hématite rouge","power":1,"effect":"+1 attaque, +1d6 DM contre les humanoïdes.","rp":"Poudre d’hématite rouge sertie dans les gravures et durcie par traitement alchimique.","example":"en hématite rouge","support":"Arme | Anti-humanoïdes","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible humanoide --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_PARAMETRE","actionObjects":"NON","undo":"AUCUN","params":"Cible avec Race/prédicat humanoide","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"CAC","catalogVisible":true,"displayName":"Hématite rouge","uiTierLabel":"Anti-humanoïdes","uiGroup":"anti_humanoide"},{"id":"A009","category":"Armes","subcategory":"Armes de mêlée","name":"en corail noir","power":1,"effect":"+1 attaque, +1d6 DM contre les créatures aquatiques.","rp":"Fragments de corail noir minéralisé, polis puis sertis sur les zones de frappe.","example":"en corail noir","support":"Arme | Anti-créatures aquatiques","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible aquatique --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"CAC","catalogVisible":true,"displayName":"Corail noir","uiTierLabel":"Anti-créatures aquatiques","uiGroup":"anti_aquatique"},{"id":"A010","category":"Armes","subcategory":"Armes de mêlée","name":"en dracacier","power":1,"effect":"+1 attaque, +1d6 DM contre les dragons.","rp":"Acier mêlé de poudre d’écaille, d’os ou de sang draconique fossilisé.","example":"en dracacier","support":"Arme | Anti-dragons","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible dragon --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"CAC","catalogVisible":true,"displayName":"Dracacier","uiTierLabel":"Anti-dragons","uiGroup":"anti_dragon"},{"id":"A011","category":"Armes","subcategory":"Armes de mêlée","name":"en fer froid","power":1,"effect":"+1 attaque, +1d6 DM contre les démons.","rp":"Métal gris bleuté, froid au toucher, forgé sans flamme vive.","example":"en fer froid","support":"Arme | Anti-démons","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible demon --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"CAC","catalogVisible":true,"displayName":"Fer froid","uiTierLabel":"Anti-démons","uiGroup":"anti_demon"},{"id":"A012","category":"Armes","subcategory":"Armes de mêlée","name":"en laënk","power":1,"effect":"Éclaire sur 10 m ; aucune affinité de dégâts.","rp":"Métal lumineux, blanc ou doré pâle, impossible à ternir.","example":"en laënk","support":"Arme | Éclairage","rarity":"","status":"Prédicat direct","mechanism":"Prédicat arme","predicates":"eclaire:10","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"eclaire:10","note":"Laënk : éclairage uniquement. Aucune affinité ni propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":true,"displayName":"Laënk solaire","uiGroup":"laenk","uiTierLabel":"Éclaire comme une lanterne puissante. Annule les ténèbres naturelles dans la zone éclairée."},{"id":"A013","category":"Armes","subcategory":"Armes de mêlée","name":"en magnétite vive","power":1,"effect":"+1 attaque, +1d6 DM contre les créatures artificielles.","rp":"Inclusions noires qui vibrent près des mécanismes, golems et structures animées.","example":"en magnétite vive","support":"Arme | Anti-créatures artificielles","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible artificiel --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_PARAMETRE","actionObjects":"NON","undo":"AUCUN","params":"Cible avec Race/prédicat mecanique","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"CAC","catalogVisible":true,"displayName":"Magnétite vive","uiTierLabel":"Anti-créatures artificielles","uiGroup":"anti_artificiel"},{"id":"A014","category":"Armes","subcategory":"Armes de mêlée","name":"traitée à la poussière d’argent froid","power":1,"effect":"+1 attaque, +1d6 DM contre les fées.","rp":"Poussière argentée fixée dans le métal par une trempe froide.","example":"traitée à la poussière d’argent froid","support":"Arme | Anti-fées","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible fee --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"CAC","catalogVisible":true,"displayName":"Poussière d’argent froid","uiTierLabel":"Anti-fées","uiGroup":"anti_fee"},{"id":"A015","category":"Armes","subcategory":"Armes de mêlée","name":"traitée à la sève noire","power":1,"effect":"+1 attaque, +1d6 DM contre les plantes.","rp":"Traitement sombre et résineux qui dessèche les fibres végétales.","example":"traitée à la sève noire","support":"Arme | Anti-plantes","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible plante --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_PARAMETRE","actionObjects":"NON","undo":"AUCUN","params":"Cible avec Race/prédicat plante","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"CAC","catalogVisible":true,"displayName":"Sève noire","uiTierLabel":"Anti-plantes","uiGroup":"anti_plante"},{"id":"A016","category":"Armes","subcategory":"Armes de mêlée","name":"en osmium noir","power":1,"effect":"+1 attaque, +1d6 DM contre les géants.","rp":"Métal extrêmement dense, utilisé en inserts sur les zones d’impact.","example":"en osmium noir","support":"Arme | Anti-géants","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible geant --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"CAC","catalogVisible":true,"displayName":"Osmium noir","uiTierLabel":"Anti-géants","uiGroup":"anti_geant"},{"id":"A017","category":"Armes","subcategory":"Armes de mêlée","name":"en verre astral","power":1,"effect":"+1 attaque, +1d6 DM contre les élémentaires.","rp":"Fragments translucides pris dans le métal, reflétant des couleurs impossibles.","example":"en verre astral","support":"Arme | Anti-élémentaires","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible elementaire --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_PARAMETRE","actionObjects":"NON","undo":"AUCUN","params":"Cible avec Race/prédicat elementaire","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"CAC","catalogVisible":true,"displayName":"Verre astral","uiTierLabel":"Anti-élémentaires","uiGroup":"anti_elementaire"},{"id":"A018","category":"Armes","subcategory":"Armes de mêlée","name":"en verre torsadé","power":1,"effect":"+1 attaque, +1d6 DM contre les aberrations.","rp":"Verre aux couches vrillées, dont les reflets semblent changer lorsque l’angle de vue se déplace.","example":"en verre torsadé","support":"Arme | Anti-aberrations","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible aberration --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_PARAMETRE","actionObjects":"NON","undo":"AUCUN","params":"Cible avec Race/prédicat aberration","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"CAC","catalogVisible":true,"displayName":"Verre torsadé","uiTierLabel":"Anti-aberrations","uiGroup":"anti_aberration"},{"id":"A019","category":"Armes","subcategory":"Armes de mêlée","name":"de Finesse","power":2,"effect":"Le porteur peut utiliser son mod. de DEX à la place de son mod. de FOR comme Carac. de dommage avec cette arme.","rp":"Cette arme semble répondre au moindre mouvement du poignet. Entre les mains d’un combattant agile, elle glisse entre les défenses et touche exactement là où cela fait mal.","example":"de finesse","support":"Arme","rarity":"","status":"Champ arme","mechanism":"Carac. dégâts","predicates":"","weaponOptions":"","fieldPatch":"armedmcar=DEX","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"À l'application de l'affixe, la carac. de dégâts passe à DEX.","uiFamily":"combat","compatProfile":"CAC","catalogVisible":true,"requiredTagsAny":["dagger","rapier","sword"],"displayName":"Finesse","uiTierLabel":"","crossWeaponMode":false},{"id":"A020","category":"Armes","subcategory":"Armes de mêlée","name":"de parade supérieure","power":2,"effect":"+2 DEF tant que l’arme est tenue en main.","rp":"Arme conçue pour le duel défensif, capable d’intercepter les attaques avec facilité.","example":"de parade supérieure","support":"Arme | Base","rarity":"","status":"Prédicat direct","mechanism":"Prédicat équipé/tenu","predicates":"bonus_DEF:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Bonus de DEF actif uniquement quand l'objet est équipé/tenu.","uiFamily":"defense","compatProfile":"CAC","catalogVisible":true,"displayName":"Gardienne","uiGroup":"garde_arme","uiTierLabel":"+2 DEF tant que l’arme est tenue en main.","requiredTagsAny":["sword","rapier","staff","spear"],"crossWeaponMode":false},{"id":"A021","category":"Armes","subcategory":"Armes de mêlée","name":"du \"Classe\" Adepte","power":2,"effect":"Capacité de Classe Rang 2","rp":"Arme remise à ceux qui ont dépassé les bases de leur art.","example":"d’héritage héroïque","support":"Arme | classe/profil choisi | Bonus de classe","rarity":"","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"CAC","catalogVisible":false,"displayName":"Héritage de classe","uiGroup":"heritage_classe_cac","uiTierLabel":"Rang 2"},{"id":"A022","category":"Armes","subcategory":"Armes de mêlée","name":"en adamantium","power":2,"effect":"Ignore 2 points de RD. +2 aux tests pour briser objets, armes, boucliers ou portes.","rp":"Métal gris sombre, presque indestructible, au fil dur et sans élégance.","example":"en adamantium","support":"Arme | Matériau spécial","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--ignoreRD 2","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le bonus de casse d'objet reste descriptif ; l'ignore RD est automatisé.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":true,"displayName":"Adamantium","uiGroup":"adamantium_cac","uiTierLabel":"Ignore 2 points de RD. +2 aux tests pour briser objets, armes, boucliers ou portes."},{"id":"A023","category":"Armes","subcategory":"Armes de mêlée","name":"en arcanite","power":2,"effect":"+1d4 DM d’affinité Force.","rp":"Cristal métallique parcouru de lignes lumineuses qui condensent la magie brute.","example":"en arcanite","support":"Arme | Affinité Force","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d4 --force","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Force. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":true,"displayName":"Arcanite","uiGroup":"affinite_force_cac","uiTierLabel":"+1d4 Force","damageType":"force"},{"id":"A024","category":"Armes","subcategory":"Armes de mêlée","name":"en durium","power":2,"effect":"-1 attaque, mais le dé de DM augmente d’une catégorie. Arme quasi indestructible.","rp":"Métal bleu sombre, très lourd, brutal, fait pour frapper comme une enclume.","example":"en durium","support":"Arme | Matériau spécial","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--bonusAttaque -1 --puissant","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"--bonusAttaque -1 --puissant.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":true,"displayName":"en durium","uiTierLabel":""},{"id":"A025","category":"Armes","subcategory":"Armes de mêlée","name":"en fulgurium","power":2,"effect":"+1d4 DM d’affinité Air.","rp":"Veines bleutées dans le métal ; l’air crépite autour du fil.","example":"en fulgurium","support":"Arme | Affinité Air","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d4 --air","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Air. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":true,"displayName":"Fulgurium","uiGroup":"affinite_air_cac","uiTierLabel":"+1d4 Air","damageType":"air"},{"id":"A026","category":"Armes","subcategory":"Armes de mêlée","name":"en hybberium","power":2,"effect":"+1d4 DM d’affinité Eau.","rp":"Métal pâle couvert d’une buée froide, lié aux courants du plan de l’Eau.","example":"en hybberium","support":"Arme | Affinité Eau","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d4 --eau","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Eau. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":true,"displayName":"Hybberium","uiGroup":"affinite_eau_cac","uiTierLabel":"+1d4 Eau","damageType":"eau"},{"id":"A027","category":"Armes","subcategory":"Armes de mêlée","name":"en laënk supérieur","power":2,"effect":"Éclaire sur 20 m ; aucune affinité de dégâts.","rp":"La lumière du métal est intense, blanche ou dorée, et reste stable même dans les ténèbres.","example":"en laënk supérieur","support":"Arme | Éclairage","rarity":"","status":"Prédicat + option d'arme","mechanism":"Prédicat arme","predicates":"eclaire:20","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Laënk : éclairage uniquement. Aucune affinité ni propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":true,"displayName":"Laënk solaire","uiGroup":"laenk","uiTierLabel":"Éclaire fortement et ajoute +1 DM radiant aux attaques portées avec cette arme."},{"id":"A028","category":"Armes","subcategory":"Armes de mêlée","name":"en malachium","power":1,"effect":"+1 attaque, +1d6 DM contre les célestes.","rp":"Alliage vert sombre dont la structure perturbe les essences célestes sans conférer d’autre propriété.","example":"en malachium","support":"Arme | Anti-célestes","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible celeste --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"CAC","catalogVisible":true,"displayName":"Malachium","uiGroup":"anti_celeste","uiTierLabel":"Anti-célestes"},{"id":"A029","category":"Armes","subcategory":"Armes de mêlée","name":"en mithral","power":2,"effect":"+2 m de déplacement, +2 initiative.","rp":"Métal clair, léger, presque argenté. L’arme semble accompagner le geste.","example":"en mithral","support":"Arme | Matériau spécial","rarity":"","status":"Prédicat étendu","mechanism":"Patch COFantasy + feuille","predicates":"bonusInitiative:2\nbonusMouvement:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Initiative gérée par le patch Mod ; mouvement affiché par le sheetworker.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":true,"displayName":"Mithral","uiGroup":"mithral_cac","uiTierLabel":"+2 m de déplacement, +2 initiative."},{"id":"A030","category":"Armes","subcategory":"Armes de mêlée","name":"en phospharium","power":2,"effect":"+1d4 DM d’affinité Feu.","rp":"Métal orangé, tiède au repos, dont les gravures rougissent au combat.","example":"en phospharium","support":"Arme | Affinité Feu","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d4 --feu","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Feu. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":true,"displayName":"Phospharium","uiGroup":"affinite_feu_cac","uiTierLabel":"+1d4 Feu","damageType":"feu"},{"id":"A031","category":"Armes","subcategory":"Armes de mêlée","name":"en tellurite","power":2,"effect":"+1d4 DM d’affinité Terre.","rp":"Minéral métallique brun et cristallin, lourd malgré sa faible épaisseur.","example":"en tellurite","support":"Arme | Affinité Terre","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d4 --terre","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Terre. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":true,"displayName":"Tellurite","uiGroup":"affinite_terre_cac","uiTierLabel":"+1d4 Terre","damageType":"terre"},{"id":"A032","category":"Armes","subcategory":"Armes de mêlée","name":"en sombracier","power":2,"effect":"+1d4 DM d’affinité Ombre.","rp":"Acier noir profond qui absorbe les reflets et semble refroidir la lumière.","example":"en sombracier","support":"Arme | Affinité Ombre","rarity":"","status":"Option d'arme + hook d'attaque","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d4 --ombre","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"EVT_COF_ATTAQUE","params":"Soin 1 PV ; cible vivante = !estNonVivant(cible) ; max 1 fois/round ; ressource par arme","note":"Affinité uniquement : Ombre. L’ancien soin du Sombracier n’est plus utilisé par le catalogue courant.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":true,"displayName":"Sombracier","uiGroup":"affinite_ombre_cac","uiTierLabel":"+1d4 Ombre","damageType":"ombre"},{"id":"A033","category":"Armes","subcategory":"Armes de mêlée","name":"en venimite","power":2,"effect":"+1d4 DM de poison.","rp":"Métal sombre aux reflets verdâtres, souvent rainuré pour retenir les toxines.","example":"en venimite","support":"Arme | poison | Métal de dégâts","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d4 --toxique","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Options d'attaque COFantasy. Type du bonus appliqué après --plus pour ne pas remplacer le type principal de l’arme. Ancienne entrée conservée hors catalogue pour compatibilité historique.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":false,"displayName":"Venimite","uiGroup":"venimite_cac","uiTierLabel":"+1d4 DM de poison.","damageType":"toxique"},{"id":"A034","category":"Armes","subcategory":"Armes de mêlée","name":"en héliolite","power":2,"effect":"+1d4 DM d’affinité Lumière.","rp":"Cristal doré enchâssé dans le métal, diffusant une clarté chaude sans éclairer comme une lanterne.","example":"en héliolite","support":"Arme | Affinité Lumière","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d4 --lumiere","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Lumière. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":true,"displayName":"Héliolite","uiGroup":"affinite_lumiere_cac","uiTierLabel":"+1d4 Lumière","damageType":"lumiere"},{"id":"A035","category":"Armes","subcategory":"Armes de mêlée","name":"de double chasse","power":2,"effect":"+1 attaque, +1d6 DM contre deux types de créatures cohérents.","rp":"Arme traitée avec deux substances compatibles, souvent rare et coûteuse.","example":"de double chasse","support":"Arme | deux types cohérents | Anti-créature","rarity":"","status":"Option d'arme configurable","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible {TYPE1} --bonusAttaque 1 --plus 1d6 --else --if typeCible {TYPE2} --bonusAttaque 1 --plus 1d6 --endif --endif","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"COF_EXISTANT_PARAMETRE","actionObjects":"NON","undo":"AUCUN","params":"TYPE1 ; TYPE2 (Race/prédicats)","note":"À renseigner à la création de l'objet : TYPE1 et TYPE2. Le else évite le cumul si la cible correspond aux deux types.","uiFamily":"anti_creature","compatProfile":"CAC","catalogVisible":true,"displayName":"Double chasse","uiTierLabel":""},{"id":"A036","category":"Armes","subcategory":"Armes de mêlée","name":"du \"Classe\" Vétéran","power":3,"effect":"Capacité de Classe Rang 3","rp":"Arme ayant connu de vrais combats, gravée de marques de victoire.","example":"d’héritage héroïque","support":"Arme | classe/profil choisi | Bonus de classe","rarity":"","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"CAC","catalogVisible":false,"displayName":"Héritage de classe","uiGroup":"heritage_classe_cac","uiTierLabel":"Rang 3"},{"id":"A037","category":"Armes","subcategory":"Armes de mêlée","name":"en adamantium supérieur","power":3,"effect":"Ignore 4 points de RD. +4 aux tests pour briser objets, armes, boucliers ou portes.","rp":"Adamantium pur, utilisé pour les armes capables d’ouvrir les protections les plus solides.","example":"en adamantium supérieur","support":"Arme | Matériau spécial","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--ignoreRD 4","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le bonus de casse d'objet reste descriptif ; l'ignore RD est automatisé.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":true,"displayName":"Adamantium","uiGroup":"adamantium_cac","uiTierLabel":"Ignore 4 points de RD. +4 aux tests pour briser objets, armes, boucliers ou portes."},{"id":"A038","category":"Armes","subcategory":"Armes de mêlée","name":"en arcanite pure","power":3,"effect":"+1d6 DM d’affinité Force.","rp":"Arcanite pure dont les nervures vibrent au voisinage des sortilèges.","example":"en arcanite pure","support":"Arme | Affinité Force","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d6 --force","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Force. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":true,"displayName":"Arcanite","uiGroup":"affinite_force_cac","uiTierLabel":"+1d6 Force","damageType":"force"},{"id":"A039","category":"Armes","subcategory":"Armes de mêlée","name":"en fulgurium chargé","power":3,"effect":"+1d6 DM d’affinité Air.","rp":"Fulgurium chargé qui ionise l’air autour de l’arme.","example":"en fulgurium chargé","support":"Arme | Affinité Air","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d6 --air","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Air. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":true,"displayName":"Fulgurium","uiGroup":"affinite_air_cac","uiTierLabel":"+1d6 Air","damageType":"air"},{"id":"A040","category":"Armes","subcategory":"Armes de mêlée","name":"en hybberium pur","power":3,"effect":"+1d6 DM d’affinité Eau.","rp":"Hybberium pur, froid et humide au toucher même près d’un brasier.","example":"en hybberium pur","support":"Arme | Affinité Eau","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d6 --eau","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Eau. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":true,"displayName":"Hybberium","uiGroup":"affinite_eau_cac","uiTierLabel":"+1d6 Eau","damageType":"eau"},{"id":"A041","category":"Armes","subcategory":"Armes de mêlée","name":"en malachium corrompu","power":3,"effect":"+1d6 DM de maladie.","rp":"Des veines verdâtres parcourent le métal comme une infection.","example":"en malachium corrompu","support":"Arme | maladie | Métal de dégâts","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d6 --toxique","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Options d'attaque COFantasy. Type du bonus appliqué après --plus pour ne pas remplacer le type principal de l’arme. Ancienne entrée conservée hors catalogue pour compatibilité historique.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":false,"displayName":"Malachium","uiGroup":"malachium_cac","uiTierLabel":"+1d6 DM de maladie.","damageType":"toxique"},{"id":"A042","category":"Armes","subcategory":"Armes de mêlée","name":"en mithral supérieur","power":3,"effect":"+4 m de déplacement, +4 initiative.","rp":"Mithral très pur, utilisé par les duellistes, éclaireurs et combattants rapides.","example":"en mithral supérieur","support":"Arme | Matériau spécial","rarity":"","status":"Prédicat étendu","mechanism":"Patch COFantasy + feuille","predicates":"bonusInitiative:4\nbonusMouvement:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Initiative gérée par le patch Mod ; mouvement affiché par le sheetworker.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":true,"displayName":"Mithral","uiGroup":"mithral_cac","uiTierLabel":"+4 m de déplacement, +4 initiative."},{"id":"A043","category":"Armes","subcategory":"Armes de mêlée","name":"en phospharium pur","power":3,"effect":"+1d6 DM d’affinité Feu.","rp":"Phospharium pur qui rougeoie même dans l’obscurité.","example":"en phospharium pur","support":"Arme | Affinité Feu","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d6 --feu","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Feu. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":true,"displayName":"Phospharium","uiGroup":"affinite_feu_cac","uiTierLabel":"+1d6 Feu","damageType":"feu"},{"id":"A044","category":"Armes","subcategory":"Armes de mêlée","name":"en tellurite dense","power":3,"effect":"+1d6 DM d’affinité Terre.","rp":"Tellurite dense parcourue de veines minérales qui vibrent contre la pierre.","example":"en tellurite dense","support":"Arme | Affinité Terre","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d6 --terre","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Terre. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":true,"displayName":"Tellurite","uiGroup":"affinite_terre_cac","uiTierLabel":"+1d6 Terre","damageType":"terre"},{"id":"A045","category":"Armes","subcategory":"Armes de mêlée","name":"en sombracier supérieur","power":3,"effect":"+1d6 DM d’affinité Ombre.","rp":"Sombracier supérieur, mat et silencieux, dont le fil paraît découper les ombres.","example":"en sombracier supérieur","support":"Arme | Affinité Ombre","rarity":"","status":"Option d'arme + hook d'attaque","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d6 --ombre","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"EVT_COF_ATTAQUE","params":"Soin 2 PV ; cible vivante = !estNonVivant(cible) ; max 1 fois/round ; ressource par arme","note":"Affinité uniquement : Ombre. L’ancien soin du Sombracier n’est plus utilisé par le catalogue courant.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":true,"displayName":"Sombracier","uiGroup":"affinite_ombre_cac","uiTierLabel":"+1d6 Ombre","damageType":"ombre"},{"id":"A046","category":"Armes","subcategory":"Armes de mêlée","name":"en venimite noire","power":3,"effect":"+1d6 DM de poison.","rp":"Le métal paraît huileux, et les animaux évitent instinctivement l’arme.","example":"en venimite noire","support":"Arme | poison | Métal de dégâts","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d6 --toxique","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Options d'attaque COFantasy. Type du bonus appliqué après --plus pour ne pas remplacer le type principal de l’arme. Ancienne entrée conservée hors catalogue pour compatibilité historique.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":false,"displayName":"Venimite","uiGroup":"venimite_cac","uiTierLabel":"+1d6 DM de poison.","damageType":"toxique"},{"id":"A047","category":"Armes","subcategory":"Armes de mêlée","name":"en héliolite pure","power":3,"effect":"+1d6 DM d’affinité Lumière.","rp":"Héliolite pure aux reflets solaires, presque blanche au point d’impact.","example":"en héliolite pure","support":"Arme | Affinité Lumière","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d6 --lumiere","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Lumière. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"CAC","catalogVisible":true,"displayName":"Héliolite","uiGroup":"affinite_lumiere_cac","uiTierLabel":"+1d6 Lumière","damageType":"lumiere"},{"id":"A048","category":"Armes","subcategory":"Armes de mêlée","name":"du \"Classe\" Maître","power":4,"effect":"Capacité de Classe Rang 4","rp":"Arme de maître, parfaitement adaptée à un style de combat précis.","example":"d’héritage héroïque","support":"Arme | classe/profil choisi | Bonus de classe","rarity":"","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"CAC","catalogVisible":false,"displayName":"Héritage de classe","uiGroup":"heritage_classe_cac","uiTierLabel":"Rang 4"},{"id":"A049","category":"Armes","subcategory":"Armes de mêlée","name":"du \"Classe\" Légendaire","power":5,"effect":"Capacité de Classe Rang 5","rp":"Arme célèbre, nommée, liée à un héros, un fondateur ou une légende.","example":"d’héritage héroïque","support":"Arme | classe/profil choisi | Bonus de classe","rarity":"","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"CAC","catalogVisible":false,"displayName":"Héritage de classe","uiGroup":"heritage_classe_cac","uiTierLabel":"Rang 5"},{"id":"A050","category":"Armes","subcategory":"Armes magiques","name":"canalisatrice","power":1,"effect":"+1 aux tests d’attaque magique","rp":"Réseau de runes fines ou gemme modeste qui guide le mana vers le point d’impact.","example":"canalisatrice","support":"Focus magique | Base magique","rarity":"","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonusAttaqueMagique:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Supporté nativement.","uiFamily":"magie","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"canalisatrice","uiTierLabel":""},{"id":"A051","category":"Armes","subcategory":"Armes magiques","name":"du \"Classe\" Novice","power":1,"effect":"Capacité de Classe Rang 1","rp":"Bois gravé, anneaux de cuivre, cristal simple au sommet.","example":"d’héritage héroïque","support":"Focus magique | bâton magique | Bâton magique","rarity":"","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Bâtons et sceptres sont des focus magiques. Dagues, masses et épées peuvent choisir un mode CAC ou magique. Les boucliers magiques et objets de main gauche peuvent aussi servir de focus.","uiFamily":"capacite","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Héritage de classe","uiGroup":"heritage_classe_focus_magique","uiTierLabel":"Rang 1"},{"id":"A052","category":"Armes","subcategory":"Armes magiques","name":"sort mineur lié","power":1,"effect":"1 fois par jour, permet de lancer un sort de rang 1 sans dépenser de PM.","rp":"L’arme porte une formule courte, visible sous forme de rune ou de nœud gravé.","example":"sort mineur lié","support":"Focus magique | sort rang faible / capacité simple | Sort lié","rarity":"","status":"Action / usage limité","mechanism":"Capacité active","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"ACTION_EQUIPEMENT","audit":"CONFIGURATION_OBJET","actionObjects":"OUI","undo":"SELON_COMMANDE","params":"Sort exact ; commande COFantasy ; rang ; ressource objet","note":"Choisir le sort lors de la création. Conserver sa commande COFantasy native ; coût de mana nul et limite 1/jour si la commande accepte ces options.","uiFamily":"sorts_mana","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"sort mineur lié","uiTierLabel":""},{"id":"A053","category":"Armes","subcategory":"Armes magiques","name":"canalisation de feu","power":2,"effect":"+1d4 DM de feu aux sorts offensifs canalisés via l’arme.","rp":"Les runes prennent une lueur orange au lancement.","example":"canalisation de feu","support":"Focus magique | feu | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact feu ; bonus 1d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est feu. La plus forte canalisation du même type l’emporte ; pas de cumul.","channelType":"feu","channelDice":"1d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation feu","uiGroup":"canal_feu","uiTierLabel":"1d4","damageType":"feu"},{"id":"A054","category":"Armes","subcategory":"Armes magiques","name":"canalisation de froid","power":2,"effect":"+1d4 DM de eau aux sorts offensifs canalisés via l’arme.","rp":"Une buée eaue sort des runes après le sort.","example":"canalisation de eau","support":"Focus magique | eau | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact froid ; bonus 1d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est eau. La plus forte canalisation du même type l’emporte ; pas de cumul. Doublon historique fusionné vers eau; conservé hors catalogue.","channelType":"froid","channelDice":"1d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":false,"displayName":"Canalisation eau","uiGroup":"canal_eau","uiTierLabel":"1d4","damageType":"eau"},{"id":"A055","category":"Armes","subcategory":"Armes magiques","name":"canalisation de maladie","power":2,"effect":"+1d4 DM de toxique aux sorts offensifs canalisés via l’arme.","rp":"Les gravures verdissent comme une pierre malade.","example":"canalisation de toxique","support":"Focus magique | toxique | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact maladie ; bonus 1d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est toxique. La plus forte canalisation du même type l’emporte ; pas de cumul.","channelType":"maladie","channelDice":"1d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation toxique","uiGroup":"canal_toxique","uiTierLabel":"1d4","damageType":"toxique"},{"id":"A056","category":"Armes","subcategory":"Armes magiques","name":"canalisation de poison","power":2,"effect":"+1d4 DM de toxique aux sorts offensifs canalisés via l’arme.","rp":"Les runes prennent une teinte verdâtre et huileuse.","example":"canalisation de toxique","support":"Focus magique | toxique | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact poison ; bonus 1d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est toxique. La plus forte canalisation du même type l’emporte ; pas de cumul. Doublon historique fusionné vers toxique; conservé hors catalogue.","channelType":"poison","channelDice":"1d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":false,"displayName":"Canalisation toxique","uiGroup":"canal_toxique","uiTierLabel":"1d4","damageType":"toxique"},{"id":"A057","category":"Armes","subcategory":"Armes magiques","name":"canalisation d’acide","power":2,"effect":"+1d4 DM d’terre aux sorts offensifs canalisés via l’arme.","rp":"La magie laisse une odeur de solvant alchimique.","example":"canalisation d’terre","support":"Focus magique | terre | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact acide ; bonus 1d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est terre. La plus forte canalisation du même type l’emporte ; pas de cumul. Doublon historique fusionné vers terre; conservé hors catalogue.","channelType":"acide","channelDice":"1d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":false,"displayName":"Canalisation terre","uiGroup":"canal_terre","uiTierLabel":"1d4","damageType":"terre"},{"id":"A058","category":"Armes","subcategory":"Armes magiques","name":"canalisation arcanique","power":2,"effect":"+1d4 DM force aux sorts offensifs canalisés via l’arme.","rp":"Le mana brut se condense autour de la pointe ou du pommeau.","example":"canalisation arcanique","support":"Focus magique | force | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact arcane ; bonus 1d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est force. La plus forte canalisation du même type l’emporte ; pas de cumul. L’ancien type energie est accepté comme alias d’Force ; --magique seul ne déclenche pas l’effet.","channelType":"arcane","channelDice":"1d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation force","uiGroup":"canal_force","uiTierLabel":"1d4","damageType":"force"},{"id":"A059","category":"Armes","subcategory":"Armes magiques","name":"canalisation sonique","power":2,"effect":"+1d4 DM airs aux sorts offensifs canalisés via l’arme.","rp":"L’arme émet une note basse pendant l’incantation.","example":"canalisation air","support":"Focus magique | air | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact sonique ; bonus 1d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est air. La plus forte canalisation du même type l’emporte ; pas de cumul. Doublon historique fusionné vers air; conservé hors catalogue.","channelType":"sonique","channelDice":"1d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":false,"displayName":"Canalisation air","uiGroup":"canal_air","uiTierLabel":"1d4","damageType":"air"},{"id":"A060","category":"Armes","subcategory":"Armes magiques","name":"canalisation électrique","power":2,"effect":"+1d4 DM airs aux sorts offensifs canalisés via l’arme.","rp":"De petits arcs sautent entre les bagues de métal.","example":"canalisation air","support":"Focus magique | air | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact electrique ; bonus 1d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est electrique. La plus forte canalisation du même type l’emporte ; pas de cumul. Doublon historique fusionné vers air; conservé hors catalogue.","channelType":"electrique","channelDice":"1d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":false,"displayName":"Canalisation air","uiGroup":"canal_electrique","uiTierLabel":"1d4","damageType":"air"},{"id":"A061","category":"Armes","subcategory":"Armes magiques","name":"canalisatrice supérieure","power":2,"effect":"+2 aux tests d’attaque magique","rp":"Les runes s’allument quand le porteur concentre son mana.","example":"canalisatrice supérieure","support":"Focus magique | Base magique","rarity":"","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonusAttaqueMagique:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Supporté nativement.","uiFamily":"magie","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"canalisatrice supérieure","uiTierLabel":""},{"id":"A062","category":"Armes","subcategory":"Armes magiques","name":"de puissance arcanique","power":2,"effect":"Categorie de dés des sort +1   1d4 => 1d6","rp":"La pointe, la gemme ou le pommeau rougit de mana à l’instant du lancement.","example":"de puissance arcanique","support":"Focus magique | Base magique","rarity":"","status":"Focus magique","mechanism":"Puissance arcanique sur sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; +1 catégorie(s) au dé principal du sort","note":"S’applique au dé principal d’un sort --sortilege canalisé avec un focus équipé. La valeur la plus forte équipée l’emporte ; ne se cumule pas entre focus.","arcanePower":1,"uiFamily":"magie","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"de puissance arcanique","uiTierLabel":""},{"id":"A063","category":"Armes","subcategory":"Armes magiques","name":"du \"Classe\" Adepte","power":2,"effect":"Capacité de Classe Rang 2","rp":"Bâton plus travaillé, souvent lié à un maître ou une académie.","example":"d’héritage héroïque","support":"Focus magique | bâton magique | Bâton magique","rarity":"","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Héritage de classe","uiGroup":"heritage_classe_focus_magique","uiTierLabel":"Rang 2"},{"id":"A064","category":"Armes","subcategory":"Armes magiques","name":"réserve de mana","power":2,"effect":"Peut etre utiliser 1 fois par jour pour recuperer 1dMana","rp":"Gemme ou rainure lumineuse qui pâlit lorsque l’énergie est dépensée.","example":"réserve de mana","support":"Focus magique | Base magique","rarity":"","status":"Action / usage limité","mechanism":"Commande COFantasy + action équipement","predicates":"","weaponOptions":"","fieldPatch":"!cof-recupere-mana 1d@{selected|de_mana} --limiteParJour 1 reserveMana_{ITEM_ID}","auto":true,"mode":"ACTION_EQUIPEMENT","audit":"COF_EXISTANT_PARAMETRE","actionObjects":"OUI","undo":"COF_NATIF","params":"ITEM_ID unique ; dé de mana de la fiche","note":"Commande COFantasy native ; ITEM_ID doit rendre la ressource unique par objet. À exposer dans la action d’objet configurable.","uiFamily":"sorts_mana","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"réserve de mana","uiTierLabel":""},{"id":"A065","category":"Armes","subcategory":"Armes magiques","name":"sort lié","power":2,"effect":"1 fois par jour, permet de lancer un sort de rang 2 ou 3 sans dépenser de PM.","rp":"Une gemme ou une inscription plus complexe contient la matrice du sort.","example":"sort lié","support":"Focus magique | sort rang moyen | Sort lié","rarity":"","status":"Action / usage limité","mechanism":"Capacité active","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"ACTION_EQUIPEMENT","audit":"CONFIGURATION_OBJET","actionObjects":"OUI","undo":"SELON_COMMANDE","params":"Sort exact ; commande COFantasy ; rang ; ressource objet","note":"Choisir le sort lors de la création. Conserver sa commande COFantasy native ; coût de mana nul et limite 1/jour si la commande accepte ces options.","uiFamily":"sorts_mana","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"sort lié","uiTierLabel":""},{"id":"A066","category":"Armes","subcategory":"Armes magiques","name":"canalisation de feu supérieure","power":3,"effect":"+2d4 DM de feu aux sorts offensifs canalisés via l’arme.","rp":"La chaleur reste quelques secondes dans la hampe ou la lame.","example":"canalisation de feu supérieure","support":"Focus magique | feu | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact feu ; bonus 2d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est feu. La plus forte canalisation du même type l’emporte ; pas de cumul.","channelType":"feu","channelDice":"2d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation feu","uiGroup":"canal_feu","uiTierLabel":"2d4","damageType":"feu"},{"id":"A067","category":"Armes","subcategory":"Armes magiques","name":"canalisation de froid supérieure","power":3,"effect":"+2d4 DM de eau aux sorts offensifs canalisés via l’arme.","rp":"Le focus givre légèrement à chaque lancement.","example":"canalisation de eau supérieure","support":"Focus magique | eau | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact froid ; bonus 2d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est eau. La plus forte canalisation du même type l’emporte ; pas de cumul. Doublon historique fusionné vers eau; conservé hors catalogue.","channelType":"froid","channelDice":"2d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":false,"displayName":"Canalisation eau","uiGroup":"canal_eau","uiTierLabel":"2d4","damageType":"eau"},{"id":"A068","category":"Armes","subcategory":"Armes magiques","name":"canalisation de maladie supérieure","power":3,"effect":"+2d4 DM de toxique aux sorts offensifs canalisés via l’arme.","rp":"L’arme donne une impression malsaine après chaque sort.","example":"canalisation de toxique supérieure","support":"Focus magique | toxique | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact maladie ; bonus 2d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est toxique. La plus forte canalisation du même type l’emporte ; pas de cumul.","channelType":"maladie","channelDice":"2d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation toxique","uiGroup":"canal_toxique","uiTierLabel":"2d4","damageType":"toxique"},{"id":"A069","category":"Armes","subcategory":"Armes magiques","name":"canalisation de poison supérieure","power":3,"effect":"+2d4 DM de toxique aux sorts offensifs canalisés via l’arme.","rp":"La magie semble s’épaissir comme une vapeur toxique.","example":"canalisation de toxique supérieure","support":"Focus magique | toxique | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact poison ; bonus 2d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est toxique. La plus forte canalisation du même type l’emporte ; pas de cumul. Doublon historique fusionné vers toxique; conservé hors catalogue.","channelType":"poison","channelDice":"2d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":false,"displayName":"Canalisation toxique","uiGroup":"canal_toxique","uiTierLabel":"2d4","damageType":"toxique"},{"id":"A070","category":"Armes","subcategory":"Armes magiques","name":"canalisation d’acide supérieure","power":3,"effect":"+2d4 DM d’terre aux sorts offensifs canalisés via l’arme.","rp":"Les gravures semblent suinter un liquide qui disparaît aussitôt.","example":"canalisation d’terre supérieure","support":"Focus magique | terre | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact acide ; bonus 2d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est terre. La plus forte canalisation du même type l’emporte ; pas de cumul. Doublon historique fusionné vers terre; conservé hors catalogue.","channelType":"acide","channelDice":"2d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":false,"displayName":"Canalisation terre","uiGroup":"canal_terre","uiTierLabel":"2d4","damageType":"terre"},{"id":"A071","category":"Armes","subcategory":"Armes magiques","name":"canalisation arcanique supérieure","power":3,"effect":"+2d4 DM force aux sorts offensifs canalisés via l’arme.","rp":"L’arme brille d’une lumière nette quand elle perce une protection surnaturelle.","example":"canalisation arcanique supérieure","support":"Focus magique | force | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact arcane ; bonus 2d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est force. La plus forte canalisation du même type l’emporte ; pas de cumul. L’ancien type energie est accepté comme alias d’Force ; --magique seul ne déclenche pas l’effet.","channelType":"arcane","channelDice":"2d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation force","uiGroup":"canal_force","uiTierLabel":"2d4","damageType":"force"},{"id":"A072","category":"Armes","subcategory":"Armes magiques","name":"canalisation sonique supérieure","power":3,"effect":"+2d4 DM airs aux sorts offensifs canalisés via l’arme.","rp":"Le sort part avec un claquement sec qui résonne dans les os.","example":"canalisation air supérieure","support":"Focus magique | air | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact sonique ; bonus 2d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est air. La plus forte canalisation du même type l’emporte ; pas de cumul. Doublon historique fusionné vers air; conservé hors catalogue.","channelType":"sonique","channelDice":"2d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":false,"displayName":"Canalisation air","uiGroup":"canal_air","uiTierLabel":"2d4","damageType":"air"},{"id":"A073","category":"Armes","subcategory":"Armes magiques","name":"canalisation électrique supérieure","power":3,"effect":"+2d4 DM airs aux sorts offensifs canalisés via l’arme.","rp":"L’air grésille autour de l’arme pendant l’incantation.","example":"canalisation air supérieure","support":"Focus magique | air | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact electrique ; bonus 2d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est electrique. La plus forte canalisation du même type l’emporte ; pas de cumul. Doublon historique fusionné vers air; conservé hors catalogue.","channelType":"electrique","channelDice":"2d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":false,"displayName":"Canalisation air","uiGroup":"canal_electrique","uiTierLabel":"2d4","damageType":"air"},{"id":"A074","category":"Armes","subcategory":"Armes magiques","name":"de puissance arcanique supérieure","power":3,"effect":"Categorie de dés des sort +2   1d4 => 1d8","rp":"L’énergie du sort semble traverser l’arme avant d’exploser vers la cible.","example":"de puissance arcanique supérieure","support":"Focus magique | Base magique","rarity":"","status":"Focus magique","mechanism":"Puissance arcanique sur sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; +2 catégorie(s) au dé principal du sort","note":"S’applique au dé principal d’un sort --sortilege canalisé avec un focus équipé. La valeur la plus forte équipée l’emporte ; ne se cumule pas entre focus.","arcanePower":2,"uiFamily":"magie","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"de puissance arcanique supérieure","uiTierLabel":""},{"id":"A075","category":"Armes","subcategory":"Armes magiques","name":"du \"Classe\" Vétéran","power":3,"effect":"Capacité de Classe Rang 3","rp":"Le bâton porte des marques de voyages, de combats et d’anciens rituels.","example":"d’héritage héroïque","support":"Focus magique | bâton magique | Bâton magique","rarity":"","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Héritage de classe","uiGroup":"heritage_classe_focus_magique","uiTierLabel":"Rang 3"},{"id":"A076","category":"Armes","subcategory":"Armes magiques","name":"réserve de mana supérieure","power":3,"effect":"Peut etre utiliser 2 fois par jour pour recuperer 1dMana","rp":"Le noyau magique est visible : cristal, veines lumineuses ou cœur gravé.","example":"réserve de mana supérieure","support":"Focus magique | Base magique","rarity":"","status":"Action / usage limité","mechanism":"Commande COFantasy + action équipement","predicates":"","weaponOptions":"","fieldPatch":"!cof-recupere-mana 1d@{selected|de_mana} --limiteParJour 2 reserveMana_{ITEM_ID}","auto":true,"mode":"ACTION_EQUIPEMENT","audit":"COF_EXISTANT_PARAMETRE","actionObjects":"OUI","undo":"COF_NATIF","params":"ITEM_ID unique ; dé de mana de la fiche","note":"Commande COFantasy native ; ITEM_ID doit rendre la ressource unique par objet. À exposer dans la action d’objet configurable.","uiFamily":"sorts_mana","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"réserve de mana supérieure","uiTierLabel":""},{"id":"A077","category":"Armes","subcategory":"Armes magiques","name":"du \"Classe\" Maître","power":4,"effect":"Capacité de Classe Rang 4","rp":"Bâton de tradition, reconnu par les pairs, souvent nommé.","example":"d’héritage héroïque","support":"Focus magique | bâton magique | Bâton magique","rarity":"","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Héritage de classe","uiGroup":"heritage_classe_focus_magique","uiTierLabel":"Rang 4"},{"id":"A078","category":"Armes","subcategory":"Armes magiques","name":"réserve de mana majeure","power":4,"effect":"Peut etre utiliser 3 fois par jour pour recuperer 1dMana","rp":"L’arme pulse doucement, comme si elle respirait du mana.","example":"réserve de mana majeure","support":"Focus magique | Base magique","rarity":"","status":"Action / usage limité","mechanism":"Commande COFantasy + action équipement","predicates":"","weaponOptions":"","fieldPatch":"!cof-recupere-mana 1d@{selected|de_mana} --limiteParJour 3 reserveMana_{ITEM_ID}","auto":true,"mode":"ACTION_EQUIPEMENT","audit":"COF_EXISTANT_PARAMETRE","actionObjects":"OUI","undo":"COF_NATIF","params":"ITEM_ID unique ; dé de mana de la fiche","note":"Commande COFantasy native ; ITEM_ID doit rendre la ressource unique par objet. À exposer dans la action d’objet configurable.","uiFamily":"sorts_mana","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"réserve de mana majeure","uiTierLabel":""},{"id":"A079","category":"Armes","subcategory":"Armes magiques","name":"sort majeur lié","power":4,"effect":"1 fois par jour, permet de lancer un sort de rang 4 ou 5 sans dépenser de PM.","rp":"Le sort est presque une volonté propre enfermée dans l’arme.","example":"sort majeur lié","support":"Focus magique | sort rang élevé | Sort lié","rarity":"","status":"Action / usage limité","mechanism":"Capacité active","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"ACTION_EQUIPEMENT","audit":"CONFIGURATION_OBJET","actionObjects":"OUI","undo":"SELON_COMMANDE","params":"Sort exact ; commande COFantasy ; rang ; ressource objet","note":"Choisir le sort lors de la création. Conserver sa commande COFantasy native ; coût de mana nul et limite 1/jour si la commande accepte ces options.","uiFamily":"sorts_mana","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"sort majeur lié","uiTierLabel":""},{"id":"A080","category":"Armes","subcategory":"Armes magiques","name":"du \"Classe\" Légendaire","power":5,"effect":"Capacité de Classe Rang 5","rp":"Bâton célèbre, lié à un archimage, une lignée ou un événement historique.","example":"d’héritage héroïque","support":"Focus magique | bâton magique | Bâton magique","rarity":"","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Héritage de classe","uiGroup":"heritage_classe_focus_magique","uiTierLabel":"Rang 5"},{"id":"A081","category":"Armes","subcategory":"Armes à distance","name":"corde de tendon d’ogre","power":1,"effect":"+1 DM, mais -1 attaque à distance.","rp":"Corde épaisse et puissante, difficile à tendre proprement.","example":"corde de tendon d’ogre","support":"Arme | Matériau spécial distance","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--bonusAttaque -1 --plus 1","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Malus d'attaque et dégâts additionnels automatisés.","uiFamily":"corde","compatProfile":"DISTANCE","catalogVisible":true,"requiredTagsAny":["bow","crossbow"],"displayName":"corde de tendon d’ogre","uiTierLabel":"","crossWeaponMode":false},{"id":"A082","category":"Armes","subcategory":"Armes à distance","name":"de longue portée","power":1,"effect":"+1 en attaque à distance et +1 DM si la cible est à plus de 15 m du tireur.","rp":"Branches plus nerveuses, corde mieux tendue, équilibrage pensé pour garder une trajectoire propre.","example":"de longue portée","support":"Arme | Base distance","rarity":"","status":"Configurable assisté","mechanism":"Condition de distance","predicates":"","weaponOptions":"--bonusAttaque 1 --plus 1","fieldPatch":"","auto":false,"mode":"PASSIF","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"AUCUN","params":"Distance cible > 15 m","note":"Les bonus existent nativement ; seule la condition générique « cible à plus de X m » manque.","uiFamily":"combat","compatProfile":"DISTANCE","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"de longue portée","uiTierLabel":""},{"id":"A083","category":"Armes","subcategory":"Armes à distance","name":"de visée","power":1,"effect":"+1 en attaque à distance avec cette arme.","rp":"Arc plus régulier, mire gravée, équilibrage de la crosse ou empennage parfaitement calibré.","example":"de visée","support":"Arme | Base distance","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--bonusAttaque 1","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Bonus local à cette arme.","uiFamily":"combat","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Visée juste","uiGroup":"visee_distance","uiTierLabel":"+1 en attaque à distance avec cette arme."},{"id":"A084","category":"Armes","subcategory":"Armes à distance","name":"en cornaline brute","power":1,"effect":"+1 attaque, +1d6 DM contre les bêtes.","rp":"Incrustations rouge-orangé issues d’une pierre dense, polie avec des graisses de chasse.","example":"en cornaline brute","support":"Munition/arme à distance | Anti-bêtes","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible bete --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_PARAMETRE","actionObjects":"NON","undo":"AUCUN","params":"Cible avec Race/prédicat inconnue","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Cornaline brute","uiTierLabel":"Anti-bêtes","uiGroup":"anti_bete"},{"id":"A085","category":"Armes","subcategory":"Armes à distance","name":"traitée au soufre blanc","power":1,"effect":"+1 attaque, +1d6 DM contre les vermines.","rp":"Traitement minéral pâle et âcre, fixé sur le fil ou les pointes.","example":"traitée au soufre blanc","support":"Munition/arme à distance | Anti-vermines","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible vermine --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Soufre blanc","uiTierLabel":"Anti-vermines","uiGroup":"anti_vermine"},{"id":"A086","category":"Armes","subcategory":"Armes à distance","name":"en argent alchimique","power":1,"effect":"+1 attaque, +1d6 DM contre les mort-vivants.","rp":"Argent pâle injecté dans le métal, souvent gravé de prières funéraires.","example":"en argent alchimique","support":"Munition/arme à distance | Anti-mort-vivants","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible mort-vivant --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Argent alchimique","uiTierLabel":"Anti-mort-vivants","uiGroup":"anti_mort-vivant"},{"id":"A087","category":"Armes","subcategory":"Armes à distance","name":"en hématite rouge","power":1,"effect":"+1 attaque, +1d6 DM contre les humanoïdes.","rp":"Poudre d’hématite rouge sertie dans les gravures et durcie par traitement alchimique.","example":"en hématite rouge","support":"Munition/arme à distance | Anti-humanoïdes","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible humanoide --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_PARAMETRE","actionObjects":"NON","undo":"AUCUN","params":"Cible avec Race/prédicat humanoide","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Hématite rouge","uiTierLabel":"Anti-humanoïdes","uiGroup":"anti_humanoide"},{"id":"A088","category":"Armes","subcategory":"Armes à distance","name":"en corail noir","power":1,"effect":"+1 attaque, +1d6 DM contre les créatures aquatiques.","rp":"Fragments de corail noir minéralisé, polis puis sertis sur les zones de frappe.","example":"en corail noir","support":"Munition/arme à distance | Anti-créatures aquatiques","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible aquatique --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Corail noir","uiTierLabel":"Anti-créatures aquatiques","uiGroup":"anti_aquatique"},{"id":"A089","category":"Armes","subcategory":"Armes à distance","name":"en dracacier","power":1,"effect":"+1 attaque, +1d6 DM contre les dragons.","rp":"Acier mêlé de poudre d’écaille, d’os ou de sang draconique fossilisé.","example":"en dracacier","support":"Munition/arme à distance | Anti-dragons","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible dragon --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Dracacier","uiTierLabel":"Anti-dragons","uiGroup":"anti_dragon"},{"id":"A090","category":"Armes","subcategory":"Armes à distance","name":"en fer froid","power":1,"effect":"+1 attaque, +1d6 DM contre les démons.","rp":"Métal gris bleuté, froid au toucher, forgé sans flamme vive.","example":"en fer froid","support":"Munition/arme à distance | Anti-démons","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible demon --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Fer froid","uiTierLabel":"Anti-démons","uiGroup":"anti_demon"},{"id":"A091","category":"Armes","subcategory":"Armes à distance","name":"en magnétite vive","power":1,"effect":"+1 attaque, +1d6 DM contre les créatures artificielles.","rp":"Inclusions noires qui vibrent près des mécanismes, golems et structures animées.","example":"en magnétite vive","support":"Munition/arme à distance | Anti-créatures artificielles","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible artificiel --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_PARAMETRE","actionObjects":"NON","undo":"AUCUN","params":"Cible avec Race/prédicat mecanique","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Magnétite vive","uiTierLabel":"Anti-créatures artificielles","uiGroup":"anti_artificiel"},{"id":"A092","category":"Armes","subcategory":"Armes à distance","name":"traitée à la poussière d’argent froid","power":1,"effect":"+1 attaque, +1d6 DM contre les fées.","rp":"Poussière argentée fixée dans le métal par une trempe froide.","example":"traitée à la poussière d’argent froid","support":"Munition/arme à distance | Anti-fées","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible fee --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Poussière d’argent froid","uiTierLabel":"Anti-fées","uiGroup":"anti_fee"},{"id":"A093","category":"Armes","subcategory":"Armes à distance","name":"traitée à la sève noire","power":1,"effect":"+1 attaque, +1d6 DM contre les plantes.","rp":"Traitement sombre et résineux qui dessèche les fibres végétales.","example":"traitée à la sève noire","support":"Munition/arme à distance | Anti-plantes","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible plante --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_PARAMETRE","actionObjects":"NON","undo":"AUCUN","params":"Cible avec Race/prédicat plante","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Sève noire","uiTierLabel":"Anti-plantes","uiGroup":"anti_plante"},{"id":"A094","category":"Armes","subcategory":"Armes à distance","name":"en osmium noir","power":1,"effect":"+1 attaque, +1d6 DM contre les géants.","rp":"Métal extrêmement dense, utilisé en inserts sur les zones d’impact.","example":"en osmium noir","support":"Munition/arme à distance | Anti-géants","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible geant --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Osmium noir","uiTierLabel":"Anti-géants","uiGroup":"anti_geant"},{"id":"A095","category":"Armes","subcategory":"Armes à distance","name":"en verre astral","power":1,"effect":"+1 attaque, +1d6 DM contre les élémentaires.","rp":"Fragments translucides pris dans le métal, reflétant des couleurs impossibles.","example":"en verre astral","support":"Munition/arme à distance | Anti-élémentaires","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible elementaire --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_PARAMETRE","actionObjects":"NON","undo":"AUCUN","params":"Cible avec Race/prédicat elementaire","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Verre astral","uiTierLabel":"Anti-élémentaires","uiGroup":"anti_elementaire"},{"id":"A096","category":"Armes","subcategory":"Armes à distance","name":"en verre torsadé","power":1,"effect":"+1 attaque, +1d6 DM contre les aberrations.","rp":"Verre aux couches vrillées, dont les reflets semblent changer lorsque l’angle de vue se déplace.","example":"en verre torsadé","support":"Munition/arme à distance | Anti-aberrations","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible aberration --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_PARAMETRE","actionObjects":"NON","undo":"AUCUN","params":"Cible avec Race/prédicat aberration","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Verre torsadé","uiTierLabel":"Anti-aberrations","uiGroup":"anti_aberration"},{"id":"A097","category":"Armes","subcategory":"Armes à distance","name":"corde de nerf de dragon","power":2,"effect":"+5 m portée et +1 DM.","rp":"Corde très rare, sèche et résistante, capable de supporter une tension extrême.","example":"corde de nerf de dragon","support":"Arme | Matériau spécial distance","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--modifiePortee 5 --plus 1","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Portée et dégâts supplémentaires via options.","uiFamily":"corde","compatProfile":"DISTANCE","catalogVisible":true,"requiredTagsAny":["bow","crossbow"],"displayName":"corde de nerf de dragon","uiTierLabel":"","crossWeaponMode":false},{"id":"A098","category":"Armes","subcategory":"Armes à distance","name":"corde jumelle","power":2,"effect":"1 fois par combat, peut relancer un jet d’attaque à distance raté de 1 ou 2 points.","rp":"Double tressage qui absorbe les mauvais écarts de tension.","example":"corde jumelle","support":"Arme | Matériau spécial distance","rarity":"","status":"Option d'arme + relance native","mechanism":"Relance conditionnelle d'attaque","predicates":"","weaponOptions":"--cordeJumelle","fieldPatch":"!cof-corde-jumelle {EVT_ID}","auto":true,"mode":"CONTEXTUEL","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"EVT_COF_REDO","params":"Attaque à distance ; échec de 1 ou 2 ; 1/combat ; événement original","note":"Syntaxe/commande proposées. Réutiliser findEvent + undoEvent + redoEvent déjà employés par les relances COFantasy. La relance consomme sa limite 1/combat dans l'événement de remplacement afin qu'un !cof-undo rende aussi l'utilisation.","uiFamily":"corde","compatProfile":"DISTANCE","catalogVisible":true,"requiredTagsAny":["bow","crossbow"],"displayName":"corde jumelle","uiTierLabel":"","crossWeaponMode":false},{"id":"A099","category":"Armes","subcategory":"Armes à distance","name":"de longue portée supérieure","power":2,"effect":"+2 en attaque à distance et +2 DM si la cible est à plus de 15 m du tireur.","rp":"Arme conçue pour tirer loin sans perdre trop de puissance ni de précision.","example":"de longue portée supérieure","support":"Arme | Base distance","rarity":"","status":"Configurable assisté","mechanism":"Condition de distance","predicates":"","weaponOptions":"--bonusAttaque 2 --plus 2","fieldPatch":"","auto":false,"mode":"PASSIF","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"AUCUN","params":"Distance cible > 15 m","note":"Les bonus existent nativement ; seule la condition générique « cible à plus de X m » manque.","uiFamily":"combat","compatProfile":"DISTANCE","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"de longue portée supérieure","uiTierLabel":""},{"id":"A100","category":"Armes","subcategory":"Armes à distance","name":"de visée supérieure","power":2,"effect":"+2 en attaque à distance avec cette arme.","rp":"L’arme semble naturellement guider le regard vers le point faible de la cible.","example":"de visée supérieure","support":"Arme | Base distance","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--bonusAttaque 2","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Bonus local à cette arme.","uiFamily":"combat","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Visée juste","uiGroup":"visee_distance","uiTierLabel":"+2 en attaque à distance avec cette arme."},{"id":"A101","category":"Armes","subcategory":"Armes à distance","name":"en arcanite","power":2,"effect":"+1d4 DM d’affinité Force.","rp":"Pointe ou noyau d’arcanite qui condense la magie brute au moment du tir.","example":"en arcanite","support":"Munition/arme à distance | Affinité Force","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d4 --force","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Force. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Arcanite","uiGroup":"affinite_force_dist","uiTierLabel":"+1d4 Force","damageType":"force"},{"id":"A102","category":"Armes","subcategory":"Armes à distance","name":"en bois de chêne","power":2,"effect":"Portée divisée par 2, mais le dé de DM augmente de 2 catégorie.","rp":"Bois solide, plus lourd, qui donne de la puissance mais demande plus d’effort.","example":"en bois de chêne","support":"Arme | Matériau spécial distance","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--divisePortee 2","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"L'augmentation de catégorie du dé de dégâts doit être appliquée au champ de dégâts.","uiFamily":"bois","compatProfile":"DISTANCE","catalogVisible":true,"requiredTagsAny":["bow"],"displayName":"en bois de chêne","uiTierLabel":"","crossWeaponMode":false},{"id":"A103","category":"Armes","subcategory":"Armes à distance","name":"en bois de fer","power":2,"effect":"Ajoute la FOR aux mod de degats","rp":"Bois extrêmement dur, presque métallique, difficile à travailler.","example":"en bois de fer","support":"Arme | Matériau spécial distance","rarity":"","status":"Champ d'arme","mechanism":"armedmcar","predicates":"","weaponOptions":"","fieldPatch":"armedmcar=FOR","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"armedmcar=FOR","note":"Utilise le champ natif armedmcar de l’arme donnée au PJ ; aucun --plus dynamique.","uiFamily":"bois","compatProfile":"DISTANCE","catalogVisible":true,"requiredTagsAny":["bow"],"displayName":"en bois de fer","uiTierLabel":"","crossWeaponMode":false},{"id":"A104","category":"Armes","subcategory":"Armes à distance","name":"en bois de saule","power":2,"effect":"Ajoute la DEX aux mod de degats","rp":"Bois souple, tolérant, qui travaille sans casser.","example":"en bois de saule","support":"Arme | Matériau spécial distance","rarity":"","status":"Champ d'arme","mechanism":"armedmcar","predicates":"","weaponOptions":"","fieldPatch":"armedmcar=DEX","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"armedmcar=DEX","note":"Utilise le champ natif armedmcar de l’arme donnée au PJ ; aucun --plus dynamique.","uiFamily":"bois","compatProfile":"DISTANCE","catalogVisible":true,"requiredTagsAny":["bow"],"displayName":"en bois de saule","uiTierLabel":"","crossWeaponMode":false},{"id":"A105","category":"Armes","subcategory":"Armes à distance","name":"en bois d’if","power":2,"effect":"+2 m de déplacement, +2 initiative tant que l’arme est portée ou prête.","rp":"Arme légère, claire, facile à lever, viser ou dégainer rapidement.","example":"en bois d’if","support":"Arme | Matériau spécial distance","rarity":"","status":"Prédicat étendu","mechanism":"Patch COFantasy + feuille","predicates":"bonusInitiative:2\nbonusMouvement:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Initiative gérée par le patch Mod ; mouvement affiché par le sheetworker.","uiFamily":"bois","compatProfile":"DISTANCE","catalogVisible":true,"requiredTagsAny":["bow"],"displayName":"Bois d’if","uiGroup":"bois_if","uiTierLabel":"+2 m de déplacement, +2 initiative tant que l’arme est portée ou prête.","crossWeaponMode":false},{"id":"A106","category":"Armes","subcategory":"Armes à distance","name":"en fulgurium","power":2,"effect":"+1d4 DM d’affinité Air.","rp":"Pointe veinée de fulgurium ; l’air crépite pendant le vol.","example":"en fulgurium","support":"Munition/arme à distance | Affinité Air","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d4 --air","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Air. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Fulgurium","uiGroup":"affinite_air_dist","uiTierLabel":"+1d4 Air","damageType":"air"},{"id":"A107","category":"Armes","subcategory":"Armes à distance","name":"en hybberium","power":2,"effect":"+1d4 DM d’affinité Eau.","rp":"Pointe pâle et humide, liée aux courants du plan de l’Eau.","example":"en hybberium","support":"Munition/arme à distance | Affinité Eau","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d4 --eau","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Eau. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Hybberium","uiGroup":"affinite_eau_dist","uiTierLabel":"+1d4 Eau","damageType":"eau"},{"id":"A108","category":"Armes","subcategory":"Armes à distance","name":"en malachium","power":1,"effect":"+1 attaque, +1d6 DM contre les célestes.","rp":"Alliage vert sombre dont la structure perturbe les essences célestes sans conférer d’autre propriété.","example":"en malachium","support":"Munition/arme à distance | Anti-célestes","rarity":"","status":"Option d'arme","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible celeste --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Malachium","uiGroup":"anti_celeste","uiTierLabel":"Anti-célestes"},{"id":"A109","category":"Armes","subcategory":"Armes à distance","name":"en phospharium","power":2,"effect":"+1d4 DM d’affinité Feu.","rp":"Pointe orangée qui rougit en vol.","example":"en phospharium","support":"Munition/arme à distance | Affinité Feu","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d4 --feu","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Feu. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Phospharium","uiGroup":"affinite_feu_dist","uiTierLabel":"+1d4 Feu","damageType":"feu"},{"id":"A110","category":"Armes","subcategory":"Armes à distance","name":"en tellurite","power":2,"effect":"+1d4 DM d’affinité Terre.","rp":"Pointe minérale lourde qui semble attirer poussière et gravier.","example":"en tellurite","support":"Munition/arme à distance | Affinité Terre","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d4 --terre","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Terre. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Tellurite","uiGroup":"affinite_terre_dist","uiTierLabel":"+1d4 Terre","damageType":"terre"},{"id":"A111","category":"Armes","subcategory":"Armes à distance","name":"en venimite","power":2,"effect":"+1d4 DM de poison.","rp":"Pointe sombre, rainurée pour retenir toxines ou huiles.","example":"en venimite","support":"Munition/arme de jet | Métal de dégâts distance","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d4 --toxique","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Options d'attaque COFantasy. Type du bonus appliqué après --plus pour ne pas remplacer le type principal de l’arme. Ancienne entrée conservée hors catalogue pour compatibilité historique.","uiFamily":"materiau","compatProfile":"DISTANCE","catalogVisible":false,"displayName":"Venimite","uiGroup":"venimite_dist","uiTierLabel":"+1d4 DM de poison.","damageType":"toxique"},{"id":"A112","category":"Armes","subcategory":"Armes à distance","name":"en héliolite","power":2,"effect":"+1d4 DM d’affinité Lumière.","rp":"Pointe dorée qui capte la lumière sans servir de source d’éclairage.","example":"en héliolite","support":"Munition/arme à distance | Affinité Lumière","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d4 --lumiere","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Lumière. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Héliolite","uiGroup":"affinite_lumiere_dist","uiTierLabel":"+1d4 Lumière","damageType":"lumiere"},{"id":"A113","category":"Armes","subcategory":"Armes à distance","name":"fidèle","power":2,"effect":"Une arme de lancer revient immédiatement dans la main du porteur après l’attaque.","rp":"Rune de rappel, lanière enchantée, magnétisme subtil ou esprit lié à l’arme.","example":"fidèle","support":"Arme de Jet | Base distance","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--retourneEnMain","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"Arme de jet","note":"Version unique : --retourneEnMain.","uiFamily":"jet","compatProfile":"DISTANCE","catalogVisible":true,"requiredTagsAny":["throwing"],"crossWeaponMode":false,"displayName":"fidèle","uiTierLabel":""},{"id":"A114","category":"Armes","subcategory":"Armes à distance","name":"tir sûr","power":2,"effect":"Ignore les malus d'obstacle","rp":"L’arme est précise et prévisible ; le tireur sent instinctivement la fenêtre de tir.","example":"tir sûr","support":"Arme | Base distance","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--ignoreObstacles","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Supporté par le parseur d'options COFantasy.","uiFamily":"tir","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Tir imperturbable","uiGroup":"tir_sur","uiTierLabel":"Ignore les malus d'obstacle","requiredTagsAny":["bow","crossbow","firearm"],"crossWeaponMode":false},{"id":"A115","category":"Armes","subcategory":"Armes à distance","name":"de double chasse","power":2,"effect":"+1 attaque, +1d6 DM contre deux types de créatures cohérents.","rp":"Projectile ou arme traité avec deux substances compatibles, souvent rare et coûteuse.","example":"de double chasse","support":"Munition/arme de jet | Anti-créature distance","rarity":"","status":"Option d'arme configurable","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible {TYPE1} --bonusAttaque 1 --plus 1d6 --else --if typeCible {TYPE2} --bonusAttaque 1 --plus 1d6 --endif --endif","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"COF_EXISTANT_PARAMETRE","actionObjects":"NON","undo":"AUCUN","params":"TYPE1 ; TYPE2 (Race/prédicats)","note":"À renseigner à la création de l'objet : TYPE1 et TYPE2. Le else évite le cumul si la cible correspond aux deux types.","uiFamily":"anti_creature","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Double chasse","uiTierLabel":""},{"id":"A116","category":"Armes","subcategory":"Armes à distance","name":"de salve","power":3,"effect":"Une fois par combat, après une attaque réussie, permet une seconde attaque à -5 contre une autre cible située à 5 m maximum de la première.","rp":"L’arme est pensée pour enchaîner rapidement deux tirs ou deux lancers.","example":"de salve","support":"Arme | Base distance","rarity":"","status":"Option d'arme + bouton !cof-attack","mechanism":"Seconde attaque contextuelle","predicates":"","weaponOptions":"--salve -5 5","fieldPatch":"!cof-attack {ATTAQUANT} {CIBLE2} {ARME} --bonusAttaque -5 --limiteParCombat 1 salve_{ARME_ID}","auto":true,"mode":"CONTEXTUEL","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"COF_NATIF_RESSOURCE","params":"Après attaque réussie ; cible2 ≠ cible1 ; cible2 à ≤5 m de cible1 ; malus -5 ; 1/combat","note":"Syntaxe d'option proposée, mais la seconde action reste une vraie !cof-attack native. Le hook ne fait qu'afficher les cibles valides dans un rayon de 5 m ; portée de l'arme et limite 1/combat sont ensuite contrôlées par COFantasy. Undo natif sur la seconde attaque.","uiFamily":"tir","compatProfile":"DISTANCE","catalogVisible":true,"requiredTagsAny":["bow"],"displayName":"Salve enchaînée","uiGroup":"salve_distance","uiTierLabel":"Une fois par combat, après une attaque réussie, permet une seconde attaque à -5 contre une autre cible située à 5 m maximum de la première.","crossWeaponMode":false},{"id":"A117","category":"Armes","subcategory":"Armes à distance","name":"en arcanite pure","power":3,"effect":"+1d6 DM d’affinité Force.","rp":"Arcanite pure qui laisse une brève traînée d’énergie magique.","example":"en arcanite pure","support":"Munition/arme à distance | Affinité Force","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d6 --force","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Force. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Arcanite","uiGroup":"affinite_force_dist","uiTierLabel":"+1d6 Force","damageType":"force"},{"id":"A118","category":"Armes","subcategory":"Armes à distance","name":"en bois d’if supérieur","power":3,"effect":"+4 m de déplacement, +4 initiative tant que l’arme est portée ou prête.","rp":"Mithral pur, presque sans poids, très apprécié des éclaireurs.","example":"en bois d’if supérieur","support":"Arme | Matériau spécial distance","rarity":"","status":"Prédicat étendu","mechanism":"Patch COFantasy + feuille","predicates":"bonusInitiative:4\nbonusMouvement:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Initiative gérée par le patch Mod ; mouvement affiché par le sheetworker.","uiFamily":"bois","compatProfile":"DISTANCE","catalogVisible":true,"requiredTagsAny":["bow"],"displayName":"Bois d’if","uiGroup":"bois_if","uiTierLabel":"+4 m de déplacement, +4 initiative tant que l’arme est portée ou prête.","crossWeaponMode":false},{"id":"A119","category":"Armes","subcategory":"Armes à distance","name":"en fulgurium chargé","power":3,"effect":"+1d6 DM d’affinité Air.","rp":"Fulgurium chargé qui ionise l’air autour du projectile.","example":"en fulgurium chargé","support":"Munition/arme à distance | Affinité Air","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d6 --air","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Air. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Fulgurium","uiGroup":"affinite_air_dist","uiTierLabel":"+1d6 Air","damageType":"air"},{"id":"A120","category":"Armes","subcategory":"Armes à distance","name":"en hybberium pur","power":3,"effect":"+1d6 DM d’affinité Eau.","rp":"Hybberium pur qui couvre le projectile d’une fine condensation.","example":"en hybberium pur","support":"Munition/arme à distance | Affinité Eau","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d6 --eau","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Eau. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Hybberium","uiGroup":"affinite_eau_dist","uiTierLabel":"+1d6 Eau","damageType":"eau"},{"id":"A121","category":"Armes","subcategory":"Armes à distance","name":"en malachium corrompu","power":3,"effect":"+1d6 DM de maladie.","rp":"La pointe semble tachée de veines maladives.","example":"en malachium corrompu","support":"Munition/arme de jet | Métal de dégâts distance","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d6 --toxique","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Options d'attaque COFantasy. Type du bonus appliqué après --plus pour ne pas remplacer le type principal de l’arme. Ancienne entrée conservée hors catalogue pour compatibilité historique.","uiFamily":"materiau","compatProfile":"DISTANCE","catalogVisible":false,"displayName":"Malachium","uiGroup":"malachium_dist","uiTierLabel":"+1d6 DM de maladie.","damageType":"toxique"},{"id":"A122","category":"Armes","subcategory":"Armes à distance","name":"en phospharium pur","power":3,"effect":"+1d6 DM d’affinité Feu.","rp":"Phospharium pur laissant une brève traînée chaude.","example":"en phospharium pur","support":"Munition/arme à distance | Affinité Feu","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d6 --feu","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Feu. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Phospharium","uiGroup":"affinite_feu_dist","uiTierLabel":"+1d6 Feu","damageType":"feu"},{"id":"A123","category":"Armes","subcategory":"Armes à distance","name":"en tellurite dense","power":3,"effect":"+1d6 DM d’affinité Terre.","rp":"Tellurite dense qui frappe avec une résonance minérale.","example":"en tellurite dense","support":"Munition/arme à distance | Affinité Terre","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d6 --terre","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Terre. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Tellurite","uiGroup":"affinite_terre_dist","uiTierLabel":"+1d6 Terre","damageType":"terre"},{"id":"A124","category":"Armes","subcategory":"Armes à distance","name":"en venimite noire","power":3,"effect":"+1d6 DM de poison.","rp":"Le métal a des reflets huileux et une odeur âcre.","example":"en venimite noire","support":"Munition/arme de jet | Métal de dégâts distance","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d6 --toxique","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Options d'attaque COFantasy. Type du bonus appliqué après --plus pour ne pas remplacer le type principal de l’arme. Ancienne entrée conservée hors catalogue pour compatibilité historique.","uiFamily":"materiau","compatProfile":"DISTANCE","catalogVisible":false,"displayName":"Venimite","uiGroup":"venimite_dist","uiTierLabel":"+1d6 DM de poison.","damageType":"toxique"},{"id":"A125","category":"Armes","subcategory":"Armes à distance","name":"en héliolite pure","power":3,"effect":"+1d6 DM d’affinité Lumière.","rp":"Héliolite pure qui produit un éclat solaire au point d’impact.","example":"en héliolite pure","support":"Munition/arme à distance | Affinité Lumière","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plus 1d6 --lumiere","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Affinité uniquement : Lumière. Aucune autre propriété n’est déduite du matériau.","uiFamily":"materiau","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Héliolite","uiGroup":"affinite_lumiere_dist","uiTierLabel":"+1d6 Lumière","damageType":"lumiere"},{"id":"A126","category":"Armes","subcategory":"Armes à distance","name":"tir sûr supérieur","power":3,"effect":"Ignore les malus d'obstacle et +1 attaque","rp":"Arme de tireur d’élite, conçue pour les combats coordonnés.","example":"tir sûr supérieur","support":"Arme | Base distance","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--ignoreObstacles --bonusAttaque 1","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Supporté par le parseur d'options COFantasy.","uiFamily":"tir","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Tir imperturbable","uiGroup":"tir_sur","uiTierLabel":"Ignore les malus d'obstacle et +1 attaque","requiredTagsAny":["bow","crossbow","firearm"],"crossWeaponMode":false},{"id":"A127","category":"Armes","subcategory":"Armes à distance","name":"de salve supérieure","power":4,"effect":"Une fois par combat, permet une seconde attaque à -2 contre une autre cible située à 5 m maximum de la première.","rp":"Le geste devient une rafale parfaitement maîtrisée.","example":"de salve supérieure","support":"Arme | Base distance","rarity":"","status":"Option d'arme + bouton !cof-attack","mechanism":"Seconde attaque contextuelle","predicates":"","weaponOptions":"--salve -2 5","fieldPatch":"!cof-attack {ATTAQUANT} {CIBLE2} {ARME} --bonusAttaque -2 --limiteParCombat 1 salve_{ARME_ID}","auto":true,"mode":"CONTEXTUEL","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"COF_NATIF_RESSOURCE","params":"Après attaque réussie ; cible2 ≠ cible1 ; cible2 à ≤5 m de cible1 ; malus -2 ; 1/combat","note":"Même mécanisme que Salve. La seconde attaque est une !cof-attack native avec -2 et limite 1/combat ; le hook sert uniquement à proposer les cibles valides.","uiFamily":"tir","compatProfile":"DISTANCE","catalogVisible":true,"requiredTagsAny":["bow"],"displayName":"Salve enchaînée","uiGroup":"salve_distance","uiTierLabel":"Une fois par combat, permet une seconde attaque à -2 contre une autre cible située à 5 m maximum de la première.","crossWeaponMode":false},{"id":"A129","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Armure : tous / Bouclier : Maille-Plaque","name":"du \"Classe\" Novice","power":1,"effect":"Capacité de Classe Rang 1","rp":"L’objet est lié à une classe précise ; ses runes, marques ou ornements permettent d’accéder à une capacité de cette classe au rang indiqué.","example":"d’héritage héroïque","support":"Armure / Bouclier | Armure : tous / Bouclier : Maille-Plaque | Novice | Capacité de classe","rarity":"Rare","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"ARMURE_TOUTES + BOUCLIER","catalogVisible":false,"displayName":"Héritage de classe","uiGroup":"heritage_classe_armure_toutes_bouclier","uiTierLabel":"Rang 1"},{"id":"A130","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Armure : tous / Bouclier : Maille-Plaque","name":"du \"Classe\" Adepte","power":2,"effect":"Capacité de Classe Rang 2","rp":"L’enchantement est plus stable et reproduit une capacité de classe plus avancée.","example":"d’héritage héroïque","support":"Armure / Bouclier | Armure : tous / Bouclier : Maille-Plaque | Adepte | Capacité de classe","rarity":"Très rare","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"ARMURE_TOUTES + BOUCLIER","catalogVisible":false,"displayName":"Héritage de classe","uiGroup":"heritage_classe_armure_toutes_bouclier","uiTierLabel":"Rang 2"},{"id":"A131","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Armure : tous / Bouclier : Maille-Plaque","name":"du \"Classe\" Vétéran","power":3,"effect":"Capacité de Classe Rang 3","rp":"L’objet porte une empreinte héroïque associée à une tradition martiale, mystique ou sacrée précise.","example":"d’héritage héroïque","support":"Armure / Bouclier | Armure : tous / Bouclier : Maille-Plaque | Vétéran | Capacité de classe","rarity":"Très rare","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"ARMURE_TOUTES + BOUCLIER","catalogVisible":false,"displayName":"Héritage de classe","uiGroup":"heritage_classe_armure_toutes_bouclier","uiTierLabel":"Rang 3"},{"id":"A132","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Armure : tous / Bouclier : Maille-Plaque","name":"du \"Classe\" Maître","power":4,"effect":"Capacité de Classe Rang 4","rp":"Les runes ou symboles de classe sont suffisamment puissants pour accorder une capacité majeure.","example":"d’héritage héroïque","support":"Armure / Bouclier | Armure : tous / Bouclier : Maille-Plaque | Maître | Capacité de classe","rarity":"Épique","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"ARMURE_TOUTES + BOUCLIER","catalogVisible":false,"displayName":"Héritage de classe","uiGroup":"heritage_classe_armure_toutes_bouclier","uiTierLabel":"Rang 4"},{"id":"A133","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Armure : tous / Bouclier : Maille-Plaque","name":"du \"Classe\" Légendaire","power":5,"effect":"Capacité de Classe Rang 5","rp":"L’objet devient un véritable héritage de classe, capable de transmettre une capacité légendaire.","example":"d’héritage héroïque","support":"Armure / Bouclier | Armure : tous / Bouclier : Maille-Plaque | Légendaire | Capacité de classe","rarity":"Légendaire","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"ARMURE_TOUTES + BOUCLIER","catalogVisible":false,"displayName":"Héritage de classe","uiGroup":"heritage_classe_armure_toutes_bouclier","uiTierLabel":"Rang 5"},{"id":"A134","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"+DEF","power":1,"effect":"+1 DEF","rp":"La qualité de forge améliore la couverture et la solidité de l'armure.","example":"Acier nain","support":"Armure / Bouclier | Maille / Plaque | Normale | Renforcement","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé/tenu","predicates":"bonus_DEF:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Bonus de DEF actif uniquement quand l'objet est équipé/tenu.","uiFamily":"defense","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"Protection renforcée","uiTierLabel":"","requiredTagsAny":["plate","mail","shield"]},{"id":"A135","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"Légèreté","power":1,"effect":"Réduit le malus d'armure de 1","rp":"Le mithral diminue fortement le poids des anneaux.","example":"Maille de mithral","support":"Armure / Bouclier | Maille / Plaque | Normale | Légèreté","rarity":"Rare","status":"Champ armure","mechanism":"Transformation à l'application","predicates":"","weaponOptions":"","fieldPatch":"malusarmure -1","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"À appliquer au champ malus de l'armure ; ce n'est pas un prédicat.","uiFamily":"mobilite","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"Allègement","uiTierLabel":"","requiredTagsAny":["plate","mail"]},{"id":"A136","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"Mobilité","power":1,"effect":"+1 Initiative, +1 m de déplacement","rp":"Le mithral allège l'armure et réduit l'inertie.","example":"Mailles de mithral","support":"Armure / Bouclier | Maille / Plaque | Normale | Mobilité","rarity":"Rare","status":"Prédicat étendu","mechanism":"Patch COFantasy + feuille","predicates":"bonusInitiative:1\nbonusMouvement:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Initiative gérée par le patch Mod ; mouvement affiché par le sheetworker.","uiFamily":"mobilite","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"Mobilité","uiTierLabel":"","requiredTagsAny":["mail"]},{"id":"A137","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"RD Acide","power":1,"effect":"RD 2 contre les DM d'terre","rp":"Un vernis alchimique protège le métal des attaques terres.","example":"Plaque vernie anticorrosion","support":"Armure / Bouclier | Maille / Plaque | Normale | Résistance élémentaire","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::acide:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"RD Terre","uiTierLabel":"","damageType":"terre","requiredTagsAny":["plate","mail","shield"]},{"id":"A138","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"RD Contondant","power":1,"effect":"RD 1 contre les DM contondants","rp":"La doublure répartit la violence des impacts.","example":"Plaque doublée de cuir épais","support":"Armure / Bouclier | Maille / Plaque | Normale | Résistance physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::contondant:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"RD Contondant","uiTierLabel":"","damageType":"contondant","requiredTagsAny":["plate","mail","shield"]},{"id":"A139","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"RD Feu","power":1,"effect":"RD 2 contre les DM de feu","rp":"Le métal a été trempé dans des sels ignifuges.","example":"Acier noirci ignifugé","support":"Armure / Bouclier | Maille / Plaque | Normale | Résistance élémentaire","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::feu:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"RD Feu","uiTierLabel":"","damageType":"feu","requiredTagsAny":["plate","mail","shield"]},{"id":"A140","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"RD Foudre","power":1,"effect":"RD 2 contre les DM de air","rp":"Les mailles gravées répartissent l'énergie de la air sur toute l'armure.","example":"Mailles de cuivre runique","support":"Armure / Bouclier | Maille / Plaque | Normale | Résistance élémentaire","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::electrique:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"RD Air","uiTierLabel":"","damageType":"air","requiredTagsAny":["plate","mail","shield"]},{"id":"A141","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"RD Froid","power":1,"effect":"RD 2 contre les DM de eau","rp":"L'armure reçoit une doublure isolante et un traitement au eau.","example":"Acier bleui isolé","support":"Armure / Bouclier | Maille / Plaque | Normale | Résistance élémentaire","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::froid:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"RD Eau","uiTierLabel":"","damageType":"eau","requiredTagsAny":["plate","mail","shield"]},{"id":"A142","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"RD Perforant","power":1,"effect":"RD 1 contre les DM perforants","rp":"Les plaques en couches empêchent les pointes d'atteindre directement le corps.","example":"Plaques superposées","support":"Armure / Bouclier | Maille / Plaque | Normale | Résistance physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::percant:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"RD Perforant","uiTierLabel":"","damageType":"percant","requiredTagsAny":["plate","mail","shield"]},{"id":"A143","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"RD Poison","power":1,"effect":"RD 2 contre les DM de toxique","rp":"L'argent traité limite la propagation des toxines au contact.","example":"Mailles argentées purifiantes","support":"Armure / Bouclier | Maille / Plaque | Normale | Résistance élémentaire","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::poison:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"RD Toxique","uiTierLabel":"","damageType":"toxique","requiredTagsAny":["plate","mail","shield"]},{"id":"A144","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"RD Tranchant","power":1,"effect":"RD 1 contre les DM tranchants","rp":"Les anneaux serrés et bien forgés détournent les lames.","example":"Mailles d'acier nain","support":"Armure / Bouclier | Maille / Plaque | Normale | Résistance physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::tranchant:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"RD Tranchant","uiTierLabel":"","damageType":"tranchant","requiredTagsAny":["plate","mail","shield"]},{"id":"A145","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"+DEF","power":3,"effect":"+2 DEF","rp":"Le métal rare protège mieux les points vitaux et résiste aux impacts.","example":"Adamantium","support":"Armure / Bouclier | Maille / Plaque | Supérieure | Renforcement","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé/tenu","predicates":"bonus_DEF:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Bonus de DEF actif uniquement quand l'objet est équipé/tenu.","uiFamily":"defense","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"Protection renforcée","uiTierLabel":"","requiredTagsAny":["plate","mail","shield"]},{"id":"A146","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"Bouclier runique","power":3,"effect":"1 fois par combat, lorsque le porteur est pris pour cible par une attaque, il peut se placer immédiatement en défense simple jusqu'au début de son prochain tour.","rp":"Les runes projettent brièvement une barrière défensive autour du porteur.","example":"Armure gravée de runes de garde","support":"Armure / Bouclier | Maille / Plaque | Normale | Défense active","rarity":"Rare","status":"Commande COFantasy compatible","mechanism":"Défense réactive","predicates":"","weaponOptions":"","fieldPatch":"!cof-action-defensive simple --reaction --limiteParCombat 1 bouclierRunique_{ITEM_ID}","auto":true,"mode":"ACTION_EQUIPEMENT","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"OUI","undo":"COF_NATIF_RESSOURCE","params":"Défense simple ; réaction lorsqu'il est ciblé ; 1/combat ; expire au début du prochain tour ; ITEM_ID","note":"Syntaxe proposée pour l'extension de la commande existante, pas une nouvelle commande. Ajouter la lecture des options/limiteRessources à !cof-action-defensive et un mode --reaction dont l'expiration est le début du prochain tour du porteur. Défense + utilisation dans le même evt COFantasy ; la liste Objets ne fait que lancer cette commande.","uiFamily":"reaction","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"Égide runique","uiTierLabel":"","requiredTagsAny":["shield"]},{"id":"A147","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"Légèreté","power":3,"effect":"Réduit le malus d'armure de 2","rp":"La forge en mithral pur réduit le poids sans sacrifier la protection.","example":"Plaque de mithral pur","support":"Armure / Bouclier | Maille / Plaque | Supérieure | Légèreté","rarity":"Très rare","status":"Champ armure","mechanism":"Transformation à l'application","predicates":"","weaponOptions":"","fieldPatch":"malusarmure -2","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"À appliquer au champ malus de l'armure ; ce n'est pas un prédicat.","uiFamily":"mobilite","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"Allègement","uiTierLabel":"","requiredTagsAny":["plate","mail"]},{"id":"A148","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"Mobilité","power":3,"effect":"+2 Initiative, +2 m de déplacement","rp":"La plaque est équilibrée sur mesure pour gêner le moins possible les mouvements.","example":"Plaque de mithral ajustée","support":"Armure / Bouclier | Maille / Plaque | Supérieure | Mobilité","rarity":"Très rare","status":"Prédicat étendu","mechanism":"Patch COFantasy + feuille","predicates":"bonusInitiative:2\nbonusMouvement:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Initiative gérée par le patch Mod ; mouvement affiché par le sheetworker.","uiFamily":"mobilite","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"Mobilité","uiTierLabel":"","requiredTagsAny":["mail"]},{"id":"A149","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"RD Acide","power":3,"effect":"RD 4 contre les DM d'terre","rp":"La surface vitrifiée empêche l'terre de mordre profondément dans le métal.","example":"Acier vitrifié alchimique","support":"Armure / Bouclier | Maille / Plaque | Supérieure | Résistance élémentaire","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::acide:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"RD Terre","uiTierLabel":"","damageType":"terre","requiredTagsAny":["plate","mail","shield"]},{"id":"A150","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"RD Contondant","power":3,"effect":"RD 2 contre les DM contondants","rp":"Les petits relais runiques dissipent les chocs à travers l'armure.","example":"Plaque montée sur amortisseurs runiques","support":"Armure / Bouclier | Maille / Plaque | Supérieure | Résistance physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::contondant:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"RD Contondant","uiTierLabel":"","damageType":"contondant","requiredTagsAny":["plate","mail","shield"]},{"id":"A151","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"RD Feu","power":3,"effect":"RD 4 contre les DM de feu","rp":"Le traitement alchimique protège durablement l'armure des flammes.","example":"Plaque trempée aux sels de lave","support":"Armure / Bouclier | Maille / Plaque | Supérieure | Résistance élémentaire","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::feu:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"RD Feu","uiTierLabel":"","damageType":"feu","requiredTagsAny":["plate","mail","shield"]},{"id":"A152","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"RD Foudre","power":3,"effect":"RD 4 contre les DM de air","rp":"La plaque intègre de la fulgurite pour absorber et dévier les décharges.","example":"Plaque conductrice en fulgurite","support":"Armure / Bouclier | Maille / Plaque | Supérieure | Résistance élémentaire","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::electrique:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"RD Air","uiTierLabel":"","damageType":"air","requiredTagsAny":["plate","mail","shield"]},{"id":"A153","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"RD Froid","power":3,"effect":"RD 4 contre les DM de eau","rp":"La plaque combine métal traité et doublure épaisse pour bloquer le gel.","example":"Plaque doublée de fourrure arctique","support":"Armure / Bouclier | Maille / Plaque | Supérieure | Résistance élémentaire","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::froid:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"RD Eau","uiTierLabel":"","damageType":"eau","requiredTagsAny":["plate","mail","shield"]},{"id":"A154","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"RD Perforant","power":3,"effect":"RD 2 contre les DM perforants","rp":"Le feuilletage d'adamantium disperse la force des impacts perforants.","example":"Plaques d'adamantium feuilleté","support":"Armure / Bouclier | Maille / Plaque | Supérieure | Résistance physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::percant:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"RD Perforant","uiTierLabel":"","damageType":"percant","requiredTagsAny":["plate","mail","shield"]},{"id":"A155","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"RD Poison","power":3,"effect":"RD 4 contre les DM de toxique","rp":"Les sceaux purifiants renforcent la protection contre les toxiques.","example":"Plaque gravée de sceaux antitoxines","support":"Armure / Bouclier | Maille / Plaque | Supérieure | Résistance élémentaire","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::poison:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"RD Toxique","uiTierLabel":"","damageType":"toxique","requiredTagsAny":["plate","mail","shield"]},{"id":"A156","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"RD Tranchant","power":3,"effect":"RD 2 contre les DM tranchants","rp":"L'adamantium offre une résistance supérieure aux tranchants.","example":"Mailles d'adamantium","support":"Armure / Bouclier | Maille / Plaque | Supérieure | Résistance physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::tranchant:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"RD Tranchant","uiTierLabel":"","damageType":"tranchant","requiredTagsAny":["plate","mail","shield"]},{"id":"A157","category":"Armure / Bouclier","subcategory":"Armure / Bouclier — Maille / Plaque","name":"Bouclier runique","power":5,"effect":"1 fois par combat, lorsque le porteur est pris pour cible par une attaque, il peut se placer immédiatement en défense totale jusqu'au début de son prochain tour.","rp":"Les runes supérieures déploient un véritable rempart magique autour du porteur.","example":"Armure gravée de runes de bastion","support":"Armure / Bouclier | Maille / Plaque | Supérieure | Défense active","rarity":"Très rare","status":"Commande COFantasy compatible","mechanism":"Défense réactive","predicates":"","weaponOptions":"","fieldPatch":"!cof-action-defensive totale --reaction --limiteParCombat 1 bouclierRunique_{ITEM_ID}","auto":true,"mode":"ACTION_EQUIPEMENT","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"OUI","undo":"COF_NATIF_RESSOURCE","params":"Défense totale ; réaction lorsqu'il est ciblé ; 1/combat ; expire au début du prochain tour ; ITEM_ID","note":"Syntaxe proposée pour l'extension de la commande existante, pas une nouvelle commande. Ajouter la lecture des options/limiteRessources à !cof-action-defensive et un mode --reaction dont l'expiration est le début du prochain tour du porteur. Défense + utilisation dans le même evt COFantasy ; la liste Objets ne fait que lancer cette commande.","uiFamily":"reaction","compatProfile":"MAILLE_PLAQUE + BOUCLIER","catalogVisible":true,"displayName":"Égide runique","uiTierLabel":"","requiredTagsAny":["shield"]},{"id":"A158","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"+DEF","power":1,"effect":"+1 DEF","rp":"Des renforts placés aux zones vitales améliorent la protection générale.","example":"Cuir renforcé","support":"Armure | Cuir | Normale | Renforcement","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé/tenu","predicates":"bonus_DEF:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Bonus de DEF actif uniquement quand l'objet est équipé/tenu.","uiFamily":"defense","compatProfile":"CUIR","catalogVisible":true,"displayName":"Protection renforcée","uiTierLabel":""},{"id":"A159","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"Discrétion","power":1,"effect":"+3 aux tests de discrétion","rp":"Le cuir traité grince peu et reste discret en mouvement.","example":"Cuir sombre assoupli","support":"Armure | Cuir | Normale | Discrétion","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_discretion:3","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"discretion","compatProfile":"CUIR","catalogVisible":true,"displayName":"Silencieuse","uiTierLabel":""},{"id":"A160","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"Légèreté","power":1,"effect":"Réduit le malus d'armure de 1","rp":"Le cuir est aminci et traité sans perdre sa solidité.","example":"Cuir souple allégé","support":"Armure | Cuir | Normale | Légèreté","rarity":"Rare","status":"Champ armure","mechanism":"Transformation à l'application","predicates":"","weaponOptions":"","fieldPatch":"malusarmure -1","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"À appliquer au champ malus de l'armure ; ce n'est pas un prédicat.","uiFamily":"mobilite","compatProfile":"CUIR","catalogVisible":true,"displayName":"Allègement","uiTierLabel":""},{"id":"A161","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"Mobilité","power":1,"effect":"+1 Initiative, +1 m de déplacement","rp":"Le cuir reste flexible et facilite les départs rapides.","example":"Cuir souple de félin","support":"Armure | Cuir | Normale | Mobilité","rarity":"Rare","status":"Prédicat étendu","mechanism":"Patch COFantasy + feuille","predicates":"bonusInitiative:1\nbonusMouvement:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Initiative gérée par le patch Mod ; mouvement affiché par le sheetworker.","uiFamily":"mobilite","compatProfile":"CUIR","catalogVisible":true,"displayName":"Mobilité","uiTierLabel":""},{"id":"A162","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"RD Acide","power":1,"effect":"RD 2 contre les DM d'terre","rp":"Le tannage à la résine protège le cuir de la corrosion.","example":"Cuir traité à la résine","support":"Armure | Cuir | Normale | Résistance élémentaire","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::acide:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"CUIR","catalogVisible":true,"displayName":"RD Terre","uiTierLabel":"","damageType":"terre"},{"id":"A163","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"RD Contondant","power":1,"effect":"RD 1 contre les DM contondants","rp":"L'épaisseur du cuir amortit les coups contondants.","example":"Cuir épais d'ours","support":"Armure | Cuir | Normale | Résistance physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::contondant:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"CUIR","catalogVisible":true,"displayName":"RD Contondant","uiTierLabel":"","damageType":"contondant"},{"id":"A164","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"RD Feu","power":1,"effect":"RD 2 contre les DM de feu","rp":"Le cuir conserve une résistance naturelle à la chaleur.","example":"Cuir de salamandre","support":"Armure | Cuir | Normale | Résistance élémentaire","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::feu:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"CUIR","catalogVisible":true,"displayName":"RD Feu","uiTierLabel":"","damageType":"feu"},{"id":"A165","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"RD Foudre","power":1,"effect":"RD 2 contre les DM de air","rp":"Les clous de cuivre canalisent la air loin des points vitaux.","example":"Cuir clouté de cuivre","support":"Armure | Cuir | Normale | Résistance élémentaire","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::electrique:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"CUIR","catalogVisible":true,"displayName":"RD Air","uiTierLabel":"","damageType":"air"},{"id":"A166","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"RD Froid","power":1,"effect":"RD 2 contre les DM de eau","rp":"Le cuir garde les propriétés isolantes d'une bête adaptée aux climats glacés.","example":"Cuir de loup des neiges","support":"Armure | Cuir | Normale | Résistance élémentaire","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::froid:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"CUIR","catalogVisible":true,"displayName":"RD Eau","uiTierLabel":"","damageType":"eau"},{"id":"A167","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"RD Perforant","power":1,"effect":"RD 1 contre les DM perforants","rp":"Les clous et renforts rigides dévient les pointes.","example":"Cuir clouté dense","support":"Armure | Cuir | Normale | Résistance physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::percant:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"CUIR","catalogVisible":true,"displayName":"RD Perforant","uiTierLabel":"","damageType":"percant"},{"id":"A168","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"RD Poison","power":1,"effect":"RD 2 contre les DM de toxique","rp":"Le cuir garde une résistance partielle aux venins naturels.","example":"Cuir de vipère géante","support":"Armure | Cuir | Normale | Résistance élémentaire","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::poison:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"CUIR","catalogVisible":true,"displayName":"RD Toxique","uiTierLabel":"","damageType":"toxique"},{"id":"A169","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"RD Tranchant","power":1,"effect":"RD 1 contre les DM tranchants","rp":"Le cuir durci détourne mieux les coups de lame.","example":"Cuir bouilli renforcé","support":"Armure | Cuir | Normale | Résistance physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::tranchant:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"CUIR","catalogVisible":true,"displayName":"RD Tranchant","uiTierLabel":"","damageType":"tranchant"},{"id":"A170","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"+DEF","power":3,"effect":"+2 DEF","rp":"Le cloutage précis et les plaques souples protègent mieux les ouvertures.","example":"Cuir clouté supérieur","support":"Armure | Cuir | Supérieure | Renforcement","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé/tenu","predicates":"bonus_DEF:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Bonus de DEF actif uniquement quand l'objet est équipé/tenu.","uiFamily":"defense","compatProfile":"CUIR","catalogVisible":true,"displayName":"Protection renforcée","uiTierLabel":""},{"id":"A171","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"Bouclier runique","power":3,"effect":"1 fois par combat, lorsque le porteur est pris pour cible par une attaque, il peut se placer immédiatement en défense simple jusqu'au début de son prochain tour.","rp":"Les gravures s'illuminent pour détourner une attaque au moment critique.","example":"Cuir gravé de runes de garde","support":"Armure | Cuir | Normale | Défense active","rarity":"Rare","status":"Commande COFantasy compatible","mechanism":"Défense réactive","predicates":"","weaponOptions":"","fieldPatch":"!cof-action-defensive simple --reaction --limiteParCombat 1 bouclierRunique_{ITEM_ID}","auto":true,"mode":"ACTION_EQUIPEMENT","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"OUI","undo":"COF_NATIF_RESSOURCE","params":"Défense simple ; réaction lorsqu'il est ciblé ; 1/combat ; expire au début du prochain tour ; ITEM_ID","note":"Syntaxe proposée pour l'extension de la commande existante, pas une nouvelle commande. Ajouter la lecture des options/limiteRessources à !cof-action-defensive et un mode --reaction dont l'expiration est le début du prochain tour du porteur. Défense + utilisation dans le même evt COFantasy ; la liste Objets ne fait que lancer cette commande.","uiFamily":"protection","compatProfile":"CUIR","catalogVisible":false,"displayName":"Bouclier runique","uiTierLabel":""},{"id":"A172","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"Discrétion","power":3,"effect":"+5 aux tests de discrétion","rp":"Le cuir est assoupli, matifié et conçu pour les déplacements silencieux.","example":"Cuir de rôdeur nocturne","support":"Armure | Cuir | Supérieure | Discrétion","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_discretion:5","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"discretion","compatProfile":"CUIR","catalogVisible":true,"displayName":"Silencieuse","uiTierLabel":""},{"id":"A173","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"Légèreté","power":3,"effect":"Réduit le malus d'armure de 2","rp":"Le cuir combine souplesse, légèreté et bonne tenue.","example":"Cuir de félin supérieur","support":"Armure | Cuir | Supérieure | Légèreté","rarity":"Très rare","status":"Champ armure","mechanism":"Transformation à l'application","predicates":"","weaponOptions":"","fieldPatch":"malusarmure -2","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"À appliquer au champ malus de l'armure ; ce n'est pas un prédicat.","uiFamily":"mobilite","compatProfile":"CUIR","catalogVisible":true,"displayName":"Allègement","uiTierLabel":""},{"id":"A174","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"Mobilité","power":3,"effect":"+2 Initiative, +2 m de déplacement","rp":"La coupe est pensée pour la chasse, la vitesse et les changements d'appui.","example":"Cuir de rôdeur supérieur","support":"Armure | Cuir | Supérieure | Mobilité","rarity":"Très rare","status":"Prédicat étendu","mechanism":"Patch COFantasy + feuille","predicates":"bonusInitiative:2\nbonusMouvement:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Initiative gérée par le patch Mod ; mouvement affiché par le sheetworker.","uiFamily":"mobilite","compatProfile":"CUIR","catalogVisible":true,"displayName":"Mobilité","uiTierLabel":""},{"id":"A175","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"RD Acide","power":3,"effect":"RD 4 contre les DM d'terre","rp":"Le cuir imprégné de limon stabilisé repousse les projections terres.","example":"Cuir de limon tanné","support":"Armure | Cuir | Supérieure | Résistance élémentaire","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::acide:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"CUIR","catalogVisible":true,"displayName":"RD Terre","uiTierLabel":"","damageType":"terre"},{"id":"A176","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"RD Contondant","power":3,"effect":"RD 2 contre les DM contondants","rp":"Le cuir très dense absorbe mieux les chocs lourds.","example":"Cuir d'ogre tanné","support":"Armure | Cuir | Supérieure | Résistance physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::contondant:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"CUIR","catalogVisible":true,"displayName":"RD Contondant","uiTierLabel":"","damageType":"contondant"},{"id":"A177","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"RD Feu","power":3,"effect":"RD 4 contre les DM de feu","rp":"Le cuir provient d'une créature plus ancienne, dont la peau supportait des chaleurs extrêmes.","example":"Cuir de salamandre ancienne","support":"Armure | Cuir | Supérieure | Résistance élémentaire","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::feu:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"CUIR","catalogVisible":true,"displayName":"RD Feu","uiTierLabel":"","damageType":"feu"},{"id":"A178","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"RD Foudre","power":3,"effect":"RD 4 contre les DM de air","rp":"Les nervures de fulgurite conduisent et dispersent les arcs airs.","example":"Cuir nervuré de fulgurite","support":"Armure | Cuir | Supérieure | Résistance élémentaire","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::electrique:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"CUIR","catalogVisible":true,"displayName":"RD Air","uiTierLabel":"","damageType":"air"},{"id":"A179","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"RD Froid","power":3,"effect":"RD 4 contre les DM de eau","rp":"Le cuir, plus dense, protège efficacement contre les eaus extrêmes.","example":"Cuir de bête polaire ancienne","support":"Armure | Cuir | Supérieure | Résistance élémentaire","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::froid:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"CUIR","catalogVisible":true,"displayName":"RD Eau","uiTierLabel":"","damageType":"eau"},{"id":"A180","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"RD Perforant","power":3,"effect":"RD 2 contre les DM perforants","rp":"Les écailles superposées bloquent mieux flèches et carreaux.","example":"Cuir renforcé d'écailles de bête","support":"Armure | Cuir | Supérieure | Résistance physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::percant:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"CUIR","catalogVisible":true,"displayName":"RD Perforant","uiTierLabel":"","damageType":"percant"},{"id":"A181","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"RD Poison","power":3,"effect":"RD 4 contre les DM de toxique","rp":"La chitine et le cuir traités résistent mieux aux toxines agressives.","example":"Cuir de scorpion géant","support":"Armure | Cuir | Supérieure | Résistance élémentaire","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::poison:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"CUIR","catalogVisible":true,"displayName":"RD Toxique","uiTierLabel":"","damageType":"toxique"},{"id":"A182","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"RD Tranchant","power":3,"effect":"RD 2 contre les DM tranchants","rp":"Le cuir épais et nerveux résiste naturellement aux entailles.","example":"Cuir de sanglier cuirassé","support":"Armure | Cuir | Supérieure | Résistance physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::tranchant:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"CUIR","catalogVisible":true,"displayName":"RD Tranchant","uiTierLabel":"","damageType":"tranchant"},{"id":"A183","category":"Armure / Bouclier","subcategory":"Armure — Cuir","name":"Bouclier runique","power":5,"effect":"1 fois par combat, lorsque le porteur est pris pour cible par une attaque, il peut se placer immédiatement en défense totale jusqu'au début de son prochain tour.","rp":"Les runes supérieures projettent une défense plus complète pendant un bref instant.","example":"Cuir gravé de runes de bastion","support":"Armure | Cuir | Supérieure | Défense active","rarity":"Très rare","status":"Commande COFantasy compatible","mechanism":"Défense réactive","predicates":"","weaponOptions":"","fieldPatch":"!cof-action-defensive totale --reaction --limiteParCombat 1 bouclierRunique_{ITEM_ID}","auto":true,"mode":"ACTION_EQUIPEMENT","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"OUI","undo":"COF_NATIF_RESSOURCE","params":"Défense totale ; réaction lorsqu'il est ciblé ; 1/combat ; expire au début du prochain tour ; ITEM_ID","note":"Syntaxe proposée pour l'extension de la commande existante, pas une nouvelle commande. Ajouter la lecture des options/limiteRessources à !cof-action-defensive et un mode --reaction dont l'expiration est le début du prochain tour du porteur. Défense + utilisation dans le même evt COFantasy ; la liste Objets ne fait que lancer cette commande.","uiFamily":"protection","compatProfile":"CUIR","catalogVisible":false,"displayName":"Bouclier runique","uiTierLabel":""},{"id":"A184","category":"Armure / Bouclier","subcategory":"Armure — Maille / Plaque","name":"Discrétion","power":1,"effect":"+3 aux tests de discrétion","rp":"Les anneaux sont gainés pour limiter les tintements.","example":"Mailles silencieuses","support":"Armure | Maille / Plaque | Normale | Discrétion","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_discretion:3","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"mobilite","compatProfile":"MAILLE_PLAQUE","catalogVisible":false,"displayName":"Discrétion","uiTierLabel":""},{"id":"A185","category":"Armure / Bouclier","subcategory":"Armure — Maille / Plaque","name":"Discrétion","power":3,"effect":"+5 aux tests de discrétion","rp":"Les jointures feutrées réduisent fortement les bruits métalliques.","example":"Plaque aux articulations feutrées","support":"Armure | Maille / Plaque | Supérieure | Discrétion","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_discretion:5","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"mobilite","compatProfile":"MAILLE_PLAQUE","catalogVisible":false,"displayName":"Discrétion","uiTierLabel":""},{"id":"A186","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"+DEF","power":1,"effect":"+1 DEF","rp":"Des fils métalliques protègent les zones vitales sans transformer la robe en armure lourde.","example":"Robe renforcée de fils d'acier","support":"Armure | Tissu | Normale | Renforcement","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé/tenu","predicates":"bonus_DEF:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Bonus de DEF actif uniquement quand l'objet est équipé/tenu.","uiFamily":"defense","compatProfile":"TISSU","catalogVisible":true,"displayName":"Protection renforcée","uiTierLabel":""},{"id":"A187","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"Discrétion","power":1,"effect":"+3 aux tests de discrétion","rp":"Les fibres sombres absorbent les petits bruits et cassent la silhouette.","example":"Tissu d'ombre","support":"Armure | Tissu | Normale | Discrétion","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_discretion:3","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"discretion","compatProfile":"TISSU","catalogVisible":true,"displayName":"Silencieuse","uiTierLabel":""},{"id":"A188","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"Légèreté","power":1,"effect":"Réduit le malus d'armure de 1","rp":"Le tissage réduit la charge portée et limite la gêne.","example":"Tissu allégé","support":"Armure | Tissu | Normale | Légèreté","rarity":"Rare","status":"Champ armure","mechanism":"Transformation à l'application","predicates":"","weaponOptions":"","fieldPatch":"malusarmure -1","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"À appliquer au champ malus de l'armure ; ce n'est pas un prédicat.","uiFamily":"mobilite","compatProfile":"TISSU","catalogVisible":false,"displayName":"Légèreté","uiTierLabel":""},{"id":"A189","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"Mobilité","power":1,"effect":"+1 Initiative, +1 m de déplacement","rp":"La coupe libère les mouvements et permet de réagir plus vite.","example":"Tissu léger de voyage","support":"Armure | Tissu | Normale | Mobilité","rarity":"Rare","status":"Prédicat étendu","mechanism":"Patch COFantasy + feuille","predicates":"bonusInitiative:1\nbonusMouvement:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Initiative gérée par le patch Mod ; mouvement affiché par le sheetworker.","uiFamily":"mobilite","compatProfile":"TISSU","catalogVisible":true,"displayName":"Mobilité","uiTierLabel":""},{"id":"A190","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"RD Acide","power":1,"effect":"RD 2 contre les DM d'terre","rp":"La résine forme une couche protectrice contre les substances corrosives.","example":"Tissu enduit de résine alchimique","support":"Armure | Tissu | Normale | Résistance élémentaire","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::acide:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"TISSU","catalogVisible":true,"displayName":"RD Terre","uiTierLabel":"","damageType":"terre"},{"id":"A191","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"RD Contondant","power":1,"effect":"RD 1 contre les DM contondants","rp":"Le rembourrage absorbe une partie des chocs.","example":"Tissu matelassé épais","support":"Armure | Tissu | Normale | Résistance physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::contondant:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"TISSU","catalogVisible":false,"displayName":"RD Contondant","uiTierLabel":"","damageType":"contondant"},{"id":"A192","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"RD Feu","power":1,"effect":"RD 2 contre les DM de feu","rp":"Les fibres sont traitées avec des cendres alchimiques capables d'étouffer la chaleur.","example":"Tissu de cendre alchimique","support":"Armure | Tissu | Normale | Résistance élémentaire","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::feu:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"TISSU","catalogVisible":true,"displayName":"RD Feu","uiTierLabel":"","damageType":"feu"},{"id":"A193","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"RD Foudre","power":1,"effect":"RD 2 contre les DM de air","rp":"Les fils de cuivre dispersent une partie de l'énergie air.","example":"Tissu brodé de fils de cuivre","support":"Armure | Tissu | Normale | Résistance élémentaire","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::electrique:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"TISSU","catalogVisible":true,"displayName":"RD Air","uiTierLabel":"","damageType":"air"},{"id":"A194","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"RD Froid","power":1,"effect":"RD 2 contre les DM de eau","rp":"La laine épaisse isole naturellement le porteur du eau mordant.","example":"Laine de yéti","support":"Armure | Tissu | Normale | Résistance élémentaire","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::froid:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"TISSU","catalogVisible":true,"displayName":"RD Eau","uiTierLabel":"","damageType":"eau"},{"id":"A195","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"RD Perforant","power":1,"effect":"RD 1 contre les DM perforants","rp":"Les couches superposées freinent les pointes et les projectiles.","example":"Tissu multicouche matelassé","support":"Armure | Tissu | Normale | Résistance physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::percant:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"TISSU","catalogVisible":false,"displayName":"RD Perforant","uiTierLabel":"","damageType":"percant"},{"id":"A196","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"RD Poison","power":1,"effect":"RD 2 contre les DM de toxique","rp":"Les fibres sont préparées avec des poudres et décoctions antitoxiques.","example":"Tissu infusé d'antitoxines","support":"Armure | Tissu | Normale | Résistance élémentaire","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::poison:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"TISSU","catalogVisible":true,"displayName":"RD Toxique","uiTierLabel":"","damageType":"toxique"},{"id":"A197","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"RD Tranchant","power":1,"effect":"RD 1 contre les DM tranchants","rp":"Les fibres métalliques accrochent et ralentissent les lames.","example":"Tissu renforcé de fibres métalliques","support":"Armure | Tissu | Normale | Résistance physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::tranchant:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"TISSU","catalogVisible":false,"displayName":"RD Tranchant","uiTierLabel":"","damageType":"tranchant"},{"id":"A198","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"+DEF","power":3,"effect":"+2 DEF","rp":"Les runes et renforts protègent mieux les points faibles du porteur.","example":"Robe de guerre runique","support":"Armure | Tissu | Supérieure | Renforcement","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé/tenu","predicates":"bonus_DEF:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Bonus de DEF actif uniquement quand l'objet est équipé/tenu.","uiFamily":"defense","compatProfile":"TISSU","catalogVisible":true,"displayName":"Protection renforcée","uiTierLabel":""},{"id":"A199","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"Bouclier runique","power":3,"effect":"1 fois par combat, lorsque le porteur est pris pour cible par une attaque, il peut se placer immédiatement en défense simple jusqu'au début de son prochain tour.","rp":"Les runes se tendent en voile protecteur lorsque le porteur est menacé.","example":"Robe brodée de runes de garde","support":"Armure | Tissu | Normale | Défense active","rarity":"Rare","status":"Commande COFantasy compatible","mechanism":"Défense réactive","predicates":"","weaponOptions":"","fieldPatch":"!cof-action-defensive simple --reaction --limiteParCombat 1 bouclierRunique_{ITEM_ID}","auto":true,"mode":"ACTION_EQUIPEMENT","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"OUI","undo":"COF_NATIF_RESSOURCE","params":"Défense simple ; réaction lorsqu'il est ciblé ; 1/combat ; expire au début du prochain tour ; ITEM_ID","note":"Syntaxe proposée pour l'extension de la commande existante, pas une nouvelle commande. Ajouter la lecture des options/limiteRessources à !cof-action-defensive et un mode --reaction dont l'expiration est le début du prochain tour du porteur. Défense + utilisation dans le même evt COFantasy ; la liste Objets ne fait que lancer cette commande.","uiFamily":"protection","compatProfile":"TISSU","catalogVisible":false,"displayName":"Bouclier runique","uiTierLabel":""},{"id":"A200","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"Discrétion","power":3,"effect":"+5 aux tests de discrétion","rp":"Le tissu étouffe mieux les frottements et se fond dans les zones sombres.","example":"Tissu de nuit profonde","support":"Armure | Tissu | Supérieure | Discrétion","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_discretion:5","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"discretion","compatProfile":"TISSU","catalogVisible":true,"displayName":"Silencieuse","uiTierLabel":""},{"id":"A201","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"Légèreté","power":3,"effect":"Réduit le malus d'armure de 2","rp":"La matière est presque sans poids et suit les mouvements.","example":"Tissu de soie aérienne","support":"Armure | Tissu | Supérieure | Légèreté","rarity":"Très rare","status":"Champ armure","mechanism":"Transformation à l'application","predicates":"","weaponOptions":"","fieldPatch":"malusarmure -2","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"À appliquer au champ malus de l'armure ; ce n'est pas un prédicat.","uiFamily":"mobilite","compatProfile":"TISSU","catalogVisible":false,"displayName":"Légèreté","uiTierLabel":""},{"id":"A202","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"Mobilité","power":3,"effect":"+2 Initiative, +2 m de déplacement","rp":"Le tissu accompagne parfaitement les mouvements du porteur.","example":"Tissu de soie elfique","support":"Armure | Tissu | Supérieure | Mobilité","rarity":"Très rare","status":"Prédicat étendu","mechanism":"Patch COFantasy + feuille","predicates":"bonusInitiative:2\nbonusMouvement:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Initiative gérée par le patch Mod ; mouvement affiché par le sheetworker.","uiFamily":"mobilite","compatProfile":"TISSU","catalogVisible":true,"displayName":"Mobilité","uiTierLabel":""},{"id":"A203","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"RD Acide","power":3,"effect":"RD 4 contre les DM d'terre","rp":"Le vernis alchimique dérivé de limon résiste mieux aux terres.","example":"Tissu verni au limon stabilisé","support":"Armure | Tissu | Supérieure | Résistance élémentaire","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::acide:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"TISSU","catalogVisible":true,"displayName":"RD Terre","uiTierLabel":"","damageType":"terre"},{"id":"A204","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"RD Contondant","power":3,"effect":"RD 2 contre les DM contondants","rp":"Les fibres épaisses et souples dissipent mieux les impacts violents.","example":"Tissu amortissant d'ogre","support":"Armure | Tissu | Supérieure | Résistance physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::contondant:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"TISSU","catalogVisible":false,"displayName":"RD Contondant","uiTierLabel":"","damageType":"contondant"},{"id":"A205","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"RD Feu","power":3,"effect":"RD 4 contre les DM de feu","rp":"Le tissu est renforcé par des fibres minérales issues de zones volcaniques.","example":"Tissu volcanique","support":"Armure | Tissu | Supérieure | Résistance élémentaire","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::feu:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"TISSU","catalogVisible":true,"displayName":"RD Feu","uiTierLabel":"","damageType":"feu"},{"id":"A206","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"RD Foudre","power":3,"effect":"RD 4 contre les DM de air","rp":"La fulgurite stabilisée détourne plus efficacement les décharges.","example":"Tissu brodé de fulgurite","support":"Armure | Tissu | Supérieure | Résistance élémentaire","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::electrique:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"TISSU","catalogVisible":true,"displayName":"RD Air","uiTierLabel":"","damageType":"air"},{"id":"A207","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"RD Froid","power":3,"effect":"RD 4 contre les DM de eau","rp":"Cette laine rare conserve mieux la chaleur, même sous un eau surnaturel.","example":"Laine de yéti blanc","support":"Armure | Tissu | Supérieure | Résistance élémentaire","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::froid:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"TISSU","catalogVisible":true,"displayName":"RD Eau","uiTierLabel":"","damageType":"eau"},{"id":"A208","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"RD Perforant","power":3,"effect":"RD 2 contre les DM perforants","rp":"Les couches renforcées absorbent mieux la pénétration.","example":"Tissu feuilleté de soie d'acier","support":"Armure | Tissu | Supérieure | Résistance physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::percant:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"TISSU","catalogVisible":false,"displayName":"RD Perforant","uiTierLabel":"","damageType":"percant"},{"id":"A209","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"RD Poison","power":3,"effect":"RD 4 contre les DM de toxique","rp":"Le tissage incorpore des plantes rares qui neutralisent mieux les toxines.","example":"Tissu d'herboriste supérieur","support":"Armure | Tissu | Supérieure | Résistance élémentaire","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::poison:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"TISSU","catalogVisible":true,"displayName":"RD Toxique","uiTierLabel":"","damageType":"toxique"},{"id":"A210","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"RD Tranchant","power":3,"effect":"RD 2 contre les DM tranchants","rp":"La soie d'acier forme un tissage très dense contre les coupures.","example":"Tissu de soie d'acier","support":"Armure | Tissu | Supérieure | Résistance physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::tranchant:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"TISSU","catalogVisible":false,"displayName":"RD Tranchant","uiTierLabel":"","damageType":"tranchant"},{"id":"A211","category":"Armure / Bouclier","subcategory":"Armure — Tissu","name":"Bouclier runique","power":5,"effect":"1 fois par combat, lorsque le porteur est pris pour cible par une attaque, il peut se placer immédiatement en défense totale jusqu'au début de son prochain tour.","rp":"Les runes supérieures forment un rempart magique plus dense autour du porteur.","example":"Robe brodée de runes de bastion","support":"Armure | Tissu | Supérieure | Défense active","rarity":"Très rare","status":"Commande COFantasy compatible","mechanism":"Défense réactive","predicates":"","weaponOptions":"","fieldPatch":"!cof-action-defensive totale --reaction --limiteParCombat 1 bouclierRunique_{ITEM_ID}","auto":true,"mode":"ACTION_EQUIPEMENT","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"OUI","undo":"COF_NATIF_RESSOURCE","params":"Défense totale ; réaction lorsqu'il est ciblé ; 1/combat ; expire au début du prochain tour ; ITEM_ID","note":"Syntaxe proposée pour l'extension de la commande existante, pas une nouvelle commande. Ajouter la lecture des options/limiteRessources à !cof-action-defensive et un mode --reaction dont l'expiration est le début du prochain tour du porteur. Défense + utilisation dans le même evt COFantasy ; la liste Objets ne fait que lancer cette commande.","uiFamily":"protection","compatProfile":"TISSU","catalogVisible":false,"displayName":"Bouclier runique","uiTierLabel":""},{"id":"A212","category":"Accessoire","subcategory":"Anneau","name":"Adresse","power":1,"effect":"+2 aux tests de Adresse","rp":"L’anneau affine les gestes et efforts liés à Adresse.","example":"Anneau de Adresse","support":"Anneau | Anneau / bague | Simple | Compétence","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_adresse:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","displayName":"Adresse","uiTierLabel":""},{"id":"A213","category":"Accessoire","subcategory":"Anneau","name":"Athlétisme","power":1,"effect":"+2 aux tests de Athlétisme","rp":"L’anneau affine les gestes et efforts liés à Athlétisme.","example":"Anneau de Athlétisme","support":"Anneau | Anneau / bague | Simple | Compétence","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_athletisme:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","displayName":"Athlétisme","uiTierLabel":""},{"id":"A214","category":"Accessoire","subcategory":"Anneau","name":"Attaque","power":1,"effect":"+1 aux tests d’attaque","rp":"Le cercle guide l’intention offensive du porteur.","example":"Anneau du duelliste","support":"Anneau | Anneau / bague | Simple | Combat","rarity":"Rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonusAttaque:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Nécessite le patch fourni pour appliquer le bonus générique d'attaque.","uiFamily":"combat","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Précision du duelliste","uiGroup":"anneau_attaque","uiTierLabel":"+1 aux tests d’attaque"},{"id":"A215","category":"Accessoire","subcategory":"Anneau","name":"CHA de base","power":1,"effect":"CHA de base : Mod +2","rp":"Le sceau circulaire fixe un seuil minimal pour le modificateur de CHA.","example":"Anneau de présence fixée","support":"Anneau | Anneau / bague | Simple | Caractéristique mentale de base","rarity":"Rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_CHA:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","statKey":"CHA","uiGroup":"anneau_cha_de_base","uiTierLabel":"CHA de base : Mod +2","displayName":"CHA de base"},{"id":"A216","category":"Accessoire","subcategory":"Anneau","name":"CHA en plus","power":1,"effect":"+1 CHA","rp":"Le joyau de l’anneau stimule temporairement la caractéristique CHA.","example":"Anneau du Souverain","support":"Anneau | Anneau / bague | Simple | Caractéristique mentale","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_CHA:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : bonus direct de caractéristique.","displayName":"Présence du Souverain","statKey":"CHA","uiGroup":"anneau_cha_en_plus","uiTierLabel":"+1 CHA"},{"id":"A217","category":"Accessoire","subcategory":"Anneau","name":"CON de base","power":1,"effect":"CON de base : Mod +2","rp":"Le cercle fixe un seuil minimal pour le modificateur de CON.","example":"Anneau de vigueur stable","support":"Anneau | Anneau / bague | Simple | Caractéristique physique de base","rarity":"Rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_CON:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","statKey":"CON","uiGroup":"anneau_con_de_base","uiTierLabel":"CON de base : Mod +2","displayName":"CON de base"},{"id":"A218","category":"Accessoire","subcategory":"Anneau","name":"CON en plus","power":1,"effect":"+1 CON","rp":"La rune interne stimule la caractéristique CON.","example":"Anneau de l’Ours","support":"Anneau | Anneau / bague | Simple | Caractéristique physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_CON:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : bonus direct de caractéristique.","displayName":"Vigueur de l’Ours","statKey":"CON","uiGroup":"anneau_con_en_plus","uiTierLabel":"+1 CON"},{"id":"A219","category":"Accessoire","subcategory":"Anneau","name":"Consommables équipables","power":1,"effect":"+1 consommable équipable","rp":"L’anneau ouvre de petits relais extradimensionnels vers des consommables préparés.","example":"Anneau de réserve simple","support":"Anneau | Anneau / bague | Simple | Consommables","rarity":"Rare","status":"Configurable","mechanism":"Capacité d'emplacement non native","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"PASSIF_ITEM","audit":"ITEMS_SEUL","actionObjects":"NON","undo":"AUCUN","params":"Bonus de slots ; nombre de base à définir","note":"Géré par COFantasy Items uniquement. Le catalogue ne définit pas le nombre de slots de base.","uiFamily":"utilitaire","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","displayName":"Consommables équipables","uiTierLabel":""},{"id":"A220","category":"Accessoire","subcategory":"Anneau","name":"DEF","power":1,"effect":"+1 DEF","rp":"L’anneau provoque de petits réflexes défensifs au bon moment.","example":"Anneau du gardien","support":"Anneau | Anneau / bague | Simple | Défense","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé/tenu","predicates":"bonus_DEF:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Bonus de DEF actif uniquement quand l'objet est équipé/tenu.","uiFamily":"protection","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Égide du gardien","uiGroup":"anneau_def","uiTierLabel":"+1 DEF"},{"id":"A221","category":"Accessoire","subcategory":"Anneau","name":"DEX de base","power":1,"effect":"DEX de base : Mod +2","rp":"Le cercle fixe un seuil minimal pour le modificateur de DEX.","example":"Anneau de agilité stable","support":"Anneau | Anneau / bague | Simple | Caractéristique physique de base","rarity":"Rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_DEX:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","statKey":"DEX","uiGroup":"anneau_dex_de_base","uiTierLabel":"DEX de base : Mod +2","displayName":"DEX de base"},{"id":"A222","category":"Accessoire","subcategory":"Anneau","name":"DEX en plus","power":1,"effect":"+1 DEX","rp":"La rune interne stimule la caractéristique DEX.","example":"Anneau du Félin","support":"Anneau | Anneau / bague | Simple | Caractéristique physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_DEX:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : bonus direct de caractéristique.","displayName":"Grâce du Félin","statKey":"DEX","uiGroup":"anneau_dex_en_plus","uiTierLabel":"+1 DEX"},{"id":"A223","category":"Accessoire","subcategory":"Anneau","name":"Discrétion","power":1,"effect":"+2 aux tests de Discrétion","rp":"Un symbole discret guide les gestes liés à la compétence Discrétion.","example":"Anneau de Discrétion","support":"Anneau | Anneau / bague | Simple | Compétence","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_discretion:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","displayName":"Discrétion","uiTierLabel":""},{"id":"A224","category":"Accessoire","subcategory":"Anneau","name":"du \"Classe\" Novice","power":1,"effect":"Capacité de Classe Rang 1","rp":"Le cercle gravé concentre une technique de classe précise. Remplacer « Classe » par la classe choisie.","example":"d’héritage héroïque","support":"Anneau | Anneau / bague | Novice | Capacité de classe","rarity":"Rare","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","displayName":"Héritage de classe","uiGroup":"heritage_classe_anneau","uiTierLabel":"Rang 1"},{"id":"A225","category":"Accessoire","subcategory":"Anneau","name":"FOR de base","power":1,"effect":"FOR de base : Mod +2","rp":"Le cercle fixe un seuil minimal pour le modificateur de FOR.","example":"Anneau de force stable","support":"Anneau | Anneau / bague | Simple | Caractéristique physique de base","rarity":"Rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_FOR:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","statKey":"FOR","uiGroup":"anneau_for_de_base","uiTierLabel":"FOR de base : Mod +2","displayName":"FOR de base"},{"id":"A226","category":"Accessoire","subcategory":"Anneau","name":"FOR en plus","power":1,"effect":"+1 FOR","rp":"La rune interne stimule la caractéristique FOR.","example":"Anneau du Titan","support":"Anneau | Anneau / bague | Simple | Caractéristique physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_FOR:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : bonus direct de caractéristique.","displayName":"Force du Titan","statKey":"FOR","uiGroup":"anneau_for_en_plus","uiTierLabel":"+1 FOR"},{"id":"A227","category":"Accessoire","subcategory":"Anneau","name":"INT de base","power":1,"effect":"INT de base : Mod +2","rp":"Le sceau circulaire fixe un seuil minimal pour le modificateur de INT.","example":"Anneau de mémoire fixée","support":"Anneau | Anneau / bague | Simple | Caractéristique mentale de base","rarity":"Rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_INT:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","statKey":"INT","uiGroup":"anneau_int_de_base","uiTierLabel":"INT de base : Mod +2","displayName":"INT de base"},{"id":"A228","category":"Accessoire","subcategory":"Anneau","name":"INT en plus","power":1,"effect":"+1 INT","rp":"Le joyau de l’anneau stimule temporairement la caractéristique INT.","example":"Anneau du Sage","support":"Anneau | Anneau / bague | Simple | Caractéristique mentale","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_INT:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : bonus direct de caractéristique.","displayName":"Esprit du Sage","statKey":"INT","uiGroup":"anneau_int_en_plus","uiTierLabel":"+1 INT"},{"id":"A229","category":"Accessoire","subcategory":"Anneau","name":"Mouvement","power":1,"effect":"+1 m de déplacement","rp":"L’anneau synchronise le souffle et les appuis pour avancer plus vite.","example":"Anneau du voyageur","support":"Anneau | Anneau / bague | Simple | Mouvement","rarity":"Rare","status":"Prédicat étendu","mechanism":"Feuille","predicates":"bonusMouvement:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le sheetworker ajoute ce bonus au mouvement affiché.","uiFamily":"mobilite","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : mobilité.","displayName":"Pas du voyageur","uiGroup":"anneau_mouvement","uiTierLabel":"+1 m de déplacement"},{"id":"A230","category":"Accessoire","subcategory":"Anneau","name":"Puissance","power":1,"effect":"+2 aux tests de Puissance","rp":"L’anneau affine les gestes et efforts liés à Puissance.","example":"Anneau de Puissance","support":"Anneau | Anneau / bague | Simple | Compétence","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_puissance:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","displayName":"Puissance","uiTierLabel":""},{"id":"A231","category":"Accessoire","subcategory":"Anneau","name":"RD Acide","power":1,"effect":"RD 2 contre les DM d'terre","rp":"Le cercle réagit aux énergies d'terre et en dissipe une part.","example":"Anneau de l’Égide de l’alchimiste","support":"Anneau | Anneau / bague | Simple | Résistance magique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::acide:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : résistance typée.","displayName":"Égide de l’alchimiste","uiGroup":"anneau_rd_terre","uiTierLabel":"RD 2 contre les DM d'terre","damageType":"terre"},{"id":"A232","category":"Accessoire","subcategory":"Anneau","name":"RD Contondant","power":1,"effect":"RD 2 contre les DM contondants","rp":"Le métal gravé du cercle amortit les DM contondants.","example":"Anneau de l’Égide du roc","support":"Anneau | Anneau / bague | Simple | Résistance physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::contondant:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : résistance typée.","displayName":"Égide du roc","uiGroup":"anneau_rd_contondant","uiTierLabel":"RD 2 contre les DM contondants","damageType":"contondant"},{"id":"A233","category":"Accessoire","subcategory":"Anneau","name":"RD Feu","power":1,"effect":"RD 2 contre les DM de feu","rp":"Le cercle réagit aux énergies de feu et en dissipe une part.","example":"Anneau de l’Égide des braises","support":"Anneau | Anneau / bague | Simple | Résistance magique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::feu:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : résistance typée.","displayName":"Égide des braises","uiGroup":"anneau_rd_feu","uiTierLabel":"RD 2 contre les DM de feu","damageType":"feu"},{"id":"A234","category":"Accessoire","subcategory":"Anneau","name":"RD Foudre","power":1,"effect":"RD 2 contre les DM de air","rp":"Le cercle réagit aux énergies de air et en dissipe une part.","example":"Anneau de l’Égide de l’orage","support":"Anneau | Anneau / bague | Simple | Résistance magique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::electrique:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : résistance typée.","displayName":"Égide de l’orage","uiGroup":"anneau_rd_electrique","uiTierLabel":"RD 2 contre les DM de air","damageType":"electrique"},{"id":"A235","category":"Accessoire","subcategory":"Anneau","name":"RD Froid","power":1,"effect":"RD 2 contre les DM de eau","rp":"Le cercle réagit aux énergies de eau et en dissipe une part.","example":"Anneau de l’Égide du givre","support":"Anneau | Anneau / bague | Simple | Résistance magique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::froid:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : résistance typée.","displayName":"Égide du givre","uiGroup":"anneau_rd_eau","uiTierLabel":"RD 2 contre les DM de eau","damageType":"eau"},{"id":"A236","category":"Accessoire","subcategory":"Anneau","name":"RD Perforant","power":1,"effect":"RD 2 contre les DM perforants","rp":"Le métal gravé du cercle amortit les DM perforants.","example":"Anneau de l’Égide des pointes","support":"Anneau | Anneau / bague | Simple | Résistance physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::percant:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : résistance typée.","displayName":"Égide des pointes","uiGroup":"anneau_rd_percant","uiTierLabel":"RD 2 contre les DM perforants","damageType":"percant"},{"id":"A237","category":"Accessoire","subcategory":"Anneau","name":"RD Poison","power":1,"effect":"RD 2 contre les DM de toxique","rp":"Le cercle réagit aux énergies de toxique et en dissipe une part.","example":"Anneau de l’Égide du serpent","support":"Anneau | Anneau / bague | Simple | Résistance magique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::poison:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : résistance typée.","displayName":"Égide du serpent","uiGroup":"anneau_rd_toxique","uiTierLabel":"RD 2 contre les DM de toxique","damageType":"toxique"},{"id":"A238","category":"Accessoire","subcategory":"Anneau","name":"RD Tranchant","power":1,"effect":"RD 2 contre les DM tranchants","rp":"Le métal gravé du cercle amortit les DM tranchants.","example":"Anneau de l’Égide des lames","support":"Anneau | Anneau / bague | Simple | Résistance physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::tranchant:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : résistance typée.","displayName":"Égide des lames","uiGroup":"anneau_rd_tranchant","uiTierLabel":"RD 2 contre les DM tranchants","damageType":"tranchant"},{"id":"A239","category":"Accessoire","subcategory":"Anneau","name":"Représentation","power":1,"effect":"+2 aux tests de Représentation","rp":"Un symbole discret guide les gestes liés à la compétence Représentation.","example":"Anneau de Représentation","support":"Anneau | Anneau / bague | Simple | Compétence","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_representation:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","displayName":"Représentation","uiTierLabel":""},{"id":"A240","category":"Accessoire","subcategory":"Anneau","name":"Résistance","power":1,"effect":"+2 aux tests de Résistance","rp":"Un symbole discret guide les gestes liés à la compétence Résistance.","example":"Anneau de Résistance","support":"Anneau | Anneau / bague | Simple | Compétence","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_resistance:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","displayName":"Résistance","uiTierLabel":""},{"id":"A241","category":"Accessoire","subcategory":"Anneau","name":"SAG de base","power":1,"effect":"SAG de base : Mod +2","rp":"Le sceau circulaire fixe un seuil minimal pour le modificateur de SAG.","example":"Anneau de sagesse fixée","support":"Anneau | Anneau / bague | Simple | Caractéristique mentale de base","rarity":"Rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_SAG:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","statKey":"SAG","uiGroup":"anneau_sag_de_base","uiTierLabel":"SAG de base : Mod +2","displayName":"SAG de base"},{"id":"A242","category":"Accessoire","subcategory":"Anneau","name":"SAG en plus","power":1,"effect":"+1 SAG","rp":"Le joyau de l’anneau stimule temporairement la caractéristique SAG.","example":"Anneau de l’Oracle","support":"Anneau | Anneau / bague | Simple | Caractéristique mentale","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_SAG:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : bonus direct de caractéristique.","displayName":"Clairvoyance de l’Oracle","statKey":"SAG","uiGroup":"anneau_sag_en_plus","uiTierLabel":"+1 SAG"},{"id":"A243","category":"Accessoire","subcategory":"Anneau","name":"Survie","power":1,"effect":"+2 aux tests de Survie","rp":"Un symbole discret guide les gestes liés à la compétence Survie.","example":"Anneau de Survie","support":"Anneau | Anneau / bague | Simple | Compétence","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_survie:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","displayName":"Survie","uiTierLabel":""},{"id":"A244","category":"Accessoire","subcategory":"Anneau","name":"du \"Classe\" Adepte","power":2,"effect":"Capacité de Classe Rang 2","rp":"Le cercle gravé concentre une technique de classe précise. Remplacer « Classe » par la classe choisie.","example":"d’héritage héroïque","support":"Anneau | Anneau / bague | Adepte | Capacité de classe","rarity":"Très rare","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","displayName":"Héritage de classe","uiGroup":"heritage_classe_anneau","uiTierLabel":"Rang 2"},{"id":"A245","category":"Accessoire","subcategory":"Anneau","name":"Adresse","power":3,"effect":"+4 aux tests de Adresse","rp":"Le cercle runique amplifie plus nettement les tests de Adresse.","example":"Anneau supérieur de Adresse","support":"Anneau | Anneau / bague | Améliorée | Compétence","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_adresse:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","displayName":"Adresse","uiTierLabel":""},{"id":"A246","category":"Accessoire","subcategory":"Anneau","name":"Athlétisme","power":3,"effect":"+4 aux tests de Athlétisme","rp":"Le cercle runique amplifie plus nettement les tests de Athlétisme.","example":"Anneau supérieur de Athlétisme","support":"Anneau | Anneau / bague | Améliorée | Compétence","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_athletisme:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","displayName":"Athlétisme","uiTierLabel":""},{"id":"A247","category":"Accessoire","subcategory":"Anneau","name":"CHA de base","power":3,"effect":"CHA de base : Mod +3","rp":"Le sceau circulaire fixe un seuil minimal pour le modificateur de CHA.","example":"Anneau de présence majeure","support":"Anneau | Anneau / bague | Améliorée | Caractéristique mentale de base","rarity":"Très rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_CHA:3","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","statKey":"CHA","uiGroup":"anneau_cha_de_base","uiTierLabel":"CHA de base : Mod +3","displayName":"CHA de base"},{"id":"A248","category":"Accessoire","subcategory":"Anneau","name":"CHA en plus","power":3,"effect":"+2 CHA","rp":"La gemme taillée renforce plus fortement la caractéristique CHA.","example":"Anneau du Souverain","support":"Anneau | Anneau / bague | Améliorée | Caractéristique mentale","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_CHA:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : bonus direct de caractéristique.","displayName":"Présence du Souverain","statKey":"CHA","uiGroup":"anneau_cha_en_plus","uiTierLabel":"+2 CHA"},{"id":"A249","category":"Accessoire","subcategory":"Anneau","name":"CON de base","power":3,"effect":"CON de base : Mod +3","rp":"Le cercle fixe un seuil minimal pour le modificateur de CON.","example":"Anneau de vigueur majeure","support":"Anneau | Anneau / bague | Améliorée | Caractéristique physique de base","rarity":"Très rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_CON:3","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","statKey":"CON","uiGroup":"anneau_con_de_base","uiTierLabel":"CON de base : Mod +3","displayName":"CON de base"},{"id":"A250","category":"Accessoire","subcategory":"Anneau","name":"CON en plus","power":3,"effect":"+2 CON","rp":"La gemme de l’anneau renforce plus nettement la caractéristique CON.","example":"Anneau de l’Ours","support":"Anneau | Anneau / bague | Améliorée | Caractéristique physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_CON:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : bonus direct de caractéristique.","displayName":"Vigueur de l’Ours","statKey":"CON","uiGroup":"anneau_con_en_plus","uiTierLabel":"+2 CON"},{"id":"A251","category":"Accessoire","subcategory":"Anneau","name":"Consommables équipables","power":3,"effect":"+2 consommable équipable","rp":"L’anneau ouvre de petits relais extradimensionnels vers des consommables préparés.","example":"Anneau de réserve améliorée","support":"Anneau | Anneau / bague | Améliorée | Consommables","rarity":"Très rare","status":"Configurable","mechanism":"Capacité d'emplacement non native","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"PASSIF_ITEM","audit":"ITEMS_SEUL","actionObjects":"NON","undo":"AUCUN","params":"Bonus de slots ; nombre de base à définir","note":"Géré par COFantasy Items uniquement. Le catalogue ne définit pas le nombre de slots de base.","uiFamily":"utilitaire","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","displayName":"Consommables équipables","uiTierLabel":""},{"id":"A252","category":"Accessoire","subcategory":"Anneau","name":"DEF","power":3,"effect":"+2 DEF","rp":"Le cercle réagit aux menaces plus rapidement et améliore la défense.","example":"Anneau du gardien","support":"Anneau | Anneau / bague | Améliorée | Défense","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé/tenu","predicates":"bonus_DEF:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Bonus de DEF actif uniquement quand l'objet est équipé/tenu.","uiFamily":"protection","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Égide du gardien","uiGroup":"anneau_def","uiTierLabel":"+2 DEF"},{"id":"A253","category":"Accessoire","subcategory":"Anneau","name":"DEX de base","power":3,"effect":"DEX de base : Mod +3","rp":"Le cercle fixe un seuil minimal pour le modificateur de DEX.","example":"Anneau de agilité majeure","support":"Anneau | Anneau / bague | Améliorée | Caractéristique physique de base","rarity":"Très rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_DEX:3","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","statKey":"DEX","uiGroup":"anneau_dex_de_base","uiTierLabel":"DEX de base : Mod +3","displayName":"DEX de base"},{"id":"A254","category":"Accessoire","subcategory":"Anneau","name":"DEX en plus","power":3,"effect":"+2 DEX","rp":"La gemme de l’anneau renforce plus nettement la caractéristique DEX.","example":"Anneau du Félin","support":"Anneau | Anneau / bague | Améliorée | Caractéristique physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_DEX:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : bonus direct de caractéristique.","displayName":"Grâce du Félin","statKey":"DEX","uiGroup":"anneau_dex_en_plus","uiTierLabel":"+2 DEX"},{"id":"A255","category":"Accessoire","subcategory":"Anneau","name":"Discrétion","power":3,"effect":"+4 aux tests de Discrétion","rp":"Les gravures plus fines soutiennent fortement les tests de Discrétion.","example":"Anneau supérieur de Discrétion","support":"Anneau | Anneau / bague | Améliorée | Compétence","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_discretion:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","displayName":"Discrétion","uiTierLabel":""},{"id":"A256","category":"Accessoire","subcategory":"Anneau","name":"du \"Classe\" Vétéran","power":3,"effect":"Capacité de Classe Rang 3","rp":"Le cercle gravé concentre une technique de classe précise. Remplacer « Classe » par la classe choisie.","example":"d’héritage héroïque","support":"Anneau | Anneau / bague | Vétéran | Capacité de classe","rarity":"Épique","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","displayName":"Héritage de classe","uiGroup":"heritage_classe_anneau","uiTierLabel":"Rang 3"},{"id":"A257","category":"Accessoire","subcategory":"Anneau","name":"FOR de base","power":3,"effect":"FOR de base : Mod +3","rp":"Le cercle fixe un seuil minimal pour le modificateur de FOR.","example":"Anneau de force majeure","support":"Anneau | Anneau / bague | Améliorée | Caractéristique physique de base","rarity":"Très rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_FOR:3","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","statKey":"FOR","uiGroup":"anneau_for_de_base","uiTierLabel":"FOR de base : Mod +3","displayName":"FOR de base"},{"id":"A258","category":"Accessoire","subcategory":"Anneau","name":"FOR en plus","power":3,"effect":"+2 FOR","rp":"La gemme de l’anneau renforce plus nettement la caractéristique FOR.","example":"Anneau du Titan","support":"Anneau | Anneau / bague | Améliorée | Caractéristique physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_FOR:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : bonus direct de caractéristique.","displayName":"Force du Titan","statKey":"FOR","uiGroup":"anneau_for_en_plus","uiTierLabel":"+2 FOR"},{"id":"A259","category":"Accessoire","subcategory":"Anneau","name":"Immunité immobilisé","power":3,"effect":"Immunité à l’état immobilisé","rp":"Le cercle rompt l’effet qui veut immobiliser le porteur.","example":"Anneau de liberté","support":"Anneau | Anneau / bague | Unique | Immunité d’état","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat d'immunité","predicates":"immunite_immobilise:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"État COFantasy reconnu.","uiFamily":"etat","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : état / immunité.","displayName":"Liberté de mouvement","uiTierLabel":""},{"id":"A260","category":"Accessoire","subcategory":"Anneau","name":"Immunité ralenti","power":3,"effect":"Immunité à l’état ralenti","rp":"L’anneau défait les entraves magiques qui ralentissent le mouvement.","example":"Anneau de vivacité","support":"Anneau | Anneau / bague | Unique | Immunité d’état","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat d'immunité","predicates":"immunite_ralenti:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"État COFantasy reconnu.","uiFamily":"etat","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : état / immunité.","displayName":"Vivacité inaltérable","uiTierLabel":""},{"id":"A261","category":"Accessoire","subcategory":"Anneau","name":"INT de base","power":3,"effect":"INT de base : Mod +3","rp":"Le sceau circulaire fixe un seuil minimal pour le modificateur de INT.","example":"Anneau de mémoire majeure","support":"Anneau | Anneau / bague | Améliorée | Caractéristique mentale de base","rarity":"Très rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_INT:3","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","statKey":"INT","uiGroup":"anneau_int_de_base","uiTierLabel":"INT de base : Mod +3","displayName":"INT de base"},{"id":"A262","category":"Accessoire","subcategory":"Anneau","name":"INT en plus","power":3,"effect":"+2 INT","rp":"La gemme taillée renforce plus fortement la caractéristique INT.","example":"Anneau du Sage","support":"Anneau | Anneau / bague | Améliorée | Caractéristique mentale","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_INT:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : bonus direct de caractéristique.","displayName":"Esprit du Sage","statKey":"INT","uiGroup":"anneau_int_en_plus","uiTierLabel":"+2 INT"},{"id":"A263","category":"Accessoire","subcategory":"Anneau","name":"Mouvement","power":3,"effect":"+3 m de déplacement","rp":"Le cercle libère une impulsion magique à chaque foulée.","example":"Anneau du voyageur","support":"Anneau | Anneau / bague | Améliorée | Mouvement","rarity":"Très rare","status":"Prédicat étendu","mechanism":"Feuille","predicates":"bonusMouvement:3","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le sheetworker ajoute ce bonus au mouvement affiché.","uiFamily":"mobilite","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : mobilité.","displayName":"Pas du voyageur","uiGroup":"anneau_mouvement","uiTierLabel":"+3 m de déplacement"},{"id":"A264","category":"Accessoire","subcategory":"Anneau","name":"Puissance","power":3,"effect":"+4 aux tests de Puissance","rp":"Le cercle runique amplifie plus nettement les tests de Puissance.","example":"Anneau supérieur de Puissance","support":"Anneau | Anneau / bague | Améliorée | Compétence","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_puissance:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","displayName":"Puissance","uiTierLabel":""},{"id":"A265","category":"Accessoire","subcategory":"Anneau","name":"RD Acide","power":3,"effect":"RD 4 contre les DM d'terre","rp":"Le cercle gravé absorbe plus efficacement les énergies d'terre.","example":"Anneau de l’Égide de l’alchimiste","support":"Anneau | Anneau / bague | Améliorée | Résistance magique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::acide:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : résistance typée.","displayName":"Égide de l’alchimiste","uiGroup":"anneau_rd_terre","uiTierLabel":"RD 4 contre les DM d'terre","damageType":"terre"},{"id":"A266","category":"Accessoire","subcategory":"Anneau","name":"RD Contondant","power":3,"effect":"RD 4 contre les DM contondants","rp":"Ses runes resserrées protègent davantage contre les DM contondants.","example":"Anneau de l’Égide du roc","support":"Anneau | Anneau / bague | Améliorée | Résistance physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::contondant:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : résistance typée.","displayName":"Égide du roc","uiGroup":"anneau_rd_contondant","uiTierLabel":"RD 4 contre les DM contondants","damageType":"contondant"},{"id":"A267","category":"Accessoire","subcategory":"Anneau","name":"RD Feu","power":3,"effect":"RD 4 contre les DM de feu","rp":"Le cercle gravé absorbe plus efficacement les énergies de feu.","example":"Anneau de l’Égide des braises","support":"Anneau | Anneau / bague | Améliorée | Résistance magique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::feu:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : résistance typée.","displayName":"Égide des braises","uiGroup":"anneau_rd_feu","uiTierLabel":"RD 4 contre les DM de feu","damageType":"feu"},{"id":"A268","category":"Accessoire","subcategory":"Anneau","name":"RD Foudre","power":3,"effect":"RD 4 contre les DM de air","rp":"Le cercle gravé absorbe plus efficacement les énergies de air.","example":"Anneau de l’Égide de l’orage","support":"Anneau | Anneau / bague | Améliorée | Résistance magique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::electrique:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : résistance typée.","displayName":"Égide de l’orage","uiGroup":"anneau_rd_electrique","uiTierLabel":"RD 4 contre les DM de air","damageType":"electrique"},{"id":"A269","category":"Accessoire","subcategory":"Anneau","name":"RD Froid","power":3,"effect":"RD 4 contre les DM de eau","rp":"Le cercle gravé absorbe plus efficacement les énergies de eau.","example":"Anneau de l’Égide du givre","support":"Anneau | Anneau / bague | Améliorée | Résistance magique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::froid:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : résistance typée.","displayName":"Égide du givre","uiGroup":"anneau_rd_eau","uiTierLabel":"RD 4 contre les DM de eau","damageType":"eau"},{"id":"A270","category":"Accessoire","subcategory":"Anneau","name":"RD Perforant","power":3,"effect":"RD 4 contre les DM perforants","rp":"Ses runes resserrées protègent davantage contre les DM perforants.","example":"Anneau de l’Égide des pointes","support":"Anneau | Anneau / bague | Améliorée | Résistance physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::percant:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : résistance typée.","displayName":"Égide des pointes","uiGroup":"anneau_rd_percant","uiTierLabel":"RD 4 contre les DM perforants","damageType":"percant"},{"id":"A271","category":"Accessoire","subcategory":"Anneau","name":"RD Poison","power":3,"effect":"RD 4 contre les DM de toxique","rp":"Le cercle gravé absorbe plus efficacement les énergies de toxique.","example":"Anneau de l’Égide du serpent","support":"Anneau | Anneau / bague | Améliorée | Résistance magique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::poison:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : résistance typée.","displayName":"Égide du serpent","uiGroup":"anneau_rd_toxique","uiTierLabel":"RD 4 contre les DM de toxique","damageType":"toxique"},{"id":"A272","category":"Accessoire","subcategory":"Anneau","name":"RD Tranchant","power":3,"effect":"RD 4 contre les DM tranchants","rp":"Ses runes resserrées protègent davantage contre les DM tranchants.","example":"Anneau de l’Égide des lames","support":"Anneau | Anneau / bague | Améliorée | Résistance physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::tranchant:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : résistance typée.","displayName":"Égide des lames","uiGroup":"anneau_rd_tranchant","uiTierLabel":"RD 4 contre les DM tranchants","damageType":"tranchant"},{"id":"A273","category":"Accessoire","subcategory":"Anneau","name":"Représentation","power":3,"effect":"+4 aux tests de Représentation","rp":"Les gravures plus fines soutiennent fortement les tests de Représentation.","example":"Anneau supérieur de Représentation","support":"Anneau | Anneau / bague | Améliorée | Compétence","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_representation:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","displayName":"Représentation","uiTierLabel":""},{"id":"A274","category":"Accessoire","subcategory":"Anneau","name":"Résistance","power":3,"effect":"+4 aux tests de Résistance","rp":"Les gravures plus fines soutiennent fortement les tests de Résistance.","example":"Anneau supérieur de Résistance","support":"Anneau | Anneau / bague | Améliorée | Compétence","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_resistance:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","displayName":"Résistance","uiTierLabel":""},{"id":"A275","category":"Accessoire","subcategory":"Anneau","name":"SAG de base","power":3,"effect":"SAG de base : Mod +3","rp":"Le sceau circulaire fixe un seuil minimal pour le modificateur de SAG.","example":"Anneau de sagesse majeure","support":"Anneau | Anneau / bague | Améliorée | Caractéristique mentale de base","rarity":"Très rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_SAG:3","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","statKey":"SAG","uiGroup":"anneau_sag_de_base","uiTierLabel":"SAG de base : Mod +3","displayName":"SAG de base"},{"id":"A276","category":"Accessoire","subcategory":"Anneau","name":"SAG en plus","power":3,"effect":"+2 SAG","rp":"La gemme taillée renforce plus fortement la caractéristique SAG.","example":"Anneau de l’Oracle","support":"Anneau | Anneau / bague | Améliorée | Caractéristique mentale","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_SAG:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":true,"catalogNote":"Réactivé v9 : bonus direct de caractéristique.","displayName":"Clairvoyance de l’Oracle","statKey":"SAG","uiGroup":"anneau_sag_en_plus","uiTierLabel":"+2 SAG"},{"id":"A277","category":"Accessoire","subcategory":"Anneau","name":"Survie","power":3,"effect":"+4 aux tests de Survie","rp":"Les gravures plus fines soutiennent fortement les tests de Survie.","example":"Anneau supérieur de Survie","support":"Anneau | Anneau / bague | Améliorée | Compétence","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_survie:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","displayName":"Survie","uiTierLabel":""},{"id":"A278","category":"Accessoire","subcategory":"Anneau","name":"Attaque","power":4,"effect":"+2 aux tests d’attaque","rp":"Les runes de l’anneau renforcent la précision offensive.","example":"Anneau du duelliste","support":"Anneau | Anneau / bague | Améliorée | Combat","rarity":"Très rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonusAttaque:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Nécessite le patch fourni pour appliquer le bonus générique d'attaque.","uiFamily":"combat","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Précision du duelliste","uiGroup":"anneau_attaque","uiTierLabel":"+2 aux tests d’attaque"},{"id":"A279","category":"Accessoire","subcategory":"Anneau","name":"du \"Classe\" Maître","power":4,"effect":"Capacité de Classe Rang 4","rp":"Le cercle gravé concentre une technique de classe précise. Remplacer « Classe » par la classe choisie.","example":"d’héritage héroïque","support":"Anneau | Anneau / bague | Maître | Capacité de classe","rarity":"Légendaire","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","displayName":"Héritage de classe","uiGroup":"heritage_classe_anneau","uiTierLabel":"Rang 4"},{"id":"A280","category":"Accessoire","subcategory":"Anneau","name":"CHA de base","power":5,"effect":"CHA de base : Mod +4","rp":"Le sceau circulaire fixe un seuil minimal pour le modificateur de CHA.","example":"Anneau de présence légendaire","support":"Anneau | Anneau / bague | Légendaire | Caractéristique mentale de base","rarity":"Légendaire","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_CHA:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","statKey":"CHA","uiGroup":"anneau_cha_de_base","uiTierLabel":"CHA de base : Mod +4","displayName":"CHA de base"},{"id":"A281","category":"Accessoire","subcategory":"Anneau","name":"CON de base","power":5,"effect":"CON de base : Mod +4","rp":"Le cercle fixe un seuil minimal pour le modificateur de CON.","example":"Anneau de vigueur légendaire","support":"Anneau | Anneau / bague | Légendaire | Caractéristique physique de base","rarity":"Légendaire","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_CON:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","statKey":"CON","uiGroup":"anneau_con_de_base","uiTierLabel":"CON de base : Mod +4","displayName":"CON de base"},{"id":"A282","category":"Accessoire","subcategory":"Anneau","name":"Consommables équipables","power":5,"effect":"+3 consommable équipable","rp":"L’anneau ouvre de petits relais extradimensionnels vers des consommables préparés.","example":"Anneau de réserve légendaire","support":"Anneau | Anneau / bague | Légendaire | Consommables","rarity":"Légendaire","status":"Configurable","mechanism":"Capacité d'emplacement non native","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"PASSIF_ITEM","audit":"ITEMS_SEUL","actionObjects":"NON","undo":"AUCUN","params":"Bonus de slots ; nombre de base à définir","note":"Géré par COFantasy Items uniquement. Le catalogue ne définit pas le nombre de slots de base.","uiFamily":"utilitaire","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","displayName":"Consommables équipables","uiTierLabel":""},{"id":"A283","category":"Accessoire","subcategory":"Anneau","name":"DEX de base","power":5,"effect":"DEX de base : Mod +4","rp":"Le cercle fixe un seuil minimal pour le modificateur de DEX.","example":"Anneau de agilité légendaire","support":"Anneau | Anneau / bague | Légendaire | Caractéristique physique de base","rarity":"Légendaire","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_DEX:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","statKey":"DEX","uiGroup":"anneau_dex_de_base","uiTierLabel":"DEX de base : Mod +4","displayName":"DEX de base"},{"id":"A284","category":"Accessoire","subcategory":"Anneau","name":"du \"Classe\" Légendaire","power":5,"effect":"Capacité de Classe Rang 5","rp":"Le cercle gravé concentre une technique de classe précise. Remplacer « Classe » par la classe choisie.","example":"d’héritage héroïque","support":"Anneau | Anneau / bague | Légendaire | Capacité de classe","rarity":"Mythique","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","displayName":"Héritage de classe","uiGroup":"heritage_classe_anneau","uiTierLabel":"Rang 5"},{"id":"A285","category":"Accessoire","subcategory":"Anneau","name":"FOR de base","power":5,"effect":"FOR de base : Mod +4","rp":"Le cercle fixe un seuil minimal pour le modificateur de FOR.","example":"Anneau de force légendaire","support":"Anneau | Anneau / bague | Légendaire | Caractéristique physique de base","rarity":"Légendaire","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_FOR:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","statKey":"FOR","uiGroup":"anneau_for_de_base","uiTierLabel":"FOR de base : Mod +4","displayName":"FOR de base"},{"id":"A286","category":"Accessoire","subcategory":"Anneau","name":"INT de base","power":5,"effect":"INT de base : Mod +4","rp":"Le sceau circulaire fixe un seuil minimal pour le modificateur de INT.","example":"Anneau de mémoire légendaire","support":"Anneau | Anneau / bague | Légendaire | Caractéristique mentale de base","rarity":"Légendaire","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_INT:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","statKey":"INT","uiGroup":"anneau_int_de_base","uiTierLabel":"INT de base : Mod +4","displayName":"INT de base"},{"id":"A287","category":"Accessoire","subcategory":"Anneau","name":"SAG de base","power":5,"effect":"SAG de base : Mod +4","rp":"Le sceau circulaire fixe un seuil minimal pour le modificateur de SAG.","example":"Anneau de sagesse légendaire","support":"Anneau | Anneau / bague | Légendaire | Caractéristique mentale de base","rarity":"Légendaire","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_SAG:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"ANNEAU","catalogVisible":false,"catalogNote":"Retiré du menu Anneau : effet redondant ou mieux associé à un autre emplacement.","statKey":"SAG","uiGroup":"anneau_sag_de_base","uiTierLabel":"SAG de base : Mod +4","displayName":"SAG de base"},{"id":"A288","category":"Accessoire","subcategory":"Ceinture","name":"CON de base","power":1,"effect":"CON de base : Mod +2","rp":"La ceinture fixe un seuil corporel stable : la caractéristique CON ne peut descendre sous ce modificateur.","example":"Ceinture de vigueur stable","support":"Ceinture | Ceinture / baudrier | Simple | Caractéristique physique de base","rarity":"Rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_CON:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"CEINTURE","catalogVisible":true,"statKey":"CON","uiGroup":"ceinture_con_de_base","uiTierLabel":"CON de base : Mod +2","displayName":"CON de base"},{"id":"A289","category":"Accessoire","subcategory":"Ceinture","name":"CON en plus","power":1,"effect":"+1 CON","rp":"La ceinture soutient le souffle et la résistance du corps.","example":"Ceinture d’endurance","support":"Ceinture | Ceinture / baudrier | Simple | Caractéristique physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_CON:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"CEINTURE","catalogVisible":true,"statKey":"CON","uiGroup":"ceinture_con_en_plus","uiTierLabel":"+1 CON","displayName":"CON en plus"},{"id":"A290","category":"Accessoire","subcategory":"Ceinture","name":"Consommables équipables","power":1,"effect":"+1 consommable équipable","rp":"Des passants enchantés maintiennent un consommable toujours à portée de main.","example":"Ceinture à fioles rapides","support":"Ceinture | Ceinture / baudrier | Simple | Consommables","rarity":"Rare","status":"Configurable","mechanism":"Capacité d'emplacement non native","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"PASSIF_ITEM","audit":"ITEMS_SEUL","actionObjects":"NON","undo":"AUCUN","params":"Bonus de slots ; nombre de base à définir","note":"Géré par COFantasy Items uniquement. Le catalogue ne définit pas le nombre de slots de base.","uiFamily":"utilitaire","compatProfile":"CEINTURE","catalogVisible":true,"displayName":"Consommables équipables","uiTierLabel":""},{"id":"A291","category":"Accessoire","subcategory":"Ceinture","name":"DEX de base","power":1,"effect":"DEX de base : Mod +2","rp":"La ceinture fixe un seuil corporel stable : la caractéristique DEX ne peut descendre sous ce modificateur.","example":"Ceinture de agilité stable","support":"Ceinture | Ceinture / baudrier | Simple | Caractéristique physique de base","rarity":"Rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_DEX:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"CEINTURE","catalogVisible":true,"statKey":"DEX","uiGroup":"ceinture_dex_de_base","uiTierLabel":"DEX de base : Mod +2","displayName":"DEX de base"},{"id":"A292","category":"Accessoire","subcategory":"Ceinture","name":"DEX en plus","power":1,"effect":"+1 DEX","rp":"Le cuir souple accompagne les hanches et améliore l’agilité.","example":"Ceinture du félin","support":"Ceinture | Ceinture / baudrier | Simple | Caractéristique physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_DEX:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"CEINTURE","catalogVisible":true,"statKey":"DEX","uiGroup":"ceinture_dex_en_plus","uiTierLabel":"+1 DEX","displayName":"DEX en plus"},{"id":"A293","category":"Accessoire","subcategory":"Ceinture","name":"FOR de base","power":1,"effect":"FOR de base : Mod +2","rp":"La ceinture fixe un seuil corporel stable : la caractéristique FOR ne peut descendre sous ce modificateur.","example":"Ceinture de force stable","support":"Ceinture | Ceinture / baudrier | Simple | Caractéristique physique de base","rarity":"Rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_FOR:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"CEINTURE","catalogVisible":true,"statKey":"FOR","uiGroup":"ceinture_for_de_base","uiTierLabel":"FOR de base : Mod +2","displayName":"FOR de base"},{"id":"A294","category":"Accessoire","subcategory":"Ceinture","name":"FOR en plus","power":1,"effect":"+1 FOR","rp":"La boucle concentre l’effort et aide le porteur à mobiliser ses muscles.","example":"Ceinture de puissance","support":"Ceinture | Ceinture / baudrier | Simple | Caractéristique physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_FOR:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"CEINTURE","catalogVisible":true,"statKey":"FOR","uiGroup":"ceinture_for_en_plus","uiTierLabel":"+1 FOR","displayName":"FOR en plus"},{"id":"A295","category":"Accessoire","subcategory":"Ceinture","name":"CON de base","power":3,"effect":"CON de base : Mod +3","rp":"La ceinture fixe un seuil corporel stable : la caractéristique CON ne peut descendre sous ce modificateur.","example":"Ceinture de vigueur majeure","support":"Ceinture | Ceinture / baudrier | Améliorée | Caractéristique physique de base","rarity":"Très rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_CON:3","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"CEINTURE","catalogVisible":true,"statKey":"CON","uiGroup":"ceinture_con_de_base","uiTierLabel":"CON de base : Mod +3","displayName":"CON de base"},{"id":"A296","category":"Accessoire","subcategory":"Ceinture","name":"CON en plus","power":3,"effect":"+2 CON","rp":"La ceinture soutient le souffle et la résistance du corps. Le cuir renforcé tient la magie sans se déformer.","example":"Ceinture de vigueur profonde","support":"Ceinture | Ceinture / baudrier | Améliorée | Caractéristique physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_CON:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"CEINTURE","catalogVisible":true,"statKey":"CON","uiGroup":"ceinture_con_en_plus","uiTierLabel":"+2 CON","displayName":"CON en plus"},{"id":"A297","category":"Accessoire","subcategory":"Ceinture","name":"Consommables équipables","power":3,"effect":"+2 consommable équipable","rp":"Les attaches se réorganisent pour présenter deux consommables sans gêner le mouvement.","example":"Ceinture de terrain renforcée","support":"Ceinture | Ceinture / baudrier | Améliorée | Consommables","rarity":"Très rare","status":"Configurable","mechanism":"Capacité d'emplacement non native","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"PASSIF_ITEM","audit":"ITEMS_SEUL","actionObjects":"NON","undo":"AUCUN","params":"Bonus de slots ; nombre de base à définir","note":"Géré par COFantasy Items uniquement. Le catalogue ne définit pas le nombre de slots de base.","uiFamily":"utilitaire","compatProfile":"CEINTURE","catalogVisible":true,"displayName":"Consommables équipables","uiTierLabel":""},{"id":"A298","category":"Accessoire","subcategory":"Ceinture","name":"DEX de base","power":3,"effect":"DEX de base : Mod +3","rp":"La ceinture fixe un seuil corporel stable : la caractéristique DEX ne peut descendre sous ce modificateur.","example":"Ceinture de agilité majeure","support":"Ceinture | Ceinture / baudrier | Améliorée | Caractéristique physique de base","rarity":"Très rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_DEX:3","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"CEINTURE","catalogVisible":true,"statKey":"DEX","uiGroup":"ceinture_dex_de_base","uiTierLabel":"DEX de base : Mod +3","displayName":"DEX de base"},{"id":"A299","category":"Accessoire","subcategory":"Ceinture","name":"DEX en plus","power":3,"effect":"+2 DEX","rp":"Le cuir souple accompagne les hanches et améliore l’agilité. Le cuir renforcé tient la magie sans se déformer.","example":"Ceinture du grand félin","support":"Ceinture | Ceinture / baudrier | Améliorée | Caractéristique physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_DEX:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"CEINTURE","catalogVisible":true,"statKey":"DEX","uiGroup":"ceinture_dex_en_plus","uiTierLabel":"+2 DEX","displayName":"DEX en plus"},{"id":"A300","category":"Accessoire","subcategory":"Ceinture","name":"FOR de base","power":3,"effect":"FOR de base : Mod +3","rp":"La ceinture fixe un seuil corporel stable : la caractéristique FOR ne peut descendre sous ce modificateur.","example":"Ceinture de force majeure","support":"Ceinture | Ceinture / baudrier | Améliorée | Caractéristique physique de base","rarity":"Très rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_FOR:3","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"CEINTURE","catalogVisible":true,"statKey":"FOR","uiGroup":"ceinture_for_de_base","uiTierLabel":"FOR de base : Mod +3","displayName":"FOR de base"},{"id":"A301","category":"Accessoire","subcategory":"Ceinture","name":"FOR en plus","power":3,"effect":"+2 FOR","rp":"La boucle concentre l’effort et aide le porteur à mobiliser ses muscles. Le cuir renforcé tient la magie sans se déformer.","example":"Ceinture de force héroïque","support":"Ceinture | Ceinture / baudrier | Améliorée | Caractéristique physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_FOR:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"CEINTURE","catalogVisible":true,"statKey":"FOR","uiGroup":"ceinture_for_en_plus","uiTierLabel":"+2 FOR","displayName":"FOR en plus"},{"id":"A302","category":"Accessoire","subcategory":"Ceinture","name":"CON de base","power":5,"effect":"CON de base : Mod +4","rp":"La ceinture fixe un seuil corporel stable : la caractéristique CON ne peut descendre sous ce modificateur.","example":"Ceinture de vigueur légendaire","support":"Ceinture | Ceinture / baudrier | Légendaire | Caractéristique physique de base","rarity":"Légendaire","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_CON:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"CEINTURE","catalogVisible":true,"statKey":"CON","uiGroup":"ceinture_con_de_base","uiTierLabel":"CON de base : Mod +4","displayName":"CON de base"},{"id":"A303","category":"Accessoire","subcategory":"Ceinture","name":"Consommables équipables","power":5,"effect":"+3 consommable équipable","rp":"La ceinture déploie ses compartiments au besoin comme un véritable nécessaire d’aventurier.","example":"Ceinture de l’intendant héroïque","support":"Ceinture | Ceinture / baudrier | Légendaire | Consommables","rarity":"Légendaire","status":"Configurable","mechanism":"Capacité d'emplacement non native","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"PASSIF_ITEM","audit":"ITEMS_SEUL","actionObjects":"NON","undo":"AUCUN","params":"Bonus de slots ; nombre de base à définir","note":"Géré par COFantasy Items uniquement. Le catalogue ne définit pas le nombre de slots de base.","uiFamily":"utilitaire","compatProfile":"CEINTURE","catalogVisible":true,"displayName":"Consommables équipables","uiTierLabel":""},{"id":"A304","category":"Accessoire","subcategory":"Ceinture","name":"DEX de base","power":5,"effect":"DEX de base : Mod +4","rp":"La ceinture fixe un seuil corporel stable : la caractéristique DEX ne peut descendre sous ce modificateur.","example":"Ceinture de agilité légendaire","support":"Ceinture | Ceinture / baudrier | Légendaire | Caractéristique physique de base","rarity":"Légendaire","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_DEX:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"CEINTURE","catalogVisible":true,"statKey":"DEX","uiGroup":"ceinture_dex_de_base","uiTierLabel":"DEX de base : Mod +4","displayName":"DEX de base"},{"id":"A305","category":"Accessoire","subcategory":"Ceinture","name":"FOR de base","power":5,"effect":"FOR de base : Mod +4","rp":"La ceinture fixe un seuil corporel stable : la caractéristique FOR ne peut descendre sous ce modificateur.","example":"Ceinture de force légendaire","support":"Ceinture | Ceinture / baudrier | Légendaire | Caractéristique physique de base","rarity":"Légendaire","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_FOR:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"CEINTURE","catalogVisible":true,"statKey":"FOR","uiGroup":"ceinture_for_de_base","uiTierLabel":"FOR de base : Mod +4","displayName":"FOR de base"},{"id":"A306","category":"Accessoire","subcategory":"Cou","name":"du \"Classe\" Novice","power":1,"effect":"Capacité de Classe Rang 1","rp":"L’amulette portée près du cœur sert de relais à une parcelle du style de combat ou du savoir d’une classe. Remplacer « Classe » par la classe choisie.","example":"d’héritage héroïque","support":"Cou | Collier / amulette | Novice | Capacité de classe","rarity":"Rare","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"COU","catalogVisible":true,"displayName":"Héritage de classe","uiGroup":"heritage_classe_cou","uiTierLabel":"Rang 1"},{"id":"A307","category":"Accessoire","subcategory":"Cou","name":"du \"Classe\" Adepte","power":2,"effect":"Capacité de Classe Rang 2","rp":"L’amulette portée près du cœur sert de relais à une parcelle du style de combat ou du savoir d’une classe. Remplacer « Classe » par la classe choisie.","example":"d’héritage héroïque","support":"Cou | Collier / amulette | Adepte | Capacité de classe","rarity":"Très rare","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"COU","catalogVisible":true,"displayName":"Héritage de classe","uiGroup":"heritage_classe_cou","uiTierLabel":"Rang 2"},{"id":"A308","category":"Accessoire","subcategory":"Cou","name":"du \"Classe\" Vétéran","power":3,"effect":"Capacité de Classe Rang 3","rp":"L’amulette portée près du cœur sert de relais à une parcelle du style de combat ou du savoir d’une classe. Remplacer « Classe » par la classe choisie.","example":"d’héritage héroïque","support":"Cou | Collier / amulette | Vétéran | Capacité de classe","rarity":"Épique","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"COU","catalogVisible":true,"displayName":"Héritage de classe","uiGroup":"heritage_classe_cou","uiTierLabel":"Rang 3"},{"id":"A309","category":"Accessoire","subcategory":"Cou","name":"du \"Classe\" Maître","power":4,"effect":"Capacité de Classe Rang 4","rp":"L’amulette portée près du cœur sert de relais à une parcelle du style de combat ou du savoir d’une classe. Remplacer « Classe » par la classe choisie.","example":"d’héritage héroïque","support":"Cou | Collier / amulette | Maître | Capacité de classe","rarity":"Légendaire","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"COU","catalogVisible":true,"displayName":"Héritage de classe","uiGroup":"heritage_classe_cou","uiTierLabel":"Rang 4"},{"id":"A310","category":"Accessoire","subcategory":"Cou","name":"du \"Classe\" Légendaire","power":5,"effect":"Capacité de Classe Rang 5","rp":"L’amulette portée près du cœur sert de relais à une parcelle du style de combat ou du savoir d’une classe. Remplacer « Classe » par la classe choisie.","example":"d’héritage héroïque","support":"Cou | Collier / amulette | Légendaire | Capacité de classe","rarity":"Mythique","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"COU","catalogVisible":true,"displayName":"Héritage de classe","uiGroup":"heritage_classe_cou","uiTierLabel":"Rang 5"},{"id":"A311","category":"Accessoire","subcategory":"Dos","name":"Discrétion","power":1,"effect":"+2 aux tests de Discrétion","rp":"La cape étouffe les froissements et casse la silhouette.","example":"Cape d’ombre feutrée","support":"Dos | Cape / manteau | Simple | Compétence","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_discretion:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"DOS","catalogVisible":true,"displayName":"Discrétion","uiTierLabel":""},{"id":"A312","category":"Accessoire","subcategory":"Dos","name":"RD Acide","power":1,"effect":"RD 2 contre les DM d'terre","rp":"La résine alchimique empêche les projections corrosives de ronger le tissu.","example":"Cape à résine vitrifiée","support":"Dos | Cape / manteau | Simple | Résistance magique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::acide:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"DOS","catalogVisible":true,"uiGroup":"dos_rd_terre","uiTierLabel":"RD 2 contre les DM d'terre","displayName":"RD Terre","damageType":"terre"},{"id":"A313","category":"Accessoire","subcategory":"Dos","name":"RD Feu","power":1,"effect":"RD 2 contre les DM de feu","rp":"Les fibres sont saupoudrées de cendres alchimiques qui étouffent les flammes.","example":"Cape de cendres froides","support":"Dos | Cape / manteau | Simple | Résistance magique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::feu:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"DOS","catalogVisible":true,"uiGroup":"dos_rd_feu","uiTierLabel":"RD 2 contre les DM de feu","displayName":"RD Feu","damageType":"feu"},{"id":"A314","category":"Accessoire","subcategory":"Dos","name":"RD Foudre","power":1,"effect":"RD 2 contre les DM de air","rp":"Le cuivre détourne une partie de l’énergie air.","example":"Cape aux fils de cuivre","support":"Dos | Cape / manteau | Simple | Résistance magique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::electrique:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"DOS","catalogVisible":true,"uiGroup":"dos_rd_electrique","uiTierLabel":"RD 2 contre les DM de air","displayName":"RD Air","damageType":"air"},{"id":"A315","category":"Accessoire","subcategory":"Dos","name":"RD Froid","power":1,"effect":"RD 2 contre les DM de eau","rp":"La doublure garde la chaleur du corps même sous un eau mordant.","example":"Cape doublée de laine blanche","support":"Dos | Cape / manteau | Simple | Résistance magique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::froid:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"DOS","catalogVisible":true,"uiGroup":"dos_rd_eau","uiTierLabel":"RD 2 contre les DM de eau","displayName":"RD Eau","damageType":"eau"},{"id":"A316","category":"Accessoire","subcategory":"Dos","name":"RD Poison","power":1,"effect":"RD 2 contre les DM de toxique","rp":"Les fibres portent des poudres et baumes qui ralentissent les toxines.","example":"Cape d’herboriste antitoxique","support":"Dos | Cape / manteau | Simple | Résistance magique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::poison:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"DOS","catalogVisible":true,"uiGroup":"dos_rd_toxique","uiTierLabel":"RD 2 contre les DM de toxique","displayName":"RD Toxique","damageType":"toxique"},{"id":"A317","category":"Accessoire","subcategory":"Dos","name":"Représentation","power":1,"effect":"+2 aux tests de Représentation","rp":"Ses broderies captent le regard et accompagnent les gestes du porteur.","example":"Manteau de scène","support":"Dos | Cape / manteau | Simple | Compétence","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_representation:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"DOS","catalogVisible":true,"displayName":"Représentation","uiTierLabel":""},{"id":"A318","category":"Accessoire","subcategory":"Dos","name":"Résistance","power":1,"effect":"+2 aux tests de Résistance","rp":"Le manteau serre le corps et aide à tenir face à l’épuisement et aux agressions.","example":"Manteau du tenace","support":"Dos | Cape / manteau | Simple | Compétence","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_resistance:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"DOS","catalogVisible":true,"displayName":"Résistance","uiTierLabel":""},{"id":"A319","category":"Accessoire","subcategory":"Dos","name":"Survie","power":1,"effect":"+2 aux tests de Survie","rp":"La coupe protège du vent, de la pluie et conserve les petits outils utiles.","example":"Cape du pisteur","support":"Dos | Cape / manteau | Simple | Compétence","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_survie:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"DOS","catalogVisible":true,"displayName":"Survie","uiTierLabel":""},{"id":"A320","category":"Accessoire","subcategory":"Dos","name":"Discrétion","power":3,"effect":"+4 aux tests de Discrétion","rp":"La cape étouffe les froissements et casse la silhouette. La magie est plus stable et répond plus vite.","example":"Cape de nuit profonde","support":"Dos | Cape / manteau | Améliorée | Compétence","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_discretion:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"DOS","catalogVisible":true,"displayName":"Discrétion","uiTierLabel":""},{"id":"A321","category":"Accessoire","subcategory":"Dos","name":"RD Acide","power":3,"effect":"RD 4 contre les DM d'terre","rp":"Le vernis de limon neutralisé forme une barrière plus tenace.","example":"Manteau au vernis de limon stabilisé","support":"Dos | Cape / manteau | Améliorée | Résistance magique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::acide:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"DOS","catalogVisible":true,"uiGroup":"dos_rd_terre","uiTierLabel":"RD 4 contre les DM d'terre","displayName":"RD Terre","damageType":"terre"},{"id":"A322","category":"Accessoire","subcategory":"Dos","name":"RD Feu","power":3,"effect":"RD 4 contre les DM de feu","rp":"Le manteau boit la chaleur comme une braise privée d’air.","example":"Manteau de braises éteintes","support":"Dos | Cape / manteau | Améliorée | Résistance magique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::feu:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"DOS","catalogVisible":true,"uiGroup":"dos_rd_feu","uiTierLabel":"RD 4 contre les DM de feu","displayName":"RD Feu","damageType":"feu"},{"id":"A323","category":"Accessoire","subcategory":"Dos","name":"RD Foudre","power":3,"effect":"RD 4 contre les DM de air","rp":"La fulgurite stabilisée disperse les arcs de air sur toute la trame.","example":"Manteau de fulgurite tressée","support":"Dos | Cape / manteau | Améliorée | Résistance magique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::electrique:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"DOS","catalogVisible":true,"uiGroup":"dos_rd_electrique","uiTierLabel":"RD 4 contre les DM de air","displayName":"RD Air","damageType":"air"},{"id":"A324","category":"Accessoire","subcategory":"Dos","name":"RD Froid","power":3,"effect":"RD 4 contre les DM de eau","rp":"Des fils isolants emprisonnent la chaleur et rejettent le gel.","example":"Manteau du givre contenu","support":"Dos | Cape / manteau | Améliorée | Résistance magique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::froid:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"DOS","catalogVisible":true,"uiGroup":"dos_rd_eau","uiTierLabel":"RD 4 contre les DM de eau","displayName":"RD Eau","damageType":"eau"},{"id":"A325","category":"Accessoire","subcategory":"Dos","name":"RD Poison","power":3,"effect":"RD 4 contre les DM de toxique","rp":"Des plantes rares infusées dans la trame neutralisent davantage de venins.","example":"Manteau aux décoctions rares","support":"Dos | Cape / manteau | Améliorée | Résistance magique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::poison:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"DOS","catalogVisible":true,"uiGroup":"dos_rd_toxique","uiTierLabel":"RD 4 contre les DM de toxique","displayName":"RD Toxique","damageType":"toxique"},{"id":"A326","category":"Accessoire","subcategory":"Dos","name":"Représentation","power":3,"effect":"+4 aux tests de Représentation","rp":"Ses broderies captent le regard et accompagnent les gestes du porteur. La magie est plus stable et répond plus vite.","example":"Manteau du premier rôle","support":"Dos | Cape / manteau | Améliorée | Compétence","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_representation:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"DOS","catalogVisible":true,"displayName":"Représentation","uiTierLabel":""},{"id":"A327","category":"Accessoire","subcategory":"Dos","name":"Résistance","power":3,"effect":"+4 aux tests de Résistance","rp":"Le manteau serre le corps et aide à tenir face à l’épuisement et aux agressions. La magie est plus stable et répond plus vite.","example":"Manteau du survivant","support":"Dos | Cape / manteau | Améliorée | Compétence","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_resistance:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"DOS","catalogVisible":true,"displayName":"Résistance","uiTierLabel":""},{"id":"A328","category":"Accessoire","subcategory":"Dos","name":"Survie","power":3,"effect":"+4 aux tests de Survie","rp":"La coupe protège du vent, de la pluie et conserve les petits outils utiles. La magie est plus stable et répond plus vite.","example":"Cape du vieux rôdeur","support":"Dos | Cape / manteau | Améliorée | Compétence","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_survie:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"DOS","catalogVisible":true,"displayName":"Survie","uiTierLabel":""},{"id":"A329","category":"Accessoire","subcategory":"Gants","name":"Adresse","power":1,"effect":"+2 aux tests de Adresse","rp":"Le cuir fin améliore la précision des doigts et les gestes délicats.","example":"Gants d’équilibriste","support":"Gants | Gants / gantelets | Simple | Compétence","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_adresse:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"GANTS","catalogVisible":true,"displayName":"Adresse","uiTierLabel":""},{"id":"A330","category":"Accessoire","subcategory":"Gants","name":"Athlétisme","power":1,"effect":"+2 aux tests de Athlétisme","rp":"La paume accroche mieux la pierre, le bois et les prises difficiles.","example":"Gants du grimpeur","support":"Gants | Gants / gantelets | Simple | Compétence","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_athletisme:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"GANTS","catalogVisible":true,"displayName":"Athlétisme","uiTierLabel":""},{"id":"A331","category":"Accessoire","subcategory":"Gants","name":"Attaque","power":1,"effect":"+1 aux tests d’attaque","rp":"Les coutures guident le poignet au moment de frapper.","example":"Gants du duelliste","support":"Gants | Gants / gantelets | Simple | Combat","rarity":"Rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonusAttaque:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Nécessite le patch fourni pour appliquer le bonus générique d'attaque.","uiFamily":"combat","compatProfile":"GANTS","catalogVisible":true,"uiGroup":"gants_attaque","uiTierLabel":"+1 aux tests d’attaque","displayName":"Attaque"},{"id":"A332","category":"Accessoire","subcategory":"Gants","name":"DEF","power":1,"effect":"+1 DEF","rp":"Les renforts aident à placer les mains au bon endroit pour détourner les coups.","example":"Gants de parade","support":"Gants | Gants / gantelets | Simple | Défense","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé/tenu","predicates":"bonus_DEF:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Bonus de DEF actif uniquement quand l'objet est équipé/tenu.","uiFamily":"protection","compatProfile":"GANTS","catalogVisible":true,"uiGroup":"gants_def","uiTierLabel":"+1 DEF","displayName":"DEF"},{"id":"A333","category":"Accessoire","subcategory":"Gants","name":"du \"Classe\" Novice","power":1,"effect":"Capacité de Classe Rang 1","rp":"Les gants gravés sert de relais à une parcelle du style de combat ou du savoir d’une classe. Remplacer « Classe » par la classe choisie.","example":"d’héritage héroïque","support":"Gants | Gants / gantelets | Novice | Capacité de classe","rarity":"Rare","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"GANTS","catalogVisible":false,"catalogNote":"Capacité de classe centralisée sur Collier / Amulette.","displayName":"Héritage de classe","uiGroup":"heritage_classe_gants","uiTierLabel":"Rang 1"},{"id":"A334","category":"Accessoire","subcategory":"Gants","name":"Puissance","power":1,"effect":"+2 aux tests de Puissance","rp":"Le renfort transmet mieux la force dans la prise et l’effort.","example":"Gantelets de force brute","support":"Gants | Gants / gantelets | Simple | Compétence","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_puissance:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"GANTS","catalogVisible":true,"displayName":"Puissance","uiTierLabel":""},{"id":"A335","category":"Accessoire","subcategory":"Gants","name":"du \"Classe\" Adepte","power":2,"effect":"Capacité de Classe Rang 2","rp":"Les gants gravés sert de relais à une parcelle du style de combat ou du savoir d’une classe. Remplacer « Classe » par la classe choisie.","example":"d’héritage héroïque","support":"Gants | Gants / gantelets | Adepte | Capacité de classe","rarity":"Très rare","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"GANTS","catalogVisible":false,"catalogNote":"Capacité de classe centralisée sur Collier / Amulette.","displayName":"Héritage de classe","uiGroup":"heritage_classe_gants","uiTierLabel":"Rang 2"},{"id":"A336","category":"Accessoire","subcategory":"Gants","name":"Adresse","power":3,"effect":"+4 aux tests de Adresse","rp":"Le cuir fin améliore la précision des doigts et les gestes délicats. Les coutures runiques répondent à la tension des muscles.","example":"Gants de main sûre","support":"Gants | Gants / gantelets | Améliorée | Compétence","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_adresse:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"GANTS","catalogVisible":true,"displayName":"Adresse","uiTierLabel":""},{"id":"A337","category":"Accessoire","subcategory":"Gants","name":"Athlétisme","power":3,"effect":"+4 aux tests de Athlétisme","rp":"La paume accroche mieux la pierre, le bois et les prises difficiles. Les coutures runiques répondent à la tension des muscles.","example":"Gants du franchisseur","support":"Gants | Gants / gantelets | Améliorée | Compétence","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_athletisme:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"GANTS","catalogVisible":true,"displayName":"Athlétisme","uiTierLabel":""},{"id":"A338","category":"Accessoire","subcategory":"Gants","name":"DEF","power":3,"effect":"+2 DEF","rp":"Les plaques articulées se positionnent presque d’elles-mêmes face au danger.","example":"Gantelets de parade supérieure","support":"Gants | Gants / gantelets | Améliorée | Défense","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé/tenu","predicates":"bonus_DEF:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Bonus de DEF actif uniquement quand l'objet est équipé/tenu.","uiFamily":"protection","compatProfile":"GANTS","catalogVisible":true,"uiGroup":"gants_def","uiTierLabel":"+2 DEF","displayName":"DEF"},{"id":"A339","category":"Accessoire","subcategory":"Gants","name":"du \"Classe\" Vétéran","power":3,"effect":"Capacité de Classe Rang 3","rp":"Les gants gravés sert de relais à une parcelle du style de combat ou du savoir d’une classe. Remplacer « Classe » par la classe choisie.","example":"d’héritage héroïque","support":"Gants | Gants / gantelets | Vétéran | Capacité de classe","rarity":"Épique","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"GANTS","catalogVisible":false,"catalogNote":"Capacité de classe centralisée sur Collier / Amulette.","displayName":"Héritage de classe","uiGroup":"heritage_classe_gants","uiTierLabel":"Rang 3"},{"id":"A340","category":"Accessoire","subcategory":"Gants","name":"Puissance","power":3,"effect":"+4 aux tests de Puissance","rp":"Le renfort transmet mieux la force dans la prise et l’effort. Les coutures runiques répondent à la tension des muscles.","example":"Gantelets du colosse","support":"Gants | Gants / gantelets | Améliorée | Compétence","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de compétence","predicates":"bonusTests_puissance:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le nom de compétence est normalisé pour COFantasy.","uiFamily":"competence","compatProfile":"GANTS","catalogVisible":true,"displayName":"Puissance","uiTierLabel":""},{"id":"A341","category":"Accessoire","subcategory":"Gants","name":"Attaque","power":4,"effect":"+2 aux tests d’attaque","rp":"Les runes de prise corrigent l’angle des attaques avec plus de précision.","example":"Gants du maître duelliste","support":"Gants | Gants / gantelets | Améliorée | Combat","rarity":"Très rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonusAttaque:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Nécessite le patch fourni pour appliquer le bonus générique d'attaque.","uiFamily":"combat","compatProfile":"GANTS","catalogVisible":true,"uiGroup":"gants_attaque","uiTierLabel":"+2 aux tests d’attaque","displayName":"Attaque"},{"id":"A342","category":"Accessoire","subcategory":"Gants","name":"du \"Classe\" Maître","power":4,"effect":"Capacité de Classe Rang 4","rp":"Les gants gravés sert de relais à une parcelle du style de combat ou du savoir d’une classe. Remplacer « Classe » par la classe choisie.","example":"d’héritage héroïque","support":"Gants | Gants / gantelets | Maître | Capacité de classe","rarity":"Légendaire","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"GANTS","catalogVisible":false,"catalogNote":"Capacité de classe centralisée sur Collier / Amulette.","displayName":"Héritage de classe","uiGroup":"heritage_classe_gants","uiTierLabel":"Rang 4"},{"id":"A343","category":"Accessoire","subcategory":"Gants","name":"du \"Classe\" Légendaire","power":5,"effect":"Capacité de Classe Rang 5","rp":"Les gants gravés sert de relais à une parcelle du style de combat ou du savoir d’une classe. Remplacer « Classe » par la classe choisie.","example":"d’héritage héroïque","support":"Gants | Gants / gantelets | Légendaire | Capacité de classe","rarity":"Mythique","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"GANTS","catalogVisible":false,"catalogNote":"Capacité de classe centralisée sur Collier / Amulette.","displayName":"Héritage de classe","uiGroup":"heritage_classe_gants","uiTierLabel":"Rang 5"},{"id":"A344","category":"Accessoire","subcategory":"Pieds","name":"du \"Classe\" Novice","power":1,"effect":"Capacité de Classe Rang 1","rp":"Les bottes marquées sert de relais à une parcelle du style de combat ou du savoir d’une classe. Remplacer « Classe » par la classe choisie.","example":"d’héritage héroïque","support":"Pieds | Bottes / sandales / chausses | Novice | Capacité de classe","rarity":"Rare","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"PIEDS","catalogVisible":false,"catalogNote":"Capacité de classe centralisée sur Collier / Amulette.","displayName":"Héritage de classe","uiGroup":"heritage_classe_pieds","uiTierLabel":"Rang 1"},{"id":"A345","category":"Accessoire","subcategory":"Pieds","name":"Mouvement","power":1,"effect":"+1 m de déplacement","rp":"Les semelles allègent chaque appui et rendent la marche plus nerveuse.","example":"Bottes de marche vive","support":"Pieds | Bottes / sandales / chausses | Simple | Mouvement","rarity":"Rare","status":"Prédicat étendu","mechanism":"Feuille","predicates":"bonusMouvement:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le sheetworker ajoute ce bonus au mouvement affiché.","uiFamily":"mobilite","compatProfile":"PIEDS","catalogVisible":true,"uiGroup":"pieds_mouvement","uiTierLabel":"+1 m de déplacement","displayName":"Mouvement"},{"id":"A346","category":"Accessoire","subcategory":"Pieds","name":"RD Acide","power":1,"effect":"RD 2 contre les DM d'terre","rp":"Le vernis protège les semelles des flaques corrosives.","example":"Bottes vernies à la résine","support":"Pieds | Bottes / sandales / chausses | Simple | Résistance magique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::acide:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"PIEDS","catalogVisible":true,"uiGroup":"pieds_rd_terre","uiTierLabel":"RD 2 contre les DM d'terre","displayName":"RD Terre","damageType":"terre"},{"id":"A347","category":"Accessoire","subcategory":"Pieds","name":"RD Contondant","power":1,"effect":"RD 2 contre les DM contondants","rp":"Les semelles et renforts absorbent une partie des chocs.","example":"Bottes amortissantes","support":"Pieds | Bottes / sandales / chausses | Simple | Résistance physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::contondant:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"PIEDS","catalogVisible":true,"uiGroup":"pieds_rd_contondant","uiTierLabel":"RD 2 contre les DM contondants","displayName":"RD Contondant","damageType":"contondant"},{"id":"A348","category":"Accessoire","subcategory":"Pieds","name":"RD Feu","power":1,"effect":"RD 2 contre les DM de feu","rp":"Les semelles sont traitées contre les braises et la chaleur.","example":"Bottes cendrées","support":"Pieds | Bottes / sandales / chausses | Simple | Résistance magique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::feu:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"PIEDS","catalogVisible":true,"uiGroup":"pieds_rd_feu","uiTierLabel":"RD 2 contre les DM de feu","displayName":"RD Feu","damageType":"feu"},{"id":"A349","category":"Accessoire","subcategory":"Pieds","name":"RD Foudre","power":1,"effect":"RD 2 contre les DM de air","rp":"Les clous détournent une partie des arcs airs.","example":"Bottes aux clous de cuivre","support":"Pieds | Bottes / sandales / chausses | Simple | Résistance magique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::electrique:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"PIEDS","catalogVisible":true,"uiGroup":"pieds_rd_electrique","uiTierLabel":"RD 2 contre les DM de air","displayName":"RD Air","damageType":"air"},{"id":"A350","category":"Accessoire","subcategory":"Pieds","name":"RD Froid","power":1,"effect":"RD 2 contre les DM de eau","rp":"La doublure protège les pieds du eau qui remonte du sol.","example":"Bottes doublées de laine blanche","support":"Pieds | Bottes / sandales / chausses | Simple | Résistance magique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::froid:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"PIEDS","catalogVisible":true,"uiGroup":"pieds_rd_eau","uiTierLabel":"RD 2 contre les DM de eau","displayName":"RD Eau","damageType":"eau"},{"id":"A351","category":"Accessoire","subcategory":"Pieds","name":"RD Perforant","power":1,"effect":"RD 2 contre les DM perforants","rp":"Les couches denses protègent contre les pointes et pièges perforants.","example":"Bottes à semelles feuilletées","support":"Pieds | Bottes / sandales / chausses | Simple | Résistance physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::percant:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"PIEDS","catalogVisible":true,"uiGroup":"pieds_rd_percant","uiTierLabel":"RD 2 contre les DM perforants","displayName":"RD Perforant","damageType":"percant"},{"id":"A352","category":"Accessoire","subcategory":"Pieds","name":"RD Poison","power":1,"effect":"RD 2 contre les DM de toxique","rp":"Les coutures portent des baumes qui freinent la contamination.","example":"Bottes d’herboriste antitoxique","support":"Pieds | Bottes / sandales / chausses | Simple | Résistance magique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::poison:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"PIEDS","catalogVisible":true,"uiGroup":"pieds_rd_toxique","uiTierLabel":"RD 2 contre les DM de toxique","displayName":"RD Toxique","damageType":"toxique"},{"id":"A353","category":"Accessoire","subcategory":"Pieds","name":"RD Tranchant","power":1,"effect":"RD 2 contre les DM tranchants","rp":"Les renforts protègent les chevilles et détournent les coupes basses.","example":"Bottes à garde-lames","support":"Pieds | Bottes / sandales / chausses | Simple | Résistance physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::tranchant:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"PIEDS","catalogVisible":true,"uiGroup":"pieds_rd_tranchant","uiTierLabel":"RD 2 contre les DM tranchants","displayName":"RD Tranchant","damageType":"tranchant"},{"id":"A354","category":"Accessoire","subcategory":"Pieds","name":"du \"Classe\" Adepte","power":2,"effect":"Capacité de Classe Rang 2","rp":"Les bottes marquées sert de relais à une parcelle du style de combat ou du savoir d’une classe. Remplacer « Classe » par la classe choisie.","example":"d’héritage héroïque","support":"Pieds | Bottes / sandales / chausses | Adepte | Capacité de classe","rarity":"Très rare","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"PIEDS","catalogVisible":false,"catalogNote":"Capacité de classe centralisée sur Collier / Amulette.","displayName":"Héritage de classe","uiGroup":"heritage_classe_pieds","uiTierLabel":"Rang 2"},{"id":"A355","category":"Accessoire","subcategory":"Pieds","name":"du \"Classe\" Vétéran","power":3,"effect":"Capacité de Classe Rang 3","rp":"Les bottes marquées sert de relais à une parcelle du style de combat ou du savoir d’une classe. Remplacer « Classe » par la classe choisie.","example":"d’héritage héroïque","support":"Pieds | Bottes / sandales / chausses | Vétéran | Capacité de classe","rarity":"Épique","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"PIEDS","catalogVisible":false,"catalogNote":"Capacité de classe centralisée sur Collier / Amulette.","displayName":"Héritage de classe","uiGroup":"heritage_classe_pieds","uiTierLabel":"Rang 3"},{"id":"A356","category":"Accessoire","subcategory":"Pieds","name":"Immunité immobilisé","power":3,"effect":"Immunité à l’état immobilisé","rp":"Les bottes brisent l’emprise qui cherche à clouer le porteur sur place.","example":"Bottes d’ancrage vivant","support":"Pieds | Bottes / sandales / chausses | Unique | Immunité d’état","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat d'immunité","predicates":"immunite_immobilise:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"État COFantasy reconnu.","uiFamily":"protection","compatProfile":"PIEDS","catalogVisible":true,"displayName":"Immunité immobilisé","uiTierLabel":""},{"id":"A357","category":"Accessoire","subcategory":"Pieds","name":"Immunité ralenti","power":3,"effect":"Immunité à l’état ralenti","rp":"Les semelles refusent la lourdeur magique et conservent le rythme du porteur.","example":"Bottes du pas libre","support":"Pieds | Bottes / sandales / chausses | Unique | Immunité d’état","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat d'immunité","predicates":"immunite_ralenti:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"État COFantasy reconnu.","uiFamily":"protection","compatProfile":"PIEDS","catalogVisible":true,"displayName":"Immunité ralenti","uiTierLabel":""},{"id":"A358","category":"Accessoire","subcategory":"Pieds","name":"Mouvement","power":3,"effect":"+3 m de déplacement","rp":"La magie propulse les foulées sans déséquilibrer le porteur.","example":"Bottes de pas fulgurant","support":"Pieds | Bottes / sandales / chausses | Améliorée | Mouvement","rarity":"Très rare","status":"Prédicat étendu","mechanism":"Feuille","predicates":"bonusMouvement:3","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le sheetworker ajoute ce bonus au mouvement affiché.","uiFamily":"mobilite","compatProfile":"PIEDS","catalogVisible":true,"uiGroup":"pieds_mouvement","uiTierLabel":"+3 m de déplacement","displayName":"Mouvement"},{"id":"A359","category":"Accessoire","subcategory":"Pieds","name":"RD Acide","power":3,"effect":"RD 4 contre les DM d'terre","rp":"Le traitement supérieur résiste aux terres plus agressifs.","example":"Bottes au vernis de limon stabilisé","support":"Pieds | Bottes / sandales / chausses | Améliorée | Résistance magique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::acide:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"PIEDS","catalogVisible":true,"uiGroup":"pieds_rd_terre","uiTierLabel":"RD 4 contre les DM d'terre","displayName":"RD Terre","damageType":"terre"},{"id":"A360","category":"Accessoire","subcategory":"Pieds","name":"RD Contondant","power":3,"effect":"RD 4 contre les DM contondants","rp":"L’amorti runique diffuse plus efficacement la force des impacts.","example":"Bottes d’impact supérieur","support":"Pieds | Bottes / sandales / chausses | Améliorée | Résistance physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::contondant:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"PIEDS","catalogVisible":true,"uiGroup":"pieds_rd_contondant","uiTierLabel":"RD 4 contre les DM contondants","displayName":"RD Contondant","damageType":"contondant"},{"id":"A361","category":"Accessoire","subcategory":"Pieds","name":"RD Feu","power":3,"effect":"RD 4 contre les DM de feu","rp":"La matière volcanique stabilisée repousse mieux les flammes.","example":"Bottes de lave froide","support":"Pieds | Bottes / sandales / chausses | Améliorée | Résistance magique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::feu:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"PIEDS","catalogVisible":true,"uiGroup":"pieds_rd_feu","uiTierLabel":"RD 4 contre les DM de feu","displayName":"RD Feu","damageType":"feu"},{"id":"A362","category":"Accessoire","subcategory":"Pieds","name":"RD Foudre","power":3,"effect":"RD 4 contre les DM de air","rp":"La fulgurite diffuse plus vite l’énergie dans la terre.","example":"Bottes de fulgurite tressée","support":"Pieds | Bottes / sandales / chausses | Améliorée | Résistance magique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::electrique:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"PIEDS","catalogVisible":true,"uiGroup":"pieds_rd_electrique","uiTierLabel":"RD 4 contre les DM de air","displayName":"RD Air","damageType":"air"},{"id":"A363","category":"Accessoire","subcategory":"Pieds","name":"RD Froid","power":3,"effect":"RD 4 contre les DM de eau","rp":"Les runes isolantes tiennent même sous un gel magique.","example":"Bottes du givre contenu","support":"Pieds | Bottes / sandales / chausses | Améliorée | Résistance magique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::froid:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"PIEDS","catalogVisible":true,"uiGroup":"pieds_rd_eau","uiTierLabel":"RD 4 contre les DM de eau","displayName":"RD Eau","damageType":"eau"},{"id":"A364","category":"Accessoire","subcategory":"Pieds","name":"RD Perforant","power":3,"effect":"RD 4 contre les DM perforants","rp":"La structure feuilletée absorbe mieux les percées.","example":"Bottes anti-pointe supérieures","support":"Pieds | Bottes / sandales / chausses | Améliorée | Résistance physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::percant:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"PIEDS","catalogVisible":true,"uiGroup":"pieds_rd_percant","uiTierLabel":"RD 4 contre les DM perforants","displayName":"RD Perforant","damageType":"percant"},{"id":"A365","category":"Accessoire","subcategory":"Pieds","name":"RD Poison","power":3,"effect":"RD 4 contre les DM de toxique","rp":"Les baumes rares neutralisent davantage de toxines par contact.","example":"Bottes aux baumes rares","support":"Pieds | Bottes / sandales / chausses | Améliorée | Résistance magique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::poison:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"PIEDS","catalogVisible":true,"uiGroup":"pieds_rd_toxique","uiTierLabel":"RD 4 contre les DM de toxique","displayName":"RD Toxique","damageType":"toxique"},{"id":"A366","category":"Accessoire","subcategory":"Pieds","name":"RD Tranchant","power":3,"effect":"RD 4 contre les DM tranchants","rp":"Les plaques articulées couvrent mieux les points faibles.","example":"Bottes brise-lames supérieures","support":"Pieds | Bottes / sandales / chausses | Améliorée | Résistance physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::tranchant:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"PIEDS","catalogVisible":true,"uiGroup":"pieds_rd_tranchant","uiTierLabel":"RD 4 contre les DM tranchants","displayName":"RD Tranchant","damageType":"tranchant"},{"id":"A367","category":"Accessoire","subcategory":"Pieds","name":"du \"Classe\" Maître","power":4,"effect":"Capacité de Classe Rang 4","rp":"Les bottes marquées sert de relais à une parcelle du style de combat ou du savoir d’une classe. Remplacer « Classe » par la classe choisie.","example":"d’héritage héroïque","support":"Pieds | Bottes / sandales / chausses | Maître | Capacité de classe","rarity":"Légendaire","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"PIEDS","catalogVisible":false,"catalogNote":"Capacité de classe centralisée sur Collier / Amulette.","displayName":"Héritage de classe","uiGroup":"heritage_classe_pieds","uiTierLabel":"Rang 4"},{"id":"A368","category":"Accessoire","subcategory":"Pieds","name":"du \"Classe\" Légendaire","power":5,"effect":"Capacité de Classe Rang 5","rp":"Les bottes marquées sert de relais à une parcelle du style de combat ou du savoir d’une classe. Remplacer « Classe » par la classe choisie.","example":"d’héritage héroïque","support":"Pieds | Bottes / sandales / chausses | Légendaire | Capacité de classe","rarity":"Mythique","status":"Configurable","mechanism":"Capacité de classe","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONFIGURABLE","audit":"CONFIGURATION_OBJET","actionObjects":"SELON_CAPACITE","undo":"SELON_COMMANDE","params":"Classe/profil ; capacité exacte ; rang ; commande/prédicat","note":"Le rang ne suffit pas : choisir la capacité lors de la création. Passive = prédicat/champ ; active = action d’objet configurable avec la commande COFantasy existante si disponible.","uiFamily":"capacite","compatProfile":"PIEDS","catalogVisible":false,"catalogNote":"Capacité de classe centralisée sur Collier / Amulette.","displayName":"Héritage de classe","uiGroup":"heritage_classe_pieds","uiTierLabel":"Rang 5"},{"id":"A369","category":"Accessoire","subcategory":"Tête","name":"CHA de base","power":1,"effect":"CHA de base : Mod +2","rp":"Le bijou impose une harmonie mentale stable : la caractéristique CHA ne peut descendre sous ce seuil de modificateur.","example":"Diadème de présence fixée","support":"Tête | Diadème / couronne / serre-tête | Simple | Caractéristique mentale de base","rarity":"Rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_CHA:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"TETE","catalogVisible":true,"statKey":"CHA","uiGroup":"tete_cha_de_base","uiTierLabel":"CHA de base : Mod +2","displayName":"CHA de base"},{"id":"A370","category":"Accessoire","subcategory":"Tête","name":"CHA en plus","power":1,"effect":"+1 CHA","rp":"La couronne renforce la présence et la force de conviction du porteur.","example":"Couronne d’assurance","support":"Tête | Diadème / couronne / serre-tête | Simple | Caractéristique mentale","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_CHA:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"TETE","catalogVisible":true,"statKey":"CHA","uiGroup":"tete_cha_en_plus","uiTierLabel":"+1 CHA","displayName":"CHA en plus"},{"id":"A371","category":"Accessoire","subcategory":"Tête","name":"INT de base","power":1,"effect":"INT de base : Mod +2","rp":"Le bijou impose une harmonie mentale stable : la caractéristique INT ne peut descendre sous ce seuil de modificateur.","example":"Diadème de mémoire fixée","support":"Tête | Diadème / couronne / serre-tête | Simple | Caractéristique mentale de base","rarity":"Rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_INT:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"TETE","catalogVisible":true,"statKey":"INT","uiGroup":"tete_int_de_base","uiTierLabel":"INT de base : Mod +2","displayName":"INT de base"},{"id":"A372","category":"Accessoire","subcategory":"Tête","name":"INT en plus","power":1,"effect":"+1 INT","rp":"Le focus canalise la mémoire, l’analyse et la vivacité intellectuelle.","example":"Serre-tête du raisonneur","support":"Tête | Diadème / couronne / serre-tête | Simple | Caractéristique mentale","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_INT:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"TETE","catalogVisible":true,"statKey":"INT","uiGroup":"tete_int_en_plus","uiTierLabel":"+1 INT","displayName":"INT en plus"},{"id":"A373","category":"Accessoire","subcategory":"Tête","name":"RD Contondant","power":1,"effect":"RD 2 contre les DM contondants","rp":"La doublure épaisse amortit une partie des chocs portés à la tête.","example":"Coiffe matelassée de guerre","support":"Tête | Casque / coiffe / diadème | Simple | Résistance physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::contondant:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"TETE","catalogVisible":true,"uiGroup":"tete_rd_contondant","uiTierLabel":"RD 2 contre les DM contondants","displayName":"RD Contondant","damageType":"contondant"},{"id":"A374","category":"Accessoire","subcategory":"Tête","name":"RD Perforant","power":1,"effect":"RD 2 contre les DM perforants","rp":"Les plaques superposées absorbent mieux les pointes, carreaux et traits.","example":"Heaume à plaques chevauchées","support":"Tête | Casque / coiffe / diadème | Simple | Résistance physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::percant:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"TETE","catalogVisible":true,"uiGroup":"tete_rd_percant","uiTierLabel":"RD 2 contre les DM perforants","displayName":"RD Perforant","damageType":"percant"},{"id":"A375","category":"Accessoire","subcategory":"Tête","name":"RD Tranchant","power":1,"effect":"RD 2 contre les DM tranchants","rp":"Ses arêtes détournent les lames avant qu’elles ne mordent réellement.","example":"Casque à crête brise-lame","support":"Tête | Casque / coiffe / diadème | Simple | Résistance physique","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::tranchant:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"TETE","catalogVisible":true,"uiGroup":"tete_rd_tranchant","uiTierLabel":"RD 2 contre les DM tranchants","displayName":"RD Tranchant","damageType":"tranchant"},{"id":"A376","category":"Accessoire","subcategory":"Tête","name":"SAG de base","power":1,"effect":"SAG de base : Mod +2","rp":"Le bijou impose une harmonie mentale stable : la caractéristique SAG ne peut descendre sous ce seuil de modificateur.","example":"Diadème de sagesse fixée","support":"Tête | Diadème / couronne / serre-tête | Simple | Caractéristique mentale de base","rarity":"Rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_SAG:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"TETE","catalogVisible":true,"statKey":"SAG","uiGroup":"tete_sag_de_base","uiTierLabel":"SAG de base : Mod +2","displayName":"SAG de base"},{"id":"A377","category":"Accessoire","subcategory":"Tête","name":"SAG en plus","power":1,"effect":"+1 SAG","rp":"Le diadème apaise l’esprit et aiguise l’instinct.","example":"Diadème de sagesse","support":"Tête | Diadème / couronne / serre-tête | Simple | Caractéristique mentale","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_SAG:1","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"TETE","catalogVisible":true,"statKey":"SAG","uiGroup":"tete_sag_en_plus","uiTierLabel":"+1 SAG","displayName":"SAG en plus"},{"id":"A378","category":"Accessoire","subcategory":"Tête","name":"CHA de base","power":3,"effect":"CHA de base : Mod +3","rp":"Le bijou impose une harmonie mentale stable : la caractéristique CHA ne peut descendre sous ce seuil de modificateur.","example":"Diadème de présence majeure","support":"Tête | Diadème / couronne / serre-tête | Améliorée | Caractéristique mentale de base","rarity":"Très rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_CHA:3","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"TETE","catalogVisible":true,"statKey":"CHA","uiGroup":"tete_cha_de_base","uiTierLabel":"CHA de base : Mod +3","displayName":"CHA de base"},{"id":"A379","category":"Accessoire","subcategory":"Tête","name":"CHA en plus","power":3,"effect":"+2 CHA","rp":"La couronne renforce la présence et la force de conviction du porteur. Les gravures plus fines stabilisent l’effet.","example":"Couronne de présence souveraine","support":"Tête | Diadème / couronne / serre-tête | Améliorée | Caractéristique mentale","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_CHA:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"TETE","catalogVisible":true,"statKey":"CHA","uiGroup":"tete_cha_en_plus","uiTierLabel":"+2 CHA","displayName":"CHA en plus"},{"id":"A380","category":"Accessoire","subcategory":"Tête","name":"INT de base","power":3,"effect":"INT de base : Mod +3","rp":"Le bijou impose une harmonie mentale stable : la caractéristique INT ne peut descendre sous ce seuil de modificateur.","example":"Diadème de mémoire majeure","support":"Tête | Diadème / couronne / serre-tête | Améliorée | Caractéristique mentale de base","rarity":"Très rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_INT:3","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"TETE","catalogVisible":true,"statKey":"INT","uiGroup":"tete_int_de_base","uiTierLabel":"INT de base : Mod +3","displayName":"INT de base"},{"id":"A381","category":"Accessoire","subcategory":"Tête","name":"INT en plus","power":3,"effect":"+2 INT","rp":"Le focus canalise la mémoire, l’analyse et la vivacité intellectuelle. Les gravures plus fines stabilisent l’effet.","example":"Serre-tête du grand érudit","support":"Tête | Diadème / couronne / serre-tête | Améliorée | Caractéristique mentale","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_INT:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"TETE","catalogVisible":true,"statKey":"INT","uiGroup":"tete_int_en_plus","uiTierLabel":"+2 INT","displayName":"INT en plus"},{"id":"A382","category":"Accessoire","subcategory":"Tête","name":"RD Contondant","power":3,"effect":"RD 4 contre les DM contondants","rp":"La structure interne absorbe les impacts violents sans transmettre toute la force.","example":"Heaume à doublure d’ogre","support":"Tête | Casque / coiffe / diadème | Améliorée | Résistance physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::contondant:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"TETE","catalogVisible":true,"uiGroup":"tete_rd_contondant","uiTierLabel":"RD 4 contre les DM contondants","displayName":"RD Contondant","damageType":"contondant"},{"id":"A383","category":"Accessoire","subcategory":"Tête","name":"RD Perforant","power":3,"effect":"RD 4 contre les DM perforants","rp":"Les couches internes brisent l’angle des attaques perforantes.","example":"Heaume de plaques feuilletées","support":"Tête | Casque / coiffe / diadème | Améliorée | Résistance physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::percant:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"TETE","catalogVisible":true,"uiGroup":"tete_rd_percant","uiTierLabel":"RD 4 contre les DM perforants","displayName":"RD Perforant","damageType":"percant"},{"id":"A384","category":"Accessoire","subcategory":"Tête","name":"RD Tranchant","power":3,"effect":"RD 4 contre les DM tranchants","rp":"Sa forge renforcée force les lames à glisser sur les zones vitales.","example":"Heaume brise-lame supérieur","support":"Tête | Casque / coiffe / diadème | Améliorée | Résistance physique","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::tranchant:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Pris en compte par le moteur RD quand l'objet est équipé.","uiFamily":"protection","compatProfile":"TETE","catalogVisible":true,"uiGroup":"tete_rd_tranchant","uiTierLabel":"RD 4 contre les DM tranchants","displayName":"RD Tranchant","damageType":"tranchant"},{"id":"A385","category":"Accessoire","subcategory":"Tête","name":"SAG de base","power":3,"effect":"SAG de base : Mod +3","rp":"Le bijou impose une harmonie mentale stable : la caractéristique SAG ne peut descendre sous ce seuil de modificateur.","example":"Diadème de sagesse majeure","support":"Tête | Diadème / couronne / serre-tête | Améliorée | Caractéristique mentale de base","rarity":"Très rare","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_SAG:3","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"TETE","catalogVisible":true,"statKey":"SAG","uiGroup":"tete_sag_de_base","uiTierLabel":"SAG de base : Mod +3","displayName":"SAG de base"},{"id":"A386","category":"Accessoire","subcategory":"Tête","name":"SAG en plus","power":3,"effect":"+2 SAG","rp":"Le diadème apaise l’esprit et aiguise l’instinct. Les gravures plus fines stabilisent l’effet.","example":"Diadème de haute sagesse","support":"Tête | Diadème / couronne / serre-tête | Améliorée | Caractéristique mentale","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat de caractéristique","predicates":"bonus_SAG:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Ajoute le bonus au modificateur de caractéristique.","uiFamily":"caracteristique","compatProfile":"TETE","catalogVisible":true,"statKey":"SAG","uiGroup":"tete_sag_en_plus","uiTierLabel":"+2 SAG","displayName":"SAG en plus"},{"id":"A387","category":"Accessoire","subcategory":"Tête","name":"CHA de base","power":5,"effect":"CHA de base : Mod +4","rp":"Le bijou impose une harmonie mentale stable : la caractéristique CHA ne peut descendre sous ce seuil de modificateur.","example":"Diadème de présence légendaire","support":"Tête | Diadème / couronne / serre-tête | Légendaire | Caractéristique mentale de base","rarity":"Légendaire","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_CHA:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"TETE","catalogVisible":true,"statKey":"CHA","uiGroup":"tete_cha_de_base","uiTierLabel":"CHA de base : Mod +4","displayName":"CHA de base"},{"id":"A388","category":"Accessoire","subcategory":"Tête","name":"INT de base","power":5,"effect":"INT de base : Mod +4","rp":"Le bijou impose une harmonie mentale stable : la caractéristique INT ne peut descendre sous ce seuil de modificateur.","example":"Diadème de mémoire légendaire","support":"Tête | Diadème / couronne / serre-tête | Légendaire | Caractéristique mentale de base","rarity":"Légendaire","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_INT:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"TETE","catalogVisible":true,"statKey":"INT","uiGroup":"tete_int_de_base","uiTierLabel":"INT de base : Mod +4","displayName":"INT de base"},{"id":"A389","category":"Accessoire","subcategory":"Tête","name":"SAG de base","power":5,"effect":"SAG de base : Mod +4","rp":"Le bijou impose une harmonie mentale stable : la caractéristique SAG ne peut descendre sous ce seuil de modificateur.","example":"Diadème de sagesse légendaire","support":"Tête | Diadème / couronne / serre-tête | Légendaire | Caractéristique mentale de base","rarity":"Légendaire","status":"Prédicat étendu","mechanism":"Patch COFantasy","predicates":"bonus_SAG:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Le patch fixe un minimum au modificateur de base avant les autres bonus.","uiFamily":"caracteristique","compatProfile":"TETE","catalogVisible":true,"statKey":"SAG","uiGroup":"tete_sag_de_base","uiTierLabel":"SAG de base : Mod +4","displayName":"SAG de base"},{"id":"A390","category":"Objet consommable","subcategory":"Fiole / dose","name":"Poison mineur","power":0,"effect":"+1d4 DM de poison. Une dose s’applique sur une arme ou un projectile. DD CON 15.","rp":"Préparation de toxines légères et venin dilué, conservée dans un flacon scellé à la cire.","example":"Poison mineur","support":"Poison | Poison de lame | Qualité 1 — Mineur","rarity":"Commune","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-enduire-poison -1 rapide 1d4 15","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"","note":"DD fixé dans le catalogue. !cof-enduire-poison natif ; COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"poison","compatProfile":"CONSOMMABLE_FIOLE___DOSE","catalogVisible":true,"displayName":"Poison mineur","uiTierLabel":""},{"id":"A391","category":"Objet consommable","subcategory":"Fiole / dose","name":"Poison affaiblissant","power":1,"effect":"+1d4 DM de poison et inflige l’état affaibli. Une dose s’applique sur une arme ou un projectile. DD CON 15.","rp":"Préparation de venin nerveux dosé pour troubler les muscles, conservée dans un flacon scellé à la cire.","example":"Poison affaiblissant","support":"Poison | Poison de lame | Qualité 2 — Affaiblissant","rarity":"Peu commune","status":"Commande !cof-enduire-poison compatible","mechanism":"Poison rapide + affaiblissant","predicates":"","weaponOptions":"","fieldPatch":"!cof-enduire-poison -1 rapideAffaiblissant 1d4 15","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"1d4 poison ; DD CON 15 ; état affaibli ; une seule dose ; arme ou projectile","note":"Syntaxe proposée : ajouter le type rapideAffaiblissant à !cof-enduire-poison. Réutiliser les mécanismes natifs rapide + poisonAffaiblissant dans une seule application. COFantasy Items conserve --decrAttribute : application, quantité et futur déclenchement restent compatibles avec l'Undo natif.","uiFamily":"poison","compatProfile":"CONSOMMABLE_FIOLE___DOSE","catalogVisible":true,"displayName":"Poison affaiblissant","uiTierLabel":""},{"id":"A392","category":"Objet consommable","subcategory":"Fiole / dose","name":"Poison virulent","power":2,"effect":"+2d4 DM de poison. Une dose s’applique sur une arme ou un projectile. DD CON 10.","rp":"Préparation de venin concentré dans une huile sombre, conservée dans un flacon scellé à la cire.","example":"Poison virulent","support":"Poison | Poison de lame | Qualité 3 — Virulent","rarity":"Rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-enduire-poison -1 rapide 2d4 10","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"","note":"DD fixé dans le catalogue. !cof-enduire-poison natif ; COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"poison","compatProfile":"CONSOMMABLE_FIOLE___DOSE","catalogVisible":true,"displayName":"Poison virulent","uiTierLabel":""},{"id":"A393","category":"Objet consommable","subcategory":"Fiole / dose","name":"Poison virulent affaiblissant","power":3,"effect":"+2d4 DM de poison et inflige l’état affaibli. Une dose s’applique sur une arme ou un projectile. DD CON 10.","rp":"Préparation de toxine instable qui brûle les forces de la cible, conservée dans un flacon scellé à la cire.","example":"Poison virulent affaiblissant","support":"Poison | Poison de lame | Qualité 4 — Virulent affaiblissant","rarity":"Très rare","status":"Commande !cof-enduire-poison compatible","mechanism":"Poison rapide + affaiblissant","predicates":"","weaponOptions":"","fieldPatch":"!cof-enduire-poison -1 rapideAffaiblissant 2d4 10","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"2d4 poison ; DD CON 10 ; état affaibli ; une seule dose ; arme ou projectile","note":"Syntaxe proposée : ajouter le type rapideAffaiblissant à !cof-enduire-poison. Réutiliser les mécanismes natifs rapide + poisonAffaiblissant dans une seule application. COFantasy Items conserve --decrAttribute : application, quantité et futur déclenchement restent compatibles avec l'Undo natif.","uiFamily":"poison","compatProfile":"CONSOMMABLE_FIOLE___DOSE","catalogVisible":true,"displayName":"Poison virulent affaiblissant","uiTierLabel":""},{"id":"A394","category":"Objet consommable","subcategory":"Fiole / dose","name":"Poison mortel","power":4,"effect":"+3d4 DM de poison. Une dose s’applique sur une arme ou un projectile. DD CON 5.","rp":"Préparation de distillat noir préparé goutte par goutte, conservée dans un flacon scellé à la cire.","example":"Poison mortel","support":"Poison | Poison de lame | Qualité 5 — Mortel","rarity":"Épique","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-enduire-poison -1 rapide 3d4 5","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"","note":"DD fixé dans le catalogue. !cof-enduire-poison natif ; COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"poison","compatProfile":"CONSOMMABLE_FIOLE___DOSE","catalogVisible":true,"displayName":"Poison mortel","uiTierLabel":""},{"id":"A395","category":"Objet consommable","subcategory":"Fiole / dose","name":"Poison mortel affaiblissant","power":5,"effect":"+3d4 DM de poison et inflige l’état affaibli. Une dose s’applique sur une arme ou un projectile. DD CON 5.","rp":"Préparation de poison maître, capable de briser le corps en quelques battements, conservée dans un flacon scellé à la cire.","example":"Poison mortel affaiblissant","support":"Poison | Poison de lame | Qualité 6 — Mortel affaiblissant","rarity":"Légendaire","status":"Commande !cof-enduire-poison compatible","mechanism":"Poison rapide + affaiblissant","predicates":"","weaponOptions":"","fieldPatch":"!cof-enduire-poison -1 rapideAffaiblissant 3d4 5","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"3d4 poison ; DD CON 5 ; état affaibli ; une seule dose ; arme ou projectile","note":"Syntaxe proposée : ajouter le type rapideAffaiblissant à !cof-enduire-poison. Réutiliser les mécanismes natifs rapide + poisonAffaiblissant dans une seule application. COFantasy Items conserve --decrAttribute : application, quantité et futur déclenchement restent compatibles avec l'Undo natif.","uiFamily":"poison","compatProfile":"CONSOMMABLE_FIOLE___DOSE","catalogVisible":true,"displayName":"Poison mortel affaiblissant","uiTierLabel":""},{"id":"A396","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de mana mineure","power":0,"effect":"Rend 1d4 + NivPJ points de mana au personnage qui la boit.","rp":"Fluide bleuté ou violet, stabilisé dans une fiole gravée pour éviter la dispersion du mana.","example":"Potion de mana","support":"Potion de mana | Récupération de mana | Mana | Qualité 1 — Mineure","rarity":"Commune","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-recupere-mana 1d4+@{selected|niveau}","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"","note":"Commande de récupération de mana ; nécessite le token sélectionné lors de l'utilisation. Commande !cof-* : COFantasy Items injecte --decrAttribute ; un seul !cof-undo restaure l'effet et la quantité.","uiFamily":"mana","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":true,"displayName":"Potion de mana","uiGroup":"potion_mana","uiTierLabel":"Rend 1d4 + NivPJ points de mana au personnage qui la boit."},{"id":"A397","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de soins mineure","power":0,"effect":"Rend 1d4 + NivPJ PV au personnage qui la boit.","rp":"Liquide rouge ou doré, préparé avec des herbes cicatrisantes et une trace de magie vitale.","example":"Potion de soins mineure","support":"Potion de soins | Soins | PV | Qualité 1 — Mineure","rarity":"Commune","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-soin 1d4+@{selected|niveau}","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"","note":"À utiliser comme action de consommable, pas comme prédicat permanent. Commande !cof-* : COFantasy Items injecte --decrAttribute ; un seul !cof-undo restaure l'effet et la quantité.","uiFamily":"soins","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":true,"displayName":"Potion de soins","uiGroup":"potion_soins","uiTierLabel":"Rend 1d4 + NivPJ PV au personnage qui la boit."},{"id":"A398","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de mana","power":1,"effect":"Rend 2d4 + NivPJ points de mana au personnage qui la boit.","rp":"Fluide bleuté ou violet, stabilisé dans une fiole gravée pour éviter la dispersion du mana.","example":"Potion de mana simple","support":"Potion de mana | Récupération de mana | Mana | Qualité 2 — Simple","rarity":"Peu commune","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-recupere-mana 2d4+@{selected|niveau}","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"","note":"Commande de récupération de mana ; nécessite le token sélectionné lors de l'utilisation. Commande !cof-* : COFantasy Items injecte --decrAttribute ; un seul !cof-undo restaure l'effet et la quantité.","uiFamily":"mana","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":true,"displayName":"Potion de mana","uiGroup":"potion_mana","uiTierLabel":"Rend 2d4 + NivPJ points de mana au personnage qui la boit."},{"id":"A399","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de soins","power":1,"effect":"Rend 2d4 + NivPJ PV au personnage qui la boit.","rp":"Liquide rouge ou doré, préparé avec des herbes cicatrisantes et une trace de magie vitale.","example":"Potion de soins","support":"Potion de soins | Soins | PV | Qualité 2 — Simple","rarity":"Peu commune","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-soin 2d4+@{selected|niveau}","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"","note":"À utiliser comme action de consommable, pas comme prédicat permanent. Commande !cof-* : COFantasy Items injecte --decrAttribute ; un seul !cof-undo restaure l'effet et la quantité.","uiFamily":"soins","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":true,"displayName":"Potion de soins","uiGroup":"potion_soins","uiTierLabel":"Rend 2d4 + NivPJ PV au personnage qui la boit."},{"id":"A400","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de charisme temporaire","power":2,"effect":"+1 CHA jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec miel solaire et pétales de fleur d’orateur, qui renforce temporairement la charisme du buveur.","example":"Potion de charisme temporaire","support":"Potion de caractéristique temporaire | CHA temporaire | CHA | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Caractéristique ; +1/+2 ; durée fin scène/combat","note":"Aucune commande native exacte trouvée pour un bonus positif temporaire générique de caractéristique jusqu'à fin de combat.","uiFamily":"caracteristique","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Élixir de charisme","uiGroup":"potion_stat_cha","uiTierLabel":"+1 CHA jusqu’à la fin de la scène ou du combat.","statKey":"CHA"},{"id":"A401","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de constitution temporaire","power":2,"effect":"+1 CON jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec sels minéraux et sang de bête robuste, qui renforce temporairement la constitution du buveur.","example":"Potion de constitution temporaire","support":"Potion de caractéristique temporaire | CON temporaire | CON | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Caractéristique ; +1/+2 ; durée fin scène/combat","note":"Aucune commande native exacte trouvée pour un bonus positif temporaire générique de caractéristique jusqu'à fin de combat.","uiFamily":"caracteristique","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Élixir de constitution","uiGroup":"potion_stat_con","uiTierLabel":"+1 CON jusqu’à la fin de la scène ou du combat.","statKey":"CON"},{"id":"A402","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de dextérité temporaire","power":2,"effect":"+1 DEX jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec huile féline et feuilles de saule, qui renforce temporairement la dextérité du buveur.","example":"Potion de dextérité temporaire","support":"Potion de caractéristique temporaire | DEX temporaire | DEX | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Caractéristique ; +1/+2 ; durée fin scène/combat","note":"Aucune commande native exacte trouvée pour un bonus positif temporaire générique de caractéristique jusqu'à fin de combat.","uiFamily":"caracteristique","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Élixir de dextérité","uiGroup":"potion_stat_dex","uiTierLabel":"+1 DEX jusqu’à la fin de la scène ou du combat.","statKey":"DEX"},{"id":"A403","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de force temporaire","power":2,"effect":"+1 FOR jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec racines rouges et poudre d’os compact, qui renforce temporairement la force du buveur.","example":"Potion de force temporaire","support":"Potion de caractéristique temporaire | FOR temporaire | FOR | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Caractéristique ; +1/+2 ; durée fin scène/combat","note":"Aucune commande native exacte trouvée pour un bonus positif temporaire générique de caractéristique jusqu'à fin de combat.","uiFamily":"caracteristique","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Élixir de force","uiGroup":"potion_stat_for","uiTierLabel":"+1 FOR jusqu’à la fin de la scène ou du combat.","statKey":"FOR","damageType":"force"},{"id":"A404","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion d’intelligence temporaire","power":2,"effect":"+1 INT jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec encre mentale et cristaux de mémoire pilés, qui renforce temporairement la intelligence du buveur.","example":"Potion d’intelligence temporaire","support":"Potion de caractéristique temporaire | INT temporaire | INT | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Caractéristique ; +1/+2 ; durée fin scène/combat","note":"Aucune commande native exacte trouvée pour un bonus positif temporaire générique de caractéristique jusqu'à fin de combat.","uiFamily":"caracteristique","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Élixir de intelligence","uiGroup":"potion_stat_int","uiTierLabel":"+1 INT jusqu’à la fin de la scène ou du combat.","statKey":"INT"},{"id":"A405","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de mana renforcée","power":2,"effect":"Rend 3d4 + NivPJ points de mana au personnage qui la boit.","rp":"Fluide bleuté ou violet, stabilisé dans une fiole gravée pour éviter la dispersion du mana.","example":"Potion de mana renforcée","support":"Potion de mana | Récupération de mana | Mana | Qualité 3 — Renforcée","rarity":"Rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-recupere-mana 3d4+@{selected|niveau}","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"","note":"Commande de récupération de mana ; nécessite le token sélectionné lors de l'utilisation. Commande !cof-* : COFantasy Items injecte --decrAttribute ; un seul !cof-undo restaure l'effet et la quantité.","uiFamily":"mana","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":true,"displayName":"Potion de mana","uiGroup":"potion_mana","uiTierLabel":"Rend 3d4 + NivPJ points de mana au personnage qui la boit."},{"id":"A406","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance acide","power":2,"effect":"Confère RD +5 contre les DM d’terre pendant 1 combat.","rp":"Élixir chargé de résine anticorrosion et vernis alchimique, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance terre","support":"Potion de résistance magique | RD Terre | Terre | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type de DM ; RD 5/10 ; durée 1 combat","note":"Les RD permanentes sont prises en charge, mais pas cette RD temporaire typée générique sous forme de consommable.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance terre","uiGroup":"potion_res_terre","uiTierLabel":"Confère RD +5 contre les DM d’terre pendant 1 combat.","damageType":"terre"},{"id":"A407","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance au contondant","power":2,"effect":"Confère RD +5 contre les DM contondants pendant 1 combat.","rp":"Mélange épais de baume amortissant à base de fibres épaisses, qui durcit brièvement la peau et les vêtements du buveur.","example":"Potion de résistance au contondant","support":"Potion de résistance physique | RD Contondant | Contondant | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type de DM ; RD 5/10 ; durée 1 combat","note":"Les RD permanentes sont prises en charge, mais pas cette RD temporaire typée générique sous forme de consommable.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance contondant","uiGroup":"potion_res_contondant","uiTierLabel":"Confère RD +5 contre les DM contondants pendant 1 combat.","damageType":"contondant"},{"id":"A408","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance au perforant","power":2,"effect":"Confère RD +5 contre les DM perforants pendant 1 combat.","rp":"Mélange épais de résine dense et fragments de plaques superposées, qui durcit brièvement la peau et les vêtements du buveur.","example":"Potion de résistance au perforant","support":"Potion de résistance physique | RD Perforant | Perforant | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type de DM ; RD 5/10 ; durée 1 combat","note":"Les RD permanentes sont prises en charge, mais pas cette RD temporaire typée générique sous forme de consommable.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance perçant","uiGroup":"potion_res_percant","uiTierLabel":"Confère RD +5 contre les DM perforants pendant 1 combat.","damageType":"percant"},{"id":"A409","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance au tranchant","power":2,"effect":"Confère RD +5 contre les DM tranchants pendant 1 combat.","rp":"Mélange épais de écorces métalliques et poudre de maille broyée, qui durcit brièvement la peau et les vêtements du buveur.","example":"Potion de résistance au tranchant","support":"Potion de résistance physique | RD Tranchant | Tranchant | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type de DM ; RD 5/10 ; durée 1 combat","note":"Les RD permanentes sont prises en charge, mais pas cette RD temporaire typée générique sous forme de consommable.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance tranchant","uiGroup":"potion_res_tranchant","uiTierLabel":"Confère RD +5 contre les DM tranchants pendant 1 combat.","damageType":"tranchant"},{"id":"A410","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance feu","power":2,"effect":"Confère RD +5 contre les DM de feu pendant 1 combat.","rp":"Élixir chargé de cendre alchimique et sels ignifuges, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance feu","support":"Potion de résistance magique | RD Feu | Feu | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type de DM ; RD 5/10 ; durée 1 combat","note":"Les RD permanentes sont prises en charge, mais pas cette RD temporaire typée générique sous forme de consommable.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance feu","uiGroup":"potion_res_feu","uiTierLabel":"Confère RD +5 contre les DM de feu pendant 1 combat.","damageType":"feu"},{"id":"A411","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance foudre","power":2,"effect":"Confère RD +5 contre les DM de air pendant 1 combat.","rp":"Élixir chargé de poudre de cuivre et éclats de fulgurite, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance air","support":"Potion de résistance magique | RD Air | Air | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type de DM ; RD 5/10 ; durée 1 combat","note":"Les RD permanentes sont prises en charge, mais pas cette RD temporaire typée générique sous forme de consommable.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance air","uiGroup":"potion_res_electrique","uiTierLabel":"Confère RD +5 contre les DM de air pendant 1 combat.","damageType":"air"},{"id":"A412","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance froid","power":2,"effect":"Confère RD +5 contre les DM de eau pendant 1 combat.","rp":"Élixir chargé de givre stabilisé et graisse polaire, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance eau","support":"Potion de résistance magique | RD Eau | Eau | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type de DM ; RD 5/10 ; durée 1 combat","note":"Les RD permanentes sont prises en charge, mais pas cette RD temporaire typée générique sous forme de consommable.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance eau","uiGroup":"potion_res_eau","uiTierLabel":"Confère RD +5 contre les DM de eau pendant 1 combat.","damageType":"eau"},{"id":"A413","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance arcane","power":2,"effect":"Confère RD +5 contre les DM force pendant 1 combat.","rp":"Élixir chargé de poudre d’arcanite et eau lunaire stabilisée, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance force","support":"Potion de résistance magique | RD Force | Force | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type de DM ; RD 5/10 ; durée 1 combat","note":"RD temporaire de domaine Force ; conserve le même mécanisme générique que les autres potions de résistance.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance force","uiGroup":"potion_res_force","uiTierLabel":"Confère RD +5 contre les DM force pendant 1 combat.","damageType":"force"},{"id":"A414","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance maladie","power":2,"effect":"Confère RD +5 contre les DM de toxique pendant 1 combat.","rp":"Élixir chargé de sels antiseptiques et encens médicinal réduit, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance toxique","support":"Potion de résistance magique | RD Toxique | Toxique | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type de DM ; RD 5/10 ; durée 1 combat","note":"Les RD permanentes sont prises en charge, mais pas cette RD temporaire typée générique sous forme de consommable.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance toxique","uiGroup":"potion_res_toxique","uiTierLabel":"Confère RD +5 contre les DM de toxique pendant 1 combat.","damageType":"toxique"},{"id":"A415","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance poison","power":2,"effect":"Confère RD +5 contre les DM de toxique pendant 1 combat.","rp":"Élixir chargé de antitoxines concentrées et bile purifiée, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance toxique","support":"Potion de résistance magique | RD Toxique | Toxique | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type de DM ; RD 5/10 ; durée 1 combat","note":"Les RD permanentes sont prises en charge, mais pas cette RD temporaire typée générique sous forme de consommable.","uiFamily":"poison","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance toxique","uiTierLabel":"Confère RD +5 contre les DM de toxique pendant 1 combat.","damageType":"toxique","uiGroup":"potion_res_toxique"},{"id":"A416","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance sonique","power":2,"effect":"Confère RD +5 contre les DM airs pendant 1 combat.","rp":"Élixir chargé de poussière de cristal accordé et cire isolante, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance air","support":"Potion de résistance magique | RD Air | Air | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type de DM ; RD 5/10 ; durée 1 combat","note":"Les RD permanentes sont prises en charge, mais pas cette RD temporaire typée générique sous forme de consommable.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance air","uiGroup":"potion_res_air","uiTierLabel":"Confère RD +5 contre les DM airs pendant 1 combat.","damageType":"air"},{"id":"A417","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de sagesse temporaire","power":2,"effect":"+1 SAG jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec infusion d’herbes claires et encens de méditation, qui renforce temporairement la sagesse du buveur.","example":"Potion de sagesse temporaire","support":"Potion de caractéristique temporaire | SAG temporaire | SAG | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Caractéristique ; +1/+2 ; durée fin scène/combat","note":"Aucune commande native exacte trouvée pour un bonus positif temporaire générique de caractéristique jusqu'à fin de combat.","uiFamily":"caracteristique","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Élixir de sagesse","uiGroup":"potion_stat_sag","uiTierLabel":"+1 SAG jusqu’à la fin de la scène ou du combat.","statKey":"SAG"},{"id":"A418","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de soins renforcée","power":2,"effect":"Rend 3d4 + NivPJ PV au personnage qui la boit.","rp":"Liquide rouge ou doré, préparé avec des herbes cicatrisantes et une trace de magie vitale.","example":"Potion de soins renforcée","support":"Potion de soins | Soins | PV | Qualité 3 — Renforcée","rarity":"Rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-soin 3d4+@{selected|niveau}","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"","note":"À utiliser comme action de consommable, pas comme prédicat permanent. Commande !cof-* : COFantasy Items injecte --decrAttribute ; un seul !cof-undo restaure l'effet et la quantité.","uiFamily":"soins","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":true,"displayName":"Potion de soins","uiGroup":"potion_soins","uiTierLabel":"Rend 3d4 + NivPJ PV au personnage qui la boit."},{"id":"A419","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de mana supérieure","power":3,"effect":"Rend 4d4 + NivPJ points de mana au personnage qui la boit.","rp":"Fluide bleuté ou violet, stabilisé dans une fiole gravée pour éviter la dispersion du mana.","example":"Potion de mana supérieure","support":"Potion de mana | Récupération de mana | Mana | Qualité 4 — Supérieure","rarity":"Très rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-recupere-mana 4d4+@{selected|niveau}","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"","note":"Commande de récupération de mana ; nécessite le token sélectionné lors de l'utilisation. Commande !cof-* : COFantasy Items injecte --decrAttribute ; un seul !cof-undo restaure l'effet et la quantité.","uiFamily":"mana","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":true,"displayName":"Potion de mana","uiGroup":"potion_mana","uiTierLabel":"Rend 4d4 + NivPJ points de mana au personnage qui la boit."},{"id":"A420","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de soins supérieure","power":3,"effect":"Rend 4d4 + NivPJ PV au personnage qui la boit.","rp":"Liquide rouge ou doré, préparé avec des herbes cicatrisantes et une trace de magie vitale.","example":"Potion de soins supérieure","support":"Potion de soins | Soins | PV | Qualité 4 — Supérieure","rarity":"Très rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-soin 4d4+@{selected|niveau}","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"","note":"À utiliser comme action de consommable, pas comme prédicat permanent. Commande !cof-* : COFantasy Items injecte --decrAttribute ; un seul !cof-undo restaure l'effet et la quantité.","uiFamily":"soins","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":true,"displayName":"Potion de soins","uiGroup":"potion_soins","uiTierLabel":"Rend 4d4 + NivPJ PV au personnage qui la boit."},{"id":"A421","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de charisme temporaire","power":4,"effect":"+2 CHA jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec miel solaire et pétales de fleur d’orateur, qui renforce temporairement la charisme du buveur.","example":"Potion de charisme temporaire","support":"Potion de caractéristique temporaire | CHA temporaire | CHA | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Caractéristique ; +1/+2 ; durée fin scène/combat","note":"Aucune commande native exacte trouvée pour un bonus positif temporaire générique de caractéristique jusqu'à fin de combat.","uiFamily":"caracteristique","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Élixir de charisme","uiGroup":"potion_stat_cha","uiTierLabel":"+2 CHA jusqu’à la fin de la scène ou du combat.","statKey":"CHA"},{"id":"A422","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de constitution temporaire","power":4,"effect":"+2 CON jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec sels minéraux et sang de bête robuste, qui renforce temporairement la constitution du buveur.","example":"Potion de constitution temporaire","support":"Potion de caractéristique temporaire | CON temporaire | CON | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Caractéristique ; +1/+2 ; durée fin scène/combat","note":"Aucune commande native exacte trouvée pour un bonus positif temporaire générique de caractéristique jusqu'à fin de combat.","uiFamily":"caracteristique","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Élixir de constitution","uiGroup":"potion_stat_con","uiTierLabel":"+2 CON jusqu’à la fin de la scène ou du combat.","statKey":"CON"},{"id":"A423","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de dextérité temporaire","power":4,"effect":"+2 DEX jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec huile féline et feuilles de saule, qui renforce temporairement la dextérité du buveur.","example":"Potion de dextérité temporaire","support":"Potion de caractéristique temporaire | DEX temporaire | DEX | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Caractéristique ; +1/+2 ; durée fin scène/combat","note":"Aucune commande native exacte trouvée pour un bonus positif temporaire générique de caractéristique jusqu'à fin de combat.","uiFamily":"caracteristique","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Élixir de dextérité","uiGroup":"potion_stat_dex","uiTierLabel":"+2 DEX jusqu’à la fin de la scène ou du combat.","statKey":"DEX"},{"id":"A424","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de force temporaire","power":4,"effect":"+2 FOR jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec racines rouges et poudre d’os compact, qui renforce temporairement la force du buveur.","example":"Potion de force temporaire","support":"Potion de caractéristique temporaire | FOR temporaire | FOR | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Caractéristique ; +1/+2 ; durée fin scène/combat","note":"Aucune commande native exacte trouvée pour un bonus positif temporaire générique de caractéristique jusqu'à fin de combat.","uiFamily":"caracteristique","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Élixir de force","uiGroup":"potion_stat_for","uiTierLabel":"+2 FOR jusqu’à la fin de la scène ou du combat.","statKey":"FOR","damageType":"force"},{"id":"A425","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion d’intelligence temporaire","power":4,"effect":"+2 INT jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec encre mentale et cristaux de mémoire pilés, qui renforce temporairement la intelligence du buveur.","example":"Potion d’intelligence temporaire","support":"Potion de caractéristique temporaire | INT temporaire | INT | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Caractéristique ; +1/+2 ; durée fin scène/combat","note":"Aucune commande native exacte trouvée pour un bonus positif temporaire générique de caractéristique jusqu'à fin de combat.","uiFamily":"caracteristique","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Élixir de intelligence","uiGroup":"potion_stat_int","uiTierLabel":"+2 INT jusqu’à la fin de la scène ou du combat.","statKey":"INT"},{"id":"A426","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de mana majeure","power":4,"effect":"Rend 5d4 + NivPJ points de mana au personnage qui la boit.","rp":"Fluide bleuté ou violet, stabilisé dans une fiole gravée pour éviter la dispersion du mana.","example":"Potion de mana majeure","support":"Potion de mana | Récupération de mana | Mana | Qualité 5 — Majeure","rarity":"Épique","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-recupere-mana 5d4+@{selected|niveau}","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"","note":"Commande de récupération de mana ; nécessite le token sélectionné lors de l'utilisation. Commande !cof-* : COFantasy Items injecte --decrAttribute ; un seul !cof-undo restaure l'effet et la quantité.","uiFamily":"mana","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":true,"displayName":"Potion de mana","uiGroup":"potion_mana","uiTierLabel":"Rend 5d4 + NivPJ points de mana au personnage qui la boit."},{"id":"A427","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance acide","power":4,"effect":"Confère RD +10 contre les DM d’terre pendant 1 combat.","rp":"Élixir chargé de résine anticorrosion et vernis alchimique, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance terre","support":"Potion de résistance magique | RD Terre | Terre | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type de DM ; RD 5/10 ; durée 1 combat","note":"Les RD permanentes sont prises en charge, mais pas cette RD temporaire typée générique sous forme de consommable.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance terre","uiGroup":"potion_res_terre","uiTierLabel":"Confère RD +10 contre les DM d’terre pendant 1 combat.","damageType":"terre"},{"id":"A428","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance au contondant","power":4,"effect":"Confère RD +10 contre les DM contondants pendant 1 combat.","rp":"Mélange épais de baume amortissant à base de fibres épaisses, qui durcit brièvement la peau et les vêtements du buveur.","example":"Potion de résistance au contondant","support":"Potion de résistance physique | RD Contondant | Contondant | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type de DM ; RD 5/10 ; durée 1 combat","note":"Les RD permanentes sont prises en charge, mais pas cette RD temporaire typée générique sous forme de consommable.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance contondant","uiGroup":"potion_res_contondant","uiTierLabel":"Confère RD +10 contre les DM contondants pendant 1 combat.","damageType":"contondant"},{"id":"A429","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance au perforant","power":4,"effect":"Confère RD +10 contre les DM perforants pendant 1 combat.","rp":"Mélange épais de résine dense et fragments de plaques superposées, qui durcit brièvement la peau et les vêtements du buveur.","example":"Potion de résistance au perforant","support":"Potion de résistance physique | RD Perforant | Perforant | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type de DM ; RD 5/10 ; durée 1 combat","note":"Les RD permanentes sont prises en charge, mais pas cette RD temporaire typée générique sous forme de consommable.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance perçant","uiGroup":"potion_res_percant","uiTierLabel":"Confère RD +10 contre les DM perforants pendant 1 combat.","damageType":"percant"},{"id":"A430","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance au tranchant","power":4,"effect":"Confère RD +10 contre les DM tranchants pendant 1 combat.","rp":"Mélange épais de écorces métalliques et poudre de maille broyée, qui durcit brièvement la peau et les vêtements du buveur.","example":"Potion de résistance au tranchant","support":"Potion de résistance physique | RD Tranchant | Tranchant | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type de DM ; RD 5/10 ; durée 1 combat","note":"Les RD permanentes sont prises en charge, mais pas cette RD temporaire typée générique sous forme de consommable.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance tranchant","uiGroup":"potion_res_tranchant","uiTierLabel":"Confère RD +10 contre les DM tranchants pendant 1 combat.","damageType":"tranchant"},{"id":"A431","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance feu","power":4,"effect":"Confère RD +10 contre les DM de feu pendant 1 combat.","rp":"Élixir chargé de cendre alchimique et sels ignifuges, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance feu","support":"Potion de résistance magique | RD Feu | Feu | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type de DM ; RD 5/10 ; durée 1 combat","note":"Les RD permanentes sont prises en charge, mais pas cette RD temporaire typée générique sous forme de consommable.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance feu","uiGroup":"potion_res_feu","uiTierLabel":"Confère RD +10 contre les DM de feu pendant 1 combat.","damageType":"feu"},{"id":"A432","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance foudre","power":4,"effect":"Confère RD +10 contre les DM de air pendant 1 combat.","rp":"Élixir chargé de poudre de cuivre et éclats de fulgurite, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance air","support":"Potion de résistance magique | RD Air | Air | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type de DM ; RD 5/10 ; durée 1 combat","note":"Les RD permanentes sont prises en charge, mais pas cette RD temporaire typée générique sous forme de consommable.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance air","uiGroup":"potion_res_electrique","uiTierLabel":"Confère RD +10 contre les DM de air pendant 1 combat.","damageType":"air"},{"id":"A433","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance froid","power":4,"effect":"Confère RD +10 contre les DM de eau pendant 1 combat.","rp":"Élixir chargé de givre stabilisé et graisse polaire, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance eau","support":"Potion de résistance magique | RD Eau | Eau | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type de DM ; RD 5/10 ; durée 1 combat","note":"Les RD permanentes sont prises en charge, mais pas cette RD temporaire typée générique sous forme de consommable.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance eau","uiGroup":"potion_res_eau","uiTierLabel":"Confère RD +10 contre les DM de eau pendant 1 combat.","damageType":"eau"},{"id":"A434","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance arcane","power":4,"effect":"Confère RD +10 contre les DM force pendant 1 combat.","rp":"Élixir chargé de poudre d’arcanite et eau lunaire stabilisée, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance force","support":"Potion de résistance magique | RD Force | Force | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type de DM ; RD 5/10 ; durée 1 combat","note":"RD temporaire de domaine Force ; conserve le même mécanisme générique que les autres potions de résistance.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance force","uiGroup":"potion_res_force","uiTierLabel":"Confère RD +10 contre les DM force pendant 1 combat.","damageType":"force"},{"id":"A435","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance maladie","power":4,"effect":"Confère RD +10 contre les DM de toxique pendant 1 combat.","rp":"Élixir chargé de sels antiseptiques et encens médicinal réduit, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance toxique","support":"Potion de résistance magique | RD Toxique | Toxique | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type de DM ; RD 5/10 ; durée 1 combat","note":"Les RD permanentes sont prises en charge, mais pas cette RD temporaire typée générique sous forme de consommable.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance toxique","uiGroup":"potion_res_toxique","uiTierLabel":"Confère RD +10 contre les DM de toxique pendant 1 combat.","damageType":"toxique"},{"id":"A436","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance poison","power":4,"effect":"Confère RD +10 contre les DM de toxique pendant 1 combat.","rp":"Élixir chargé de antitoxines concentrées et bile purifiée, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance toxique","support":"Potion de résistance magique | RD Toxique | Toxique | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type de DM ; RD 5/10 ; durée 1 combat","note":"Les RD permanentes sont prises en charge, mais pas cette RD temporaire typée générique sous forme de consommable.","uiFamily":"poison","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance toxique","uiTierLabel":"Confère RD +10 contre les DM de toxique pendant 1 combat.","damageType":"toxique","uiGroup":"potion_res_toxique"},{"id":"A437","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance sonique","power":4,"effect":"Confère RD +10 contre les DM airs pendant 1 combat.","rp":"Élixir chargé de poussière de cristal accordé et cire isolante, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance air","support":"Potion de résistance magique | RD Air | Air | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type de DM ; RD 5/10 ; durée 1 combat","note":"Les RD permanentes sont prises en charge, mais pas cette RD temporaire typée générique sous forme de consommable.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance air","uiGroup":"potion_res_air","uiTierLabel":"Confère RD +10 contre les DM airs pendant 1 combat.","damageType":"air"},{"id":"A438","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de sagesse temporaire","power":4,"effect":"+2 SAG jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec infusion d’herbes claires et encens de méditation, qui renforce temporairement la sagesse du buveur.","example":"Potion de sagesse temporaire","support":"Potion de caractéristique temporaire | SAG temporaire | SAG | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Caractéristique ; +1/+2 ; durée fin scène/combat","note":"Aucune commande native exacte trouvée pour un bonus positif temporaire générique de caractéristique jusqu'à fin de combat.","uiFamily":"caracteristique","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Élixir de sagesse","uiGroup":"potion_stat_sag","uiTierLabel":"+2 SAG jusqu’à la fin de la scène ou du combat.","statKey":"SAG"},{"id":"A439","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de soins majeure","power":4,"effect":"Rend 5d4 + NivPJ PV au personnage qui la boit.","rp":"Liquide rouge ou doré, préparé avec des herbes cicatrisantes et une trace de magie vitale.","example":"Potion de soins majeure","support":"Potion de soins | Soins | PV | Qualité 5 — Majeure","rarity":"Épique","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-soin 5d4+@{selected|niveau}","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"","note":"À utiliser comme action de consommable, pas comme prédicat permanent. Commande !cof-* : COFantasy Items injecte --decrAttribute ; un seul !cof-undo restaure l'effet et la quantité.","uiFamily":"soins","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":true,"displayName":"Potion de soins","uiGroup":"potion_soins","uiTierLabel":"Rend 5d4 + NivPJ PV au personnage qui la boit."},{"id":"A440","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de célérité","power":5,"effect":"+1 action par tour pendant 2 tours.","rp":"Liquide clair parcouru d’éclairs dorés, qui accélère brutalement les réflexes du buveur.","example":"Potion de célérité","support":"Potion de célérité | Action supplémentaire | Célérité | Unique","rarity":"Légendaire","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-effet-temp hate 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"","note":"Utilise l'effet temporaire natif « hate » pendant 2 tours. Commande !cof-* : COFantasy Items injecte --decrAttribute ; un seul !cof-undo restaure l'effet et la quantité.","uiFamily":"potion","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":true,"displayName":"Potion de célérité","uiTierLabel":""},{"id":"A441","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de mana légendaire","power":5,"effect":"Rend 6d4 + NivPJ points de mana au personnage qui la boit.","rp":"Fluide bleuté ou violet, stabilisé dans une fiole gravée pour éviter la dispersion du mana.","example":"Potion de mana légendaire","support":"Potion de mana | Récupération de mana | Mana | Qualité 6 — Légendaire","rarity":"Légendaire","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-recupere-mana 6d4+@{selected|niveau}","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"","note":"Commande de récupération de mana ; nécessite le token sélectionné lors de l'utilisation. Commande !cof-* : COFantasy Items injecte --decrAttribute ; un seul !cof-undo restaure l'effet et la quantité.","uiFamily":"mana","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":true,"displayName":"Potion de mana","uiGroup":"potion_mana","uiTierLabel":"Rend 6d4 + NivPJ points de mana au personnage qui la boit."},{"id":"A442","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de soins légendaire","power":5,"effect":"Rend 6d4 + NivPJ PV au personnage qui la boit.","rp":"Liquide rouge ou doré, préparé avec des herbes cicatrisantes et une trace de magie vitale.","example":"Potion de soins légendaire","support":"Potion de soins | Soins | PV | Qualité 6 — Légendaire","rarity":"Légendaire","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-soin 6d4+@{selected|niveau}","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"","note":"À utiliser comme action de consommable, pas comme prédicat permanent. Commande !cof-* : COFantasy Items injecte --decrAttribute ; un seul !cof-undo restaure l'effet et la quantité.","uiFamily":"soins","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":true,"displayName":"Potion de soins","uiGroup":"potion_soins","uiTierLabel":"Rend 6d4 + NivPJ PV au personnage qui la boit."},{"id":"A443","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade acide","power":2,"effect":"Inflige 2d4 DM d’terre dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de bile corrosive stabilisée, pensée pour éclater à l’impact ou après amorçage.","example":"Grenade terre","support":"Grenade | Grenade Terre | Terre | Niveau 1","rarity":"Rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade acide --auto --dm 2d4 --terre --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM ; 2d4/5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade terre","uiGroup":"grenade_terre","uiTierLabel":"Inflige 2d4 DM d’terre dans une zone de 4 m de diamètre.","damageType":"terre"},{"id":"A444","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade contondant","power":2,"effect":"Inflige 2d4 DM contondants dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de onde de choc comprimée, pensée pour éclater à l’impact ou après amorçage.","example":"Grenade contondant","support":"Grenade | Grenade Contondant | Contondant | Niveau 1","rarity":"Rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade contondant --auto --dm 2d4 --contondant --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM ; 2d4/5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade contondant","uiGroup":"grenade_contondant","uiTierLabel":"Inflige 2d4 DM contondants dans une zone de 4 m de diamètre.","damageType":"contondant"},{"id":"A445","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade feu","power":2,"effect":"Inflige 2d4 DM de feu dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de poudre incendiaire, pensée pour éclater à l’impact ou après amorçage.","example":"Grenade feu","support":"Grenade | Grenade Feu | Feu | Niveau 1","rarity":"Rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade feu --auto --dm 2d4 --feu --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM ; 2d4/5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade feu","uiGroup":"grenade_feu","uiTierLabel":"Inflige 2d4 DM de feu dans une zone de 4 m de diamètre.","damageType":"feu"},{"id":"A446","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade foudre","power":2,"effect":"Inflige 2d4 DM de air dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de noyau conducteur fulgurant, pensée pour éclater à l’impact ou après amorçage.","example":"Grenade air","support":"Grenade | Grenade Air | Air | Niveau 1","rarity":"Rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade foudre --auto --dm 2d4 --air --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM ; 2d4/5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade air","uiGroup":"grenade_electrique","uiTierLabel":"Inflige 2d4 DM de air dans une zone de 4 m de diamètre.","damageType":"air"},{"id":"A447","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade froid","power":2,"effect":"Inflige 2d4 DM de eau dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de cristaux de givre alchimique, pensée pour éclater à l’impact ou après amorçage.","example":"Grenade eau","support":"Grenade | Grenade Eau | Eau | Niveau 1","rarity":"Rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade froid --auto --dm 2d4 --eau --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM ; 2d4/5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade eau","uiGroup":"grenade_eau","uiTierLabel":"Inflige 2d4 DM de eau dans une zone de 4 m de diamètre.","damageType":"eau"},{"id":"A448","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade arcane","power":2,"effect":"Inflige 2d4 DM force dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de arcanite instable, pensée pour éclater à l’impact ou après amorçage.","example":"Grenade force","support":"Grenade | Grenade Force | Force | Niveau 1","rarity":"Rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade arcane --auto --dm 2d4 --force --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM ; 2d4/5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec le domaine Force, --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade force","uiGroup":"grenade_force","uiTierLabel":"Inflige 2d4 DM force dans une zone de 4 m de diamètre.","damageType":"force"},{"id":"A449","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade maladie","power":2,"effect":"Inflige 2d4 DM de toxique dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de spores maladives enfermées, pensée pour éclater à l’impact ou après amorçage.","example":"Grenade toxique","support":"Grenade | Grenade Toxique | Toxique | Niveau 1","rarity":"Rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade maladie --auto --dm 2d4 --toxique --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM ; 2d4/5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade toxique","uiGroup":"grenade_toxique","uiTierLabel":"Inflige 2d4 DM de toxique dans une zone de 4 m de diamètre.","damageType":"toxique"},{"id":"A450","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade perforant","power":2,"effect":"Inflige 2d4 DM perforants dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de dards métalliques, pensée pour éclater à l’impact ou après amorçage.","example":"Grenade perforant","support":"Grenade | Grenade Perforant | Perforant | Niveau 1","rarity":"Rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade perforant --auto --dm 2d4 --percant --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM ; 2d4/5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade perçant","uiGroup":"grenade_percant","uiTierLabel":"Inflige 2d4 DM perforants dans une zone de 4 m de diamètre.","damageType":"percant"},{"id":"A451","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade poison","power":2,"effect":"Inflige 2d4 DM de toxique dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de nuage toxique concentré, pensée pour éclater à l’impact ou après amorçage.","example":"Grenade toxique","support":"Grenade | Grenade Toxique | Toxique | Niveau 1","rarity":"Rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade poison --auto --dm 2d4 --toxique --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM ; 2d4/5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité. Doublon historique fusionné vers toxique; conservé hors catalogue.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":false,"displayName":"Grenade toxique","uiGroup":"grenade_toxique","uiTierLabel":"Inflige 2d4 DM de toxique dans une zone de 4 m de diamètre.","damageType":"toxique"},{"id":"A452","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade sonique","power":2,"effect":"Inflige 2d4 DM airs dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de cristal résonant, pensée pour éclater à l’impact ou après amorçage.","example":"Grenade air","support":"Grenade | Grenade Air | Air | Niveau 1","rarity":"Rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade sonique --auto --dm 2d4 --air --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM ; 2d4/5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade air","uiGroup":"grenade_air","uiTierLabel":"Inflige 2d4 DM airs dans une zone de 4 m de diamètre.","damageType":"air"},{"id":"A453","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade tranchant","power":2,"effect":"Inflige 2d4 DM tranchants dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de éclats rasoirs, pensée pour éclater à l’impact ou après amorçage.","example":"Grenade tranchant","support":"Grenade | Grenade Tranchant | Tranchant | Niveau 1","rarity":"Rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade tranchant --auto --dm 2d4 --tranchant --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM ; 2d4/5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade tranchant","uiGroup":"grenade_tranchant","uiTierLabel":"Inflige 2d4 DM tranchants dans une zone de 4 m de diamètre.","damageType":"tranchant"},{"id":"A454","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade acide","power":4,"effect":"Inflige 5d4 DM d’terre dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de bile corrosive stabilisée, pensée pour éclater à l’impact ou après amorçage.","example":"Grenade terre","support":"Grenade | Grenade Terre | Terre | Niveau 2","rarity":"Épique","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade acide --auto --dm 5d4 --terre --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM ; 2d4/5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade terre","uiGroup":"grenade_terre","uiTierLabel":"Inflige 5d4 DM d’terre dans une zone de 4 m de diamètre.","damageType":"terre"},{"id":"A455","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade contondant","power":4,"effect":"Inflige 5d4 DM contondants dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de onde de choc comprimée, pensée pour éclater à l’impact ou après amorçage.","example":"Grenade contondant","support":"Grenade | Grenade Contondant | Contondant | Niveau 2","rarity":"Épique","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade contondant --auto --dm 5d4 --contondant --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM ; 2d4/5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade contondant","uiGroup":"grenade_contondant","uiTierLabel":"Inflige 5d4 DM contondants dans une zone de 4 m de diamètre.","damageType":"contondant"},{"id":"A456","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade feu","power":4,"effect":"Inflige 5d4 DM de feu dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de poudre incendiaire, pensée pour éclater à l’impact ou après amorçage.","example":"Grenade feu","support":"Grenade | Grenade Feu | Feu | Niveau 2","rarity":"Épique","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade feu --auto --dm 5d4 --feu --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM ; 2d4/5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade feu","uiGroup":"grenade_feu","uiTierLabel":"Inflige 5d4 DM de feu dans une zone de 4 m de diamètre.","damageType":"feu"},{"id":"A457","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade foudre","power":4,"effect":"Inflige 5d4 DM de air dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de noyau conducteur fulgurant, pensée pour éclater à l’impact ou après amorçage.","example":"Grenade air","support":"Grenade | Grenade Air | Air | Niveau 2","rarity":"Épique","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade foudre --auto --dm 5d4 --air --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM ; 2d4/5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade air","uiGroup":"grenade_electrique","uiTierLabel":"Inflige 5d4 DM de air dans une zone de 4 m de diamètre.","damageType":"air"},{"id":"A458","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade froid","power":4,"effect":"Inflige 5d4 DM de eau dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de cristaux de givre alchimique, pensée pour éclater à l’impact ou après amorçage.","example":"Grenade eau","support":"Grenade | Grenade Eau | Eau | Niveau 2","rarity":"Épique","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade froid --auto --dm 5d4 --eau --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM ; 2d4/5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade eau","uiGroup":"grenade_eau","uiTierLabel":"Inflige 5d4 DM de eau dans une zone de 4 m de diamètre.","damageType":"eau"},{"id":"A459","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade arcane","power":4,"effect":"Inflige 5d4 DM force dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de arcanite instable, pensée pour éclater à l’impact ou après amorçage.","example":"Grenade force","support":"Grenade | Grenade Force | Force | Niveau 2","rarity":"Épique","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade arcane --auto --dm 5d4 --force --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM ; 2d4/5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec le domaine Force, --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade force","uiGroup":"grenade_force","uiTierLabel":"Inflige 5d4 DM force dans une zone de 4 m de diamètre.","damageType":"force"},{"id":"A460","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade maladie","power":4,"effect":"Inflige 5d4 DM de toxique dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de spores maladives enfermées, pensée pour éclater à l’impact ou après amorçage.","example":"Grenade toxique","support":"Grenade | Grenade Toxique | Toxique | Niveau 2","rarity":"Épique","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade maladie --auto --dm 5d4 --toxique --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM ; 2d4/5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade toxique","uiGroup":"grenade_toxique","uiTierLabel":"Inflige 5d4 DM de toxique dans une zone de 4 m de diamètre.","damageType":"toxique"},{"id":"A461","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade perforant","power":4,"effect":"Inflige 5d4 DM perforants dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de dards métalliques, pensée pour éclater à l’impact ou après amorçage.","example":"Grenade perforant","support":"Grenade | Grenade Perforant | Perforant | Niveau 2","rarity":"Épique","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade perforant --auto --dm 5d4 --percant --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM ; 2d4/5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade perçant","uiGroup":"grenade_percant","uiTierLabel":"Inflige 5d4 DM perforants dans une zone de 4 m de diamètre.","damageType":"percant"},{"id":"A462","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade poison","power":4,"effect":"Inflige 5d4 DM de toxique dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de nuage toxique concentré, pensée pour éclater à l’impact ou après amorçage.","example":"Grenade toxique","support":"Grenade | Grenade Toxique | Toxique | Niveau 2","rarity":"Épique","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade poison --auto --dm 5d4 --toxique --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM ; 2d4/5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité. Doublon historique fusionné vers toxique; conservé hors catalogue.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":false,"displayName":"Grenade toxique","uiGroup":"grenade_toxique","uiTierLabel":"Inflige 5d4 DM de toxique dans une zone de 4 m de diamètre.","damageType":"toxique"},{"id":"A463","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade sonique","power":4,"effect":"Inflige 5d4 DM airs dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de cristal résonant, pensée pour éclater à l’impact ou après amorçage.","example":"Grenade air","support":"Grenade | Grenade Air | Air | Niveau 2","rarity":"Épique","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade sonique --auto --dm 5d4 --air --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM ; 2d4/5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade air","uiGroup":"grenade_air","uiTierLabel":"Inflige 5d4 DM airs dans une zone de 4 m de diamètre.","damageType":"air"},{"id":"A464","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade tranchant","power":4,"effect":"Inflige 5d4 DM tranchants dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de éclats rasoirs, pensée pour éclater à l’impact ou après amorçage.","example":"Grenade tranchant","support":"Grenade | Grenade Tranchant | Tranchant | Niveau 2","rarity":"Épique","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade tranchant --auto --dm 5d4 --tranchant --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM ; 2d4/5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade tranchant","uiGroup":"grenade_tranchant","uiTierLabel":"Inflige 5d4 DM tranchants dans une zone de 4 m de diamètre.","damageType":"tranchant"},{"id":"A465","category":"Objet consommable","subcategory":"Parchemin","name":"Parchemin de capacité rang 1","power":1,"effect":"Permet d’utiliser une capacité de classe de rang 1 une fois, puis le parchemin est détruit.","rp":"Le texte magique se consume après lecture, libérant une technique ou un savoir scellé.","example":"Parchemin de capacité rang 1","support":"Parchemin de capacité | Capacité Rang 1 | Novice","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"CONFIGURATION_OBJET","actionObjects":"NON","undo":"SELON_COMMANDE","params":"Capacité exacte du rang indiqué ; commande COFantasy","note":"À la création, stocker la vraie commande de capacité. Pour Undo + décrémentation automatiques, privilégier une commande !cof-* afin que Items puisse injecter --decrAttribute.","uiFamily":"parchemin","compatProfile":"CONSOMMABLE_PARCHEMIN","catalogVisible":true,"displayName":"Parchemin de capacité","uiGroup":"parchemin_capacite","uiTierLabel":"Rang 1"},{"id":"A466","category":"Objet consommable","subcategory":"Parchemin","name":"Parchemin de capacité rang 2","power":2,"effect":"Permet d’utiliser une capacité de classe de rang 2 une fois, puis le parchemin est détruit.","rp":"Le texte magique se consume après lecture, libérant une technique ou un savoir scellé.","example":"Parchemin de capacité rang 2","support":"Parchemin de capacité | Capacité Rang 2 | Adepte","rarity":"Très rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"CONFIGURATION_OBJET","actionObjects":"NON","undo":"SELON_COMMANDE","params":"Capacité exacte du rang indiqué ; commande COFantasy","note":"À la création, stocker la vraie commande de capacité. Pour Undo + décrémentation automatiques, privilégier une commande !cof-* afin que Items puisse injecter --decrAttribute.","uiFamily":"parchemin","compatProfile":"CONSOMMABLE_PARCHEMIN","catalogVisible":true,"displayName":"Parchemin de capacité","uiGroup":"parchemin_capacite","uiTierLabel":"Rang 2"},{"id":"A467","category":"Objet consommable","subcategory":"Parchemin","name":"Parchemin de capacité rang 3","power":3,"effect":"Permet d’utiliser une capacité de classe de rang 3 une fois, puis le parchemin est détruit.","rp":"Le texte magique se consume après lecture, libérant une technique ou un savoir scellé.","example":"Parchemin de capacité rang 3","support":"Parchemin de capacité | Capacité Rang 3 | Vétéran","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"CONFIGURATION_OBJET","actionObjects":"NON","undo":"SELON_COMMANDE","params":"Capacité exacte du rang indiqué ; commande COFantasy","note":"À la création, stocker la vraie commande de capacité. Pour Undo + décrémentation automatiques, privilégier une commande !cof-* afin que Items puisse injecter --decrAttribute.","uiFamily":"parchemin","compatProfile":"CONSOMMABLE_PARCHEMIN","catalogVisible":true,"displayName":"Parchemin de capacité","uiGroup":"parchemin_capacite","uiTierLabel":"Rang 3"},{"id":"A468","category":"Objet consommable","subcategory":"Parchemin","name":"Parchemin de capacité rang 4","power":4,"effect":"Permet d’utiliser une capacité de classe de rang 4 une fois, puis le parchemin est détruit.","rp":"Le texte magique se consume après lecture, libérant une technique ou un savoir scellé.","example":"Parchemin de capacité rang 4","support":"Parchemin de capacité | Capacité Rang 4 | Maître","rarity":"Légendaire","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"CONFIGURATION_OBJET","actionObjects":"NON","undo":"SELON_COMMANDE","params":"Capacité exacte du rang indiqué ; commande COFantasy","note":"À la création, stocker la vraie commande de capacité. Pour Undo + décrémentation automatiques, privilégier une commande !cof-* afin que Items puisse injecter --decrAttribute.","uiFamily":"parchemin","compatProfile":"CONSOMMABLE_PARCHEMIN","catalogVisible":true,"displayName":"Parchemin de capacité","uiGroup":"parchemin_capacite","uiTierLabel":"Rang 4"},{"id":"A469","category":"Objet consommable","subcategory":"Parchemin","name":"Parchemin de capacité rang 5","power":5,"effect":"Permet d’utiliser une capacité de classe de rang 5 une fois, puis le parchemin est détruit.","rp":"Le texte magique se consume après lecture, libérant une technique ou un savoir scellé.","example":"Parchemin de capacité rang 5","support":"Parchemin de capacité | Capacité Rang 5 | Légendaire","rarity":"Mythique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"CONFIGURATION_OBJET","actionObjects":"NON","undo":"SELON_COMMANDE","params":"Capacité exacte du rang indiqué ; commande COFantasy","note":"À la création, stocker la vraie commande de capacité. Pour Undo + décrémentation automatiques, privilégier une commande !cof-* afin que Items puisse injecter --decrAttribute.","uiFamily":"parchemin","compatProfile":"CONSOMMABLE_PARCHEMIN","catalogVisible":true,"displayName":"Parchemin de capacité","uiGroup":"parchemin_capacite","uiTierLabel":"Rang 5"},{"id":"A470","category":"Armes","subcategory":"Armes de mêlée","name":"Mordant","power":1,"effect":"+1d6 DM supplémentaires sur un coup critique.","rp":"Le fil accroche la chair et transforme chaque ouverture en blessure profonde.","example":"mordante","support":"Arme | Base","rarity":"","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plusCrit 1d6","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"COFantasy supporte nativement --plusCrit 1d6 : aucun ajout de syntaxe ni modification du cœur.","uiFamily":"critique","compatProfile":"CAC","catalogVisible":true,"requiredTagsAny":["sword","axe"],"displayName":"Mordant","uiGroup":"critique_tranchant_2","uiTierLabel":"+1d6 sur critique","crossWeaponMode":true},{"id":"A471","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance à l’air","power":2,"effect":"Confère RD +5 contre les DM d’air pendant 1 combat.","rp":"Élixir chargé de poussière de zéphyr et sels conducteurs, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance à l’air","support":"Potion de résistance | RD Air | Air | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type DM air ; RD 5 ; durée 1 combat","note":"Réutilise la future RD temporaire typée générique avec le type canonique air. L’Undo doit restaurer effet et quantité dans le même événement.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance air","uiGroup":"potion_res_air","uiTierLabel":"Confère RD +5 contre les DM d’air pendant 1 combat.","damageType":"air"},{"id":"A472","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance à l’eau","power":2,"effect":"Confère RD +5 contre les DM d’eau pendant 1 combat.","rp":"Élixir chargé d’eau élémentaire condensée et cristaux de marée, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance à l’eau","support":"Potion de résistance | RD Eau | Eau | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type DM eau ; RD 5 ; durée 1 combat","note":"Réutilise la future RD temporaire typée générique avec le type canonique eau. L’Undo doit restaurer effet et quantité dans le même événement.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance eau","uiGroup":"potion_res_eau","uiTierLabel":"Confère RD +5 contre les DM d’eau pendant 1 combat.","damageType":"eau"},{"id":"A473","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance à la terre","power":2,"effect":"Confère RD +5 contre les DM de terre pendant 1 combat.","rp":"Élixir chargé de poudre de roche runique et argile minérale, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance à la terre","support":"Potion de résistance | RD Terre | Terre | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type DM terre ; RD 5 ; durée 1 combat","note":"Réutilise la future RD temporaire typée générique avec le type canonique terre. L’Undo doit restaurer effet et quantité dans le même événement.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance terre","uiGroup":"potion_res_terre","uiTierLabel":"Confère RD +5 contre les DM de terre pendant 1 combat.","damageType":"terre"},{"id":"A474","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance à la nature","power":2,"effect":"Confère RD +5 contre les DM de nature pendant 1 combat.","rp":"Élixir chargé de sève primordiale et essences végétales, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance à la nature","support":"Potion de résistance | RD Nature | Nature | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type DM nature ; RD 5 ; durée 1 combat","note":"Réutilise la future RD temporaire typée générique avec le type canonique nature. L’Undo doit restaurer effet et quantité dans le même événement. Ancien type Nature conservé pour compatibilité ; masqué du nouveau catalogue.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance nature","uiGroup":"potion_res_nature","uiTierLabel":"Confère RD +5 contre les DM de nature pendant 1 combat.","damageType":"nature"},{"id":"A475","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance nécrotique","power":2,"effect":"Confère RD +5 contre les DM ombres pendant 1 combat.","rp":"Élixir chargé de cendres funéraires stabilisées et sels noirs, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance ombre","support":"Potion de résistance | RD Ombre | Ombre | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type DM necrotique ; RD 5 ; durée 1 combat","note":"Réutilise la future RD temporaire typée générique avec le type canonique ombre. L’Undo doit restaurer effet et quantité dans le même événement.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance ombre","uiGroup":"potion_res_ombre","uiTierLabel":"Confère RD +5 contre les DM ombres pendant 1 combat.","damageType":"ombre"},{"id":"A476","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance radiante","power":2,"effect":"Confère RD +5 contre les DM lumières pendant 1 combat.","rp":"Élixir chargé de poudre de laënk et sels lumineux, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance lumièree","support":"Potion de résistance | RD Lumière | Lumière | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type DM radiant ; RD 5 ; durée 1 combat","note":"Réutilise la future RD temporaire typée générique avec le type canonique lumière. L’Undo doit restaurer effet et quantité dans le même événement.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance lumière","uiGroup":"potion_res_lumière","uiTierLabel":"Confère RD +5 contre les DM lumières pendant 1 combat.","damageType":"lumiere"},{"id":"A477","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance au drain","power":2,"effect":"Confère RD +5 contre les DM de drain pendant 1 combat.","rp":"Élixir chargé d’essence d’ombre et réactifs vampiriques stabilisés, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance au drain","support":"Potion de résistance | RD Drain | Drain | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type DM drain ; RD 5 ; durée 1 combat","note":"Réutilise la future RD temporaire typée générique avec le type canonique drain. L’Undo doit restaurer effet et quantité dans le même événement.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance drain","uiGroup":"potion_res_drain","uiTierLabel":"Confère RD +5 contre les DM de drain pendant 1 combat.","damageType":"drain"},{"id":"A478","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance mentale","power":2,"effect":"Confère RD +5 contre les DM mentaux pendant 1 combat.","rp":"Élixir chargé de cristaux psioniques et encens onirique, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance psychiquee","support":"Potion de résistance | RD Psychique | Psychique | Simple","rarity":"Rare","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type DM mental ; RD 5 ; durée 1 combat","note":"Réutilise la future RD temporaire typée générique avec le type canonique psychique. L’Undo doit restaurer effet et quantité dans le même événement.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance psychique","uiGroup":"potion_res_psychique","uiTierLabel":"Confère RD +5 contre les DM mentaux pendant 1 combat.","damageType":"psychique"},{"id":"A479","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance à l’air","power":4,"effect":"Confère RD +10 contre les DM d’air pendant 1 combat.","rp":"Élixir chargé de poussière de zéphyr et sels conducteurs, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance à l’air","support":"Potion de résistance | RD Air | Air | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type DM air ; RD 10 ; durée 1 combat","note":"Réutilise la future RD temporaire typée générique avec le type canonique air. L’Undo doit restaurer effet et quantité dans le même événement.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance air","uiGroup":"potion_res_air","uiTierLabel":"Confère RD +10 contre les DM d’air pendant 1 combat.","damageType":"air"},{"id":"A480","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance à l’eau","power":4,"effect":"Confère RD +10 contre les DM d’eau pendant 1 combat.","rp":"Élixir chargé d’eau élémentaire condensée et cristaux de marée, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance à l’eau","support":"Potion de résistance | RD Eau | Eau | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type DM eau ; RD 10 ; durée 1 combat","note":"Réutilise la future RD temporaire typée générique avec le type canonique eau. L’Undo doit restaurer effet et quantité dans le même événement.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance eau","uiGroup":"potion_res_eau","uiTierLabel":"Confère RD +10 contre les DM d’eau pendant 1 combat.","damageType":"eau"},{"id":"A481","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance à la terre","power":4,"effect":"Confère RD +10 contre les DM de terre pendant 1 combat.","rp":"Élixir chargé de poudre de roche runique et argile minérale, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance à la terre","support":"Potion de résistance | RD Terre | Terre | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type DM terre ; RD 10 ; durée 1 combat","note":"Réutilise la future RD temporaire typée générique avec le type canonique terre. L’Undo doit restaurer effet et quantité dans le même événement.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance terre","uiGroup":"potion_res_terre","uiTierLabel":"Confère RD +10 contre les DM de terre pendant 1 combat.","damageType":"terre"},{"id":"A482","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance à la nature","power":4,"effect":"Confère RD +10 contre les DM de nature pendant 1 combat.","rp":"Élixir chargé de sève primordiale et essences végétales, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance à la nature","support":"Potion de résistance | RD Nature | Nature | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type DM nature ; RD 10 ; durée 1 combat","note":"Réutilise la future RD temporaire typée générique avec le type canonique nature. L’Undo doit restaurer effet et quantité dans le même événement. Ancien type Nature conservé pour compatibilité ; masqué du nouveau catalogue.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance nature","uiGroup":"potion_res_nature","uiTierLabel":"Confère RD +10 contre les DM de nature pendant 1 combat.","damageType":"nature"},{"id":"A483","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance nécrotique","power":4,"effect":"Confère RD +10 contre les DM ombres pendant 1 combat.","rp":"Élixir chargé de cendres funéraires stabilisées et sels noirs, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance ombre","support":"Potion de résistance | RD Ombre | Ombre | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type DM necrotique ; RD 10 ; durée 1 combat","note":"Réutilise la future RD temporaire typée générique avec le type canonique ombre. L’Undo doit restaurer effet et quantité dans le même événement.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance ombre","uiGroup":"potion_res_ombre","uiTierLabel":"Confère RD +10 contre les DM ombres pendant 1 combat.","damageType":"ombre"},{"id":"A484","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance radiante","power":4,"effect":"Confère RD +10 contre les DM lumières pendant 1 combat.","rp":"Élixir chargé de poudre de laënk et sels lumineux, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance lumièree","support":"Potion de résistance | RD Lumière | Lumière | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type DM radiant ; RD 10 ; durée 1 combat","note":"Réutilise la future RD temporaire typée générique avec le type canonique lumière. L’Undo doit restaurer effet et quantité dans le même événement.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance lumière","uiGroup":"potion_res_lumière","uiTierLabel":"Confère RD +10 contre les DM lumières pendant 1 combat.","damageType":"lumiere"},{"id":"A485","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance au drain","power":4,"effect":"Confère RD +10 contre les DM de drain pendant 1 combat.","rp":"Élixir chargé d’essence d’ombre et réactifs vampiriques stabilisés, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance au drain","support":"Potion de résistance | RD Drain | Drain | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type DM drain ; RD 10 ; durée 1 combat","note":"Réutilise la future RD temporaire typée générique avec le type canonique drain. L’Undo doit restaurer effet et quantité dans le même événement.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance drain","uiGroup":"potion_res_drain","uiTierLabel":"Confère RD +10 contre les DM de drain pendant 1 combat.","damageType":"drain"},{"id":"A486","category":"Objet consommable","subcategory":"Fiole / potion","name":"Potion de résistance mentale","power":4,"effect":"Confère RD +10 contre les DM mentaux pendant 1 combat.","rp":"Élixir chargé de cristaux psioniques et encens onirique, laissant un reflet protecteur sur la peau du buveur.","example":"Potion de résistance psychiquee","support":"Potion de résistance | RD Psychique | Psychique | Améliorée","rarity":"Épique","status":"Action consommable","mechanism":"Effet temporaire / action","predicates":"","weaponOptions":"","fieldPatch":"","auto":false,"mode":"CONSOMMABLE","audit":"EXTENSION_MINIMALE","actionObjects":"NON","undo":"À_SECURISER","params":"Type DM mental ; RD 10 ; durée 1 combat","note":"Réutilise la future RD temporaire typée générique avec le type canonique psychique. L’Undo doit restaurer effet et quantité dans le même événement.","uiFamily":"resistance","compatProfile":"CONSOMMABLE_FIOLE___POTION","catalogVisible":false,"catalogNote":"En attente de prise en charge COFantasy.","displayName":"Potion de résistance psychique","uiGroup":"potion_res_psychique","uiTierLabel":"Confère RD +10 contre les DM mentaux pendant 1 combat.","damageType":"psychique"},{"id":"A487","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade d’air","power":2,"effect":"Inflige 2d4 DM d’air dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de poussière de zéphyr et sels conducteurs, conçue pour libérer brutalement cette énergie à l’impact.","example":"Grenade d’air","support":"Grenade | Grenade Air | Air | Niveau 1","rarity":"Rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade d’air --auto --dm 2d4 --air --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM air ; 2d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --air, --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade air","uiGroup":"grenade_air","uiTierLabel":"Inflige 2d4 DM d’air dans une zone de 4 m de diamètre.","damageType":"air"},{"id":"A488","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade d’eau","power":2,"effect":"Inflige 2d4 DM d’eau dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de eau élémentaire condensée et cristaux de marée, conçue pour libérer brutalement cette énergie à l’impact.","example":"Grenade d’eau","support":"Grenade | Grenade Eau | Eau | Niveau 1","rarity":"Rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade d’eau --auto --dm 2d4 --eau --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM eau ; 2d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --eau, --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade eau","uiGroup":"grenade_eau","uiTierLabel":"Inflige 2d4 DM d’eau dans une zone de 4 m de diamètre.","damageType":"eau"},{"id":"A489","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade de terre","power":2,"effect":"Inflige 2d4 DM de terre dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de poudre de roche runique et argile minérale, conçue pour libérer brutalement cette énergie à l’impact.","example":"Grenade de terre","support":"Grenade | Grenade Terre | Terre | Niveau 1","rarity":"Rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade de terre --auto --dm 2d4 --terre --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM terre ; 2d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --terre, --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade terre","uiGroup":"grenade_terre","uiTierLabel":"Inflige 2d4 DM de terre dans une zone de 4 m de diamètre.","damageType":"terre"},{"id":"A490","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade de nature","power":2,"effect":"Inflige 2d4 DM de nature dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de sève primordiale et essences végétales, conçue pour libérer brutalement cette énergie à l’impact.","example":"Grenade de nature","support":"Grenade | Grenade Nature | Nature | Niveau 1","rarity":"Rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade de nature --auto --dm 2d4 --nature --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM nature ; 2d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --nature, --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité. Ancien type Nature conservé pour compatibilité ; masqué du nouveau catalogue.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":false,"displayName":"Grenade nature","uiGroup":"grenade_nature","uiTierLabel":"Inflige 2d4 DM de nature dans une zone de 4 m de diamètre.","damageType":"nature"},{"id":"A491","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade nécrotique","power":2,"effect":"Inflige 2d4 DM ombres dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de cendres funéraires stabilisées et sels noirs, conçue pour libérer brutalement cette énergie à l’impact.","example":"Grenade ombre","support":"Grenade | Grenade Ombre | Ombre | Niveau 1","rarity":"Rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade nécrotique --auto --dm 2d4 --ombre --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM necrotique ; 2d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --ombre, --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade ombre","uiGroup":"grenade_ombre","uiTierLabel":"Inflige 2d4 DM ombres dans une zone de 4 m de diamètre.","damageType":"ombre"},{"id":"A492","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade radiante","power":2,"effect":"Inflige 2d4 DM lumières dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de poudre de laënk et sels lumineux, conçue pour libérer brutalement cette énergie à l’impact.","example":"Grenade lumièree","support":"Grenade | Grenade Lumière | Lumière | Niveau 1","rarity":"Rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade radiante --auto --dm 2d4 --lumiere --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM radiant ; 2d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --lumière, --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade lumière","uiGroup":"grenade_lumière","uiTierLabel":"Inflige 2d4 DM lumières dans une zone de 4 m de diamètre.","damageType":"lumiere"},{"id":"A493","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade de drain","power":2,"effect":"Inflige 2d4 DM de drain dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de essence d’ombre et réactifs vampiriques stabilisés, conçue pour libérer brutalement cette énergie à l’impact.","example":"Grenade de drain","support":"Grenade | Grenade Drain | Drain | Niveau 1","rarity":"Rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade de drain --auto --dm 2d4 --drain --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM drain ; 2d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --drain, --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade drain","uiGroup":"grenade_drain","uiTierLabel":"Inflige 2d4 DM de drain dans une zone de 4 m de diamètre.","damageType":"drain"},{"id":"A494","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade mentale","power":2,"effect":"Inflige 2d4 DM mentaux dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de cristaux psioniques et encens onirique, conçue pour libérer brutalement cette énergie à l’impact.","example":"Grenade psychiquee","support":"Grenade | Grenade Psychique | Psychique | Niveau 1","rarity":"Rare","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade mentale --auto --dm 2d4 --psychique --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM mental ; 2d4 ; portée 10 m ; rayon 2 m","note":"Même commande !cof-explosion et Undo natif, après ajout minimal de --psychique à la liste des types de dégâts acceptés.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade psychique","uiGroup":"grenade_psychique","uiTierLabel":"Inflige 2d4 DM mentaux dans une zone de 4 m de diamètre.","damageType":"psychique"},{"id":"A495","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade d’air","power":4,"effect":"Inflige 5d4 DM d’air dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de poussière de zéphyr et sels conducteurs, conçue pour libérer brutalement cette énergie à l’impact.","example":"Grenade d’air","support":"Grenade | Grenade Air | Air | Niveau 2","rarity":"Épique","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade d’air --auto --dm 5d4 --air --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM air ; 5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --air, --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade air","uiGroup":"grenade_air","uiTierLabel":"Inflige 5d4 DM d’air dans une zone de 4 m de diamètre.","damageType":"air"},{"id":"A496","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade d’eau","power":4,"effect":"Inflige 5d4 DM d’eau dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de eau élémentaire condensée et cristaux de marée, conçue pour libérer brutalement cette énergie à l’impact.","example":"Grenade d’eau","support":"Grenade | Grenade Eau | Eau | Niveau 2","rarity":"Épique","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade d’eau --auto --dm 5d4 --eau --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM eau ; 5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --eau, --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade eau","uiGroup":"grenade_eau","uiTierLabel":"Inflige 5d4 DM d’eau dans une zone de 4 m de diamètre.","damageType":"eau"},{"id":"A497","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade de terre","power":4,"effect":"Inflige 5d4 DM de terre dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de poudre de roche runique et argile minérale, conçue pour libérer brutalement cette énergie à l’impact.","example":"Grenade de terre","support":"Grenade | Grenade Terre | Terre | Niveau 2","rarity":"Épique","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade de terre --auto --dm 5d4 --terre --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM terre ; 5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --terre, --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade terre","uiGroup":"grenade_terre","uiTierLabel":"Inflige 5d4 DM de terre dans une zone de 4 m de diamètre.","damageType":"terre"},{"id":"A498","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade de nature","power":4,"effect":"Inflige 5d4 DM de nature dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de sève primordiale et essences végétales, conçue pour libérer brutalement cette énergie à l’impact.","example":"Grenade de nature","support":"Grenade | Grenade Nature | Nature | Niveau 2","rarity":"Épique","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade de nature --auto --dm 5d4 --nature --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM nature ; 5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --nature, --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité. Ancien type Nature conservé pour compatibilité ; masqué du nouveau catalogue.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":false,"displayName":"Grenade nature","uiGroup":"grenade_nature","uiTierLabel":"Inflige 5d4 DM de nature dans une zone de 4 m de diamètre.","damageType":"nature"},{"id":"A499","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade nécrotique","power":4,"effect":"Inflige 5d4 DM ombres dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de cendres funéraires stabilisées et sels noirs, conçue pour libérer brutalement cette énergie à l’impact.","example":"Grenade ombre","support":"Grenade | Grenade Ombre | Ombre | Niveau 2","rarity":"Épique","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade nécrotique --auto --dm 5d4 --ombre --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM necrotique ; 5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --ombre, --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade ombre","uiGroup":"grenade_ombre","uiTierLabel":"Inflige 5d4 DM ombres dans une zone de 4 m de diamètre.","damageType":"ombre"},{"id":"A500","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade radiante","power":4,"effect":"Inflige 5d4 DM lumières dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de poudre de laënk et sels lumineux, conçue pour libérer brutalement cette énergie à l’impact.","example":"Grenade lumièree","support":"Grenade | Grenade Lumière | Lumière | Niveau 2","rarity":"Épique","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade radiante --auto --dm 5d4 --lumiere --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM radiant ; 5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --lumière, --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade lumière","uiGroup":"grenade_lumière","uiTierLabel":"Inflige 5d4 DM lumières dans une zone de 4 m de diamètre.","damageType":"lumiere"},{"id":"A501","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade de drain","power":4,"effect":"Inflige 5d4 DM de drain dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de essence d’ombre et réactifs vampiriques stabilisés, conçue pour libérer brutalement cette énergie à l’impact.","example":"Grenade de drain","support":"Grenade | Grenade Drain | Drain | Niveau 2","rarity":"Épique","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade de drain --auto --dm 5d4 --drain --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM drain ; 5d4 ; portée 10 m ; rayon 2 m","note":"Utilise !cof-explosion natif avec --drain, --portee 10 --disque 2. COFantasy Items injecte --decrAttribute pour un Undo unique effet + quantité.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade drain","uiGroup":"grenade_drain","uiTierLabel":"Inflige 5d4 DM de drain dans une zone de 4 m de diamètre.","damageType":"drain"},{"id":"A502","category":"Objet consommable","subcategory":"Grenade / projectile alchimique","name":"Grenade mentale","power":4,"effect":"Inflige 5d4 DM mentaux dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de cristaux psioniques et encens onirique, conçue pour libérer brutalement cette énergie à l’impact.","example":"Grenade psychiquee","support":"Grenade | Grenade Psychique | Psychique | Niveau 2","rarity":"Épique","status":"Action consommable","mechanism":"Commande COFantasy","predicates":"","weaponOptions":"","fieldPatch":"!cof-explosion Grenade mentale --auto --dm 5d4 --psychique --portee 10 --disque 2","auto":true,"mode":"CONSOMMABLE","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"COF_NATIF_DECRATTRIBUTE","params":"Type DM mental ; 5d4 ; portée 10 m ; rayon 2 m","note":"Même commande !cof-explosion et Undo natif, après ajout minimal de --psychique à la liste des types de dégâts acceptés.","uiFamily":"grenade","compatProfile":"CONSOMMABLE_GRENADE___PROJECTILE_ALCHIMIQUE","catalogVisible":true,"displayName":"Grenade psychique","uiGroup":"grenade_psychique","uiTierLabel":"Inflige 5d4 DM mentaux dans une zone de 4 m de diamètre.","damageType":"psychique"},{"id":"A503","category":"Armes","subcategory":"Armes magiques","name":"canalisation d’air","power":2,"effect":"+1d4 DM d’air aux sorts offensifs canalisés via l’arme.","rp":"L’air se comprime autour du focus pendant l’incantation.","example":"canalisation d’air","support":"Focus magique | air | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact air ; bonus 1d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est air. La plus forte canalisation du même type l’emporte ; pas de cumul.","channelType":"air","channelDice":"1d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation air","uiGroup":"canal_air","uiTierLabel":"1d4","damageType":"air"},{"id":"A504","category":"Armes","subcategory":"Armes magiques","name":"canalisation d’eau","power":2,"effect":"+1d4 DM d’eau aux sorts offensifs canalisés via l’arme.","rp":"Des gouttelettes et reflets mouvants parcourent le focus.","example":"canalisation d’eau","support":"Focus magique | eau | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact eau ; bonus 1d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est eau. La plus forte canalisation du même type l’emporte ; pas de cumul.","channelType":"eau","channelDice":"1d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation eau","uiGroup":"canal_eau","uiTierLabel":"1d4","damageType":"eau"},{"id":"A505","category":"Armes","subcategory":"Armes magiques","name":"canalisation de terre","power":2,"effect":"+1d4 DM de terre aux sorts offensifs canalisés via l’arme.","rp":"Le focus vibre d’une lourde résonance minérale.","example":"canalisation de terre","support":"Focus magique | terre | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact terre ; bonus 1d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est terre. La plus forte canalisation du même type l’emporte ; pas de cumul.","channelType":"terre","channelDice":"1d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation terre","uiGroup":"canal_terre","uiTierLabel":"1d4","damageType":"terre"},{"id":"A506","category":"Armes","subcategory":"Armes magiques","name":"canalisation de nature","power":2,"effect":"+1d4 DM de nature aux sorts offensifs canalisés via l’arme.","rp":"Une pulsation végétale ou primordiale accompagne le sort.","example":"canalisation de nature","support":"Focus magique | nature | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact nature ; bonus 1d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est nature. La plus forte canalisation du même type l’emporte ; pas de cumul. Ancien type Nature conservé pour compatibilité ; masqué du nouveau catalogue.","channelType":"nature","channelDice":"1d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":false,"displayName":"Canalisation nature","uiGroup":"canal_nature","uiTierLabel":"1d4","damageType":"nature"},{"id":"A507","category":"Armes","subcategory":"Armes magiques","name":"canalisation nécrotique","power":2,"effect":"+1d4 DM ombres aux sorts offensifs canalisés via l’arme.","rp":"Une ombre froide s’étire autour du focus.","example":"canalisation ombre","support":"Focus magique | ombre | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact necrotique ; bonus 1d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est ombre. La plus forte canalisation du même type l’emporte ; pas de cumul.","channelType":"necrotique","channelDice":"1d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation ombre","uiGroup":"canal_ombre","uiTierLabel":"1d4","damageType":"ombre"},{"id":"A508","category":"Armes","subcategory":"Armes magiques","name":"canalisation radiante","power":2,"effect":"+1d4 DM lumières aux sorts offensifs canalisés via l’arme.","rp":"Le focus diffuse un éclat clair au lancement du sort.","example":"canalisation lumièree","support":"Focus magique | lumière | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact radiant ; bonus 1d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est lumière. La plus forte canalisation du même type l’emporte ; pas de cumul.","channelType":"radiant","channelDice":"1d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation lumière","uiGroup":"canal_lumière","uiTierLabel":"1d4","damageType":"lumiere"},{"id":"A509","category":"Armes","subcategory":"Armes magiques","name":"canalisation de drain","power":2,"effect":"+1d4 DM de drain aux sorts offensifs canalisés via l’arme.","rp":"Une lueur sombre aspire brièvement l’énergie alentour.","example":"canalisation de drain","support":"Focus magique | drain | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact drain ; bonus 1d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est drain. La plus forte canalisation du même type l’emporte ; pas de cumul.","channelType":"drain","channelDice":"1d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation drain","uiGroup":"canal_drain","uiTierLabel":"1d4","damageType":"drain"},{"id":"A510","category":"Armes","subcategory":"Armes magiques","name":"canalisation mentale","power":2,"effect":"+1d4 DM mentaux aux sorts offensifs canalisés via l’arme.","rp":"Le focus résonne comme une pensée étrangère et aiguë.","example":"canalisation psychiquee","support":"Focus magique | psychique | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact mental ; bonus 1d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est psychique. La plus forte canalisation du même type l’emporte ; pas de cumul.","channelType":"mental","channelDice":"1d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation psychique","uiGroup":"canal_psychique","uiTierLabel":"1d4","damageType":"psychique"},{"id":"A511","category":"Armes","subcategory":"Armes magiques","name":"canalisation tranchante","power":2,"effect":"+1d4 DM tranchants aux sorts offensifs canalisés via l’arme.","rp":"Le mana se condense en arêtes invisibles autour du focus.","example":"canalisation tranchante","support":"Focus magique | tranchant | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact tranchant ; bonus 1d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est tranchant. La plus forte canalisation du même type l’emporte ; pas de cumul.","channelType":"tranchant","channelDice":"1d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation tranchant","uiGroup":"canal_tranchant","uiTierLabel":"1d4","damageType":"tranchant"},{"id":"A512","category":"Armes","subcategory":"Armes magiques","name":"canalisation perçante","power":2,"effect":"+1d4 DM perçants aux sorts offensifs canalisés via l’arme.","rp":"Le sort se resserre en une pointe d’énergie extrêmement dense.","example":"canalisation perçante","support":"Focus magique | percant | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact percant ; bonus 1d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est percant. La plus forte canalisation du même type l’emporte ; pas de cumul.","channelType":"percant","channelDice":"1d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation perçant","uiGroup":"canal_percant","uiTierLabel":"1d4","damageType":"percant"},{"id":"A513","category":"Armes","subcategory":"Armes magiques","name":"canalisation contondante","power":2,"effect":"+1d4 DM contondants aux sorts offensifs canalisés via l’arme.","rp":"Une onde de choc compacte se forme autour du focus.","example":"canalisation contondante","support":"Focus magique | contondant | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact contondant ; bonus 1d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est contondant. La plus forte canalisation du même type l’emporte ; pas de cumul.","channelType":"contondant","channelDice":"1d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation contondant","uiGroup":"canal_contondant","uiTierLabel":"1d4","damageType":"contondant"},{"id":"A514","category":"Armes","subcategory":"Armes magiques","name":"canalisation d’air supérieure","power":3,"effect":"+2d4 DM d’air aux sorts offensifs canalisés via l’arme.","rp":"L’air se comprime autour du focus pendant l’incantation.","example":"canalisation d’air supérieure","support":"Focus magique | air | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact air ; bonus 2d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est air. La plus forte canalisation du même type l’emporte ; pas de cumul.","channelType":"air","channelDice":"2d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation air","uiGroup":"canal_air","uiTierLabel":"2d4","damageType":"air"},{"id":"A515","category":"Armes","subcategory":"Armes magiques","name":"canalisation d’eau supérieure","power":3,"effect":"+2d4 DM d’eau aux sorts offensifs canalisés via l’arme.","rp":"Des gouttelettes et reflets mouvants parcourent le focus.","example":"canalisation d’eau supérieure","support":"Focus magique | eau | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact eau ; bonus 2d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est eau. La plus forte canalisation du même type l’emporte ; pas de cumul.","channelType":"eau","channelDice":"2d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation eau","uiGroup":"canal_eau","uiTierLabel":"2d4","damageType":"eau"},{"id":"A516","category":"Armes","subcategory":"Armes magiques","name":"canalisation de terre supérieure","power":3,"effect":"+2d4 DM de terre aux sorts offensifs canalisés via l’arme.","rp":"Le focus vibre d’une lourde résonance minérale.","example":"canalisation de terre supérieure","support":"Focus magique | terre | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact terre ; bonus 2d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est terre. La plus forte canalisation du même type l’emporte ; pas de cumul.","channelType":"terre","channelDice":"2d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation terre","uiGroup":"canal_terre","uiTierLabel":"2d4","damageType":"terre"},{"id":"A517","category":"Armes","subcategory":"Armes magiques","name":"canalisation de nature supérieure","power":3,"effect":"+2d4 DM de nature aux sorts offensifs canalisés via l’arme.","rp":"Une pulsation végétale ou primordiale accompagne le sort.","example":"canalisation de nature supérieure","support":"Focus magique | nature | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact nature ; bonus 2d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est nature. La plus forte canalisation du même type l’emporte ; pas de cumul. Ancien type Nature conservé pour compatibilité ; masqué du nouveau catalogue.","channelType":"nature","channelDice":"2d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":false,"displayName":"Canalisation nature","uiGroup":"canal_nature","uiTierLabel":"2d4","damageType":"nature"},{"id":"A518","category":"Armes","subcategory":"Armes magiques","name":"canalisation nécrotique supérieure","power":3,"effect":"+2d4 DM ombres aux sorts offensifs canalisés via l’arme.","rp":"Une ombre froide s’étire autour du focus.","example":"canalisation ombre supérieure","support":"Focus magique | ombre | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact necrotique ; bonus 2d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est ombre. La plus forte canalisation du même type l’emporte ; pas de cumul.","channelType":"necrotique","channelDice":"2d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation ombre","uiGroup":"canal_ombre","uiTierLabel":"2d4","damageType":"ombre"},{"id":"A519","category":"Armes","subcategory":"Armes magiques","name":"canalisation radiante supérieure","power":3,"effect":"+2d4 DM lumières aux sorts offensifs canalisés via l’arme.","rp":"Le focus diffuse un éclat clair au lancement du sort.","example":"canalisation lumièree supérieure","support":"Focus magique | lumière | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact radiant ; bonus 2d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est lumière. La plus forte canalisation du même type l’emporte ; pas de cumul.","channelType":"radiant","channelDice":"2d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation lumière","uiGroup":"canal_lumière","uiTierLabel":"2d4","damageType":"lumiere"},{"id":"A520","category":"Armes","subcategory":"Armes magiques","name":"canalisation de drain supérieure","power":3,"effect":"+2d4 DM de drain aux sorts offensifs canalisés via l’arme.","rp":"Une lueur sombre aspire brièvement l’énergie alentour.","example":"canalisation de drain supérieure","support":"Focus magique | drain | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact drain ; bonus 2d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est drain. La plus forte canalisation du même type l’emporte ; pas de cumul.","channelType":"drain","channelDice":"2d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation drain","uiGroup":"canal_drain","uiTierLabel":"2d4","damageType":"drain"},{"id":"A521","category":"Armes","subcategory":"Armes magiques","name":"canalisation mentale supérieure","power":3,"effect":"+2d4 DM mentaux aux sorts offensifs canalisés via l’arme.","rp":"Le focus résonne comme une pensée étrangère et aiguë.","example":"canalisation psychiquee supérieure","support":"Focus magique | psychique | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact mental ; bonus 2d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est psychique. La plus forte canalisation du même type l’emporte ; pas de cumul.","channelType":"mental","channelDice":"2d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation psychique","uiGroup":"canal_psychique","uiTierLabel":"2d4","damageType":"psychique"},{"id":"A522","category":"Armes","subcategory":"Armes magiques","name":"canalisation tranchante supérieure","power":3,"effect":"+2d4 DM tranchants aux sorts offensifs canalisés via l’arme.","rp":"Le mana se condense en arêtes invisibles autour du focus.","example":"canalisation tranchante supérieure","support":"Focus magique | tranchant | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact tranchant ; bonus 2d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est tranchant. La plus forte canalisation du même type l’emporte ; pas de cumul.","channelType":"tranchant","channelDice":"2d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation tranchant","uiGroup":"canal_tranchant","uiTierLabel":"2d4","damageType":"tranchant"},{"id":"A523","category":"Armes","subcategory":"Armes magiques","name":"canalisation perçante supérieure","power":3,"effect":"+2d4 DM perçants aux sorts offensifs canalisés via l’arme.","rp":"Le sort se resserre en une pointe d’énergie extrêmement dense.","example":"canalisation perçante supérieure","support":"Focus magique | percant | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact percant ; bonus 2d4","note":"Canalisation appliquée uniquement si le sort est --sortilege et que son type principal est percant. La plus forte canalisation du même type l’emporte ; pas de cumul.","channelType":"percant","channelDice":"2d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation perçant","uiGroup":"canal_percant","uiTierLabel":"2d4","damageType":"percant"},{"id":"A524","category":"Armes","subcategory":"Armes magiques","name":"canalisation contondante supérieure","power":3,"effect":"+2d4 DM contondants aux sorts offensifs canalisés via l’arme.","rp":"Une onde de choc compacte se forme autour du focus.","example":"canalisation contondante supérieure","support":"Focus magique | contondant | Canalisation de dégâts","rarity":"","status":"Focus magique","mechanism":"Canalisation exacte de sort","predicates":"","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT_APRES_PATCH","actionObjects":"NON","undo":"AUCUN","params":"Focus équipé ; --sortilege ; type principal exact contondant ; bonus 2d4","note":"La plus forte canalisation contondante équipée l’emporte ; pas de cumul.","channelType":"contondant","channelDice":"2d4","uiFamily":"canalisation","compatProfile":"FOCUS_MAGIQUE","catalogVisible":true,"displayName":"Canalisation contondant","uiGroup":"canal_contondant","uiTierLabel":"2d4","damageType":"contondant"},{"id":"A525","category":"Accessoire","subcategory":"Anneau","name":"RD Air","power":1,"effect":"RD 2 contre les DM d’air","rp":"Le cercle runique absorbe une partie des énergies d’air avant qu’elles n’atteignent le porteur.","example":"Anneau de l’Égide des vents","support":"Anneau | Air | Résistance typée | RD 2","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::air:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"type=air; valeur=2","note":"Pris en compte par le moteur de RD typée quand l’anneau est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Égide des vents","uiGroup":"anneau_rd_air","uiTierLabel":"RD 2 contre les DM d’air","damageType":"air"},{"id":"A526","category":"Accessoire","subcategory":"Anneau","name":"RD Air","power":3,"effect":"RD 4 contre les DM d’air","rp":"Le cercle runique absorbe une partie des énergies d’air avant qu’elles n’atteignent le porteur.","example":"Anneau de l’Égide des vents","support":"Anneau | Air | Résistance typée | RD 4","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::air:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"type=air; valeur=4","note":"Pris en compte par le moteur de RD typée quand l’anneau est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Égide des vents","uiGroup":"anneau_rd_air","uiTierLabel":"RD 4 contre les DM d’air","damageType":"air"},{"id":"A527","category":"Accessoire","subcategory":"Anneau","name":"RD Eau","power":1,"effect":"RD 2 contre les DM d’eau","rp":"Le cercle runique absorbe une partie des énergies d’eau avant qu’elles n’atteignent le porteur.","example":"Anneau de l’Égide des marées","support":"Anneau | Eau | Résistance typée | RD 2","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::eau:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"type=eau; valeur=2","note":"Pris en compte par le moteur de RD typée quand l’anneau est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Égide des marées","uiGroup":"anneau_rd_eau","uiTierLabel":"RD 2 contre les DM d’eau","damageType":"eau"},{"id":"A528","category":"Accessoire","subcategory":"Anneau","name":"RD Eau","power":3,"effect":"RD 4 contre les DM d’eau","rp":"Le cercle runique absorbe une partie des énergies d’eau avant qu’elles n’atteignent le porteur.","example":"Anneau de l’Égide des marées","support":"Anneau | Eau | Résistance typée | RD 4","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::eau:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"type=eau; valeur=4","note":"Pris en compte par le moteur de RD typée quand l’anneau est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Égide des marées","uiGroup":"anneau_rd_eau","uiTierLabel":"RD 4 contre les DM d’eau","damageType":"eau"},{"id":"A529","category":"Accessoire","subcategory":"Anneau","name":"RD Terre","power":1,"effect":"RD 2 contre les DM de terre","rp":"Le cercle runique absorbe une partie des énergies de terre avant qu’elles n’atteignent le porteur.","example":"Anneau de l’Égide de pierre","support":"Anneau | Terre | Résistance typée | RD 2","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::terre:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"type=terre; valeur=2","note":"Pris en compte par le moteur de RD typée quand l’anneau est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Égide de pierre","uiGroup":"anneau_rd_terre","uiTierLabel":"RD 2 contre les DM de terre","damageType":"terre"},{"id":"A530","category":"Accessoire","subcategory":"Anneau","name":"RD Terre","power":3,"effect":"RD 4 contre les DM de terre","rp":"Le cercle runique absorbe une partie des énergies de terre avant qu’elles n’atteignent le porteur.","example":"Anneau de l’Égide de pierre","support":"Anneau | Terre | Résistance typée | RD 4","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::terre:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"type=terre; valeur=4","note":"Pris en compte par le moteur de RD typée quand l’anneau est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Égide de pierre","uiGroup":"anneau_rd_terre","uiTierLabel":"RD 4 contre les DM de terre","damageType":"terre"},{"id":"A531","category":"Accessoire","subcategory":"Anneau","name":"RD Nature","power":1,"effect":"RD 2 contre les DM de nature","rp":"Le cercle runique absorbe une partie des énergies de nature avant qu’elles n’atteignent le porteur.","example":"Anneau de l’Égide du vivant","support":"Anneau | Nature | Résistance typée | RD 2","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::nature:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"type=nature; valeur=2","note":"Pris en compte par le moteur de RD typée quand l’anneau est équipé. Ancien type Nature conservé pour compatibilité ; masqué du nouveau catalogue.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":false,"displayName":"Égide du vivant","uiGroup":"anneau_rd_nature","uiTierLabel":"RD 2 contre les DM de nature","damageType":"nature"},{"id":"A532","category":"Accessoire","subcategory":"Anneau","name":"RD Nature","power":3,"effect":"RD 4 contre les DM de nature","rp":"Le cercle runique absorbe une partie des énergies de nature avant qu’elles n’atteignent le porteur.","example":"Anneau de l’Égide du vivant","support":"Anneau | Nature | Résistance typée | RD 4","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::nature:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"type=nature; valeur=4","note":"Pris en compte par le moteur de RD typée quand l’anneau est équipé. Ancien type Nature conservé pour compatibilité ; masqué du nouveau catalogue.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":false,"displayName":"Égide du vivant","uiGroup":"anneau_rd_nature","uiTierLabel":"RD 4 contre les DM de nature","damageType":"nature"},{"id":"A533","category":"Accessoire","subcategory":"Anneau","name":"RD Nécrotique","power":1,"effect":"RD 2 contre les DM ombres","rp":"Le cercle runique absorbe une partie des énergies ombres avant qu’elles n’atteignent le porteur.","example":"Anneau de l’Égide funéraire","support":"Anneau | Ombre | Résistance typée | RD 2","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::necrotique:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"type=necrotique; valeur=2","note":"Pris en compte par le moteur de RD typée quand l’anneau est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Égide funéraire","uiGroup":"anneau_rd_ombre","uiTierLabel":"RD 2 contre les DM ombres","damageType":"ombre"},{"id":"A534","category":"Accessoire","subcategory":"Anneau","name":"RD Nécrotique","power":3,"effect":"RD 4 contre les DM ombres","rp":"Le cercle runique absorbe une partie des énergies ombres avant qu’elles n’atteignent le porteur.","example":"Anneau de l’Égide funéraire","support":"Anneau | Ombre | Résistance typée | RD 4","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::necrotique:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"type=necrotique; valeur=4","note":"Pris en compte par le moteur de RD typée quand l’anneau est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Égide funéraire","uiGroup":"anneau_rd_ombre","uiTierLabel":"RD 4 contre les DM ombres","damageType":"ombre"},{"id":"A535","category":"Accessoire","subcategory":"Anneau","name":"RD Radiant","power":1,"effect":"RD 2 contre les DM lumières","rp":"Le cercle runique absorbe une partie des énergies lumières avant qu’elles n’atteignent le porteur.","example":"Anneau de l’Égide solaire","support":"Anneau | Lumière | Résistance typée | RD 2","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::radiant:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"type=radiant; valeur=2","note":"Pris en compte par le moteur de RD typée quand l’anneau est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Égide solaire","uiGroup":"anneau_rd_lumière","uiTierLabel":"RD 2 contre les DM lumières","damageType":"radiant"},{"id":"A536","category":"Accessoire","subcategory":"Anneau","name":"RD Radiant","power":3,"effect":"RD 4 contre les DM lumières","rp":"Le cercle runique absorbe une partie des énergies lumières avant qu’elles n’atteignent le porteur.","example":"Anneau de l’Égide solaire","support":"Anneau | Lumière | Résistance typée | RD 4","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::radiant:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"type=radiant; valeur=4","note":"Pris en compte par le moteur de RD typée quand l’anneau est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Égide solaire","uiGroup":"anneau_rd_lumière","uiTierLabel":"RD 4 contre les DM lumières","damageType":"radiant"},{"id":"A537","category":"Accessoire","subcategory":"Anneau","name":"RD Arcane","power":1,"effect":"RD 2 contre les DM force","rp":"Le cercle runique absorbe une partie des énergies force avant qu’elles n’atteignent le porteur.","example":"Anneau de l’Égide arcanique","support":"Anneau | Force | Résistance typée | RD 2","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::arcane:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"type=arcane; valeur=2","note":"Pris en compte par le moteur de RD typée quand l’anneau est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Égide arcanique","uiGroup":"anneau_rd_force","uiTierLabel":"RD 2 contre les DM force","damageType":"force"},{"id":"A538","category":"Accessoire","subcategory":"Anneau","name":"RD Arcane","power":3,"effect":"RD 4 contre les DM force","rp":"Le cercle runique absorbe une partie des énergies force avant qu’elles n’atteignent le porteur.","example":"Anneau de l’Égide arcanique","support":"Anneau | Force | Résistance typée | RD 4","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::arcane:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"type=arcane; valeur=4","note":"Pris en compte par le moteur de RD typée quand l’anneau est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Égide arcanique","uiGroup":"anneau_rd_force","uiTierLabel":"RD 4 contre les DM force","damageType":"force"},{"id":"A539","category":"Accessoire","subcategory":"Anneau","name":"RD Sonique","power":1,"effect":"RD 2 contre les DM airs","rp":"Le cercle runique absorbe une partie des énergies airs avant qu’elles n’atteignent le porteur.","example":"Anneau de l’Égide du silence","support":"Anneau | Air | Résistance typée | RD 2","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::sonique:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"type=sonique; valeur=2","note":"Pris en compte par le moteur de RD typée quand l’anneau est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Égide du silence","uiGroup":"anneau_rd_air","uiTierLabel":"RD 2 contre les DM airs","damageType":"air"},{"id":"A540","category":"Accessoire","subcategory":"Anneau","name":"RD Sonique","power":3,"effect":"RD 4 contre les DM airs","rp":"Le cercle runique absorbe une partie des énergies airs avant qu’elles n’atteignent le porteur.","example":"Anneau de l’Égide du silence","support":"Anneau | Air | Résistance typée | RD 4","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::sonique:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"type=sonique; valeur=4","note":"Pris en compte par le moteur de RD typée quand l’anneau est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Égide du silence","uiGroup":"anneau_rd_air","uiTierLabel":"RD 4 contre les DM airs","damageType":"air"},{"id":"A541","category":"Accessoire","subcategory":"Anneau","name":"RD Maladie","power":1,"effect":"RD 2 contre les DM de toxique","rp":"Le cercle runique absorbe une partie des énergies de toxique avant qu’elles n’atteignent le porteur.","example":"Anneau de l’Égide de pureté","support":"Anneau | Toxique | Résistance typée | RD 2","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::maladie:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"type=maladie; valeur=2","note":"Pris en compte par le moteur de RD typée quand l’anneau est équipé. Doublon historique fusionné vers toxique; conservé hors catalogue.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":false,"displayName":"Égide de pureté","uiGroup":"anneau_rd_toxique","uiTierLabel":"RD 2 contre les DM de toxique","damageType":"toxique"},{"id":"A542","category":"Accessoire","subcategory":"Anneau","name":"RD Maladie","power":3,"effect":"RD 4 contre les DM de toxique","rp":"Le cercle runique absorbe une partie des énergies de toxique avant qu’elles n’atteignent le porteur.","example":"Anneau de l’Égide de pureté","support":"Anneau | Toxique | Résistance typée | RD 4","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::maladie:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"type=maladie; valeur=4","note":"Pris en compte par le moteur de RD typée quand l’anneau est équipé. Doublon historique fusionné vers toxique; conservé hors catalogue.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":false,"displayName":"Égide de pureté","uiGroup":"anneau_rd_toxique","uiTierLabel":"RD 4 contre les DM de toxique","damageType":"toxique"},{"id":"A543","category":"Accessoire","subcategory":"Anneau","name":"RD Drain","power":1,"effect":"RD 2 contre les DM de drain","rp":"Le cercle runique absorbe une partie des énergies de drain avant qu’elles n’atteignent le porteur.","example":"Anneau de l’Égide vitale","support":"Anneau | Drain | Résistance typée | RD 2","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::drain:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"type=drain; valeur=2","note":"Pris en compte par le moteur de RD typée quand l’anneau est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Égide vitale","uiGroup":"anneau_rd_drain","uiTierLabel":"RD 2 contre les DM de drain","damageType":"drain"},{"id":"A544","category":"Accessoire","subcategory":"Anneau","name":"RD Drain","power":3,"effect":"RD 4 contre les DM de drain","rp":"Le cercle runique absorbe une partie des énergies de drain avant qu’elles n’atteignent le porteur.","example":"Anneau de l’Égide vitale","support":"Anneau | Drain | Résistance typée | RD 4","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::drain:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"type=drain; valeur=4","note":"Pris en compte par le moteur de RD typée quand l’anneau est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Égide vitale","uiGroup":"anneau_rd_drain","uiTierLabel":"RD 4 contre les DM de drain","damageType":"drain"},{"id":"A545","category":"Accessoire","subcategory":"Anneau","name":"RD Mental","power":1,"effect":"RD 2 contre les DM mentaux","rp":"Le cercle runique absorbe une partie des énergies mentaux avant qu’elles n’atteignent le porteur.","example":"Anneau de l’Égide de l’esprit","support":"Anneau | Psychique | Résistance typée | RD 2","rarity":"Rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::mental:2","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"type=mental; valeur=2","note":"Pris en compte par le moteur de RD typée quand l’anneau est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Égide de l’esprit","uiGroup":"anneau_rd_psychique","uiTierLabel":"RD 2 contre les DM mentaux","damageType":"psychique"},{"id":"A546","category":"Accessoire","subcategory":"Anneau","name":"RD Mental","power":3,"effect":"RD 4 contre les DM mentaux","rp":"Le cercle runique absorbe une partie des énergies mentaux avant qu’elles n’atteignent le porteur.","example":"Anneau de l’Égide de l’esprit","support":"Anneau | Psychique | Résistance typée | RD 4","rarity":"Très rare","status":"Prédicat direct","mechanism":"Prédicat équipé","predicates":"bonus_RD::mental:4","weaponOptions":"","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"type=mental; valeur=4","note":"Pris en compte par le moteur de RD typée quand l’anneau est équipé.","uiFamily":"resistance","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Égide de l’esprit","uiGroup":"anneau_rd_psychique","uiTierLabel":"RD 4 contre les DM mentaux","damageType":"psychique"},{"id":"A547","category":"Accessoire","subcategory":"Anneau","name":"Réserve de mana","power":2,"effect":"1 fois par jour, récupère 1 dé de mana.","rp":"Une gemme enchâssée dans l’anneau se ternit lorsque sa réserve est sollicitée.","example":"Anneau de réserve arcanique","support":"Anneau | Mana | Action d’objet | 1/jour","rarity":"Très rare","status":"Action / usage limité","mechanism":"Commande COFantasy + action équipement","predicates":"","weaponOptions":"","fieldPatch":"!cof-recupere-mana 1d@{selected|de_mana} --limiteParJour 1 reserveMana_{ITEM_ID}","auto":true,"mode":"ACTION_EQUIPEMENT","audit":"COF_EXISTANT_PARAMETRE","actionObjects":"OUI","undo":"COF_NATIF","params":"ITEM_ID unique ; dé de mana de la fiche","note":"Commande COFantasy native ; la limite et la récupération sont dans le même événement Undo.","uiFamily":"pouvoir","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Réserve de mana","uiGroup":"anneau_reserve_mana","uiTierLabel":"1 charge/jour"},{"id":"A548","category":"Accessoire","subcategory":"Anneau","name":"Réserve de mana supérieure","power":3,"effect":"2 fois par jour, récupère 1 dé de mana.","rp":"Une gemme enchâssée dans l’anneau se ternit lorsque sa réserve est sollicitée.","example":"Anneau de réserve arcanique","support":"Anneau | Mana | Action d’objet | 2/jour","rarity":"Épique","status":"Action / usage limité","mechanism":"Commande COFantasy + action équipement","predicates":"","weaponOptions":"","fieldPatch":"!cof-recupere-mana 1d@{selected|de_mana} --limiteParJour 2 reserveMana_{ITEM_ID}","auto":true,"mode":"ACTION_EQUIPEMENT","audit":"COF_EXISTANT_PARAMETRE","actionObjects":"OUI","undo":"COF_NATIF","params":"ITEM_ID unique ; dé de mana de la fiche","note":"Commande COFantasy native ; la limite et la récupération sont dans le même événement Undo.","uiFamily":"pouvoir","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Réserve de mana","uiGroup":"anneau_reserve_mana","uiTierLabel":"2 charges/jour"},{"id":"A549","category":"Accessoire","subcategory":"Anneau","name":"Réserve de mana majeure","power":4,"effect":"3 fois par jour, récupère 1 dé de mana.","rp":"Une gemme enchâssée dans l’anneau se ternit lorsque sa réserve est sollicitée.","example":"Anneau de réserve arcanique","support":"Anneau | Mana | Action d’objet | 3/jour","rarity":"Légendaire","status":"Action / usage limité","mechanism":"Commande COFantasy + action équipement","predicates":"","weaponOptions":"","fieldPatch":"!cof-recupere-mana 1d@{selected|de_mana} --limiteParJour 3 reserveMana_{ITEM_ID}","auto":true,"mode":"ACTION_EQUIPEMENT","audit":"COF_EXISTANT_PARAMETRE","actionObjects":"OUI","undo":"COF_NATIF","params":"ITEM_ID unique ; dé de mana de la fiche","note":"Commande COFantasy native ; la limite et la récupération sont dans le même événement Undo.","uiFamily":"pouvoir","compatProfile":"ANNEAU","catalogVisible":true,"displayName":"Réserve de mana","uiGroup":"anneau_reserve_mana","uiTierLabel":"3 charges/jour"},{"id":"A550","category":"Armes","subcategory":"Armes de mêlée","name":"Fiable","power":2,"effect":"Relance les résultats de 1 sur les dés de DM de base de l’arme.","rp":"L’arme est équilibrée, régulière et conçue pour délivrer des coups constants.","example":"fiable","support":"Arme | Fiabilité | Dégâts","rarity":"Très rare","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--reroll1","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"COFantasy gère nativement --reroll1 sur les dés de DM de base.","uiFamily":"combat","compatProfile":"CAC","catalogVisible":true,"displayName":"Fiable","uiTierLabel":"","requiredTagsAny":["axe","hammer","mace","staff"],"crossWeaponMode":false},{"id":"A551","category":"Armes","subcategory":"Armes à distance","name":"Fiable","power":2,"effect":"Relance les résultats de 1 sur les dés de DM de base de l’arme.","rp":"L’arme est équilibrée, régulière et conçue pour délivrer des coups constants.","example":"fiable","support":"Arme | Fiabilité | Dégâts","rarity":"Très rare","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--reroll1","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"COFantasy gère nativement --reroll1 sur les dés de DM de base.","uiFamily":"tir","compatProfile":"DISTANCE","catalogVisible":true,"displayName":"Fiable","uiTierLabel":"","requiredTagsAny":["crossbow","firearm"],"crossWeaponMode":false},{"id":"A552","category":"Armes","subcategory":"Armes de mêlée","name":"Perce-cœur","displayName":"Perce-cœur","power":1,"effect":"+1 à la plage de critique.","rp":"La pointe guide naturellement le coup vers les jointures, interstices et organes vitaux.","example":"perce-cœur","support":"Arme perçante | Critique","rarity":"Peu commun","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--bonusCritique 1","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Équivalent tactique d’Affûté pour les armes perçantes.","uiFamily":"critique","compatProfile":"CAC","catalogVisible":true,"requiredTagsAny":["dagger","rapier","spear"],"uiGroup":"critique_percant_1","uiTierLabel":"+1 plage de critique","crossWeaponMode":true},{"id":"A553","category":"Armes","subcategory":"Armes de mêlée","name":"Fracassant","displayName":"Fracassant","power":1,"effect":"+1 à la plage de critique.","rp":"La masse de l’arme est répartie pour concentrer tout l’impact sur un point de rupture.","example":"du fracas","support":"Arme contondante | Critique","rarity":"Peu commun","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--bonusCritique 1","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Équivalent tactique d’Affûté pour les armes contondantes.","uiFamily":"critique","compatProfile":"CAC","catalogVisible":true,"requiredTagsAny":["hammer","mace","staff"],"uiGroup":"critique_contondant_1","uiTierLabel":"+1 plage de critique","crossWeaponMode":true},{"id":"A554","category":"Armes","subcategory":"Armes de mêlée","name":"Empaleur","displayName":"Empaleur","power":1,"effect":"+1d6 DM supplémentaires sur un coup critique.","rp":"La pointe s’enfonce profondément lorsque l’attaque trouve une faille.","example":"empaleuse","support":"Arme perçante | Critique","rarity":"Peu commun","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plusCrit 1d6","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Équivalent de Mordant pour les armes perçantes.","uiFamily":"critique","compatProfile":"CAC","catalogVisible":true,"requiredTagsAny":["rapier","spear"],"uiGroup":"critique_percant_2","uiTierLabel":"+1d6 sur critique","crossWeaponMode":true},{"id":"A555","category":"Armes","subcategory":"Armes de mêlée","name":"Écrasant","displayName":"Écrasant","power":1,"effect":"+1d6 DM supplémentaires sur un coup critique.","rp":"Un coup parfaitement placé transmet une onde de choc brutale à travers la cible.","example":"de l’impact écrasant","support":"Arme contondante | Critique","rarity":"Peu commun","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--plusCrit 1d6","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Équivalent de Mordant pour les armes contondantes.","uiFamily":"critique","compatProfile":"CAC","catalogVisible":true,"requiredTagsAny":["hammer","mace"],"uiGroup":"critique_contondant_2","uiTierLabel":"+1d6 sur critique","crossWeaponMode":true},{"id":"A556","category":"Armes","subcategory":"Armes de mêlée","name":"Brise-armure","displayName":"Brise-armure","power":2,"effect":"Ignore 2 points de RD.","rp":"La géométrie de l’arme est pensée pour fissurer, perforer ou déformer les protections.","example":"brise-armure","support":"Arme perçante ou contondante | Anti-RD","rarity":"Rare","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--ignoreRD 2","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Utilise l’option COFantasy native --ignoreRD 2.","uiFamily":"penetration","compatProfile":"CAC","catalogVisible":true,"requiredTagsAny":["hammer","mace"],"uiGroup":"brise_armure","uiTierLabel":"Ignore 2 RD","crossWeaponMode":true},{"id":"A557","category":"Armes","subcategory":"Armes à distance","name":"Perce-armure","displayName":"Perce-armure","power":2,"effect":"Ignore 2 points de RD.","rp":"Le projectile ou le mécanisme est optimisé pour conserver son énergie au travers des protections.","example":"perce-armure","support":"Arme à projectile | Anti-RD","rarity":"Rare","status":"Option d'arme","mechanism":"armeoptions","predicates":"","weaponOptions":"--ignoreRD 2","fieldPatch":"","auto":true,"mode":"PASSIF","audit":"COF_EXISTANT","actionObjects":"NON","undo":"AUCUN","params":"","note":"Utilise l’option COFantasy native --ignoreRD 2.","uiFamily":"penetration","compatProfile":"DISTANCE","catalogVisible":true,"requiredTagsAny":["crossbow","firearm"],"uiGroup":"perce_armure_distance","uiTierLabel":"Ignore 2 RD","crossWeaponMode":false},{"id":"A558","category":"Armes","subcategory":"Armes de mêlée","name":"en ferrite noire","displayName":"Ferrite noire","power":1,"effect":"+1 attaque, +1d6 DM contre les monstres.","rp":"Ferrite sombre obtenue par cuisson lente et trempe minérale, utilisée sur les armes de chasse aux monstres.","example":"en ferrite noire","support":"Arme | Anti-monstres","rarity":"","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible monstre --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","compatProfile":"CAC","mode":"PASSIF","auto":true,"catalogVisible":true,"audit":"COF_EXISTANT_PARAMETRE","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","uiGroup":"anti_monstre","uiTierLabel":"Anti-monstres","status":"Option d'arme","actionObjects":"NON","undo":"AUCUN","params":"","crossWeaponMode":false},{"id":"A559","category":"Armes","subcategory":"Armes à distance","name":"en ferrite noire","displayName":"Ferrite noire","power":1,"effect":"+1 attaque, +1d6 DM contre les monstres.","rp":"Ferrite sombre obtenue par cuisson lente et trempe minérale, utilisée sur les armes de chasse aux monstres.","example":"en ferrite noire","support":"Munition/arme à distance | Anti-monstres","rarity":"","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible monstre --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","compatProfile":"DISTANCE","mode":"PASSIF","auto":true,"catalogVisible":true,"audit":"COF_EXISTANT_PARAMETRE","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","uiGroup":"anti_monstre","uiTierLabel":"Anti-monstres","status":"Option d'arme","actionObjects":"NON","undo":"AUCUN","params":"","crossWeaponMode":false},{"id":"A560","category":"Armes","subcategory":"Armes de mêlée","name":"traitée au sel vitrifié","displayName":"Sel vitrifié","power":1,"effect":"+1 attaque, +1d6 DM contre les vases.","rp":"Sel alchimique fondu puis vitrifié en couche mince sur les surfaces de frappe.","example":"traitée au sel vitrifié","support":"Arme | Anti-vases","rarity":"","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible vase --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","compatProfile":"CAC","mode":"PASSIF","auto":true,"catalogVisible":true,"audit":"COF_EXISTANT_PARAMETRE","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","uiGroup":"anti_vase","uiTierLabel":"Anti-vases","status":"Option d'arme","actionObjects":"NON","undo":"AUCUN","params":"","crossWeaponMode":false},{"id":"A561","category":"Armes","subcategory":"Armes à distance","name":"traitée au sel vitrifié","displayName":"Sel vitrifié","power":1,"effect":"+1 attaque, +1d6 DM contre les vases.","rp":"Sel alchimique fondu puis vitrifié en couche mince sur les surfaces de frappe.","example":"traitée au sel vitrifié","support":"Munition/arme à distance | Anti-vases","rarity":"","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible vase --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","compatProfile":"DISTANCE","mode":"PASSIF","auto":true,"catalogVisible":true,"audit":"COF_EXISTANT_PARAMETRE","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","uiGroup":"anti_vase","uiTierLabel":"Anti-vases","status":"Option d'arme","actionObjects":"NON","undo":"AUCUN","params":"","crossWeaponMode":false},{"id":"A562","category":"Armes","subcategory":"Armes de mêlée","name":"en étherium","displayName":"Étherium","power":1,"effect":"+1 attaque, +1d6 DM contre les esprits.","rp":"Matière translucide et froide, déposée en filaments capables d’interagir avec les manifestations immatérielles.","example":"en étherium","support":"Arme | Anti-esprits","rarity":"","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible esprit --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","compatProfile":"CAC","mode":"PASSIF","auto":true,"catalogVisible":true,"audit":"COF_EXISTANT_PARAMETRE","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","uiGroup":"anti_esprit","uiTierLabel":"Anti-esprits","status":"Option d'arme","actionObjects":"NON","undo":"AUCUN","params":"","crossWeaponMode":false},{"id":"A563","category":"Armes","subcategory":"Armes à distance","name":"en étherium","displayName":"Étherium","power":1,"effect":"+1 attaque, +1d6 DM contre les esprits.","rp":"Matière translucide et froide, déposée en filaments capables d’interagir avec les manifestations immatérielles.","example":"en étherium","support":"Munition/arme à distance | Anti-esprits","rarity":"","mechanism":"armeoptions conditionnelles","predicates":"","weaponOptions":"--if typeCible esprit --bonusAttaque 1 --plus 1d6 --endif","fieldPatch":"","compatProfile":"DISTANCE","mode":"PASSIF","auto":true,"catalogVisible":true,"audit":"COF_EXISTANT_PARAMETRE","note":"Anti-famille uniquement. Le nom de matériau/traitement est RP et ne confère aucune propriété supplémentaire.","uiFamily":"anti_creature","uiGroup":"anti_esprit","uiTierLabel":"Anti-esprits","status":"Option d'arme","actionObjects":"NON","undo":"AUCUN","params":"","crossWeaponMode":false}];

(function completeArmorResistanceCatalog(){
  var allArmorTypes=[
    ['feu','Feu'],['air','Air'],['eau','Eau'],['terre','Terre'],
    ['ombre','Ombre'],['lumiere','Lumière'],['force','Force'],
    ['toxique','Toxique'],['psychique','Psychique'],['drain','Drain'],
    ['tranchant','Tranchant'],['percant','Perçant'],['contondant','Contondant']
  ];
  var existingGeneral={};
  AFFIXES.forEach(function(a){
    if(a.category!=='Armure / Bouclier'||a.uiFamily!=='resistance'||!a.damageType)return;

    existingGeneral[a.damageType]=true;
  });

  var missingNonPhysical=['air','eau','terre','ombre','lumiere','force','toxique','psychique','drain'];
  var labels={};
  allArmorTypes.forEach(function(x){labels[x[0]]=x[1];});
  missingNonPhysical.forEach(function(type){
    [
      {tier:1,power:1,rd:2,label:'RD 2'},
      {tier:2,power:3,rd:4,label:'RD 4'}
    ].forEach(function(v){
      AFFIXES.push({
        id:'ARD_'+type.toUpperCase()+'_'+v.rd,
        category:'Armure / Bouclier',
        subcategory:'Armure / Bouclier — Tous',
        name:'RD '+labels[type],
        power:v.power,
        effect:'RD '+v.rd+' contre les DM '+labels[type].toLowerCase(),
        rp:'Des traitements, runes ou matériaux adaptés protègent le porteur contre ce type de dégâts.',
        example:'Protection '+labels[type].toLowerCase(),
        support:'Armure / Bouclier | Tous | Résistance',
        rarity:v.power>=3?'Très rare':'Rare',
        status:'Prédicat direct',
        mechanism:'Prédicat équipé',
        predicates:'bonus_RD::'+type+':'+v.rd,
        weaponOptions:'',
        fieldPatch:'',
        auto:true,
        mode:'PASSIF',
        audit:'COF_EXISTANT',
        actionObjects:'NON',
        undo:'AUCUN',
        params:'',
        note:'Affixe générique v14.2 pour compléter le référentiel de dégâts sur les armures et boucliers.',
        uiFamily:'resistance',
        compatProfile:'TOUTES_ARMURES',
        catalogVisible:true,
        displayName:'RD '+labels[type],
        uiGroup:'rd_armor_'+type,
        uiTierLabel:v.label,
        damageType:type
      });
    });
  });

  ['tranchant','percant','contondant'].forEach(function(type){
    [
      {power:1,rd:1,label:'RD 1'},
      {power:3,rd:2,label:'RD 2'}
    ].forEach(function(v){
      AFFIXES.push({
        id:'ARD_CLOTH_'+type.toUpperCase()+'_'+v.rd,
        category:'Armure / Bouclier',
        subcategory:'Armure — Tissu',
        name:'RD '+labels[type],
        power:v.power,
        effect:'RD '+v.rd+' contre les DM '+labels[type].toLowerCase(),
        rp:'Le tissage renforcé et les couches internes absorbent une partie de ce type d’impact.',
        example:'Tissu renforcé — '+labels[type].toLowerCase(),
        support:'Armure | Tissu | Résistance physique',
        rarity:v.power>=3?'Très rare':'Rare',
        status:'Prédicat direct',
        mechanism:'Prédicat équipé',
        predicates:'bonus_RD::'+type+':'+v.rd,
        weaponOptions:'',
        fieldPatch:'',
        auto:true,
        mode:'PASSIF',
        audit:'COF_EXISTANT',
        actionObjects:'NON',
        undo:'AUCUN',
        params:'',
        note:'Complément v14.2 : permet au tissu d’accéder lui aussi aux trois RD physiques.',
        uiFamily:'resistance',
        compatProfile:'TISSU',
        catalogVisible:true,
        displayName:'RD '+labels[type],
        uiGroup:'rd_cloth_'+type,
        uiTierLabel:v.label,
        damageType:type
      });
    });
  });
})();

(function extendCatalogV15(){
  function addAffix(a){
    if(!a||!a.id)return;
    if(AFFIXES.some(function(x){return x.id===a.id;}))return;
    AFFIXES.push(a);
  }
  function slug(s){
    return normText(s).replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
  }
  var RP_STAT_NAMES={
    FOR:'Force du Titan',
    DEX:'Grâce du Félin',
    CON:'Vigueur de l’Ours',
    INT:'Esprit du Sage',
    SAG:'Clairvoyance de l’Oracle',
    CHA:'Présence du Souverain'
  };
  var RP_SKILL_NAMES={
    'Athlétisme':'Élan de l’Athlète',
    'Puissance':'Poigne du Colosse',
    'Protection':'Garde du Rempart',
    'Acrobaties':'Grâce de l’Acrobate',
    'Discrétion':'Pas de l’Ombre',
    'Adresse':'Main du Virtuose',
    'Endurance':'Souffle du Marathonien',
    'Résistance':'Cœur de Fer',
    'Sang-froid':'Nerfs d’Acier',
    'Récupération':'Second Souffle',
    'Arcanes':'Savoir de l’Arcaniste',
    'Histoire':'Mémoire des Âges',
    'Religion':'Savoir du Théologien',
    'Nature':'Instinct du Naturaliste',
    'Investigation':'Œil de l’Enquêteur',
    'Technique':'Main de l’Artisan',
    'Perception':'Œil du Guetteur',
    'Perspicacité':'Regard du Juge',
    'Survie':'Instinct du Pisteur',
    'Médecine':'Main du Guérisseur',
    'Instinct':'Sixième Sens',
    'Persuasion':'Voix d’Argent',
    'Intimidation':'Aura du Prédateur',
    'Supercherie':'Langue du Renard',
    'Représentation':'Grâce de l’Artiste',
    'Commandement':'Voix du Commandant'
  };
  var RP_STATE_NAMES={
    surpris:'Vigilance éternelle',
    assomme:'Crâne de fer',
    renverse:'Ancrage inébranlable',
    aveugle:'Vision intérieure',
    affaibli:'Vitalité inaltérable',
    etourdi:'Esprit lucide',
    paralyse:'Liberté du corps',
    ralenti:'Pas infatigable',
    immobilise:'Entraves brisées',
    endormi:'Veille éternelle',
    apeure:'Cœur intrépide',
    encombre:'Porteur infatigable'
  };

  function mkSkill(category,subcategory,prefix,skill,tiers,extra){
    tiers.forEach(function(t){
      var id=prefix+'_'+slug(skill).toUpperCase()+'_'+t.bonus;
      var a={
        id:id,category:category,subcategory:subcategory,name:skill,power:t.power,
        effect:'+'+t.bonus+' aux tests de '+skill,
        rp:'L’objet affine les aptitudes du porteur liées à '+skill+'.',
        example:skill, support:subcategory+' | Compétence',rarity:t.power>=3?'Très rare':'Rare',
        status:'Prédicat direct',mechanism:'Prédicat de compétence',
        predicates:'bonusTests_'+slug(skill)+':'+t.bonus,weaponOptions:'',fieldPatch:'',
        auto:true,mode:'PASSIF',audit:'COF_EXISTANT',actionObjects:'NON',undo:'AUCUN',
        params:'',note:'Catalogue V15 : compétence de la fiche, filtrée par matrice de compatibilité.',
        uiFamily:'competence',compatProfile:'MATRICE_V15',catalogVisible:true,
        displayName:(RP_SKILL_NAMES[skill]||skill),uiGroup:prefix.toLowerCase()+'_'+slug(skill),
        uiTierLabel:'+'+t.bonus, matrixSkill:skill
      };
      if(extra)Object.keys(extra).forEach(function(k){a[k]=extra[k];});
      addAffix(a);
    });
  }
  function mkState(category,subcategory,prefix,state,label,power,extra){
    var a={
      id:prefix+'_IMM_'+state.toUpperCase(),category:category,subcategory:subcategory,
      name:(RP_STATE_NAMES[state]||('Immunité '+label)),power:power||3,effect:'Immunité à l’état '+label+'.',
      rp:'La magie de l’objet empêche cet état de prendre prise sur son porteur.',
      example:'Immunité '+label,support:subcategory+' | Immunité d’état',
      rarity:(power||3)>=4?'Très rare':'Rare',status:'Prédicat direct',
      mechanism:'Prédicat immunite_<etat>',predicates:'immunite_'+state+':1',
      weaponOptions:'',fieldPatch:'',auto:true,mode:'PASSIF',audit:'COF_EXISTANT',
      actionObjects:'NON',undo:'AUCUN',params:'',
      note:'Utilise le mécanisme natif COFantasy immunite_<etat>.',
      uiFamily:'etat',compatProfile:'MATRICE_V15',catalogVisible:true,
      displayName:(RP_STATE_NAMES[state]||('Immunité '+label)),uiGroup:prefix.toLowerCase()+'_imm_'+state,
      uiTierLabel:'Immunité',matrixState:state
    };
    if(extra)Object.keys(extra).forEach(function(k){a[k]=extra[k];});
    addAffix(a);
  }
  function mkStat(category,subcategory,prefix,stat,bonus,power,extra){
    var a={
      id:prefix+'_STAT_'+stat+'_'+bonus,category:category,subcategory:subcategory,
      name:(RP_STAT_NAMES[stat]||stat),power:power,effect:'+'+bonus+' '+stat,
      rp:'L’objet renforce la caractéristique '+stat+' de son porteur.',
      example:'Renforcement de '+stat,support:subcategory+' | Caractéristique',
      rarity:power>=3?'Très rare':'Rare',status:'Prédicat direct',
      mechanism:'Prédicat de caractéristique',predicates:'bonus_'+stat+':'+bonus,
      weaponOptions:'',fieldPatch:'',auto:true,mode:'PASSIF',audit:'COF_EXISTANT',
      actionObjects:'NON',undo:'AUCUN',params:'',
      note:'Catalogue V15 : bonus direct, filtré par matrice.',
      uiFamily:'caracteristique',compatProfile:'MATRICE_V15',catalogVisible:true,
      displayName:(RP_STAT_NAMES[stat]||stat),statKey:stat,uiGroup:prefix.toLowerCase()+'_stat_'+stat.toLowerCase(),
      uiTierLabel:'+'+bonus+' '+stat
    };
    if(extra)Object.keys(extra).forEach(function(k){a[k]=extra[k];});
    addAffix(a);
  }

  [
    {legacy:'NECROTIQUE',canonical:'OMBRE'},
    {legacy:'RADIANT',canonical:'LUMIERE'},
    {legacy:'ARCANE',canonical:'FORCE'},
    {legacy:'MALADIE',canonical:'TOXIQUE'},
    {legacy:'MENTAL',canonical:'PSYCHIQUE'}
  ].forEach(function(map){
    [2,4].forEach(function(rd){
      var sourceId='ARD_'+map.canonical+'_'+rd;
      var source=AFFIXES.filter(function(a){return a.id===sourceId;})[0];
      if(!source)return;
      var alias={};
      Object.keys(source).forEach(function(k){alias[k]=source[k];});
      alias.id='ARD_'+map.legacy+'_'+rd;
      alias.note='Alias catalogue Excel de '+sourceId+' ; conserve le prédicat canonique '+source.predicates+'.';
      addAffix(alias);
    });
  });

  AFFIXES.forEach(function(a){
    if(a.category==='Accessoire' && a.uiFamily==='caracteristique' && a.statKey &&
       normText(a.name).indexOf('de base')<0){
      a.displayName=RP_STAT_NAMES[String(a.statKey)]||a.displayName||a.name;
    }
    if(a.uiFamily==='competence'){
      var sk=String(a.name||a.displayName||'');
      Object.keys(RP_SKILL_NAMES).some(function(k){
        if(normText(k)===normText(sk)){
          a.displayName=RP_SKILL_NAMES[k];
          return true;
        }
        return false;
      });
    }
  });

  AFFIXES.forEach(function(a){
    if(a.category==='Accessoire' && a.uiFamily==='capacite' &&
       ['Anneau','Cou','Gants','Pieds'].indexOf(String(a.subcategory||''))>=0){
      a.catalogVisible=true;
    }
  });

  var skills=[
    'Athlétisme','Puissance','Protection','Acrobaties','Discrétion','Adresse',
    'Endurance','Résistance','Sang-froid','Récupération','Arcanes','Histoire',
    'Religion','Nature','Investigation','Technique','Perception','Perspicacité',
    'Survie','Médecine','Instinct','Persuasion','Intimidation','Supercherie',
    'Représentation','Commandement'
  ];
  var tiers=[{bonus:2,power:1},{bonus:4,power:3}];

  skills.forEach(function(skill){
    mkSkill('Accessoire','Accessoires — Matrice V15','AXSK',skill,tiers,{matrixCanonical:true});
  });

  ['FOR','DEX','CON','INT','SAG','CHA'].forEach(function(stat){
    mkStat('Accessoire','Accessoires — Matrice V15','AXST',stat,1,1,{matrixCanonical:true});
    mkStat('Accessoire','Accessoires — Matrice V15','AXST',stat,2,3,{matrixCanonical:true});
  });

  var RP_RD_NAMES={
    feu:'Garde des braises',air:'Garde des vents',eau:'Garde des marées',
    terre:'Garde de pierre',nature:'Garde du vivant',necrotique:'Garde funéraire',
    radiant:'Garde solaire',arcane:'Garde arcanique',froid:'Garde du givre',
    electrique:'Garde de l’orage',sonique:'Garde du silence',acide:'Garde alchimique',
    poison:'Garde du serpent',maladie:'Garde de pureté',drain:'Garde vitale',
    mental:'Garde de l’esprit',tranchant:'Garde des lames',
    percant:'Garde des pointes',contondant:'Garde du roc'
  };
  [
    'feu','air','eau','terre','nature','necrotique','radiant','arcane','froid',
    'electrique','sonique','acide','poison','maladie','drain','mental',
    'tranchant','percant','contondant'
  ].forEach(function(dtype){
    [{rd:2,power:1},{rd:4,power:3}].forEach(function(t){
      addAffix({
        id:'AXRD_'+dtype.toUpperCase()+'_'+t.rd,
        category:'Accessoire',subcategory:'Accessoires — Matrice V15',
        name:RP_RD_NAMES[dtype],displayName:RP_RD_NAMES[dtype],power:t.power,
        effect:'RD '+t.rd+' contre les DM de '+dtype+'.',
        rp:'Les enchantements de l’objet détournent une partie de cette forme de dégâts.',
        example:RP_RD_NAMES[dtype],support:'Accessoires | Résistance partagée',
        rarity:t.power>=3?'Très rare':'Rare',status:'Prédicat direct',
        mechanism:'Prédicat équipé',predicates:'bonus_RD::'+dtype+':'+t.rd,
        weaponOptions:'',fieldPatch:'',auto:true,mode:'PASSIF',audit:'COF_EXISTANT',
        actionObjects:'NON',undo:'AUCUN',params:'',
        note:'Affixe canonique V15.3 utilisé uniquement quand le support n’a pas sa propre résistance historique.',
        uiFamily:'resistance',compatProfile:'MATRICE_V15',catalogVisible:true,
        uiGroup:'axrd_'+dtype,uiTierLabel:'RD '+t.rd,damageType:dtype,
        matrixCanonicalResistance:true
      });
    });
  });

  [{n:1,p:1},{n:2,p:3}].forEach(function(t){
    addAffix({
      id:'AXMOVE_'+t.n,category:'Accessoire',subcategory:'Accessoires — Matrice V15',
      name:'Pas du voyageur',displayName:'Pas du voyageur',power:t.p,
      effect:'+'+t.n+' Initiative, +'+t.n+' m de déplacement',
      rp:'L’objet allège les mouvements et favorise les réactions rapides.',
      example:'Pas du voyageur',support:'Accessoires | Mobilité partagée',
      rarity:t.p>=3?'Très rare':'Rare',status:'Prédicat étendu',
      mechanism:'Prédicats équipés',
      predicates:'bonusInitiative:'+t.n+'\\nbonusMouvement:'+t.n,
      weaponOptions:'',fieldPatch:'',auto:true,mode:'PASSIF',audit:'COF_EXISTANT',
      actionObjects:'NON',undo:'AUCUN',params:'',
      note:'Utilise bonusInitiative et bonusMouvement, déjà exploités par la feuille/script.',
      uiFamily:'mobilite',compatProfile:'MATRICE_V15',catalogVisible:true,
      uiGroup:'ax_mouvement',uiTierLabel:'+'+t.n+' init / +'+t.n+' m',
      matrixCanonicalMovement:true
    });
  });

  [
    ['surpris','Surpris'],['assomme','Assommé'],['renverse','Renversé'],
    ['aveugle','Aveugle'],['affaibli','Affaibli'],['etourdi','Étourdi'],
    ['paralyse','Paralysé'],['endormi','Endormi'],['apeure','Apeuré'],
    ['encombre','Encombré']
  ].forEach(function(x){mkState('Accessoire','Accessoires — Matrice V15','AX',x[0],x[1],3);});

  addAffix({
    id:'AX_PROTECTRICE',category:'Accessoire',subcategory:'Accessoires — Matrice V15',
    name:'Protectrice',displayName:'Protectrice',power:3,
    effect:'Réduit les dégâts supplémentaires d’un critique et d’une attaque sournoise selon la mécanique Anneau de protection.',
    rp:'Un cercle protecteur détourne les coups qui auraient dû atteindre un point vital.',
    example:'Anneau protecteur',support:'Anneau | Protection critique',rarity:'Très rare',
    status:'Prédicat direct',mechanism:'anneauProtection',predicates:'anneauProtection:1',
    weaponOptions:'',fieldPatch:'',auto:true,mode:'PASSIF',audit:'COF_EXISTANT',
    actionObjects:'NON',undo:'AUCUN',params:'',
    note:'Mécanisme natif COFantasy anneauProtection.',
    uiFamily:'protection',compatProfile:'MATRICE_V15',catalogVisible:true,
    uiGroup:'anneau_protectrice',uiTierLabel:'Protection critique',matrixSpecial:'protectrice'
  });
  addAffix({
    id:'AX_ANTICRIT_2',category:'Accessoire',subcategory:'Accessoires — Matrice V15',
    name:'Anti-critique',displayName:'Anti-critique',power:2,
    effect:'RD 2 supplémentaire uniquement contre les coups critiques.',
    rp:'La magie se concentre au moment précis où le coup devrait être dévastateur.',
    example:'Anneau anti-critique',support:'Anneau | Critique',rarity:'Rare',
    status:'Prédicat direct',mechanism:'RD_critique',predicates:'RD_critique:2',
    weaponOptions:'',fieldPatch:'',auto:true,mode:'PASSIF',audit:'COF_EXISTANT',
    actionObjects:'NON',undo:'AUCUN',params:'',note:'Mécanisme natif COFantasy RD_critique.',
    uiFamily:'protection',compatProfile:'MATRICE_V15',catalogVisible:true,
    uiGroup:'anneau_anticritique',uiTierLabel:'RD critique 2',matrixSpecial:'anticritique'
  });
  addAffix({
    id:'AX_ANTICRIT_4',category:'Accessoire',subcategory:'Accessoires — Matrice V15',
    name:'Anti-critique',displayName:'Anti-critique',power:4,
    effect:'RD 4 supplémentaire uniquement contre les coups critiques.',
    rp:'La magie se concentre au moment précis où le coup devrait être dévastateur.',
    example:'Anneau anti-critique supérieur',support:'Anneau | Critique',rarity:'Très rare',
    status:'Prédicat direct',mechanism:'RD_critique',predicates:'RD_critique:4',
    weaponOptions:'',fieldPatch:'',auto:true,mode:'PASSIF',audit:'COF_EXISTANT',
    actionObjects:'NON',undo:'AUCUN',params:'',note:'Mécanisme natif COFantasy RD_critique.',
    uiFamily:'protection',compatProfile:'MATRICE_V15',catalogVisible:true,
    uiGroup:'anneau_anticritique',uiTierLabel:'RD critique 4',matrixSpecial:'anticritique'
  });
  addAffix({
    id:'AX_SECONDE_CHANCE',category:'Accessoire',subcategory:'Accessoires — Matrice V15',
    name:'Seconde chance',displayName:'Seconde chance',power:5,
    effect:'La première fois que le porteur devrait tomber à 0 PV et mourir, il reste à 1 PV. Effet consommé pour ce personnage.',
    rp:'Le bijou se fend lorsque son porteur échappe une fois à la mort.',
    example:'Talisman de seconde chance',support:'Anneau / Cou | Effet rare',rarity:'Légendaire',
    status:'Prédicat direct + patch COFantasy',mechanism:'secondeChanceObjet',
    predicates:'secondeChanceObjet:1',weaponOptions:'',fieldPatch:'',auto:true,mode:'PASSIF',
    audit:'PATCH_COF_V15',actionObjects:'NON',undo:'AUCUN',params:'',
    note:'Nécessite COFantasy V4.1.5 fourni avec le pack. Consommation mémorisée par secondeChanceObjetUtilisee.',
    uiFamily:'protection',compatProfile:'MATRICE_V15',catalogVisible:true,
    uiGroup:'seconde_chance',uiTierLabel:'1 utilisation',matrixSpecial:'seconde_chance'
  });

  ['INT','SAG','CHA','DEX','FOR','CON'].forEach(function(stat){
    mkStat('Armure / Bouclier','Armure — Matrice V15','AR',stat,1,2,{matrixArmor:true});
    mkStat('Armure / Bouclier','Armure — Matrice V15','AR',stat,2,4,{matrixArmor:true});
  });

  [
    'Arcanes','Religion','Histoire','Nature','Sang-froid','Résistance',
    'Acrobaties','Discrétion','Adresse','Athlétisme','Survie','Perception',
    'Puissance','Endurance','Intimidation','Protection'
  ].forEach(function(skill){
    mkSkill('Armure / Bouclier','Armure — Matrice V15','ARSK',skill,tiers,{matrixArmor:true});
  });

  [
    ['apeure','Apeuré'],['endormi','Endormi'],['etourdi','Étourdi'],
    ['ralenti','Ralenti'],['immobilise','Immobilisé'],['assomme','Assommé'],
    ['renverse','Renversé'],['affaibli','Affaibli']
  ].forEach(function(x){mkState('Armure / Bouclier','Armure — Matrice V15','AR',x[0],x[1],3,{matrixArmor:true});});

  addAffix({
    id:'AR_PROTECTRICE',category:'Armure / Bouclier',subcategory:'Armure — Matrice V15',
    name:'Protectrice',displayName:'Protectrice',power:3,
    effect:'Réduit les dégâts supplémentaires des critiques et attaques sournoises lorsque l’armure est portée.',
    rp:'Les zones vitales sont doublées de plaques, runes et renforts de protection.',
    example:'Armure protectrice',support:'Maille / Plaque | Protection critique',rarity:'Très rare',
    status:'Prédicat direct',mechanism:'armureProtection',predicates:'armureProtection:1',
    weaponOptions:'',fieldPatch:'',auto:true,mode:'PASSIF',audit:'COF_EXISTANT',
    actionObjects:'NON',undo:'AUCUN',params:'',note:'Mécanisme natif COFantasy armureProtection.',
    uiFamily:'protection',compatProfile:'MATRICE_V15',catalogVisible:true,
    uiGroup:'armure_protectrice',uiTierLabel:'Protection critique',matrixSpecial:'protectrice_armure'
  });
  addAffix({
    id:'AR_BOUCLIER_PROTECTEUR',category:'Armure / Bouclier',subcategory:'Bouclier — Matrice V15',
    name:'Protecteur',displayName:'Protecteur',power:3,
    effect:'Réduit les dégâts supplémentaires des critiques et attaques sournoises lorsque le bouclier est porté.',
    rp:'Le bouclier se place presque de lui-même devant les coups les plus dangereux.',
    example:'Bouclier protecteur',support:'Bouclier | Protection critique',rarity:'Très rare',
    status:'Prédicat direct',mechanism:'bouclierProtection',predicates:'bouclierProtection:1',
    weaponOptions:'',fieldPatch:'',auto:true,mode:'PASSIF',audit:'COF_EXISTANT',
    actionObjects:'NON',undo:'AUCUN',params:'',note:'Mécanisme natif COFantasy bouclierProtection.',
    uiFamily:'protection',compatProfile:'MATRICE_V15',catalogVisible:true,
    uiGroup:'bouclier_protecteur',uiTierLabel:'Protection critique',matrixSpecial:'protectrice_bouclier'
  });
  [2,4].forEach(function(rd){
    addAffix({
      id:'AR_ANTICRIT_'+rd,category:'Armure / Bouclier',subcategory:'Armure / Bouclier — Matrice V15',
      name:'Anti-critique',displayName:'Anti-critique',power:rd,
      effect:'RD '+rd+' supplémentaire uniquement contre les coups critiques.',
      rp:'La construction dissipe les impacts les plus dévastateurs.',
      example:'Protection anti-critique',support:'Maille / Plaque / Bouclier | Critique',
      rarity:rd>=4?'Très rare':'Rare',status:'Prédicat direct',mechanism:'RD_critique',
      predicates:'RD_critique:'+rd,weaponOptions:'',fieldPatch:'',auto:true,mode:'PASSIF',
      audit:'COF_EXISTANT',actionObjects:'NON',undo:'AUCUN',params:'',
      note:'Mécanisme natif COFantasy RD_critique.',uiFamily:'protection',
      compatProfile:'MATRICE_V15',catalogVisible:true,uiGroup:'armure_anticritique',
      uiTierLabel:'RD critique '+rd,matrixSpecial:'anticritique_armure'
    });
  });

  addAffix({
    id:'AR_TISSU_BOUCLIER_PSI',category:'Armure / Bouclier',subcategory:'Armure — Matrice V15',
    name:'Voile psychique',displayName:'Voile psychique',power:3,
    effect:'+5 DEF contre les attaques mentales.',
    rp:'Des fils runiques brouillent les intrusions et attaques dirigées contre l’esprit.',
    example:'Robe au voile psychique',support:'Tissu / Fourrures | Défense mentale',
    rarity:'Très rare',status:'Prédicat direct',mechanism:'bouclierPsi',
    predicates:'bouclierPsi:1',weaponOptions:'',fieldPatch:'',auto:true,mode:'PASSIF',
    audit:'COF_EXISTANT',actionObjects:'NON',undo:'AUCUN',params:'',
    note:'COFantasy ajoute +5 DEF si options.attaqueMentale et bouclierPsi.',
    uiFamily:'protection',compatProfile:'MATRICE_V15',catalogVisible:true,
    uiGroup:'tissu_bouclier_psi',uiTierLabel:'+5 DEF mentale',
    matrixSpecial:'bouclier_psi_tissu'
  });

  [{b:1,p:2},{b:2,p:4}].forEach(function(t){
    addAffix({
      id:'AR_BOUCLIER_PERCUTEUR_'+t.b,
      category:'Armure / Bouclier',subcategory:'Bouclier — Matrice V15',
      name:'Percuteur',displayName:'Percuteur',power:t.p,
      effect:'+'+t.b+' aux attaques réalisées avec le bouclier.',
      rp:'La masse et l’équilibrage du bouclier transforment chaque percussion en véritable attaque.',
      example:'Bouclier percuteur',support:'Bouclier | Offensive',
      rarity:t.p>=4?'Très rare':'Rare',status:'Prédicat direct',
      mechanism:'bonusAttaqueBouclier',predicates:'bonusAttaqueBouclier:'+t.b,
      weaponOptions:'',fieldPatch:'',auto:true,mode:'PASSIF',audit:'COF_EXISTANT',
      actionObjects:'NON',undo:'AUCUN',params:'',
      note:'COFantasy ajoute bonusAttaqueBouclier aux tests effectués avec opt.bouclier.',
      uiFamily:'combat',compatProfile:'MATRICE_V15',catalogVisible:true,
      uiGroup:'bouclier_percuteur',uiTierLabel:'+'+t.b+' attaque bouclier',
      matrixSpecial:'percuteur_bouclier'
    });
  });

  ['Athlétisme','Puissance','Adresse','Acrobaties'].forEach(function(skill){
    mkSkill('Armes','Armes de mêlée','WSKM',skill,tiers,{matrixWeaponSkill:true});
  });
  ['Adresse','Acrobaties','Perception','Survie','Technique','Nature'].forEach(function(skill){
    mkSkill('Armes','Armes à distance','WSKD',skill,tiers,{matrixWeaponSkill:true});
  });
  ['Perception','Technique','Arcanes','Religion','Nature','Investigation'].forEach(function(skill){
    mkSkill('Armes','Armes magiques','WSKF',skill,tiers,{matrixWeaponSkill:true});
  });
})();

(function syncCatalogueExcel(){
  var basePatch={"B001":{"price":"40 PC"},"B002":{"price":"1 PA"},"B003":{"price":"1 PA 50 PC"},"B004":{"price":"2 PA 50 PC"},"B005":{"price":"8 PA"},"B006":{"price":"1 PA 50 PC"},"B007":{"price":"1 PA 20 PC"},"B008":{"price":"2 PA"},"B009":{"price":"5 PA"},"B010":{"price":"8 PA"},"B011":{"price":"3 PA"},"B012":{"price":"5 PA"},"B013":{"price":"10 PA"},"B014":{"price":"6 PA"},"B015":{"price":"15 PA"},"B016":{"price":"10 PA"},"B017":{"price":"4 PA"},"B018":{"price":"6 PA"},"B019":{"price":"3 PA"},"B020":{"price":"1 PA 50 PC"},"B021":{"price":"1 PO"},"B022":{"price":"50 PA"},"B023":{"price":"60 PA"},"B024":{"price":"15 PA"},"B025":{"price":"25 PA"},"B026":{"price":"8 PA"},"B027":{"price":"4 PA"},"B028":{"price":"4 PA"},"B029":{"price":"2 PA"},"B030":{"price":"2 PO"},"B031":{"price":"2 PA"},"B032":{"price":"5 PA"},"B033":{"price":"20 PC"},"B034":{"price":"8 PA"},"B035":{"price":"30 PC"},"B036":{"price":"20 PC"},"B037":{"price":"40 PC"},"B038":{"price":"2 PA"},"B039":{"price":"Voir Consommables","description":"Inflige 1d4 DM variables. Test de CON : mineur 15, virulent 10, mortel 5. toxique de contact ou appliqué sur une arme."},"B040":{"price":"Voir Consommables"},"B041":{"price":"Voir Consommables"},"B042":{"price":"Voir Consommables"},"B043":{"price":"Voir Consommables"},"B044":{"price":"Voir Consommables"},"B045":{"price":"Voir Consommables"},"B046":{"price":"Voir Consommables"},"B047":{"price":"Voir Consommables"},"B048":{"price":"5 PC"},"B049":{"price":"20 PC"},"B050":{"price":"10 PC"},"B051":{"price":"8 PC"},"B052":{"price":"15 PC"},"B053":{"price":"2 PC"},"B054":{"price":"15 PC"},"B055":{"price":"15 PC"},"B056":{"price":"50 PC"},"B057":{"price":"4 PC"},"B058":{"price":"10 PC"},"B059":{"price":"2 PC"},"B060":{"price":"1 PA"},"B061":{"price":"50 PC"}};
  var affixPatch={"AX_IMM_SURPRIS":{"name":"Immunité surpris","effect":"Immunité à l’état surpris."},"AX_IMM_ASSOMME":{"name":"Immunité étourdi","power":5,"effect":"Immunité à l’état étourdi."},"AX_IMM_RENVERSE":{"name":"Immunité renversé","power":2,"effect":"Immunité à l’état renversé."},"AX_IMM_AVEUGLE":{"name":"Immunité aveuglé","effect":"Immunité à l’état aveuglé."},"AX_IMM_AFFAIBLI":{"name":"Immunité affaibli","effect":"Immunité à l’état affaibli."},"AX_IMM_PARALYSE":{"name":"Immunité paralysé","power":4,"effect":"Immunité à l’état paralysé."},"AX_IMM_ENDORMI":{"name":"Immunité sommeil","power":4,"effect":"Immunité à l’état sommeil."},"AX_IMM_APEURE":{"name":"Immunité effrayé","power":2,"effect":"Immunité à l’état effrayé."},"AR_IMM_APEURE":{"name":"Immunité effrayé","power":2,"effect":"Immunité à l’état effrayé."},"AR_IMM_ENDORMI":{"name":"Immunité sommeil","power":4,"effect":"Immunité à l’état sommeil."},"AR_IMM_ETOURDI":{"name":"Immunité étourdi","power":5,"effect":"Immunité à l’état étourdi."},"AR_IMM_RALENTI":{"name":"Immunité entravé","power":2,"effect":"Immunité à l’état entravé."},"AR_IMM_RENVERSE":{"name":"Immunité renversé","power":2,"effect":"Immunité à l’état renversé."},"AR_IMM_AFFAIBLI":{"name":"Immunité affaibli","effect":"Immunité à l’état affaibli."},"AR_TISSU_BOUCLIER_PSI":{"effect":"+5 DEF contre les attaques psychiquees.","support":"Tissu / Fourrures | Défense psychiquee"},"A001":{"power":2},"AXST_STAT_FOR_1":{"power":2},"AXST_STAT_DEX_1":{"power":2},"AXST_STAT_CON_1":{"power":2},"AXST_STAT_INT_1":{"power":2},"AXST_STAT_SAG_1":{"power":2},"AXST_STAT_CHA_1":{"power":2},"ARD_RADIANT_2":{"uiGroup":"rd_armor_lumière"},"AXSK_SANG_FROID_2":{"name":"Sang-eau","effect":"+2 aux tests de Sang-eau"},"AXST_STAT_FOR_2":{"power":4},"AXST_STAT_DEX_2":{"power":4},"AXST_STAT_CON_2":{"power":4},"AXST_STAT_INT_2":{"power":4},"AXST_STAT_SAG_2":{"power":4},"AXST_STAT_CHA_2":{"power":4},"AXRD_NECROTIQUE_2":{"effect":"RD 2 contre les DM de ombre.","uiGroup":"axrd_ombre"},"AXRD_RADIANT_2":{"effect":"RD 2 contre les DM de lumière.","uiGroup":"axrd_lumière"},"AXRD_ARCANE_2":{"effect":"RD 2 contre les DM de force.","uiGroup":"axrd_force"},"AXRD_POISON_2":{"effect":"RD 2 contre les DM de toxique.","uiGroup":"axrd_toxique"},"AXRD_MENTAL_2":{"effect":"RD 2 contre les DM de psychique.","uiGroup":"axrd_psychique"},"ARSK_SANG_FROID_2":{"name":"Sang-eau","effect":"+2 aux tests de Sang-eau"},"ARD_RADIANT_4":{"uiGroup":"rd_armor_lumière"},"AXSK_ATHLETISME_4":{"power":2},"AXSK_PUISSANCE_4":{"power":2},"AXSK_PROTECTION_4":{"power":2},"AXSK_ACROBATIES_4":{"power":2},"AXSK_DISCRETION_4":{"power":2},"AXSK_ADRESSE_4":{"power":2},"AXSK_ENDURANCE_4":{"power":2},"AXSK_RESISTANCE_4":{"power":2},"AXSK_SANG_FROID_4":{"name":"Sang-eau","power":2,"effect":"+4 aux tests de Sang-eau"},"AXSK_RECUPERATION_4":{"power":2},"AXSK_ARCANES_4":{"power":2},"AXSK_HISTOIRE_4":{"power":2},"AXSK_RELIGION_4":{"power":2},"AXSK_NATURE_4":{"power":2},"AXSK_INVESTIGATION_4":{"power":2},"AXSK_TECHNIQUE_4":{"power":2},"AXSK_PERCEPTION_4":{"power":2},"AXSK_PERSPICACITE_4":{"power":2},"AXSK_SURVIE_4":{"power":2},"AXSK_MEDECINE_4":{"power":2},"AXSK_INSTINCT_4":{"power":2},"AXSK_PERSUASION_4":{"power":2},"AXSK_INTIMIDATION_4":{"power":2},"AXSK_SUPERCHERIE_4":{"power":2},"AXSK_REPRESENTATION_4":{"power":2},"AXSK_COMMANDEMENT_4":{"power":2},"AXRD_NECROTIQUE_4":{"effect":"RD 4 contre les DM de ombre.","uiGroup":"axrd_ombre"},"AXRD_RADIANT_4":{"effect":"RD 4 contre les DM de lumière.","uiGroup":"axrd_lumière"},"AXRD_ARCANE_4":{"effect":"RD 4 contre les DM de force.","uiGroup":"axrd_force"},"AXRD_POISON_4":{"effect":"RD 4 contre les DM de toxique.","uiGroup":"axrd_toxique"},"AXRD_MENTAL_4":{"effect":"RD 4 contre les DM de psychique.","uiGroup":"axrd_psychique"},"ARSK_ARCANES_4":{"power":2},"ARSK_RELIGION_4":{"power":2},"ARSK_HISTOIRE_4":{"power":2},"ARSK_NATURE_4":{"power":2},"ARSK_SANG_FROID_4":{"name":"Sang-eau","power":2,"effect":"+4 aux tests de Sang-eau"},"ARSK_RESISTANCE_4":{"power":2},"ARSK_ACROBATIES_4":{"power":2},"ARSK_DISCRETION_4":{"power":2},"ARSK_ADRESSE_4":{"power":2},"ARSK_ATHLETISME_4":{"power":2},"ARSK_SURVIE_4":{"power":2},"ARSK_PERCEPTION_4":{"power":2},"ARSK_PUISSANCE_4":{"power":2},"ARSK_ENDURANCE_4":{"power":2},"ARSK_INTIMIDATION_4":{"power":2},"ARSK_PROTECTION_4":{"power":2},"WSKM_ATHLETISME_4":{"power":2},"WSKM_PUISSANCE_4":{"power":2},"WSKM_ADRESSE_4":{"power":2},"WSKM_ACROBATIES_4":{"power":2},"WSKD_ADRESSE_4":{"power":2},"WSKD_ACROBATIES_4":{"power":2},"WSKD_PERCEPTION_4":{"power":2},"WSKD_SURVIE_4":{"power":2},"WSKD_TECHNIQUE_4":{"power":2},"WSKD_NATURE_4":{"power":2},"WSKF_PERCEPTION_4":{"power":2},"WSKF_TECHNIQUE_4":{"power":2},"WSKF_ARCANES_4":{"power":2},"WSKF_RELIGION_4":{"power":2},"WSKF_NATURE_4":{"power":2},"WSKF_INVESTIGATION_4":{"power":2},"A011":{"name":"en fer eau"},"A014":{"name":"traitée à la poussière d’argent eau"},"A020":{"power":3},"A055":{"name":"canalisation de toxique"},"A062":{"effect":"Categorie de dés des sort +1 1d4 => 1d6"},"A068":{"name":"canalisation de toxique supérieure"},"A074":{"effect":"Categorie de dés des sort +2 1d4 => 1d8"},"A090":{"name":"en fer eau"},"A092":{"name":"traitée à la poussière d’argent eau"},"A137":{"name":"RD terre"},"A140":{"name":"RD air"},"A141":{"name":"RD eau"},"A143":{"name":"RD toxique"},"A149":{"name":"RD terre"},"A152":{"name":"RD air"},"A153":{"name":"RD eau"},"A155":{"name":"RD toxique"},"A162":{"name":"RD terre"},"A165":{"name":"RD air"},"A166":{"name":"RD eau"},"A168":{"name":"RD toxique"},"A175":{"name":"RD terre"},"A178":{"name":"RD air"},"A179":{"name":"RD eau"},"A181":{"name":"RD toxique"},"A190":{"name":"RD terre"},"A193":{"name":"RD air"},"A194":{"name":"RD eau"},"A196":{"name":"RD toxique"},"A203":{"name":"RD terre"},"A206":{"name":"RD air"},"A207":{"name":"RD eau"},"A209":{"name":"RD toxique"},"A216":{"power":2},"A218":{"power":2},"A222":{"power":2},"A226":{"power":2},"A228":{"power":2},"A231":{"name":"RD terre"},"A234":{"name":"RD air"},"A235":{"name":"RD eau"},"A237":{"name":"RD toxique"},"A242":{"power":2},"A248":{"power":4},"A250":{"power":4},"A254":{"power":4},"A258":{"power":4},"A259":{"power":2,"effect":"Immunité à l’état immobilisé."},"A260":{"name":"Immunité entravé","power":2,"effect":"Immunité à l’état entravé."},"A262":{"power":4},"A265":{"name":"RD terre"},"A268":{"name":"RD air"},"A269":{"name":"RD eau"},"A271":{"name":"RD toxique"},"A276":{"power":4},"A289":{"displayName":"CON en plus","power":2},"A292":{"displayName":"DEX en plus","power":2},"A294":{"displayName":"FOR en plus","power":2},"A296":{"displayName":"CON en plus","power":4},"A299":{"displayName":"DEX en plus","power":4},"A301":{"displayName":"FOR en plus","power":4},"A311":{"displayName":"Discrétion"},"A312":{"name":"RD terre"},"A314":{"name":"RD air"},"A315":{"name":"RD eau"},"A316":{"name":"RD toxique"},"A317":{"displayName":"Représentation"},"A318":{"displayName":"Résistance"},"A319":{"displayName":"Survie"},"A320":{"displayName":"Discrétion","power":2},"A321":{"name":"RD terre"},"A323":{"name":"RD air"},"A324":{"name":"RD eau"},"A325":{"name":"RD toxique"},"A326":{"displayName":"Représentation","power":2},"A327":{"displayName":"Résistance","power":2},"A328":{"displayName":"Survie","power":2},"A329":{"displayName":"Adresse"},"A330":{"displayName":"Athlétisme"},"A334":{"displayName":"Puissance"},"A336":{"displayName":"Adresse","power":2},"A337":{"displayName":"Athlétisme","power":2},"A340":{"displayName":"Puissance","power":2},"A346":{"name":"RD terre"},"A349":{"name":"RD air"},"A350":{"name":"RD eau"},"A352":{"name":"RD toxique"},"A356":{"power":2,"effect":"Immunité à l’état immobilisé."},"A357":{"name":"Immunité entravé","power":2,"effect":"Immunité à l’état entravé."},"A359":{"name":"RD terre"},"A362":{"name":"RD air"},"A363":{"name":"RD eau"},"A365":{"name":"RD toxique"},"A370":{"displayName":"CHA en plus","power":2},"A372":{"displayName":"INT en plus","power":2},"A377":{"displayName":"SAG en plus","power":2},"A379":{"displayName":"CHA en plus","power":4},"A381":{"displayName":"INT en plus","power":4},"A386":{"displayName":"SAG en plus","power":4},"A507":{"name":"canalisation ombre","effect":"+1d4 DM ombre aux sorts offensifs canalisés via l’arme."},"A508":{"name":"canalisation lumière","effect":"+1d4 DM lumière aux sorts offensifs canalisés via l’arme."},"A510":{"name":"canalisation psychique","effect":"+1d4 DM psychique aux sorts offensifs canalisés via l’arme."},"A518":{"name":"canalisation ombre supérieure","effect":"+2d4 DM ombre aux sorts offensifs canalisés via l’arme."},"A519":{"name":"canalisation lumière supérieure","effect":"+2d4 DM lumière aux sorts offensifs canalisés via l’arme."},"A521":{"name":"canalisation psychique supérieure","effect":"+2d4 DM psychique aux sorts offensifs canalisés via l’arme."},"A533":{"name":"RD ombre","effect":"RD 2 contre les DM ombre"},"A534":{"name":"RD ombre","effect":"RD 4 contre les DM ombre"},"A535":{"name":"RD lumière","effect":"RD 2 contre les DM lumière"},"A536":{"name":"RD lumière","effect":"RD 4 contre les DM lumière"},"A537":{"name":"RD force"},"A538":{"name":"RD force"},"A539":{"name":"RD air","effect":"RD 2 contre les DM air"},"A540":{"name":"RD air","effect":"RD 4 contre les DM air"},"A545":{"name":"RD psychique","effect":"RD 2 contre les DM psychique"},"A546":{"name":"RD psychique","effect":"RD 4 contre les DM psychique"},"A552":{"power":2},"A553":{"power":2}};
  BASES.forEach(function(b){
    var p=basePatch[b.id];
    if(!p)return;
    Object.keys(p).forEach(function(k){b[k]=p[k];});
    b.source='Catalogue_objet_Magique.xlsx';
  });
  AFFIXES.forEach(function(a){
    var p=affixPatch[a.id];
    if(!p)return;
    Object.keys(p).forEach(function(k){a[k]=p[k];});
  });
})();

(function auditFinalCompatibilityPatch(){
  var byId={}; AFFIXES.forEach(function(a){if(a&&a.id)byId[a.id]=a;});
  function patch(id,values){var a=byId[id];if(!a)return;Object.keys(values).forEach(function(k){a[k]=values[k];});}

  ['A035','A115'].forEach(function(id){patch(id,{auto:true,audit:'COF_EXISTANT_PARAMETRE',
    status:"Option d'arme configurable",catalogVisible:true,
    note:'Automatique après choix des deux familles de créatures dans le menu d’affixe.'});});

  patch('A082',{weaponOptions:'--if distanceCibleSup 15 --bonusAttaque 1 --plus 1 --endif',auto:true,
    audit:'COF_EXISTANT_APRES_PATCH',status:"Option d'arme",catalogVisible:true,
    note:'Automatique : +1 attaque et +1 DM uniquement si la cible est à plus de 15 m.'});
  patch('A099',{weaponOptions:'--if distanceCibleSup 15 --bonusAttaque 2 --plus 2 --endif',auto:true,
    audit:'COF_EXISTANT_APRES_PATCH',status:"Option d'arme",catalogVisible:true,
    note:'Automatique : +2 attaque et +2 DM uniquement si la cible est à plus de 15 m.'});

  ['A146','A157','A171','A183','A199','A211'].forEach(function(id){patch(id,{
    auto:true,audit:'COF_EXISTANT_APRES_PATCH',status:'Commande COFantasy native',catalogVisible:true,
    note:'Automatique : réaction défensive, limite 1/combat et expiration au début du prochain tour du porteur.'
  });});

  [['A219',1],['A251',2],['A282',3],['A290',1],['A297',2],['A303',3]].forEach(function(x){
    patch(x[0],{predicates:'bonusSlotsConsommables:'+x[1],auto:true,audit:'COF_EXISTANT_APRES_PATCH',
      status:'Prédicat direct',catalogVisible:true,
      note:'Automatique : augmente la capacité de consommables équipables via la fiche.'});
  });

  var statMap={
    A400:['charisme',1],A401:['constitution',1],A402:['dexterite',1],A403:['force',1],A404:['intelligence',1],A417:['sagesse',1],
    A421:['charisme',2],A422:['constitution',2],A423:['dexterite',2],A424:['force',2],A425:['intelligence',2],A438:['sagesse',2]
  };
  Object.keys(statMap).forEach(function(id){var v=statMap[id];patch(id,{
    fieldPatch:'!cof-effet-temp '+v[0]+' 999 --valeur '+v[1],auto:true,audit:'COF_EXISTANT_APRES_PATCH',
    status:'Action consommable',catalogVisible:true,undo:'COF_NATIF_DECRATTRIBUTE',
    note:'Automatique : modification temporaire de caractéristique, restaurée à la fin du combat.'
  });});

  var rdMap={
    A406:['terre',5],A407:['contondant',5],A408:['percant',5],A409:['tranchant',5],A410:['feu',5],A411:['air',5],A412:['eau',5],A413:['force',5],A414:['toxique',5],A415:['toxique',5],A416:['air',5],
    A427:['terre',10],A428:['contondant',10],A429:['percant',10],A430:['tranchant',10],A431:['feu',10],A432:['air',10],A433:['eau',10],A434:['force',10],A435:['toxique',10],A436:['toxique',10],A437:['air',10],
    A471:['air',5],A472:['eau',5],A473:['terre',5],A474:['nature',5],A475:['ombre',5],A476:['lumiere',5],A477:['drain',5],A478:['psychique',5],
    A479:['air',10],A480:['eau',10],A481:['terre',10],A482:['nature',10],A483:['ombre',10],A484:['lumiere',10],A485:['drain',10],A486:['psychique',10]
  };
  Object.keys(rdMap).forEach(function(id){var v=rdMap[id];patch(id,{
    fieldPatch:'!cof-effet-temp rdTemp_'+v[0]+' 999 --valeur '+v[1],auto:true,audit:'COF_EXISTANT_APRES_PATCH',
    status:'Action consommable',catalogVisible:true,undo:'COF_NATIF_DECRATTRIBUTE',
    note:'Automatique : RD '+v[1]+' '+v[0]+' pendant le combat, restaurée automatiquement en fin de combat.'
  });});
})();

var COI_CANONICAL_CONSUMABLE_BASE_5056 = {"A400":"B040","A401":"B040","A402":"B040","A403":"B040","A404":"B040","A417":"B040","A421":"B040","A422":"B040","A423":"B040","A424":"B040","A425":"B040","A438":"B040","A487":"B046","A444":"B046","A493":"B046","A488":"B046","A445":"B046","A448":"B046","A492":"B046","A491":"B046","A450":"B046","A494":"B046","A489":"B046","A449":"B046","A453":"B046","A495":"B046","A455":"B046","A501":"B046","A496":"B046","A456":"B046","A459":"B046","A500":"B046","A499":"B046","A461":"B046","A502":"B046","A497":"B046","A460":"B046","A464":"B046","A396":"B042","A398":"B042","A405":"B042","A419":"B042","A426":"B042","A441":"B042","A465":"B047","A466":"B047","A467":"B047","A468":"B047","A469":"B047","A390":"B039","A391":"B039","A392":"B039","A393":"B039","A394":"B039","A395":"B039","A440":"B041","A471":"B043","A407":"B044","A477":"B043","A472":"B043","A410":"B043","A413":"B043","A476":"B043","A475":"B043","A408":"B044","A478":"B043","A473":"B043","A414":"B043","A409":"B044","A479":"B043","A428":"B044","A485":"B043","A480":"B043","A431":"B043","A434":"B043","A484":"B043","A483":"B043","A429":"B044","A486":"B043","A481":"B043","A435":"B043","A430":"B044","A397":"B045","A399":"B045","A418":"B045","A420":"B045","A439":"B045","A442":"B045"};
(function cleanCatalogue5056(){
  var patch={"AX_IMM_ASSOMME":{"name":"Immunité assommé","effect":"Immunité à l’état assommé.","displayName":"Crâne de fer"},"AR_TISSU_BOUCLIER_PSI":{"effect":"+5 DEF contre les attaques psychiques.","support":"Tissu / Fourrures | Défense psychique"},"A011":{"name":"en fer froid","example":"en fer froid"},"A014":{"name":"traitée à la poussière d’argent froid","example":"traitée à la poussière d’argent froid"},"A090":{"name":"en fer froid","example":"en fer froid"},"A092":{"name":"traitée à la poussière d’argent froid","example":"traitée à la poussière d’argent froid"},"AXSK_SANG_FROID_2":{"name":"Sang-froid","effect":"+2 aux tests de Sang-froid"},"AXSK_SANG_FROID_4":{"name":"Sang-froid","effect":"+4 aux tests de Sang-froid"},"ARSK_SANG_FROID_2":{"name":"Sang-froid","effect":"+2 aux tests de Sang-froid"},"ARSK_SANG_FROID_4":{"name":"Sang-froid","effect":"+4 aux tests de Sang-froid"},"A062":{"effect":"Catégorie de dés des sorts +1 : 1d4 → 1d6"},"A074":{"effect":"Catégorie de dés des sorts +2 : 1d4 → 1d8"},"A064":{"effect":"Peut être utilisé 1 fois par jour pour récupérer 1 dé de mana."},"A076":{"effect":"Peut être utilisé 2 fois par jour pour récupérer 1 dé de mana."},"A078":{"effect":"Peut être utilisé 3 fois par jour pour récupérer 1 dé de mana."},"A035":{"mechanism":"armeoptions conditionnelles configurables"},"A115":{"mechanism":"armeoptions conditionnelles configurables"},"A290":{"mechanism":"Prédicat équipé"},"A297":{"mechanism":"Prédicat équipé"},"A303":{"mechanism":"Prédicat équipé"},"A001":{"requiredTagsAny":["slashing"]},"A470":{"requiredTagsAny":["slashing"]},"A552":{"requiredTagsAny":["piercing"]},"A554":{"requiredTagsAny":["piercing"]},"A553":{"requiredTagsAny":["blunt"]},"A555":{"requiredTagsAny":["blunt"]},"A556":{"requiredTagsAny":["piercing","blunt"]}};
  var cons={"A400":{"name":"Élixir de charisme","displayName":"Élixir de charisme","example":"Élixir de charisme","power":2,"effect":"+1 CHA jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec miel solaire et pétales de fleur d’orateur, qui renforce temporairement le charisme du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp charisme 999 --valeur 1","uiFamily":"caracteristique","uiTierLabel":"+1 CHA jusqu’à la fin de la scène ou du combat.","catalogVisible":true,"canonicalConsumableBase":"B040","statKey":"CHA"},"A401":{"name":"Élixir de constitution","displayName":"Élixir de constitution","example":"Élixir de constitution","power":2,"effect":"+1 CON jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec sels minéraux et sang de bête robuste, qui renforce temporairement la constitution du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp constitution 999 --valeur 1","uiFamily":"caracteristique","uiTierLabel":"+1 CON jusqu’à la fin de la scène ou du combat.","catalogVisible":true,"canonicalConsumableBase":"B040","statKey":"CON"},"A402":{"name":"Élixir de dextérité","displayName":"Élixir de dextérité","example":"Élixir de dextérité","power":2,"effect":"+1 DEX jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec huile féline et feuilles de saule, qui renforce temporairement la dextérité du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp dexterite 999 --valeur 1","uiFamily":"caracteristique","uiTierLabel":"+1 DEX jusqu’à la fin de la scène ou du combat.","catalogVisible":true,"canonicalConsumableBase":"B040","statKey":"DEX"},"A403":{"name":"Élixir de force","displayName":"Élixir de force","example":"Élixir de force","power":2,"effect":"+1 FOR jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec racines rouges et poudre d’os compact, qui renforce temporairement la force du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp force 999 --valeur 1","uiFamily":"caracteristique","uiTierLabel":"+1 FOR jusqu’à la fin de la scène ou du combat.","catalogVisible":true,"canonicalConsumableBase":"B040","statKey":"FOR"},"A404":{"name":"Élixir d’intelligence","displayName":"Élixir d’intelligence","example":"Élixir d’intelligence","power":2,"effect":"+1 INT jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec encre mentale et cristaux de mémoire pilés, qui renforce temporairement l’intelligence du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp intelligence 999 --valeur 1","uiFamily":"caracteristique","uiTierLabel":"+1 INT jusqu’à la fin de la scène ou du combat.","catalogVisible":true,"canonicalConsumableBase":"B040","statKey":"INT"},"A417":{"name":"Élixir de sagesse","displayName":"Élixir de sagesse","example":"Élixir de sagesse","power":2,"effect":"+1 SAG jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec infusion d’herbes claires et encens de méditation, qui renforce temporairement la sagesse du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp sagesse 999 --valeur 1","uiFamily":"caracteristique","uiTierLabel":"+1 SAG jusqu’à la fin de la scène ou du combat.","catalogVisible":true,"canonicalConsumableBase":"B040","statKey":"SAG"},"A421":{"name":"Élixir de charisme supérieur","displayName":"Élixir de charisme supérieur","example":"Élixir de charisme supérieur","power":4,"effect":"+2 CHA jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec miel solaire et pétales de fleur d’orateur, qui renforce temporairement le charisme du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp charisme 999 --valeur 2","uiFamily":"caracteristique","uiTierLabel":"+2 CHA jusqu’à la fin de la scène ou du combat.","catalogVisible":true,"canonicalConsumableBase":"B040","statKey":"CHA"},"A422":{"name":"Élixir de constitution supérieur","displayName":"Élixir de constitution supérieur","example":"Élixir de constitution supérieur","power":4,"effect":"+2 CON jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec sels minéraux et sang de bête robuste, qui renforce temporairement la constitution du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp constitution 999 --valeur 2","uiFamily":"caracteristique","uiTierLabel":"+2 CON jusqu’à la fin de la scène ou du combat.","catalogVisible":true,"canonicalConsumableBase":"B040","statKey":"CON"},"A423":{"name":"Élixir de dextérité supérieur","displayName":"Élixir de dextérité supérieur","example":"Élixir de dextérité supérieur","power":4,"effect":"+2 DEX jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec huile féline et feuilles de saule, qui renforce temporairement la dextérité du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp dexterite 999 --valeur 2","uiFamily":"caracteristique","uiTierLabel":"+2 DEX jusqu’à la fin de la scène ou du combat.","catalogVisible":true,"canonicalConsumableBase":"B040","statKey":"DEX"},"A424":{"name":"Élixir de force supérieur","displayName":"Élixir de force supérieur","example":"Élixir de force supérieur","power":4,"effect":"+2 FOR jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec racines rouges et poudre d’os compact, qui renforce temporairement la force du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp force 999 --valeur 2","uiFamily":"caracteristique","uiTierLabel":"+2 FOR jusqu’à la fin de la scène ou du combat.","catalogVisible":true,"canonicalConsumableBase":"B040","statKey":"FOR"},"A425":{"name":"Élixir d’intelligence supérieur","displayName":"Élixir d’intelligence supérieur","example":"Élixir d’intelligence supérieur","power":4,"effect":"+2 INT jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec encre mentale et cristaux de mémoire pilés, qui renforce temporairement l’intelligence du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp intelligence 999 --valeur 2","uiFamily":"caracteristique","uiTierLabel":"+2 INT jusqu’à la fin de la scène ou du combat.","catalogVisible":true,"canonicalConsumableBase":"B040","statKey":"INT"},"A438":{"name":"Élixir de sagesse supérieur","displayName":"Élixir de sagesse supérieur","example":"Élixir de sagesse supérieur","power":4,"effect":"+2 SAG jusqu’à la fin de la scène ou du combat.","rp":"Élixir infusé avec infusion d’herbes claires et encens de méditation, qui renforce temporairement la sagesse du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp sagesse 999 --valeur 2","uiFamily":"caracteristique","uiTierLabel":"+2 SAG jusqu’à la fin de la scène ou du combat.","catalogVisible":true,"canonicalConsumableBase":"B040","statKey":"SAG"},"A487":{"name":"Grenade air","displayName":"Grenade air","example":"Grenade air","power":2,"effect":"Inflige 2d4 DM d’air dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de poussière de zéphyr et sels conducteurs, conçue pour libérer brutalement cette énergie à l’impact.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade d’air --auto --dm 2d4 --air --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 2d4 DM d’air dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"air"},"A444":{"name":"Grenade contondant","displayName":"Grenade contondant","example":"Grenade contondant","power":2,"effect":"Inflige 2d4 DM contondants dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie d’onde de choc comprimée, pensée pour éclater à l’impact ou après amorçage.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade contondant --auto --dm 2d4 --contondant --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 2d4 DM contondants dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"contondant"},"A493":{"name":"Grenade drain","displayName":"Grenade drain","example":"Grenade drain","power":2,"effect":"Inflige 2d4 DM de drain dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée d’essence d’ombre et réactifs vampiriques stabilisés, conçue pour libérer brutalement cette énergie à l’impact.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade de drain --auto --dm 2d4 --drain --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 2d4 DM de drain dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"drain"},"A488":{"name":"Grenad’eau","displayName":"Grenad’eau","example":"Grenad’eau","power":2,"effect":"Inflige 2d4 DM d’eau dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée d’eau élémentaire condensée et cristaux de marée, conçue pour libérer brutalement cette énergie à l’impact.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade d’eau --auto --dm 2d4 --eau --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 2d4 DM d’eau dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"eau"},"A445":{"name":"Grenade feu","displayName":"Grenade feu","example":"Grenade feu","power":2,"effect":"Inflige 2d4 DM de feu dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de poudre incendiaire, pensée pour éclater à l’impact ou après amorçage.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade feu --auto --dm 2d4 --feu --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 2d4 DM de feu dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"feu"},"A448":{"name":"Grenade force","displayName":"Grenade force","example":"Grenade force","power":2,"effect":"Inflige 2d4 DM force dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie d’arcanite instable, pensée pour éclater à l’impact ou après amorçage.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade arcane --auto --dm 2d4 --force --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 2d4 DM force dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"force"},"A492":{"name":"Grenade lumière","displayName":"Grenade lumière","example":"Grenade lumière","power":2,"effect":"Inflige 2d4 DM lumière dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de poudre de laënk et sels lumineux, conçue pour libérer brutalement cette énergie à l’impact.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade radiante --auto --dm 2d4 --lumiere --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 2d4 DM lumière dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"lumière"},"A491":{"name":"Grenade ombre","displayName":"Grenade ombre","example":"Grenade ombre","power":2,"effect":"Inflige 2d4 DM ombre dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de cendres funéraires stabilisées et sels noirs, conçue pour libérer brutalement cette énergie à l’impact.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade nécrotique --auto --dm 2d4 --ombre --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 2d4 DM ombre dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"ombre"},"A450":{"name":"Grenade perçant","displayName":"Grenade perçant","example":"Grenade perçant","power":2,"effect":"Inflige 2d4 DM perforants dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de dards métalliques, pensée pour éclater à l’impact ou après amorçage.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade perforant --auto --dm 2d4 --percant --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 2d4 DM perforants dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"perforant"},"A494":{"name":"Grenade psychique","displayName":"Grenade psychique","example":"Grenade psychique","power":2,"effect":"Inflige 2d4 DM psychique dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de cristaux psioniques et encens onirique, conçue pour libérer brutalement cette énergie à l’impact.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade mentale --auto --dm 2d4 --psychique --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 2d4 DM psychique dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"psychique"},"A489":{"name":"Grenade terre","displayName":"Grenade terre","example":"Grenade terre","power":2,"effect":"Inflige 2d4 DM de terre dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de poudre de roche runique et argile minérale, conçue pour libérer brutalement cette énergie à l’impact.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade de terre --auto --dm 2d4 --terre --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 2d4 DM de terre dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"terre"},"A449":{"name":"Grenade toxique","displayName":"Grenade toxique","example":"Grenade toxique","power":2,"effect":"Inflige 2d4 DM de toxique dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de spores maladives enfermées, pensée pour éclater à l’impact ou après amorçage.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade maladie --auto --dm 2d4 --toxique --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 2d4 DM de toxique dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"toxique"},"A453":{"name":"Grenade tranchant","displayName":"Grenade tranchant","example":"Grenade tranchant","power":2,"effect":"Inflige 2d4 DM tranchants dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie d’éclats rasoirs, pensée pour éclater à l’impact ou après amorçage.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade tranchant --auto --dm 2d4 --tranchant --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 2d4 DM tranchants dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"tranchant"},"A495":{"name":"Grenade air supérieure","displayName":"Grenade air supérieure","example":"Grenade air supérieure","power":4,"effect":"Inflige 5d4 DM d’air dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de poussière de zéphyr et sels conducteurs, conçue pour libérer brutalement cette énergie à l’impact.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade d’air --auto --dm 5d4 --air --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 5d4 DM d’air dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"air"},"A455":{"name":"Grenade contondant supérieure","displayName":"Grenade contondant supérieure","example":"Grenade contondant supérieure","power":4,"effect":"Inflige 5d4 DM contondants dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie d’onde de choc comprimée, pensée pour éclater à l’impact ou après amorçage.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade contondant --auto --dm 5d4 --contondant --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 5d4 DM contondants dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"contondant"},"A501":{"name":"Grenade drain supérieure","displayName":"Grenade drain supérieure","example":"Grenade drain supérieure","power":4,"effect":"Inflige 5d4 DM de drain dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée d’essence d’ombre et réactifs vampiriques stabilisés, conçue pour libérer brutalement cette énergie à l’impact.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade de drain --auto --dm 5d4 --drain --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 5d4 DM de drain dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"drain"},"A496":{"name":"Grenad’eau supérieure","displayName":"Grenad’eau supérieure","example":"Grenad’eau supérieure","power":4,"effect":"Inflige 5d4 DM d’eau dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée d’eau élémentaire condensée et cristaux de marée, conçue pour libérer brutalement cette énergie à l’impact.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade d’eau --auto --dm 5d4 --eau --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 5d4 DM d’eau dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"eau"},"A456":{"name":"Grenade feu supérieure","displayName":"Grenade feu supérieure","example":"Grenade feu supérieure","power":4,"effect":"Inflige 5d4 DM de feu dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de poudre incendiaire, pensée pour éclater à l’impact ou après amorçage.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade feu --auto --dm 5d4 --feu --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 5d4 DM de feu dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"feu"},"A459":{"name":"Grenade force supérieure","displayName":"Grenade force supérieure","example":"Grenade force supérieure","power":4,"effect":"Inflige 5d4 DM force dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie d’arcanite instable, pensée pour éclater à l’impact ou après amorçage.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade arcane --auto --dm 5d4 --force --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 5d4 DM force dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"force"},"A500":{"name":"Grenade lumière supérieure","displayName":"Grenade lumière supérieure","example":"Grenade lumière supérieure","power":4,"effect":"Inflige 5d4 DM lumière dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de poudre de laënk et sels lumineux, conçue pour libérer brutalement cette énergie à l’impact.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade radiante --auto --dm 5d4 --lumiere --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 5d4 DM lumière dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"lumière"},"A499":{"name":"Grenade ombre supérieure","displayName":"Grenade ombre supérieure","example":"Grenade ombre supérieure","power":4,"effect":"Inflige 5d4 DM ombre dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de cendres funéraires stabilisées et sels noirs, conçue pour libérer brutalement cette énergie à l’impact.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade nécrotique --auto --dm 5d4 --ombre --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 5d4 DM ombre dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"ombre"},"A461":{"name":"Grenade perçant supérieure","displayName":"Grenade perçant supérieure","example":"Grenade perçant supérieure","power":4,"effect":"Inflige 5d4 DM perforants dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de dards métalliques, pensée pour éclater à l’impact ou après amorçage.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade perforant --auto --dm 5d4 --percant --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 5d4 DM perforants dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"perforant"},"A502":{"name":"Grenade psychique supérieure","displayName":"Grenade psychique supérieure","example":"Grenade psychique supérieure","power":4,"effect":"Inflige 5d4 DM psychique dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de cristaux psioniques et encens onirique, conçue pour libérer brutalement cette énergie à l’impact.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade mentale --auto --dm 5d4 --psychique --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 5d4 DM psychique dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"psychique"},"A497":{"name":"Grenade terre supérieure","displayName":"Grenade terre supérieure","example":"Grenade terre supérieure","power":4,"effect":"Inflige 5d4 DM de terre dans une zone de 4 m de diamètre.","rp":"Sphère fragile chargée de poudre de roche runique et argile minérale, conçue pour libérer brutalement cette énergie à l’impact.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade de terre --auto --dm 5d4 --terre --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 5d4 DM de terre dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"terre"},"A460":{"name":"Grenade toxique supérieure","displayName":"Grenade toxique supérieure","example":"Grenade toxique supérieure","power":4,"effect":"Inflige 5d4 DM de toxique dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie de spores maladives enfermées, pensée pour éclater à l’impact ou après amorçage.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade maladie --auto --dm 5d4 --toxique --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 5d4 DM de toxique dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"toxique"},"A464":{"name":"Grenade tranchant supérieure","displayName":"Grenade tranchant supérieure","example":"Grenade tranchant supérieure","power":4,"effect":"Inflige 5d4 DM tranchants dans une zone de 4 m de diamètre.","rp":"Sphère fragile remplie d’éclats rasoirs, pensée pour éclater à l’impact ou après amorçage.","mechanism":"Commande COFantasy","fieldPatch":"!cof-explosion Grenade tranchant --auto --dm 5d4 --tranchant --portee 10 --disque 2","uiFamily":"grenade","uiTierLabel":"Inflige 5d4 DM tranchants dans une zone de 4 m de diamètre.","catalogVisible":true,"canonicalConsumableBase":"B046","damageType":"tranchant"},"A396":{"name":"Potion de mana mineure","displayName":"Potion de mana mineure","example":"Potion de mana mineure","power":0,"effect":"Rend 1d4 + NivPJ points de mana au personnage qui la boit.","rp":"Fluide bleuté ou violet, stabilisé dans une fiole gravée pour éviter la dispersion du mana.","mechanism":"Commande COFantasy","fieldPatch":"!cof-recupere-mana 1d4+@{selected|niveau}","uiFamily":"mana","uiTierLabel":"Rend 1d4 + NivPJ points de mana au personnage qui la boit.","catalogVisible":true,"canonicalConsumableBase":"B042"},"A398":{"name":"Potion de mana simple","displayName":"Potion de mana simple","example":"Potion de mana simple","power":1,"effect":"Rend 2d4 + NivPJ points de mana au personnage qui la boit.","rp":"Fluide bleuté ou violet, stabilisé dans une fiole gravée pour éviter la dispersion du mana.","mechanism":"Commande COFantasy","fieldPatch":"!cof-recupere-mana 2d4+@{selected|niveau}","uiFamily":"mana","uiTierLabel":"Rend 2d4 + NivPJ points de mana au personnage qui la boit.","catalogVisible":true,"canonicalConsumableBase":"B042"},"A405":{"name":"Potion de mana renforcée","displayName":"Potion de mana renforcée","example":"Potion de mana renforcée","power":2,"effect":"Rend 3d4 + NivPJ points de mana au personnage qui la boit.","rp":"Fluide bleuté ou violet, stabilisé dans une fiole gravée pour éviter la dispersion du mana.","mechanism":"Commande COFantasy","fieldPatch":"!cof-recupere-mana 3d4+@{selected|niveau}","uiFamily":"mana","uiTierLabel":"Rend 3d4 + NivPJ points de mana au personnage qui la boit.","catalogVisible":true,"canonicalConsumableBase":"B042","damageType":"force"},"A419":{"name":"Potion de mana supérieure","displayName":"Potion de mana supérieure","example":"Potion de mana supérieure","power":3,"effect":"Rend 4d4 + NivPJ points de mana au personnage qui la boit.","rp":"Fluide bleuté ou violet, stabilisé dans une fiole gravée pour éviter la dispersion du mana.","mechanism":"Commande COFantasy","fieldPatch":"!cof-recupere-mana 4d4+@{selected|niveau}","uiFamily":"mana","uiTierLabel":"Rend 4d4 + NivPJ points de mana au personnage qui la boit.","catalogVisible":true,"canonicalConsumableBase":"B042"},"A426":{"name":"Potion de mana majeure","displayName":"Potion de mana majeure","example":"Potion de mana majeure","power":4,"effect":"Rend 5d4 + NivPJ points de mana au personnage qui la boit.","rp":"Fluide bleuté ou violet, stabilisé dans une fiole gravée pour éviter la dispersion du mana.","mechanism":"Commande COFantasy","fieldPatch":"!cof-recupere-mana 5d4+@{selected|niveau}","uiFamily":"mana","uiTierLabel":"Rend 5d4 + NivPJ points de mana au personnage qui la boit.","catalogVisible":true,"canonicalConsumableBase":"B042"},"A441":{"name":"Potion de mana légendaire","displayName":"Potion de mana légendaire","example":"Potion de mana légendaire","power":5,"effect":"Rend 6d4 + NivPJ points de mana au personnage qui la boit.","rp":"Fluide bleuté ou violet, stabilisé dans une fiole gravée pour éviter la dispersion du mana.","mechanism":"Commande COFantasy","fieldPatch":"!cof-recupere-mana 6d4+@{selected|niveau}","uiFamily":"mana","uiTierLabel":"Rend 6d4 + NivPJ points de mana au personnage qui la boit.","catalogVisible":true,"canonicalConsumableBase":"B042","damageType":"air"},"A465":{"name":"Parchemin de capacité rang 1","displayName":"Parchemin de capacité rang 1","example":"Parchemin de capacité rang 1","power":1,"effect":"Permet d’utiliser une capacité de classe de rang 1 une fois, puis le parchemin est détruit.","rp":"Le texte magique se consume après lecture, libérant une technique ou un savoir scellé.","mechanism":"Effet temporaire / action","fieldPatch":null,"uiFamily":"parchemin","uiTierLabel":"Permet d’utiliser une capacité de classe de rang 1 une fois, puis le parchemin est détruit.","catalogVisible":true,"canonicalConsumableBase":"B047"},"A466":{"name":"Parchemin de capacité rang 2","displayName":"Parchemin de capacité rang 2","example":"Parchemin de capacité rang 2","power":2,"effect":"Permet d’utiliser une capacité de classe de rang 2 une fois, puis le parchemin est détruit.","rp":"Le texte magique se consume après lecture, libérant une technique ou un savoir scellé.","mechanism":"Effet temporaire / action","fieldPatch":null,"uiFamily":"parchemin","uiTierLabel":"Permet d’utiliser une capacité de classe de rang 2 une fois, puis le parchemin est détruit.","catalogVisible":true,"canonicalConsumableBase":"B047"},"A467":{"name":"Parchemin de capacité rang 3","displayName":"Parchemin de capacité rang 3","example":"Parchemin de capacité rang 3","power":3,"effect":"Permet d’utiliser une capacité de classe de rang 3 une fois, puis le parchemin est détruit.","rp":"Le texte magique se consume après lecture, libérant une technique ou un savoir scellé.","mechanism":"Effet temporaire / action","fieldPatch":null,"uiFamily":"parchemin","uiTierLabel":"Permet d’utiliser une capacité de classe de rang 3 une fois, puis le parchemin est détruit.","catalogVisible":true,"canonicalConsumableBase":"B047"},"A468":{"name":"Parchemin de capacité rang 4","displayName":"Parchemin de capacité rang 4","example":"Parchemin de capacité rang 4","power":4,"effect":"Permet d’utiliser une capacité de classe de rang 4 une fois, puis le parchemin est détruit.","rp":"Le texte magique se consume après lecture, libérant une technique ou un savoir scellé.","mechanism":"Effet temporaire / action","fieldPatch":null,"uiFamily":"parchemin","uiTierLabel":"Permet d’utiliser une capacité de classe de rang 4 une fois, puis le parchemin est détruit.","catalogVisible":true,"canonicalConsumableBase":"B047"},"A469":{"name":"Parchemin de capacité rang 5","displayName":"Parchemin de capacité rang 5","example":"Parchemin de capacité rang 5","power":5,"effect":"Permet d’utiliser une capacité de classe de rang 5 une fois, puis le parchemin est détruit.","rp":"Le texte magique se consume après lecture, libérant une technique ou un savoir scellé.","mechanism":"Effet temporaire / action","fieldPatch":null,"uiFamily":"parchemin","uiTierLabel":"Permet d’utiliser une capacité de classe de rang 5 une fois, puis le parchemin est détruit.","catalogVisible":true,"canonicalConsumableBase":"B047"},"A390":{"name":"Poison mineur","displayName":"Poison mineur","example":"Poison mineur","power":0,"effect":"+1d4 DM de toxique. Une dose s’applique sur une arme ou un projectile. DD CON 15.","rp":"Préparation de toxines légères et venin dilué, conservée dans un flacon scellé à la cire.","mechanism":"Commande COFantasy","fieldPatch":"!cof-enduire-poison -1 rapide 1d4 15","uiFamily":"poison","uiTierLabel":"+1d4 DM de toxique. Une dose s’applique sur une arme ou un projectile. DD CON 15.","catalogVisible":true,"canonicalConsumableBase":"B039","damageType":"toxique","statKey":"CON"},"A391":{"name":"Poison affaiblissant","displayName":"Poison affaiblissant","example":"Poison affaiblissant","power":1,"effect":"+1d4 DM de toxique et inflige l’état affaibli. Une dose s’applique sur une arme ou un projectile. DD CON 15.","rp":"Préparation de venin nerveux dosé pour troubler les muscles, conservée dans un flacon scellé à la cire.","mechanism":"Poison rapide + affaiblissant","fieldPatch":"!cof-enduire-poison -1 rapideAffaiblissant 1d4 15","uiFamily":"poison","uiTierLabel":"+1d4 DM de toxique et inflige l’état affaibli. Une dose s’applique sur une arme ou un projectile. DD CON 15.","catalogVisible":true,"canonicalConsumableBase":"B039","damageType":"toxique","statKey":"CON"},"A392":{"name":"Poison virulent","displayName":"Poison virulent","example":"Poison virulent","power":2,"effect":"+2d4 DM de toxique. Une dose s’applique sur une arme ou un projectile. DD CON 10.","rp":"Préparation de venin concentré dans une huile sombre, conservée dans un flacon scellé à la cire.","mechanism":"Commande COFantasy","fieldPatch":"!cof-enduire-poison -1 rapide 2d4 10","uiFamily":"poison","uiTierLabel":"+2d4 DM de toxique. Une dose s’applique sur une arme ou un projectile. DD CON 10.","catalogVisible":true,"canonicalConsumableBase":"B039","damageType":"toxique","statKey":"CON"},"A393":{"name":"Poison virulent affaiblissant","displayName":"Poison virulent affaiblissant","example":"Poison virulent affaiblissant","power":3,"effect":"+2d4 DM de toxique et inflige l’état affaibli. Une dose s’applique sur une arme ou un projectile. DD CON 10.","rp":"Préparation de toxine instable qui brûle les forces de la cible, conservée dans un flacon scellé à la cire.","mechanism":"Poison rapide + affaiblissant","fieldPatch":"!cof-enduire-poison -1 rapideAffaiblissant 2d4 10","uiFamily":"poison","uiTierLabel":"+2d4 DM de toxique et inflige l’état affaibli. Une dose s’applique sur une arme ou un projectile. DD CON 10.","catalogVisible":true,"canonicalConsumableBase":"B039","damageType":"toxique","statKey":"CON"},"A394":{"name":"Poison mortel","displayName":"Poison mortel","example":"Poison mortel","power":4,"effect":"+3d4 DM de toxique. Une dose s’applique sur une arme ou un projectile. DD CON 5.","rp":"Préparation de distillat noir préparé goutte par goutte, conservée dans un flacon scellé à la cire.","mechanism":"Commande COFantasy","fieldPatch":"!cof-enduire-poison -1 rapide 3d4 5","uiFamily":"poison","uiTierLabel":"+3d4 DM de toxique. Une dose s’applique sur une arme ou un projectile. DD CON 5.","catalogVisible":true,"canonicalConsumableBase":"B039","damageType":"toxique","statKey":"CON"},"A395":{"name":"Poison mortel affaiblissant","displayName":"Poison mortel affaiblissant","example":"Poison mortel affaiblissant","power":5,"effect":"+3d4 DM de toxique et inflige l’état affaibli. Une dose s’applique sur une arme ou un projectile. DD CON 5.","rp":"Préparation de poison maître, capable de briser le corps en quelques battements, conservée dans un flacon scellé à la cire.","mechanism":"Poison rapide + affaiblissant","fieldPatch":"!cof-enduire-poison -1 rapideAffaiblissant 3d4 5","uiFamily":"poison","uiTierLabel":"+3d4 DM de toxique et inflige l’état affaibli. Une dose s’applique sur une arme ou un projectile. DD CON 5.","catalogVisible":true,"canonicalConsumableBase":"B039","damageType":"toxique","statKey":"CON"},"A440":{"name":"Potion de célérité","displayName":"Potion de célérité","example":"Potion de célérité","power":5,"effect":"+1 action par tour pendant 2 tours.","rp":"Liquide clair parcouru d’éclairs dorés, qui accélère brutalement les réflexes du buveur.","mechanism":"Commande COFantasy","fieldPatch":"!cof-effet-temp hate 2","uiFamily":"potion","uiTierLabel":"+1 action par tour pendant 2 tours.","catalogVisible":true,"canonicalConsumableBase":"B041"},"A471":{"name":"Potion de résistance air","displayName":"Potion de résistance air","example":"Potion de résistance air","power":2,"effect":"Confère RD +5 contre les DM d’air pendant 1 combat.","rp":"Élixir chargé de poussière de zéphyr et sels conducteurs, laissant un reflet protecteur sur la peau du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_air 999 --valeur 5","uiFamily":"resistance","uiTierLabel":"Confère RD +5 contre les DM d’air pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B043","damageType":"air"},"A407":{"name":"Potion de résistance contondant","displayName":"Potion de résistance contondant","example":"Potion de résistance contondant","power":2,"effect":"Confère RD +5 contre les DM contondants pendant 1 combat.","rp":"Mélange épais de baume amortissant à base de fibres épaisses, qui durcit brièvement la peau et les vêtements du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_contondant 999 --valeur 5","uiFamily":"resistance","uiTierLabel":"Confère RD +5 contre les DM contondants pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B044","damageType":"contondant"},"A477":{"name":"Potion de résistance drain","displayName":"Potion de résistance drain","example":"Potion de résistance drain","power":2,"effect":"Confère RD +5 contre les DM de drain pendant 1 combat.","rp":"Élixir chargé d’essence d’ombre et réactifs vampiriques stabilisés, laissant un reflet protecteur sur la peau du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_drain 999 --valeur 5","uiFamily":"resistance","uiTierLabel":"Confère RD +5 contre les DM de drain pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B043","damageType":"drain"},"A472":{"name":"Potion de résistance eau","displayName":"Potion de résistance eau","example":"Potion de résistance eau","power":2,"effect":"Confère RD +5 contre les DM d’eau pendant 1 combat.","rp":"Élixir chargé d’eau élémentaire condensée et cristaux de marée, laissant un reflet protecteur sur la peau du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_eau 999 --valeur 5","uiFamily":"resistance","uiTierLabel":"Confère RD +5 contre les DM d’eau pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B043","damageType":"eau"},"A410":{"name":"Potion de résistance feu","displayName":"Potion de résistance feu","example":"Potion de résistance feu","power":2,"effect":"Confère RD +5 contre les DM de feu pendant 1 combat.","rp":"Élixir chargé de cendre alchimique et sels ignifuges, laissant un reflet protecteur sur la peau du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_feu 999 --valeur 5","uiFamily":"resistance","uiTierLabel":"Confère RD +5 contre les DM de feu pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B043","damageType":"feu"},"A413":{"name":"Potion de résistance force","displayName":"Potion de résistance force","example":"Potion de résistance force","power":2,"effect":"Confère RD +5 contre les DM force pendant 1 combat.","rp":"Élixir chargé de poudre d’arcanite et eau lunaire stabilisée, laissant un reflet protecteur sur la peau du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_force 999 --valeur 5","uiFamily":"resistance","uiTierLabel":"Confère RD +5 contre les DM force pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B043","damageType":"force"},"A476":{"name":"Potion de résistance lumière","displayName":"Potion de résistance lumière","example":"Potion de résistance lumière","power":2,"effect":"Confère RD +5 contre les DM lumière pendant 1 combat.","rp":"Élixir chargé de poudre de laënk et sels lumineux, laissant un reflet protecteur sur la peau du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_lumiere 999 --valeur 5","uiFamily":"resistance","uiTierLabel":"Confère RD +5 contre les DM lumière pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B043","damageType":"lumière"},"A475":{"name":"Potion de résistance ombre","displayName":"Potion de résistance ombre","example":"Potion de résistance ombre","power":2,"effect":"Confère RD +5 contre les DM ombre pendant 1 combat.","rp":"Élixir chargé de cendres funéraires stabilisées et sels noirs, laissant un reflet protecteur sur la peau du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_ombre 999 --valeur 5","uiFamily":"resistance","uiTierLabel":"Confère RD +5 contre les DM ombre pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B043","damageType":"ombre"},"A408":{"name":"Potion de résistance perçant","displayName":"Potion de résistance perçant","example":"Potion de résistance perçant","power":2,"effect":"Confère RD +5 contre les DM perforants pendant 1 combat.","rp":"Mélange épais de résine dense et fragments de plaques superposées, qui durcit brièvement la peau et les vêtements du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_percant 999 --valeur 5","uiFamily":"resistance","uiTierLabel":"Confère RD +5 contre les DM perforants pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B044","damageType":"perforant"},"A478":{"name":"Potion de résistance psychique","displayName":"Potion de résistance psychique","example":"Potion de résistance psychique","power":2,"effect":"Confère RD +5 contre les DM psychique pendant 1 combat.","rp":"Élixir chargé de cristaux psioniques et encens onirique, laissant un reflet protecteur sur la peau du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_psychique 999 --valeur 5","uiFamily":"resistance","uiTierLabel":"Confère RD +5 contre les DM psychique pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B043","damageType":"psychique"},"A473":{"name":"Potion de résistance terre","displayName":"Potion de résistance terre","example":"Potion de résistance terre","power":2,"effect":"Confère RD +5 contre les DM de terre pendant 1 combat.","rp":"Élixir chargé de poudre de roche runique et argile minérale, laissant un reflet protecteur sur la peau du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_terre 999 --valeur 5","uiFamily":"resistance","uiTierLabel":"Confère RD +5 contre les DM de terre pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B043","damageType":"terre"},"A414":{"name":"Potion de résistance toxique","displayName":"Potion de résistance toxique","example":"Potion de résistance toxique","power":2,"effect":"Confère RD +5 contre les DM de toxique pendant 1 combat.","rp":"Élixir chargé de sels antiseptiques et encens médicinal réduit, laissant un reflet protecteur sur la peau du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_toxique 999 --valeur 5","uiFamily":"resistance","uiTierLabel":"Confère RD +5 contre les DM de toxique pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B043","damageType":"toxique"},"A409":{"name":"Potion de résistance tranchant","displayName":"Potion de résistance tranchant","example":"Potion de résistance tranchant","power":2,"effect":"Confère RD +5 contre les DM tranchants pendant 1 combat.","rp":"Mélange épais d’écorces métalliques et poudre de maille broyée, qui durcit brièvement la peau et les vêtements du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_tranchant 999 --valeur 5","uiFamily":"resistance","uiTierLabel":"Confère RD +5 contre les DM tranchants pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B044","damageType":"tranchant"},"A479":{"name":"Potion de résistance air supérieure","displayName":"Potion de résistance air supérieure","example":"Potion de résistance air supérieure","power":4,"effect":"Confère RD +10 contre les DM d’air pendant 1 combat.","rp":"Élixir chargé de poussière de zéphyr et sels conducteurs, laissant un reflet protecteur sur la peau du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_air 999 --valeur 10","uiFamily":"resistance","uiTierLabel":"Confère RD +10 contre les DM d’air pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B043","damageType":"air"},"A428":{"name":"Potion de résistance contondant supérieure","displayName":"Potion de résistance contondant supérieure","example":"Potion de résistance contondant supérieure","power":4,"effect":"Confère RD +10 contre les DM contondants pendant 1 combat.","rp":"Mélange épais de baume amortissant à base de fibres épaisses, qui durcit brièvement la peau et les vêtements du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_contondant 999 --valeur 10","uiFamily":"resistance","uiTierLabel":"Confère RD +10 contre les DM contondants pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B044","damageType":"contondant"},"A485":{"name":"Potion de résistance drain supérieure","displayName":"Potion de résistance drain supérieure","example":"Potion de résistance drain supérieure","power":4,"effect":"Confère RD +10 contre les DM de drain pendant 1 combat.","rp":"Élixir chargé d’essence d’ombre et réactifs vampiriques stabilisés, laissant un reflet protecteur sur la peau du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_drain 999 --valeur 10","uiFamily":"resistance","uiTierLabel":"Confère RD +10 contre les DM de drain pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B043","damageType":"drain"},"A480":{"name":"Potion de résistance eau supérieure","displayName":"Potion de résistance eau supérieure","example":"Potion de résistance eau supérieure","power":4,"effect":"Confère RD +10 contre les DM d’eau pendant 1 combat.","rp":"Élixir chargé d’eau élémentaire condensée et cristaux de marée, laissant un reflet protecteur sur la peau du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_eau 999 --valeur 10","uiFamily":"resistance","uiTierLabel":"Confère RD +10 contre les DM d’eau pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B043","damageType":"eau"},"A431":{"name":"Potion de résistance feu supérieure","displayName":"Potion de résistance feu supérieure","example":"Potion de résistance feu supérieure","power":4,"effect":"Confère RD +10 contre les DM de feu pendant 1 combat.","rp":"Élixir chargé de cendre alchimique et sels ignifuges, laissant un reflet protecteur sur la peau du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_feu 999 --valeur 10","uiFamily":"resistance","uiTierLabel":"Confère RD +10 contre les DM de feu pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B043","damageType":"feu"},"A434":{"name":"Potion de résistance force supérieure","displayName":"Potion de résistance force supérieure","example":"Potion de résistance force supérieure","power":4,"effect":"Confère RD +10 contre les DM force pendant 1 combat.","rp":"Élixir chargé de poudre d’arcanite et eau lunaire stabilisée, laissant un reflet protecteur sur la peau du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_force 999 --valeur 10","uiFamily":"resistance","uiTierLabel":"Confère RD +10 contre les DM force pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B043","damageType":"force"},"A484":{"name":"Potion de résistance lumière supérieure","displayName":"Potion de résistance lumière supérieure","example":"Potion de résistance lumière supérieure","power":4,"effect":"Confère RD +10 contre les DM lumière pendant 1 combat.","rp":"Élixir chargé de poudre de laënk et sels lumineux, laissant un reflet protecteur sur la peau du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_lumiere 999 --valeur 10","uiFamily":"resistance","uiTierLabel":"Confère RD +10 contre les DM lumière pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B043","damageType":"lumière"},"A483":{"name":"Potion de résistance ombre supérieure","displayName":"Potion de résistance ombre supérieure","example":"Potion de résistance ombre supérieure","power":4,"effect":"Confère RD +10 contre les DM ombre pendant 1 combat.","rp":"Élixir chargé de cendres funéraires stabilisées et sels noirs, laissant un reflet protecteur sur la peau du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_ombre 999 --valeur 10","uiFamily":"resistance","uiTierLabel":"Confère RD +10 contre les DM ombre pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B043","damageType":"ombre"},"A429":{"name":"Potion de résistance perçant supérieure","displayName":"Potion de résistance perçant supérieure","example":"Potion de résistance perçant supérieure","power":4,"effect":"Confère RD +10 contre les DM perforants pendant 1 combat.","rp":"Mélange épais de résine dense et fragments de plaques superposées, qui durcit brièvement la peau et les vêtements du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_percant 999 --valeur 10","uiFamily":"resistance","uiTierLabel":"Confère RD +10 contre les DM perforants pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B044","damageType":"perforant"},"A486":{"name":"Potion de résistance psychique supérieure","displayName":"Potion de résistance psychique supérieure","example":"Potion de résistance psychique supérieure","power":4,"effect":"Confère RD +10 contre les DM psychique pendant 1 combat.","rp":"Élixir chargé de cristaux psioniques et encens onirique, laissant un reflet protecteur sur la peau du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_psychique 999 --valeur 10","uiFamily":"resistance","uiTierLabel":"Confère RD +10 contre les DM psychique pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B043","damageType":"psychique"},"A481":{"name":"Potion de résistance terre supérieure","displayName":"Potion de résistance terre supérieure","example":"Potion de résistance terre supérieure","power":4,"effect":"Confère RD +10 contre les DM de terre pendant 1 combat.","rp":"Élixir chargé de poudre de roche runique et argile minérale, laissant un reflet protecteur sur la peau du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_terre 999 --valeur 10","uiFamily":"resistance","uiTierLabel":"Confère RD +10 contre les DM de terre pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B043","damageType":"terre"},"A435":{"name":"Potion de résistance toxique supérieure","displayName":"Potion de résistance toxique supérieure","example":"Potion de résistance toxique supérieure","power":4,"effect":"Confère RD +10 contre les DM de toxique pendant 1 combat.","rp":"Élixir chargé de sels antiseptiques et encens médicinal réduit, laissant un reflet protecteur sur la peau du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_toxique 999 --valeur 10","uiFamily":"resistance","uiTierLabel":"Confère RD +10 contre les DM de toxique pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B043","damageType":"toxique"},"A430":{"name":"Potion de résistance tranchant supérieure","displayName":"Potion de résistance tranchant supérieure","example":"Potion de résistance tranchant supérieure","power":4,"effect":"Confère RD +10 contre les DM tranchants pendant 1 combat.","rp":"Mélange épais d’écorces métalliques et poudre de maille broyée, qui durcit brièvement la peau et les vêtements du buveur.","mechanism":"Commande COFantasy / effet temporaire","fieldPatch":"!cof-effet-temp rdTemp_tranchant 999 --valeur 10","uiFamily":"resistance","uiTierLabel":"Confère RD +10 contre les DM tranchants pendant 1 combat.","catalogVisible":true,"canonicalConsumableBase":"B044","damageType":"tranchant"},"A397":{"name":"Potion de soins mineure","displayName":"Potion de soins mineure","example":"Potion de soins mineure","power":0,"effect":"Rend 1d4 + NivPJ PV au personnage qui la boit.","rp":"Liquide rouge ou doré, préparé avec des herbes cicatrisantes et une trace de magie vitale.","mechanism":"Commande COFantasy","fieldPatch":"!cof-soin 1d4+@{selected|niveau}","uiFamily":"soins","uiTierLabel":"Rend 1d4 + NivPJ PV au personnage qui la boit.","catalogVisible":true,"canonicalConsumableBase":"B045"},"A399":{"name":"Potion de soins simple","displayName":"Potion de soins simple","example":"Potion de soins simple","power":1,"effect":"Rend 2d4 + NivPJ PV au personnage qui la boit.","rp":"Liquide rouge ou doré, préparé avec des herbes cicatrisantes et une trace de magie vitale.","mechanism":"Commande COFantasy","fieldPatch":"!cof-soin 2d4+@{selected|niveau}","uiFamily":"soins","uiTierLabel":"Rend 2d4 + NivPJ PV au personnage qui la boit.","catalogVisible":true,"canonicalConsumableBase":"B045"},"A418":{"name":"Potion de soins renforcée","displayName":"Potion de soins renforcée","example":"Potion de soins renforcée","power":2,"effect":"Rend 3d4 + NivPJ PV au personnage qui la boit.","rp":"Liquide rouge ou doré, préparé avec des herbes cicatrisantes et une trace de magie vitale.","mechanism":"Commande COFantasy","fieldPatch":"!cof-soin 3d4+@{selected|niveau}","uiFamily":"soins","uiTierLabel":"Rend 3d4 + NivPJ PV au personnage qui la boit.","catalogVisible":true,"canonicalConsumableBase":"B045","damageType":"force"},"A420":{"name":"Potion de soins supérieure","displayName":"Potion de soins supérieure","example":"Potion de soins supérieure","power":3,"effect":"Rend 4d4 + NivPJ PV au personnage qui la boit.","rp":"Liquide rouge ou doré, préparé avec des herbes cicatrisantes et une trace de magie vitale.","mechanism":"Commande COFantasy","fieldPatch":"!cof-soin 4d4+@{selected|niveau}","uiFamily":"soins","uiTierLabel":"Rend 4d4 + NivPJ PV au personnage qui la boit.","catalogVisible":true,"canonicalConsumableBase":"B045"},"A439":{"name":"Potion de soins majeure","displayName":"Potion de soins majeure","example":"Potion de soins majeure","power":4,"effect":"Rend 5d4 + NivPJ PV au personnage qui la boit.","rp":"Liquide rouge ou doré, préparé avec des herbes cicatrisantes et une trace de magie vitale.","mechanism":"Commande COFantasy","fieldPatch":"!cof-soin 5d4+@{selected|niveau}","uiFamily":"soins","uiTierLabel":"Rend 5d4 + NivPJ PV au personnage qui la boit.","catalogVisible":true,"canonicalConsumableBase":"B045"},"A442":{"name":"Potion de soins légendaire","displayName":"Potion de soins légendaire","example":"Potion de soins légendaire","power":5,"effect":"Rend 6d4 + NivPJ PV au personnage qui la boit.","rp":"Liquide rouge ou doré, préparé avec des herbes cicatrisantes et une trace de magie vitale.","mechanism":"Commande COFantasy","fieldPatch":"!cof-soin 6d4+@{selected|niveau}","uiFamily":"soins","uiTierLabel":"Rend 6d4 + NivPJ PV au personnage qui la boit.","catalogVisible":true,"canonicalConsumableBase":"B045","damageType":"air"}};
  function apply(a,p){if(!a||!p)return;Object.keys(p).forEach(function(k){a[k]=p[k];});}
  AFFIXES.forEach(function(a){
    apply(a,patch[a.id]);
    apply(a,cons[a.id]);
    if(a.category==='Objet consommable'&&!COI_CANONICAL_CONSUMABLE_BASE_5056[a.id]){
      a.catalogVisible=false;
      a.catalogNote='Alias runtime historique — masqué du catalogue CLEAN 5.05.6.';
    }
    if(String(a.catalogNote||'').indexOf('En attente de prise en charge COFantasy')>=0 &&
       (a.auto===true || String(a.audit||'').indexOf('COF_EXISTANT')===0)){
      a.catalogNote='';
    }
    if(typeof a.predicates==='string'&&a.predicates){
      a.predicates=a.predicates
        .replace(/bonus_RD::froid:/g,'bonus_RD::eau:')
        .replace(/bonus_RD::electrique:/g,'bonus_RD::air:')
        .replace(/bonus_RD::sonique:/g,'bonus_RD::air:')
        .replace(/bonus_RD::acide:/g,'bonus_RD::terre:')
        .replace(/bonus_RD::necrotique:/g,'bonus_RD::ombre:')
        .replace(/bonus_RD::radiant:/g,'bonus_RD::lumiere:')
        .replace(/bonus_RD::arcane:/g,'bonus_RD::force:')
        .replace(/bonus_RD::poison:/g,'bonus_RD::toxique:')
        .replace(/bonus_RD::maladie:/g,'bonus_RD::toxique:')
        .replace(/bonus_RD::mental:/g,'bonus_RD::psychique:');
    }
  });
  var h=AFFIXES.filter(function(a){return a.id==='AX_IMM_ETOURDI';})[0];if(h){h.catalogVisible=false;h.catalogNote='Alias historique masqué — CLEAN 5.05.6.';}
  var h=AFFIXES.filter(function(a){return a.id==='AX_IMM_ENCOMBRE';})[0];if(h){h.catalogVisible=false;h.catalogNote='Alias historique masqué — CLEAN 5.05.6.';}
  var h=AFFIXES.filter(function(a){return a.id==='AR_IMM_ASSOMME';})[0];if(h){h.catalogVisible=false;h.catalogNote='Alias historique masqué — CLEAN 5.05.6.';}
  var h=AFFIXES.filter(function(a){return a.id==='AR_IMM_IMMOBILISE';})[0];if(h){h.catalogVisible=false;h.catalogNote='Alias historique masqué — CLEAN 5.05.6.';}
  var b066=BASES.filter(function(b){return b.id==='B066';})[0];
  if(b066){
    b066.name='Parchemin de stabilisation';
    b066.price='150 pa';
    b066.description='Stabilise immédiatement un PJ en blessure maligne. Le personnage reste au sol jusqu’à la fin du combat.';
    b066.consumableEffectText=b066.description;
    b066.consumableContext='À partir de la 2e chute. Usage unique.';
  }
})();

var COI_ECONOMY_20261003 = {
  qPA:[0,300,1000,3000,9000,30000],
  pPA:[0,400,1500,5000,18000,60000],
  qualityReferenceBasePA:5,
  qualityMaterialExponent:0.25,
  bases:{"B001":[0.4,1.0,1],"B002":[1.0,1.0,1],"B003":[1.5,1.0,1],"B004":[2.5,1.0,1],"B005":[8.0,1.0,1],"B006":[1.5,1.0,1],"B007":[1.2,1.0,1],"B064":[8.0,1.0,1],"B008":[2.0,1.0,1],"B065":[2.5,1.0,1],"B009":[5.0,1.0,1],"B010":[8.0,1.0,1],"B011":[3.0,1.0,1],"B012":[5.0,1.0,1],"B013":[10.0,1.0,1],"B014":[6.0,1.0,1],"B015":[15.0,1.0,1],"B016":[10.0,1.0,1],"B017":[4.0,1.0,1],"B018":[6.0,1.0,1],"B019":[3.0,1.0,1],"B020":[1.5,1.0,1],"B021":[100.0,1.0,1],"B022":[50.0,1.0,1],"B060":[1.0,1.0,1],"B062":[1.5,1.0,1],"B063":[5.0,1.0,1],"B023":[60.0,1.5,1],"B024":[15.0,1.5,1],"B025":[25.0,1.5,1],"B026":[8.0,1.3,1],"B027":[4.0,1.3,1],"B031":[2.0,1.3,1],"B028":[4.0,1.0,1],"B029":[2.0,1.0,1],"B032":[5.0,2.0,0],"B033":[0.2,1.4,0],"B034":[8.0,2.5,0],"B035":[0.3,1.3,0],"B036":[0.2,1.2,0],"B037":[0.4,1.2,0],"B038":[2.0,1.1,0],"B061":[0.5,1.2,0],"B057":[0.04,1.0,0],"B048":[0.05,1.0,0],"B049":[0.2,1.0,0],"B050":[0.1,1.0,0],"B051":[0.08,1.0,0],"B052":[0.15,1.0,0],"B053":[0.02,1.0,0],"B054":[0.15,1.0,0],"B055":[0.15,1.0,0],"B056":[0.5,1.0,0],"B058":[0.1,1.0,0],"B059":[0.02,1.0,0]},
  affixes:{"AX_IMM_SURPRIS":[2,1.054,0.989050184],"AX_IMM_ASSOMME":[4,1.1,1.023674726],"AX_IMM_RENVERSE":[2,1.019,1.048310334],"AX_IMM_AVEUGLE":[3,1.102,0.98171813],"AX_IMM_AFFAIBLI":[3,1.078,1.041464992],"AX_IMM_PARALYSE":[4,1.072,1.023708389],"AX_IMM_ENDORMI":[3,1.024,0.998213799],"AX_IMM_APEURE":[2,1.043,1.040306268],"AX_PROTECTRICE":[2,1.042,0.954658527],"AX_SECONDE_CHANCE":[4,0.952,0.998084188],"AR_IMM_APEURE":[2,1.043,1.039895286],"AR_IMM_ENDORMI":[3,1.024,0.964720775],"AR_IMM_ETOURDI":[4,1.1,0.98190755],"AR_IMM_RALENTI":[2,1.043,0.961549925],"AR_IMM_RENVERSE":[2,1.019,0.953787546],"AR_IMM_AFFAIBLI":[3,1.078,1.025791092],"AR_PROTECTRICE":[2,1.042,1.010589094],"AR_BOUCLIER_PROTECTEUR":[2,1.042,1.020065191],"AR_TISSU_BOUCLIER_PSI":[3,1.05,0.993597038],"A001":[2,1.043,1.043303744],"ARD_CLOTH_TRANCHANT_1":[1,0.965,0.959492516],"ARD_CLOTH_PERCANT_1":[1,0.965,0.972653346],"ARD_CLOTH_CONTONDANT_1":[1,0.965,0.956575194],"AXST_STAT_FOR_1":[2,1.15,1.000271713],"AXST_STAT_DEX_1":[2,1.15,1.022274495],"AXST_STAT_CON_1":[2,1.15,0.98000493],"AXST_STAT_INT_1":[2,1.15,0.963278162],"AXST_STAT_SAG_1":[2,1.15,0.975798447],"AXST_STAT_CHA_1":[2,1.15,0.980929152],"AXMOVE_1":[1,0.982,1.048614154],"AR_STAT_INT_1":[2,1.15,0.992107253],"AR_STAT_SAG_1":[2,1.15,1.014427958],"AR_STAT_CHA_1":[2,1.15,1.033490752],"AR_STAT_DEX_1":[2,1.15,0.985202448],"AR_STAT_FOR_1":[2,1.15,1.035564436],"AR_STAT_CON_1":[2,1.15,0.984548632],"AR_BOUCLIER_PERCUTEUR_1":[2,1.019,0.964844139],"A002":[2,1.087,0.98079955],"ARD_AIR_2":[1,1.0,1.031112787],"ARD_EAU_2":[1,1.0,1.049800864],"ARD_TERRE_2":[1,1.0,1.04026328],"ARD_NECROTIQUE_2":[1,1.0,0.966229464],"ARD_RADIANT_2":[1,1.0,0.971671686],"ARD_ARCANE_2":[1,1.0,1.041667173],"ARD_MALADIE_2":[1,1.0,1.036673419],"ARD_DRAIN_2":[1,1.0,0.978768531],"ARD_MENTAL_2":[1,1.0,0.994782298],"ARD_CLOTH_TRANCHANT_2":[1,0.931,0.965020582],"ARD_CLOTH_PERCANT_2":[1,0.931,1.035023287],"ARD_CLOTH_CONTONDANT_2":[1,0.931,1.01201691],"AXSK_ATHLETISME_2":[1,0.993,1.001684127],"AXSK_PUISSANCE_2":[1,0.993,0.984011456],"AXSK_PROTECTION_2":[1,0.993,0.982153077],"AXSK_ACROBATIES_2":[1,0.993,1.003968651],"AXSK_DISCRETION_2":[1,1.017,1.015095578],"AXSK_ADRESSE_2":[1,0.993,1.042770306],"AXSK_ENDURANCE_2":[1,0.993,0.979019844],"AXSK_RESISTANCE_2":[1,0.993,1.010446783],"AXSK_SANG_FROID_2":[1,0.993,0.974216542],"AXSK_RECUPERATION_2":[1,0.993,1.021463703],"AXSK_ARCANES_2":[1,0.993,1.016140725],"AXSK_HISTOIRE_2":[1,0.993,1.033597838],"AXSK_RELIGION_2":[1,0.993,1.031036913],"AXSK_NATURE_2":[1,0.993,0.975236754],"AXSK_INVESTIGATION_2":[1,0.993,1.018159526],"AXSK_TECHNIQUE_2":[1,0.993,0.967207781],"AXSK_PERCEPTION_2":[1,0.993,1.045290034],"AXSK_PERSPICACITE_2":[1,0.993,0.975111356],"AXSK_SURVIE_2":[1,0.993,1.046534685],"AXSK_MEDECINE_2":[1,0.993,0.993160999],"AXSK_INSTINCT_2":[1,0.993,0.987374929],"AXSK_PERSUASION_2":[1,0.993,0.966640776],"AXSK_INTIMIDATION_2":[1,0.993,0.968545552],"AXSK_SUPERCHERIE_2":[1,0.993,1.011602299],"AXSK_REPRESENTATION_2":[1,0.993,1.036737689],"AXSK_COMMANDEMENT_2":[1,0.993,0.973378393],"AXST_STAT_FOR_2":[3,1.15,1.018200257],"AXST_STAT_DEX_2":[3,1.15,1.036594384],"AXST_STAT_CON_2":[3,1.15,0.973122634],"AXST_STAT_INT_2":[3,1.15,1.026894053],"AXST_STAT_SAG_2":[3,1.15,1.035045114],"AXST_STAT_CHA_2":[3,1.15,1.014964993],"AXRD_FEU_2":[1,1.0,1.001556687],"AXRD_AIR_2":[1,1.0,1.033555606],"AXRD_EAU_2":[1,1.0,1.021213705],"AXRD_TERRE_2":[1,1.0,0.958473274],"AXRD_NECROTIQUE_2":[1,1.0,0.999212403],"AXRD_RADIANT_2":[1,1.0,0.962636816],"AXRD_ARCANE_2":[1,1.0,1.003071526],"AXRD_POISON_2":[1,1.0,0.986555061],"AXRD_DRAIN_2":[1,1.0,0.9854107],"AXRD_MENTAL_2":[1,1.0,0.999080933],"AXRD_TRANCHANT_2":[1,1.0,1.04124428],"AXRD_PERCANT_2":[1,1.0,0.969827781],"AXRD_CONTONDANT_2":[1,1.0,0.978642596],"AXMOVE_2":[2,0.965,1.028514508],"AX_ANTICRIT_2":[1,0.944,0.987107241],"AR_STAT_INT_2":[3,1.15,0.960516944],"AR_STAT_SAG_2":[3,1.15,1.026171449],"AR_STAT_CHA_2":[3,1.15,1.016267911],"AR_STAT_DEX_2":[3,1.15,0.959973748],"AR_STAT_FOR_2":[3,1.15,1.01441985],"AR_STAT_CON_2":[3,1.15,0.99148539],"ARSK_ARCANES_2":[1,0.993,1.047760632],"ARSK_RELIGION_2":[1,0.993,0.984903709],"ARSK_HISTOIRE_2":[1,0.993,1.029096944],"ARSK_NATURE_2":[1,0.993,0.960204157],"ARSK_SANG_FROID_2":[1,0.993,1.034411464],"ARSK_RESISTANCE_2":[1,0.993,1.022592812],"ARSK_ACROBATIES_2":[1,0.993,1.003522095],"ARSK_DISCRETION_2":[1,1.017,0.965677884],"ARSK_ADRESSE_2":[1,0.993,0.984843074],"ARSK_ATHLETISME_2":[1,0.993,0.995897742],"ARSK_SURVIE_2":[1,0.993,0.952765736],"ARSK_PERCEPTION_2":[1,0.993,1.033346169],"ARSK_PUISSANCE_2":[1,0.993,1.002673027],"ARSK_ENDURANCE_2":[1,0.993,0.991459386],"ARSK_INTIMIDATION_2":[1,0.993,1.01028023],"ARSK_PROTECTION_2":[1,0.993,0.95759566],"AR_ANTICRIT_2":[1,0.944,1.010827121],"AR_BOUCLIER_PERCUTEUR_2":[3,1.024,1.013554757],"WSKM_ATHLETISME_2":[1,0.993,1.010497033],"WSKM_PUISSANCE_2":[1,0.993,1.048684608],"WSKM_ADRESSE_2":[1,0.993,1.03598938],"WSKM_ACROBATIES_2":[1,0.993,0.98382102],"WSKD_ADRESSE_2":[1,0.993,1.014036142],"WSKD_ACROBATIES_2":[1,0.993,0.956472082],"WSKD_PERCEPTION_2":[1,0.993,0.998737833],"WSKD_SURVIE_2":[1,0.993,0.960483751],"WSKD_TECHNIQUE_2":[1,0.993,0.960019414],"WSKD_NATURE_2":[1,0.993,0.974372196],"WSKF_PERCEPTION_2":[1,0.993,1.026255987],"WSKF_TECHNIQUE_2":[1,0.993,0.95188041],"WSKF_ARCANES_2":[1,0.993,0.957366474],"WSKF_RELIGION_2":[1,0.993,1.040726818],"WSKF_NATURE_2":[1,0.993,0.967968161],"WSKF_INVESTIGATION_2":[1,0.993,1.001695385],"A003":[2,1.075,1.009919507],"ARD_AIR_4":[2,1.0,1.042955105],"ARD_EAU_4":[2,1.0,1.029073969],"ARD_TERRE_4":[2,1.0,0.994480203],"ARD_NECROTIQUE_4":[2,1.0,1.030614826],"ARD_RADIANT_4":[2,1.0,1.000188759],"ARD_ARCANE_4":[2,1.0,0.982567239],"ARD_MALADIE_4":[2,1.0,1.00453352],"ARD_DRAIN_4":[2,1.0,1.021209176],"ARD_MENTAL_4":[2,1.0,0.994121439],"AXSK_ATHLETISME_4":[2,1.0,0.958371022],"AXSK_PUISSANCE_4":[2,1.0,0.989468527],"AXSK_PROTECTION_4":[2,1.0,1.007054997],"AXSK_ACROBATIES_4":[2,1.0,0.966297004],"AXSK_DISCRETION_4":[2,1.048,1.038450227],"AXSK_ADRESSE_4":[2,1.0,0.996198882],"AXSK_ENDURANCE_4":[2,1.0,1.040751701],"AXSK_RESISTANCE_4":[2,1.0,1.031146264],"AXSK_SANG_FROID_4":[2,1.0,0.975745882],"AXSK_RECUPERATION_4":[2,1.0,1.013898374],"AXSK_ARCANES_4":[2,1.0,0.997775081],"AXSK_HISTOIRE_4":[2,1.0,0.950282114],"AXSK_RELIGION_4":[2,1.0,1.028599548],"AXSK_NATURE_4":[2,1.0,0.973682488],"AXSK_INVESTIGATION_4":[2,1.0,0.998615213],"AXSK_TECHNIQUE_4":[2,1.0,0.99628475],"AXSK_PERCEPTION_4":[2,1.0,0.984589959],"AXSK_PERSPICACITE_4":[2,1.0,1.044965953],"AXSK_SURVIE_4":[2,1.0,1.018597685],"AXSK_MEDECINE_4":[2,1.0,1.03822802],"AXSK_INSTINCT_4":[2,1.0,0.989046293],"AXSK_PERSUASION_4":[2,1.0,0.98205094],"AXSK_INTIMIDATION_4":[2,1.0,0.991255772],"AXSK_SUPERCHERIE_4":[2,1.0,0.990253367],"AXSK_REPRESENTATION_4":[2,1.0,1.002331052],"AXSK_COMMANDEMENT_4":[2,1.0,1.008547501],"AXRD_FEU_4":[2,1.0,1.020785831],"AXRD_AIR_4":[2,1.0,1.008165904],"AXRD_EAU_4":[2,1.0,0.995065228],"AXRD_TERRE_4":[2,1.0,1.008684789],"AXRD_NECROTIQUE_4":[2,1.0,1.028046872],"AXRD_RADIANT_4":[2,1.0,0.956033717],"AXRD_ARCANE_4":[2,1.0,1.013199101],"AXRD_POISON_4":[2,1.0,0.992098843],"AXRD_DRAIN_4":[2,1.0,1.016379997],"AXRD_MENTAL_4":[2,1.0,0.957483822],"AXRD_TRANCHANT_4":[2,1.0,1.044037308],"AXRD_PERCANT_4":[2,1.0,0.987477612],"AXRD_CONTONDANT_4":[2,1.0,1.001187868],"AX_ANTICRIT_4":[2,0.9,0.992561629],"ARSK_ARCANES_4":[2,1.0,1.006568163],"ARSK_RELIGION_4":[2,1.0,1.035503235],"ARSK_HISTOIRE_4":[2,1.0,0.973027812],"ARSK_NATURE_4":[2,1.0,0.957328612],"ARSK_SANG_FROID_4":[2,1.0,1.046841438],"ARSK_RESISTANCE_4":[2,1.0,0.988978751],"ARSK_ACROBATIES_4":[2,1.0,1.008615724],"ARSK_DISCRETION_4":[2,1.048,1.043742713],"ARSK_ADRESSE_4":[2,1.0,0.980958538],"ARSK_ATHLETISME_4":[2,1.0,1.003315352],"ARSK_SURVIE_4":[2,1.0,1.039014483],"ARSK_PERCEPTION_4":[2,1.0,1.047690867],"ARSK_PUISSANCE_4":[2,1.0,0.961017148],"ARSK_ENDURANCE_4":[2,1.0,0.974979768],"ARSK_INTIMIDATION_4":[2,1.0,1.021918272],"ARSK_PROTECTION_4":[2,1.0,1.010244728],"AR_ANTICRIT_4":[2,0.9,1.016523592],"WSKM_ATHLETISME_4":[2,1.0,0.99508383],"WSKM_PUISSANCE_4":[2,1.0,1.044718842],"WSKM_ADRESSE_4":[2,1.0,0.977901772],"WSKM_ACROBATIES_4":[2,1.0,1.030363986],"WSKD_ADRESSE_4":[2,1.0,1.038464413],"WSKD_ACROBATIES_4":[2,1.0,0.981869247],"WSKD_PERCEPTION_4":[2,1.0,0.959622464],"WSKD_SURVIE_4":[2,1.0,1.004875483],"WSKD_TECHNIQUE_4":[2,1.0,1.022383587],"WSKD_NATURE_4":[2,1.0,1.029077369],"WSKF_PERCEPTION_4":[2,1.0,1.02489958],"WSKF_TECHNIQUE_4":[2,1.0,1.002441031],"WSKF_ARCANES_4":[2,1.0,1.001774437],"WSKF_RELIGION_4":[2,1.0,0.994343164],"WSKF_NATURE_4":[2,1.0,0.998064144],"WSKF_INVESTIGATION_4":[2,1.0,0.968367688],"A005":[3,1.12,0.984242368],"A006":[2,0.96,1.017821866],"A007":[3,1.15,0.984984479],"A008":[3,1.2,1.003924646],"A009":[2,0.94,0.975435803],"A010":[2,0.92,0.964069498],"A011":[3,1.08,0.960734589],"A012":[1,0.955,1.046978825],"A013":[2,1.06,1.017666629],"A014":[2,1.03,0.973415889],"A015":[2,0.96,1.026930427],"A016":[2,1.05,1.038675939],"A017":[2,1.03,1.017832197],"A018":[2,1.0,0.975105615],"A019":[2,1.043,1.000127091],"A020":[3,1.12,1.012701027],"A022":[2,0.995,0.970660354],"A023":[2,0.965,1.020295507],"A024":[1,0.959,0.980545184],"A025":[2,0.965,0.968230677],"A026":[2,0.965,1.037088326],"A027":[1,0.899,0.998425933],"A028":[2,0.9,1.021912684],"A029":[1,0.978,0.965921624],"A030":[2,0.965,0.954326862],"A031":[2,0.965,0.986209224],"A032":[2,0.965,0.957101593],"A034":[2,0.965,0.996517543],"A035":[3,1.05,1.022802326],"A037":[3,1.102,0.994672902],"A038":[2,0.988,0.987266795],"A039":[2,0.988,0.962188216],"A040":[2,0.988,1.01482224],"A042":[3,1.068,1.013220059],"A043":[2,0.988,0.951252335],"A044":[2,0.988,0.99521415],"A045":[2,0.988,1.035408834],"A047":[2,0.988,1.019820869],"A050":[2,1.075,0.961132893],"A051":[2,1.1,0.9904644],"A052":[2,1.063,0.954318564],"A053":[1,0.947,1.001740397],"A055":[1,0.947,0.956101221],"A058":[1,0.947,1.01104378],"A061":[3,1.12,1.043537782],"A062":[4,1.18,1.046764725],"A063":[3,1.1,1.036202187],"A064":[2,0.983,1.008199576],"A065":[3,1.1,0.981341536],"A066":[2,1.006,0.959462387],"A068":[2,1.006,0.971275488],"A071":[2,1.006,0.976040467],"A074":[5,1.2,0.984261225],"A075":[4,1.1,1.031465097],"A076":[2,1.054,0.957021752],"A077":[5,1.1,0.992914607],"A078":[3,1.024,0.956331976],"A079":[4,1.1,0.972564629],"A080":[5,1.1,1.005156867],"A081":[1,0.8,0.995459056],"A083":[2,1.075,1.014877822],"A084":[3,1.12,0.962531148],"A085":[2,0.96,0.97822755],"A086":[3,1.15,0.979627266],"A087":[3,1.2,1.004478335],"A088":[2,0.94,0.967944583],"A089":[2,0.92,1.005094663],"A090":[3,1.08,0.980114431],"A091":[2,1.06,0.971584394],"A092":[2,1.03,0.985681052],"A093":[2,0.96,0.950982376],"A094":[2,1.05,0.960572933],"A095":[2,1.03,1.040157381],"A096":[2,1.0,1.038963815],"A097":[1,0.965,0.973945967],"A098":[2,1.049,1.026553311],"A100":[3,1.12,0.998922005],"A101":[2,0.965,1.03858143],"A102":[1,0.947,0.98079771],"A103":[2,1.043,1.043616078],"A104":[2,1.043,1.034317937],"A105":[1,0.978,0.998962901],"A106":[2,0.965,0.998675307],"A107":[2,0.965,0.966202821],"A108":[2,0.9,0.953131982],"A109":[2,0.965,0.96770839],"A110":[2,0.965,1.032699808],"A112":[2,0.965,1.024818842],"A113":[1,0.971,1.022080892],"A114":[2,1.031,1.011107436],"A115":[3,1.05,0.985418785],"A116":[2,1.0,1.025407406],"A117":[2,0.988,0.993300883],"A118":[3,1.068,0.988876574],"A119":[2,0.988,0.985316715],"A120":[2,0.988,0.987006444],"A122":[2,0.988,1.002449152],"A123":[2,0.988,1.009920199],"A125":[2,0.988,0.985207106],"A126":[3,1.1,1.03719964],"A127":[2,0.91,0.983455994],"A134":[2,1.087,0.984098041],"A135":[1,1.015,0.990881034],"A136":[1,0.982,0.973452952],"A137":[1,1.0,1.049107334],"A138":[1,0.965,1.044525796],"A139":[1,1.0,1.017161752],"A140":[1,1.0,1.029464243],"A141":[1,1.0,0.978835659],"A142":[1,0.965,1.040214969],"A143":[1,1.0,1.003320619],"A144":[1,0.965,1.022791371],"A145":[3,1.18,0.972928793],"A146":[2,1.06,1.022014729],"A147":[2,1.03,0.96243934],"A148":[1,0.965,1.011257969],"A149":[2,1.0,0.952306952],"A150":[1,0.931,0.988247788],"A151":[2,1.0,0.979001321],"A152":[2,1.0,1.035398144],"A153":[2,1.0,0.952064658],"A154":[1,0.931,0.980854421],"A155":[2,1.0,0.995927344],"A156":[1,0.931,1.016144107],"A157":[3,1.05,1.039346413],"A158":[2,1.087,0.993151351],"A159":[2,1.06,0.967885197],"A160":[1,1.015,0.996511124],"A161":[1,0.982,0.962332751],"A162":[1,1.0,0.962428771],"A163":[1,0.965,1.024231107],"A164":[1,1.0,1.013700508],"A165":[1,1.0,0.985233399],"A166":[1,1.0,0.992612721],"A167":[1,0.965,0.977111751],"A168":[1,1.0,1.044415516],"A169":[1,0.965,0.959531351],"A170":[3,1.18,1.007496936],"A172":[3,1.078,1.029956982],"A173":[2,1.03,0.954889252],"A174":[1,0.965,1.040050007],"A175":[2,1.0,1.016254232],"A176":[1,0.931,1.018841497],"A177":[2,1.0,1.017034402],"A178":[2,1.0,0.956279844],"A179":[2,1.0,0.975104159],"A180":[1,0.931,1.016685823],"A181":[2,1.0,1.036121249],"A182":[1,0.931,0.994776771],"A186":[2,1.087,1.014621575],"A187":[2,1.06,0.951962477],"A189":[1,0.982,0.978768921],"A190":[1,1.0,1.027693123],"A192":[1,1.0,0.999817938],"A193":[1,1.0,0.976701261],"A194":[1,1.0,0.97474916],"A196":[1,1.0,0.961275185],"A198":[3,1.18,1.037232548],"A200":[3,1.078,1.034394076],"A202":[1,0.965,1.030073695],"A203":[2,1.0,0.960890267],"A205":[2,1.0,0.992224183],"A206":[2,1.0,1.038469341],"A207":[2,1.0,0.966241608],"A209":[2,1.0,0.998461221],"A214":[2,1.075,0.999771587],"A216":[2,1.15,0.990852611],"A218":[2,1.15,0.968086372],"A220":[2,1.087,0.989822477],"A222":[2,1.15,1.025512293],"A226":[2,1.15,1.047383201],"A228":[2,1.15,1.016639187],"A229":[1,0.949,1.021119963],"A231":[1,1.0,1.041864472],"A232":[1,1.0,1.031747016],"A233":[1,1.0,1.041131416],"A234":[1,1.0,1.003333349],"A235":[1,1.0,1.037662906],"A236":[1,1.0,0.965283973],"A237":[1,1.0,0.985571667],"A238":[1,1.0,0.959548454],"A242":[2,1.15,1.036416708],"A248":[3,1.15,0.961421512],"A250":[3,1.15,0.969270266],"A252":[3,1.18,0.963164642],"A254":[3,1.15,1.040531259],"A258":[3,1.15,0.998931896],"A259":[3,1.091,1.018895269],"A260":[2,1.043,0.988577363],"A262":[3,1.15,1.008661649],"A263":[1,0.916,0.951038523],"A265":[2,1.0,1.014236212],"A266":[2,1.0,0.975755295],"A267":[2,1.0,1.019588977],"A268":[2,1.0,0.989588111],"A269":[2,1.0,0.967102942],"A270":[2,1.0,0.975822882],"A271":[2,1.0,1.029814893],"A272":[2,1.0,1.013278252],"A276":[3,1.15,0.967897611],"A278":[3,1.024,1.019217089],"A288":[3,1.15,1.011674895],"A289":[2,1.15,0.967422613],"A290":[1,1.003,1.019941697],"A291":[3,1.15,0.97745991],"A292":[2,1.15,0.982209647],"A293":[3,1.15,0.973253708],"A294":[2,1.15,1.027352929],"A295":[4,1.15,0.986868257],"A296":[3,1.15,1.009641917],"A297":[2,1.006,0.971026779],"A298":[4,1.15,1.003202803],"A299":[3,1.15,0.985426687],"A300":[4,1.15,0.961335183],"A301":[3,1.15,1.0328623],"A302":[5,1.15,1.030083564],"A303":[3,1.0,1.04936952],"A304":[5,1.15,1.013210837],"A305":[5,1.15,1.011407677],"A306":[2,1.1,1.04245109],"A307":[3,1.1,0.972564206],"A308":[4,1.1,1.037836491],"A309":[5,1.1,1.030456542],"A310":[5,1.1,1.034487131],"A311":[1,1.017,1.038484406],"A312":[1,1.0,1.025657694],"A313":[1,1.0,1.037087993],"A314":[1,1.0,1.048351384],"A315":[1,1.0,0.971847267],"A316":[1,1.0,0.98964477],"A317":[1,0.993,1.005343394],"A318":[1,0.993,1.036782333],"A319":[1,0.993,0.991568039],"A320":[2,1.048,0.98077496],"A321":[2,1.0,1.035103217],"A322":[2,1.0,0.996731638],"A323":[2,1.0,0.988033035],"A324":[2,1.0,0.959188891],"A325":[2,1.0,1.004652833],"A326":[2,1.0,1.008949447],"A327":[2,1.0,0.972191463],"A328":[2,1.0,1.011496674],"A329":[1,0.993,0.980387627],"A330":[1,0.993,1.013322648],"A331":[2,1.075,0.965953007],"A332":[2,1.087,0.971837535],"A334":[1,0.993,0.978570232],"A336":[2,1.0,0.979157105],"A337":[2,1.0,0.958744112],"A338":[3,1.18,0.953795832],"A340":[2,1.0,0.969145628],"A341":[3,1.024,1.027684483],"A345":[1,0.949,0.962679216],"A346":[1,1.0,1.02652553],"A347":[1,1.0,1.039622806],"A348":[1,1.0,1.035939219],"A349":[1,1.0,0.995650951],"A350":[1,1.0,1.002092219],"A351":[1,1.0,1.035058993],"A352":[1,1.0,0.964604446],"A353":[1,1.0,0.978124937],"A356":[3,1.091,1.036587255],"A357":[2,1.043,0.969135768],"A358":[1,0.916,0.966254498],"A359":[2,1.0,1.000919559],"A360":[2,1.0,0.971708598],"A361":[2,1.0,1.047202019],"A362":[2,1.0,0.964034078],"A363":[2,1.0,1.040598538],"A364":[2,1.0,1.007833131],"A365":[2,1.0,0.952578459],"A366":[2,1.0,0.979671763],"A369":[3,1.15,0.960544945],"A370":[2,1.15,1.018324879],"A371":[3,1.15,1.047953744],"A372":[2,1.15,1.007616259],"A373":[1,1.0,1.040553239],"A374":[1,1.0,1.000599279],"A375":[1,1.0,1.031401979],"A376":[3,1.15,1.043585323],"A377":[2,1.15,0.965391071],"A378":[4,1.15,1.04959263],"A379":[3,1.15,0.969440653],"A380":[4,1.15,0.999583465],"A381":[3,1.15,0.964077177],"A382":[2,1.0,0.997829312],"A383":[2,1.0,1.03843965],"A384":[2,1.0,1.042914824],"A385":[4,1.15,1.012018461],"A386":[3,1.15,1.009003446],"A387":[5,1.15,1.029701549],"A388":[5,1.15,0.995619593],"A389":[5,1.15,0.976148548],"A470":[1,0.975,0.960180143],"A503":[1,0.947,1.01457842],"A504":[1,0.947,1.01347958],"A505":[1,0.947,1.033291911],"A507":[1,0.947,0.950169735],"A508":[1,0.947,0.957489926],"A509":[1,0.947,1.049797473],"A510":[1,0.947,0.963520181],"A511":[1,0.947,0.96104863],"A512":[1,0.947,0.994274111],"A513":[1,0.947,0.958529894],"A514":[2,1.006,0.974292669],"A515":[2,1.006,0.9505689],"A516":[2,1.006,1.023844924],"A518":[2,1.006,1.02629129],"A519":[2,1.006,1.018207009],"A520":[2,1.006,0.987481165],"A521":[2,1.006,0.986872327],"A522":[2,1.006,1.049577916],"A523":[2,1.006,1.008971829],"A524":[2,1.006,1.02129152],"A525":[1,1.0,1.026968495],"A526":[2,1.0,0.992049132],"A527":[1,1.0,0.996604017],"A528":[2,1.0,0.976800905],"A529":[1,1.0,0.959920856],"A530":[2,1.0,1.019420289],"A533":[1,1.0,0.979564047],"A534":[2,1.0,0.997725211],"A535":[1,1.0,1.001338075],"A536":[2,1.0,0.99510992],"A537":[1,1.0,0.995264376],"A538":[2,1.0,0.952677241],"A539":[1,1.0,0.982985557],"A540":[2,1.0,0.951096636],"A543":[1,1.0,0.979183861],"A544":[2,1.0,0.980104449],"A545":[1,1.0,0.978664988],"A546":[2,1.0,1.026137699],"A547":[2,0.983,0.950371102],"A548":[2,1.054,0.982822716],"A549":[3,1.024,1.046123225],"A550":[2,0.995,1.007459855],"A551":[2,0.995,1.030859256],"A552":[2,1.043,0.962803583],"A553":[2,1.043,0.970671746],"A554":[1,0.975,1.005878753],"A555":[1,0.975,0.959050014],"A556":[2,0.995,0.950434109],"A557":[2,0.995,0.96283943],"A558":[3,1.18,1.008366404],"A559":[3,1.18,1.046961062],"A560":[2,0.92,0.999351901],"A561":[2,0.92,1.040839783],"A562":[3,1.1,1.040843016],"A563":[3,1.1,1.034391655]}
};
function coiRarityFromRank(r){
  return ['Commun','Peu Commun','Inhabituel','Rare','Très Rare','Légendaire'][Math.max(0,Math.min(5,int(r,0)))]||'Commun';
}
(function applyCatalogueEconomy20261003(){
  BASES.forEach(function(b){
    var m=COI_ECONOMY_20261003.bases[b.id];
    if(!m)return;
    b.enchantDifficulty=m[1];
    b.qualityAllowed=!!m[2];
  });
  AFFIXES.forEach(function(a){
    var m=COI_ECONOMY_20261003.affixes[a.id];
    if(!m)return;
    a.power=m[0];
    a.priceCoef=m[1];
    a.priceNoise=m[2];
    a.rarity=coiRarityFromRank(a.power);
  });
})();

var BASE_BY_ID={}, AFFIX_BY_ID={}; BASES.forEach(function(x){BASE_BY_ID[x.id]=x;}); AFFIXES.forEach(function(x){AFFIX_BY_ID[x.id]=x;});
var SLOT_DEFAULTS={Torse:1,Casque:1,Bouclier:1,'Main gauche':1,Cou:1,Anneau:2,Gants:1,Ceinture:1,Dos:1,Pieds:1};
function esc(s){s=(s===undefined||s===null)?'':String(s);return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function whisperGM(x){sendChat(SCRIPT,'/w gm '+x,null,{noarchive:true});}
function whisperPlayer(msg,x){
  var p=msg&&getObj('player',msg.playerid),who=p?String(p.get('_displayname')||p.get('displayname')||''):'';
  if(!who)who=String((msg&&msg.who)||'joueur').replace(/ \(GM\)$/,'');
  who=who.replace(/"/g,'');
  sendChat(SCRIPT,'/w "'+who+'" '+x,null,{noarchive:true});
}
function say(x){sendChat(SCRIPT,x);}
function href(c){return esc(c).replace(/@/g,'&#64;').replace(/\{/g,'&#123;').replace(/\}/g,'&#125;').replace(/\|/g,'&#124;');}
function btn(t,c,col){return '<a style="display:inline-block;background:'+(col||'#654321')+';color:#fff;padding:4px 7px;margin:2px;border-radius:4px;text-decoration:none;font-weight:bold" href="'+href(c)+'">'+esc(t)+'</a>';}
function attrObj(cid,n){var a=findObjs({_type:'attribute',_characterid:cid,name:n});return a&&a.length?a[0]:null;}
function getA(cid,n,d){var a=attrObj(cid,n);if(!a)return d;var v=a.get('current');return(v===undefined||v===null||v==='')?d:v;}
function setA(cid,n,v,worker){var a=attrObj(cid,n);if(!a){a=createObj('attribute',{characterid:cid,name:n,current:v});if(worker&&a&&a.setWithWorker)a.setWithWorker({current:v});return a;} if(worker&&a.setWithWorker)a.setWithWorker({current:v});else a.set('current',v);return a;}
function int(v,d){var n=parseInt(v,10);return isNaN(n)?d:n;}
function rowId(){var ch='-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz',now=Date.now(),t=new Array(8),i;for(i=7;i>=0;i--){t[i]=ch.charAt(now%64);now=Math.floor(now/64);}var id=t.join('');for(i=0;i<12;i++)id+=ch.charAt(Math.floor(Math.random()*64));return id.replace(/_/g,'Z');}
function nextLabel(cid,n){var x=int(getA(cid,n,0),0)+1;setA(cid,n,x,false);return x;}
function parseFlag(s,f){var m=s.match(new RegExp('(?:^|\\s)--'+f+'\\s+(\\S+)','i'));return m?m[1]:null;}
function hasFlag(s,f){return new RegExp('(?:^|\\s)--'+f+'(?:\\s|$)','i').test(s);}
function ensureTokenAction(cid){var a=findObjs({_type:'ability',_characterid:cid,name:'Afficher objet'});if(a&&a.length){a[0].set({action:'!coi-show --character @{character_id}',istokenaction:true});return;}createObj('ability',{characterid:cid,name:'Afficher objet',action:'!coi-show --character @{character_id}',istokenaction:true});}
function removeObjectTokenAction(cid){(findObjs({_type:'ability',_characterid:cid,name:'Afficher objet'})||[]).forEach(function(a){a.remove();});}
function syncObjectTokenAction(cid){
  var t=String(getA(cid,'type_personnage','')).toUpperCase(),cat=String(getA(cid,'objet_categorie','')).toLowerCase();
  if((t===OBJET_TYPE||t===CONSUMABLE_TYPE)&&cat!=='hebergement')ensureTokenAction(cid);
  else removeObjectTokenAction(cid);
}
function isItem(cid){var t=String(getA(cid,'type_personnage','')).toUpperCase();return t===OBJET_TYPE||t===CONSUMABLE_TYPE;}
function dexMaxFromText(text){var m=String(text||'').match(/DEX\s*max\s*\+?([0-9]+)/i);return m?parseInt(m[1],10):'';}
function joinNonEmpty(a,sep){return a.filter(function(x){return x&&String(x).trim();}).join(sep||'\n');}
function categoryLabel(c){return {arme:'⚔ Arme',armure:'🛡 Armure / bouclier',accessoire:'💍 Accessoire',consommable:'🧪 Consommable',divers:'🎒 Matériel',hebergement:'🏨 Hébergement'}[String(c).toLowerCase()]||c;}
function syncCatalogBaseStats(cid){
  var bid=String(getA(cid,'objet_base_id','')||''),b=BASE_BY_ID[bid];
  if(!b)return;
  if(b.category==='arme'){
    setA(cid,'objet_arme_atkdiv',int(b.weaponAttackBonus,0),false);
    setA(cid,'objet_arme_dmdiv',int(b.weaponDmBonus,0),false);
  }else if(b.category==='armure'){
    setA(cid,'objet_bonusarmure',int(b.armorBonus,0),false);
  }
}
function itemData(cid,knownItem){
  var c=getObj('character',cid);if(!c||(!knownItem&&!isItem(cid)))return null;
  var attrs=findObjs({_type:'attribute',_characterid:cid})||[],byName={};
  attrs.forEach(function(a){byName[a.get('name')]=a;});
  function read(n,d){var a=byName[n];if(!a)return d;var v=a.get('current');return(v===undefined||v===null||v==='')?d:v;}
  var t=String(read('type_personnage','')).toUpperCase();
  if(t!==OBJET_TYPE&&t!==CONSUMABLE_TYPE)return null;
  var cat=String(read('objet_categorie','')).toLowerCase();
  if(!cat)cat=t===CONSUMABLE_TYPE?'consommable':'accessoire';
  if(t===CONSUMABLE_TYPE)cat='consommable';
  var baseName=read('objet_nom_base','')||c.get('name')||'Objet sans nom';
  var variantName=read('objet_nom_variante','');
  var quality=Math.max(0,Math.min(5,int(read('objet_qualite',0),0)));
  var baseId=String(read('objet_base_id','')||''),catalogBase=BASE_BY_ID[baseId]||null;
  var baseArmorBonus=(catalogBase&&catalogBase.category==='armure')?int(catalogBase.armorBonus,0):int(read('objet_bonusarmure',0),0);
  var baseArmorMalus=int(read('objet_malusarmure',0),0);
  var baseWeaponAttackBonus=(catalogBase&&catalogBase.category==='arme')?int(catalogBase.weaponAttackBonus,0):int(read('objet_arme_atkdiv',0),0);
  var baseWeaponDmBonus=(catalogBase&&catalogBase.category==='arme')?int(catalogBase.weaponDmBonus,0):int(read('objet_arme_dmdiv',0),0);
  var effectiveArmorBonus=baseArmorBonus,effectiveArmorMalus=baseArmorMalus,effectiveWeaponAttackBonus=baseWeaponAttackBonus,effectiveWeaponDmBonus=baseWeaponDmBonus;
  if(cat==='arme'){effectiveWeaponAttackBonus+=quality;effectiveWeaponDmBonus+=quality;}
  if(cat==='armure')effectiveArmorBonus+=quality;
  var fallbackMode='',weaponAttack=read('objet_arme_atk','contact'),slot=read('objet_emplacement','Autre');
  if(catalogBase&&catalogBase.affixModeDefault)fallbackMode=catalogBase.affixModeDefault;
  else if(cat==='arme')fallbackMode=(weaponAttack==='distance'?'distance':(weaponAttack==='magie'?'magique':'cac'));
  else if(cat==='armure')fallbackMode=(slot==='Bouclier'?'bouclier':armorFamily({slot:slot,name:baseName}));
  else if(cat==='accessoire'&&slot==='Main gauche')fallbackMode='main_gauche_magique';
  var affixMode=String(read('objet_affixe_mode',fallbackMode)||fallbackMode);
  return {id:cid,name:variantName||c.get('name')||baseName,journalName:c.get('name')||baseName,baseName:baseName,category:cat,slot:slot,rarity:read('objet_rarete',''),price:read('objet_prix',''),description:read('objet_description',''),baseId:baseId,affixMode:affixMode,affixes:read('objet_affixes',''),affixSummary:read('objet_affixes_resume',''),quality:quality,predicates:joinNonEmpty([read('objet_predicats_auto',''),read('objet_predicats','')]),armorBonus:effectiveArmorBonus,armorMalus:effectiveArmorMalus,armorBonusBase:baseArmorBonus,armorMalusBase:baseArmorMalus,dexMax:read('objet_dex_max',''),weaponType:read('objet_arme_typeattaque','Arme 1 main'),weaponAttack:weaponAttack,weaponAttackBonus:effectiveWeaponAttackBonus,weaponAttackBonusBase:baseWeaponAttackBonus,weaponCrit:read('objet_arme_crit',20),weaponDmNb:read('objet_arme_dmnbde',1),weaponDmDie:read('objet_arme_dmde',6),weaponDmCar:read('objet_arme_dmcar','FOR'),weaponDmBonus:effectiveWeaponDmBonus,weaponDmBonusBase:baseWeaponDmBonus,weaponRange:read('objet_arme_portee',''),weaponDamageType:read('objet_arme_typedegats','tranchant'),weaponModifiers:read('objet_arme_modificateurs',''),weaponOptions:joinNonEmpty([read('objet_arme_options_auto',''),read('objet_arme_options','')],' '),weaponSpecial:joinNonEmpty([read('objet_arme_special',''),read('objet_special_auto','')]),consumableType:read('objet_consommable_type','Potion'),consumableEffectText:read('objet_consommable_effet_texte',''),consumableEffect:read('objet_consommable_effet',''),consumableDefaultQty:Math.max(1,int(read('objet_consommable_qte_don',1),1)),usage:read('objet_usage',''),actions:JSON.stringify(readObjectActions(cid,false,attrs,byName))};
}

function catalogueRawPricePA(raw){
  if(raw===undefined||raw===null)return NaN;
  if(typeof raw==='number')return isFinite(raw)&&raw>=0?raw:NaN;
  var txt=String(raw).trim().toLowerCase().replace(/\u00a0/g,' ').replace(/,/g,'.');
  if(!txt||txt==='—'||txt==='-'||txt.indexOf('variable')>=0||txt.indexOf('voir ')===0)return NaN;
  var m=txt.match(/(-?\d+(?:\.\d+)?)\s*(pp|po|pa|pc)?/i);
  if(!m)return NaN;
  var n=parseFloat(m[1]);if(!isFinite(n)||n<0)return NaN;
  var u=(m[2]||'pa').toLowerCase();
  if(u==='pp')n*=10000;else if(u==='po')n*=100;else if(u==='pc')n/=100;
  return n;
}
function catalogueCommercialRoundPA(v){
  v=Number(v);if(!isFinite(v))return NaN;
  var step=v<100?1:(v<1000?5:10);
  return Math.round(v/step)*step;
}
function catalogueSpecPricePA(base,spec){
  spec=spec||{};if(!base)return NaN;
  if(base.category==='consommable')return NaN;
  var bm=COI_ECONOMY_20261003.bases[base.id],
      basePA=bm?Number(bm[0]):catalogueRawPricePA(base.price),
      difficulty=bm?Number(bm[1]):Number(base.enchantDifficulty||1),
      quality=Math.max(0,Math.min(5,int(spec.quality,0))),
      ids=Array.isArray(spec.affixes)?spec.affixes:[],
      total=basePA,qCost=0;
  if(!isFinite(basePA))return NaN;
  if(quality>0){
    qCost=COI_ECONOMY_20261003.qPA[quality]*Math.pow(Math.max(basePA,0.01)/COI_ECONOMY_20261003.qualityReferenceBasePA,COI_ECONOMY_20261003.qualityMaterialExponent);
    total+=qCost;
  }
  ids.forEach(function(id){
    var a=AFFIX_BY_ID[id],m=COI_ECONOMY_20261003.affixes[id];
    if(!a&&!m)return;
    var p=m?int(m[0],0):int(a.power,0),
        coef=m?Number(m[1]):Number(a.priceCoef||1),
        noise=m?Number(m[2]):Number(a.priceNoise||1);
    if(p<1||p>5)return;
    total+=COI_ECONOMY_20261003.pPA[p]*difficulty*coef*noise;
  });
  return catalogueCommercialRoundPA(total);
}
function catalogueSpecRank(spec){
  spec=spec||{};var r=Math.max(0,Math.min(5,int(spec.quality,0)));
  (Array.isArray(spec.affixes)?spec.affixes:[]).forEach(function(id){
    var a=AFFIX_BY_ID[id];if(a)r=Math.max(r,Math.max(0,Math.min(5,int(a.power,0))));
  });
  return r;
}
function refreshCatalogueEconomy(cid){
  var d=itemData(cid,true),base=d&&BASE_BY_ID[d.baseId];
  if(!d||!base||base.category==='consommable')return;
  var ids=String(d.affixes||'').split(',').filter(Boolean),
      price=catalogueSpecPricePA(base,{quality:d.quality,affixes:ids}),
      rank=catalogueSpecRank({quality:d.quality,affixes:ids});
  if(isFinite(price))setA(cid,'objet_prix',price+' pa',false);
  setA(cid,'objet_rarete',coiRarityFromRank(rank),false);
}

function itemCard(d,buttons){
  var x='<div style="border:1px solid #6f4a26;background:#fffaf2;padding:8px;border-radius:6px;max-width:330px"><div style="font-size:16px;font-weight:bold;text-align:center;color:#5b3213">'+esc(d.name)+'</div><div style="text-align:center;font-size:11px">'+esc(categoryLabel(d.category));
  if(d.category==='consommable'&&d.consumableType)x+=' — '+esc(d.consumableType);
  else if(d.slot&&d.category!=='arme'&&d.category!=='divers')x+=' — '+esc(d.slot);
  if(d.rarity)x+=' — '+esc(d.rarity); x+='</div>';
  if(d.price)x+='<div style="text-align:center;color:#765;font-size:11px">Prix : '+esc(d.price)+'</div>';
  if(d.quality>0&&(d.category==='arme'||d.category==='armure'))x+='<div style="text-align:center;color:#5b3213;font-size:11px;font-weight:bold">Qualité : +'+esc(d.quality)+'</div>';
  if(d.category==='arme')x+='<div style="margin-top:5px"><b>'+esc(d.weaponType)+'</b> · '+esc(d.weaponAttack)+' · '+esc(d.weaponDmNb)+'d'+esc(d.weaponDmDie)+(String(d.weaponDmCar).toUpperCase()==='AUCUN'?'':' + '+esc(d.weaponDmCar))+' · crit '+esc(d.weaponCrit)+'+</div>';
  if(d.category==='armure')x+='<div style="margin-top:5px">DEF/RD <b>'+esc(d.armorBonus)+'</b> · Malus <b>'+esc(d.armorMalus)+'</b></div>';
  if(d.description)x+='<div style="margin-top:6px">'+esc(d.description)+'</div>';
  if(d.category==='consommable'&&d.consumableEffectText)x+='<div style="margin-top:6px"><b>Effet :</b> '+esc(d.consumableEffectText).replace(/\n/g,'<br>')+'</div>';
  if(d.affixSummary)x+='<div style="margin-top:6px"><b>Affixes :</b><br>'+esc(d.affixSummary).replace(/\n/g,'<br>')+'</div>';
  if(d.category!=='consommable'&&d.predicates)x+='<div style="font-size:10px;margin-top:5px"><b>Prédicats :</b><br><code>'+esc(d.predicates).replace(/\n/g,'<br>')+'</code></div>';
  if(d.weaponOptions)x+='<div style="font-size:10px"><b>Options :</b> '+esc(d.weaponOptions)+'</div>';
  if(d.weaponSpecial)x+='<div style="font-size:10px"><b>À noter :</b> '+esc(d.weaponSpecial).replace(/\n/g,'<br>')+'</div>';
  if(d.category!=='consommable'){
    var shownActions=[];
    try{shownActions=JSON.parse(String(d.actions||'[]'));}catch(e){shownActions=[];}
    if(shownActions.length){
      x+='<div style="font-size:10px;margin-top:5px"><b>Actions :</b>';
      shownActions.forEach(function(a){x+='<br>• '+esc(a.name||'Action')+(a.description?' — '+esc(a.description):'');});
      x+='</div>';
    }
  }
  if(d.category==='consommable'&&!d.consumableEffect)x+='<div style="font-size:10px;color:#9a4b32;margin-top:5px"><b>Attention :</b> aucune commande d’utilisation n’est encore définie.</div>';
  if(buttons){var target='@{target|Choisir le personnage|character_id}';x+='<div style="text-align:center;margin-top:8px">';
    if(d.category==='consommable'){
      x+=btn('Donner '+d.consumableDefaultQty,'!coi-give --item '+d.id+' --target '+target+' --qty '+d.consumableDefaultQty,'#70543e');
      x+=btn('Quantité…','!coi-give --item '+d.id+' --target '+target+' --qty ?{Quantité|1}','#70543e');
      x+=btn('Quantité / chaque PJ…','!coi-give-all-pj --item '+d.id+' --qty ?{Quantité par PJ|1}','#3f6b45');
    } else {
      x+=btn('Donner','!coi-give --item '+d.id+' --target '+target,'#70543e');
      if(d.category==='arme'||d.category==='armure'||d.category==='accessoire')x+=btn('Donner + équiper','!coi-give --item '+d.id+' --target '+target+' --equip','#3f6b45');
    }
    x+=btn('Affixes','!coi-affixes --item '+d.id,'#76559a')+'</div>';
  }
  return x+'</div>';
}
function showItem(cid){var d=itemData(cid);if(!d)return whisperGM('Ce personnage n\'est pas une fiche OBJET.');ensureTokenAction(cid);say(itemCard(d,true));}
function setBaseFields(cid,b){
  var isConso=b.category==='consommable';
  var ch=getObj('character',cid), baseName=String(b.name||getA(cid,'objet_nom_base','')||(ch?ch.get('name'):'')||'Objet sans nom');
  setA(cid,'objet_nom_base',baseName,false);
  setA(cid,'objet_nom_variante','',false);
  if(ch&&ch.get('name')!==baseName)ch.set('name',baseName);
  setA(cid,'type_personnage',OBJET_TYPE,false);
  setA(cid,'objet_base_id',b.id,false); setA(cid,'objet_source',b.source,false); setA(cid,'objet_categorie',b.category,false);
  setA(cid,'objet_emplacement',b.slot||'Autre',false); setA(cid,'objet_prix',b.price||'',false); setA(cid,'objet_description',b.description||'',false); setA(cid,'objet_dex_max',b.dexMax!==undefined?b.dexMax:dexMaxFromText(b.description||''),false);
  setA(cid,'objet_rarete','',false); setA(cid,'objet_qualite',0,false); setA(cid,'objet_affixe_mode',b.affixModeDefault||'',false); setA(cid,'objet_affixes','',false); setA(cid,'objet_affixes_resume','',false); setA(cid,'objet_predicats_auto',b.predicates||'',false); setA(cid,'objet_predicats','',false); setA(cid,'objet_special_auto','',false);
  var consoCmd=(Object.prototype.hasOwnProperty.call(b,'consumableCommand'))?String(b.consumableCommand||''):inferConsumableEffect(b.name||'');
  setA(cid,'objet_consommable_effet',consoCmd,false);
  setA(cid,'objet_usage',isConso?(b.usage||''):'',false);
  if(isConso){
    var sub=String(b.subcategory||'').toLowerCase(),ct='Potion';
    if(sub.indexOf('grenade')>=0)ct='Grenade'; else if(sub.indexOf('parchemin')>=0)ct='Parchemin'; else if((b.name||'').toLowerCase().indexOf('poison')>=0)ct='Poison'; else if(sub.indexOf('dose')>=0)ct='Fiole';
    setA(cid,'objet_consommable_type',ct,false); setA(cid,'objet_consommable_qte_don',1,false);
    setA(cid,'objet_consommable_effet_texte',joinNonEmpty([b.consumableEffectText||b.description||'',b.consumableContext||'']),false);
  } else if(b.category==='arme'){
    setA(cid,'objet_arme_typeattaque',b.weaponType||'Arme 1 main',false);setA(cid,'objet_arme_atk',b.weaponAttack||'contact',false);setA(cid,'objet_arme_atkdiv',b.weaponAttackBonus||0,false);setA(cid,'objet_arme_crit',b.weaponCrit||20,false);setA(cid,'objet_arme_dmnbde',b.weaponDmNb||1,false);setA(cid,'objet_arme_dmde',b.weaponDmDie||6,false);setA(cid,'objet_arme_dmcar',b.weaponDmCar||'FOR',false);setA(cid,'objet_arme_dmdiv',b.weaponDmBonus||0,false);setA(cid,'objet_arme_portee',b.weaponRange||'',false);setA(cid,'objet_arme_typedegats',b.weaponDamageType||'tranchant',false);setA(cid,'objet_arme_modificateurs',b.weaponModifiers||'',false);setA(cid,'objet_arme_options_auto',b.weaponOptions||'',false);setA(cid,'objet_arme_options','',false);
  } else {setA(cid,'objet_bonusarmure',b.armorBonus||0,false);setA(cid,'objet_malusarmure',b.armorMalus||0,false);setA(cid,'objet_arme_options_auto','',false);}
  ensureTokenAction(cid);
}
function createFromBase(id,silent){var b=BASE_BY_ID[id];if(!b)return null;var c=createObj('character',{name:b.name});if(!c)return null;setBaseFields(c.id,b);if(!silent)whisperGM('<b>'+esc(b.name)+'</b> créé. '+btn('Ouvrir','http://journal.roll20.net/character/'+c.id,'#555')+btn('Affixes','!coi-affixes --item '+c.id,'#76559a'));return c;}
function makeBlank(name){var c=createObj('character',{name:name||'Nouvel objet'});if(!c)return null;setBaseFields(c.id,{id:'',name:name||'Nouvel objet',source:'manuel',category:'accessoire',slot:'Anneau',price:'',description:'',predicates:'',armorBonus:0,armorMalus:0});return c;}
function makeBlankConsumable(name){var c=createObj('character',{name:name||'Nouveau consommable'});if(!c)return null;setBaseFields(c.id,{id:'',name:name||'Nouveau consommable',source:'manuel',category:'consommable',subcategory:'Fiole / potion',slot:'',price:'',description:'',predicates:'',consumableCommand:''});return c;}
function inferConsumableEffect(name){var n=String(name||'').toLowerCase();if(n.indexOf('soin')>=0){if(n.indexOf('modér')>=0||n.indexOf('moder')>=0)return '!cof-soin 2d8+@{selected|niveau}';if(n.indexOf('léger')>=0||n.indexOf('leger')>=0)return '!cof-soin 1d8+@{selected|niveau}';return '!cof-soin 1d8';}if(n.indexOf('invis')>=0)return '!cof-set-state invisible true --message devient invisible';if(n.indexOf('force')>=0&&n.indexOf('géant')>=0)return '!cof-effet-temp forceDeGeant 10';if(n.indexOf('gazeuse')>=0)return '!cof-effet-temp formeGazeuse [[1d4+3]]';if(n.indexOf('fortifiant')>=0)return '!cof-fortifiant 2';if(n.indexOf('huile')>=0&&n.indexOf('instable')>=0)return '!cof-huile-instable @{target|token_id}';if(n.indexOf('résistance')>=0&&n.indexOf('feu')>=0||n.indexOf('resistance')>=0&&n.indexOf('feu')>=0)return '!cof-set-attribute resistanceA_feu true';if(n.indexOf('résistance')>=0&&n.indexOf('acide')>=0||n.indexOf('resistance')>=0&&n.indexOf('acide')>=0)return '!cof-set-attribute resistanceA_acide true';return '';}
function normText(x){return String(x||'').toLowerCase().replace(/[éèêë]/g,'e').replace(/[àâä]/g,'a').replace(/[îï]/g,'i').replace(/[ôö]/g,'o').replace(/[ùûü]/g,'u').replace(/ç/g,'c');}
function armorFamily(d){
  if(d.slot==='Bouclier')return 'bouclier';
  var n=normText(d.name);
  if(n.indexOf('cuir')>=0||n.indexOf('broigne')>=0)return 'cuir';
  if(n.indexOf('tissu')>=0||n.indexOf('fourrure')>=0||n.indexOf('matelass')>=0)return 'tissu';
  return 'maille';
}
function consumableFamily(d){
  if(String(d.usage||'').toLowerCase()==='ration')return 'ration';
  var b=BASE_BY_ID[d.baseId], n=normText(b?b.name:d.name), sub=normText(b?b.subcategory:d.consumableType);
  if(n.indexOf('poison')>=0||sub.indexOf('dose')>=0)return 'poison';
  if(sub.indexOf('grenade')>=0||n.indexOf('grenade')>=0)return 'grenade';
  if(sub.indexOf('parchemin')>=0||n.indexOf('parchemin')>=0)return 'parchemin';
  if(n.indexOf('soin')>=0)return 'soins';
  if(n.indexOf('mana')>=0)return 'mana';
  if(n.indexOf('celerite')>=0)return 'celerite';
  if(n.indexOf('caracteristique')>=0)return 'caracteristique';
  if(n.indexOf('resistance magique')>=0)return 'resmag';
  if(n.indexOf('resistance physique')>=0)return 'resphys';
  return 'potion';
}
function affixModeOptions(d){
  var b=BASE_BY_ID[d.baseId];
  if(b&&Array.isArray(b.affixModes)&&b.affixModes.length)return b.affixModes.slice();
  if(d.category==='arme')return [d.weaponAttack==='distance'?'distance':(d.weaponAttack==='magie'?'magique':'cac')];
  if(d.category==='armure')return [d.slot==='Bouclier'?'bouclier':armorFamily(d)];
  if(d.category==='accessoire')return [d.slot==='Main gauche'?'main_gauche_magique':('accessoire_'+normText(d.slot||'autre').replace(/\s+/g,'_'))];
  return [];
}
function affixModeLabel(mode){
  var labels={cac:'⚔ CAC',distance:'🏹 Distance',magique:'✨ Magique',bouclier:'🛡 Bouclier',bouclier_magique:'🛡✨ Bouclier magique',main_gauche_magique:'✨ Main gauche'};
  return labels[mode]||mode;
}
function affixFamilyLabel(key){
  var labels={combat:'Combat',critique:'Critiques',defense:'Défense',anti_creature:'Anti-familles',materiau:'Matériaux & alliages',bois:'Bois & fabrication',tir:'Tir',capacite:'Capacités',magie:'Magie',canalisation:'Canalisations',sorts_mana:'Sorts & mana',protection:'Protection',mobilite:'Mobilité',etat:'États & immunités',pouvoir:'Pouvoirs',caracteristique:'Caractéristiques',competence:'Compétences',utilitaire:'Utilitaire',soins:'Soins',mana:'Mana',resistance:'Résistances',grenade:'Grenades',poison:'Poisons',parchemin:'Parchemins',potion:'Potions',special:'Spécial',divers:'Divers'};
  return labels[key]||key||'Autres';
}
function affixSectionKey(a){
  var f=String(a&&a.uiFamily||'divers');
  if(['combat','critique','defense','anti_creature','tir'].indexOf(f)>=0)return 'combat';
  if(['materiau','bois'].indexOf(f)>=0)return 'fabrication';
  if(['magie','canalisation','sorts_mana','mana','pouvoir','capacite'].indexOf(f)>=0)return 'magie';
  if(['protection','resistance','etat'].indexOf(f)>=0)return 'protection';
  if(['mobilite','competence','caracteristique','utilitaire'].indexOf(f)>=0)return 'personnage';
  if(['soins','grenade','poison','parchemin','potion'].indexOf(f)>=0)return 'consommables';
  return 'divers';
}
function affixSectionLabel(k){
  var m={combat:'⚔ Combat',fabrication:'⚒ Matériaux & fabrication',magie:'✨ Magie & pouvoirs',protection:'🛡 Protection',personnage:'🧭 Personnage & utilitaire',consommables:'🧪 Consommables',divers:'📦 Divers'};
  return m[k]||k;
}
function affixSupportLabel(a){
  if(!a)return '';
  var s=String(a.subcategory||a.support||'').replace(/^Armes de mêlée$/,'Mêlée').replace(/^Armes à distance$/,'Distance').replace(/^Armes magiques$/,'Focus magique');
  return s;
}

function affixDisplayName(a){
  return a ? String(a.displayName || a.name || '').trim() : '';
}
function affixCanonicalDamageType(t){
  t=normText(t).replace(/[^a-z0-9]+/g,'');
  var aliases={
    froid:'eau',electrique:'air',sonique:'air',acide:'terre',
    necrotique:'ombre',radiant:'lumiere',arcane:'force',
    poison:'toxique',maladie:'toxique',mental:'psychique'
  };
  return aliases[t]||t;
}
function affixResistanceMagnitude(a){
  var s=String(a&&a.predicates||''),m=s.match(/bonus_RD::[^:;,\s]+:([+-]?\d+)/i);
  if(m)return parseInt(m[1],10);
  s=String(a&&a.fieldPatch||'');
  m=s.match(/rdTemp_[^\s]+[^\n]*--valeur\s+([+-]?\d+)/i);
  if(m)return parseInt(m[1],10);
  s=String(a&&a.effect||'');
  m=s.match(/\bRD\s*\+?([+-]?\d+)/i);
  return m?parseInt(m[1],10):'';
}
function affixUiVariantKey(a){
  if(!a)return '';
  if(String(a.uiFamily||'')==='resistance'&&a.damageType){
    return [
      'res',affixCanonicalDamageType(a.damageType),int(a.power,0),
      affixResistanceMagnitude(a),
      String(a.fieldPatch||'').indexOf('rdTemp_')>=0?'temp':'passif'
    ].join('|');
  }
  return [
    'std',int(a.power,0),String(a.predicates||''),String(a.weaponOptions||''),
    String(a.fieldPatch||''),String(a.mode||''),String(a.effect||'')
  ].join('|');
}
function affixUiPreferenceScore(a){
  var score=0,id=String(a&&a.id||''),sub=normText(a&&a.subcategory||''),
      cp=String(a&&a.compatProfile||'');

  if(/^ARD_(NECROTIQUE|RADIANT|ARCANE|MALADIE|MENTAL)_/.test(id))score-=100;
  if(/^AXRD_(ACIDE|FROID|ELECTRIQUE|SONIQUE|MALADIE)_/.test(id))score-=100;
  if(cp==='TOUTES_ARMURES'||sub.indexOf('tous')>=0)score-=20;

  if(cp==='TISSU'||cp==='CUIR'||cp.indexOf('MAILLE')>=0)score+=30;

  if(a&&a.category==='Objet consommable'&&/^A4(7[1-9]|8[0-6])$/.test(id))score+=20;
  return score;
}
function dedupeAffixVariants(list,current){
  var buckets={},order=[],selected={};
  (current||[]).forEach(function(id){selected[String(id)]=true;});
  (list||[]).forEach(function(a){
    var k=affixUiVariantKey(a);
    if(!buckets[k]){buckets[k]=[];order.push(k);}
    buckets[k].push(a);
  });
  return order.map(function(k){
    var arr=buckets[k].slice();
    arr.sort(function(a,b){
      var ac=selected[String(a.id)]?1:0,bc=selected[String(b.id)]?1:0;
      if(ac!==bc)return bc-ac;
      var as=affixUiPreferenceScore(a),bs=affixUiPreferenceScore(b);
      if(as!==bs)return bs-as;
      return String(a.id||'').localeCompare(String(b.id||''));
    });
    return arr[0];
  });
}
function affixEffectiveGroup(a){
  if(!a)return '';

  if(String(a.uiFamily||'')==='resistance' && a.damageType){
    return 'resistance_'+affixCanonicalDamageType(a.damageType);
  }
  if(a.uiGroup)return String(a.uiGroup);

  var autoName=String(a.displayName||a.name||'').trim();
  if(autoName){
    var autoScope=normText((a.category||'')+'_'+(a.subcategory||'')+'_'+
      (a.uiFamily||'')+'_'+autoName).replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
    if(autoScope)return 'auto_'+autoScope;
  }
  return '';
}

function affixEntryKey(a){
  var g=affixEffectiveGroup(a);
  return g ? ('g:'+g) : ('a:'+String(a&&a.id||''));
}
function countAffixEntries(list){
  var seen={},n=0;
  (list||[]).forEach(function(a){var k=affixEntryKey(a);if(!seen[k]){seen[k]=1;n++;}});
  return n;
}
function shieldAffixAllowed(a){
  var n=String(a.name||'');
  return n.indexOf('du "Classe"')===0 || n==='+DEF' || n.indexOf('RD ')===0 || n==='Bouclier runique';
}

var ACCESSORY_MATRIX_V15={
  'Anneau':{
    stats:['FOR','DEX','CON','INT','SAG','CHA'],
    skills:[],
    classCap:true, movement:true, attack:true, def:true,
    rd:'all', states:['surpris','assomme','paralyse','endormi','apeure'],
    specials:['protectrice','anticritique','seconde_chance'], consumable:false
  },
  'Cou':{
    stats:['INT','SAG','CHA'],
    skills:['Résistance','Sang-froid','Arcanes','Histoire','Religion','Nature','Investigation','Perception','Perspicacité','Médecine','Instinct','Persuasion','Intimidation','Supercherie','Représentation','Commandement'],
    classCap:true, movement:false, attack:false, def:false,
    rd:'magic', states:['surpris','affaibli','assomme','paralyse','endormi','apeure'],
    specials:['seconde_chance'], consumable:false
  },
  'Ceinture':{
    stats:['FOR','DEX','CON'],
    skills:['Athlétisme','Puissance','Protection','Endurance','Résistance','Récupération','Technique','Survie','Intimidation','Commandement'],
    classCap:false, movement:false, attack:false, def:false,
    rd:'none', states:['assomme','renverse','affaibli','etourdi','paralyse'],
    specials:[], consumable:true
  },
  'Dos':{
    stats:['CHA'],
    skills:['Acrobaties','Discrétion','Résistance','Sang-froid','Arcanes','Histoire','Religion','Nature','Investigation','Perception','Perspicacité','Survie','Médecine','Instinct','Persuasion','Intimidation','Supercherie','Représentation','Commandement'],
    classCap:false, movement:true, attack:false, def:false,
    rd:'magic', states:['surpris','apeure'], specials:[], consumable:false
  },
  'Gants':{
    stats:['FOR','DEX'],
    skills:['Athlétisme','Puissance','Acrobaties','Adresse','Arcanes','Investigation','Technique','Médecine','Intimidation','Supercherie','Représentation'],
    classCap:true, movement:false, attack:true, def:true,
    rd:'physical', states:[], specials:[], consumable:true
  },
  'Pieds':{
    stats:['DEX'],
    skills:['Athlétisme','Acrobaties','Discrétion','Adresse','Endurance','Récupération','Nature','Survie','Instinct','Représentation'],
    classCap:true, movement:true, attack:false, def:false,
    rd:'all', states:['renverse','paralyse','ralenti','immobilise'],
    specials:[], consumable:false
  },
  'Tête':{
    stats:['INT','SAG','CHA'],
    skills:['Protection','Résistance','Sang-froid','Arcanes','Histoire','Religion','Nature','Investigation','Technique','Perception','Perspicacité','Survie','Médecine','Instinct','Persuasion','Intimidation','Supercherie','Représentation','Commandement'],
    classCap:false, movement:false, attack:false, def:false,
    rd:'physical', states:['surpris','assomme','aveugle','affaibli','endormi','apeure'],
    specials:[], consumable:false
  }
};

var ARMOR_MATRIX_V15={
  tissu:{
    stats:['INT','SAG','CHA'],
    skills:['Arcanes','Religion','Histoire','Nature','Sang-froid','Résistance'],
    states:['apeure','endormi','etourdi'],
    protect:false, antiCrit:false, psi:true
  },
  cuir:{
    stats:['DEX'],
    skills:['Acrobaties','Discrétion','Adresse','Athlétisme','Survie','Perception'],
    states:['ralenti'],
    protect:false, antiCrit:false
  },
  maille:{
    stats:['FOR','CON'],
    skills:['Athlétisme','Puissance','Endurance','Résistance','Intimidation'],
    states:['renverse','etourdi'],
    protect:true, antiCrit:true
  },
  plaque:{
    stats:['CON'],
    skills:['Protection','Endurance','Résistance'],
    states:['renverse','affaibli','etourdi'],
    protect:true, antiCrit:true
  },
  bouclier:{
    stats:[],
    skills:['Protection','Résistance'],
    states:['renverse','etourdi'],
    protect:true, antiCrit:true, percuteur:true
  }
};

function matrixSkillName(a){
  if(a.matrixSkill)return String(a.matrixSkill);
  if(a.uiFamily==='competence')return String(a.name||a.displayName||'');
  return '';
}
function isPhysicalDamageType(t){
  return ['tranchant','percant','contondant'].indexOf(String(t||''))>=0;
}
function accessoryOwnStat(slot,stat){
  return AFFIXES.some(function(x){
    return x.category==='Accessoire' && String(x.subcategory||'')===slot &&
      x.uiFamily==='caracteristique' && String(x.statKey||'')===stat &&
      normText(x.name).indexOf('de base')<0 && x.catalogVisible!==false;
  });
}
function accessoryOwnSkill(slot,skill){
  return AFFIXES.some(function(x){
    return x.category==='Accessoire' && String(x.subcategory||'')===slot &&
      x.uiFamily==='competence' && normText(x.name)===normText(skill) &&
      x.catalogVisible!==false;
  });
}
function accessoryOwnResistance(slot,type){
  return AFFIXES.some(function(x){
    return x.category==='Accessoire' && String(x.subcategory||'')===slot &&
      x.uiFamily==='resistance' && String(x.damageType||'')===String(type||'') &&
      x.catalogVisible!==false;
  });
}
function canonicalAccessoryResistance(a,slot){
  var t=String(a.damageType||'');
  if(!t)return false;

  if(accessoryOwnResistance(slot,t))return String(a.subcategory||'')===slot;

  return a.matrixCanonicalResistance===true;
}
function accessoryOwnMovement(slot){
  return AFFIXES.some(function(x){
    return x.category==='Accessoire' && String(x.subcategory||'')===slot &&
      (x.uiFamily==='mobilite'||normText(x.name).indexOf('mouvement')>=0) &&
      x.catalogVisible!==false;
  });
}

function accessoryMatrixCompatible(a,d){
  var slot=d.slot==='Casque'?'Tête':d.slot;
  var m=ACCESSORY_MATRIX_V15[slot];if(!m)return false;

  if(a.uiFamily==='capacite'){
    return !!m.classCap && String(a.subcategory||'')===slot;
  }

  if(a.uiFamily==='caracteristique'&&a.statKey){
    if(normText(a.name).indexOf('de base')>=0)return false;
    if(m.stats.indexOf(String(a.statKey))<0)return false;
    if(String(a.subcategory||'')===slot)return true;
    if(a.matrixCanonical===true && !accessoryOwnStat(slot,String(a.statKey)))return true;
    return false;
  }

  var sk=matrixSkillName(a);
  if(sk){
    var allowed=m.skills.some(function(x){return normText(x)===normText(sk);});
    if(!allowed)return false;
    if(String(a.subcategory||'')===slot)return true;
    if(a.matrixCanonical===true && !accessoryOwnSkill(slot,sk))return true;
    return false;
  }

  if(a.matrixState)return m.states.indexOf(String(a.matrixState))>=0;

  if(a.matrixSpecial)return m.specials.indexOf(String(a.matrixSpecial))>=0;

  if(a.uiFamily==='resistance'&&a.damageType){
    var rdOk=false;
    if(m.rd==='all')rdOk=true;
    else if(m.rd==='magic')rdOk=!isPhysicalDamageType(a.damageType);
    else if(m.rd==='physical')rdOk=isPhysicalDamageType(a.damageType);
    if(!rdOk)return false;
    return canonicalAccessoryResistance(a,slot);
  }

  var pr=String(a.predicates||'');

  if(m.attack&&/(^|\n|:)bonusAttaque[:]/.test(pr))return String(a.subcategory||'')===slot;
  if(m.def&&/(^|\n|:)bonus_DEF[:]/.test(pr))return String(a.subcategory||'')===slot;

  if(m.movement&&(a.uiFamily==='mobilite'||normText(a.name).indexOf('mouvement')>=0||
      a.matrixCanonicalMovement===true)){
    if(String(a.subcategory||'')===slot)return true;
    if(accessoryOwnMovement(slot))return false;
    return a.matrixCanonicalMovement===true;
  }

  if(m.consumable&&a.uiFamily==='consommable')return String(a.subcategory||'')===slot;

  return false;
}
function armorMatrixKind(d){
  if(d.slot==='Bouclier')return 'bouclier';
  var cb=(d.baseId&&BASE_BY_ID[d.baseId])?BASE_BY_ID[d.baseId]:null;
  var tags=(cb&&cb.baseTags)||[];
  if(tags.indexOf('plate')>=0)return 'plaque';
  return armorFamily(d);
}
function armorMatrixCompatible(a,d){
  var kind=armorMatrixKind(d),m=ARMOR_MATRIX_V15[kind];if(!m)return false;
  if(a.matrixArmor!==true&&a.matrixSpecial===undefined)return false;
  if(a.uiFamily==='caracteristique'&&a.statKey)return m.stats.indexOf(String(a.statKey))>=0;
  var sk=matrixSkillName(a);
  if(sk)return m.skills.some(function(x){return normText(x)===normText(sk);});
  if(a.matrixState)return m.states.indexOf(String(a.matrixState))>=0;
  if(a.matrixSpecial==='protectrice_armure')return kind!=='bouclier'&&!!m.protect;
  if(a.matrixSpecial==='protectrice_bouclier')return kind==='bouclier'&&!!m.protect;
  if(a.matrixSpecial==='anticritique_armure')return !!m.antiCrit;
  if(a.matrixSpecial==='bouclier_psi_tissu')return kind==='tissu'&&!!m.psi;
  if(a.matrixSpecial==='percuteur_bouclier')return kind==='bouclier'&&!!m.percuteur;
  return false;
}
function weaponMatrixCompatible(a,d,tags){
  if(a.matrixWeaponSkill!==true)return false;
  var mode=String(d.affixMode||'');
  var sk=normText(matrixSkillName(a));
  if(mode==='magique'){
    if(a.subcategory!=='Armes magiques')return false;
    if(sk==='religion' && tags.indexOf('magic_focus')<0 && tags.indexOf('magic_focus_candidate')<0)return false;
    if(sk==='nature' && tags.indexOf('staff')<0 && tags.indexOf('magic_focus')<0 && tags.indexOf('magic_focus_candidate')<0)return false;
    return true;
  }
  if(mode==='distance'){
    if(a.subcategory!=='Armes à distance')return false;
    if(sk==='nature' && tags.indexOf('bow')<0)return false;
    if(sk==='technique' && tags.indexOf('crossbow')<0 && tags.indexOf('firearm')<0)return false;
    return true;
  }
  if(a.subcategory!=='Armes de mêlée')return false;
  if(sk==='acrobaties' && tags.indexOf('light')<0 && tags.indexOf('finesse')<0)return false;
  return true;
}

function compatible(a,d){
  if(!a||!d||a.catalogVisible===false)return false;
  if(a.audit==='EXTENSION_MINIMALE'||a.audit==='RETIRE')return false;
  var mode=String(d.affixMode||''),sub=String(a.subcategory||'');
  var cb=(d.baseId&&BASE_BY_ID[d.baseId])?BASE_BY_ID[d.baseId]:null;
  var tags=(cb&&cb.baseTags)||[];

  if(a.requiredTagsAny&&a.requiredTagsAny.length){
    var tagOk=a.requiredTagsAny.some(function(t){return tags.indexOf(t)>=0;});
    if(!tagOk)return false;
  }

  if(d.category==='arme'){
    if(a.category!=='Armes')return false;
    if(weaponMatrixCompatible(a,d,tags))return true;
    if(a.crossWeaponMode===true)return true;
    if(mode==='magique')return sub==='Armes magiques';
    if(mode==='distance')return sub==='Armes à distance';
    return sub==='Armes de mêlée';
  }

  if(d.category==='armure'){

    if(a.category==='Armure / Bouclier'&&armorMatrixCompatible(a,d))return true;

    if(d.slot==='Bouclier'){
      if(mode==='bouclier_magique'&&a.category==='Armes'&&sub==='Armes magiques'){
        return String(a.name||'').indexOf('du "Classe"')!==0;
      }
      return a.category==='Armure / Bouclier'&&normText(sub).indexOf('bouclier')>=0&&shieldAffixAllowed(a);
    }
    if(a.category!=='Armure / Bouclier')return false;
    var as=normText(sub),fam=armorFamily(d),general=as.indexOf('tous')>=0;
    if(fam==='cuir')return general||as.indexOf('cuir')>=0;
    if(fam==='tissu')return general||as.indexOf('tissu')>=0;

    var kind=armorMatrixKind(d);
    if(kind==='plaque'){
      return general||as.indexOf('plaque')>=0||as.indexOf('maille')>=0;
    }
    return general||as.indexOf('maille')>=0;
  }

  if(d.category==='accessoire'){
    if(d.slot==='Main gauche')return a.category==='Armes'&&sub==='Armes magiques';
    if(a.category!=='Accessoire')return false;

    if(accessoryMatrixCompatible(a,d))return true;

    var sl=d.slot==='Casque'?'Tête':d.slot;
    return sub===sl;
  }

  if(d.category==='consommable'){
    if(a.category!=='Objet consommable')return false;

    return COI_CANONICAL_CONSUMABLE_BASE_5056[a.id]===d.baseId;
  }
  return false;
}

var RP_STAT_FRAGMENT=Object.freeze({
  FOR:'du Titan', DEX:'du Félin', CON:'de l’Ours',
  INT:'de l’Érudit', SAG:'de l’Oracle', CHA:'du Souverain'
});
var RP_SKILL_FRAGMENT=Object.freeze({
  'athletisme':'de l’Athlète',
  'puissance':'du Colosse',
  'protection':'du Rempart',
  'acrobaties':'de l’Acrobate',
  'discretion':'des Ombres',
  'adresse':'du Virtuose',
  'endurance':'de l’Infatigable',
  'resistance':'du Cœur de fer',
  'sang-froid':'aux Nerfs d’acier',
  'recuperation':'du Second souffle',
  'arcanes':'de l’Arcaniste',
  'histoire':'des Âges anciens',
  'religion':'du Théologien',
  'nature':'du Naturaliste',
  'investigation':'de l’Enquêteur',
  'technique':'de l’Artisan',
  'perception':'du Guetteur',
  'perspicacite':'du Juge',
  'survie':'du Pisteur',
  'medecine':'du Guérisseur',
  'instinct':'du Sixième sens',
  'persuasion':'à la Voix d’argent',
  'intimidation':'du Prédateur',
  'supercherie':'du Renard',
  'representation':'du Premier rôle',
  'commandement':'du Commandant'
});
var RP_STATE_FRAGMENT=Object.freeze({
  surpris:'de Vigilance', assomme:'au Crâne de fer', renverse:'de l’Ancrage',
  aveugle:'de Vision intérieure', affaibli:'de Vitalité',
  etourdi:'de Lucidité', paralyse:'de Liberté', ralenti:'du Pas libre',
  immobilise:'des Entraves brisées', endormi:'de Veille éternelle',
  apeure:'du Cœur intrépide', encombre:'du Porteur infatigable'
});
var RP_DAMAGE_FRAGMENT=Object.freeze({
  feu:'des Braises', air:'des Vents', eau:'des Marées', terre:'de Pierre',
  nature:'du Vivant', necrotique:'du Voile funéraire', radiant:'de l’Aube',
  arcane:'de l’Arcane', froid:'du Givre', electrique:'de l’Orage',
  sonique:'du Silence', acide:'de l’Alchimiste', poison:'du Serpent',
  maladie:'de Pureté', drain:'de Vitalité', mental:'de l’Esprit scellé',
  tranchant:'des Lames', percant:'des Pointes', contondant:'du Roc'
});

function rpNormalizeKey(s){
  return normText(s||'').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
}
function stripKnownItemPrefix(s){
  s=String(s||'').trim();
  var patterns=[
    /^(?:Anneau|Bague)\s+/i,
    /^(?:Collier|Amulette)\s+/i,
    /^(?:Ceinture|Baudrier)\s+/i,
    /^(?:Cape|Manteau)\s+/i,
    /^(?:Gants|Gantelets)\s+/i,
    /^(?:Bottes|Sandales|Chausses)\s+/i,
    /^(?:Casque|Heaume|Coiffe|Diadème|Couronne|Serre-tête)\s+/i
  ];
  for(var i=0;i<patterns.length;i++)if(patterns[i].test(s))return s.replace(patterns[i],'').trim();
  return s;
}
function armorRPFragment(s){
  s=String(s||'').trim();
  if(!s)return '';
  if(/^Plaque de mithral /i.test(s))return s.replace(/^Plaque de /i,'en ');
  if(/^Plaque de mithral$/i.test(s))return 'en mithral';
  if(/^Acier /i.test(s))return 'en '+s.toLowerCase();
  if(/^Mailles d[’']/i.test(s))return s.replace(/^Mailles /i,'');
  if(/^Mailles de /i.test(s))return s.replace(/^Mailles /i,'');
  if(/^Plaques /i.test(s))return 'à '+s.charAt(0).toLowerCase()+s.slice(1);
  if(/^Laine de /i.test(s))return 'en '+s.charAt(0).toLowerCase()+s.slice(1);
  if(/^Tissu /i.test(s))return s.replace(/^Tissu /i,'');
  if(/^Cuir /i.test(s))return s.replace(/^Cuir /i,'');
  if(/^Robe /i.test(s))return s.replace(/^Robe /i,'');
  if(/^Armure /i.test(s))return s.replace(/^Armure /i,'');
  return s;
}
function antiCreatureRPForType(type){
  type=String(type||'').trim();
  if(!type)return '';
  var found='';
  AFFIXES.some(function(a){
    if(a.uiFamily!=='anti_creature'||a.name==='traitement double')return false;
    var wo=String(a.weaponOptions||'');
    var m=wo.match(/typeCible\s+([^\s]+)/);
    if(m&&m[1]===type){
      found=String(a.example||a.name||'').trim().replace(/^en\s+/i,'');
      return true;
    }
    return false;
  });
  return found||type.replace(/_/g,' ');
}
function antiCreatureQuery(label){
  var seen={},opts=[];
  AFFIXES.forEach(function(a){
    if(a.uiFamily!=='anti_creature'||a.name==='traitement double')return;
    var m=String(a.weaponOptions||'').match(/typeCible\s+([^\s]+)/);
    if(!m||seen[m[1]])return;
    seen[m[1]]=true;
    var mat=String(a.example||a.name||'').trim().replace(/^en\s+/i,'');
    opts.push({type:m[1],label:(mat?mat+' — ':'')+m[1].replace(/_/g,' ')});
  });
  opts.sort(function(a,b){return a.label.localeCompare(b.label);});
  return '?{'+label+'|'+opts.map(function(o){return o.label+','+o.type;}).join('|')+'}';
}
function affixConfig(cid,a,key){
  return String(getA(cid,'objet_affixe_cfg_'+a.id+'_'+key,'')||'').trim();
}
function classRankFromAffix(a){
  var n=String(a&&a.name||'');
  var m=n.match(/\b(Novice|Adepte|Vétéran|Maître|Légendaire)\b/i);
  return m?m[1]:'';
}
function rpAffixFragment(cid,a,category){
  if(!a)return '';

  if(a.name==='traitement double'){
    var t1=affixConfig(cid,a,'type1'),t2=affixConfig(cid,a,'type2');
    if(t1&&t2){
      var r1=antiCreatureRPForType(t1),r2=antiCreatureRPForType(t2);
      return 'en '+r1+' et '+r2;
    }
    return 'à double traitement';
  }
  if(String(a.name||'').indexOf('"Classe"')>=0){
    var cl=affixConfig(cid,a,'classe'),rank=classRankFromAffix(a);
    return cl?('du '+cl+(rank?' '+rank:'')):'d’héritage de classe';
  }

  if(a.statKey && RP_STAT_FRAGMENT[String(a.statKey)])return RP_STAT_FRAGMENT[String(a.statKey)];
  if(a.matrixSkill){
    var sk=rpNormalizeKey(a.matrixSkill);
    if(RP_SKILL_FRAGMENT[sk])return RP_SKILL_FRAGMENT[sk];
  }
  if(a.matrixState && RP_STATE_FRAGMENT[String(a.matrixState)])return RP_STATE_FRAGMENT[String(a.matrixState)];
  if(a.matrixCanonicalResistance && RP_DAMAGE_FRAGMENT[String(a.damageType||'')])
    return RP_DAMAGE_FRAGMENT[String(a.damageType||'')];
  if(a.matrixCanonicalMovement)return 'du Voyageur';

  var rp=String(a.example||a.name||'').trim();
  if(!rp)return '';

  if(category==='arme'){
    if(/^tir sûr/i.test(rp))return 'de '+rp.toLowerCase();
    return rp;
  }

  if(category==='accessoire'){
    var stripped=stripKnownItemPrefix(rp);
    var nk=rpNormalizeKey(a.name);
    if(/^.+ en plus$/i.test(String(a.name||'')) && a.statKey && RP_STAT_FRAGMENT[a.statKey])
      return RP_STAT_FRAGMENT[a.statKey];
    if(a.uiFamily==='competence'){
      var ck=rpNormalizeKey(a.matrixSkill||a.name);
      if(RP_SKILL_FRAGMENT[ck])return RP_SKILL_FRAGMENT[ck];
    }
    return stripped;
  }

  if(category==='armure')return armorRPFragment(rp);
  return rp;
}
function rpAffixName(a){return a?String(a.example||a.name||'').trim():'';}

function displayMagicPlus(quality,ids){
  var p=Math.max(0,int(quality,0));
  (ids||[]).forEach(function(id){
    var a=AFFIX_BY_ID[id];
    if(a)p=Math.max(p,int(a.power,0));
  });
  return p;
}
function appendMagicPlus(name,p){
  name=String(name||'').replace(/\s+\+\d+\s*$/,'').trim();
  return p>0?(name+' +'+p):name;
}
function affixAddExtraFlags(a){
  if(!a)return '';
  var extra='';
  if(a.name==='traitement double'){
    extra+=' --type1 '+antiCreatureQuery('Premier traitement')+
           ' --type2 '+antiCreatureQuery('Second traitement');
  }
  if(String(a.name||'').indexOf('"Classe"')>=0){
    extra+=' --classe ?{Classe ou profil}';
  }

  if(!a.auto){
    extra+=' --commande ?{Commande COFantasy / ability (optionnel)|}' +
           ' --predicat ?{Prédicat passif (optionnel)|}';
  }
  return extra;
}
function resolvedAffixWeaponOptions(cid,a){
  var wo=String(a&&a.weaponOptions||'');
  if(!wo)return '';
  if(a.name==='traitement double'){
    var t1=affixConfig(cid,a,'type1'),t2=affixConfig(cid,a,'type2');
    if(!t1||!t2)return '';
    return wo.replace(/\{TYPE1\}/g,t1).replace(/\{TYPE2\}/g,t2);
  }
  return wo;
}

function pickNameAffix(cid,ids){
  ids=ids||[];
  var stored=String(getA(cid,'objet_affixe_nom_id','')||'');
  if(stored&&ids.indexOf(stored)>=0&&AFFIX_BY_ID[stored])return stored;
  if(!ids.length){setA(cid,'objet_affixe_nom_id','',false);return '';}
  var best=ids[0],bestPower=int(AFFIX_BY_ID[best]&&AFFIX_BY_ID[best].power,0);
  ids.forEach(function(id){var a=AFFIX_BY_ID[id],p=int(a&&a.power,0);if(p>=bestPower){best=id;bestPower=p;}});
  setA(cid,'objet_affixe_nom_id',best,false);
  return best;
}
function itemDisplayName(cid,baseName,quality,ids,category,nameAffixId){
  var base=String(baseName||'Objet').trim(),name=base;
  ids=ids||[];
  var plus=displayMagicPlus(quality,ids);

  if(category==='consommable'){
    var ca=AFFIX_BY_ID[nameAffixId]||AFFIX_BY_ID[ids&&ids[0]];
    var full=ca?String(ca.example||ca.name||base).trim():base;
    return appendMagicPlus(full,plus);
  }
  if(!ids.length)return appendMagicPlus(name,plus).replace(/\s+/g,' ').trim();

  if(category==='arme'){
    var parts=[];
    ids.forEach(function(id){
      var a=AFFIX_BY_ID[id],rp=rpAffixFragment(cid,a,category);
      if(rp&&parts.indexOf(rp)<0)parts.push(rp);
    });
    if(parts.length)name+=' '+parts.join(' ');
    return appendMagicPlus(name,plus).replace(/\s+/g,' ').trim();
  }

  var primary=AFFIX_BY_ID[nameAffixId]||AFFIX_BY_ID[ids[0]];
  var rp=rpAffixFragment(cid,primary,category);
  if(rp)name+=' '+rp;
  return appendMagicPlus(name,plus).replace(/\s+/g,' ').trim();
}

function objectActionRows(cid,attrs){
  attrs=attrs||findObjs({_type:'attribute',_characterid:cid})||[];
  var rows={};
  attrs.forEach(function(a){
    var m=/^(repeating_objetactions_([^_]+)_)(objet_action_id|objet_action_auto|objet_action_nom|objet_action_description|objet_action_source|objet_action_commande_auto|objet_action_commande|objet_action_commande_effective)$/.exec(String(a.get('name')||''));
    if(!m)return;
    var p=m[1];
    rows[p]=rows[p]||{prefix:p,rowId:m[2]};
    rows[p][m[3]]=a.get('current');
  });
  return rows;
}
function objectActionEffectiveCommand(row){
  return String((row&&row.objet_action_commande)||'').trim() ||
         String((row&&row.objet_action_commande_auto)||'').trim();
}
function readObjectActions(cid,includeIncomplete,attrs,byName){
  if(!cid)return[];
  if(attrs){
    byName=byName||{};
    if(!Object.keys(byName).length)attrs.forEach(function(a){byName[a.get('name')]=a;});
    var typeAttr=byName.type_personnage,t=String(typeAttr?typeAttr.get('current'):'').toUpperCase();
    if(t!==OBJET_TYPE&&t!==CONSUMABLE_TYPE)return[];
    var actionOn=byName.objet_action_on,v=actionOn?actionOn.get('current'):'0';
    if(String(v||'0')!=='1'&&!includeIncomplete)return[];
  }else{
    if(!isItem(cid))return[];
    if(String(getA(cid,'objet_action_on','0'))!=='1'&&!includeIncomplete)return[];
  }
  var rows=objectActionRows(cid,attrs),out=[];
  Object.keys(rows).forEach(function(p){
    var r=rows[p],cmd=objectActionEffectiveCommand(r);
    var name=String(r.objet_action_nom||'').trim();
    if(!includeIncomplete&&!cmd)return;
    if(!name&&!cmd)return;
    out.push({id:String(r.objet_action_id||('MANUAL_'+r.rowId)),name:name||'Action d’objet',description:String(r.objet_action_description||''),source:String(r.objet_action_source||''),command:cmd,generatedCommand:String(r.objet_action_commande_auto||''),customCommand:String(r.objet_action_commande||''),auto:String(r.objet_action_auto||'')==='1',rowId:r.rowId});
  });
  return out;
}
function syncObjectActionFlag(cid){
  if(!cid||!isItem(cid))return;
  var rows=objectActionRows(cid),has=false;
  Object.keys(rows).forEach(function(p){
    var r=rows[p];
    if(String(r.objet_action_nom||'').trim()||String(r.objet_action_commande_auto||'').trim()||String(r.objet_action_commande||'').trim())has=true;
    var effective=objectActionEffectiveCommand(r);
    if(String(r.objet_action_commande_effective||'')!==effective)setA(cid,p+'objet_action_commande_effective',effective,false);
  });
  var a=attrObj(cid,'objet_action_on');
  if(has&&!a)setA(cid,'objet_action_on','1',false);
}
function syncGeneratedObjectActions(cid,actions){
  actions=actions||[];
  var rows=objectActionRows(cid),byId={};
  Object.keys(rows).forEach(function(p){
    var r=rows[p],id=String(r.objet_action_id||'');
    if(id)byId[id]=r;
  });
  var wanted={};
  actions.forEach(function(a){
    if(!a||!a.id)return;
    var id=String(a.id),r=byId[id],p;
    wanted[id]=true;
    if(r)p=r.prefix;
    else p='repeating_objetactions_'+rowId()+'_';
    setA(cid,p+'objet_action_id',id,false);
    setA(cid,p+'objet_action_auto','1',false);
    setA(cid,p+'objet_action_nom',a.name||'Action d’objet',false);
    setA(cid,p+'objet_action_description',a.description||'',false);
    setA(cid,p+'objet_action_source',a.source||a.name||id,false);
    setA(cid,p+'objet_action_commande_auto',a.command||'',false);
    var custom=String(getA(cid,p+'objet_action_commande','')||'').trim();
    setA(cid,p+'objet_action_commande_effective',custom||String(a.command||'').trim(),false);
  });
  Object.keys(rows).forEach(function(p){
    var r=rows[p],id=String(r.objet_action_id||'');
    if(String(r.objet_action_auto||'')!=='1'||wanted[id])return;
    (findObjs({_type:'attribute',_characterid:cid})||[]).forEach(function(x){
      if(String(x.get('name')||'').indexOf(p)===0)x.remove();
    });
  });
  setA(cid,'objet_actions_auto',JSON.stringify(actions),false);
  if(actions.length>0)setA(cid,'objet_action_on','1',false);
  syncObjectActionFlag(cid);
}
function migrateObjectActionRows(){
  var n=0;
  (findObjs({_type:'character'})||[]).forEach(function(ch){
    var cid=ch.id;if(!isItem(cid))return;
    var rows=objectActionRows(cid);
    if(Object.keys(rows).length){syncObjectActionFlag(cid);return;}
    var raw=String(getA(cid,'objet_actions_auto','')||'').trim();
    if(!raw||raw==='[]')return;
    var list;
    try{list=JSON.parse(raw);}catch(e){return;}
    if(!Array.isArray(list)||!list.length)return;
    syncGeneratedObjectActions(cid,list.map(function(a){
      return{id:a.id||('LEGACY_'+rowId()),name:a.name||'Action d’objet',description:a.description||'',source:a.source||a.name||'Action',command:a.command||''};
    }));
    n++;
  });
  return n;
}

function rebuildAffixes(cid,options){
  options=options||{};
  if(!options.skipBaseSync)syncCatalogBaseStats(cid);
  var d=itemData(cid),ids=String(getA(cid,'objet_affixes','')).split(',').filter(Boolean),pred=[],opts=[],notes=[],summ=[],cmds=[],actions=[];
  var base=BASE_BY_ID[d.baseId];
  var mal=base&&base.armorMalus!==undefined?int(base.armorMalus,0):int(getA(cid,'objet_malusarmure',0),0);
  var dmcar=base&&base.weaponDmCar?base.weaponDmCar:getA(cid,'objet_arme_dmcar','FOR');
  var quality=Math.max(0,Math.min(5,int(getA(cid,'objet_qualite',0),0)));
  ids.forEach(function(id){
    var a=AFFIX_BY_ID[id];if(!a)return;
    summ.push(a.name+' — '+a.effect);
    if(a.auto){
      if(d.category!=='consommable'&&a.predicates)pred.push(a.predicates);
      if(a.weaponOptions){var rwo=resolvedAffixWeaponOptions(cid,a);if(rwo)opts.push(rwo);}
      if(a.fieldPatch){
        var m=a.fieldPatch.match(/^malusarmure -(\d+)$/);
        if(m)mal=Math.max(0,mal-int(m[1],0));
        else if(a.fieldPatch==='armedmcar=DEX')dmcar='DEX';
        else if(a.fieldPatch==='armedmcar=FOR')dmcar='FOR';
        else if(a.fieldPatch.indexOf('!cof-')===0)cmds.push(a.fieldPatch);
      }
    } else {
      var cfgPred=String(affixConfig(cid,a,'predicat')||'').trim();
      var cfgCmd=String(affixConfig(cid,a,'commande')||'').trim();
      if(cfgPred&&d.category!=='consommable')pred.push(cfgPred);
      if(cfgCmd){
        if(d.category==='consommable')cmds.push(cfgCmd);
        else actions.push({id:a.id+'_CFG',name:a.name,description:a.effect||'',source:a.name,command:cfgCmd,undo:'SELON_COMMANDE'});
      }
    }
    if(d.category!=='consommable'&&a.actionObjects==='OUI'){
      var actionCommand=(a.fieldPatch&&a.fieldPatch.indexOf('!cof-')===0)?a.fieldPatch:'';
      actions.push({id:a.id,name:a.name,description:a.effect||'',source:a.name,command:actionCommand,undo:a.undo||''});
    }
    if(d.category==='consommable'||!a.auto||a.note){
      var cfgOk=!a.auto&&(String(affixConfig(cid,a,'commande')||'').trim()||String(affixConfig(cid,a,'predicat')||'').trim());
      notes.push(a.name+': '+a.effect+(a.auto?'':(cfgOk?' [configuré]':' [configuration requise]')));
    }
  });
  setA(cid,'objet_affixes_resume',summ.join('\n'),false);
  setA(cid,'objet_predicats_auto',pred.join('\n'),false);
  setA(cid,'objet_arme_options_auto',opts.join(' '),false);
  setA(cid,'objet_special_auto',notes.join('\n'),false);
  syncGeneratedObjectActions(cid,actions);

  if(options.doctorSafe)return;
  setA(cid,'objet_malusarmure',mal,false);
  setA(cid,'objet_arme_dmcar',dmcar,false);
  var baseName=getA(cid,'objet_nom_base','')||(base&&base.name)||d.journalName||'Objet';
  if(d.category==='consommable'){
    var chosen=ids.length===1?AFFIX_BY_ID[ids[0]]:null;
    var variantName='';
    if(chosen){
      var cn=String(chosen.example||chosen.name||'').trim();
      var nb=normText(baseName), nc=normText(cn);
      variantName=(nc.indexOf(nb)===0||/^potion |^grenade |^parchemin |^poison /i.test(cn))?cn:(baseName+' '+cn);
    }
    setA(cid,'objet_nom_variante',variantName,false);
    var cplus=displayMagicPlus(quality,ids);
    var ch=getObj('character',cid), finalName=appendMagicPlus(variantName||baseName,cplus);
    if(ch&&ch.get('name')!==finalName)ch.set('name',finalName);
    var baseText=base?(base.consumableEffectText||base.description||''):getA(cid,'objet_description','');
    var context=base?(base.consumableContext||''):' ';
    var effectText=chosen?chosen.effect:baseText;
    var txt=joinNonEmpty([effectText,context]);
    setA(cid,'objet_consommable_effet_texte',txt,false);
    if(base){
      setA(cid,'objet_consommable_effet',cmds.length?cmds[0]:(base.consumableCommand||''),false);
    } else if(cmds.length) setA(cid,'objet_consommable_effet',cmds[0],false);
  } else {
    var nameAffixId=pickNameAffix(cid,ids);
    var generated=itemDisplayName(cid,baseName,quality,ids,d.category,nameAffixId);
    setA(cid,'objet_nom_variante',generated,false);
    var ch2=getObj('character',cid);if(ch2&&ch2.get('name')!==generated)ch2.set('name',generated);
  }
  refreshCatalogueEconomy(cid);
}
function affixMenu(cid,page,family,search,group){
  var d=itemData(cid);if(!d)return whisperGM('Objet introuvable.');
  page=Math.max(1,int(page,1));family=String(family||'');search=String(search||'').trim();group=String(group||'').trim();
  var all=AFFIXES.filter(function(a){return compatible(a,d);});
  var current=String(d.affixes||'').split(',').filter(Boolean);
  var x='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:7px;max-width:360px">'+
    '<div style="font-size:14px;font-weight:bold;color:#5b3213">✨ Affixes — '+esc(d.name)+'</div>'+
    '<div style="font-size:9px;color:#765">'+countAffixEntries(all)+' choix lisibles · '+all.length+' variantes techniques compatibles.</div>';

  var modes=affixModeOptions(d);
  if(modes.length){
    x+='<div style="margin:5px 0;padding:5px;background:#f2e5d2;border-radius:4px"><b>Type :</b> ';
    modes.forEach(function(m){
      var col=m===d.affixMode?'#3f6b45':'#8b6b4a';
      var confirm=current.length?' --confirm ?{Changer de type peut retirer les affixes incompatibles. Continuer ?|Non,no|Oui,yes}':' --confirm yes';
      x+=btn(affixModeLabel(m),'!coi-affix-mode --item '+cid+' --value '+m+confirm,col);
    });
    x+='</div>';
  }

  if(d.category==='arme'||d.category==='armure'){
    x+='<div style="margin:5px 0;padding:5px;background:#f2e5d2;border-radius:4px"><b>Qualité :</b> ';
    [0,1,2,3,4,5].forEach(function(q){x+=btn(q?('+'+q):'0','!coi-quality --item '+cid+' --value '+q+(family?' --family '+family:'')+' --page '+page,q===d.quality?'#3f6b45':'#8b6b4a');});
    x+='</div>';
  }

  if(current.length){
    x+='<div style="margin:5px 0;padding:5px;background:#eef5e9;border:1px solid #cbd9c5;border-radius:4px"><b>Déjà appliqués :</b>';
    current.forEach(function(id){
      var a=AFFIX_BY_ID[id];if(!a)return;
      x+='<div style="border-top:1px solid #d8e2d2;padding:3px 0"><span style="font-size:10px"><b>P'+esc(a.power)+'</b> '+esc(affixDisplayName(a))+'</span> '+
        btn('Retirer','!coi-affix-remove --item '+cid+' --affix '+id+(family?' --family '+family:'')+(group?' --group '+group:'')+' --page '+page,'#994444')+'</div>';
    });
    x+='</div>';
  }

  x+='<div style="margin:5px 0">'+btn('🔎 Rechercher','!coi-affixes --item '+cid+' --search ?{Nom ou effet|}','#506070');
  if(group)x+=btn('◀ Famille','!coi-affixes --item '+cid+(family?' --family '+family:''),'#70543e');
  else if(family||search)x+=btn('◀ Familles','!coi-affixes --item '+cid,'#70543e');
  x+='</div>';

  if(!family&&!search&&!group){
    var secs={};
    all.forEach(function(a){var k=affixSectionKey(a);secs[k]=secs[k]||[];secs[k].push(a);});
    x+='<div style="padding-top:3px"><b>Que veux-tu améliorer ?</b><div style="margin-top:3px">';
    ['combat','fabrication','magie','protection','personnage','consommables','divers'].forEach(function(k){
      if(secs[k]&&secs[k].length)x+=btn(affixSectionLabel(k)+' ('+countAffixEntries(secs[k])+')','!coi-affixes --item '+cid+' --family section_'+k,'#76559a');
    });
    x+='</div><div style="font-size:9px;color:#765;margin-top:5px">Seuls les affixes compatibles avec cet objet sont affichés.</div>'+
      '<div style="margin-top:5px">'+btn('📚 Index complet des affixes','!coi-affix-index','#506070')+'</div></div></div>';
    return whisperGM(x);
  }

  if(family.indexOf('section_')===0&&!search&&!group){
    var sk=family.substring(8),fams={};
    all.filter(function(a){return affixSectionKey(a)===sk;}).forEach(function(a){var k=a.uiFamily||'divers';fams[k]=fams[k]||[];fams[k].push(a);});
    x+='<div style="padding-top:3px"><b>'+esc(affixSectionLabel(sk))+'</b><div style="font-size:9px;color:#765;margin-bottom:4px">Choisis une famille :</div>';
    Object.keys(fams).sort(function(a,b){return affixFamilyLabel(a).localeCompare(affixFamilyLabel(b));}).forEach(function(k){
      x+=btn(affixFamilyLabel(k)+' ('+countAffixEntries(fams[k])+')','!coi-affixes --item '+cid+' --family '+k,'#76559a');
    });
    x+='<div style="margin-top:5px">'+btn('◀ Sections','!coi-affixes --item '+cid,'#70543e')+'</div></div></div>';
    return whisperGM(x);
  }

  if((family==='canalisation'||family==='resistance'||family==='caracteristique')&&!search&&!group){
    var specialGroups={},specialOrder=[];
    var typeLabels={
      feu:'Feu',air:'Air',eau:'Eau',terre:'Terre',ombre:'Ombre',lumiere:'Lumière',
      force:'Force',toxique:'Toxique',psychique:'Psychique',nature:'Nature',drain:'Drain',
      necrotique:'Ombre',radiant:'Lumière',arcane:'Force',froid:'Eau',
      electrique:'Air',sonique:'Air',acide:'Terre',poison:'Toxique',
      maladie:'Toxique',mental:'Psychique',
      tranchant:'Tranchant',percant:'Perçant',contondant:'Contondant'
    };

    all.filter(function(a){return String(a.uiFamily||'')===family;}).forEach(function(a){
      var g=affixEffectiveGroup(a);
      if(!g)return;
      if(!specialGroups[g]){specialGroups[g]=[];specialOrder.push(g);}
      specialGroups[g].push(a);
    });

    specialOrder.sort(function(ga,gb){
      var aa=specialGroups[ga][0],bb=specialGroups[gb][0],la='',lb='';
      if(family==='canalisation'||family==='resistance'){
        la=typeLabels[String(aa.damageType||'')]||affixDisplayName(aa);
        lb=typeLabels[String(bb.damageType||'')]||affixDisplayName(bb);
      }else{
        la=affixDisplayName(aa);
        lb=affixDisplayName(bb);
      }
      return la.localeCompare(lb);
    });

    var specialTitle=family==='canalisation'?'Type de canalisation :':
      (family==='resistance'?'Type de résistance :':'Caractéristique :');
    var specialColor=family==='resistance'?'#4f6f78':(family==='caracteristique'?'#6a5a91':'#76559a');

    x+='<div style="padding-top:3px"><b>'+specialTitle+'</b><div style="margin-top:3px">';
    specialOrder.forEach(function(g){
      var arr=dedupeAffixVariants(specialGroups[g],current).sort(function(a,b){return int(a.power,0)-int(b.power,0);});
      var a=arr[0],label='';
      if(family==='canalisation'||family==='resistance'){
        label=typeLabels[String(a.damageType||'')]||affixDisplayName(a);
      }else{
        label=affixDisplayName(a);
      }
      var palierLabel=arr.length>1?' ('+arr.length+' paliers)':'';
      x+=btn(label+palierLabel,'!coi-affixes --item '+cid+' --family '+family+' --group '+g,specialColor);
    });
    x+='</div><div style="font-size:9px;color:#765;margin-top:4px">Même construction pour toutes les familles : famille → groupe → paliers.</div></div></div>';
    return whisperGM(x);
  }

  var list=all;
  if(family)list=list.filter(function(a){return String(a.uiFamily||'divers')===family;});
  if(group)list=list.filter(function(a){return affixEffectiveGroup(a)===group;});
  if(search){
    var q=normText(search);
    list=list.filter(function(a){
      return normText([a.name,a.displayName,a.effect,a.example,a.support,a.damageType,a.statKey].join(' ')).indexOf(q)>=0;
    });
  }
  list.sort(function(a,b){var p=int(a.power,0)-int(b.power,0);return p||affixDisplayName(a).localeCompare(affixDisplayName(b));});

  if(group){
    list=dedupeAffixVariants(list,current).sort(function(a,b){return int(a.power,0)-int(b.power,0);});
    var rep=list[0];
    x+='<div style="font-size:12px;font-weight:bold;margin:4px 0">'+esc(rep?affixDisplayName(rep):'Paliers')+'</div>';
    if(!list.length)x+='<div style="padding:6px;color:#765">Aucun palier disponible.</div>';
    list.forEach(function(a){
      var has=current.indexOf(a.id)>=0,tl=String(a.uiTierLabel||('P'+a.power));
      x+='<div style="border-top:1px solid #ddd;padding:5px 0">'+
        '<div><span style="display:inline-block;background:#6f4a26;color:#fff;border-radius:3px;padding:1px 4px;font-size:9px">P'+esc(a.power)+'</span> <b>'+esc(tl)+'</b></div>'+
        '<div style="font-size:10px;color:#543;margin:2px 0">'+esc(a.effect)+'</div>'+
        btn(has?'Retirer':'Ajouter','!coi-affix-'+(has?'remove':'add')+' --item '+cid+' --affix '+a.id+(family?' --family '+family:'')+' --group '+group+' --page 1',has?'#994444':'#3f6b45')+
        btn('Détails','!coi-affix-detail --item '+cid+' --affix '+a.id+(family?' --family '+family:'')+' --group '+group+' --page 1','#777')+
        '</div>';
    });
    x+='</div>';
    return whisperGM(x);
  }

  var buckets={},order=[];
  list.forEach(function(a){
    var k=affixEntryKey(a);
    if(!buckets[k]){buckets[k]=[];order.push(k);}
    buckets[k].push(a);
  });
  var entries=order.map(function(k){return dedupeAffixVariants(buckets[k],current).sort(function(a,b){return int(a.power,0)-int(b.power,0);});});
  var per=10,max=Math.max(1,Math.ceil(entries.length/per));if(page>max)page=max;
  var title=search?('Recherche : '+search):affixFamilyLabel(family);
  x+='<div style="font-size:11px;font-weight:bold;margin:4px 0">'+esc(title)+' — '+entries.length+' choix · '+page+'/'+max+'</div>';
  var slice=entries.slice((page-1)*per,page*per);
  if(!slice.length)x+='<div style="padding:6px;color:#765">Aucun affixe dans ce filtre.</div>';
  slice.forEach(function(groupList){
    var a=groupList[0],has=current.indexOf(a.id)>=0,label=affixDisplayName(a);
    if(groupList.length>1){
      var pmin=groupList[0].power,pmax=groupList[groupList.length-1].power;
      x+='<div style="border-top:1px solid #ddd;padding:5px 0">'+
        '<div><b>'+esc(label)+'</b> <span style="font-size:9px;color:#765">P'+esc(pmin)+'→P'+esc(pmax)+' · '+groupList.length+' paliers</span></div>'+
        '<div style="font-size:10px;color:#543;margin:2px 0">'+esc(groupList[0].rp||groupList[0].effect)+'</div>'+
        btn('Choisir le palier','!coi-affixes --item '+cid+(family?' --family '+family:'')+' --group '+affixEffectiveGroup(groupList[0]),'#3f6b45')+
        '</div>';
    }else{
      x+='<div style="border-top:1px solid #ddd;padding:5px 0">'+
        '<div><span style="display:inline-block;background:#6f4a26;color:#fff;border-radius:3px;padding:1px 4px;font-size:9px">P'+esc(a.power)+'</span> <b>'+esc(label)+'</b></div>'+
        '<div style="font-size:10px;color:#543;margin:2px 0">'+esc(a.effect)+'</div>'+
        btn(has?'Retirer':'Ajouter','!coi-affix-'+(has?'remove':'add')+' --item '+cid+' --affix '+a.id+(has?'':affixAddExtraFlags(a))+(family?' --family '+family:'')+' --page '+page,has?'#994444':'#3f6b45')+
        btn('Détails','!coi-affix-detail --item '+cid+' --affix '+a.id+(family?' --family '+family:'')+' --page '+page,'#777')+
        '</div>';
    }
  });
  x+='<div style="text-align:center">';
  var base='!coi-affixes --item '+cid+(family?' --family '+family:'');
  if(page>1)x+=btn('◀',base+' --page '+(page-1));
  if(page<max)x+=btn('▶',base+' --page '+(page+1));
  x+='</div></div>';
  whisperGM(x);
}

function changeQuality(msg){
  if(!playerIsGM(msg.playerid))return;
  var cid=parseFlag(msg.content,'item'),
      q=Math.max(0,Math.min(5,int(parseFlag(msg.content,'value'),0))),
      page=parseFlag(msg.content,'page')||1,
      family=parseFlag(msg.content,'family')||'',
      group=parseFlag(msg.content,'group')||'',
      d=itemData(cid);
  if(!d)return whisperGM('Objet introuvable.');
  if(d.category!=='arme'&&d.category!=='armure')return whisperGM('La qualité +N est appliquée aux armes et aux armures/boucliers.');
  setA(cid,'objet_qualite',q,false);
  rebuildAffixes(cid);
  affixMenu(cid,page,family,'',group);
}
function changeAffix(msg,add){
  if(!playerIsGM(msg.playerid))return;
  var cid=parseFlag(msg.content,'item'),aid=parseFlag(msg.content,'affix'),page=parseFlag(msg.content,'page')||1,family=parseFlag(msg.content,'family')||'',group=parseFlag(msg.content,'group')||'',d=itemData(cid),a=AFFIX_BY_ID[aid];
  if(!d||!a)return whisperGM('Objet ou affixe introuvable.');
  if(add&&!compatible(a,d))return whisperGM('Cet affixe n’est pas compatible avec ce type d’objet ou n’est pas encore pris en charge.');
  if(add&&a.name==='traitement double'){
    var type1=parseFlag(msg.content,'type1')||'',type2=parseFlag(msg.content,'type2')||'';
    if(!type1||!type2)return whisperGM('Choisis les deux traitements anti-créature.');
    setA(cid,'objet_affixe_cfg_'+a.id+'_type1',type1,false);
    setA(cid,'objet_affixe_cfg_'+a.id+'_type2',type2,false);
  }
  if(add&&String(a.name||'').indexOf('"Classe"')>=0){
    var classe=parseLongFlag(msg.content,'classe')||'';
    if(!classe)return whisperGM('Indique la classe ou le profil lié à cet affixe.');
    setA(cid,'objet_affixe_cfg_'+a.id+'_classe',classe,false);
  }
  if(add&&!a.auto){
    var commande=parseLongFlag(msg.content,'commande')||'';
    var predicat=parseLongFlag(msg.content,'predicat')||'';
    setA(cid,'objet_affixe_cfg_'+a.id+'_commande',commande,false);
    setA(cid,'objet_affixe_cfg_'+a.id+'_predicat',predicat,false);
    if(!commande&&!predicat){
      return whisperGM('Cet affixe est configurable : indique une commande/ability ou un prédicat passif.');
    }
  }
  var ids=String(getA(cid,'objet_affixes','')).split(',').filter(Boolean),i=ids.indexOf(aid);
  if(add&&d.category==='consommable'){ids=[aid];setA(cid,'objet_affixe_nom_id',aid,false);}
  else if(add&&i<0){ids.push(aid);if(!getA(cid,'objet_affixe_nom_id',''))setA(cid,'objet_affixe_nom_id',aid,false);}
  if(!add&&i>=0){ids.splice(i,1);if(getA(cid,'objet_affixe_nom_id','')===aid)setA(cid,'objet_affixe_nom_id','',false);}
  setA(cid,'objet_affixes',ids.join(','),false);
  rebuildAffixes(cid);affixMenu(cid,page,family,'');
}
function affixDetail(msg){
  if(!playerIsGM(msg.playerid))return;
  var cid=parseFlag(msg.content,'item'),aid=parseFlag(msg.content,'affix'),page=parseFlag(msg.content,'page')||1,
      family=parseFlag(msg.content,'family')||'',group=parseFlag(msg.content,'group')||'',d=itemData(cid),a=AFFIX_BY_ID[aid];
  if(!d||!a)return whisperGM('Objet ou affixe introuvable.');
  var has=String(d.affixes||'').split(',').filter(Boolean).indexOf(aid)>=0;
  var x='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:7px;max-width:340px">'+
    '<div style="font-size:13px;font-weight:bold">'+esc(affixDisplayName(a))+' <span style="font-size:9px">P'+esc(a.power)+'</span></div>'+
    (a.uiTierLabel?'<div style="font-size:10px;color:#765">'+esc(a.uiTierLabel)+'</div>':'')+
    '<div style="margin:4px 0"><b>Effet :</b> '+esc(a.effect)+'</div>';
  if(a.rp)x+='<div style="font-size:10px;color:#654;font-style:italic">'+esc(a.rp)+'</div>';
  if(a.support)x+='<div style="font-size:9px;margin-top:4px"><b>Support :</b> '+esc(a.support)+'</div>';
  if(a.note)x+='<div style="font-size:9px;color:#765;margin-top:3px">'+esc(a.note)+'</div>';
  x+=btn(has?'Retirer':'Ajouter','!coi-affix-'+(has?'remove':'add')+' --item '+cid+' --affix '+aid+(family?' --family '+family:'')+(group?' --group '+group:'')+' --page '+page,has?'#994444':'#3f6b45')+
     btn('Retour','!coi-affixes --item '+cid+(family?' --family '+family:'')+(group?' --group '+group:'')+' --page '+page,'#70543e')+'</div>';
  whisperGM(x);
}
function changeAffixMode(msg){
  if(!playerIsGM(msg.playerid))return;
  var cid=parseFlag(msg.content,'item'),value=parseFlag(msg.content,'value'),confirm=parseFlag(msg.content,'confirm'),d=itemData(cid);
  if(!d)return whisperGM('Objet introuvable.');
  var modes=affixModeOptions(d);
  if(modes.indexOf(value)<0)return whisperGM('Type d’affixes invalide pour cet objet.');
  if(confirm!=='yes')return affixMenu(cid,1,'','');
  setA(cid,'objet_affixe_mode',value,false);
  var d2=itemData(cid),ids=String(getA(cid,'objet_affixes','')).split(',').filter(Boolean),keep=[],removed=[];
  ids.forEach(function(id){var a=AFFIX_BY_ID[id];if(a&&compatible(a,d2))keep.push(id);else removed.push(id);});
  if(removed.length)setA(cid,'objet_affixes',keep.join(','),false);
  rebuildAffixes(cid);
  if(removed.length)whisperGM('<b>'+removed.length+'</b> affixe(s) incompatible(s) retiré(s) après changement de type.');
  affixMenu(cid,1,'','');
}
function setNameAffix(msg){
  if(!playerIsGM(msg.playerid))return;
  var cid=parseFlag(msg.content,'item'),aid=parseFlag(msg.content,'affix'),page=parseFlag(msg.content,'page')||1,d=itemData(cid);
  if(!d||!AFFIX_BY_ID[aid])return whisperGM('Objet ou affixe introuvable.');
  var ids=String(getA(cid,'objet_affixes','')).split(',').filter(Boolean);
  if(ids.indexOf(aid)<0)return whisperGM('Cet affixe n’est pas présent sur l’objet.');
  setA(cid,'objet_affixe_nom_id',aid,false);rebuildAffixes(cid);affixMenu(cid,page);
}
function parseLongFlag(s,f){var m=String(s||'').match(new RegExp('(?:^|\\s)--'+f+'\\s+([\\s\\S]*?)(?=\\s+--[a-zA-Z0-9_-]+(?:\\s|$)|$)','i'));return m?String(m[1]||'').trim().replace(/^[\"']|[\"']$/g,''):'';}
function baseCatalogueLine(b){
  if(b.category==='arme')return [b.weaponDmNb+'d'+b.weaponDmDie,String(b.weaponDmCar||'AUCUN'),String(b.weaponDamageType||''),String(b.weaponRange||''),String(b.price||'')].filter(Boolean).join(' · ');
  if(b.category==='armure'){var dx=b.dexMax!==undefined?b.dexMax:dexMaxFromText(b.description||'');return ['DEF +'+int(b.armorBonus,0),'Malus '+int(b.armorMalus,0),dx!==''?'DEX max +'+dx:'',String(b.price||'')].filter(Boolean).join(' · ');}
  if(b.category==='accessoire')return [String(b.slot||b.subcategory||''),String(b.price||'')].filter(Boolean).join(' · ');
  if(b.category==='consommable')return [String(b.subcategory||''),String(b.price||'')].filter(Boolean).join(' · ');
  return [String(b.subcategory||''),String(b.price||'')].filter(Boolean).join(' · ');
}
function catalogue(msg){
  var cat=parseFlag(msg.content,'cat')||'all',search=parseLongFlag(msg.content,'search'),page=Math.max(1,int(parseFlag(msg.content,'page'),1)),cats={armes:'arme',armures:'armure',accessoires:'accessoire',consommables:'consommable',divers:'divers'};
  if(cat==='all'&&!search&&!parseFlag(msg.content,'page')){
    var x='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:8px"><div style="font-size:15px;font-weight:bold;text-align:center">📚 Catalogue d\'objets</div><div style="text-align:center;font-size:10px;color:#765;margin-bottom:5px">Choisis une famille, puis crée directement la fiche OBJET correspondante.</div>'
      +btn('⚔ Armes','!coi-catalogue --cat armes')+btn('🛡 Armures / boucliers','!coi-catalogue --cat armures')+btn('💍 Accessoires','!coi-catalogue --cat accessoires')+btn('🧪 Consommables','!coi-catalogue --cat consommables')+btn('🎒 Matériel','!coi-catalogue --cat divers')+btn('🏨 Hébergements','!coi-hebergements','#4f6f70')+btn('✨ Index des affixes','!coi-affix-index','#76559a')
      +'<div style="margin-top:6px;text-align:center">'+btn('🔎 Rechercher','!coi-catalogue --search ?{Nom ou mot-clé|}','#506070')+'</div>'
      +'<hr>'+btn('Importer les 61 bases','!coi-import --cat all --confirm ?{Importer les 61 objets de base ?|Non,no|Oui,yes}','#3f6b45')
      +btn('Réparer / actualiser les objets importés','!coi-refresh-bases --confirm ?{Mettre à jour les données catalogue et recalculer les affixes ?|Non,no|Oui,yes}','#8a5a32')
      +'</div>';return whisperGM(x);
  }
  var key=cats[cat]||cat,list=BASES.filter(function(b){return key==='all'||b.category===key;});
  if(search){var q=normText(search);list=list.filter(function(b){return normText([b.name,b.subcategory,b.description,b.price].join(' ')).indexOf(q)>=0;});}
  var per=10,max=Math.max(1,Math.ceil(list.length/per));if(page>max)page=max;
  var title=search?('Recherche : '+search):cat;
  var x='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:7px"><b>Catalogue — '+esc(title)+'</b><div style="font-size:10px">'+list.length+' résultat(s) · page '+page+'/'+max+'</div>'+btn('◀ Catalogue','!coi-catalogue','#506070');
  if(!search&&cat!=='all')x+=btn('Importer cette catégorie','!coi-import --cat '+cat+' --confirm ?{Confirmer import ?|Non,no|Oui,yes}','#3f6b45');
  list.slice((page-1)*per,page*per).forEach(function(b){
    var detail=baseCatalogueLine(b),desc=b.category==='consommable'?(b.consumableEffectText||b.description):(b.description||'');if(desc.length>115)desc=desc.slice(0,112)+'…';
    x+='<div style="border-top:1px solid #ddd;padding:5px"><b>'+esc(b.name)+'</b>'+(detail?'<div style="font-size:10px;color:#5b3213"><b>'+esc(detail)+'</b></div>':'');
    if(desc)x+='<div style="font-size:9px;color:#765;margin:2px 0">'+esc(desc)+'</div>';
    x+=btn('Créer la fiche','!coi-from-base --id '+b.id,'#70543e')+'</div>';
  });
  x+='<div style="text-align:center">';var baseCmd=search?('!coi-catalogue --search '+search):('!coi-catalogue --cat '+cat);if(page>1)x+=btn('◀',baseCmd+' --page '+(page-1));if(page<max)x+=btn('▶',baseCmd+' --page '+(page+1));x+='</div></div>';whisperGM(x);
}

function affixIndex(msg){
  if(!playerIsGM(msg.playerid))return;
  var cat=parseFlag(msg.content,'cat')||'all',
      section=parseFlag(msg.content,'section')||'',
      family=parseFlag(msg.content,'family')||'',
      group=parseFlag(msg.content,'group')||'',
      search=parseLongFlag(msg.content,'search')||'',
      page=Math.max(1,int(parseFlag(msg.content,'page'),1));
  var catMap={armes:'Armes',armures:'Armure / Bouclier',accessoires:'Accessoire',consommables:'Objet consommable'};
  var list=AFFIXES.filter(function(a){
    if(!a||a.catalogVisible===false||a.audit==='EXTENSION_MINIMALE'||a.audit==='RETIRE')return false;
    return cat==='all'||a.category===catMap[cat];
  });
  if(search){
    var q=normText(search);
    list=list.filter(function(a){
      return normText([a.displayName,a.name,a.effect,a.rp,a.example,a.support,a.subcategory,a.damageType,a.statKey].join(' ')).indexOf(q)>=0;
    });
  }
  if(section)list=list.filter(function(a){return affixSectionKey(a)===section;});
  if(family)list=list.filter(function(a){return String(a.uiFamily||'divers')===family;});
  if(group)list=list.filter(function(a){return affixEffectiveGroup(a)===group;});

  var x='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:7px;max-width:380px">'+
    '<div style="font-size:15px;font-weight:bold;text-align:center;color:#5b3213">📚 Index des affixes</div>'+
    '<div style="font-size:9px;text-align:center;color:#765;margin-bottom:5px">Vue complète du catalogue pris en charge par COFantasy Items.</div>';

  if(cat==='all'&&!section&&!family&&!group&&!search){
    x+='<div><b>Type d’objet :</b><div style="margin-top:3px">'+
      btn('⚔ Armes','!coi-affix-index --cat armes','#76559a')+
      btn('🛡 Armures / boucliers','!coi-affix-index --cat armures','#76559a')+
      btn('💍 Accessoires','!coi-affix-index --cat accessoires','#76559a')+
      btn('🧪 Consommables','!coi-affix-index --cat consommables','#76559a')+
      '</div><div style="margin-top:5px">'+btn('🔎 Rechercher partout','!coi-affix-index --search ?{Nom, effet ou mot-clé|}','#506070')+
      btn('◀ Catalogue objets','!coi-catalogue','#70543e')+'</div></div></div>';
    return whisperGM(x);
  }

  x+='<div style="margin-bottom:5px">'+btn('⌂ Index','!coi-affix-index','#70543e');
  if(cat!=='all')x+=btn('🔎 Rechercher ici','!coi-affix-index --cat '+cat+' --search ?{Nom, effet ou mot-clé|}','#506070');
  else x+=btn('🔎 Nouvelle recherche','!coi-affix-index --search ?{Nom, effet ou mot-clé|}','#506070');
  x+='</div>';

  if(!section&&!family&&!group&&!search){
    var secs={};
    list.forEach(function(a){var k=affixSectionKey(a);secs[k]=secs[k]||[];secs[k].push(a);});
    x+='<b>'+esc(cat==='all'?'Tous les affixes':cat)+'</b><div style="font-size:9px;color:#765">'+countAffixEntries(list)+' entrées regroupées · '+list.length+' variantes techniques</div><div style="margin-top:4px">';
    ['combat','fabrication','magie','protection','personnage','consommables','divers'].forEach(function(k){
      if(secs[k]&&secs[k].length)x+=btn(affixSectionLabel(k)+' ('+countAffixEntries(secs[k])+')','!coi-affix-index --cat '+cat+' --section '+k,'#76559a');
    });
    x+='</div></div>'; return whisperGM(x);
  }

  if(section&&!family&&!group&&!search){
    var fams={};
    list.forEach(function(a){var k=a.uiFamily||'divers';fams[k]=fams[k]||[];fams[k].push(a);});
    x+='<b>'+esc(affixSectionLabel(section))+'</b><div style="font-size:9px;color:#765;margin-bottom:4px">Choisis une famille.</div>';
    Object.keys(fams).sort(function(a,b){return affixFamilyLabel(a).localeCompare(affixFamilyLabel(b));}).forEach(function(k){
      x+=btn(affixFamilyLabel(k)+' ('+countAffixEntries(fams[k])+')','!coi-affix-index --cat '+cat+' --section '+section+' --family '+k,'#76559a');
    });
    x+='<div style="margin-top:5px">'+btn('◀ Sections','!coi-affix-index --cat '+cat,'#70543e')+'</div></div>'; return whisperGM(x);
  }

  var entries={},order=[];
  list.forEach(function(a){
    var k=affixEntryKey(a);
    if(!entries[k]){entries[k]=[];order.push(k);}
    entries[k].push(a);
  });
  order.sort(function(ka,kb){
    var aa=entries[ka][0],bb=entries[kb][0];
    return affixDisplayName(aa).localeCompare(affixDisplayName(bb));
  });
  if(group){
    var gl=dedupeAffixVariants(list,[]).sort(function(a,b){return int(a.power,0)-int(b.power,0);});
    var rep=gl[0];
    x+='<div><b>'+esc(rep?affixDisplayName(rep):'Affixe')+'</b>';
    if(rep&&rep.rp)x+='<div style="font-size:10px;color:#654;font-style:italic;margin:3px 0">'+esc(rep.rp)+'</div>';
    gl.forEach(function(a){
      x+='<div style="border-top:1px solid #ddd;padding:5px 0"><b>'+esc(a.uiTierLabel||('P'+a.power))+'</b>'+
        '<div style="font-size:10px;color:#543">'+esc(a.effect||'')+'</div>'+
        '<div style="font-size:9px;color:#765">'+esc(affixSupportLabel(a))+'</div></div>';
    });
    x+=btn('◀ Liste','!coi-affix-index --cat '+cat+(section?' --section '+section:'')+(family?' --family '+family:'')+(search?' --search '+search:''),'#70543e')+'</div></div>';
    return whisperGM(x);
  }

  var per=12,max=Math.max(1,Math.ceil(order.length/per));if(page>max)page=max;
  x+='<div style="font-size:9px;color:#765;margin-bottom:4px">'+order.length+' affixe(s) regroupé(s) · page '+page+'/'+max+'</div>';
  order.slice((page-1)*per,page*per).forEach(function(k){
    var arr=dedupeAffixVariants(entries[k],[]).sort(function(a,b){return int(a.power,0)-int(b.power,0);}),a=arr[0],label=affixDisplayName(a);
    x+='<div style="border-top:1px solid #ddd;padding:5px 0"><b>'+esc(label)+'</b>';
    if(arr.length>1)x+=' <span style="font-size:9px;color:#765">'+arr.length+' paliers</span>';
    x+='<div style="font-size:9px;color:#654">'+esc(a.rp||a.effect||'')+'</div>'+
      '<div style="font-size:9px;color:#765">'+esc(affixSupportLabel(a))+'</div>';
    var eg=affixEffectiveGroup(a);if(eg)x+=btn('Voir les paliers','!coi-affix-index --cat '+cat+(section?' --section '+section:'')+(family?' --family '+family:'')+' --group '+eg,'#3f6b45');
    x+='</div>';
  });
  var base='!coi-affix-index --cat '+cat+(section?' --section '+section:'')+(family?' --family '+family:'')+(search?' --search '+search:'');
  x+='<div style="text-align:center;margin-top:5px">';
  if(page>1)x+=btn('◀',base+' --page '+(page-1));
  if(page<max)x+=btn('▶',base+' --page '+(page+1));
  x+='</div></div>';whisperGM(x);
}

function importBases(msg){if(!playerIsGM(msg.playerid))return;var ok=parseFlag(msg.content,'confirm');if(ok!=='yes')return whisperGM('Import annulé.');var cat=parseFlag(msg.content,'cat')||'all',map={armes:'arme',armures:'armure',accessoires:'accessoire',consommables:'consommable',divers:'divers'},key=map[cat]||cat,list=BASES.filter(function(b){return key==='all'||b.category===key;}),existing={};(findObjs({_type:'attribute',name:'objet_base_id'})||[]).forEach(function(a){if(a.get('current'))existing[a.get('current')]=true;});var n=0,skip=0;list.forEach(function(b){if(existing[b.id]){skip++;return;}if(createFromBase(b.id,true))n++;});whisperGM('<b>'+n+'</b> objets de base créés, '+skip+' déjà présents.');}
function refreshImportedBases(msg){
  if(!playerIsGM(msg.playerid))return;
  if(parseFlag(msg.content,'confirm')!=='yes')return whisperGM('Mise à jour annulée.');
  var updated=0,skipped=0;
  (findObjs({_type:'attribute',name:'objet_base_id'})||[]).forEach(function(a){
    var id=String(a.get('current')||''),b=BASE_BY_ID[id],cid=a.get('_characterid');
    if(b&&cid&&!getA(cid,'objet_affixe_mode',''))setA(cid,'objet_affixe_mode',b.affixModeDefault||'',false);
    if(!b||!cid){skipped++;return;}
    setA(cid,'objet_source',b.source||'',false);setA(cid,'objet_prix',b.price||'',false);setA(cid,'objet_description',b.description||'',false);setA(cid,'objet_categorie',b.category||'divers',false);setA(cid,'objet_usage',b.usage||'',false);setA(cid,'objet_dex_max',b.dexMax!==undefined?b.dexMax:dexMaxFromText(b.description||''),false);setA(cid,'type_personnage',OBJET_TYPE,true);
    if(b.category==='consommable'){
      setA(cid,'type_personnage',OBJET_TYPE,true);
      var sub=String(b.subcategory||'').toLowerCase(),ct='Potion';if(sub.indexOf('provision')>=0)ct='Provision';else if(sub.indexOf('grenade')>=0)ct='Grenade';else if(sub.indexOf('parchemin')>=0)ct='Parchemin';else if((b.name||'').toLowerCase().indexOf('poison')>=0)ct='Poison';else if(sub.indexOf('dose')>=0)ct='Fiole';
      setA(cid,'objet_consommable_type',ct,false);setA(cid,'objet_consommable_effet_texte',joinNonEmpty([b.consumableEffectText||b.description||'',b.consumableContext||'']),false);

    } else { setA(cid,'type_personnage',OBJET_TYPE,true); }
    rebuildAffixes(cid);ensureTokenAction(cid);updated++;
  });
  whisperGM('<b>'+updated+'</b> fiche(s) catalogue mises à jour'+(skipped?' ; '+skipped+' ignorée(s).':'')+'.');
}
function library(){var items=[];(findObjs({_type:'character'})||[]).forEach(function(c){if(isItem(c.id)){var d=itemData(c.id,true);if(d)items.push(d);}});items.sort(function(a,b){return (a.category+' '+a.name).localeCompare(b.category+' '+b.name);});var x='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:8px"><b>Compendium d\'objets</b><br>'+btn('Catalogue','!coi-catalogue','#3f6b45')+btn('+ Objet','!coi-new --name ?{Nom|Nouvel objet}','#70543e')+btn('+ Consommable','!coi-new-conso --name ?{Nom|Nouvelle potion}','#8a4f78')+btn('Hébergements','!coi-hebergements','#4f6f70')+btn('+ Hébergement','!coi-new-hebergement --name ?{Nom|Auberge confortable}','#4f6f70')+btn('💰 Partager butin','!coi-butin ?{Montant|120} ?{Monnaie|PA,PA|PO,PO|PC,PC|PP,PP}','#8a6a2f');items.slice(0,60).forEach(function(d){x+='<div style="border-top:1px solid #ddd;padding:4px"><b>'+esc(d.name)+'</b> <span style="font-size:9px">'+esc(categoryLabel(d.category))+'</span><br>'+btn('Voir','!coi-show --character '+d.id)+btn('Affixes','!coi-affixes --item '+d.id,'#76559a')+'</div>';});if(items.length>60)x+='<div>… '+(items.length-60)+' autres objets.</div>';whisperGM(x+'</div>');}
function weaponAtk(v){return v==='distance'?'@{ATKTIR}':(v==='magie'?'@{ATKMAG}':'@{ATKCAC}');}
function dmCar(v){v=String(v||'FOR').toUpperCase();return v==='AUCUN'?'0':'@{'+v+'}';}
function armorRows(cid,slot){var rows={},attrs=findObjs({_type:'attribute',_characterid:cid})||[];attrs.forEach(function(a){var m=/^(repeating_armures_[^_]+_)(typearmure|labelarmure|nomarmure|equipearmure|bonusarmure|malusarmure)$/.exec(a.get('name'));if(!m)return;rows[m[1]]=rows[m[1]]||{prefix:m[1]};rows[m[1]][m[2]]=a.get('current');});var out=[];Object.keys(rows).forEach(function(k){var r=rows[k];if(!slot||String(r.typearmure||'')===String(slot))out.push(r);});return out;}
function slotLimit(cid,slot){if(slot==='Anneau')return 2;if(['Torse','Casque','Bouclier','Main gauche','Cou','Gants','Ceinture','Dos','Pieds'].indexOf(slot)>=0)return 1;var attrs=findObjs({_type:'attribute',_characterid:cid})||[],names={};attrs.forEach(function(a){var m=/^(repeating_emplacements_[^_]+_)(nom|maxslots)$/.exec(a.get('name'));if(!m)return;names[m[1]]=names[m[1]]||{};names[m[1]][m[2]]=a.get('current');});for(var k in names)if(names[k].nom===slot)return Math.max(1,int(names[k].maxslots,1));return 1;}
function setArmorEquipped(cid,prefix,on){
  var type=getA(cid,prefix+'typearmure','Autre'),label=String(getA(cid,prefix+'labelarmure','0')),bonus=int(getA(cid,prefix+'bonusarmure',0),0),malus=int(getA(cid,prefix+'malusarmure',0),0);
  setA(cid,prefix+'equipearmure',on?'1':'0',true);
  if(type==='Torse'){
    if(on){setA(cid,'torseequipe',label,true);setA(cid,'defarmureon','1',true);setA(cid,'defarmure',bonus,true);setA(cid,'defarmuremalus',malus,true);}
    else if(String(getA(cid,'torseequipe','0'))===label){setA(cid,'torseequipe','0',true);setA(cid,'defarmureon','0',true);}
  }else if(type==='Casque'){
    if(on){setA(cid,'teteequipe',label,true);setA(cid,'casque_on','1',true);setA(cid,'casque_rd',bonus,true);setA(cid,'casque_malus',malus,true);}
    else if(String(getA(cid,'teteequipe','0'))===label){setA(cid,'teteequipe','0',true);setA(cid,'casque_on','0',true);}
  }else if(type==='Bouclier'){
    var bl='b'+label;
    if(on){setA(cid,'maingauche',bl,true);setA(cid,'typemaingauche','Bouclier',true);setA(cid,'defbouclieron','1',true);setA(cid,'defbouclier',bonus,true);setA(cid,'defboucliermalus',malus,true);}
    else if(String(getA(cid,'maingauche','0'))===bl){setA(cid,'maingauche','0',true);setA(cid,'defbouclieron','0',true);}
  }else if(type==='Main gauche'){
    var gl='g'+label;
    if(on){setA(cid,'maingauche',gl,true);setA(cid,'typemaingauche','Objet',true);setA(cid,'defbouclieron','0',true);}
    else if(String(getA(cid,'maingauche','0'))===gl){setA(cid,'maingauche','0',true);}
  }
}
function equipArmorRow(cid,prefix){var slot=getA(cid,prefix+'typearmure','Autre'),current=armorRows(cid,slot).filter(function(r){return r.prefix!==prefix&&String(r.equipearmure)==='1';}),limit=slotLimit(cid,slot);if(current.length<limit){setArmorEquipped(cid,prefix,true);return{equipped:true};}if(limit===1){var old=current[0];setArmorEquipped(cid,old.prefix,false);setArmorEquipped(cid,prefix,true);return{equipped:true,replaced:old.nomarmure||'ancien équipement'};}return{equipped:false,choice:true,current:current,limit:limit};}
function equipChoice(msg){if(!playerIsGM(msg.playerid))return;var cid=parseFlag(msg.content,'target'),np=parseFlag(msg.content,'new'),op=parseFlag(msg.content,'old');if(!cid||!np||!op)return whisperGM('Choix de remplacement invalide.');if(np.indexOf('repeating_armures_')!==0||op.indexOf('repeating_armures_')!==0)return whisperGM('Emplacement invalide.');var oldName=getA(cid,op+'nomarmure','ancien objet'),newName=getA(cid,np+'nomarmure','nouvel objet'),undoTx=COFantasyItemsUndoBridge.begin('COI : équiper '+newName,[cid],{full:true,tokens:true});setArmorEquipped(cid,op,false);setArmorEquipped(cid,np,true);COFantasyItemsUndoBridge.commit(undoTx);whisperGM('<b>'+esc(oldName)+'</b> est déséquipé ; <b>'+esc(newName)+'</b> est équipé.');}
function giveWeapon(d,cid,equip){var p='repeating_armes_'+rowId()+'_',label=String(nextLabel(cid,'max_attack_label')),v={armelabel:label,armenom:d.name,armeactionvisible:1,armetypeattaque:d.weaponType,armeatk:weaponAtk(d.weaponAttack),armeatkdiv:d.weaponAttackBonus,armecrit:d.weaponCrit,armedmnbde:d.weaponDmNb,armedmde:d.weaponDmDie,armedmcar:dmCar(d.weaponDmCar),armedmdiv:d.weaponDmBonus,armeportee:d.weaponRange,armetypedegats:d.weaponDamageType,armemodificateurs:d.weaponModifiers,armeoptions:d.weaponOptions,armespec:d.weaponSpecial||d.description,armepredicats:String(d.predicates||''),armeportable:d.predicates?1:0,armebonusoption:0,armedmtemp:'',armedegats:'{{degats=[[(@{armedmnbde}d@{armedmde}@{armedmrollmod}+[[@{armedmcar}]]+@{armedmdiv})@{division_attaque_assuree}]]}}',armepoudre:'{{poudre=}}',armereussiteauto:'{{attaqueautomatique=}}',armedmrollmod:'',armeattrollmod:'',armeattnbde:1,armeattde:'@{ETATDE}',coi_item_id:d.id,coi_actions:d.actions||'[]'};Object.keys(v).forEach(function(k){setA(cid,p+k,v[k],false);});if(equip){if(d.weaponType==='Arme gauche')setA(cid,'maingauche',label,true);else{setA(cid,'maindroite',label,true);if(d.weaponType==='Arme 2 mains')setA(cid,'maingauche','2m',true);}}return{prefix:p,label:label,equipped:!!equip};}
function giveArmor(d,cid,equip){var p='repeating_armures_'+rowId()+'_',label=nextLabel(cid,'max_armure_label'),slot=d.slot||'Autre',showDef=(slot==='Torse'||slot==='Casque'||slot==='Bouclier')?'1':'0';setA(cid,p+'labelarmure',label,false);setA(cid,p+'nomarmure',d.name,false);setA(cid,p+'typearmure',slot,false);setA(cid,p+'affichedefense',showDef,false);setA(cid,p+'bonusarmure',int(d.armorBonus,0),false);setA(cid,p+'malusarmure',int(d.armorMalus,0),false);setA(cid,p+'effetarmure',d.predicates||'',false);setA(cid,p+'equipearmure','0',false);setA(cid,p+'coi_item_id',d.id,false);setA(cid,p+'coi_actions',d.actions||'[]',false);var r={prefix:p,label:label,equipped:false};if(equip){var e=equipArmorRow(cid,p);for(var k in e)r[k]=e[k];}return r;}
function giveConsumable(d,cid,qty){
  qty=Math.max(1,int(qty,d.consumableDefaultQty||1));
  var command=String(d.consumableEffect||'').trim(),effect=command||String(d.consumableEffectText||d.description||'').trim(),usage=String(d.usage||'').trim().toLowerCase();
  var attrs=findObjs({_type:'attribute',_characterid:cid})||[],rows={};
  attrs.forEach(function(a){var m=/^(repeating_equipement_[^_]+_)(equip_nom|equip_qte|equip_effet|equip_usage|equip_item_id)$/.exec(a.get('name'));if(!m)return;rows[m[1]]=rows[m[1]]||{prefix:m[1]};rows[m[1]][m[2]]=a.get('current');if(m[2]==='equip_qte')rows[m[1]].qtyAttr=a;});
  var sameNameDifferent=false;
  for(var k in rows){
    var r=rows[k];
    if(String(r.equip_nom||'').trim().toLowerCase()!==String(d.name).trim().toLowerCase())continue;
    var sameSource=!String(r.equip_item_id||'').trim()||String(r.equip_item_id)===String(d.id);
    if(sameSource&&String(r.equip_effet||'').trim()===effect && String(r.equip_usage||'').trim().toLowerCase()===usage){
      var q=Math.max(0,int(r.equip_qte,0));setA(cid,k+'equip_qte',q+qty,false);
      if(usage)setA(cid,k+'equip_usage',usage,false);
      if(!r.equip_item_id)setA(cid,k+'equip_item_id',d.id,false);
      return{stacked:true,quantity:q+qty,effect:effect};
    }
    sameNameDifferent=true;
  }
  var rid=rowId(),p='repeating_equipement_'+rid+'_';
  setA(cid,p+'equip_nom',d.name,false);
  setA(cid,p+'equip_qte',qty,false);
  setA(cid,p+'equip_rowid',rid,false);
  setA(cid,p+'equip_effet',effect,false);setA(cid,p+'equip_usage',usage,false);setA(cid,p+'equip_item_id',d.id,false);
  return{stacked:false,quantity:qty,effect:effect,warning:sameNameDifferent?'Un consommable du même nom existe avec un effet, un usage ou une source différente : une ligne séparée a été créée.':''};
}
function giveDivers(d,cid){var old=getA(cid,'equip_div',''),line=d.name+(d.description?' — '+d.description:'');setA(cid,'equip_div',old?old+'\n'+line:line,false);}
function playerControlsToken(playerid,tok){
  if(playerIsGM(playerid))return true;
  if(!tok)return false;
  var ids=String(tok.get('controlledby')||'').split(',').filter(Boolean);
  if(ids.indexOf('all')>=0||ids.indexOf(playerid)>=0)return true;
  var cid=tok.get('represents'),ch=cid?getObj('character',cid):null;
  if(!ch)return false;
  ids=String(ch.get('controlledby')||'').split(',').filter(Boolean);
  return ids.indexOf('all')>=0||ids.indexOf(playerid)>=0;
}
function playerControlsCharacter(playerid,cid){
  if(playerIsGM(playerid))return true;
  var ch=getObj('character',cid); if(!ch)return false;
  var ids=String(ch.get('controlledby')||'').split(',').filter(Boolean);
  return ids.indexOf('all')>=0||ids.indexOf(playerid)>=0;
}
function deleteConsumable(msg){
  var cid=parseFlag(msg.content,'character'),row=parseFlag(msg.content,'row'),attrid=parseFlag(msg.content,'attr');
  var ch=getObj('character',cid),attr=inventoryQtyAttr(cid,'equipement',row,attrid);
  if(!cid||!ch||!attr)return sendChat(SCRIPT,'/w "'+esc(msg.who||'joueur')+'" Impossible de retrouver ce consommable. Réouvre la fiche puis réessaie.',null,{noarchive:true});
  if(attr.get('_characterid')!==cid)return whisperGM('Suppression refusée : le consommable n’appartient pas à cette fiche.');
  if(!playerControlsCharacter(msg.playerid,cid))return sendChat(SCRIPT,'/w "'+esc(msg.who||'joueur')+'" Tu ne contrôles pas ce personnage.',null,{noarchive:true});
  var m=/^(repeating_equipement_[^_]+_)equip_qte$/.exec(String(attr.get('name')||''));
  if(!m)return whisperGM('La ligne de consommable est introuvable.');
  var prefix=m[1], name=getA(cid,prefix+'equip_nom','Consommable');
  (findObjs({_type:'attribute',_characterid:cid})||[]).forEach(function(a){if(String(a.get('name')||'').indexOf(prefix)===0)a.remove();});
  sendChat(SCRIPT,'/w "'+esc(msg.who||'joueur')+'" <b>'+esc(name)+'</b> supprimé.',null,{noarchive:true});
}

function removeRepeatingPrefix(cid,prefix){
  (findObjs({_type:'attribute',_characterid:cid})||[]).slice().forEach(function(a){
    if(String(a.get('name')||'').indexOf(prefix)===0)a.remove();
  });
}
function repeatingPrefixByField(cid,section,field,value){
  var rx=new RegExp('^(repeating_'+section+'_[^_]+_)'+field+'$');
  var attrs=findObjs({_type:'attribute',_characterid:cid})||[];
  for(var i=0;i<attrs.length;i++){
    var m=rx.exec(String(attrs[i].get('name')||''));
    if(m&&String(attrs[i].get('current')||'')===String(value))return m[1];
  }
  return null;
}
function copyRepeatingPrefix(srcCid,srcPrefix,dstCid,dstPrefix,overrides){
  overrides=overrides||{};
  var copied={};
  (findObjs({_type:'attribute',_characterid:srcCid})||[]).forEach(function(a){
    var n=String(a.get('name')||'');if(n.indexOf(srcPrefix)!==0)return;
    var suffix=n.substring(srcPrefix.length);if(Object.prototype.hasOwnProperty.call(overrides,suffix))return;
    var na=setA(dstCid,dstPrefix+suffix,a.get('current'),false);
    if(na&&a.get('max')!==undefined&&a.get('max')!==null&&String(a.get('max'))!=='')na.set('max',a.get('max'));
    copied[suffix]=true;
  });
  Object.keys(overrides).forEach(function(k){setA(dstCid,dstPrefix+k,overrides[k],false);copied[k]=true;});
  return copied;
}
function notifyTransfer(msg,name,destination,qty){
  var prefix=qty&&qty>1?(qty+' × '):'';
  whisperPlayer(msg,'✅ <b>Transfert effectué.</b><br><b>'+prefix+esc(name)+'</b> → <b>'+esc(destination)+'</b>.');
}
function targetPJ(msg,tid){
  var tok=getObj('graphic',tid),cid=tok&&tok.get('represents'),ch=cid&&getObj('character',cid);
  if(!tok||!cid||!ch)return{error:'Le destinataire doit être un token lié à une fiche.'};
  if(String(getA(cid,'type_personnage','PJ')).toUpperCase()!=='PJ')return{error:'Le destinataire doit être une fiche PJ.'};
  return{token:tok,cid:cid,ch:ch};
}
function transferEquipment(msg,section,labelField,nameField,kind){
  var srcCid=parseFlag(msg.content,'character'),label=parseFlag(msg.content,'label'),tid=parseFlag(msg.content,'target');
  var src=getObj('character',srcCid),dst=targetPJ(msg,tid);
  if(!src||!label)return whisperGM('Échange impossible : équipement source introuvable.');
  if(dst.error)return sendChat(SCRIPT,'/w "'+esc(msg.who||'joueur')+'" '+esc(dst.error),null,{noarchive:true});
  if(srcCid===dst.cid)return sendChat(SCRIPT,'/w "'+esc(msg.who||'joueur')+'" La source et le destinataire sont identiques.',null,{noarchive:true});
  if(!playerControlsCharacter(msg.playerid,srcCid))return sendChat(SCRIPT,'/w "'+esc(msg.who||'joueur')+'" Tu ne contrôles pas le personnage source.',null,{noarchive:true});
  var prefix=repeatingPrefixByField(srcCid,section,labelField,label);
  if(!prefix)return whisperGM('Échange impossible : ligne '+esc(kind)+' introuvable. Réouvre la fiche puis réessaie.');
  var name=getA(srcCid,prefix+nameField,kind),tx=COFantasyItemsUndoBridge.begin('COI : échanger '+name,[srcCid,dst.cid],{full:true,tokens:true});
  if(section==='armes'){
    var md=String(getA(srcCid,'maindroite','')),mg=String(getA(srcCid,'maingauche',''));
    if(md===String(label)){setA(srcCid,'maindroite','0',true);if(mg==='2m')setA(srcCid,'maingauche','0',true);}
    if(mg===String(label))setA(srcCid,'maingauche','0',true);
    var np='repeating_armes_'+rowId()+'_',nl=String(nextLabel(dst.cid,'max_attack_label'));
    copyRepeatingPrefix(srcCid,prefix,dst.cid,np,{armelabel:nl});
  }else{
    if(String(getA(srcCid,prefix+'equipearmure','0'))==='1')setArmorEquipped(srcCid,prefix,false);
    var ap='repeating_armures_'+rowId()+'_',al=String(nextLabel(dst.cid,'max_armure_label'));
    copyRepeatingPrefix(srcCid,prefix,dst.cid,ap,{labelarmure:al,equipearmure:'0'});
  }
  removeRepeatingPrefix(srcCid,prefix);
  COFantasyItemsUndoBridge.commit(tx);
  notifyTransfer(msg,name,dst.ch.get('name'),1);
}
function inventorySpec(section){
  return section==='sac'?{section:'sac',qty:'sac_qte',name:'sac_nom',effect:'sac_effet',usage:'sac_usage',item:'sac_item_id',rowid:'sac_rowid'}:
    {section:'equipement',qty:'equip_qte',name:'equip_nom',effect:'equip_effet',usage:'equip_usage',item:'equip_item_id',rowid:'equip_rowid'};
}
function inventoryRowIdFromAttr(attr,section){
  if(!attr)return '';
  var sp=inventorySpec(section),rx=new RegExp('^repeating_'+sp.section+'_([^_]+)_'+sp.qty+'$'),
      m=rx.exec(String(attr.get('name')||''));
  return m?m[1]:'';
}
function inventoryQtyAttr(cid,section,row,legacyAttrId){
  var sp=inventorySpec(section),a=null;

  if(legacyAttrId){
    a=getObj('attribute',legacyAttrId);
    if(a&&a.get('_characterid')===cid&&inventoryPrefixFromAttr(a,section))return a;
  }
  row=String(row||'').trim();
  if(!row)return null;

  a=attrObj(cid,'repeating_'+sp.section+'_'+row+'_'+sp.qty);
  if(a)return a;

  var p=repeatingPrefixByField(cid,sp.section,sp.rowid,row);
  return p?attrObj(cid,p+sp.qty):null;
}
function inventoryPrefixFromAttr(attr,section){
  if(!attr)return null;var sp=inventorySpec(section),rx=new RegExp('^(repeating_'+sp.section+'_[^_]+_)'+sp.qty+'$'),m=rx.exec(String(attr.get('name')||''));return m?m[1]:null;
}
function inventoryData(cid,prefix,section){
  var sp=inventorySpec(section);return{name:String(getA(cid,prefix+sp.name,'Objet')),effect:String(getA(cid,prefix+sp.effect,'')),usage:String(getA(cid,prefix+sp.usage,'')),item:String(getA(cid,prefix+sp.item,'')),type:section==='sac'?String(getA(cid,prefix+'sac_type','materiel')):'',ceinture:section==='sac'?String(getA(cid,prefix+'sac_ceinture','')):''};
}
function beltUsed(cid){
  var n=0;(findObjs({_type:'attribute',_characterid:cid})||[]).forEach(function(a){if(/^repeating_equipement_[^_]+_equip_qte$/.test(String(a.get('name')||''))){var q=int(a.get('current'),0);if(q>0)n+=q;}});return n;
}
function beltCapacity(cid){var c=int(getA(cid,'ceinture_capacite',NaN),NaN);if(isNaN(c))c=3+Math.max(0,int(getA(cid,'ceinture_bonus_slots',0),0));return Math.max(0,c);}
function addInventory(cid,section,data,qty){
  var sp=inventorySpec(section),attrs=findObjs({_type:'attribute',_characterid:cid})||[],rows={};
  attrs.forEach(function(a){var m=new RegExp('^(repeating_'+sp.section+'_[^_]+_)('+sp.name+'|'+sp.qty+'|'+sp.effect+'|'+sp.usage+'|'+sp.item+')$').exec(String(a.get('name')||''));if(!m)return;rows[m[1]]=rows[m[1]]||{};rows[m[1]][m[2]]=a.get('current');});
  for(var p in rows){var r=rows[p];if(String(r[sp.name]||'').trim().toLowerCase()===data.name.trim().toLowerCase()&&String(r[sp.effect]||'')===data.effect&&String(r[sp.usage]||'')===data.usage&&String(r[sp.item]||'')===data.item){var q=Math.max(0,int(r[sp.qty],0));setA(cid,p+sp.qty,q+qty,false);return p;}}
  var rid=rowId(),prefix='repeating_'+sp.section+'_'+rid+'_';
  setA(cid,prefix+sp.name,data.name,false);setA(cid,prefix+sp.qty,qty,false);
  setA(cid,prefix+sp.rowid,rid,false);setA(cid,prefix+sp.effect,data.effect,false);setA(cid,prefix+sp.usage,data.usage,false);setA(cid,prefix+sp.item,data.item,false);
  if(section==='sac'){setA(cid,prefix+'sac_type',data.type||'materiel',false);if(data.ceinture)setA(cid,prefix+'sac_ceinture',data.ceinture,false);}
  return prefix;
}
function moveInventory(msg,fromSection,toSection,targeted){
  var srcCid=parseFlag(msg.content,'character'),row=parseFlag(msg.content,'row'),attrid=parseFlag(msg.content,'attr'),
      qty=Math.max(0,int(parseFlag(msg.content,'qty'),0)),src=getObj('character',srcCid),
      attr=inventoryQtyAttr(srcCid,fromSection,row,attrid);
  if(!src||!attr||attr.get('_characterid')!==srcCid)return whisperGM('Inventaire source introuvable. Réouvre la fiche puis réessaie.');
  if(!playerControlsCharacter(msg.playerid,srcCid))return sendChat(SCRIPT,'/w "'+esc(msg.who||'joueur')+'" Tu ne contrôles pas le personnage source.',null,{noarchive:true});
  var prefix=inventoryPrefixFromAttr(attr,fromSection);if(!prefix)return whisperGM('La ligne d’inventaire source est invalide.');
  var cur=Math.max(0,int(attr.get('current'),0));if(qty<1||qty>cur)return sendChat(SCRIPT,'/w "'+esc(msg.who||'joueur')+'" Quantité invalide (1 à '+cur+').',null,{noarchive:true});
  var dstCid=srcCid,dstCh=src;
  if(targeted){var dst=targetPJ(msg,parseFlag(msg.content,'target'));if(dst.error)return sendChat(SCRIPT,'/w "'+esc(msg.who||'joueur')+'" '+esc(dst.error),null,{noarchive:true});dstCid=dst.cid;dstCh=dst.ch;if(dstCid===srcCid)return sendChat(SCRIPT,'/w "'+esc(msg.who||'joueur')+'" La source et le destinataire sont identiques.',null,{noarchive:true});}
  if(toSection==='equipement'){
    var free=beltCapacity(dstCid)-beltUsed(dstCid);if(qty>free)return sendChat(SCRIPT,'/w "'+esc(msg.who||'joueur')+'" Pas assez de place à la ceinture du destinataire ('+Math.max(0,free)+' emplacement(s) libre(s)).',null,{noarchive:true});
  }
  var data=inventoryData(srcCid,prefix,fromSection),chars=srcCid===dstCid?[srcCid]:[srcCid,dstCid],tx=COFantasyItemsUndoBridge.begin('COI : déplacer '+data.name,chars,{full:true,tokens:true});
  addInventory(dstCid,toSection,data,qty);
  if(cur===qty)removeRepeatingPrefix(srcCid,prefix);else attr.set('current',cur-qty);
  COFantasyItemsUndoBridge.commit(tx);
  if(targeted) notifyTransfer(msg,data.name,dstCh.get('name'),qty);
  else whisperPlayer(msg,'✅ <b>Transfert effectué.</b><br><b>'+qty+' × '+esc(data.name)+'</b> déplacé'+(qty>1?'s':'')+' vers '+(toSection==='sac'?'le sac':'la ceinture')+'.');
}
function deleteBagItem(msg){
  var cid=parseFlag(msg.content,'character'),row=parseFlag(msg.content,'row'),attrid=parseFlag(msg.content,'attr'),
      ch=getObj('character',cid),attr=inventoryQtyAttr(cid,'sac',row,attrid);
  if(!ch||!attr||attr.get('_characterid')!==cid)return whisperGM('Objet du sac introuvable.');
  if(!playerControlsCharacter(msg.playerid,cid))return sendChat(SCRIPT,'/w "'+esc(msg.who||'joueur')+'" Tu ne contrôles pas ce personnage.',null,{noarchive:true});
  var prefix=inventoryPrefixFromAttr(attr,'sac');if(!prefix)return whisperGM('La ligne du sac est invalide.');
  var name=getA(cid,prefix+'sac_nom','Objet'),tx=COFantasyItemsUndoBridge.begin('COI : supprimer '+name,[cid],{full:true,tokens:true});removeRepeatingPrefix(cid,prefix);COFantasyItemsUndoBridge.commit(tx);
  sendChat(SCRIPT,'/w "'+esc(msg.who||'joueur')+'" <b>'+esc(name)+'</b> supprimé du sac.',null,{noarchive:true});
}
function resolveSelectedRefs(effect,cid,tid){
  return String(effect||'').replace(/@\{selected\|([^}]+)\}/g,function(all,key){
    if(key==='token_id')return tid;
    if(key==='character_id')return cid;
    if(key==='token_name'){var t=getObj('graphic',tid);return t?t.get('name'):'';}
    return getA(cid,key,0);
  });
}
function useConsumable(msg){
  var tid=parseFlag(msg.content,'target'),row=parseFlag(msg.content,'row'),attrid=parseFlag(msg.content,'attr'),tok=getObj('graphic',tid);
  if(!tok)return whisperGM('Token introuvable.');
  var cid=tok.get('represents'),attr=inventoryQtyAttr(cid,'equipement',row,attrid);
  if(!attr)return whisperGM('Consommable introuvable. Réouvre la fiche si nécessaire.');
  var acid=attr.get('_characterid');
  if(!cid||cid!==acid)return whisperGM('Le token ciblé doit représenter le personnage qui possède ce consommable.');
  if(!playerControlsToken(msg.playerid,tok))return sendChat(SCRIPT,'/w "'+esc(msg.who||'joueur')+'" Tu ne contrôles pas ce personnage.',null,{noarchive:true});
  var m=/^(repeating_equipement_[^_]+_)equip_qte$/.exec(String(attr.get('name')||''));
  if(!m)return whisperGM('La ressource ciblée n’est pas une quantité de consommable.');
  var q=int(attr.get('current'),0);
  if(q<1)return sendChat(SCRIPT,'/w "'+esc(msg.who||'joueur')+'" Ce consommable est épuisé.',null,{noarchive:true});
  var effect=String(getA(cid,m[1]+'equip_effet','')||'').trim();
  if(!effect){attr.set('current',q-1);return sendChat(SCRIPT,'Le consommable est utilisé, mais aucun effet n’est défini.');}

  if(effect.indexOf('!cof-stabiliser-blessure')===0){
    var victim=parseFlag(msg.content,'victim');
    if(!victim){
      var stableRow=row||inventoryRowIdFromAttr(attr,'equipement'),
          choose='!coi-use-conso --target '+tid+' --row '+stableRow+' --victim @{target|token_id|PJ inconscient}';
      return sendChat(SCRIPT,'/w "'+esc(msg.who||'joueur')+'" '+btn('Choisir le PJ à stabiliser',choose,'#8b1e1e'),null,{noarchive:true});
    }
    return sendChat('player|'+msg.playerid,'!cof-stabiliser-blessure '+victim+' --decrAttribute '+inventoryAttributeId(attr));
  }
  if(effect.indexOf('!cof-')!==0){
    attr.set('current',q-1);
    return sendChat(SCRIPT,'<b>'+esc(getA(cid,m[1]+'equip_nom','Consommable'))+'</b> : '+esc(effect));
  }
  var cmd=resolveSelectedRefs(effect,cid,tid);
  if(cmd.indexOf('!cof-soin ')===0){
    var amount=cmd.substring('!cof-soin '.length).trim();
    cmd='!cof-soin '+tid+' '+tid+' '+amount;
  } else if(cmd.indexOf(' --target ')<0) cmd+=' --target '+tid;
  if(cmd.indexOf(' --decrAttribute ')<0)cmd+=' --decrAttribute '+inventoryAttributeId(attr);
  sendChat('player|'+msg.playerid,cmd);
}
function giveDirect(iid,tid,equip,qty,options){
  options=options||{};
  syncCatalogBaseStats(iid);
  var d=itemData(iid),t=getObj('character',tid),r,undoTx=null;
  if(!d)return{ok:false,error:'Objet introuvable.'};
  if(!t)return{ok:false,error:'Cible invalide : cible un token lié à un PJ.'};
  if(String(getA(tid,'type_personnage','PJ')).toUpperCase()!=='PJ')return{ok:false,error:'La cible doit être une fiche PJ.'};

  if(d.category==='hebergement')return{ok:false,error:'Un hébergement ne se donne pas comme équipement. Utilise le menu Hébergements / Repos.'};

  if(options.undo!==false){
    undoTx=COFantasyItemsUndoBridge.begin('COI : donner '+d.name,[tid],{full:true,tokens:true});
  }

  if(d.category==='arme')r=giveWeapon(d,tid,equip);
  else if(d.category==='armure'||d.category==='accessoire')r=giveArmor(d,tid,equip);
  else if(d.category==='consommable')r=giveConsumable(d,tid,qty);
  else if(d.category==='divers'&&options.structuredDivers){
    qty=Math.max(1,int(qty,1));
    r={prefix:addInventory(tid,'sac',{name:d.name,effect:d.description||'',usage:'',item:d.id,type:'materiel'},qty),quantity:qty,structured:true};
  }else{giveDivers(d,tid);r={};}

  if(options.undo!==false)COFantasyItemsUndoBridge.commit(undoTx);

  var msgOut='<b>'+esc(d.name)+'</b> → <b>'+esc(t.get('name'))+'</b>';
  if(d.category==='consommable'){
    msgOut+=' ×'+r.quantity+(r.stacked?' (ajouté à la pile existante)':'');
    if(!r.effect)msgOut+='<br><span style="color:#9a4b32">Aucune commande d’utilisation : renseigne la vue OBJET > Consommable pour qu’il apparaisse correctement dans !cof-consommables.</span>';
    if(r.warning)msgOut+='<br>'+esc(r.warning);
  }else if(equip&&r&&r.equipped){
    msgOut+=' (équipé)';
    if(r.replaced)msgOut+='<br>'+esc(r.replaced)+' a été automatiquement déséquipé.';
  }else if(equip&&r&&r.choice){
    msgOut+='<br><b>Emplacement '+esc(d.slot)+' complet.</b> Choisis l’objet à remplacer :<br>';
    r.current.forEach(function(old){
      msgOut+=btn('Remplacer '+(old.nomarmure||'objet'),'!coi-equip-choice --target '+tid+' --new '+r.prefix+' --old '+old.prefix,'#8a4f3d');
    });
  }

  if(options.whisper!==false)whisperGM(msgOut);
  return{ok:true,data:d,target:t,result:r,message:msgOut};
}

function allPJCharacters(){
  return (findObjs({_type:'character'})||[]).filter(function(ch){
    if(!ch)return false;
    if(String(getA(ch.id,'type_personnage','')).toUpperCase()!=='PJ')return false;
    var archived=ch.get('archived');
    return !(archived===true||String(archived).toLowerCase()==='true');
  }).sort(function(a,b){
    return String(a.get('name')||'').localeCompare(String(b.get('name')||''));
  });
}
function giveConsumableToAllPJ(msg){
  if(!playerIsGM(msg.playerid))return;
  var iid=parseFlag(msg.content,'item');
  syncCatalogBaseStats(iid);
  var d=itemData(iid);
  if(!d)return whisperGM('Objet introuvable.');
  if(d.category!=='consommable')return whisperGM('La distribution par PJ est réservée aux consommables.');

  var qty=Math.max(1,int(parseFlag(msg.content,'qty'),d.consumableDefaultQty||1));
  if(!COFantasyRest||typeof COFantasyRest.partyInfo!=='function')
    return whisperGM('Pont de partage du groupe indisponible.');

  COFantasyRest.partyInfo(function(info){
    var ids=(info&&info.main)||[];
    if(!ids.length)return whisperGM('Aucun PJ principal dans l’Équipe PJ.');

    var undoTx=COFantasyItemsUndoBridge.begin(
      'COI : distribuer '+d.name+' ×'+qty+' à chaque PJ',
      ids,
      {full:true,tokens:true}
    );

    var ok=[],errors=[];
    ids.forEach(function(cid){
      var ch=getObj('character',cid);
      var res=giveDirect(iid,cid,false,qty,{undo:false,whisper:false});
      if(res&&res.ok){
        ok.push({
          name:String(ch?ch.get('name'):'PJ'),
          stacked:!!(res.result&&res.result.stacked)
        });
      }else{
        errors.push({
          name:String(ch?ch.get('name'):'PJ'),
          error:(res&&res.error)||'Erreur inconnue'
        });
      }
    });

    if(undoTx)COFantasyItemsUndoBridge.commit(undoTx);

    var out='<div style="border:1px solid #70543e;background:#fffaf2;padding:7px">'+
      '<div style="font-weight:bold;font-size:13px">Distribution : '+esc(d.name)+'</div>'+
      '<div><b>'+qty+'</b> par PJ · <b>'+ok.length+'</b> personnage'+(ok.length>1?'s':'')+'</div>'+
      '<div style="font-size:9px;color:#765">Source : '+esc((info&&info.handoutName)||'Equipe PJ')+'</div>';

    if(ok.length){
      out+='<div style="margin-top:5px;font-size:10px">';
      ok.forEach(function(r){
        out+='• '+esc(r.name)+' → ×'+qty+(r.stacked?' (pile complétée)':'')+'<br>';
      });
      out+='</div>';
    }
    if(errors.length){
      out+='<div style="margin-top:5px;color:#9a4b32"><b>Non distribués :</b><br>';
      errors.forEach(function(r){out+='• '+esc(r.name)+' — '+esc(r.error)+'<br>';});
      out+='</div>';
    }
    out+='<div style="font-size:9px;color:#765;margin-top:5px">Un seul !cof-undo annule toute cette distribution.</div></div>';
    whisperGM(out);
  });
}

function externalSpecCanonicalConfig(config){
  var out={},src=config&&typeof config==='object'?config:{};
  Object.keys(src).sort().forEach(function(id){
    var row=src[id]&&typeof src[id]==='object'?src[id]:{},clean={};
    Object.keys(row).sort().forEach(function(k){clean[k]=row[k];});
    out[id]=clean;
  });
  return out;
}
function externalSpecFingerprint(spec){
  var n=normalizePublicSpec(spec),a=n.affixes.slice().sort();
  return 'COIEXT1|'+JSON.stringify({base:n.base,quality:n.quality,affixes:a,mode:n.mode,name:n.name,price:n.price,rarity:n.rarity,config:externalSpecCanonicalConfig(n.config)});
}
function findExternalSpecItem(fingerprint){
  var attrs=findObjs({_type:'attribute',name:'coi_external_spec'})||[],i,a,cid;
  for(i=0;i<attrs.length;i++){
    a=attrs[i];if(String(a.get('current')||'')!==fingerprint)continue;
    cid=a.get('_characterid');if(cid&&isItem(cid)&&getObj('character',cid))return cid;
  }
  return'';
}
function getOrCreateExternalSpec(spec){
  var v=validatePublicSpec(spec),fp,cid,r;
  if(!v.ok)return{ok:false,errors:v.errors,warnings:v.warnings||[]};
  fp=externalSpecFingerprint(v.spec);cid=findExternalSpecItem(fp);
  if(cid)return{ok:true,itemId:cid,data:itemData(cid,true),spec:v.spec,reused:true,warnings:v.warnings||[]};
  r=createFromPublicSpec(v.spec,{archive:true,ownerTag:'coi-give-spec'});
  if(!r.ok)return r;
  setA(r.itemId,'coi_external_spec',fp,false);
  r.reused=false;
  return r;
}
function decodeExternalSpecPayload(raw){
  if(!raw)return{ok:false,error:'Données --data absentes.'};
  try{
    var decoded=decodeURIComponent(String(raw)),data=JSON.parse(decoded);
    return{ok:true,data:data};
  }catch(e){return{ok:false,error:'Données --data invalides : '+e.message};}
}
function externalTargetCharacter(raw){
  var id=String(raw||''),ch=getObj('character',id),tok;
  if(ch)return ch;
  tok=getObj('graphic',id);
  if(tok&&tok.get('represents'))return getObj('character',tok.get('represents'));
  return null;
}
function giveSpec(msg){
  if(!playerIsGM(msg.playerid))return;
  var targetRaw=parseFlag(msg.content,'target'),target=externalTargetCharacter(targetRaw),parsed=decodeExternalSpecPayload(parseFlag(msg.content,'data'));
  if(!target)return whisperGM('Cible invalide. Utilise une fiche PJ ou un token lié à un PJ.');
  if(String(getA(target.id,'type_personnage','PJ')).toUpperCase()!=='PJ')return whisperGM('La cible de !coi-give-spec doit être un PJ.');
  if(!parsed.ok)return whisperGM(parsed.error);
  var payload=parsed.data,items=Array.isArray(payload)?payload:(payload&&Array.isArray(payload.items)?payload.items:[payload]);
  if(!items.length)return whisperGM('La commande ne contient aucun objet.');
  if(items.length>50)return whisperGM('Commande refusée : maximum 50 lignes par import.');

  var prepared=[],errors=[],warnings=[];
  items.forEach(function(entry,index){
    entry=entry&&typeof entry==='object'?entry:{};
    var qty=Math.max(1,Math.min(100,int(entry.qty,1))),res=getOrCreateExternalSpec(entry);
    if(!res.ok){errors.push('Ligne '+(index+1)+' : '+(res.errors||['spec invalide']).join(' / '));return;}
    (res.warnings||[]).forEach(function(w){warnings.push('Ligne '+(index+1)+' : '+w);});
    prepared.push({entry:entry,qty:qty,itemId:res.itemId,data:res.data});
  });
  if(errors.length)return whisperGM('<b>Commande Alaric refusée.</b><br>'+errors.map(esc).join('<br>'));

  var tx=COFantasyItemsUndoBridge.begin('COI : commande externe vers '+target.get('name'),[target.id],{full:true,tokens:true}),given=[],failed=[];
  prepared.forEach(function(p){
    var d=p.data||itemData(p.itemId,true),r,i;
    if(!d){failed.push('Objet source introuvable : '+p.itemId);return;}
    if(d.category==='consommable'||d.category==='divers'){
      r=giveDirect(p.itemId,target.id,false,p.qty,{undo:false,whisper:false,structuredDivers:true});
      if(r&&r.ok)given.push({name:d.name,qty:p.qty});else failed.push((r&&r.error)||d.name);
      return;
    }
    for(i=0;i<p.qty;i++){
      r=giveDirect(p.itemId,target.id,false,1,{undo:false,whisper:false,structuredDivers:true});
      if(!r||!r.ok){failed.push((r&&r.error)||d.name);break;}
    }
    if(i>0)given.push({name:d.name,qty:i});
  });
  if(tx)COFantasyItemsUndoBridge.commit(tx);

  var out='<div style="border:1px solid #70543e;background:#fffaf2;padding:7px"><b>Commande externe → '+esc(target.get('name'))+'</b><br>';
  given.forEach(function(g){out+='✓ '+esc(g.name)+(g.qty>1?' ×'+g.qty:'')+'<br>';});
  if(warnings.length)out+='<span style="color:#8a6b21">'+warnings.map(esc).join('<br>')+'</span><br>';
  if(failed.length)out+='<span style="color:#9a4b32">Échec : '+failed.map(esc).join(' / ')+'</span><br>';
  if(tx)out+='<span style="font-size:9px;color:#765">Un seul !cof-undo annule cette distribution.</span>';
  out+='</div>';
  whisperGM(out);
}

function give(msg){
  if(!playerIsGM(msg.playerid))return;
  var res=giveDirect(
    parseFlag(msg.content,'item'),
    parseFlag(msg.content,'target'),
    hasFlag(msg.content,'equip'),
    parseFlag(msg.content,'qty'),
    {undo:true,whisper:true}
  );
  if(!res.ok)whisperGM(res.error);
}
function chat(msg){
  if(msg.type!=='api')return;
  var c=msg.content;
  if(c.indexOf('!coi-objets')===0){if(playerIsGM(msg.playerid))library();return;}
  if(c.indexOf('!coi-catalogue')===0){if(playerIsGM(msg.playerid))catalogue(msg);return;}
  if(c.indexOf('!coi-refresh-bases')===0){refreshImportedBases(msg);return;}
  if(c.indexOf('!coi-import')===0){importBases(msg);return;}
  if(c.indexOf('!coi-from-base')===0){if(!playerIsGM(msg.playerid))return;createFromBase(parseFlag(c,'id'),false);return;}
  if(c.indexOf('!coi-new-conso')===0){if(!playerIsGM(msg.playerid))return;var mc=c.match(/--name\s+(.+)$/i),nc=mc?mc[1].replace(/^[\'\"]|[\'\"]$/g,''):'Nouveau consommable';var cc=makeBlankConsumable(nc);if(cc)whisperGM('Consommable créé : <b>'+esc(cc.get('name'))+'</b>');return;}
  if(c.indexOf('!coi-new')===0){if(!playerIsGM(msg.playerid))return;var m=c.match(/--name\s+(.+)$/i),n=m?m[1].replace(/^[\'\"]|[\'\"]$/g,''):'Nouvel objet';var ch=makeBlank(n);if(ch)whisperGM('Objet créé : <b>'+esc(ch.get('name'))+'</b>');return;}
  if(c.indexOf('!coi-show')===0){showItem(parseFlag(c,'character'));return;}
  if(c.indexOf('!coi-affix-index')===0){affixIndex(msg);return;}
  if(c.indexOf('!coi-affix-detail')===0){affixDetail(msg);return;}
  if(c.indexOf('!coi-affix-mode')===0){changeAffixMode(msg);return;}
  if(c.indexOf('!coi-affixes')===0){if(playerIsGM(msg.playerid))affixMenu(parseFlag(c,'item'),parseFlag(c,'page')||1,parseFlag(c,'family')||'',parseLongFlag(c,'search')||'',parseFlag(c,'group')||'');return;}
  if(c.indexOf('!coi-quality')===0){changeQuality(msg);return;}
  if(c.indexOf('!coi-affix-name')===0){setNameAffix(msg);return;}
  if(c.indexOf('!coi-affix-add')===0){changeAffix(msg,true);return;}
  if(c.indexOf('!coi-affix-remove')===0){changeAffix(msg,false);return;}
  if(c.indexOf('!coi-transfer-weapon')===0){transferEquipment(msg,'armes','armelabel','armenom','arme');return;}
  if(c.indexOf('!coi-transfer-armor')===0){transferEquipment(msg,'armures','labelarmure','nomarmure','équipement');return;}
  if(c.indexOf('!coi-transfer-belt')===0){moveInventory(msg,'equipement','equipement',true);return;}
  if(c.indexOf('!coi-transfer-bag')===0){moveInventory(msg,'sac','sac',true);return;}
  if(c.indexOf('!coi-belt-to-bag')===0){moveInventory(msg,'equipement','sac',false);return;}
  if(c.indexOf('!coi-bag-to-belt')===0){moveInventory(msg,'sac','equipement',false);return;}
  if(c.indexOf('!coi-delete-bag')===0){deleteBagItem(msg);return;}
  if(c.indexOf('!coi-delete-conso')===0){deleteConsumable(msg);return;}
  if(c.indexOf('!coi-use-conso')===0){useConsumable(msg);return;}
  if(c.indexOf('!coi-equip-choice')===0){equipChoice(msg);return;}
  if(c.indexOf('!coi-give-all-pj')===0){giveConsumableToAllPJ(msg);return;}
  if(c.indexOf('!coi-give-spec')===0){giveSpec(msg);return;}
  if(c.indexOf('!coi-give')===0){give(msg);return;}
}
function inventoryAttributeId(a){
  if(!a||typeof a.get!=='function')return '';
  return String(a.id||a.get('_id')||'');
}
function syncInventoryRowId(a){
  if(!a||typeof a.get!=='function')return false;
  var n=String(a.get('name')||''),m=/^(repeating_(equipement|sac)_([^_]+)_)(equip_qte|sac_qte)$/.exec(n);if(!m)return false;
  var cid=a.get('_characterid'),field=m[2]==='sac'?'sac_rowid':'equip_rowid';
  if(!cid)return false;
  setA(cid,m[1]+field,m[3],false);
  return String(getA(cid,m[1]+field,''))===String(m[3]);
}
function removeZeroInventory(a){
  if(!a||a.get('_type')!=='attribute')return false;var n=String(a.get('name')||''),m=/^(repeating_(equipement|sac)_[^_]+_)(equip_qte|sac_qte)$/.exec(n);if(!m)return false;
  var raw=String(a.get('current')===undefined||a.get('current')===null?'':a.get('current')).trim();if(raw===''||isNaN(Number(raw))||Number(raw)>0)return false;
  removeRepeatingPrefix(a.get('_characterid'),m[1]);return true;
}
function cleanupZeroInventories(){var n=0;(findObjs({_type:'attribute'})||[]).slice().forEach(function(a){if(removeZeroInventory(a))n++;});return n;}
function syncAllInventoryRowIds(){(findObjs({_type:'attribute'})||[]).forEach(syncInventoryRowId);}
function attributeAdded(a){syncInventoryRowId(a);}
function migrateLegacyConsumables(){var n=0;(findObjs({_type:'character'})||[]).forEach(function(c){var cid=c.id,t=String(getA(cid,'type_personnage','')).toUpperCase(),cat=String(getA(cid,'objet_categorie','')).toLowerCase();if(t===CONSUMABLE_TYPE){setA(cid,'type_personnage',OBJET_TYPE,true);setA(cid,'objet_categorie','consommable',false);cat='consommable';n++;}if(cat==='consommable'){if(!getA(cid,'objet_consommable_type',''))setA(cid,'objet_consommable_type','Potion',false);if(!getA(cid,'objet_consommable_qte_don',''))setA(cid,'objet_consommable_qte_don',1,false);if(!getA(cid,'objet_consommable_effet_texte',''))setA(cid,'objet_consommable_effet_texte',getA(cid,'objet_description',''),false);syncObjectTokenAction(cid);}});return n;}
function migrateStabilizationBaseId5064(){var n=0;(findObjs({_type:'attribute',name:'objet_base_id'})||[]).forEach(function(a){if(String(a.get('current')||'')!=='B062')return;var cid=a.get('_characterid'),cat=String(getA(cid,'objet_categorie','')).toLowerCase(),ch=getObj('character',cid),nm=normText(getA(cid,'objet_nom_base','')||(ch?ch.get('name'):'')||''),desc=normText(getA(cid,'objet_description',''));if(cat==='consommable'||nm.indexOf('stabilisation')>=0||nm.indexOf('dernier souffle')>=0||desc.indexOf('blessure maligne')>=0){setA(cid,'objet_base_id','B066',false);setA(cid,'objet_nom_base','Parchemin de stabilisation',false);n++;}});return n;}
function ensureBaseNames(){(findObjs({_type:'attribute',name:'type_personnage'})||[]).forEach(function(a){var cid=a.get('_characterid'),t=String(a.get('current')||'').toUpperCase();if(t!==OBJET_TYPE&&t!==CONSUMABLE_TYPE)return;if(getA(cid,'objet_nom_base',''))return;var base=BASE_BY_ID[getA(cid,'objet_base_id','')],ch=getObj('character',cid);setA(cid,'objet_nom_base',base&&base.name?base.name:(ch?ch.get('name'):'Objet'),false);});}
function attributeChange(a){if(!a)return;var n=String(a.get('name')||''),cid=a.get('_characterid');if(/^(repeating_(equipement|sac)_[^_]+_)(equip_qte|sac_qte)$/.test(n)){if(removeZeroInventory(a))return;syncInventoryAttrId(a);return;}if(/^repeating_objetactions_[^_]+_(objet_action_nom|objet_action_description|objet_action_commande|objet_action_commande_auto)$/.test(n)){syncObjectActionFlag(cid);return;}if(n==='type_personnage'||n==='objet_categorie'){syncObjectTokenAction(cid);if(n==='objet_categorie'&&isItem(cid))rebuildAffixes(cid);return;}if(n==='objet_qualite'&&isItem(cid))rebuildAffixes(cid);}
function doctorCharacter(character,repair){
  var cid=character&&character.id,issues=[],fixes=[],unresolved=[];if(!cid)return{issues:issues,fixes:fixes,unresolved:['Fiche invalide']};
  var type=String(getA(cid,'type_personnage','')).toUpperCase(),cat=String(getA(cid,'objet_categorie','')).toLowerCase();
  if(type===CONSUMABLE_TYPE){issues.push('ancien type CONSOMMABLE');if(repair){setA(cid,'type_personnage',OBJET_TYPE,true);setA(cid,'objet_categorie','consommable',false);type=OBJET_TYPE;cat='consommable';fixes.push('type migré vers OBJET / consommable');}}

  var attrs=findObjs({_type:'attribute',_characterid:cid})||[],badRowIds=0,fixedRowIds=0;
  attrs.forEach(function(a){
    var n=String(a.get('name')||''),m=/^(repeating_(equipement|sac)_([^_]+)_)(equip_qte|sac_qte)$/.exec(n);if(!m)return;
    var rowField=m[2]==='sac'?'sac_rowid':'equip_rowid',
        fieldName=m[1]+rowField,
        expected=String(m[3]),
        before=String(getA(cid,fieldName,''));
    if(before===expected)return;
    badRowIds++;
    if(repair){
      setA(cid,fieldName,expected,false);
      if(String(getA(cid,fieldName,''))===expected)fixedRowIds++;
    }
  });
  if(badRowIds)issues.push(badRowIds+' identifiant(s) de ligne d’inventaire manquant(s) ou périmé(s)');
  if(repair&&fixedRowIds)fixes.push(fixedRowIds+' identifiant(s) de ligne d’inventaire resynchronisé(s)');
  if(type===OBJET_TYPE){
    var allowed={arme:1,armure:1,accessoire:1,consommable:1,divers:1,hebergement:1};
    if(!allowed[cat])unresolved.push('catégorie objet inconnue ou absente : '+(cat||'(vide)'));
    var baseId=String(getA(cid,'objet_base_id','')).trim(),base=baseId?BASE_BY_ID[baseId]:null;
    if(baseId&&!base)unresolved.push('base catalogue inconnue : '+baseId);
    if(base&&!getA(cid,'objet_nom_base','')){issues.push('nom de base absent');if(repair){setA(cid,'objet_nom_base',base.name,false);fixes.push('nom de base restauré');}}
    var qraw=getA(cid,'objet_qualite',0),q=int(qraw,0);if(isNaN(Number(qraw))||q<0||q>5){issues.push('qualité hors plage : '+qraw);if(repair){q=Math.max(0,Math.min(5,q));setA(cid,'objet_qualite',q,false);fixes.push('qualité ramenée à '+q);}}
    var raw=String(getA(cid,'objet_affixes','')||''),ids=raw.split(',').map(function(x){return x.trim();}).filter(Boolean),seen={},clean=[],unknown=[];
    ids.forEach(function(id){if(!AFFIX_BY_ID[id])unknown.push(id);if(!seen[id]){seen[id]=true;clean.push(id);}});
    if(clean.length!==ids.length){issues.push('affixes dupliqués');if(repair){setA(cid,'objet_affixes',clean.join(','),false);ids=clean;fixes.push('liste d’affixes dédupliquée');}}
    if(unknown.length)unresolved.push('affixe(s) inconnu(s) : '+unknown.join(', '));
    ids.forEach(function(id){var a=AFFIX_BY_ID[id];if(a&&!a.auto&&!String(affixConfig(cid,a,'commande')||'').trim()&&!String(affixConfig(cid,a,'predicat')||'').trim())unresolved.push(a.name+' : configuration requise');});
    if(repair&&!unknown.length){rebuildAffixes(cid,{skipBaseSync:true,doctorSafe:true});syncObjectActionFlag(cid);syncObjectTokenAction(cid);fixes.push('données dérivées des affixes resynchronisées');}
  }
  return{issues:issues,fixes:fixes,unresolved:unresolved};
}
function migrateCatalogueEconomy5066(){
  var changed=0;
  (findObjs({_type:'character'})||[]).forEach(function(c){
    if(String(getA(c.id,'type_personnage','')).toUpperCase()!==OBJET_TYPE)return;
    var d=itemData(c.id,true),base=d&&BASE_BY_ID[d.baseId],beforePrice=d&&d.price,beforeRarity=d&&d.rarity;
    if(!d||!base||base.category==='consommable')return;
    refreshCatalogueEconomy(c.id);
    d=itemData(c.id,true);
    if(d&&(String(d.price)!==String(beforePrice)||String(d.rarity)!==String(beforeRarity)))changed++;
  });
  return changed;
}
function ready(){var migratedBaseIds=migrateStabilizationBaseId5064();var migrated=migrateLegacyConsumables();ensureBaseNames();var migratedActions=migrateObjectActionRows();var cleaned=cleanupZeroInventories();syncAllInventoryRowIds();var repriced=migrateCatalogueEconomy5066();log(SCRIPT+' v'+VERSION+' prêt — '+BASES.length+' bases / '+AFFIXES.length+' affixes.'+(migratedBaseIds?' '+migratedBaseIds+' ancien(s) parchemin(s) B062 migré(s) vers B066.':'')+(migrated?' '+migrated+' consommable(s) migré(s).':'')+(migratedActions?' '+migratedActions+' fiche(s) objet migrée(s) vers les actions visibles.':'')+(cleaned?' '+cleaned+' ligne(s) d’inventaire à 0 supprimée(s).':'')+(repriced?' '+repriced+' fiche(s) OBJET repricée(s) avec le barème 2026-10-03.':''));if(!COFantasyItemsUndoBridge.available())log(SCRIPT+' : ATTENTION, pont !cof-undo indisponible. Installe le COFantasy principal fourni avec cette version.');(findObjs({_type:'character'})||[]).forEach(function(c){syncObjectTokenAction(c.id);});}

function getEquipmentActions(cid,tid){
  var out=[],attrs=findObjs({_type:'attribute',_characterid:cid})||[],byName={};
  attrs.forEach(function(a){byName[a.get('name')]=a;});
  function read(name,def){var a=byName[name];if(!a)return def;var v=a.get('current');return(v===undefined||v===null||v==='')?def:v;}
  function addActions(raw,instanceId,source,itemId){
    var list=null;
    if(itemId&&isItem(itemId)){
      list=readObjectActions(itemId,false);
    }
    if(list===null){
      if(!raw)return;
      try{list=JSON.parse(String(raw));}catch(e){log(SCRIPT+' : actions objet invalides sur '+source+' : '+e.message);return;}
    }
    if(!Array.isArray(list))return;
    list.forEach(function(a){
      if(!a||!a.command)return;
      var resource=String(instanceId||'item').replace(/[^A-Za-z0-9_-]/g,'_');
      var cmd=String(a.command).replace(/\{ITEM_ID\}/g,resource);
      cmd=resolveSelectedRefs(cmd,cid,tid);
      if(tid&&cmd.indexOf('!cof-')===0&&cmd.indexOf(' --target ')<0)cmd+=' --target '+tid;
      out.push({name:a.name||source||'Objet',command:cmd,source:source||'',affixId:a.id||'',undo:a.undo||''});
    });
  }
  var md=String(read('maindroite','')),mg=String(read('maingauche',''));
  var weaponRows={};
  attrs.forEach(function(a){
    var m=/^(repeating_armes_([^_]+)_)(armelabel|armenom|coi_actions|coi_item_id)$/.exec(String(a.get('name')||''));
    if(!m)return;var p=m[1];weaponRows[p]=weaponRows[p]||{prefix:p,rowId:m[2]};weaponRows[p][m[3]]=a.get('current');
  });
  Object.keys(weaponRows).forEach(function(p){
    var r=weaponRows[p],lab=String(r.armelabel||'');
    if(lab!==md&&lab!==mg)return;
    addActions(r.coi_actions,'arme_'+r.rowId,r.armenom||'Arme',r.coi_item_id);
  });
  var armorRowsMap={};
  attrs.forEach(function(a){
    var m=/^(repeating_armures_([^_]+)_)(nomarmure|equipearmure|coi_actions|coi_item_id)$/.exec(String(a.get('name')||''));
    if(!m)return;var p=m[1];armorRowsMap[p]=armorRowsMap[p]||{prefix:p,rowId:m[2]};armorRowsMap[p][m[3]]=a.get('current');
  });
  Object.keys(armorRowsMap).forEach(function(p){
    var r=armorRowsMap[p];if(String(r.equipearmure||'0')!=='1')return;
    addActions(r.coi_actions,'armure_'+r.rowId,r.nomarmure||'Objet',r.coi_item_id);
  });
  return out;
}

function getEquippedFocusEffects(cid){
  var result={channels:{},arcanePower:0,sources:[]},
      attrs=findObjs({_type:'attribute',_characterid:cid})||[],byName={};
  attrs.forEach(function(a){byName[a.get('name')]=a;});
  function read(name,def){var a=byName[name];if(!a)return def;var v=a.get('current');return(v===undefined||v===null||v==='')?def:v;}
  function diceScore(expr){
    var m=/^(\d+)d(\d+)$/i.exec(String(expr||'').trim());
    if(!m)return 0;
    return parseInt(m[1],10)*parseInt(m[2],10);
  }
  function addItem(itemId,source){
    if(!itemId||!isItem(itemId))return;
    var raw=String(getA(itemId,'objet_affixes','')||''),ids=raw.split(',').map(function(x){return x.trim();}).filter(Boolean),
        used=false,src={itemId:itemId,source:source||'',channels:{},arcanePower:0};
    ids.forEach(function(id){
      var a=AFFIX_BY_ID[id];if(!a)return;
      if(a.channelType&&a.channelDice){
        var typ=String(a.channelType),dice=String(a.channelDice);
        if(!src.channels[typ]||diceScore(dice)>diceScore(src.channels[typ]))src.channels[typ]=dice;
        if(!result.channels[typ]||diceScore(dice)>diceScore(result.channels[typ]))result.channels[typ]=dice;
        used=true;
      }
      if(a.arcanePower){
        var p=int(a.arcanePower,0);
        if(p>src.arcanePower)src.arcanePower=p;
        if(p>result.arcanePower)result.arcanePower=p;
        used=true;
      }
    });
    if(used)result.sources.push(src);
  }
  var md=String(read('maindroite','')),mg=String(read('maingauche','')),rows={};
  attrs.forEach(function(a){
    var m=/^(repeating_armes_([^_]+)_)(armelabel|armenom|coi_item_id)$/.exec(String(a.get('name')||''));
    if(!m)return;
    var p=m[1];rows[p]=rows[p]||{prefix:p,rowId:m[2]};rows[p][m[3]]=a.get('current');
  });
  Object.keys(rows).forEach(function(p){
    var r=rows[p],lab=String(r.armelabel||'');
    if(lab!==md&&lab!==mg)return;
    addItem(r.coi_item_id,r.armenom||'Focus');
  });
  var erows={};
  attrs.forEach(function(a){
    var m=/^(repeating_armures_([^_]+)_)(labelarmure|nomarmure|typearmure|equipearmure|coi_item_id)$/.exec(String(a.get('name')||''));
    if(!m)return;
    var p=m[1];erows[p]=erows[p]||{prefix:p,rowId:m[2]};erows[p][m[3]]=a.get('current');
  });
  Object.keys(erows).forEach(function(p){
    var r=erows[p],lab=String(r.labelarmure||''),type=String(r.typearmure||'');
    if(String(r.equipearmure||'0')!=='1')return;
    if(type==='Bouclier'&&mg==='b'+lab)addItem(r.coi_item_id,r.nomarmure||'Bouclier magique');
    if(type==='Main gauche'&&mg==='g'+lab)addItem(r.coi_item_id,r.nomarmure||'Focus main gauche');
  });
  return result;
}

function publicClone(v){
  if(v===undefined)return undefined;
  try{return JSON.parse(JSON.stringify(v));}catch(e){return v;}
}
function publicSpecData(base,spec){
  spec=spec||{};
  return{
    baseId:base.id,
    baseName:base.name,
    name:base.name,
    category:base.category,
    slot:base.slot||'Autre',
    affixMode:String(spec.mode||base.affixModeDefault||''),
    weaponAttack:base.weaponAttack||'contact',
    usage:base.usage||'',
    consumableType:base.subcategory||''
  };
}
function normalizePublicSpec(spec){
  spec=spec&&typeof spec==='object'?spec:{};
  var base=String(spec.base||spec.baseId||'').trim(),quality=Math.max(0,Math.min(5,int(spec.quality,0))),seen={},affixes=[];
  (Array.isArray(spec.affixes)?spec.affixes:[]).forEach(function(id){id=String(id||'').trim();if(id&&!seen[id]){seen[id]=1;affixes.push(id);}});
  return{base:base,quality:quality,affixes:affixes,mode:String(spec.mode||'').trim(),name:String(spec.name||'').trim(),price:(spec.price===undefined||spec.price===null)?'':String(spec.price).trim(),rarity:String(spec.rarity||'').trim(),config:spec.config&&typeof spec.config==='object'?publicClone(spec.config):{}};
}
function validatePublicSpec(spec){
  var n=normalizePublicSpec(spec),b=BASE_BY_ID[n.base],errors=[],warnings=[],d;
  if(!b)return{ok:false,errors:['Base CoFItem inconnue : '+(n.base||'(vide)')],warnings:[],spec:n};
  if(n.quality>0&&b.category!=='arme'&&b.category!=='armure')errors.push('La qualité +N est réservée aux armes et armures/boucliers.');
  d=publicSpecData(b,n);
  if(n.mode){
    var modes=affixModeOptions(d);
    if(modes.indexOf(n.mode)<0)errors.push('Mode d’affixe incompatible avec '+b.id+' : '+n.mode+'.');
  }
  if(b.category==='consommable'&&n.affixes.length>1)errors.push('Un consommable CoFItem ne peut porter qu’une variante/affixe à la fois.');
  n.affixes.forEach(function(id){
    var a=AFFIX_BY_ID[id],cfg=n.config[id]||{};
    if(!a){errors.push('Affixe CoFItem inconnu : '+id);return;}
    if(!compatible(a,d)){errors.push('Affixe '+id+' incompatible avec '+b.id+' ('+b.name+').');return;}
    if(a.name==='traitement double'&&(!cfg.type1||!cfg.type2))errors.push('Affixe '+id+' : config.type1 et config.type2 requis.');
    if(String(a.name||'').indexOf('"Classe"')>=0&&!cfg.classe)errors.push('Affixe '+id+' : config.classe requis.');
    if(!a.auto&&!String(cfg.commande||'').trim()&&!String(cfg.predicat||'').trim())errors.push('Affixe '+id+' configurable : config.commande ou config.predicat requis.');
  });
  if((n.affixes.length||n.quality>0)&&String(b.price||'').trim().match(/^[—-]?$/))warnings.push('La base n’a pas de prix catalogue exploitable ; le module marchand devra fournir un prix.');
  return{ok:errors.length===0,errors:errors,warnings:warnings,spec:n,base:publicClone(b)};
}
function applyPublicSpecToCharacter(cid,n){
  var d=itemData(cid);
  if(!d)return{ok:false,error:'Fiche OBJET créée mais illisible.'};
  if(n.mode)setA(cid,'objet_affixe_mode',n.mode,false);
  if(n.quality>0)setA(cid,'objet_qualite',n.quality,false);
  n.affixes.forEach(function(id){
    var cfg=(n.config&&n.config[id])||{};
    ['type1','type2','classe','commande','predicat'].forEach(function(k){if(cfg[k]!==undefined&&cfg[k]!==null&&String(cfg[k])!=='')setA(cid,'objet_affixe_cfg_'+id+'_'+k,String(cfg[k]),false);});
  });
  setA(cid,'objet_affixes',n.affixes.join(','),false);
  if(n.affixes.length)setA(cid,'objet_affixe_nom_id',n.affixes[0],false);
  rebuildAffixes(cid);
  if(n.name){
    setA(cid,'objet_nom_variante',n.name,false);
    var ch=getObj('character',cid);if(ch)ch.set('name',n.name);
  }
  if(n.price&&BASE_BY_ID[n.base]&&BASE_BY_ID[n.base].category==='consommable')setA(cid,'objet_prix',n.price,false);
  if(n.rarity&&BASE_BY_ID[n.base]&&BASE_BY_ID[n.base].category==='consommable')setA(cid,'objet_rarete',n.rarity,false);
  refreshCatalogueEconomy(cid);
  return{ok:true,data:itemData(cid)};
}
function createFromPublicSpec(spec,options){
  options=options||{};
  var v=validatePublicSpec(spec);if(!v.ok)return{ok:false,errors:v.errors,warnings:v.warnings};
  var c=createFromBase(v.spec.base,true);if(!c)return{ok:false,errors:['Impossible de créer la fiche OBJET.'],warnings:v.warnings};
  var applied=applyPublicSpecToCharacter(c.id,v.spec);
  if(!applied.ok){try{c.remove();}catch(e){}return{ok:false,errors:[applied.error],warnings:v.warnings};}
  if(options.archive===true)c.set('archived',true);
  if(options.ownerTag)setA(c.id,'coi_external_owner',String(options.ownerTag),false);
  return{ok:true,itemId:c.id,data:applied.data,warnings:v.warnings,spec:v.spec};
}

function coAlaricPricePA(raw){return catalogueRawPricePA(raw);}
function coAlaricCanonicalPrice(v,res){
  var spec=v&&v.spec?v.spec:{},base=v&&v.base?v.base:null,p=NaN;

  if(base&&base.category!=='consommable')p=catalogueSpecPricePA(base,spec);

  if(!isFinite(p))p=coAlaricPricePA(spec.price);
  if(!isFinite(p)&&res&&res.data)p=coAlaricPricePA(res.data.price);
  return p;
}
function coAlaricPriceGuard(v){
  var spec=v&&v.spec?v.spec:{},base=v&&v.base?v.base:null,
      custom=!!((spec.affixes&&spec.affixes.length)||int(spec.quality,0)>0),
      supplied=coAlaricPricePA(spec.price);
  if(base&&base.category!=='consommable')return'';
  if(custom&&!isFinite(supplied))return'Prix final requis pour un consommable personnalisé.';
  return'';
}
function coAlaricValidateSpec(spec){
  var v=validatePublicSpec(spec),p,guard;
  if(!v.ok)return{ok:false,errors:v.errors||[],warnings:v.warnings||[]};
  guard=coAlaricPriceGuard(v);if(guard)return{ok:false,errors:[guard],warnings:v.warnings||[]};
  p=coAlaricCanonicalPrice(v,null);
  if(!isFinite(p))return{ok:false,errors:['Prix catalogue inexploitable pour '+(v.spec.name||v.base.name)+'.'],warnings:v.warnings||[]};
  return{ok:true,spec:publicClone(v.spec),base:publicClone(v.base),pricePA:p,warnings:v.warnings||[]};
}
function coAlaricPrepareSpec(spec){
  var v=validatePublicSpec(spec),r,p,guard;
  if(!v.ok)return{ok:false,errors:v.errors||[],warnings:v.warnings||[]};
  guard=coAlaricPriceGuard(v);if(guard)return{ok:false,errors:[guard],warnings:v.warnings||[]};
  r=getOrCreateExternalSpec(v.spec);
  if(!r.ok)return r;
  p=coAlaricCanonicalPrice(v,r);
  if(!isFinite(p))return{ok:false,errors:['Prix catalogue inexploitable pour '+((r.data&&r.data.name)||v.spec.name||v.base.name)+'.'],warnings:r.warnings||[]};
  return{ok:true,itemId:r.itemId,data:publicClone(r.data),spec:publicClone(v.spec),pricePA:p,reused:!!r.reused,warnings:r.warnings||[]};
}
function coAlaricGivePrepared(itemId,targetId,qty){
  var d=itemData(itemId,true),n=Math.max(1,Math.min(100,int(qty,1))),i,r,given=0;
  if(!d)return{ok:false,error:'Objet CoFItem préparé introuvable.'};
  if(d.category==='consommable'||d.category==='divers'){
    r=giveDirect(itemId,targetId,false,n,{undo:false,whisper:false,structuredDivers:true});
    return r&&r.ok?{ok:true,given:n,data:publicClone(d)}:{ok:false,error:(r&&r.error)||'Échec du don CoFItem.'};
  }
  for(i=0;i<n;i++){
    r=giveDirect(itemId,targetId,false,1,{undo:false,whisper:false,structuredDivers:true});
    if(!r||!r.ok)return{ok:false,error:(r&&r.error)||('Échec du don de '+d.name+'.'),given:given};
    given++;
  }
  return{ok:true,given:given,data:publicClone(d)};
}
function coAlaricRowId(prefix,section){
  var rx=new RegExp('^repeating_'+section+'_([^_]+)_$'),m=rx.exec(String(prefix||''));return m?m[1]:'';
}
function coAlaricInventoryNormName(v){
  return normText(v).replace(/\s+/g,' ').trim();
}
function coAlaricCatalogBaseForInventoryName(name,section){
  var wanted=coAlaricInventoryNormName(name),matches=[];
  if(!wanted)return null;
  BASES.forEach(function(b){
    if(section==='arme'&&b.category!=='arme')return;
    if(section==='armure'&&b.category!=='armure'&&b.category!=='accessoire')return;
    if(coAlaricInventoryNormName(b.name)===wanted)matches.push(b);
  });
  return matches.length===1?matches[0]:null;
}
function coAlaricListInventory(cid){
  if(!getObj('character',cid))return{ok:false,error:'Personnage introuvable.',items:[]};
  var attrs=findObjs({_type:'attribute',_characterid:cid})||[],rows={},out=[];
  attrs.forEach(function(a){
    var n=String(a.get('name')||''),m;
    m=/^(repeating_armes_([^_]+)_)(armelabel|armenom|coi_item_id)$/.exec(n);
    if(m){var k='arme:'+m[2];rows[k]=rows[k]||{ref:k,section:'arme',row:m[2],prefix:m[1],qty:1};rows[k][m[3]]=a.get('current');return;}
    m=/^(repeating_armures_([^_]+)_)(labelarmure|nomarmure|equipearmure|coi_item_id)$/.exec(n);
    if(m){var k2='armure:'+m[2];rows[k2]=rows[k2]||{ref:k2,section:'armure',row:m[2],prefix:m[1],qty:1};rows[k2][m[3]]=a.get('current');return;}
    m=/^(repeating_equipement_([^_]+)_)(equip_nom|equip_qte|equip_item_id)$/.exec(n);
    if(m){var k3='equipement:'+m[2];rows[k3]=rows[k3]||{ref:k3,section:'equipement',row:m[2],prefix:m[1]};rows[k3][m[3]]=a.get('current');return;}
    m=/^(repeating_sac_([^_]+)_)(sac_nom|sac_qte|sac_item_id)$/.exec(n);
    if(m){var k4='sac:'+m[2];rows[k4]=rows[k4]||{ref:k4,section:'sac',row:m[2],prefix:m[1]};rows[k4][m[3]]=a.get('current');}
  });
  var md=String(getA(cid,'maindroite','')),mg=String(getA(cid,'maingauche',''));
  Object.keys(rows).forEach(function(k){
    var r=rows[k],iid='',name='',qty=1,d=null,p=NaN,base=null,category='',rarity='',legacy=false,inferred=false,equipped=false;
    if(r.section==='arme'){
      iid=String(r.coi_item_id||'');name=String(r.armenom||'Arme');
      equipped=!!String(r.armelabel||'')&&(md===String(r.armelabel)||mg===String(r.armelabel));
    }
    else if(r.section==='armure'){
      iid=String(r.coi_item_id||'');name=String(r.nomarmure||'Armure');
      equipped=String(r.equipearmure||'0')==='1';
    }
    else if(r.section==='equipement'){iid=String(r.equip_item_id||'');name=String(r.equip_nom||'Objet');qty=Math.max(0,int(r.equip_qte,0));}
    else {iid=String(r.sac_item_id||'');name=String(r.sac_nom||'Objet');qty=Math.max(0,int(r.sac_qte,0));}
    if(qty<1)return;

    if(iid)d=itemData(iid,true);
    if(d){
      p=coAlaricPricePA(d.price);category=d.category;rarity=d.rarity||'';
    }else if(r.section==='arme'||r.section==='armure'){

      legacy=true;base=coAlaricCatalogBaseForInventoryName(name,r.section);
      if(base){inferred=true;p=coAlaricPricePA(base.price);category=base.category;}
      else category=r.section==='arme'?'arme':'armure';
    }else{

      return;
    }

    out.push({
      ref:r.ref,section:r.section,row:r.row,prefix:r.prefix,itemId:(d?iid:''),baseId:(d&&d.baseId)||((base&&base.id)||''),
      name:name,qty:qty,pricePA:isFinite(p)?p:null,priceKnown:isFinite(p),category:category,rarity:rarity,
      equipped:equipped,legacy:legacy,inferred:inferred
    });
  });
  out.sort(function(a,b){
    if(!!a.equipped!==!!b.equipped)return a.equipped?-1:1;
    return a.name.localeCompare(b.name);
  });
  return{ok:true,items:out};
}
function coAlaricResolveInventoryRef(cid,ref){
  var all=coAlaricListInventory(cid);if(!all.ok)return null;
  for(var i=0;i<all.items.length;i++)if(all.items[i].ref===ref)return all.items[i];
  return null;
}
function coAlaricInventoryPrefixForSale(it){
  if(it&&it.prefix)return String(it.prefix);
  var section=String((it&&it.section)||''),row=String((it&&it.row)||'');
  var repeating={arme:'armes',armure:'armures',equipement:'equipement',sac:'sac'}[section]||section;
  return repeating&&row?('repeating_'+repeating+'_'+row+'_'):'';
}
function coAlaricClearAttrIf(cid,name,expected,newValue){
  var cur=String(getA(cid,name,''));
  if(Array.isArray(expected)){
    for(var i=0;i<expected.length;i++)if(cur===String(expected[i])){setA(cid,name,newValue,true);return true;}
    return false;
  }
  if(cur===String(expected)){setA(cid,name,newValue,true);return true;}
  return false;
}
function coAlaricUnequipWeaponForSale(cid,prefix){
  var label=String(getA(cid,prefix+'armelabel','')),
      md=String(getA(cid,'maindroite','0')),
      mg=String(getA(cid,'maingauche','0')),
      right=(label!==''&&md===label),left=(label!==''&&mg===label);
  if(right){
    setA(cid,'maindroite','0',true);
    setA(cid,'montrerattaquedroite','0',true);

    if(mg==='2m'){
      setA(cid,'maingauche','0',true);
      setA(cid,'montrerattaquegauche','0',true);
    }
  }
  if(left){
    setA(cid,'maingauche','0',true);
    setA(cid,'montrerattaquegauche','0',true);
  }

  coAlaricClearAttrIf(cid,'armeEnMain',label,'0');
  coAlaricClearAttrIf(cid,'armeEnMain_max',label,'0');
}
function coAlaricUnequipArmorForSale(cid,prefix){
  var type=String(getA(cid,prefix+'typearmure','Autre')),
      label=String(getA(cid,prefix+'labelarmure','0')),
      mg=String(getA(cid,'maingauche','0')),
      mgMax=String(getA(cid,'maingauche_max','0')),
      handType=String(getA(cid,'typemaingauche',''));

  setArmorEquipped(cid,prefix,false);
  setA(cid,prefix+'equipearmure','0',true);

  if(type==='Torse'){
    coAlaricClearAttrIf(cid,'torseequipe',label,'0');
    coAlaricClearAttrIf(cid,'torseequipe_max',label,'0');
    setA(cid,'defarmureon','0',true);
    setA(cid,'defarmure','0',true);
    setA(cid,'defarmuremalus','0',true);
  }else if(type==='Casque'){
    coAlaricClearAttrIf(cid,'teteequipe',label,'0');
    coAlaricClearAttrIf(cid,'teteequipe_max',label,'0');
    setA(cid,'casque_on','0',true);
    setA(cid,'casque_rd','0',true);
    setA(cid,'casque_malus','0',true);
  }else if(type==='Bouclier'){
    if(mg==='b'+label||(mg===label&&handType==='Bouclier')){
      setA(cid,'maingauche','0',true);
      setA(cid,'montrerattaquegauche','0',true);
      setA(cid,'typemaingauche','',true);
    }
    if(mgMax===label)setA(cid,'maingauche_max','0',true);
    setA(cid,'defbouclieron','0',true);
    setA(cid,'defbouclier','0',true);
    setA(cid,'defboucliermalus','0',true);
  }else if(type==='Main gauche'){
    if(mg==='g'+label||mg===label){
      setA(cid,'maingauche','0',true);
      setA(cid,'montrerattaquegauche','0',true);
      setA(cid,'typemaingauche','',true);
    }
    if(mgMax===label)setA(cid,'maingauche_max','0',true);
  }
}
function coAlaricRemoveInventory(cid,requests){
  if(!Array.isArray(requests)||!requests.length)return{ok:false,error:'Aucun objet à retirer.'};
  var grouped={},resolved=[],i,r,q,live;
  for(i=0;i<requests.length;i++){
    r=requests[i]||{};q=Math.max(1,int(r.qty,1));
    if(!r.ref)return{ok:false,error:'Référence d’inventaire absente.'};
    grouped[r.ref]=(grouped[r.ref]||0)+q;
  }
  var refs=Object.keys(grouped);
  for(i=0;i<refs.length;i++){
    live=coAlaricResolveInventoryRef(cid,refs[i]);q=grouped[refs[i]];
    if(!live)return{ok:false,error:'Objet d’inventaire introuvable ou non vendable : '+refs[i]+'.'};
    if(q>live.qty)return{ok:false,error:'Quantité insuffisante pour '+live.name+' ('+live.qty+' disponible(s)).'};
    if((live.section==='arme'||live.section==='armure')&&q!==1)return{ok:false,error:'Une pièce d’équipement individuelle se vend à l’unité.'};
    resolved.push({item:live,qty:q});
  }

  resolved.forEach(function(x){
    var it=x.item,prefix=coAlaricInventoryPrefixForSale(it),a,cur;
    if(!prefix)throw new Error('Préfixe repeating introuvable pour '+it.name+'.');
    if(it.section==='arme'){
      coAlaricUnequipWeaponForSale(cid,prefix);
      removeRepeatingPrefix(cid,prefix);
      return;
    }
    if(it.section==='armure'){
      coAlaricUnequipArmorForSale(cid,prefix);
      removeRepeatingPrefix(cid,prefix);
      return;
    }
    var sp=inventorySpec(it.section);a=attrObj(cid,prefix+sp.qty);cur=a?Math.max(0,int(a.get('current'),0)):0;
    if(cur<=x.qty)removeRepeatingPrefix(cid,prefix);else a.set('current',cur-x.qty);
  });

  for(i=0;i<resolved.length;i++){
    var rit=resolved[i].item;
    if(rit.section==='arme'||rit.section==='armure'){
      var checkPrefix=coAlaricInventoryPrefixForSale(rit),left=false;
      (findObjs({_type:'attribute',_characterid:cid})||[]).some(function(at){
        if(String(at.get('name')||'').indexOf(checkPrefix)===0){left=true;return true;}return false;
      });
      if(left)return{ok:false,error:'La ligne '+rit.name+' n’a pas pu être retirée complètement de la fiche.'};
    }
  }
  return{ok:true,removed:resolved.map(function(x){return{ref:x.item.ref,name:x.item.name,qty:x.qty,itemId:x.item.itemId,pricePA:x.item.pricePA};})};
}

return{version:VERSION,chat:chat,attributeChange:attributeChange,attributeAdded:attributeAdded,ready:ready,giveDirect:giveDirect,itemData:itemData,getEquipmentActions:getEquipmentActions,getObjectActions:readObjectActions,getEquippedFocusEffects:getEquippedFocusEffects,doctorCharacter:doctorCharacter,coAlaricValidateSpec:coAlaricValidateSpec,coAlaricPrepareSpec:coAlaricPrepareSpec,coAlaricGivePrepared:coAlaricGivePrepared,coAlaricListInventory:coAlaricListInventory,coAlaricRemoveInventory:coAlaricRemoveInventory,coAlaricPricePA:coAlaricPricePA};}());
on('ready',COFantasyItems.ready);on('chat:message',COFantasyItems.chat);on('change:attribute',COFantasyItems.attributeChange);on('add:attribute',COFantasyItems.attributeAdded);

var COFantasyRest = COFantasyRest || (function(){
'use strict';
var SCRIPT='COFantasy Repos', VERSION='V2.0.0', TYPE='HEBERGEMENT', OBJET_TYPE='OBJET', MARK='// COI_REPOS';
var HUNT_DDS=[
 {label:'Région très giboyeuse',dd:8},
 {label:'Forêt / campagne',dd:10},
 {label:'Terrain standard',dd:12},
 {label:'Montagne / hiver',dd:15},
 {label:'Désert / région pauvre',dd:18},
 {label:'Milieu quasiment stérile',dd:22}
];
function esc(s){s=(s===undefined||s===null)?'':String(s);return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function href(c){return esc(c).replace(/@/g,'&#64;').replace(/\{/g,'&#123;').replace(/\}/g,'&#125;').replace(/\|/g,'&#124;');}
function btn(t,c,col){return '<a style="display:inline-block;background:'+(col||'#6b4b2a')+';color:#fff;padding:5px 8px;margin:2px;border-radius:4px;text-decoration:none;font-weight:bold" href="'+href(c)+'">'+esc(t)+'</a>';}
function whisper(msg,x){var who=String((msg&&msg.who)||'GM').replace(/ \(GM\)$/,'');sendChat(SCRIPT,'/w "'+who.replace(/"/g,'')+'" '+x,null,{noarchive:true});}
function whisperGM(x){sendChat(SCRIPT,'/w gm '+x,null,{noarchive:true});}
function attrObj(cid,n){var a=findObjs({_type:'attribute',_characterid:cid,name:n});if(a&&a.length)return a[0];var low=String(n).toLowerCase(),all=findObjs({_type:'attribute',_characterid:cid})||[];for(var i=0;i<all.length;i++)if(String(all[i].get('name')||'').toLowerCase()===low)return all[i];return null;}
function getA(cid,n,d){var a=attrObj(cid,n);if(!a)return d;var v=a.get('current');return(v===undefined||v===null||v==='')?d:v;}
function setA(cid,n,v){var a=attrObj(cid,n);if(!a)return createObj('attribute',{characterid:cid,name:n,current:v});a.set('current',v);return a;}
function num(v,d){var n=parseFloat(v);return isNaN(n)?d:n;}
function int(v,d){var n=parseInt(v,10);return isNaN(n)?d:n;}
function truth(v){v=String(v===undefined?'':v).toLowerCase();return v==='1'||v==='true'||v==='on'||v==='yes'||v==='oui';}
function flag(s,n){var m=String(s||'').match(new RegExp('(?:^|\\s)--'+n+'\\s+(\\S+)','i'));return m?m[1]:null;}
function controls(pid,cid){if(playerIsGM(pid))return true;var c=getObj('character',cid);if(!c)return false;var ids=String(c.get('controlledby')||'').split(',');return ids.indexOf('all')>=0||ids.indexOf(pid)>=0;}
function isPJ(cid){return String(getA(cid,'type_personnage','PJ')).toUpperCase()==='PJ';}
function isFamiliar(cid){return truth(getA(cid,'coi_familier','0'))||String(getA(cid,'coi_role','')).toUpperCase()==='FAMILIER';}
function playerControlled(cid){var c=getObj('character',cid);if(!c)return false;var ids=String(c.get('controlledby')||'').split(',').filter(Boolean);if(ids.indexOf('all')>=0)return true;for(var i=0;i<ids.length;i++){var p=getObj('player',ids[i]);if(p&&!playerIsGM(ids[i]))return true;}return false;}
function uniqIds(list){var seen={},out=[];(list||[]).forEach(function(id){if(id&&!seen[id]&&getObj('character',id)){seen[id]=1;out.push(id);}});return out;}
function fallbackPartyInfo(){
  var main=[],fam=[];
  (findObjs({_type:'character'})||[]).forEach(function(c){
    var cid=c.id;
    if(!isPJ(cid))return;
    if(isFamiliar(cid)){if(playerControlled(cid))fam.push(cid);return;}
    if(playerControlled(cid))main.push(cid);
  });
  main.sort(function(a,b){return charName(a).localeCompare(charName(b));});
  fam.sort(function(a,b){return charName(a).localeCompare(charName(b));});
  return{found:false,handoutName:'Détection contrôleurs',main:main,familiars:fam,owners:{},restGroup:uniqIds(main.concat(fam))};
}
function withPartyInfo(cb){
  if(typeof COFantasy!=='undefined'&&COFantasy&&typeof COFantasy.coiEquipePJ==='function'){
    try{
      COFantasy.coiEquipePJ(function(raw){
        if(!raw||!raw.found)return cb(fallbackPartyInfo());
        var famSet={},owners=raw.owners||{};
        (raw.familiars||[]).forEach(function(id){famSet[id]=1;});
        var main=(raw.members||[]).filter(function(cid){
          return getObj('character',cid)&&!famSet[cid]&&isPJ(cid)&&playerControlled(cid);
        });
        var fam=(raw.familiars||[]).filter(function(cid){return !!getObj('character',cid);});
        main=uniqIds(main).sort(function(a,b){return charName(a).localeCompare(charName(b));});
        fam=uniqIds(fam).sort(function(a,b){return charName(a).localeCompare(charName(b));});
        cb({
          found:true,
          handoutName:raw.handoutName||'Equipe PJ',
          main:main,
          familiars:fam,
          owners:owners,
          restGroup:uniqIds(main.concat(fam))
        });
      });
      return;
    }catch(e){log(SCRIPT+' : lecture Equipe PJ impossible : '+e.message);}
  }
  cb(fallbackPartyInfo());
}
function partyOwnerControls(pid,info,cid){
  if(playerIsGM(pid)||controls(pid,cid))return true;
  var owner=info&&info.owners?info.owners[cid]:null;
  return !!(owner&&controls(pid,owner));
}
function charName(cid){var c=getObj('character',cid);return c?c.get('name'):'Personnage';}
function isCombat(){return !!(state.COFantasy&&state.COFantasy.combat);}
function resource(cid,name){var a=attrObj(cid,name);if(!a)return{attr:null,current:0,max:0};var cur=int(a.get('current'),0),mx=int(a.get('max'),NaN);if(isNaN(mx))mx=int(getA(cid,name+'_max',0),0);return{attr:a,current:cur,max:mx};}
function manaResource(cid){

  var a=attrObj(cid,'pm'), aMax=attrObj(cid,'pm_max');
  var cur=a?int(a.get('current'),0):0;
  var mx=NaN;
  if(a)mx=int(a.get('max'),NaN);
  if(isNaN(mx)||mx<=0)mx=aMax?int(aMax.get('current'),0):0;
  if(isNaN(mx)||mx<=0)return{enabled:false,attr:a,maxAttr:aMax,current:0,max:0};
  return{enabled:true,attr:a,maxAttr:aMax,current:Math.max(0,cur),max:Math.max(0,mx)};
}
function setManaResource(cid,v){
  var r=manaResource(cid);
  if(!r.enabled)return false;
  if(!r.attr)r.attr=setA(cid,'pm',Math.max(0,int(v,0)));
  else r.attr.set('current',Math.max(0,int(v,0)));
  return true;
}
function setResource(cid,name,v){var r=resource(cid,name);if(!r.attr)r.attr=setA(cid,name,v);else r.attr.set('current',v);return r;}
function syncTokenBars(cid){
  var pv=resource(cid,'PV'),pm=manaResource(cid),
      toks=findObjs({_type:'graphic',_subtype:'token',represents:cid})||[];
  toks.forEach(function(t){
    var b1=t.get('bar1_link'),b2=t.get('bar2_link');
    if(pv.attr&&b1===pv.attr.id)t.set('bar1_value',resource(cid,'PV').current);
    if(pm.enabled&&pm.attr&&b2===pm.attr.id)t.set('bar2_value',manaResource(cid).current);
  });
}
function dice(n,sides){var total=0,rolls=[];for(var i=0;i<n;i++){var r=randomInteger(Math.max(1,sides));rolls.push(r);total+=r;}return{total:total,rolls:rolls};}
function modValue(cid,k){var v=int(getA(cid,k,NaN),NaN);if(!isNaN(v))return v;var names={FOR:'force',DEX:'dexterite',CON:'constitution',INT:'intelligence',SAG:'sagesse',CHA:'charisme'},score=int(getA(cid,names[k]||'',10),10);return Math.floor((score-10)/2);}
function pvRecovery(cid,count){var r=resource(cid,'PV');if(!r.attr||r.max<=0||r.current>=r.max)return{gain:0,detail:'PV déjà au maximum'};var dv=int(getA(cid,'DV',0),0);if(dv<4)return{gain:0,detail:'aucun Dé de Vie valide'};var con=modValue(cid,'CON'),niv=int(getA(cid,'niveau',1),1),gain=0,parts=[];for(var i=0;i<count&&r.current+gain<r.max;i++){var d=dice(1,dv).total,g=Math.max(0,d+con+niv);gain+=g;parts.push('d'+dv+'('+d+')+'+(con+niv));}gain=Math.min(gain,r.max-r.current);setResource(cid,'PV',r.current+gain);return{gain:gain,detail:parts.join(' ; ')};}
function manaCarac(cid){var raw=String(getA(cid,'carac_mana','@{INT}')),m=raw.match(/FOR|DEX|CON|INT|SAG|CHA/i),k=m?m[0].toUpperCase():'INT';return{k:k,mod:modValue(cid,k)};}
function pmRecovery(cid,count){
  var r=resource(cid,'pm');
  if(!r.attr||r.max<=0)return{gain:0,detail:'pas de mana'};
  if(r.current>=r.max)return{gain:0,detail:'PM déjà au maximum'};
  var de=int(getA(cid,'de_mana',0),0);
  if(de<1)return{gain:0,detail:'aucun Dé de Mana'};
  var car=manaCarac(cid),gain=0,parts=[];
  for(var i=0;i<count&&r.current+gain<r.max;i++){
    var d=dice(1,de).total,g=Math.max(0,d+car.mod);
    gain+=g;parts.push('d'+de+'('+d+')+'+car.k+'('+car.mod+')');
  }
  gain=Math.min(gain,r.max-r.current);
  setResource(cid,'pm',r.current+gain);
  return{gain:gain,detail:parts.join(' ; ')};
}
function prGain(cid,n,toMax){var r=resource(cid,'pr');if(!r.attr||r.max<=0)return{gain:0};var target=toMax?r.max:Math.min(r.max,r.current+Math.max(0,n)),gain=target-r.current;if(gain>0)setResource(cid,'pr',target);return{gain:gain};}
function clearRestBuff(cid){var raw=String(getA(cid,'predicats_script','')||''),lines=raw.split(/\r?\n/).filter(function(l){return l.indexOf(MARK)<0;});setA(cid,'predicats_script',lines.join('\n').replace(/^\n+|\n+$/g,''));setA(cid,'coi_repos_buff_source','');setA(cid,'coi_repos_buff_description','');setA(cid,'coi_repos_buff_predicats','');}
function applyRestBuff(cid,source,desc,pred){pred=String(pred||'').trim();setA(cid,'coi_repos_buff_source',source||'');setA(cid,'coi_repos_buff_description',desc||'');setA(cid,'coi_repos_buff_predicats',pred);if(!pred)return;var raw=String(getA(cid,'predicats_script','')||''),marked=pred.split(/\r?\n/).map(function(l){l=l.trim();return l?l+' '+MARK:'';}).filter(Boolean).join('\n');setA(cid,'predicats_script',(raw?raw+'\n':'')+marked);}
function moneyPC(cid){return Math.max(0,int(getA(cid,'bourse_pp',0),0))*1000000+Math.max(0,int(getA(cid,'bourse_po',0),0))*10000+Math.max(0,int(getA(cid,'bourse_pa',0),0))*100+Math.max(0,int(getA(cid,'bourse_pc',0),0));}
function costPC(value,unit){var mult={PP:1000000,PO:10000,PA:100,PC:1};return Math.max(0,Math.round(num(value,0)*(mult[String(unit||'PO').toUpperCase()]||10000)));}
function pay(cid,pc){var total=moneyPC(cid);if(total<pc)return false;total-=pc;var pp=Math.floor(total/1000000);total%=1000000;var po=Math.floor(total/10000);total%=10000;var pa=Math.floor(total/100),cu=total%100;setA(cid,'bourse_pp',pp);setA(cid,'bourse_po',po);setA(cid,'bourse_pa',pa);setA(cid,'bourse_pc',cu);return true;}
function fmtPC(pc){pc=Math.max(0,int(pc,0));var a=[],pp=Math.floor(pc/1000000);pc%=1000000;var po=Math.floor(pc/10000);pc%=10000;var pa=Math.floor(pc/100),cu=pc%100;if(pp)a.push(pp+' PP');if(po)a.push(po+' PO');if(pa)a.push(pa+' PA');if(cu||!a.length)a.push(cu+' PC');return a.join(' ');}
function coinUnit(raw){var x=String(raw||'').trim().toLowerCase().replace(/[éèêë]/g,'e').replace(/[àâä]/g,'a').replace(/[îï]/g,'i').replace(/[ôö]/g,'o').replace(/[ûüù]/g,'u');if(x==='pp'||x.indexOf('platine')>=0)return'PP';if(x==='po'||/(^|[^a-z])or([^a-z]|$)/.test(x))return'PO';if(x==='pa'||x.indexOf('argent')>=0)return'PA';if(x==='pc'||x.indexOf('cuivre')>=0)return'PC';return'';}
function fmtShare(pc,unit){pc=Math.max(0,int(pc,0));unit=coinUnit(unit)||'PC';var a=[];if(unit==='PP'){var pp=Math.floor(pc/1000000);pc%=1000000;if(pp)a.push(pp+' PP');}if(unit==='PP'||unit==='PO'){var po=Math.floor(pc/10000);pc%=10000;if(po)a.push(po+' PO');}if(unit!=='PC'){var pa=Math.floor(pc/100);pc%=100;if(pa)a.push(pa+' PA');}if(pc||!a.length)a.push(pc+' PC');return a.join(' ');}
function addLootShare(cid,pc,unit){pc=Math.max(0,int(pc,0));unit=coinUnit(unit)||'PC';var gain={PP:0,PO:0,PA:0,PC:0};if(unit==='PP'){gain.PP=Math.floor(pc/1000000);pc%=1000000;}if(unit==='PP'||unit==='PO'){gain.PO=Math.floor(pc/10000);pc%=10000;}if(unit!=='PC'){gain.PA=Math.floor(pc/100);pc%=100;}gain.PC=pc;['PP','PO','PA','PC'].forEach(function(k){if(!gain[k])return;var attr='bourse_'+k.toLowerCase();setA(cid,attr,Math.max(0,int(getA(cid,attr,0),0))+gain[k]);});return gain;}
function lootUnitFromContent(c){var m=String(c||'').match(/^!coi-butin\s+\d+\s+(.+)$/i);if(!m)return'';return coinUnit(m[1]);}
function lootPrompt(msg,amount,unit){var x='<div style="background:#fffaf2;border:1px solid #8a6a2f;padding:8px;border-radius:6px"><div style="font-size:15px;font-weight:bold;text-align:center">💰 PARTAGER UN BUTIN</div>';if(amount&&amount>0&&!unit){x+='<b>Montant :</b> '+amount+'<br><span style="font-size:10px">Choisis la monnaie :</span><br>'+btn('PP','!coi-butin '+amount+' PP','#8a6a2f')+btn('PO','!coi-butin '+amount+' PO','#8a6a2f')+btn('PA','!coi-butin '+amount+' PA','#8a6a2f')+btn('PC','!coi-butin '+amount+' PC','#8a6a2f');}else if(unit&&!amount){x+='<b>Monnaie :</b> '+unit+'<br>'+btn('Saisir le montant','!coi-butin ?{Montant|120} '+unit,'#8a6a2f');}else{x+='Tu peux lancer directement <code>!coi-butin 120 PA</code>, ou simplement utiliser le bouton ci-dessous :<br>'+btn('Saisir montant et monnaie','!coi-butin ?{Montant|120} ?{Monnaie|PA,PA|PO,PO|PC,PC|PP,PP}','#8a6a2f');}x+='<br><span style="font-size:10px">PJ principaux de l’Équipe PJ ; familiers exclus du partage.</span></div>';return whisper(msg,x);}
function distributeLoot(msg){
  if(!playerIsGM(msg.playerid))return whisper(msg,'Le partage de butin est réservé au MJ.');
  var c=String(msg.content||'').trim(),
      args=c.replace(/^!coi-butin\s*/i,'').trim().split(/\s+/).filter(Boolean);
  if(args.length===0)return lootPrompt(msg);

  var amount=0,unit='';
  if(/^\d+$/.test(args[0])){
    amount=Math.max(0,int(args[0],0));
    if(args.length>1)unit=coinUnit(args.slice(1).join(' '));
    if(!unit&&amount>0)return lootPrompt(msg,amount,'');
  }else{
    unit=coinUnit(args.join(' '));
    if(unit)return lootPrompt(msg,0,unit);
    return whisper(msg,'Format inconnu. Utilise <code>!coi-butin</code>, <code>!coi-butin 120</code> ou <code>!coi-butin 120 PA</code>.');
  }
  if(amount<=0)return whisper(msg,'Le montant doit être supérieur à 0.');
  if(!unit)return whisper(msg,'Monnaie inconnue. Utilise <b>PP</b>, <b>PO</b>, <b>PA</b> ou <b>PC</b>.');

  withPartyInfo(function(info){
    var group=info.main||[];
    if(!group.length)return whisper(msg,'Aucun PJ joueur trouvé dans '+esc(info.handoutName||'le groupe')+'.');

    var total=costPC(amount,unit),
        share=Math.floor(total/group.length),
        remainder=total-(share*group.length);
    if(share<=0)return whisper(msg,'Le butin est trop petit pour être partagé entre '+group.length+' PJ. Valeur totale : '+fmtShare(total,unit)+'.');

    var undoTx=COFantasyItemsUndoBridge.begin('COI : partage de butin '+amount+' '+unit,group,{
      names:['bourse_pp','bourse_po','bourse_pa','bourse_pc'],tokens:false
    });
    group.forEach(function(cid){addLootShare(cid,share,unit);});
    COFantasyItemsUndoBridge.commit(undoTx);

    var x='<div style="background:#fffaf2;border:1px solid #8a6a2f;padding:8px;border-radius:6px">'+
      '<div style="font-size:15px;font-weight:bold;text-align:center">💰 BUTIN PARTAGÉ</div>'+
      '<b>Source groupe :</b> '+esc(info.handoutName||'contrôleurs')+'<br>'+
      '<b>Butin :</b> '+amount+' '+unit+'<br>'+
      '<b>Participants :</b> '+group.length+' PJ<br>'+
      '<b>Part par PJ :</b> '+fmtShare(share,unit);
    if(remainder>0)x+='<br><b>Reste non distribué :</b> '+fmtShare(remainder,unit);
    x+='<hr>';
    group.forEach(function(cid){x+='<div><b>'+esc(charName(cid))+'</b> : +'+fmtShare(share,unit)+'</div>';});
    if(info.familiars&&info.familiars.length){
      x+='<div style="font-size:10px;color:#665;margin-top:5px">🐾 Familiers exclus du partage : '+
        esc(info.familiars.map(charName).join(', '))+'.</div>';
    }
    x+='</div>';
    whisper(msg,x);
  });
}
function rationRows(cid){var attrs=findObjs({_type:'attribute',_characterid:cid})||[],rows={};attrs.forEach(function(a){var m=/^(repeating_equipement_[^_]+_)(equip_nom|equip_qte|equip_usage)$/.exec(String(a.get('name')||''));if(!m)return;rows[m[1]]=rows[m[1]]||{prefix:m[1],cid:cid};rows[m[1]][m[2]]=a.get('current');if(m[2]==='equip_qte')rows[m[1]].qtyAttr=a;});var out=[];Object.keys(rows).forEach(function(k){var r=rows[k],name=String(r.equip_nom||'').toLowerCase(),usage=String(r.equip_usage||'').toLowerCase();if((usage==='ration'||name.indexOf('ration')>=0)&&int(r.equip_qte,0)>0)out.push(r);});return out;}
function rationCount(cid){return rationRows(cid).reduce(function(s,r){return s+Math.max(0,int(r.equip_qte,0));},0);}
function groupRations(group){return group.reduce(function(s,cid){return s+rationCount(cid);},0);}
function consumeNRations(cid,n){var need=Math.max(0,n),rows=rationRows(cid);for(var i=0;i<rows.length&&need>0;i++){var r=rows[i],q=int(r.equip_qte,0),use=Math.min(q,need),left=q-use;need-=use;if(left>0)r.qtyAttr.set('current',left);else{var attrs=findObjs({_type:'attribute',_characterid:cid})||[];attrs.forEach(function(a){if(String(a.get('name')||'').indexOf(r.prefix)===0)a.remove();});}}return n-need;}
function rationPlan(group,needed){var left=Math.max(0,needed),plan=[];for(var i=0;i<group.length&&left>0;i++){var cid=group[i],have=rationCount(cid),take=Math.min(have,left);if(take>0){plan.push({cid:cid,n:take});left-=take;}}return{needed:needed,missing:left,plan:plan};}
function applyRationPlan(plan){(plan||[]).forEach(function(p){consumeNRations(p.cid,p.n);});}
function ensureAction(cid){var a=findObjs({_type:'ability',_characterid:cid,name:'Afficher hébergement'});if(a&&a.length){a[0].set({action:'!coi-hebergement-show --character @{character_id}',istokenaction:true});return;}createObj('ability',{characterid:cid,name:'Afficher hébergement',action:'!coi-hebergement-show --character @{character_id}',istokenaction:true});}
function removeLodgingAction(cid){(findObjs({_type:'ability',_characterid:cid,name:'Afficher hébergement'})||[]).forEach(function(a){a.remove();});}
function isLodging(cid){var t=String(getA(cid,'type_personnage','')).toUpperCase(),cat=String(getA(cid,'objet_categorie','')).toLowerCase();return t===TYPE||(t===OBJET_TYPE&&cat==='hebergement');}
function syncLodgingAction(cid){
  if(isLodging(cid))ensureAction(cid);
  else removeLodgingAction(cid);
}
function lodgingData(cid){var c=getObj('character',cid);if(!c||!isLodging(cid))return null;return{id:cid,name:c.get('name'),quality:getA(cid,'hebergement_qualite','Confortable'),price:num(getA(cid,'hebergement_cout',0),0),unit:String(getA(cid,'hebergement_unite','PO')).toUpperCase(),tariff:String(getA(cid,'hebergement_tarification','personne')).toLowerCase(),meal:truth(getA(cid,'hebergement_repas','1')),pv:int(getA(cid,'hebergement_recup_pv',2),2),pm:int(getA(cid,'hebergement_recup_pm',2),2),pr:int(getA(cid,'hebergement_pr',1),1),pvMax:truth(getA(cid,'hebergement_pv_max','0')),pmMax:truth(getA(cid,'hebergement_pm_max','0')),prMax:truth(getA(cid,'hebergement_pr_max','0')),buff:getA(cid,'hebergement_buff_predicats',''),buffDesc:getA(cid,'hebergement_buff_description',''),description:getA(cid,'hebergement_description','')};}
function lodgingCard(d){var x='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:8px;border-radius:6px;max-width:350px"><div style="font-size:16px;font-weight:bold;text-align:center;color:#5b3213">🏨 '+esc(d.name)+'</div><div style="text-align:center;font-size:11px">'+esc(d.quality)+'</div>';if(d.description)x+='<p>'+esc(d.description)+'</p>';x+='<div style="background:#f4eadc;padding:6px;border-radius:5px"><b>Coût :</b> '+esc(d.price)+' '+esc(d.unit)+' / '+(d.tariff==='groupe'?'groupe':'personne')+'<br><b>Repas :</b> '+(d.meal?'compris':'non compris')+'<br><b>PV :</b> '+(d.pvMax?'maximum':d.pv+' récupération(s)')+'<br><b>Mana :</b> '+(d.pmMax?'maximum':d.pm+' récupération(s)')+'<br><b>PR :</b> '+(d.prMax?'maximum':'+'+d.pr)+'</div>';if(d.buffDesc||d.buff)x+='<div style="margin-top:5px"><b>Bonus jusqu’au prochain repos :</b><br>'+esc(d.buffDesc||d.buff)+'</div>';x+='<div style="text-align:center;margin-top:6px">'+btn('Repos du groupe ici','!coi-rest-lodging-direct --lodging '+d.id,'#3f6b45')+'</div></div>';return x;}
function showLodging(cid){var d=lodgingData(cid);if(d)sendChat(SCRIPT,lodgingCard(d));}
function makeLodging(name,preset){var c=createObj('character',{name:name||'Nouvel hébergement'});if(!c)return null;var p=preset||{};setA(c.id,'type_personnage',OBJET_TYPE);setA(c.id,'objet_categorie','hebergement');setA(c.id,'hebergement_qualite',p.quality||'Confortable');setA(c.id,'hebergement_cout',p.price===undefined?2:p.price);setA(c.id,'hebergement_unite',p.unit||'PO');setA(c.id,'hebergement_tarification',p.tariff||'personne');setA(c.id,'hebergement_repas',p.meal===false?'0':'1');setA(c.id,'hebergement_recup_pv',p.pv===undefined?3:p.pv);setA(c.id,'hebergement_recup_pm',p.pm===undefined?3:p.pm);setA(c.id,'hebergement_pr',p.pr===undefined?2:p.pr);setA(c.id,'hebergement_pv_max',p.pvMax?'1':'0');setA(c.id,'hebergement_pm_max',p.pmMax?'1':'0');setA(c.id,'hebergement_pr_max',p.prMax?'1':'0');setA(c.id,'hebergement_buff_description',p.buffDesc||'');setA(c.id,'hebergement_buff_predicats',p.buff||'');setA(c.id,'hebergement_description',p.description||'');ensureAction(c.id);return c;}
function lodgingLibrary(msg){var lod=[];(findObjs({_type:'character'})||[]).forEach(function(c){var d=lodgingData(c.id);if(d)lod.push(d);});lod.sort(function(a,b){return a.name.localeCompare(b.name);});var x='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:8px"><b>Hébergements / Repos</b><br>'+btn('+ Hébergement','!coi-new-hebergement --name ?{Nom|Auberge confortable}','#4f6f70')+btn('+ Modeste','!coi-new-hebergement --preset modeste --name ?{Nom|Auberge modeste}','#70543e')+btn('+ Confortable','!coi-new-hebergement --preset confortable --name ?{Nom|Auberge confortable}','#3f6b45')+btn('+ Luxe','!coi-new-hebergement --preset luxe --name ?{Nom|Auberge de luxe}','#76559a');lod.forEach(function(d){x+='<div style="border-top:1px solid #ddd;padding:4px"><b>'+esc(d.name)+'</b> — '+esc(d.quality)+'<br>'+btn('Afficher','!coi-hebergement-show --character '+d.id)+btn('Ouvrir','http://journal.roll20.net/character/'+d.id,'#555')+'</div>';});whisper(msg,x+'</div>');}
function preset(name){name=String(name||'').toLowerCase();if(name==='modeste')return{quality:'Modeste',price:5,unit:'PA',meal:true,pv:2,pm:2,pr:1};if(name==='luxe')return{quality:'Luxueux',price:10,unit:'PO',meal:true,pv:3,pm:3,pr:3,pvMax:true,pmMax:true,prMax:true};return{quality:'Confortable',price:2,unit:'PO',meal:true,pv:3,pm:3,pr:2};}
function store(){state.COFantasyRestV3=state.COFantasyRestV3||{sessions:{}};state.COFantasyRestV3.sessions=state.COFantasyRestV3.sessions||{};return state.COFantasyRestV3;}
function groupPCs(){
  var out=[];
  (findObjs({_type:'character'})||[]).forEach(function(c){
    if(!isPJ(c.id)||isFamiliar(c.id)||!playerControlled(c.id))return;
    out.push(c.id);
  });
  out.sort(function(a,b){return charName(a).localeCompare(charName(b));});
  return out;
}
function newSession(group,familiars,source){
  var id='R'+Date.now().toString(36)+Math.floor(Math.random()*46656).toString(36),
      fam=uniqIds(familiars||[]),
      restGroup=uniqIds((group||[]).concat(fam)),
      s={
        id:id,
        group:(group||[]).slice(),
        familiars:fam,
        restGroup:restGroup,
        groupSource:source||'',
        created:Date.now(),
        hunters:[],
        huntResults:[],
        portions:0
      };
  store().sessions[id]=s;
  return s;
}
function session(id){return store().sessions[id]||null;}
function groupSummary(group,familiars){
  var famSet={};(familiars||[]).forEach(function(id){famSet[id]=1;});
  var x='';
  (group||[]).forEach(function(cid){
    var pv=resource(cid,'PV'),pm=manaResource(cid),pr=resource(cid,'pr');
    x+='<div style="border-top:1px solid #dbc8af;padding:3px 0"><b>'+esc(charName(cid))+'</b> · PV '+pv.current+'/'+pv.max+
      (pm.max>0?' · PM '+pm.current+'/'+pm.max:'')+
      ' · PR '+pr.current+'/'+pr.max+
      (famSet[cid]?' · 🐾 familier (sans ration/paiement)':' · 🍖 '+rationCount(cid))+
      '</div>';
  });
  return x;
}
function partyDiagnostic(msg){
  if(!playerIsGM(msg.playerid))return;
  withPartyInfo(function(info){
    var x='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:8px;border-radius:6px">'+
      '<b>👥 Groupe COI</b><br><b>Source :</b> '+esc(info.handoutName||'détection contrôleurs')+
      '<hr><b>PJ principaux</b> — butin, rations, paiement, chasse<br>';
    if(info.main.length)info.main.forEach(function(cid){x+='• '+esc(charName(cid))+'<br>';});
    else x+='<i>Aucun</i><br>';
    x+='<hr><b>Familiers</b> — repos oui, coût/ration non<br>';
    if(info.familiars.length)info.familiars.forEach(function(cid){
      var owner=info.owners&&info.owners[cid]?charName(info.owners[cid]):'maître non identifié';
      x+='🐾 '+esc(charName(cid))+' <span style="font-size:10px">('+esc(owner)+')</span><br>';
    });
    else x+='<i>Aucun détecté</i><br>';
    x+='</div>';
    whisper(msg,x);
  });
}
function restMenu(msg){
  if(!playerIsGM(msg.playerid))return whisper(msg,'Le repos long du groupe est une action du MJ. Utilise <b>Pause 5 min</b> sur ta fiche pour une récupération rapide.');
  if(isCombat())return whisper(msg,'Impossible de lancer un repos long pendant un combat.');

  withPartyInfo(function(info){
    var group=info.main||[],fam=info.familiars||[];
    if(!group.length)return whisper(msg,'Aucun PJ joueur trouvé dans '+esc(info.handoutName||'le groupe')+'.');

    var s=newSession(group,fam,info.handoutName),
        x='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:8px;border-radius:6px">'+
          '<div style="font-size:16px;font-weight:bold;text-align:center">🌙 REPOS DU GROUPE</div>'+
          '<div style="font-size:10px;text-align:center">Source : '+esc(info.handoutName||'contrôleurs')+'</div>'+
          groupSummary(s.restGroup,s.familiars);

    if(fam.length){
      x+='<div style="font-size:10px;color:#566;margin-top:4px">🐾 Les familiers récupèrent avec le groupe mais ne consomment pas de ration, ne paient pas l’hébergement et ne prennent pas de part de butin.</div>';
    }
    x+='<hr>'+btn('🏕 Bivouac','!coi-rest-bivouac --sid '+s.id,'#5a704d')+
      btn('🏨 Hébergement','!coi-rest-lodgings --sid '+s.id,'#4f6f70')+'</div>';
    whisper(msg,x);
  });
}
function bivouacMenu(msg,s){
  var rations=groupRations(s.group);
  var x='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:8px">'+
    '<b>🏕 Bivouac — '+s.group.length+' PJ</b><br>'+
    'Rations disponibles : <b>'+rations+'</b><br>'+
    '<span style="font-size:10px">Personnage nourri : 2 récupérations PV, 2 Mana, +1 PR. '+
    'Personnage non nourri : 1 récupération PV, 1 Mana, +0 PR.</span><hr>'+
    btn(rations>=s.group.length?'Utiliser les rations':'Répartir les rations',
      '!coi-rest-food-menu --sid '+s.id+' --mode ration','#3f6b45')+
    btn('Organiser une chasse','!coi-hunt-env --sid '+s.id,'#7a5b35')+
    '</div>';
  whisper(msg,x);
}
function huntEnvMenu(msg,s){var x='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:8px"><b>🦌 Chasse — difficulté de Survie</b><br><span style="font-size:10px">Les portions obtenues ne sont conservables que pour cette nuit.</span><hr>';HUNT_DDS.forEach(function(h){x+=btn(h.label+' — DD '+h.dd,'!coi-hunt-set --sid '+s.id+' --dd '+h.dd,'#6c5639');});x+=btn('DD personnalisé','!coi-hunt-set --sid '+s.id+' --dd ?{DD de Survie|12}','#555')+'</div>';whisper(msg,x);}
function huntLabel(dd){for(var i=0;i<HUNT_DDS.length;i++)if(HUNT_DDS[i].dd===dd)return HUNT_DDS[i].label;return 'DD personnalisé';}
function hunterMenu(msg,s){var x='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:8px"><b>🦌 Chasse — '+esc(s.huntLabel)+' (DD '+s.huntDD+')</b><br>Choisis les chasseurs.<br><span style="font-size:10px">Chaque chasseur subit -1 récupération PV et -1 récupération Mana, réussite ou échec. Prédicat spécial : <b>bonusChasse:X</b>.</span><hr>';s.group.forEach(function(cid){var on=s.hunters.indexOf(cid)>=0;x+=btn((on?'✓ ':'')+charName(cid),'!coi-hunt-toggle --sid '+s.id+' --character '+cid,on?'#3f6b45':'#777');});x+='<hr>'+btn('Lancer la chasse','!coi-hunt-run --sid '+s.id,'#7a5b35')+btn('Changer le terrain','!coi-hunt-env --sid '+s.id,'#555')+'</div>';whisper(msg,x);}
function localPredicateBonus(cid,key){var total=0,k=String(key).toLowerCase(),sources=[];sources.push(String(getA(cid,'predicats_script','')||''));var attrs=findObjs({_type:'attribute',_characterid:cid})||[],equip={};attrs.forEach(function(a){var n=String(a.get('name')||'');if(/_equipearmure$/.test(n))equip[n.replace(/_equipearmure$/,'')]=truth(a.get('current'));});attrs.forEach(function(a){var n=String(a.get('name')||'');if(/_effetarmure$/.test(n)){var p=n.replace(/_effetarmure$/,'');if(equip[p])sources.push(String(a.get('current')||''));}else if(/_armepredicats$/.test(n))sources.push(String(a.get('current')||''));});var re=new RegExp('(?:^|[\\s,;])'+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\s*[:=]?\\s*([+-]?\\d+)','ig');sources.forEach(function(src){var m;while((m=re.exec(src.toLowerCase()))!==null)total+=int(m[1],0);});return total;}
function survivalSkillBonus(cid){var attrs=findObjs({_type:'attribute',_characterid:cid})||[],rows={};attrs.forEach(function(a){var m=/^(repeating_competences_[^_]+_comp_)(nom|bonusTotal)$/.exec(String(a.get('name')||''));if(!m)return;rows[m[1]]=rows[m[1]]||{};rows[m[1]][m[2]]=a.get('current');});var b=0;Object.keys(rows).forEach(function(k){if(String(rows[k].nom||'').toLowerCase()==='survie')b=Math.max(b,int(rows[k].bonusTotal,0));});return b;}
function fallbackHuntTest(cid,dd,cb){var die=randomInteger(20),bonus=modValue(cid,'SAG')+survivalSkillBonus(cid)+localPredicateBonus(cid,'bonusTests_survie')+localPredicateBonus(cid,'survie')+localPredicateBonus(cid,'bonusChasse'),total=die+bonus;cb({valeur:total,die:die,reussite:die===20||(die!==1&&total>=dd),critique:die===20,echecCritique:die===1,texte:'1d20('+die+') '+(bonus>=0?'+':'')+bonus,explications:['Calcul de secours (API COFantasy native indisponible)']});}
function huntTest(cid,dd,cb){if(typeof COFantasy!=='undefined'&&COFantasy&&typeof COFantasy.coiTestSurvie==='function'){COFantasy.coiTestSurvie(cid,dd,function(r){if(r)cb(r);else fallbackHuntTest(cid,dd,cb);});}else fallbackHuntTest(cid,dd,cb);}
function portionsFor(r,dd){if(!r||!r.reussite)return 0;var margin=int(r.valeur,0)-dd,p=margin>=10?4:(margin>=5?3:2);if(r.critique)p++;return Math.min(5,p);}
function runHunt(msg,s){if(!s.hunters.length)return whisper(msg,'Choisis au moins un chasseur.');s.huntResults=[];s.portions=0;var i=0;function next(){if(i>=s.hunters.length){showHuntResults(msg,s);return;}var cid=s.hunters[i++];huntTest(cid,s.huntDD,function(r){var p=portionsFor(r,s.huntDD);s.huntResults.push({cid:cid,result:r,portions:p});s.portions+=p;next();});}next();}
function showHuntResults(msg,s){
  var need=s.group.length, rations=groupRations(s.group),
      fresh=Math.max(0,int(s.portions,0)),
      available=Math.min(need,fresh+rations),
      x='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:8px"><b>🦌 Résultat de la chasse</b><br>';
  s.huntResults.forEach(function(hr){
    var r=hr.result,margin=int(r.valeur,0)-s.huntDD;
    x+='<div style="border-top:1px solid #ddd;padding:4px"><b>'+esc(charName(hr.cid))+'</b> : '+
      esc(r.texte||r.valeur)+' — '+(r.reussite?'réussite':'échec')+
      (r.reussite?' (marge '+(margin>=0?'+':'')+margin+')':'')+
      ' → <b>'+hr.portions+' portion(s)</b></div>';
  });
  x+='<hr>Portions fraîches : <b>'+fresh+'</b> · Rations : <b>'+rations+'</b><br>'+
     'Nourriture disponible : <b>'+available+' / '+need+' PJ</b>.';
  if(available<need){
    x+='<div style="color:#9b2e22;font-weight:bold">Tout le groupe ne pourra pas manger. Choisis les personnages nourris.</div>';
  }else{
    x+='<div style="font-size:10px">Le groupe peut être entièrement nourri. Le surplus éventuel de chasse sera perdu.</div>';
  }
  x+='<br>'+btn(available<need?'Choisir qui mange':'Préparer le bivouac',
      '!coi-rest-food-menu --sid '+s.id+' --mode hunt','#3f6b45')+
     btn('Recommencer le choix','!coi-hunt-env --sid '+s.id,'#555')+'</div>';
  whisper(msg,x);
}
function planText(plan){
  if(!plan.plan.length)return 'Aucune ration d’inventaire.';
  return plan.plan.map(function(p){return esc(charName(p.cid))+' : '+p.n;}).join('<br>');
}

function foodContext(s,mode){
  mode=String(mode||'ration');
  var portions=mode==='hunt'?Math.max(0,int(s.portions,0)):0;
  var rations=groupRations(s.group);
  return {
    mode:mode,
    portions:portions,
    rations:rations,
    capacity:Math.min(s.group.length,portions+rations)
  };
}
function prepareFoodRest(msg,s,mode,nourished){
  var ctx=foodContext(s,mode), fed=(nourished||[]).filter(function(cid){return s.group.indexOf(cid)>=0;});
  var unique=[];
  fed.forEach(function(cid){if(unique.indexOf(cid)<0)unique.push(cid);});
  fed=unique.slice(0,ctx.capacity);
  var rationNeed=Math.max(0,fed.length-ctx.portions),plan=rationPlan(s.group,rationNeed);
  if(plan.missing>0)return whisper(msg,'Les rations disponibles ont changé. Relance la répartition de nourriture.');
  var d={
    id:'',name:mode==='hunt'?'Bivouac avec chasse':'Bivouac',quality:'Bivouac',
    price:0,unit:'PC',tariff:'groupe',meal:false,pv:2,pm:2,pr:1,
    pvMax:false,pmMax:false,prMax:false,buff:'',buffDesc:'',description:''
  };
  s.pending={
    kind:'bivouac',
    food:mode,
    nourished:fed.slice(),
    lodging:d,
    rationPlan:plan.plan,
    hunters:mode==='hunt'?s.hunters.slice():[],
    portions:mode==='hunt'?s.portions:0
  };
  var hungry=s.group.filter(function(cid){return fed.indexOf(cid)<0;});
  var x='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:8px"><b>🏕 Récapitulatif bivouac</b><br>'+
    '<b>Nourris :</b> '+(fed.length?fed.map(charName).map(esc).join(', '):'personne')+'<br>'+
    '<b>Sans nourriture :</b> '+(hungry.length?hungry.map(charName).map(esc).join(', '):'personne')+'<br>';
  if(mode==='hunt')x+='Portions de chasse utilisées : <b>'+Math.min(ctx.portions,fed.length)+'</b><br>';
  x+='Rations d’inventaire utilisées : <b>'+rationNeed+'</b>';
  if(plan.plan.length)x+='<br>'+planText(plan);
  if(hungry.length)x+='<br><span style="font-size:10px;color:#8a5a32">Sans nourriture : 1 récupération PV, 1 Mana, +0 PR.</span>';
  x+='<hr>'+btn('VALIDER LE REPOS','!coi-rest-final --sid '+s.id,'#2f6b3f')+
    btn('Modifier qui mange','!coi-rest-food-menu --sid '+s.id+' --mode '+mode,'#777')+'</div>';
  whisper(msg,x);
}
function foodMenu(msg,s,mode,reset){
  var ctx=foodContext(s,mode);
  if(ctx.capacity>=s.group.length){
    return prepareFoodRest(msg,s,mode,s.group.slice());
  }
  if(reset||!s.foodChoice||s.foodChoice.mode!==mode){
    s.foodChoice={mode:mode,selected:[]};
  }
  var selected=s.foodChoice.selected||[];
  selected=selected.filter(function(cid){return s.group.indexOf(cid)>=0;}).slice(0,ctx.capacity);
  s.foodChoice.selected=selected;
  var x='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:8px">'+
    '<b>🍖 Qui mange cette nuit ?</b><br>'+
    'Nourriture disponible : <b>'+ctx.capacity+' / '+s.group.length+' PJ</b>';
  if(mode==='hunt')x+='<br>Portions fraîches : '+ctx.portions+' · Rations : '+ctx.rations;
  else x+='<br>Rations : '+ctx.rations;
  x+='<br><span style="font-size:10px">Clique sur les personnages qui seront nourris. '+
    'Les autres dormiront sans manger.</span><hr>';
  s.group.forEach(function(cid){
    var on=selected.indexOf(cid)>=0;
    x+=btn((on?'✓ ':'')+charName(cid)+(on?' — mange':' — sans nourriture'),
      '!coi-rest-food-toggle --sid '+s.id+' --mode '+mode+' --character '+cid,
      on?'#3f6b45':'#8a5a32');
  });
  x+='<hr><b>'+selected.length+' / '+ctx.capacity+'</b> place(s) de nourriture attribuée(s)<br>'+
    btn('Continuer','!coi-rest-food-confirm --sid '+s.id+' --mode '+mode,'#2f6b3f')+
    btn('Retour','!coi-rest-bivouac --sid '+s.id,'#777')+'</div>';
  whisper(msg,x);
}
function foodToggle(msg,s,mode,cid){
  var ctx=foodContext(s,mode);
  if(!s.foodChoice||s.foodChoice.mode!==mode)s.foodChoice={mode:mode,selected:[]};
  if(s.group.indexOf(cid)<0)return;
  var selected=s.foodChoice.selected,ix=selected.indexOf(cid);
  if(ix>=0)selected.splice(ix,1);
  else{
    if(selected.length>=ctx.capacity){
      whisper(msg,'Il n’y a pas assez de nourriture pour nourrir un personnage supplémentaire.');
      return foodMenu(msg,s,mode,false);
    }
    selected.push(cid);
  }
  foodMenu(msg,s,mode,false);
}

function prepareCamp(msg,s,food){
  food=String(food||'ration');
  if(food==='none')return prepareFoodRest(msg,s,'ration',[]);
  return foodMenu(msg,s,'ration',true);
}
function prepareHuntCamp(msg,s){
  return foodMenu(msg,s,'hunt',true);
}
function lodgingList(msg,s){var lod=[];(findObjs({_type:'character'})||[]).forEach(function(c){var d=lodgingData(c.id);if(d)lod.push(d);});lod.sort(function(a,b){return a.name.localeCompare(b.name);});var x='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:8px"><b>🏨 Choisir un hébergement</b><br>';if(!lod.length)x+='Aucun hébergement créé.';lod.forEach(function(d){x+=btn(d.name+' — '+d.price+' '+d.unit,'!coi-rest-lodging --sid '+s.id+' --lodging '+d.id,'#4f6f70');});x+='</div>';whisper(msg,x);}
function lodgingPaymentMenu(msg,s,d,food){var per=costPC(d.price,d.unit),total=d.tariff==='groupe'?per:per*s.group.length,x='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:8px"><b>🏨 '+esc(d.name)+'</b><br>'+esc(d.quality)+' · '+s.group.length+' PJ<br>Coût : <b>'+fmtPC(total)+'</b> '+(d.tariff==='groupe'?'(forfait groupe)':'('+d.price+' '+d.unit+' / personne)')+'<br>Repas : '+(d.meal?'compris':(food==='ration'?'rations du groupe':'sans repas'))+'<br>Repos : '+(d.pvMax?'PV max':d.pv+'× PV')+' · '+(d.pmMax?'PM max':d.pm+'× Mana')+' · '+(d.prMax?'PR max':'+'+d.pr+' PR');if(d.buffDesc||d.buff)x+='<br>✨ '+esc(d.buffDesc||d.buff);x+='<hr><b>Paiement</b><br>'+btn('Chacun paie','!coi-rest-pay --sid '+s.id+' --mode each','#5f7044')+btn('Un PJ paie tout','!coi-rest-pay --sid '+s.id+' --mode choose','#6b4b2a')+btn('Offert / aucun paiement','!coi-rest-pay --sid '+s.id+' --mode offered','#555')+'</div>';s.lodgingChoice={lodgingId:d.id,food:food};whisper(msg,x);}
function lodgingChoice(msg,s,d){if(d.meal)return lodgingPaymentMenu(msg,s,d,'included');var x='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:8px"><b>'+esc(d.name)+'</b><br>Le repas n’est pas compris.<br>Rations du groupe : '+groupRations(s.group)+'<hr>'+btn('Utiliser les rations','!coi-rest-lodging-food --sid '+s.id+' --lodging '+d.id+' --food ration','#3f6b45')+btn('Sans repas','!coi-rest-lodging-food --sid '+s.id+' --lodging '+d.id+' --food none','#8a5a32')+'</div>';whisper(msg,x);}
function choosePayer(msg,s){var d=lodgingData(s.lodgingChoice&&s.lodgingChoice.lodgingId);if(!d)return whisper(msg,'Hébergement introuvable.');var total=(d.tariff==='groupe'?1:s.group.length)*costPC(d.price,d.unit),x='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:8px"><b>Qui paie '+fmtPC(total)+' ?</b><br>';s.group.forEach(function(cid){x+=btn(charName(cid)+' ('+fmtPC(moneyPC(cid))+')','!coi-rest-pay --sid '+s.id+' --mode payer --payer '+cid,'#6b4b2a');});x+='</div>';whisper(msg,x);}
function paymentPlan(s,d,mode,payer){var per=costPC(d.price,d.unit),total=d.tariff==='groupe'?per:per*s.group.length,alloc=[];if(mode==='offered')return{ok:true,total:0,alloc:[]};if(mode==='payer'){if(s.group.indexOf(payer)<0)return{ok:false,error:'Payeur invalide.'};alloc=[{cid:payer,pc:total}];}else if(mode==='each'){if(d.tariff!=='groupe'){s.group.forEach(function(cid){alloc.push({cid:cid,pc:per});});}else{var base=Math.floor(total/s.group.length),rem=total%s.group.length;s.group.forEach(function(cid,i){alloc.push({cid:cid,pc:base+(i<rem?1:0)});});}}else return{ok:false,error:'Mode de paiement invalide.'};for(var i=0;i<alloc.length;i++)if(moneyPC(alloc[i].cid)<alloc[i].pc)return{ok:false,error:charName(alloc[i].cid)+' n’a pas assez d’argent (besoin '+fmtPC(alloc[i].pc)+', possède '+fmtPC(moneyPC(alloc[i].cid))+').'};return{ok:true,total:total,alloc:alloc};}
function prepareLodgingFinal(msg,s,mode,payer){var lc=s.lodgingChoice||{},d=lodgingData(lc.lodgingId);if(!d)return whisper(msg,'Hébergement introuvable.');var food=lc.food||'none',rationNeed=(!d.meal&&food==='ration')?s.group.length:0,rplan=rationPlan(s.group,rationNeed);if(rplan.missing>0)return whisper(msg,'Il manque '+rplan.missing+' ration(s) pour nourrir tout le groupe.');var pp=paymentPlan(s,d,mode,payer);if(!pp.ok)return whisper(msg,pp.error);s.pending={kind:'lodging',food:food,lodging:d,rationPlan:rplan.plan,hunters:[],payment:pp};var x='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:8px"><b>RÉCAPITULATIF</b><br><b>'+esc(d.name)+'</b> — '+s.group.length+' PJ<br>Paiement : '+(pp.total?fmtPC(pp.total):'offert')+'<br>Nourriture : '+(d.meal?'repas compris':food==='ration'?'rations':'sans repas')+'<br>PV : '+(d.pvMax?'maximum':d.pv+' récupération(s)')+'<br>Mana : '+(d.pmMax?'maximum':d.pm+' récupération(s)')+'<br>PR : '+(d.prMax?'maximum':'+'+d.pr);if(d.buffDesc||d.buff)x+='<br>✨ '+esc(d.buffDesc||d.buff);x+='<hr>'+btn('VALIDER LE REPOS','!coi-rest-final --sid '+s.id,'#2f6b3f')+btn('Annuler','!coi-repos','#777')+'</div>';whisper(msg,x);}
function anyToken(cid){var t=findObjs({_type:'graphic',_subtype:'token',represents:cid})||[];return t.length?t[0]:null;}
function nextDayGroup(group,pid){if(typeof COFantasy==='undefined'||!COFantasy||typeof COFantasy.apiCommand!=='function')return false;var sel=[];group.forEach(function(cid){var t=anyToken(cid);if(t)sel.push({_type:'graphic',_id:t.id});});if(!sel.length)return false;try{COFantasy.apiCommand({type:'api',content:'!cof-nouveau-jour',playerid:pid,who:'COFantasy Repos',selected:sel});return true;}catch(e){log(SCRIPT+' : nouveau jour COFantasy non déclenché : '+e.message);return false;}}
function recoverCharacter(cid,d,nourished,hunter){var pvCount=Math.max(0,d.pv),pmCount=Math.max(0,d.pm),prN=Math.max(0,d.pr),pvMax=d.pvMax,pmMax=d.pmMax,prMax=d.prMax;if(!nourished){pvCount=Math.max(0,pvCount-1);pmCount=Math.max(0,pmCount-1);prN=Math.max(0,prN-1);pvMax=false;pmMax=false;prMax=false;}if(hunter){pvCount=Math.max(0,pvCount-1);pmCount=Math.max(0,pmCount-1);pvMax=false;pmMax=false;}var pv=resource(cid,'PV'),pm=resource(cid,'pm'),pvR={gain:0,detail:''},pmR={gain:0,detail:''};if(pvMax&&pv.max>0){pvR.gain=Math.max(0,pv.max-pv.current);setResource(cid,'PV',pv.max);pvR.detail='PV maximum';}else pvR=pvRecovery(cid,pvCount);if(pm.max>0){if(pmMax){pmR.gain=Math.max(0,pm.max-pm.current);setResource(cid,'pm',pm.max);pmR.detail='PM maximum';}else pmR=pmRecovery(cid,pmCount);}var prR=prGain(cid,prN,prMax);syncTokenBars(cid);return{pv:pvR,pm:pmR,pr:prR,pvCount:pvCount,pmCount:pmCount,prN:prN};}

function restRollMessage(cid,entries,cb){
  if(!entries.length)return cb([]);
  var pvParts=[],pmParts=[];
  entries.forEach(function(e){
    var expr='1d'+e.sides+(e.mod>=0?'+':'')+e.mod;
    if(e.kind==='pv')pvParts.push('[['+expr+']]');
    else pmParts.push('[['+expr+']]');
  });
  var x='/w gm <b>🎲 Repos — '+esc(charName(cid))+'</b>';
  if(pvParts.length)x+='<br>PV : '+pvParts.join(' ');
  if(pmParts.length)x+='<br>Mana : '+pmParts.join(' ');
  sendChat(SCRIPT,x,function(res){
    var inline=(res&&res[0]&&res[0].inlinerolls)||[],totals=[];
    entries.forEach(function(e,i){
      var t=inline[i]&&inline[i].results?num(inline[i].results.total,NaN):NaN;
      if(isNaN(t))t=randomInteger(Math.max(1,e.sides))+e.mod;
      totals.push(Math.max(0,t));
    });
    cb(totals);
  });
}
function recoveryRolls(cid,label,count,sides,mod,cb){
  count=Math.max(0,int(count,0));
  sides=Math.max(1,int(sides,1));
  if(count<=0)return cb({gain:0,rolls:[]});
  var parts=[];
  for(var i=0;i<count;i++)parts.push('[[1d'+sides+(mod>=0?'+':'')+mod+']]');
  sendChat(SCRIPT,'/w gm <b>🎲 Repos — '+esc(charName(cid))+'</b><br>'+esc(label)+' : '+parts.join(' '),function(res){
    var inline=(res&&res[0]&&res[0].inlinerolls)||[],rolls=[],gain=0;
    for(var j=0;j<count;j++){
      var t=inline[j]&&inline[j].results?num(inline[j].results.total,NaN):NaN;
      if(isNaN(t))t=randomInteger(sides)+mod;
      t=Math.max(0,t);
      rolls.push(t);
      gain+=t;
    }
    cb({gain:gain,rolls:rolls});
  });
}

function recoverCharacterAsync(cid,d,nourished,hunter,cb){
  var pvCount=Math.max(0,int(d.pv,0)),
      pmCount=Math.max(0,int(d.pm,0)),
      prN=Math.max(0,int(d.pr,0)),
      pvMax=!!d.pvMax,
      pmMax=!!d.pmMax,
      prMax=!!d.prMax;

  if(!nourished){
    pvCount=Math.max(0,pvCount-1);
    pmCount=Math.max(0,pmCount-1);
    prN=Math.max(0,prN-1);
    pvMax=false;
    pmMax=false;
    prMax=false;
  }
  if(hunter){
    pvCount=Math.max(0,pvCount-1);
    pmCount=Math.max(0,pmCount-1);
    pvMax=false;
    pmMax=false;
  }

  var result={
    pv:{gain:0,detail:''},
    pm:{gain:0,detail:'pas de mana'},
    pr:{gain:0},
    pvCount:pvCount,
    pmCount:pmCount,
    prN:prN
  };

  function finishPR(){
    result.pr=prGain(cid,prN,prMax);
    syncTokenBars(cid);
    cb(result);
  }

  function doMana(){
    var mana=manaResource(cid);

    if(!mana.enabled){
      result.pm.detail='pas de mana';
      return finishPR();
    }

    if(pmMax){
      result.pm.gain=Math.max(0,mana.max-mana.current);
      setManaResource(cid,mana.max);
      result.pm.detail='PM maximum';
      return finishPR();
    }

    if(pmCount<=0){
      result.pm.detail='aucune récupération Mana';
      return finishPR();
    }

    if(mana.current>=mana.max){
      result.pm.detail='PM déjà au maximum';
      return finishPR();
    }

    var de=int(getA(cid,'de_mana',0),0);
    if(de<1){

      result.pm.detail='aucun Dé de Mana';
      return finishPR();
    }

    var car=manaCarac(cid);
    recoveryRolls(cid,'Mana',pmCount,de,car.mod,function(rr){
      var gain=Math.min(rr.gain,Math.max(0,mana.max-mana.current));
      result.pm.gain=gain;
      result.pm.detail=pmCount+' jet(s) de récupération';
      setManaResource(cid,mana.current+gain);
      finishPR();
    });
  }

  function doPV(){
    var pv=resource(cid,'PV');

    if(pvMax&&pv.max>0){
      result.pv.gain=Math.max(0,pv.max-pv.current);
      setResource(cid,'PV',pv.max);
      result.pv.detail='PV maximum';
      return doMana();
    }

    if(!pv.attr||pv.max<=0){
      result.pv.detail='PV maximum introuvable';
      return doMana();
    }

    if(pv.current>=pv.max){
      result.pv.detail='PV déjà au maximum';
      return doMana();
    }

    if(pvCount<=0){
      result.pv.detail='aucune récupération PV';
      return doMana();
    }

    var dv=int(getA(cid,'DV',0),0);
    if(dv<4){
      result.pv.detail='aucun Dé de Vie valide';
      return doMana();
    }

    var pvMod=modValue(cid,'CON')+int(getA(cid,'niveau',1),1);
    recoveryRolls(cid,'PV',pvCount,dv,pvMod,function(rr){
      var gain=Math.min(rr.gain,Math.max(0,pv.max-pv.current));
      result.pv.gain=gain;
      result.pv.detail=pvCount+' jet(s) de récupération';
      setResource(cid,'PV',pv.current+gain);

      doMana();
    });
  }

  doPV();
}

function finalizeRest(msg,s){
  if(!s.pending)return whisper(msg,'Aucun repos préparé.');
  if(isCombat())return whisper(msg,'Impossible de valider pendant un combat.');
  var p=s.pending,d=p.lodging;
  if(p.payment){
    for(var i=0;i<p.payment.alloc.length;i++){
      if(moneyPC(p.payment.alloc[i].cid)<p.payment.alloc[i].pc)
        return whisper(msg,'Paiement devenu impossible pour '+esc(charName(p.payment.alloc[i].cid))+'.');
    }
  }

  var undoScope={
    names:[
      'PV','pm','pr',
      'bourse_pp','bourse_po','bourse_pa','bourse_pc',
      'predicats_script',
      'coi_repos_buff_source','coi_repos_buff_description','coi_repos_buff_predicats'
    ],
    prefixes:['repeating_equipement_'],
    tokens:true
  };
  var restGroup=(s.restGroup&&s.restGroup.length)?s.restGroup:s.group;
  var undoTx=COFantasyItemsUndoBridge.begin('COI : repos '+d.name,restGroup,undoScope);
  var nativeDayEvent=false;

  try{
    if(p.payment)p.payment.alloc.forEach(function(a){pay(a.cid,a.pc);});
    applyRationPlan(p.rationPlan);
    restGroup.forEach(clearRestBuff);
    nativeDayEvent=nextDayGroup(restGroup,msg.playerid);
  }catch(e){
    COFantasyItemsUndoBridge.commit(undoTx,{
      mergeLastEvent:nativeDayEvent,
      expectedType:nativeDayEvent?'nouveauJour':undefined
    });
    log(SCRIPT+' : erreur préparation repos : '+e.message);
    return whisper(msg,'Erreur pendant la préparation du repos : '+esc(e.message)+'. Tu peux utiliser <b>!cof-undo</b>.');
  }

  var hunters=p.hunters||[],
      nourished=Array.isArray(p.nourished)?p.nourished.slice():(p.food==='none'?[]:s.group.slice()),
      lines=[],idx=0;
  (s.familiars||[]).forEach(function(fid){if(nourished.indexOf(fid)<0)nourished.push(fid);});

  function finish(){
    var rationUsed=(p.rationPlan||[]).reduce(function(a,b){return a+b.n;},0),
        x='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:8px"><b>🌅 REPOS TERMINÉ — '+esc(d.name)+'</b>'+
          (p.portions?'<br>🦌 Portions fraîches disponibles : '+p.portions+' (surplus perdu après cette nuit)':'')+
          (rationUsed?'<br>🍖 Rations consommées : '+rationUsed:'')+
          (p.payment&&p.payment.total?'<br>💰 Paiement : '+fmtPC(p.payment.total):'')+
          lines.join('');
    if(d.buffDesc||d.buff)x+='<br>✨ Buff jusqu’au prochain repos : '+esc(d.buffDesc||d.buff);
    x+='</div>';
    delete store().sessions[s.id];
    COFantasyItemsUndoBridge.commit(undoTx,{
      mergeLastEvent:nativeDayEvent,
      expectedType:nativeDayEvent?'nouveauJour':undefined
    });
    whisper(msg,x);
  }

  function next(){
    if(idx>=restGroup.length)return finish();
    var cid=restGroup[idx++],
        isNourished=nourished.indexOf(cid)>=0,
        isHunter=hunters.indexOf(cid)>=0;
    recoverCharacterAsync(cid,d,isNourished,isHunter,function(r){
      try{
        applyRestBuff(cid,d.name,d.buffDesc,d.buff);
        var pm=manaResource(cid);
        lines.push('<div style="border-top:1px solid #ddd;padding:3px"><b>'+esc(charName(cid))+'</b> : '+
          '♥ +'+r.pv.gain+
          (pm.max>0?' · ✦ +'+r.pm.gain:'')+
          ' · ● +'+r.pr.gain+
          (!isNourished?' <span style="color:#8a5a32">(sans nourriture)</span>':'')+
          (isHunter?' <span style="color:#8a5a32">(chasse : -1 récup. PV/Mana)</span>':'')+
          ((s.familiars||[]).indexOf(cid)>=0?' <span style="color:#566">(🐾 familier)</span>':'')+
          '</div>');
        next();
      }catch(e){
        log(SCRIPT+' : erreur récupération de '+charName(cid)+' : '+e.message);
        lines.push('<div style="color:#9b2e22"><b>'+esc(charName(cid))+'</b> : erreur '+esc(e.message)+'</div>');
        next();
      }
    });
  }
  next();
}
function pause(msg,cid){
  if(isCombat())return whisper(msg,'Impossible de faire une pause pendant un combat.');
  if(!getObj('character',cid))return whisper(msg,'Personnage invalide pour une pause.');

  withPartyInfo(function(info){
    var isTeamFam=(info.familiars||[]).indexOf(cid)>=0,
        normalPJ=isPJ(cid)&&!isTeamFam;

    if(!normalPJ&&!isTeamFam)return whisper(msg,'Personnage invalide pour une pause.');
    if(!partyOwnerControls(msg.playerid,info,cid))return whisper(msg,'Tu ne contrôles ni ce personnage ni son maître.');

    var pv=resource(cid,'PV'),pr=resource(cid,'pr');
    if(pv.max<=0)return whisper(msg,'PV maximum introuvable.');
    if(pv.current>=pv.max)return whisper(msg,'Les PV sont déjà au maximum : aucun PR dépensé.');
    if(pr.current<=0)return whisper(msg,'Aucun PR disponible.');

    var dv=int(getA(cid,'DV',0),0);
    if(dv<4)return whisper(msg,'Aucun Dé de Vie valide : aucun PR dépensé.');

    var undoTx=COFantasyItemsUndoBridge.begin('COI : pause 5 min '+charName(cid),[cid],{
      names:['PV','pr'],tokens:true
    });
    setResource(cid,'pr',pr.current-1);
    var h=pvRecovery(cid,1);
    syncTokenBars(cid);
    COFantasyItemsUndoBridge.commit(undoTx);

    whisper(msg,'<b>'+esc(charName(cid))+'</b> fait une pause de 5 minutes : <b>+'+h.gain+' PV</b> ('+
      esc(h.detail)+').<br>PR : '+(pr.current-1)+'/'+pr.max+'.'+
      (isTeamFam?'<br><span style="font-size:10px">🐾 Familier détecté via '+esc(info.handoutName||'Equipe PJ')+'.</span>':'')+
      '<br><span style="font-size:10px">Mana, rations et buff de repos inchangés.</span>');
  });
}
function setPRMax(msg){
  if(!playerIsGM(msg.playerid))return;
  var v=Math.max(0,int(flag(msg.content,'value'),3)),
      all=/--all(?:\s|$)/i.test(msg.content),
      cid=flag(msg.content,'character');

  function apply(targets){
    targets=uniqIds(targets||[]);
    var undoTx=COFantasyItemsUndoBridge.begin('COI : PR max '+v,targets,{names:['pr'],tokens:false});
    targets.forEach(function(targetId){
      var a=attrObj(targetId,'pr');
      if(!a){
        createObj('attribute',{characterid:targetId,name:'pr',current:v,max:v});
      }else{
        var cur=int(a.get('current'),v);
        a.set({max:v,current:Math.min(Math.max(0,cur),v)});
      }
    });
    COFantasyItemsUndoBridge.commit(undoTx);
    whisper(msg,targets.length+' fiche(s) : PR maximum réglé à '+v+'.');
  }

  if(all)return withPartyInfo(function(info){apply(info.restGroup||info.main||[]);});
  if(!cid||!getObj('character',cid))return whisper(msg,'Personnage invalide.');

  withPartyInfo(function(info){
    if((info.restGroup||[]).indexOf(cid)<0&&!isPJ(cid))return whisper(msg,'Le personnage n’appartient pas au groupe PJ.');
    apply([cid]);
  });
}
function chat(msg){
  if(msg.type!=='api')return;
  var c=msg.content,cmd=String(c).trim().split(/\s+/)[0];

  var known={
    '!coi-butin':1,
    '!coi-equipe':1,
    '!coi-hebergements':1,
    '!coi-new-hebergement':1,
    '!coi-hebergement-show':1,
    '!coi-pause':1,
    '!coi-prmax':1,
    '!coi-repos':1,
    '!coi-rest-lodging-direct':1,
    '!coi-rest-bivouac':1,
    '!coi-rest-camp-prepare':1,
    '!coi-rest-food-menu':1,
    '!coi-rest-food-toggle':1,
    '!coi-rest-food-confirm':1,
    '!coi-hunt-env':1,
    '!coi-hunt-set':1,
    '!coi-hunt-toggle':1,
    '!coi-hunt-run':1,
    '!coi-rest-hunt-confirm':1,
    '!coi-rest-lodgings':1,
    '!coi-rest-lodging':1,
    '!coi-rest-lodging-food':1,
    '!coi-rest-pay':1,
    '!coi-rest-final':1
  };
  if(!known[cmd])return;

  if(cmd==='!coi-butin'){distributeLoot(msg);return;}
  if(cmd==='!coi-equipe'){partyDiagnostic(msg);return;}
  if(cmd==='!coi-hebergements'){lodgingLibrary(msg);return;}
  if(cmd==='!coi-new-hebergement'){
    if(!playerIsGM(msg.playerid))return;
    var mm=c.match(/--name\s+(.+)$/i),
        name=mm?mm[1].replace(/^[\'\"]|[\'\"]$/g,''):'Nouvel hébergement',
        p=flag(c,'preset'),
        ch=makeLodging(name,p?preset(p):null);
    if(ch)whisper(msg,'Hébergement créé : <b>'+esc(ch.get('name'))+'</b>. '+
      btn('Ouvrir','http://journal.roll20.net/character/'+ch.id,'#555')+
      btn('Afficher','!coi-hebergement-show --character '+ch.id,'#4f6f70'));
    return;
  }
  if(cmd==='!coi-hebergement-show'){showLodging(flag(c,'character'));return;}
  if(cmd==='!coi-pause'){pause(msg,flag(c,'character'));return;}
  if(cmd==='!coi-prmax'){setPRMax(msg);return;}
  if(cmd==='!coi-repos'){restMenu(msg);return;}

  if(!playerIsGM(msg.playerid))return whisper(msg,'Cette étape du repos de groupe est réservée au MJ.');

  if(cmd==='!coi-rest-lodging-direct'){
    var lodgingId=flag(c,'lodging');
    withPartyInfo(function(info){
      var g=info.main||[],ld=lodgingData(lodgingId);
      if(!g.length||!ld)return whisper(msg,'Aucun PJ ou hébergement invalide.');
      var sd=newSession(g,info.familiars||[],info.handoutName);
      lodgingChoice(msg,sd,ld);
    });
    return;
  }

  var sid=flag(c,'sid'),s=session(sid);
  if(!s)return whisper(msg,'Cette session de repos a expiré. Relance <b>!coi-repos</b>.');

  if(cmd==='!coi-rest-bivouac'){bivouacMenu(msg,s);return;}
  if(cmd==='!coi-rest-camp-prepare'){prepareCamp(msg,s,String(flag(c,'food')||'ration'));return;}
  if(cmd==='!coi-rest-food-menu'){foodMenu(msg,s,String(flag(c,'mode')||'ration'),true);return;}
  if(cmd==='!coi-rest-food-toggle'){
    foodToggle(msg,s,String(flag(c,'mode')||'ration'),flag(c,'character'));
    return;
  }
  if(cmd==='!coi-rest-food-confirm'){
    var fm=String(flag(c,'mode')||'ration'),
        sel=(s.foodChoice&&s.foodChoice.mode===fm)?s.foodChoice.selected.slice():[];
    prepareFoodRest(msg,s,fm,sel);
    return;
  }
  if(cmd==='!coi-hunt-env'){huntEnvMenu(msg,s);return;}
  if(cmd==='!coi-hunt-set'){
    s.huntDD=Math.max(1,int(flag(c,'dd'),12));
    s.huntLabel=huntLabel(s.huntDD);
    s.hunters=[];
    hunterMenu(msg,s);
    return;
  }
  if(cmd==='!coi-hunt-toggle'){
    var hc=flag(c,'character'),ix=s.hunters.indexOf(hc);
    if(s.group.indexOf(hc)<0)return;
    if(ix>=0)s.hunters.splice(ix,1);else s.hunters.push(hc);
    hunterMenu(msg,s);
    return;
  }
  if(cmd==='!coi-hunt-run'){runHunt(msg,s);return;}
  if(cmd==='!coi-rest-hunt-confirm'){prepareHuntCamp(msg,s);return;}
  if(cmd==='!coi-rest-lodgings'){lodgingList(msg,s);return;}
  if(cmd==='!coi-rest-lodging'){
    var d=lodgingData(flag(c,'lodging'));
    if(d)lodgingChoice(msg,s,d);
    return;
  }
  if(cmd==='!coi-rest-lodging-food'){
    var df=lodgingData(flag(c,'lodging'));
    if(df)lodgingPaymentMenu(msg,s,df,String(flag(c,'food')||'none'));
    return;
  }
  if(cmd==='!coi-rest-pay'){
    var mode=String(flag(c,'mode')||'');
    if(mode==='choose'){choosePayer(msg,s);return;}
    prepareLodgingFinal(msg,s,mode,flag(c,'payer'));
    return;
  }
  if(cmd==='!coi-rest-final'){finalizeRest(msg,s);return;}
}

function changeAttr(a){if(!a)return;var n=String(a.get('name')||'').toLowerCase();if(n==='type_personnage'||n==='objet_categorie')syncLodgingAction(a.get('_characterid'));}
function migrateLegacyLodgings(){var n=0;(findObjs({_type:'character'})||[]).forEach(function(c){var cid=c.id,t=String(getA(cid,'type_personnage','')).toUpperCase();if(t===TYPE){setA(cid,'type_personnage',OBJET_TYPE,true);setA(cid,'objet_categorie','hebergement',false);n++;}});return n;}
function ready(){store();var migrated=migrateLegacyLodgings();(findObjs({_type:'character'})||[]).forEach(function(c){syncLodgingAction(c.id);});log(SCRIPT+' v'+VERSION+' prêt — Equipe PJ prise en charge.'+(migrated?' '+migrated+' hébergement(s) migré(s) vers OBJET.':'')+(COFantasyItemsUndoBridge.available()?' Pont !cof-undo actif.':' Pont !cof-undo indisponible.'));}
return{chat:chat,changeAttr:changeAttr,ready:ready,pauseForCharacter:pause,partyInfo:withPartyInfo,addLootShare:addLootShare,fmtPC:fmtPC};
}());
on('ready',COFantasyRest.ready);
on('chat:message',COFantasyRest.chat);
on('change:attribute',COFantasyRest.changeAttr);

var COFantasyLoot = COFantasyLoot || (function () {
'use strict';

var SCRIPT='COFantasy Loot', VERSION='V2.0.0';
var STATE_KEY='COFantasyLootV40';
var TAKEN_OPEN='[COI_LOOT_TAKEN]', TAKEN_CLOSE='[/COI_LOOT_TAKEN]', ARCHIVE_OPEN='[COI_LOOT_ARCHIVE]', ARCHIVE_CLOSE='[/COI_LOOT_ARCHIVE]';

function esc(s){
  s=(s===undefined||s===null)?'':String(s);
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function href(s){
  return esc(String(s||'')).replace(/@/g,'&#64;').replace(/\{/g,'&#123;')
    .replace(/\}/g,'&#125;').replace(/\|/g,'&#124;');
}
function btn(t,c,col){
  return '<a style="display:inline-block;background:'+(col||'#6b4b2a')+
    ';color:#fff;padding:4px 7px;margin:2px;border-radius:4px;text-decoration:none;font-weight:bold" href="'+
    href(c)+'">'+esc(t)+'</a>';
}
function whisper(x){sendChat(SCRIPT,'/w gm '+x,null,{noarchive:true});}
function st(){state[STATE_KEY]=state[STATE_KEY]||{sessions:{}};return state[STATE_KEY];}
function now(){return Date.now();}
function sid(){return'L'+now().toString(36)+Math.floor(Math.random()*1679616).toString(36);}
function eid(){return'E'+Math.floor(Math.random()*2176782336).toString(36);}
function cleanSessions(){
  var s=st().sessions,limit=now()-21600000;
  Object.keys(s).forEach(function(k){if(!s[k]||s[k].created<limit)delete s[k];});
}
function flag(c,n){
  var m=String(c||'').match(new RegExp('(?:^|\\s)--'+n+'\\s+(\\S+)','i'));
  return m?m[1]:'';
}
function textFlag(c){
  var m=String(c||'').match(/--text(?:\s+|=)([\s\S]*)$/i);
  return m?String(m[1]||'').replace(/^\s+|\s+$/g,'').replace(/^["']|["']$/g,''):'';
}
function restoreInlineExpressions(msg,s){
  s=String(s||'');
  if(!msg||!msg.inlinerolls)return s;
  return s.replace(/\$\[\[(\d+)\]\]/g,function(all,i){
    var r=msg.inlinerolls[parseInt(i,10)];
    if(!r)return all;
    var ex=String(r.expression||'').trim();
    return ex?'[['+ex+']]':all;
  });
}
function selectedTokens(msg){
  var out=[],seen={};
  (msg.selected||[]).forEach(function(sel){
    if(!sel||sel._type!=='graphic'||seen[sel._id])return;
    var t=getObj('graphic',sel._id);
    if(t){seen[sel._id]=1;out.push(t);}
  });
  return out;
}

function decodeRaw(raw){
  var s=String(raw||''),pass=0;
  function legacyPercentDecode(v){
    return String(v||'').replace(/%([0-9a-fA-F]{2})/g,function(all,h){
      return String.fromCharCode(parseInt(h,16));
    });
  }
  while(pass<3&&/%[0-9a-fA-F]{2}/.test(s)){
    var before=s;
    try{s=decodeURIComponent(s);}
    catch(e){s=legacyPercentDecode(s);}
    if(s===before)break;
    pass++;
  }
  return s;
}
function decodeEntities(s){
  return String(s||'').replace(/&nbsp;/gi,' ').replace(/&#39;/gi,"'")
    .replace(/&quot;/gi,'"').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>')
    .replace(/&amp;/gi,'&');
}
function htmlToPlain(raw){
  var s=decodeRaw(raw);
  s=s.replace(/<\s*br\s*\/?\s*>/gi,'\n')
    .replace(/<\s*\/p\s*>/gi,'\n').replace(/<\s*p(?:\s[^>]*)?>/gi,'')
    .replace(/<\s*\/div\s*>/gi,'\n').replace(/<\s*div(?:\s[^>]*)?>/gi,'')
    .replace(/<\s*\/li\s*>/gi,'\n').replace(/<\s*li(?:\s[^>]*)?>/gi,'')
    .replace(/<[^>]*>/g,'');
  s=decodeEntities(s).replace(/\r/g,'').replace(/\n[ \t]+/g,'\n').trim();
  if(/^(?:null|undefined)$/i.test(s))return'';
  return s;
}
function plainToHtml(s){return esc(String(s||'')).replace(/\n/g,'<br>');}
function cleanLine(s){return decodeRaw(String(s||'')).replace(/^[\s•\-–—]+|[\s]+$/g,'').trim();}
function hash(s){
  var h=2166136261,i,x=String(s||'');
  for(i=0;i<x.length;i++){h^=x.charCodeAt(i);h+=(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24);}
  return('00000000'+(h>>>0).toString(16)).slice(-8);
}
function normalizeKey(s){
  return String(s||'').toUpperCase()
    .replace(/[ÀÂÄÁÃÅ]/g,'A').replace(/[Ç]/g,'C')
    .replace(/[ÉÈÊË]/g,'E').replace(/[ÎÏÍÌ]/g,'I')
    .replace(/[ÔÖÓÒÕ]/g,'O').replace(/[ÙÛÜÚ]/g,'U')
    .replace(/[ŸÝ]/g,'Y').replace(/\s+/g,'_').trim();
}
function canonicalField(k){
  k=normalizeKey(k);
  var aliases={
    TYPE:'TYPE',NAME:'NAME',NOM:'NAME',
    VALUE:'VALUE',VALEUR:'VALUE',
    FAMILY:'FAMILY',FAMILLE:'FAMILY',
    TIER:'TIER',PALIER:'TIER',PALIER_NC:'TIER',
    RARITY:'RARITY',RARETE:'RARITY',
    ACTION:'ACTION',ACTION_RP:'ACTION',
    RESOURCES:'RESOURCES',RESSOURCES:'RESOURCES',RESSOURCES_RP:'RESOURCES',
    ITEM:'ITEM',OBJET:'ITEM',
    SPECIAL:'SPECIAL',SPECIALITE:'SPECIAL',
    BUTIN:'BUTIN'
  };
  return aliases[k]||'';
}
function normalizeType(t){
  t=normalizeKey(t);
  if(t==='CONTAINER'||t==='COFFRE'||t==='CONTENEUR')return'CONTAINER';
  if(t==='CACHE'||t==='CACHETTE')return'CACHE';
  return'CREATURE';
}
function extractTaken(plain){
  var taken={},m=String(plain||'').match(/\[COI_LOOT_TAKEN\]([\s\S]*?)\[\/COI_LOOT_TAKEN\]/i);
  if(m){
    String(m[1]||'').split(/\n+/).map(cleanLine).filter(Boolean).forEach(function(k){taken[k]=1;});
  }
  return taken;
}
function stripTaken(plain){
  return String(plain||'').replace(/\[COI_LOOT_TAKEN\][\s\S]*?\[\/COI_LOOT_TAKEN\]/gi,'').trim();
}
function extractArchive(plain){
  var out=[],m=String(plain||'').match(/\[COI_LOOT_ARCHIVE\]([\s\S]*?)\[\/COI_LOOT_ARCHIVE\]/i);
  if(m){
    String(m[1]||'').split(/\n+/).map(cleanLine).filter(Boolean).forEach(function(line){out.push(line);});
  }
  return out;
}
function stripArchive(plain){
  return String(plain||'').replace(/\[COI_LOOT_ARCHIVE\][\s\S]*?\[\/COI_LOOT_ARCHIVE\]/gi,'').trim();
}
function parseTokenModel(tok){
  var plain=htmlToPlain(tok.get('gmnotes')||''),taken=extractTaken(plain),archive=extractArchive(plain);
  plain=stripArchive(stripTaken(plain));
  var m=plain.match(/\[LOOT\]([\s\S]*?)\[\/LOOT\]/i);
  if(m){
    return{
      hasBlock:true,
      prefix:plain.slice(0,m.index).trim(),
      suffix:plain.slice(m.index+m[0].length).trim(),
      lines:String(m[1]||'').split(/\n+/).map(cleanLine).filter(Boolean),
      taken:taken,
      archive:archive
    };
  }
  return{hasBlock:false,prefix:'',suffix:'',lines:plain?plain.split(/\n+/).map(cleanLine).filter(Boolean):[],taken:taken,archive:archive};
}
function parseRawNote(raw){
  var plain=stripArchive(stripTaken(htmlToPlain(raw))),m=plain.match(/\[LOOT\]([\s\S]*?)\[\/LOOT\]/i);
  var body=m?String(m[1]||''):plain;
  return{lines:body?body.split(/\n+/).map(cleanLine).filter(Boolean):[]};
}
function writeTokenModel(tok,model,lines,taken,archive){
  var out=[],keys=Object.keys(taken||{}).filter(function(k){return taken[k];}).sort();
  archive=archive===undefined?(model.archive||[]):archive;
  if(model.hasBlock){
    if(model.prefix)out.push(model.prefix);
    out.push('[LOOT]');
    if(lines.length)out.push(lines.join('\n'));
    out.push('[/LOOT]');
    if(model.suffix)out.push(model.suffix);
  }else if(lines.length){
    out.push(lines.join('\n'));
  }
  if(keys.length){
    out.push(TAKEN_OPEN);out.push(keys.join('\n'));out.push(TAKEN_CLOSE);
  }
  if(archive.length){
    out.push(ARCHIVE_OPEN);out.push(archive.join('\n'));out.push(ARCHIVE_CLOSE);
  }
  tok.set('gmnotes',plainToHtml(out.join('\n').trim()));
}
function commonKey(index,line){return'C:'+index+':'+hash(line);}
function tokenKey(line){return'T:'+hash(line);}

function parseProfile(lines){
  var meta={type:'',name:'',family:'',tier:'',rarity:'',action:'',resources:''},payload=[];
  (lines||[]).forEach(function(raw,index){
    raw=cleanLine(raw);
    if(!raw)return;
    var m=raw.match(/^([^:]{1,32})\s*:\s*([\s\S]*)$/),field=m?canonicalField(m[1]):'',value=m?String(m[2]||'').trim():'';
    if(field==='TYPE'){meta.type=normalizeType(value);return;}
    if(field==='NAME'){meta.name=value;return;}
    if(field==='FAMILY'){meta.family=value;return;}
    if(field==='TIER'){meta.tier=value;return;}
    if(field==='RARITY'){meta.rarity=value;return;}
    if(field==='ACTION'){meta.action=value;return;}
    if(field==='RESOURCES'){meta.resources=value;return;}
    if(field==='VALUE'){payload.push({kind:'value',raw:raw,value:value,index:index});return;}
    if(field==='ITEM'){payload.push({kind:'item',raw:raw,value:value,index:index});return;}
    if(field==='SPECIAL'){payload.push({kind:'special',raw:raw,value:value,index:index});return;}
    if(field==='BUTIN'){
      var rm=raw.match(/Raret[eé]\s*:\s*([^<\n]+)$/i);
      if(rm&&!meta.rarity)meta.rarity=String(rm[1]||'').trim();
      payload.push({kind:'legacy',raw:raw,value:raw.replace(/\s*Raret[eé]\s*:\s*[^<\n]+$/i,'').trim(),index:index});
      return;
    }
    payload.push({kind:'ordinary',raw:raw,value:raw,index:index});
  });
  if(!meta.type)meta.type='CREATURE';
  return{meta:meta,payload:payload};
}
function mergeMeta(a,b){
  var out={},keys=['type','name','family','tier','rarity','action','resources'];
  keys.forEach(function(k){out[k]=(b&&b[k])||(a&&a[k])||'';});
  out.type=normalizeType(out.type||'CREATURE');
  return out;
}

function arithmetic(expr){
  var s=String(expr||'').replace(/\s+/g,''),p=0;
  function num(){var st=p;while(p<s.length&&/[0-9.]/.test(s.charAt(p)))p++;if(st===p)throw new Error('num');var n=Number(s.slice(st,p));if(!isFinite(n))throw new Error('num');return n;}
  function fac(){if(s.charAt(p)==='+'){p++;return fac();}if(s.charAt(p)==='-'){p++;return-fac();}if(s.charAt(p)==='('){p++;var v=exp();if(s.charAt(p)!==')')throw new Error(')');p++;return v;}return num();}
  function term(){var v=fac(),o;while(p<s.length&&(s.charAt(p)==='*'||s.charAt(p)==='/')){o=s.charAt(p++);var r=fac();v=o==='*'?v*r:v/r;}return v;}
  function exp(){var v=term(),o;while(p<s.length&&(s.charAt(p)==='+'||s.charAt(p)==='-')){o=s.charAt(p++);var r=term();v=o==='+'?v+r:v-r;}return v;}
  if(!s||!/^[0-9+\-*/().]+$/.test(s))throw new Error('expr');
  var v=exp();if(p!==s.length||!isFinite(v))throw new Error('expr');return v;
}
function rollExpr(expr){
  var orig=String(expr||'').trim(),bad=false;
  var rep=orig.replace(/(\d*)\s*[dD]\s*(\d+)/g,function(a,cS,sS){
    var c=cS?parseInt(cS,10):1,ss=parseInt(sS,10),t=0,i;
    if(c<1||c>100||ss<1||ss>100000){bad=true;return'0';}
    for(i=0;i<c;i++)t+=randomInteger(ss);
    return String(t);
  });
  if(bad||/[A-Za-z@{}]/.test(rep))return{ok:false,text:orig,value:0};
  try{
    var v=arithmetic(rep);
    if(Math.abs(v-Math.round(v))<1e-9)v=Math.round(v);
    return{ok:true,text:String(v),value:v};
  }catch(e){return{ok:false,text:orig,value:0};}
}
function resolveLine(line){
  var unresolved=false;
  var text=String(line||'').replace(/\[\[([\s\S]*?)\]\]/g,function(all,ex){
    var r=rollExpr(ex);
    if(!r.ok){unresolved=true;return all;}
    return r.text;
  });
  return{text:text.trim(),unresolved:unresolved};
}

function currency(text){
  var s=String(text||'').trim(),rx=/(\d+)\s*(PP|PO|PA|PC)\b/gi,t={PP:0,PO:0,PA:0,PC:0},n=0,m;
  while((m=rx.exec(s))!==null){t[String(m[2]).toUpperCase()]+=parseInt(m[1],10)||0;n++;}
  return n?t:null;
}
function toPC(t){return(t.PP||0)*1000000+(t.PO||0)*10000+(t.PA||0)*100+(t.PC||0);}
function fmtPC(pc){
  pc=Math.max(0,Math.floor(Number(pc)||0));
  var a=[],pp=Math.floor(pc/1000000);pc%=1000000;
  var po=Math.floor(pc/10000);pc%=10000;
  var pa=Math.floor(pc/100);pc%=100;
  if(pp)a.push(pp+' PP');if(po)a.push(po+' PO');if(pa)a.push(pa+' PA');
  if(pc||!a.length)a.push(pc+' PC');
  return a.join(' ');
}
function quantity(text){
  var m=String(text||'').trim().match(/^(\d+)\s*[x×]?\s+(.+)$/i);
  return m?{qty:parseInt(m[1],10)||0,name:String(m[2]||'').trim()}:null;
}
function lootAttr(cid,n,d){
  var a=findObjs({_type:'attribute',_characterid:cid,name:n},{caseInsensitive:true})||[];
  if(!a.length)return d;
  var v=a[0].get('current');
  return(v===undefined||v===null||v==='')?d:v;
}
function itemIndex(){
  var idx={};
  (findObjs({_type:'character'})||[]).forEach(function(ch){
    var cid=ch.id,t=String(lootAttr(cid,'type_personnage','')).toUpperCase();
    if(t!=='OBJET'&&t!=='CONSOMMABLE')return;
    var n=String(ch.get('name')||'').trim();if(!n)return;
    var cat=String(lootAttr(cid,'objet_categorie',t==='CONSOMMABLE'?'consommable':'divers')||'divers').toLowerCase();
    if(t==='CONSOMMABLE')cat='consommable';
    if(cat==='hebergement')return;
    var x={id:cid,name:n,type:t,category:cat,equipable:(cat==='arme'||cat==='armure'||cat==='accessoire')},k=n.toLowerCase();
    idx[k]=idx[k]||[];idx[k].push(x);
  });
  return idx;
}
function parseItemValue(text){
  var b=String(text||'').trim(),q=1,n=b,x=b.match(/^([x×]\s*)?(\d+)\s+(.+)$/i);
  if(x){q=Math.max(1,parseInt(x[2],10)||1);n=String(x[3]||'').trim();}
  else{x=b.match(/^(.+?)\s*[x×]\s*(\d+)$/i);if(x){n=String(x[1]||'').trim();q=Math.max(1,parseInt(x[2],10)||1);}}
  return{name:n,qty:q,unresolved:/\[\[|\$\[\[/.test(b)};
}
function resolveLinked(p,idx){
  var r={name:p.name,qty:p.qty,status:'missing',matches:[],item:null};
  if(p.unresolved){r.status='unresolved';return r;}
  var a=idx[String(p.name||'').toLowerCase()]||[];r.matches=a;
  if(a.length===1){r.status='ok';r.item=a[0];r.name=a[0].name;}
  else if(a.length>1)r.status='ambiguous';
  return r;
}
function iconItem(item){
  if(!item)return'🎁';
  if(item.category==='consommable')return'🧪';
  if(item.category==='arme')return'⚔️';
  if(item.category==='armure')return'🛡️';
  if(item.category==='accessoire')return'💍';
  return'🎁';
}
function typeIcon(type){
  type=normalizeType(type);
  if(type==='CONTAINER')return'📦';
  if(type==='CACHE')return'🗝️';
  return'👹';
}
function rarityPhrase(r){
  r=normalizeKey(r);
  if(r==='COMMUN')return'Rien de particulièrement remarquable ne ressort du lot.';
  if(r==='UTILE')return'Plusieurs éléments sont encore suffisamment exploitables pour être récupérés ou revendus.';
  if(r==='RARE')return'Quelques trouvailles sortent nettement de l’ordinaire.';
  if(r==='PRECIEUX')return'Plusieurs éléments présentent une valeur inhabituelle.';
  if(r==='EXCEPTIONNEL')return'Une trouvaille remarquable attire immédiatement l’attention.';
  return'';
}
function capSentence(s){
  s=String(s||'').trim();
  return s?s.charAt(0).toUpperCase()+s.slice(1):'';
}
function pluralAction(s,count){
  s=String(s||'');
  if(count<=1)return s;
  return s.replace(/\bses\b/gi,'leurs').replace(/\bson\b/gi,'leur')
    .replace(/\bsa\b/gi,'leur').replace(/\bdu corps\b/gi,'des corps')
    .replace(/\bla créature\b/gi,'les créatures');
}

function sheetNotes(cid){
  if(!cid)return'';
  var a=findObjs({_type:'attribute',_characterid:cid,name:'notes'},{caseInsensitive:true})||[];
  if(!a.length)return'';
  var v=a[0].get('current');
  return(v===undefined||v===null)?'':String(v);
}
function hasLootBlock(raw){
  return /\[LOOT\][\s\S]*?\[\/LOOT\]/i.test(htmlToPlain(raw||''));
}
function chooseCharLootNote(cid,gmRaw){
  var gm=gmRaw||'', notes=sheetNotes(cid);

  if(hasLootBlock(gm))return gm;
  if(hasLootBlock(notes))return notes;

  return gm;
}
function readCharNotes(cid,cb){
  var c=cid?getObj('character',cid):null;
  if(!c)return cb('');
  try{c.get('gmnotes',function(v){cb(chooseCharLootNote(cid,v||''));});}
  catch(e){
    try{cb(chooseCharLootNote(cid,c.get('gmnotes')||''));}
    catch(e2){cb(chooseCharLootNote(cid,''));}
  }
}

function makeEntry(sess,tok,source,payload,idx){
  var resolved=resolveLine(payload.value),e={
    id:eid(),tokenId:tok.id,source:source,index:payload.index,kind:payload.kind,
    raw:payload.raw,key:source==='common'?commonKey(payload.index,payload.raw):tokenKey(payload.raw),
    text:resolved.text,unresolved:resolved.unresolved,
    currency:null,quantity:null,linked:null,special:false
  };
  if(payload.kind==='item'){
    e.linked=resolveLinked(parseItemValue(resolved.text),idx);
  }else if(payload.kind==='special'){
    e.special=true;
  }else{
    e.currency=currency(resolved.text);
    if(!e.currency)e.quantity=quantity(resolved.text);
  }
  sess.entries[e.id]=e;
  return e;
}

function collect(msg,cb){
  var toks=selectedTokens(msg),sess={
    id:sid(),created:now(),entries:{},tokens:{},tokenOrder:[]
  },idx=itemIndex();
  if(!toks.length)return cb(null);
  var left=toks.length;

  toks.forEach(function(tok){
    var cid=String(tok.get('represents')||''),ch=cid?getObj('character',cid):null,
        tokenModel=parseTokenModel(tok),tokenParsed=parseProfile(tokenModel.lines);

    function finish(commonRaw){
      var commonParsed=parseProfile(parseRawNote(commonRaw).lines),
          profile=mergeMeta(commonParsed.meta,tokenParsed.meta),
          charName=ch?String(ch.get('name')||'').trim():'',
          tokenName=String(tok.get('name')||'').trim(),
          entryIds=[];

      if(!profile.name)profile.name=charName||tokenName||'Butin';

      commonParsed.payload.forEach(function(p){
        var k=commonKey(p.index,p.raw);
        if(tokenModel.taken[k])return;
        entryIds.push(makeEntry(sess,tok,'common',p,idx).id);
      });
      tokenParsed.payload.forEach(function(p){
        entryIds.push(makeEntry(sess,tok,'token',p,idx).id);
      });

      sess.tokens[tok.id]={
        tokenId:tok.id,characterId:cid,charName:charName,tokenName:tokenName||charName||'Token',
        profile:profile,entryIds:entryIds
      };
      sess.tokenOrder.push(tok.id);

      left--;
      if(left===0){st().sessions[sess.id]=sess;cb(sess);}
    }
    if(cid)readCharNotes(cid,finish);else finish('');
  });
}
function getSession(id){cleanSessions();return st().sessions[id]||null;}
function getEntry(s,id){return s&&s.entries?s.entries[id]:null;}

function entryAvailable(e){
  if(!e)return false;
  var tok=getObj('graphic',e.tokenId);if(!tok)return false;
  var tm=parseTokenModel(tok);
  if(e.source==='common')return!tm.taken[e.key];
  return tm.lines.some(function(line){return tokenKey(line)===e.key;});
}
function markTaken(e){
  var tok=getObj('graphic',e.tokenId);if(!tok)return false;
  var tm=parseTokenModel(tok),lines=tm.lines.slice(),at=-1;
  if(e.source==='common'){
    if(tm.taken[e.key])return false;
    tm.taken[e.key]=1;writeTokenModel(tok,tm,lines,tm.taken);return true;
  }
  lines.some(function(line,i){if(tokenKey(line)===e.key){at=i;return true;}return false;});
  if(at<0)return false;
  var removed=lines[at];
  lines.splice(at,1);
  tm.archive=tm.archive||[];
  tm.archive.push(removed);
  writeTokenModel(tok,tm,lines,tm.taken,tm.archive);
  return true;
}
function appendTokenLine(tokenId,line){
  var tok=getObj('graphic',tokenId);if(!tok)return false;
  var tm=parseTokenModel(tok),lines=tm.lines.slice();
  lines.push(cleanLine(line));writeTokenModel(tok,tm,lines,tm.taken);return true;
}
function sourceTokens(entries){
  var seen={},a=[];
  (entries||[]).forEach(function(e){if(e&&e.tokenId&&!seen[e.tokenId]){seen[e.tokenId]=1;a.push(e.tokenId);}});
  return a;
}
function commonInventoryCharacter(){
  var a=(findObjs({_type:'character'})||[]).filter(function(ch){
    return String(ch.get('name')||'').trim().toLowerCase()==='inventaire commun';
  });
  if(a.length===1)return{ok:true,id:a[0].id,ch:a[0]};
  if(a.length===0)return{ok:false,error:'Fiche <b>Inventaire Commun</b> introuvable. Crée une fiche portant exactement ce nom avant de partager un butin avec un reste.'};
  return{ok:false,error:'Plusieurs fiches portent le nom <b>Inventaire Commun</b>. Garde un seul personnage avec ce nom.'};
}
function invalidateSessionsForTokens(tokenIds){
  var wanted={},sessions=st().sessions||{};
  (tokenIds||[]).forEach(function(id){wanted[id]=1;});
  Object.keys(sessions).forEach(function(k){
    var s=sessions[k],hit=false;
    if(!s)return;
    (s.tokenOrder||[]).some(function(id){if(wanted[id]){hit=true;return true;}return false;});
    if(hit)delete sessions[k];
  });
}

function groupSignature(t){
  var p=t.profile||{},base=t.characterId||t.charName||t.tokenName||'token';
  return base+'|'+normalizeType(p.type)+'|'+String(p.name||'')+'|'+String(p.family||'')+
    '|'+String(p.tier||'')+'|'+String(p.rarity||'')+'|'+String(p.action||'')+'|'+String(p.resources||'');
}
function buildGroups(s){
  var map={},order=[];
  (s.tokenOrder||[]).forEach(function(tid){
    var t=s.tokens[tid];if(!t)return;
    var available=(t.entryIds||[]).map(function(id){return s.entries[id];}).filter(entryAvailable);
    if(!available.length)return;
    var key=groupSignature(t),g=map[key];
    if(!g){
      g=map[key]={
        key:key,profile:t.profile||{},name:(t.profile&&t.profile.name)||t.charName||t.tokenName||'Butin',
        count:0,tokenIds:[],entries:[],currencyPC:0,linked:{},issues:{},simple:{},special:{}
      };
      order.push(key);
    }
    g.count++;g.tokenIds.push(tid);
    available.forEach(function(e){
      g.entries.push(e);
      if(e.currency){g.currencyPC+=toPC(e.currency);return;}
      if(e.linked){
        if(e.linked.status==='ok'){
          var ik=e.linked.item.id;
          g.linked[ik]=g.linked[ik]||{item:e.linked.item,name:e.linked.item.name,qty:0,entries:[]};
          g.linked[ik].qty+=e.linked.qty;g.linked[ik].entries.push(e);
        }else{
          var bad=e.linked.status+'|'+String(e.linked.name||'').toLowerCase();
          g.issues[bad]=g.issues[bad]||{name:e.linked.name,status:e.linked.status,count:0,matches:e.linked.matches||[]};
          g.issues[bad].count++;
        }
        return;
      }
      var target=e.special?g.special:g.simple,k=(e.text||'').toLowerCase();
      if(e.quantity&&!e.special){
        k='Q|'+e.quantity.name.toLowerCase();
        target[k]=target[k]||{name:e.quantity.name,qty:0,entries:[]};
        target[k].qty+=e.quantity.qty;target[k].entries.push(e);
      }else{
        target[k]=target[k]||{name:e.text,qty:0,entries:[]};
        target[k].qty++;target[k].entries.push(e);
      }
    });
  });
  return order.map(function(k){return map[k];});
}
function totalPC(groups){return(groups||[]).reduce(function(a,g){return a+g.currencyPC;},0);}
function allSimpleEntries(groups){
  var a=[];(groups||[]).forEach(function(g){
    g.entries.forEach(function(e){if(!e.currency&&!e.linked)a.push(e);});
  });return a;
}

function itemSummaryButtons(s,li){
  var iid=li.item.id,x=btn('Voir','!coi-show --character '+iid,'#506070');
  if(li.item.category==='consommable'){
    x+=btn('Donner tout ×'+li.qty+' & récupérer',
      '!coi-loot-give-item --sid '+s.id+' --item '+iid+' --all --target @{target|character_id}','#70543e');
  }else{
    x+=btn(li.qty>1?'Donner 1 & récupérer':'Donner & récupérer',
      '!coi-loot-give-item --sid '+s.id+' --item '+iid+' --target @{target|character_id}','#70543e');
    if(li.item.equipable){
      x+=btn('Donner + équiper & récupérer',
        '!coi-loot-give-item --sid '+s.id+' --item '+iid+' --equip --target @{target|character_id}','#3f6b45');
    }
  }
  return x;
}
function renderGroupSummary(s,g){
  var out='<div style="border-top:1px solid #d9c5a4;padding:7px 0">';
  out+='<div style="font-size:13px"><b>'+typeIcon(g.profile.type)+' '+esc(g.name)+(g.count>1?' ×'+g.count:'')+'</b></div>';
  if(g.currencyPC>0)out+='<div style="margin-left:8px">💰 <b>'+esc(fmtPC(g.currencyPC))+'</b></div>';

  Object.keys(g.linked).sort(function(a,b){return g.linked[a].name.localeCompare(g.linked[b].name);}).forEach(function(k){
    var li=g.linked[k];
    out+='<div style="margin-left:8px">'+iconItem(li.item)+' <b>'+esc(li.name)+'</b>'+
      (li.qty>1?' ×'+li.qty:'')+' '+itemSummaryButtons(s,li)+'</div>';
  });
  Object.keys(g.issues).sort().forEach(function(k){
    var x=g.issues[k];
    out+='<div style="margin-left:8px;color:#9a4b32">⚠️ '+esc(x.name);
    if(x.status==='ambiguous')out+=' — '+x.matches.length+' fiches correspondent';
    else if(x.status==='unresolved')out+=' — quantité non résolue';
    else out+=' — fiche OBJET introuvable';
    out+='</div>';
  });

  Object.keys(g.special).sort().forEach(function(k){
    var x=g.special[k];
    out+='<div style="margin-left:8px">🔑 '+esc(x.name)+(x.qty>1?' ×'+x.qty:'')+'</div>';
  });
  Object.keys(g.simple).sort().forEach(function(k){
    var x=g.simple[k];
    out+='<div style="margin-left:8px">• '+esc(x.name)+(x.qty>1?' ×'+x.qty:'')+'</div>';
  });
  return out+'</div>';
}
function rpText(g){
  var p=g.profile||{},resources=String(p.resources||'').trim(),
      rarity=rarityPhrase(p.rarity),body='',act=pluralAction(p.action,g.count),
      itemNames=[],specialNames=[];

  Object.keys(g.linked).sort().forEach(function(k){
    var x=g.linked[k],n=x.name+(x.qty>1?' ×'+x.qty:'');
    itemNames.push('<b>'+esc(n)+'</b>');
  });
  Object.keys(g.special).sort().forEach(function(k){
    var x=g.special[k];specialNames.push(esc(x.name)+(x.qty>1?' ×'+x.qty:''));
  });

  if(normalizeType(p.type)==='CONTAINER'){
    body='En ouvrant <b>'+esc(g.name)+'</b>, vous découvrez '+esc(resources||'divers objets et valeurs récupérables')+'.';
  }else if(normalizeType(p.type)==='CACHE'){
    body='Dans <b>'+esc(g.name)+'</b>, vous découvrez '+esc(resources||'divers objets et valeurs dissimulés')+'.';
  }else if(act){
    body=capSentence(esc(act))+', vous récupérez '+esc(resources||'divers objets et matériaux exploitables')+'.';
  }else{
    body='En fouillant <b>'+esc(g.name)+(g.count>1?' ×'+g.count:'')+'</b>, vous récupérez '+
      esc(resources||'divers objets et matériaux exploitables')+'.';
  }

  if(g.currencyPC>0)body+=' La valeur récupérée représente <b>'+esc(fmtPC(g.currencyPC))+'</b>.';
  if(rarity)body+=' '+esc(rarity);
  if(itemNames.length===1)body+=' Un objet particulier se distingue du reste : '+itemNames[0]+'.';
  else if(itemNames.length>1)body+=' Plusieurs objets particuliers se distinguent du reste : '+itemNames.join(', ')+'.';
  if(specialNames.length)body+=' Vous remarquez également : '+specialNames.join(', ')+'.';
  return body;
}

function render(msg){
  if(!playerIsGM(msg.playerid))return;
  collect(msg,function(s){
    if(!s)return whisper('<b>🎁 Loot :</b> sélectionne un ou plusieurs tokens.');
    var groups=buildGroups(s),pc=totalPC(groups),simple=allSimpleEntries(groups);
    var out='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:8px;border-radius:6px">'+
      '<div style="font-size:16px;font-weight:bold;text-align:center">🎁 BUTIN DE LA RENCONTRE</div>';

    if(!groups.length){
      out+='<div style="padding:8px 0"><i>Aucun loot disponible : GM Notes vides ou butin déjà récupéré.</i></div>';
    }else{
      groups.forEach(function(g){out+=renderGroupSummary(s,g);});

      if(groups.length>1&&pc>0){
        out+='<div style="border-top:1px solid #8a6a2f;padding-top:5px"><b>💰 TOTAL RENCONTRE : '+esc(fmtPC(pc))+'</b></div>';
      }

      out+='<div style="margin-top:6px">';
      if(pc>0){
        out+=btn('💰 Partager & récupérer','!coi-loot-money --sid '+s.id,'#8a6a2f');
        out+=btn('💰 Donner à un PJ & récupérer','!coi-loot-money --sid '+s.id+' --target @{target|Bénéficiaire|character_id}','#70543e');
      }
      if(simple.length)out+=btn('✓ Récupérer le reste','!coi-loot-take-all --sid '+s.id,'#50754a');
      out+='</div>';

      out+='<div style="margin-top:8px;border-top:1px dashed #bda98d;padding-top:6px"><b>📜 Synthèse RP</b>';
      groups.forEach(function(g){out+='<div style="margin-top:5px">'+rpText(g)+'</div>';});
      out+='</div>';
    }

    out+='<div style="margin-top:8px;text-align:center">'+
      btn('👁 Montrer aux joueurs','!coi-loot-show --sid '+s.id,'#456a7d')+
      btn('🔎 Détails','!coi-loot-details --sid '+s.id,'#65556f')+
      '</div>';
    out+='<div style="font-size:9px;color:#766;margin-top:6px">Les jets sont verrouillés pour cette session. Les champs TYPE / FAMILY / TIER / RARITY / ACTION / RESOURCES servent à la synthèse et ne sont plus affichés comme du loot brut.</div></div>';
    whisper(out);
  });
}

function details(msg){
  if(!playerIsGM(msg.playerid))return;
  var s=getSession(flag(msg.content,'sid'));
  if(!s)return whisper('Session expirée. Relance <code>!coi-loot</code>.');

  var out='<div style="background:#fbfaf7;border:1px solid #65556f;padding:8px;border-radius:6px">'+
    '<div style="font-size:15px;font-weight:bold;text-align:center">🔎 DÉTAIL DES JETS</div>',shown=0;

  (s.tokenOrder||[]).forEach(function(tid){
    var t=s.tokens[tid];if(!t)return;
    var es=(t.entryIds||[]).map(function(id){return s.entries[id];}).filter(entryAvailable);
    if(!es.length)return;
    shown++;
    out+='<div style="border-top:1px solid #d6ccd9;padding:5px 0"><b>'+esc(t.tokenName)+'</b>';
    if(t.profile&&t.profile.rarity){
      out+=' <span style="font-size:9px;color:#777">'+esc(t.profile.rarity);
      if(t.profile.tier)out+=' · '+esc(t.profile.tier);
      out+='</span>';
    }
    out+='<div style="margin-left:8px">';
    es.forEach(function(e){
      if(e.linked){
        if(e.linked.status==='ok'){
          out+='• '+iconItem(e.linked.item)+' '+esc(e.linked.item.name)+(e.linked.qty>1?' ×'+e.linked.qty:'')+
            btn('Voir','!coi-show --character '+e.linked.item.id,'#506070')+
            btn(e.linked.item.category==='consommable'?'Donner ×'+e.linked.qty+' & récupérer':'Donner & récupérer',
              '!coi-loot-give --sid '+s.id+' --entry '+e.id+' --target @{target|character_id}','#70543e')+'<br>';
        }else{
          out+='• ⚠️ ITEM '+esc(e.linked.name)+' ('+esc(e.linked.status)+')<br>';
        }
      }else if(e.currency){
        out+='• 💰 '+esc(e.text)+'<br>';
      }else{
        out+='• '+(e.special?'🔑 ':'')+esc(e.text)+' '+
          btn('✓ Récupéré','!coi-loot-take --sid '+s.id+' --entry '+e.id,'#50754a')+'<br>';
      }
    });
    out+='</div></div>';
  });
  if(!shown)out+='<i>Il ne reste aucun détail disponible.</i>';
  out+='</div>';
  whisper(out);
}

function showPlayers(msg){
  if(!playerIsGM(msg.playerid))return;
  var s=getSession(flag(msg.content,'sid'));
  if(!s)return whisper('Session expirée. Relance <code>!coi-loot</code>.');
  var groups=buildGroups(s),pc=totalPC(groups);
  var out='<div style="background:#fffaf2;border:1px solid #6f4a26;padding:9px;border-radius:6px">'+
    '<div style="font-size:16px;font-weight:bold;text-align:center">🎁 BUTIN</div>';
  if(!groups.length){
    out+='<div style="padding:6px 0"><i>Il ne reste rien à récupérer.</i></div>';
  }else{
    groups.forEach(function(g){
      out+='<div style="border-top:1px solid #d9c5a4;padding:6px 0">'+
        '<b>'+typeIcon(g.profile.type)+' '+esc(g.name)+(g.count>1?' ×'+g.count:'')+'</b>';
      if(g.currencyPC>0)out+='<div style="margin-left:8px">💰 '+esc(fmtPC(g.currencyPC))+'</div>';
      Object.keys(g.linked).sort(function(a,b){return g.linked[a].name.localeCompare(g.linked[b].name);}).forEach(function(k){
        var li=g.linked[k];
        out+='<div style="margin-left:8px">'+iconItem(li.item)+' '+esc(li.name)+(li.qty>1?' ×'+li.qty:'')+'</div>';
      });
      Object.keys(g.special).sort().forEach(function(k){
        var x=g.special[k];out+='<div style="margin-left:8px">🔑 '+esc(x.name)+(x.qty>1?' ×'+x.qty:'')+'</div>';
      });
      out+='<div style="margin-top:5px;font-style:italic">'+rpText(g)+'</div></div>';
    });
    if(groups.length>1&&pc>0)out+='<div style="border-top:1px solid #8a6a2f;padding-top:5px"><b>💰 Valeur totale : '+esc(fmtPC(pc))+'</b></div>';
  }
  out+='</div>';
  sendChat('Butin','/direct '+out,null,{noarchive:false});
}

function takeEntry(msg){
  if(!playerIsGM(msg.playerid))return;
  var s=getSession(flag(msg.content,'sid')),e=getEntry(s,flag(msg.content,'entry'));
  if(!e)return whisper('Session ou entrée expirée. Relance <code>!coi-loot</code>.');
  if(e.currency||e.linked)return whisper('Utilise le bouton dédié pour cette entrée.');
  if(!entryAvailable(e))return whisper('Ce loot a déjà été récupéré ou modifié.');
  var tx=COFantasyItemsUndoBridge.begin('COI : récupérer loot',[],{tokens:false,extraTokenIds:[e.tokenId],tokenGmNotes:true});
  if(!markTaken(e))return whisper('Impossible de retirer ce loot.');
  COFantasyItemsUndoBridge.commit(tx);
  whisper('✓ Loot récupéré : <b>'+esc(e.text)+'</b>. <code>!cof-undo</code> le restaure.');
}
function takeAll(msg){
  if(!playerIsGM(msg.playerid))return;
  var s=getSession(flag(msg.content,'sid'));
  if(!s)return whisper('Session expirée. Relance <code>!coi-loot</code>.');
  var es=Object.keys(s.entries).map(function(k){return s.entries[k];})
    .filter(function(e){return!e.currency&&!e.linked&&entryAvailable(e);});
  if(!es.length)return whisper('Aucun loot simple restant.');
  var tids=sourceTokens(es),
      tx=COFantasyItemsUndoBridge.begin('COI : récupérer le reste',[],{tokens:false,extraTokenIds:tids,tokenGmNotes:true}),
      n=0;
  es.forEach(function(e){if(markTaken(e))n++;});
  COFantasyItemsUndoBridge.commit(tx);
  whisper('✓ '+n+' entrée(s) récupérée(s). <code>!cof-undo</code> restaure l’ensemble.');
}

function giveOneEntry(s,e,target,equip){
  if(!e||!e.linked||e.linked.status!=='ok')return{ok:false,error:'Référence ITEM invalide.'};
  if(!entryAvailable(e))return{ok:false,error:'Ce loot a déjà été récupéré.'};
  var qty=e.linked.item.category==='consommable'?e.linked.qty:1,
      tx=COFantasyItemsUndoBridge.begin('COI : donner et récupérer '+e.linked.item.name,[target],
        {full:true,tokens:true,extraTokenIds:[e.tokenId],tokenGmNotes:true}),
      r=COFantasyItems.giveDirect(e.linked.item.id,target,equip,qty,{undo:false,whisper:false});
  if(!r.ok)return r;
  if(!markTaken(e))return{ok:false,error:'Objet donné, mais impossible de marquer le loot. Utilise !cof-undo immédiatement.'};
  COFantasyItemsUndoBridge.commit(tx);
  return{ok:true,message:r.message};
}
function giveEntry(msg){
  if(!playerIsGM(msg.playerid))return;
  var s=getSession(flag(msg.content,'sid')),e=getEntry(s,flag(msg.content,'entry')),
      target=flag(msg.content,'target'),equip=/(?:^|\s)--equip(?:\s|$)/i.test(msg.content);
  if(!s||!e)return whisper('Session expirée. Relance <code>!coi-loot</code>.');
  var r=giveOneEntry(s,e,target,equip);
  if(!r.ok)return whisper(r.error);
  whisper(r.message+'<br><span style="color:#50754a">✓ Loot retiré.</span><br><span style="font-size:9px">Un seul <code>!cof-undo</code> restaure l’objet et le loot.</span>');
}
function giveItem(msg){
  if(!playerIsGM(msg.playerid))return;
  var s=getSession(flag(msg.content,'sid')),iid=flag(msg.content,'item'),target=flag(msg.content,'target'),
      all=/(?:^|\s)--all(?:\s|$)/i.test(msg.content),equip=/(?:^|\s)--equip(?:\s|$)/i.test(msg.content);
  if(!s)return whisper('Session expirée. Relance <code>!coi-loot</code>.');

  var es=Object.keys(s.entries).map(function(k){return s.entries[k];}).filter(function(e){
    return e.linked&&e.linked.status==='ok'&&e.linked.item.id===iid&&entryAvailable(e);
  });
  if(!es.length)return whisper('Aucun exemplaire restant de cet objet.');

  var item=es[0].linked.item;
  if(all&&item.category==='consommable'){
    var qty=es.reduce(function(a,e){return a+e.linked.qty;},0),tids=sourceTokens(es),
        tx=COFantasyItemsUndoBridge.begin('COI : donner tout et récupérer '+item.name,[target],
          {full:true,tokens:true,extraTokenIds:tids,tokenGmNotes:true}),
        r=COFantasyItems.giveDirect(iid,target,false,qty,{undo:false,whisper:false});
    if(!r.ok)return whisper(r.error);
    var n=0;es.forEach(function(e){if(markTaken(e))n++;});
    COFantasyItemsUndoBridge.commit(tx);
    return whisper(r.message+'<br><span style="color:#50754a">✓ '+n+' source(s) retirée(s).</span><br><span style="font-size:9px">Un seul <code>!cof-undo</code> restaure le tout.</span>');
  }

  var one=es[0],res=giveOneEntry(s,one,target,equip);
  if(!res.ok)return whisper(res.error);
  whisper(res.message+'<br><span style="color:#50754a">✓ Loot retiré.</span><br><span style="font-size:9px">Un seul <code>!cof-undo</code> restaure le tout.</span>');
}

function money(msg){
  if(!playerIsGM(msg.playerid))return;
  var s=getSession(flag(msg.content,'sid')),target=flag(msg.content,'target');
  if(!s)return whisper('Session expirée. Relance <code>!coi-loot</code>.');

  var es=Object.keys(s.entries).map(function(k){return s.entries[k];})
    .filter(function(e){return e.currency&&entryAvailable(e);});
  if(!es.length)return whisper('Aucune monnaie restante dans cette session.');

  var total=es.reduce(function(a,e){return a+toPC(e.currency);},0);
  if(total<=0)return whisper('Total monétaire nul.');
  if(!COFantasyRest||typeof COFantasyRest.partyInfo!=='function')
    return whisper('Pont de partage du groupe indisponible.');

  COFantasyRest.partyInfo(function(info){
    var group=info.main||[];
    if(!group.length)return whisper('Aucun PJ principal dans l’Équipe PJ.');

    if(target){
      if(group.indexOf(target)<0){
        var tch=getObj('character',target);
        return whisper(
          '<b>'+(tch?esc(tch.get('name')||'Cette cible'):'Cette cible')+
          '</b> n’est pas un PJ principal de l’Équipe PJ.'
        );
      }

      var tidsSingle=sourceTokens(es),
          txSingle=COFantasyItemsUndoBridge.begin(
            'COI : donner tout le butin monétaire à '+charName(target),
            [target],
            {names:['bourse_pp','bourse_po','bourse_pa','bourse_pc'],
             tokens:false,extraTokenIds:tidsSingle,tokenGmNotes:true}
          );

      COFantasyRest.addLootShare(target,total,'PP');
      es.forEach(markTaken);
      COFantasyItemsUndoBridge.commit(txSingle);

      return whisper(
        '<b>💰 Butin monétaire attribué :</b> '+esc(fmtPC(total))+'<br>'+
        '<b>Bénéficiaire :</b> '+esc(charName(target))+'<br>'+
        '<span style="color:#50754a">✓ Toute la monnaie a été retirée du loot.</span><br>'+
        '<span style="font-size:9px">Un seul <code>!cof-undo</code> restaure la bourse et les loots.</span>'
      );
    }

    var share=Math.floor(total/group.length),rem=total-share*group.length,common=null;
    if(rem>0){
      common=commonInventoryCharacter();
      if(!common.ok)return whisper(common.error);
    }

    var tids=sourceTokens(es),undoChars=group.slice();
    if(rem>0&&undoChars.indexOf(common.id)<0)undoChars.push(common.id);

    var tx=COFantasyItemsUndoBridge.begin('COI : partager et récupérer loot',undoChars,
      {names:['bourse_pp','bourse_po','bourse_pa','bourse_pc'],
       tokens:false,extraTokenIds:tids,tokenGmNotes:true});

    if(share>0)group.forEach(function(cid){COFantasyRest.addLootShare(cid,share,'PP');});
    if(rem>0)COFantasyRest.addLootShare(common.id,rem,'PP');
    es.forEach(markTaken);
    COFantasyItemsUndoBridge.commit(tx);

    var x='<b>💰 Butin partagé :</b> '+esc(fmtPC(total));
    if(share>0)x+='<br><b>'+group.length+' PJ :</b> '+esc(fmtPC(share))+' chacun.';
    else x+='<br><b>'+group.length+' PJ :</b> aucune pièce individuelle.';
    if(rem>0)x+='<br><b>Inventaire Commun :</b> +'+esc(fmtPC(rem))+'.';
    x+='<br><span style="color:#50754a">✓ Toute la monnaie a été retirée du loot.</span><br>'+
      '<span style="font-size:9px">Un seul <code>!cof-undo</code> restaure les bourses et les loots.</span>';
    whisper(x);
  });
}

function add(msg){
  if(!playerIsGM(msg.playerid))return;
  var toks=selectedTokens(msg),tid=flag(msg.content,'token'),tok=tid?getObj('graphic',tid):null,
      text=restoreInlineExpressions(msg,textFlag(msg.content));
  if(!tok){if(toks.length!==1)return whisper('Sélectionne exactement un token.');tok=toks[0];}
  if(!text)return whisper('Utilise <code>!coi-loot-add --text ?{Loot à ajouter}</code>.');
  var tx=COFantasyItemsUndoBridge.begin('COI : ajouter loot token',[],{tokens:false,extraTokenIds:[tok.id],tokenGmNotes:true});
  appendTokenLine(tok.id,text);
  COFantasyItemsUndoBridge.commit(tx);
  whisper('🎁 Loot ajouté à <b>'+esc(tok.get('name')||'token')+'</b> : '+esc(text)+'<br><span style="font-size:9px"><code>!cof-undo</code> annule aussi cet ajout.</span>');
}
function clear(msg){
  if(!playerIsGM(msg.playerid))return;
  var toks=selectedTokens(msg),tid=flag(msg.content,'token');
  if(tid){
    var one=getObj('graphic',tid);
    toks=one?[one]:[];
  }
  if(!toks.length)return whisper('Sélectionne au moins un token.');

  var ids=toks.map(function(t){return t.id;}),
      tx=COFantasyItemsUndoBridge.begin('COI : vider loot token',[],{tokens:false,extraTokenIds:ids,tokenGmNotes:true});

  toks.forEach(function(tok){
    var tm=parseTokenModel(tok);
    tm.archive=[];
    writeTokenModel(tok,tm,[],tm.taken,[]);
  });
  invalidateSessionsForTokens(ids);
  COFantasyItemsUndoBridge.commit(tx);
  whisper('🎁 Loot spécifique vidé sur <b>'+toks.length+' token(s)</b>. Les marqueurs du loot commun déjà récupéré sont conservés.');
}
function reset(msg){
  if(!playerIsGM(msg.playerid))return;
  var toks=selectedTokens(msg),tid=flag(msg.content,'token');
  if(tid){
    var one=getObj('graphic',tid);
    toks=one?[one]:[];
  }
  if(!toks.length)return whisper('Sélectionne au moins un token.');

  var ids=toks.map(function(t){return t.id;}),
      tx=COFantasyItemsUndoBridge.begin('COI : réinitialiser les loots',[],{tokens:false,extraTokenIds:ids,tokenGmNotes:true}),
      restored=0;

  toks.forEach(function(tok){
    var tm=parseTokenModel(tok),lines=tm.lines.slice(),seen={};
    lines.forEach(function(line){seen[cleanLine(line)]=1;});
    (tm.archive||[]).forEach(function(line){
      line=cleanLine(line);
      if(line&&!seen[line]){lines.push(line);seen[line]=1;restored++;}
    });
    tm.taken={};
    tm.archive=[];
    writeTokenModel(tok,tm,lines,tm.taken,[]);
  });

  invalidateSessionsForTokens(ids);
  COFantasyItemsUndoBridge.commit(tx);
  whisper('↺ <b>Loot réinitialisé sur '+toks.length+' token(s).</b><br>'+
    '• marqueurs du loot commun effacés ;<br>'+
    '• '+restored+' loot(s) propre(s) au token restauré(s) depuis l’archive ;<br>'+
    '• anciennes sessions Loot invalidées.<br>'+
    '<span style="font-size:9px">Relance <code>!coi-loot</code>. <code>!cof-undo</code> annule aussi ce reset.</span>');
}

function help(msg){
  if(!playerIsGM(msg.playerid))return;
  whisper('<div style="background:#fffaf2;border:1px solid #6f4a26;padding:8px;border-radius:6px">'+
    '<b>🎁 COFantasy Loot '+VERSION+'</b><br>'+
    '<code>!coi-loot</code> — fiche synthétique de la sélection.<br>'+
    '<code>!coi-loot-add --text ?{Loot}</code> — ajoute une ligne au token.<br>'+
    '<code>!coi-loot-clear</code> — vide le loot spécifique du token.<br>'+
    '<code>!coi-loot-reset</code> — réinitialise complètement les loots des tokens sélectionnés (commun + loots spécifiques archivés + sessions).<br>'+
    '<code>!coi-loot-money --sid ID</code> — partage la monnaie restante également entre les PJ.<br>'+
    '<code>!coi-loot-money --sid ID --target CHAR_ID</code> — donne toute la monnaie restante à un seul PJ.<br><br>'+
    '<b>Format V4 :</b><br><code>[LOOT]</code><br>'+
    '<code>TYPE: CREATURE</code><br><code>VALUE: [[2d10+5]] PA</code><br>'+
    '<code>FAMILY: Humanoïde</code><br><code>TIER: 2-4</code><br>'+
    '<code>RARITY: Utile</code><br><code>ACTION: en fouillant ses affaires</code><br>'+
    '<code>RESOURCES: de la monnaie et du matériel utile</code><br>'+
    '<code>ITEM: Hache à deux mains +1</code><br><code>SPECIAL: Clé en bronze</code><br>'+
    '<code>[/LOOT]</code><br><br>'+
    'TYPE accepte <b>CREATURE</b>, <b>CONTAINER</b> ou <b>CACHE</b>. Les anciennes GM Notes restent lisibles en mode compatibilité.'+
    '</div>');
}

function chat(msg){
  if(!msg||msg.type!=='api')return;
  var cmd=String(msg.content||'').trim().split(/\s+/)[0].toLowerCase();
  if(cmd==='!coi-loot'){render(msg);return;}
  if(cmd==='!coi-loot-show'){showPlayers(msg);return;}
  if(cmd==='!coi-loot-details'){details(msg);return;}
  if(cmd==='!coi-loot-take'){takeEntry(msg);return;}
  if(cmd==='!coi-loot-take-all'){takeAll(msg);return;}
  if(cmd==='!coi-loot-give'){giveEntry(msg);return;}
  if(cmd==='!coi-loot-give-item'){giveItem(msg);return;}
  if(cmd==='!coi-loot-money'){money(msg);return;}
  if(cmd==='!coi-loot-add'){add(msg);return;}
  if(cmd==='!coi-loot-clear'){clear(msg);return;}
  if(cmd==='!coi-loot-reset'){reset(msg);return;}
  if(cmd==='!coi-loot-help'){help(msg);return;}
}
function ready(){
  cleanSessions();
  log(SCRIPT+' v'+VERSION+' prêt — fiche synthétique RP + CREATURE/CONTAINER/CACHE + Undo.');
}
return{chat:chat,ready:ready};
}());

on('ready',COFantasyLoot.ready);
on('chat:message',COFantasyLoot.chat);
