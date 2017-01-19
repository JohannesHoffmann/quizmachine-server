# REST API Server for the Quizmachine game

REST API for the Backend, Frontend and the App to manage and play the game.
This Server is based on hapi and mongodb. Files are stored in Filesystem and the sourcecode is written in Typescript.

## Scripts

**npm run watch** - starts server and restarts on filechanges

**npm run tsc** - transpile ts to js

**npm run tsc-watch** - detect file changes and transpile

**npm run start-dev** - combines npm run watch with tsc-watch

**gulp configs** - copies config files from src to build

**gulp test** - runs all tests

**gulp tslint** - validate typescript code.

**gulp build** - builds the application.