var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.TodoApp_Backend>("backend");

builder.Build().Run();
