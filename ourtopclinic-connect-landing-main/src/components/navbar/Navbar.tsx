
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { HeartPulse, Menu, X, BookOpen, Stethoscope, Info, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from 'framer-motion';

const NavLink = ({
  href,
  children,
  className,
  onClick,
  isActive = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
}) => (
  <Link
    to={href}
    className={cn(
      "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/50 relative group",
      isActive && "text-primary dark:text-primary",
      className
    )}
    onClick={onClick}
  >
    {children}
    <span className={cn(
      "absolute inset-x-0 -bottom-0.5 h-0.5 bg-primary transform origin-left transition-transform",
      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
    )}></span>
  </Link>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  const handleScroll = useCallback(() => {
    if (window.scrollY > 10) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const closeMenu = () => setIsOpen(false);

  const containerVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { 
      height: 'auto', 
      opacity: 1,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05,
      }
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: { 
        duration: 0.2,
        when: "afterChildren",
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -5 }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-md"
          : "py-4 bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center transition-all",
              isScrolled ? "gradient-bg" : "bg-white/20 backdrop-blur-md dark:bg-gray-800/40"
            )}>
              <HeartPulse className="h-6 w-6 text-primary dark:text-white" />
            </div>
            <span className={cn(
              "font-bold text-xl",
              isScrolled
                ? "text-gray-800 dark:text-white"
                : "text-gray-800 dark:text-white"
            )}>
              OurTopClinic
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavLink href="/about" isActive={isActive('/about')}>
                  <div className="flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    About Us
                  </div>
                </NavLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavLink href="/blog" isActive={isActive('/blog')}>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    Blog
                  </div>
                </NavLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={cn(
                        "flex items-center space-x-1 px-4 py-2",
                        isActive('/app') && "text-primary dark:text-primary"
                      )}
                    >
                      <Stethoscope className="h-4 w-4 mr-1" />
                      <span>Services</span>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2">
                    <DropdownMenuItem asChild className="py-2">
                      <Link to="/app/patient" className="flex flex-col space-y-1">
                        <span className="font-medium">Patient Portal</span>
                        <span className="text-xs text-muted-foreground">Access your health records</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="py-2">
                      <Link to="/app/doctor" className="flex flex-col space-y-1">
                        <span className="font-medium">Provider Portal</span>
                        <span className="text-xs text-muted-foreground">For healthcare professionals</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="py-2 border-t mt-1">
                      <Link to="/onboarding" className="flex items-center mt-1">
                        <span className="font-medium">Get Started</span>
                        <div className="ml-auto bg-primary/10 p-1 rounded-full">
                          <ChevronDown className="h-4 w-4 rotate-270" />
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="ml-2">
            <ThemeToggle />
          </div>

          <Button asChild className="gradient-bg ml-4">
            <Link to="/onboarding">
              Get Started
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-gray-700 dark:text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            <div className="container mx-auto px-4 py-3 flex flex-col space-y-1">
              <motion.div variants={itemVariants}>
                <NavLink href="/about" onClick={closeMenu} isActive={isActive('/about')}>
                  <div className="flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    About Us
                  </div>
                </NavLink>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <NavLink href="/blog" onClick={closeMenu} isActive={isActive('/blog')}>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Blog
                  </div>
                </NavLink>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <NavLink href="/app/patient" onClick={closeMenu} isActive={isActive('/app/patient')}>
                  <div className="flex items-center">
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Patient Portal
                  </div>
                </NavLink>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <NavLink href="/app/doctor" onClick={closeMenu} isActive={isActive('/app/doctor')}>
                  <div className="flex items-center">
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Provider Portal
                  </div>
                </NavLink>
              </motion.div>
              
              <motion.div variants={itemVariants} className="pt-2">
                <Button asChild className="gradient-bg w-full">
                  <Link to="/onboarding">
                    Get Started
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
