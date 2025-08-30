using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using TodoApp.Backend.Models;

namespace TodoApp.Backend.Middleware;

public static class TodoEndpoints
{
    public static void MapTodoEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/todos");

        group.MapGet("/", async ([AsParameters] TodoSearch search, TodoDbContext db) =>
        {
            var todos = db.Todos.AsQueryable().AsNoTracking();

            if (search.IsCompleted.HasValue)
            {
                todos = todos.Where(t => t.IsCompleted == search.IsCompleted.Value);
            }

            if (!string.IsNullOrWhiteSpace(search.Query))
            {
                todos = todos.Where(t => t.Title.Contains(search.Query));
            }

            if (search.StartDate.HasValue)
            {
                todos = todos.Where(t => t.DueDate >= search.StartDate.Value);
            }

            if (search.EndDate.HasValue)
            {
                todos = todos.Where(t => t.DueDate <= search.EndDate.Value);
            }

            if (search.PageSize.HasValue)
            {
                todos = todos.Take(search.PageSize.Value);
            }

            return await todos.Select(t => new TodoDTO(t)).ToListAsync();
        })
        .WithName("GetTodos")
        .WithOpenApi();

        group.MapGet("/{id}", async Task<Results<Ok<TodoDTO>, NotFound>> (Guid id, TodoDbContext db) =>
        {
            return await db.Todos.AsNoTracking()
                .FirstOrDefaultAsync(model => model.Id == id)
                is Todo model
                    ? TypedResults.Ok(new TodoDTO(model))
                    : TypedResults.NotFound();
        })
        .WithName("GetTodoById")
        .WithOpenApi();

        group.MapPut("/{id}", async Task<Results<Ok, NotFound, BadRequest>> (Guid id, TodoDTO todo, TodoDbContext db) =>
        {
            // .NET 10 supports model validation for minimal APIs, but for now manually check the request.
            if (string.IsNullOrWhiteSpace(todo.Title))
            {
                return TypedResults.BadRequest();
            }

            var affected = await db.Todos
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

        group.MapPost("/", async Task<Results<Created<TodoDTO>, BadRequest>> (TodoDTO todo, TodoDbContext db) =>
        {
            if (string.IsNullOrWhiteSpace(todo.Title))
            {
                return TypedResults.BadRequest();
            }

            var entity = new Todo
            {
                Title = todo.Title,
                IsCompleted = todo.IsCompleted,
                DueDate = todo.DueDate,
            };

            db.Todos.Add(entity);
            await db.SaveChangesAsync();
            return TypedResults.Created($"/todos/{entity.Id}", new TodoDTO(entity));
        })
        .WithName("CreateTodo")
        .WithOpenApi();

        group.MapDelete("/{id}", async Task<Results<Ok, NotFound>> (Guid id, TodoDbContext db) =>
        {
            var affected = await db.Todos
                .Where(model => model.Id == id)
                .ExecuteDeleteAsync();

            return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
        })
        .WithName("DeleteTodo")
        .WithOpenApi();
    }
}
