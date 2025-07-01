import React, { useState } from 'react';
import { MdAdd, MdFilterList, MdSearch, MdEdit } from 'react-icons/md';
import EventCreateModal from '../components/events/EventCreateModal';
import EventEditModal from '../components/events/EventEditModal';
import { useNavigate } from 'react-router-dom';

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

  // 실제 상태로 관리되는 행사 데이터
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "2024 신년 행사",
      category: "총회",
      status: "진행중",
      date: "2024-01-15", // 내부적으로만 저장
      departments: ["기획부", "홍보부", "전도부"],
      progress: 75,
      totalTasks: 48,
      completedTasks: 36
    },
    {
      id: 2,
      title: "봄 시즌 프로모션",
      category: "지역",
      status: "예정",
      date: "2024-03-01", // 내부적으로만 저장
      departments: ["홍보부", "문화부"],
      progress: 30,
      totalTasks: 24,
      completedTasks: 8
    },
    {
      id: 3,
      title: "청년부 수련회",
      category: "지파",
      status: "완료",
      date: "2024-02-01", // 내부적으로만 저장
      departments: ["기획부", "청년회"],
      progress: 100,
      totalTasks: 36,
      completedTasks: 36
    }
  ]);

  // 진행중인 행사 갯수 계산
  const ongoingEventsCount = events.filter(event => event.status === "진행중").length;

  // 검색 및 필터링된 행사 목록
  const filteredEvents = events.filter(event => {
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
    const newEvent = {
      id: Date.now(), // 임시 ID 생성
      ...eventData,
      status: "진행중", // 기본 상태를 '진행중'으로 설정
      progress: 0,
      totalTasks: 0,
      completedTasks: 0
    };
    
    setEvents(prevEvents => [...prevEvents, newEvent]);
    setIsCreateModalOpen(false);
    console.log('새 행사 생성:', newEvent);
  };

  const handleEditEvent = (eventData) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, ...eventData }
          : event
      )
    );
    
    setIsEditModalOpen(false);
    setSelectedEvent(null);
    console.log('행사 수정:', eventData);
  };

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  return (
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
                    onClick={() => navigate(`/checklist/${event.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    체크리스트
                  </button>
                  <button
                    onClick={() => navigate(`/timeline/${event.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
                  >
                    당일 체크리스트
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
                      onClick={() => navigate(`/checklist/${event.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      체크리스트
                    </button>
                    <button
                      onClick={() => navigate(`/timeline/${event.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
                    >
                      당일 체크리스트
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
                      onClick={() => navigate(`/checklist/${event.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      체크리스트
                    </button>
                    <button
                      onClick={() => navigate(`/timeline/${event.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
                    >
                      당일 체크리스트
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
    </div>
  );
};

export default EventManagement; 