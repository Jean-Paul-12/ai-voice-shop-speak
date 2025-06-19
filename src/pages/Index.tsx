
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  features: string[];
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone',
    image: 'https://i.imgur.com/pLVNsJK.png',
    description: 'The iPhone is Apple\'s flagship smartphone, known for elegant design, integrated ecosystem, and powerful performance. It offers a smooth, secure, and optimized user experience.',
    features: [
      'Super Retina XDR display',
      'A16 Bionic chip',
      'Advanced camera system with Night Mode and 4K',
      'Face ID',
      '5G & Wi-Fi 6',
      'IP68 water and dust resistance',
      'iOS with regular updates'
    ]
  },
  {
    id: '2',
    name: 'iPad',
    image: 'https://i.imgur.com/F0VFx7n.jpeg',
    description: 'The iPad is Apple\'s versatile tablet designed for education, work, and creativity. High-resolution display and Apple Pencil support.',
    features: [
      'Liquid Retina 10.9" display',
      'A14 Bionic chip',
      'Apple Pencil + keyboard support',
      'iPadOS multitasking',
      'Long battery life (10h)'
    ]
  },
  {
    id: '3',
    name: 'MacBook Pro',
    image: 'https://i.imgur.com/CLR0nMw.jpeg',
    description: 'MacBook Pro is Apple\'s most advanced laptop, perfect for developers and creators.',
    features: [
      'M2 Pro/Max chip',
      'Liquid Retina XDR display',
      'Up to 96 GB RAM & 8 TB SSD',
      '22h battery life',
      'Touch ID',
      'macOS'
    ]
  },
  {
    id: '4',
    name: 'AirPods',
    image: 'https://i.imgur.com/Dh8ntZd.jpeg',
    description: 'Wireless smart earbuds with immersive audio and instant Apple ecosystem connection.',
    features: [
      'Spatial Audio',
      'Noise Cancellation',
      'Transparency mode',
      'H1/H2 chip',
      'Touch controls',
      '24h battery with case'
    ]
  }
];

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
  const { toast } = useToast();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
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
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      // Start media recording
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      setIsRecording(true);
      setTranscript('');
      setSelectedProduct(null);
      
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
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simple keyword matching for demo purposes
      // In production, this would use Gemini Live + RAG with embeddings
      const lowerQuery = query.toLowerCase();
      let matchedProduct: Product | null = null;

      if (lowerQuery.includes('phone') || lowerQuery.includes('iphone') || lowerQuery.includes('call') || lowerQuery.includes('mobile')) {
        matchedProduct = MOCK_PRODUCTS[0]; // iPhone
      } else if (lowerQuery.includes('tablet') || lowerQuery.includes('ipad') || lowerQuery.includes('drawing') || lowerQuery.includes('pencil')) {
        matchedProduct = MOCK_PRODUCTS[1]; // iPad
      } else if (lowerQuery.includes('laptop') || lowerQuery.includes('macbook') || lowerQuery.includes('computer') || lowerQuery.includes('programming')) {
        matchedProduct = MOCK_PRODUCTS[2]; // MacBook Pro
      } else if (lowerQuery.includes('headphones') || lowerQuery.includes('airpods') || lowerQuery.includes('music') || lowerQuery.includes('earbuds')) {
        matchedProduct = MOCK_PRODUCTS[3]; // AirPods
      } else {
        // Default to a random product
        matchedProduct = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
      }

      setSelectedProduct(matchedProduct);
      
      toast({
        title: "🎯 Product Found!",
        description: `Found the perfect match: ${matchedProduct.name}`,
      });

    } catch (error) {
      console.error('Error processing voice query:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex flex-col items-center justify-center p-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full space-y-8">
        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 bg-clip-text text-transparent">
            🔊 AI Voice Marketplace
          </h1>
          <p className="text-lg text-blue-700/80 font-medium">
            Speak to discover your perfect product
          </p>
        </div>

        {/* Voice Button */}
        <div className="flex flex-col items-center space-y-4">
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
            
            {/* Recording indicator */}
            {isRecording && (
              <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
            )}
          </Button>

          {/* Transcript display */}
          {transcript && (
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-blue-200 max-w-md">
              <p className="text-sm text-gray-600 mb-1">You said:</p>
              <p className="text-blue-800 font-medium">"{transcript}"</p>
            </div>
          )}
        </div>

        {/* Product Card */}
        {selectedProduct && (
          <Card className="mt-8 overflow-hidden bg-white/90 backdrop-blur-sm border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
            <CardContent className="p-0">
              <div className="md:flex">
                {/* Product Image */}
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
                
                {/* Product Details */}
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

        {/* Instructions */}
        {!selectedProduct && !transcript && (
          <div className="text-center text-blue-600/70 text-sm max-w-md mx-auto">
            <p>Click the microphone button and describe what you're looking for. Our AI will find the perfect product for you!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
