exports.login = async function (req, res, next) {
    let error;
    try {
        const loggedInUser = req.session.userId;
        if (loggedInUser) {
            return res.redirect('/v1.0/private/profile');
        }
        const diManager           = req.app.sww.diManager;
        const { email, password } = req.swagger.params.loginUserData.value;

        let userService = diManager.getValue('userService');
        let user        = await userService.getUserByEmailAndPassword(email, password);

        req.session.userId = user._id;
        res.redirect('/v1.0/private/profile');
    } catch (err) {
        error = err;
        req.flash('loginMessage', err.message);
        res.redirect('/v1.0/public/login');
    } finally {
        next(error);
    }
};

exports.logout = async function (req, res, next) {
    let error;
    try {
        delete req.session.userId;
        res.redirect('/v1.0/public/home');
    } catch (err) {
        error = err;
    } finally {
        next(error);
    }
};