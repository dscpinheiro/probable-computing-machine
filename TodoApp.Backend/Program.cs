using Microsoft.EntityFrameworkCore;
using TodoApp.Backend.Middleware;
var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString =
    builder.Configuration.GetConnectionString("TodoDbContext") ??
    throw new InvalidOperationException("Connection string 'TodoDbContext' not found.");
builder.Services.AddDbContext<TodoDbContext>(options => options.UseSqlite(connectionString));

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
app.Run();
