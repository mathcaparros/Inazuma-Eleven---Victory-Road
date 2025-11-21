let cardContainer = document.querySelector(".card-container");
let campoBusca = document.querySelector(".search-input"); // Usando a classe específica do input
let botaoBusca = document.querySelector("#botao-busca");
let filterButtons = document.querySelectorAll(".filter-btn");
let dados = [];

// Função para carregar os dados iniciais do JSON
async function carregarDados() {
    try {
        let resposta = await fetch("data.json");
        dados = await resposta.json();
        // Renderiza apenas os modos de jogo inicialmente
        renderizarCards(dados.filter(dado => dado.subtitulo));
    } catch (error) {
        console.error("Falha ao buscar dados:", error);
        cardContainer.innerHTML = `<p class="no-results">Erro ao carregar conteúdo.</p>`;
    }
}

// Função que filtra e exibe os cards com base no termo pesquisado
function iniciarBusca() {
    const termoBusca = campoBusca.value.toLowerCase();
    const dadosFiltrados = dados.filter(dado =>
        dado.nome.toLowerCase().includes(termoBusca) // A busca agora é feita apenas no nome.
    );
    renderizarCards(dadosFiltrados);
}

function renderizarCards(dadosParaRenderizar) {
    cardContainer.innerHTML = ""; // Limpa os cards existentes

    // Se não houver resultados, exibe uma mensagem
    if (dadosParaRenderizar.length === 0) {
        cardContainer.innerHTML = `<p class="no-results">Nenhum resultado encontrado.</p>`;
        return;
    }

    for (let dado of dadosParaRenderizar) {
        const article = document.createElement("article");
        
        // Verifica se é um "Modo de Jogo" (que tem subtitulo) ou um "Personagem"
        if (dado.subtitulo) {
            // Template para Modos de Jogo
            article.innerHTML = `
                <h2>${dado.nome}</h2>
                <p><strong>${dado.subtitulo}</strong></p>
                <p>${dado.descricao.replace(/\n/g, '<br>')}</p>
                <a href="${dado.link}" target="_blank">Veja mais</a>
            `;
        } else {
            // Template para Personagens
            article.innerHTML = `
                <h2>${dado.nome}</h2>
                <p><strong>Posição:</strong> ${dado.posicao} | <strong>Elemento:</strong> ${dado.elemento}</p>
                <p>${dado.descricao}</p>
                <p><strong>Técnicas Notáveis:</strong> ${dado.hissatsu_notaveis.join(', ')}</p>
            `;
        }
        cardContainer.appendChild(article);
    }
}

// 1. Carrega os dados assim que a página é aberta
document.addEventListener("DOMContentLoaded", carregarDados);

// 2. Adiciona um "ouvinte" para acionar a busca ao clicar no botão
botaoBusca.addEventListener("click", iniciarBusca);

// 3. (Bônus) Adiciona um "ouvinte" para acionar a busca ao pressionar "Enter"
campoBusca.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        iniciarBusca();
    }
});

// 4. Adiciona um "ouvinte" para cada botão de filtro do novo menu
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        let dadosFiltrados;

        if (filter === 'modos') {
            dadosFiltrados = dados.filter(dado => dado.subtitulo); // Filtra por quem tem subtitulo (modos)
        } else if (filter === 'personagens') {
            dadosFiltrados = dados.filter(dado => !dado.subtitulo); // Filtra por quem não tem subtitulo (personagens)
        } else {
            // Filtra personagens pela posição (Atacante, Goleiro, etc.)
            dadosFiltrados = dados.filter(dado => dado.posicao === filter);
        }
        renderizarCards(dadosFiltrados);
    });
});