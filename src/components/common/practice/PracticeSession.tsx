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
import { useValidationCelebration } from '@/hooks/use-validation-celebration';
import { useErrorFeedback } from '@/hooks/use-error-feedback';
import ErrorFeedbackModal from '@/components/common/animations/ErrorFeedbackModal';

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
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const { clearAllData, syncFromServer } = useGitEngine(practice.id);
  const { data: repoState } = useRepositoryState(practice.id);
  const { mutate: validatePractice, isPending: isValidating } = useValidatePractice();


  const {
    feedback,
    showSuccess,
    showHint: showHintFeedback,
    showCongratulations,
    showEpicSuccess,
    hideFeedback
  } = useFeedback();

  const { triggerValidationCelebration } = useValidationCelebration();
  const { errorFeedback, showErrorFeedback, closeErrorFeedback } = useErrorFeedback();

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
      showEpicSuccess(
        '🎉 Chúc Mừng! Tuyệt Vời!',
        `Bạn đã hoàn thành hoàn hảo "${practice.title}". Tiếp tục phát huy nhé!`,
        {
          label: 'Tiếp tục học tập',
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
    setIsGoalModalOpen(true);
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
            // Kích hoạt celebration khi đúng
            triggerValidationCelebration({
              isCorrect: res.isCorrect,
              score: res.score,
              message: res.message,
              feedback: res.feedback
            });
          } else {
            // Hiển thị Error Modal khi sai
            const errorItems = res.differences.map(d => ({
              type: d.type,
              field: d.field,
              expected: String(d.expected),
              actual: String(d.actual)
            }));
            showErrorFeedback(errorItems);
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
            <CommitGraph practiceId={practice.id} title="Practice Graph" />
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
        onValidate={handleValidate}
        isValidating={isValidating}
      />

      {}
      <FeedbackSystem feedback={feedback} onClose={hideFeedback} />
      
      {}
      <PracticeHintModal
        isOpen={showHintModal}
        onClose={() => setShowHintModal(false)}
        practice={practice}
      />

      {isGoalModalOpen && practice.goalRepositoryState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsGoalModalOpen(false)} />
          <div className="relative w-full max-w-5xl bg-background border border-[var(--border)] rounded-lg shadow-xl">
            <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
              <h2 className="text-lg font-semibold">Goal Graph</h2>
              <button onClick={() => setIsGoalModalOpen(false)} className="px-2 py-1 text-sm border rounded hover:bg-muted">Close</button>
            </div>
            <div className="p-4" style={{ height: '70vh' }}>
              <div className="h-full">
                <CommitGraph dataSource="goal" goalRepositoryState={practice.goalRepositoryState as IRepositoryState} showClearButton={false} title="Goal Graph" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Feedback Modal */}
      <ErrorFeedbackModal
        isOpen={errorFeedback.isOpen}
        onClose={closeErrorFeedback}
        errorCount={errorFeedback.errorCount}
        errors={errorFeedback.errors}
        onRetry={() => {
          closeErrorFeedback();
          // Có thể thêm logic retry ở đây nếu cần
        }}
        onViewHint={() => {
          closeErrorFeedback();
          setShowHintModal(true);
        }}
      />
    </div>
  );
}
