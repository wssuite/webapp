# Pre-requirements
Node.js version >=16.17.0
Npm version >= 8.15.0
To install Node
    - Linux/MacOS
        nvm is recommended to change Node versions more easier
    - Windows
        1- scoop is recommended
        2- Once scoop is installed you can download nvm by using the following command:
         scoop install nvm
        3- You can install Node.js using the command: nvm:nvm install 16.17.0

# Fetching modules
Use ```npm ci```  to fetch the modules installed in package.-lock.json without modifying it.

# Fixing linting problems
Run ```npm run lint_fix``` to let npm fix the maximum of lint errors that it can fix. Other errors may need manual intervention to fix.

# AngularProject

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.3.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
