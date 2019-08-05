# Hood, adding trace logger:

# Motivation
tobe added...

## Prerequisites

Node version 10+ is required.

## Installation:
``
npm install @hood/hoodjs-logger -P
``

## Usage
You will need to be able to get HoodLogger for each request, the easiest way to achieve this, is to use [req.app property](#using-reqapp-property) of Express request.
Then you will need to add `rootLogger` and request tracing logger to you request, it can be achieved by [adding middlewares](#creating-a-middlewares).

### Using req.app property:
If you follow the pattern in which you create a module that just exports a middleware function and require() it in your main file, then the middleware can access the Express instance via req.app. 
That means, when you create an express app you can create a new property in it and set logger there, e.g. :

```js
const express        = require('express');
const { HoodLogger } = require('@hood/hoodjs-logger');

const app = express();

const loggerOptions = {
  minLevel            : 'info',
  disableTraceLogging : false
};

const logger = new HoodLogger('example_general_logger', loggerOptions);

app.example = { logger }
```
Minimal configuration which is required in order to set up HoodLogger is only name for your logger.
Everything else is optional and can be added into `options` param, like disabling tracing at all -> `{ 'disable_trace_logging': true }` 

And then you can get general logger in any middleware or controller, e.g.:
```js
app.use((req, res, next) => {
  const logger = req.app.example.logger;
  next()
})
```

### Creating a middlewares:
In order to use all capabilities of tracing, you need to use `root` and `child` loggers for each request.
This can be easily achieved by adding two middleware functions. 
One of them creates [rootLogger](#add-root-tracelogger-middleware) another [completes](#add-end-trace-middleware) tracing for HTTP request.
And when you have [rootLogger](#add-root-tracelogger-middleware) you can start creating and using [child trace loggers](#use-root-logger-to-create-child-loggerstrace-spans)

#### Add Root TraceLogger middleware:
```js
app.use((req, res, next) => {
    const { logger } = req.app.example;

    const rootLogger = logger.createRootTraceLogger('example_root_logger');

    rootLogger.info(`Incoming HTTP request`, { type: req.url });

    req.example.rootLogger = rootLogger;

    res.set('x-cloud-trace-context', rootLogger.currentTraceId);

    next();
})
```
NOTE: If you don't specify `trace` for the `rootLogger`, then `current` and `parent` trace ids will automatically generated for you.
For more details please see `options` jsdocs for `createRootTraceLogger()`.

#### Add End Trace middleware:
In order to finish tracing for HTTP request you need to create `end trace middleware`, which is just terminates tracing for particular HTTP request.
NOTE: If yoy want to trace all middlewares this middleware should come the last one.
```js
app.use((req, res, next) => {
  const { logger } = req.app.example;
  
  logger.info('end', { status: 'complete' });
  
  next();
})
```

#### Use Root Logger to create child loggers(trace spans):
In the controller you can grab `rootLogger` and create `child` one:
 
```js
app.use(async (req, res, next) => {
  const rootLogger = req.example.rootLogger;
  
  let internalLogger = rootLogger.createChildTraceLogger('getUserById');
  internalLogger.info('start');
  let user = await userService.getUserById(req.params.id);
  internalLogger.info('end', { status: 'end' });
  
  next()
})
```

## TODOs:
* Test npm `logger` package, published into npm. 


