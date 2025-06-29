import React, { useState } from 'react';
import { 
  MdCheckCircle, 
  MdRadioButtonUnchecked,
  MdSchedule,
  MdWarning,
  MdFilterList,
  MdUpload,
  MdDownload,
  MdPerson,
  MdAccessTime,
  MdBusiness
} from 'react-icons/md';
import * as XLSX from 'xlsx';

const TimelineView = ({ event }) => {
  const [timelineData, setTimelineData] = useState([
    {
      id: 1,
      time: "08:00",
      department: "기획부",
      title: "행사장 세팅 시작",
      content: "의자 배치, 음향 테스트",
      status: "완료",
      assignee: "김기획",
      checked: true,
      checkedAt: "08:05"
    },
    {
      id: 2,
      time: "09:00",
      department: "홍보부",
      title: "홍보물 배치",
      content: "포스터, 전단지 배치",
      status: "진행중",
      assignee: "이홍보",
      checked: false,
      checkedAt: null
    },
    {
      id: 3,
      time: "10:00",
      department: "전도부",
      title: "참가자 등록",
      content: "참가자 명단 확인 및 배지 배부",
      status: "미진행",
      assignee: "박전도",
      checked: false,
      checkedAt: null
    },
    {
      id: 4,
      time: "11:00",
      department: "기획부",
      title: "최종 점검",
      content: "전체 준비사항 최종 확인",
      status: "미진행",
      assignee: "김기획",
      checked: false,
      checkedAt: null
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all'); // all, completed, pending
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  // 현재 시간 업데이트 (1분마다)
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const departments = [...new Set(timelineData.map(item => item.department))];

  const filteredData = timelineData.filter(item => {
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'completed' && item.checked) ||
      (filterStatus === 'pending' && !item.checked);
    
    const matchesDepartment = filterDepartment === 'all' || item.department === filterDepartment;
    
    return matchesStatus && matchesDepartment;
  });

  const handleCheckItem = (itemId) => {
    setTimelineData(prevData =>
      prevData.map(item =>
        item.id === itemId
          ? {
              ...item,
              checked: !item.checked,
              checkedAt: !item.checked ? new Date().toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }) : null,
              status: !item.checked ? '완료' : '미진행'
            }
          : item
      )
    );
  };

  const isOverdue = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const itemTime = new Date();
    itemTime.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    const currentTimeOnly = new Date();
    currentTimeOnly.setHours(now.getHours(), now.getMinutes(), 0, 0);
    
    return itemTime < currentTimeOnly;
  };

  const isUpcoming = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const itemTime = new Date();
    itemTime.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    const currentTimeOnly = new Date();
    currentTimeOnly.setHours(now.getHours(), now.getMinutes(), 0, 0);
    
    const diffMinutes = (itemTime - currentTimeOnly) / (1000 * 60);
    return diffMinutes > 0 && diffMinutes <= 30; // 30분 이내
  };

  const getStatusColor = (status, checked, time) => {
    if (checked) return 'bg-green-100 text-green-600';
    if (isOverdue(time)) return 'bg-red-100 text-red-600';
    if (isUpcoming(time)) return 'bg-yellow-100 text-yellow-600';
    return 'bg-gray-100 text-gray-600';
  };

  const getStatusIcon = (status, checked, time) => {
    if (checked) return <MdCheckCircle className="w-5 h-5 text-green-600" />;
    if (isOverdue(time)) return <MdWarning className="w-5 h-5 text-red-600" />;
    if (isUpcoming(time)) return <MdSchedule className="w-5 h-5 text-yellow-600" />;
    return <MdRadioButtonUnchecked className="w-5 h-5 text-gray-400" />;
  };

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);

          const newTimelineData = data.map((row, index) => ({
            id: Date.now() + index,
            time: row['시간'] || '00:00',
            department: row['부서'] || '',
            title: row['항목'] || '',
            content: row['내용'] || '',
            status: '미진행',
            assignee: row['담당자'] || '',
            checked: false,
            checkedAt: null
          }));

          setTimelineData(newTimelineData);
          alert('Excel 파일이 성공적으로 업로드되었습니다.');
        } catch (error) {
          alert('Excel 파일 처리 중 오류가 발생했습니다.');
          console.error('Excel upload error:', error);
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleExcelDownload = (includeStatus = true) => {
    const data = timelineData.map(item => ({
      '시간': item.time,
      '부서': item.department,
      '항목': item.title,
      '내용': item.content,
      '상태': includeStatus ? (item.checked ? '완료' : '미완료') : '',
      '담당자': item.assignee,
      '체크시간': item.checkedAt || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '타임라인');
    
    const fileName = `${event.title}_타임라인_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const completedCount = timelineData.filter(item => item.checked).length;
  const totalCount = timelineData.length;
  const overdueCount = timelineData.filter(item => !item.checked && isOverdue(item.time)).length;

  return (
    <div className="space-y-6">
      {/* 헤더 및 액션 버튼 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">타임라인 관리</h2>
          <p className="text-gray-600">당일 행사 진행 상황을 실시간으로 관리하세요</p>
        </div>
        <div className="flex gap-3">
          <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2">
            <MdUpload className="w-4 h-4" />
            Excel 업로드
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelUpload}
              className="hidden"
            />
          </label>
          <div className="flex gap-1">
            <button
              onClick={() => handleExcelDownload(true)}
              className="bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2"
            >
              <MdDownload className="w-4 h-4" />
              상태 포함 다운로드
            </button>
            <button
              onClick={() => handleExcelDownload(false)}
              className="bg-gray-50 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <MdDownload className="w-4 h-4" />
              템플릿 다운로드
            </button>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">전체 항목</p>
              <p className="text-2xl font-bold text-gray-800">{totalCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MdSchedule className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">완료</p>
              <p className="text-2xl font-bold text-green-600">{completedCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MdCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">미완료</p>
              <p className="text-2xl font-bold text-gray-600">{totalCount - completedCount}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <MdRadioButtonUnchecked className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">지연</p>
              <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <MdWarning className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 필터 */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <MdFilterList className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">필터:</span>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">전체</option>
            <option value="completed">완료</option>
            <option value="pending">미완료</option>
          </select>
          
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">전체 부서</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 타임라인 */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">시간대별 체크리스트</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredData.map(item => (
            <div 
              key={item.id} 
              className={`p-4 transition-colors ${
                item.checked ? 'bg-gray-50' : 
                isOverdue(item.time) ? 'bg-red-50' :
                isUpcoming(item.time) ? 'bg-yellow-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* 시간 */}
                <div className="flex-shrink-0 w-20">
                  <div className="flex items-center gap-2">
                    <MdAccessTime className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-800">{item.time}</span>
                  </div>
                </div>

                {/* 체크 버튼 */}
                <div className="flex-shrink-0">
                  <button
                    onClick={() => handleCheckItem(item.id)}
                    className="flex items-center gap-2 hover:bg-white p-2 rounded-lg transition-colors"
                  >
                    {getStatusIcon(item.status, item.checked, item.time)}
                  </button>
                </div>

                {/* 내용 */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-800">{item.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status, item.checked, item.time)}`}>
                          {item.checked ? '완료' : 
                           isOverdue(item.time) ? '지연' :
                           isUpcoming(item.time) ? '예정' : '미완료'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2">{item.content}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <MdBusiness className="w-3 h-3" />
                          <span>{item.department}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MdPerson className="w-3 h-3" />
                          <span>{item.assignee}</span>
                        </div>
                        {item.checkedAt && (
                          <div className="flex items-center gap-1">
                            <MdCheckCircle className="w-3 h-3" />
                            <span>체크: {item.checkedAt}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 알림 섹션 */}
      {(overdueCount > 0 || timelineData.filter(item => isUpcoming(item.time) && !item.checked).length > 0) && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">알림</h3>
          </div>
          
          <div className="p-4 space-y-3">
            {overdueCount > 0 && (
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <MdWarning className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">지연된 항목이 {overdueCount}개 있습니다</p>
                  <p className="text-red-600 text-sm">즉시 확인하고 처리해주세요</p>
                </div>
              </div>
            )}
            
            {timelineData.filter(item => isUpcoming(item.time) && !item.checked).map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <MdSchedule className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="text-yellow-800 font-medium">{item.time} - {item.title}</p>
                  <p className="text-yellow-600 text-sm">{item.department} | {item.assignee}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineView; 