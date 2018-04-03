exports.profile = (req, res, next) => {
    let error;
    try {
        res.render('profile.ejs', { user: req.user });
    } catch (err) {
        error = err;
    } finally {
        next(error);
    }
};