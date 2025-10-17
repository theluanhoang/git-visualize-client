'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Crown, Shield, Settings, Users, BookOpen } from 'lucide-react';

interface AdminWelcomeBannerProps {
  userName?: string;
  onDismiss?: () => void;
}

export default function AdminWelcomeBanner({ userName, onDismiss }: AdminWelcomeBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('admin-welcome-dismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('admin-welcome-dismissed', 'true');
    onDismiss?.();
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-600 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  >
                    <Crown className="h-6 w-6 text-white" />
                  </motion.div>
                  
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-2">
                      🎉 Chào mừng Admin {userName || ''}!
                    </h2>
                    <p className="text-blue-700 dark:text-blue-300 mb-4">
                      Bạn đã được chuyển hướng tự động đến trang quản trị. 
                      Tại đây bạn có thể quản lý toàn bộ hệ thống Git Learning Platform.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                        <BookOpen className="h-4 w-4" />
                        <span>Quản lý bài học</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                        <Users className="h-4 w-4" />
                        <span>Quản lý người dùng</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                        <Settings className="h-4 w-4" />
                        <span>Cài đặt hệ thống</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-200 dark:hover:bg-blue-900/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
