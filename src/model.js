import { ChatOllama } from "@langchain/ollama";
import { tools } from "./tools/index.js";
import { ChatOpenAI } from "@langchain/openai";

export const ollamaLLM = new ChatOllama({
  baseUrl: process.env.OLLAMA_MODEL_URL || "http://localhost:11434",
  model: process.env.OLLAMA_MODEL_NAME || "llama3.2",
  temperature: 0,
  maxRetries: 2,
  // other params...
}).bindTools(tools);

export const openaiLLM = new ChatOpenAI({
  baseURL:
    process.env.OPENAI_BASE_URL || "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN,
  model: process.env.OPENAI_MODEL_NAME || "gpt-4o",
  maxRetries: 2,
}).bindTools(tools);
