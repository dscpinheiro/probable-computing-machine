import { useState, useEffect } from 'react';
import type { Todo } from '../types';
import {
  Card,
  CardContent,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Box
} from '@mui/material';

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
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {todo ? 'Edit task' : 'Add new task'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            required
            autoFocus
            fullWidth
            variant="outlined"
          />

          <TextField
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={isCompleted}
                onChange={(e) => setIsCompleted(e.target.checked)}
                color="primary"
              />
            }
            label="Mark as completed"
          />

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button type="button" onClick={onCancel} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {todo ? 'Update' : 'Add'} task
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}