import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = () => {
  const [filter, setFilter] = useState('all genres')

  const result = useQuery(ALL_BOOKS)
  if (result.loading) return <div>loading...</div>

  const books = result.data.allBooks

  const allGenres = books.reduce((genresAcc, book) => {
    book.genres.map(genre => {
      if (!genresAcc.includes(genre)) {
        genresAcc.push(genre)
      }
    })
    return genresAcc
  }, [])

  console.log(filter)

  const booksFiltered =
    filter === 'all genres'
      ? books
      : books.filter(book => {
          if (book.genres.includes(filter)) {
            return book
          }
        })

  console.log(booksFiltered)

  return (
    <div>
      <h2>books</h2>
      <p>Filtering by genre: {filter}</p>
      <div>
        {allGenres.map((genre, index) => {
          return (
            <button key={index} onClick={() => setFilter(genre)}>
              {genre}
            </button>
          )
        })}
        <button onClick={() => setFilter('all genres')}>ALL GENRES</button>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksFiltered.map(a => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
