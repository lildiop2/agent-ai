# LangGraph Agent: Automação de Atendimento com LLM

## 📌 Sobre o Projeto

Este projeto é um **Proof of Concept (PoC)** de um agent de atendimento desenvolvido com **Node.js**, **LangChain** e **LangGraph**. O objetivo principal é criar um agente capaz de facilitar o agendamento de consultorias de maneira natural e fluida, utilizando um **LLM (Large Language Model)** para tornar a interação mais próxima de uma conversa humana.

## 💡 Motivação

Ao trabalhar com automação de processos, percebi que bots tradicionais baseados em comandos tornam evidente para o usuário que ele está interagindo com uma máquina. Para superar essa limitação, utilizei o **LangGraph**, que implementa conceitos de grafos e abstrai mecanismos como **máquinas de estado determinísticas**, permitindo criar um agente inteligente capaz de acessar diferentes ferramentas para executar tarefas de forma autônoma.

## 🛠️ Tecnologias Utilizadas

- **Node.js** – Ambiente de execução JavaScript
- **LangChain** – Biblioteca para construção de agentes baseados em LLMs
- **LangGraph** – Extensão do LangChain para modelagem de fluxos baseados em grafos
- **JSON** – Simulação de dados de calendário de agendamentos e emails

## 🚀 Funcionalidades

✔️ Simulação de um bot de atendimento no terminal<br>
✔️ Agendamento de consultorias de forma natural<br>
✔️ Uso de um LLM para interações mais humanas<br>

## 🏗️ Estrutura do Projeto

```
📂 agent-ai
 ├── 📂 src
 │   ├── 📂 database    
 │   │   ├── 📂 entities         # Base de dados simulada (JSON)
 │   │   └── emails.js           # Simulação de serviços de emails
 │   │   └── events.js           # Simulação de  serviços de calendário
 │   ├── 📂 tools                # Ferramentas para interações com o llm
 │   ├── workflows.js            # Definição do agente
 │   ├── app.js                  # Módulo de agendamentos
 │   ├── prompt.txt              # prompt para interações com o LLM
 │   ├── documento.txt           # Base de conhecimento sobre empresa para fazer RAG
 ├── 📄 package.json             # Dependências e scripts do projeto
 ├── 📄 README.md                # Documentação do projeto
```

## ▶️ Como Executar

1. Clone este repositório:

   ```sh
   git clone https://github.com/lildiop2/agent-ai.git
   ```

2. Acesse a pasta do projeto:

   ```sh
   cd agent-ai
   ```

3. Instale as dependências:

   ```sh
   npm install
   ```

4. Use o GitHub para obter um token de acesso pessoal para o uso gratuito dos modelos usados no PoC.
   - Para obter o token, acesse: GitHub Personal Access Token

   - Gere um novo token com permissões adequadas para acesso à API dos LLMs.

   - Configure o token no seu ambiente de execução.

5.Execute o agente no terminal:

   ```sh
   npm run start
   ```

## 🔮 Próximos Passos

🔹 Integração com **WhatsApp** para atendimento automatizado<br>
🔹 Integração com **Gmail** para envio de confirmações<br>
🔹 Integração com **Google Calendar** para gerenciamento de horários<br>

## 🤝 Contribuição

Se você gostou do projeto e quer contribuir, fique à vontade para abrir uma **issue** ou enviar um **pull request**. Qualquer feedback é bem-vindo! 😊

---

📌 **Se achou interessante, deixe uma estrela ⭐ e acompanhe as próximas atualizações!**
