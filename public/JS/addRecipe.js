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
            profile.innerHTML = `<img src='ASSETS/profile.png' alt='Profile Photo' draggable='false'><span>${user.Name}</span>`
            profile.href = `/user.html/${userId}`
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
    const sessionResponse = await fetch('/api/user');
    const sessionData = await sessionResponse.json();
    const userId = sessionData.userId;
    const categoryId = document.getElementById('category').value

    const ingredients = Array.from(document.querySelectorAll('#ingredients input'))
                            .map(input => input.value)
                            .join(', ')

    const imageFile = document.getElementById('file-input').files[0]
    // const image = document.getElementById('file-input').files[0]?.name

    // Se a imagem não for selecionada, não tenta fazer o upload
    let correctedImageUrl = ''
    if (imageFile) {
        const formData = new FormData()
        formData.append('image', imageFile)

        try {
            const uploadResponse = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData,
            })
            if (uploadResponse.ok) {
                const uploadResult = await uploadResponse.json()
                const imageUrl = uploadResult.imageUrl
                const imageName = imageUrl.split('images/')[1];
                correctedImageUrl = `https://fatphotos.s3.eu-north-1.amazonaws.com/images/${imageName}`
                
            } else {
                console.error('Erro ao enviar a imagem:', await uploadResponse.text())
                alert('Falha ao fazer upload da imagem.')
                return // Interrompe o fluxo se o upload falhar
            }
        } catch (error) {
            console.error('Erro ao enviar a imagem:', error)
            alert('Falha ao fazer upload da imagem.')
            return
        }
    }     
    const recipeData = {
        name,
        image: correctedImageUrl,
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

document.getElementById('file-input').addEventListener('change', function() {
    const label = document.getElementById('custom-file-label')
    if (this.files.length > 0) {
      label.textContent = this.files[0].name
    } else {
      label.textContent = 'Select Image'
    }
})