const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Send an email
 * @param {string} to - recipient
 * @param {string} subject
 * @param {string} html - html body
 */
const sendEmail = async ({ to, subject, html }) => {
    const mailOptions = {
        from: `"RentifyAI" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    };

    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn("Nodemailer: Missing EMAIL_USER or EMAIL_PASS in .env. Email skipped.");
            return true;
        }
        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Nodemailer Failed:", error.message);
        return false; // Fail silently so the main function continues
    }
};

module.exports = sendEmail;
