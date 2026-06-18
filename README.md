# Simulado ENEM

Um simulador de questões do ENEM desenvolvido com HTML, CSS e JavaScript.

## 🎯 Funcionalidades

- ✅ Carregamento dinâmico de questões
- ⏱️ Cronômetro de 30 minutos
- 📊 Contagem de acertos
- 🎨 Interface responsiva e intuitiva
- 🔄 Opção de refazer o simulado

## 📁 Estrutura do Projeto

```
enem-simulador/
├── index.html          # Arquivo HTML principal
├── script.js           # Lógica do simulado
├── style.css           # Estilos da interface
├── data/
│   └── questoes.json   # Base de questões
└── README.md           # Este arquivo
```

## 🚀 Como Usar

1. Abra o arquivo `index.html` em um navegador
2. O simulado carregará automaticamente com as questões
3. Selecione uma alternativa e clique em "Próxima"
4. Ao final, você verá quantas questões acertou
5. Clique em "Refazer Simulado" para começar novamente

## 📝 Adicionando Novas Questões

Edite o arquivo `data/questoes.json` e adicione questões no seguinte formato:

```json
{
  "pergunta": "Sua pergunta aqui?",
  "alternativas": ["Opção A", "Opção B", "Opção C", "Opção D"],
  "correta": 0
}
```

**Nota:** O índice `correta` começa em 0 (0 = primeira opção, 1 = segunda opção, etc.)

## 🎨 Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)

## 📄 Licença

Projeto pessoal - Uso livre

---

**Última atualização:** 18 de junho de 2026
