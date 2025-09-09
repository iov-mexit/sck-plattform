'use client';

import React from 'react';
import { DottedPattern } from './dotted-pattern';

interface PageLayoutProps {
  children: React.ReactNode;
  showPattern?: boolean;
  patternHeight?: string;
  className?: string;
}

export function PageLayout({ 
  children, 
  showPattern = false, 
  patternHeight = 'h-64',
  className = '' 
}: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-white ${className}`}>
      {showPattern && (
        <DottedPattern height={patternHeight} opacity={0.1} />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

interface PageHeaderProps {
  category: string;
  title: string[];
  description: string;
  className?: string;
}

export function PageHeader({ 
  category, 
  title, 
  description, 
  className = '' 
}: PageHeaderProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${className}`}>
      <div className="grid md:grid-cols-2 gap-16 items-center">
        {/* Left Side */}
        <div>
          <div className="mb-4">
            <span className="text-sm text-gray-500">• {category}</span>
          </div>
          <h1 className="text-5xl font-bold text-black leading-tight mb-6">
            {title.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </h1>
        </div>

        {/* Right Side */}
        <div>
          <p className="text-lg text-gray-700 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
