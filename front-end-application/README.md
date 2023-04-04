# Fetching modules
Use ```npm ci```  to fetch the modules installed in pachage.-lock.json without modifying it.

# Fixing linting problems
Run ```npm run lint_fix``` to let npm fix the maximum of lint errors that it can fix. Other errors may need manual intervention to fix.

# AngularProject

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.3.

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

## For Gitlab docker containers
To build an image:
    docker build -t registry.gitlab.com/polytechnique-montr-al/log89xx/23-1/equipe-10/front-end-application:<TAG> .

To push an image:
    docker push registry.gitlab.com/polytechnique-montr-al/log89xx/23-1/equipe-10/front-end-application:<TAG>