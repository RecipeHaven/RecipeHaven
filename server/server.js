const express = require('express')
const session = require('express-session')
const path = require('path')
const routes = require('./routes') // Importa as rotas

const app = express()
const PORT = 3000

// Serve arquivos estáticos da pasta 'public'
app.use(session({
    secret: 'password', // Usa uma chave secreta para assinar o ID da sessão
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Define como `true` se usares HTTPS em produção
}))

app.use(express.static(path.join(__dirname, '../public')))

// Usa as rotas definidas em routes.js
app.use(routes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})