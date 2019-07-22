# SWW

## Prerequisites

Node version 8 or higher.
If process.env.NODE_ENV !== 'production', then following environment variables must be filled in:
```js
process.env.SWW_SERVER_PORT,
process.env.SWW_CONNECTION_URL,
process.env.SWW_SESSION_SECRET,
process.env.SWW_AUTH_SECRET,
process.env.SWW_EMAIL,
process.env.SWW_PASSWORD
```
Otherwise please add these values int [config/dev](https://github.com/oshykun/sww-tt/blob/master/config/dev.js) file 

### Build

Before starting the service we need to install all npm packages:
```
npm i
```

### Run

To start service simply run following command:
```
npm start
```
It will start API at http://localhost:8080/

## API Documentation
To view API documantation open:
http://localhost:8080/v1.0/docs
After starting service.

## Built With

* [Express](https://expressjs.com/) - The web framework designed for building web applications and APIs.
* [Infuse.js](https://github.com/soundstep/infuse.js/blob/master/README.md) - Inversion of Control library
* [Swagger Tools](https://swagger.io/tools/) - Used to build and document RESTful API. 
