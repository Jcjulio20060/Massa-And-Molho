# Massa & Molho

Projeto de receitas e cardápio de pizzas. A proposta é apresentar ingredientes, tempo de preparo, dificuldade e modo de preparo de cada receita, com espaço para futuramente integrar pedidos e uma API.

## Status

O projeto está em desenvolvimento. No momento:

- o catálogo inicial está em `backend/pizzas.json`;
- o frontend possui a estrutura inicial em HTML e CSS;
- ainda não há uma API, banco de dados ou lógica JavaScript implementados.

## Tecnologias

- HTML5
- CSS3
- JavaScript vanilla (planejado)
- JSON como fonte de dados inicial

## Estrutura do projeto

```text
.
├── backend/
│   └── pizzas.json       # Dados das receitas e do cardápio
├── frontend/
│   ├── assets/           # Logo e favicon
│   ├── css/style.css     # Estilos da interface
│   ├── js/               # Scripts do frontend
│   ├── index.html        # Página principal
│   └── README.md         # Documentação específica do frontend
└── README.md
```

## Como executar

Como o frontend é formado por arquivos estáticos, não é necessário instalar dependências neste momento.

1. Clone o repositório e entre na pasta do projeto.
2. Inicie um servidor local apontando para o frontend:

```bash
python3 -m http.server 8000 --directory frontend
```

3. Acesse [http://localhost:8000](http://localhost:8000) no navegador.

Também é possível abrir `frontend/index.html` diretamente, mas um servidor local é recomendado para evitar limitações do navegador com arquivos locais e preparar a integração futura com dados.

## Dados das receitas

O arquivo [`backend/pizzas.json`](backend/pizzas.json) contém, entre outros campos:

- informações gerais da pizza;
- imagem, categoria e disponibilidade para entrega;
- tempo, dificuldade, rendimento e calorias aproximadas;
- ingredientes e etapas do modo de preparo;
- tamanhos, preços e opções de borda.

## Próximos passos

- construir a listagem e os detalhes das receitas no frontend;
- carregar as receitas a partir do arquivo JSON;
- adicionar filtros por categoria e dificuldade;
- criar uma API para substituir o arquivo local;
- implementar fluxo de pedido e integração com banco de dados;
- adicionar testes e documentação de contribuição.

## Frontend

Consulte o [README do frontend](frontend/README.md) para detalhes sobre a interface, arquivos e desenvolvimento local.

