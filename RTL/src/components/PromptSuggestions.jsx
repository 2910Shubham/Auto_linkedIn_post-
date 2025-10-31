import React from 'react';
import { Lightbulb } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

const SUGGESTED_PROMPTS = [
  {
    text: "Write a professional LinkedIn post announcing my promotion",
    category: "Career"
  },
  {
    text: "Generate a LinkedIn post announcing our new product launch",
    category: "Product"
  },
  {
    text: "Create a thought leadership post about AI in our industry",
    category: "Thought Leadership"
  },
  {
    text: "Write a post celebrating my team's recent achievement",
    category: "Team"
  },
  {
    text: "Draft a post about an interesting industry trend",
    category: "Industry"
  },
  {
    text: "Create a post sharing key takeaways from a recent conference",
    category: "Events"
  }
];

const PromptSuggestions = ({ onSelect }) => {
  const { settings } = useSettings();
  const isLight = settings?.theme === 'light';
  return (
    <div className="mb-4 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`flex items-center gap-2 mb-3 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
          <Lightbulb size={16} className="text-yellow-500" />
          <span className="text-sm">Suggested prompts to get you started:</span>
        </div>
        
        {/* Prompts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {SUGGESTED_PROMPTS.map((prompt, index) => (
            <button
              key={index}
              onClick={() => onSelect(prompt.text)}
              className={`text-left rounded-xl p-3 transition-all group ${isLight ? 'bg-white/60 border border-zinc-200 hover:bg-gray-100' : 'bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800'}`}
            >
              <span className={`text-sm ${isLight ? 'text-zinc-900 group-hover:text-zinc-900' : 'text-zinc-300 group-hover:text-white'} transition-colors line-clamp-2`}>
                {prompt.text}
              </span>
              <span className="text-xs text-indigo-400 mt-1 block">
                {prompt.category}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptSuggestions;