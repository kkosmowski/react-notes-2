<header style="text-align: center;">

# React Notes v2

by <a rel="author" href="http://github.com/kkosmowski/">kkosmowski</a>

</header>

---

## Table of contents

* [Description](#description)
* [Technologies](#technologies)
* [Installation](#installation)
* [Usage](#usage)
* [Features](#features)
* [Author](#author)

---

## Description

React Notes v2 is a web application written with *React* library.

This app allows you to create notes with title and optional content, as well as to create categories which can help you filter out useful notes.
For more features head out to [features](#features) section.

The application was created solely for learning purposes, although it may be used to track daily activities.



## Technologies
* `react` as the fundamental library 
* `typescript` for safe typing
* `react-redux` for state management
* `styled-components` and `sass` for styling
* `i18next` & `react-i18next` for translation handling
* `localbase` for storing the data in indexed-db

### Important

There are 2 main branches, one being `master` and second `json-server`.

The latter branch is an alternative app where instead of `localbase`, a `json-server` library is used.<br>
**More details can be found in readme on `json-server` branch.**



## Installation

In order to be able to properly install and run the application, **Node** and either **npm**  or **yarn** must be installed.

To install the app dependencies, run either yarn or npm command:
### `yarn install`
### `npm install`
depending on your package manager of choice.



## Usage

To run the app, run either one of these:
### `yarn start`
### `npm start`

This will compile TypeScript and open a new tab in your default browser, most likely at http://localhost:3000/



## Features
- Creating, viewing, updating and deleting notes;
- Creating, renaming and deleting categories;
- Archiving and restoring notes;
- Assigning notes to specific categories or removing notes from them;
- Filtering notes based on currently viewed category;
- Filtering only not-archived notes;
- Undoing some operations with snackbar;
- Setting a different theme, direction (left-to-right or right-to-left), language and snackbar duration;
- (Desktop only) operating with keyboard shortcuts (see Shortcuts Dialog for details);
- (Desktop only) selecting notes on mouse click-and-drag;

Application is available on both Desktop and mobile.



## Author

React Notes v2 was created by <a rel="author" href="http://github.com/kkosmowski/">kkosmowski</a>

You are free to use the app for free (both personal and professional use), however it is prohibited to claim to be the author or owner of this app.