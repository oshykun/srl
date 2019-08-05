module.exports = (app, { config }) => {
  app.use((req, res, next) => {
    const { logger } = req.app.sww;

    // TODO: check should it be rootLogger or general logger?
    logger.info('end', { status: 'complete' });

    return next();
  });
};
