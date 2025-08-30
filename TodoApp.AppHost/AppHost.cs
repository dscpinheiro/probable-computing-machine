var builder = DistributedApplication.CreateBuilder(args);

var db = builder.AddSqlite("db").WithSqliteWeb();
builder.AddProject<Projects.TodoApp_Backend>("backend")
    .WithReference(db);

builder.Build().Run();
