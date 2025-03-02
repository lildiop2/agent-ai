# LangGraph Agent: Automated Customer Service with LLM

## 📌 About the Project

This project is a **Proof of Concept (PoC)** for a customer service agent developed with **Node.js**, **LangChain**, and **LangGraph**. The main objective is to create an agent capable of facilitating consultancy scheduling in a natural and seamless manner, utilizing a **LLM (Large Language Model)** to make interactions more human-like.

## 💡 Motivation

While working with process automation, I realized that traditional command-based bots make it evident to users that they are interacting with a machine. To overcome this limitation, I used **LangGraph**, which implements graph concepts and abstracts mechanisms like **deterministic state machines**, enabling the creation of an intelligent agent capable of accessing different tools to autonomously execute tasks.

## 🛠️ Technologies Used

- **Node.js** – JavaScript runtime environment
- **LangChain** – Library for building LLM-based agents
- **LangGraph** – LangChain extension for graph-based flow modeling
- **Wppconnect** – An open-source project developed by the JavaScript community to export WhatsApp Web functions
- **Google API** – Used for calendar and email functionalities

## 🚀 Features

✔️ WhatsApp service for scheduling<br>
✔️ Natural consultancy scheduling<br>
✔️ LLM-powered interactions for a more human-like experience<br>

## 🏗️ Project Structure

```
📂 agent-ai
 ├── 📂 src
 │   ├── 📂 database    
 │   │   ├── 📂 entities         # Simulated database (JSON)
 │   │   ├── emails.js           # Simulated email services
 │   │   ├── events.js           # Simulated calendar services
 │   ├── 📂 tools                # Tools for LLM interactions
 │   ├── workflows.js            # Agent definition
 │   ├── app.js                  # Scheduling module
 │   ├── prompt.txt              # Prompt for LLM interactions
 │   ├── documento.txt           # Company knowledge base for RAG
 ├── 📄 package.json             # Project dependencies and scripts
 ├── 📄 README.md                # Project documentation
```

## ▶️ How to Run

1. Clone this repository:

   ```sh
   git clone https://github.com/lildiop2/agent-ai.git
   ```

2. Navigate to the project folder:

   ```sh
   cd agent-ai
   ```

3. Install dependencies:

   ```sh
   npm install
   ```

4. Use GitHub to obtain a personal access token for free usage of the models used in this PoC.
   - To get the token, visit: **GitHub Personal Access Token**
   - Generate a new token with appropriate permissions for LLM API access.
   - Configure the token in your runtime environment.

5. Run the agent in the terminal:

   ```sh
   npm run start
   ```

## 🔮 Next Steps

🔹 Programming task executing<br>

## 🤝 Contribution

If you like the project and want to contribute, feel free to open an **issue** or submit a **pull request**. Any feedback is welcome! 😊

## 📖 Need Help?

For any questions or support, refer to the official documentation of the technologies used:

- [LangChain Docs](https://js.langchain.com/)
- [LangGraph Docs](https://langchain-ai.github.io/langgraphjs/)
- [Wppconnect Docs](https://wppconnect.io/)
- [Google API Docs](https://developers.google.com/)

---

📌 **If you found this project interesting, leave a star ⭐ and stay tuned for updates!**
