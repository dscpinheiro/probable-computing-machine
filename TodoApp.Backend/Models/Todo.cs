namespace TodoApp.Backend.Models;

public class Todo
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public bool IsCompleted { get; set; } = false;
    public DateOnly? DueDate { get; set; } = null;
}
