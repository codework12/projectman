"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/sections/FooterSection';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Calendar, Clock, Eye, ArrowUpRight, Tag, ChevronRight } from 'lucide-react';

// Blog post type definition
type BlogPost = {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  readTime: string;
  date: string;
  image: string;
  externalUrl: string;
};

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(6); // For lazy loading
  const { toast } = useToast();

  useEffect(() => {
    document.title = "OurTopClinic - Health Blog";
    
    // Simulate loading blog posts
    setTimeout(() => {
      setPosts(blogPosts);
      setLoading(false);
    }, 800);
  }, []);

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.category.toLowerCase() === filter.toLowerCase());

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  const openExternalBlog = (url: string, title: string) => {
    window.open(url, '_blank');
    toast({
      title: "Opening external blog",
      description: `You're being redirected to: ${title}`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-24 pb-16 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center">
            <span className="gradient-text">Health Knowledge Hub</span>
          </h1>
          <p className="text-center text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Explore our collection of expert articles covering the latest in healthcare, wellness tips,
            and medical breakthroughs.
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <Button 
              variant={filter === 'all' ? "default" : "outline"} 
              onClick={() => setFilter('all')}
              className="rounded-full"
            >
              All Topics
            </Button>
            <Button 
              variant={filter === 'wellness' ? "default" : "outline"} 
              onClick={() => setFilter('wellness')}
              className="rounded-full"
            >
              Wellness
            </Button>
            <Button 
              variant={filter === 'medical' ? "default" : "outline"} 
              onClick={() => setFilter('medical')}
              className="rounded-full"
            >
              Medical Research
            </Button>
            <Button 
              variant={filter === 'lifestyle' ? "default" : "outline"} 
              onClick={() => setFilter('lifestyle')}
              className="rounded-full"
            >
              Lifestyle
            </Button>
            <Button 
              variant={filter === 'nutrition' ? "default" : "outline"} 
              onClick={() => setFilter('nutrition')}
              className="rounded-full"
            >
              Nutrition
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <CardHeader>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No blog posts found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try selecting a different category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visiblePosts.map(post => (
                  <Card key={post.id} className="overflow-hidden hover-lift group">
                    <div className="relative h-48 overflow-hidden aspect-[16/9]">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        // className="object-cover w-full h-full"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="bg-primary/90 text-white text-xs px-3 py-1 rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <CardHeader className="pb-0">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1 space-x-4">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {post.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {post.readTime} read
                        </span>
                      </div>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-xl md:text-2xl font-semibold mb-0">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <CardDescription className="line-clamp-3 mb-3">
                        {post.description}
                      </CardDescription>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="ghost"
                        className="w-full justify-between group py-3 text-base h-12 border border-emerald-300"
                        onClick={() => openExternalBlog(post.externalUrl, post.title)}
                      >
                        Read article 
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
            
            {visibleCount < filteredPosts.length && (
              <div className="flex justify-center mt-8">
                <Button variant="outline" onClick={() => setVisibleCount(c => c + 6)}>
                  Load More
                </Button>
              </div>
            )}
            

          </>
        )}
      </div>

      <FooterSection />
    </div>
  );
};

// Sample blog posts data
const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "10 Proven Ways to Boost Your Immune System Naturally",
    description: "Discover evidence-based strategies to strengthen your body's natural defenses and stay healthy year-round.",
    category: "Wellness",
    tags: ["Immunity", "Natural Health", "Prevention"],
    readTime: "5 min",
    date: "May 12, 2025",
    image: "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&q=80",
    externalUrl: "https://healthline.com"
  },
  {
    id: 2,
    title: "Understanding Telehealth: The Future of Medical Consultations",
    description: "Learn how virtual healthcare is transforming patient experiences and providing access to medical professionals from anywhere.",
    category: "Medical",
    tags: ["Telehealth", "Digital Health", "Healthcare Access"],
    readTime: "7 min",
    date: "May 10, 2025",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80",
    externalUrl: "https://mayoclinic.org"
  },
  {
    id: 3,
    title: "The Science Behind Mindfulness and Its Effects on Chronic Pain",
    description: "Explore how mindfulness practices can help manage chronic pain conditions through neurological and psychological mechanisms.",
    category: "Wellness",
    tags: ["Mindfulness", "Pain Management", "Mental Health"],
    readTime: "8 min",
    date: "May 8, 2025",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80",
    externalUrl: "https://psychologytoday.com"
  },
  {
    id: 4,
    title: "Heart-Healthy Eating: A Comprehensive Guide to Cardiovascular Nutrition",
    description: "Detailed guidance on dietary choices that support heart health and reduce the risk of cardiovascular disease.",
    category: "Nutrition",
    tags: ["Heart Health", "Diet", "Cardiovascular"],
    readTime: "10 min",
    date: "May 5, 2025",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80",
    externalUrl: "https://heartfoundation.org"
  },
  {
    id: 5,
    title: "The Latest Breakthroughs in Cancer Research You Should Know About",
    description: "Stay informed about promising developments in cancer treatment and prevention that are changing the landscape of oncology.",
    category: "Medical",
    tags: ["Cancer Research", "Oncology", "Medical Advances"],
    readTime: "12 min",
    date: "May 3, 2025",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80",
    externalUrl: "https://cancer.org"
  },
  {
    id: 6,
    title: "Sleep Optimization: How to Improve Your Rest for Better Health",
    description: "Evidence-based techniques to enhance sleep quality and duration for improved physical and mental wellbeing.",
    category: "Lifestyle",
    tags: ["Sleep", "Health Optimization", "Wellbeing"],
    readTime: "6 min",
    date: "May 1, 2025",
    image: "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?auto=format&fit=crop&q=80",
    externalUrl: "https://sleepfoundation.org"
  },
  {
    id: 7,
    title: "Plant-Based Eating for Beginners: A Starter Guide",
    description: "Simple steps to incorporate more plant-based foods into your diet for improved health and environmental benefits.",
    category: "Nutrition",
    tags: ["Plant-Based", "Vegan", "Diet"],
    readTime: "9 min",
    date: "April 28, 2025",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80",
    externalUrl: "https://nutritionorg.com"
  },
  {
    id: 8,
    title: "Digital Detox: Reclaiming Mental Clarity in a Connected World",
    description: "Strategies to reduce screen time and tech dependence for improved focus, productivity, and mental health.",
    category: "Lifestyle",
    tags: ["Digital Wellness", "Mental Health", "Productivity"],
    readTime: "7 min",
    date: "April 25, 2025",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80",
    externalUrl: "https://mindfulness.org"
  },
  {
    id: 9,
    title: "Understanding Personalized Medicine: Tailoring Treatment to Your DNA",
    description: "How genetic testing and personalized treatment plans are revolutionizing healthcare for better outcomes.",
    category: "Medical",
    tags: ["Genetics", "Personalized Medicine", "Healthcare Innovation"],
    readTime: "11 min",
    date: "April 22, 2025",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80",
    externalUrl: "https://genome.gov"
  }
];

export default Blog;
