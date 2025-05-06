// src/app/page.tsx
"use client";

import * as React from "react";
import { useState, useEffect, useCallback, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { CategorySelector } from "@/components/CategorySelector";
import { WordCard, type Word } from "@/components/WordCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { suggestNewWords, type SuggestNewWordsInput, type SuggestNewWordsOutput } from "@/ai/flows/suggest-new-words";
import { useToast } from "@/hooks/use-toast";
import { BookOpenText, Lightbulb } from "lucide-react";
import { GeistSans } from "geist/font/sans";


// Define initial categories with Arabic translations
const INITIAL_CATEGORIES = [
  { english: "Emotional", arabic: "عاطفي" },
  { english: "Professional", arabic: "احترافي" },
  { english: "Intellectual", arabic: "فكري" },
  { english: "Personal Growth", arabic: "نمو شخصي" },
  { english: "Relationships", arabic: "علاقات" },
];

export default function Home() {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [wordQueue, setWordQueue] = useState<Word[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(INITIAL_CATEGORIES[0].english); // Default category (English name)
  const [categories, setCategories] = useState<{ english: string; arabic: string }[]>(INITIAL_CATEGORIES); // Manage categories with translations
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, startAiTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light mode

  const { toast } = useToast();

  // Function to toggle dark mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  // Effect to set the initial theme based on system preference or saved state
   useEffect(() => {
     // Check local storage first
     const savedTheme = localStorage.getItem('theme');
     const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

     if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
       setIsDarkMode(true);
       document.documentElement.classList.add('dark');
     } else {
       setIsDarkMode(false);
       document.documentElement.classList.remove('dark');
     }
   }, []);

   // Effect to save theme preference to local storage
    useEffect(() => {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);


  const fetchAndSetNewWords = useCallback(async (category: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const input: SuggestNewWordsInput = { category, numberOfWords: 5 }; // Request 5 words
      const aiResult = await suggestNewWords(input);

      if (!aiResult || aiResult.length === 0) {
         throw new Error("AI did not return any words.");
      }

      // Map AI result to Word interface
      const newWords: Word[] = aiResult.map(item => ({
          english: item.english,
          arabic: item.arabic,
          definition: item.definition,
          arabicDefinition: item.arabicDefinition, // Added mapping
          example: item.example,
          arabicExample: item.arabicExample, // Added mapping
      }));

      setWordQueue(newWords);
      setCurrentWord(newWords[0] || null); // Display the first word immediately
      const categoryDisplay = categories.find(c => c.english === category)?.english || category; // Find display name
      toast({
        title: "New Words Loaded!",
        description: `Successfully fetched ${newWords.length} words for the '${categoryDisplay}' category.`,
        variant: 'default',
      });

    } catch (err) {
      console.error("Error fetching words:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while fetching words.";
      setError(`Oops! Couldn't fetch word details. ${errorMessage}`);
      toast({
        title: "Error Fetching Words",
        description: errorMessage,
        variant: "destructive",
      });
      setWordQueue([]); // Clear queue on error
      setCurrentWord(null);
    } finally {
      setIsLoading(false);
    }
  }, [toast, categories]); // Added categories to dependency array

  // Fetch words when category changes
  useEffect(() => {
     startAiTransition(() => {
        fetchAndSetNewWords(selectedCategory);
      });
  }, [selectedCategory, fetchAndSetNewWords]);

  const getNextWord = useCallback(() => {
    setError(null);
    // Check if queue needs refilling
    if (wordQueue.length <= 1 && !isLoading && !isAiLoading) {
      // Current word is the last one or queue is empty, fetch more in the background
       startAiTransition(() => {
         fetchAndSetNewWords(selectedCategory);
       });
       // If queue is not empty, show the next word immediately from the remaining one.
       if (wordQueue.length === 1) {
         setWordQueue([]);
         setCurrentWord(null); // Or show a loading state for the card?
       }
    } else if (wordQueue.length > 1) {
        // Get next word from queue
        const nextQueue = wordQueue.slice(1);
        setWordQueue(nextQueue);
        setCurrentWord(nextQueue[0] || null);
    } else if (isLoading || isAiLoading) {
       toast({
         title: "Loading...",
         description: "Please wait while new words are being fetched.",
       });
    } else {
         setError("No more words in the queue and failed to fetch new ones.");
         const categoryDisplay = categories.find(c => c.english === selectedCategory)?.english || selectedCategory; // Find display name
         toast({
             title: "Queue Empty",
             description: `Reached the end of the words for '${categoryDisplay}'. Try fetching again or changing category.`,
             variant: "destructive",
         });
    }
  }, [wordQueue, selectedCategory, isLoading, isAiLoading, fetchAndSetNewWords, toast, categories]); // Added categories


  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    // Words will be fetched automatically by the useEffect hook watching selectedCategory
  };

  return (
    <div className={`flex flex-col items-center min-h-screen p-4 sm:p-8 transition-colors duration-300 ${isDarkMode ? 'dark' : ''} ${GeistSans.className}`}>
       <div className="absolute top-4 right-4">
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>

      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary mb-2 flex items-center justify-center gap-2">
          <BookOpenText className="h-8 w-8 sm:h-10 sm:w-10" /> LinguaLeap <Lightbulb className="h-8 w-8 sm:h-10 sm:w-10 text-accent" />
        </h1>
        <p className="text-lg text-muted-foreground">Expand Your Vocabulary, One Word at a Time</p>
      </header>


      <main className="flex flex-col items-center gap-8 w-full max-w-md">
        <CategorySelector
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          categories={categories} // Pass the array of objects
          disabled={isLoading || isAiLoading}
        />

        {error && (
          <div className="text-destructive text-center p-4 bg-destructive/10 rounded-md">
            {error}
          </div>
        )}

        <WordCard word={currentWord} isLoading={isLoading || (isAiLoading && !currentWord)} />

        <Button
          onClick={getNextWord}
          disabled={isLoading || isAiLoading || (wordQueue.length === 0 && !currentWord)} // Disable if loading or queue empty and no current word
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md w-full"
        >
          {(isLoading || isAiLoading) ? 'Loading...' : '🔄 Next Word'}
        </Button>

      </main>

      <footer className="mt-auto pt-8 text-center text-muted-foreground text-sm">
        Powered by Speed of Mastery
      </footer>
    </div>
  );
}
