
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { seedProducts } from '@/services/productService';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import VoiceButton from '@/components/VoiceButton';
import TranscriptDisplay from '@/components/TranscriptDisplay';
import AIResponse from '@/components/AIResponse';
import ProductCard from '@/components/ProductCard';
import ConversationHistory from '@/components/ConversationHistory';

const Index = () => {
  const { toast } = useToast();
  const { speak, stop, isSpeaking } = useSpeechSynthesis();
  
  const {
    isRecording,
    isProcessing,
    transcript,
    selectedProduct,
    conversationHistory,
    aiResponse,
    handleVoiceButtonClick
  } = useVoiceRecording();

  useEffect(() => {
    // Seed products on component mount
    seedProducts().catch(console.error);
  }, []);

  useEffect(() => {
    // Speak the AI response when it's available
    if (aiResponse) {
      speak(aiResponse);
    }
  }, [aiResponse, speak]);

  const toggleSpeech = () => {
    if (isSpeaking) {
      stop();
    } else if (aiResponse) {
      speak(aiResponse);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex flex-col items-center justify-center p-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full space-y-8">
        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 bg-clip-text text-transparent">
            🔊 AI Voice Marketplace
          </h1>
          <p className="text-lg text-blue-700/80 font-medium">
            Speak to discover your perfect product
          </p>
        </div>

        {/* Voice Controls */}
        <div className="flex flex-col items-center space-y-4">
          <VoiceButton
            isRecording={isRecording}
            isProcessing={isProcessing}
            isSpeaking={isSpeaking}
            aiResponse={aiResponse}
            onVoiceButtonClick={handleVoiceButtonClick}
            onToggleSpeech={toggleSpeech}
          />

          <TranscriptDisplay transcript={transcript} />
        </div>

        <AIResponse aiResponse={aiResponse} />

        {selectedProduct && <ProductCard product={selectedProduct} />}

        <ConversationHistory conversationHistory={conversationHistory} />

        {/* Instructions */}
        {!selectedProduct && !transcript && conversationHistory.length === 0 && (
          <div className="text-center text-blue-600/70 text-sm max-w-md mx-auto">
            <p>Click the microphone button and describe what you're looking for. Our AI will find the perfect product for you and provide detailed responses!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
