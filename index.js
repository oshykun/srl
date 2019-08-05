require('dotenv').config();

const { loggerConfig, ...config } = require('./config');

const { TraceLogger } = require('@hood/hoodjs-logger');

const App = require('./app');

const loggerOptions = {
  min_level              : loggerConfig.level,
  'disable_trace_logging': loggerConfig.disableTrace
};

const logger = new TraceLogger(loggerConfig.name, loggerOptions);

const app = new App(logger, config);

app.start()
  .then(() => console.log('Service started successfully!'))
  .catch(err => {
    console.error(err, 'Service cant start');
    process.exit(16);
  });
