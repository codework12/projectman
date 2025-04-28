import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { CyberParticles } from '@/components/CyberParticles';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Zap, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getRandomWords } from '@/data/wordList';

interface TimeAttackProps {
  onScoreChange: (score: number) => void;
  onWpmChange: (wpm: number) => void;
  onGameOver: () => void;
}

// Utility to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Shuffle words within each sentence
function shuffleSentenceWords(sentences: string[]): string[] {
  return sentences.map(sentence => shuffleArray(sentence.split(' ')).join(' '));
}

export const TimeAttackMode = ({ onScoreChange, onWpmChange, onGameOver }: TimeAttackProps) => {
  const [timeLeft, setTimeLeft] = useState(15);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [selectedTime, setSelectedTime] = useState<number>(15);
  const [gameStarted, setGameStarted] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const { toast } = useToast();

  const [isTabPressed, setIsTabPressed] = useState(false);

  const sentences = [
    getRandomWords(30, true) as string,
    getRandomWords(40, true) as string,
    getRandomWords(50, true) as string,
  ];

  const [waitingForFirstKey, setWaitingForFirstKey] = useState(true);

  const [shuffledSentences, setShuffledSentences] = useState<string[]>(() => shuffleSentenceWords(shuffleArray(sentences)));

  useEffect(() => {
    if (waitingForFirstKey) {
      const handleFirstKey = (e: KeyboardEvent) => {
        if (
          document.visibilityState === 'visible' &&
          e.key.length === 1 &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.altKey
        ) {
          setGameStarted(true);
          setTimerStarted(true);
          setWaitingForFirstKey(false);
          setUserInput(e.key);
          window.removeEventListener('keydown', handleFirstKey);
        }
      };
      window.addEventListener('keydown', handleFirstKey);
      return () => window.removeEventListener('keydown', handleFirstKey);
    }
  }, [waitingForFirstKey]);

  useEffect(() => {
    if (timerStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onGameOver();
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timerStarted, timeLeft, onGameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        setIsTabPressed(true);
      } else if (e.key === 'Enter' && isTabPressed && gameStarted) {
        e.preventDefault();
        window.location.reload();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsTabPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isTabPressed, gameStarted]);

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentSentence, setCurrentSentence] = useState(shuffledSentences[0]);
  const [typedSentence, setTypedSentence] = useState("");
  const [sentencesTyped, setSentencesTyped] = useState(0);
  const [correctSentences, setCorrectSentences] = useState(0);
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  const [totalCorrectChars, setTotalCorrectChars] = useState(0);

  useEffect(() => {
    setCurrentSentenceIndex(0);
    setCurrentSentence(shuffledSentences[0]);
    setTypedSentence("");
    setSentencesTyped(0);
    setCorrectSentences(0);
    setTotalTypedChars(0);
    setTotalCorrectChars(0);
  }, [selectedTime, gameStarted]);

  const [userInput, setUserInput] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const charBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!waitingForFirstKey) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          setUserInput(prev => {
            if (prev.length < currentSentence.length) {
              setTotalTypedChars(chars => chars + 1);
              setTotalCorrectChars(chars =>
                e.key === currentSentence[prev.length] ? chars + 1 : chars
              );
              return prev + e.key;
            }
            return prev;
          });
        } else if (e.key === 'Backspace') {
          setUserInput(prev => prev.slice(0, -1));
          setTotalTypedChars(chars => (chars > 0 ? chars - 1 : 0));
        } else if (e.key === 'Enter' && userInput.length === currentSentence.length) {
          const nextIndex = (currentSentenceIndex + 1) % shuffledSentences.length;
          setCurrentSentenceIndex(nextIndex);
          setCurrentSentence(shuffledSentences[nextIndex]);
          setUserInput("");
          setWaitingForFirstKey(true);
          setGameStarted(false);
          setTimerStarted(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [waitingForFirstKey, userInput, currentSentence, currentSentenceIndex, shuffledSentences]);

  useEffect(() => {
    if (charBarRef.current) {
      const caret = charBarRef.current.querySelector('.caret');
      if (caret && caret instanceof HTMLElement) {
        caret.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [userInput]);

  const elapsedMinutes = selectedTime ? (selectedTime - timeLeft) / 60 : 1;
  const wpm = elapsedMinutes > 0 ? Math.round((totalCorrectChars / 5) / elapsedMinutes) : 0;
  const accuracy = totalTypedChars > 0 ? Math.round((totalCorrectChars / totalTypedChars) * 100) : 100;

  const startGame = (duration: number) => {
    const newShuffled = shuffleSentenceWords(shuffleArray(sentences));
    setShuffledSentences(newShuffled);
    setSelectedTime(duration);
    setTimeLeft(duration);
    setGameStarted(false);
    setTimerStarted(false);
    setUserInput("");
    setCurrentSentenceIndex(0);
    setCurrentSentence(newShuffled[0]);
    setWaitingForFirstKey(true);
  };

  useEffect(() => {
    const newShuffled = shuffleSentenceWords(shuffleArray(sentences));
    setShuffledSentences(newShuffled);
    setCurrentSentenceIndex(0);
    setCurrentSentence(newShuffled[0]);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-background">
      <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-30">
        {[15, 30, 60, 120].map((duration) => (
          <button
            key={duration}
            onClick={() => startGame(duration)}
            className={`px-6 py-4 rounded-xl border-2 transition-all duration-300 font-bold text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-primary/60
              ${selectedTime === duration ? 'bg-primary text-white border-primary scale-105' : 'bg-background/80 text-primary border-primary/30 hover:bg-primary/10'}`}
          >
            {duration}s
          </button>
        ))}
      </div>

      <div className="absolute top-4 right-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative w-10 h-10 rounded-lg border border-primary/50 bg-background/50 backdrop-blur-sm hover:bg-primary/20 transition-all duration-300">
              <Menu className="w-4 h-4 text-primary" />
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur animate-pulse"></div>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] bg-black/95 border-primary/50 backdrop-blur-xl p-0">
            <div className="h-full bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_65%)] bg-[length:100%_100%] bg-center bg-no-repeat opacity-20 absolute inset-0"></div>
            <div className="relative h-full flex flex-col gap-8 p-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20 hover:border-primary/40 transition-colors duration-300">
                <Avatar className="w-16 h-16 border-2 border-primary/50 shadow-lg shadow-primary/20">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-white to-primary/60 bg-clip-text text-transparent">
                    Player Name
                  </h2>
                  <p className="text-sm text-primary/60">High Score: {score}</p>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full h-12 bg-primary/5 border border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 font-mono tracking-wider"
                  onClick={() => window.location.reload()}
                >
                  Restart Game
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12 bg-primary/5 border border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 font-mono tracking-wider"
                  onClick={onGameOver}
                >
                  Exit to Menu
                </Button>
              </div>

              <div className="mt-auto space-y-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <h3 className="text-lg font-semibold text-primary/80">Current Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-black/20 border border-primary/10">
                    <p className="text-sm text-primary/60">Score</p>
                    <p className="text-xl font-bold text-primary">{score}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/20 border border-primary/10">
                    <p className="text-sm text-primary/60">Time Left</p>
                    <p className="text-xl font-bold text-primary">{timeLeft}s</p>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="absolute inset-0 bg-radial-gradient opacity-80"></div>
      <div className="absolute inset-0 bg-cyber-grid bg-grid opacity-20"></div>
      
      <CyberParticles />

      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="relative mb-14"
      >
        <div className="absolute -inset-6 bg-primary/20 rounded-full blur-xl animate-pulse-glow"></div>
        <div className="relative z-10 text-7xl font-bold orbitron text-primary bg-gradient-to-b from-white to-primary/60 bg-clip-text text-transparent">
          {timeLeft}
          <span className="text-2xl ml-1 font-light">s</span>
        </div>
      </motion.div>
      <div className="max-w-3xl w-full space-y-8 relative z-10">
        <div 
          className="minimal-typing-bar-container w-full mb-8" 
          ref={charBarRef}
        >
          <div className="minimal-typing-bar">
            {currentSentence.split('').map((char, idx) => {
              let charClass = 'minimal-char minimal-default';
              if (idx < userInput.length) {
                charClass = userInput[idx] === char ? 'minimal-char minimal-correct' : 'minimal-char minimal-incorrect';
              } else if (idx === userInput.length) {
                charClass = 'minimal-char minimal-current caret';
              }
              return (
                <span
                  key={idx}
                  className={charClass}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <div className="absolute left-8 bottom-8 flex flex-col gap-3 px-8 py-6 rounded-2xl shadow-xl border border-primary/60 backdrop-blur-md bg-white/10 bg-gradient-to-br from-primary/10 to-black/40" style={{ boxShadow: '0 4px 32px 0 rgba(80, 80, 255, 0.18)' }}>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-cyan-400 drop-shadow-glow">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a1 1 0 0 1 1 1v2.07A8.001 8.001 0 0 1 20.93 11H23a1 1 0 1 1 0 2h-2.07A8.001 8.001 0 0 1 13 20.93V23a1 1 0 1 1-2 0v-2.07A8.001 8.001 0 0 1 3.07 13H1a1 1 0 1 1 0-2h2.07A8.001 8.001 0 0 1 11 3.07V1a1 1 0 0 1 1-1zm0 4a6 6 0 1 0 0 12A6 6 0 0 0 12 6z"/></svg>
          </span>
          <span className="text-2xl font-extrabold text-cyan-300 tracking-wide">WPM</span>
          <span className="text-3xl font-extrabold text-white ml-2">{wpm}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-pink-400 drop-shadow-glow">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </span>
          <span className="text-2xl font-extrabold text-pink-300 tracking-wide">Accuracy</span>
          <span className="text-3xl font-extrabold text-white ml-2">{accuracy}%</span>
        </div>
      </div>
      <motion.div 
        className="absolute bottom-6 text-center text-sm text-white/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}
      >
        <p className="tracking-wide">Press Tab + Enter to restart</p>
      </motion.div>
    </div>
  );
};
