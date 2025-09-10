const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const mongoose = require('mongoose')
require('dotenv').config()

const User = require('./models/user')
const jwt = require('jsonwebtoken')

const { schema } = require('./schemas/schema')

const MONGODB_URI = process.env.MONGODB_URI
console.log('conecting to MongoDB')

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch(error => console.log('error connection to MongoDB:', error.message))

const server = new ApolloServer(schema)

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodeToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodeToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
