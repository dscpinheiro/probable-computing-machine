var builder = DistributedApplication.CreateBuilder(args);

var db = builder.AddSqlite("db").WithSqliteWeb();

var backend = builder.AddProject<Projects.TodoApp_Backend>("backend")
    .WithReference(db)
    .WaitFor(db);

builder.AddViteApp(name: "frontend", workingDirectory: "../TodoApp.Frontend")
    .WithReference(backend)
    .WaitFor(backend)
    .WithNpmPackageInstallation();

builder.Build().Run();
