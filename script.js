// Configuração dos áudios de feedback
const soundSuccess = new Audio('success.mp3');
const soundError = new Audio('error.mp3');

soundSuccess.volume = 0.5;
soundError.volume = 0.5;

function tocarSom(valido) {
    soundSuccess.pause(); soundSuccess.currentTime = 0;
    soundError.pause();   soundError.currentTime = 0;
    if (valido) {
        soundSuccess.play().catch(e => console.log("Erro ao tocar som:", e));
    } else {
        soundError.play().catch(e => console.log("Erro ao tocar som:", e));
    }
}

/* ============================================
   PADRÕES DE BANDEIRAS (lógica original preservada)
   ============================================ */
const CARD_PATTERNS = {
    visaElectron: /^(4026|417500|4405|4508|4844|4913|4917)\d+/,
    elo: /^((((636368)|(438935)|(504175)|(451416)|(636297))[0-9]{10})|((5067)|(4576)|(4011)|(50900))[0-9]{12})$/,
    hipercard: /^(606282[0-9]{10}([0-9]{3})?)$/,
    mastercard: /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/,
    amex: /^3[47][0-9]{13}$/,
    diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
    enroute: /^(2014|2149)/,
    maestro: /^(5018|5020|5038|5893|6304|6759|6761|6762|6763|6770|6771)[0-9]{8,15}$/,
    solo: /^(6334|6767)[0-9]{12,17}$/,
    switch: /^(4903|4905|4911|4936|6333|6759)[0-9]{12,17}$/,
    laser: /^(6304|6706|6709|6771)[0-9]{12,17}$/,
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
};

const BANCOS = {
    visa:        { nome: 'Visa',             cor: '#1a1f71', logo: '<i class="fab fa-cc-visa"></i>',         digitos: 16 },
    mastercard:  { nome: 'Mastercard',       cor: '#eb001b', logo: '<i class="fab fa-cc-mastercard"></i>',   digitos: 16 },
    amex:        { nome: 'American Express', cor: '#2e77bb', logo: '<i class="fab fa-cc-amex"></i>',         digitos: 15 },
    diners:      { nome: 'Diners Club',      cor: '#0079be', logo: '<i class="fab fa-cc-diners-club"></i>',  digitos: 14 },
    discover:    { nome: 'Discover',         cor: '#f68121', logo: '<i class="fab fa-cc-discover"></i>',     digitos: 16 },
    jcb:         { nome: 'JCB',              cor: '#1f286f', logo: '<i class="fab fa-cc-jcb"></i>',          digitos: 16 },
    enroute:     { nome: 'enRoute',          cor: '#a3a3a3', logo: '<i class="fa-solid fa-plane"></i>',      digitos: 15 },
    maestro:     { nome: 'Maestro',          cor: '#00a2e1', logo: '<i class="fa-brands fa-cc-mastercard"></i>', digitos: 16 },
    visaElectron:{ nome: 'Visa Electron',    cor: '#1a1f71', logo: '<i class="fab fa-cc-visa"></i>',         digitos: 16 },
    solo:        { nome: 'Solo',             cor: '#652d8e', logo: '<i class="fa-solid fa-credit-card"></i>',digitos: 16 },
    switch:      { nome: 'Switch',           cor: '#000000', logo: '<i class="fa-solid fa-credit-card"></i>',digitos: 16 },
    laser:       { nome: 'Laser',            cor: '#ed1c24', logo: '<i class="fa-solid fa-bolt"></i>',       digitos: 16 },
    elo:         { nome: 'Elo',              cor: '#ffc60b', logo: '<i class="fa-solid fa-credit-card"></i>',digitos: 16 },
    hipercard:   { nome: 'Hipercard',        cor: '#b3131b', logo: '<i class="fa-solid fa-credit-card"></i>',digitos: 16 },
};

// Elementos DOM
const rootElement      = document.documentElement;
const form             = document.getElementById('cardForm');
const cardNumberInput  = document.getElementById('cardNumber');
const bandeiraElement  = document.getElementById('bandeira');
const cardErrorElement = document.getElementById('cardError');
const resultSection    = document.getElementById('resultSection');
const themeToggle      = document.getElementById('themeToggle');

/* ============================================
   TEMA — dark como padrão
   ============================================ */
(function initTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    rootElement.setAttribute('data-theme', saved);
    themeToggle.setAttribute('data-icon', saved === 'dark' ? '☀️' : '🌙');
})();

themeToggle.addEventListener('click', () => {
    const current  = rootElement.getAttribute('data-theme');
    const next     = current === 'dark' ? 'light' : 'dark';
    rootElement.setAttribute('data-theme', next);
    themeToggle.setAttribute('data-icon', next === 'dark' ? '☀️' : '🌙');
    localStorage.setItem('theme', next);
});

/* ============================================
   ALGORITMO DE LUHN (preservado)
   ============================================ */
function validarLuhn(numero) {
    let soma = 0, ehPar = false;
    for (let i = numero.length - 1; i >= 0; i--) {
        let d = parseInt(numero.charAt(i), 10);
        if (ehPar) { d *= 2; if (d > 9) d -= 9; }
        soma += d;
        ehPar = !ehPar;
    }
    return soma % 10 === 0;
}

/* ============================================
   IDENTIFICAR BANDEIRA (preservado)
   ============================================ */
function identificarBandeira(numero) {
    const limpo = numero.replace(/\s/g, '');
    if (limpo.length < 2) return null;
    for (const [chave, regex] of Object.entries(CARD_PATTERNS)) {
        if (regex.test(limpo)) return chave;
    }
    return null;
}

/* ============================================
   FORMATAÇÃO (preservada)
   ============================================ */
function formatarNumeroCartao(valor, bandeira = null) {
    const nums   = valor.replace(/\D/g, '');
    const limite = (bandeira && BANCOS[bandeira]) ? BANCOS[bandeira].digitos : 16;
    const ltd    = nums.slice(0, limite);

    if (bandeira === 'amex') {
        if (ltd.length <= 4)  return ltd;
        if (ltd.length <= 10) return ltd.slice(0, 4) + ' ' + ltd.slice(4);
        return ltd.slice(0, 4) + ' ' + ltd.slice(4, 10) + ' ' + ltd.slice(10);
    }
    return ltd.match(/.{1,4}/g)?.join(' ') || ltd;
}

function atualizarBandeira() {
    const bandeira = identificarBandeira(cardNumberInput.value);
    if (bandeira) {
        bandeiraElement.innerHTML = BANCOS[bandeira].logo;
        bandeiraElement.style.display = 'inline';
        cardNumberInput.style.borderColor = 'var(--border-accent)';
    } else {
        bandeiraElement.style.display = 'none';
        cardNumberInput.style.borderColor = '';
    }
}

/* ============================================
   POPUP
   ============================================ */
function exibirPopup(valido, bandeira = null, mensagem = '') {
    const existente = document.getElementById('validationPopup');
    if (existente) existente.remove();

    const overlay = document.createElement('div');
    overlay.id = 'validationPopup';
    overlay.className = 'popup-overlay';

    const popup = document.createElement('div');
    popup.className = 'popup-container';

    if (valido && bandeira) {
        const banco = BANCOS[bandeira];
        popup.innerHTML = `
            <div class="popup-header success">
                <span class="popup-icon">✓</span>
                <h2>Cartão Válido</h2>
            </div>
            <div class="popup-body">
                <div class="popup-bandeira">
                    <span class="popup-bandeira-logo">${banco.logo}</span>
                    <span class="popup-bandeira-nome">${banco.nome}</span>
                </div>
                <p class="popup-message">Número passou na verificação do algoritmo de Luhn.</p>
            </div>
            <div class="popup-footer">
                <button class="popup-btn popup-btn-primary" onclick="fecharPopup()">OK</button>
            </div>`;
    } else {
        popup.innerHTML = `
            <div class="popup-header error">
                <span class="popup-icon">✕</span>
                <h2>Número Inválido</h2>
            </div>
            <div class="popup-body">
                <p class="popup-message error-message">${mensagem}</p>
            </div>
            <div class="popup-footer">
                <button class="popup-btn popup-btn-secondary" onclick="fecharPopup()">Fechar</button>
            </div>`;
    }

    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('show'), 10);

    // Fechar ao clicar no overlay
    overlay.addEventListener('click', (e) => { if (e.target === overlay) fecharPopup(); });
}

function fecharPopup() {
    const popup = document.getElementById('validationPopup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 250);
    }
}

/* ============================================
   VALIDAÇÃO
   ============================================ */
function validarCartao(event) {
    event.preventDefault();
    const limpo    = cardNumberInput.value.replace(/\s/g, '');
    const bandeira = identificarBandeira(limpo);

    if (!limpo || limpo.length < 12) {
        tocarSom(false);
        exibirPopup(false, null, 'Número muito curto para ser válido.');
        return;
    }
    if (!bandeira) {
        tocarSom(false);
        exibirPopup(false, null, 'Bandeira não reconhecida. Verifique os dígitos iniciais.');
        return;
    }
    if (!validarLuhn(limpo)) {
        tocarSom(false);
        exibirPopup(false, null, 'Falha na verificação de Luhn — número inválido.');
        return;
    }

    tocarSom(true);
    exibirPopup(true, bandeira);
}

/* ============================================
   LISTENERS
   ============================================ */
form.addEventListener('submit', validarCartao);

cardNumberInput.addEventListener('input', (e) => {
    const bandeira = identificarBandeira(e.target.value);
    e.target.value = formatarNumeroCartao(e.target.value, bandeira);
    atualizarBandeira();
});