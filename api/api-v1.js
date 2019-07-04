const express = require('express')
const api = new express.Router()
const recipeRouter = require('./routes/recipeRouter')

api.use('/recipes', recipeRouter)

module.exports = api
