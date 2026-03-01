# Kate

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Deployment on Vercel

If you deploy this application to Vercel, you might encounter a `NOT_FOUND` error when refreshing segments of the application (e.g., at `/categories` or `/products`).

### Troubleshooting NOT_FOUND Error

1.  **Output Directory**: In the Vercel Dashboard, ensure the **Output Directory** is set to `dist/kate/browser` (mandatory for Angular 18+ projects using the application builder).
2.  **SPA Routing**: The `vercel.json` file in the root directory ensures that all requests are rewritten to `index.html`. This allows the Angular Router to handle deep links correctly.

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Key Concept: Client-side Routing
Angular uses client-side routing. The server (Vercel) only hosts static files. When you navigate to a sub-route, Angular's JS handles it. If you refresh the page, the browser asks the server for that specific path. The rewrite rule tells the server to always serve the `index.html` regardless of the path.
