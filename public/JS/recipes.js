import { createRecipesCard } from './recipesCard.js'
import { fetchUserData } from './fetchUser.js'

document.getElementById('search-button').addEventListener('click', async () => {
    let search = document.getElementById('search').value.trim()
    
    if(search == '') {
        createRecipesCard()
    } else {
        let response = await fetch(`/api/recipesByName/${search}`)
        const recipes = await response.json()

        const recipesContainer = document.getElementById('recipes');
        recipesContainer.innerHTML = ''; 
        
        recipes.forEach(recipe => {
            const link = document.createElement('a')
            const image = document.createElement('img')
            const info = document.createElement('div')
            link.href = `/recipe.html/${recipe.Id}`
            link.className = 'recipe'
            info.innerHTML = `<h3>${recipe.Name}</h3> <input type='checkbox' id='${recipe.Id}' class='list-input'>`
            if(recipe.image != '') {
                image.src = recipe.Image
            } else {
                image.src = '../ASSETS/recipe.png'
            }
            link.appendChild(image)
            link.appendChild(info)
            recipesContainer.appendChild(link)
        })
    }
})

document.querySelector('#filters button').addEventListener('click', () => {
    document.getElementById('category').value = 0
    document.getElementById('difficulty').value = 0
    createRecipesCard()
})

document.querySelector('#filters-button input').addEventListener('change', (event) => {
    const checkbox = event.target;
    if(checkbox.checked) {
        document.getElementById('filters').style.height = '3rem'
    } else {
        document.getElementById('filters').style.height = '0rem'
    }
})

document.getElementById('category').addEventListener('change', async (event) => {
    const categoryId = event.target.value;

    const difficulty = document.getElementById('difficulty')
    const difficultyId = parseInt(difficulty.value);

    let response;
    if(difficulty.value === '0') {
        response = await fetch(`/api/recipes/category/${categoryId}`)
    } else {
        response = await fetch(`/api/recipes/${difficultyId}/${categoryId}`)
    }

    const recipes = await response.json();

    const recipesContainer = document.getElementById('recipes');
    recipesContainer.innerHTML = ''; 

    recipes.forEach(recipe => {
        const link = document.createElement('a')
        const image = document.createElement('img')
        const info = document.createElement('div')
        link.href = `/recipe.html/${recipe.Id}`
        link.className = 'recipe'
        info.innerHTML = `<h3>${recipe.Name}</h3> <input type='checkbox' id='${recipe.Id}' class='list-input'>`
        if(recipe.image != '') {
            image.src = recipe.Image
        } else {
            image.src = '../ASSETS/recipe.png'
        }
        link.appendChild(image)
        link.appendChild(info)
        recipesContainer.appendChild(link)
    })
})

document.getElementById('difficulty').addEventListener('change', async (event) => {
    const difficultyId = event.target.value;

    const category = document.getElementById('category')
    const categoryId = parseInt(category.value);

    let response;
    if(category.value === '0') {
        response = await fetch(`/api/recipes/difficulty/${difficultyId}`)
    } else {
        response = await fetch(`/api/recipes/${difficultyId}/${categoryId}`)
    }

    const recipes = await response.json();

    const recipesContainer = document.getElementById('recipes');
    recipesContainer.innerHTML = ''; 

    recipes.forEach(recipe => {
        const link = document.createElement('a')
        const image = document.createElement('img')
        const info = document.createElement('div')
        link.href = `/recipe.html/${recipe.Id}`
        link.className = 'recipe'
        info.innerHTML = `<h3>${recipe.Name}</h3> <input type='checkbox' id='${recipe.Id}' class='list-input'>`
        if(recipe.image != '') {
            image.src = recipe.Image
        } else {
            image.src = '../ASSETS/recipe.png'
        }
        link.appendChild(image)
        link.appendChild(info)
        recipesContainer.appendChild(link)
    })
})

fetchUserData();
createRecipesCard();