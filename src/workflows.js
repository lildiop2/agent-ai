import {
  Annotation,
  MessagesAnnotation,
  MemorySaver,
  StateGraph,
  START,
  END,
} from "@langchain/langgraph";

import { HumanMessage, isAIMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { writeFileSync } from "node:fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
import { toolNode, tools } from "./tools/index.js";
import { openaiLLM as model } from "./model.js";
import { colorLog, readData } from "./utils.js";
const promptTxt = readData(join(__dirname, "prompt.txt"));
const EXAMPLES = `
{"name":"send_email_function", "parameters": {"type":"Appointment Confirmation", "to":"client@example.com", "subject":"Appointment Confirmed", "body":"Your appointment has been confirmed for February 20, 2025, at 10:00 AM."}}
{"name":"send_email_function", "parameters": {"type":"Appointment Rescheduling", "to":"client@example.com", "subject":"Appointment Rescheduled", "body":"Your appointment has been rescheduled to February 22, 2025, at 2:00 PM."}}
{"name":"send_email_function", "parameters": {"type":"Appointment Cancellation", "to":"client@example.com", "subject":"Appointment Cancelled", "body":"We regret to inform you that your appointment for February 20, 2025, has been cancelled. Please contact us if you need further assistance."}}
{"name":"schedule_event_function", "parameters": {"clientName":"John Doe", "title":"Business Meeting", "date":"2025-02-25", "time":"3:00 PM", "description":"Meeting to discuss new contracts and strategic initiatives."}}
`;

const formatResponse = (msg) => ({
  type: msg._getType(),
  content: msg?.content,
  tool_calls: msg?.tool_calls,
});

export const StateAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  counter: Annotation({
    reducer: (state) => state.counter + 1,
    default: () => 0,
  }),
});

export function shouldContinue(state) {
  const lastMessage = state.messages.at(-1);
  return isAIMessage(lastMessage) && lastMessage.tool_calls?.length
    ? "tools"
    : END;
}

export async function callModel(state) {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", promptTxt],
    new MessagesPlaceholder("messages"),
  ]);

  const formattedPrompt = await prompt.formatMessages({
    currentDate: new Date().toLocaleString("pt-BR", { timeZoneName: "short" }),
    toolNames: tools.map((tool) => tool.name).join(",\n"),
    examples: EXAMPLES,
    messages: state.messages,
  });
  // console.log({ formattedPrompt });
  return { messages: [await model.invoke(formattedPrompt)] };
}

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addEdge(START, "agent")
  .addNode("tools", toolNode)
  .addEdge("tools", "agent")
  .addConditionalEdges("agent", shouldContinue, {
    tools: "tools",
    __end__: END,
  });

export const checkpointer = new MemorySaver();
const app = workflow.compile({ checkpointer });

// //genarate the image graph
// const graph = app;
// graph
//   .getGraph()
//   .drawMermaidPng()
//   .then(async (image) => {
//     writeFileSync("./workflow_v1.png", await image.bytes());
//   });

export const startRunnable = async (query, thread_id) => {
  const finalState = await app.invoke(
    { messages: [new HumanMessage(query)] },
    { configurable: { thread_id } }
  );
  return finalState.messages.at(-1).content;
};
