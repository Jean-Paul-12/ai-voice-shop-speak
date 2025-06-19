
import React from 'react';

interface TranscriptDisplayProps {
  transcript: string;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript }) => {
  if (!transcript) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-blue-200 max-w-md">
      <p className="text-sm text-gray-600 mb-1">You said:</p>
      <p className="text-blue-800 font-medium">"{transcript}"</p>
    </div>
  );
};

export default TranscriptDisplay;
