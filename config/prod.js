module.exports = {
    loggerConfig : {
        level: 'info'
    },
    serverConfig : {
        port           : process.env.SWW_SERVER_PORT,
        controllerPath : './app/controllers',
        docPath        : '../docs/swagger.json',
        apiDocPath     : 'api-docs',
        uiDocPath      : 'docs',
        reverseProxyUrl: '/v1.0'
    },
    dbConfig     : {
        connectionURL   : process.env.SWW_CONNECTION_URL,
        defaultMaxTimeMS: 4000
    },
    sessionConfig: {
        secret: process.env.SWW_SESSION_SECRET,
        maxAge: 60000
    },
    authConfig   : {
        secret: process.env.SWW_AUTH_SECRET
    },
    // FIXME: change name
    cacheConfig  : {
        maxRegisterUsers: 5,
        maxLoginFails   : 10,
        registerTTLSec  : 60 * 60, // 1 hour
        loginTTLSec     : 60 * 60 * 24 // 24 hours
    },
    emailConfig  : {
        email   : process.env.SWW_EMAIL,
        password: process.env.SWW_PASSWORD,
        host    : 'smtp.gmail.com',
        port    : 465
    }
};