'use client';

import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import { Practice } from '@/services/practices';
import PracticeSidebar from './PracticeSidebar';
import FeedbackSystem from './FeedbackSystem';
import PracticeHintModal from './PracticeHintModal';
import Terminal from '@/components/common/terminal/Terminal';
import CommitGraph from '@/components/common/CommitGraph';
import { useGitEngine } from '@/lib/react-query/hooks/use-git-engine';
import { useFeedback } from '@/hooks/use-feedback';

interface PracticeSessionProps {
  practice: Practice;
  onComplete: () => void;
  onExit: () => void;
}

export default function PracticeSession({ practice, onComplete, onExit }: PracticeSessionProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const { clearAllData } = useGitEngine();


  const {
    feedback,
    showSuccess,
    showHint: showHintFeedback,
    showCongratulations,
    hideFeedback
  } = useFeedback();

  const checkStepCompletion = () => {
    return completedSteps.has(currentStep);
  };

  const handleNextStep = () => {
    if (currentStep < (practice.instructions?.length || 0)) {
      setCurrentStep(prev => prev + 1);
      setShowHint(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setShowHint(false);
    }
  };

  const handleComplete = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      showCongratulations(
        '🎉 Congratulations!',
        `You have successfully completed "${practice.title}". Great job!`,
        {
          label: 'Continue Learning',
          onClick: onComplete
        }
      );
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setIsCompleted(false);
    setCompletedSteps(new Set());
    setShowHint(false);
    clearAllData();
  };

  const handleStartFresh = () => {
    clearAllData();
    setCurrentStep(1);
    setIsCompleted(false);
    setCompletedSteps(new Set());
    setShowHint(false);
  };

  const handleToggleHint = () => {
    setShowHint(!showHint);
    if (!showHint) {
      showHintFeedback(
        '💡 Hint',
        'Here are some helpful hints to guide you through this step.',
        {
          label: 'Got it!',
          onClick: () => setShowHint(false)
        }
      );
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!completedSteps.has(currentStep) && Math.random() > 0.7) {
        setCompletedSteps(prev => new Set([...prev, currentStep]));
        showSuccess(
          '✅ Step Completed!',
          'Great job! You completed this step correctly.',
          {
            label: 'Next Step',
            onClick: handleNextStep
          }
        );
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentStep, completedSteps]);

  return (
    <div className="flex h-screen bg-background">
      {}
      <div className="flex-1 flex flex-col">
        {}
        <div className="border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">{practice.title}</h1>
                <p className="text-sm text-muted-foreground">{practice.scenario}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHintModal(true)}
                  className="px-4 py-2 text-sm border border-yellow-200 bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 flex items-center gap-2"
                >
                  <Lightbulb className="h-4 w-4" />
                  Need Help?
                </button>
                <button
                  onClick={onExit}
                  className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted"
                >
                  Exit Practice
                </button>
              </div>
            </div>
        </div>

        {}
        <div className="flex-1 flex flex-col gap-4 p-4">
          <div className="flex-1">
            <CommitGraph />
          </div>
          <div className="flex-1">
            <Terminal />
          </div>
        </div>
      </div>

      {}
      <PracticeSidebar
        practice={practice}
        currentStep={currentStep}
        onNextStep={handleNextStep}
        onPrevStep={handlePrevStep}
        onComplete={handleComplete}
        onReset={handleReset}
        isCompleted={isCompleted}
        showHint={showHint}
        onToggleHint={handleToggleHint}
        onShowHintModal={() => setShowHintModal(true)}
      />

      {}
      <FeedbackSystem feedback={feedback} onClose={hideFeedback} />
      
      {}
      <PracticeHintModal
        isOpen={showHintModal}
        onClose={() => setShowHintModal(false)}
        practice={practice}
      />
    </div>
  );
}
