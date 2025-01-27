const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'recipe_haven'
});

async function getRecipes() {
    const query = 'SELECT * FROM recipes';
    const [rows] = await db.execute(query);
    return rows;
}

async function editRecipe(id, field, value) {
    const query = `UPDATE recipes SET ${field} = ? WHERE Id = ?`;
    return await db.query(query, [value, id]);
}

async function getRecipeById(id) {
    const query = `SELECT * FROM recipes WHERE Id = ?`;
    const [rows] = await db.query(query, [id]);
    return rows[0];
}

async function getRecipesByDifficuty(difficultyId) {
    const query = `SELECT * FROM recipes WHERE DifficultyId = ?`;
    const [rows] = await db.query(query, [difficultyId]);
    return rows;
}

async function getRecipesByCategory(categoryId) {
    const query = `SELECT * FROM recipes WHERE CategoryId = ?`;
    const [rows] = await db.query(query, [categoryId]);
    return rows;
}

async function getRecipesByDifficutyAndCategory(difficultyId, categoryId) {
    const query = `SELECT * FROM recipes WHERE DifficultyId = ? AND CategoryId = ?`;
    const [rows] = await db.query(query, [difficultyId, categoryId]);
    return rows;
}

async function getRecipesByName(name) {
    const query = `SELECT * FROM recipes WHERE Name LIKE ?`;
    const [rows] = await db.query(query, [`%${name}%`]);
    return rows;
}

async function getReviews() {
    const query = 'SELECT * FROM reviews';
    const [rows] = await db.execute(query);
    return rows;
}

async function getUsers() {
    const query = 'SELECT * FROM users';
    const [rows] = await db.execute(query);
    return rows;
}

async function getUserById(id) {
    const query = `SELECT * FROM users WHERE Id = ?`;
    return db.query(query, [id]);
}

async function getLists() {
    const query = 'SELECT * FROM lists';
    const [rows] = await db.execute(query);
    return rows;
}

async function getRecipesList() {
    const query = 'SELECT * FROM recipes_lists';
    const [rows] = await db.execute(query);
    return rows;
}

async function getForum() {
    const query = 'SELECT * FROM forum';
    const [rows] = await db.execute(query);
    return rows;
}

async function addReview(reviewData) {
    try {
        const { review, userId, recipeId } = reviewData;

        // Cria a query SQL para inserir uma nova receita
        const query = `INSERT INTO reviews (Review, UserId, RecipeId) VALUES (?, ?, ?)`;

        // Executa a query de forma assíncrona com os valores passados
        const [results] = await db.query(query, [review, userId, recipeId]);

        // Retorna o ID da nova receita inserida
        return { id: results.insertId, ...reviewData };
    } catch (error) {
        console.error('Erro ao adicionar review:', error);
        throw error;
    }
}

async function addlist(listData) {
    try {
        const { userId } = listData;

        // Cria a query SQL para inserir uma nova receita
        const query = `INSERT INTO lists (UserId) VALUES (?)`;

        // Executa a query de forma assíncrona com os valores passados
        const [results] = await db.query(query, [userId]);

        // Retorna o ID da nova receita inserida
        return { id: results.insertId, ...listData };
    } catch (error) {
        console.error('Erro ao criar lista:', error);
        throw error;
    }
}

async function addRecipesList(recipesListData) {
    try {
        const { recipeId, listId } = recipesListData;

        // Cria a query SQL para inserir uma nova receita
        const query = `INSERT INTO recipes_lists (RecipeId, ListId) VALUES (?, ?)`;

        // Executa a query de forma assíncrona com os valores passados
        const [results] = await db.query(query, [recipeId, listId]);

        // Retorna o ID da nova receita inserida
        return { id: results.insertId, ...recipesListData };
    } catch (error) {
        console.error('Erro ao adicionar recipesList:', error);
        throw error;
    }
}

async function addRecipe(recipeData) {
    try {
        const { name, image, ingredients, description, difficultyId, time, cost, userId, categoryId } = recipeData;

        // Cria a query SQL para inserir uma nova receita
        const query = `INSERT INTO recipes (Name, Image, Ingredients, Description, DifficultyId, Time, Cost, UserId, CategoryId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        // Executa a query de forma assíncrona com os valores passados
        const [results] = await db.query(query, [name, image, ingredients, description, difficultyId, time, cost, userId, categoryId]);

        // Retorna o ID da nova receita inserida
        return { id: results.insertId, ...recipeData };
    } catch (error) {
        console.error('Erro ao criar Receita:', error);
        throw error;
    }
}

async function addPost(postData) {
    try {
        const { message, date, userId } = postData;

        // Cria a query SQL para inserir uma nova receita
        const query = `INSERT INTO forum (Message, Date, UserId) VALUES (?, ?, ?)`;

        // Executa a query de forma assíncrona com os valores passados
        const [results] = await db.query(query, [message, date, userId]);

        // Retorna o ID da nova receita inserida
        return { id: results.insertId, ...postData };
    } catch (error) {
        console.error('Erro ao criar lista:', error);
        throw error;
    }
}

async function addUser(userData) {
    try {
        const { name, email, password } = userData;

        // Cria a query SQL para inserir uma nova receita
        const query = `INSERT INTO users (Name, Email, Password) VALUES (?, ?, ?)`;

        // Executa a query de forma assíncrona com os valores passados
        const [results] = await db.query(query, [name, email, password]);

        // Retorna o ID da nova receita inserida
        return { id: results.insertId, ...userData };
    } catch (error) {
        console.error('Erro ao criar User:', error);
        throw error;
    }
}

async function deleteRecipesListById(id) {
    const query = `DELETE FROM recipes_lists WHERE Id = ?`;
    return db.query(query, [id]);
}

async function deleteReviewById(id) {
    const query = `DELETE FROM reviews WHERE Id = ?`;
    return db.query(query, [id]);
}

async function deleteRecipeById(id) {
    const query = `DELETE FROM recipes WHERE Id = ?`;
    return db.query(query, [id]);
}

module.exports = {
    getRecipes,
    getReviews,
    getUsers,
    getLists,
    getRecipesList,
    getForum,
    addReview,
    addlist,
    addRecipesList,
    addRecipe,
    addPost,
    addUser,
    deleteRecipesListById,
    deleteReviewById,
    deleteRecipeById,
    getRecipesByDifficuty,
    getRecipesByCategory,
    getRecipesByDifficutyAndCategory,
    getUserById,
    getRecipeById,
    getRecipesByName,
    editRecipe,
};
