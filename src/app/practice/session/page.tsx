'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PracticesService } from '@/services/practices';
import { useLessons } from '@/lib/react-query/hooks/use-lessons';
import PracticeSession from "@/components/common/practice/PracticeSession";
import PracticeHeader from "@/components/common/practice/PracticeHeader";
import { GoalModal } from "@/components/common/practice/GoalModal";
import { GoalButton } from "@/components/common/practice/GoalButton";
import { Practice } from '@/services/practices';
import { PrivateRoute } from '@/components/auth/PrivateRoute';

export default function PracticeSessionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lessonSlug = searchParams.get('lesson');
  const practiceId = searchParams.get('practice');
  
  const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);

  const { data: lessonsData } = useLessons({ 
    slug: lessonSlug || undefined,
    includePractices: false 
  });
  
  const lesson = lessonsData?.[0];

  useEffect(() => {
    const loadPractice = async () => {
      if (!practiceId) {
        setError('Practice ID is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const practice = await PracticesService.getPracticeById(practiceId);
        setSelectedPractice(practice);
      } catch (err) {
        console.error('Error loading practice:', err);
        setError('Failed to load practice session');
      } finally {
        setIsLoading(false);
      }
    };

    loadPractice();
  }, [practiceId]);

  const handleCompletePractice = () => {
    router.push(`/practice?lesson=${lessonSlug}`);
  };

  const handleExitPractice = () => {
    router.push(`/practice?lesson=${lessonSlug}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading practice session...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedPractice) {
    return (
      <div className="container mx-auto mt-10 px-4">
        <PracticeHeader 
          lessonTitle={lesson?.title}
          lessonDescription={lesson?.description}
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">{error || 'Practice not found'}</p>
            <button
              onClick={() => router.push(`/practice?lesson=${lessonSlug}`)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Back to Practice Selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PrivateRoute showAccessDenied={false}>
      <div className="">
        <main className="container mx-auto mt-10 px-4">
        <PracticeHeader 
          lessonTitle={lesson?.title}
          lessonDescription={lesson?.description}
        />
        
        {}
        <div className="flex justify-center mb-6">
          <GoalButton
            onClick={() => setShowGoalModal(true)}
            hasGoal={!!selectedPractice?.goalRepositoryState}
          />
        </div>
        
        <PracticeSession
          practice={selectedPractice}
          onComplete={handleCompletePractice}
          onExit={handleExitPractice}
        />

        {}
        {selectedPractice?.goalRepositoryState && (
          <GoalModal
            isOpen={showGoalModal}
            onClose={() => setShowGoalModal(false)}
            goalRepositoryState={selectedPractice.goalRepositoryState}
            practiceTitle={selectedPractice.title}
          />
        )}
        </main>
      </div>
    </PrivateRoute>
  );
}
