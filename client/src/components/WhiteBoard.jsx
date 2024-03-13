import React, { useEffect, useState } from "react";
import rough from "roughjs";

const roughGen = rough.generator();
const WhiteBoard = ({
  canvasRef,
  ctxRef,
  elements,
  setElements,
  tool,
  color,
  socket,
  user,
  roomId,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [rip, setRip] = useState(true); // If it true, then last update was true
  const [socketID, setSocketId] = useState("");

  useEffect(() => {
    socket.on("test", (data) => {
      if (data?.name == user) return;
      else {
        setRip(false);
        setElements(data?.pic);
      }
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height = window.innerHeight * 2;
    canvas.width = window.innerWidth * 2;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    ctxRef.current.strokeStyle = color;
  }, [color]);

  useEffect(() => {
    const roughCanvas = rough.canvas(canvasRef.current);
    // Clear the canvas first
    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    elements.forEach((element) => {
      if (element.type === "pencil") {
        roughCanvas.linearPath(element.path, {
          stroke: element.stroke,
          strokeWidth: 5,
          roughness: 0,
        });
      } else if (element.type === "line") {
        roughCanvas.draw(
          roughGen.line(
            element.offsetX,
            element.offsetY,
            element.width,
            element.height,
            {
              stroke: element.stroke,
              strokeWidth: 5,
              roughness: 0,
            }
          )
        );
      } else if (element.type === "rect") {
        roughCanvas.draw(
          roughGen.rectangle(
            element.offsetX,
            element.offsetY,
            element.width,
            element.height,
            {
              stroke: element.stroke,
              strokeWidth: 5,
              roughness: 0,
            }
          )
        );
      }
    });
    if (rip) {
      socket.emit("newData", {
        pic: elements,
        name: user,
        roomId: roomId,
      });
    }
  }, [elements]); // Update when elements or tool changes

  const handleMouseDown = (e) => {
    setRip(true);
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "pencil") {
      setElements((prev) => [
        ...prev,
        {
          type: "pencil",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: color,
        },
      ]);
    } else if (tool === "line") {
      setElements((prev) => [
        ...prev,
        {
          type: "line",
          offsetX,
          offsetY,
          width: offsetX,
          height: offsetY,
          stroke: color,
        },
      ]);
    } else if (tool === "rect") {
      setElements((prev) => [
        ...prev,
        {
          type: "rect",
          offsetX,
          offsetY,
          width: 0,
          height: 0,
          stroke: color,
        },
      ]);
    }

    setIsDrawing(true);
  };
  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (isDrawing) {
      if (tool === "pencil") {
        const { path } = elements[elements?.length - 1];
        const newPath = [...path, [offsetX, offsetY]];
        setElements((prev) =>
          prev.map((ele, index) => {
            if (index === elements?.length - 1) {
              return {
                ...ele,
                path: newPath,
              };
            } else {
              return ele;
            }
          })
        );
      } else if (tool === "line") {
        setElements((prev) =>
          prev.map((ele, index) => {
            if (index === elements?.length - 1) {
              return {
                ...ele,
                width: offsetX,
                height: offsetY,
              };
            } else {
              return ele;
            }
          })
        );
      } else if (tool === "rect") {
        setElements((prev) =>
          prev.map((ele, index) => {
            if (index === elements?.length - 1) {
              return {
                ...ele,
                width: offsetX - ele.offsetX,
                height: offsetY - ele.offsetY,
              };
            } else {
              return ele;
            }
          })
        );
      }
    }
  };
  const handleMouseUp = (e) => {
    setIsDrawing(false);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className="h-[100%] w-[100%] overflow-hidden"
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default WhiteBoard;
