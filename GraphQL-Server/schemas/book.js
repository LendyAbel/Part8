const BookTypeDef = `
    type Book {
        title: String!
        author: Author!
        published: Int
        genres: [String!]!
        id: ID!
    }
`
const resolvers = {}

module.exports = { BookTypeDef }