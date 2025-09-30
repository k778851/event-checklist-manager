import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEvents } from '../../contexts/EventContext';
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
  MdBusiness,
  MdSync,
  MdRefresh
} from 'react-icons/md';
import * as XLSX from 'xlsx';

const TimelineView = ({ 
  event: propEvent, 
  dayChecklist, 
  setDayChecklist, 
  hideHeader = false, 
  timelineData: propTimelineData,
  onTimelineUpdate // 체크리스트 상태 업데이트를 위한 콜백
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { events } = useEvents();
  
  const event = propEvent || events.find(e => String(e.id) === String(id));
  
  // 기본 타임라인 데이터 - 체크리스트에서 생성된 데이터로 대체
  const [timelineData, setTimelineData] = useState(() => {
    // EventContext에서 저장된 타임라인 데이터가 있으면 사용
    return propTimelineData || (event && event.timelineData) || [];
  });

  const [filterStatus, setFilterStatus] = useState('all'); // all, completed, pending
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSynced, setIsSynced] = useState(false);

  // 현재 시간 업데이트 (1분마다)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // EventContext에서 저장된 타임라인 데이터 업데이트
  useEffect(() => {
    console.log('TimelineView: event changed:', event);
    if (event && event.timelineData) {
      console.log('Loading timeline data from EventContext:', event.timelineData);
      setTimelineData(event.timelineData);
      setIsSynced(true);
    } else {
      console.log('No timeline data found in event:', event);
      // 타임라인 데이터가 없으면 빈 배열로 초기화
      setTimelineData([]);
      setIsSynced(false);
    }
  }, [event]);

  // 체크리스트 데이터가 변경될 때 타임라인 동기화
  useEffect(() => {
    if (dayChecklist && dayChecklist.length > 0) {
      syncChecklistToTimeline();
    } else {
      setIsSynced(false);
    }
  }, [dayChecklist]);

  // EventContext에서 타임라인 데이터가 있으면 초기 로딩
  useEffect(() => {
    if (event && event.timelineData && event.timelineData.length > 0) {
      setTimelineData(event.timelineData);
      setIsSynced(true);
    }
  }, [event]);

  // 체크리스트를 타임라인으로 동기화하는 함수
  const syncChecklistToTimeline = () => {
    if (!dayChecklist || !Array.isArray(dayChecklist)) {
      return;
    }

    const newTimelineData = [];
    let timelineId = 1;

    // dayChecklist는 { id, name, items: [...] } 구조
    // items 배열에서 당일 준비 항목들을 추출
    dayChecklist.forEach(category => {
      if (category.name === '당일 준비' && category.items && Array.isArray(category.items)) {
        category.items.forEach(item => {
          // 시간 정보가 있는 항목만 타임라인에 추가
          if (item.time) {
            // 담당자 정보 우선순위: assignee > 조합된 정보 > department
            const assigneeInfo = item.assignee || 
              `${item.region || '본부'} ${item.department || ''} ${item.personInCharge || ''}`.trim() ||
              item.department || '';
            
            newTimelineData.push({
              id: timelineId++,
              time: item.time,
              department: item.department || '',
              title: item.item || item.title, // item.item을 우선 사용
              content: item.details || item.note || '',
              status: item.status,
              assignee: assigneeInfo,
              checked: item.status === '완료',
              checkedAt: item.status === '완료' ? new Date().toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }) : null,
              checklistItemId: item.id, // 체크리스트 항목과 연결
              categoryId: category.id || 2 // 당일 준비 카테고리 ID
            });
          }
        });
      }
    });

    // 시간순으로 정렬
    newTimelineData.sort((a, b) => {
      const [aHours, aMinutes] = a.time.split(':').map(Number);
      const [bHours, bMinutes] = b.time.split(':').map(Number);
      return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes);
    });

    setTimelineData(newTimelineData);
    setIsSynced(true);
  };

  // 타임라인에서 체크리스트 상태 업데이트
  const handleCheckItem = (itemId) => {
    if (!dayChecklist || !Array.isArray(dayChecklist) || !timelineData || !Array.isArray(timelineData)) return;

    // 타임라인 데이터 업데이트
    const updatedTimelineData = timelineData.map(item =>
      item && item.id === itemId
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
    );

    setTimelineData(updatedTimelineData);

    // 체크리스트 상태도 업데이트
    const timelineItem = updatedTimelineData.find(item => item.id === itemId);
    if (timelineItem && timelineItem.originalChecklistId) {
      // 체크리스트 데이터 업데이트
      const updatedDayChecklist = dayChecklist.map(category => ({
        ...category,
        items: (category.items && Array.isArray(category.items)) ? category.items.map(mainItem => {
          if (!mainItem) return mainItem;
          
          // 메인 항목인 경우
          if (mainItem.id === timelineItem.originalChecklistId && !timelineItem.isSubItem) {
            return {
              ...mainItem,
              status: timelineItem.status,
              checked: timelineItem.checked,
              checkDate: timelineItem.checked ? new Date().toISOString().split('T')[0] : null
            };
          }
          // 세부항목인 경우
          else if (mainItem.subItems && Array.isArray(mainItem.subItems)) {
            const updatedSubItems = mainItem.subItems.map(subItem => {
              if (!subItem) return subItem;
              
              if (subItem.id === timelineItem.originalChecklistId && timelineItem.isSubItem) {
                return {
                  ...subItem,
                  status: timelineItem.status,
                  checked: timelineItem.checked,
                  checkDate: timelineItem.checked ? new Date().toISOString().split('T')[0] : null
                };
              }
              return subItem;
            });
            return {
              ...mainItem,
              subItems: updatedSubItems
            };
          }
          return mainItem;
        }) : []
      }));

      // 부모 컴포넌트에 업데이트된 체크리스트 전달
      if (setDayChecklist) {
        setDayChecklist(updatedDayChecklist);
      }
      
      // onTimelineUpdate 콜백 호출 (기존 호환성 유지)
      if (onTimelineUpdate) {
        onTimelineUpdate(timelineItem.categoryId, timelineItem.originalChecklistId, timelineItem.status);
      }
    }
  };

  // 수동 동기화 버튼
  const handleManualSync = () => {
    syncChecklistToTimeline();
  };

  const departments = timelineData && Array.isArray(timelineData) 
    ? [...new Set(timelineData.map(item => item.department))]
    : [];

  const filteredData = timelineData && Array.isArray(timelineData) 
    ? timelineData.filter(item => {
        const matchesStatus = filterStatus === 'all' || 
          (filterStatus === 'completed' && item.checked) ||
          (filterStatus === 'pending' && !item.checked);
        
        const matchesDepartment = filterDepartment === 'all' || item.department === filterDepartment;
        
        return matchesStatus && matchesDepartment;
      })
    : [];

  const isOverdue = (time) => {
    if (!time || typeof time !== 'string') return false;
    
    try {
      const [hours, minutes] = time.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return false;
      
      const itemTime = new Date();
      itemTime.setHours(hours, minutes, 0, 0);
      
      const now = new Date();
      const currentTimeOnly = new Date();
      currentTimeOnly.setHours(now.getHours(), now.getMinutes(), 0, 0);
      
      return itemTime < currentTimeOnly;
    } catch (error) {
      console.error('Error in isOverdue:', error);
      return false;
    }
  };

  const isUpcoming = (time) => {
    if (!time || typeof time !== 'string') return false;
    
    try {
      const [hours, minutes] = time.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return false;
      
      const itemTime = new Date();
      itemTime.setHours(hours, minutes, 0, 0);
      
      const now = new Date();
      const currentTimeOnly = new Date();
      currentTimeOnly.setHours(now.getHours(), now.getMinutes(), 0, 0);
      
      const diffMinutes = (itemTime - currentTimeOnly) / (1000 * 60);
      return diffMinutes > 0 && diffMinutes <= 30; // 30분 이내
    } catch (error) {
      console.error('Error in isUpcoming:', error);
      return false;
    }
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
          
          // 셀 병합 정보를 포함하여 데이터 추출 (헤더 없이 배열로)
          const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
          
          console.log('원본 타임라인 Excel 데이터:', rawData); // 디버깅용

          // 셀 병합 처리: 빈 셀에 이전 행의 값을 채우기
          let currentTime = '';
          let currentDepartment = '';
          let currentTitle = '';
          
          const newTimelineData = [];
          
          rawData.forEach((row, index) => {
            // 첫 번째 행은 헤더이므로 건너뛰기
            if (index === 0) return;
            
            // 시간 컬럼 (0번 인덱스) 처리
            if (row[0] && row[0].toString().trim()) {
              currentTime = row[0].toString().trim();
            }
            
            // 부서 컬럼 (1번 인덱스) 처리
            if (row[1] && row[1].toString().trim()) {
              currentDepartment = row[1].toString().trim();
            }
            
            // 항목 컬럼 (2번 인덱스) 처리
            if (row[2] && row[2].toString().trim()) {
              currentTitle = row[2].toString().trim();
            }
            
            // 내용 컬럼 (3번 인덱스)이 있는 행만 처리 (세부내용)
            if (row[3] && row[3].toString().trim()) {
              // 세부내용에 타이틀 정보를 포함시켜서 계층 구조 표현
              const contentWithTitle = currentTitle ? `[${currentTitle}] ${row[3].toString().trim()}` : row[3].toString().trim();
              
              const newItem = {
                id: Date.now() + index,
                time: currentTime || '00:00',
                department: currentDepartment || '',
                title: (row[2] && row[2].toString().trim()) ? row[2].toString().trim() : '', // 실제 Excel 행에 값이 있을 때만 title 설정
                content: contentWithTitle, // 타이틀 정보 포함한 세부내용
                originalContent: row[3].toString().trim(), // 원본 내용 별도 저장
                status: '미진행',
                assignee: row[4] ? row[4].toString().trim() : '', // 담당자 컬럼 (4번 인덱스)
                checked: false,
                checkedAt: null,
                category: currentTitle // 중분류 정보를 별도로 저장
              };
              
              newTimelineData.push(newItem);
            }
          });

          setTimelineData(newTimelineData);
          alert(`Excel 파일이 성공적으로 업로드되었습니다. ${newTimelineData.length}개 항목이 추가되었습니다.`);
        } catch (error) {
          alert('Excel 파일 처리 중 오류가 발생했습니다.');
          console.error('Excel upload error:', error);
        }
      };
      reader.readAsBinaryString(file);
      
      // 파일 입력 필드 초기화 (중복 업로드 방지)
      event.target.value = '';
    }
  };

  const handleExcelDownload = (includeStatus = true) => {
    if (!timelineData || !Array.isArray(timelineData)) {
      alert('다운로드할 데이터가 없습니다.');
      return;
    }
    
    const data = timelineData.map(item => ({
      '시간': item.time || '',
      '부서': item.department || '',
      '항목': item.title || '',
      '내용': item.content || '',
      '상태': includeStatus ? (item.checked ? '완료' : '미완료') : '',
      '담당자': item.assignee || '',
      '체크시간': item.checkedAt || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '타임라인');
    
    const fileName = `${event ? event.title : '행사'}_타임라인_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const completedCount = timelineData && Array.isArray(timelineData) 
    ? timelineData.filter(item => item.checked).length 
    : 0;
  const totalCount = timelineData && Array.isArray(timelineData) 
    ? timelineData.length 
    : 0;
  const overdueCount = timelineData && Array.isArray(timelineData) 
    ? timelineData.filter(item => !item.checked && isOverdue(item.time)).length 
    : 0;

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* 상단 타이틀/헤더 (hideHeader가 false일 때만) */}
      {!hideHeader && (
        <div className="mb-6 flex items-center gap-4">
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-gray-700 text-sm font-medium">← 대시보드로 돌아가기</button>
          <span className="text-lg font-semibold text-gray-800">{event ? event.title : '행사 정보 없음'}</span>
        </div>
      )}
      {/* 헤더 및 액션 버튼 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">타임라인 관리</h2>
          <p className="text-gray-600">당일 행사 진행 상황을 실시간으로 관리하세요</p>
          {dayChecklist && (
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-sm px-2 py-1 rounded-full ${
                isSynced ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
              }`}>
                {isSynced ? '✓ 체크리스트와 동기화됨' : '⚠ 체크리스트 동기화 필요'}
              </span>
              <span className="text-xs text-gray-500">
                ({(() => {
                  let count = 0;
                  dayChecklist.forEach(category => {
                    if (category.name === '당일 준비' && category.items && Array.isArray(category.items)) {
                      count += category.items.filter(item => item.type === '당일').length;
                    }
                  });
                  return count;
                })()}개 항목)
              </span>
            </div>
          )}
          {!dayChecklist && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm px-2 py-1 rounded-full bg-gray-50 text-gray-600">
                ⚠ 체크리스트 데이터 없음
              </span>
              <span className="text-xs text-gray-500">
                당일 체크리스트 탭에서 데이터를 먼저 로드해주세요
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          {/* 체크리스트 동기화 버튼만 유지 */}
          {dayChecklist && (
            <button
              onClick={handleManualSync}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                isSynced 
                  ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                  : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
              }`}
              title="체크리스트와 타임라인 동기화"
            >
              <MdSync className={`w-4 h-4 ${isSynced ? '' : 'animate-spin'}`} />
              {isSynced ? '동기화됨' : '동기화'}
            </button>
          )}
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
      <div className="bg-white rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">시간대별 체크리스트</h3>
          <p className="text-sm text-gray-500 mt-1">
            {timelineData && timelineData.length > 0 
              ? `${timelineData.length}개 항목이 등록되어 있습니다.`
              : '등록된 타임라인 항목이 없습니다. 당일 체크리스트를 업로드해주세요.'
            }
          </p>
        </div>
        
        {/* 데이터가 없을 때 안내 메시지 */}
        {(!timelineData || timelineData.length === 0) && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdSchedule className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">타임라인 데이터가 없습니다</h4>
            <p className="text-gray-600 mb-4">
              당일 체크리스트에서 시간 정보가 포함된 Excel 파일을 업로드하면<br />
              자동으로 타임라인이 생성됩니다.
            </p>
            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              <p><strong>타임라인 생성 방법:</strong></p>
              <p>1. 당일 체크리스트 탭으로 이동</p>
              <p>2. "당일 템플릿" 다운로드</p>
              <p>3. 시간 컬럼에 시간 정보 입력 (예: 08:00, 09:30)</p>
              <p>4. "Excel 업로드"로 파일 업로드</p>
            </div>
          </div>
        )}
        
        {/* 타임라인 데이터가 있을 때만 시간대별 표시 */}
        {timelineData && timelineData.length > 0 && (
          <div className="divide-y divide-gray-200">
            {[...Array(24)].map((_, hour) => {
            // 2자리수 시간 문자열
            const hourStr = hour.toString().padStart(2, '0') + ':00';
            // 해당 시간대에 해당하는 항목 찾기 (분이 다를 수 있으니 hour만 비교)
            const itemsAtHour = (filteredData && Array.isArray(filteredData))
              ? filteredData
                  .filter(item => {
                    if (!item || !item.time) return false;
                    const [h] = item.time.split(':');
                    return Number(h) === hour;
                  })
                  .sort((a, b) => {
                    // 시간순으로 정렬 (분 단위까지)
                    if (!a.time || !b.time) return 0;
                    const [aHours, aMinutes] = a.time.split(':').map(Number);
                    const [bHours, bMinutes] = b.time.split(':').map(Number);
                    return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes);
                  })
              : [];
            // 현재 시간대 하이라이트
            const now = new Date();
            const isCurrentHour = now.getHours() === hour;
            return (
              <div key={hour}
                className={`transition-colors ${
                  isCurrentHour ? 'border-l-4 border-blue-500 bg-blue-50 shadow-sm' : 
                  itemsAtHour.length > 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-25 hover:bg-gray-50'
                } ${itemsAtHour.length > 0 ? 'p-4' : 'p-2'}`}
              >
                <div className="flex items-start gap-4">
                  {/* 시간 */}
                  <div className="flex-shrink-0 w-20">
                    <div className="flex items-center gap-2">
                      <MdAccessTime className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-800">{hourStr}</span>
                    </div>
                  </div>
                  {/* 내용 */}
                  {itemsAtHour && itemsAtHour.length > 0 ? (
                    <>
                      {/* 내용 - 모든 항목 표시 */}
                      <div className="flex-1 space-y-3">
                        {itemsAtHour.map((item, itemIndex) => (
                          <div key={item.id} className={`${item.isSubItem ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''}`}>
                            <div className="flex items-start gap-3">
                              {/* 개별 체크 버튼 */}
                              <div className="flex-shrink-0 mt-1">
                                <button
                                  onClick={() => handleCheckItem(item.id)}
                                  className="hover:bg-white p-1 rounded transition-colors"
                                >
                                  {getStatusIcon(item.status, item.checked, item.time)}
                                </button>
                              </div>
                              
                              {/* 항목 내용 */}
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  {/* 정확한 시간 표시 (메인 항목만) */}
                                  {!item.isSubItem && (
                                    <span className="text-sm font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                      {item.time}
                                    </span>
                                  )}
                                  
                                  
                                  <h4 className={`${item.isSubItem ? 'text-sm text-gray-700' : 'font-medium text-gray-800'}`}>
                                    {item.title}
                                  </h4>
                                  
                                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status, item.checked, item.time)}`}>
                                    {item.checked ? '완료' : 
                                     isOverdue(item.time) ? '지연' :
                                     isUpcoming(item.time) ? '예정' : '미완료'}
                                  </span>
                                  
                                  {/* 체크리스트 연동 표시 */}
                                  {item.originalChecklistId && (
                                    <span className="px-2 py-1 rounded-full text-xs bg-purple-50 text-purple-600 flex items-center gap-1">
                                      <MdSync className="w-3 h-3" />
                                      체크리스트
                                    </span>
                                  )}
                                </div>
                                
                                {/* 내용 표시 (세부항목은 더 작게) */}
                                {item.content && (
                                  <p className={`text-gray-600 mb-1 ${item.isSubItem ? 'text-xs' : 'text-sm'}`}>
                                    {item.content}
                                  </p>
                                )}
                                
                                {/* 담당자 정보 */}
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  {item.department && (
                                    <div className="flex items-center gap-1">
                                      <MdBusiness className="w-3 h-3" />
                                      <span>{item.department}</span>
                                    </div>
                                  )}
                                  {item.assignee && (
                                    <div className="flex items-center gap-1">
                                      <MdPerson className="w-3 h-3" />
                                      <span>{item.assignee}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 text-gray-400 text-sm">일정 없음</div>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        )}
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