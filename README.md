# RecipeHaven

📝 **Visão Geral**

Este projeto é um site de receitas desenvolvido como parte da cadeira de Programação e Integração de Serviços. O site permite aos utilizadores explorar, filtrar e adicionar receitas. A aplicação foi construída com Node.js e Express, utilizando uma arquitetura modular e conectando-se a uma base de dados para gestão de receitas.

🚀 **Funcionalidades Principais**

- **Visualização de Receitas**: Exibe uma lista de receitas, permitindo aos utilizadores explorar diferentes opções culinárias.
- **Filtros Personalizados**: Filtrar receitas por categorias (e.g., sobremesas, pratos principais) e dificuldade.
- **Adicionar Receitas**: Funcionalidade para utilizadores autenticados adicionarem novas receitas à base de dados.
- **Sistema de Autenticação**: Login seguro para gerir receitas pessoais.
- **API Documentada com Swagger**: Interface interativa para explorar os endpoints disponíveis.

⚙️ **Especificações Técnicas**

🛠 **Tecnologias Utilizadas**

- **Backend**: Node.js com Express
- **Base de Dados**: MySQL
- **Documentação da API**: TheMealDB
- **Autenticação**: JWT (JSON Web Token)
- **Gestão de Dependências**: npm

🗂 **Estrutura do Projeto**

![image](https://github.com/user-attachments/assets/d9dee85d-56dc-4e46-91b2-eb09aaed7519)

🔗 **Endpoints Principais**

## Upload
- **POST** `/upload`  
  Faz o upload de uma imagem para o S3.

---

## Receitas
- **GET** `/api/recipes`  
  Retorna todas as receitas.
- **PATCH** `/api/recipes/update/:id`  
  Atualiza campos específicos de uma receita.
- **GET** `/api/recipes/:id`  
  Retorna uma receita pelo ID.
- **GET** `/api/recipes/difficulty/:difficultyId`  
  Retorna receitas por dificuldade.
- **GET** `/api/recipes/category/:categoryId`  
  Retorna receitas por categoria.
- **GET** `/api/recipes/:difficultyId/:categoryId`  
  Retorna receitas por dificuldade e categoria.
- **GET** `/api/recipesByName/:name`  
  Retorna receitas pelo nome.
- **DELETE** `/api/recipes/:id`  
  Remove uma receita pelo ID.
- **POST** `/api/recipe`  
  Adiciona uma nova receita.

---

## Reviews
- **GET** `/api/reviews`  
  Retorna todas as reviews.
- **POST** `/api/reviews`  
  Adiciona uma nova review.
- **DELETE** `/api/reviews/:id`  
  Remove uma review pelo ID.

---

## Utilizadores
- **GET** `/api/users`  
  Retorna todos os utilizadores.
- **GET** `/api/users/:id`  
  Retorna um utilizador pelo ID.
- **POST** `/api/users`  
  Adiciona um novo utilizador.

---

## Listas
- **GET** `/api/lists`  
  Retorna todas as listas.
- **POST** `/api/lists`  
  Adiciona uma nova lista.

---

## Lista de Receitas
- **GET** `/api/recipesList`  
  Retorna todas as listas de receitas.
- **POST** `/api/recipesList`  
  Adiciona uma nova receita a uma lista.
- **DELETE** `/api/recipesList/:id`  
  Remove uma receita de uma lista pelo ID.

---

## Fórum
- **GET** `/api/forum`  
  Retorna todas as postagens do fórum.
- **POST** `/api/forum`  
  Adiciona uma nova postagem no fórum.

🛠 **Instalação**

1. Clone o repositório:
    ```bash
    git clone https://github.com/username/repo-name.git
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Configure as variáveis de ambiente no arquivo `.env`:
    ```env
    DB_HOST=your_database_host
    DB_USER=your_database_user
    DB_PASS=your_database_password
    JWT_SECRET=your_jwt_secret
    ```

4. Inicie o servidor:
    ```bash
    npm start
    ```

👤 **Especificações de Utilizador**

🎯 **Público-Alvo**

- Pessoas interessadas em descobrir novas receitas.
- Utilizadores que desejam guardar e partilhar as suas próprias receitas.

🧭 **Fluxo de Utilização**

- **Página Inicial**: Apresenta uma visão geral das receitas.
- **Explorar Receitas**: Utilizadores podem aplicar filtros e pesquisar receitas específicas.
- **Adicionar Receitas**: Após fazer login, o utilizador pode submeter uma nova receita.
- **Gerir Conta**: Permite o registo e autenticação do utilizador.

💡 **Exemplos de Utilização**

- Procurar uma sobremesa fácil para o jantar.
- Adicionar uma receita especial de família à coleção.
- Explorar receitas de diferentes categorias para planear refeições.

🤝 **Contribuições**

Contribuições são bem-vindas! Por favor, abra um pull request ou issue para sugestões de melhorias.

📜 **Licença**

Este projeto está licenciado sob a MIT License.
