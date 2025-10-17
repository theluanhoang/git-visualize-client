import { useCallback } from 'react';
import { useCelebrationContext } from '@/components/common/animations';

interface ValidationResult {
  isCorrect: boolean;
  score?: number;
  message?: string;
  feedback?: string;
}

export const useValidationCelebration = () => {
  const celebration = useCelebrationContext();

  const triggerValidationCelebration = useCallback((result: ValidationResult) => {
    if (!result.isCorrect) {
      return;
    }

    const score = result.score || 0;
    const message = result.message || '';

    if (score >= 95) {
      celebration.triggerEpicCelebration(
        '🌟 HOÀN HẢO! XUẤT SẮC!',
        `Bạn đã đạt điểm số tuyệt vời: ${score}%! ${message}`,
        {
          label: 'Chinh phục thử thách tiếp theo',
          onClick: () => {
            console.log('Next challenge');
          }
        }
      );
    } else if (score >= 85) {
      celebration.triggerSuccessCelebration(
        '🎉 Chúc Mừng! Tuyệt Vời!',
        `Bạn đã hoàn thành xuất sắc với điểm số: ${score}%! ${message}`,
        {
          label: 'Tiếp tục luyện tập',
          onClick: () => {
            console.log('Continue practice');
          }
        }
      );
    } else if (score >= 70) {
      celebration.triggerSuccessCelebration(
        '👍 Tốt lắm!',
        `Bạn đã hoàn thành tốt với điểm số: ${score}%! ${message}`,
        {
          label: 'Cải thiện thêm',
          onClick: () => {
            console.log('Improve more');
          }
        }
      );
    } else if (score >= 50) {
      celebration.triggerQuickCelebration(
        '👏 Đã hoàn thành!',
        `Bạn đã hoàn thành với điểm số: ${score}%. Hãy cố gắng hơn nữa! ${message}`
      );
    } else {
      return;
    }
  }, [celebration]);

  const triggerPerfectScoreCelebration = useCallback(() => {
    celebration.triggerEpicCelebration(
      '🏆 HOÀN HẢO TUYỆT ĐỐI!',
      'Bạn đã đạt điểm số hoàn hảo 100%! Thật xuất sắc!',
      {
        label: 'Trở thành chuyên gia',
        onClick: () => {
          console.log('Become expert');
        }
      }
    );
  }, [celebration]);

  const triggerFirstTimeSuccessCelebration = useCallback(() => {
    celebration.triggerSuccessCelebration(
      '🎊 Lần đầu thành công!',
      'Chúc mừng bạn đã hoàn thành lần đầu tiên! Hãy tiếp tục phát huy!',
      {
        label: 'Tiếp tục hành trình',
        onClick: () => {
          console.log('Continue journey');
        }
      }
    );
  }, [celebration]);

  const triggerStreakCelebration = useCallback((streakCount: number) => {
    if (streakCount >= 5) {
      celebration.triggerEpicCelebration(
        '🔥 CHUỖI THÀNH CÔNG!',
        `Bạn đã liên tiếp thành công ${streakCount} lần! Thật ấn tượng!`,
        {
          label: 'Giữ vững phong độ',
          onClick: () => {
            console.log('Keep momentum');
          }
        }
      );
    } else if (streakCount >= 3) {
      celebration.triggerSuccessCelebration(
        '⚡ Chuỗi thành công!',
        `Bạn đã liên tiếp thành công ${streakCount} lần! Tiếp tục nào!`,
        {
          label: 'Duy trì phong độ',
          onClick: () => {
            console.log('Maintain streak');
          }
        }
      );
    }
  }, [celebration]);

  return {
    triggerValidationCelebration,
    triggerPerfectScoreCelebration,
    triggerFirstTimeSuccessCelebration,
    triggerStreakCelebration
  };
};
