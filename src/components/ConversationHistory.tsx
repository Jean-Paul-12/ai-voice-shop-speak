
import React from 'react';

interface ConversationMessage {
  text: string;
  isUser: boolean;
}

interface ConversationHistoryProps {
  conversationHistory: ConversationMessage[];
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({ conversationHistory }) => {
  if (conversationHistory.length === 0) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg border border-blue-200 shadow-lg">
      <h3 className="text-lg font-semibold text-blue-800 mb-4">Conversation</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {conversationHistory.map((message, index) => (
          <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.isUser 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}>
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationHistory;
