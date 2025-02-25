async function login() {
    let name = document.getElementById('name').value
    let email = document.getElementById('email').value
    let password = document.getElementById('pass').value
    
    const userData = {
        name,
        email,
        password
    }

    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        }) 

        if(response.ok) {
            const usersResponse = await fetch('/api/users')
            let users = await usersResponse.json()
            let user = users.find(user => user.Name == name)
            let userId = user.Id

            const listData = {
                userId
            }

            try {
                const response = await fetch('/api/lists', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(listData)
                }) 

                if(response.ok) {
                    window.location.replace('/login.html')
                }
            } catch (error) {
                console.log('An error occurred')
            }
        }
    } catch (error) {
        console.log('An error occurred')
    }
}