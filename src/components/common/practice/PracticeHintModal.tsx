'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Target, Lightbulb, X } from 'lucide-react';
import { Practice } from '@/services/practices';

interface PracticeHintModalProps {
  isOpen: boolean;
  onClose: () => void;
  practice: Practice | null;
}

export default function PracticeHintModal({ isOpen, onClose, practice }: PracticeHintModalProps) {
  if (!practice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Practice Guide: {practice.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Scenario</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground">{practice.scenario}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{practice.estimatedTime} minutes</span>
                </div>
                <Badge variant={practice.difficulty === 1 ? 'default' : practice.difficulty === 2 ? 'secondary' : 'destructive'}>
                  {practice.difficulty === 1 ? 'Beginner' : practice.difficulty === 2 ? 'Intermediate' : 'Advanced'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {}
          {practice.instructions && practice.instructions.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Step-by-Step Instructions
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Follow these steps in order to complete the practice successfully.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {practice.instructions.map((instruction, index) => (
                    <motion.div
                      key={instruction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center text-sm font-semibold">
                        {instruction.order}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                          {instruction.content}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>📋 Note:</strong> Complete each step before moving to the next one. You can refer to the expected commands section for the exact commands to use.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {}
          {practice.expectedCommands && practice.expectedCommands.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Expected Commands
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  These are the commands you should execute to complete the practice successfully.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {practice.expectedCommands.map((cmd, index) => (
                    <motion.div
                      key={cmd.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-muted/10 hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center justify-center text-sm font-semibold">
                        {cmd.order}
                      </div>
                      <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono border">
                        {cmd.command}
                      </code>
                      {cmd.isRequired ? (
                        <Badge variant="default" className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Required
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Optional
                        </Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>💡 Tip:</strong> You can copy these commands and paste them into the terminal. Make sure to execute them in the correct order!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {}
          {practice.hints && practice.hints.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Additional Hints
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  These hints will help you if you get stuck on any step.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {practice.hints.map((hint, index) => (
                    <motion.div
                      key={hint.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 flex items-center justify-center text-xs font-semibold">
                        {hint.order}
                      </div>
                      <div className="flex items-start gap-2 flex-1">
                        <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          {hint.content}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>💡 Pro Tip:</strong> Try to solve each step on your own first, then use these hints if you need help!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {}
          {practice.validationRules && practice.validationRules.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  Success Criteria
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  These are the requirements you need to meet to complete the practice successfully.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {practice.validationRules.map((rule, index) => (
                    <motion.div
                      key={rule.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 flex items-center justify-center text-xs font-semibold">
                        {rule.order}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {rule.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                            {rule.value}
                          </span>
                        </div>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          {rule.message}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {}
          {practice.tags && practice.tags.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {practice.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="text-xs"
                      style={{ backgroundColor: tag.color + '20', color: tag.color }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            💡 You can always click "Need Help?" to reopen this guide
          </div>
          <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
            Got it! Let's start practicing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
