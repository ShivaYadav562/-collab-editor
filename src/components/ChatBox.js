import React, { useEffect, useRef } from "react";

function ChatBox({ chat, username, msg, setMsg, sendMessage }) {

  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="chat-container">
      <h3>Chat</h3>

      <div className="chat-messages">
        {chat.map((c, i) => (
          <div
            key={i}
            className={`chat-message ${c.user === username ? "you" : ""}`}
          >
            <strong>
              {c.user === username ? "You" : c.user}
            </strong>: {c.message}
            <div className="chat-time">{c.time}</div>
          </div>
        ))}

        {/*  AUTO SCROLL POINT */}
        <div ref={bottomRef} />
      </div>

      <input
        className="chat-input"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Type message..."
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
      />

      <button className="chat-btn" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
}

export default ChatBox;