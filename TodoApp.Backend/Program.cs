using Microsoft.EntityFrameworkCore;
using TodoApp.Backend;
using TodoApp.Backend.Middleware;

var builder = WebApplication.CreateBuilder(args);
builder.AddSqliteDbContext<TodoDbContext>("db");

builder.AddServiceDefaults();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseStatusCodePages(async handler =>
    await Results
        .Problem(statusCode: handler.HttpContext.Response.StatusCode)
        .ExecuteAsync(handler.HttpContext)
);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<TodoDbContext>();
    await dbContext.Database.MigrateAsync();
}
else
{
    app.UseExceptionHandler(e => e.Run(async context => await Results.Problem().ExecuteAsync(context)));
}

app.MapDefaultEndpoints();
app.MapTodoEndpoints();

app.Run();
