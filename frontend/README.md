# Frontend - Massa & Molho

Interface web do Massa & Molho, um catálogo de receitas e opções de cardápio de pizzas.

## Status atual

O frontend está na etapa inicial de estruturação. A página principal já possui metadados básicos, favicon e referência ao arquivo de estilos, enquanto a interface visual e os scripts de interação ainda serão desenvolvidos.

## Tecnologias

- HTML5
- CSS3
- JavaScript vanilla (a implementar)

Não há dependências ou gerenciador de pacotes configurados atualmente.

## Estrutura

```text
frontend/
├── assets/
│   ├── favicon/pizza.png
│   └── logo/massa&molho-logo.png
├── css/
│   └── style.css
├── js/
└── index.html
```

## Executar localmente

A partir da raiz do projeto, inicie um servidor HTTP simples:

```bash
python3 -m http.server 8000 --directory frontend
```

Depois, acesse [http://localhost:8000](http://localhost:8000).

Para visualizar apenas a estrutura atual, também é possível abrir `index.html` diretamente no navegador. O servidor local é a opção recomendada para as próximas integrações com dados e scripts.

## Dados

O catálogo inicial está em [`../backend/pizzas.json`](../backend/pizzas.json). Ele ainda não é consumido automaticamente pelo frontend; a integração será adicionada junto com a camada JavaScript ou uma API.

## Diretrizes de desenvolvimento

- manter a estrutura sem framework enquanto ela atender ao projeto;
- separar marcação, estilos e comportamento em seus diretórios;
- priorizar layout responsivo para celular e desktop;
- reutilizar as variáveis de cor já definidas em `css/style.css`;
- evitar adicionar dependências sem atualizar a documentação e a configuração do projeto.