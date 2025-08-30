using Microsoft.EntityFrameworkCore;

namespace TodoApp.Backend;

public class TodoDbContext(DbContextOptions<TodoDbContext> options) : DbContext(options)
{
    public DbSet<Models.Todo> Todos { get; set; } = default!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .Entity<Models.Todo>()
            .HasData
            (
                new Models.Todo
                {
                    Id = new Guid("403b9af9-2341-4723-a434-6330fe7116bf"),
                    Title = "File taxes",
                    IsCompleted = false,
                    DueDate = new DateOnly(2026, 4, 30)
                },
                new Models.Todo
                {
                    Id = new Guid("6d055426-cc5a-45b0-a4f5-1744454193a3"),
                    Title = "Go on vacation",
                    IsCompleted = true,
                    DueDate = new DateOnly(2024, 12, 25)
                }
            );
    }
}
