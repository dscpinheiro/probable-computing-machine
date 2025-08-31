import { useState, useEffect } from 'react';
import type { Todo, TodoFilters } from '../types';
import { TodoItem } from './TodoItem';
import { TodoForm } from './TodoForm';
import { TodoSearch } from './TodoSearch';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [searchFilters, setSearchFilters] = useState<TodoFilters>({});

  const fetchTodos = async (search: TodoFilters = {}) => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams();
      if (search.isCompleted) queryParams.append('IsCompleted', String(search.isCompleted));
      if (search.query) queryParams.append('Query', search.query);
      if (search.startDate) queryParams.append('StartDate', search.startDate);
      if (search.endDate) queryParams.append('EndDate', search.endDate);
      if (search.pageSize) queryParams.append('PageSize', String(search.pageSize));

      const url = `/todos${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url);

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
        throw new Error('Failed to update item');
      }

      await fetchTodos(searchFilters);
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

      // If the deleted item is currently being edited, close the form
      if (editingTodo?.id === id) {
        setShowForm(false);
        setEditingTodo(null);
      }

      await fetchTodos(searchFilters);
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

      await fetchTodos(searchFilters);
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

  const handleSearch = (search: TodoFilters) => {
    setSearchFilters(search);
    fetchTodos(search);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" component="h1">
          To-do List ({todos.length})
        </Typography>
        {!showForm && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
          >
            Add task
          </Button>
        )}
      </Box>

      {showForm && (
        <TodoForm todo={editingTodo || undefined} onSave={handleSave} onCancel={handleCancel} />
      )}

      <TodoSearch onSearch={handleSearch} initialValues={searchFilters} />

      {todos.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            Nothing to do yet!
          </Typography>
        </Box>
      ) : (
        <Box>
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </Box>
      )}
    </Container>
  );
}