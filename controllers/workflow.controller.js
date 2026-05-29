import dayjs from 'dayjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js';
import { now } from 'mongoose';

const REMINDERS = [
  { daysBefore: 7, message: 'Your subscription is due for renewal in 7 days.' },
  { daysBefore: 3, message: 'Your subscription is due for renewal in 3 days.' },
  { daysBefore: 1, message: 'Your subscription is due for renewal tomorrow.' },
];

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  console.log(`Sending reminder for subscription ID: ${subscriptionId}`);

  const subscription = await fetchSubscription(context, subscriptionId);
   console.log("subscription status:", subscription?.status); // 👈 add!
console.log("subscription:", subscription); // 👈 add!

  // ✅ fixed condition
  if (!subscription || subscription.status !== 'Active') return;

  // ✅ fixed renewalDate
  const renewalDate = dayjs(subscription.renewalDate);
//   console.log("renewalDate:", renewalDate.format()); // 👈 add this!
// console.log("today:", dayjs().format());           // 👈 add this!

  if (renewalDate.isBefore(dayjs())) {
    console.log(`Subscription ${subscriptionId} is past due. Stopping workflow`);
    return;
  }

for (const reminder of REMINDERS) {
  const reminderDate = renewalDate.subtract(reminder.daysBefore, 'day');

  if (reminderDate.isAfter(dayjs())) {
    await sleepUntilReminder(
      context,
      `Reminder ${reminder.daysBefore} days before`,
      reminderDate
    );for (const reminder of REMINDERS) {
  const reminderDate = renewalDate.subtract(reminder.daysBefore, 'day');

  if (reminderDate.isAfter(dayjs())) {
    await sleepUntilReminder(
      context,
      `Reminder ${reminder.daysBefore} days before`,
      reminderDate
    );
  }

  // send email when reminder date is reached!
  await triggerReminder(
    context,
    `Reminder ${reminder.daysBefore} days before`,
    reminder.message,
    subscription
  );
}
  }

  // send email when reminder date is reached!
  await triggerReminder(
    context,
    `Reminder ${reminder.daysBefore} days before`,
    reminder.message,
    subscription
  );
}
});

// ✅ fixed fetchSubscription
const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription details', async () => {
    return await Subscription.findById(subscriptionId).populate('user', 'name email');
  });
};

// ✅ fixed sleepUntilReminder
const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${date.toISOString()}`);
  await context.sleepUntil(label, date.toDate());
};

// ✅ fixed triggerReminder
const triggerReminder = async (context, label, message, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering reminder: ${message}`);


    // send email/SMS here
    await sendReminderEmail({
      to: subscription.user.email,
      type: 'reminder.label.subscription',
      
    });
  });
};