import React, { useState } from 'react';
import { MdAdd, MdFilterList, MdSearch, MdEdit } from 'react-icons/md';
import EventCreateModal from '../components/events/EventCreateModal';
import EventEditModal from '../components/events/EventEditModal';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';
import dayjs from 'dayjs';

// 고정된 부서 목록
const DEPARTMENTS = [
  '총무부', '행정서무부', '자문회', '장년회', '부녀회', '청년회',
  '본부지역', '광산지역', '북구지역', '담양지역', '장성지역', '학생회', '유년회',
  '국제부', '기획부', '재정부', '교육부', '신학부', '해외선교부',
  '전도부', '문화부', '출판부', '정보통신부', '찬양부', '섭외부',
  '국내선교부', '홍보부', '법무부', '건설부', '체육부', '사업부',
  '보건후생복지부', '봉사교통부'
];

const EventManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, ongoing, upcoming, completed
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  // 월 선택 상태
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));
  const [currentYear, setCurrentYear] = useState(dayjs().year());
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);

  // EventContext에서 행사 데이터 가져오기
  const { events, addEvent, updateEvent, getEventsByMonth } = useEvents();

  // 월 이동 함수
  const handlePrevMonth = () => {
    setSelectedMonth(dayjs(selectedMonth + '-01').subtract(1, 'month').format('YYYY-MM'));
  };
  
  const handleNextMonth = () => {
    setSelectedMonth(dayjs(selectedMonth + '-01').add(1, 'month').format('YYYY-MM'));
  };

  // 진행중인 행사 갯수 계산 (선택된 월 기준)
  const monthEvents = getEventsByMonth(selectedMonth);
  const ongoingEventsCount = monthEvents.filter(event => event.status === "진행중").length;

  // 검색 및 필터링된 행사 목록 (선택된 월 기준)
  const filteredEvents = monthEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
      (filterType === 'ongoing' && event.status === '진행중') ||
      (filterType === 'upcoming' && event.status === '예정') ||
      (filterType === 'completed' && event.status === '완료');
    
    return matchesSearch && matchesFilter;
  });

  // 분류별 행사 리스트
  const ongoingEvents = filteredEvents.filter(event => event.status === '진행중');
  const scheduledEvents = filteredEvents.filter(event => event.status === '예정');
  const completedEvents = filteredEvents.filter(event => event.status === '완료');

  const handleCreateEvent = (eventData) => {
    addEvent(eventData);
    setIsCreateModalOpen(false);
    console.log('새 행사 생성:', eventData);
  };

  const handleEditEvent = (eventData) => {
    updateEvent(selectedEvent.id, eventData);
    setIsEditModalOpen(false);
    setSelectedEvent(null);
    console.log('행사 수정:', eventData);
  };

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">행사 관리</h1>
          <p className="text-gray-600 mt-1">진행중인 행사: {ongoingEventsCount}개</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors"
        >
          <MdAdd className="w-5 h-5" />
          새 행사 등록
        </button>
      </div>

      {/* 월 선택 네비게이션 */}
      <div className="mb-4 flex items-center gap-4">
        <button
          className="p-2 rounded-full hover:bg-gray-100 text-xl"
          onClick={handlePrevMonth}
          aria-label="이전 달"
        >
          ◀
        </button>
        
        <span className="font-semibold text-lg text-gray-800 min-w-[120px] text-center">
          {dayjs(selectedMonth + '-01').format('YYYY년 MM월')}
        </span>
        
        {/* 달력 선택 버튼 */}
        <button
          className="px-3 py-1 rounded border bg-white text-primary-600 border-primary-600 hover:bg-primary-50 transition-colors"
          onClick={() => setShowCalendarPicker(true)}
          title="달력에서 월 선택"
        >
          📅
        </button>
        
        <button
          className="p-2 rounded-full hover:bg-gray-100 text-xl"
          onClick={handleNextMonth}
          aria-label="다음 달"
        >
          ▶
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="행사명 검색"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <div className="relative">
          <select
            className="appearance-none bg-white pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">전체 행사</option>
            <option value="ongoing">진행중</option>
            <option value="upcoming">예정</option>
            <option value="completed">완료</option>
          </select>
          <MdFilterList className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* 행사 목록 - 대시보드 스타일 분류 */}
      <div className="space-y-10">
        {/* 진행중인 행사 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            진행중인 행사 ({ongoingEvents.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ongoingEvents.map(event => (
              <div key={event.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800">{event.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.category === '총회' ? 'bg-red-100 text-red-600' :
                      event.category === '지파' ? 'bg-sky-100 text-sky-600' :
                      event.category === '지역' ? 'bg-amber-100 text-amber-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {event.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(event)}
                      className={`p-1.5 rounded-full transition-colors ${
                        event.status === '완료' 
                          ? 'text-gray-400 hover:bg-gray-100' 
                          : 'text-primary-600 hover:bg-primary-50'
                      }`}
                      title={event.status === '완료' ? '완료된 행사입니다' : '행사 정보 수정'}
                    >
                      <MdEdit className="w-5 h-5" />
                    </button>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.status === '진행중' ? 'bg-primary-50 text-primary-600' :
                      event.status === '예정' ? 'bg-warning-50 text-warning-600' :
                      'bg-success-50 text-success-600'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {event.departments.map((dept, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {dept}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">진행률</span>
                        <span className="text-gray-800 font-medium">{event.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full" 
                          style={{ width: `${event.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 whitespace-nowrap">
                      {event.completedTasks}/{event.totalTasks} 완료
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => navigate(`/checklist/pre-event/${event.id}?tab=pre`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    사전 체크리스트
                  </button>
                  <button
                    onClick={() => navigate(`/checklist/pre-event/${event.id}?tab=day`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-sm"
                  >
                    당일 체크리스트
                  </button>
                  <button
                    onClick={() => navigate(`/timeline/${event.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
                  >
                    타임라인
                  </button>
                </div>
              </div>
            ))}
            {ongoingEvents.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                진행중인 행사가 없습니다.
              </div>
            )}
          </div>
        </div>
        {/* 예정중인 행사 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            예정중인 행사 ({scheduledEvents.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {scheduledEvents.map(event => (
              <div key={event.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800">{event.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.category === '총회' ? 'bg-red-100 text-red-600' :
                      event.category === '지파' ? 'bg-sky-100 text-sky-600' :
                      event.category === '지역' ? 'bg-amber-100 text-amber-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {event.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(event)}
                      className={`p-1.5 rounded-full transition-colors ${
                        event.status === '완료' 
                          ? 'text-gray-400 hover:bg-gray-100'   
                          : 'text-primary-600 hover:bg-primary-50'
                      }`}
                      title={event.status === '완료' ? '완료된 행사입니다' : '행사 정보 수정'}
                    >
                      <MdEdit className="w-5 h-5" />
                    </button>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.status === '진행중' ? 'bg-primary-50 text-primary-600' :
                      event.status === '예정' ? 'bg-warning-50 text-warning-600' :
                      'bg-success-50 text-success-600'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {event.departments.map((dept, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {dept}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">진행률</span>
                        <span className="text-gray-800 font-medium">{event.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full" 
                          style={{ width: `${event.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 whitespace-nowrap">
                      {event.completedTasks}/{event.totalTasks} 완료
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => navigate(`/checklist/pre-event/${event.id}?tab=pre`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      사전 체크리스트
                    </button>
                    <button
                      onClick={() => navigate(`/checklist/pre-event/${event.id}?tab=day`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-sm"
                    >
                      당일 체크리스트
                    </button>
                    <button
                      onClick={() => navigate(`/timeline/${event.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
                    >
                      타임라인
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {scheduledEvents.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                예정중인 행사가 없습니다.
              </div>
            )}
          </div>
        </div>
        {/* 완료된 행사 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            완료된 행사 ({completedEvents.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedEvents.map(event => (
              <div key={event.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800">{event.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.category === '총회' ? 'bg-red-100 text-red-600' :
                      event.category === '지파' ? 'bg-sky-100 text-sky-600' :
                      event.category === '지역' ? 'bg-amber-100 text-amber-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {event.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(event)}
                      className={`p-1.5 rounded-full transition-colors ${
                        event.status === '완료' 
                          ? 'text-gray-400 hover:bg-gray-100' 
                          : 'text-primary-600 hover:bg-primary-50'
                      }`}
                      title={event.status === '완료' ? '완료된 행사입니다' : '행사 정보 수정'}
                    >
                      <MdEdit className="w-5 h-5" />
                    </button>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.status === '진행중' ? 'bg-primary-50 text-primary-600' :
                      event.status === '예정' ? 'bg-warning-50 text-warning-600' :
                      'bg-success-50 text-success-600'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {event.departments.map((dept, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {dept}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">진행률</span>
                        <span className="text-gray-800 font-medium">{event.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full" 
                          style={{ width: `${event.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 whitespace-nowrap">
                      {event.completedTasks}/{event.totalTasks} 완료
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => navigate(`/checklist/pre-event/${event.id}?tab=pre`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      사전 체크리스트
                    </button>
                    <button
                      onClick={() => navigate(`/checklist/pre-event/${event.id}?tab=day`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-sm"
                    >
                      당일 체크리스트
                    </button>
                    <button
                      onClick={() => navigate(`/timeline/${event.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
                    >
                      타임라인
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {completedEvents.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                완료된 행사가 없습니다.x
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 행사 등록 모달 */}
      <EventCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEvent}
      />

      {/* 행사 수정 모달 */}
      {isEditModalOpen && selectedEvent && (
        <EventEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedEvent(null);
          }}
          onSubmit={handleEditEvent}
          event={selectedEvent}
          isCompleted={selectedEvent?.status === '완료'}
        />
      )}

      {/* 달력 선택 모달 */}
      {showCalendarPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">월 선택</h3>
              <button
                onClick={() => setShowCalendarPicker(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {/* 년도 네비게이션 */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={() => setCurrentYear(prev => prev - 1)}
                className="p-2 rounded-full hover:bg-gray-100 text-lg"
                aria-label="이전 년도"
              >
                ◀
              </button>
              <span className="font-semibold text-lg text-gray-800 min-w-[80px] text-center">
                {currentYear}년
              </span>
              <button
                onClick={() => setCurrentYear(prev => prev + 1)}
                className="p-2 rounded-full hover:bg-gray-100 text-lg"
                aria-label="다음 년도"
              >
                ▶
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              {Array.from({ length: 12 }, (_, i) => {
                const month = dayjs().year(currentYear).month(i).format('YYYY-MM');
                const monthName = dayjs().year(currentYear).month(i).format('MM월');
                const isSelected = selectedMonth === month;
                
                return (
                  <button
                    key={month}
                    onClick={() => {
                      setSelectedMonth(month);
                      setShowCalendarPicker(false);
                    }}
                    className={`p-3 rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {monthName}
                  </button>
                );
              })}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowCalendarPicker(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement; 