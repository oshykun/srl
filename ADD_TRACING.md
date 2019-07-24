# Hood, adding trace logger:

## Installation:
``
npm install @hood/hoodjs-logger -P
``

## Usage
There are two ways to add a trace logger into existing Express application. 
First is to create a [middleware](#creating-middleware) and second is to use [req.app property](#using-reqapp-property) of Express request.

### Creating middleware:

### Using req.app property:
If you follow the pattern in which you create a module that just exports a middleware function and require() it in your main file, then the middleware can access the Express instance via req.app. 
That means, when you create an express app you can create a new property in it and set logger there, e.g. :

```js
const express         = require('express');
const { TraceLogger } = require('@hood/hoodjs-logger');

const app = express();

const logger = new TraceLogger('loggerName', 'info', null, { 'disable_trace_logging': false });
app.example = { logger }
```

And then you can get logger in any middleware or controller, e.g.:
```js
app.use((req, res, next) => {
  const logger = req.app.example.logger;
  next()
})
```

## TODOs:
* Think of creating default constructor with some predefined/generated config -> `new TraceLogger()`
* Think of adding proper jsdocs for `TraceLogger`, in order for developer open .js file and be able to understand which config params should be passed.

