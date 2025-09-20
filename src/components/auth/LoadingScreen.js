import React, { useEffect } from 'react';

const LoadingScreen = ({ onComplete, message = "로그인 중입니다..." }) => {
  useEffect(() => {
    // 1.5초 후 완료
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => {
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    // 반투명 모달 오버레이
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center">
          {/* 스피너 애니메이션 */}
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-6"></div>
          
          {/* 로딩 메시지 */}
          <p className="text-gray-700 text-lg font-medium">
            {message}
          </p>
          
          {/* 추가 메시지 */}
          <p className="text-gray-500 text-sm mt-2">
            잠시만 기다려주세요...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
