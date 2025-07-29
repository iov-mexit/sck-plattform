import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  items: React.ReactNode[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  showDots?: boolean;
  showArrows?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

export function Carousel({
  items,
  currentIndex,
  onIndexChange,
  showDots = true,
  showArrows = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  className = ''
}: CarouselProps) {
  const nextSlide = () => {
    onIndexChange((currentIndex + 1) % items.length);
  };

  const prevSlide = () => {
    onIndexChange((currentIndex - 1 + items.length) % items.length);
  };

  React.useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, currentIndex, items.length]);

  if (items.length === 0) {
    return <div className={`text-center text-gray-500 ${className}`}>No items to display</div>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Carousel Content Container */}
      <div className="relative overflow-hidden">
        <div className="transition-transform duration-300 ease-in-out">
          {items[currentIndex]}
        </div>
      </div>

      {/* Navigation Arrows - Fixed Positioning */}
      {showArrows && items.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 hover:bg-white shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={items.length <= 1}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 hover:bg-white shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={items.length <= 1}
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && items.length > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => onIndexChange(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentIndex
                  ? 'bg-blue-600 scale-110'
                  : 'bg-gray-300 hover:bg-gray-400 hover:scale-105'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
} 