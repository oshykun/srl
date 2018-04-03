const flash = require('connect-flash');

module.exports = app => {
    app.use(flash()); // use connect-flash for flash messages stored in session
};