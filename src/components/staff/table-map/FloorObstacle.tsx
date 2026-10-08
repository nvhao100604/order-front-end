'use client';

import React from 'react';

interface FloorObstacleProps {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const FloorObstacle: React.FC<FloorObstacleProps> = ({ label, x, y, width, height }) => {
  return (
    <div
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
      className="absolute bg-[#F3EAD3] text-[#5F6575] rounded-xl text-xs font-medium flex items-center justify-center border border-[#CFC3A6]/40 select-none shadow-xs"
    >
      {label}
    </div>
  );
};
