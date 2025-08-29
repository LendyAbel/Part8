import { Routes, Route, Link, Navigate } from 'react-router'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

const App = () => {

  return (
    <div>
      <div>
        <Link to={'/authors'}>
          <button>authors</button>
        </Link>
        <Link to={'/books'}>
          <button>books</button>
        </Link>
        <Link to={'/books/newbook'}>
          <button>add book</button>
        </Link>
      </div>

      <Routes>
        <Route path='/' element={<Navigate to={'/authors'} replace/>} />
        <Route path='/authors' element={<Authors />} />
        <Route path='/books' element={<Books />} />
        <Route path='/books/newbook' element={<NewBook />} />
      </Routes>

    </div>
  )
}

export default App
