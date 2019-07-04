const path = require('path')
const fs = require('fs')
const { Pool } = require('pg')

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
  let title = data.match(/^#.*$/gm)[0].substring(2).trim()
  let author = data.match(/^a:.*$/gm)[0].substring(2).trim()
  if (author === '') author = 'Great Grandma'
  let ingredients = data.match(/^\*.*$/gm)
  ingredients ? ingredients.forEach((ingredient, index) => ingredients[index] = ingredient.replace('*', '').trim()) : ingredients = []

  let directions = data.match(/^>.*$/gm)
  directions ? directions.forEach((direction, index) => directions[index] = direction.replace('>', '').trim()) : directions = []
  const recipe = new Recipe(title, author, ingredients, directions, source, tags)
  return recipe
}

const getAuthorId = async (client, author) => {
  const authorQuery = {
    text: 'SELECT id FROM users WHERE name = $1',
    values: [author]
  }
  let res = await client.query(authorQuery)
  if (!res.rows[0]) {
    const insertQuery = {
      text: 'INSERT INTO users (name) VALUES ($1) RETURNING id',
      values: [author]
    }
    res = await client.query(insertQuery)
  }
  return res.rows[0].id
}

const getRecipeId = async (client, title, authorId, source) => {
  const recipeQuery = {
    text: 'INSERT INTO recipes (name, created_by_id, creation_date, source) VALUES ($1, $2, $3, $4) RETURNING id',
    values: [title, authorId, new Date(), source]
  }
  const res = await client.query(recipeQuery)
  return res.rows[0].id
}

const insertDirections = async (client, directions, recipeId) => {
  if (directions.length === 0) return
  const directionsQuery = {
    text: 'INSERT INTO directions (value, position, recipe_id) VALUES ',
    values: []
  }
  let count = 1
  let textArr = []
  for (const direction of directions) {
    textArr.push('($' + count + ', $' + (count + 1) + ', $' + (count + 2) + ')')
    directionsQuery.values.push(direction, directions.indexOf(direction) + 1, recipeId)
    count += 3
  }
  directionsQuery.text += textArr.join(', ')
  await client.query(directionsQuery)
  return
}

const insertIngredients = async (client, ingredients, recipeId) => {
  if (ingredients.length === 0) return
  const ingredientsQuery = {
    text: 'INSERT INTO ingredients (value, position, recipe_id) VALUES ',
    values: []
  }
  let count = 1
  let textArr = []
  for (const ingredient of ingredients) {
    textArr.push('($' + count + ', $' + (count + 1) + ', $' + (count + 2) + ')')
    ingredientsQuery.values.push(ingredient, ingredients.indexOf(ingredient) + 1, recipeId)
    count += 3
  }
  ingredientsQuery.text += textArr.join(', ')
  await client.query(ingredientsQuery)
  return
}

const insertRecipe = async (client, recipe) => {
  const authorId = await getAuthorId(client, recipe.author)
  const source = recipe.source || null;
  const recipeId = await getRecipeId(client, recipe.title, authorId, source)
  await insertIngredients(client, recipe.ingredients, recipeId)
  await insertDirections(client, recipe.directions, recipeId)
  return
}

const main = async () => {
  const topPath = path.join(__dirname, '../greatGrandmasRecipes/')
  const recipes = []
  const topDir = fs.readdirSync(topPath, { withFileTypes: true })
  const client = await pool.connect()
  console.log('Reading recipes...')
  for (const subDir of topDir) {
    if (subDir.isDirectory()) {
      const subDirPath = path.join(topPath, subDir.name)
      const subDirFiles = fs.readdirSync(subDirPath, { withFileTypes: true })
      for (const recipeFile of subDirFiles) {
        if (recipeFile.isFile()) {
          const recipePath = path.join(subDirPath, recipeFile.name)
          const recipe = await readRecipe(recipePath)
          recipes.push(recipe)
        }
      }
    }
  }

  console.log('Adding Recipes to db...')
  try {
    await client.query('BEGIN TRANSACTION')
    for (const recipe of recipes) {
      await insertRecipe(client, recipe)
    }
  }
  catch (err) {
    console.log('Error: ' + err)
    await client.query('ROLLBACK;')
  }
  finally {
    await client.query('COMMIT;')
    console.log('Recipes added successfully.')
  }

  client.release()
  return
}

main()
