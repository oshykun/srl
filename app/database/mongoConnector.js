const { MongoClient, ObjectID } = require('mongodb');

class MongoConnector {

    constructor(logger, dbConfig) {
        this._logger = logger;
        if (!dbConfig) {
            throw new Error('dbConfig object is mandatory.');
        }
        if (!dbConfig.connectionURL) {
            throw new Error('dbConfig.connectionURL property is mandatory.');
        }
        this._config           = dbConfig;
        this._defaultMaxTimeMS = this._config.defaultMaxTimeMS || 4000;

        this._mongoConnector = MongoClient.connect(this._config.connectionURL);
        this._logger.debug(`${MongoConnector.name} - constructor`);
    }

    async getDbRef() {
        this._logger.debug(`${MongoConnector.name} - getDbRef`);
        let dbRef = await this._mongoConnector;
        return dbRef.db();
    }

    castToObjectID(value) {
        this._logger.debug(`${MongoConnector.name} - castToObjectID`);
        return (ObjectID.isValid(value) ? new ObjectID(value) : value);
    }

    isValidObjectId(value) {
        this._logger.debug(`${MongoConnector.name} - isValidObjectId`);
        return ObjectID.isValid(value);
    }

    async disconnect() {
        this._logger.debug(`${MongoConnector.name} - disconnect`);
        let dbRef = await this.getDbRef();
        return dbRef.close();
    }

    async runMongoQuery(func, callerFuncName, returnFields = [], maxAttempts = 3) {
        this._logger.debug(`${MongoConnector.name} - runMongoQuery`);
        // if no returnFields were supplied - return all fields from db
        let returnQueryFieldsObj = returnFields.reduce((result, field) => {
            result[field] = 1;
            return result;
        }, {});
        let lastError;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                return await func(await this.getDbRef(), this._defaultMaxTimeMS, returnQueryFieldsObj);
            } catch (err) {
                if (err.message && err.message.toLowerCase() === 'topology was destroyed') {
                    lastError            = err;
                    this._mongoConnector = MongoClient.connect(this._config.connectionURL);
                    continue;
                }
                if (err.message && err.message.toLowerCase() === 'operation exceeded time limit') {
                    this._logger.warn(`Operation exceeded time limit function: ${callerFuncName} - retry: ${attempt}`);
                    lastError = err;
                    continue;
                }
                throw err;
            }
        }
        this._logger.warn(`${MongoConnector.name}. Exceed max attempts. Max attempts: ${maxAttempts}`);
        throw lastError;
    }
}

MongoConnector.diProperties = { name: 'mongoConnector', type: 'class', singleton: true };
MongoConnector.inject       = ['logger', 'dbConfig'];

module.exports = MongoConnector;