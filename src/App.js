import { useState, useEffect, useMemo, useRef } from "react";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import debounce from "lodash.debounce";
import { v4 as uuidv4 } from "uuid";
import TopBar from "./components/TopBar";
import ChatBox from "./components/ChatBox";
import CodeEditor from "./components/CodeEditor";
import JoinRoom from "./components/JoinRoom";


function App() {
  const [code, setCode] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [socket, setSocket] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState("");
  const [saveStatus, setSaveStatus] = useState("Saved");

  const isRemoteChange = useRef(false);

  //  socket connect
  useEffect(() => {
  const newSocket = io("https://collab-editor-backend-1-lyl1.onrender.com");
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);


  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const roomId = params.get("room");

  if (roomId) {
    setRoom(roomId);   // 
  }
}, []);





  //  debounce send
  const sendCode = useMemo(() => {
    return debounce((newCode) => {
      if (!socket) return;

      socket.emit("send_message", {
        room,
        message: newCode,
      });
    }, 200);
  }, [socket, room]);

  useEffect(() => {
    return () => sendCode.cancel();
  }, [sendCode]);

  //  receive code
  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (newCode) => {
      isRemoteChange.current = true;
      setCode(newCode);
    });

    return () => socket.off("receive_message");
  }, [socket]);

  //  language sync
  useEffect(() => {
    if (!socket) return;

    socket.on("language_change", (lang) => {
      setLanguage(lang);
    });

    return () => socket.off("language_change");
  }, [socket]);

  //  users update

  useEffect(() => {
    if (!socket) return;

    socket.on("users_update", (usersList) => {
      setUsers(usersList);
    });

    return () => socket.off("users_update");
  }, [socket]);


  useEffect(() => {
  if (!socket) return;

  socket.on("receive_chat", (data) => {
     console.log("CHAT:", data); 
    setChat((prev) => [...prev, data]);
  });

  return () => socket.off("receive_chat");
}, [socket]);


useEffect(() => {
  if (!socket) return;

  socket.on("saved", () => {
    setSaveStatus("Saved");
  });

  return () => socket.off("saved");
}, [socket]);

  //  join room
  const createRoom = () => {
     if (room) return;
  const newRoomId = uuidv4();
  setRoom(newRoomId);
};

const copyLink = () => {
  const link = `${window.location.origin}?room=${room}`;
  navigator.clipboard.writeText(link);
  alert("Link copied!");
};


  const joinRoom = () => {
    if (!room || !username || !socket) {
      alert("Enter username and room ID");
      return;
    }
    console.log("Joining Room:", room);
    socket.emit("join_room", {
      room,
      username,
    });
  window.history.pushState({}, "", `?room=${room}`);

    setJoined(true);
  };

const sendMessage = () => {
  if (!msg.trim()) return;

  const chatData = {
    user: username,
    message: msg,
    time: new Date().toLocaleTimeString(),
  };

  //  LOCAL UI UPDAT
  setChat((prev) => [...prev, chatData]);

  socket.emit("send_chat", {
    room,
    message: msg,
  });

  setMsg("");
};

  //  change language
  const handleLanguage = (e) => {
    const lang = e.target.value;

    setLanguage(lang);

    socket.emit("language_change", {
      room,
      language: lang,
    });
  };

  return (
    <div className="container">
      <h2>Real-Time Code Editor</h2>

          {!joined ? (
           <JoinRoom
          username={username}
          setUsername={setUsername}
          room={room}
          setRoom={setRoom}
          joinRoom={joinRoom}
           createRoom={createRoom}
  />
      ) : (
        <>
         <TopBar
          room={room}
          users={users}
          copyLink={copyLink}
          saveStatus={saveStatus}
          language={language}
          handleLanguage={handleLanguage}
      />

      <div className="main">
  <div className="editor-section">
    <CodeEditor
      code={code}
      language={language}
      setCode={setCode}
      sendCode={sendCode}
      isRemoteChange={isRemoteChange}
      setSaveStatus={setSaveStatus}
    />
  </div>

  <div className="chat-section">
    <ChatBox
      chat={chat}
      username={username}
      msg={msg}
      setMsg={setMsg}
      sendMessage={sendMessage}
    />
  </div>
</div>
        </>
      )}
    </div>
  );
}

export default App;