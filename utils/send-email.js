import transporter, { accountEmail } from '../config/nodemailer.js';


export const sendReminderEmail = async ({ to, type, subscription }) => {
    if(!to || !type) throw new Error("Missing required parameters: to and type");

    const template = emailTemplates.find((t) => t.type === type);
    if(!template) throw new Error(`No email template found for type: ${type}`);

    const mailInfo = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: subscription.renewalDate.format('YYYY-MM-DD'),
        planName: subscription.planName,
        price: `${subscription.currency} ${subscription.price.toFixed(2)} ${subscription.frequency}`,
        paymentMethos: subscription.paymentMethod,
    }

    const message = template.generateBody(mailInfo);

    const subject = template.generateSubject(mailInfo);

    const mailOptions = {
        from: accountEmail,
        to:to,
        subject: subject,
        html: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error)  return console.error(`Error sending email to ${to}:`, error);
        console.log(`Email sent to ${to}: ${info.response}`);
    });
};