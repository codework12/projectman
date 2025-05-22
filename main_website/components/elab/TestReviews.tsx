
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReviewProps {
  testId: string;
  testName: string;
}

interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
  notHelpful: number;
}

const TestReviews: React.FC<ReviewProps> = ({ testId, testName }) => {
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      author: 'John D.',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      date: '2 weeks ago',
      comment: 'The process was quick and painless. Results came back earlier than expected.',
      helpful: 24,
      notHelpful: 2
    },
    {
      id: '2',
      author: 'Sarah M.',
      avatar: 'https://i.pravatar.cc/150?img=5',
      rating: 4,
      date: '1 month ago',
      comment: 'Great service and professional staff. The only reason for 4 stars is because I had to wait a bit longer than scheduled.',
      helpful: 18,
      notHelpful: 3
    },
    {
      id: '3',
      author: 'Robert K.',
      rating: 5,
      date: '3 months ago',
      comment: 'Excellent experience from start to finish. The test was thorough and the results were easy to understand.',
      helpful: 42,
      notHelpful: 1
    }
  ]);
  
  const [helpfulClicks, setHelpfulClicks] = useState<Record<string, 'helpful' | 'notHelpful' | null>>({});
  
  const handleHelpfulClick = (reviewId: string, type: 'helpful' | 'notHelpful') => {
    setHelpfulClicks(prev => ({
      ...prev,
      [reviewId]: prev[reviewId] === type ? null : type
    }));
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('');
  };
  
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <MessageSquare size={14} />
          <span>{reviews.length} Reviews</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">{testName} Reviews</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={`${
                      i < Math.floor(averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : i < averageRating
                        ? "text-yellow-400 fill-yellow-400 opacity-50"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-700 font-medium">{averageRating.toFixed(1)} out of 5</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{reviews.length} customer reviews</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {reviews.map((review) => (
              <AnimatePresence key={review.id}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b pb-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        {review.avatar ? (
                          <AvatarImage src={review.avatar} alt={review.author} />
                        ) : null}
                        <AvatarFallback>{getInitials(review.author)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{review.author}</p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={`${
                                i < review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  
                  <p className="mt-3 text-gray-700">{review.comment}</p>
                  
                  <div className="mt-3 flex items-center space-x-4">
                    <button
                      className={`flex items-center text-sm ${
                        helpfulClicks[review.id] === 'helpful'
                          ? 'text-green-600 font-medium'
                          : 'text-gray-500'
                      }`}
                      onClick={() => handleHelpfulClick(review.id, 'helpful')}
                    >
                      <ThumbsUp size={14} className="mr-1" />
                      <span>Helpful ({review.helpful + (helpfulClicks[review.id] === 'helpful' ? 1 : 0)})</span>
                    </button>
                    <button
                      className={`flex items-center text-sm ${
                        helpfulClicks[review.id] === 'notHelpful'
                          ? 'text-red-600 font-medium'
                          : 'text-gray-500'
                      }`}
                      onClick={() => handleHelpfulClick(review.id, 'notHelpful')}
                    >
                      <ThumbsDown size={14} className="mr-1" />
                      <span>Not Helpful ({review.notHelpful + (helpfulClicks[review.id] === 'notHelpful' ? 1 : 0)})</span>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TestReviews;
