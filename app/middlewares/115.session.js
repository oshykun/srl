const session = require('express-session');

module.exports = (app, { config }) => {
    app.use(session({
        secret: config.sessionConfig.secret, saveUninitialized: true,
        resave: true,
        cookie: { maxAge: config.sessionConfig.maxAge }
    }));
};