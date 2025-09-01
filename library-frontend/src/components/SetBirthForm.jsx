import { useMutation } from '@apollo/client/react'
import { useState } from 'react'
import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries'

const SetBirthForm = ({ authors }) => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  const handleSubmit = e => {
    e.preventDefault()
    updateAuthor({ variables: { name, setBornTo: Number(year) } })
    setName('')
    setYear('')
  }

  return (
    <div>
      <h3>Set birthyear:</h3>
      <form onSubmit={handleSubmit}>
        <select onChange={e => setName(e.target.value)}>
          {authors?.map(a => (
            <option key={a.id}>{a.name}</option>
          ))}
        </select>{' '}
        <label htmlFor='year'>
          born:
          <input name='year' type='text' value={year} onChange={e => setYear(e.target.value)} />
        </label>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default SetBirthForm
