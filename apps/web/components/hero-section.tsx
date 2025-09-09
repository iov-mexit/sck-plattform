'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { DottedPattern } from './dotted-pattern';

interface HeroSectionProps {
  category: string;
  title: string[];
  description: string;
  primaryAction: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    text: string;
    href: string;
  };
  className?: string;
}

export function HeroSection({
  category,
  title,
  description,
  primaryAction,
  secondaryAction,
  className = ''
}: HeroSectionProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Abstract Dotted Pattern */}
      <DottedPattern height="h-96" />

      {/* Main Content */}
      <main className="relative z-10 -mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                {description}
              </p>

              <div className="flex items-center space-x-6">
                <button
                  onClick={primaryAction.onClick}
                  className="bg-black text-white px-6 py-4 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-800 transition-colors"
                >
                  <span>{primaryAction.text}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
                
                {secondaryAction && (
                  <a
                    href={secondaryAction.href}
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    {secondaryAction.text}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
