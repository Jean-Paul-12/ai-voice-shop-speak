
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateEmbedding, searchProducts, generateAIResponse, Product } from '@/services/productService';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface ConversationMessage {
  text: string;
  isUser: boolean;
}

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [aiResponse, setAiResponse] = useState('');
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

    } catch (error) {
      console.error('Error processing voice query:', error);
      const errorMessage = "I'm sorry, I had trouble processing your request. Could you please try again?";
      setAiResponse(errorMessage);
      
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

  return {
    isRecording,
    isProcessing,
    transcript,
    selectedProduct,
    conversationHistory,
    aiResponse,
    handleVoiceButtonClick,
    processVoiceQuery
  };
};
