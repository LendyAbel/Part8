const AuthorTypeDef = `
    type Author {
        name: String!
        born: Int
        id: ID!
        bookCount: Int
    }
`
const resolvers = {}

module.exports = { AuthorTypeDef }
