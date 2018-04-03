const BaseDomain = require('./base');

/**
 * @class UsersDomain
 * @param {object} logger
 * @param {object} mongoConnector
 * @constructor
 * @extends {BaseDomain}
 *
 *  Schema = {
 *           _id          : { type: ObjectID  }
 *           email        : { type: String    },
 *           passwordHash : { type: String    },
 *           createdAt    : { type: TimeStamp },
 *           status       : { type: String    }
 *       }
 */
class UsersDomain extends BaseDomain {

    constructor(logger, mongoConnector) {
        super(logger, mongoConnector, 'users');
        this._defaultCollection = 'users';
        this._logger.debug(`${UsersDomain.name} - constructor`);
    }

    async findUserById(userId) {
        this._logger.debug(`${UsersDomain.name} - findUserById`);
        if (!userId) {
            throw new Error('userId parameter is mandatory.');
        }
        return await this._mongoConnector.runMongoQuery((dbRef, defaultMaxTimeMS) => {
            return dbRef.collection(this._defaultCollection)
                        .findOne(
                            { _id: this._mongoConnector.castToObjectID(userId) },
                            { maxTimeMS: defaultMaxTimeMS }
                        );
        }, 'findUserById');
    }

    async findVerifiedUserByEmail(email) {
        this._logger.debug(`${UsersDomain.name} - findVerifiedUserByEmail`);
        if (!email) {
            throw new Error('email parameter is mandatory.');
        }
        return await this._mongoConnector.runMongoQuery((dbRef, defaultMaxTimeMS) => {
            return dbRef.collection(this._defaultCollection)
                        .findOne(
                            { email, status: 'verified' },
                            { maxTimeMS: defaultMaxTimeMS }
                        );
        }, 'findVerifiedUserByEmail');
    }

    async createNewUser(email, passwordHash) {
        this._logger.debug(`${UsersDomain.name} - createNewUser`);
        if (!email) {
            throw new Error('email parameter is mandatory.');
        }
        if (!passwordHash) {
            throw new Error('passwordHash parameter is mandatory.');
        }
        let result = await this._mongoConnector.runMongoQuery((dbRef) => {
            return dbRef.collection(this._defaultCollection)
                        .insertOne({
                            email,
                            passwordHash,
                            status   : 'pending',
                            createdAt: Date.now()
                        });
        }, 'createNewUser');

        return result.ops[0];
    }

    async updateUserStatus(userId, status) {
        this._logger.debug(`${UsersDomain.name} - updateUserStatus`);
        if (!userId) {
            throw new Error('userId parameter is mandatory.');
        }
        if (!status) {
            throw new Error('email parameter is mandatory.');
        }
        let { value: result } = await this._mongoConnector.runMongoQuery((dbRef, defaultMaxTimeMS) => {
            return dbRef.collection(this._defaultCollection)
                        .findOneAndUpdate(
                            { _id: this._mongoConnector.castToObjectID(userId) },
                            { $set: { status } },
                            { returnOriginal: false, maxTimeMS: defaultMaxTimeMS }
                        );
        }, 'updateUserStatus');
        if (!result) {
            throw new Error(`Can't update user status: ${userId.toString()}, status: ${status}`);
        }
        return result;
    }
}

module.exports = UsersDomain;