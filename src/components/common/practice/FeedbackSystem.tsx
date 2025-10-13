'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Lightbulb, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Feedback } from '@/types/feedback';

interface FeedbackSystemProps {
  feedback: Feedback | null;
  onClose: () => void;
}

export default function FeedbackSystem({ feedback, onClose }: FeedbackSystemProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (feedback) {
      setIsVisible(true);
      
      if (feedback.autoHide !== false) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(onClose, 300); // Wait for animation to complete
        }, feedback.duration || 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [feedback, onClose]);

  const getIcon = () => {
    switch (feedback?.type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      case 'hint':
        return <Lightbulb className="h-6 w-6 text-blue-500" />;
      case 'congratulations':
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getBackgroundColor = () => {
    switch (feedback?.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'hint':
        return 'bg-blue-50 border-blue-200';
      case 'congratulations':
        return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (!feedback) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/20" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="relative w-full max-w-md"
          >
            <Card className={`${getBackgroundColor()} shadow-lg`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {getIcon()}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{feedback.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{feedback.message}</p>
                    {feedback.action && (
                      <Button
                        onClick={feedback.action.onClick}
                        size="sm"
                        className="w-full"
                      >
                        {feedback.action.label}
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}