import React, { useState, useRef, useEffect } from 'react';

const LoginScreen = ({ onNext, uniqueId, setUniqueId }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    // 컴포넌트 마운트 시 자동 포커스
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 허용
    
    // 8자리-5자리 형식으로 자동 하이픈 추가
    if (value.length > 8) {
      value = value.slice(0, 8) + '-' + value.slice(8, 13); 
    }
    
    setUniqueId(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (uniqueId.replace(/[^0-9]/g, '').length === 13) {
      onNext();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleFocus = (e) => {
    e.target.select(); // 포커스 시 전체 텍스트 선택
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="mb-4">
          <i className="icon-clipboard-document-list text-7xl text-gray-400"></i>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">플랜체크 관리자 로그인</h1>
        <p className="text-gray-600">접속 허가된 관리자만 접근 가능합니다</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="uniqueId" className="block text-sm font-medium text-gray-700 mb-2">
            고유번호
          </label>
          <input
            ref={inputRef}
            type="text"
            id="uniqueId"
            value={uniqueId}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder="예: 00371210-00149"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
            maxLength={14}
            inputMode="numeric"
            pattern="[0-9]{8}-[0-9]{5}"
          />
          <div className="mt-2 text-sm text-gray-500 text-center">
            {uniqueId.replace(/[^0-9]/g, '').length}/13 자리
          </div>
          <div className="mt-1 text-xs text-gray-400 text-center">
            하이픈(-)은 자동으로 입력됩니다
          </div>
        </div>

        <button
          type="submit"
          disabled={uniqueId.replace(/[^0-9]/g, '').length !== 13}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          확인
        </button>
      </form>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">테스트용 고유번호:</p>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• 00371210-00149</li>
          <li>• 00371210-00150</li>
          <li>• 00371210-00151</li>
        </ul>
      </div>
    </div>
  );
};

export default LoginScreen;
