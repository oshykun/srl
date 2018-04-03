module.exports = (app, { config: { serverConfig } }) => {
    app.use(`${serverConfig.reverseProxyUrl}/private`, (req, res, next) => {
        const loggedInUser = req.session.userId;
        if (!loggedInUser) {
            return next(new Error('You must be logged in to access this page.'));
        }
        return next();
    });
};