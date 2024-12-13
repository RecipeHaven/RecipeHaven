async function fetchUserData() {
    try {
        const userId = localStorage.getItem('userId')

        const usersResponse = await fetch('/api/users')
        let users = await usersResponse.json()
        let user = users.find(user => user.id == userId)

        const profile = document.getElementById('profile')

        if(userId != null) {
            profile.innerHTML = `<img src='ASSETS/profile.png' alt='Profile Photo' draggable='false'><span>${user.name}</span>`
            profile.href = '/user.html'
        } else {
            profile.innerHTML = `<img src='ASSETS/profile.png' alt='Profile Photo' draggable='false'><span>Signin</span>`
            profile.href = '/signin.html'
        }
    } catch (error) {
        console.error('Error fetching recipes:', error)
    }
}

async function addRecipe() {
    const name = document.getElementById('name').value
    const description = document.getElementById('description').value
    const difficultyId = document.getElementById('difficulty').value
    const time = document.getElementById('time').value
    const cost = document.getElementById('cost').value
    const userId = localStorage.getItem('userId')
    const categoryId = document.getElementById('category').value

    const ingredients = Array.from(document.querySelectorAll('#ingredients input'))
                            .map(input => input.value)
                            .join(', ')

    const recipeData = {
        name,
        ingredients,
        description,
        difficultyId,
        time,
        cost,
        userId,
        categoryId
    }

    try {
        const response = await fetch('/api/recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipeData)
        })

        if(response.ok) {
            if(window.confirm('Recipes added successfuly')) {
                window.location.reload()
            } else {
                window.location.reload()
            }
        } else {
            alert('Failed to add recipe')
        }
    } catch (error) {
        // alert('An error occurred')
        console.log('An error occurred')
    }
}

function addIngredient() {
    let ingredient = document.createElement('input')
    ingredient.type = 'text'
    ingredient.placeholder = 'Ingredient'
    document.getElementById('ingredients').appendChild(ingredient)
}