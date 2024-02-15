import { type SubscriberConfig, type SubscriberArgs } from "@medusajs/medusa";
import { CustomerService } from "@medusajs/medusa";

export default async function handlePasswordReset({
  data, eventName, container, pluginOptions,
}: SubscriberArgs<{ id: string; token: string; email: string; first_name?: string; last_name?: string }>) {
  const sendGridService = container.resolve("sendgridService");

  // Assuming `data` includes the customer ID, reset token, and email
  // first_name and last_name are optional based on your provided structure
  const { id, token, email, first_name, last_name } = data;

  sendGridService.sendEmail({
    api_key: process.env.SENDGRID_API_KEY,
    templateId: process.env.SENDGRID_RESET_PASSWORD_ID,
    from: process.env.SENDGRID_FROM,
    to: email,
    dynamic_template_data: {
      reset_link: `${process.env.STORE_URL}/PasswordReset?token=${token}`,
      // Assuming you might want to use first_name and last_name in the template
      first_name,
      last_name,
      button_text: "Reset Password", // Text for the button
      // You can include other dynamic data needed by your template
    },
  });
}

export const config: SubscriberConfig = {
  event: CustomerService.Events.PASSWORD_RESET,
  context: {
    subscriberId: "customer-password-reset-handler",
  },
};