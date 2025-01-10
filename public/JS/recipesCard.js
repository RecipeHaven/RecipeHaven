export async function createRecipesCard() {
    try {
        const response = await fetch('/api/recipes')
        let recipes = await response.json()

        const recipesContainer = document.getElementById('recipes');
        recipesContainer.innerHTML = ''; 

        const userId = localStorage.getItem('userId');

        if(window.location.pathname == '/' ) {
            recipes = recipes.sort(() => Math.random() - 0.5);
            recipes = recipes.slice(0, 3);
        }  
        else if(window.location.pathname == '/list.html' ) {
            const recipesListResponse = await fetch('/api/recipesList');
            const recipesList = await recipesListResponse.json();

            const listsResponse = await fetch('/api/lists');
            const lists = await listsResponse.json();

            const list = lists.find(list => list.UserId == userId);

            const recipeIdsInList = recipesList
                .filter(recipeList => recipeList.ListId == list.Id)
                .map(recipeList => recipeList.RecipeId);

            recipes = recipes.filter(recipe => recipeIdsInList.includes(recipe.Id))
        }
        else if(window.location.pathname.includes('/user.html')) {
            const path = window.location.pathname;
            const pathSegments = path.split('/');
            const user2Id = pathSegments[pathSegments.length - 1]

            recipes = recipes.filter(recipe => recipe.UserId == user2Id)
        }

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

        await checkRecipesList();
        document.querySelectorAll('.list-input').forEach(checkbox => {
            checkbox.addEventListener('change', () => addToList(checkbox));
        });
    } catch (error) {
        console.error('Error fetching recipes:', error)
    }
}

async function addToList(checkbox) {
    try {
        const listsResponse = await fetch('/api/lists')
        const recipesListresponse = await fetch('/api/recipesList')
        const recipesList = await recipesListresponse.json()
        const lists = await listsResponse.json()

        const userId = localStorage.getItem('userId');
        const list = lists.find(list => list.UserId == userId)

        const listId = list.Id
        const recipeId = parseInt(checkbox.id);

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
            
            const recipeList = recipesList.find(recipeList => recipeList.RecipeId == recipeId && recipeList.ListId == listId) 

            const recipesListId = recipeList.Id

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
            } else {
                window.location.reload()
            }
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function checkRecipesList() {
    try {
        const recipesListResponse = await fetch('/api/recipesList');
        const recipesList = await recipesListResponse.json();

        const listsResponse = await fetch('/api/lists');
        const lists = await listsResponse.json();

        const userId = localStorage.getItem('userId');
        const list = lists.find(list => list.UserId == userId);

        const recipeIdsInList = recipesList
            .filter(recipeList => recipeList.ListId == list.Id)
            .map(recipeList => recipeList.RecipeId);

        const listButtons = document.querySelectorAll('.list-input');
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