import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE_PATH = join(__dirname, "entities", "emails.json");

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

let emails = readData();

export const getAllEmails = () => emails;
export const getEmailById = (id) => emails.find((email) => email.id === id);

export const createEmail = ({ to, subject, body, from }) => {
  const newEmail = {
    id: Date.now().toString(),
    to,
    from,
    subject,
    body,
    sentAt: new Date().toISOString(),
  };
  emails.push(newEmail);
  writeData(emails);
  return newEmail;
};

export const deleteEmail = (id) => {
  const index = emails.findIndex((email) => email.id === id);
  if (index === -1) return false;
  emails.splice(index, 1);
  writeData(emails);
  return true;
};
