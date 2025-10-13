'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Clock, Target, Lightbulb, AlertCircle } from 'lucide-react';
import { Practice } from '@/services/practices';

interface PracticeSidebarProps {
  practice: Practice;
  currentStep: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onComplete: () => void;
  onReset: () => void;
  isCompleted: boolean;
  showHint: boolean;
  onToggleHint: () => void;
  onShowHintModal: () => void;
}

export default function PracticeSidebar({
  practice,
  currentStep,
  onNextStep,
  onPrevStep,
  onComplete,
  onReset,
  isCompleted,
  showHint,
  onToggleHint,
  onShowHintModal
}: PracticeSidebarProps) {
  const [showExpectedCommands, setShowExpectedCommands] = useState(false);

  const progress = practice.instructions ? (currentStep / practice.instructions.length) * 100 : 0;
  const currentInstruction = practice.instructions?.[currentStep - 1];
  const expectedCommands = practice.expectedCommands || [];

  return (
    <div className="w-80 bg-background border-l border-border h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{practice.title}</CardTitle>
              <Badge variant={practice.difficulty === 1 ? 'default' : practice.difficulty === 2 ? 'secondary' : 'destructive'}>
                {practice.difficulty === 1 ? 'Beginner' : practice.difficulty === 2 ? 'Intermediate' : 'Advanced'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{practice.scenario}</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{practice.estimatedTime} minutes</span>
            </div>
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Progress</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Step {currentStep} of {practice.instructions?.length || 0}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {}
        {currentInstruction && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="h-4 w-4" />
                Current Step
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm">{currentInstruction.content}</p>
            </CardContent>
          </Card>
        )}

        {}
        {practice.hints && practice.hints.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Hints
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleHint}
                  className="ml-auto h-6 px-2"
                >
                  {showHint ? 'Hide' : 'Show'}
                </Button>
              </CardTitle>
            </CardHeader>
            {showHint && (
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {practice.hints.map((hint, index) => (
                    <div key={hint.id} className="flex items-start gap-2 text-sm">
                      <Circle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <span>{hint.content}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {}
        {expectedCommands.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Expected Commands
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExpectedCommands(!showExpectedCommands)}
                  className="ml-auto h-6 px-2"
                >
                  {showExpectedCommands ? 'Hide' : 'Show'}
                </Button>
              </CardTitle>
            </CardHeader>
            {showExpectedCommands && (
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {expectedCommands.map((cmd, index) => (
                    <div key={cmd.id} className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">{cmd.order}.</span>
                      <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                        {cmd.command}
                      </code>
                      {cmd.isRequired && (
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {}
        <div className="space-y-2">
          {!isCompleted ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onPrevStep}
                disabled={currentStep <= 1}
                className="flex-1"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onNextStep}
                disabled={currentStep >= (practice.instructions?.length || 0)}
                className="flex-1"
              >
                Next
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Practice Completed!</span>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={onComplete}
              disabled={isCompleted}
              className="flex-1"
            >
              {isCompleted ? 'Completed' : 'Mark Complete'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="flex-1"
            >
              Reset
            </Button>
          </div>

          {}
          <Button
            variant="outline"
            size="sm"
            onClick={onShowHintModal}
            className="w-full border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Need Help? View Full Guide
          </Button>
        </div>

        {}
        {practice.tags && practice.tags.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Tags</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1">
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
    </div>
  );
}
