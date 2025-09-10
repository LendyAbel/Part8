const { makeExecutableSchema } = require('@graphql-tools/schema')
const { Book } = require('./book.js')
const { Author } = require('./author.js')
const { User } = require('./user.js')
const { resolvers } = require('./resolvers')

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

const Subscriptions = `
    type Subscription {
      bookAdded: Book!
    }
`

const schema = makeExecutableSchema({
  typeDefs: [Query, Mutation, Subscriptions, Book, Author, User],
  resolvers,
})

module.exports = { schema }
