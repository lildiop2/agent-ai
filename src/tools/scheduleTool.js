import { tool } from "@langchain/core/tools";
import { optional, z } from "zod";
import { createEvent, deleteEvent, getAllEvents } from "../database/events.js";
import { getNextAvailableDates, colorLog } from "../utils/helper.js";
// Tool para agendamento de eventos
export const makeAnAppointmentTool = tool(
  async ({ clientEmail, title, date, time }) => {
    colorLog("makeAnAppointmentTool called", "blue");
    const event = createEvent({
      clientEmail,
      title,
      date,
      time,
    });
    return {
      success: true,
      message: `The event "${event.title}" has been scheduled for ${date} at ${time}.`,
    };
  },
  {
    name: "make_an_appointment",
    description: "make an appointment in the calendar system.",
    schema: z.object({
      clientEmail: z
        .string()
        .trim()
        .min(1, "Client email is required")
        .describe("Email of the client attending the event"),
      title: z
        .string()
        .trim()
        .min(1, "Event title is required")
        .describe("Subject of the scheduled event"),
      date: z
        .string()
        .regex(/^\d{2}-\d{2}-\d{4}$/, "Date must be in DD-MM-YYYY format")
        .describe("Event date (DD-MM-YYYY)"),
      time: z
        .string()
        .regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format")
        .describe("Event time (HH:MM)"),
      description: z
        .string()
        .trim()
        .optional()
        .describe("Optional event description"),
    }),
  }
);

export const cancelAnAppointmentTool = tool(
  async ({ clientEmail, date }) => {
    colorLog("Cancel Appointment tool called", "blue");
    const appointment = getAllEvents().find(
      (appointment) =>
        appointment.clientEmail === clientEmail && appointment.date === date
    );
    deleteEvent(appointment.id);
    return JSON.stringify({
      success: true,
      message: `Appointment with ${appointment.clientEmail} on ${appointment.date} at ${appointment.time} for the event "${appointment.title}" has been canceled.`,
    });
  },
  {
    name: "cancel_an_appointment",
    description:
      "Cancel an appointment or event scheduled for a specific client.",
    schema: z.object({
      clientEmail: z
        .string()
        .trim()
        .min(1, "Client email is required")
        .describe("Email of the client attending the event"),
      date: z
        .string()
        .regex(/^\d{2}-\d{2}-\d{4}$/, "Date must be in DD-MM-YYYY format")
        .describe("Event date (DD-MM-YYYY)"),
    }),
  }
);

export const getClientAppointmentsTool = tool(
  async ({ clientEmail }) => {
    colorLog("Get Client Appointments tool called", "blue");

    const appointments = getAllEvents().filter(
      (appointment) => appointment.clientEmail === clientEmail
    );
    return JSON.stringify({
      success: true,
      appointments: appointments || null,
    });
  },
  {
    name: "get_client_appointments",
    description:
      "Get all the appointments or events scheduled for a specific client.",
    schema: z.object({
      clientEmail: z
        .string()
        .trim()
        .min(1, "Client email is required")
        .describe("Email of the client attending the event"),
    }),
  }
);
export const listAvailableADatesTool = tool(
  async () => {
    colorLog("calendar_search_function tool called", "blue");
    const availableDates = getNextAvailableDates(25);

    return JSON.stringify({
      success: true,
      availableDates: availableDates || null,
    });
  },
  {
    name: "calendar_search_function",
    description:
      "Returns object with a list of available dates and time for scheduling appointments in the calendar system.",
  }
);
