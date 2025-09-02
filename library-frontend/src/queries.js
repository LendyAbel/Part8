import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query AllAuthors {
    allAuthors {
      name
      id
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query AllBooks {
    allBooks {
      title
      published
      id
      genres
      author {
        name
        id
        born
        bookCount
      }
    }
  }
`
export const CREATE_BOOK = gql`
  mutation CreateBook($title: String!, $author: String!, $published: Int, $genres: [String]) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      author
      genres
      id
      published
      title
    }
  }
`

export const UPDATE_AUTHOR = gql`
  mutation EditAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      bookCount
      born
      id
      name
    }
  }
`
