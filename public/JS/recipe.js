async function fetchUserData() {
    try {
        const sessionResponse = await fetch('/api/user');
        const sessionData = await sessionResponse.json();
        const userId = sessionData.userId;

        const usersResponse = await fetch('/api/users')
        let users = await usersResponse.json()
        let user = users.find(user => user.Id == userId)

        const profile = document.getElementById('profile')

        if(userId != null) {
            profile.innerHTML = `<img src='../ASSETS/profile.png' alt='Profile Photo' draggable='false'><span>${user.Name}</span>`
            profile.href = `/user.html/${userId}`
        } else {
            profile.innerHTML = `<img src='../ASSETS/profile.png' alt='Profile Photo' draggable='false'><span>Signin</span>`
            profile.href = '/signin.html'
        }
    } catch (error) {
        console.error('Error fetching recipes:', error)
    }
}

async function fetchRecipeData() {
    try {
        let usersResponse = await fetch(`/api/users`)
        const users = await usersResponse.json()

        const sessionResponse = await fetch('/api/user');
        const sessionData = await sessionResponse.json();
        const userId = sessionData.userId;

        const path = window.location.pathname;
        const pathSegments = path.split('/');
        const recipeId = parseInt(pathSegments[pathSegments.length - 1])

        let response = await fetch(`/api/recipes/${recipeId}`)
        const recipe = await response.json()

        document.title = `Recipe Haven - ${recipe.Name}`

        let userHasPermission = users.some(user => user.Permissions === 0 && user.Id == userId);

        if(recipe.UserId == userId || userHasPermission) {
            document.querySelector('#recipe-info h1').innerHTML = `${recipe.Name}<div><input type='checkbox' id='${recipe.Id}' onchange='handleCheckboxChange(this)'><button onclick="deleteRecipe(${recipe.Id});"></button></div>`
        } else {
            document.querySelector('#recipe-info h1').innerHTML = `${recipe.Name}<div><input type='checkbox' id='${recipe.Id}'></div>`
        }

        if (recipe.DifficultyId == 1) {
            document.querySelector('#difficulty img').src = '../ASSETS/easy.png'
            document.querySelector('#difficulty p').textContent = 'Easy'
        } else if (recipe.DifficultyId == 2) {
            document.querySelector('#difficulty img').src = '../ASSETS/medium.png'
            document.querySelector('#difficulty p').textContent = 'Medium'
        } else if (recipe.DifficultyId == 3 || recipe.DifficultyId == 4) {
            document.querySelector('#difficulty img').src = '../ASSETS/hard.png'
            document.querySelector('#difficulty p').textContent = 'Hard'
        }
        document.getElementById('description').textContent = recipe.Description
        document.getElementById('time').innerHTML = `<img src="../ASSETS/clock.png" alt="Clock" draggable="false"> ${recipe.Time}min`
        document.getElementById('cost').innerHTML = `<img src="../ASSETS/money-bag.png" alt="Money Bag" draggable="false">${recipe.Cost}€`
        if(recipe.CategoryId == 1) {
            document.querySelector('#category img').src = '../ASSETS/meal.png'
        } else if(recipe.CategoryId == 2) {
            document.querySelector('#category img').src = '../ASSETS/dessert.png'
        } else if(recipe.CategoryId == 3) {
            document.querySelector('#category img').src = '../ASSETS/drink.png'
        } else if(recipe.CategoryId == 4) {
            document.querySelector('#category img').src = '../ASSETS/cocktail.png'
        } else if(recipe.CategoryId == 5) {
            document.querySelector('#category img').src = '../ASSETS/soup.png'
        }

        let ingredients = (recipe.Ingredients).split(',').map(ingredient => ingredient.trim())
        ingredients.forEach(ingredient => {
            ingredient = ingredient.charAt(0).toUpperCase() + ingredient.slice(1)
            let ingredientElement = document.createElement('p')
            ingredientElement.textContent = ingredient
            document.getElementById('ingredients').appendChild(ingredientElement)
        });
    } catch (error) {
        console.error('Error fetching recipes:', error)
    }
}

async function fetchComments() {
    const reviewsResponse = await fetch('/api/reviews')
    const reviewsUsers = await fetch('/api/Users')
    let reviews = await reviewsResponse.json()
    const users = await reviewsUsers.json()

    const sessionResponse = await fetch('/api/user');
    const sessionData = await sessionResponse.json();
    const userId = sessionData.userId;

    const path = window.location.pathname
    const pathSegments = path.split('/')
    const recipeId = pathSegments[pathSegments.length - 1]

    reviews = reviews.filter(review => review.RecipeId == recipeId)
    reviews.forEach(review => {
        let reviewContainer = document.createElement('div')
        let reviewUser = document.createElement('a')
        reviewUser.className = 'username'
        const user = users.find(user => user.Id == review.UserId)
        reviewUser.href = `/user.html/${user.Id}`
        reviewUser.textContent = user.Name
        let reviewElement = document.createElement('p')
        reviewElement.className = 'review'
        reviewElement.textContent = review.Review
        reviewContainer.appendChild(reviewUser)
        reviewContainer.appendChild(reviewElement)

        let userHasPermission = users.some(user => user.Permissions === 0 && user.Id == userId);

        if(userId == review.UserId || userHasPermission) {
            let reviewDelete = document.createElement('button')
            reviewDelete.className = 'delete'
            reviewDelete.addEventListener('click', () => {
                deleteReview(review.Id)
            })

            reviewContainer.appendChild(reviewDelete)
        }
        document.querySelector('#reviews article').appendChild(reviewContainer)
    })
}

async function deleteReview(reviewId) {
    try {
        const response = await fetch(`/api/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            alert("Failed to delete the review");
        } else {
            window.location.reload()
        }
    } catch (error) {
        console.log('An error occurred')
    }
}

document.querySelector('#reviews form').addEventListener('submit', async () => {
    const review = document.querySelector('form textarea').value

    const sessionResponse = await fetch('/api/user');
    const sessionData = await sessionResponse.json();
    const userId = sessionData.userId;

    const path = window.location.pathname;
    const pathSegments = path.split('/');
    const recipeId = pathSegments[pathSegments.length - 1]

    const commentData = {
        review,
        userId,
        recipeId
    }

    try {
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        })

        if(response.ok) {
            window.location.reload()
        }
    } catch (error) {
        console.log('An error occurred')
    }
})

async function checkRecipesList() {
    try {
        const recipesListResponse = await fetch('/api/recipesList');
        const recipesList = await recipesListResponse.json();

        const listsResponse = await fetch('/api/lists');
        const lists = await listsResponse.json();

        const sessionResponse = await fetch('/api/user');
        const sessionData = await sessionResponse.json();
        const userId = sessionData.userId;

        const list = lists.find(list => list.UserId == userId);

        const recipeIdsInList = recipesList
            .filter(recipeList => recipeList.ListId == list.Id)
            .map(recipeList => recipeList.RecipeId);
            

        const listButtons = document.querySelectorAll('h1 input[type="checkbox"]');
        listButtons.forEach(listButton => {
            const recipeId = listButton.id;
            if(recipeIdsInList.includes(parseInt(recipeId))) {
                listButton.checked = true;
                listButton.style.background = 'url(../ASSETS/inList.png) center/contain no-repeat';
            } else {
                listButton.checked = false;
                listButton.style.background = 'url(../ASSETS/notInList.png) center/contain no-repeat';
            }
        });
    } catch (error) {
        console.error('An error occurred while checking recipes list:', error);
    }
}

async function handleCheckboxChange(checkbox) {
    const recipeId = parseInt(checkbox.id);

    try {
        const listsResponse = await fetch('/api/lists');
        const recipesListResponse = await fetch('/api/recipesList');
        const recipesList = await recipesListResponse.json();
        const lists = await listsResponse.json();

        const sessionResponse = await fetch('/api/user');
        const sessionData = await sessionResponse.json();
        const userId = sessionData.userId;

        const list = lists.find(list => list.UserId == userId);
        const listId = list.Id;

        if (checkbox.checked) {
            checkbox.style.background = 'url(../ASSETS/inList.png) center/contain no-repeat';

            const recipesListData = { recipeId, listId };
            const response = await fetch('/api/recipesList', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recipesListData)
            });

            if (!response.ok) {
                alert("Failed to add the recipe to your list");
                checkbox.checked = false;
                checkbox.style.background = 'url(../ASSETS/notInList.png) center/contain no-repeat';
            }
        } else {
            checkbox.style.background = 'url(../ASSETS/notInList.png) center/contain no-repeat';

            const recipeList = recipesList.find(recipeList => recipeList.RecipeId == recipeId && recipeList.ListId == listId);

            const response = await fetch(`/api/recipesList/${recipeList.Id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                alert("Failed to remove the recipe from your list");
                checkbox.checked = true;
                checkbox.style.background = 'url(../ASSETS/inList.png) center/contain no-repeat';
            }
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function deleteRecipe(recipeId) {
    try {
        const response = await fetch(`/api/recipes/${recipeId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            alert("Failed to delete the recipe");
        } else {
            window.location.href = "/recipes.html"
        }
    } catch (error) {
        console.log('An error occurred')
    }
}

// Initialize recipes and check the list, then register events
fetchRecipeData().then(() => {
    checkRecipesList().then(() => {
        document.querySelectorAll('h1 input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => handleCheckboxChange(checkbox));
        });
    });
});

fetchUserData()
fetchComments()