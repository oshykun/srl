exports.registerUser = async function (req, res, next) {
    let error;
    try {
        const diManager        = req.app.sww.diManager;
        const registerUserData = req.swagger.params.registerUserData.value;
        let ipAddress          = req.ip ||
            (req.headers['X-Forwarded-For'] || req.headers['x-forwarded-for'] || '').split(',')[0];

        const userService = diManager.getValue('userService');
        // TODO: maybe use env variable -> process.env.SWW_HOST ?
        await userService.createUser(ipAddress, registerUserData, req.app.sww.serverUrl);

        res.redirect('/v1.0/public/email_sent');
    } catch (err) {
        error = err;
        req.flash('registerMessage', err.message);
        res.redirect('/v1.0/public/register');
    } finally {
        next(error);
    }
};

exports.emailConfirm = async function (req, res, next) {
    let error;
    try {
        const tokenVal  = req.swagger.params.token.value;
        const diManager = req.app.sww.diManager;

        const tokenService = diManager.getValue('tokenService');
        let { userId }     = await tokenService.getToken(tokenVal);
        if (!userId) {
            return error = new Error(`No token found for given value: ${tokenVal}`);
        }
        const userService = diManager.getValue('userService');
        await userService.confirmRegistration(userId);

        res.redirect('/v1.0/public/login');
    } catch (err) {
        error = err;
    } finally {
        next(error);
    }
};