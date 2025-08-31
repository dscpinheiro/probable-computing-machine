import type { Todo } from '../types';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (todo: Todo) => void;
}

export function TodoItem({ todo, onToggleComplete, onDelete, onEdit }: TodoItemProps) {
  // Functions that the parent component will specify (those will be responsible for invoking the backend API).
  const handleToggle = () => onToggleComplete?.(todo.id);
  const handleDelete = () => onDelete?.(todo.id);
  const handleEdit = () => onEdit?.(todo);

  return (
    <div className="todo-item">
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={handleToggle}
          className="todo-checkbox"
        />
        <span className={`todo-title ${todo.isCompleted ? 'completed' : ''}`}>
          {todo.title}
        </span>
        {todo.dueDate && (
          <span className="todo-due-date">
            Due: {new Date(todo.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
      <div className="todo-actions">
        <button onClick={handleEdit} className="edit-btn">Edit</button>
        <button onClick={handleDelete} className="delete-btn">Delete</button>
      </div>
    </div>
  );
}