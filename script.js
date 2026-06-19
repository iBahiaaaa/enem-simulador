// inicio do arquivo

let questoes = [];
let questoesEmbaralhadas = [];
let respostasUsuario = [];

let indiceAtual = 0;
let respostaSelecionada = null;
let acertos = 0;

const perguntaEl = document.getElementById("pergunta");
const alternativasEl = document.getElementById("alternativas");
const btnProxima = document.getElementById("btnProxima");

async function carregarQuestoes() {

    const materia =
        localStorage.getItem("materiaSelecionada");

    if (!materia) {
        window.location.href = "index.html";
        return;
    }

    try {

        const resposta = await fetch(
            `./data/${materia}.json`
        );

        if (!resposta.ok) {
            throw new Error("Erro ao carregar questões.");
        }

        questoes = await resposta.json();

        if (questoes.length === 0) {

            document.querySelector(".card").innerHTML = `
                <h2>Sem questões cadastradas</h2>

                <br>

                <p>
                    Ainda não existem questões para esta matéria.
                </p>
            `;

            return;
        }

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

    respostasUsuario[indiceAtual] = respostaSelecionada;

    if (
        respostaSelecionada ===
        questoesEmbaralhadas[indiceAtual].correta
    ) {
        acertos++;
    }

    indiceAtual++;

    if (indiceAtual >= questoesEmbaralhadas.length) {

        clearInterval(cronometro);

        let relatorioErros = "";

        const letras = ["A", "B", "C", "D", "E"];

        questoesEmbaralhadas.forEach((questao, indice) => {

            const respostaUsuario = respostasUsuario[indice];

            if (respostaUsuario !== questao.correta) {

                relatorioErros += `
            <div class="erro-item">

                <p>
                    <strong>Questão ${indice + 1}</strong>
                </p>

                <p>
                    ${questao.pergunta}
                </p>

                <br>

                <p class="resposta-errada">
                    ❌ Sua resposta:
                    ${letras[respostaUsuario]}) ${questao.alternativas[respostaUsuario]}
                </p>

                <p class="resposta-correta">
                    ✅ Resposta correta:
                    ${letras[questao.correta]}) ${questao.alternativas[questao.correta]}
                </p>

                <hr>

            </div>
        `;
            }
        });

        document.querySelector(".card").innerHTML = `
            <h2 class="resultado-titulo">
                Simulado Finalizado!
            </h2>

            <p class="resultado-acertos">
                Você acertou ${acertos} de ${questoesEmbaralhadas.length} questões.
            </p>

            <p class="resultado-percentual">
                ${Math.round((acertos / questoesEmbaralhadas.length) * 100)}%
            </p>

            <h3 class="resultado-subtitulo">
                Questões Erradas
            </h3>

            <div id="relatorioRespostas" style="display:none;">
                <h3 class="resultado-subtitulo">
                    Questões Erradas
                </h3>

                ${relatorioErros || "<p>Parabéns! Você não errou nenhuma questão.</p>"}
            </div>

            <button id="btnMostrarRespostas">
                Ver respostas
            </button>

            <br><br>

            <button id="btnRecomecar">
                Refazer Simulado
            </button>
        `;

        document
            .getElementById("btnRecomecar")
            .addEventListener("click", () => {
                location.reload();
            });

        document
            .getElementById("btnMostrarRespostas")
            .addEventListener("click", () => {

                const relatorio =
                    document.getElementById("relatorioRespostas");

                const botao =
                    document.getElementById("btnMostrarRespostas");

                if (relatorio.style.display === "none") {

                    relatorio.style.display = "block";
                    botao.textContent = "Ocultar respostas";

                } else {

                    relatorio.style.display = "none";
                    botao.textContent = "Ver respostas";
                }
            });

        return;
    }
    carregarQuestao();
});

// ====================
// TEMPO
// ====================

let tempo = 0;
let pausado = false;

const timerEl = document.getElementById("timer");

const cronometro = setInterval(() => {

    if (pausado) {
        return;
    }

    tempo++;

    const horas = Math.floor(tempo / 3600);
    const minutos = Math.floor((tempo % 3600) / 60);
    const segundos = tempo % 60;

    timerEl.textContent =
        `${String(horas).padStart(2, "0")}:` +
        `${String(minutos).padStart(2, "0")}:` +
        `${String(segundos).padStart(2, "0")}`;

}, 1000);

document
    .getElementById("btnPause")
    .addEventListener("click", () => {

        pausado = !pausado;

        const btn =
            document.getElementById("btnPause");

        btn.textContent =
            pausado
                ? "▶ Continuar"
                : "⏸ Pausar";
    });
// Inicia carregamento
carregarQuestoes();

// fim do arquivo
