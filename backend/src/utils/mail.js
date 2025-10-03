import { text } from "express"
import Mailgen from "mailgen"
import nodemailer from "nodemailer"

//sendEmail is an asynchronous function that takes an options object as input.
const sendEmail = async (options) => { //options usually contains: email, subject etc
    //Mailgen setup
    //Mailgen is a library to generate nice-looking HTML emails.
    const mailGenerator = new Mailgen({
        theme: "default", //theme: "default" → uses the default styling.
        product: { //product → metadata about your app.
            name: "SkillLink",
            link: "https://SkillLink-------.com"
        }
    })

    //emailTextual → plain text version of the email (for email clients that don’t support HTML).
    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)

    //emailHtml → HTML version with styling.
    const emailHTML = mailGenerator.generate(options.mailgenContent)

    //configure NodeMailer
    //Nodemailer is used to actually send the email.
    const transporter = nodemailer.createTransport({ //createTransport defines how emails are sent:
        //host and port → SMTP server details (here using Mailtrap for testing).
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: { //auth → SMTP credentials.
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
    })

    //creating email object
    const mail = {
        from: "mail.SkillLink@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHTML
    }

    //sending the email
    try {
        await transporter.sendMail(mail)
    }
    catch (error) {
        console.error("Email service failed silently, Make sure that you have provided your MAILTRAP credentials in the .env file")
        console.error("Error: ", error)
        console.log("../backend/utils/mail.js")
    }
}

//helper function for generating a Mailgen template specifically for email verification.
const emailVerificationMailgenContent = (username, verificationUrl) => { //accepts username, verificationUrl or verificationToken
    return { //returns object that Mailgen understands
        body: { 
            name: username,
            intro: "Welcome to our App!, we are excited to have you on board.",
            action: {
                instructions: "To verify your email please click on the following button",
                button: {
                    color: "#22BC66",
                    text: "Verify your Email",
                    link: verificationUrl
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help."
        },
    };
};

//helper function for generating a Mailgen template specifically for forget Password verification.
const forgetPasswordMailgenContent = (username, passwordResetUrl) => {
    return { //returns object that mailgen understands
        body: { 
            name: username,
            intro: "We got a request to reset the password of your account.",
            action: {
                instructions: "To reset your password please click on the following button or link.",
                button: {
                    color: "#22BC66",
                    text: "Reset password",
                    link: passwordResetUrl
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help."
        },
    };
};

export { sendEmail, emailVerificationMailgenContent, forgetPasswordMailgenContent }