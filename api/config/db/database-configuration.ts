import * as Knex from 'knex'

const environment = process.env.NODE_ENV || 'development'
const config = require('../knexfile.ts')[environment]

export const knex: Knex = Knex(config)

