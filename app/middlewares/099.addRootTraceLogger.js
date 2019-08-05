module.exports = (app, { config }) => {
  app.use((req, res, next) => {
    const { logger } = req.app.sww;

    const rootLogger = logger.createRootTraceLogger('srl_root_logger');

    rootLogger.info(`Incoming HTTP request`, { type: req.url });

    req.sww.rootLogger = rootLogger;

    res.set('x-cloud-trace-context', rootLogger.currentTraceId);

    return next();
  });
};
