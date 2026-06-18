// ============================
// GERENCIAMENTO DE PERGUNTAS
// ============================

// Carregar perguntas do localStorage
function carregarPerguntas() {
    const dados = localStorage.getItem('questoes');
    return dados ? JSON.parse(dados) : [];
}

// Salvar perguntas no localStorage
function salvarPerguntas(questoes) {
    localStorage.setItem('questoes', JSON.stringify(questoes));
}

// Renderizar lista de perguntas
function renderizarPerguntas() {
    const questoes = carregarPerguntas();
    const listaEl = document.getElementById('listaPerguntas');
    
    if (questoes.length === 0) {
        listaEl.innerHTML = '<p style="color: #999;">Nenhuma pergunta cadastrada ainda.</p>';
        return;
    }

    listaEl.innerHTML = questoes.map((q, index) => `
        <div class="pergunta-item">
            <div class="pergunta-content">
                <h3>${index + 1}. ${q.pergunta}</h3>
                <div class="alternativas-list">
                    ${q.alternativas.map((alt, i) => `
                        <div class="alt-item ${i === q.correta ? 'correta' : ''}">
                            <strong>${String.fromCharCode(65 + i)}.</strong> ${alt}
                            ${i === q.correta ? '<span class="badge">✓ Correta</span>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="pergunta-actions">
                <button class="btn-editar" onclick="editarPergunta(${index})">✏️ Editar</button>
                <button class="btn-deletar" onclick="deletarPergunta(${index})">🗑️ Deletar</button>
            </div>
        </div>
    `).join('');
}

// Adicionar nova pergunta
document.getElementById('formPergunta').addEventListener('submit', (e) => {
    e.preventDefault();

    const novaPergunta = {
        pergunta: document.getElementById('inputPergunta').value,
        alternativas: [
            document.getElementById('alt1').value,
            document.getElementById('alt2').value,
            document.getElementById('alt3').value,
            document.getElementById('alt4').value
        ],
        correta: parseInt(document.getElementById('inputCorreta').value)
    };

    const questoes = carregarPerguntas();
    questoes.push(novaPergunta);
    salvarPerguntas(questoes);

    // Limpar formulário
    document.getElementById('formPergunta').reset();

    // Atualizar lista
    renderizarPerguntas();

    alert('✅ Pergunta adicionada com sucesso!');
});

// Deletar pergunta
function deletarPergunta(index) {
    if (confirm('Tem certeza que deseja deletar esta pergunta?')) {
        let questoes = carregarPerguntas();
        questoes.splice(index, 1);
        salvarPerguntas(questoes);
        renderizarPerguntas();
        alert('❌ Pergunta deletada!');
    }
}

// Editar pergunta
function editarPergunta(index) {
    const questoes = carregarPerguntas();
    const q = questoes[index];

    // Preencher formulário com dados da pergunta
    document.getElementById('inputPergunta').value = q.pergunta;
    document.getElementById('alt1').value = q.alternativas[0];
    document.getElementById('alt2').value = q.alternativas[1];
    document.getElementById('alt3').value = q.alternativas[2];
    document.getElementById('alt4').value = q.alternativas[3];
    document.getElementById('inputCorreta').value = q.correta;

    // Deletar a pergunta antiga
    questoes.splice(index, 1);
    salvarPerguntas(questoes);
    renderizarPerguntas();

    // Scroll para o formulário
    document.getElementById('inputPergunta').focus();
    alert('📝 Pergunta carregada para edição. Faça as alterações e clique em "Adicionar Pergunta" novamente.');
}

// ============================
// SISTEMA DE ABAS
// ============================

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');

        // Remover classe active de todas as abas
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));

        // Adicionar classe active à aba selecionada
        btn.classList.add('active');
        document.getElementById(tabName).classList.add('active');

        // Se for a aba admin, carregar perguntas
        if (tabName === 'admin') {
            renderizarPerguntas();
        }
    });
});

// ============================
// SINCRONIZAR COM ARQUIVO JSON
// ============================

async function sincronizarComJSON() {
    try {
        // Carregar perguntas do arquivo JSON
        const response = await fetch('./data/questoes.json');
        if (response.ok) {
            const questoesJSON = await response.json();
            const questoesLocal = carregarPerguntas();

            // Se localStorage está vazio, carregar do JSON
            if (questoesLocal.length === 0) {
                salvarPerguntas(questoesJSON);
                console.log('✅ Perguntas carregadas do arquivo JSON');
            }
        }
    } catch (erro) {
        console.error('Erro ao sincronizar:', erro);
    }
}

// Chamar sincronização ao carregar página
window.addEventListener('load', sincronizarComJSON);
