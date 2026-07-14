// ==========================================
// 1. CONTROLE DO MENU HAMBURGER
// ==========================================
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    // Adiciona ou remove a classe 'active' para exibir/ocultar o menu lateral
    navMenu.classList.toggle('active');
}

// ==========================================
// 2. CONFIGURAÇÕES E LÓGICA DO SLIDER
// ==========================================
let indexAtual = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
let tempoTransicao = 3000; // Define a rotação automática a cada 3 segundos
let intervaloSlider;

// Exibe o slide atual e esconde os outros
function mostrarSlide(index) {
    slides.forEach(slide => slide.classList.remove('active')); // Limpa a classe ativa
    
    // Tratamento de limites (efeito infinito)
    if (index >= totalSlides) {
        indexAtual = 0;
    } else if (index < 0) {
        indexAtual = totalSlides - 1;
    } else {
        indexAtual = index;
    }
    
    slides[indexAtual].classList.add('active'); // Aplica a classe ativa no slide atual
}

// Avança ou recua os slides manualmente pelas setas
function mudarSlide(direcao) {
    mostrarSlide(indexAtual + direcao);
    resetarTimer(); // Reinicia o contador para evitar conflito com cliques rápidos
}

// Inicia o timer da transição automática
function iniciarTimer() {
    intervaloSlider = setInterval(() => {
        mudarSlide(1);
    }, tempoTransicao);
}

// Pausa temporariamente a transição do slider
function pausarTimer() {
    clearInterval(intervaloSlider);
}

// Reinicia o fluxo do timer do carrossel
function resetarTimer() {
    pausarTimer();
    iniciarTimer();
}

// Ouvintes de evento (Hover do Mouse) para pausar/retomar a transição das imagens
const sliderContainer = document.querySelector('.slider-container');
if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', pausarTimer); // Pausa quando o mouse está sobre o slider
    sliderContainer.addEventListener('mouseleave', iniciarTimer); // Retoma quando o mouse sai
}

// Inicializa o carrossel automático ao carregar o script
iniciarTimer();

// ==========================================
// 3. LEITURA AO PASSAR O MOUSE (HOVER TTS)
// ==========================================
let synth = window.speechSynthesis;
let uttrance = null;

// Busca e filtra as vozes brasileiras de acordo com o gênero escolhido
function obterVoz(genero) {
    const vozes = synth.getVoices();
    const vozesPT = vozes.filter(voz => voz.lang.includes('pt-BR'));
    
    if (vozesPT.length === 0) return null;

    if (genero === 'feminina') {
        return vozesPT.find(voz => voz.name.toLowerCase().includes('maria') || voz.name.toLowerCase().includes('google')) || vozesPT[0];
    } else {
        return vozesPT.find(voz => voz.name.toLowerCase().includes('daniel') || voz.name.toLowerCase().includes('microsoft')) || vozesPT[0];
    }
}

// Função para ler um texto específico ao passar o mouse
function lerTexto(texto) {
    // Para qualquer leitura que esteja rodando no momento para não encavalar as vozes
    pararLeitura();

    if (!texto.trim()) return;

    uttrance = new SpeechSynthesisUtterance(texto);
    uttrance.lang = 'pt-BR';

    // Pega o gênero de voz selecionado no HTML
    const seletorVoz = document.getElementById('seletor-voz');
    const generoSelecionado = seletorVoz ? seletorVoz.value : 'feminina';
    const vozSelecionada = obterVoz(generoSelecionado);
    
    if (vozSelecionada) {
        uttrance.voice = vozSelecionada;
    }

    synth.speak(uttrance);
}

// Para a leitura imediatamente
function pararLeitura() {
    if (synth.speaking) {
        synth.cancel();
    }
}

// Adiciona os eventos de "ouvir ao passar o mouse" nos elementos de texto da página
function configurarLeituraPorMouse() {
    // Seleciona títulos, links do menu, títulos dos cards e descrições dos cards
    const elementosLeitura = document.querySelectorAll('.titulo-central, .nav-menu a, .card-info h3, .card-info p, .direitos');

    elementosLeitura.forEach(elemento => {
        // Quando o mouse entra no elemento, ele fala o texto correspondente
        elemento.addEventListener('mouseenter', () => {
            lerTexto(elemento.innerText);
        });

        // Quando o mouse sai, a leitura é interrompida para dar espaço ao próximo
        elemento.addEventListener('mouseleave', () => {
            pararLeitura();
        });
    });
}

// Garante o carregamento das vozes e inicializa os eventos de mouse
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
        obterVoz('feminina');
        configurarLeituraPorMouse();
    };
} else {
    // Caso o navegador não precise do evento onvoiceschanged
    document.addEventListener('DOMContentLoaded', configurarLeituraPorMouse);
}

// ==========================================
// 4. FUNÇÃO DO TEMA (CLAREAR / ESCURECER TELA)
// ==========================================
// Adiciona ou remove a classe 'modo-claro' no body para alterar todo o visual
function mudarTema(tema) {
    document.body.classList.toggle('modo-claro', tema === 'claro');
}