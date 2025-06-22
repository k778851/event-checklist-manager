import React, { useState } from 'react';

const ApiSettings = () => {
  const [settings, setSettings] = useState({
    endpoints: {
      apiVersion: 'v1.0',
      autoDocGeneration: true,
      rateLimiting: 100,
      apiKeyManagement: true
    },
    integration: {
      excelEngine: 'ExcelJS',
      notificationService: true,
      backupService: true,
      monitoringTool: true
    },
    performance: {
      apiCaching: true,
      cacheExpiry: 300,
      dbConnectionPool: 10,
      fileUploadLimit: 10
    }
  });

  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: '기본 API 키', key: 'sk-...abc123', created: '2024-01-15', status: 'active' },
    { id: 2, name: '테스트 API 키', key: 'sk-...def456', created: '2024-01-10', status: 'inactive' }
  ]);

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
    console.log('API 설정 저장:', settings);
  };

  const handleReset = () => {
    setSettings({
      endpoints: {
        apiVersion: 'v1.0',
        autoDocGeneration: true,
        rateLimiting: 100,
        apiKeyManagement: true
      },
      integration: {
        excelEngine: 'ExcelJS',
        notificationService: true,
        backupService: true,
        monitoringTool: true
      },
      performance: {
        apiCaching: true,
        cacheExpiry: 300,
        dbConnectionPool: 10,
        fileUploadLimit: 10
      }
    });
  };

  const generateApiKey = () => {
    const newKey = {
      id: Date.now(),
      name: `API 키 ${apiKeys.length + 1}`,
      key: `sk-...${Math.random().toString(36).substr(2, 9)}`,
      created: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    setApiKeys([...apiKeys, newKey]);
  };

  const toggleApiKeyStatus = (id) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id 
        ? { ...key, status: key.status === 'active' ? 'inactive' : 'active' }
        : key
    ));
  };

  return (
    <div className="space-y-8">
      {/* API 엔드포인트 관리 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API 엔드포인트 관리</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API 버전
              </label>
              <input
                type="text"
                value={settings.endpoints.apiVersion}
                onChange={(e) => handleInputChange('endpoints', 'apiVersion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="v1.0"
              />
              <p className="text-xs text-gray-500 mt-1">현재 버전: v1.0</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API 요청 제한 (분당)
              </label>
              <input
                type="number"
                value={settings.endpoints.rateLimiting}
                onChange={(e) => handleInputChange('endpoints', 'rateLimiting', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="10"
                max="1000"
              />
              <p className="text-xs text-gray-500 mt-1">기본값: 100회/분</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <label className="text-sm font-medium text-gray-700">API 문서 자동 생성</label>
              <p className="text-xs text-gray-500">Swagger/OpenAPI 문서 자동 생성</p>
            </div>
            <button
              onClick={() => handleToggle('endpoints', 'autoDocGeneration')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.endpoints.autoDocGeneration ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.endpoints.autoDocGeneration ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">API 키 관리</label>
              <p className="text-xs text-gray-500">API 키 생성 및 관리 기능</p>
            </div>
            <button
              onClick={() => handleToggle('endpoints', 'apiKeyManagement')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.endpoints.apiKeyManagement ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.endpoints.apiKeyManagement ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* API 키 관리 테이블 */}
        {settings.endpoints.apiKeyManagement && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium text-gray-900">API 키 목록</h4>
              <button
                onClick={generateApiKey}
                className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                새 API 키 생성
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      이름
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      API 키
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      생성일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {apiKeys.map((apiKey) => (
                    <tr key={apiKey.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {apiKey.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {apiKey.key}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {apiKey.created}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          apiKey.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {apiKey.status === 'active' ? '활성' : '비활성'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => toggleApiKeyStatus(apiKey.id)}
                          className={`px-2 py-1 text-xs rounded ${
                            apiKey.status === 'active'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {apiKey.status === 'active' ? '비활성화' : '활성화'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 외부 연동 설정 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">외부 연동 설정</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Excel 파일 처리 엔진
            </label>
            <select
              value={settings.integration.excelEngine}
              onChange={(e) => handleInputChange('integration', 'excelEngine', e.target.value)}
              className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ExcelJS">ExcelJS (Node.js)</option>
              <option value="Pandas">Pandas (Python)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Excel 파일 처리에 사용할 엔진</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">외부 알림 서비스 연동</label>
              <p className="text-xs text-gray-500">이메일, SMS 등 외부 알림 서비스</p>
            </div>
            <button
              onClick={() => handleToggle('integration', 'notificationService')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.integration.notificationService ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.integration.notificationService ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">백업 서비스 연동</label>
              <p className="text-xs text-gray-500">자동 데이터 백업 서비스</p>
            </div>
            <button
              onClick={() => handleToggle('integration', 'backupService')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.integration.backupService ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.integration.backupService ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">모니터링 도구 연동</label>
              <p className="text-xs text-gray-500">시스템 성능 모니터링 도구</p>
            </div>
            <button
              onClick={() => handleToggle('integration', 'monitoringTool')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.integration.monitoringTool ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.integration.monitoringTool ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 성능 및 캐싱 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">성능 및 캐싱</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                캐시 만료 시간 (초)
              </label>
              <input
                type="number"
                value={settings.performance.cacheExpiry}
                onChange={(e) => handleInputChange('performance', 'cacheExpiry', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="60"
                max="3600"
              />
              <p className="text-xs text-gray-500 mt-1">기본값: 300초 (5분)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                데이터베이스 연결 풀
              </label>
              <input
                type="number"
                value={settings.performance.dbConnectionPool}
                onChange={(e) => handleInputChange('performance', 'dbConnectionPool', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="5"
                max="50"
              />
              <p className="text-xs text-gray-500 mt-1">기본값: 10개</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                파일 업로드 크기 제한 (MB)
              </label>
              <input
                type="number"
                value={settings.performance.fileUploadLimit}
                onChange={(e) => handleInputChange('performance', 'fileUploadLimit', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="100"
              />
              <p className="text-xs text-gray-500 mt-1">기본값: 10MB</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <label className="text-sm font-medium text-gray-700">API 응답 캐싱</label>
              <p className="text-xs text-gray-500">API 응답 결과 캐싱으로 성능 향상</p>
            </div>
            <button
              onClick={() => handleToggle('performance', 'apiCaching')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.performance.apiCaching ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.performance.apiCaching ? 'translate-x-6' : 'translate-x-1'
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

export default ApiSettings; 