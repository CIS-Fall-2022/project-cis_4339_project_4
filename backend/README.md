# URL for published APIs:

https://documenter.getpostman.com/view/19704046/2s83zdwSBW

# Backend

This implementation is for NodeJS based on [Express](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/) and uses [mongoose](https://mongoosejs.com/) as the ODM.

## Project setup

```
npm init
npm install morgan dotenv express mongoose nodemon uuid
```

### Before startup

Setup a .env file with the following variables, e.g.:

```
MONGO_URL = mongodb+srv://<username>:<password>@cis4339groupproject.lztmlbn.mongodb.net/CIS4339
```

### Compiles and hot-reloads for development

```
npm start
```
