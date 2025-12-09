import { useState } from "react";

<<<<<<< HEAD
import { geminiModel } from "../lib/gemini";

export default function AskPrabhav() {
=======
export default function ChatBot() {
>>>>>>> c05bf24 (DPR template and Gemini)
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

<<<<<<< HEAD
  const sendMessage = async () => {
    if (!input.trim()) return;

    // const UserPrompt = "You are AskPrabhav, an AI assistant for users of this employee-productivity-measurement platform. Your job is to help users with questions related to their work, productivity, planning, and general guidance. Be clear, concise, and practical. If information is missing, ask a brief clarifying question.";
    const UserPrompt = `You are AskPrabhav, an AI assistant for this platform. You provide accurate, practical, and professional guidance based strictly on the provided user context. Do not assume details that are not explicitly stated.`;

    const email = "field1@gmail.com"; // TODO: get from auth context
    const dbData = await fetchUserContext(email);
    const userContext = formatUserContext(dbData);

    const finalPrompt = `${UserPrompt}; ${userContext}; User question:${input}`;
    setInput(""); // clear input while waiting

    const typingMsg = { sender: "bot", text: "Typing..." };
    setMessages(prev => [...prev, typingMsg]);

    try {
      // Call Gemini
      const result = await geminiModel.generateContent([finalPrompt]);
      const text = await result.response.text?.() || JSON.stringify(result.response);

      const botMsg = { sender: "bot", text };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const botMsg = { sender: "bot", text: "Error: " + (err?.message || String(err)) };
      setMessages((prev) => [...prev, botMsg]);
      console.error("Gemini error:", err);
    }
=======
  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    // SIMPLE WEBSITE-SCOPED BOT LOGIC
    let reply = "I can answer site-related questions only.";

    if (input.toLowerCase().includes("contact")) {
      reply = "You can reach support at support@example.com";
    } else if (input.toLowerCase().includes("about")) {
      reply = "This website provides XYZ services.";
    } else if (input.toLowerCase().includes("help")) {
      reply = "Sure! What do you need help with?";
    }

    const botMsg = { sender: "bot", text: reply };
    setMessages((prev) => [...prev, botMsg]);

    setInput("");
>>>>>>> c05bf24 (DPR template and Gemini)
  };

  return (
    <div>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            padding: "12px 18px",
            borderRadius: "50%",
            background: "#4a60e0",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
            zIndex: 9999,
          }}
        >
          💬
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "320px",
            height: "420px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              padding: "12px",
              background: "#4a60e0",
              color: "white",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
<<<<<<< HEAD
            <span>AskPrabhav</span>
=======
            <span>Chatbot</span>
>>>>>>> c05bf24 (DPR template and Gemini)
            <button
              onClick={() => setOpen(false)}
              style={{ background: "transparent", border: "none", color: "white" }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              fontSize: "14px",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "10px",
                  textAlign: m.sender === "user" ? "right" : "left",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    background: m.sender === "user" ? "#d0d8ff" : "#f1f1f1",
                  }}
                >
                  {m.text}
                </span>
              </div>
            ))}
          </div>

          <div style={{ padding: "10px", display: "flex" }}>
            <input
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your question..."
            />
            <button
              onClick={sendMessage}
              style={{
                marginLeft: "8px",
                padding: "8px 12px",
                borderRadius: "6px",
                background: "#4a60e0",
                color: "white",
                border: "none",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
<<<<<<< HEAD

async function fetchUserContext(email) {
  const res = await fetch(
    "https://eight-csdo.onrender.com/api/users/get-by-email",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch user context");
  }

  return res.json(); // { message, user, team }
}

function formatUserContext(dbResponse) {
  if (!dbResponse?.user) {
    return "User context not available.";
  }

  const { user, team } = dbResponse;

  return `
User profile:
- Name: ${user.name}
- Email: ${user.email}
- Role: ${user.role}
- Employee code: ${user.emp_code || "N/A"}

${team ? `
Team context:
- Team name: ${team.name || "N/A"}
- Team role: ${team.role || "N/A"}
` : ""}
`;
}
=======
>>>>>>> c05bf24 (DPR template and Gemini)
