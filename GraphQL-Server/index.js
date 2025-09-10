const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')

const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { expressMiddleware } = require('@as-integrations/express5')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const express = require('express')
const cors = require('cors')
const http = require('http')

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

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          const decodeToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
          const currentUser = await User.findById(decodeToken.id)
          return { currentUser }
        }
      },
    })
  )

  const PORT = 4000

  httpServer.listen(PORT, () => console.log(`Server is now running on http://localhost:${PORT}`))
}

start()
