'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useValidationCelebration } from '@/hooks/use-validation-celebration';
import { Trophy, Star, Target, Zap } from 'lucide-react';

export default function ValidationCelebrationDemo() {
  const { 
    triggerValidationCelebration, 
    triggerPerfectScoreCelebration,
    triggerFirstTimeSuccessCelebration,
    triggerStreakCelebration 
  } = useValidationCelebration();

  const [streakCount, setStreakCount] = useState(0);

  const simulateValidation = (score: number, message: string) => {
    triggerValidationCelebration({
      isCorrect: true,
      score,
      message
    });
  };

  const simulatePerfectScore = () => {
    triggerPerfectScoreCelebration();
  };

  const simulateFirstTimeSuccess = () => {
    triggerFirstTimeSuccessCelebration();
  };

  const simulateStreak = () => {
    setStreakCount(prev => prev + 1);
    triggerStreakCelebration(streakCount + 1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">🎯 Validation Celebration Demo</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Mô phỏng các kết quả validation khác nhau để xem celebration system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Dựa trên điểm số
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => simulateValidation(100, 'Hoàn hảo tuyệt đối!')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              🏆 Điểm hoàn hảo (100%)
            </Button>
            
            <Button 
              onClick={() => simulateValidation(95, 'Xuất sắc!')}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              🌟 Điểm xuất sắc (95%)
            </Button>
            
            <Button 
              onClick={() => simulateValidation(85, 'Rất tốt!')}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              🎉 Điểm cao (85%)
            </Button>
            
            <Button 
              onClick={() => simulateValidation(75, 'Tốt!')}
              className="w-full bg-yellow-500 hover:bg-yellow-600"
            >
              👍 Điểm khá (75%)
            </Button>
            
            <Button 
              onClick={() => simulateValidation(60, 'Đã hoàn thành!')}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              👏 Điểm trung bình (60%)
            </Button>
          </CardContent>
        </Card>

        {/* Special Celebrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-500" />
              Celebration đặc biệt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={simulatePerfectScore}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              🏆 Điểm hoàn hảo đặc biệt
            </Button>
            
            <Button 
              onClick={simulateFirstTimeSuccess}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              🎊 Lần đầu thành công
            </Button>
            
            <Button 
              onClick={simulateStreak}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
            >
              🔥 Chuỗi thành công ({streakCount + 1} lần)
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Current Streak Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Chuỗi thành công hiện tại
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
              {streakCount}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {streakCount === 0 && 'Bắt đầu chuỗi thành công của bạn!'}
              {streakCount === 1 && 'Bắt đầu tốt!'}
              {streakCount === 2 && 'Đang có đà!'}
              {streakCount >= 3 && streakCount < 5 && 'Chuỗi ấn tượng!'}
              {streakCount >= 5 && 'Chuỗi xuất sắc!'}
            </p>
            <Button 
              onClick={() => setStreakCount(0)}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Reset chuỗi
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Celebration Levels Info */}
      <Card>
        <CardHeader>
          <CardTitle>🎨 Mức độ Celebration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">🌟 Epic Celebration (95%+)</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                <li>• Pháo hoa + Confetti + Sparkles</li>
                <li>• Âm thanh đầy đủ</li>
                <li>• Thời gian: 8 giây</li>
                <li>• Thông điệp: "HOÀN HẢO! XUẤT SẮC!"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">🎉 Success Celebration (70-94%)</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                <li>• Pháo hoa + Confetti</li>
                <li>• Âm thanh victory</li>
                <li>• Thời gian: 5 giây</li>
                <li>• Thông điệp: "Chúc Mừng! Tuyệt Vời!"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">👍 Quick Celebration (50-69%)</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                <li>• Confetti + Sparkles</li>
                <li>• Âm thanh nhẹ</li>
                <li>• Thời gian: 2 giây</li>
                <li>• Thông điệp: "Đã hoàn thành!"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-600 dark:text-gray-400 mb-2">❌ Không có Celebration (&lt;50%)</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                <li>• Chỉ có feedback thông thường</li>
                <li>• Không có âm thanh</li>
                <li>• Khuyến khích cố gắng hơn</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
