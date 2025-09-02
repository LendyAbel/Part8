import { useState } from 'react'

const LoginForm = ({ setUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div>
      <h2>Login</h2>
      <div>
        <label htmlFor='username'>Username:</label>
        <input name='username' type='text' onChange={e => setUsername(e.target.value)} value={username} />
      </div>
      <div>
        <label htmlFor='password'>Password:</label>
        <input name='password' type='password' onChange={e => setPassword(e.target.value)} value={password} />
      </div>
    </div>
  )
}

export default LoginForm
