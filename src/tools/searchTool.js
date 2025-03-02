import { z } from "zod";
import { createRetrieverTool } from "langchain/tools/retriever";
import { vectorStore } from "../database/embeddings/embed.js";

const retriever = vectorStore.asRetriever({
  k: 3,
});

export const retrieverTool = createRetrieverTool(retriever, {
  name: "company_knowledge_base",
  description:
    "Use this tool when searching for information about software development consulting. It can help you find information about software development consulting services and their offerings. You should provide a query to search for specific information.",
  schema: z.object({
    query: z.string().describe("text to search"),
  }),
});
