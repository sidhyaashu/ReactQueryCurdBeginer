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
    } = useQuery('todos',getTodos,{
        select:data=>data.sort((a,b)=>b.id -a.id)
    })

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
        addTodoMutation.mutate({
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
        <button type='submit' >Save</button>
    </form>

    let content;
    if(isLoading){
        content = <p>Loading...</p>
    }else if(isError){
        content = <p>{error.message}</p>
    }else{
        content = todos.map((todo)=>{
            return(
                <article key={todo.id}>
                    <div className="todo">
                        <input
                        className='checkboxInput'
                        type="checkbox"
                        checked={todo.completed}
                        id={todo.id}
                        onChange={()=>
                            updateTodoMutation.mutate({
                                ...todo,completed:!todo.completed
                            })
                        }
                         />
                        <label htmlFor={todo.id}>{todo.title}</label>
                        <small>{todo.id}</small>
                    </div>
                    <button className='trash'onClick={()=>addDeleteMutation.mutate({id:todo.id})} >delete</button>
                </article>
            )
        })
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
