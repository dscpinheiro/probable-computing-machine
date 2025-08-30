namespace TodoApp.Backend.Models;

public class TodoDTO
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public bool IsCompleted { get; set; }
    public DateOnly DueDate { get; set; }

    public TodoDTO() { }

    public TodoDTO(Todo source)
        => (Id, Title, IsCompleted, DueDate) = (source.Id, source.Title, source.IsCompleted, source.DueDate);
}
