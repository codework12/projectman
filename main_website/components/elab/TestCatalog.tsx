"use client"
import React, { useState } from 'react';
import { LabTest } from '@/components/models/LabTest';
import { labTests, getUniqueCategories } from '@/components/data/labTests';
import { useCart } from '@/components/context/CartContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, CheckSquare, Eye, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
import TestComparisonModal from './TestComparisonModal';
import TestReviews from './TestReviews';
import CartDropdown from './CartDropdown';

const MotionDiv = dynamic(() => import("framer-motion").then(mod => mod.motion.div), { ssr: false }) as any;

const TestCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [compareMode, setCompareMode] = useState(false);
  const [selectedTests, setSelectedTests] = useState<LabTest[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const { addToCart } = useCart();
  
  const categories = ['all', ...getUniqueCategories()];
  
  const filteredTests = labTests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          test.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          test.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleTestSelection = (test: LabTest) => {
    if (selectedTests.some(t => t.id === test.id)) {
      setSelectedTests(selectedTests.filter(t => t.id !== test.id));
    } else {
      if (selectedTests.length < 3) {
        setSelectedTests([...selectedTests, test]);
      }
    }
  };

  const handleCompare = () => {
    if (selectedTests.length > 1) {
      setIsCompareModalOpen(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input 
            type="search" 
            placeholder="Search for lab tests by name or code" 
            className="pl-10 py-6 text-lg rounded-lg shadow-sm border-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <select 
            className="w-full h-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg shadow-sm appearance-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Button
            variant={compareMode ? "default" : "outline"}
            onClick={() => {
              setCompareMode(!compareMode);
              setSelectedTests([]);
            }}
            className={`${compareMode ? 'bg-blue-600' : ''}`}
          >
            <CheckSquare size={16} className="mr-2" />
            Compare Tests
          </Button>
        </div>
        <div className="border border-gray-300 rounded-lg p-0 bg-white shadow flex items-center">
          <CartDropdown />
        </div>
      </div>

      {/* Comparison bar - shown when in compare mode */}
      {compareMode && (
        <MotionDiv 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-100"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-800">Compare Tests</h3>
              <p className="text-sm text-blue-600">Select up to 3 tests to compare</p>
            </div>
            <div className="flex items-center gap-3 mt-3 sm:mt-0">
              <span className="text-sm text-blue-800">{selectedTests.length}/3 selected</span>
              <Button 
                onClick={handleCompare}
                disabled={selectedTests.length < 2}
                size="sm"
              >
                <Eye size={16} className="mr-1" />
                Compare Selected
              </Button>
            </div>
          </div>
        </MotionDiv>
      )}

      {/* Mobile Tabs for Categories */}
      <div className="block md:hidden mb-6">
        <Tabs defaultValue="all">
          <TabsList className="flex overflow-x-auto w-full">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {filteredTests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No tests found matching your search criteria.</p>
          <Button 
            variant="outline" 
            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <TestCard 
              key={test.id} 
              test={test} 
              onAddToCart={() => addToCart(test)} 
              compareMode={compareMode}
              isSelected={selectedTests.some(t => t.id === test.id)}
              onToggleSelect={() => toggleTestSelection(test)}
            />
          ))}
        </div>
      )}

      {/* Comparison Modal */}
      <TestComparisonModal 
        open={isCompareModalOpen} 
        onOpenChange={setIsCompareModalOpen} 
        tests={selectedTests} 
      />
    </div>
  );
};

interface TestCardProps {
  test: LabTest;
  onAddToCart: () => void;
  compareMode: boolean;
  isSelected: boolean;
  onToggleSelect: () => void;
}

const TestCard: React.FC<TestCardProps> = ({ 
  test, 
  onAddToCart, 
  compareMode, 
  isSelected, 
  onToggleSelect 
}) => {
  // Generate a deterministic rating between 4 and 5 based on test ID
  const rating = 4 + (parseInt(test.id) % 10) / 10;
  
  return (
    <Card className={`hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
      <CardHeader className="bg-elab-light-blue/20 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{test.name}</CardTitle>
          <Badge variant="outline" className="bg-white">
            {test.code}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-gray-600 mb-4">{test.description}</p>
        
        {/* Rating display */}
        <div className="flex items-center mb-3">
          <div className="flex mr-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${
                  i < Math.floor(rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : i < rating
                    ? "text-yellow-400 fill-yellow-400 opacity-50"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({rating.toFixed(1)})</span>
          <div className="ml-auto">
            <TestReviews testId={test.id} testName={test.name} />
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-lg">${test.price.toFixed(2)}</span>
          {compareMode ? (
            <Button 
              variant={isSelected ? "default" : "outline"} 
              size="sm" 
              onClick={onToggleSelect}
              className={isSelected ? "bg-blue-600" : ""}
            >
              {isSelected ? "Selected" : "Select"}
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
              onClick={onAddToCart}
            >
              <Plus size={16} className="mr-1" />
              Add to Cart
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestCatalog;
