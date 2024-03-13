import React, { useState, useRef } from "react";
import WhiteBoard from "./WhiteBoard";

const JoinRoom = ({ socket, user, roomId }) => {
  const [tool, setTool] = useState("");
  const [color, setColor] = useState("black");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const undo = () => {
    if (elements.length > 1) {
      setHistory((prev) => [...prev, elements[elements.length - 1]]);
      const newitem = elements;
      newitem.pop();
      setElements([...newitem]);
    }
  };

  const Redo = () => {
    console.log(history);

    if (history.length >= 1) {
      console.log("Entered");
      setElements((prev) => [...prev, history[history.length - 1]]);
      const newitem = history;
      newitem.pop();
      if (newitem.length) {
        setHistory([...newitem]);
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillRect = "white";
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setElements([]);
  };

  return (
    <div className="w-full h-dvh space-y-10">
      <div className="flex flex-row justify-center lg:justify-between flex-wrap gap-4 items-center mt-4 mx-10">
        <div
          className={`flex gap-5 mx-5 text-xl border border-black py-2 px-4 rounded-lg`}
        >
          <div className="flex flex-row gap-1">
            <label className={`${tool === "pencil" && "!text-green-500"}`}>
              Pencil
            </label>
            <input
              type="radio"
              name="tool"
              id="pencil"
              value="pencil"
              onChange={(e) => setTool(e.target.value)}
            />
          </div>
          <div className="flex flex-row gap-1">
            <label className={`${tool === "line" && "!text-green-500"}`}>
              Line
            </label>
            <input
              type="radio"
              name="tool"
              id="line"
              value="line"
              onChange={(e) => setTool(e.target.value)}
            />
          </div>
          <div className="flex flex-row gap-1">
            <label className={`${tool === "rect" && "!text-green-500"}`}>
              Rectangle
            </label>
            <input
              type="radio"
              name="tool"
              id="rect"
              value="rect"
              onChange={(e) => setTool(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-4 border border-black py-2 px-4 rounded-lg">
          <button
            className="h-10 w-10 bg-black rounded-full"
            onClick={() => setColor("#000000")}
          ></button>
          <button
            className="h-10 w-10 bg-red-600 rounded-full"
            onClick={() => setColor("#dc2626")}
          ></button>
          <button
            className="h-10 w-10 bg-yellow-400 rounded-full"
            onClick={() => setColor("#facc15")}
          ></button>
          <button
            className="h-10 w-10 bg-blue-600 rounded-full"
            onClick={() => setColor("#2563eb")}
          ></button>
          <button
            className="h-10 w-10 bg-green-600 rounded-full"
            onClick={() => setColor("#16a34a")}
          ></button>
          {/* <input
            type="color"
            name="color"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-10 rounded-full bg-green-200"
          /> */}
        </div>
        {console.log(color)}
        <div className="flex flex-row ml-4 gap-3">
          <a href="/">
            <button className="bg-red-600 w-[60px] text-white rounded-lg h-[40px] ">
              Exit
            </button>
          </a>
          <button
            onClick={undo}
            className="bg-blue-500 w-[60px] text-white rounded-lg h-[40px] "
          >
            Undo
          </button>
          <button
            onClick={Redo}
            className="w-[60px] text-blue-500 rounded-lg h-[40px] border-blue-500 border-2 "
          >
            Redo
          </button>

          <button
            onClick={clearCanvas}
            className="w-[120px] bg-red-600 text-white h-[40px] rounded-lg mr-2"
          >
            Clear Canvas
          </button>
        </div>
      </div>
      <div className="mx-10 h-[530px] border-2 border-gray-800 border-dashed">
        <WhiteBoard
          socket={socket}
          user={user}
          canvasRef={canvasRef}
          ctxRef={ctxRef}
          elements={elements}
          setElements={setElements}
          tool={tool}
          color={color}
          roomId={roomId}
          className="border-2 border-black"
        />
      </div>
    </div>
  );
};

export default JoinRoom;
