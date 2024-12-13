async function fetchUserData() {
    try {
        const path = window.location.pathname;
        const pathSegments = path.split('/');
        const userId = pathSegments[pathSegments.length - 1]

        const user2Id = localStorage.getItem('userId')

        const usersResponse = await fetch('/api/users')
        let users = await usersResponse.json()
        let user = users.find(user => user.id == userId)
        let user2 = users.find(user => user.id == user2Id)
        
        const name = document.querySelector('#profile-info div h1')
        const email = document.querySelector('#profile-info div p')

        if(user != null){
            name.textContent =  user.name
            email.textContent =  user.email
        }

        if(user2Id != null) {
            profile.innerHTML = `<img src='../ASSETS/profile.png' alt='Profile Photo' draggable='false'><span>${user2.name}</span>`
            profile.href = '/user.html'
        } else {
            profile.innerHTML = `<img src='../ASSETS/profile.png' alt='Profile Photo' draggable='false'><span>Signin</span>`
            profile.href = '/signin.html'
        }
    } catch (error) {
        console.error('Error fetching recipes:', error)
    }
}

async function fetchRecipes() {
    try {
        const response = await fetch('/api/recipes')
        let recipes = await response.json()
        const path = window.location.pathname;
        const pathSegments = path.split('/');
        const userId = pathSegments[pathSegments.length - 1]

        recipes = recipes.filter(recipe => recipe.userId == userId)

        const recipesList = document.getElementById('recipes')
        recipesList.innerHTML = '';

        recipes.forEach(recipe => {
            const link = document.createElement('a')
            link.href = `/recipe.html/${recipe.id}`
            link.className = 'recipe'
            link.innerHTML = `<h3>${recipe.name}</h3> <input type='checkbox' id='${recipe.id}'>`
            recipesList.appendChild(link)
        })
    } catch (error) {
        console.error('Error fetching recipes:', error)
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

        const listButtons = document.querySelectorAll('input[type="checkbox"]');
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
fetchRecipes().then(() => {
    checkRecipesList().then(() => {
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => addToList(checkbox));
        });
    });
});