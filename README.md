# RESTful API com Prisma, TypeScript, Node.js e Express

Este é o trabalho da disciplina XPAD04 - Banco de Dados NoSQL.

Grupo:

- Augusto Benteu Pombo da Silva - 2021004865
- Gianluca Borges Mendes - 20210232402
- Huandy Calini de Camargo Silva - 2022004823
- Luis Eduardo Damasceno - 2022010320

---

## **Recursos**

- 🚀 **Node.js**: Ambiente de execução para JavaScript.
- 🎨 **TypeScript**: Fornece tipagem estática opcional para JavaScript.
- 🛠️ **Express**: Framework minimalista para criação de servidores web.
- 📊 **Prisma**: ORM moderno para interação com bancos de dados.

---

## **Requisitos**

- **Node.js** (v16 ou superior)
- **npm** (v7 ou superior)
- Banco de dados PostgreSQL configurado

---

## **Instalação**

1. Clone o repositório:

```bash
  git clone https://github.com/GianlucaBorges/BD-NoSQL.git
  cd BD-NoSQL
```

2. Instale as dependências:

```bash
  npm install
```

3. Crie um arquivo `.env` na raiz do projeto com as variáveis de ambiente presentes no arquivo `.env.example`.

4. Execute o comando para criar as tabelas no banco de dados:

```bash
  npx prisma generate --schema ./prisma/schemaMongo.prisma
  npx prisma generate --schema ./prisma/schemaCockroach.prisma
```

O comando para gerar o esquema do CockroachDB irá dar erro enquanto o esquema do banco de dados não for adicionado.

## **Execução**

Para iniciar o servidor, execute o comando:

```bash
npm run dev
```

## **Esquema do Projeto**

```plaintext
├── prisma/
│ ├── schema.prisma # Definição do modelo Prisma
├── src/
│ ├── app.ts # Configuração do servidor Express
│ ├── index.ts # Ponto de entrada da aplicação
│ ├── routes.ts # Definição das rotas da API
├── .env # Variáveis de ambiente
├── package.json # Configurações do projeto e dependências
├── tsconfig.json # Configuração do TypeScript
└── README.md # Documentação do projeto
```
