export const generateEmailTemplate = ({
  userName,
  subscriptionName,
  renewalDate,
  planName,
  price,
  paymentMethod,
  accountSettingsLink,
  supportLink,
  daysLeft,
}) => `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff;">
    <tr>
      <td style="background-color: #4a90e2; text-align: center;">
        <p style="font-size: 54px; line-height: 54px; font-weight: 800;">SubDub</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="font-size: 16px; margin-bottom: 25px;">Hello <strong style="color: #4a90e2;">${userName}</strong>,</p>
        <p style="font-size: 16px; margin-bottom: 25px;">Your <strong>${subscriptionName}</strong> subscription is set to renew in <strong>${daysLeft} days</strong>.</p>

        <table cellpadding="15" cellspacing="0" border="0" width="100%" style="background-color: #f0f7ff; border-radius: 8px;">
          <tr>
            <td style="font-size: 16px; border-bottom: 1px solid #d0e3ff;">
              <strong>Plan:</strong> ${planName}
            </td>
          </tr>
          <tr>
            <td style="font-size: 16px; border-bottom: 1px solid #d0e3ff;">
              <strong>Renewal Date:</strong> ${renewalDate}
            </td>
          </tr>
          <tr>
            <td style="font-size: 16px; border-bottom: 1px solid #d0e3ff;">
              <strong>Price:</strong> ${price}
            </td>
          </tr>
          <tr>
            <td style="font-size: 16px;">
              <strong>Payment Method:</strong> ${paymentMethod}
            </td>
          </tr>
        </table>

        <p style="font-size: 16px; margin-bottom: 25px;">If you'd like to make changes or cancel your subscription, visit your account settings.</p>

        <p style="font-size: 16px; margin-top: 30px;">Need help? <a href="${supportLink}" style="color: #4a90e2;">Contact Support</a></p>

        <p style="font-size: 16px; margin-top: 30px;">
          Best regards,<br>
          <strong>The SubDub Team</strong>
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f0f7ff; padding: 20px; text-align: center; font-size: 14px;">
        <p style="margin: 0 0 10px;">SubDub Inc. | 123 Main St, Anytown, AN 12345</p>
        <p style="margin: 0;">
          <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Unsubscribe</a>
          <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
          <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Terms of Service</a>
        </p>
      </td>
    </tr>
  </table>
</div>
`;

export const emailTemplates = [
  {
    label: "7 days before reminder",
    generateSubject: (data) =>
      `📅 Reminder: Your ${data.subscriptionName} Subscription Renews in 7 Days!`,
    generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 7 }),
  },
  {
    label: "5 days before reminder",
    generateSubject: (data) =>
      `⌛ ${data.subscriptionName} Renews in 5 Days - Stay Subscribed!`,
    generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 5 }),
  },
  {
    label: "2 days before reminder",
    generateSubject: (data) =>
      `🚀 2 Days Left! ${data.subscriptionName} Subscription Renewal`,
    generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 2 }),
  },
  {
    label: "1 day before reminder",
    generateSubject: (data) =>
      `⚡ Final Reminder: ${data.subscriptionName} Renews Tomorrow!`,
    generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 1 }),
  },
//   {
//     label: "Final day reminder",
//     generateSubject: (data) =>
//       `✅ ${data.subscriptionName} Renews Today - You're All Set!`,
//     generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 0 }),
//   },
];