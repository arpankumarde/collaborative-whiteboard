import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { LuRefreshCcw } from "react-icons/lu";
import { FaRegCopy } from "react-icons/fa6";

const server = "https://wboard.onrender.com";

var randomToken = require("random-token");

const CreateRoom = ({ setUser, socket, setRoomIdProp }) => {
  const navig = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [joinRoom, setJoinRoom] = useState();
  const [name, setName] = useState("Room 1");
  const [nameJoin, setNameJoin] = useState("User 1");

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomId);
  };

  useEffect(() => {
    socket.on("connect", () => {
      setRoomId(socket.id);
      console.log("connected", socket.id);
    });
  }, []);

  const handleCreateRoom = async () => {
    try {
      const data = {
        name,
        roomId: roomId,
        userId: randomToken(10),
        host: true,
      };
      setUser(name);
      setRoomIdProp(roomId);

      socket.emit("userJoined", {
        roomId: roomId,
      });
      navig(`/${roomId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const generate = () => {
    setRoomId(randomToken(20));
  };

  const handleRoomJoin = (e) => {
    if (!nameJoin || !joinRoom) return;

    e.preventDefault();
    socket.emit("userJoined", {
      roomId: joinRoom,
    });
    setUser(nameJoin);
    setRoomIdProp(joinRoom);
    navig(`/${joinRoom}`);
  };

  useEffect(() => {
    socket.on("userIsJoined", (data) => {
      if (data.success) {
        console.log("user joined hurray");
      } else {
        console.log("UserJoined Error");
      }
    });
  }, []);

  return (
    <div className="my-10 w-full h-screen">
      <h1 className="font-thin text-center text-2xl my-10">
        learninGo Screens by T-Rex
      </h1>
      <div className="flex md:flex-row flex-col w-100dvh md:gap-0 gap-4 items-center justify-evenly">
        <div className="w-full md:w-5/12 md:border-4 border-black/5 rounded-lg flex flex-col p-8 md:p-10">
          <h1 className="text-center min-w-full font-bold text-blue-600/90 text-3xl mb-10">
            Create Room
          </h1>
          <div className="flex flex-col gap-4">
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="pl-2 h-[40px] focus:border-blue-400 focus:border-3 outline-none bg-transparent border-black/5 border-2 rounded-lg"
            />
            <div className="flex flex-row justify-between gap-2">
              <input
                disabled
                value={roomId}
                placeholder="Generate Room Code"
                className="pl-2 w-full h-[40px] focus:border-blue-400 focus:border-3 outline-none placeholder:bg-white/40 border-black/5 border-2 rounded-lg"
              />
              <button
                className="bg-blue-600 text-white rounded-lg h-[40px] w-[40px] flex justify-center items-center"
                onClick={generate}
              >
                <LuRefreshCcw />
              </button>
              <button
                className="bg-red-600 text-white rounded-lg h-[40px] w-[40px] flex justify-center items-center"
                onClick={handleCopyCode}
              >
                <FaRegCopy />
              </button>
            </div>
          </div>
          <button
            onClick={handleCreateRoom}
            className="mt-6 h-[50px] bg-black hover:bg-white hover:text-black transition-all duration-300 border-2 border-black text-white"
          >
            Create Room
          </button>
        </div>
        <div className="w-full md:w-5/12 md:border-4 border-black/5 rounded-lg flex flex-col p-8 md:p-10">
          <h1 className="text-center min-w-full font-bold text-blue-600/90 text-3xl mb-10">
            Join Room
          </h1>
          <div className="flex flex-col gap-4">
            <input
              value={nameJoin}
              onChange={(e) => setNameJoin(e.target.value)}
              placeholder="Name"
              className="pl-2 h-[40px] focus:border-blue-400 focus:border-3 outline-none bg-transparent border-black/5 border-2 rounded-lg"
            />
            <input
              placeholder="Room Id"
              value={joinRoom}
              onChange={(e) => setJoinRoom(e.target.value)}
              className="pl-2 h-[40px] focus:border-blue-400 focus:border-3 outline-none bg-transparent border-black/5 border-2 rounded-lg"
            />
          </div>
          <button
            onClick={handleRoomJoin}
            className="mt-6 h-[50px] bg-black hover:bg-white hover:text-black transition-all duration-300 border-2 border-black text-white"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
