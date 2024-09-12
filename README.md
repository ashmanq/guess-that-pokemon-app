# Who's That Pokemon? Game

This app is a simple Pokemon guessing game created using Angular v18.

## Installation 
To install dependencies for this app run the following code:

`npm install`

## Run the app

### Initial Setup
A `environment.ts` file needs to be created in the `src/environments` folder using the `environment-example.ts` as a template.

Make sure back end API is running first before starting the app. Instructions on how to run the back end (once downloaded) are available [here](https://github.com/ashmanq/pokemon-api).
To run the app cd into the app directory in terminal and run the following command:

`npm run start`

This will run a local version of the app on `https://localhost:4200` by default.

## Use with API

The `main` branch of this repo has a version of the that **requires** a custom back end Django API, I have created, available [here](https://github.com/ashmanq/pokemon-api). You can switch to the `no-backend` branch to use an older version of the app without the need for a separate backend server.

## Game instructions

When first run the game will show you a start screen. Click the `Start` button to begin a new game.

<p align="center">
    <image width="600px" height="600px" src="/images/startScreen.png">
</p>

You will then be shown the main game screen which will show you 4 options to select to guess the hidden pokemon on screen. Clicking on one of the options will display the Pokemon and give you a result on whether your guess was correct or not.

<p align="center">
    <image width="600px" height="600px" src="/images/gameScreen.png">
</p>

The game screen has the following:
- Exit Button - to exit the game
- Selection Buttons - A selection of Pokemon to choose from to guess the hidden pokemon

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