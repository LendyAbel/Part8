import { useQuery, useSubscription } from '@apollo/client/react'
import { ALL_BOOKS, BOOKS_BY_GENRE, BOOK_ADDED } from '../queries'

const Books = ({ filter, setFilter }) => {
  const result = useQuery(ALL_BOOKS)
  const resultFilter = useQuery(BOOKS_BY_GENRE, { variables: filter !== 'all genres' ? { genre: filter } : null })

  useSubscription(BOOK_ADDED, {
    onData: ({data})=>{
      console.log(data)
      window.alert(`New book have been added: "${data.data.bookAdded.title}". Reload page to see the change`)
    }
  })

  if (result.loading) return <div>loading...</div>
  if (resultFilter.loading) return <div>loading...</div>

  const books = result.data.allBooks
  const booksFiltered = resultFilter.data.allBooks

  const allGenres = books.reduce((genresAcc, book) => {
    book.genres.map(genre => {
      if (!genresAcc.includes(genre)) {
        genresAcc.push(genre)
      }
    })
    return genresAcc
  }, [])


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
