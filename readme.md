<div align="center">

# React Notes v2

by <a rel="author" href="http://github.com/kkosmowski/">kkosmowski</a>

</div>

---

## Warning
**This is an alternative version of the application, that uses `json-server`. It is no longer continued, so it may be missing newer features.**<br>
It is recommended to use the newer version.



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
* `json-server` for storing the data at `db/json.db`

### Important

There are 2 main branches, one being `master` and second `json-server`.

You are currently viewing the version that uses `json-server`.

At some point I decided to abort working with this library as it is meant only for local applications, making it impossible to deploy React Notes v2 to web or even use it on another device in local network, without running another `json-server` instance.

`localbase` allows exactly the same operations, but instead of keeping the data in a `json` file, it stores data in IndexedDB browser "databae".



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

Additionally, the frontend app requires "mocked backend" aka `json-server`, so it is required to run on of these:
### `yarn api`
### `npm run api`


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