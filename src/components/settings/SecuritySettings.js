import React, { useState } from 'react';

const SecuritySettings = () => {
  const [settings, setSettings] = useState({
    authentication: {
      jwtExpiry: 24,
      sessionTimeout: 30,
      passwordMinLength: 8,
      passwordComplexity: true,
      loginAttempts: 5,
      lockoutDuration: 30
    },
    accessControl: {
      departmentAccess: true,
      eventAccess: true,
      checklistAccess: true,
      excelDownload: true
    },
    audit: {
      userActivityLog: true,
      dataChangeLog: true,
      logRetention: 365,
      logDownload: false
    }
  });

  const handleInputChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleSave = () => {
    // TODO: API 호출로 설정 저장
    console.log('보안 설정 저장:', settings);
  };

  const handleReset = () => {
    setSettings({
      authentication: {
        jwtExpiry: 24,
        sessionTimeout: 30,
        passwordMinLength: 8,
        passwordComplexity: true,
        loginAttempts: 5,
        lockoutDuration: 30
      },
      accessControl: {
        departmentAccess: true,
        eventAccess: true,
        checklistAccess: true,
        excelDownload: true
      },
      audit: {
        userActivityLog: true,
        dataChangeLog: true,
        logRetention: 365,
        logDownload: false
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* 인증 및 권한 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">인증 및 권한</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                JWT 토큰 만료 시간 (시간)
              </label>
              <input
                type="number"
                value={settings.authentication.jwtExpiry}
                onChange={(e) => handleInputChange('authentication', 'jwtExpiry', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="168"
              />
              <p className="text-xs text-gray-500 mt-1">기본값: 24시간</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                세션 타임아웃 (분)
              </label>
              <input
                type="number"
                value={settings.authentication.sessionTimeout}
                onChange={(e) => handleInputChange('authentication', 'sessionTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="5"
                max="480"
              />
              <p className="text-xs text-gray-500 mt-1">기본값: 30분</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 최소 길이
              </label>
              <input
                type="number"
                value={settings.authentication.passwordMinLength}
                onChange={(e) => handleInputChange('authentication', 'passwordMinLength', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="6"
                max="20"
              />
              <p className="text-xs text-gray-500 mt-1">기본값: 8자</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                로그인 시도 제한 횟수
              </label>
              <input
                type="number"
                value={settings.authentication.loginAttempts}
                onChange={(e) => handleInputChange('authentication', 'loginAttempts', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="3"
                max="10"
              />
              <p className="text-xs text-gray-500 mt-1">기본값: 5회</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                계정 잠금 해제 시간 (분)
              </label>
              <input
                type="number"
                value={settings.authentication.lockoutDuration}
                onChange={(e) => handleInputChange('authentication', 'lockoutDuration', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="5"
                max="1440"
              />
              <p className="text-xs text-gray-500 mt-1">기본값: 30분</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <label className="text-sm font-medium text-gray-700">비밀번호 복잡도 요구사항</label>
              <p className="text-xs text-gray-500">대문자, 소문자, 숫자, 특수문자 포함</p>
            </div>
            <button
              onClick={() => handleToggle('authentication', 'passwordComplexity')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.authentication.passwordComplexity ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.authentication.passwordComplexity ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 데이터 접근 제어 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">데이터 접근 제어</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">부서별 데이터 접근 권한</label>
              <p className="text-xs text-gray-500">부서별 세부 데이터 접근 제어</p>
            </div>
            <button
              onClick={() => handleToggle('accessControl', 'departmentAccess')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.accessControl.departmentAccess ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.accessControl.departmentAccess ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">행사별 데이터 접근 권한</label>
              <p className="text-xs text-gray-500">행사별 세부 데이터 접근 제어</p>
            </div>
            <button
              onClick={() => handleToggle('accessControl', 'eventAccess')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.accessControl.eventAccess ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.accessControl.eventAccess ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">체크리스트 항목별 권한</label>
              <p className="text-xs text-gray-500">체크리스트 항목별 세부 권한 설정</p>
            </div>
            <button
              onClick={() => handleToggle('accessControl', 'checklistAccess')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.accessControl.checklistAccess ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.accessControl.checklistAccess ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Excel 다운로드 권한</label>
              <p className="text-xs text-gray-500">Excel 파일 다운로드 세부 권한</p>
            </div>
            <button
              onClick={() => handleToggle('accessControl', 'excelDownload')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.accessControl.excelDownload ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.accessControl.excelDownload ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 감사 및 로깅 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">감사 및 로깅</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">사용자 활동 로그</label>
              <p className="text-xs text-gray-500">사용자 로그인, 로그아웃, 페이지 접근 기록</p>
            </div>
            <button
              onClick={() => handleToggle('audit', 'userActivityLog')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.audit.userActivityLog ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.audit.userActivityLog ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">데이터 변경 이력 추적</label>
              <p className="text-xs text-gray-500">체크리스트, 행사 정보 변경 이력 기록</p>
            </div>
            <button
              onClick={() => handleToggle('audit', 'dataChangeLog')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.audit.dataChangeLog ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.audit.dataChangeLog ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">로그 다운로드 권한</label>
              <p className="text-xs text-gray-500">관리자가 로그 파일 다운로드 가능</p>
            </div>
            <button
              onClick={() => handleToggle('audit', 'logDownload')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.audit.logDownload ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.audit.logDownload ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              로그 보관 기간 (일)
            </label>
            <input
              type="number"
              value={settings.audit.logRetention}
              onChange={(e) => handleInputChange('audit', 'logRetention', parseInt(e.target.value))}
              className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="30"
              max="3650"
            />
            <p className="text-xs text-gray-500 mt-1">기본값: 365일 (1년)</p>
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          초기화
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings; 