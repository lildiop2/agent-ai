import { ToolNode } from "@langchain/langgraph/prebuilt";
import { sendMailTool } from "./emailTool.js";
import { Calculator } from "@langchain/community/tools/calculator";
import {
  makeAnAppointmentTool,
  cancelAnAppointmentTool,
  listAvailableDatesTool,
  getClientAppointmentsTool,
} from "./scheduleTool.js";

import { retrieverTool } from "./searchTool.js";
const calculator = new Calculator();
export const tools = [
  calculator,
  retrieverTool,
  sendMailTool,
  listAvailableDatesTool,
  makeAnAppointmentTool,
  cancelAnAppointmentTool,
  getClientAppointmentsTool,
];
export const toolNode = new ToolNode(tools);
