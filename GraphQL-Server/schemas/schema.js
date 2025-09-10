import { makeExecutableSchema } from '@graphql-tools/schema'

import { typeDef as BookTypeDef } from './book'
import { typeDef as AuthorTypeDef } from './author'
import { typeDef as UserTypeDef } from './user'

const Book = require('../models/book')
const Author = require('../models/author')

const Query = `
    type Query {
        bookCount: Int!

        authorCount: Int!

        allBooks (author: String, genre: String) : [Book!]!

        allAuthors: [Author!]!

        me: User
    }
`

const Mutation = `
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

        createUser(
          username: String!
          favoriteGenre: String!
        ): User

        login(
          username: String!
          password: String!
        ): LoginResponse
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
          return { ...author.toObject(), id: author._id.toString(), bookCount }
        })
      )
      return authorsWhithBookCount
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (args.title.length < 5 || args.title.length < 4) {
        throw new GraphQLError('book title or author name are too short', {
          extensions: {
            code: 'BAD_USER_INPUT',
            argumentName: ['title', 'author'],
          },
        })
      }

      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

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
        if (error.name === 'ValidationError') {
          throw new GraphQLError('Creating book failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              error: error.errors,
            },
          })
        } else {
          console.log('ERROR:', error.message)
        }
      }
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        throw new GraphQLError('Author no found', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      }

      try {
        author.born = args.setBornTo
        await author.save()
        const bookCount = await Book.countDocuments({ author: author._id })
        return { ...author.toObject(), id: author._id.toString(), bookCount }
      } catch (error) {
        if (error.name === 'ValidationError') {
          throw new GraphQLError('Creating book failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              error: error.errors,
            },
          })
        } else {
          console.log('ERROR:', error.message)
        }
      }
    },

    createUser: async (root, args) => {
      if (args.username.length < 3) {
        throw new GraphQLError('username are too short', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
          },
        })
      }

      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

      try {
        await user.save()
        return user
      } catch (error) {
        if (error.name === 'ValidationError') {
          throw new GraphQLError('Creating user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              error: error.errors,
            },
          })
        } else {
          console.log('ERROR:', error.message)
        }
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || 'secret' !== args.password) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }
      const token = jwt.sign(userForToken, process.env.JWT_SECRET)
      return { token: { value: token }, user }
    },
  },
}

export const schema = makeExecutableSchema({
  typeDefs: [Query, Mutation, BookTypeDef, AuthorTypeDef, UserTypeDef],
  resolvers,
})
