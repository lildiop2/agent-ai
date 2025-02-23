import { tool } from "@langchain/core/tools";

import { z } from "zod";
import { createRetrieverTool } from "langchain/tools/retriever";
import { vectorStore } from "../database/embeddings/embed.js";
// import { MongoDBAtlasVectorSearch } from "some-mongo-library";
// Custom Data Source, Vector Stores

const retriever = vectorStore.asRetriever({
  k: 3,
});

export const retrieverTool = createRetrieverTool(retriever, {
  name: "consulting_search_function",
  description:
    "Use this tool when searching for information about software development consulting. It can help you find information about software development consulting services and their offerings. You should provide a query to search for specific information.",
  schema: z.object({
    query: z.string().describe("text to search"),
  }),
});

// Tool para buscar usuário
export const userSearchTool = tool(
  async ({ query, n = 10 }) => {
    console.log("User search tool called");

    const dbConfig = {
      collection: "users",
      indexName: "user_index",
      textKey: "user_data",
      embeddingKey: "embedding",
    };

    const vectorStore = new MongoDBAtlasVectorSearch(embeddings, dbConfig);
    const result = await vectorStore.similaritySearchWithScore(query, n);

    return JSON.stringify(result);
  },
  {
    name: "user_search",
    description: "Searches for users in the database",
    schema: z.object({
      query: z.string().describe("The search query"),
      n: z
        .number()
        .optional()
        .default(10)
        .describe("Number of results to return"),
    }),
  }
);
