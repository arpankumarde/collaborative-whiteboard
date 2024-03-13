import { useState, useMemo } from "react";
import CreateRoom from "./components/CreateRoom";
import { Route, Routes } from "react-router-dom";
import JoinRoom from "./components/JoinRoom";
import io from "socket.io-client";
const servers = "https://wboard.onrender.com";

function App() {
  const socket = useMemo(() => io(servers), []);
  // const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState("");
  const [roomId, setRoomId] = useState(null);

  return (
    <div className="h-dwh">
      <Routes>
        <Route
          path="/"
          element={
            <CreateRoom
              socket={socket}
              setUser={setUser}
              setRoomIdProp={setRoomId}
            />
          }
        />
        <Route
          path="/:roomId"
          element={<JoinRoom socket={socket} user={user} roomId={roomId} />}
        />
      </Routes>
    </div>
  );
}

export default App;
