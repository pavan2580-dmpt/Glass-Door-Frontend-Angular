# GlassHouse

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Packaging (electron-builder) and network

- The `electron-builder` packager downloads helper binaries (rcedit, app-builder tools, etc.) from GitHub during packaging. If your environment has no network access or DNS to GitHub, packaging with `npm run package` or `npm run dist` will fail.
- When offline you can still build the web app assets with:

```powershell
npm run build-prod
```

- Or use the provided offline script which skips the packaging step:

```powershell
npm run package-offline
```

- To create a Windows installer you must run `npm run package` on a machine with internet access, or run the packaging step in CI where network access is available. Alternatively, pre-install the required electron-builder helper binaries on the build machine (advanced).
