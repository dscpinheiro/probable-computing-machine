using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using TodoApp.Backend.Models;

namespace TodoApp.Backend.Middleware;

public static class TodoEndpoints
{
    public static void MapTodoEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/Todo").WithTags(nameof(Todo));

        group.MapGet("/", async (TodoDbContext db) =>
        {
            return await db.Todo.ToListAsync();
        })
        .WithName("GetAllTodos")
        .WithOpenApi();

        group.MapGet("/{id}", async Task<Results<Ok<Todo>, NotFound>> (Guid id, TodoDbContext db) =>
        {
            return await db.Todo.AsNoTracking()
                .FirstOrDefaultAsync(model => model.Id == id)
                is Todo model
                    ? TypedResults.Ok(model)
                    : TypedResults.NotFound();
        })
        .WithName("GetTodoById")
        .WithOpenApi();

        group.MapPut("/{id}", async Task<Results<Ok, NotFound>> (Guid id, Todo todo, TodoDbContext db) =>
        {
            var affected = await db.Todo
                .Where(model => model.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(m => m.Title, todo.Title)
                    .SetProperty(m => m.IsCompleted, todo.IsCompleted)
                    .SetProperty(m => m.DueDate, todo.DueDate)
                );

            return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
        })
        .WithName("UpdateTodo")
        .WithOpenApi();

        group.MapPost("/", async (Todo todo, TodoDbContext db) =>
        {
            db.Todo.Add(todo);
            await db.SaveChangesAsync();
            return TypedResults.Created($"/api/Todo/{todo.Id}", todo);
        })
        .WithName("CreateTodo")
        .WithOpenApi();

        group.MapDelete("/{id}", async Task<Results<Ok, NotFound>> (Guid id, TodoDbContext db) =>
        {
            var affected = await db.Todo
                .Where(model => model.Id == id)
                .ExecuteDeleteAsync();

            return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
        })
        .WithName("DeleteTodo")
        .WithOpenApi();
    }
}
