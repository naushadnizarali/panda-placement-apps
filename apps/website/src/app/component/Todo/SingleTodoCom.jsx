// Todo.js
import React, { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import CustomButton from '../Button/CustomButton';
import styles from './TodoList.module.css';
import CustomSpinner from '../Spinner/Spinner';

function TodoSimple({
  label,
  todos,
  inputText,
  onInputChange,
  onAddTodo,
  onDeleteTodo,
  onToggleComplete,
  onDeleteAllTodos,
  isnotes,
  loading,
}) {
  const [isTodoVisible, setIsTodoVisible] = useState(false);
  // const [isloading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const handleFilterChange = (value) => {
    setFilter(value);
  };

  const filteredTodos = todos?.filter((todo) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !todo.is_complete;
    if (filter === 'completed') return todo.is_complete;
    return false;
  });

  return (
    <div className={styles.todoList}>
      <h2>{label}</h2>
      <div className={styles.addTodo}>
        {/* Add Todo Form */}
        <input
          type="text"
          value={inputText}
          placeholder="Add a new task"
          onChange={onInputChange}
        />
        {!isnotes && loading ? (
          <CustomSpinner />
        ) : (
          !isnotes && <CustomButton label="Add" onClick={onAddTodo} />
        )}
        {isnotes && loading ? (
          <CustomSpinner />
        ) : (
          isnotes && <CustomButton label="Add" onClick={onAddTodo} />
        )}
      </div>
      <div className={styles.filterOptions}>
        <button onClick={() => handleFilterChange('all')}>All</button>
        <button onClick={() => handleFilterChange('pending')}>Pending</button>
        <button onClick={() => handleFilterChange('completed')}>
          Completed
        </button>
        <button onClick={onDeleteAllTodos}>Clear All</button>
      </div>
      <ul className={styles.todoItems}>
        {filteredTodos.length === 0 ? (
          <span className={styles.todoText}>Data Not Found!</span>
        ) : (
          filteredTodos &&
          filteredTodos?.map((todo, index) => (
            <li
              key={index}
              className={todo.is_complete ? styles.completed : ''}
            >
              <input
                type="checkbox"
                checked={todo?.is_complete}
                onChange={() => onToggleComplete(todo, index)}
              />
              <span className={styles.todoText}>
                {isnotes ? todo?.notes : todo?.todo}
              </span>
              <FaTrashAlt
                onClick={() => onDeleteTodo(todo?.id)}
                // icon={faTrash}
                style={{ cursor: 'pointer' }}
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default TodoSimple;
