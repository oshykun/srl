class TokenService {

    constructor(logger, dbConnectorFacade) {
        this._logger            = logger;
        this._dbConnectorFacade = dbConnectorFacade;
        this._logger.debug(`${TokenService.name} - constructor`);
    }

    async getToken(tokenVal) {
        this._logger.debug(`${TokenService.name} - getToken`);
        return this._dbConnectorFacade.tokens.findToken(tokenVal);
    }
}

TokenService.diProperties = { name: 'tokenService', type: 'class', singleton: true };
TokenService.inject       = ['logger', 'dbConnectorFacade'];

module.exports = TokenService;