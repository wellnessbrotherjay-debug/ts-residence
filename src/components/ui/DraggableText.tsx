import React, { useRef, useState } from "react";

interface DraggableTextProps {
  text: string;
  initialX?: number;
  initialY?: number;
  onSave?: (x: number, y: number) => void;
}

export const DraggableText: React.FC<DraggableTextProps> = ({ text, initialX = 100, initialY = 100, onSave }) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleSave = () => {
    if (onSave) onSave(position.x, position.y);
  };

  return (
    <div style={{ position: "absolute", left: position.x, top: position.y, cursor: dragging ? "grabbing" : "grab", zIndex: 100 }}>
      <div
        onMouseDown={handleMouseDown}
        style={{
          background: dragging ? "#f5f5f5" : "#fff",
          border: "1px solid #ccc",
          padding: "8px 16px",
          borderRadius: 6,
          boxShadow: dragging ? "0 2px 8px rgba(0,0,0,0.15)" : undefined,
          userSelect: "none",
        }}
      >
        {text}
      </div>
      <button onClick={handleSave} style={{ marginTop: 8, width: "100%", borderRadius: 4, background: "#222", color: "#fff", border: "none", padding: "4px 0", cursor: "pointer" }}>
        Save
      </button>
    </div>
  );
};
