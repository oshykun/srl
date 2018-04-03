const { loggerConfig, ...config } = require('./config');
const winston                     = require('winston');
const App                         = require('./app');

const logger = winston.createLogger({
    level     : loggerConfig.level,
    format    : winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));

}
const app = new App(logger, config);

app.start()
   .then(() => console.log('Service started successfully!'))
   .catch(err => {
       console.error(err, 'Service cant start');
       process.exit(16);
   });