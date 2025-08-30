using Microsoft.EntityFrameworkCore;
using TodoApp.Backend.Middleware;

var builder = WebApplication.CreateBuilder(args);
builder.AddSqliteDbContext<TodoDbContext>("db");

builder.AddServiceDefaults();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
}

app.MapDefaultEndpoints();
app.MapTodoEndpoints();

using var scope = app.Services.CreateScope();
var dbContext = scope.ServiceProvider.GetRequiredService<TodoDbContext>();
await dbContext.Database.MigrateAsync();

app.Run();
