import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Recomendation = ({ favoriteGenre }) => {
  const result = useQuery(ALL_BOOKS)
  if (result.loading) return <div>loading...</div>

  const books = result.data.allBooks

  const favoritesBooks = books.filter(book => {
    if (book.genres.includes(favoriteGenre)) {
      return book
    }
  })

  return (
    <div>
      <h2>Recomendation</h2>
      <p>Books in your favorite genre: {favoriteGenre}</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {favoritesBooks.map(a => (
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

export default Recomendation
