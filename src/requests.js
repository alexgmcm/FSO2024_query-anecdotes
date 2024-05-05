import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () =>
  axios.get(baseUrl).then(res => res.data)

export const createAnecdote = newAnecdote =>
    axios.post(baseUrl, newAnecdote).then(res => res.data)

export  const updateAnecdote = async (updatedAnecdote) => {
    const url = baseUrl + `/${updatedAnecdote.id}`
    const response = await axios.put(url,updatedAnecdote) 
    console.log(response.data)
    return response.data
}