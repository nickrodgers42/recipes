const path = require('path')
const fs = require('fs')
const { Pool }= require('pg')

const pool = new Pool();

class Recipe {
  constructor(title, author, ingredients, directions, source, tags) {
    this.title = title
    this.author = author
    this.ingredients = ingredients
    this.directions = directions
    this.source = source
    this.tags = tags
  }
}

const readRecipe = (recipePath) => {
  const parentDir = path.join(recipePath, '../')
  const section = path.basename(parentDir).replace(/([a-z])([A-Z])/g, '$1 $2')
  const source = "Great Grandma's Gracious Goodness"
  const tags = [section]
  const data = fs.readFileSync(recipePath, 'utf8')
  let title = data.match(/^#.*$/gm)[0].substring(2)
  let author = data.match(/^a:.*$/gm)[0].substring(2)
  let ingredients = data.match(/^\*.*$/gm)
  ingredients && ingredients.forEach((ingredient, index) => ingredients[index] = ingredient.replace('*', '').trim())
  let directions = data.match(/^>.*$/gm)
  directions && directions.forEach((direction, index) => directions[index] = direction.replace('>', '').trim())
  const recipe = new Recipe(title, author, ingredients, directions, source, tags)
  return recipe
}

const addUsers = async (client, recipes) => {
  const users = []
  for (const recipe of recipes) {
    if (recipe.author && recipe.author !== '') {
      if (!users.includes(recipe.author)) {
        users.push(recipe.author)
      }
    }
  }
  try {
    await client.query('BEGIN TRANSACTION;')
    for (const user of users) {
      const query = {
        text: 'INSERT INTO users (name) VALUES ($1);',
        values: [user]
      }
      const res = await client.query(query)
    }
    await client.query('COMMIT;')
  }
  catch (err) {
    console.log('Error: ', err)
    await client.query('ROLLBACK;')
  }
}

const main = async () => {
  const topPath = path.join(__dirname, '../greatGrandmasRecipes/')
  const recipes = []
  const topDir = fs.readdirSync(topPath, {withFileTypes: true})
  const client = await pool.connect()
  for (const subDir of topDir) {
    if (subDir.isDirectory()) {
      const subDirPath = path.join(topPath, subDir.name)
      const subDirFiles = fs.readdirSync(subDirPath, {withFileTypes: true})
      for (const recipeFile of subDirFiles) {
        if (recipeFile.isFile()) {
          const recipePath = path.join(subDirPath, recipeFile.name)
          const recipe = await readRecipe(recipePath)
          recipes.push(recipe)
        }
      }
    }
  }
  addUsers(client, recipes)
  // addRecipes(client, recipes)
  client.release()
  return
}

main()
