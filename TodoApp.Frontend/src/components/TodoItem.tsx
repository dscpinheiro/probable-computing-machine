import type { Todo } from '../types';
import {
  Card,
  CardContent,
  Checkbox,
  Typography,
  Chip,
  IconButton,
  Box
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

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
    <Card sx={{ mb: 1 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1} flex={1}>
            <Checkbox
              checked={todo.isCompleted}
              onChange={handleToggle}
              color="primary"
            />
            <Typography
              variant="body1"
              sx={{
                textDecoration: todo.isCompleted ? 'line-through' : 'none',
                color: todo.isCompleted ? 'text.secondary' : 'text.primary',
                flex: 1
              }}
            >
              {todo.title}
            </Typography>
            {todo.dueDate && (
              <Chip
                label={`Due: ${new Date(todo.dueDate).toLocaleDateString()}`}
                size="small"
                variant="outlined"
                color="primary"
              />
            )}
          </Box>
          <Box>
            <IconButton onClick={handleEdit} color="primary" size="small">
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete} color="error" size="small">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}