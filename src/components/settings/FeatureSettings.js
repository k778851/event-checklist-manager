import React, { useState } from 'react';

const FeatureSettings = () => {
  const [settings, setSettings] = useState({
    // 사용자 관리 기능
    userManagement: {
      userRegistration: true,
      roleManagement: true,
      departmentManagement: true,
      permissionControl: true
    },
    // 행사 관리 기능
    eventManagement: {
      eventCreation: true,
      eventEditing: true,
      eventDeletion: true,
      eventDuplication: true,
      eventCategories: true
    },
    // 체크리스트 기능
    checklist: {
      preEventChecklist: true,
      dayOfEventChecklist: true,
      timelineView: true,
      progressTracking: true,
      excelImportExport: true
    },
    // 대시보드 기능
    dashboard: {
      overviewStats: true,
      progressCharts: true,
      recentActivities: true,
      quickActions: true
    },
    // 검색 및 필터링
    searchAndFilter: {
      eventSearch: true,
      userSearch: true,
      advancedFiltering: true,
      searchHistory: true
    },
    // 알림 및 통지
    notifications: {
      emailNotifications: true,
      inAppNotifications: true,
      deadlineReminders: true,
      progressUpdates: true
    },
    // 데이터 관리
    dataManagement: {
      dataExport: true,
      dataBackup: true,
      dataRestore: true,
      auditLogs: true
    }
  });

  const [colorTags, setColorTags] = useState({
    general: '#DC2626',  // red-600 (총회)
    branch: '#0284C7',   // sky-600 (지파)
    region: '#D97706',   // amber-600 (지역)
    department: '#059669' // emerald-600 (24부서-회)
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
      // 사용자 관리 기능
      userManagement: {
        userRegistration: true,
        roleManagement: true,
        departmentManagement: true,
        permissionControl: true
      },
      // 행사 관리 기능
      eventManagement: {
        eventCreation: true,
        eventEditing: true,
        eventDeletion: true,
        eventDuplication: true,
        eventCategories: true
      },
      // 체크리스트 기능
      checklist: {
        preEventChecklist: true,
        dayOfEventChecklist: true,
        timelineView: true,
        progressTracking: true,
        excelImportExport: true
      },
      // 대시보드 기능
      dashboard: {
        overviewStats: true,
        progressCharts: true,
        recentActivities: true,
        quickActions: true
      },
      // 검색 및 필터링
      searchAndFilter: {
        eventSearch: true,
        userSearch: true,
        advancedFiltering: true,
        searchHistory: true
      },
      // 알림 및 통지
      notifications: {
        emailNotifications: true,
        inAppNotifications: true,
        deadlineReminders: true,
        progressUpdates: true
      },
      // 데이터 관리
      dataManagement: {
        dataExport: true,
        dataBackup: true,
        dataRestore: true,
        auditLogs: true
      }
    });
    setColorTags({
      general: '#DC2626',  // red-600 (총회)
      branch: '#0284C7',   // sky-600 (지파)
      region: '#D97706',   // amber-600 (지역)
      department: '#059669' // emerald-600 (24부서-회)
    });
  };

  return (
    <div className="space-y-8">
      {/* 사용자 관리 기능 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">사용자 관리 기능</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">사용자 등록</label>
              <p className="text-xs text-gray-500">새로운 사용자 계정 생성 및 관리</p>
            </div>
            <button
              onClick={() => handleToggle('userManagement', 'userRegistration')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.userManagement.userRegistration ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.userManagement.userRegistration ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">역할 관리</label>
              <p className="text-xs text-gray-500">사용자 권한 및 역할 설정</p>
            </div>
            <button
              onClick={() => handleToggle('userManagement', 'roleManagement')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.userManagement.roleManagement ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.userManagement.roleManagement ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">부서 관리</label>
              <p className="text-xs text-gray-500">부서별 사용자 그룹 관리</p>
            </div>
            <button
              onClick={() => handleToggle('userManagement', 'departmentManagement')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.userManagement.departmentManagement ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.userManagement.departmentManagement ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">권한 제어</label>
              <p className="text-xs text-gray-500">세부적인 기능별 접근 권한 설정</p>
            </div>
            <button
              onClick={() => handleToggle('userManagement', 'permissionControl')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.userManagement.permissionControl ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.userManagement.permissionControl ? 'translate-x-6' : 'translate-x-1'
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
              <label className="text-sm font-medium text-gray-700">행사 생성</label>
              <p className="text-xs text-gray-500">새로운 행사 등록 및 기본 정보 설정</p>
            </div>
            <button
              onClick={() => handleToggle('eventManagement', 'eventCreation')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.eventManagement.eventCreation ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.eventManagement.eventCreation ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">행사 편집</label>
              <p className="text-xs text-gray-500">기존 행사 정보 수정 및 업데이트</p>
            </div>
            <button
              onClick={() => handleToggle('eventManagement', 'eventEditing')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.eventManagement.eventEditing ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.eventManagement.eventEditing ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">행사 삭제</label>
              <p className="text-xs text-gray-500">행사 정보 완전 삭제</p>
            </div>
            <button
              onClick={() => handleToggle('eventManagement', 'eventDeletion')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.eventManagement.eventDeletion ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.eventManagement.eventDeletion ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">행사 복제</label>
              <p className="text-xs text-gray-500">기존 행사를 기반으로 새 행사 생성</p>
            </div>
            <button
              onClick={() => handleToggle('eventManagement', 'eventDuplication')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.eventManagement.eventDuplication ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.eventManagement.eventDuplication ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">행사 카테고리</label>
              <p className="text-xs text-gray-500">행사 유형별 분류 및 관리</p>
            </div>
            <button
              onClick={() => handleToggle('eventManagement', 'eventCategories')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.eventManagement.eventCategories ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.eventManagement.eventCategories ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 체크리스트 기능 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">체크리스트 기능</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">사전 행사 체크리스트</label>
              <p className="text-xs text-gray-500">행사 전 준비사항 체크리스트 관리</p>
            </div>
            <button
              onClick={() => handleToggle('checklist', 'preEventChecklist')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.checklist.preEventChecklist ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.checklist.preEventChecklist ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">당일 행사 체크리스트</label>
              <p className="text-xs text-gray-500">행사 당일 실시간 체크리스트 관리</p>
            </div>
            <button
              onClick={() => handleToggle('checklist', 'dayOfEventChecklist')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.checklist.dayOfEventChecklist ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.checklist.dayOfEventChecklist ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">타임라인 뷰</label>
              <p className="text-xs text-gray-500">시간순 정렬된 당일 체크리스트</p>
            </div>
            <button
              onClick={() => handleToggle('checklist', 'timelineView')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.checklist.timelineView ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.checklist.timelineView ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">진행률 추적</label>
              <p className="text-xs text-gray-500">체크리스트 완료율 시각화 및 모니터링</p>
            </div>
            <button
              onClick={() => handleToggle('checklist', 'progressTracking')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.checklist.progressTracking ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.checklist.progressTracking ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Excel 가져오기/내보내기</label>
              <p className="text-xs text-gray-500">체크리스트 Excel 파일 처리</p>
            </div>
            <button
              onClick={() => handleToggle('checklist', 'excelImportExport')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.checklist.excelImportExport ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.checklist.excelImportExport ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 대시보드 기능 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">대시보드 기능</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">개요 통계</label>
              <p className="text-xs text-gray-500">전체 행사 및 체크리스트 현황 요약</p>
            </div>
            <button
              onClick={() => handleToggle('dashboard', 'overviewStats')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.dashboard.overviewStats ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.dashboard.overviewStats ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">진행률 차트</label>
              <p className="text-xs text-gray-500">시각적 진행률 표시 및 분석</p>
            </div>
            <button
              onClick={() => handleToggle('dashboard', 'progressCharts')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.dashboard.progressCharts ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.dashboard.progressCharts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">최근 활동</label>
              <p className="text-xs text-gray-500">최근 업데이트된 행사 및 체크리스트</p>
            </div>
            <button
              onClick={() => handleToggle('dashboard', 'recentActivities')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.dashboard.recentActivities ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.dashboard.recentActivities ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">빠른 작업</label>
              <p className="text-xs text-gray-500">자주 사용하는 기능에 대한 빠른 접근</p>
            </div>
            <button
              onClick={() => handleToggle('dashboard', 'quickActions')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.dashboard.quickActions ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.dashboard.quickActions ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 검색 및 필터링 기능 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">검색 및 필터링 기능</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">행사 검색</label>
              <p className="text-xs text-gray-500">행사명, 날짜, 카테고리별 검색</p>
            </div>
            <button
              onClick={() => handleToggle('searchAndFilter', 'eventSearch')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.searchAndFilter.eventSearch ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.searchAndFilter.eventSearch ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">사용자 검색</label>
              <p className="text-xs text-gray-500">이름, 부서, 권한별 사용자 검색</p>
            </div>
            <button
              onClick={() => handleToggle('searchAndFilter', 'userSearch')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.searchAndFilter.userSearch ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.searchAndFilter.userSearch ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">고급 필터링</label>
              <p className="text-xs text-gray-500">다중 조건을 통한 정밀 검색</p>
            </div>
            <button
              onClick={() => handleToggle('searchAndFilter', 'advancedFiltering')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.searchAndFilter.advancedFiltering ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.searchAndFilter.advancedFiltering ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">검색 기록</label>
              <p className="text-xs text-gray-500">최근 검색어 및 필터 조건 저장</p>
            </div>
            <button
              onClick={() => handleToggle('searchAndFilter', 'searchHistory')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.searchAndFilter.searchHistory ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.searchAndFilter.searchHistory ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 행사 성격별 색상 태그 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">행사 성격별 색상 태그</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 w-20">총회</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={colorTags.general}
                onChange={(e) => handleColorChange('general', e.target.value)}
                className="h-8 w-16 rounded border border-gray-300"
              />
              <input
                type="text"
                value={colorTags.general}
                onChange={(e) => handleColorChange('general', e.target.value)}
                placeholder="#DC2626"
                className="h-8 w-24 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-xs text-gray-500">총회 관련 행사</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 w-20">지파</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={colorTags.branch}
                onChange={(e) => handleColorChange('branch', e.target.value)}
                className="h-8 w-16 rounded border border-gray-300"
              />
              <input
                type="text"
                value={colorTags.branch}
                onChange={(e) => handleColorChange('branch', e.target.value)}
                placeholder="#0284C7"
                className="h-8 w-24 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-xs text-gray-500">지파 관련 행사</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 w-20">지역</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={colorTags.region}
                onChange={(e) => handleColorChange('region', e.target.value)}
                className="h-8 w-16 rounded border border-gray-300"
              />
              <input
                type="text"
                value={colorTags.region}
                onChange={(e) => handleColorChange('region', e.target.value)}
                placeholder="#D97706"
                className="h-8 w-24 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-xs text-gray-500">지역 관련 행사</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 w-20">24부서-회</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={colorTags.department}
                onChange={(e) => handleColorChange('department', e.target.value)}
                className="h-8 w-16 rounded border border-gray-300"
              />
              <input
                type="text"
                value={colorTags.department}
                onChange={(e) => handleColorChange('department', e.target.value)}
                placeholder="#059669"
                className="h-8 w-24 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-xs text-gray-500">24부서-회 관련 행사</span>
          </div>
          
          {/* 미리 정의된 색상 팔레트 */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">빠른 색상 선택</h4>
            <div className="grid grid-cols-6 gap-2">
              {[
                { color: '#009651', name: '요한' },
                { color: '#00a0e9', name: '베드로' },
                { color: '#1d2088', name: '서울야고보' },
                { color: '#59C3e1', name: '안드레' },
                { color: '#eb6120', name: '다대오' },
                { color: '#d7005b', name: '빌립' },
                { color: '#fdd000', name: '시몬' },
                { color: '#86cab6', name: '바돌로메' },
                { color: '#e39300', name: '마태' },
                { color: '#6fba2c', name: '맛디아' },
                { color: '#005dac', name: '부산야고보' },
                { color: '#7f1084', name: '도마' }
              ].map((item) => (
                <div key={item.color} className="flex flex-col items-center space-y-1">
                  <button
                    onClick={() => handleColorChange('branch', item.color)}
                    className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: item.color }}
                    title={item.color}
                  />
                  <span className="text-xs text-gray-600 text-center">{item.name}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">색상을 클릭하면 지파 행사 색상으로 설정됩니다</p>
          </div>
        </div>
      </div>

      {/* 알림 및 통지 기능 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">알림 및 통지 기능</h3>
        <div className="space-y-4">
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
              <label className="text-sm font-medium text-gray-700">앱 내 알림</label>
              <p className="text-xs text-gray-500">애플리케이션 내 알림 표시</p>
            </div>
            <button
              onClick={() => handleToggle('notifications', 'inAppNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications.inAppNotifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications.inAppNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">마감일 알림</label>
              <p className="text-xs text-gray-500">체크리스트 마감일 임박 시 알림</p>
            </div>
            <button
              onClick={() => handleToggle('notifications', 'deadlineReminders')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications.deadlineReminders ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications.deadlineReminders ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">진행률 업데이트</label>
              <p className="text-xs text-gray-500">체크리스트 진행률 변경 시 알림</p>
            </div>
            <button
              onClick={() => handleToggle('notifications', 'progressUpdates')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications.progressUpdates ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications.progressUpdates ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 데이터 관리 기능 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">데이터 관리 기능</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">데이터 내보내기</label>
              <p className="text-xs text-gray-500">행사 및 체크리스트 데이터 Excel/CSV 내보내기</p>
            </div>
            <button
              onClick={() => handleToggle('dataManagement', 'dataExport')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.dataManagement.dataExport ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.dataManagement.dataExport ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">데이터 백업</label>
              <p className="text-xs text-gray-500">시스템 데이터 자동 백업</p>
            </div>
            <button
              onClick={() => handleToggle('dataManagement', 'dataBackup')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.dataManagement.dataBackup ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.dataManagement.dataBackup ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">데이터 복원</label>
              <p className="text-xs text-gray-500">백업된 데이터 복원 기능</p>
            </div>
            <button
              onClick={() => handleToggle('dataManagement', 'dataRestore')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.dataManagement.dataRestore ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.dataManagement.dataRestore ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">감사 로그</label>
              <p className="text-xs text-gray-500">사용자 활동 및 시스템 변경 이력 기록</p>
            </div>
            <button
              onClick={() => handleToggle('dataManagement', 'auditLogs')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.dataManagement.auditLogs ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.dataManagement.auditLogs ? 'translate-x-6' : 'translate-x-1'
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