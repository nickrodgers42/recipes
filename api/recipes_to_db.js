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

const insertRecipe = (recipe) => {
  try {

  } 
  catch (err) {

  }
}

const filePath = path.join(__dirname, '../greatGrandmasRecipes/')
fs.readdir(filePath, {withFileTypes: true}, (err, files) => {
  files.forEach(file => {
    if (file.isDirectory()) {
      const subdir = path.join(filePath, file.name)
      fs.readdir(subdir, {withFileTypes: true}, (err, recipes) => {
        recipes.forEach(async file => {
          if (file.isFile()) {
            const recipePath = path.join(subdir, file.name)
            const recipe = await readRecipe(recipePath)
            insertRecipe(recipe)
          }
        })
      })
    }
  })
})
