import { useState, useEffect } from 'react';
import type { Todo } from '../types';
import './TodoForm.css';

interface TodoFormProps {
  todo?: Todo;
  onSave: (todo: Omit<Todo, 'id'> | Todo) => void;
  onCancel: () => void;
}

export function TodoForm({ todo, onSave, onCancel }: TodoFormProps) {
  const [title, setTitle] = useState(todo?.title || '');
  const [dueDate, setDueDate] = useState(todo?.dueDate || '');
  const [isCompleted, setIsCompleted] = useState(todo?.isCompleted || false);

  // Needed for the scenario where an user clicks on an existing item while the form is open.
  useEffect(() => {
    setTitle(todo?.title || '');
    setDueDate(todo?.dueDate || '');
    setIsCompleted(todo?.isCompleted || false);
  }, [todo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }

    const todoData = {
      title: title.trim(),
      isCompleted,
      dueDate: dueDate || undefined,
    };

    if (todo) {
      onSave({ ...todoData, id: todo.id });
    } else {
      onSave(todoData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <h3>{todo ? 'Edit Todo' : 'Add New Todo'}</h3>

      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          autoFocus
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Due Date</label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
          />
          Mark as completed
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="save-btn">{todo ? 'Update' : 'Add'} Todo</button>
        <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
      </div>
    </form>
  );
}