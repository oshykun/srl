module.exports = app => {
    app.use(async (req, res, next) => {
        const loggedInUserId = req.session.userId;
        if (loggedInUserId) {
            const diManager = req.app.sww.diManager;
            let userService = diManager.getValue('userService');
            req.user        = await userService.getUserById(loggedInUserId);
        }
        return next();
    });
};