const crypto = require('crypto');

class CryptoWrapper {

    constructor(logger) {
        this._logger = logger;
        this._logger.debug(`${CryptoWrapper.name} - constructor`);
    }

    getHash(secret, text, algorithm = 'sha256') {
        this._logger.debug(`${CryptoWrapper.name} - encodeString`);

        return crypto.createHmac(algorithm, secret)
                     .update(new Buffer(text).toString('base64'))
                     .digest('hex');
    }

    isHashSame(secret, verifyString, hash, algorithm = 'sha256') {
        this._logger.debug(`${CryptoWrapper.name} - isHashSame`);

        let calculatedDigest = this.getHash(secret, verifyString, algorithm);
        return (calculatedDigest === hash);
    }
}

CryptoWrapper.diProperties = { name: 'cryptoService', type: 'class', singleton: true };
CryptoWrapper.inject       = ['logger'];

module.exports = CryptoWrapper;