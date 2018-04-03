class DBConnectorFacade {

    constructor(logger, mongoConnector, filesLoader) {
        this._logger         = logger;
        this._mongoConnector = mongoConnector;

        filesLoader.loadFilesSync(`${__dirname}/domains/`, ['base.js'])
                   .forEach(DomainClass => {
                       try {
                           let domainConnector = new DomainClass(this._logger, this._mongoConnector);
                           if (!domainConnector.domain) {
                               return;
                           }
                           this[domainConnector.domain] = domainConnector;
                       } catch (err) {
                           this._logger.error(`Can't load domain file as connector, err: ${JSON.stringify(err)}`);
                       }
                   });
        this._logger.debug(`${DBConnectorFacade.name} - constructor`);
    }

    async disconnect() {
        this._logger.debug(`${DBConnectorFacade.name} - disconnect`);
        if (this._mongoConnector) {
            await this._mongoConnector.disconnect();
        }
    }
}

DBConnectorFacade.diProperties = { name: 'dbConnectorFacade', type: 'class', singleton: true };
DBConnectorFacade.inject       = ['logger', 'mongoConnector', 'filesLoader'];

module.exports = DBConnectorFacade;