const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
console.log('conecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch(error => console.log('error connection to MongoDB:', error.message))

const typeDefs = `
    type Book {
        title: String!
        author: Author!
        published: Int
        genres: [String!]!
        id: ID!
    }

    type Author {
        name: String!
        born: Int
        id: ID!
        bookCount: Int
    }

    type Query {
        bookCount: Int!

        authorCount: Int!

        allBooks (author: String, genre: String) : [Book!]!

        allAuthors: [Author!]!
    }

    type Mutation {
        addBook(
          title: String!
          author: String!
          published: Int
          genres: [String]
        ) : Book

        editAuthor(
          name: String!
          setBornTo: Int!
        ) : Author
    }
`

const resolvers = {
  Query: {
    bookCount: async () => await Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let filter = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) {
          return []
        }
        filter.author = author._id
      }

      if (args.genre) {
        filter.genres = { $all: [args.genre] }
      }

      const books = await Book.find(filter).populate('author')
      return books
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      const authorsWhithBookCount = await Promise.all(
        authors.map(async author => {
          const bookCount = await Book.countDocuments({ author: author._id })

          return { ...author._doc, bookCount }
        })
      )

      return authorsWhithBookCount
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      try {
        let author = await Author.findOne({ name: args.author })
        if (!author) {
          author = new Author({ name: args.author, born: null })
          await author.save()
        }
        const book = new Book({ ...args, author })
        await book.save()

        return book
      } catch (error) {
        console.log('Error creating book: ', error)
      }
    },

    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) return null

      author.born = args.setBornTo
      await author.save()

      const bookCount = await Book.countDocuments({ author: author._id })
      return { ...author._doc, bookCount }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
