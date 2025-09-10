const UserTypeDef = `
    type Token {
      value: String!
    }

    type User {
      username: String!
      favoriteGenre: String!
      id: ID!
    }

    type LoginResponse {
      token: Token!
      user: User!
    }
`

const resolvers = {}

module.exports = { UserTypeDef }
