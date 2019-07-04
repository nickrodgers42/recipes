const express = require('express')
const recipeRouter = express.Router()
const pool = require('../pool')

recipeRouter.route('/')
  .get(async (req, res) => {
    let query = {
      text: 'SELECT id, name FROM recipes'
    }
    let response = await pool.query(query).catch(err => { console.log(err) });
    res.send({ count: response.rows.length, recipes: response.rows })
  })

recipeRouter.route('/:recipeId')
  .get(async (req, res) => {
    let query = {
      text: `SELECT r.id AS recipe_id, r.name AS title, r.creation_date AS creation_date,
              r.source, u.id AS author_id, u.name AS author, i.ingredients, d.directions
              FROM recipes AS r
              LEFT JOIN users AS u ON (u.id = r.created_by_id)
              INNER JOIN (
                SELECT array_agg(value ORDER BY position) AS ingredients, recipe_id
                FROM ingredients
                GROUP BY recipe_id
              ) AS i ON (i.recipe_id = r.id)
              INNER JOIN (
                SELECT array_agg(value ORDER BY position) AS directions, recipe_id
                FROM directions
                GROUP BY recipe_id
              ) AS d ON (d.recipe_id = r.id)
              WHERE r.id = $1;`,
      values: [req.params.recipeId]
    }
    let response = await pool.query(query).catch(err => { console.log(err) })
    res.send({ count: response.rows.length, recipe: response.rows[0] })
  })


module.exports = recipeRouter
