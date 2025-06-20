
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2, Volume2, VolumeX } from 'lucide-react';

interface VoiceButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  aiResponse: string;
  onVoiceButtonClick: () => void;
  onToggleSpeech: () => void;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({
  isRecording,
  isProcessing,
  isSpeaking,
  aiResponse,
  onVoiceButtonClick,
  onToggleSpeech
}) => {
  return (
    <div className="flex gap-4 items-center">
      <Button
        onClick={onVoiceButtonClick}
        disabled={isProcessing}
        className={`relative w-48 h-48 rounded-full text-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
          isRecording 
            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'
        } ${isProcessing ? 'opacity-75' : ''} shadow-2xl`}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-base">Processing...</span>
          </div>
        ) : isRecording ? (
          <div className="flex flex-col items-center space-y-2">
            <MicOff className="w-8 h-8" />
            <span className="text-base">Stop Recording</span>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Mic className="w-8 h-8" />
            <span className="text-base">🎙 Speak to Shop</span>
          </div>
        )}
        
        {isRecording && (
          <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
        )}
      </Button>

      {aiResponse && (
        <Button
          onClick={onToggleSpeech}
          variant="outline"
          size="lg"
          className="bg-white/80 hover:bg-white/90"
        >
          {isSpeaking ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </Button>
      )}
    </div>
  );
};

export default VoiceButton;
