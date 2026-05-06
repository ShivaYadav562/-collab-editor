import React from "react";

function JoinRoom({ username, setUsername, room, setRoom, joinRoom, createRoom }) {
  return (
    <div className="join-container">
      <div className="join-box">

        <input
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder="Enter Room ID"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />

        <button onClick={joinRoom}>Join Room</button>

        <button onClick={createRoom}>Create Room</button>

      </div>
    </div>
  );
}

export default JoinRoom;