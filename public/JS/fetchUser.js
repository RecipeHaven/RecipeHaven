export async function fetchUserData() {
    try {
        // Faz o fetch do userId a partir da sessão no servidor
        const sessionResponse = await fetch('/api/user');
        if (!sessionResponse.ok) {
            console.log('Utilizador não autenticado');
            redirectToSignin();
            return;
        }

        const sessionData = await sessionResponse.json();
        const userId = sessionData.userId;

        // Busca todos os utilizadores
        const usersResponse = await fetch('/api/users');
        let users = await usersResponse.json();
        let user = users.find(user => user.Id == userId);

        const profile = document.getElementById('profile');

        if (window.location.pathname.includes('/user.html')) {
            const path = window.location.pathname;
            const pathSegments = path.split('/');
            const currentUserId = pathSegments[pathSegments.length - 1];

            const currentUser = users.find(user => user.Id == currentUserId);
            const loggedInUser = users.find(user => user.Id == userId);

            document.title = `Recipe Haven - ${currentUser?.Name || 'User'}`;

            const name = document.querySelector('#profile-info div h1');
            const email = document.querySelector('#profile-info div p');

            if (currentUserId == userId) {
                const logout = document.createElement('a');
                logout.textContent = 'Logout';
                logout.href = '/api/logout';
                document.querySelector('#profile-info div').appendChild(logout);

                document.querySelector('#profile-info div a').addEventListener('click', async () => {
                    await fetch('/api/logout', { method: 'POST' });
                    redirectToSignin();
                });
            }

            if (currentUser != null) {
                name.textContent = currentUser.Name;
                email.textContent = currentUser.Email;
            }

            if (userId != null) {
                profile.innerHTML = `<img src='../ASSETS/profile.png' alt='Profile Photo' draggable='false'><span>${loggedInUser.Name}</span>`;
                profile.href = `/user.html/${userId}`;
            } else {
                profile.innerHTML = `<img src='../ASSETS/profile.png' alt='Profile Photo' draggable='false'><span>Signin</span>`;
                profile.href = '/signin.html';
            }
        } else {
            if (userId != null) {
                profile.innerHTML = `<img src='ASSETS/profile.png' alt='Profile Photo' draggable='false'><span>${user.Name}</span>`;
                profile.href = `/user.html/${userId}`;
            } else {
                profile.innerHTML = `<img src='ASSETS/profile.png' alt='Profile Photo' draggable='false'><span>Signin</span>`;
                profile.href = '/signin.html';
            }
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        redirectToSignin();
    }
}

function redirectToSignin() {
    window.location.replace('/signin.html');
}
