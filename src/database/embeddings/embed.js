import { tool } from "@langchain/core/tools";

import { z } from "zod";
import { createRetrieverTool } from "langchain/tools/retriever";
// import { MongoDBAtlasVectorSearch } from "some-mongo-library";
// Custom Data Source, Vector Stores
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OllamaEmbeddings } from "@langchain/ollama";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { OpenAIEmbeddings } from "@langchain/openai";
//embedding models
export const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

//store
export const vectorStore = new MemoryVectorStore(embeddings);
const __dirname = dirname(fileURLToPath(import.meta.url));
const loader = new TextLoader(join(__dirname, "..", "..", "document.txt"));
const docs = await loader.load();
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 400,
  chunkOverlap: 80,
});
const splitDocs = await splitter.splitDocuments(docs);
//index chunks
await vectorStore.addDocuments(splitDocs);

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
