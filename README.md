
This repository contains source code for React application demonstrating spread of Covid-19 visualized using IgniteUI React Map and Chart components.

<img src="./public/images/preview.gif" width="600" />


## Table of Contents

- [Background](#Background)
- [Setup](#Setup)
- [Building Project](#Building-Project)
- [Running App](#Running-App)
- [Folder Structure](#Table-of-Contents)
- [Supported Browsers](#supported-browsers)


## Setup

To setup this project:

- open VS Code as Administrator
- open the folder that contains this repository, e.g. `C:\react-samples\`
- select **View** - **Terminal** menu item
- run this command:

```
npm install
```

This will install required packages and Ignite UI for React packages from npm website:

- [igniteui-react-core](https://www.npmjs.com/package/igniteui-react-core)
- [igniteui-react-charts](https://www.npmjs.com/package/igniteui-react-charts)
- [igniteui-react-maps](https://www.npmjs.com/package/igniteui-react-maps)


## Hosting App
Run this command to host the app locally:

```
npm run-script start
```

## Building App
Only once, run this command to build the app:

```
npm run-script build
```

Then you can open `./build/index.html` file in your browser anytime

## Folder Structure

This project has the following structure:

```
my-app/
  README.md
  package.json
  public/
    index.html
    favicon.ico
  src/
    index.css
    index.js
    assets/
    data/
    views/

```

## Supported Browsers

By default, the generated project uses the latest version of React.

You can refer [to the React documentation](https://reactjs.org/docs/react-dom.html#browser-support) for more information about supported browsers.
