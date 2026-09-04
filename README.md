# Teste Prático — Desenvolvedor(a) Pleno Front-end / React

Aplicação web para gerenciamento de produtos, desenvolvida como parte de um teste técnico para avaliação de conhecimentos em React, TypeScript, integração com API, testes automatizados e organização de código.

## Tecnologias

* React
* TypeScript
* Vite
* React Router DOM
* CSS
* JSON Server
* Vitest
* React Testing Library
* ESLint

## Funcionalidades

### Listagem de produtos

* Exibição dos produtos em cards responsivos
* Busca por nome
* Filtro por categoria
* Paginação real através da API
* Carregamento incremental com `IntersectionObserver`
* Exibição do total de produtos encontrados
* Estados de carregamento
* Tratamento de erros
* Estado para lista vazia ou nenhum resultado
* Persistência da listagem durante a navegação
* Restauração da posição do scroll

### Detalhes do produto

* Consulta de produto por ID
* Exibição das principais informações
* Identificação do status do produto
* Navegação para edição
* Exclusão com confirmação

### Cadastro e edição

* Cadastro de novos produtos
* Edição de produtos existentes
* Validação dos campos
* Nome obrigatório com mínimo de 3 caracteres
* Categoria obrigatória
* Preço maior que zero
* Estoque maior ou igual a zero
* Feedback visual de sucesso e erro

### Testes automatizados

* Testes unitários e de componentes com Vitest
* Testes de interação com React Testing Library
* Cobertura dos principais fluxos da aplicação
* Testes de listagem de produtos
* Testes de detalhes e exclusão
* Testes de cadastro e edição
* Testes do hook `useProducts`
* Testes da camada de serviços
* Teste do componente de confirmação de exclusão

A cobertura atual do projeto é de aproximadamente:

* **74,14%** de Statements
* **58,01%** de Branches
* **75,40%** de Functions
* **73,97%** de Lines

## Estrutura do projeto

```text
.
├── README.md
├── coverage
│   ├── base.css
│   ├── block-navigation.js
│   ├── clover.xml
│   ├── components
│   │   └── ConfirmDeleteModal
│   │       ├── ConfirmDeleteModal.css.html
│   │       ├── ConfirmDeleteModal.tsx.html
│   │       └── index.html
│   ├── coverage-final.json
│   ├── favicon.png
│   ├── hooks
│   │   ├── index.html
│   │   └── useProducts.ts.html
│   ├── index.html
│   ├── pages
│   │   ├── ProductDetailsPage
│   │   │   ├── ProductDetailsPage.css.html
│   │   │   ├── ProductDetailsPage.tsx.html
│   │   │   └── index.html
│   │   ├── ProductFormPage
│   │   │   ├── ProductFormPage.css.html
│   │   │   ├── ProductFormPage.tsx.html
│   │   │   └── index.html
│   │   └── ProductsPage
│   │       ├── ProductsPage.css.html
│   │       ├── ProductsPage.tsx.html
│   │       └── index.html
│   ├── prettify.css
│   ├── prettify.js
│   ├── services
│   │   ├── index.html
│   │   └── productService.ts.html
│   ├── sort-arrow-sprite.png
│   └── sorter.js
├── db.json
├── dist
│   ├── assets
│   │   ├── index-BqnbJyd7.js
│   │   └── index-DMrxRT5F.css
│   └── index.html
├── eslint.config.js
├── estrutura.txt
├── index.html
├── instrucoes-teste-pratico.txt
├── package-lock.json
├── package.json
├── src
│   ├── App.tsx
│   ├── components
│   │   └── ConfirmDeleteModal
│   │       ├── ConfirmDeleteModal.css
│   │       ├── ConfirmDeleteModal.test.tsx
│   │       └── ConfirmDeleteModal.tsx
│   ├── hooks
│   │   ├── useProducts.test.tsx
│   │   └── useProducts.ts
│   ├── index.css
│   ├── main.tsx
│   ├── pages
│   │   ├── ProductDetailsPage
│   │   │   ├── ProductDetailsPage.css
│   │   │   ├── ProductDetailsPage.test.tsx
│   │   │   └── ProductDetailsPage.tsx
│   │   ├── ProductFormPage
│   │   │   ├── ProductFormPage.css
│   │   │   ├── ProductFormPage.test.tsx
│   │   │   └── ProductFormPage.tsx
│   │   └── ProductsPage
│   │       ├── ProductsPage.css
│   │       ├── ProductsPage.test.tsx
│   │       └── ProductsPage.tsx
│   ├── services
│   │   ├── productService.test.ts
│   │   └── productService.ts
│   ├── test
│   │   └── setup.ts
│   └── types
│       ├── components
│       │   └── confirmDeleteModal.ts
│       └── product.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```

A comunicação com a API é centralizada em `productService.ts`, enquanto a lógica da listagem de produtos é isolada no hook `useProducts`.

## Como executar

### Pré-requisitos

* Node.js
* npm

### Instalação

Dentro da pasta `React`, execute:

```bash
npm install
```

### Iniciar a API

Em um terminal:

```bash
npx json-server@0.17.4 --watch db.json --port 3001
```

A API ficará disponível em:

```text
http://localhost:3001
```

O endpoint utilizado pela aplicação é:

```text
http://localhost:3001/produtos
```

### Iniciar a aplicação

Em outro terminal, dentro da pasta `React`:

```bash
npm run dev
```

A aplicação estará disponível no endereço informado pelo Vite no terminal, normalmente:

```text
http://localhost:5173
```

## Testes

Para executar os testes:

```bash
npm run test
```

Para executar os testes com cobertura de código:

```bash
npm run cov
```

O relatório de cobertura é gerado na pasta `coverage`.

## Rotas

| Rota                   | Descrição            |
| ---------------------- | -------------------- |
| `/produtos`            | Listagem de produtos |
| `/produtos/novo`       | Cadastro de produto  |
| `/produtos/:id`        | Detalhes do produto  |
| `/produtos/:id/editar` | Edição de produto    |

## API

A aplicação utiliza JSON Server como API local.

Operações utilizadas:

* `GET /produtos`
* `GET /produtos/:id`
* `POST /produtos`
* `PUT /produtos/:id`
* `DELETE /produtos/:id`

A listagem utiliza os recursos de paginação e filtros disponibilizados pelo JSON Server.

## Validações

Os seguintes campos possuem validação no formulário:

| Campo     | Regra                                |
| --------- | ------------------------------------ |
| Nome      | Obrigatório e mínimo de 3 caracteres |
| Categoria | Obrigatória                          |
| Preço     | Obrigatório e maior que zero         |
| Estoque   | Obrigatório e maior ou igual a zero  |
| Ativo     | Define a disponibilidade do produto  |

## Scripts disponíveis

| Comando           | Descrição                             |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento  |
| `npm run build`   | Gera o build de produção              |
| `npm run lint`    | Executa a análise estática do código  |
| `npm run test`    | Executa os testes automatizados       |
| `npm run cov`     | Executa os testes com cobertura       |
| `npm run preview` | Inicia o preview do build de produção |

## Observações

O projeto foi desenvolvido priorizando separação de responsabilidades, tipagem com TypeScript, componentes reutilizáveis, testes automatizados e integração com a API através de uma camada de serviço dedicada.
