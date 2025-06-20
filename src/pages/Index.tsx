import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Loader2, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { seedProducts, generateEmbedding, searchProducts, generateAIResponse, Product } from '@/services/productService';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const Index = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Array<{text: string, isUser: boolean}>>([]);
  const [aiResponse, setAiResponse] = useState('');
  const { toast } = useToast();
  const { speak, stop, isSpeaking } = useSpeechSynthesis();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Seed products on component mount
    seedProducts().catch(console.error);

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          console.log('Final transcript:', finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Speech Recognition Error",
          description: "There was an issue with voice recognition. Please try again.",
          variant: "destructive"
        });
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [toast]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      setIsRecording(true);
      setTranscript('');
      
      toast({
        title: "🎙️ Listening...",
        description: "Speak your product request now!"
      });

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setIsRecording(false);
    
    if (transcript.trim()) {
      processVoiceQuery(transcript);
    } else {
      toast({
        title: "No speech detected",
        description: "Please try speaking again.",
        variant: "destructive"
      });
    }
  };

  const processVoiceQuery = async (query: string) => {
    setIsProcessing(true);
    
    try {
      // Add user query to conversation history
      setConversationHistory(prev => [...prev, { text: query, isUser: true }]);
      
      // Generate embedding for the query
      const queryEmbedding = await generateEmbedding(query);
      
      // Search for products using vector similarity
      const products = await searchProducts(queryEmbedding);
      
      let responseText = '';
      let matchedProduct: Product | null = null;

      if (products.length > 0) {
        matchedProduct = products[0];
        setSelectedProduct(matchedProduct);
        
        // Generate AI response about the product
        const productQuery = `User asked: "${query}". Recommend the ${matchedProduct.name}: ${matchedProduct.description}. Features: ${matchedProduct.features.join(', ')}. Keep it conversational and helpful.`;
        responseText = await generateAIResponse(productQuery);
        
        toast({
          title: "🎯 Product Found!",
          description: `Found the perfect match: ${matchedProduct.name}`,
        });
      } else {
        // Generate a general helpful response
        responseText = await generateAIResponse(`User asked: "${query}". Help them understand our product options or ask for more specific requirements.`);
      }

      setAiResponse(responseText);
      
      // Add AI response to conversation history
      setConversationHistory(prev => [...prev, { text: responseText, isUser: false }]);
      
      // Speak the response
      speak(responseText);

    } catch (error) {
      console.error('Error processing voice query:', error);
      const errorMessage = "I'm sorry, I had trouble processing your request. Could you please try again?";
      setAiResponse(errorMessage);
      speak(errorMessage);
      
      toast({
        title: "Processing Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

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
          <div className="flex gap-4 items-center">
            <Button
              onClick={handleVoiceButtonClick}
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
                onClick={toggleSpeech}
                variant="outline"
                size="lg"
                className="bg-white/80 hover:bg-white/90"
              >
                {isSpeaking ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </Button>
            )}
          </div>

          {/* Transcript display */}
          {transcript && (
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-blue-200 max-w-md">
              <p className="text-sm text-gray-600 mb-1">You said:</p>
              <p className="text-blue-800 font-medium">"{transcript}"</p>
            </div>
          )}
        </div>

        {/* AI Response */}
        {aiResponse && (
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
        )}

        {/* Product Card */}
        {selectedProduct && (
          <Card className="mt-8 overflow-hidden bg-white/90 backdrop-blur-sm border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
            <CardContent className="p-0">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full max-w-32 h-auto object-contain"
                    onError={(e) => {
                      console.log('Image failed to load:', selectedProduct.image);
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200/3B82F6/FFFFFF?text=' + selectedProduct.name;
                    }}
                  />
                </div>
                
                <div className="md:w-2/3 p-6 space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-blue-800">{selectedProduct.name}</h2>
                    <p className="text-gray-700 text-sm leading-relaxed">{selectedProduct.description}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-blue-700">Key Features:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.features.map((feature, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Conversation History */}
        {conversationHistory.length > 0 && (
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
        )}

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
