# Massa & Molho

Projeto de receitas e cardápio de pizzas. A proposta é apresentar ingredientes, tempo de preparo, dificuldade e modo de preparo de cada receita — e, se a fome não esperar, permitir pedir a mesma pizza direto do cardápio.

## Status

O projeto está em desenvolvimento ativo. No momento:

- o catálogo está em `backend/pizzas.json`, com 8 pizzas distintas;
- o frontend lista o cardápio, abre o detalhe da receita em um modal acessível e oferece dois caminhos: **Iniciar preparo** (modo cozinha com cronômetro e passo a passo) e **Pedir pizza** (escolha de tamanho e borda com total calculado);
- as ilustrações das pizzas são SVGs desenhados à mão em `frontend/js/illustrations.js`;
- ainda não há API, banco de dados ou persistência de pedidos.

## Tecnologias

- HTML5
- CSS3
- JavaScript vanilla
- JSON como fonte de dados

## Estrutura do projeto

```text
.
├── backend/
│   └── pizzas.json              # Dados das receitas e do cardápio
├── frontend/
│   ├── assets/                  # Logo e favicon
│   ├── css/style.css            # Estilos da interface
│   ├── js/
│   │   ├── illustrations.js     # Biblioteca de ilustrações SVG
│   │   └── main.js              # Cardápio, modal, preparo e pedido
│   ├── index.html               # Página principal
│   └── README.md                # Documentação específica do frontend
└── README.md
```

## Como executar

O frontend é formado por arquivos estáticos e consome `backend/pizzas.json` por caminho relativo. Por isso, sirva o projeto a partir da **raiz do repositório**:

1. Clone o repositório e entre na pasta do projeto.
2. Inicie um servidor local na raiz:

```bash
python3 -m http.server 8000
```

3. Acesse [http://localhost:8000/frontend/](http://localhost:8000/frontend/).

Servir a partir da raiz é necessário porque o frontend busca `../backend/pizzas.json`. Também é possível abrir `frontend/index.html` diretamente, mas o navegador bloqueia a leitura do JSON em arquivos locais; nesse caso use o servidor.

## Dados das receitas

O arquivo [`backend/pizzas.json`](backend/pizzas.json) contém, entre outros campos:

- informações gerais da pizza (`nome`, `descricao`, `categoria`, `disponivelParaEntrega`);
- `ilustracao`: token que seleciona o SVG em `frontend/js/illustrations.js`;
- `receita`: tempo, dificuldade, rendimento, calorias, ingredientes e modo de preparo;
- `cardapioPizzaria`: tamanhos, preços e opções de borda.

## Próximos passos

- adicionar filtros por categoria e dificuldade;
- criar uma API para substituir o arquivo local;
- persistir pedidos e integrar com banco de dados;
- adicionar testes e documentação de contribuição.

## Frontend

Consulte o [README do frontend](frontend/README.md) para detalhes sobre a interface, arquivos e desenvolvimento local.
