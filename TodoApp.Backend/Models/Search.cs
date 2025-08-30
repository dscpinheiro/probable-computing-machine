namespace TodoApp.Backend.Models;

public record TodoSearch(
    bool? IsCompleted,
    string? Query,
    DateOnly? StartDate,
    DateOnly? EndDate,
    int? PageSize
);
