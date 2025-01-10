async function signin() {
    try {
        const response = await fetch('/api/users')
        let users = await response.json()
        
        let nameValue = document.getElementById('name').value
        let passValue = document.getElementById('pass').value
        
        const user = users.find(user => user.Name === nameValue && user.Password === passValue)

        if (user) {
            localStorage.setItem('userId', user.Id)
            window.location.replace('/')
        } else {
            console.log("Nenhum utilizador encontrado com as credenciais fornecidas.")
        }
    } catch (error) {
        console.error('Error fetching recipes:', error)
    }
}