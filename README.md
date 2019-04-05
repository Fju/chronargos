# chronargos

![chronargos logo](app/images/chronargos_logo.svg)

Minimal assistant for improving video editing workflow. List the video and audio files you work with in a timeline, to get a quick and easy overview of files from multiple sources.

## Features

- list video and audio files according to their creation time and length in a timeline
- use drag'n'drop to copy one or multiple files into your video editor, file manager, etc.
- open multiple folders at once to view files from multiple sources at once
- dock the window to the side of your monitor so that you can access it easy and quickly

## Installation

In the future you can also find built versions for various platforms (Windows, Linux, macOS) on the [release page](https://github.com/Fju/chronargos/releases).

For now you have to download the source files and run a small script in the command line to run the program. Make sure that you have `node`, `npm` and `git` installed, so that you can clone this repository and install all required dependencies.
``` sh
git clone https://github.com/Fju/chronargos
cd chronargos
npm install
```

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

For bundling, there is a node script in the main directory, which bundles the Javascript (Vue framework, Vue components, node modules and javascript files from `app/src/js/`) to `app/dist/bundle.js` using webpack. The LESS files are bundled to `app/dist/bundle.css` using the LESS node module.

One can switch between production or development mode by passing an argument to the bundle script:
``` sh
# bundle in development mode, doesn't compress code, easier to read and to debug
node bundle.js development
# bundle in production mode, compresses code for minimal size, suitable for building the app
node bundle.js production
```
