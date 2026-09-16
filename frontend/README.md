# Frontend - Massa & Molho

Interface web do Massa & Molho, um catálogo de receitas e cardápio de pizzas com pedido integrado.

## Status atual

O frontend está funcional e sem framework:

- lista as pizzas de `../backend/pizzas.json` em uma grade de cards;
- abre um modal acessível com ingredientes, modo de preparo e preços;
- **Iniciar preparo**: modo cozinha com cronômetro baseado em `tempoPreparoMinutos` e passo a passo navegável;
- **Pedir pizza**: escolha de tamanho e borda, com total calculado e confirmação do pedido (simulada no frontend).

## Tecnologias

- HTML5
- CSS3
- JavaScript vanilla (sem build)

### Fontes

A identidade usa fontes do Google Fonts, carregadas em `index.html`:

- **Fraunces** (display);
- **Newsreader** (texto corrido);
- **Karla** (dados, selos e rótulos).

## Estrutura

```text
frontend/
├── assets/
│   ├── favicon/pizza.png
│   └── logo/massa&molho-logo.png
├── css/
│   └── style.css
├── js/
│   ├── illustrations.js   # SVGs desenhados à mão por pizza
│   └── main.js            # render, modal, preparo e pedido
├── index.html
└── README.md
```

## Executar localmente

A partir da **raiz do projeto**, inicie um servidor HTTP simples:

```bash
python3 -m http.server 8000
```

Depois, acesse [http://localhost:8000/frontend/](http://localhost:8000/frontend/).

O servidor precisa rodar na raiz porque o script busca `../backend/pizzas.json`. Abrir o `index.html` direto no navegador não carrega o JSON por restrição de arquivos locais.

## Dados

O catálogo está em [`../backend/pizzas.json`](../backend/pizzas.json). Cada pizza aponta para uma ilustração pelo campo `ilustracao`, que corresponde a uma função em `js/illustrations.js`. Para adicionar uma pizza:

1. inclua um objeto no JSON com um `ilustracao` existente (ou crie um novo SVG na biblioteca);
2. mantenha `receita` e `cardapioPizzaria` preenchidos.

## Diretrizes de desenvolvimento

- manter a estrutura sem framework enquanto ela atender ao projeto;
- separar marcação, estilos e comportamento em seus diretórios;
- priorizar layout responsivo e acessibilidade (foco visível, `aria-modal`, trap de foco, respeito a `prefers-reduced-motion`);
- reutilizar as variáveis de cor e tipografia definidas em `css/style.css`;
- atualizar esta documentação ao adicionar dependências.
