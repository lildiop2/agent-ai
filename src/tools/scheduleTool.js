import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { google } from "googleapis";
import { authorize } from "../apis/google.js";
import { convertToLocalDate } from "../utils/helper.js";
import logger from "../utils/logger.js";

const auth = await authorize();
const calendar = google.calendar({ version: "v3", auth });

/**
 * Returns available time slots excluding busy periods.
 */
const getAvailableHoursFromFreeBusy = ({
  googleCalenderFreeBusyResponse,
  workHoursStart = 8,
  workHoursEnd = 18,
  slotDuration = 60,
  timeZoneOffset = -3,
}) => {
  const timeMin = new Date(googleCalenderFreeBusyResponse.timeMin);
  let timeMax = new Date(googleCalenderFreeBusyResponse.timeMax);
  const now = new Date();
  if (timeMax < now) {
    timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + 3);
  }

  const busyTimes =
    googleCalenderFreeBusyResponse.calendars?.primary?.busy?.map(
      ({ start, end }) => ({
        start: new Date(start),
        end: new Date(end),
      })
    ) || [];

  const availableSlots = [];
  let current = new Date(timeMin);

  if (current < now) current = now;

  while (current < timeMax) {
    if (![0, 6].includes(current.getUTCDay())) {
      for (
        let hour = workHoursStart;
        hour < workHoursEnd;
        hour += slotDuration / 60
      ) {
        const slotStart = new Date(current);
        slotStart.setUTCHours(hour - timeZoneOffset, 0, 0, 0);
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);

        if (slotEnd > timeMax) break;

        const isBusy = busyTimes.some(
          ({ start, end }) => slotStart < end && slotEnd > start
        );
        if (!isBusy) {
          availableSlots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
          });
        }
      }
    }
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return availableSlots;
};

/**
 * Creates an event in Google Calendar.
 */
const createEvent = async ({ clientEmail, title, date, time }) => {
  try {
    const startDate = `${date.split("-").reverse().join("-")}T${time}:00-03:00`;
    const endDate = `${date.split("-").reverse().join("-")}T${(
      parseInt(time.split(":")[0]) + 1
    )
      .toString()
      .padStart(2, "0")}:${time.split(":")[1]}:00-03:00`;

    const event = {
      summary: title,
      location: "Google Meet",
      description: title,
      start: { dateTime: startDate, timeZone: "America/Sao_Paulo" },
      end: { dateTime: endDate, timeZone: "America/Sao_Paulo" },
      attendees: [{ email: clientEmail }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 30 },
          { method: "popup", minutes: 10 },
        ],
      },
    };

    const createdEvent = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });
    const response = {
      success: true,
      message: `Event "${createdEvent.data.summary}" scheduled for ${date} at ${time}.`,
    };
    logger.info({
      message: "Creating an appointment",
      module: "make_an_appointment_tool",
      operation: "create_event",
      request: { clientEmail, title, date, time },
      response,
      error: null,
    });
    return response;
  } catch (error) {
    const response = {
      success: false,
      message: `Error scheduling event: ${error.message}`,
    };
    logger.error({
      message: "Error creating an appointment",
      module: "make_an_appointment_tool",
      operation: "create_event",
      request: { clientEmail, title, date, time },
      response,
      error,
    });
    return response;
  }
};

/**
 * Cancels an event in Google Calendar.
 */
const deleteEvent = async ({ appointmentId }) => {
  try {
    const { data: appointment } = await calendar.events.get({
      calendarId: "primary",
      eventId: appointmentId,
    });
    const { status } = await calendar.events.delete({
      calendarId: "primary",
      eventId: appointmentId,
    });

    const response = {
      success: status >= 200 && status < 300,
      message:
        status >= 200 && status < 300
          ? `Canceled appointment with ${appointment?.attendees?.[0]?.email} on ${appointment?.start?.dateTime}.`
          : "Failed to cancel appointment.",
    };
    logger.info({
      message: "Cancelling appointment",
      module: "cancel_an_appointment_tool",
      operation: "delete_event",
      request: { appointmentId },
      response,
      error: null,
    });
    return response;
  } catch (error) {
    const response = {
      success: false,
      message: `Error canceling event: ${error.message}`,
    };
    logger.error({
      message: "Error cancellling appointment",
      module: "cancel_an_appointment_tool",
      operation: "delete_event",
      request: { appointmentId },
      response,
      error,
    });
    return response;
  }
};

/**
 * Retrieves scheduled events for a given client email.
 */
const getEventsByClientEmail = async ({ clientEmail }) => {
  try {
    const res = await calendar.events.list({
      calendarId: "primary",
      alwaysIncludeEmail: true,
      orderBy: "startTime",
      q: clientEmail,
      singleEvents: true,
    });

    const response = {
      success: true,
      appointments:
        res.data.items.map(({ id, summary, start, end }) => ({
          id,
          summary,
          start,
          end,
        })) || [],
    };
    logger.info({
      message: "fetching client appointment",
      module: "get_client_appointments_tool",
      operation: "get_events_by_client_email",
      request: { clientEmail },
      response,
      error: null,
    });
    return response;
  } catch (error) {
    const response = {
      success: false,
      message: `Error fetching appointments: ${error.message}`,
    };
    logger.error({
      message: " Error fetching client appointment",
      module: "get_client_appointments_tool",
      operation: "get_events_by_client_email",
      request: { clientEmail },
      response,
      error,
    });
    return response;
  }
};

/**
 * Retrieves available time slots from Google Calendar.
 */
const getAvailableDates = async ({ timeMax, timeMin, timeZone }) => {
  try {
    const { data } = await calendar.freebusy.query({
      requestBody: { items: [{ id: "primary" }], timeMax, timeMin, timeZone },
    });
    const response = {
      success: true,
      availableDates: getAvailableHoursFromFreeBusy({
        googleCalenderFreeBusyResponse: data,
      }).map(({ start, end }) => ({
        start: convertToLocalDate(start),
        end: convertToLocalDate(end),
      })),
    };
    logger.info({
      message: "fetching available dates from google calendar",
      module: "list_available_dates_tool",
      operation: "get_available_dates",
      request: { timeMax, timeMin, timeZone },
      response,
      error: null,
    });
    return response;
  } catch (error) {
    const response = {
      success: false,
      message: `Error fetching available dates: ${error.message}`,
    };
    logger.error({
      message: "Error fetching available dates from google calendar",
      module: "list_available_dates_tool",
      operation: "get_available_dates",
      request: { timeMax, timeMin, timeZone },
      response,
      error,
    });
    return response;
  }
};

export const makeAnAppointmentTool = tool(createEvent, {
  name: "make_an_appointment",
  description: "Schedule an appointment.",
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
      .trim()
      .min(1, "Date is required")
      .max(10, "Invalid date format")
      .regex(/^\d{2}-\d{2}-\d{4}$/, "Date must be in DD-MM-YYYY format")
      .describe("Event date (DD-MM-YYYY)"),
    time: z
      .string()
      .trim()
      .regex(/^\d{2}:\d{2}$/)
      .min(1, "Time is required")
      .max(5, "Invalid time format")
      .describe("Event time (HH:MM)"),
    description: z
      .string()
      .trim()
      .optional()
      .describe("Optional event description"),
  }),
});
export const cancelAnAppointmentTool = tool(deleteEvent, {
  name: "cancel_an_appointment",
  description: "Cancel an appointment.",
  schema: z.object({
    appointmentId: z
      .string()
      .trim()
      .min(1, "appointmentId is required")
      .describe("Id of the client appointment to be canceled."),
  }),
});
export const getClientAppointmentsTool = tool(getEventsByClientEmail, {
  name: "get_client_appointments",
  description: "Retrieve client appointments.",
  schema: z.object({
    clientEmail: z
      .string()
      .trim()
      .min(1, "Client email is required")
      .describe("Email of the client attending to the event"),
  }),
});
export const listAvailableDatesTool = tool(getAvailableDates, {
  name: "list_available_dates",
  description: "Get available time slots.",
  schema: z.object({
    timeMin: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?([+-]\d{2}:\d{2}|Z)$/,
        "Invalid datetime format. Expected ISO 8601 with offset."
      )
      // .refine((val) => new Date(val) > new Date(), {
      //   message: "timeMin must be a future date.",
      // })
      .default(() => new Date().toISOString())
      .describe(
        "The start of the interval. Must be a future date. Example: 'YYYY-MM-DDTHH:MM:SS[+/-]HH:MM'"
      )
      .optional(),

    timeMax: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?([+-]\d{2}:\d{2}|Z)$/,
        "Invalid datetime format. Expected ISO 8601 with offset."
      )
      .default(() => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 3);
        return futureDate.toISOString();
      })
      .describe(
        "The end of the interval. Must be a future date greater than timeMin."
      )
      .optional(),

    timeZone: z
      .string()
      .refine((tz) => new Set(Intl.supportedValuesOf("timeZone")).has(tz), {
        message: "Invalid timezone",
      })
      .default("America/Sao_Paulo")
      .describe("The time zone to use for the interval."),
  }),
  // .refine(
  //   (data) => {
  //     if (data.timeMin && data.timeMax) {
  //       return new Date(data.timeMax) > new Date(data.timeMin);
  //     }
  //     return true;
  //   },
  //   {
  //     message: "timeMax must be greater than timeMin.",
  //     path: ["timeMax"],
  //   }
  // ),
});
