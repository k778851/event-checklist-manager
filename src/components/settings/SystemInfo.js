import React, { useState, useEffect } from 'react';
import { 
  MdCheckCircle, 
  MdError, 
  MdWarning, 
  MdStorage,
  MdMemory,
  MdCloudDone,
  MdCloudOff
} from 'react-icons/md';

const SystemInfo = () => {
  const [systemStatus, setSystemStatus] = useState({
    server: 'online',
    database: 'connected',
    diskUsage: 65,
    memoryUsage: 45
  });

  const [versionInfo, setVersionInfo] = useState({
    appVersion: '1.0.0',
    dbSchemaVersion: '1.0.0',
    apiVersion: 'v1.0',
    lastUpdate: '2024-01-15 14:30:00'
  });

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupSchedule: 'daily',
    retentionPeriod: 30,
    manualBackup: false,
    recoveryEnabled: true
  });

  const [backupHistory, setBackupHistory] = useState([
    { id: 1, date: '2024-01-15 02:00:00', size: '2.5GB', status: 'success' },
    { id: 2, date: '2024-01-14 02:00:00', size: '2.3GB', status: 'success' },
    { id: 3, date: '2024-01-13 02:00:00', size: '2.4GB', status: 'success' }
  ]);

  useEffect(() => {
    // 실제 구현에서는 API 호출로 시스템 상태를 가져옴
    const fetchSystemStatus = () => {
      // 시뮬레이션된 데이터
      setSystemStatus({
        server: 'online',
        database: 'connected',
        diskUsage: Math.floor(Math.random() * 30) + 50,
        memoryUsage: Math.floor(Math.random() * 40) + 30
      });
    };

    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 30000); // 30초마다 업데이트

    return () => clearInterval(interval);
  }, []);

  const handleBackupSettingChange = (setting, value) => {
    setBackupSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleManualBackup = () => {
    // TODO: 수동 백업 실행 API 호출
    const newBackup = {
      id: Date.now(),
      date: new Date().toISOString().replace('T', ' ').substr(0, 19),
      size: '2.5GB',
      status: 'pending'
    };
    setBackupHistory([newBackup, ...backupHistory]);
    
    // 시뮬레이션: 3초 후 성공으로 변경
    setTimeout(() => {
      setBackupHistory(prev => 
        prev.map(backup => 
          backup.id === newBackup.id 
            ? { ...backup, status: 'success' }
            : backup
        )
      );
    }, 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
      case 'connected':
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'offline':
      case 'disconnected':
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
      case 'connected':
      case 'success':
        return <MdCheckCircle className="w-5 h-5 text-green-500" />;
      case 'offline':
      case 'disconnected':
      case 'failed':
        return <MdError className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <MdWarning className="w-5 h-5 text-yellow-500" />;
      default:
        return <MdWarning className="w-5 h-5 text-gray-500" />;
    }
  };

  const getUsageColor = (usage) => {
    if (usage < 50) return 'text-green-600';
    if (usage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      {/* 시스템 상태 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">시스템 상태</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">서버 상태</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(systemStatus.server)}`}>
                  {systemStatus.server === 'online' ? '온라인' : '오프라인'}
                </span>
              </div>
              {getStatusIcon(systemStatus.server)}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">데이터베이스</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(systemStatus.database)}`}>
                  {systemStatus.database === 'connected' ? '연결됨' : '연결 끊김'}
                </span>
              </div>
              {getStatusIcon(systemStatus.database)}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <MdStorage className="w-5 h-5 text-gray-500" />
                  <p className="text-sm font-medium text-gray-600">디스크 사용량</p>
                </div>
                <p className={`text-lg font-semibold ${getUsageColor(systemStatus.diskUsage)}`}>
                  {systemStatus.diskUsage}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full ${systemStatus.diskUsage < 50 ? 'bg-green-400' : systemStatus.diskUsage < 80 ? 'bg-yellow-400' : 'bg-red-400'}`}
                    style={{ width: `${systemStatus.diskUsage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <MdMemory className="w-5 h-5 text-gray-500" />
                  <p className="text-sm font-medium text-gray-600">메모리 사용량</p>
                </div>
                <p className={`text-lg font-semibold ${getUsageColor(systemStatus.memoryUsage)}`}>
                  {systemStatus.memoryUsage}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full ${systemStatus.memoryUsage < 50 ? 'bg-green-400' : systemStatus.memoryUsage < 80 ? 'bg-yellow-400' : 'bg-red-400'}`}
                    style={{ width: `${systemStatus.memoryUsage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 버전 정보 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">버전 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">애플리케이션 버전</label>
            <p className="text-lg font-semibold text-gray-900">{versionInfo.appVersion}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">데이터베이스 스키마 버전</label>
            <p className="text-lg font-semibold text-gray-900">{versionInfo.dbSchemaVersion}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">API 버전</label>
            <p className="text-lg font-semibold text-gray-900">{versionInfo.apiVersion}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">최종 업데이트</label>
            <p className="text-lg font-semibold text-gray-900">{versionInfo.lastUpdate}</p>
          </div>
        </div>
      </div>

      {/* 백업 및 복구 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">백업 및 복구</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                자동 백업 스케줄
              </label>
              <select
                value={backupSettings.backupSchedule}
                onChange={(e) => handleBackupSettingChange('backupSchedule', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="hourly">매시간</option>
                <option value="daily">매일</option>
                <option value="weekly">매주</option>
                <option value="monthly">매월</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                백업 파일 보관 기간 (일)
              </label>
              <input
                type="number"
                value={backupSettings.retentionPeriod}
                onChange={(e) => handleBackupSettingChange('retentionPeriod', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="365"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <label className="text-sm font-medium text-gray-700">자동 백업 활성화</label>
              <p className="text-xs text-gray-500">정기적인 자동 백업 실행</p>
            </div>
            <button
              onClick={() => handleBackupSettingChange('autoBackup', !backupSettings.autoBackup)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                backupSettings.autoBackup ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  backupSettings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">복구 기능 활성화</label>
              <p className="text-xs text-gray-500">백업에서 데이터 복구 기능</p>
            </div>
            <button
              onClick={() => handleBackupSettingChange('recoveryEnabled', !backupSettings.recoveryEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                backupSettings.recoveryEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  backupSettings.recoveryEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium text-gray-900">백업 이력</h4>
              <button
                onClick={handleManualBackup}
                disabled={backupSettings.manualBackup}
                className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {backupSettings.manualBackup ? '백업 중...' : '수동 백업'}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      백업 일시
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      크기
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {backupHistory.map((backup) => (
                    <tr key={backup.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {backup.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {backup.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(backup.status)}
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(backup.status)}`}>
                            {backup.status === 'success' ? '성공' : backup.status === 'pending' ? '진행중' : '실패'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemInfo; 