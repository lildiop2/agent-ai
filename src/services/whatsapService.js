import { create, Whatsapp } from "@wppconnect-team/wppconnect";
import logger from "../utils/logger.js";
export class WhatsappService {
  startSession = async (sessionName = "my-session") => {
    const client = await create({
      logger: logger,
      catchQR: (base64Qrimg, asciiQR, attempts, urlCode) => {
        console.log("Number of attempts to read the qrcode: ", attempts);
        console.log("Terminal qrcode: ", asciiQR);
      },
      statusFind: async (statusSession, session) => {
        console.log({
          statusSession,
          session,
        });
      },
      headless: true,
      browserArgs: [
        "--disable-web-security", // Disables web security
        "--no-sandbox", // Disables sandbox
        "--disable-setuid-sandbox",
        "--aggressive-cache-discard", // Aggressively discards cache
        "--disable-cache", // Disables cache
        "--disable-application-cache", // Disables application cache
        "--disable-offline-load-stale-cache", // Disables loading stale offline cache
        "--disk-cache-size=0", // Sets disk cache size to 0
        "--disable-background-networking", // Disables background networking activities
        "--disable-default-apps", // Disables default apps
        "--disable-extensions", // Disables extensions
        "--disable-sync", // Disables synchronization
        "--disable-translate", // Disables translation
        "--hide-scrollbars", // Hides scrollbars
        "--metrics-recording-only", // Records metrics only
        "--mute-audio", // Mutes audio
        "--no-first-run", // Skips first run
        "--safebrowsing-disable-auto-update", // Disables Safe Browsing auto-update
        "--ignore-certificate-errors", // Ignores certificate errors
        "--ignore-ssl-errors", // Ignores SSL errors
        "--ignore-certificate-errors-spki-list", // Ignores certificate errors in SPKI list
      ],

      devtools: false, // Open devtools by default
      useChrome: false, // If false will use Chromium instance,
      // executablePath: '/usr/bin/chromium-browser',// Path to chromium executable
      poweredBy: "Abdul Kevin Alexis", // powered by
      deviceName: "Agent AI", // device name
      puppeteerOptions: {
        userDataDir: "./userDataDir/" + sessionName,
      },
    });
    return client;
  };
}
