import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query AllAuthors {
    allAuthors {
      name
      bookCount
      born
      id
    }
  }
`

export const ALL_BOOKS = gql`
  query AllBooks {
    allBooks {
      id
      title
      published
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

export const BOOKS_BY_GENRE = gql`
  query AllBooks($genre: String) {
    allBooks(genre: $genre) {
      id
      title
      published
      genres
      author {
        name
        born
        id
        bookCount
      }
    }
  }
`

export const CREATE_BOOK = gql`
  mutation CreateBook($title: String!, $author: String!, $published: Int, $genres: [String]) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      author {
        name
        born
        id
        bookCount
      }
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
      name
      id
      born
      bookCount
    }
  }
`

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token {
        value
      }
      user {
        favoriteGenre
      }
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      author {
        name
        born
        id
        bookCount
      }
      published
      genres
      id
    }
  }
`
