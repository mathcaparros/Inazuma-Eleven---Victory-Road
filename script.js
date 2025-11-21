let cardContainer = document.querySelector(".card-container");
let campoBusca = document.querySelector(".search-input"); // Usando a classe específica do input
let botaoBusca = document.querySelector("#botao-busca");
let dados = [];

// Função para carregar os dados iniciais do JSON
async function carregarDados() {
    try {
        let resposta = await fetch("data.json");
        dados = await resposta.json();
        renderizarCards(dados); // Renderiza todos os cards inicialmente
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
        let article = document.createElement("article");
        article.innerHTML = `
        <h2>${dado.nome}</h2>
        <p><strong>${dado.subtitulo}</strong></p> <!-- Corrigido: usando 'subtitulo' que existe no JSON -->
        <p>${dado.descricao.replace(/\n/g, '<br>')}</p> <!-- Mantém as quebras de linha -->
        <a href="${dado.link}" target="_blank">Veja mais</a>
        `
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