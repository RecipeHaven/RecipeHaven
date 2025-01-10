export async function fetchUserData() {
    try {
        const userId = localStorage.getItem('userId')

        const usersResponse = await fetch('/api/users')
        let users = await usersResponse.json()
        let user = users.find(user => user.Id == userId)

        const profile = document.getElementById('profile')

        if(window.location.pathname.includes('/user.html')) {
            const path = window.location.pathname;
            const pathSegments = path.split('/');
            const userId = pathSegments[pathSegments.length - 1]

            const user2Id = localStorage.getItem('userId')

            const usersResponse = await fetch('/api/users')
            let users = await usersResponse.json()
            let currentUser = users.find(user => user.Id == userId)
            let user2 = users.find(user => user.Id == user2Id)

            document.title = `Recipe Haven - ${currentUser.Name}`
            
            const name = document.querySelector('#profile-info div h1')
            const email = document.querySelector('#profile-info div p')

            if(userId == user2Id) {
                const logout = document.createElement('a')
                logout.textContent = 'Logout'
                logout.href = '/logout'
                document.querySelector('#profile-info div').appendChild(logout)

                document.querySelector('#profile-info div a').addEventListener('click', () => {
                    localStorage.removeItem('userId')
                })
            }

            if(currentUser != null){
                name.textContent =  currentUser.Name
                email.textContent =  currentUser.Email
            }

            if(user2Id != null) {
                profile.innerHTML = `<img src='../ASSETS/profile.png' alt='Profile Photo' draggable='false'><span>${user2.Name}</span>`
                profile.href = `/user.html/${user2.Id}`
            } else {
                profile.innerHTML = `<img src='../ASSETS/profile.png' alt='Profile Photo' draggable='false'><span>Signin</span>`
                profile.href = '/signin.html'
            }
        }
        else {
            if(userId != null) {
                profile.innerHTML = `<img src='ASSETS/profile.png' alt='Profile Photo' draggable='false'><span>${user.Name}</span>`
                profile.href = `/user.html/${userId}`
            } else {
                profile.innerHTML = `<img src='ASSETS/profile.png' alt='Profile Photo' draggable='false'><span>Signin</span>`
                profile.href = '/signin.html'
            }
        }
    } catch (error) {
        console.error('Error fetching user data:', error)
    }
}