async function fetchRecipes() {
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

        await applyFilters()
    } catch (error) {
        console.error('Error fetching recipes:', error)
    }
}

async function applyFilters() {
    try {
        const recipesListResponse = await fetch('/api/recipesList')
        const listResponse = await fetch('/api/lists')
        const recipesResponse = await fetch('/api/recipes')

        if (!recipesListResponse.ok || !recipesResponse.ok || !listResponse.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        
        let recipes = await recipesResponse.json()
        let recipesList = await recipesListResponse.json()
        let lists = await listResponse.json()

        const userId = localStorage.getItem('userId')

        const categoryValue = document.getElementById('category').value
        const difficultyValue = document.getElementById('difficulty').value
        const recipesContainer = document.getElementById('recipes');
        const search = document.getElementById('search')
        var searchValue = search.value.toLowerCase()

        recipesContainer.innerHTML = "" // Limpa a lista antes de adicionar novos elementos

        const userList = lists.find(list => list.userId == userId)

        const userRecipeIds = recipesList
            .filter(recipeList => recipeList.listId == userList.id)
            .map(recipeList => recipeList.recipeId);

        // Aplica o filtro de categoria e dificuldade ao mesmo tempo, conforme necessário
        recipes = recipes.filter(recipe =>
            userRecipeIds.includes(recipe.id) &&
                (categoryValue == 0 || recipe.categoryId == categoryValue) &&
                (difficultyValue == 0 || recipe.difficultyId == difficultyValue) &&
                (searchValue == '' || recipe.name.includes(searchValue) || recipe.name.toLowerCase().includes(searchValue))
        );

        // recipes = recipes.filter(recipe => recipeIds.includes(recipe.id))

        // Exibe as receitas filtradas
        recipes.forEach(recipe => {
            const link = document.createElement('a')
            link.href = `/recipe.html/${recipe.id}`
            link.className = 'recipe'
            link.innerHTML = `<h3>${recipe.name}</h3> <input type='checkbox' id='${recipe.id}'>`
            link.style.background = `url(${recipe.image}) center/cover`
            recipesContainer.appendChild(link)
        });
    } catch (error) {
        console.error('Error applying filters:', error)
    }
}

function resetFilters() {
    document.getElementById('category').value = 0
    document.getElementById('difficulty').value = 0
    fetchRecipes()
}
  
function openFilters(checkbox) {
    if(checkbox.checked) {
      document.getElementById('filters').style.height = '3rem'
    } else {
        document.getElementById('filters').style.height = '0rem'
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

        const listButtons = document.querySelectorAll('a input[type="checkbox"]');
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
            } else {
                window.location.reload()
            }
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// Initialize recipes and check the list, then register events
fetchRecipes().then(() => {
    checkRecipesList().then(() => {
        document.querySelectorAll('a input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => addToList(checkbox));
        });
    });
});