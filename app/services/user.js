const randomstring = require('randomstring');

class UserService {

    // TODO: think of reducing parameters number
    constructor(logger, dbConnectorFacade, cacheWrapper, cryptoService, emailSender, cacheConfig, authConfig) {
        this._logger            = logger;
        this._dbConnectorFacade = dbConnectorFacade;
        this._cacheWrapper      = cacheWrapper;
        this._cryptoService     = cryptoService;
        this._emailSender       = emailSender;
        this._authConfig        = authConfig;
        this._maxRegisterUsers  = cacheConfig.maxRegisterUsers;
        this._registerTTLSec    = cacheConfig.registerTTLSec;
        this._loginTTLSec       = cacheConfig.loginTTLSec;
        this._maxLoginFails     = cacheConfig.maxLoginFails;
        this._logger.debug(`${UserService.name} - constructor`);
    }

    async createUser(ipAddress, { email, password, confirmPassword }, serverUrl) {
        this._logger.debug(`${UserService.name} - createUser`);
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match!');
        }
        let existingUser = await this._dbConnectorFacade.users.findVerifiedUserByEmail(email);
        if (existingUser) {
            throw new Error('That email is already taken.');
        }
        validatePassword(password);

        let accessCount = this._cacheWrapper.getCachedValue(ipAddress);
        if (accessCount) {
            if (accessCount >= this._maxRegisterUsers) {
                throw Error(`Maximum ${this._maxRegisterUsers} users is allowed to be registered in ${this._registerTTLSec / (60 * 60)} hour`);
            }
            let expiresMs = this._cacheWrapper.getTTLByKey(ipAddress);
            this._cacheWrapper.putValueInCache(ipAddress, ++accessCount, Math.round((expiresMs - Date.now()) / 1000));
        }

        let user = await this._dbConnectorFacade.users.createNewUser(
            email, this._cryptoService.getHash(this._authConfig.secret, password)
        );

        let tokenString = randomstring.generate({ length: 64 });
        this._cacheWrapper.putValueInCache(ipAddress, 1, this._registerTTLSec);
        return Promise.all([
            // TODO: add cleanup index into mongodb in order to remove unused tokens
            this._dbConnectorFacade.tokens.createNewToken(tokenString, user._id),
            this._emailSender.sendEmail({
                to  : email,
                // TODO: move it out to template and require it
                html: `<p>Please follow the link to complete registration: </p><a href="${serverUrl}/email_confirm/${tokenString}">${serverUrl}/email_confirm/${tokenString}</a>`
            })
        ]);
    }

    async getUserById(userId) {
        this._logger.debug(`${UserService.name} - getUserById`);
        return this._dbConnectorFacade.users.findUserById(userId);
    }

    async confirmRegistration(userId) {
        this._logger.debug(`${UserService.name} - confirmRegistration`);
        return this._dbConnectorFacade.users.updateUserStatus(userId, 'verified');
    }

    async getUserByEmailAndPassword(email, password) {
        this._logger.debug(`${UserService.name} - getUserByEmailAndPassword`);
        let user = await this._dbConnectorFacade.users.findVerifiedUserByEmail(email);

        let inputFailsCount = this._cacheWrapper.getCachedValue(email) || 0;
        if (inputFailsCount >= this._maxLoginFails && user) {
            await this._dbConnectorFacade.users.updateUserStatus(user._id, 'inactive');
            throw new Error(`You have entered incorrect email/password more than ${this._maxLoginFails} times. You account was frozen.`);
        }

        if (!user) {
            updateValueInCache.call(this, email, ++inputFailsCount, this._loginTTLSec);
            throw new Error('User for given email was not found or not verified yet.');
        }
        let inputPasswordHash = this._cryptoService.getHash(this._authConfig.secret, password);
        if (inputPasswordHash !== user.passwordHash) {
            updateValueInCache.call(this, email, ++inputFailsCount, this._loginTTLSec);
            throw new Error('Entered password is incorrect.');
        }
        return user;
    }
}

// TODO: refactor -> do not do useless counting
const updateValueInCache = function (key, value, defaultExpiresSec) {
    let expiresMs = this._cacheWrapper.getTTLByKey(key) || (Date.now() + defaultExpiresSec * 1000);
    this._cacheWrapper.putValueInCache(key, value, Math.round((expiresMs - Date.now()) / 1000));
};

const validatePassword = (password) => {
    if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/).test(password)) {
        throw new Error('Password needs to include numbers (such as:123), letters (such as: BCD) and letters in upper case (such as: bcd) at the same time.');
    }
    if (containsSameLetters(password, 5)) {
        throw new Error('Password can contain maximum of 4 same letters (eg: aaaa).');
    }
    if (containsConsecutiveLetters(password, 4)) {
        throw new Error('Password can contain maximum of 4 consecutive letters (eg: abcd).');
    }
};

const containsSameLetters = (str, times) => {
    let sameLettersList = str.match(/([a-zA-Z])\1*/g) || [];
    return sameLettersList.some(letters => letters.length >= times);
};

const containsConsecutiveLetters = (str, number) => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let letters    = str.toLowerCase().split('');
    return letters.some(letter => {
        let startIndex = alphabet.indexOf(letter);
        if (startIndex === -1) {
            return false;
        }
        let consecutiveStr = new RegExp(alphabet.slice(startIndex, startIndex + number));
        return consecutiveStr.test(str);
    });
};

UserService.diProperties = { name: 'userService', type: 'class', singleton: true };
UserService.inject       = ['logger', 'dbConnectorFacade', 'cacheWrapper', 'cryptoService', 'emailSender', 'cacheConfig', 'authConfig'];

module.exports = UserService;