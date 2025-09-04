import { useEffect, useState } from 'react'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recomendation from './components/Recomendation'

const App = () => {
  const [token, setToken] = useState(null)
  const [userFavoriteGenre, setUserFavoriteGenre] = useState('')
  const navigate = useNavigate()

  const handleLogout = () => {
    setToken('')
    localStorage.clear()
    navigate('/books')
  }

  useEffect(() => {
    const token = localStorage.getItem('userLoggedToken')
    const favoriteGenre = localStorage.getItem('userLogeedFavoriteGenre')
    if (token) {
      setToken(token)
      setUserFavoriteGenre(favoriteGenre)
    }
  }, [])

  return (
    <div>
      <div>
        <Link to={'/books'}>
          <button>books</button>
        </Link>
        <Link to={'/authors'}>
          <button>authors</button>
        </Link>
        {!token ? (
          <LoginForm setToken={setToken} setFavorite={setUserFavoriteGenre} />
        ) : (
          <>
            <Link to={'/books/newbook'}>
              <button>add book</button>
            </Link>
            <Link to={'/recommend'}>
              <button>recommend</button>
            </Link>
            <button onClick={handleLogout}>logout</button>
          </>
        )}
      </div>

      <Routes>
        <Route path='/' element={<Navigate to={'/books'} replace />} />
        <Route path='/authors' element={<Authors token={token} />} />
        <Route path='/books' element={<Books />} />
        <Route path='/books/newbook' element={<NewBook />} />
        <Route path='/recommend' element={<Recomendation favoriteGenre={userFavoriteGenre} />} />
      </Routes>
    </div>
  )
}

export default App
