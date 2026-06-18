let questoes = [];
let questoesEmbaralhadas = [];

let indiceAtual = 0;
let respostaSelecionada = null;
let acertos = 0;

const perguntaEl = document.getElementById("pergunta");
const alternativasEl = document.getElementById("alternativas");
const btnProxima = document.getElementById("btnProxima");

async function carregarQuestoes() {

    try {

        const resposta = await fetch("./data/questoes.json");

        if (!resposta.ok) {
            throw new Error("Erro ao carregar questões.");
        }

        questoes = await resposta.json();

        questoesEmbaralhadas =
            [...questoes]
                .sort(() => Math.random() - 0.5)
                .slice(0, 20);

        carregarQuestao();

    } catch (erro) {

        perguntaEl.textContent =
            "Erro ao carregar as questões.";

        console.error(erro);
    }
}

function carregarQuestao() {

    const questao = questoesEmbaralhadas[indiceAtual];

    perguntaEl.textContent =
        `${indiceAtual + 1}. ${questao.pergunta}`;

    alternativasEl.innerHTML = "";

    respostaSelecionada = null;

    questao.alternativas.forEach((alternativa, indice) => {

        const btn = document.createElement("button");

        btn.classList.add("alternativa");
        btn.textContent = alternativa;

        btn.addEventListener("click", () => {

            document
                .querySelectorAll(".alternativa")
                .forEach(botao =>
                    botao.classList.remove("selecionada")
                );

            btn.classList.add("selecionada");

            respostaSelecionada = indice;
        });

        alternativasEl.appendChild(btn);
    });
}

function reiniciarSimulado() {
    indiceAtual = 0;
    acertos = 0;
    respostaSelecionada = null;

    carregarQuestao();
}

btnProxima.addEventListener("click", () => {

    if (respostaSelecionada === null) {
        alert("Selecione uma resposta.");
        return;
    }

    if (
        respostaSelecionada ===
        questoesEmbaralhadas[indiceAtual].correta
    ) {
        acertos++;
    }

    indiceAtual++;

    if (indiceAtual >= questoesEmbaralhadas.length) {

        document.querySelector(".card").innerHTML = `
        <h2>Simulado Finalizado!</h2>

        <br>

        <p>
            Você acertou ${acertos} de ${questoesEmbaralhadas.length} questões.
        </p>

        <br>

        <button id="btnRecomecar">
            Refazer Simulado
        </button>
    `;

        document
            .getElementById("btnRecomecar")
            .addEventListener("click", () => {
                location.reload();
            });

        return;
    }
    carregarQuestao();
});

// ====================
// CRONÔMETRO
// ====================

let tempo = 30 * 60;

const timerEl = document.getElementById("timer");

const cronometro = setInterval(() => {

    tempo--;

    const minutos = Math.floor(tempo / 60);
    const segundos = tempo % 60;

    timerEl.textContent =
        `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;

    if (tempo <= 0) {

        clearInterval(cronometro);

        alert("Tempo encerrado!");

        location.reload();
    }

}, 1000);

// Inicia carregamento
carregarQuestoes();
