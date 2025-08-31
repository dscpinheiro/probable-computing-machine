import { useState } from 'react';
import type { TodoFilters } from '../types';
import {
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface TodoSearchProps {
  onSearch: (searchParams: TodoFilters) => void;
  initialValues?: TodoFilters;
}

export function TodoSearch({ onSearch, initialValues }: TodoSearchProps) {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(initialValues?.query || '');
  const [isCompleted, setIsCompleted] = useState<string>(initialValues?.isCompleted ? String(initialValues.isCompleted) : '');
  const [startDate, setStartDate] = useState(initialValues?.startDate || '');
  const [endDate, setEndDate] = useState(initialValues?.endDate || '');
  const [pageSize, setPageSize] = useState<number | ''>(initialValues?.pageSize || '');

  const handleSearch = () => {
    setLoading(true);
    const searchParams: TodoFilters = {};

    if (query.trim()) searchParams.query = query.trim();
    if (isCompleted !== '') searchParams.isCompleted = isCompleted === 'true';
    if (startDate) searchParams.startDate = startDate;
    if (endDate) searchParams.endDate = endDate;
    if (pageSize) searchParams.pageSize = pageSize;

    onSearch(searchParams);
    setLoading(false);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Search</Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
            variant="outlined"
          />

          <Box display="flex" gap={2} flexWrap="wrap">
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select value={isCompleted} label="Status" onChange={(e) => setIsCompleted(e.target.value as string)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="true">Completed</MenuItem>
                <MenuItem value="false">Pending</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              label="Max Results"
              type="number"
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value ? Number(e.target.value) : '')}
              variant="outlined"
              slotProps={{ htmlInput: { min: 1 } }}
              sx={{ width: 180 }}
            />
          </Box>

          <Box display="flex" gap={1} justifyContent="flex-end">
            <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}