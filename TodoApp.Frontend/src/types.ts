export interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
  dueDate?: string;
}

export interface TodoFilters {
  isCompleted?: boolean;
  query?: string;
  startDate?: string;
  endDate?: string;
  pageSize?: number;
}