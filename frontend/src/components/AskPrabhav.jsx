import { useState } from "react";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

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
            <span>Chatbot</span>
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
