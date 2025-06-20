
-- Create products table with vector embeddings
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT[] NOT NULL,
  embedding vector(1536), -- OpenAI ada-002 embedding dimension
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to products
CREATE POLICY "Allow public read access to products" ON public.products
  FOR SELECT USING (true);

-- Create policy to allow insert/update for service role (for seeding data)
CREATE POLICY "Allow service role to manage products" ON public.products
  FOR ALL USING (true);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS products_embedding_idx ON public.products 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
