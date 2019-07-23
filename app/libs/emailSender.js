const nodemailer = require('nodemailer');

class EmailSender {

    constructor(logger, emailConfig) {
        this._logger      = logger;
        this._emailConfig = emailConfig;

        this._transporter = nodemailer.createTransport({
            host  : this._emailConfig.host,
            port  : this._emailConfig.port,
            secure: true,
            auth  : {
                user: this._emailConfig.email,
                pass: this._emailConfig.password
            },
        });

        this._defaultEmailOptions = {
            from   : `"SRL" 👻 <${this._emailConfig.email}>`,
            subject: 'Confirm email ✔',
        };
        this._logger.debug(`${EmailSender.name} - constructor`);
    }

    sendEmail(mailOptions) {
        Object.assign(mailOptions, this._defaultEmailOptions);
        return new Promise((resolve, reject) => {
            this._transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return reject(error);
                }
                this._logger.debug(`Email was successfully sent: ${info.messageId}`);
                resolve();
            })
        });
    }
}

EmailSender.diProperties = { name: 'emailSender', type: 'class', singleton: true };
EmailSender.inject       = ['logger', 'emailConfig'];

module.exports = EmailSender;
