import { fetchUserData } from './fetchUser.js'

async function fetchRecipes() {
    try {
        const recipesResponse = await fetch('/api/recipes')
        const recipes = await recipesResponse.json()

        recipes.forEach(async recipe => {
            const tbody = document.querySelector('tbody')
            const tr = document.createElement('tr')
            tr.innerHTML = `
                <th scope="row">
                    <input type="checkbox">
                </th>
                <td>${recipe.Id}</td>
                <td>${recipe.Name}</td>
                <td>
                    <button type="button" class="recipe-image" data-bs-toggle="modal" data-bs-target="#exampleModal">${recipe.Image}</button>
                </td>
                <td>
                    <button type="button" class="recipe-ingredients" data-bs-toggle="modal" data-bs-target="#exampleModal">${recipe.Ingredients}</button></td>
                <td>
                    <button type="button" class="recipe-description" data-bs-toggle="modal" data-bs-target="#exampleModal">${recipe.Description}</button>
                </td>
                <td>${recipe.Time}</td>
                <td>${recipe.Cost}</td>
                <td>
                    ${getDifficulty(recipe.DifficultyId)}
                </td>
                <td>
                    ${getCategory(recipe.CategoryId)}
                </td>`

                const recipeImageButton = tr.querySelector('.recipe-image');
                recipeImageButton.addEventListener('click', () => {
                    updateData('image', recipe)
                });

                const recipeIngredientsButton = tr.querySelector('.recipe-ingredients');
                recipeIngredientsButton.addEventListener('click', () => {
                    updateData('ingredients', recipe)
                });

                const recipeDescriptionButton = tr.querySelector('.recipe-description');
                recipeDescriptionButton.addEventListener('click', () => {
                    updateData('description', recipe)
                });
       
            tbody.appendChild(tr)
        });
    } catch (error) {
        console.error('Error fetching recipes:', error)
    }
}

function updateData(dataType, recipe) {
    switch (dataType) {
        case 'image':
            document.querySelector('.modal-title').textContent = 'Recipe Image'
            document.querySelector('.modal-body').innerHTML = `<textarea type="text" readonly>${recipe.Image}</textarea><br><br><img src='${recipe.Image}' class='w-100 rounded'>`;
            document.querySelector('.modal-footer').innerHTML = '<button class="btn btn-warning edit">Edit</button>'
            setUpEditButton(recipe.Id, 'Image');
            break;
        case 'ingredients':
            document.querySelector('.modal-title').textContent = 'Recipe Ingredients'
            document.querySelector('.modal-body').innerHTML = `<textarea type="text" readonly>${recipe.Ingredients}</textarea>`;
            document.querySelector('.modal-footer').innerHTML = '<button class="btn btn-warning edit">Edit</button>'
            setUpEditButton(recipe.Id, 'Ingredients');
            break;
        case 'description':
            document.querySelector('.modal-title').textContent = 'Recipe Ingredients'
            document.querySelector('.modal-body').innerHTML = `<textarea type="text" readonly>${recipe.Description}</textarea>`;
            document.querySelector('.modal-footer').innerHTML = '<button class="btn btn-warning edit">Edit</button>'
            setUpEditButton(recipe.Id, 'Description');
            break;
        default:
            break;
    }
}

function getDifficulty(difficultyId) {
    switch (difficultyId) {
        case 1:
            return 'Easy';
        case 2:
            return 'Medium';
        case 3:
            return 'Hard';
        case 4:
            return 'Extreme';
        default:
            return 'Unknown';
    }
}

function getCategory(categoryId) {
    switch (categoryId) {
        case 1:
            return 'Meal';
        case 2:
            return 'Dessert';
        case 3:
            return 'Drink';
        case 4:
            return 'Cocktail';
        case 5:
            return 'Soup';
        default:
            return 'Unknown';
    }
}

function setUpEditButton(recipeId, field) {
    const editButton = document.querySelector('.modal-footer .edit');

    editButton.addEventListener('click', () => {
        const textarea = document.querySelector('.modal-body textarea');
        if (textarea) {
            textarea.removeAttribute('readonly');
        }

        document.querySelector('.modal-footer').innerHTML = "<button class='btn btn-primary save-changes'>Save Changes</button>";

        document.querySelector('.save-changes').addEventListener('click', async () => {
            const value = textarea.value.trim();
        
            try {
                const response = await fetch(`/api/recipes/update/${recipeId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ field, value })
                });
        
                if (!response.ok) {
                    throw new Error('Failed to update recipe');
                }
        
                console.log('Recipe updated successfully');
                textarea.setAttribute('readonly', true);
                window.location.reload()
            } catch (error) {
                console.error('Error updating recipe:', error);
            }
        });        
    });
}

fetchUserData()
fetchRecipes()