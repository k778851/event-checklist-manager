import React, { useState, useEffect, useRef } from 'react';

const OTPScreen = ({ onBack, onVerify, uniqueId }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(180); // 3분
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    // 첫 번째 입력 필드에 자동 포커스
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // 타이머
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // 한 번에 한 글자만 입력 가능
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // 다음 입력 필드로 자동 이동
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // OTP가 완성되면 자동 제출
    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // 백스페이스 시 이전 필드로 이동
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (otpValue) => {
    // 테스트용 OTP 코드들
    const testCodes = ['123456', '654321', '111111'];
    
    if (testCodes.includes(otpValue)) {
      onVerify(otpValue);
    } else {
      alert('올바른 OTP 코드를 입력해주세요.');
      setOtp(['', '', '', '', '', '']);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }
  };

  const handleResend = () => {
    setIsResending(true);
    setTimeLeft(180);
    setOtp(['', '', '', '', '', '']);
    
    // 재전송 시뮬레이션
    setTimeout(() => {
      setIsResending(false);
      alert('OTP 코드가 재전송되었습니다.');
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="mb-4">
          <i className="icon-clipboard-document-check text-7xl text-gray-400"></i>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">OTP 인증</h1>
        <p className="text-gray-600 mb-4">등록된 이메일로 전송된 6자리 인증 코드를 입력해 주세요.</p>
        
        <div className="text-blue-600 font-semibold mb-6">
          남은 시간: {formatTime(timeLeft)}
        </div>

        {/* QR 코드 */}
        <div className="mb-6">
          <i className="icon-qr-code text-5xl text-gray-400"></i>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
            인증 코드
          </label>
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono"
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]"
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || timeLeft > 0}
          className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isResending ? '전송 중...' : '인증 코드 재전송'}
        </button>
      </form>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800 mb-2">테스트용 OTP 코드:</p>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 123456</li>
          <li>• 654321</li>
          <li>• 111111</li>
        </ul>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ← 고유번호 다시 입력
        </button>
      </div>
    </div>
  );
};

export default OTPScreen;
