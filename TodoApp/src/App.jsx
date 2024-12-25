import { useEffect, useState } from 'react'
import Navbar from "./Components/Navbar"
import { v4 as uuidv4 } from "uuid"
import { FaEdit } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import './App.css'


const Todo = ({ todo, toggleTodoCompletion, editTodo, deleteTodo }) => {
  return (
    <div className='todo flex gap-2 my-1 border border-gray-400 px-2 py-1'>
      <input type="checkbox" className="isDone" checked={todo.isCompleted} onChange={() => toggleTodoCompletion(todo.id)} />
      <p className={'todo-title flex-1 overflow-hidden text-ellipsis content-center ' + (todo.isCompleted ? 'line-through' : '')}>{todo.title}</p>
      <button className='editTodo' onClick={() => editTodo(todo.id)}><FaEdit/></button>
      <button className='deleteTodo' onClick={() => deleteTodo(todo.id)}><MdDelete/></button>
    </div>
  )
}

function App() {
  const [inputTodo, setInputTodo] = useState('')
  const [todos, setTodos] = useState(null)
  const [showFinished, setShowFinished] = useState(false)

  useEffect(() => {
    if(todos !== null) localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    let todosJSON = JSON.parse(localStorage.getItem('todos'));
    if(todosJSON) setTodos(todosJSON)
  }, [showFinished])


  const saveTodoHandler = (e) => {
    setTodos([...todos, { id: uuidv4(), title: inputTodo, isCompleted: false }])
    setInputTodo('')
    e.preventDefault();
  }

  const clearAllFinished = () => {
    let newTodos = todos.filter(item => {
      return item.isCompleted == false
    })
    if(confirm("Are you sure to Clear All Finished Todos Permanently?")) setTodos(newTodos)
  }

  const toggleTodoCompletion = (todo_id) => {
    let index = todos.findIndex(item => {
      return item.id === todo_id
    })
    let newTodos = [...todos]
    newTodos[index].isCompleted = !newTodos[index].isCompleted
    setTodos(newTodos)
  }

  const editTodo = (todo_id) => {
    let index = todos.findIndex(item => {
      return item.id === todo_id
    })
    let newTodos = [...todos]
    setInputTodo(newTodos[index].title)
    newTodos.splice(index, 1)
    setTodos(newTodos)
  }

  const deleteTodo = (todo_id) => {
    let newTodos = todos.filter(item => {
      return item.id !== todo_id
    })
    if(confirm("Are you sure to Delete this Todo?")) setTodos(newTodos)
  }

  return (
    <>
      <Navbar />
      <div className='container bg-violet-100 md:w-[60%] lg:w-[40%] min-h-[80vh] rounded-lg my-8 mx-auto px-5 py-2.5'>
        <h1 className='text-center my-4 text-3xl font-bold'>iTask - Manage Your Todos at one Place</h1>

        <h2 className='text-xl font-bold'>Add a Todo</h2>
        <form className='todoForm w-full my-2 flex flex-col sm:flex-row gap-2'>
          <input type="text" name='todo-title' value={inputTodo} onChange={e => setInputTodo(e.target.value)} className='border border-black py-1 px-2 rounded-lg flex-1' />
          <button onClick={saveTodoHandler} disabled={!inputTodo}>Save Todo</button>
        </form>

        <div className='my-4 flex flex-wrap gap-2'>
          <input type="checkbox" name='showFinished' className='content-center' checked={showFinished} onChange={e => setShowFinished(!showFinished)} />
          <label htmlFor='showFinished' className='content-center'>Show Finished</label>
          { showFinished && <button className='mx-auto' onClick={clearAllFinished}>Clear Finished Tasks</button> }
        </div>

        <hr className='my-2 border-gray-400 w-[90%] m-auto' />

        <h2 className='text-xl font-bold my-4'>Your Todos</h2>
        <div className="todos-container">
          { (todos === null || todos.length == 0) && <div>No Todos to Display</div> }
          { todos !== null && todos.map(item => {
            return (showFinished || !item.isCompleted) && <Todo key={item.id} todo={item} toggleTodoCompletion={toggleTodoCompletion} editTodo={editTodo} deleteTodo={deleteTodo} />
          })}
        </div>
      </div>
    </>
  )
}

export default App
