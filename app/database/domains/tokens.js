const BaseDomain = require('./base');

/**
 * @class TokensDomain
 * @param {object} logger
 * @param {object} mongoConnector
 * @constructor
 * @extends {BaseDomain}
 *
 *  Schema = {
 *           _id          : { type: ObjectID  }
 *           userId       : { type: ObjectID  },
 *           token        : { type: String    }
 *       }
 */
class TokensDomain extends BaseDomain {

    constructor(logger, mongoConnector) {
        super(logger, mongoConnector, 'tokens');
        this._defaultCollection = 'tokens';
        this._logger.debug(`${TokensDomain.name} - constructor`);
    }

    async findToken(token) {
        this._logger.debug(`${TokensDomain.name} - findToken`);

        if (!token) {
            throw new Error('token parameter is mandatory.');
        }

        return await this._mongoConnector.runMongoQuery((dbRef, defaultMaxTimeMS) => {
            return dbRef.collection(this._defaultCollection)
                        .findOne(
                            { token },
                            { maxTimeMS: defaultMaxTimeMS }
                        );
        }, 'findToken');
    }

    async createNewToken(token, userId) {
        this._logger.debug(`${TokensDomain.name} - createNewToken`);
        if (!token) {
            throw new Error('token parameter is mandatory.');
        }
        if (!userId) {
            throw new Error('userId parameter is mandatory.');
        }
        let result = await this._mongoConnector.runMongoQuery((dbRef) => {
            return dbRef.collection(this._defaultCollection)
                        .insertOne({ token, userId: this._mongoConnector.castToObjectID(userId) });
        }, 'createNewToken');

        return result.ops[0];
    }
}

module.exports = TokensDomain;