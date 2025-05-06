// src/hooks/useSpeechSynthesis.ts
"use client";

import { useState, useEffect, useCallback } from 'react';

export function useSpeechSynthesis() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // This check needs to run client-side
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      // Cancel any ongoing speech when the component unmounts or dependencies change
      return () => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
      };
    }
  }, []);

  const speak = useCallback((text: string, lang: string = 'en-US', rate: number = 0.8) => {
    if (!isSupported || !text) {
      console.warn('Speech synthesis not supported or no text provided.');
      return;
    }

    // Cancel current speech before starting a new one
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  const cancel = useCallback(() => {
    if (isSupported && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return { isSupported, isSpeaking, speak, cancel };
}
