import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [newTodos, setNewTodos] = useState('');
    const [searchTerm, setSearchTerm] = useState('')
    const [font, setFont] = useState('sans')
    const [dueDate, setDueDate] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault();
        if (newTodos.trim() !== '') {
            setTodos([...todos, { id: uuidv4(), text: newTodos, completed: false, dueDate }]);
            setNewTodos('');
        }
    }

    const handleDelete = (index) => {
        const newTodos = [...todos];
        newTodos.splice(index, 1);
        setTodos(newTodos);
    }

    const handleEdit = (index) => {
        const newTodo = prompt('Введите новое дело:', todos[index].text);
        if (newTodo !== null && newTodo.trim() !== '') {
            const newTodos = [...todos];
            newTodos[index].text = newTodo;
            setTodos(newTodos);
        }
    };
    const handleDragEnd = (result) => {
        if (!result.destination || result.destination.droppableId !== 'todos') {
            return;
        }
        const newTodos = Array.from(todos);
        const [reorderedTodo] = newTodos.splice(result.source.index, 1);
        newTodos.splice(result.destination.index, 0, reorderedTodo);
        setTodos(newTodos);
    }
    const handleToggleComplete = (index) => {
        const newTodos = [...todos];
        newTodos[index].completed = !newTodos[index].completed;
        setTodos(newTodos);
    }
    const filteredTodos = todos.filter((todo) =>
        todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const toggleFont = () => {
        setFont(font === 'sans' ? 'Courier New' : 'sans')
        console.log('Шрифт изменён')
    };
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            todos.forEach((todo) => {
                const dueDate = new Date(todo.dueDate);
                if (dueDate <= now && !todo.completed) {
                    alert(`Срок выполнения дела "${todo.text}" истек...`)
                }
            });
        }, 60000);
        return () => clearInterval(interval);
    }, [todos])
    //20.09 17:13 push git
    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className={`container mx-auto p-4 font-${font}`}>
                <form onSubmit={handleSubmit} className="mb-4">
                    <div
                        className="container mx-auto p-4 flex flex-col items-center"
                    >
                        <button
                            onClick={toggleFont}
                            className="bg-blue-500 text-white px-4 py-1 mr-2 rounded mt-2 mb-2"
                        >
                            Изменить шрифт
                        </button>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="text-black border border-gray-300 rounded px-2 py-1 mr-2 mb-2 w-42"
                            placeholder="Срок выполнения"
                        />
                        <input
                            type="text"
                            value={newTodos}
                            onChange={(e) => setNewTodos(e.target.value)}
                            className="text-black border border-gray-300 rounded px-2 py-1 mr-2 mb-1"
                            placeholder="Добавить новое дело"
                        />

                        <input
                            type='text'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="text-black botrder border-gray-300 rounded px-2 py-1 mr-2 mt-1"
                            placeholder="Поиск дел"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-1 rounded"
                    >
                        Добавить
                    </button>

                </form>
                <Droppable
                    droppableId="todos"
                >

                    {(provided) => (
                        <ul {...provided.droppableProps} ref={provided.innerRef}>
                            {filteredTodos.map((todo, index) => (
                                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                                    {(provided) => (
                                        <li
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}
                                            className={`border-b border-gray-300 py-2 flex justify-between items-center ${todo.completed
                                                ? 'line-thgrough text-gray-500' : ''}`}
                                        >
                                            {todo.text}
                                            <div>
                                                <button
                                                    disabled={todo.completed}
                                                    onClick={() => handleEdit(index)}
                                                    className={`mx-2 bg-green-500 hover:text-green-700 mr-2 px-4 py-1 rounded 
                                                        ${todo.completed ? 'cursor-not-allowed' : ' '}`}
                                                >
                                                    Изменить
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(index)}
                                                    className="mx-2 text-white bg-red-500 hover:text-red-750 px-4 py-1 rounded"
                                                >
                                                    Удалить
                                                </button>
                                                <input
                                                    type="checkbox"
                                                    checked={todo.completed}
                                                    onChange={() => handleToggleComplete(index)}
                                                    className="mx-2 bg-blue mr-2 rounded-full w-10 h-10 text-center align-middle"
                                                />
                                            </div>
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
}

export default TodoList;