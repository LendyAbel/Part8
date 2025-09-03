import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { LOGIN } from '../queries'
import { useNavigate } from 'react-router'

const LoginForm = ({ setToken, setFavorite }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const [login, result] = useMutation(LOGIN)

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.token.value
      const favoriteGenre = result.data.login.user.favoriteGenre
      setToken(token)
      setFavorite(favoriteGenre)
      localStorage.setItem('userLoggedToken', token)
      navigate('/books')
    }
  }, [result.data, setToken, navigate])

  const handleSubmit = e => {
    e.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='username'>Username:</label>
          <input name='username' type='text' onChange={e => setUsername(e.target.value)} value={username} />
        </div>
        <div>
          <label htmlFor='password'>Password:</label>
          <input name='password' type='password' onChange={e => setPassword(e.target.value)} value={password} />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm
