# Teste Prático — Desenvolvedor(a) Pleno Front-end / React

Aplicação web para gerenciamento de produtos, desenvolvida como parte de um teste técnico para avaliação de conhecimentos em React, TypeScript, integração com API e organização de código.

## Tecnologias

* React
* TypeScript
* Vite
* React Router DOM
* CSS
* JSON Server
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

## Estrutura do projeto

```text
.
├── db.json
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
│   │       └── ConfirmDeleteModal.tsx
│   ├── hooks
│   │   └── useProducts.ts
│   ├── index.css
│   ├── main.tsx
│   ├── pages
│   │   ├── ProductDetailsPage
│   │   │   ├── ProductDetailsPage.css
│   │   │   └── ProductDetailsPage.tsx
│   │   ├── ProductFormPage
│   │   │   ├── ProductFormPage.css
│   │   │   └── ProductFormPage.tsx
│   │   └── ProductsPage
│   │       ├── ProductsPage.css
│   │       └── ProductsPage.tsx
│   ├── services
│   │   └── productService.ts
│   └── types
│       ├── components
│       │   └── confirmDeleteModal.ts
│       └── product.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

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

## Observações

O projeto foi desenvolvido priorizando separação de responsabilidades, tipagem com TypeScript, componentes reutilizáveis e integração com a API através de uma camada de serviço dedicada.
