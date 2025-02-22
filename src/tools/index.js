import { ToolNode } from "@langchain/langgraph/prebuilt";
import { sendMailTool } from "./emailTool.js";
import {
  makeAnAppointmentTool,
  cancelAnAppointmentTool,
  listAvailableADatesTool,
  getClientAppointmentsTool,
} from "./scheduleTool.js";
import { calculatorTool } from "./mathTool.js";
import { retrieverTool } from "./searchTool.js";

export const tools = [
  retrieverTool,
  calculatorTool,
  sendMailTool,
  listAvailableADatesTool,
  makeAnAppointmentTool,
  cancelAnAppointmentTool,
  getClientAppointmentsTool,
];
export const toolNode = new ToolNode(tools);
