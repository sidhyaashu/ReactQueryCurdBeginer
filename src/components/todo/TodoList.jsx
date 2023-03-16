import React,{useState} from 'react'
import { useQuery,useMutation,useQueryClient } from 'react-query'
import { getTodos,addTodo,updateTodo,deletTodo } from '../../api/todosApi.js'


const TodoList = () => {

    const [newTodo,setNewTodo] = useState('')
    const queryClient = useQueryClient()

    const {
        isLoading,
        isError,
        error,
        data:todos
    } = useQuery('todos',getTodos)

    const addTodoMutation = useMutation(addTodo,{
        onSuccess:()=>{
            //Invalidate cache and reFetch 
            queryClient.invalidateQueries('todos')
        }
    })

    const addDeleteMutation = useMutation(deletTodo,{
        onSuccess:()=>{
            //Invalidate cache and reFetch 
            queryClient.invalidateQueries('todos')
        }
    })

    const updateTodoMutation = useMutation(updateTodo,{
        onSuccess:()=>{
            //Invalidate cache and reFetch 
            queryClient.invalidateQueries('todos')
        }
    })


    const handleSubmit = (e)=>{
        e.preventDefault()
        addDeleteMutation.mutate({
            userId:1,
            title:newTodo,
            completed:false
        })
        setNewTodo('')
    }


    const newItemSubmitted =<form onSubmit={handleSubmit} >
        <label htmlFor="newTodo">Enter a new todo item</label>
        <div className="newTodo">
            <input 
            type="text"
            id='newTodo'
            value={newTodo}
            onChange={(e)=>setNewTodo(e.target.value)} />
        </div>
        <button type='sunmit'>Save</button>
    </form>

    let content;
    if(isLoading){
        content = <p>Loading...</p>
    }else if(isError){
        content = <p>{error.message}</p>
    }else{
        content = JSON.stringify(todos)
    }


  return (
    <main>
        <h3>Todo List</h3>
        {newItemSubmitted}
        {content}
    </main>
  )
}

export default TodoList
