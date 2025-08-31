import { useState, useEffect } from 'react';
import type { Todo } from '../types';
import { TodoItem } from './TodoItem';
import { TodoForm } from './TodoForm';
import './TodoList.css';

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/todos');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }

      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) {
      return;
    }

    try {
      const response = await fetch(`/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...todo,
          isCompleted: !todo.isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleSave = async (todoData: Omit<Todo, 'id'> | Todo) => {
    try {
      // Either update or create a new item.
      if ('id' in todoData) {
        const response = await fetch(`/todos/${todoData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(todoData),
        });

        if (!response.ok) {
          throw new Error('Failed to update item');
        }
      } else {
        const response = await fetch('/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(todoData),
        });

        if (!response.ok) {
          throw new Error('Failed to create item');
        }
      }

      await fetchTodos();
      setShowForm(false);
      setEditingTodo(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save item');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) {
    return <div className="todo-list-loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="todo-list-error">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      <div className="todo-list-header">
        <h2>Todo List ({todos.length})</h2>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="add-todo-btn">Add new item</button>
        )}
      </div>

      {showForm && (
        <TodoForm todo={editingTodo || undefined} onSave={handleSave} onCancel={handleCancel} />
      )}

      {todos.length === 0 ? (
        <p className="empty-message">Nothing to do yet!</p>
      ) : (
        <div className="todo-items">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}