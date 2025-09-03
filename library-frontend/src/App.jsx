import { useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'

const App = () => {
  const [token, setToken] = useState(null)

  const handleLogout = ()=>{
    setToken('')
    localStorage.clear()
  }

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
          <LoginForm setToken={setToken} />
        ) : (<>
            <Link to={'/books/newbook'}>
            <button>add book</button>
          </Link>
          <button onClick={handleLogout} >logout</button>
        </>
        )}
      </div>

      <Routes>
        <Route path='/' element={<Navigate to={'/books'} replace />} />
        <Route path='/authors' element={<Authors />} />
        <Route path='/books' element={<Books />} />
        <Route path='/books/newbook' element={<NewBook />} />
      </Routes>
    </div>
  )
}

export default App
