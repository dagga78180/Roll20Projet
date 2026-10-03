/* COAlaric V2.0.0 — commerce, marchandage, vente, vol et ardoise.
 * Documentation : README.md · Audit : AUDIT_V2.md
 */
var COAlaric = COAlaric || (function () {
  'use strict';

  var SCRIPT = 'COAlaric';
  var VERSION = '2.0.0';
  var STATE_VERSION = 1;
  var TX_TTL = 24 * 60 * 60 * 1000;
  var MAX_ACTIVE_TX = 100;
  var MAX_HISTORY = 20;
  var MAX_LINES = 50;
  var MAX_QTY_LINE = 100;
  var MAX_TOTAL_QTY = 200;

  var ATTR_AFFINITY = 'coalaric_affinite';
  var ATTR_SLATE_INITIAL = 'coalaric_ardoise_initiale';
  var ATTR_SLATE_REMAINING = 'coalaric_ardoise_restante';

  function esc(v) {
    return String(v === undefined || v === null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function href(v) {
    return esc(v).replace(/@/g, '&#64;').replace(/\{/g, '&#123;')
      .replace(/\}/g, '&#125;').replace(/\|/g, '&#124;');
  }
  function btn(label, command, color) {
    return '<a style="display:inline-block;background:' + (color || '#70543e') +
      ';color:#fff;padding:5px 8px;margin:2px;border-radius:4px;text-decoration:none;font-weight:bold" href="' +
      href(command) + '">' + esc(label) + '</a>';
  }
  function box(title, body) {
    return '<div style="border:1px solid #70543e;background:#fffaf2;padding:8px;border-radius:6px;max-width:420px">' +
      '<div style="font-size:15px;font-weight:bold;color:#5b3213;text-align:center;margin-bottom:5px">' + esc(title) + '</div>' +
      body + '</div>';
  }
  function gm(html) { sendChat(SCRIPT, '/w gm ' + html, null, {noarchive: true}); }
  function whisperPlayerId(pid, html) {
    var p = getObj('player', pid); if (!p) return;
    var name = String(p.get('_displayname') || p.get('displayname') || '').replace(/"/g, '');
    if (!name) return;
    sendChat(SCRIPT, '/w "' + name + '" ' + html, null, {noarchive: true});
  }
  function whisperMsg(msg, html) {
    if (playerIsGM(msg.playerid)) return gm(html);
    whisperPlayerId(msg.playerid, html);
  }

  function playerAction(msg, cid, action, detail) {
    if (!msg || playerIsGM(msg.playerid)) return;
    var p = getObj('player', msg.playerid), pn = p ? String(p.get('_displayname') || p.get('displayname') || 'Joueur') : 'Joueur';
    var body = '<b>' + esc(charName(cid)) + '</b> <span style="color:#765">(' + esc(pn) + ')</span><br>' + esc(action);
    if (detail) body += '<br><span style="font-size:10px;color:#654">' + esc(detail) + '</span>';
    gm(box('Action du PJ', body));
  }
  function num(v, d) { var n = parseFloat(v); return isNaN(n) ? d : n; }
  function int(v, d) { var n = parseInt(v, 10); return isNaN(n) ? d : n; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function round2(v) { return Math.round((num(v, 0) + Number.EPSILON) * 100) / 100; }
  function fmtPA(v) {
    v = round2(v);
    var s = (Math.round(v * 100) % 100 === 0) ? String(Math.round(v)) : v.toFixed(2).replace('.', ',');
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' PA';
  }
  function parseFlag(s, name) {
    var m = String(s || '').match(new RegExp('(?:^|\\s)--' + name + '\\s+(\\S+)', 'i'));
    return m ? m[1] : null;
  }
  function hasFlag(s, name) { return new RegExp('(?:^|\\s)--' + name + '(?:\\s|$)', 'i').test(String(s || '')); }
  function now() { return Date.now(); }
  function clone(v) { try { return JSON.parse(JSON.stringify(v)); } catch (e) { return v; } }
  function charName(cid) { var c = getObj('character', cid); return c ? String(c.get('name') || 'Personnage') : 'Personnage'; }
  function attrObj(cid, name) {
    var a = findObjs({_type: 'attribute', _characterid: cid, name: name}) || [];
    if (a.length) return a[0];
    var low = String(name).toLowerCase(), all = findObjs({_type: 'attribute', _characterid: cid}) || [];
    for (var i = 0; i < all.length; i++) if (String(all[i].get('name') || '').toLowerCase() === low) return all[i];
    return null;
  }
  function getA(cid, name, d) {
    var a = attrObj(cid, name); if (!a) return d;
    var v = a.get('current'); return (v === undefined || v === null || v === '') ? d : v;
  }
  function setA(cid, name, v) {
    var a = attrObj(cid, name);
    if (!a) return createObj('attribute', {characterid: cid, name: name, current: v});
    a.set('current', v); return a;
  }
  function targetCharacter(raw) {
    var id = String(raw || ''), ch = getObj('character', id), tok;
    if (ch) return ch;
    tok = getObj('graphic', id);
    if (tok && tok.get('represents')) return getObj('character', tok.get('represents'));
    return null;
  }
  function isPJ(cid) { return String(getA(cid, 'type_personnage', 'PJ')).toUpperCase() === 'PJ'; }
  function ownerPlayerIds(cid) {
    var ch = getObj('character', cid); if (!ch) return [];
    var ids = String(ch.get('controlledby') || '').split(',').filter(Boolean), out = [];
    if (ids.indexOf('all') >= 0) {
      (findObjs({_type: 'player'}) || []).forEach(function (p) { if (!playerIsGM(p.id)) out.push(p.id); });
    } else {
      ids.forEach(function (id) { if (!playerIsGM(id) && getObj('player', id)) out.push(id); });
    }
    return out.filter(function (id, i, a) { return a.indexOf(id) === i; });
  }
  function controls(pid, cid) {
    if (playerIsGM(pid)) return true;
    var ch = getObj('character', cid); if (!ch) return false;
    var ids = String(ch.get('controlledby') || '').split(',').filter(Boolean);
    return ids.indexOf('all') >= 0 || ids.indexOf(pid) >= 0;
  }
  function toControllers(cid, html) {
    var ids = ownerPlayerIds(cid);
    if (!ids.length) {
      gm('<div style="color:#8a4b2f"><b>Aucun joueur contrôleur pour ' + esc(charName(cid)) + '.</b></div>' + html);
      return;
    }
    ids.forEach(function (id) { whisperPlayerId(id, html); });
  }
  function requireController(msg, cid) {
    if (!controls(msg.playerid, cid)) {
      whisperMsg(msg, box('COAlaric', 'Vous ne contrôlez pas ce personnage.'));
      return false;
    }
    return true;
  }
  function requireGM(msg) { return !!playerIsGM(msg.playerid); }

  function store() {
    state.COAlaric = state.COAlaric || {version: STATE_VERSION, seq: 0, transactions: {}, history: []};
    var s = state.COAlaric;
    if (!s.transactions || typeof s.transactions !== 'object') s.transactions = {};
    if (!Array.isArray(s.history)) s.history = [];
    if (!s.seq) s.seq = 0;
    s.version = STATE_VERSION;
    return s;
  }
  function history(type, cid, detail) {
    var h = store().history;
    h.unshift({at: now(), type: type, characterId: cid || '', name: cid ? charName(cid) : '', detail: detail || ''});
    if (h.length > MAX_HISTORY) h.length = MAX_HISTORY;
  }
  function cleanupTransactions() {
    var s = store(), t = now(), ids = Object.keys(s.transactions);
    ids.forEach(function (id) {
      var tx = s.transactions[id];
      if (!tx || (t - int(tx.updatedAt || tx.createdAt, t)) > TX_TTL) delete s.transactions[id];
    });
    ids = Object.keys(s.transactions);
    if (ids.length > MAX_ACTIVE_TX) {
      ids.sort(function (a, b) { return int(s.transactions[a].updatedAt, 0) - int(s.transactions[b].updatedAt, 0); });
      while (ids.length > MAX_ACTIVE_TX) delete s.transactions[ids.shift()];
    }
  }
  function newTx(kind, cid) {
    cleanupTransactions();
    var s = store(), id = 'ALR-' + (++s.seq), tx = {
      id: id, kind: kind, characterId: cid, createdAt: now(), updatedAt: now(), status: 'OPEN'
    };
    s.transactions[id] = tx; return tx;
  }
  function txGet(id) { var tx = store().transactions[String(id || '')]; if (tx) tx.updatedAt = now(); return tx || null; }
  function txDone(tx, status) { if (!tx) return; tx.status = status || 'DONE'; tx.updatedAt = now(); }
  function activeStatus(tx, allowed) { return tx && allowed.indexOf(tx.status) >= 0; }

  function affinity(cid) { return clamp(int(getA(cid, ATTR_AFFINITY, 0), 0), -3, 3); }
  function setAffinity(cid, value, reason) {
    var before = affinity(cid), after = clamp(int(value, before), -3, 3);
    setA(cid, ATTR_AFFINITY, after);
    if (before !== after) history('affinite', cid, before + ' → ' + after + (reason ? ' (' + reason + ')' : ''));
    return after;
  }
  function slate(cid) {
    var initial = Math.max(0, round2(num(getA(cid, ATTR_SLATE_INITIAL, 0), 0)));
    var remaining = Math.max(0, round2(num(getA(cid, ATTR_SLATE_REMAINING, 0), 0)));
    if (remaining <= 0) return {initial: 0, remaining: 0, rate: 0};
    if (initial < remaining || initial <= 0) initial = remaining;
    var ratio = remaining / initial, rate = ratio > .75 ? 40 : (ratio > .50 ? 30 : (ratio > .25 ? 20 : 10));
    return {initial: initial, remaining: remaining, rate: rate};
  }
  function writeSlate(cid, initial, remaining, reason) {
    initial = Math.max(0, round2(num(initial, 0))); remaining = Math.max(0, round2(num(remaining, 0)));
    if (remaining <= 0) { initial = 0; remaining = 0; }
    if (initial < remaining) initial = remaining;
    setA(cid, ATTR_SLATE_INITIAL, initial); setA(cid, ATTR_SLATE_REMAINING, remaining);
    history('ardoise', cid, 'initiale ' + fmtPA(initial) + ', restante ' + fmtPA(remaining) + (reason ? ' (' + reason + ')' : ''));
    return slate(cid);
  }
  function addSlate(cid, amount, reason) {
    amount = Math.max(0, round2(num(amount, 0))); var s = slate(cid);
    return writeSlate(cid, s.initial + amount, s.remaining + amount, reason || 'ajout');
  }
  function reduceSlate(cid, amount, reason) {
    amount = Math.max(0, round2(num(amount, 0))); var s = slate(cid), rem = Math.max(0, s.remaining - amount);
    return writeSlate(cid, rem > 0 ? s.initial : 0, rem, reason || 'règlement');
  }
  function commerceBlocked(cid) { var s = slate(cid); return affinity(cid) < 0 && s.remaining > 0; }
  function affinityLabel(a) {
    return ({'-3':'Rupture','-2':'Mauvaise relation','-1':'Méfiance','0':'Neutre','1':'Apprécié','2':'Très apprécié','3':'Favori'})[String(a)] || 'Neutre';
  }

  function moneyPC(cid) {
    return Math.max(0, int(getA(cid, 'bourse_pp', 0), 0)) * 1000000 +
      Math.max(0, int(getA(cid, 'bourse_po', 0), 0)) * 10000 +
      Math.max(0, int(getA(cid, 'bourse_pa', 0), 0)) * 100 +
      Math.max(0, int(getA(cid, 'bourse_pc', 0), 0));
  }
  function writeMoneyPC(cid, total) {
    total = Math.max(0, Math.round(total));
    var pp = Math.floor(total / 1000000); total %= 1000000;
    var po = Math.floor(total / 10000); total %= 10000;
    var pa = Math.floor(total / 100), pc = total % 100;
    setA(cid, 'bourse_pp', pp); setA(cid, 'bourse_po', po); setA(cid, 'bourse_pa', pa); setA(cid, 'bourse_pc', pc);
  }
  function debitPA(cid, pa) {
    var pc = Math.max(0, Math.round(round2(pa) * 100)), total = moneyPC(cid);
    if (total < pc) return false; writeMoneyPC(cid, total - pc); return true;
  }
  function creditPA(cid, pa) { writeMoneyPC(cid, moneyPC(cid) + Math.max(0, Math.round(round2(pa) * 100))); }

  function coiReady() {
    return typeof COFantasyItems !== 'undefined' && COFantasyItems &&
      typeof COFantasyItems.coAlaricPrepareSpec === 'function' &&
      typeof COFantasyItems.coAlaricGivePrepared === 'function';
  }
  function cofReady() {
    return typeof COFantasy !== 'undefined' && COFantasy &&
      typeof COFantasy.coiTestCompetence === 'function' &&
      typeof COFantasy.coiBeginUndo === 'function' &&
      typeof COFantasy.coiCommitUndo === 'function' &&
      typeof COFantasy.coiRollbackUndo === 'function';
  }
  function beginUndo(label, cid) { return cofReady() ? COFantasy.coiBeginUndo(label, [cid], {full: true, tokens: true}) : null; }
  function commitUndo(tx) { if (tx && cofReady()) COFantasy.coiCommitUndo(tx); }
  function rollbackUndo(tx) { if (tx && cofReady()) COFantasy.coiRollbackUndo(tx); }

  function commercialRound(v) {
    v = num(v, 0); var step = v < 100 ? 1 : (v < 1000 ? 5 : 10);
    return Math.round(v / step) * step;
  }
  function buyHaggleDD(discountPct) {
    if (discountPct <= 5) return 10; if (discountPct <= 10) return 14;
    if (discountPct <= 15) return 18; if (discountPct <= 20) return 22;
    if (discountPct <= 25) return 26; if (discountPct <= 30) return 30;
    return null;
  }
  function sellHaggleDD(catalogPct) {
    if (catalogPct <= 55) return 10; if (catalogPct <= 60) return 14;
    if (catalogPct <= 65) return 18; if (catalogPct <= 70) return 22;
    if (catalogPct <= 75) return 26; if (catalogPct <= 80) return 30;
    return null;
  }
  function concessionRate(margin) {
    if (margin === -1) return .75; if (margin === -2) return .60;
    if (margin === -3) return .40; if (margin === -4) return .20; return 0;
  }
  function buyCounter(starting, offer, margin, rateOverride) {
    var rate = rateOverride === undefined ? concessionRate(margin) : rateOverride;
    return commercialRound(starting - (starting - offer) * rate);
  }
  function sellCounter(baseOffer, ask, margin, rateOverride) {
    var rate = rateOverride === undefined ? concessionRate(margin) : rateOverride;
    return commercialRound(baseOffer + (ask - baseOffer) * rate);
  }
  function slateSurcharge(cid, commercialPA) {
    var s = slate(cid), extra = 0;
    if (s.remaining > 0 && s.rate > 0) extra = Math.min(s.remaining, round2(commercialPA * s.rate / 100));
    return {commercial: round2(commercialPA), rate: s.rate, extra: round2(extra), total: round2(commercialPA + extra), slate: s};
  }
  function theftBasePercent(margin, rescuedFailed) {
    if (margin >= -4 && margin <= 0 && rescuedFailed) return 25;
    if (margin >= -9) return 50;
    if (margin >= -14) return 75;
    return 100;
  }
  function theftDebtProposal(valuePA, margin, rescuedFailed, aff) {
    var base = theftBasePercent(margin, rescuedFailed), pct = clamp(base - (aff * 10), 10, 100);
    var amount = valuePA > 0 ? Math.max(1, Math.round(valuePA * pct / 100)) : 0;
    return {basePct: base, affinityAdjustment: -aff * 10, pct: pct, amount: amount};
  }
  function affinityFailureSuggestion(margin, rescuedFailed) {
    if (margin >= -4 && rescuedFailed) return 0;
    if (margin >= -9) return -1;
    if (margin >= -14) return -2;
    return -3;
  }

  function decodePayload(raw) {
    if (!raw) return {ok: false, error: 'Données --data absentes.'};
    try { return {ok: true, data: JSON.parse(decodeURIComponent(String(raw)))}; }
    catch (e) { return {ok: false, error: 'Données --data invalides : ' + e.message}; }
  }
  function lineTotal(line) { return round2(line.unitPricePA * line.qty); }
  function indicesTotal(tx, indexes) {
    var wanted = {}; (indexes || []).forEach(function (i) { wanted[String(i)] = true; });
    return round2(tx.items.reduce(function (sum, line, i) { return sum + (wanted[String(i)] ? lineTotal(line) : 0); }, 0));
  }
  function allIndices(tx) { return tx.items.map(function (_, i) { return i; }); }
  function complementIndices(tx, indexes) {
    var set = {}; (indexes || []).forEach(function (i) { set[String(i)] = true; });
    return allIndices(tx).filter(function (i) { return !set[String(i)]; });
  }
  function renderLines(tx, indexes) {
    var set = null;
    if (Array.isArray(indexes)) { set = {}; indexes.forEach(function (i) { set[String(i)] = true; }); }
    var html = '';
    tx.items.forEach(function (line, i) {
      if (set && !set[String(i)]) return;
      html += '<div style="border-top:1px solid #ddcdb9;padding:3px 0">' + esc(line.name) +
        (line.qty > 1 ? ' ×' + line.qty : '') + '<span style="float:right">' + esc(fmtPA(lineTotal(line))) + '</span></div>';
    });
    return html;
  }
  function cartPlayerCard(tx) {
    var cid = tx.characterId, base = indicesTotal(tx, allIndices(tx)), surcharge = slateSurcharge(cid, base), aff = affinity(cid), blocked = commerceBlocked(cid);
    var body = '<div><b>' + esc(charName(cid)) + '</b></div>' + renderLines(tx) +
      '<div style="border-top:2px solid #70543e;margin-top:4px;padding-top:4px"><b>Total proposé : ' + esc(fmtPA(surcharge.total)) + '</b></div>';
    if (blocked) body += '<div style="margin-top:6px;color:#8b1e1e"><b>Alaric suspend actuellement le commerce avec ce personnage.</b></div>';
    body += '<div style="text-align:center;margin-top:7px">';
    if (!blocked) body += btn('Acheter', '!co-alaric buy-offer --tx ' + tx.id, '#3f6b45');
    if (!blocked && aff >= 0) body += btn('Marchander', '!co-alaric select-start --tx ' + tx.id + ' --mode haggle', '#76559a');
    body += btn('Tenter un vol', '!co-alaric select-start --tx ' + tx.id + ' --mode theft', '#8a4f3d');
    body += btn('Annuler', '!co-alaric tx-cancel --tx ' + tx.id, '#666') + '</div>';
    return box('Panier d’Alaric', body);
  }
  function cartGMInfo(tx, warnings) {
    var cid = tx.characterId, s = slate(cid), a = affinity(cid), body = '<b>' + esc(charName(cid)) + '</b><br>' +
      'Affinité : <b>' + a + '</b> — ' + esc(affinityLabel(a)) + '<br>' +
      'Ardoise : <b>' + esc(fmtPA(s.remaining)) + '</b>' + (s.remaining ? ' · marge actuelle +' + s.rate + '%' : '') + '<br>' +
      'Valeur catalogue : <b>' + esc(fmtPA(indicesTotal(tx, allIndices(tx)))) + '</b>';
    if (warnings && warnings.length) body += '<div style="margin-top:5px;color:#8a6b21">' + warnings.map(esc).join('<br>') + '</div>';
    if (commerceBlocked(cid)) body += '<div style="margin-top:5px;color:#8b1e1e"><b>Commerce suspendu :</b> affinité négative + ardoise active. Le vol reste possible.</div>';
    else if (a <= -2) body += '<div style="margin-top:5px;color:#8a4f3d">Relation très mauvaise : Alaric peut refuser certaines ventes ou tout commerce. Le script laisse le choix au MJ.</div>';
    body += '<div style="margin-top:6px">' +
      btn('Affinité', '!co-alaric affinite --target ' + cid, '#76559a') +
      btn('Ardoise', '!co-alaric ardoise --target ' + cid, '#8a6a2f') +
      btn('Bloquer ce panier', '!co-alaric tx-block --tx ' + tx.id, '#8b1e1e') + '</div>';
    gm(box('COAlaric — transaction ' + tx.id, body));
  }
  function importCart(msg) {
    if (!requireGM(msg)) return;
    if (!coiReady()) return gm(box('COAlaric', '<b>CoFItem V2 requis.</b> API COAlaric introuvable.'));
    var target = targetCharacter(parseFlag(msg.content, 'target'));
    if (!target || !isPJ(target.id)) return gm(box('COAlaric', 'Cible invalide : utilise une fiche PJ ou un token lié à un PJ.'));
    var decoded = decodePayload(parseFlag(msg.content, 'data')); if (!decoded.ok) return gm(box('COAlaric', esc(decoded.error)));
    var payload = decoded.data, items = Array.isArray(payload) ? payload : (payload && Array.isArray(payload.items) ? payload.items : [payload]);
    if (!items.length || items.length > MAX_LINES) return gm(box('COAlaric', 'Panier refusé : 1 à ' + MAX_LINES + ' lignes autorisées.'));
    var prepared = [], errors = [], warnings = [], totalQty = 0;
    items.forEach(function (entry, i) {
      entry = entry && typeof entry === 'object' ? entry : {};
      var qty = clamp(int(entry.qty, 1), 1, MAX_QTY_LINE); totalQty += qty;
      var res = COFantasyItems.coAlaricPrepareSpec(entry);
      if (!res || !res.ok) { errors.push('Ligne ' + (i + 1) + ' : ' + ((res && res.errors) ? res.errors.join(' / ') : 'objet invalide')); return; }
      (res.warnings || []).forEach(function (w) { warnings.push('Ligne ' + (i + 1) + ' : ' + w); });
      prepared.push({spec: clone(entry), qty: qty, itemId: res.itemId, name: (res.data && res.data.name) || entry.name || ('Objet ' + (i + 1)), unitPricePA: round2(res.pricePA), category: res.data && res.data.category});
    });
    if (totalQty > MAX_TOTAL_QTY) errors.push('Quantité totale supérieure à ' + MAX_TOTAL_QTY + '.');
    if (errors.length) return gm(box('Commande Alaric refusée', errors.map(esc).join('<br>')));
    var tx = newTx('buy', target.id); tx.items = prepared; tx.status = 'CART'; tx.source = payload && payload.source || 'AlaricCode';
    history('panier', target.id, tx.id + ' · ' + fmtPA(indicesTotal(tx, allIndices(tx))));
    cartGMInfo(tx, warnings);
    toControllers(target.id, cartPlayerCard(tx));
  }

  function selectionCard(tx) {
    var selected = {}; (tx.selection || []).forEach(function (i) { selected[String(i)] = true; });
    var title = tx.selectionMode === 'theft' ? 'Que voulez-vous tenter de voler ?' : 'Que voulez-vous marchander ?';
    var body = '<div style="font-size:10px;color:#765;margin-bottom:5px">Sélectionnez une ou plusieurs lignes.</div>';
    tx.items.forEach(function (line, i) {
      var on = !!selected[String(i)];
      body += '<div style="border-top:1px solid #ddcdb9;padding:3px 0">' +
        btn(on ? '✓' : '○', '!co-alaric select-toggle --tx ' + tx.id + ' --index ' + i, on ? '#3f6b45' : '#777') +
        ' ' + esc(line.name) + (line.qty > 1 ? ' ×' + line.qty : '') + ' — ' + esc(fmtPA(lineTotal(line))) + '</div>';
    });
    var total = indicesTotal(tx, tx.selection || []);
    body += '<div style="margin-top:5px"><b>Sélection : ' + esc(fmtPA(total)) + '</b></div><div style="text-align:center">' +
      btn('Tout', '!co-alaric select-all --tx ' + tx.id, '#506070') +
      btn('Rien', '!co-alaric select-none --tx ' + tx.id, '#666') +
      btn('Continuer', '!co-alaric select-confirm --tx ' + tx.id, '#70543e') + btn('Retour', '!co-alaric select-cancel --tx ' + tx.id, '#666') + '</div>';
    return box(title, body);
  }
  function selectStart(msg) {
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || tx.kind !== 'buy' || !activeStatus(tx, ['CART'])) return;
    if (!requireController(msg, tx.characterId)) return;
    var mode = String(parseFlag(msg.content, 'mode') || '');
    if (mode !== 'haggle' && mode !== 'theft') return;
    if (mode === 'haggle' && (affinity(tx.characterId) < 0 || commerceBlocked(tx.characterId))) return whisperMsg(msg, box('Marchandage', 'Alaric refuse de marchander avec ce personnage.'));
    tx.selectionMode = mode; tx.selection = allIndices(tx); tx.status = 'SELECTING';
    playerAction(msg, tx.characterId, mode === 'haggle' ? 'ouvre un marchandage' : 'prépare une tentative de vol', 'Le PJ choisit maintenant les objets concernés.');
    whisperMsg(msg, selectionCard(tx));
  }
  function selectToggle(msg) {
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || !activeStatus(tx, ['SELECTING'])) return;
    if (!requireController(msg, tx.characterId)) return;
    var i = int(parseFlag(msg.content, 'index'), -1); if (i < 0 || i >= tx.items.length) return;
    var a = tx.selection || [], pos = a.indexOf(i); if (pos >= 0) a.splice(pos, 1); else a.push(i); a.sort(function (x, y) { return x - y; }); tx.selection = a;
    whisperMsg(msg, selectionCard(tx));
  }
  function selectAll(msg, none) {
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || !activeStatus(tx, ['SELECTING'])) return;
    if (!requireController(msg, tx.characterId)) return;
    tx.selection = none ? [] : allIndices(tx); whisperMsg(msg, selectionCard(tx));
  }
  function selectCancel(msg) {
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || !activeStatus(tx, ['SELECTING'])) return;
    if (!requireController(msg, tx.characterId)) return;
    tx.selection = []; tx.selectionMode = null; tx.status = 'CART';
    whisperMsg(msg, cartPlayerCard(tx));
  }
  function selectConfirm(msg) {
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || !activeStatus(tx, ['SELECTING'])) return;
    if (!requireController(msg, tx.characterId)) return;
    if (!tx.selection || !tx.selection.length) return whisperMsg(msg, box('COAlaric', 'Sélectionnez au moins un objet.'));
    if (tx.selectionMode === 'haggle') return startHaggle(msg, tx);
    return startTheft(msg, tx);
  }

  function purchaseOffer(tx, purchaseIndices, stolenIndices, label) {
    purchaseIndices = purchaseIndices || []; stolenIndices = stolenIndices || [];
    var commercial = 0;
    if (tx.special === 'haggle' && tx.haggle && tx.haggle.resolvedSelectedPA !== undefined) {
      var selectedSet = {}; tx.haggle.selection.forEach(function (i) { selectedSet[String(i)] = true; });
      commercial = round2(tx.haggle.resolvedSelectedPA + purchaseIndices.reduce(function (sum, i) {
        return sum + (selectedSet[String(i)] ? 0 : lineTotal(tx.items[i]));
      }, 0));
    } else commercial = indicesTotal(tx, purchaseIndices);
    var calc = slateSurcharge(tx.characterId, commercial);
    tx.finalOffer = {purchaseIndices: purchaseIndices.slice(), stolenIndices: stolenIndices.slice(), commercialPA: calc.commercial, surchargeRate: calc.rate, surchargePA: calc.extra, totalPA: calc.total, slateInitial: calc.slate.initial, slateRemaining: calc.slate.remaining};
    tx.status = 'FINAL_OFFER';
    var body = '';
    if (stolenIndices.length) body += '<div><b>Objets obtenus par le vol :</b></div>' + renderLines(tx, stolenIndices);
    if (purchaseIndices.length) {
      body += '<div style="margin-top:5px"><b>Objets à acheter :</b></div>' + renderLines(tx, purchaseIndices);
      if (tx.special === 'haggle' && tx.haggle && tx.haggle.resolvedSelectedPA !== undefined) {
        body += '<div style="font-size:10px;color:#654">Prix marchandé de la sélection : <b>' + esc(fmtPA(tx.haggle.resolvedSelectedPA)) + '</b></div>';
      }
      body += '<div style="border-top:2px solid #70543e;margin-top:5px;padding-top:4px"><b>Total à payer : ' + esc(fmtPA(calc.total)) + '</b></div>';
    }
    body += '<div style="text-align:center;margin-top:6px">' +
      btn(label || (purchaseIndices.length ? 'Accepter et payer' : 'Récupérer les objets'), '!co-alaric purchase-accept --tx ' + tx.id, '#3f6b45') +
      (stolenIndices.length && purchaseIndices.length ? btn('Prendre seulement le vol', '!co-alaric theft-stolen-only --tx ' + tx.id, '#8a4f3d') : '') +
      (purchaseIndices.length && !stolenIndices.length ? btn('Refuser', '!co-alaric tx-cancel --tx ' + tx.id, '#666') : '') + '</div>';
    toControllers(tx.characterId, box('Proposition d’Alaric', body));
    gm(box('COAlaric — offre finale ' + tx.id,
      '<b>' + esc(charName(tx.characterId)) + '</b><br>Prix commercial : ' + esc(fmtPA(calc.commercial)) +
      (calc.extra ? '<br>Majoration ardoise +' + calc.rate + '% : <b>' + esc(fmtPA(calc.extra)) + '</b>' : '') +
      '<br>Total joueur : <b>' + esc(fmtPA(calc.total)) + '</b>'));
  }
  function buyOffer(msg) {
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || tx.kind !== 'buy' || !activeStatus(tx, ['CART'])) return;
    if (!requireController(msg, tx.characterId)) return;
    if (commerceBlocked(tx.characterId)) return whisperMsg(msg, box('Commerce suspendu', 'L’ardoise doit être réglée avant un nouvel achat.'));
    tx.special = 'none';
    playerAction(msg, tx.characterId, 'choisit l’achat direct', 'Panier complet : ' + fmtPA(indicesTotal(tx, allIndices(tx))));
    purchaseOffer(tx, allIndices(tx), [], 'Accepter et payer');
  }
  function purchaseAccept(msg) {
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || tx.kind !== 'buy' || !activeStatus(tx, ['FINAL_OFFER'])) return;
    if (!requireController(msg, tx.characterId)) return;
    var offer = tx.finalOffer; if (!offer) return;
    playerAction(msg, tx.characterId, 'accepte la proposition finale', 'À payer : ' + fmtPA(offer.totalPA));
    var currentSlate = slate(tx.characterId);

    if (round2(currentSlate.initial) !== round2(offer.slateInitial) || round2(currentSlate.remaining) !== round2(offer.slateRemaining)) {
      whisperMsg(msg, box('Prix mis à jour', 'L’ardoise a changé depuis cette proposition. Le total est recalculé.'));
      return purchaseOffer(tx, offer.purchaseIndices, offer.stolenIndices, 'Accepter et payer');
    }
    var costPC = Math.round(offer.totalPA * 100);
    if (moneyPC(tx.characterId) < costPC) return whisperMsg(msg, box('Paiement impossible', 'Fonds insuffisants pour régler ' + esc(fmtPA(offer.totalPA)) + '.'));
    if (!coiReady() || !cofReady()) return gm(box('COAlaric', 'Pont COFantasy/CoFItem indisponible. Transaction non exécutée.'));
    tx.status = 'COMMITTING';
    var undo = beginUndo('COAlaric : achat ' + tx.id, tx.characterId), failure = null, given = [];
    try {
      if (offer.totalPA > 0 && !debitPA(tx.characterId, offer.totalPA)) throw new Error('Fonds devenus insuffisants.');
      if (offer.surchargePA > 0) reduceSlate(tx.characterId, offer.surchargePA, 'majoration achat ' + tx.id);
      var giveIndexes = offer.stolenIndices.concat(offer.purchaseIndices), seen = {};
      giveIndexes.forEach(function (i) {
        if (seen[String(i)]) return; seen[String(i)] = true;
        var line = tx.items[i], r = COFantasyItems.coAlaricGivePrepared(line.itemId, tx.characterId, line.qty);
        if (!r || !r.ok) throw new Error((r && r.error) || ('Échec du don de ' + line.name));
        given.push(line.name + (line.qty > 1 ? ' ×' + line.qty : ''));
      });
    } catch (e) { failure = e; }
    if (failure) {
      rollbackUndo(undo); tx.status = 'FINAL_OFFER';
      return gm(box('COAlaric — transaction annulée', '<b>Aucune modification conservée.</b><br>' + esc(failure.message)));
    }
    commitUndo(undo); txDone(tx, 'DONE');
    history('achat', tx.characterId, tx.id + ' · ' + fmtPA(offer.totalPA) + (offer.surchargePA ? ' dont ' + fmtPA(offer.surchargePA) + ' d’ardoise' : ''));
    toControllers(tx.characterId, box('Transaction terminée', 'Paiement : <b>' + esc(fmtPA(offer.totalPA)) + '</b><br>' +
      (given.length ? 'Objets reçus : ' + esc(given.join(', ')) : '') +
      '<br><span style="font-size:9px;color:#765">Le MJ peut annuler l’ensemble avec !cof-undo.</span>'));
    gm(box('COAlaric — transaction terminée', '<b>' + esc(charName(tx.characterId)) + '</b><br>' + esc(given.join('<br>')) + '<br>Total : ' + esc(fmtPA(offer.totalPA))));
  }

  function startHaggle(msg, tx) {
    if (affinity(tx.characterId) < 0 || commerceBlocked(tx.characterId)) return whisperMsg(msg, box('Marchandage', 'Alaric refuse de marchander avec ce personnage.'));
    var value = indicesTotal(tx, tx.selection); tx.special = 'haggle';
    playerAction(msg, tx.characterId, 'confirme les objets à marchander', 'Valeur concernée : ' + fmtPA(value));
    tx.haggle = {side: 'buy', selection: tx.selection.slice(), startingPA: value}; tx.status = 'HAGGLE_WAIT_OFFER';
    var body = '<b>Valeur concernée : ' + esc(fmtPA(value)) + '</b><br>' + renderLines(tx, tx.selection) +
      '<div style="text-align:center;margin-top:6px">' + btn('Faire une offre', '!co-alaric haggle-offer --tx ' + tx.id + ' --offer ?{Votre offre en PA|' + Math.round(value * .9) + '}', '#76559a') + '</div>';
    whisperMsg(msg, box('Marchandage', body));
  }
  function haggleOffer(msg) {
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || tx.kind !== 'buy' || !activeStatus(tx, ['HAGGLE_WAIT_OFFER'])) return;
    if (!requireController(msg, tx.characterId)) return;
    var h = tx.haggle, offer = round2(num(parseFlag(msg.content, 'offer'), NaN));
    if (!isFinite(offer) || offer <= 0 || offer >= h.startingPA) return whisperMsg(msg, box('Marchandage', 'L’offre doit être positive et inférieure à ' + esc(fmtPA(h.startingPA)) + '.'));
    var discount = (h.startingPA - offer) / h.startingPA * 100, ddBase = buyHaggleDD(discount), aff = affinity(tx.characterId);
    h.offerPA = offer; h.requestPct = round2(discount); h.ddBase = ddBase; h.affinity = aff;
    tx.status = ddBase === null ? 'HAGGLE_OUT_OF_BAND' : 'HAGGLE_ROLLING';
    playerAction(msg, tx.characterId, 'fait une offre', 'Offre : ' + fmtPA(offer) + ' sur ' + fmtPA(h.startingPA));
    whisperMsg(msg, box('Marchandage', 'Offre transmise au MJ.'));
    if (ddBase === null) {
      return gm(box('Marchandage hors barème — ' + tx.id,
        '<b>' + esc(charName(tx.characterId)) + '</b><br>Valeur : ' + esc(fmtPA(h.startingPA)) + '<br>Offre : <b>' + esc(fmtPA(offer)) + '</b> (' + h.requestPct + '% de remise)<br>' +
        '<div style="margin-top:6px">' + btn('Autoriser un jet…', '!co-alaric haggle-force-roll --tx ' + tx.id + ' --dd ?{DD final|34}', '#76559a') +
        btn('Refuser', '!co-alaric haggle-resolve --tx ' + tx.id + ' --price ' + commercialRound(h.startingPA), '#8a4f3d') +
        btn('Prix libre…', '!co-alaric haggle-resolve --tx ' + tx.id + ' --price ?{Prix final de la sélection|' + commercialRound(h.startingPA) + '}', '#506070') + '</div>'));
    }
    runHaggleRoll(tx, ddBase - aff);
  }
  function forceHaggleRoll(msg) {
    if (!requireGM(msg)) return;
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || !activeStatus(tx, ['HAGGLE_OUT_OF_BAND'])) return;
    var dd = Math.max(1, int(parseFlag(msg.content, 'dd'), 34)); tx.haggle.ddBase = null; tx.haggle.ddFinal = dd; tx.status = 'HAGGLE_ROLLING'; runHaggleRoll(tx, dd);
  }
  function runHaggleRoll(tx, dd) {
    if (!cofReady()) { tx.status = 'HAGGLE_WAIT_OFFER'; return gm(box('COAlaric', 'COFantasy V2 requis pour le test de Persuasion.')); }
    tx.haggle.ddFinal = dd;
    COFantasy.coiTestCompetence(tx.characterId, 'Persuasion', dd, {bonus: 0}, function (r) {
      if (!r || !r.ok) { tx.status = 'HAGGLE_WAIT_OFFER'; return gm(box('Marchandage', esc((r && r.error) || 'Jet impossible.'))); }
      tx.haggle.roll = r.total; tx.haggle.margin = r.marge; tx.status = 'HAGGLE_GM_RESOLVE';
      showHaggleResolution(tx);
    });
  }
  function haggleRatesForMargin(m) {
    if (m >= 0) return [1];
    if (m === -1) return [1, .75, .60];
    if (m === -2) return [.75, .60, .40];
    if (m === -3) return [.60, .40, .20];
    if (m === -4) return [.40, .20, 0];
    return [0];
  }
  function showHaggleResolution(tx) {
    var h = tx.haggle, m = h.margin, rates = haggleRatesForMargin(m), labels = m >= 0 ? ['Accepter l’offre'] : (m >= -4 ? ['Généreux','Recommandé','Ferme'] : ['Faire un geste','Prix initial']);
    var body = '<b>' + esc(charName(tx.characterId)) + '</b><br>Valeur concernée : ' + esc(fmtPA(h.startingPA)) + '<br>Offre : ' + esc(fmtPA(h.offerPA)) +
      '<br>Affinité : ' + affinity(tx.characterId) + '<br>DD : <b>' + h.ddFinal + '</b><br>Jet : <b>' + h.roll + '</b><br>Écart : <b>' + (m >= 0 ? '+' : '') + m + '</b>';
    body += '<div style="margin-top:6px"><b>Résolution MJ :</b><br>';
    var seen = {};
    rates.forEach(function (rate, i) {
      var p = rate === 1 ? commercialRound(h.offerPA) : buyCounter(h.startingPA, h.offerPA, m, rate);
      if (seen[p]) return; seen[p] = true;
      body += btn((labels[i] || 'Repère') + ' · ' + fmtPA(p), '!co-alaric haggle-resolve --tx ' + tx.id + ' --price ' + p, i === 1 ? '#3f6b45' : '#70543e');
    });
    body += btn('Prix libre…', '!co-alaric haggle-resolve --tx ' + tx.id + ' --price ?{Prix final de la sélection|' + (m >= -4 ? buyCounter(h.startingPA, h.offerPA, m) : commercialRound(h.startingPA)) + '}', '#506070') + '</div>';
    body += '<div style="font-size:9px;color:#765;margin-top:6px"><b>Pistes RP :</b> concession amusée · contre-offre sèche · intérêt pour l’audace. Ce ne sont pas des répliques automatiques.</div>';
    gm(box('Marchandage — ' + tx.id, body));
  }
  function haggleResolve(msg) {
    if (!requireGM(msg)) return;
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || !activeStatus(tx, ['HAGGLE_GM_RESOLVE','HAGGLE_OUT_OF_BAND'])) return;
    var h = tx.haggle, p = round2(num(parseFlag(msg.content, 'price'), NaN));
    if (!isFinite(p) || p < 0) return gm(box('Marchandage', 'Prix final invalide.'));
    h.resolvedSelectedPA = p; tx.status = 'HAGGLE_RESOLVED';
    purchaseOffer(tx, allIndices(tx), [], 'Accepter et payer');
  }

  function startTheft(msg, tx) {
    tx.special = 'theft'; tx.theft = {selection: tx.selection.slice(), access: 1, exposure: 1, bulk: 1, prep: 0}; tx.status = 'THEFT_GM_SETUP';
    playerAction(msg, tx.characterId, 'confirme une tentative de vol', 'Valeur visée : ' + fmtPA(indicesTotal(tx, tx.selection)));
    whisperMsg(msg, box('Tentative de vol', 'La tentative est transmise au MJ.'));
    showTheftSetup(tx);
  }
  function factorButtons(tx, field, values) {
    var labels = {
      access: ['Libre 0','Simple 1','Difficile 2','Très difficile 3'],
      exposure: ['Isolé 0','Peu exposé 1','Visible 2','Surveillé 3'],
      bulk: ['Discret 0','Petit 1','Encombrant 2','Très encombrant 3']
    }[field];
    return values.map(function (v, i) { return btn((tx.theft[field] === v ? '✓ ' : '') + labels[i], '!co-alaric theft-set --tx ' + tx.id + ' --field ' + field + ' --value ' + v, tx.theft[field] === v ? '#3f6b45' : '#70543e'); }).join('');
  }
  function showTheftSetup(tx) {
    var t = tx.theft, value = indicesTotal(tx, t.selection), dd = 10 + 2 * (t.access + t.exposure + t.bulk);
    var body = '<b>' + esc(charName(tx.characterId)) + '</b><br>Valeur tentée : <b>' + esc(fmtPA(value)) + '</b>' + renderLines(tx, t.selection) +
      '<div style="margin-top:5px"><b>Accès</b><br>' + factorButtons(tx, 'access', [0,1,2,3]) + '</div>' +
      '<div><b>Exposition</b><br>' + factorButtons(tx, 'exposure', [0,1,2,3]) + '</div>' +
      '<div><b>Encombrement</b><br>' + factorButtons(tx, 'bulk', [0,1,2,3]) + '</div>' +
      '<div><b>Préparation / circonstances</b><br>' + [-4,-2,0,2,4].map(function (v) { return btn((t.prep === v ? '✓ ' : '') + (v > 0 ? '+' : '') + v, '!co-alaric theft-set --tx ' + tx.id + ' --field prep --value ' + v, t.prep === v ? '#3f6b45' : '#506070'); }).join('') + '</div>' +
      '<div style="margin-top:6px">DD actuel : <b>' + dd + '</b> · Bonus circonstanciel : <b>' + (t.prep >= 0 ? '+' : '') + t.prep + '</b></div>' +
      '<div style="text-align:center;margin-top:6px">' + btn('Lancer le vol (Adresse)', '!co-alaric theft-roll --tx ' + tx.id, '#8a4f3d') + btn('Annuler', '!co-alaric theft-abort --tx ' + tx.id, '#666') + '</div>';
    gm(box('Préparer le vol — ' + tx.id, body));
  }
  function theftSet(msg) {
    if (!requireGM(msg)) return;
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || !activeStatus(tx, ['THEFT_GM_SETUP'])) return;
    var field = String(parseFlag(msg.content, 'field') || ''), value = int(parseFlag(msg.content, 'value'), 0);
    if (['access','exposure','bulk'].indexOf(field) >= 0) tx.theft[field] = clamp(value, 0, 3);
    else if (field === 'prep') tx.theft.prep = [-4,-2,0,2,4].indexOf(value) >= 0 ? value : 0;
    showTheftSetup(tx);
  }
  function theftAbort(msg) {
    if (!requireGM(msg)) return;
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || !activeStatus(tx, ['THEFT_GM_SETUP'])) return;
    tx.status = 'CART'; tx.special = null; tx.theft = null;
    toControllers(tx.characterId, cartPlayerCard(tx));
  }
  function theftRoll(msg) {
    if (!requireGM(msg)) return;
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || !activeStatus(tx, ['THEFT_GM_SETUP'])) return;
    if (!cofReady()) return gm(box('COAlaric', 'COFantasy V2 requis pour le test d’Adresse.'));
    var t = tx.theft, dd = 10 + 2 * (t.access + t.exposure + t.bulk); t.dd = dd; tx.status = 'THEFT_ROLLING';
    COFantasy.coiTestCompetence(tx.characterId, 'Adresse', dd, {bonus: t.prep}, function (r) {
      if (!r || !r.ok) { tx.status = 'THEFT_GM_SETUP'; return gm(box('Vol', esc((r && r.error) || 'Jet impossible.'))); }
      t.roll = r.total; t.margin = r.marge;
      if (r.marge >= 1) return theftSuccess(tx, r.marge >= 5 ? 'réussite nette' : 'réussite');
      if (r.marge >= -4) {
        var rescue = randomInteger(20); t.rescue = rescue;
        if (rescue >= 17) return theftSuccess(tx, 'réussite arrachée (sauvetage ' + rescue + '/20)');
        return theftFailure(tx, true);
      }
      return theftFailure(tx, false);
    });
  }
  function theftSuccess(tx, label) {
    var t = tx.theft, selected = t.selection.slice(), rest = complementIndices(tx, selected); t.success = true; t.resultLabel = label; tx.status = 'THEFT_SUCCESS';
    gm(box('Vol réussi — ' + tx.id,
      '<b>' + esc(charName(tx.characterId)) + '</b><br>DD ' + t.dd + ' · Jet ' + t.roll + ' · marge ' + (t.margin >= 0 ? '+' : '') + t.margin +
      (t.rescue ? '<br>Sauvetage : <b>' + t.rescue + '/20</b>' : '') + '<br><b>' + esc(label) + '</b><br>Ardoise : <b>aucune</b>.' +
      '<div style="font-size:9px;color:#765;margin-top:6px"><b>Pistes RP :</b> laisser la victoire exister · amusement discret · respect du culot. Aucun effet automatique.</div>'));
    if (rest.length && !commerceBlocked(tx.characterId)) purchaseOffer(tx, rest, selected, 'Prendre le vol et acheter le reste');
    else purchaseOffer(tx, [], selected, 'Récupérer les objets');
  }
  function theftFailure(tx, rescueFailed) {
    var t = tx.theft, value = indicesTotal(tx, t.selection), aff = affinity(tx.characterId), prop = theftDebtProposal(value, t.margin, rescueFailed, aff), sugg = affinityFailureSuggestion(t.margin, rescueFailed);
    t.success = false; t.rescueFailed = rescueFailed; t.debtProposal = prop; t.affinitySuggestion = sugg; tx.status = 'THEFT_FAILED_GM';
    var body = '<b>' + esc(charName(tx.characterId)) + '</b><br>Valeur tentée : ' + esc(fmtPA(value)) + '<br>DD ' + t.dd + ' · Jet ' + t.roll + ' · marge ' + (t.margin >= 0 ? '+' : '') + t.margin +
      (t.rescue ? '<br>Sauvetage : <b>' + t.rescue + '/20 — échec</b>' : '') +
      '<hr><b>Proposition d’ardoise</b><br>Base : ' + prop.basePct + '%<br>Affinité ' + aff + ' : ' + (prop.affinityAdjustment >= 0 ? '+' : '') + prop.affinityAdjustment + ' points<br>' +
      'Final : <b>' + prop.pct + '% = ' + esc(fmtPA(prop.amount)) + '</b><br>' +
      btn('Ajouter ' + fmtPA(prop.amount), '!co-alaric theft-debt --tx ' + tx.id + ' --amount ' + prop.amount, '#8a6a2f') +
      btn('Montant libre…', '!co-alaric theft-debt --tx ' + tx.id + ' --amount ?{Montant à ajouter à l’ardoise|' + prop.amount + '}', '#506070') +
      btn('Aucune ardoise', '!co-alaric theft-debt --tx ' + tx.id + ' --amount 0', '#666') +
      '<hr><b>Affinité</b><br>Repère proposé : <b>' + (sugg === 0 ? 'aucun changement' : ((sugg > 0 ? '+' : '') + sugg)) + '</b><br>' +
      btn('+1', '!co-alaric affinity-delta --tx ' + tx.id + ' --delta 1', '#3f6b45') +
      btn('0', '!co-alaric affinity-delta --tx ' + tx.id + ' --delta 0', '#666') +
      btn('-1', '!co-alaric affinity-delta --tx ' + tx.id + ' --delta -1', '#8a4f3d') +
      btn('-2', '!co-alaric affinity-delta --tx ' + tx.id + ' --delta -2', '#8a4f3d') +
      btn('-3', '!co-alaric affinity-delta --tx ' + tx.id + ' --delta -3', '#8b1e1e') +
      '<div style="margin-top:7px">' + btn('Envoyer la résolution au joueur', '!co-alaric theft-finish-failure --tx ' + tx.id, '#70543e') + '</div>' +
      '<div style="font-size:9px;color:#765;margin-top:6px"><b>Pistes RP :</b> noter l’incident sans colère · rappeler que tout a un prix · sourire et présenter l’ardoise. Le MJ décide.</div>';
    gm(box('Vol raté — ' + tx.id, body));
    toControllers(tx.characterId, box('Tentative de vol', 'La tentative échoue. Le MJ résout les conséquences.'));
  }
  function theftDebt(msg) {
    if (!requireGM(msg)) return;
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || !activeStatus(tx, ['THEFT_FAILED_GM'])) return;
    var amount = Math.max(0, round2(num(parseFlag(msg.content, 'amount'), 0)));
    if (tx.theft.debtApplied) return gm(box('Ardoise', 'Une décision d’ardoise a déjà été appliquée pour cette tentative. Utilise le menu Ardoise pour corriger si nécessaire.'));
    tx.theft.debtApplied = true; tx.theft.debtAppliedPA = amount;
    if (amount > 0) addSlate(tx.characterId, amount, 'vol raté ' + tx.id);
    history('vol-consequence', tx.characterId, tx.id + ' · ardoise +' + fmtPA(amount));
    gm(box('Ardoise appliquée', amount > 0 ? ('Ajout : <b>' + esc(fmtPA(amount)) + '</b><br>Nouvelle ardoise : ' + esc(fmtPA(slate(tx.characterId).remaining))) : 'Aucune ardoise ajoutée.'));
  }
  function affinityDelta(msg) {
    if (!requireGM(msg)) return;
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || !activeStatus(tx, ['THEFT_FAILED_GM'])) return;
    if (tx.theft.affinityApplied) return gm(box('Affinité', 'Une décision d’affinité a déjà été appliquée pour cette tentative. Utilise le menu Affinité pour corriger.'));
    var d = clamp(int(parseFlag(msg.content, 'delta'), 0), -3, 1), before = affinity(tx.characterId);
    tx.theft.affinityApplied = true; tx.theft.affinityDelta = d;
    if (d !== 0) setAffinity(tx.characterId, before + d, 'vol raté ' + tx.id);
    gm(box('Affinité', d === 0 ? 'Aucun changement.' : (before + ' → <b>' + affinity(tx.characterId) + '</b>')));
  }
  function theftFinishFailure(msg) {
    if (!requireGM(msg)) return;
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || !activeStatus(tx, ['THEFT_FAILED_GM'])) return;
    var rest = complementIndices(tx, tx.theft.selection); tx.status = 'THEFT_FAILED_RESOLVED';
    if (rest.length && !commerceBlocked(tx.characterId)) {

      purchaseOffer(tx, rest, [], 'Acheter le reste');
    } else {
      txDone(tx, 'DONE');
      toControllers(tx.characterId, box('Transaction terminée', rest.length ? 'Alaric ne propose pas le reste du panier dans l’état actuel de la relation.' : 'Aucun autre objet ne reste dans le panier.'));
    }
  }
  function stolenOnly(msg) {
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || tx.kind !== 'buy' || !activeStatus(tx, ['FINAL_OFFER']) || !tx.finalOffer.stolenIndices.length) return;
    if (!requireController(msg, tx.characterId)) return;
    purchaseOffer(tx, [], tx.finalOffer.stolenIndices, 'Récupérer les objets');
  }

  function slateMenu(msg) {
    if (!requireGM(msg)) return;
    var ch = targetCharacter(parseFlag(msg.content, 'target')); if (!ch || !isPJ(ch.id)) return gm(box('Ardoise', 'Cible PJ invalide.'));
    var s = slate(ch.id), a = affinity(ch.id), body = '<b>' + esc(ch.get('name')) + '</b><br>Affinité : ' + a + '<br>Ardoise initiale : <b>' + esc(fmtPA(s.initial)) + '</b><br>Ardoise restante : <b>' + esc(fmtPA(s.remaining)) + '</b><br>Majoration actuelle : <b>+' + s.rate + '%</b>';
    body += '<div style="margin-top:7px">';
    if (s.remaining > 0) body += btn('Faire régler ' + fmtPA(s.remaining), '!co-alaric debt-request --target ' + ch.id, '#8a6a2f');
    body += btn('Fixer un montant…', '!co-alaric debt-set --target ' + ch.id + ' --amount ?{Nouvelle ardoise en PA|' + Math.round(s.remaining) + '}', '#506070');
    if (s.remaining > 0) body += btn('Effacer', '!co-alaric debt-clear --target ' + ch.id, '#8a4f3d');
    body += '</div>';
    gm(box('Ardoise d’Orbis', body));
  }
  function debtRequest(msg) {
    if (!requireGM(msg)) return;
    var ch = targetCharacter(parseFlag(msg.content, 'target')); if (!ch || !isPJ(ch.id)) return;
    var s = slate(ch.id); if (s.remaining <= 0) return gm(box('Ardoise', 'Aucune ardoise à régler.'));
    toControllers(ch.id, box('Règlement de l’ardoise', 'Montant à régler : <b>' + esc(fmtPA(s.remaining)) + '</b><div style="text-align:center;margin-top:6px">' + btn('Payer', '!co-alaric debt-pay --target ' + ch.id + ' --amount ' + s.remaining, '#8a6a2f') + btn('Refuser', '!co-alaric debt-refuse --target ' + ch.id, '#666') + '</div>'));
    gm(box('Ardoise', 'Demande de règlement envoyée à <b>' + esc(ch.get('name')) + '</b>.'));
  }
  function debtPay(msg) {
    var ch = targetCharacter(parseFlag(msg.content, 'target')); if (!ch || !isPJ(ch.id)) return;
    if (!requireController(msg, ch.id)) return;
    var s = slate(ch.id), amount = round2(num(parseFlag(msg.content, 'amount'), 0));
    if (s.remaining <= 0) return whisperMsg(msg, box('Ardoise', 'L’ardoise est déjà réglée.'));
    if (round2(amount) !== round2(s.remaining)) return whisperMsg(msg, box('Ardoise', 'Le montant a changé. Demandez au MJ une nouvelle proposition de règlement.'));
    playerAction(msg, ch.id, 'accepte de régler son ardoise', 'Montant : ' + fmtPA(amount));
    if (moneyPC(ch.id) < Math.round(amount * 100)) return whisperMsg(msg, box('Ardoise', 'Fonds insuffisants pour régler ' + esc(fmtPA(amount)) + '.'));
    var undo = beginUndo('COAlaric : règlement ardoise', ch.id), failure = null;
    try { if (!debitPA(ch.id, amount)) throw new Error('Fonds insuffisants.'); writeSlate(ch.id, 0, 0, 'paiement direct'); }
    catch (e) { failure = e; }
    if (failure) { rollbackUndo(undo); return gm(box('Ardoise', 'Paiement annulé : ' + esc(failure.message))); }
    commitUndo(undo); history('paiement-ardoise', ch.id, fmtPA(amount));
    whisperMsg(msg, box('Ardoise réglée', '<b>' + esc(fmtPA(amount)) + '</b> ont été payés. L’ardoise est effacée.'));
    gm(box('Ardoise réglée', '<b>' + esc(ch.get('name')) + '</b> a réglé ' + esc(fmtPA(amount)) + '.'));
  }
  function debtRefuse(msg) {
    var ch = targetCharacter(parseFlag(msg.content, 'target')); if (!ch || !requireController(msg, ch.id)) return;
    playerAction(msg, ch.id, 'refuse de régler son ardoise', 'Aucune conséquence automatique.');
    gm(box('Ardoise', '<b>' + esc(ch.get('name')) + '</b> refuse le règlement proposé. Aucune conséquence automatique.'));
  }
  function debtSet(msg, clear) {
    if (!requireGM(msg)) return;
    var ch = targetCharacter(parseFlag(msg.content, 'target')); if (!ch || !isPJ(ch.id)) return;
    var amount = clear ? 0 : Math.max(0, round2(num(parseFlag(msg.content, 'amount'), 0)));
    writeSlate(ch.id, amount, amount, clear ? 'effacement MJ' : 'ajustement MJ');
    slateMenu({playerid: msg.playerid, content: '!co-alaric ardoise --target ' + ch.id});
  }

  function affinityMenu(msg) {
    if (!requireGM(msg)) return;
    var ch = targetCharacter(parseFlag(msg.content, 'target')); if (!ch || !isPJ(ch.id)) return gm(box('Affinité', 'Cible PJ invalide.'));
    var a = affinity(ch.id), body = '<b>' + esc(ch.get('name')) + '</b><br>Affinité actuelle : <b>' + a + '</b> — ' + esc(affinityLabel(a)) + '<div style="margin-top:7px">';
    [-3,-2,-1,0,1,2,3].forEach(function (v) { body += btn((v === a ? '✓ ' : '') + (v > 0 ? '+' : '') + v, '!co-alaric affinity-set --target ' + ch.id + ' --value ' + v, v === a ? '#3f6b45' : '#76559a'); });
    body += '</div>';
    gm(box('Affinité Alaric', body));
  }
  function affinitySet(msg) {
    if (!requireGM(msg)) return;
    var ch = targetCharacter(parseFlag(msg.content, 'target')); if (!ch || !isPJ(ch.id)) return;
    setAffinity(ch.id, int(parseFlag(msg.content, 'value'), 0), 'ajustement MJ'); affinityMenu({playerid: msg.playerid, content: '!co-alaric affinite --target ' + ch.id});
  }

  function saleMenu(msg) {
    if (!requireGM(msg)) return;
    if (!coiReady() || typeof COFantasyItems.coAlaricListInventory !== 'function') return gm(box('Vente', 'CoFItem V2 requis.'));
    var ch = targetCharacter(parseFlag(msg.content, 'target')); if (!ch || !isPJ(ch.id)) return gm(box('Vente', 'Cible PJ invalide.'));
    if (commerceBlocked(ch.id)) return gm(box('Vente suspendue', '<b>' + esc(ch.get('name')) + '</b> doit régler son ardoise (' + esc(fmtPA(slate(ch.id).remaining)) + ') avant de recommencer à commercer. ' + btn('Ardoise', '!co-alaric ardoise --target ' + ch.id, '#8a6a2f')));
    var inv = COFantasyItems.coAlaricListInventory(ch.id); if (!inv || !inv.ok) return gm(box('Vente', esc((inv && inv.error) || 'Inventaire illisible.')));

    var picker = newTx('sale-picker', ch.id);
    picker.status = 'SALE_PICK';
    picker.items = inv.items.slice(0, 40).map(function (it) { return {ref: it.ref, qty: it.qty, name: it.name}; });

    var body = '<b>' + esc(ch.get('name')) + '</b><br><span style="font-size:10px;color:#765">Choisissez l’objet à proposer. Alaric offre toujours 50 % de la valeur catalogue avant marchandage.</span>';
    if (!inv.items.length) body += '<br>Aucune arme, armure ou ligne CoFItem vendable détectée.';
    inv.items.slice(0, 40).forEach(function (it, idx) {
      var cmd = '!co-alaric sale-open --pick ' + picker.id + ' --i ' + idx + ' --qty ' + (it.qty > 1 ? '?{Quantité à vendre|1}' : '1');
      var worn = it.equipped ? ' <span style="font-size:9px;color:#8a4f3d"><b>• équipé</b></span>' : '';
      var legacy = it.legacy ? ' <span style="font-size:9px;color:#765">• fiche historique</span>' : '';
      var priceLine;
      if (it.priceKnown !== false && isFinite(Number(it.pricePA))) {
        priceLine = 'Catalogue : ' + esc(fmtPA(it.pricePA)) + '/u · offre : ' + esc(fmtPA(commercialRound(it.pricePA * .5))) + '/u';
      } else {
        priceLine = '<span style="color:#8a4f3d">Prix catalogue à évaluer par le MJ</span> · offre = 50 %';
      }
      body += '<div style="border-top:1px solid #ddcdb9;padding:4px 0"><b>' + esc(it.name) + '</b>' + (it.qty > 1 ? ' ×' + it.qty : '') + worn + legacy +
        '<br><span style="font-size:10px">' + priceLine + '</span> ' +
        btn(it.priceKnown === false ? 'Proposer' : 'Vendre', cmd, '#3f6b45') + '</div>';
    });
    if (inv.items.length > 40) body += '<div>… ' + (inv.items.length - 40) + ' autre(s) objet(s).</div>';
    toControllers(ch.id, box('Vendre à Alaric', body));
    var a = affinity(ch.id), owners = ownerPlayerIds(ch.id), legacyCount = inv.items.filter(function (x) { return x.legacy; }).length;
    gm(box('Vente ouverte', '<b>' + esc(ch.get('name')) + '</b> choisit maintenant un objet dans son inventaire.' +
      (legacyCount ? '<br><span style="color:#765">' + legacyCount + ' équipement(s) historique(s)/non lié(s) à CoFItem détecté(s), y compris s’ils sont portés.</span>' : '') +
      (!owners.length ? '<br><span style="color:#8a4f3d"><b>Aucun joueur contrôleur :</b> le menu est affiché au MJ pour test, mais le flux normal nécessite un joueur dans « Contrôlé par ».</span>' : '') +
      (a <= -2 ? '<br><span style="color:#8a4f3d">Affinité ' + a + ' : tu peux interrompre/refuser la transaction si Alaric ne souhaite pas commercer.</span>' : '')));
  }
  function sendSaleOffer(tx) {
    var s = tx.sale, base = commercialRound(s.catalogPA * .5);
    s.baseOfferPA = base; s.finalPA = null; tx.status = 'SALE_OFFER';
    var body = '<b>' + esc(s.name) + (s.qty > 1 ? ' ×' + s.qty : '') + '</b><br>Valeur catalogue : ' + esc(fmtPA(s.catalogPA)) + '<br>Offre d’Alaric : <b>' + esc(fmtPA(base)) + '</b><div style="text-align:center;margin-top:6px">' +
      btn('Accepter', '!co-alaric sale-accept-offer --tx ' + tx.id + ' --price ' + base, '#3f6b45') +
      (affinity(tx.characterId) >= 0 ? btn('Marchander', '!co-alaric sale-haggle --tx ' + tx.id, '#76559a') : '') +
      btn('Annuler', '!co-alaric tx-cancel --tx ' + tx.id, '#666') + '</div>';
    toControllers(tx.characterId, box('Offre de rachat', body));
    gm(box('Vente — ' + tx.id, '<b>' + esc(charName(tx.characterId)) + '</b><br>' + esc(s.name) + ' ×' + s.qty + '<br>Catalogue : ' + esc(fmtPA(s.catalogPA)) + '<br>Offre 50 % : ' + esc(fmtPA(base))));
  }
  function saleOpen(msg) {
    if (!coiReady() || typeof COFantasyItems.coAlaricListInventory !== 'function') return whisperMsg(msg, box('Vente', 'Pont CoFItem indisponible. Lance !co-alaric diagnostic.'));

    var pickId = String(parseFlag(msg.content, 'pick') || ''), pick = pickId ? txGet(pickId) : null;
    var ch = null, ref = '', idx = -1;

    if (pickId) {
      if (!pick || pick.kind !== 'sale-picker' || !activeStatus(pick, ['SALE_PICK'])) return whisperMsg(msg, box('Vente', 'Ce menu de vente a expiré. Relance <b>!co-alaric vendre</b>.'));
      ch = getObj('character', pick.characterId);
      idx = int(parseFlag(msg.content, 'i'), -1);
      if (!ch || !isPJ(ch.id)) return whisperMsg(msg, box('Vente', 'Le PJ lié à ce menu est introuvable.'));
      if (idx < 0 || !pick.items || !pick.items[idx]) return whisperMsg(msg, box('Vente', 'Référence de bouton invalide. Relance le menu de vente.'));
      ref = String(pick.items[idx].ref || '');
    } else {

      ch = targetCharacter(parseFlag(msg.content, 'target'));
      ref = String(parseFlag(msg.content, 'ref') || '');
      if (!ch || !isPJ(ch.id)) return whisperMsg(msg, box('Vente', 'Cible PJ invalide dans le bouton. Relance le menu de vente.'));
    }

    if (!requireController(msg, ch.id)) return;
    if (commerceBlocked(ch.id)) return whisperMsg(msg, box('Vente suspendue', 'L’ardoise doit d’abord être réglée.'));

    var qty = Math.max(1, int(parseFlag(msg.content, 'qty'), 1));
    var inv = COFantasyItems.coAlaricListInventory(ch.id), it = null;
    if (!inv || !inv.ok) return whisperMsg(msg, box('Vente', esc((inv && inv.error) || 'Inventaire illisible au moment du clic.')));
    inv.items.forEach(function (x) { if (x.ref === ref) it = x; });
    if (!it) return whisperMsg(msg, box('Vente', 'Objet devenu introuvable dans l’inventaire. Relance le menu de vente.'));
    if (qty > it.qty || ((it.section === 'arme' || it.section === 'armure') && qty !== 1)) return whisperMsg(msg, box('Vente', 'Quantité devenue indisponible.'));
    playerAction(msg, ch.id, 'propose un objet à la vente', it.name + (it.equipped ? ' (équipé)' : '') + (qty > 1 ? ' ×' + qty : ''));

    if (pick) txDone(pick, 'DONE');
    var tx = newTx('sale', ch.id);
    tx.sale = {ref: ref, qty: qty, name: it.name, unitPricePA: null, catalogPA: null, baseOfferPA: null, finalPA: null, legacy: !!it.legacy, equipped: !!it.equipped};

    if (it.priceKnown === false || !isFinite(Number(it.pricePA))) {
      tx.status = 'SALE_PRICE_GM';
      whisperMsg(msg, box('Vente', '<b>' + esc(it.name) + '</b> est proposé à Alaric. Le MJ doit confirmer sa valeur catalogue avant l’offre.'));
      return gm(box('Évaluation de vente — ' + tx.id,
        '<b>' + esc(charName(ch.id)) + '</b><br>Objet : <b>' + esc(it.name) + '</b>' + (it.equipped ? ' <b>(équipé)</b>' : '') +
        '<br><span style="font-size:10px;color:#765">Cette ligne de fiche n’est pas liée à une fiche OBJET CoFItem avec prix exploitable.</span><div style="margin-top:6px">' +
        btn('Fixer la valeur catalogue…', '!co-alaric sale-price --tx ' + tx.id + ' --price ?{Valeur catalogue totale en PA|1}', '#76559a') +
        btn('Annuler', '!co-alaric tx-cancel --tx ' + tx.id, '#666') + '</div>'));
    }

    tx.sale.unitPricePA = Number(it.pricePA);
    tx.sale.catalogPA = round2(Number(it.pricePA) * qty);
    sendSaleOffer(tx);
  }
  function salePrice(msg) {
    if (!requireGM(msg)) return;
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || tx.kind !== 'sale' || !activeStatus(tx, ['SALE_PRICE_GM'])) return;
    var p = round2(num(parseFlag(msg.content, 'price'), NaN));
    if (!isFinite(p) || p <= 0) return gm(box('Évaluation de vente', 'La valeur catalogue doit être supérieure à 0 PA.'));
    tx.sale.catalogPA = p;
    tx.sale.unitPricePA = round2(p / Math.max(1, tx.sale.qty));
    sendSaleOffer(tx);
  }
  function saleHaggle(msg) {
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || tx.kind !== 'sale' || !activeStatus(tx, ['SALE_OFFER'])) return;
    if (!requireController(msg, tx.characterId)) return;
    if (affinity(tx.characterId) < 0) return whisperMsg(msg, box('Marchandage', 'Alaric refuse de marchander avec ce personnage.'));
    tx.status = 'SALE_WAIT_ASK';
    playerAction(msg, tx.characterId, 'demande à marchander la vente', 'Offre de base : ' + fmtPA(tx.sale.baseOfferPA));
    whisperMsg(msg, box('Marchandage de vente', 'Offre actuelle : <b>' + esc(fmtPA(tx.sale.baseOfferPA)) + '</b><br>Valeur catalogue : ' + esc(fmtPA(tx.sale.catalogPA)) + '<div style="text-align:center;margin-top:6px">' + btn('Demander…', '!co-alaric sale-ask --tx ' + tx.id + ' --ask ?{Prix demandé en PA|' + commercialRound(tx.sale.catalogPA * .6) + '}', '#76559a') + '</div>'));
  }
  function saleAsk(msg) {
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || tx.kind !== 'sale' || !activeStatus(tx, ['SALE_WAIT_ASK'])) return;
    if (!requireController(msg, tx.characterId)) return;
    var s = tx.sale, ask = round2(num(parseFlag(msg.content, 'ask'), NaN));
    if (!isFinite(ask) || ask <= s.baseOfferPA) return whisperMsg(msg, box('Marchandage', 'Le prix demandé doit être supérieur à l’offre de base de ' + esc(fmtPA(s.baseOfferPA)) + '.'));
    var pct = ask / s.catalogPA * 100, ddBase = sellHaggleDD(pct), aff = affinity(tx.characterId);
    s.askPA = ask; s.askPct = round2(pct); s.ddBase = ddBase; s.affinity = aff;
    playerAction(msg, tx.characterId, 'fait une contre-demande de vente', 'Demande : ' + fmtPA(ask) + ' (' + round2(pct) + '% du catalogue)');
    whisperMsg(msg, box('Marchandage', 'Demande transmise au MJ.'));
    if (ddBase === null) {
      tx.status = 'SALE_HAGGLE_OUT';
      return gm(box('Vente hors barème — ' + tx.id, '<b>' + esc(charName(tx.characterId)) + '</b><br>Catalogue : ' + esc(fmtPA(s.catalogPA)) + '<br>Alaric : ' + esc(fmtPA(s.baseOfferPA)) + '<br>Demande : <b>' + esc(fmtPA(ask)) + '</b> (' + s.askPct + '% du catalogue)<br>' +
        btn('Autoriser un jet…', '!co-alaric sale-force-roll --tx ' + tx.id + ' --dd ?{DD final|34}', '#76559a') +
        btn('Rester à 50 %', '!co-alaric sale-resolve --tx ' + tx.id + ' --price ' + s.baseOfferPA, '#8a4f3d') +
        btn('Prix libre…', '!co-alaric sale-resolve --tx ' + tx.id + ' --price ?{Offre finale|' + s.baseOfferPA + '}', '#506070')));
    }
    tx.status = 'SALE_HAGGLE_ROLLING'; runSaleRoll(tx, ddBase - aff);
  }
  function saleForceRoll(msg) {
    if (!requireGM(msg)) return;
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || !activeStatus(tx, ['SALE_HAGGLE_OUT'])) return;
    var dd = Math.max(1, int(parseFlag(msg.content, 'dd'), 34)); tx.status = 'SALE_HAGGLE_ROLLING'; runSaleRoll(tx, dd);
  }
  function runSaleRoll(tx, dd) {
    if (!cofReady()) { tx.status = 'SALE_WAIT_ASK'; return gm(box('Vente', 'COFantasy V2 requis pour Persuasion.')); }
    tx.sale.ddFinal = dd;
    COFantasy.coiTestCompetence(tx.characterId, 'Persuasion', dd, {bonus: 0}, function (r) {
      if (!r || !r.ok) { tx.status = 'SALE_WAIT_ASK'; return gm(box('Vente', esc((r && r.error) || 'Jet impossible.'))); }
      tx.sale.roll = r.total; tx.sale.margin = r.marge; tx.status = 'SALE_HAGGLE_GM'; showSaleResolution(tx);
    });
  }
  function showSaleResolution(tx) {
    var s = tx.sale, m = s.margin, rates = haggleRatesForMargin(m), labels = m >= 0 ? ['Accepter la demande'] : (m >= -4 ? ['Généreux','Recommandé','Ferme'] : ['Faire un geste','Rester à 50 %']);
    var body = '<b>' + esc(charName(tx.characterId)) + '</b><br>Catalogue : ' + esc(fmtPA(s.catalogPA)) + '<br>Offre Alaric : ' + esc(fmtPA(s.baseOfferPA)) + '<br>Demande PJ : ' + esc(fmtPA(s.askPA)) +
      '<br>Affinité : ' + affinity(tx.characterId) + '<br>DD : <b>' + s.ddFinal + '</b><br>Jet : <b>' + s.roll + '</b><br>Écart : <b>' + (m >= 0 ? '+' : '') + m + '</b><div style="margin-top:6px">';
    var seen = {};
    rates.forEach(function (rate, i) {
      var p = rate === 1 ? commercialRound(s.askPA) : sellCounter(s.baseOfferPA, s.askPA, m, rate);
      if (seen[p]) return; seen[p] = true;
      body += btn((labels[i] || 'Repère') + ' · ' + fmtPA(p), '!co-alaric sale-resolve --tx ' + tx.id + ' --price ' + p, i === 1 ? '#3f6b45' : '#70543e');
    });
    body += btn('Prix libre…', '!co-alaric sale-resolve --tx ' + tx.id + ' --price ?{Offre finale|' + (m >= -4 ? sellCounter(s.baseOfferPA, s.askPA, m) : s.baseOfferPA) + '}', '#506070') + '</div>';
    body += '<div style="font-size:9px;color:#765;margin-top:6px"><b>Pistes RP :</b> valoriser l’objet · souligner sa marge · céder par goût du jeu.</div>';
    gm(box('Marchandage de vente — ' + tx.id, body));
  }
  function saleResolve(msg) {
    if (!requireGM(msg)) return;
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || tx.kind !== 'sale' || !activeStatus(tx, ['SALE_HAGGLE_GM','SALE_HAGGLE_OUT'])) return;
    var price = Math.max(0, round2(num(parseFlag(msg.content, 'price'), NaN))); if (!isFinite(price)) return;
    tx.sale.finalPA = price; tx.status = 'SALE_FINAL_OFFER'; saleFinalCard(tx);
  }
  function saleAcceptOffer(msg) {
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || tx.kind !== 'sale' || !activeStatus(tx, ['SALE_OFFER'])) return;
    if (!requireController(msg, tx.characterId)) return;
    tx.sale.finalPA = Math.max(0, round2(num(parseFlag(msg.content, 'price'), tx.sale.baseOfferPA))); tx.status = 'SALE_FINAL_OFFER';
    playerAction(msg, tx.characterId, 'accepte l’offre de rachat d’Alaric', 'Montant : ' + fmtPA(tx.sale.finalPA));
    salePlayerAccept(tx, msg);
  }
  function saleFinalCard(tx) {
    toControllers(tx.characterId, box('Offre finale d’Alaric', '<b>' + esc(tx.sale.name) + (tx.sale.qty > 1 ? ' ×' + tx.sale.qty : '') + '</b><br>Alaric propose : <b>' + esc(fmtPA(tx.sale.finalPA)) + '</b><div style="text-align:center;margin-top:6px">' + btn('Accepter la vente', '!co-alaric sale-player-accept --tx ' + tx.id, '#3f6b45') + btn('Refuser', '!co-alaric tx-cancel --tx ' + tx.id, '#666') + '</div>'));
  }
  function salePlayerAccept(tx, msg) {
    if (msg && !requireController(msg, tx.characterId)) return;
    var s = slate(tx.characterId);
    if (s.remaining > 0) {
      tx.status = 'SALE_GM_PAYOUT';
      if (msg) whisperMsg(msg, box('Vente', 'Offre acceptée. Le MJ règle la transaction.'));
      return gm(box('Règlement de vente — ' + tx.id, '<b>' + esc(charName(tx.characterId)) + '</b><br>Produit de vente : <b>' + esc(fmtPA(tx.sale.finalPA)) + '</b><br>Ardoise actuelle : ' + esc(fmtPA(s.remaining)) + '<br>' +
        btn('Verser normalement', '!co-alaric sale-payout --tx ' + tx.id + ' --mode cash', '#3f6b45') +
        btn('Déduire de l’ardoise', '!co-alaric sale-payout --tx ' + tx.id + ' --mode slate', '#8a6a2f')));
    }
    tx.status = 'SALE_COMMIT_READY'; finalizeSale(tx, 'cash');
  }
  function salePlayerAcceptCmd(msg) {
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || tx.kind !== 'sale' || !activeStatus(tx, ['SALE_FINAL_OFFER'])) return;
    salePlayerAccept(tx, msg);
  }
  function salePayout(msg) {
    if (!requireGM(msg)) return;
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || tx.kind !== 'sale' || !activeStatus(tx, ['SALE_GM_PAYOUT'])) return;
    var mode = String(parseFlag(msg.content, 'mode') || 'cash'); if (mode !== 'cash' && mode !== 'slate') mode = 'cash';
    tx.status = 'SALE_COMMIT_READY'; finalizeSale(tx, mode);
  }
  function finalizeSale(tx, mode) {
    if (!coiReady() || !cofReady() || typeof COFantasyItems.coAlaricRemoveInventory !== 'function') { tx.status = 'SALE_FINAL_OFFER'; return gm(box('Vente', 'Pont COFantasy/CoFItem indisponible.')); }

    var inv = COFantasyItems.coAlaricListInventory(tx.characterId), live = null;
    if (inv && inv.ok) inv.items.forEach(function (x) { if (x.ref === tx.sale.ref) live = x; });
    if (!live || live.qty < tx.sale.qty) { tx.status = 'SALE_FINAL_OFFER'; return gm(box('Vente', 'L’objet ou la quantité n’est plus disponible. Transaction non exécutée.')); }
    var undo = beginUndo('COAlaric : vente ' + tx.id, tx.characterId), failure = null, cash = tx.sale.finalPA, debtPaid = 0;
    try {
      var rem = COFantasyItems.coAlaricRemoveInventory(tx.characterId, [{ref: tx.sale.ref, qty: tx.sale.qty}]);
      if (!rem || !rem.ok) throw new Error((rem && rem.error) || 'Retrait d’inventaire impossible.');
      if (mode === 'slate') {
        var sl = slate(tx.characterId); debtPaid = Math.min(sl.remaining, tx.sale.finalPA); cash = round2(tx.sale.finalPA - debtPaid);
        if (debtPaid > 0) reduceSlate(tx.characterId, debtPaid, 'vente ' + tx.id);
      }
      if (cash > 0) creditPA(tx.characterId, cash);
    } catch (e) { failure = e; }
    if (failure) { rollbackUndo(undo); tx.status = 'SALE_FINAL_OFFER'; return gm(box('Vente annulée', '<b>Aucune modification conservée.</b><br>' + esc(failure.message))); }
    commitUndo(undo); txDone(tx, 'DONE');
    history('vente', tx.characterId, tx.id + ' · ' + fmtPA(tx.sale.finalPA) + (debtPaid ? ' dont ' + fmtPA(debtPaid) + ' vers ardoise' : ''));
    toControllers(tx.characterId, box('Vente terminée', '<b>' + esc(tx.sale.name) + (tx.sale.qty > 1 ? ' ×' + tx.sale.qty : '') + '</b><br>Valeur de vente : ' + esc(fmtPA(tx.sale.finalPA)) +
      (debtPaid ? '<br>Ardoise remboursée : ' + esc(fmtPA(debtPaid)) : '') + (cash ? '<br>Versé en monnaie : ' + esc(fmtPA(cash)) : '') +
      '<br><span style="font-size:9px;color:#765">Le MJ peut annuler l’ensemble avec !cof-undo.</span>'));
    gm(box('Vente terminée — ' + tx.id, esc(charName(tx.characterId)) + ' · ' + esc(fmtPA(tx.sale.finalPA))));
  }

  function cancelTx(msg) {
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || ['DONE','CANCELLED','BLOCKED'].indexOf(tx.status) >= 0) return;
    if (!controls(msg.playerid, tx.characterId) && !playerIsGM(msg.playerid)) return;
    txDone(tx, 'CANCELLED');
    playerAction(msg, tx.characterId, 'annule la transaction', tx.id);
    if (!playerIsGM(msg.playerid)) whisperMsg(msg, box('COAlaric', 'Transaction annulée.'));
    gm(box('COAlaric', 'Transaction <b>' + esc(tx.id) + '</b> annulée.'));
  }
  function blockTx(msg) {
    if (!requireGM(msg)) return;
    var tx = txGet(parseFlag(msg.content, 'tx')); if (!tx || ['DONE','CANCELLED','BLOCKED'].indexOf(tx.status) >= 0) return;
    txDone(tx, 'BLOCKED');
    toControllers(tx.characterId, box('Panier d’Alaric', 'Alaric refuse cette transaction.'));
    gm(box('COAlaric', 'Transaction <b>' + esc(tx.id) + '</b> bloquée par le MJ.'));
  }
  function mainMenu(msg) {
    if (!requireGM(msg)) return;
    var target = '@{target|PJ|character_id}';
    gm(box('🜲 COALARIC ' + VERSION,
      btn('♥ Affinité', '!co-alaric affinite --target ' + target, '#76559a') +
      btn('🧾 Ardoise', '!co-alaric ardoise --target ' + target, '#8a6a2f') +
      btn('💰 Vente', '!co-alaric vendre --target ' + target, '#3f6b45') +
      btn('🩺 Diagnostic', '!co-alaric diagnostic', '#506070') +
      '<div style="font-size:9px;color:#765;margin-top:6px">Les achats commencent par la commande exportée depuis le site Alaric.</div>'));
  }
  function diagnostic(msg) {
    if (!requireGM(msg)) return;
    cleanupTransactions(); var s = store(), active = Object.keys(s.transactions).filter(function (id) { return ['DONE','CANCELLED','BLOCKED'].indexOf(s.transactions[id].status) < 0; });
    var body = 'COAlaric : <b>' + VERSION + '</b><br>CoFItem bridge : <b>' + (coiReady() ? esc(COFantasyItems.version || 'OK') : 'ABSENT') + '</b><br>COFantasy bridge : <b>' + (cofReady() ? 'OK' : 'ABSENT') + '</b><br>Transactions actives : <b>' + active.length + '</b><br>Historique : ' + s.history.length + '/' + MAX_HISTORY;
    if (s.history.length) {
      body += '<hr><b>Dernières opérations</b>';
      s.history.slice(0, 8).forEach(function (h) { body += '<div style="font-size:9px;border-top:1px solid #ddd">' + esc(h.name || h.characterId) + ' · ' + esc(h.type) + ' · ' + esc(h.detail) + '</div>'; });
    }
    gm(box('Diagnostic COAlaric', body));
  }

  function chat(msg) {
    if (msg.type !== 'api' || String(msg.content || '').indexOf('!co-alaric') !== 0) return;
    cleanupTransactions();
    var parts = String(msg.content || '').trim().split(/\s+/), cmd = parts[1] || 'menu';
    try {
      if (cmd === 'menu' || cmd === '') return mainMenu(msg);
      if (cmd === 'panier') return importCart(msg);
      if (cmd === 'affinite') return affinityMenu(msg);
      if (cmd === 'affinity-set') return affinitySet(msg);
      if (cmd === 'ardoise') return slateMenu(msg);
      if (cmd === 'debt-request') return debtRequest(msg);
      if (cmd === 'debt-pay') return debtPay(msg);
      if (cmd === 'debt-refuse') return debtRefuse(msg);
      if (cmd === 'debt-set') return debtSet(msg, false);
      if (cmd === 'debt-clear') return debtSet(msg, true);
      if (cmd === 'vendre') return saleMenu(msg);
      if (cmd === 'sale-open') return saleOpen(msg);
      if (cmd === 'sale-price') return salePrice(msg);
      if (cmd === 'sale-haggle') return saleHaggle(msg);
      if (cmd === 'sale-ask') return saleAsk(msg);
      if (cmd === 'sale-force-roll') return saleForceRoll(msg);
      if (cmd === 'sale-resolve') return saleResolve(msg);
      if (cmd === 'sale-accept-offer') return saleAcceptOffer(msg);
      if (cmd === 'sale-player-accept') return salePlayerAcceptCmd(msg);
      if (cmd === 'sale-payout') return salePayout(msg);
      if (cmd === 'select-start') return selectStart(msg);
      if (cmd === 'select-toggle') return selectToggle(msg);
      if (cmd === 'select-all') return selectAll(msg, false);
      if (cmd === 'select-none') return selectAll(msg, true);
      if (cmd === 'select-confirm') return selectConfirm(msg);
      if (cmd === 'select-cancel') return selectCancel(msg);
      if (cmd === 'buy-offer') return buyOffer(msg);
      if (cmd === 'purchase-accept') return purchaseAccept(msg);
      if (cmd === 'haggle-offer') return haggleOffer(msg);
      if (cmd === 'haggle-force-roll') return forceHaggleRoll(msg);
      if (cmd === 'haggle-resolve') return haggleResolve(msg);
      if (cmd === 'theft-set') return theftSet(msg);
      if (cmd === 'theft-roll') return theftRoll(msg);
      if (cmd === 'theft-abort') return theftAbort(msg);
      if (cmd === 'theft-debt') return theftDebt(msg);
      if (cmd === 'affinity-delta') return affinityDelta(msg);
      if (cmd === 'theft-finish-failure') return theftFinishFailure(msg);
      if (cmd === 'theft-stolen-only') return stolenOnly(msg);
      if (cmd === 'tx-cancel') return cancelTx(msg);
      if (cmd === 'tx-block') return blockTx(msg);
      if (cmd === 'diagnostic') return diagnostic(msg);
      if (playerIsGM(msg.playerid)) gm(box('COAlaric', 'Commande inconnue : ' + esc(cmd)));
    } catch (e) {
      log(SCRIPT + ' ' + VERSION + ' : ' + e.stack);
      gm(box('Erreur COAlaric', esc(e.message) + '<br><span style="font-size:9px">Aucune action volontairement poursuivie après cette erreur.</span>'));
    }
  }

  function ready() {
    store(); cleanupTransactions();
    log(SCRIPT + ' ' + VERSION + ' loaded');
    if (!coiReady()) log(SCRIPT + ' : attention, API CoFItem COAlaric absente.');
    if (!cofReady()) log(SCRIPT + ' : attention, API COFantasy COAlaric/undo absente.');
  }

  return {version: VERSION, ready: ready, chat: chat};
}());

on('ready', COAlaric.ready);
on('chat:message', COAlaric.chat);
