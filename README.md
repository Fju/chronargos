# chronargos

Minimal assistant for improving video editing workflow that sorts video files from multiple sources chronologically in a timeline.

## Installation

First you have to make sure that you have `node`, `npm` and `git` installed, so that you clone this repository and install all node packages required to run this program.
``` sh
git clone https://github.com/Fju/chronargos
npm install
```

In the future you can also find built versions for various platforms (Windows, Linux, macOS) on the [release page](https://github.com/Fju/chronargos/releases).

## Launch the app

In `package.json` a script is defined for easily starting up the app using just:
``` sh
npm start
```
The script will bundle all source code files and launch electron, you can read more about the in the section "Project structure" below.

## Project structure

```
app
├── dist
│   └── ...
├── index.html
├── main.js
└── src
    ├── app.js
    ├── components
    │   └── ...
    ├── js
    │   └── ...
    └── less
        ├── main.less
        └── ...
```
- `app/main.js` is the entry point for electron and creates the BrowserWindow that hosts `app/index.html`
- `app/src/app.js` is the entry point for the Javascript logic. It creates the main Vue element which gets mounted on the `#app` element defined in `app/index.html`. All components can be found in `app/src/components/` and are loaded by the `app/src/app.js` script or by other components.
- `app/src/less/main.less` is the entry point for the styling.

For bundling, there is a node script in main directory, which bundles the Javascript (Vue framework, Vue components, node modules and javascript files from `app/src/js/`) to `app/dist/bundle.js` using webpack and the LESS files to `app/dist/bundle.css` using the LESS node module.
``` sh
# bundle in development mode, doesn't compress code, easier to read and to debug
node bundle.js development
# bundle in production mode, compresses code for minimal size, suitable for building the app
node bundle.js production
```
