import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { getAnecdotes, updateAnecdote } from './requests'
import { useNotificationDispatch } from "./NotificationContext"


const App = () => {

  const notificationDispatch = useNotificationDispatch()
  const queryClient =  useQueryClient() 

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      let anecdotes = queryClient.getQueryData(['anecdotes'])
      const ind = anecdotes.findIndex(x => x.id==updatedAnecdote.id)
      anecdotes[ind] = updatedAnecdote
      queryClient.setQueryData(['anecdotes'], anecdotes)
      console.log("updated data")
      notificationDispatch({type:"SET",payload:{message:`you voted ${updatedAnecdote.content}`}})
      setTimeout(() => notificationDispatch({type:"CLEAR"}),5000)
    }
  })

  const handleVote = (anecdote) => {
    console.log('vote')
    const updatedAnecdote = {...anecdote, votes: anecdote.votes +1}
    voteMutation.mutate(updatedAnecdote)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  })

  console.log(JSON.parse(JSON.stringify(result)))

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to error</div>
  }
  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
