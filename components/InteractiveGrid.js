"use client";

import React, { useState, useRef, useEffect } from 'react';

const InteractiveGrid = () => {
  const gridRef = useRef(null);
  const [lines, setLines] = useState([]); // Array to hold all the lines
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });

  // Function to update the current position based on mouse events
  const updatePosition = (clientX, clientY) => {
    const rect = gridRef.current.getBoundingClientRect();
    const x = clientX - rect.left - (rect.width / 2);
    const y = clientY - rect.top - (rect.height / 2);
    setCurrentPosition({ x, y });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      updatePosition(e.clientX, e.clientY);
    };

    const handleMouseClick = (e) => {
      updatePosition(e.clientX, e.clientY);
      // Add the current line to the lines array
      setLines(prevLines => [...prevLines, { start: startPosition, end: currentPosition }]);
      // Set the new start position
      setStartPosition({ ...currentPosition });
    };

    const grid = gridRef.current;
    grid.addEventListener('mousemove', handleMouseMove);
    grid.addEventListener('click', handleMouseClick);

    return () => {
      grid.removeEventListener('mousemove', handleMouseMove);
      grid.removeEventListener('click', handleMouseClick);
    };
  }, [currentPosition]);

  // Function to calculate the style for each line
  const getLineStyle = (start, end) => {
    const angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
    const length = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
    return {
      width: `${length}px`,
      transform: `rotate(${angle}deg)`,
      transformOrigin: '0',
    };
  };

  return (
    <div ref={gridRef} style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Render all previous lines */}
      {lines.map((line, index) => (
        <div key={index} style={{
          position: 'absolute',
          background: 'blue',
          height: '2px',
          ...getLineStyle(line.start, line.end),
          top: `calc(50% + ${line.start.y}px)`,
          left: `calc(50% + ${line.start.x}px)`,
        }} />
      ))}
      {/* Render the current line */}
      <div style={{
        position: 'absolute',
        background: 'blue',
        height: '2px',
        ...getLineStyle(startPosition, currentPosition),
        top: `calc(50% + ${startPosition.y}px)`,
        left: `calc(50% + ${startPosition.x}px)`,
      }} />
      {/* The grid */}
      <div style={{
        position: 'absolute',
        border: '1px solid #ccc',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0.3)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(10px, 1fr))',
        gridAutoRows: '10px',
      }}>
        {/* Render grid dots here */}
      </div>
    </div>
  );
};

export default InteractiveGrid;
