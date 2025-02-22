import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE_PATH = join(__dirname, "entities", "events.json");

const readData = () => {
  try {
    return JSON.parse(readFileSync(FILE_PATH, "utf-8"));
  } catch {
    writeFileSync(FILE_PATH, JSON.stringify([], null, 2), "utf8");
    return [];
  }
};

const writeData = (data) =>
  writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf8");

let events = readData();

export const getAllEvents = () => events;
export const getEventById = (id) => events.find((event) => event.id === id);

export const createEvent = ({
  clientEmail,
  title,
  date,
  time,
  description,
}) => {
  const newEvent = {
    id: Date.now().toString(),
    clientEmail,
    title,
    date,
    time,
    description,
    createdAt: new Date().toISOString(),
  };
  events.push(newEvent);
  writeData(events);
  return newEvent;
};

export const updateEvent = (id, updatedEvent) => {
  const index = events.findIndex((event) => event.id === id);
  if (index === -1) return null;
  events[index] = { ...events[index], ...updatedEvent };
  writeData(events);
  return events[index];
};

export const deleteEvent = (id) => {
  const index = events.findIndex((event) => event.id === id);
  if (index === -1) return false;
  events.splice(index, 1);
  writeData(events);
  return true;
};
