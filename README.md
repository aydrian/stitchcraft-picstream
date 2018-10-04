# Pic Stream

An Instagram-like application created using MongoDB Stitch and React.js

[![Powered by Stitch](http://badge.learnstitch.com/?appid=stitchcraft-picstream-kcpaj)](http://cloud.mongodb.com)

## web-ui

React.js application created using [Create React App](https://github.com/facebook/create-react-app).

## stitch-app

Exported (as template) [Stitch app](https://docs.mongodb.com/stitch/import-export/export-stitch-app/).

## Scripts

The following scripts will assist in the initial setup of your Stitch Application.

## Requirements:

- Install the [stitch-cli](https://docs.mongodb.com/stitch/import-export/stitch-cli-reference/)
- Generate an [API Key](https://docs.atlas.mongodb.com/configure-api-access/#generate-api-keys)
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

- Create a `secrets.json` file in the `stitch-app` directory like the following

```
{
  "auth_providers": {
    "oauth2-google": {
      "clientSecret": "<client-secret>"
    }
  },
  "services": {
    "AWS": {
      "secretAccessKey": "<secret-access-key>",
      "accessKeyId": "<access-id>"
    }
  }
}
```

**NOTE:** Do not commit this file.

### deploy

Deploy current code using `./deploy` in the root of the project

```
> ./deploy
```

### export

Export the project code template using `./export` in the root of the project.

```
> ./export
```

**Note:** This exports the application configuration without any service ID values, including the App ID.
