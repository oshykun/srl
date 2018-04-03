exports.homePage = (req, res, next) => {
    let error;
    try {
        res.render('index.ejs');
    } catch (err) {
        error = err;
    } finally {
        next(error);
    }
};

exports.login = (req, res, next) => {
    let error;
    try {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    } catch (err) {
        error = err;
    } finally {
        next(error);
    }
};

exports.register = (req, res, next) => {
    let error;
    try {
        // render the page and pass in any flash data if it exists
        res.render('register.ejs', { message: req.flash('registerMessage') });
    } catch (err) {
        error = err;
    } finally {
        next(error);
    }
};

exports.emailSent = (req, res, next) => {
    let error;
    try {
        res.render('emailSent.ejs');
    } catch (err) {
        error = err;
    } finally {
        next(error);
    }
};