import { useMutation } from '@apollo/client/react'
import { useState } from 'react'
import { ALL_AUTHORS, ALL_BOOKS, BOOKS_BY_GENRE, CREATE_BOOK } from '../queries'

const NewBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook, result] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    update: (cache, response) => {
      const newBook = response.data.addBook
      newBook.genres.forEach(genre => {
        cache.updateQuery({ query: BOOKS_BY_GENRE, variables: { genre } }, ( data ) => {
          if (!data) {
            return data
          }
          return { allBooks: data.allBooks.concat(newBook) }
        })
      })
    },
    onError: error => {
      console.log('FULL ERROR OBJECT', error)
      console.log('ERROR', error.errors[0].extensions)
    },
  })

  const submit = async event => {
    event.preventDefault()

    const book = { title, author, published: published ? Number(published) : null, genres }

    addBook({ variables: book })
    console.log('add book...')

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    if (genre) {
      setGenres(genres.concat(genre))
      setGenre('')
    }
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author
          <input value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          published
          <input type='number' value={published} onChange={({ target }) => setPublished(target.value)} />
        </div>
        <div>
          <input value={genre} onChange={({ target }) => setGenre(target.value)} />
          <button onClick={addGenre} type='button'>
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook
