async function checkUser() {
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
            profile.innerHTML = `<img src='ASSETS/profile.png' alt='Profile Photo' draggable='false'><span>Signin</span>`
            profile.href = '/signin.html'
        }
    } catch (error) {
        console.error('Error fetching recipes:', error)
    }
}

async function getPosts() {
    try {
        const reviewsUsers = await fetch('/api/Users')
        const users = await reviewsUsers.json()

        const response = await fetch('/api/recipes')
        const recipes = await response.json()

        const sessionResponse = await fetch('/api/user');
        const sessionData = await sessionResponse.json();
        const userId = sessionData.userId;

        const forumResponse = await fetch('/api/forum')
        const forum = await forumResponse.json()

        const container = document.getElementById('posts')

        forum.forEach(p => {
            const postsContainer = document.createElement('div')
            postsContainer.className = 'post-content'
            const username = document.createElement('a')
            let user = users.find(u => u.Id == p.UserId)
            username.href = `/user.html/${user.Id}`
            username.textContent = user.Name
            const post = document.createElement('p')
            if(/https?:\/\/[^\s]+/.test(p.Message)) {
                const recipeLink = p.Message.match(/https?:\/\/[^\s]+/g)
                const recipeId = recipeLink[0].split('/').pop()

                let recipe = recipes.find(r => r.Id == recipeId)

                const recipeElement = document.createElement('a')
                const image = document.createElement('img')
                const info = document.createElement('div')
                recipeElement.href = `/recipe.html/${recipe.Id}`
                recipeElement.className = 'recipe'
                info.innerHTML = `<h3>${recipe.Name}</h3> <input type='checkbox' id='${recipe.Id}'>`
                if(recipe.image != '') {
                    image.src = recipe.Image
                } else {
                    image.src = '../ASSETS/recipe.png'
                }

                recipeElement.appendChild(image)
                recipeElement.appendChild(info)
                
                post.innerHTML = p.Message.replace(/https?:\/\/[^\s]+/g, `<br><br>${recipeElement.outerHTML}`);
            } else {
                post.textContent = p.Message
            }
            const date = document.createElement('span')
            date.textContent = p.Date
            

            if(p.UserId == userId) {
                postsContainer.style.alignSelf = 'end'
                postsContainer.style.alignItems = 'end'
                date.style.alignSelf = 'start'
            }

            postsContainer.appendChild(username)
            postsContainer.appendChild(post)
            postsContainer.appendChild(date)
            container.appendChild(postsContainer)
        })
    } catch (error) {
        console.error('Error fetching forum posts:', error)
    }
}

async function addPost() {
    const post = document.getElementById('post').value.trim()
    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();
    
    const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    
    const date = `${day}/${month}/${year} ${formattedTime}`;
    
    const sessionResponse = await fetch('/api/user');
    const sessionData = await sessionResponse.json();
    const userId = sessionData.userId;

    const postData = {
        message: post,
        date,
        userId
    }

    try {
        const response = await fetch('/api/forum', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },  
            body: JSON.stringify(postData)
        })

        if(response.ok) {
            window.location.reload()
        } else {
            alert('Failed to add post')
        }
    } catch (error) {
        // alert('An error occurred')
        console.log('An error occurred')
    }
}

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

        const listButtons = document.querySelectorAll('div input[type="checkbox"]');
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

getPosts().then(() => {
    checkRecipesList().then(() => {
        document.querySelectorAll('div input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => handleCheckboxChange(checkbox));
        });
    });
});