import { useMutation } from '@apollo/client/react'
import { useState } from 'react'
import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries'

const SetBirthForm = () => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')

  const [updateAuthor, result] = useMutation(UPDATE_AUTHOR, {
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
        <label htmlFor='name'>
            name:
          <input name='name' type='text' value={name} onChange={e => setName(e.target.value)} />
        </label>
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
