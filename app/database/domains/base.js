class BaseDomain {

    constructor(logger, mongoConnector, domain) {
        this._logger         = logger;
        this._mongoConnector = mongoConnector;
        this._domain         = domain;
        this._logger.debug(`${BaseDomain.name} - constructor`);
    }

    get domain() {
        return this._domain;
    }
}

module.exports = BaseDomain;