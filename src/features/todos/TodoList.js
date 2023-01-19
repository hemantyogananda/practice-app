import {
    useGetToDosQuery,
    useAddToDoMutation,
    useUpdateToDoMutation,
    useDeleteToDoMutation

} from "../api/apiSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUpload } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"

const TodoList = () => {
    const [newTodo, setNewTodo] = useState('')

    const {
        data: todos,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetToDosQuery()

    const [addToDo] = useAddToDoMutation()
    const [updateToDo] = useUpdateToDoMutation()
    const [deleteToDo] = useDeleteToDoMutation()

    const handleSubmit = (e) => {
        e.preventDefault();
        addToDo({ userId: 1, title: newTodo, completed: false})
        setNewTodo('')
    }

    const newItemSection =
        <form onSubmit={handleSubmit}>
            <label htmlFor="new-todo">Enter a new todo item</label>
            <div className="new-todo">
                <input
                    type="text"
                    id="new-todo"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Enter new todo"
                />
            </div>
            <button className="submit">
                <FontAwesomeIcon icon={faUpload} />
            </button>
        </form>


    let content;
    if(isLoading) {
        content = <p>Loading...</p>
    } else if(isSuccess) {
        content = todos.map(todo => {
            return (
                <article key={todo.id}>
                    <div className="todo">
                        <input 
                            type="checkbox"
                            checked={todo.completed}
                            id={todo.id}
                            onChange={() => updateToDo({ ...todo, completed: !todo.completed })}
                        />
                        <label htmlFor={todo.id}>{todo.title}</label>
                    </div>
                    <button className="trash" onClick={() => deleteToDo({id: todo.id})}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </article>
            )
        }

        )
    } else if(isError) {
        content = <p>{error}</p>
    }

    return (
        <main>
            <h1>Todo List</h1>
            {newItemSection}
            {content}
        </main>
    )
}
export default TodoList