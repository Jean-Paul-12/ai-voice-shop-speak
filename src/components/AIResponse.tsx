
import React from 'react';

interface AIResponseProps {
  aiResponse: string;
}

const AIResponse: React.FC<AIResponseProps> = ({ aiResponse }) => {
  if (!aiResponse) return null;

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg border border-blue-200 shadow-lg">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          🤖
        </div>
        <div className="flex-1">
          <p className="text-gray-800 leading-relaxed">{aiResponse}</p>
        </div>
      </div>
    </div>
  );
};

export default AIResponse;
