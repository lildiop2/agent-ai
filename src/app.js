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
// Gerenciar eventos
client.onMessage(async (message) => {
  // console.log(message);
  if (message.isGroupMsg === false && message.type === "chat") {
    colorLog("User: " + message.content, "cyan");
    const response = await startRunnable(message.content, message.chatId);

    colorLog("Agent: " + response, "yellow");
    await client.sendText(message.from, response, {});
  }
});

// // Create Readline Interface
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// const chatId = uuid();

// async function processInput(input) {
//   if (input.toLowerCase() === "exit") {
//     rl.close();
//     return;
//   }

//   const result = InputBodySchema.safeParse({ message: input, chatId });
//   if (!result.success) {
//     colorLog("Invalid input: " + result.error.message, "red");
//     askQuestion();
//     return;
//   }

//   try {
//     const response = await startRunnable(input, chatId);
//     colorLog("Agent: " + response, "yellow");
//   } catch (error) {
//     colorLog("Error processing request: " + error.message, "red");
//   }

//   askQuestion();
// }

// function askQuestion() {
//   rl.question("User: ", processInput);
// }

// askQuestion();
