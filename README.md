# example-react-app

A super-simple example of a react front-end and an express back-end working together

This repository is a demo of using an express server and create-react-app together by using the `proxy` field in the `package.json` file.

To test this out, run:

```
git clone https://github.com/esonderegger/example-react-app.git
cd example-react-app
npm install
```

Then in one tab, run:

    node api.js

and in another tab run:

    npm run start

From a browser window, you should be able to add things to the list of things (and remove them by clicking on them) and see your changes in `stuff.json`. If you change `stuff.json` manually, you should be able to see those changes in the browser by refreshing the page.
