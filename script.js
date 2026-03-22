/* ============================================
   O Level Chemistry 6092 – Organic Chemistry
   script.js — Complete File (Part 1 of 3)
   Core, Navigation, Scroll, Quiz Engine
   ============================================ */

// ══════════════════════════════════════
// 1. UTILITIES
// ══════════════════════════════════════
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const off = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 64;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - off, behavior: 'smooth' });
    closeMobileMenu();
}

function throttle(fn, ms) {
    let last = 0;
    return (...a) => { const now = Date.now(); if (now - last >= ms) { last = now; fn(...a); } };
}

function svgEl(tag, attrs = {}) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
}

function makeEl(tag, props = {}) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
        if (k === 'cls') el.className = v;
        else if (k === 'html') el.innerHTML = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'style') el.style.cssText = v;
        else if (k === 'onclick') el.onclick = v;
        else el.setAttribute(k, v);
    }
    return el;
}

// ══════════════════════════════════════
// 2. NAVIGATION
// ══════════════════════════════════════
const topbar = $('#topbar');
const menuToggle = $('#menuToggle');
const navLinksEl = $('#navLinks');
const navLinks = $$('.nav-link');
const progressBar = $('#progressBar');
const scrollTopBtn = $('#scrollTopBtn');
const sections = $$('.section');

function toggleMobileMenu() {
    menuToggle.classList.toggle('open');
    navLinksEl.classList.toggle('open');
    document.body.classList.toggle('menu-open');
}

function closeMobileMenu() {
    menuToggle.classList.remove('open');
    navLinksEl.classList.remove('open');
    document.body.classList.remove('menu-open');
}

menuToggle.addEventListener('click', e => { e.stopPropagation(); toggleMobileMenu(); });

navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        scrollToSection(link.getAttribute('data-section'));
    });
});

document.addEventListener('click', e => {
    if (navLinksEl.classList.contains('open') && !navLinksEl.contains(e.target) && !menuToggle.contains(e.target)) closeMobileMenu();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });

// ══════════════════════════════════════
// 3. SCROLL EFFECTS
// ══════════════════════════════════════
function handleScroll() {
    const sy = window.scrollY;
    topbar.classList.toggle('scrolled', sy > 50);
    scrollTopBtn.classList.toggle('visible', sy > 500);
    const dh = document.documentElement.scrollHeight - window.innerHeight;
    if (dh > 0) progressBar.style.width = (sy / dh * 100) + '%';

    const nh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 64;
    let cur = 'home';
    sections.forEach(s => {
        const top = s.offsetTop - nh - 100;
        if (sy >= top && sy < top + s.offsetHeight) cur = s.id;
    });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('data-section') === cur));
}
window.addEventListener('scroll', throttle(handleScroll, 50), { passive: true });

// ══════════════════════════════════════
// 4. INTERSECTION OBSERVER — Reveal
// ══════════════════════════════════════
function initReveal() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                const parent = en.target.parentElement;
                const siblings = parent ? $$('.content-card, .quiz-container', parent) : [];
                const idx = siblings.indexOf(en.target);
                setTimeout(() => en.target.classList.add('visible'), Math.min(idx * 80, 400));
                obs.unobserve(en.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    $$('.content-card, .quiz-container, .section-header').forEach(el => obs.observe(el));
}

// ══════════════════════════════════════
// 5. QUIZ ENGINE
// ══════════════════════════════════════

/** All quiz questions by section */
const quizData = {
    intro: [
        { q: 'Which is the general formula for alkenes?', opts: ['CₙH₂ₙ₊₂', 'CₙH₂ₙ', 'CₙH₂ₙ₋₂', 'CₙH₂ₙ₊₁OH'], ans: 1 },
        { q: 'What test distinguishes an alkane from an alkene?', opts: ['Add limewater', 'Burning splint', 'Add aqueous bromine', 'Add Universal Indicator'], ans: 2 },
        { q: 'Which statement about a homologous series is correct?', opts: ['Members have different general formulae', 'Members have identical physical properties', 'Successive members differ by CH₂', 'All members are unsaturated'], ans: 2 },
        { q: 'Which fraction from crude oil has the highest boiling point?', opts: ['Refinery gas', 'Petrol', 'Kerosene', 'Bitumen'], ans: 3 }
    ],
    alkanes: [
        { q: 'What is the molecular formula of propane?', opts: ['C₂H₆', 'C₃H₈', 'C₃H₆', 'C₄H₁₀'], ans: 1 },
        { q: 'Substitution of methane with chlorine requires:', opts: ['A catalyst', 'High pressure', 'UV light', 'Water'], ans: 2 },
        { q: 'Why does boiling point increase along the alkane series?', opts: ['Stronger covalent bonds', 'Stronger intermolecular forces (larger molecules)', 'More double bonds', 'Higher reactivity'], ans: 1 },
        { q: 'Incomplete combustion of methane produces:', opts: ['CO₂ and H₂O only', 'CO and/or C, and H₂O', 'CH₃Cl and HCl', 'C₂H₄ and H₂'], ans: 1 }
    ],
    alkenes: [
        { q: 'What happens when bromine water is added to ethene?', opts: ['No change', 'Bromine is decolourised', 'Effervescence occurs', 'A precipitate forms'], ans: 1 },
        { q: 'Ethene + steam → ethanol. This is:', opts: ['Substitution', 'Addition', 'Elimination', 'Cracking'], ans: 1 },
        { q: 'What is the purpose of cracking?', opts: ['Make longer chains', 'Break large molecules into smaller useful ones', 'Test for unsaturation', 'Polymerise alkenes'], ans: 1 },
        { q: 'Margarine is made by adding ___ to vegetable oils:', opts: ['Bromine', 'Chlorine', 'Hydrogen (Ni catalyst)', 'Steam'], ans: 2 }
    ],
    alcohols: [
        { q: 'The functional group in alcohols is:', opts: ['–COOH', '–OH', 'C=C', '–CHO'], ans: 1 },
        { q: 'Fermentation of glucose uses which catalyst?', opts: ['Nickel', 'Phosphoric acid', 'Yeast (enzyme)', 'Iron'], ans: 2 },
        { q: 'Ethanol is oxidised to form:', opts: ['Ethene', 'Ethane', 'Ethanoic acid', 'Methanol'], ans: 2 },
        { q: 'Which is a renewable way to produce ethanol?', opts: ['Cracking crude oil', 'Hydration of ethene', 'Fermentation of glucose', 'Combustion of methane'], ans: 2 }
    ],
    carboxylic: [
        { q: 'Ethanoic acid + Na₂CO₃ produces:', opts: ['Sodium ethanoate + H₂O only', 'Sodium ethanoate + H₂O + CO₂', 'Ethanol + NaOH', 'Ethyl ethanoate + H₂O'], ans: 1 },
        { q: 'The ester from propanoic acid + methanol is:', opts: ['Propyl methanoate', 'Methyl propanoate', 'Ethyl propanoate', 'Propyl propanoate'], ans: 1 },
        { q: 'Carboxylic acids are weak acids because they:', opts: ['Don\'t react with metals', 'Are fully ionised in water', 'Are only partially ionised in water', 'Have a high pH'], ans: 2 },
        { q: 'Ethanoic acid reacts with magnesium to form:', opts: ['Ethanol + MgO', 'Magnesium ethanoate + H₂', 'Ethyl ethanoate + Mg(OH)₂', 'No reaction'], ans: 1 }
    ],
    polymers: [
        { q: 'Addition polymerisation of ethene produces:', opts: ['Nylon', 'Poly(ethene)', 'Terylene', 'Ethanol'], ans: 1 },
        { q: 'What small molecule is released in condensation polymerisation?', opts: ['CO₂', 'H₂O', 'HCl', 'Nothing'], ans: 1 },
        { q: 'Nylon contains which linkage?', opts: ['Ester –COO–', 'Amide –CONH–', 'Ether –O–', 'Glycosidic'], ans: 1 },
        { q: 'Depolymerisation means:', opts: ['Joining monomers', 'Breaking polymers into monomers', 'Burning plastics', 'Melting into pellets'], ans: 1 }
    ]
};

const quizState = {};

/** Build all section quizzes */
function initQuizzes() {
    for (const [id, questions] of Object.entries(quizData)) {
        const container = $(`#quiz-${id}`);
        if (!container) continue;

        quizState[id] = { total: questions.length, answered: 0, correct: 0 };
        container.innerHTML = '';

        questions.forEach((item, qi) => {
            const qEl = makeEl('div', { cls: 'quiz-question' });
            qEl.innerHTML = `
                <p class="q-text">${qi + 1}. ${item.q}</p>
                <div class="q-options">${item.opts.map((o, oi) =>
                    `<button class="q-option" data-idx="${oi}">${o}</button>`
                ).join('')}</div>
                <div class="q-feedback"></div>
            `;
            container.appendChild(qEl);

            $$('.q-option', qEl).forEach(btn => {
                btn.addEventListener('click', () => handleAnswer(btn, qEl, item.ans, id));
            });
        });
    }
}

function handleAnswer(btn, qEl, correctIdx, quizId) {
    if (qEl.classList.contains('q-correct') || qEl.classList.contains('q-wrong')) return;

    const idx = parseInt(btn.getAttribute('data-idx'));
    const isCorrect = idx === correctIdx;
    const allBtns = $$('.q-option', qEl);
    const fb = $('.q-feedback', qEl);

    allBtns.forEach(b => b.classList.add('disabled'));

    if (isCorrect) {
        btn.classList.add('opt-correct');
        qEl.classList.add('q-correct');
        fb.textContent = '✓ Correct!';
        fb.className = 'q-feedback show fb-correct';
        quizState[quizId].correct++;
    } else {
        btn.classList.add('opt-wrong');
        qEl.classList.add('q-wrong');
        allBtns[correctIdx].classList.add('opt-reveal');
        fb.innerHTML = `✗ Correct answer: <strong>${allBtns[correctIdx].textContent}</strong>`;
        fb.className = 'q-feedback show fb-wrong';
    }

    quizState[quizId].answered++;
    if (quizState[quizId].answered === quizState[quizId].total) showScore(quizId);
}

function showScore(quizId) {
    const el = $(`#score-${quizId}`);
    if (!el) return;
    const { total, correct } = quizState[quizId];
    const pct = Math.round(correct / total * 100);
    const cls = pct === 100 ? 'color:var(--accent-green)' : pct >= 70 ? 'color:var(--accent-cyan)' : pct >= 40 ? 'color:var(--accent-orange)' : 'color:var(--accent-red)';
    const msg = pct === 100 ? '🏆 Perfect!' : pct >= 70 ? '👏 Great job!' : pct >= 40 ? '📖 Review the section.' : '💪 Keep going!';
    el.innerHTML = `<span style="${cls}">${correct}/${total} (${pct}%) — ${msg}</span>`;
    el.classList.add('show');
}

// ══════════════════════════════════════
// 6. FINAL MIXED QUIZ
// ══════════════════════════════════════
const finalPool = [
    { q: 'Which homologous series has the general formula CₙH₂ₙ₊₂?', opts: ['Alkenes', 'Alkanes', 'Alcohols', 'Carboxylic acids'], ans: 1, topic: 'Alkanes' },
    { q: 'Ethene + steam (catalyst) forms:', opts: ['Ethane', 'Ethanol', 'Ethanoic acid', 'Poly(ethene)'], ans: 1, topic: 'Alkenes' },
    { q: 'Poly(ethene) from ethene is:', opts: ['Substitution', 'Condensation', 'Addition polymerisation', 'Neutralisation'], ans: 2, topic: 'Polymers' },
    { q: 'Fermentation of glucose produces ethanol and:', opts: ['Water', 'Hydrogen', 'Carbon dioxide', 'Oxygen'], ans: 2, topic: 'Alcohols' },
    { q: '–COOH is found in:', opts: ['Alkanes', 'Alcohols', 'Carboxylic acids', 'Alkenes'], ans: 2, topic: 'Acids' },
    { q: 'Which is a condensation polymer?', opts: ['Poly(ethene)', 'Poly(propene)', 'Nylon', 'PVC'], ans: 2, topic: 'Polymers' },
    { q: 'Bromine water added to hexene:', opts: ['Effervescence', 'Stays brown', 'Decolourises', 'White ppt.'], ans: 2, topic: 'Alkenes' },
    { q: 'Ethanol oxidised by KMnO₄ gives:', opts: ['Ethene', 'Ethane', 'Ethanoic acid', 'Methanol'], ans: 2, topic: 'Alcohols' },
    { q: 'Methane + Cl₂ needs:', opts: ['High pressure', 'Catalyst', 'UV light', 'Water'], ans: 2, topic: 'Alkanes' },
    { q: 'Ester from ethanoic acid + methanol:', opts: ['Ethyl methanoate', 'Methyl ethanoate', 'Ethyl ethanoate', 'Methyl methanoate'], ans: 1, topic: 'Esters' },
    { q: 'Non-biodegradable plastics:', opts: ['Dissolve in water', 'React with O₂', 'Persist in environment', 'Are too expensive'], ans: 2, topic: 'Polymers' },
    { q: 'Cracking is used to:', opts: ['Join molecules', 'Break large molecules into smaller ones', 'Test unsaturation', 'Purify crude oil'], ans: 1, topic: 'Alkenes' },
    { q: 'Which is a weak acid?', opts: ['HCl', 'H₂SO₄', 'CH₃COOH', 'HNO₃'], ans: 2, topic: 'Acids' },
    { q: 'Bioethanol is more sustainable because:', opts: ['Burns hotter', 'Produces no CO₂', 'CO₂ absorbed by crops offsets emissions', 'Cheaper'], ans: 2, topic: 'Intro' },
    { q: 'Isomers have:', opts: ['Same structure, different formula', 'Same formula, different structures', 'Same name', 'Different elements'], ans: 1, topic: 'Intro' },
    { q: 'Boiling point of alkanes as carbon count increases:', opts: ['Decreases', 'Same', 'Increases', 'Random'], ans: 2, topic: 'Alkanes' },
    { q: 'Terylene is a:', opts: ['Polyamide', 'Polyester', 'Addition polymer', 'Natural polymer'], ans: 1, topic: 'Polymers' },
    { q: 'Complete combustion of ethanol gives:', opts: ['CO + H₂O', 'C + H₂O', 'CO₂ + H₂O', 'CH₃COOH'], ans: 2, topic: 'Alcohols' },
    { q: 'Depolymerisation of polyester involves:', opts: ['Burning', 'Melting to pellets', 'Hydrolysis with acid catalyst', 'Dissolving'], ans: 2, topic: 'Polymers' },
    { q: 'Margarine: vegetable oil +', opts: ['Bromine', 'Chlorine', 'Hydrogen (Ni cat.)', 'Steam'], ans: 2, topic: 'Alkenes' },
    { q: 'Smallest b.p. fractions collected at:', opts: ['Bottom', 'Top', 'Middle', 'Outside'], ans: 1, topic: 'Intro' },
    { q: 'Jet fuel fraction:', opts: ['Petrol', 'Kerosene', 'Bitumen', 'Refinery gas'], ans: 1, topic: 'Intro' },
    { q: 'Ester from butanoic acid + ethanol:', opts: ['Butyl ethanoate', 'Ethyl butanoate', 'Ethyl ethanoate', 'Butyl methanoate'], ans: 1, topic: 'Esters' },
    { q: 'Hydrolysis of a polyester produces:', opts: ['Alkenes', 'Dicarboxylic acid + diol', 'CO₂ + H₂O', 'Nylon'], ans: 1, topic: 'Polymers' },
    { q: 'Ethene → X → Ethanoic acid. X is:', opts: ['Ethane', 'Ethanol', 'Methanol', 'Poly(ethene)'], ans: 1, topic: 'Flowchart' },
    { q: 'Crude oil → naphtha → ethene. Step 2 is:', opts: ['Distillation', 'Cracking', 'Polymerisation', 'Combustion'], ans: 1, topic: 'Flowchart' },
    { q: 'Decolourises Br₂ water, formula C₃H₆. It is:', opts: ['Propane', 'Propene', 'Propan-1-ol', 'Propanoic acid'], ans: 1, topic: 'Structure' },
    { q: 'Burns blue, made by fermentation, oxidised to ethanoic acid:', opts: ['Methane', 'Ethanol', 'Ethene', 'Ethanoic acid'], ans: 1, topic: 'Structure' },
    { q: 'KMnO₄ oxidising ethanol — colour change:', opts: ['Colourless→purple', 'Purple→colourless', 'Brown→colourless', 'Colourless→brown'], ans: 1, topic: 'Alcohols' },
    { q: 'Bitumen is used for:', opts: ['Car fuel', 'Road surfaces', 'Cooking gas', 'Making plastics'], ans: 1, topic: 'Intro' }
];

function startFinalQuiz() {
    const area = $('#final-quiz-area');
    const qCont = $('#final-quiz-questions');
    const scoreEl = $('#final-quiz-score');
    const btn = $('#start-final-quiz');
    if (!area || !qCont) return;

    area.style.display = 'block';
    btn.style.display = 'none';
    quizState.final = { total: 10, answered: 0, correct: 0 };

    const picked = [...finalPool].sort(() => Math.random() - 0.5).slice(0, 10);
    qCont.innerHTML = '';

    picked.forEach((item, i) => {
        const qEl = makeEl('div', { cls: 'quiz-question' });
        qEl.innerHTML = `
            <p class="q-text">${i + 1}. ${item.q}
                <span style="font-size:0.72rem;color:var(--accent-purple);background:rgba(183,148,244,0.1);padding:2px 8px;border-radius:8px;margin-left:8px;">${item.topic}</span>
            </p>
            <div class="q-options">${item.opts.map((o, oi) =>
                `<button class="q-option" data-idx="${oi}">${o}</button>`
            ).join('')}</div>
            <div class="q-feedback"></div>
        `;
        qCont.appendChild(qEl);
        $$('.q-option', qEl).forEach(b => b.addEventListener('click', () => handleAnswer(b, qEl, item.ans, 'final')));
    });

    if (scoreEl) { scoreEl.innerHTML = ''; scoreEl.classList.remove('show'); }
    setTimeout(() => area.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

// ══════════════════════════════════════
// 7. HERO BACKGROUND
// ══════════════════════════════════════
function initHeroBg() {
    const c = $('#heroBg');
    if (!c) return;
    const symbols = ['C', 'H', 'O', 'CH₄', 'C₂H₄', 'OH', 'COOH', 'C=C', '–CH₂–', 'CO₂'];
    for (let i = 0; i < 20; i++) {
        const s = makeEl('span', {
            text: symbols[Math.floor(Math.random() * symbols.length)],
            style: `position:absolute;font-family:'JetBrains Mono',monospace;font-size:${10 + Math.random() * 16}px;color:rgba(79,209,197,${0.08 + Math.random() * 0.15});left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation:float ${4 + Math.random() * 6}s ease-in-out infinite;animation-delay:${-Math.random() * 8}s;pointer-events:none;user-select:none;`
        });
        c.appendChild(s);
    }
}

// ══════════════════════════════════════
// 8. METHOD TABS
// ══════════════════════════════════════
function showMethod(method) {
    const h = $('#method-hydration'), f = $('#method-fermentation');
    if (!h || !f) return;
    const tabs = $$('.method-tab');
    tabs.forEach(t => t.classList.remove('active'));
    if (method === 'hydration') { h.style.display = 'block'; f.style.display = 'none'; tabs[0]?.classList.add('active'); }
    else { h.style.display = 'none'; f.style.display = 'block'; tabs[1]?.classList.add('active'); }
}

// ══════════════════════════════════════
// 9. ACID REACTIONS
// ══════════════════════════════════════
const acidRxns = {
    metal: {
        eq: '<span class="reactant">2CH₃COOH</span><span class="plus">+</span><span class="reactant">Mg</span><span class="arrow">→</span><span class="product">(CH₃COO)₂Mg</span><span class="plus">+</span><span class="product">H₂</span>',
        obs: 'Magnesium dissolves, effervescence (H₂ gas). Product: magnesium ethanoate.'
    },
    carbonate: {
        eq: '<span class="reactant">2CH₃COOH</span><span class="plus">+</span><span class="reactant">Na₂CO₃</span><span class="arrow">→</span><span class="product">2CH₃COONa</span><span class="plus">+</span><span class="product">H₂O</span><span class="plus">+</span><span class="product">CO₂</span>',
        obs: 'Effervescence (CO₂). Limewater turns milky. Product: sodium ethanoate.'
    },
    base: {
        eq: '<span class="reactant">CH₃COOH</span><span class="plus">+</span><span class="reactant">NaOH</span><span class="arrow">→</span><span class="product">CH₃COONa</span><span class="plus">+</span><span class="product">H₂O</span>',
        obs: 'Neutralisation — no visible change. Product: sodium ethanoate.'
    }
};

function showAcidReaction(type) {
    const eq = $('#acid-rxn-eq'), obs = $('#acid-rxn-obs');
    if (!eq || !acidRxns[type]) return;
    eq.innerHTML = acidRxns[type].eq;
    obs.textContent = acidRxns[type].obs;
}

// ══════════════════════════════════════
// 10. ESTER BUILDER
// ══════════════════════════════════════
const esterAcids = {
    methanoic: { name: 'methanoic acid', prefix: 'methanoate', r: 'H' },
    ethanoic:  { name: 'ethanoic acid',  prefix: 'ethanoate',  r: 'CH₃' },
    propanoic: { name: 'propanoic acid', prefix: 'propanoate', r: 'C₂H₅' },
    butanoic:  { name: 'butanoic acid',  prefix: 'butanoate',  r: 'C₃H₇' }
};
const esterAlcohols = {
    methanol: { name: 'methanol', prefix: 'methyl', r: 'CH₃' },
    ethanol:  { name: 'ethanol',  prefix: 'ethyl',  r: 'C₂H₅' },
    propanol: { name: 'propan-1-ol', prefix: 'propyl', r: 'C₃H₇' },
    butanol:  { name: 'butan-1-ol',  prefix: 'butyl',  r: 'C₄H₉' }
};

function buildEster() {
    const aKey = $('#ester-acid')?.value, alKey = $('#ester-alcohol')?.value, res = $('#ester-result');
    if (!aKey || !alKey || !res) return;
    const acid = esterAcids[aKey], alc = esterAlcohols[alKey];
    const name = `${alc.prefix} ${acid.prefix}`;
    const formula = `${acid.r}COO${alc.r}`;
    res.innerHTML = `<div class="ester-name">${name.charAt(0).toUpperCase() + name.slice(1)}</div>
        <div class="ester-formula">${formula}</div>
        <div style="margin-top:12px;font-size:0.85rem;color:var(--text-secondary);">${acid.name} + ${alc.name} ⇌ ${formula} + H₂O</div>
        <p style="font-size:0.8rem;color:var(--text-muted);margin-top:8px;">Esters have sweet, fruity smells — used in flavourings & perfumes.</p>`;
}

// ══════════════════════════════════════
// 11. ESTER NAMING DRILL
// ══════════════════════════════════════
const drillAcidList = Object.values(esterAcids);
const drillAlcList = Object.values(esterAlcohols);
let drill = { acid: null, alc: null, answer: '', streak: 0, correct: 0, wrong: 0, done: false };

function generateDrill() {
    drill.acid = drillAcidList[Math.floor(Math.random() * drillAcidList.length)];
    drill.alc = drillAlcList[Math.floor(Math.random() * drillAlcList.length)];
    drill.answer = `${drill.alc.prefix} ${drill.acid.prefix}`;
    drill.done = false;
    const an = $('#drill-acid-name'), aln = $('#drill-alcohol-name'), inp = $('#drill-answer'), fb = $('#drill-feedback');
    if (an) an.textContent = drill.acid.name;
    if (aln) aln.textContent = drill.alc.name;
    if (inp) { inp.value = ''; inp.className = 'drill-input'; inp.focus(); }
    if (fb) { fb.textContent = ''; fb.style.color = ''; }
}

function checkEsterDrill() {
    if (drill.done) return;
    const inp = $('#drill-answer'), fb = $('#drill-feedback');
    if (!inp || !fb) return;
    const user = inp.value.trim().toLowerCase().replace(/\s+/g, ' ');
    const correct = drill.answer.toLowerCase();
    drill.done = true;
    const ok = user === correct || user.replace(/\s/g, '') === correct.replace(/\s/g, '');
    if (ok) {
        inp.classList.add('correct');
        fb.innerHTML = `✓ Correct! <strong>${drill.answer}</strong>`;
        fb.style.color = 'var(--accent-green)';
        drill.streak++; drill.correct++;
    } else {
        inp.classList.add('wrong');
        fb.innerHTML = `✗ Answer: <strong>${drill.answer}</strong>`;
        fb.style.color = 'var(--accent-red)';
        drill.streak = 0; drill.wrong++;
    }
    $('#drill-streak-count').textContent = drill.streak;
    $('#drill-correct').textContent = drill.correct;
    $('#drill-wrong').textContent = drill.wrong;
}

function nextEsterDrill() { generateDrill(); }

// ══════════════════════════════════════
// 12. KEYBOARD SHORTCUTS
// ══════════════════════════════════════
document.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        if (e.key === 'Enter' && e.target.id === 'drill-answer') {
            drill.done ? nextEsterDrill() : checkEsterDrill();
        }
        return;
    }
    const map = { '1': 'home', '2': 'intro', '3': 'alkanes', '4': 'alkenes', '5': 'alcohols', '6': 'carboxylic-acids', '7': 'polymers', '8': 'reaction-map' };
    if (map[e.key]) { e.preventDefault(); scrollToSection(map[e.key]); }
    if (e.key === 't' || e.key === 'T') { e.preventDefault(); scrollToSection('home'); }
});

/* ============================================
   script.js — Part 2 of 3
   Molecules, Charts, Isomers, Bromine Test,
   Alkene Reactions, Polymer, Monomer↔Polymer
   ============================================ */

// ══════════════════════════════════════
// 13. SVG MOLECULE DRAWING
// ══════════════════════════════════════
const ACOL = { C: '#718096', H: '#a0aec0', O: '#fc8181', Cl: '#68d391', Br: '#f6ad55' };
const ARAD = { C: 15, H: 9, O: 13, Cl: 13, Br: 13 };
const AFSZ = { C: 11, H: 8, O: 11, Cl: 8, Br: 8 };

function drawAtom(svg, x, y, el, lbl) {
    svg.appendChild(svgEl('circle', { cx: x, cy: y, r: ARAD[el] || 13, fill: ACOL[el] || '#a0aec0', opacity: '0.9', stroke: ACOL[el] || '#a0aec0', 'stroke-width': '1.5', 'fill-opacity': '0.2' }));
    const t = svgEl('text', { x, y: y + (AFSZ[el] || 10) * 0.35, 'text-anchor': 'middle', 'font-size': AFSZ[el] || 10, 'font-family': "'JetBrains Mono',monospace", 'font-weight': '600', fill: ACOL[el] || '#a0aec0' });
    t.textContent = lbl || el;
    svg.appendChild(t);
}

function drawBond(svg, x1, y1, x2, y2, dbl) {
    svg.appendChild(svgEl('line', { x1, y1, x2, y2, stroke: '#4a5568', 'stroke-width': '2.5', 'stroke-linecap': 'round' }));
    if (dbl) {
        const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy) || 1;
        const ox = (-dy / len) * 5, oy = (dx / len) * 5;
        svg.appendChild(svgEl('line', { x1: x1 + ox, y1: y1 + oy, x2: x2 + ox, y2: y2 + oy, stroke: '#4fd1c5', 'stroke-width': '2', 'stroke-linecap': 'round', opacity: '0.7' }));
    }
}

function drawMol(svgId, def) {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    svg.innerHTML = '';
    if (def.bonds) def.bonds.forEach(b => { const a1 = def.atoms[b[0]], a2 = def.atoms[b[1]]; drawBond(svg, a1.x, a1.y, a2.x, a2.y, b[2]); });
    if (def.atoms) def.atoms.forEach(a => drawAtom(svg, a.x, a.y, a.el, a.el));
}

// ── Molecule definitions ──
const molDefs = {
    methane: {
        atoms: [{ x: 100, y: 100, el: 'C' }, { x: 100, y: 52, el: 'H' }, { x: 148, y: 100, el: 'H' }, { x: 100, y: 148, el: 'H' }, { x: 52, y: 100, el: 'H' }],
        bonds: [[0, 1], [0, 2], [0, 3], [0, 4]]
    },
    ethane: {
        atoms: [{ x: 70, y: 100, el: 'C' }, { x: 130, y: 100, el: 'C' }, { x: 70, y: 52, el: 'H' }, { x: 32, y: 124, el: 'H' }, { x: 70, y: 148, el: 'H' }, { x: 130, y: 52, el: 'H' }, { x: 168, y: 124, el: 'H' }, { x: 130, y: 148, el: 'H' }],
        bonds: [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [1, 6], [1, 7]]
    },
    propane: {
        atoms: [{ x: 50, y: 110, el: 'C' }, { x: 120, y: 110, el: 'C' }, { x: 190, y: 110, el: 'C' }, { x: 50, y: 62, el: 'H' }, { x: 16, y: 138, el: 'H' }, { x: 50, y: 158, el: 'H' }, { x: 120, y: 62, el: 'H' }, { x: 120, y: 158, el: 'H' }, { x: 190, y: 62, el: 'H' }, { x: 224, y: 138, el: 'H' }, { x: 190, y: 158, el: 'H' }],
        bonds: [[0, 1], [1, 2], [0, 3], [0, 4], [0, 5], [1, 6], [1, 7], [2, 8], [2, 9], [2, 10]]
    },
    butane: {
        atoms: [{ x: 40, y: 110, el: 'C' }, { x: 107, y: 110, el: 'C' }, { x: 174, y: 110, el: 'C' }, { x: 241, y: 110, el: 'C' }, { x: 40, y: 62, el: 'H' }, { x: 10, y: 138, el: 'H' }, { x: 40, y: 158, el: 'H' }, { x: 107, y: 62, el: 'H' }, { x: 107, y: 158, el: 'H' }, { x: 174, y: 62, el: 'H' }, { x: 174, y: 158, el: 'H' }, { x: 241, y: 62, el: 'H' }, { x: 270, y: 138, el: 'H' }, { x: 241, y: 158, el: 'H' }],
        bonds: [[0, 1], [1, 2], [2, 3], [0, 4], [0, 5], [0, 6], [1, 7], [1, 8], [2, 9], [2, 10], [3, 11], [3, 12], [3, 13]]
    },
    ethene: {
        atoms: [{ x: 70, y: 100, el: 'C' }, { x: 130, y: 100, el: 'C' }, { x: 36, y: 62, el: 'H' }, { x: 36, y: 138, el: 'H' }, { x: 164, y: 62, el: 'H' }, { x: 164, y: 138, el: 'H' }],
        bonds: [[0, 1, true], [0, 2], [0, 3], [1, 4], [1, 5]]
    },
    propene: {
        atoms: [{ x: 45, y: 105, el: 'C' }, { x: 115, y: 105, el: 'C' }, { x: 190, y: 105, el: 'C' }, { x: 16, y: 67, el: 'H' }, { x: 16, y: 143, el: 'H' }, { x: 115, y: 57, el: 'H' }, { x: 190, y: 57, el: 'H' }, { x: 224, y: 130, el: 'H' }, { x: 190, y: 153, el: 'H' }],
        bonds: [[0, 1, true], [1, 2], [0, 3], [0, 4], [1, 5], [2, 6], [2, 7], [2, 8]]
    },
    but1ene: {
        atoms: [{ x: 38, y: 105, el: 'C' }, { x: 105, y: 105, el: 'C' }, { x: 175, y: 105, el: 'C' }, { x: 245, y: 105, el: 'C' }, { x: 10, y: 67, el: 'H' }, { x: 10, y: 143, el: 'H' }, { x: 105, y: 57, el: 'H' }, { x: 175, y: 57, el: 'H' }, { x: 175, y: 153, el: 'H' }, { x: 245, y: 57, el: 'H' }, { x: 273, y: 133, el: 'H' }, { x: 245, y: 153, el: 'H' }],
        bonds: [[0, 1, true], [1, 2], [2, 3], [0, 4], [0, 5], [1, 6], [2, 7], [2, 8], [3, 9], [3, 10], [3, 11]]
    },
    methanol: {
        atoms: [{ x: 60, y: 100, el: 'C' }, { x: 132, y: 100, el: 'O' }, { x: 60, y: 52, el: 'H' }, { x: 26, y: 130, el: 'H' }, { x: 60, y: 148, el: 'H' }, { x: 164, y: 76, el: 'H' }],
        bonds: [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5]]
    },
    ethanol: {
        atoms: [{ x: 50, y: 105, el: 'C' }, { x: 118, y: 105, el: 'C' }, { x: 186, y: 105, el: 'O' }, { x: 50, y: 57, el: 'H' }, { x: 18, y: 133, el: 'H' }, { x: 50, y: 153, el: 'H' }, { x: 118, y: 57, el: 'H' }, { x: 118, y: 153, el: 'H' }, { x: 214, y: 80, el: 'H' }],
        bonds: [[0, 1], [1, 2], [0, 3], [0, 4], [0, 5], [1, 6], [1, 7], [2, 8]]
    },
    propanol: {
        atoms: [{ x: 40, y: 105, el: 'C' }, { x: 108, y: 105, el: 'C' }, { x: 176, y: 105, el: 'C' }, { x: 240, y: 105, el: 'O' }, { x: 40, y: 57, el: 'H' }, { x: 10, y: 133, el: 'H' }, { x: 40, y: 153, el: 'H' }, { x: 108, y: 57, el: 'H' }, { x: 108, y: 153, el: 'H' }, { x: 176, y: 57, el: 'H' }, { x: 176, y: 153, el: 'H' }, { x: 262, y: 80, el: 'H' }],
        bonds: [[0, 1], [1, 2], [2, 3], [0, 4], [0, 5], [0, 6], [1, 7], [1, 8], [2, 9], [2, 10], [3, 11]]
    },
    butanol: {
        atoms: [{ x: 30, y: 105, el: 'C' }, { x: 95, y: 105, el: 'C' }, { x: 160, y: 105, el: 'C' }, { x: 225, y: 105, el: 'C' }, { x: 288, y: 105, el: 'O' }, { x: 30, y: 57, el: 'H' }, { x: 4, y: 133, el: 'H' }, { x: 30, y: 153, el: 'H' }, { x: 95, y: 57, el: 'H' }, { x: 95, y: 153, el: 'H' }, { x: 160, y: 57, el: 'H' }, { x: 160, y: 153, el: 'H' }, { x: 225, y: 57, el: 'H' }, { x: 225, y: 153, el: 'H' }, { x: 310, y: 80, el: 'H' }],
        bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [0, 6], [0, 7], [1, 8], [1, 9], [2, 10], [2, 11], [3, 12], [3, 13], [4, 14]]
    }
};

/** Build molecule gallery cards */
function buildGallery(containerId, mols) {
    const c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = '';
    mols.forEach(m => {
        const svgId = 'mol-' + m.key;
        const card = makeEl('div', { cls: 'molecule-card' });
        card.innerHTML = `
            <div class="mol-visual"><svg viewBox="0 0 ${m.vw || 200} ${m.vh || 200}" class="mol-svg" id="${svgId}"></svg></div>
            <h4>${m.name}</h4>
            <p class="mol-formula">${m.formula}</p>
            <p class="mol-bp">b.p. ${m.bp}</p>
        `;
        c.appendChild(card);
        if (molDefs[m.key]) drawMol(svgId, molDefs[m.key]);
    });
}

function initMolecules() {
    buildGallery('alkane-gallery', [
        { key: 'methane', name: 'Methane', formula: 'CH₄', bp: '−162 °C' },
        { key: 'ethane', name: 'Ethane', formula: 'C₂H₆', bp: '−89 °C' },
        { key: 'propane', name: 'Propane', formula: 'C₃H₈', bp: '−42 °C', vw: 240 },
        { key: 'butane', name: 'Butane', formula: 'C₄H₁₀', bp: '−1 °C', vw: 280 }
    ]);
    buildGallery('alkene-gallery', [
        { key: 'ethene', name: 'Ethene', formula: 'C₂H₄', bp: '−104 °C' },
        { key: 'propene', name: 'Propene', formula: 'C₃H₆', bp: '−47 °C', vw: 240 },
        { key: 'but1ene', name: 'But-1-ene', formula: 'C₄H₈', bp: '−6 °C', vw: 280 }
    ]);
    buildGallery('alcohol-gallery', [
        { key: 'methanol', name: 'Methanol', formula: 'CH₃OH', bp: '65 °C' },
        { key: 'ethanol', name: 'Ethanol', formula: 'C₂H₅OH', bp: '78 °C', vw: 230 },
        { key: 'propanol', name: 'Propan-1-ol', formula: 'C₃H₇OH', bp: '97 °C', vw: 270 },
        { key: 'butanol', name: 'Butan-1-ol', formula: 'C₄H₉OH', bp: '117 °C', vw: 320 }
    ]);
}

// ══════════════════════════════════════
// 14. BOILING POINT BAR CHART
// ══════════════════════════════════════
const bpData = [
    { name: 'Methane', f: 'CH₄', bp: -162 },
    { name: 'Ethane', f: 'C₂H₆', bp: -89 },
    { name: 'Propane', f: 'C₃H₈', bp: -42 },
    { name: 'Butane', f: 'C₄H₁₀', bp: -1 },
    { name: 'Pentane', f: 'C₅H₁₂', bp: 36 },
    { name: 'Octane', f: 'C₈H₁₈', bp: 126 }
];

function initBPChart() {
    const container = $('#alkane-bp-chart');
    if (!container) return;
    container.innerHTML = '';
    const minBP = Math.min(...bpData.map(d => d.bp));
    const maxBP = Math.max(...bpData.map(d => d.bp));
    const range = maxBP - minBP || 1;

    const area = makeEl('div', { cls: 'chart-area' });

    bpData.forEach((d, i) => {
        const norm = (d.bp - minBP) / range;
        const h = Math.max(12, norm * 200 + 20);
        const hue = 180 - norm * 180;

        const wrap = makeEl('div', { cls: 'chart-bar-wrapper' });
        const val = makeEl('div', { html: `${d.bp}°`, style: 'font-size:0.7rem;font-weight:600;color:var(--text-primary);text-align:center;font-family:"JetBrains Mono",monospace;min-height:18px;' });
        const bar = makeEl('div', { cls: 'chart-bar', style: `height:0px;background:hsl(${hue},70%,50%);transition:height 0.6s ease ${i * 0.1}s;` });
        bar.innerHTML = `<div class="bar-tooltip">${d.bp} °C</div>`;
        const label = makeEl('div', { cls: 'chart-bar-label', html: `${d.name}<br><span style="color:var(--accent-cyan);font-size:0.65rem;">${d.f}</span>` });

        wrap.appendChild(val);
        wrap.appendChild(bar);
        wrap.appendChild(label);
        area.appendChild(wrap);

        setTimeout(() => { bar.style.height = h + 'px'; }, 300 + i * 100);
    });

    container.appendChild(area);
    container.appendChild(makeEl('p', { html: '<strong style="color:var(--accent-cyan)">Trend:</strong> B.p. increases with carbon number — larger molecules have stronger intermolecular forces.', style: 'font-size:0.85rem;color:var(--text-secondary);margin-top:16px;text-align:center;' }));
}

// ══════════════════════════════════════
// 15. ISOMER DISPLAY
// ══════════════════════════════════════
const isomerDefs = {
    butane: {
        atoms: [{ x: 60, y: 100, el: 'C' }, { x: 140, y: 100, el: 'C' }, { x: 220, y: 100, el: 'C' }, { x: 300, y: 100, el: 'C' },
            { x: 60, y: 55, el: 'H' }, { x: 28, y: 130, el: 'H' }, { x: 60, y: 145, el: 'H' },
            { x: 140, y: 55, el: 'H' }, { x: 140, y: 145, el: 'H' },
            { x: 220, y: 55, el: 'H' }, { x: 220, y: 145, el: 'H' },
            { x: 300, y: 55, el: 'H' }, { x: 332, y: 130, el: 'H' }, { x: 300, y: 145, el: 'H' }],
        bonds: [[0, 1], [1, 2], [2, 3], [0, 4], [0, 5], [0, 6], [1, 7], [1, 8], [2, 9], [2, 10], [3, 11], [3, 12], [3, 13]],
        caption: 'Butane: CH₃CH₂CH₂CH₃ — straight-chain'
    },
    methylpropane: {
        atoms: [{ x: 120, y: 100, el: 'C' }, { x: 200, y: 100, el: 'C' }, { x: 280, y: 100, el: 'C' }, { x: 200, y: 35, el: 'C' },
            { x: 120, y: 55, el: 'H' }, { x: 88, y: 130, el: 'H' }, { x: 120, y: 145, el: 'H' },
            { x: 200, y: 145, el: 'H' },
            { x: 280, y: 55, el: 'H' }, { x: 312, y: 130, el: 'H' }, { x: 280, y: 145, el: 'H' },
            { x: 165, y: 14, el: 'H' }, { x: 235, y: 14, el: 'H' }, { x: 200, y: -8, el: 'H' }],
        bonds: [[0, 1], [1, 2], [1, 3], [0, 4], [0, 5], [0, 6], [1, 7], [2, 8], [2, 9], [2, 10], [3, 11], [3, 12], [3, 13]],
        caption: 'Methylpropane: CH₃CH(CH₃)CH₃ — branched isomer'
    }
};

function showIsomer(key) {
    const svg = document.getElementById('isomer-svg');
    const cap = document.getElementById('isomer-caption');
    const def = isomerDefs[key];
    if (!svg || !def) return;

    $$('.isomer-btn').forEach(b => b.classList.toggle('active', b.textContent.toLowerCase().includes(key === 'butane' ? 'butane (straight' : 'methyl')));

    svg.setAttribute('viewBox', key === 'methylpropane' ? '0 0 400 200' : '0 0 380 200');
    drawMol('isomer-svg', def);
    if (cap) cap.textContent = def.caption;
}

// ══════════════════════════════════════
// 16. BROMINE TEST
// ══════════════════════════════════════
let bromineTestDone = false;

function runBromineTest() {
    if (bromineTestDone) { resetBromineTest(); return; }

    const ra = $('#reagent-alkane'), re = $('#reagent-alkene'), res = $('#bromine-result'), btn = $('#btn-bromine');

    // Phase 1: both turn brown
    [ra, re].forEach(el => { if (el) { el.style.height = '35%'; el.style.background = 'rgba(180,100,20,0.7)'; } });
    if (btn) { btn.textContent = '⏳ Reacting...'; btn.disabled = true; }

    // Phase 2: alkene decolourises
    setTimeout(() => {
        if (re) re.style.background = 'rgba(200,200,220,0.15)';
        if (res) res.innerHTML = '<span style="color:var(--accent-orange);">Alkane: stays <strong>brown</strong> (saturated, no reaction)</span><br><span style="color:var(--accent-cyan);">Alkene: <strong>decolourised</strong> (unsaturated, addition reaction)</span>';
        if (btn) { btn.textContent = '🔄 Reset Test'; btn.disabled = false; }
        bromineTestDone = true;
    }, 1500);
}

function resetBromineTest() {
    ['reagent-alkane', 'reagent-alkene'].forEach(id => { const el = document.getElementById(id); if (el) { el.style.height = '0'; el.style.background = ''; } });
    const res = $('#bromine-result'), btn = $('#btn-bromine');
    if (res) res.innerHTML = '';
    if (btn) { btn.textContent = 'Add Aqueous Bromine 🧪'; btn.disabled = false; }
    bromineTestDone = false;
}

// ══════════════════════════════════════
// 17. ALKENE ADDITION REACTIONS
// ══════════════════════════════════════
const alkeneRxns = {
    bromine: {
        eq: '<span class="reactant">CH₂=CH₂</span><span class="plus">+</span><span class="reactant">Br₂</span><span class="arrow">→</span><span class="product">CH₂BrCH₂Br</span>',
        desc: 'Ethene + bromine → 1,2-dibromoethane. Brown bromine is decolourised. Test for C=C.',
        cond: 'Room temperature, aqueous bromine'
    },
    steam: {
        eq: '<span class="reactant">CH₂=CH₂</span><span class="plus">+</span><span class="reactant">H₂O</span><span class="arrow">→<br><small class="condition">H₃PO₄, high T&P</small></span><span class="product">CH₃CH₂OH</span>',
        desc: 'Ethene + steam → ethanol. Industrial method for ethanol production.',
        cond: 'Phosphoric acid catalyst, ~300°C, ~60 atm'
    },
    hydrogen: {
        eq: '<span class="reactant">CH₂=CH₂</span><span class="plus">+</span><span class="reactant">H₂</span><span class="arrow">→<br><small class="condition">Ni catalyst</small></span><span class="product">CH₃CH₃</span>',
        desc: 'Ethene + hydrogen → ethane. Used to make margarine (hydrogenation of C=C in unsaturated fats).',
        cond: 'Nickel catalyst, ~150°C'
    },
    polymerisation: {
        eq: '<span class="reactant">n CH₂=CH₂</span><span class="arrow">→<br><small class="condition">high T&P</small></span><span class="product">–(CH₂–CH₂)ₙ–</span>',
        desc: 'Many ethene monomers join — C=C opens → long chain poly(ethene). No other product.',
        cond: 'High temperature & pressure, catalyst'
    }
};

function showAlkeneRxn(type) {
    const eq = $('#alkene-rxn-eq'), desc = $('#alkene-rxn-desc'), cond = $('#alkene-rxn-cond');
    const rxn = alkeneRxns[type];
    if (!eq || !rxn) return;
    eq.innerHTML = rxn.eq;
    if (desc) desc.textContent = rxn.desc;
    if (cond) cond.textContent = rxn.cond;
}

// ══════════════════════════════════════
// 18. POLYMER ANIMATION
// ══════════════════════════════════════
let polyAnimRunning = false;

function animatePolymerisation() {
    const container = $('#poly-visual'), btn = $('#btn-poly-anim');
    if (!container || polyAnimRunning) return;
    polyAnimRunning = true;
    container.innerHTML = '';
    if (btn) btn.textContent = '⏳ Animating...';

    const count = 6;
    const els = [];

    // Phase 1: show monomers
    for (let i = 0; i < count; i++) {
        const u = makeEl('div', { cls: 'poly-unit', html: 'C=C' });
        els.push(u);
        container.appendChild(u);
        if (i < count - 1) {
            const p = makeEl('span', { cls: 'poly-link', text: '+' });
            els.push(p);
            container.appendChild(p);
        }
    }

    let delay = 200;
    els.forEach((el, i) => setTimeout(() => el.classList.add('appear'), delay + i * 150));

    // Phase 2: transform to polymer
    const transformAt = delay + els.length * 150 + 600;
    setTimeout(() => {
        container.innerHTML = '';
        const parts = [];

        const ob = makeEl('span', { cls: 'poly-bracket', text: '–[' }); parts.push(ob); container.appendChild(ob);

        for (let i = 0; i < count; i++) {
            const u = makeEl('div', { cls: 'poly-unit joined', html: 'C–C' }); parts.push(u); container.appendChild(u);
            if (i < count - 1) { const l = makeEl('span', { cls: 'poly-link', text: '–' }); parts.push(l); container.appendChild(l); }
        }

        const cb = makeEl('span', { cls: 'poly-bracket', text: ']–' }); parts.push(cb); container.appendChild(cb);
        const sub = makeEl('span', { cls: 'poly-subscript', text: 'n' }); parts.push(sub); container.appendChild(sub);

        parts.forEach((el, i) => setTimeout(() => el.classList.add('appear'), 100 + i * 100));

        setTimeout(() => {
            container.appendChild(makeEl('div', { cls: 'poly-done-label', html: '✓ <strong>Poly(ethene)</strong> — addition polymer' }));
            if (btn) btn.textContent = '▶ Replay Animation';
            polyAnimRunning = false;
        }, 100 + parts.length * 100 + 300);
    }, transformAt);
}

// ══════════════════════════════════════
// 19. MONOMER ↔ POLYMER
// ══════════════════════════════════════
const mpData = {
    ethene: {
        mon: { name: 'Ethene', struct: 'CH₂=CH₂', detail: 'Simplest alkene' },
        pol: { name: 'Poly(ethene)', struct: '–(CH₂–CH₂)ₙ–', detail: 'Plastic bags, cling film' }
    },
    propene: {
        mon: { name: 'Propene', struct: 'CH₂=CHCH₃', detail: 'Three-carbon alkene' },
        pol: { name: 'Poly(propene)', struct: '–(CH₂–CH(CH₃))ₙ–', detail: 'Food containers, ropes' }
    },
    chloroethene: {
        mon: { name: 'Chloroethene', struct: 'CH₂=CHCl', detail: 'Vinyl chloride' },
        pol: { name: 'Poly(chloroethene)', struct: '–(CH₂–CHCl)ₙ–', detail: 'PVC — pipes, window frames' }
    },
    tetrafluoroethene: {
        mon: { name: 'Tetrafluoroethene', struct: 'CF₂=CF₂', detail: 'Fully fluorinated' },
        pol: { name: 'PTFE', struct: '–(CF₂–CF₂)ₙ–', detail: 'Teflon — non-stick coatings' }
    }
};

function showMonoPoly(key) {
    const d = mpData[key], m = $('#mp-monomer'), p = $('#mp-polymer');
    if (!d || !m || !p) return;
    m.innerHTML = `<div class="mp-label">Monomer</div><div class="mp-name" style="color:var(--accent-orange)">${d.mon.name}</div><div class="mp-structure">${d.mon.struct}</div><div class="mp-detail">${d.mon.detail}</div>`;
    p.innerHTML = `<div class="mp-label">Polymer</div><div class="mp-name" style="color:var(--accent-cyan)">${d.pol.name}</div><div class="mp-structure">${d.pol.struct}</div><div class="mp-detail">${d.pol.detail}</div>`;
}

// ══════════════════════════════════════
// 20. WIRE UP SELECTOR BUTTONS
// ══════════════════════════════════════
function initSelectors() {
    // Alkene reactions
    $$('#alkene-rxn-selector .rxn-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('#alkene-rxn-selector .rxn-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showAlkeneRxn(btn.getAttribute('data-rxn'));
        });
    });

    // Acid reactions
    $$('#acid-rxn-selector .rxn-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('#acid-rxn-selector .rxn-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showAcidReaction(btn.getAttribute('data-rxn'));
        });
    });

    // Monomer ↔ Polymer
    $$('#mono-poly-selector .rxn-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('#mono-poly-selector .rxn-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showMonoPoly(btn.getAttribute('data-mp'));
        });
    });
}

/* ============================================
   script.js — Part 3 of 3
   Distillation, Conversion Chain, Series,
   Flowchart, Guess the Substance, Master Init
   ============================================ */

// ══════════════════════════════════════
// 21. FRACTIONAL DISTILLATION TOWER
// ══════════════════════════════════════
const fractions = [
    { name: 'Refinery Gas', bp: '< 25 °C', carbons: 'C₁–C₄', state: 'Gas', uses: 'Heating & cooking (LPG), feedstock', viscosity: '—', flam: 'Very high', pct: [0, 12] },
    { name: 'Petrol', bp: '25–75 °C', carbons: 'C₅–C₁₀', state: 'Liquid', uses: 'Car fuel', viscosity: 'Low', flam: 'High', pct: [12, 14] },
    { name: 'Naphtha', bp: '75–190 °C', carbons: 'C₅–C₁₀', state: 'Liquid', uses: 'Feedstock, cracking → alkenes', viscosity: 'Low', flam: 'High', pct: [26, 14] },
    { name: 'Kerosene', bp: '190–250 °C', carbons: 'C₁₀–C₁₆', state: 'Liquid', uses: 'Jet fuel, heating', viscosity: 'Medium', flam: 'Medium', pct: [40, 15] },
    { name: 'Diesel', bp: '250–350 °C', carbons: 'C₁₅–C₂₀', state: 'Liquid', uses: 'Lorries, buses, trains', viscosity: 'Med–High', flam: 'Medium', pct: [55, 15] },
    { name: 'Fuel Oil', bp: '350–500 °C', carbons: 'C₂₀–C₅₀', state: 'Thick liquid', uses: 'Ships, power stations, lubricant', viscosity: 'High', flam: 'Low', pct: [70, 14] },
    { name: 'Bitumen', bp: '> 500 °C', carbons: 'C₅₀+', state: 'Semi-solid', uses: 'Road surfaces, roofing', viscosity: 'Very high', flam: 'Very low', pct: [84, 16] }
];

function initDistillation() {
    const tower = $('#distill-tower');
    if (!tower) return;
    tower.innerHTML = '';

    fractions.forEach((fr, i) => {
        const band = makeEl('div', { cls: 'tower-fraction', style: `top:${fr.pct[0]}%;height:${fr.pct[1]}%;` });
        band.appendChild(makeEl('div', { cls: 'tower-fraction-label', text: fr.name }));
        band.addEventListener('click', () => {
            $$('.tower-fraction', tower).forEach(b => b.classList.remove('active'));
            band.classList.add('active');
            showFraction(i);
        });
        tower.appendChild(band);
    });
}

function showFraction(i) {
    const fr = fractions[i];
    if (!fr) return;
    const t = $('#fraction-title'), d = $('#fraction-desc'), p = $('#fraction-props');
    if (t) t.textContent = fr.name;
    if (d) d.innerHTML = `Collected near the <strong>${i <= 2 ? 'top' : i >= 5 ? 'bottom' : 'middle'}</strong> of the column.`;
    if (p) {
        p.style.display = 'grid';
        $('#fp-bp').textContent = fr.bp;
        $('#fp-carbons').textContent = fr.carbons;
        $('#fp-state').textContent = fr.state;
        $('#fp-uses').textContent = fr.uses;
        $('#fp-viscosity').textContent = fr.viscosity;
        $('#fp-flammability').textContent = fr.flam;
    }
}

// ══════════════════════════════════════
// 22. CONVERSION CHAIN
// ══════════════════════════════════════
const chainNodes = [
    { name: 'Crude Oil', formula: 'mixture', color: 'var(--text-muted)' },
    { name: 'Alkane', formula: 'CₙH₂ₙ₊₂', color: 'var(--accent-orange)' },
    { name: 'Alkene', formula: 'CₙH₂ₙ', color: 'var(--accent-red)' },
    { name: 'Alcohol', formula: 'CₙH₂ₙ₊₁OH', color: 'var(--accent-purple)' },
    { name: 'Carboxylic Acid', formula: 'RCOOH', color: 'var(--accent-pink)' },
    { name: 'Ester', formula: 'RCOOR\'', color: 'var(--accent-cyan)' }
];

const chainArrows = [
    { label: 'Fractional distillation', detail: { title: 'Fractional Distillation', desc: 'Crude oil heated → vapours rise → condense at different heights.', eq: '<span class="reactant">Crude oil</span><span class="arrow">→</span><span class="product">Fractions</span>' } },
    { label: 'Cracking', detail: { title: 'Cracking', desc: 'Large alkanes broken into smaller alkenes + alkanes. High temperature.', eq: '<span class="reactant">C₁₀H₂₂</span><span class="arrow">→</span><span class="product">C₂H₄</span><span class="plus">+</span><span class="product">C₈H₁₈</span>' } },
    { label: '+ Steam (cat.)', detail: { title: 'Hydration', desc: 'Ethene + steam → ethanol. Phosphoric acid catalyst, high T & P.', eq: '<span class="reactant">C₂H₄</span><span class="plus">+</span><span class="reactant">H₂O</span><span class="arrow">→</span><span class="product">C₂H₅OH</span>' } },
    { label: 'Oxidation [O]', detail: { title: 'Oxidation', desc: 'Ethanol → ethanoic acid. KMnO₄ (purple→colourless) or air (slow).', eq: '<span class="reactant">C₂H₅OH</span><span class="arrow">→</span><span class="product">CH₃COOH</span>' } },
    { label: '+ Alcohol (H⁺)', detail: { title: 'Esterification', desc: 'Acid + alcohol ⇌ ester + water. Acid catalyst, reversible.', eq: '<span class="reactant">CH₃COOH</span><span class="plus">+</span><span class="reactant">C₂H₅OH</span><span class="arrow">⇌</span><span class="product">CH₃COOC₂H₅</span><span class="plus">+</span><span class="product">H₂O</span>' } }
];

function initConversionChain() {
    const c = $('#conversion-chain');
    if (!c) return;
    c.innerHTML = '';

    chainNodes.forEach((nd, i) => {
        const node = makeEl('div', { cls: 'chain-node' });
        node.innerHTML = `<div class="chain-name" style="color:${nd.color}">${nd.name}</div><div class="chain-formula">${nd.formula}</div>`;
        c.appendChild(node);

        if (i < chainNodes.length - 1) {
            const arrowData = chainArrows[i];
            const arrow = makeEl('div', { cls: 'chain-arrow' });
            arrow.innerHTML = `<div class="chain-arrow-label">${arrowData.label}</div><div>→</div>`;
            arrow.addEventListener('click', () => {
                const area = $('#chain-detail-area');
                if (!area) return;
                const d = arrowData.detail;
                area.innerHTML = `<div class="chain-detail-popup"><h4>${d.title}</h4><p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:12px;">${d.desc}</p><div class="reaction-equation">${d.eq}</div></div>`;
            });
            c.appendChild(arrow);
        }
    });
}

// ══════════════════════════════════════
// 23. SERIES COMPARISON
// ══════════════════════════════════════
const seriesInfo = {
    alkanes: [
        { name: 'Methane', formula: 'CH₄', bp: '−162 °C' },
        { name: 'Ethane', formula: 'C₂H₆', bp: '−89 °C' },
        { name: 'Propane', formula: 'C₃H₈', bp: '−42 °C' },
        { name: 'Butane', formula: 'C₄H₁₀', bp: '−1 °C' }
    ],
    alkenes: [
        { name: 'Ethene', formula: 'C₂H₄', bp: '−104 °C' },
        { name: 'Propene', formula: 'C₃H₆', bp: '−47 °C' },
        { name: 'But-1-ene', formula: 'C₄H₈', bp: '−6 °C' },
        { name: 'Pent-1-ene', formula: 'C₅H₁₀', bp: '30 °C' }
    ],
    alcohols: [
        { name: 'Methanol', formula: 'CH₃OH', bp: '65 °C' },
        { name: 'Ethanol', formula: 'C₂H₅OH', bp: '78 °C' },
        { name: 'Propan-1-ol', formula: 'C₃H₇OH', bp: '97 °C' },
        { name: 'Butan-1-ol', formula: 'C₄H₉OH', bp: '117 °C' }
    ],
    acids: [
        { name: 'Methanoic', formula: 'HCOOH', bp: '101 °C' },
        { name: 'Ethanoic', formula: 'CH₃COOH', bp: '118 °C' },
        { name: 'Propanoic', formula: 'C₂H₅COOH', bp: '141 °C' },
        { name: 'Butanoic', formula: 'C₃H₇COOH', bp: '164 °C' }
    ]
};

const seriesColors = { alkanes: 'var(--accent-orange)', alkenes: 'var(--accent-red)', alcohols: 'var(--accent-purple)', acids: 'var(--accent-pink)' };

function initSeries() {
    for (const [key, members] of Object.entries(seriesInfo)) {
        const el = $(`#series-${key}`);
        if (!el) continue;
        el.innerHTML = '';
        members.forEach(m => {
            el.appendChild(makeEl('div', { cls: 'series-item', html: `<span class="item-name">${m.name}</span><span class="item-formula">${m.formula}</span><span class="item-bp" style="color:${seriesColors[key]}">${m.bp}</span>` }));
        });
        el.appendChild(makeEl('div', { style: 'padding:8px 0 0;font-size:0.72rem;color:var(--text-muted);text-align:center;border-top:1px solid var(--border-subtle);margin-top:4px;', html: '↑ b.p. increases with M<sub>r</sub>' }));
    }
}

// ══════════════════════════════════════
// 24. FLOWCHART CHALLENGE
// ══════════════════════════════════════
const flowcharts = [
    {
        title: 'Ethene → Ethanol → Ethanoic Acid → Ester',
        rows: [[
            { text: 'Ethene', type: 'filled' },
            { text: 'Ethanol', type: 'blank', ans: 'Ethanol' },
            { text: 'Ethanoic acid', type: 'filled' },
            { text: 'Ethyl ethanoate', type: 'blank', ans: 'Ethyl ethanoate' }
        ]],
        arrows: [['+ steam', '(H₃PO₄)'], ['oxidation', '[O]'], ['+ ethanol', '(H⁺ cat.)']],
        distractors: ['Methanol', 'Poly(ethene)', 'Methyl ethanoate', 'Propanoic acid', 'Ethane'],
        hint: 'Hydration → oxidation → esterification.'
    },
    {
        title: 'Crude Oil → Plastic Bags',
        rows: [[
            { text: 'Crude oil', type: 'filled' },
            { text: 'Long-chain alkane', type: 'blank', ans: 'Long-chain alkane' },
            { text: 'Ethene', type: 'blank', ans: 'Ethene' },
            { text: 'Poly(ethene)', type: 'filled' }
        ]],
        arrows: [['fractional', 'distillation'], ['cracking', '(high temp)'], ['addition', 'polymerisation']],
        distractors: ['Ethanol', 'Ethane', 'Nylon', 'Methane', 'Propene'],
        hint: 'Separate → break down → join up.'
    },
    {
        title: 'Ethanoic Acid Reactions',
        rows: [
            [{ text: 'CH₃COOH + Mg', type: 'filled' }, { text: 'Mg(CH₃COO)₂ + H₂', type: 'blank', ans: 'Mg(CH₃COO)₂ + H₂' }],
            [{ text: 'CH₃COOH + Na₂CO₃', type: 'filled' }, { text: 'CH₃COONa + H₂O + CO₂', type: 'blank', ans: 'CH₃COONa + H₂O + CO₂' }],
            [{ text: 'CH₃COOH + NaOH', type: 'filled' }, { text: 'CH₃COONa + H₂O', type: 'blank', ans: 'CH₃COONa + H₂O' }]
        ],
        arrows: [['acid +', 'metal'], ['acid +', 'carbonate'], ['neutral-', 'isation']],
        distractors: ['CH₃COONa + H₂', 'Mg(CH₃COO)₂ + CO₂', 'Ethyl ethanoate + H₂O', 'Ethanol + NaCl'],
        hint: 'Acid + metal → salt + H₂. Acid + carbonate → salt + H₂O + CO₂. Acid + base → salt + H₂O.'
    },
    {
        title: 'Glucose → Ethanol → Two Paths',
        rows: [
            [{ text: 'Glucose C₆H₁₂O₆', type: 'filled' }, { text: 'Ethanol', type: 'filled' }, { text: 'Ethanoic acid', type: 'blank', ans: 'Ethanoic acid' }],
            [{ text: '', type: 'spacer' }, { text: 'Ethanol', type: 'filled' }, { text: 'CO₂ + H₂O', type: 'blank', ans: 'CO₂ + H₂O' }]
        ],
        arrows: [['fermentation', '(yeast)'], ['oxidation', '(KMnO₄/air)'], ['', ''], ['combustion', '(excess O₂)']],
        distractors: ['Ethene', 'Methanoic acid', 'CO + H₂O', 'Poly(ethene)', 'Ethane'],
        hint: 'Ethanol can be oxidised or combusted.'
    },
    {
        title: 'Reaction Types & Products',
        rows: [
            [{ text: 'Ethene + Br₂(aq)', type: 'filled' }, { text: 'CH₂BrCH₂Br', type: 'blank', ans: 'CH₂BrCH₂Br' }],
            [{ text: 'Methane + Cl₂', type: 'filled' }, { text: 'CH₃Cl + HCl', type: 'blank', ans: 'CH₃Cl + HCl' }],
            [{ text: 'Ethene + H₂', type: 'filled' }, { text: 'Ethane', type: 'blank', ans: 'Ethane' }]
        ],
        arrows: [['addition', ''], ['substitution', '(UV light)'], ['addition', '(Ni cat.)']],
        distractors: ['Ethanol', 'CH₂Cl₂ + HCl', 'Poly(ethene)', 'Methanol', 'Propane'],
        hint: 'Alkene = addition. Alkane + halogen (UV) = substitution.'
    },
    {
        title: 'Crude Oil to Vinegar (Full Path)',
        rows: [[
            { text: 'Crude oil', type: 'filled' },
            { text: 'Naphtha', type: 'blank', ans: 'Naphtha' },
            { text: 'Ethene', type: 'blank', ans: 'Ethene' },
            { text: 'Ethanol', type: 'filled' },
            { text: 'Ethanoic acid', type: 'blank', ans: 'Ethanoic acid' }
        ]],
        arrows: [['fractional', 'distillation'], ['cracking', ''], ['+ steam', '(catalyst)'], ['oxidation', '(air)']],
        distractors: ['Bitumen', 'Propene', 'Methanol', 'Methanoic acid', 'Poly(ethene)', 'Kerosene'],
        hint: 'Separate → crack → hydrate → oxidise.'
    }
];

let fcState = { idx: 0, blanks: [], filled: 0, total: 0, completed: new Set() };

function initFlowchartNav() {
    const nav = $('#fc-nav');
    if (!nav) return;
    nav.innerHTML = '';
    flowcharts.forEach((_, i) => {
        const btn = makeEl('button', { cls: `fc-nav-btn${i === 0 ? ' active' : ''}`, text: `Chain ${i + 1}` });
        btn.addEventListener('click', () => loadFlowchart(i));
        nav.appendChild(btn);
    });
}

function loadFlowchart(idx) {
    const fc = flowcharts[idx];
    if (!fc) return;

    fcState = { idx, blanks: [], filled: 0, total: 0, completed: fcState.completed };

    $$('.fc-nav-btn').forEach((b, i) => {
        b.classList.toggle('active', i === idx);
        if (fcState.completed.has(i)) b.classList.add('completed');
    });

    const titleEl = $('#fc-title'), stage = $('#fc-stage'), fb = $('#fc-feedback');
    if (titleEl) titleEl.textContent = fc.title;
    if (fb) fb.innerHTML = '';
    if (!stage) return;
    stage.innerHTML = '';

    let arrowIdx = 0;
    fc.rows.forEach((row, ri) => {
        const rowEl = makeEl('div', { cls: 'fc-row' });

        row.forEach((node, ni) => {
            if (node.type === 'spacer') {
                rowEl.appendChild(makeEl('div', { cls: 'fc-box spacer' }));
            } else {
                const box = makeEl('div', { cls: `fc-box ${node.type === 'blank' ? 'blank' : 'filled'}` });

                if (node.type === 'blank') {
                    box.textContent = '?';
                    const blankId = fcState.blanks.length;
                    fcState.blanks.push({ ans: node.ans, done: false, ok: false, box });
                    box.addEventListener('click', () => openFcPopup(blankId));
                } else {
                    box.innerHTML = node.text.replace(/\n/g, '<br>');
                }
                rowEl.appendChild(box);
            }

            // Arrow after each node except last in row
            if (ni < row.length - 1) {
                const aData = fc.arrows[arrowIdx] || ['', ''];
                arrowIdx++;
                const arrow = makeEl('div', { cls: 'fc-arrow' });
                arrow.innerHTML = `<div class="fc-arrow-label">${aData[0]}</div><div class="fc-arrow-line">→</div>${aData[1] ? `<div class="fc-arrow-label">${aData[1]}</div>` : ''}`;
                rowEl.appendChild(arrow);
            }
        });
        stage.appendChild(rowEl);
    });

    fcState.total = fcState.blanks.length;
    updateFcProgress();
}

function openFcPopup(blankId) {
    const blank = fcState.blanks[blankId];
    if (!blank || blank.done) return;

    // Close existing popups
    $$('.fc-options-popup').forEach(p => p.remove());
    $$('.fc-box.choosing').forEach(b => b.classList.remove('choosing'));
    blank.box.classList.add('choosing');

    const fc = flowcharts[fcState.idx];
    const allAns = fcState.blanks.filter(b => !b.ok).map(b => b.ans);
    let options = [...new Set([...allAns, ...fc.distractors])].sort(() => Math.random() - 0.5);

    const popup = makeEl('div', { cls: 'fc-options-popup' });
    options.forEach(opt => {
        const btn = makeEl('button', { cls: 'fc-option', text: opt });
        btn.addEventListener('click', e => { e.stopPropagation(); selectFcOption(blankId, opt, popup); });
        popup.appendChild(btn);
    });

    blank.box.appendChild(popup);

    const close = e => {
        if (!popup.contains(e.target) && e.target !== blank.box) {
            popup.remove();
            blank.box.classList.remove('choosing');
            document.removeEventListener('click', close);
        }
    };
    setTimeout(() => document.addEventListener('click', close), 50);
}

function selectFcOption(blankId, selected, popup) {
    const blank = fcState.blanks[blankId];
    popup.remove();
    blank.box.classList.remove('choosing', 'blank');
    blank.done = true;
    fcState.filled++;

    if (selected === blank.ans) {
        blank.ok = true;
        blank.box.classList.add('correct-box');
        blank.box.innerHTML = blank.ans;
    } else {
        blank.box.classList.add('wrong-box');
        blank.box.innerHTML = `<s style="opacity:0.5">${selected}</s><br><small style="color:var(--accent-green)">${blank.ans}</small>`;
    }

    updateFcProgress();
    if (fcState.filled === fcState.total) checkFcDone();
}

function updateFcProgress() {
    const el = $('#fc-progress');
    if (el) el.textContent = `${fcState.filled} / ${fcState.total} filled (${fcState.blanks.filter(b => b.ok).length} correct)`;
}

function checkFcDone() {
    const correct = fcState.blanks.filter(b => b.ok).length;
    const fb = $('#fc-feedback');
    if (correct === fcState.total) {
        if (fb) fb.innerHTML = '<span style="color:var(--accent-green)">🏆 Perfect! All correct!</span>';
        fcState.completed.add(fcState.idx);
    } else {
        if (fb) fb.innerHTML = `<span style="color:var(--accent-orange)">${correct}/${fcState.total} correct. 💡 ${flowcharts[fcState.idx].hint}</span>`;
    }
    $$('.fc-nav-btn').forEach((b, i) => { if (fcState.completed.has(i)) b.classList.add('completed'); });
}

function resetFlowchart() { loadFlowchart(fcState.idx); }

// ══════════════════════════════════════
// 25. GUESS THE SUBSTANCE
// ══════════════════════════════════════
const guessData = [
    { substance: 'Ethanol', formula: 'C₂H₅OH', clues: ['Liquid at r.t.p., boiling point 78 °C.', 'Burns with a clean blue flame → CO₂ + H₂O.', 'Produced by fermentation of glucose with yeast at ~37 °C.', 'Oxidised by KMnO₄ → ethanoic acid (purple → colourless).', 'Contains the –OH functional group.'], options: ['Ethanol', 'Methanol', 'Ethanoic acid', 'Ethene', 'Propan-1-ol'], explanation: 'Ethanol (C₂H₅OH) — the alcohol from fermentation. Oxidation gives vinegar.' },
    { substance: 'Ethene', formula: 'C₂H₄', clues: ['Gas at room temperature.', 'Rapidly decolourises aqueous bromine (brown → colourless).', 'Produced by cracking long-chain alkanes.', 'Undergoes addition polymerisation → poly(ethene).', 'Contains a C=C double bond. General formula CₙH₂ₙ.'], options: ['Ethene', 'Ethane', 'Methane', 'Propene', 'Ethanol'], explanation: 'Ethene (C₂H₄) — simplest alkene. C=C makes it unsaturated and reactive.' },
    { substance: 'Ethanoic acid', formula: 'CH₃COOH', clues: ['Liquid with a sharp, vinegar-like smell.', 'Weak acid — only partially ionises in water.', 'Reacts with Na₂CO₃ → effervescence, gas turns limewater milky.', 'Formed by oxidation of ethanol.', 'Contains the –COOH functional group.'], options: ['Ethanoic acid', 'Ethanol', 'Hydrochloric acid', 'Methanoic acid', 'Propanoic acid'], explanation: 'Ethanoic acid (CH₃COOH) — found in vinegar. A weak acid with typical acid reactions.' },
    { substance: 'Methane', formula: 'CH₄', clues: ['Main component of natural gas (non-renewable).', 'Gas at r.t.p., very low b.p. (−162 °C).', 'Does NOT decolourise aqueous bromine.', 'Reacts with Cl₂ in UV light → CH₃Cl + HCl (substitution).', 'Simplest alkane. Formula CH₄.'], options: ['Methane', 'Ethane', 'Ethene', 'Methanol', 'Carbon dioxide'], explanation: 'Methane (CH₄) — simplest alkane. Saturated, generally unreactive except combustion and substitution.' },
    { substance: 'Poly(ethene)', formula: '–(CH₂CH₂)ₙ–', clues: ['Solid material used for plastic bags and cling film.', 'Non-biodegradable — persists for hundreds of years.', 'Formed by addition polymerisation.', 'Its monomer contains a C=C double bond.', 'Monomer is ethene (C₂H₄).'], options: ['Poly(ethene)', 'Nylon', 'Terylene', 'Poly(propene)', 'PVC'], explanation: 'Poly(ethene) — most common plastic. Made by addition polymerisation of ethene.' },
    { substance: 'Ethyl ethanoate', formula: 'CH₃COOC₂H₅', clues: ['Has a sweet, fruity smell — used in flavourings.', 'Formed in a reversible reaction that also produces water.', 'Requires an acid catalyst (e.g. conc. H₂SO₄).', 'Made from ethanoic acid + ethanol.', 'An ester — contains the –COO– linkage.'], options: ['Ethyl ethanoate', 'Methyl ethanoate', 'Ethanoic acid', 'Ethanol', 'Methyl propanoate'], explanation: 'Ethyl ethanoate — ester from ethanoic acid + ethanol. Named: alcohol part (ethyl) + acid part (ethanoate).' },
    { substance: 'Propene', formula: 'C₃H₆', clues: ['Gas at r.t.p., b.p. −47 °C.', 'Decolourises aqueous bromine immediately.', 'Molecular formula C₃H₆.', 'Can undergo addition polymerisation → poly(propene).', 'An alkene with 3 carbons and a C=C double bond.'], options: ['Propene', 'Propane', 'Ethene', 'But-1-ene', 'Propan-1-ol'], explanation: 'Propene (C₃H₆) — 3-carbon alkene. CₙH₂ₙ with n=3. Decolourises Br₂ water.' },
    { substance: 'Nylon', formula: 'polyamide', clues: ['Synthetic polymer: clothing, parachutes, fishing line.', 'Formed by condensation polymerisation — water released.', 'Made from two different types of monomers.', 'Contains the amide linkage –CONH–.', 'Unlike poly(ethene), monomers do NOT need C=C bonds.'], options: ['Nylon', 'Terylene', 'Poly(ethene)', 'PVC', 'Poly(propene)'], explanation: 'Nylon — polyamide from condensation polymerisation. Two monomers join releasing H₂O, forming –CONH– links.' }
];

let guessState = { idx: 0, revealed: 0, answered: false, totalScore: 0, scores: {} };

function initGuessNav() {
    const nav = $('#guess-nav');
    if (!nav) return;
    nav.innerHTML = '';
    guessData.forEach((_, i) => {
        const btn = makeEl('button', { cls: `guess-nav-btn${i === 0 ? ' active' : ''}`, text: `Mystery ${i + 1}` });
        btn.addEventListener('click', () => loadGuess(i));
        nav.appendChild(btn);
    });
}

function loadGuess(idx) {
    const m = guessData[idx];
    if (!m) return;
    guessState.idx = idx;
    guessState.revealed = 0;
    guessState.answered = false;

    $$('.guess-nav-btn').forEach((b, i) => {
        b.classList.toggle('active', i === idx);
        if (guessState.scores[i] !== undefined) {
            b.style.borderColor = guessState.scores[i] > 0 ? 'rgba(104,211,145,0.3)' : 'rgba(252,129,129,0.3)';
        }
    });

    $('#guess-clue-count').textContent = '0';
    $('#guess-clue-total').textContent = m.clues.length;

    const cluesEl = $('#guess-clues');
    if (cluesEl) {
        cluesEl.innerHTML = '';
        m.clues.forEach((_, i) => {
            cluesEl.appendChild(makeEl('div', { cls: 'guess-clue-item hidden-clue', id: `clue-${i}`, html: `<span class="clue-number">${i + 1}</span><span>🔒 Hidden</span>` }));
        });
    }

    const optsEl = $('#guess-options');
    if (optsEl) {
        optsEl.innerHTML = '';
        [...m.options].sort(() => Math.random() - 0.5).forEach(opt => {
            const btn = makeEl('button', { cls: 'guess-opt-btn', text: opt });
            btn.addEventListener('click', () => handleGuess(opt));
            optsEl.appendChild(btn);
        });
    }

    $('#guess-result').innerHTML = '';
    const rb = $('#guess-reveal-btn');
    if (rb) { rb.textContent = 'Reveal First Clue 💡'; rb.disabled = false; }
}

function revealNextClue() {
    const m = guessData[guessState.idx];
    if (!m || guessState.answered || guessState.revealed >= m.clues.length) return;

    const i = guessState.revealed;
    const el = $(`#clue-${i}`);
    if (el) {
        el.className = 'guess-clue-item revealed-clue';
        el.innerHTML = `<span class="clue-number">${i + 1}</span><span>${m.clues[i]}</span>`;
    }
    guessState.revealed++;
    $('#guess-clue-count').textContent = guessState.revealed;

    const rb = $('#guess-reveal-btn');
    if (rb) {
        if (guessState.revealed >= m.clues.length) { rb.textContent = 'All clues revealed'; rb.disabled = true; }
        else rb.textContent = `Reveal Clue ${guessState.revealed + 1} 💡`;
    }
}

function handleGuess(selected) {
    const m = guessData[guessState.idx];
    if (!m || guessState.answered) return;
    if (guessState.revealed === 0) { $('#guess-result').innerHTML = '<span style="color:var(--accent-orange)">⚠️ Reveal at least one clue first!</span>'; return; }

    guessState.answered = true;
    const ok = selected === m.substance;
    const pts = ok ? Math.max(1, m.clues.length - guessState.revealed + 1) : 0;
    guessState.scores[guessState.idx] = Math.min(pts, 4);
    guessState.totalScore = Object.values(guessState.scores).reduce((a, b) => a + b, 0);
    $('#guess-total-score').textContent = guessState.totalScore;

    $$('.guess-opt-btn').forEach(b => {
        b.classList.add('disabled');
        if (b.textContent === m.substance) b.classList.add(ok ? 'sel-correct' : 'show-correct');
        if (b.textContent === selected && !ok) b.classList.add('sel-wrong');
    });

    // Reveal remaining clues
    for (let i = guessState.revealed; i < m.clues.length; i++) {
        const el = $(`#clue-${i}`);
        if (el) { el.className = 'guess-clue-item revealed-clue'; el.innerHTML = `<span class="clue-number">${i + 1}</span><span>${m.clues[i]}</span>`; }
    }
    $('#guess-clue-count').textContent = m.clues.length;
    const rb = $('#guess-reveal-btn');
    if (rb) { rb.disabled = true; rb.textContent = 'All clues revealed'; }

    const res = $('#guess-result');
    const pCls = pts >= 4 ? 'high' : pts >= 3 ? 'mid' : pts >= 1 ? 'low' : 'zero';
    if (ok) {
        res.className = 'guess-result correct-result';
        res.innerHTML = `<strong>✓ Correct!</strong> ${m.substance} (${m.formula}) <span class="points-badge ${pCls}">+${guessState.scores[guessState.idx]} pts</span><br><span style="font-size:0.82rem;color:var(--text-secondary)">${guessState.revealed === 1 ? '🌟 Just 1 clue!' : guessState.revealed <= 2 ? '👏 Only ' + guessState.revealed + ' clues!' : guessState.revealed + ' clues used.'}</span><br><span style="font-size:0.82rem;color:var(--text-muted)">${m.explanation}</span>`;
    } else {
        res.className = 'guess-result wrong-result';
        res.innerHTML = `<strong>✗ Not quite.</strong> It was <strong>${m.substance}</strong> (${m.formula}) <span class="points-badge zero">+0 pts</span><br><span style="font-size:0.82rem;color:var(--text-muted)">${m.explanation}</span>`;
    }
}

// ══════════════════════════════════════
// 26. MASTER INIT
// ══════════════════════════════════════
function init() {
    handleScroll();
    initReveal();
    initHeroBg();
    initQuizzes();
    initMolecules();
    initBPChart();
    showIsomer('butane');
    initSelectors();
    showAlkeneRxn('bromine');
    showAcidReaction('metal');
    showMonoPoly('ethene');
    initDistillation();
    initConversionChain();
    initSeries();
    initFlowchartNav();
    loadFlowchart(0);
    initGuessNav();
    loadGuess(0);
    generateDrill();
          initFuelsSection();

    console.log('%c⚗️ OrgChem 6092 loaded!', 'font-size:14px;font-weight:bold;color:#4fd1c5;');
    console.log('%cKeys 1-8: jump sections | T: top | Enter in drill: check/next', 'font-size:11px;color:#a0aec0;');
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

// ══════════════════════════════════════
// 27. FUELS & SUSTAINABILITY
// ══════════════════════════════════════

function toggleEthMethod(method) {
    const body = $(`#eth-body-${method}`);
    const toggle = $(`#eth-toggle-${method}`);
    if (!body || !toggle) return;

    const isOpen = body.style.display !== 'none';
    body.style.display = isOpen ? 'none' : 'block';
    toggle.textContent = isOpen ? '+' : '×';
    toggle.classList.toggle('open', !isOpen);
}

// Fuels quiz data
const fuelsQuizData = [
    { q: 'Why are fossil fuels considered non-renewable?', opts: ['They are expensive', 'They take millions of years to form', 'They produce CO₂', 'They are found underground'], ans: 1 },
    { q: 'Bioethanol is produced from sugarcane by:', opts: ['Fractional distillation', 'Cracking', 'Fermentation using yeast', 'Hydration of ethene'], ans: 2 },
    { q: 'Why is bioethanol considered approximately carbon neutral?', opts: ['It does not produce CO₂ when burned', 'CO₂ absorbed by crops during growth offsets CO₂ released on burning', 'It is made from crude oil', 'It produces less heat than petrol'], ans: 1 },
    { q: 'Which is a disadvantage of biofuels?', opts: ['They are non-renewable', 'They produce more CO₂ than petrol', 'Land is used for fuel crops instead of food', 'They cannot be burned in engines'], ans: 2 },
    { q: 'In fermentation, glucose is converted to ethanol using:', opts: ['Phosphoric acid at 300 °C', 'Yeast at ~37 °C', 'Nickel catalyst at 150 °C', 'UV light'], ans: 1 },
    { q: 'Fossil fuels contribute to global warming because:', opts: ['They are renewable', 'They release CO₂ that was locked underground for millions of years', 'They are carbon neutral', 'They absorb CO₂ from the atmosphere'], ans: 1 }
];

function initFuelsSection() {
    // Build quiz
    const container = $('#quiz-fuels');
    if (container) {
        quizState.fuels = { total: fuelsQuizData.length, answered: 0, correct: 0 };
        container.innerHTML = '';
        fuelsQuizData.forEach((item, qi) => {
            const qEl = makeEl('div', { cls: 'quiz-question' });
            qEl.innerHTML = `
                <p class="q-text">${qi + 1}. ${item.q}</p>
                <div class="q-options">${item.opts.map((o, oi) =>
                    `<button class="q-option" data-idx="${oi}">${o}</button>`
                ).join('')}</div>
                <div class="q-feedback"></div>
            `;
            container.appendChild(qEl);
            $$('.q-option', qEl).forEach(btn => {
                btn.addEventListener('click', () => handleAnswer(btn, qEl, item.ans, 'fuels'));
            });
        });
    }

    // Add fuels questions to final quiz pool
    const extraFinal = [
        { q: 'Bioethanol from sugarcane is considered more sustainable because:', opts: ['It is cheaper', 'CO₂ absorbed during crop growth offsets CO₂ from burning', 'It has higher energy density', 'It produces no CO₂'], ans: 1, topic: 'Fuels' },
        { q: 'The fermentation of glucose requires:', opts: ['UV light and chlorine', 'Yeast at ~37 °C, no oxygen', 'Ni catalyst at 150 °C', 'Phosphoric acid at 300 °C'], ans: 1, topic: 'Fuels' },
        { q: 'Fossil fuels are non-renewable because they:', opts: ['Are too expensive to extract', 'Take millions of years to form', 'Produce toxic gases', 'Are only found in tropical countries'], ans: 1, topic: 'Fuels' },
        { q: 'During photosynthesis, sugarcane plants:', opts: ['Release CO₂ into the atmosphere', 'Absorb CO₂ from the atmosphere', 'Produce ethanol directly', 'Break down fossil fuels'], ans: 1, topic: 'Fuels' }
    ];

    extraFinal.forEach(q => {
        if (!finalPool.some(e => e.q === q.q)) finalPool.push(q);
    });
}

// Update keyboard shortcuts to include fuels section
// Find in the existing keydown handler, the map object should be updated.
// Since we can't modify inline, we add a second listener:
document.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
    // 'f' key jumps to fuels
    if (e.key === 'f' || e.key === 'F') {
        if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            scrollToSection('fuels');
        }
    }
});