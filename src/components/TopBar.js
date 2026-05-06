import React from "react";

function TopBar({ room, users, copyLink, saveStatus, language, handleLanguage }) {
  return (
    <div className="top-bar">
      <div className="top-left">
        <span>Room: {room}</span>

        <button onClick={copyLink}>Copy Link</button>

        <span>
          Users: {users.map((u) => u.name).join(", ")}
        </span>

        <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
          {saveStatus}
        </span>
      </div>

      <div className="controls">
        <select value={language} onChange={handleLanguage}>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="c">C</option>
        </select>
      </div>
    </div>
  );
}

export default TopBar;