import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [newTodos, setNewTodos] = useState('');

    const handleSubmit = (e) => {   
        e.preventDefault();
        if (newTodos.trim() !== '') {
            setTodos([...todos, { id: uuidv4(), text: newTodos }]);
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

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="container mx-auto p-4">
                <form onSubmit={handleSubmit} className="mb-4">
                    <input
                        type="text"
                        value={newTodos}
                        onChange={(e) => setNewTodos(e.target.value)}
                        className="text-black border border-gray-300 rounded px-2 py-1 mr-2"
                        placeholder="Добавить новое дело"
                    />
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
                            {todos.map((todo, index) => (
                                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                                    {(provided) => (
                                        <li
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}
                                            className="border-b border-gray-300 py-2 flex justify-between items-center"
                                        >
                                            {todo.text}
                                            <div>
                                                <button
                                                    onClick={() => handleEdit(index)}
                                                    className="mx-2 bg-green-500 hover:text-green-700 mr-2 px-4 py-1 rounded"
                                                >
                                                    Изменить
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(index)}
                                                    className="mx-2 text-white bg-red-500 hover:text-red-750 px-4 py-1 rounded"
                                                >
                                                    Удалить
                                                </button>
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