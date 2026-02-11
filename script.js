// Configuração dos áudios de feedback
const soundSuccess = new Audio('success.mp3');
const soundError = new Audio('error.mp3');

// Ajuste opcional de volume (de 0 a 1)
soundSuccess.volume = 0.5;
soundError.volume = 0.5;

/**
 * Função auxiliar para gerenciar os sons
 */
function tocarSom(valido) {
    // Reseta o tempo para permitir cliques rápidos seguidos
    soundSuccess.pause();
    soundSuccess.currentTime = 0;
    soundError.pause();
    soundError.currentTime = 0;

    if (valido) {
        soundSuccess.play().catch(e => console.log("Erro ao tocar som:", e));
    } else {
        soundError.play().catch(e => console.log("Erro ao tocar som:", e));
    }
}

/**
 * Validador de Cartão de Crédito 
 */
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
    visa: { nome: 'Visa', cor: '#1a1f71', logo: '<i class="fab fa-cc-visa"></i>', digitos: 16 },
    mastercard: { nome: 'Mastercard', cor: '#eb001b', logo: '<i class="fab fa-cc-mastercard"></i>', digitos: 16 },
    amex: { nome: 'American Express', cor: '#2e77bb', logo: '<i class="fab fa-cc-amex"></i>', digitos: 15 },
    diners: { nome: 'Diners Club', cor: '#0079be', logo: '<i class="fab fa-cc-diners-club"></i>', digitos: 14 },
    discover: { nome: 'Discover', cor: '#f68121', logo: '<i class="fab fa-cc-discover"></i>', digitos: 16 },
    jcb: { nome: 'JCB', cor: '#1f286f', logo: '<i class="fab fa-cc-jcb"></i>', digitos: 16 },
    enroute: { nome: 'enRoute', cor: '#a3a3a3', logo: '<i class="fa-solid fa-plane"></i>', digitos: 15 },
    maestro: { nome: 'Maestro', cor: '#00a2e1', logo: '<i class="fa-brands fa-cc-mastercard"></i>', digitos: 16 },
    visaElectron: { nome: 'Visa Electron', cor: '#1a1f71', logo: '<i class="fab fa-cc-visa"></i>', digitos: 16 },
    solo: { nome: 'Solo', cor: '#652d8e', logo: '<i class="fa-solid fa-credit-card"></i>', digitos: 16 },
    switch: { nome: 'Switch', cor: '#000000', logo: '<i class="fa-solid fa-credit-card"></i>', digitos: 16 },
    laser: { nome: 'Laser', cor: '#ed1c24', logo: '<i class="fa-solid fa-bolt"></i>', digitos: 16 },
    elo: { nome: 'Elo', cor: '#ffc60b', logo: '<i class="fa-solid fa-credit-card"></i>', digitos: 16 },
    hipercard: { nome: 'Hipercard', cor: '#b3131b', logo: '<i class="fa-solid fa-credit-card"></i>', digitos: 16 },
};

// Elementos do DOM
const rootElement = document.documentElement;
const form = document.getElementById('cardForm');
const cardNumberInput = document.getElementById('cardNumber');
const cardholderNameInput = document.getElementById('cardholderName');
const bandeiraElement = document.getElementById('bandeira');
const cardErrorElement = document.getElementById('cardError');
const resultSection = document.getElementById('resultSection');
const themeToggle = document.getElementById('themeToggle');

// Lógica de Modo Noturno
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = rootElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        rootElement.setAttribute('data-theme', newTheme);
        themeToggle.setAttribute('data-icon', newTheme === 'dark' ? '☀️' : '🌙');
        localStorage.setItem('theme', newTheme);
    });

    const savedTheme = localStorage.getItem('theme') || 'light';
    rootElement.setAttribute('data-theme', savedTheme);
    themeToggle.setAttribute('data-icon', savedTheme === 'dark' ? '☀️' : '🌙');
}

/**
 * Algoritmo de Luhn
 */
function validarLuhn(numero) {
    let soma = 0;
    let ehPar = false;
    for (let i = numero.length - 1; i >= 0; i--) {
        let digite = parseInt(numero.charAt(i), 10);
        if (ehPar) {
            digite *= 2;
            if (digite > 9) digite -= 9;
        }
        soma += digite;
        ehPar = !ehPar;
    }
    return soma % 10 === 0;
}

/**
 * Unifica a lógica e respeita a ordem do CARD_PATTERNS
 */
function identificarBandeira(numero) {
    const numeroLimpo = numero.replace(/\s/g, '');
    if (numeroLimpo.length < 2) return null;

    // Percorre o objeto CARD_PATTERNS. A ordem no objeto importa!
    for (const [chave, regex] of Object.entries(CARD_PATTERNS)) {
        if (regex.test(numeroLimpo)) {
            return chave;
        }
    }
    return null;
}

/**
 * Formatação do número
 */
function formatarNumeroCartao(valor, bandeira = null) {
    const apenasNumeros = valor.replace(/\D/g, '');
    let limite = (bandeira && BANCOS[bandeira]) ? BANCOS[bandeira].digitos : 16;
    const limitado = apenasNumeros.slice(0, limite);
    
    if (bandeira === 'amex') {
        if (limitado.length <= 4) return limitado;
        if (limitado.length <= 10) return limitado.slice(0, 4) + ' ' + limitado.slice(4);
        return limitado.slice(0, 4) + ' ' + limitado.slice(4, 10) + ' ' + limitado.slice(10);
    }
    
    return limitado.match(/.{1,4}/g)?.join(' ') || limitado;
}

function atualizarBandeira() {
    const numero = cardNumberInput.value;
    const bandeira = identificarBandeira(numero); 

    if (bandeira) {
        const banco = BANCOS[bandeira];
        bandeiraElement.innerHTML = banco.logo;
        bandeiraElement.style.display = 'inline';
        cardNumberInput.style.borderColor = 'var(--primary-purple)';;
    } else {
        bandeiraElement.style.display = 'none';
        cardNumberInput.style.borderColor = 'var(--border-color)';
    }
}

// Função do Popup (Mantive o innerHTML para suportar ícones se precisar)
function exibirPopup(valido, bandeira = null, mensagem = '') {
    const popupExistente = document.getElementById('validationPopup');
    if (popupExistente) popupExistente.remove();

    const overlay = document.createElement('div');
    overlay.id = 'validationPopup';
    overlay.className = 'popup-overlay';

    const popup = document.createElement('div');
    popup.className = 'popup-container';

    if (valido && bandeira) {
        const banco = BANCOS[bandeira];
        popup.innerHTML = `
            <div class="popup-header success"><h2>✅ Válido!</h2></div>
            <div class="popup-body">
                <p style="color:${banco.cor}">${banco.logo} <strong>${banco.nome}</strong></p>
                <p>O número passou no algoritmo de Luhn.</p>
            </div>
            <div class="popup-footer"><button class="popup-btn popup-btn-primary" onclick="fecharPopup()">OK</button></div>`;
    } else {
        popup.innerHTML = `
            <div class="popup-header error"><h2>❌ Erro</h2></div>
            <div class="popup-body"><p>${mensagem}</p></div>
            <div class="popup-footer"><button class="popup-btn popup-btn-secondary" onclick="fecharPopup()">Fechar</button></div>`;
    }

    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('show'), 10);
}

function fecharPopup() {
    const popup = document.getElementById('validationPopup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }
}

// Validação Final ao clicar no botão
function validarCartao(event) {
    event.preventDefault();
    const numeroLimpo = cardNumberInput.value.replace(/\s/g, '');
    const bandeira = identificarBandeira(numeroLimpo);

    if (!numeroLimpo || numeroLimpo.length < 12) {
        tocarSom(false); // <--- SOM DE ERRO
        exibirPopup(false, null, 'Número muito curto.');
        return;
    }
    if (!bandeira) {
        tocarSom(false); // <--- SOM DE ERRO
        exibirPopup(false, null, 'Bandeira desconhecida.');
        return;
    }
    if (!validarLuhn(numeroLimpo)) {
        tocarSom(false); // <--- SOM DE ERRO
        exibirPopup(false, null, 'Este número não é um cartão válido (Falha no Luhn).');
        return;
    }

    tocarSom(true); // <--- SOM DE SUCESSO
    exibirPopup(true, bandeira);
}

// Listeners
form.addEventListener('submit', validarCartao);

cardNumberInput.addEventListener('input', (e) => {
    const bandeira = identificarBandeira(e.target.value);
    e.target.value = formatarNumeroCartao(e.target.value, bandeira);
    atualizarBandeira();
});