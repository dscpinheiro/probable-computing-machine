using Microsoft.EntityFrameworkCore;

public class TodoDbContext(DbContextOptions<TodoDbContext> options) : DbContext(options)
{
    public DbSet<TodoApp.Backend.Models.Todo> Todo { get; set; } = default!;
}
