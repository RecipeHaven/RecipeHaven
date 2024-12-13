async function fetchUser() {
    try {
        const userId = localStorage.getItem('userId')

        const usersResponse = await fetch('/api/users')
        let users = await usersResponse.json()
        let user = users.find(user => user.id == userId)

        const profile = document.getElementById('profile')

        if(userId != null) {
            profile.innerHTML = `<img src='../ASSETS/profile.png' alt='Profile Photo' draggable='false'><span>${user.name}</span>`
            profile.href = '/user.html'
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
        const response = await fetch('/api/recipes')
        const recipes = await response.json()

        const path = window.location.pathname;
        const pathSegments = path.split('/');
        const recipeId = pathSegments[pathSegments.length - 1]

        let recipe = recipes.find(recipe => recipe.id == recipeId)
        document.title = `Fat - ${recipe.name}`
        // console.log(recipe)

        document.querySelector('#recipe-info h1').innerHTML = `${recipe.name}<input type='checkbox' id='${recipe.id}'>`
        if (recipe.difficultyId == 1) {
            document.querySelector('#difficulty img').src = '../ASSETS/easy.png'
            document.querySelector('#difficulty p').textContent = 'Easy'
        } else if (recipe.difficultyId == 2) {
            document.querySelector('#difficulty img').src = '../ASSETS/medium.png'
            document.querySelector('#difficulty p').textContent = 'Medium'
        } else if (recipe.difficultyId == 3 || recipe.difficultyId == 4) {
            document.querySelector('#difficulty img').src = '../ASSETS/hard.png'
            document.querySelector('#difficulty p').textContent = 'Hard'
        }
        document.getElementById('description').textContent = recipe.description
        document.getElementById('time').innerHTML = `<img src="../ASSETS/clock.png" alt="Clock" draggable="false"> ${recipe.time}min`
        document.getElementById('cost').innerHTML = `<img src="../ASSETS/money-bag.png" alt="Money Bag" draggable="false">${recipe.cost}€`
        if(recipe.categoryId == 1) {
            document.querySelector('#category img').src = '../ASSETS/meal.png'
        } else if(recipe.categoryId == 2) {
            document.querySelector('#category img').src = '../ASSETS/dessert.png'
        } else if(recipe.categoryId == 3) {
            document.querySelector('#category img').src = '../ASSETS/drink.png'
        } else if(recipe.categoryId == 4) {
            document.querySelector('#category img').src = '../ASSETS/cocktail.png'
        } else if(recipe.categoryId == 5) {
            document.querySelector('#category img').src = '../ASSETS/soup.png'
        }

        let ingredients = (recipe.ingredients).split(',').map(ingredient => ingredient.trim())
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

// function openSection() {
//     document.querySelector('#recipe-info article').style.height = 'calc(100lvh - 6rem)'
// }

async function fetchComments() {
    const reviewsResponse = await fetch('/api/reviews')
    const reviewsUsers = await fetch('/api/Users')
    let reviews = await reviewsResponse.json()
    const users = await reviewsUsers.json()

    const userId = localStorage.getItem('userId')

    const path = window.location.pathname
    const pathSegments = path.split('/')
    const recipeId = pathSegments[pathSegments.length - 1]

    reviews = reviews.filter(review => review.recipeId == recipeId)
    reviews.forEach(review => {
        let reviewContainer = document.createElement('div')
        let reviewUser = document.createElement('a')
        reviewUser.className = 'username'
        const user = users.find(user => user.id == review.userId)
        reviewUser.href = `/user2.html/${user.id}`
        reviewUser.textContent = user.name
        let reviewElement = document.createElement('p')
        reviewElement.className = 'review'
        reviewElement.textContent = review.review
        reviewContainer.appendChild(reviewUser)
        reviewContainer.appendChild(reviewElement)
        if(userId == review.userId) {
            let reviewDelete = document.createElement('button')
            reviewDelete.className = 'delete'
            reviewDelete.addEventListener('click', () => {
                deleteReview(review.id)
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

async function addComment() {
    const review = document.querySelector('form textarea').value
    const userId = localStorage.getItem('userId')

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
}

async function checkRecipesList() {
    try {
        const recipesListResponse = await fetch('/api/recipesList');
        const recipesList = await recipesListResponse.json();

        const listsResponse = await fetch('/api/lists');
        const lists = await listsResponse.json();

        const userId = localStorage.getItem('userId');
        const list = lists.find(list => list.userId == userId);

        const recipeIdsInList = recipesList
            .filter(recipeList => recipeList.listId == list.id)
            .map(recipeList => recipeList.recipeId);

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

async function addToList(checkbox) {
    try {
        const listsResponse = await fetch('/api/lists')
        const recipesListresponse = await fetch('/api/recipesList')
        const recipesList = await recipesListresponse.json()
        const lists = await listsResponse.json()

        const userId = localStorage.getItem('userId');
        const list = lists.find(list => list.userId == userId)

        const listId = list.id
        const recipeId = checkbox.id;

        if (checkbox.checked) {
            checkbox.style.background = 'url(../ASSETS/inList.png) center/contain no-repeat';

            const recipesListData = {
                recipeId,
                listId
            };

            const response = await fetch('/api/recipesList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recipesListData)
            });

            if (!response.ok) {
                alert("Failed to add the recipe to your list");
                checkbox.checked = false;  // revert to unchecked if error
                checkbox.style.background = 'url(../ASSETS/notInList.png) center/contain no-repeat';
            }
        } else {
            checkbox.style.background = 'url(../ASSETS/notInList.png) center/contain no-repeat';
            
            const recipeList = recipesList.find(recipeList => recipeList.recipeId == recipeId && recipeList.listId == listId) 

            const recipesListId = recipeList.id

            const response = await fetch(`/api/recipesList/${recipesListId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                alert("Failed to delete the recipe from your list");
                checkbox.checked = true;  // revert to checked if error
                checkbox.style.background = 'url(../ASSETS/inList.png) center/contain no-repeat';
            }
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// Initialize recipes and check the list, then register events
fetchRecipeData().then(() => {
    checkRecipesList().then(() => {
        document.querySelectorAll('h1 input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => addToList(checkbox));
        });
    });
});