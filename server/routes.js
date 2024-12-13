const express = require('express')
const axios = require('axios')
const https = require('https')
const path = require('path')

const router = express.Router()

const url = 'https://localhost:7065/api' 

router.get('/api/recipes', async (req, res) => {
    try {
        const response = await axios.get(`${url}/Recipes`, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })
        res.json(response.data)
    } catch (error) {
        console.error('Error fetching recipes:', error)
        res.status(500).send('Error fetching recipes')
    }
})

router.get('/api/reviews', async (req, res) => {
    try {
        const response = await axios.get(`${url}/Reviews`, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })
        res.json(response.data)
    } catch (error) {
        console.error('Error fetching reviews:', error)
        res.status(500).send('Error fetching reviews')
    }
})

router.post('/api/reviews', express.json(), async (req, res) => {
    const { review, userId, recipeId } = req.body;

    try {
        const response = await axios.post(`${url}/Reviews`, {
            review,
            userId,
            recipeId
        }, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });

        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error creating reviews:', error);
        res.status(500).send('Error creating review');
    }
});

router.delete('/api/reviews/:id', express.json(), async (req, res) => {
    const reviewId = req.params.id;

    try {
        const response = await axios.delete(`${url}/Reviews/${reviewId}`, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });

        if (response.status === 200) {
            res.status(200).send("Review deleted successfully");
        } else {
            res.status(500).send("Failed to delete the Review");
        }
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).send('Error deleting review');
    }
});

// Rota para obter utilizadores da API
router.get('/api/users', async (req, res) => {
    try {
        const response = await axios.get(`${url}/Users`, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })
        res.json(response.data)
    } catch (error) {
        console.error('Error fetching users:', error)
        res.status(500).send('Error fetching users')
    }
})

router.post('/api/users', express.json(), async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const response = await axios.post(`${url}/Users`, {
            name,
            email,
            password
        }, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });

        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).send('Error creating recipe');
    }
});

router.get('/api/lists', async (req, res) => {
    try {
        const response = await axios.get(`${url}/Lists`, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })
        res.json(response.data)
    } catch (error) {
        console.log('Error fetching recipesList: ', error)
        res.status(500).send('Error fetching recipesList')
    }
})

router.post('/api/lists', express.json(), async (req, res) => {
    const { userId } = req.body;

    try {
        const response = await axios.post(`${url}/Lists`, {
            userId
        }, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });

        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).send('Error creating recipe');
    }
});

router.get('/api/recipesList', async (req, res) => {
    try {
        const response = await axios.get(`${url}/RecipesList`, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })
        res.json(response.data)
    } catch (error) {
        console.log('Error fetching recipesList: ', error)
        res.status(500).send('Error fetching recipesList')
    }
})

router.post('/api/recipesList', express.json(), async (req, res) => {
    const { recipeId, listId } = req.body;

    try {
        const response = await axios.post(`${url}/RecipesList`, {
            recipeId,
            listId
        }, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });

        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).send('Error creating recipe');
    }
});

router.delete('/api/recipesList/:id', express.json(), async (req, res) => {
    const recipesListId = req.params.id;

    try {
        const response = await axios.delete(`${url}/RecipesList/${recipesListId}`, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });

        if (response.status === 200) {
            res.status(200).send("RecipeList deleted successfully");
        } else {
            res.status(500).send("Failed to delete the recipeList");
        }
    } catch (error) {
        console.error('Error deleting recipeList:', error);
        res.status(500).send('Error deleting recipeList');
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
    const { name, ingredients, description, difficultyId, time, cost, userId, categoryId } = req.body;

    try {
        const response = await axios.post(`${url}/Recipes`, {
            name,
            ingredients,
            description,
            difficultyId,
            time,
            cost,
            userId,
            categoryId
        }, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });

        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).send('Error creating recipe');
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

router.get('/user.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'HTML', 'user.html'))
})

router.get('/user2.html/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'HTML', 'user2.html'))
})

module.exports = router