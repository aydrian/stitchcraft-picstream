# Pic Stream

An Instagram-like application created using MongoDB Stitch and React.js

## web-ui

React.js application created using [Create React App](https://github.com/facebook/create-react-app).

## stitch-app

Exported (as template) Stitch app.

### Scripts

Requirements:

- Install the [stitch-cli](https://docs.mongodb.com/stitch/import-export/stitch-cli-reference/)
- Create a `.env` file like the following

```
export STITCH_API_KEY=<API_KEY>
export STITCH_USERNAME=<CLOUD_USERNAME>
export STITCH_APPID=<APPID>
```

- Make scripts executable

```
> chmod +x deploy
> chmod +x export
```

#### deploy

Deploy current code using `./deploy` in the root of the project

#### export

Export the project code using `./export` in the root of the project.
