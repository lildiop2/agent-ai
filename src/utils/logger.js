import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { combine, timestamp, errors, json, colorize, simple, printf } = format;
const removeTimestamp = format((info, opts) => {
  if (info.timestamp) {
    delete info.timestamp;
    return info;
  }
});
const enumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});
// Configuração dos formatos
const logFormat = combine(
  enumerateErrorFormat(),
  timestamp({ alias: "@timestamp", format: "YYYY-MM-DD HH:mm:ss" }),
  removeTimestamp(),
  errors({ stack: true }), // Captura stack traces
  json() // Formato JSON estruturado
);
const customFormat = printf(
  ({ level, message, label = "", ...meta }) =>
    `${level}\t ${label} ${JSON.stringify(message)} ${formatMeta(meta)}`
);
const formatMeta = (meta) => {
  // You can format the splat yourself
  const splat = meta[Symbol.for("splat")];
  if (splat && splat.length) {
    return splat.length === 1
      ? JSON.stringify(splat[0])
      : JSON.stringify(splat);
  }
  return "";
};

const logger = createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format: logFormat,
  defaultMeta: { service: process.env.APP_NAME },
  transports: [
    new transports.Console({
      format: combine(colorize(), customFormat),
    }),

    new transports.File({
      filename: path.join(__dirname, "..", "logs", "error.log"),
      level: "error",
    }), //only error
    new transports.DailyRotateFile({
      dirname: path.join(__dirname, "..", "logs"),
      filename: process.env.APP_NAME + "-%DATE%.log",
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

// // Logger global para erros não capturados
// if (process.env.NODE_ENV !== "production") {
//     logger.add(new transports.Console({ format: format.simple() }));
// }

export default logger;
