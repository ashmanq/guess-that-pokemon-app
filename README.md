# Who's That Pokemon? Game

This app is a simple Pokemon guessing game created using Angular v18.

## Installation 
To install dependencies for this app run the following code:

`npm install`

## Run the app

To run the app cd into the app directory in therminal and run the following command:

`npm run start`

This will run a local version of the app on `https://localhost:4200` by default.

## Use with API

The `main` branch of this repo has the app using the poke API directly without a back end. You can switch to the `use-backend-api` branch to use this app in conjunction with the Django back end API I have created available [here](https://github.com/ashmanq/pokemon-api).

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