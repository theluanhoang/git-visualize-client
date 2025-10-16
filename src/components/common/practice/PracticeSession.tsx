'use client';

import { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { Practice } from '@/services/practices';
import PracticeSidebar from './PracticeSidebar';
import FeedbackSystem from './FeedbackSystem';
import PracticeHintModal from './PracticeHintModal';
import Terminal from '@/components/common/terminal/Terminal';
import CommitGraph from '@/components/common/CommitGraph';
import { useGitEngine } from '@/lib/react-query/hooks/use-git-engine';
import { useRepositoryState } from '@/lib/react-query/hooks/use-git-engine';
import { useValidatePractice } from '@/lib/react-query/hooks/use-practices';
import { IRepositoryState } from '@/types/git';
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
  const [isViewingGoal, setIsViewingGoal] = useState(false);

  const { clearAllData, syncFromServer } = useGitEngine(practice.id);
  const { data: repoState } = useRepositoryState(practice.id);
  const { mutate: validatePractice, isPending: isValidating } = useValidatePractice();


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

  const handleReset = async () => {
    setCurrentStep(1);
    setIsCompleted(false);
    setCompletedSteps(new Set());
    setShowHint(false);
    await clearAllData();
  };

  const handleStartFresh = () => {
    clearAllData();
    setCurrentStep(1);
    setIsCompleted(false);
    setCompletedSteps(new Set());
    setShowHint(false);
  };

  const handleViewGoal = () => {
    setIsViewingGoal(prev => !prev);
  };

  const handleValidate = () => {
    if (!repoState) {
      showSuccess('Nothing to validate', 'Initialize the repository and try again.');
      return;
    }
    validatePractice(
      { practiceId: practice.id, userRepositoryState: repoState as IRepositoryState },
      {
        onSuccess: (res) => {
          if (res.isCorrect) {
            showSuccess('Perfect!', `Score: ${res.score}. ${res.message}`);
          } else {
            const summary = res.differences.slice(0, 3).map(d => `- [${d.type}] ${d.field}: expected ${String(d.expected)}, got ${String(d.actual)}`).join('\n');
            showSuccess('Validation Result', `${res.feedback}\n\n${summary}${res.differences.length > 3 ? '\n...' : ''}`);
          }
        },
      }
    );
  };

  const handleToggleHint = () => {
    setShowHint(!showHint);
  };

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
                  onClick={handleValidate}
                  disabled={isValidating}
                  className="px-4 py-2 text-sm border border-[var(--border)] rounded-md hover:bg-muted disabled:opacity-60"
                >
                  {isValidating ? 'Validating...' : 'Validate Result'}
                </button>
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
            {isViewingGoal && practice.goalRepositoryState ? (
              <CommitGraph dataSource="goal" goalRepositoryState={practice.goalRepositoryState as IRepositoryState} showClearButton={false} title="Goal Graph" />
            ) : (
              <CommitGraph practiceId={practice.id} title="Practice Graph" />
            )}
          </div>
          <div className="flex-1">
            <Terminal practiceId={practice.id} />
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
        onSync={syncFromServer}
        onViewGoal={practice.goalRepositoryState ? handleViewGoal : undefined}
        isViewingGoal={isViewingGoal}
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
