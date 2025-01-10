process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const express = require('express')
const axios = require('axios')
const https = require('https')
const path = require('path')
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getRecipes, getReviews, getUsers, getLists, getRecipesList, getForum, addReview, addlist, addRecipesList, addRecipe, addPost, addUser, deleteRecipesListById, deleteReviewById, deleteRecipeById, getRecipesByDifficuty, getRecipesByCategory, getRecipesByDifficutyAndCategory, getUserById, getRecipeById, getRecipesByName, editRecipe } = require('./models'); // Importa a função

// Configurar o cliente S3
const s3 = new S3Client({
    region: 'eu-north-1',
    credentials: {
        accessKeyId: 'AKIAU6VTTCFFUCOUTLEQ',
        secretAccessKey: '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'
    },
});

const router = express.Router()

const url = 'https://localhost:7065/api' 

const bucketName = 'fatphotos';

// Configuração do multer para lidar com upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Função para upload da imagem e retorno do link
router.post('/upload', upload.single('image'), async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).send('Nenhum arquivo foi enviado.');
    }

    const fileName = `images/${Date.now()}_${file.originalname}`;
    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        const command = new PutObjectCommand(params);
        await s3.send(command);

        // Gerar o URL da imagem
        const imageUrl = `https://${bucketName}.s3.${s3.config.region}.amazonaws.com/${fileName}`;

        // Retornar o URL da imagem no corpo da resposta
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        res.status(500).send('Erro ao fazer upload da imagem.');
    }
});

router.get('/api/recipes', async (req, res) => {
    try {
        const recipes = await getRecipes();
        res.json(recipes);
    } catch (error) {
        console.error('Erro ao buscar receitas da base de dados:', error);
        res.status(500).send('Erro ao buscar receitas.');
    }
});

router.patch('/api/recipes/update/:id', express.json(), async (req, res) => {
    const { id } = req.params;
    const { field, value } = req.body;

    const validFields = ['Image', 'Ingredients', 'Description']; // Campos permitidos
    if (!validFields.includes(field)) {
        return res.status(400).json({ error: 'Invalid field' });
    }

    if (!value || value.trim() === '') {
        return res.status(400).json({ error: 'Field value cannot be empty.' });
    }

    try {
        await editRecipe(id, field, value);
        res.status(200).json({ message: 'Recipe updated successfully' });
    } catch (error) {
        console.error('Erro ao atualizar a receita da base de dados:', error);
        res.status(500).send('Erro ao atualizar receita.');
    }
});

router.get('/api/recipes/:id', express.json(), async (req, res) => {
    const { id } = req.params;

    try {
        const recipe = await getRecipeById(id)
        res.json(recipe)
    } catch (error) {
        console.error('Erro ao buscar receita da base de dados:', error);
        res.status(500).send('Erro ao buscar receita.');
    }
});

router.get('/api/recipes/difficulty/:difficultyId', express.json(), async (req, res) => {
    const { difficultyId } = req.params;

    try {
        const recipes = await getRecipesByDifficuty(difficultyId);
        res.json(recipes);
    } catch (error) {
        console.error('Erro ao buscar a receita da base de dados:', error);
        res.status(500).send('Erro ao buscar receita.');
    }
});

router.get('/api/recipes/category/:categoryId', express.json(), async (req, res) => {
    const { categoryId } = req.params;

    try {
        const recipes = await getRecipesByCategory(categoryId);
        res.json(recipes);
    } catch (error) {
        console.error('Erro ao buscar a receita da base de dados:', error);
        res.status(500).send('Erro ao buscar receita.');
    }
});

router.get('/api/recipes/:difficultyId/:categoryId', express.json(), async (req, res) => {
    const { difficultyId, categoryId } = req.params;

    try {
        const recipes = await getRecipesByDifficutyAndCategory(difficultyId, categoryId);
        res.json(recipes);
    } catch (error) {
        console.error('Erro ao buscar a receita da base de dados:', error);
        res.status(500).send('Erro ao buscar receita.');
    }
});

router.get('/api/recipesByName/:name', express.json(), async (req, res) => {
    const { name } = req.params;

    try {
        const recipes = await getRecipesByName(name)
        res.json(recipes)
    } catch (error) {
        console.error('Erro ao buscar receitas da base de dados:', error);
        res.status(500).send('Erro ao buscar receitas.');
    }
});

router.delete('/api/recipes/:id', express.json(), async (req, res) => {
    const { id } = req.params;

    try {
        await deleteRecipeById(id);

        res.status(200).send({ message: 'Receita removida da lista.' });
    } catch (error) {
        console.error('Error ao remover Receita:', error);
        res.status(500).send({ error: 'Falha ao remover Receita.' });
    }
});

router.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await getReviews();
        res.json(reviews);
    } catch (error) {
        console.error('Erro ao buscar reviews da base de dados:', error);
        res.status(500).send('Erro ao buscar reviews.');
    }
});

router.post('/api/reviews', express.json(), async (req, res) => {
    const { review, userId, recipeId } = req.body;

    try {
        await addReview({ review, userId, recipeId });
        res.status(201).json({ message: 'Comentário adicionado com sucesso!' });
    } catch (error) {
        console.error('Erro ao adicionar comentário:', error);
        res.status(500).json({ error: 'Erro ao adicionar comentário.' });
    }
});

router.delete('/api/reviews/:id', express.json(), async (req, res) => {
    const { id } = req.params;

    try {
        await deleteReviewById(id);

        res.status(200).send({ message: 'Review removida da lista.' });
    } catch (error) {
        console.error('Error ao remover Review:', error);
        res.status(500).send({ error: 'Falha ao remover Review.' });
    }
});

router.get('/api/users', async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        console.error('Erro ao buscar users da base de dados:', error);
        res.status(500).send('Erro ao buscar users.');
    }
});

router.get('/api/users/:id', express.json(), async (req, res) => {
    const { id } = req.params;

    try {
        const user = await getUserById(id)
        res.json(user)
    } catch (error) {
        console.error('Erro ao buscar user da base de dados:', error);
        res.status(500).send('Erro ao buscar user.');
    }
});

router.post('/api/users', express.json(), async (req, res) => {
    const { name, email, password } = req.body;

    try {
        await addUser({ name, email, password });
        res.status(201).json({ message: 'User criado com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar User:', error);
        res.status(500).json({ error: 'Erro ao criar User.' });
    }
});

router.get('/api/lists', async (req, res) => {
    try {
        const lists = await getLists();
        res.json(lists);
    } catch (error) {
        console.error('Erro ao buscar lista da base de dados:', error);
        res.status(500).send('Erro ao buscar lista.');
    }
});

router.post('/api/lists', express.json(), async (req, res) => {
    const { userId } = req.body;

    try {
        await addlist({ userId });
        res.status(201).json({ message: 'Lista criada com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar lista:', error);
        res.status(500).json({ error: 'Erro ao criar lista.' });
    }
});

router.get('/api/recipesList', async (req, res) => {
    try {
        const recipesList = await getRecipesList();
        res.json(recipesList);
    } catch (error) {
        console.error('Erro ao buscar recipesList da base de dados:', error);
        res.status(500).send('Erro ao buscar recipesList.');
    }
});

router.post('/api/recipesList', express.json(), async (req, res) => {
    const { recipeId, listId } = req.body;

    try {
        await addRecipesList({ recipeId, listId });
        res.status(201).json({ message: 'RecipesList adicionada com sucesso!' });
    } catch (error) {
        console.error('Erro ao adicionar RecipesList:', error);
        res.status(500).json({ error: 'Erro ao adicionar RecipesList.' });
    }
});

router.delete('/api/recipesList/:id', express.json(), async (req, res) => {
    const { id } = req.params;

    try {
        await deleteRecipesListById(id);

        res.status(200).send({ message: 'Receita removida da lista.' });
    } catch (error) {
        console.error('Error ao remover receita:', error);
        res.status(500).send({ error: 'Falha ao remover receita.' });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err)
            return res.status(500).send('Error logging out')
        }
        res.redirect('/') // Redireciona para a página home após o logout
    })
})

router.post('/api/recipe', express.json(), async (req, res) => {
    const { name, image, ingredients, description, difficultyId, time, cost, userId, categoryId } = req.body;

    try {
        await addRecipe({ name, image, ingredients, description, difficultyId, time, cost, userId, categoryId });
        res.status(201).json({ message: 'Receita criada com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar Receita:', error);
        res.status(500).json({ error: 'Erro ao criar Receita.' });
    }
});

router.get('/api/forum', async (req, res) => {
    try {
        const forum = await getForum();
        res.json(forum);
    } catch (error) {
        console.error('Erro ao buscar forum da base de dados:', error);
        res.status(500).send('Erro ao buscar forum.');
    }
});

router.post('/api/forum', express.json(), async (req, res) => {
    const { message, date, userId } = req.body;

    try {
        await addPost({ message, date, userId });
        res.status(201).json({ message: 'Post adicionado com sucesso!' });
    } catch (error) {
        console.error('Erro ao adicionar Post:', error);
        res.status(500).json({ error: 'Erro ao adicionar Post.' });
    }
});

// Rota para servir o index.html
router.get(`/`, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

router.get('/recipes.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'HTML', 'recipes.html'))
})

router.get('/recipe.html/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'HTML', 'recipe.html'))
})

router.get('/list.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'HTML', 'list.html'))
})

router.get('/addRecipe.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'HTML', 'addRecipe.html'))
})

router.get('/signin.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'HTML', 'signin.html'))
})

router.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'HTML', 'login.html'))
})

router.get('/user.html/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'HTML', 'user.html'))
})

router.get('/forum.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'HTML', 'forum.html'))
})

router.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'HTML', 'admin.html'))
})

module.exports = router