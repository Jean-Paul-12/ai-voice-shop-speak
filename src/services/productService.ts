
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  features: string[];
  embedding?: number[];
}

const MOCK_PRODUCTS = [
  {
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

export const generateEmbedding = async (text: string): Promise<number[]> => {
  const { data, error } = await supabase.functions.invoke('openai-operations', {
    body: { action: 'generate-embedding', text }
  });
  
  if (error) throw error;
  return data.embedding;
};

export const seedProducts = async () => {
  console.log('Checking if products need to be seeded...');
  
  // Check if products already exist
  const { data: existingProducts, error: checkError } = await supabase
    .from('products')
    .select('id')
    .limit(1);
    
  if (checkError) {
    console.error('Error checking existing products:', checkError);
    return;
  }

  if (existingProducts && existingProducts.length > 0) {
    console.log('Products already exist, skipping seeding');
    return;
  }

  console.log('Seeding products with embeddings...');
  
  for (const product of MOCK_PRODUCTS) {
    try {
      // Generate embedding for description + features
      const textForEmbedding = `${product.description} ${product.features.join(' ')}`;
      const embedding = await generateEmbedding(textForEmbedding);
      
      const { error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          image: product.image,
          description: product.description,
          features: product.features,
          embedding
        });
        
      if (error) {
        console.error(`Error inserting ${product.name}:`, error);
      } else {
        console.log(`Successfully seeded ${product.name}`);
      }
    } catch (error) {
      console.error(`Error processing ${product.name}:`, error);
    }
  }
};

export const searchProducts = async (queryEmbedding: number[]): Promise<Product[]> => {
  const { data, error } = await supabase.rpc('match_products', {
    query_embedding: queryEmbedding,
    match_threshold: 0.5,
    match_count: 4
  });
  
  if (error) {
    console.error('Error searching products:', error);
    return [];
  }
  
  return data || [];
};

export const generateAIResponse = async (query: string): Promise<string> => {
  const { data, error } = await supabase.functions.invoke('openai-operations', {
    body: { action: 'generate-response', query }
  });
  
  if (error) throw error;
  return data.response;
};
