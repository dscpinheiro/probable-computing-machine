# To-do task management API
This repository is a simple task management API, split into a backend (built using [.NET](https://dotnet.microsoft.com) and [SQLite](https://sqlite.org)) and a frontend (built using [React](https://react.dev/) and [Vite](https://vite.dev)). The projects are orchestrated via [.NET Aspire](https://learn.microsoft.com/en-us/dotnet/aspire/) (_opinionated, cloud ready stack for building observable, production ready, distributed applications_).

In order to run this locally, you'll need to install the following components:
* .NET 8 (or later) - https://dotnet.microsoft.com/en-us/download
* Docker Desktop - https://www.docker.com/products/docker-desktop
* NodeJS 24 (or later) - https://nodejs.org/en/download

# Local testing
Once all the above are installed, run the following command from the root of the repository:
```bash
$ dotnet run --project TodoApp.AppHost
```

This will build the .NET solution and output the location of the Aspire dashboard to the console (for example: `Now listening on: http://localhost:15265`).

# Design decisions
This is not a complete project, so it does make some trade-offs and assumptions that'd need to be addressed before being deployed to actual users:
* No built-in authentication, all items belong to the current user. ASP.NET does support [identity solutions](https://learn.microsoft.com/en-us/aspnet/core/security/authentication) that interop well with SPA applications, but those were not included here as complexity would increase quite a bit
* [Minimal APIs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis) are easier to get started, but they don't have all features of the controller-based APIs (for example, some advanced validation features)
* [Material UI](https://mui.com/material-ui/) was chosen for the design system in the frontend app, as I was familiar with [Google's Material Design project](https://m3.material.io/)
    * Important disclaimer: Some of the styling was generated using [Claude Code](https://www.anthropic.com/claude-code) - as I was not familiar with the available components in React
* For state management in the frontend app, using a library spefically for that purpose (such as [Redux](https://redux.js.org)) would make sense as the project grew more complex
* Manual testing was performed via the Aspire dashboard; for an actual deployment pipeline automated testing would need to be performed (for example, [Integration tests in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests) for the backend)
