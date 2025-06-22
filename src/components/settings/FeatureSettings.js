import React, { useState } from 'react';

const FeatureSettings = () => {
  const [settings, setSettings] = useState({
    checklist: {
      preItems: true,
      dayItems: true,
      timeline: true,
      excelUpload: true
    },
    events: {
      createEvents: true,
      duplicateEvents: true,
      progressDisplay: true
    },
    notifications: {
      uncheckedAlerts: true,
      timeWarnings: true,
      emailNotifications: true,
      pushNotifications: false
    }
  });

  const [colorTags, setColorTags] = useState({
    health: '#FF6B6B',
    internal: '#4ECDC4',
    external: '#45B7D1'
  });

  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleColorChange = (eventType, color) => {
    setColorTags(prev => ({
      ...prev,
      [eventType]: color
    }));
  };

  const handleSave = () => {
    // TODO: API 호출로 설정 저장
    console.log('설정 저장:', { settings, colorTags });
  };

  const handleReset = () => {
    setSettings({
      checklist: {
        preItems: true,
        dayItems: true,
        timeline: true,
        excelUpload: true
      },
      events: {
        createEvents: true,
        duplicateEvents: true,
        progressDisplay: true
      },
      notifications: {
        uncheckedAlerts: true,
        timeWarnings: true,
        emailNotifications: true,
        pushNotifications: false
      }
    });
    setColorTags({
      health: '#FF6B6B',
      internal: '#4ECDC4',
      external: '#45B7D1'
    });
  };

  return (
    <div className="space-y-8">
      {/* 체크리스트 기능 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">체크리스트 기능</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">사전 항목 관리</label>
              <p className="text-xs text-gray-500">행사 전 준비사항 체크리스트 관리</p>
            </div>
            <button
              onClick={() => handleToggle('checklist', 'preItems')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.checklist.preItems ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.checklist.preItems ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">당일 항목 관리</label>
              <p className="text-xs text-gray-500">행사 당일 실시간 체크리스트 관리</p>
            </div>
            <button
              onClick={() => handleToggle('checklist', 'dayItems')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.checklist.dayItems ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.checklist.dayItems ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">타임라인 기능</label>
              <p className="text-xs text-gray-500">시간순 정렬된 당일 체크리스트</p>
            </div>
            <button
              onClick={() => handleToggle('checklist', 'timeline')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.checklist.timeline ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.checklist.timeline ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Excel 업로드/다운로드</label>
              <p className="text-xs text-gray-500">체크리스트 Excel 파일 처리</p>
            </div>
            <button
              onClick={() => handleToggle('checklist', 'excelUpload')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.checklist.excelUpload ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.checklist.excelUpload ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 행사 관리 기능 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">행사 관리 기능</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">행사 생성 기능</label>
              <p className="text-xs text-gray-500">새로운 행사 등록 및 관리</p>
            </div>
            <button
              onClick={() => handleToggle('events', 'createEvents')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.events.createEvents ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.events.createEvents ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">중복 행사 진행 허용</label>
              <p className="text-xs text-gray-500">동시에 여러 행사 진행 가능</p>
            </div>
            <button
              onClick={() => handleToggle('events', 'duplicateEvents')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.events.duplicateEvents ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.events.duplicateEvents ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">진행률 표시 기능</label>
              <p className="text-xs text-gray-500">체크리스트 완료율 시각화</p>
            </div>
            <button
              onClick={() => handleToggle('events', 'progressDisplay')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.events.progressDisplay ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.events.progressDisplay ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 행사 성격별 색상 태그 */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-3">행사 성격별 색상 태그</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700 w-20">보건</label>
              <input
                type="color"
                value={colorTags.health}
                onChange={(e) => handleColorChange('health', e.target.value)}
                className="h-8 w-16 rounded border border-gray-300"
              />
              <span className="text-xs text-gray-500">보건 관련 행사</span>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700 w-20">내부</label>
              <input
                type="color"
                value={colorTags.internal}
                onChange={(e) => handleColorChange('internal', e.target.value)}
                className="h-8 w-16 rounded border border-gray-300"
              />
              <span className="text-xs text-gray-500">내부 행사</span>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700 w-20">대외</label>
              <input
                type="color"
                value={colorTags.external}
                onChange={(e) => handleColorChange('external', e.target.value)}
                className="h-8 w-16 rounded border border-gray-300"
              />
              <span className="text-xs text-gray-500">대외 행사</span>
            </div>
          </div>
        </div>
      </div>

      {/* 알림 기능 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">알림 기능</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">미체크 항목 알림</label>
              <p className="text-xs text-gray-500">완료되지 않은 항목 알림</p>
            </div>
            <button
              onClick={() => handleToggle('notifications', 'uncheckedAlerts')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications.uncheckedAlerts ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications.uncheckedAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">시간대 기준 경고</label>
              <p className="text-xs text-gray-500">예정 시간 초과 시 경고 표시</p>
            </div>
            <button
              onClick={() => handleToggle('notifications', 'timeWarnings')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications.timeWarnings ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications.timeWarnings ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">이메일 알림</label>
              <p className="text-xs text-gray-500">이메일을 통한 알림 발송</p>
            </div>
            <button
              onClick={() => handleToggle('notifications', 'emailNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">푸시 알림</label>
              <p className="text-xs text-gray-500">브라우저 푸시 알림</p>
            </div>
            <button
              onClick={() => handleToggle('notifications', 'pushNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
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

export default FeatureSettings; 