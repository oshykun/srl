module.exports = {
    loggerConfig : {
        level: 'debug'
    },
    serverConfig : {
        apiPort        : 8080,
        controllerPath : './app/controllers',
        docPath        : '../docs/swagger.json',
        apiDocPath     : 'api-docs',
        uiDocPath      : 'docs',
        reverseProxyUrl: '/v1.0'
    },
    dbConfig     : {
        connectionURL   : '',
        defaultMaxTimeMS: 4000
    },
    sessionConfig: {
        secret: '',
        maxAge: 60000
    },
    authConfig   : {
        secret: ''
    },
    // FIXME: change name
    cacheConfig  : {
        maxRegisterUsers: 5,
        maxLoginFails   : 10,
        registerTTLSec  : 60 * 60, // 1 hour
        loginTTLSec     : 60 * 60 * 24 // 24 hours
    },
    emailConfig  : {
        email   : '',
        password: '',
        host    : 'smtp.gmail.com',
        port    : 465
    }
};