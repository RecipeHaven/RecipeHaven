import { createRecipesCard } from './recipesCard.js'
import { fetchUserData } from './fetchUser.js'

const response = await fetch('/api/recipes')
let recipes = await response.json()

fetchUserData()
createRecipesCard(recipes)