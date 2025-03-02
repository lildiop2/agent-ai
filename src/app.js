import { startRunnable } from "./workflows.js";
import { v4 as uuid } from "uuid";
import readline from "readline";
import { z } from "zod";
import { colorLog } from "./utils/helper.js";
import { WhatsappService } from "./services/whatsapService.js";

const InputBodySchema = z.object({
  message: z.string().min(1),
  chatId: z.string().optional(),
});

const whatsapService = new WhatsappService();
const client = await whatsapService.startSession();

client.onMessage(async (message) => {
  // console.log(message);
  if (
    message.isGroupMsg === false &&
    message.type === "chat" &&
    message.chatId === "553195774939@c.us"
  ) {
    colorLog("User: " + message.content, "cyan");
    const response = await startRunnable(message.content, message.chatId);

    colorLog("Agent: " + response, "yellow");
    await client.sendText(message.from, response, {});
  }
});
