"use client";

import React, { useState, useRef, useEffect } from 'react';

const InteractiveGrid = () => {
  const gridRef = useRef(null);
  const [lines, setLines] = useState([]);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });

  const updatePosition = (clientX, clientY) => {
    const rect = gridRef.current.getBoundingClientRect();
    const x = clientX - rect.left - (rect.width / 2);
    const y = clientY - rect.top - (rect.height / 2);
    setCurrentPosition({ x, y });
  };

  const gridStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    backgroundColor: '#000000', 
    background: `radial-gradient(circle, #686868 1px, #000000 1px), 
                 radial-gradient(circle, #686868 1px, #000000 1px)`, // Adjusted to use #000000 for a blacker appearance
    backgroundPosition: '0 0, 25px 25px',
    backgroundSize: '50px 50px',
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      updatePosition(e.clientX, e.clientY);
    };

    const handleMouseClick = (e) => {
      updatePosition(e.clientX, e.clientY);
      setLines(prevLines => [...prevLines, { start: startPosition, end: currentPosition }]);
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

  const getLineStyle = (start, end) => {
    const angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
    const length = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
    return {
      width: `${length}px`,
      transform: `rotate(${angle}deg)`,
      transformOrigin: '0',
    };
  };

  // Function to render a circle at a given position
  const renderCircle = (position) => (
    <div style={{
      position: 'absolute',
      borderRadius: '50%',
      width: '10px',
      height: '10px',
      backgroundColor: 'red',
      top: `calc(50% + ${position.y}px - 5px)`, // Adjusting for the circle's size
      left: `calc(50% + ${position.x}px - 5px)`, // Adjusting for the circle's size
    }} />
  );

  return (
    <div ref={gridRef} style={gridStyle}>
      {lines.map((line, index) => (
        <>
          <div key={`line-${index}`} style={{
            position: 'absolute',
            background: 'blue',
            height: '2px',
            ...getLineStyle(line.start, line.end),
            top: `calc(50% + ${line.start.y}px)`,
            left: `calc(50% + ${line.start.x}px)`,
          }} />
          {renderCircle(line.start)}
          {renderCircle(line.end)}
        </>
      ))}
      <div style={{
        position: 'absolute',
        background: 'blue',
        height: '2px',
        ...getLineStyle(startPosition, currentPosition),
        top: `calc(50% + ${startPosition.y}px)`,
        left: `calc(50% + ${startPosition.x}px)`,
      }} />
      {renderCircle(startPosition)}
      {renderCircle(currentPosition)}
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
      }} />
    </div>
  );
};

export default InteractiveGrid;
