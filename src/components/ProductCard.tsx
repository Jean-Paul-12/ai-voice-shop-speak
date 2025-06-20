
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/services/productService';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="mt-8 overflow-hidden bg-white/90 backdrop-blur-sm border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
      <CardContent className="p-0">
        <div className="md:flex">
          <div className="md:w-1/3 bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full max-w-32 h-auto object-contain"
              onError={(e) => {
                console.log('Image failed to load:', product.image);
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200/3B82F6/FFFFFF?text=' + product.name;
              }}
            />
          </div>
          
          <div className="md:w-2/3 p-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-blue-800">{product.name}</h2>
              <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-blue-700">Key Features:</h3>
              <div className="flex flex-wrap gap-2">
                {product.features.map((feature, index) => (
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
  );
};

export default ProductCard;
