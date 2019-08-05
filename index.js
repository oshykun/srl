require('dotenv').config();

const { loggerConfig, ...config } = require('./config');

const { HoodLogger } = require('@hood/hoodjs-logger');

const App = require('./app');

const loggerOptions = {
  minLevel           : loggerConfig.level,
  disableTraceLogging: loggerConfig.disableTrace
};

const logger = new HoodLogger(loggerConfig.name, loggerOptions);

const app = new App(logger, config);

app.start()
  .then(() => console.log('Service started successfully!'))
  .catch(err => {
    console.error(err, 'Service cant start');
    process.exit(16);
  });
