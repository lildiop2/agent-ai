import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { createEmail } from "../database/emails.js";
import { colorLog } from "../utils/helper.js";

/**
 * Tool para enviar e-mail
 */
const sendEmail = async ({ type, to, subject, body }) => {
  colorLog("Send Mail tool called", "blue");
  const mailOptions = {
    type,
    from: process.env.EMAIL_USER,
    to,
    subject: subject + "-" + type,
    text: body,
  };

  const createdEmail = createEmail(mailOptions);
  return JSON.stringify({
    success: true,
    message: `Email sent to ${createdEmail.to} regarding ${createdEmail.subject}`,
  });
};

export const sendMailTool = tool(sendEmail, {
  name: "send_email",
  description:
    "Sends email notifications for scheduling, rescheduling, or canceling an appointment.",
  schema: z.object({
    type: z
      .enum([
        "Agendamento de Consultoria",
        "Remarcação de Consultoria",
        "Cancelamento de Consultoria",
      ])
      .describe("Type of email to send"),
    to: z
      .string()
      .trim()
      .min(1, "Recipient email is required")
      .email("Invalid email format")
      .describe("Client's email address"),
    subject: z
      .string()
      .trim()
      .min(1, "Email subject is required")
      .describe("Email subject"),
    body: z
      .string()
      .trim()
      .min(1, "Email body content is required")
      .describe("Email message content"),
  }),
});
