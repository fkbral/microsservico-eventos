# Microserviço de Eventos

Este projeto é dedicado ao gerenciamento e organização de eventos. Construído para oferecer uma solução robusta e eficiente, utiliza Node.js, Express, TypeScript e SQLite para realizar suas operações.

## Início Rápido

1. Clone o repositório.
2. No terminal, execute:

```javascript
npm install
```

```javascript
npm run migrate
```

```javascript
npm run start
```

## Comandos Disponíveis

- `npm start`: Inicia o servidor.
- `npm test`: (A ser implementado)
- `npm migrate`: Cria as tabelas no banco"

## Características Técnicas

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Express**: Framework web para construção de APIs.
- **TypeScript**: Aplicado para tipagem e lógica do servidor.
- **SQLite**: Sistema de banco de dados relacional.

## Detalhes do Packages

- **Nome**: `eventService`
- **Versão**: `1.0.0`
- **Autor**: Raniel Mendonça
- **Licença**: ISC

### Dependências:

- [cors](https://www.npmjs.com/package/cors) - Para lidar com Cross-Origin Resource Sharing.
- [dotenv](https://www.npmjs.com/package/dotenv) - Para carregar variáveis de ambiente.
- [express](https://www.npmjs.com/package/express) - Framework web para construir APIs.
- [sqlite3](https://www.npmjs.com/package/sqlite3) - Driver SQLite para Node.js.

### Dependências de Desenvolvimento:

- [@types/cors](https://www.npmjs.com/package/@types/cors) - Tipos para o pacote cors.
- [@types/express](https://www.npmjs.com/package/@types/express) - Tipos para o pacote express.
- [ts-node-dev](https://www.npmjs.com/package/ts-node-dev) - Ferramenta para desenvolvimento em TypeScript.

## Objetivo do Projeto

O microserviço de eventos foi criado para auxiliar na organização e gestão de eventos de todas as naturezas, seja ele corporativo, social ou educacional. Através deste serviço, os usuários podem criar, editar, deletar e visualizar eventos, garantindo uma gestão eficiente e centralizada.

# Metodologias de teste

## TDD
### O que é? 
  - Em inglês seria Test Driven Development, ou desenvolvimento orientado a testes
### Como? 
  - Ao precisarmos desenvolver uma funcionalidade nova, iremos primeiro implementá-la direto em nossos testes
### Por quê?
  - Teríamos desde o começo testes para nossas funcionalidades, ou seja, não "arriscaremos" desenovolver algo sem testes

## SOLID
### O que é? 
  - Conjunto de práticas para produzir um código mais legível/limpo

## Injeção de dependências
1. Instalar alguma biblioteca injetora de dependências (por exemplo, o tsyringe)
2. Garantir que nossos controllers sejam classes, caso contrário, teremos que convertê-los
  1. Se estivermos usando tsyringe, temos que adicionar os decorators correspondentes na classes para injetar as dependências corretas
3. Fazer um arquivo com registro de dependências (por exemplo: src/dependency_injection/index.ts)
  1. Esse arquivo deve registrar os serviços da nossa aplicação (alguma API externa que não foi desenvolvida na nossa aplicação) e os repositórios p/ interagir com banco de dados
  2. Se estiver com tsyringe, registro será feito utilizando container.register() ou container.registerSingleton()
4. No arquivo principal de nossa aplicação, devemos importar o arquivo com o registro da injeção de dependências (por exemplo: src/app.ts)
  1. Se estiver usando tsyringe, devemos também instalar a biblioteca "reflect-metadata" e importá-la na primeira linha do arquivo principal da aplicação
5. Ao instanciar nossos controllers e use cases, em vez de usar new, utilizar container.resolve()