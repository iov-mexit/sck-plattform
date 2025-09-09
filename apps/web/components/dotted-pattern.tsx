'use client';

import React from 'react';

interface DottedPatternProps {
  className?: string;
  height?: string;
  opacity?: number;
}

export function DottedPattern({ 
  className = '', 
  height = 'h-96', 
  opacity = 0.2 
}: DottedPatternProps) {
  return (
    <div className={`relative ${height} bg-white overflow-hidden ${className}`}>
      <div className="absolute inset-0">
        {/* Abstract dotted pattern - GIZA style */}
        <div className="absolute top-0 left-0 w-full h-full" style={{ opacity }}>
          <div className="grid grid-cols-20 gap-1">
            {Array.from({ length: 400 }).map((_, i) => {
              // Create landscape-like pattern with varying densities
              const x = i % 20;
              const y = Math.floor(i / 20);
              
              // Create mountain-like shapes with varying heights
              const mountainHeight = Math.sin(x * 0.3) * 8 + Math.cos(y * 0.2) * 4;
              const isInMountain = y > (10 - mountainHeight);
              
              // Add some randomness for organic feel
              const randomOffset = Math.random() * 0.3;
              const shouldShow = isInMountain && Math.random() > randomOffset;
              
              if (!shouldShow) return null;
              
              return (
                <div
                  key={i}
                  className="w-1 h-1 bg-black rounded-full"
                  style={{
                    opacity: Math.random() * 0.8 + 0.2,
                    transform: `translateY(${Math.sin(i * 0.1) * 20}px)`
                  }}
                />
              );
            })}
          </div>
        </div>
        
        {/* Central accent dot */}
        <div 
          className="absolute w-2 h-2 bg-black rounded-full"
          style={{
            top: '40%',
            left: '35%',
            opacity: 0.6
          }}
        />
      </div>
    </div>
  );
}
