import React, { useState } from 'react';
import { Tag, X, Plus } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags?: string[];
  placeholder?: string;
  maxTags?: number;
  className?: string;
}

export function TagInput({
  tags,
  onTagsChange,
  availableTags = [],
  placeholder = 'Add tag...',
  maxTags = 10,
  className = ''
}: TagInputProps) {
  const [newTag, setNewTag] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddTag = (tag: string) => {
    if (!tag.trim() || tags.includes(tag.trim()) || tags.length >= maxTags) return;

    onTagsChange([...tags, tag.trim()]);
    setNewTag('');
    setShowSuggestions(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddCustomTag = () => {
    handleAddTag(newTag);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomTag();
    }
  };

  const filteredAvailableTags = availableTags.filter(tag =>
    !tags.includes(tag) && tag.toLowerCase().includes(newTag.toLowerCase())
  );

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Selected Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:text-blue-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Tag Input */}
      <div className="relative">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => {
              setNewTag(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => setShowSuggestions(newTag.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={tags.length >= maxTags}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleAddCustomTag}
            disabled={!newTag.trim() || tags.length >= maxTags}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Tag Suggestions */}
        {showSuggestions && filteredAvailableTags.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
            {filteredAvailableTags.slice(0, 8).map((tag) => (
              <button
                key={tag}
                onClick={() => handleAddTag(tag)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Available Tags */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availableTags
            .filter(tag => !tags.includes(tag))
            .slice(0, 6)
            .map((tag) => (
              <button
                key={tag}
                onClick={() => handleAddTag(tag)}
                disabled={tags.length >= maxTags}
                className="px-2 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + {tag}
              </button>
            ))}
        </div>
      )}

      {/* Max Tags Warning */}
      {tags.length >= maxTags && (
        <p className="text-xs text-orange-600">
          Maximum {maxTags} tags allowed
        </p>
      )}
    </div>
  );
} 