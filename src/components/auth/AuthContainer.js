import React, { useState } from 'react';
import LoginScreen from './LoginScreen';
import OTPScreen from './OTPScreen';
import LoadingScreen from './LoadingScreen';

const AuthContainer = ({ onAuthSuccess }) => {
  const [currentStep, setCurrentStep] = useState('login'); // 'login', 'otp', 'loading'
  const [uniqueId, setUniqueId] = useState('');

  const handleLoginNext = () => {
    setCurrentStep('otp');
  };

  const handleOtpBack = () => {
    setCurrentStep('login');
  };

  const handleOtpVerify = (otpCode) => {
    // OTP 검증 시작 - 로딩 상태로 전환
    setCurrentStep('loading');
    
    // 실제 환경에서는 서버에 OTP 검증 요청을 보내야 합니다
    // 여기서는 짧은 지연 후 성공으로 처리
    setTimeout(() => {
      console.log('OTP 검증 성공:', { uniqueId, otpCode });
      
      // 인증 성공 시 콜백 호출
      onAuthSuccess({
        uniqueId,
        otpCode,
        timestamp: new Date().toISOString()
      });
    }, 1500); // 1.5초 로딩
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
        {currentStep === 'login' ? (
          <LoginScreen
            onNext={handleLoginNext}
            uniqueId={uniqueId}
            setUniqueId={setUniqueId}
          />
        ) : currentStep === 'otp' ? (
          <OTPScreen
            onBack={handleOtpBack}
            onVerify={handleOtpVerify}
            uniqueId={uniqueId}
          />
        ) : (
          <LoadingScreen message="OTP 인증 중입니다..." />
        )}
      </div>
      
      {/* Footer */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-xs text-gray-400">
          © 2025 플랜체크 시스템. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthContainer;
