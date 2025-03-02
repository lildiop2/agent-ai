import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const Log = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  // Foreground (text) colors
  fg: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    crimson: "\x1b[38m",
  },
  // Background colors
  bg: {
    black: "\x1b[40m",
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    blue: "\x1b[44m",
    magenta: "\x1b[45m",
    cyan: "\x1b[46m",
    white: "\x1b[47m",
    crimson: "\x1b[48m",
  },
};

export const colorLog = (text, color = "blue") => {
  console.log(`${Log.fg[color]}%s${Log.reset}`, text);
};
export const getNextAvailableDates = (quantity = 20, startDate) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const currentDate = adjustStartDate(startDate);
  const dates = [];

  while (dates.length < quantity) {
    // Verificar se a data é válida e se é pelo menos 30 minutos após a data atual
    if (isBusinessHour(currentDate) && isAtLeast30MinutesAhead(currentDate)) {
      dates.push(formatDate(currentDate, options));
    }

    incrementDate(currentDate);
    handleEndOfDay(currentDate);
    skipWeekend(currentDate);
  }

  return dates;
};

const adjustStartDate = (startDate) => {
  const date = startDate ? new Date(startDate) : new Date();
  if (date < new Date()) date.setTime(new Date().getTime());
  return setToNextAvailableHour(date);
};

const setToNextAvailableHour = (date) => {
  if (
    date.getHours() < 8 ||
    (date.getHours() === 8 && date.getMinutes() === 0)
  ) {
    date.setHours(8, 0, 0, 0);
  } else {
    date.setHours(date.getHours() + 1, 0, 0, 0);
  }
  return date;
};

const isBusinessHour = (date) => {
  const hour = date.getHours();
  return !isWeekend(date) && hour >= 8 && hour < 17;
};

const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
};

const formatDate = (date, options) => {
  return date.toLocaleDateString("pt-BR", options);
};

const incrementDate = (date) => {
  date.setHours(date.getHours() + 1);
};

const handleEndOfDay = (date) => {
  if (date.getHours() >= 17) {
    date.setDate(date.getDate() + 1);
    date.setHours(8, 0, 0, 0);
  }
};

const skipWeekend = (date) => {
  if (isWeekend(date)) {
    const nextMonday = date.getDay() === 5 ? 2 : 1; // If it's Saturday, skip to Monday
    date.setDate(date.getDate() + nextMonday);
    date.setHours(8, 0, 0, 0);
  }
};

// Nova função para garantir que a data seja pelo menos 30 minutos após a atual
const isAtLeast30MinutesAhead = (date) => {
  const currentTime = new Date();
  const timeDifference = date - currentTime;
  return timeDifference >= 30 * 60 * 1000; // 30 minutos em milissegundos
};

//Define a custom annotation type for our state
async function summarizeConversation(state) {
  // First, we summarize the conversation
  const { summary, messages } = state;

  if (messages.length > 6) {
    let summaryMessage;
    if (summary) {
      // If a summary already exists, we use a different system prompt
      // to summarize it than if one didn't
      summaryMessage =
        `This is summary of the conversation to date: ${summary}\n\n` +
        "Extend the summary by taking into account the new messages above:";
    } else {
      summaryMessage = "Create a summary of the conversation above:";
    }

    const allMessages = [
      ...messages,
      new HumanMessage({
        id: uuidv4(),
        content: summaryMessage,
      }),
    ];
    const response = await model.invoke(allMessages);
    // We now need to delete messages that we no longer want to show up
    // I will delete all but the last two messages, but you can change this
    const deleteMessages = messages
      .slice(0, -2)
      .map((m) => new RemoveMessage({ id: m.id }));
    if (typeof response.content !== "string") {
      throw new Error("Expected a string response from the model");
    }
    return { summary: response.content, messages: deleteMessages };
  }
  return { summary: "", messages };
}
// Define a custom annotation that removes messages from the history
function deleteMessages(state) {
  const messages = state.messages;
  if (messages.length > 3) {
    return {
      messages: messages
        .slice(0, -3)
        .map((m) => new RemoveMessage({ id: m.id })),
    };
  }
  return {};
}

export const readData = (path) => {
  try {
    return readFileSync(path, "utf-8");
  } catch {
    writeFileSync(path, JSON.stringify("", null, 2), "utf8");
    return "";
  }
};

export const writeData = (path, data) =>
  writeFileSync(path, JSON.stringify(data, null, 2), "utf8");

export const convertToLocalDate = (date) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const utcDate = new Date(date);
  return utcDate.toLocaleDateString("pt-BR", options);
};
/**
 * Generates a random integer between two values.
 */
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
