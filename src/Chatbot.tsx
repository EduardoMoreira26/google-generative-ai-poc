import {
  MainContainer,
  ChatContainer,
  MessageList,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";
import "./ChatBot.css";

export const ChatBot = () => {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { type: string; message: string }[]
  >([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleUserInput = (value: string) => {
    setUserInput(value);
  };

  const sendMessage = async (messageText: string) => {
    if (messageText.trim() === "") return;

    setChatHistory((prev) => [...prev, { type: "user", message: messageText }]);

    try {
      setIsTyping(true);
      const prompt = messageText;
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      setChatHistory((prev) => [...prev, { type: "bot", message: text }]);
      setUserInput("");
      setIsTyping(false);
    } catch (e) {
      console.log("Error occurred while fetching", e);
      setIsTyping(false);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        minWidth: "400px",
        maxWidth: "600px",
        margin: "20px auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
      }}
    >
      <div style={{ backgroundColor: "#0078d7", color: "#fff", padding: "10px", textAlign: "center" }}>
      ChatBot
      </div>
      <MainContainer style={{ backgroundColor: "#f9f9f9", height: "90%" }}>
        <ChatContainer style={{ height: "600px" }}>
          <MessageList
            style={{
              padding: "10px",
              backgroundColor: "#ffffff",
              borderBottom: "1px solid #eee",
            }}
            typingIndicator={
              isTyping && <TypingIndicator content="Bot esta digitando..." />
            }
          >
            {chatHistory.map((elt, i) => (
              <div
                key={i}
                className={`chat-bubble ${
                  elt.type === "user" ? "user-bubble" : "bot-bubble"
                }`}
              >
                <p className="chat-message">{elt.message}</p>
              </div>
            ))}
          </MessageList>
          <MessageInput
            placeholder="Digite sua mensagem aqui..."
            value={userInput}
            onChange={(value) => handleUserInput(value)}
            onSend={sendMessage}
            attachButton={false}
            style={{
              padding: "10px",
              backgroundColor: "#f1f1f1",
              borderRadius: "0 0 8px 8px",
              border: "none",
            }}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};
