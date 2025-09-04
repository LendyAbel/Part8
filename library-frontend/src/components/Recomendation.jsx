import { useQuery } from '@apollo/client/react'
import { BOOKS_BY_GENRE } from '../queries'

const Recomendation = ({ favoriteGenre }) => {
  const resultFilter = useQuery(BOOKS_BY_GENRE, { variables: { genre: favoriteGenre } })
  if (resultFilter.loading) return <div>loading...</div>

  const favoritesBooks = resultFilter.data.allBooks

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
