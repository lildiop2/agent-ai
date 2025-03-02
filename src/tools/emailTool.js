import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { google } from "googleapis";
import { colorLog } from "../utils/helper.js";
import { authorize } from "../apis/google.js";
import { encodedMessage } from "../templates/notifications.js";
import logger from "../utils/logger.js";

/**
 * Initializes Google Gmail API client with authorization.
 */
const auth = await authorize();
const gmail = google.gmail({ version: "v1", auth });

/**
 * Sends an email using the Gmail API.
 *
 * @async
 * @function sendEmail
 * @param {Object} params - Email parameters.
 * @param {string} params.type - Type of email being sent.
 * @param {string} params.to - Recipient email address.
 * @param {string} params.subject - Email subject.
 * @param {string} params.body - Email message content.
 * @returns {Promise<Object>} Response object with success status and message.
 */
export const sendEmail = async ({ type, to, subject, body }) => {
  try {
    const mailOptions = {
      type,
      from: process.env.EMAIL_USER,
      to,
      subject,
      body,
    };

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage(mailOptions) },
    });

    const response = {
      success: true,
      message: `Email sent to ${to} regarding ${subject}`,
    };
    logger.info({
      message: "Sending email",
      module: "send_email_tool",
      operation: "send_email",
      request: { type, to, subject, body },
      response,
      error: null,
    });
    return response;
  } catch (error) {
    const response = {
      success: false,
      message: `Error sending email to ${to}: ${error.message}`,
    };
    logger.error({
      message: "Error sending email",
      module: "send_email_tool",
      operation: "send_email",
      request: { type, to, subject, body },
      response,
      error,
    });
    return response;
  }
};

/**
 * Tool for sending email notifications related to appointments.
 */
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
