import React, { useState } from 'react';
// CDN 아이콘 사용
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useEvents } from '../contexts/EventContext';
import EventCreateModal from '../components/events/EventCreateModal';

const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center">
      <div className={`p-3 rounded-lg ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <h3 className="ml-3 text-gray-600 text-sm font-medium">{title}</h3>
    </div>
    <div className="mt-4">
      <p className="text-2xl font-semibold text-gray-800">{value}개</p>
    </div>
  </div>
);

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  
  // 날짜 기반으로 행사 상태 계산
  const getEventStatus = () => {
    if (!event.internalDate) return '미정';
    
    const today = dayjs().format('YYYY-MM-DD');
    const eventDate = event.internalDate;
    
    if (eventDate === today) return '진행중';
    if (eventDate > today) return '예정';
    return '완료';
  };
  
  const eventStatus = getEventStatus();
  
  const handleChecklist = (tab) => {
    if (tab === 'timeline') {
      navigate(`/timeline/${event.id}`);
    } else {
      navigate(`/checklist/pre-event/${event.id}?tab=${tab}`);
    }
  };
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-gray-800">{event.title}</h4>
          <span className={`px-2 py-1 rounded-full text-xs ${
            event.category === '총회' ? 'bg-red-100 text-red-600' :
            event.category === '지파' ? 'bg-sky-100 text-sky-600' :
            event.category === '지역' ? 'bg-amber-100 text-amber-600' :
            'bg-green-100 text-green-600'
          }`}>
            {event.category}
          </span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          eventStatus === '진행중' ? 'bg-primary-50 text-primary-600' :
          eventStatus === '예정' ? 'bg-warning-50 text-warning-600' :
          eventStatus === '완료' ? 'bg-success-50 text-success-600' :
          'bg-gray-50 text-gray-600'
        }`}>
          {eventStatus}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div 
          className="bg-primary-500 h-2 rounded-full" 
          style={{ width: `${event.progress}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-gray-500 text-right">{event.progress}% 완료</p>
      <div className="flex gap-2 pt-3">
        <button
          onClick={() => handleChecklist('pre')}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
        >
          <i className="icon-clipboard-document-list text-sm" />
          사전 체크리스트
        </button>
        <button
          onClick={() => handleChecklist('day')}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-sm"
        >
          <i className="icon-clipboard-document-list text-sm" />
          당일 체크리스트
        </button>
        <button
          onClick={() => handleChecklist('timeline')}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
        >
          <i className="icon-clock text-sm" />
          타임라인
        </button>
      </div>
    </div>
  );
};

const RecentActivity = ({ activity }) => (
  <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
      {activity.icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-800">{activity.title}</p>
      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
    </div>
  </div>
);

const Dashboard = () => {
  // EventContext에서 행사 데이터 가져오기
  const { events, getEventsByMonth, getEventsByYear, addEvent } = useEvents();
  
  // 월 선택 상태를 가장 먼저 선언
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));
  const [currentYear, setCurrentYear] = useState(dayjs().year());

  // 이번 달 시작일과 종료일 계산
  const monthStart = dayjs(selectedMonth + '-01').startOf('month').format('YYYY.MM.DD');
  const monthEnd = dayjs(selectedMonth + '-01').endOf('month').format('YYYY.MM.DD');

  const recentActivities = [
    {
      icon: <i className="icon-arrow-path text-base text-gray-600" />,
      title: "체크리스트 항목 업데이트",
      time: "10분 전"
    },
    {
      icon: <i className="icon-calendar-days text-base text-gray-600" />,
      title: "새로운 행사 등록",
      time: "1시간 전"
    }
  ];

  // 월 이동 함수
  const handlePrevMonth = () => {
    setSelectedMonth(dayjs(selectedMonth + '-01').subtract(1, 'month').format('YYYY-MM'));
  };
  const handleNextMonth = () => {
    setSelectedMonth(dayjs(selectedMonth + '-01').add(1, 'month').format('YYYY-MM'));
  };

  // 캘린더 피커 상태
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);

  // 행사 필터링
  let filteredEvents = [];
  if (selectedMonth === 'all') {
    filteredEvents = getEventsByYear(currentYear);
  } else {
    filteredEvents = getEventsByMonth(selectedMonth);
  }
  
  // 필터 상태 관리 (가장 먼저 선언)
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'ongoing', 'scheduled'

  // 상태별 행사 분류 (날짜 기반)
  const today = dayjs().format('YYYY-MM-DD');
  
  const ongoingEvents = filteredEvents.filter(event => {
    // 오늘 날짜에 진행되는 행사
    return event.internalDate === today;
  });
  
  const scheduledEvents = filteredEvents.filter(event => {
    // 오늘 이후에 진행될 행사
    return event.internalDate && event.internalDate > today;
  });
  
  const completedEvents = filteredEvents.filter(event => {
    // 오늘 이전에 완료된 행사
    return event.internalDate && event.internalDate < today;
  });

  // 필터 적용된 행사 목록
  const getFilteredEvents = () => {
    switch (activeFilter) {
      case 'ongoing':
        return ongoingEvents;
      case 'scheduled':
        return scheduledEvents;
      case 'completed':
        return completedEvents;
      default:
        return [...ongoingEvents, ...scheduledEvents, ...completedEvents];
    }
  };

  const displayEvents = getFilteredEvents();

  // isCurrentMonth: 이번 달인지 여부
  const isCurrentMonth = selectedMonth === dayjs().format('YYYY-MM');

  // 통계 계산 (필터 적용 시 해당 상태만 표시)
  const getFilteredStats = () => {
    switch (activeFilter) {
      case 'ongoing':
        return [{
          icon: <i className="icon-calendar text-3xl text-primary-600" />,
          title: "진행중인 행사",
          value: ongoingEvents.length,
          color: "bg-primary-50"
        }];
      case 'scheduled':
        return [{
          icon: <i className="icon-calendar-days text-3xl text-warning-600" />,
          title: "예정중인 행사",
          value: scheduledEvents.length,
          color: "bg-warning-50"
        }];
      case 'completed':
        return [{
          icon: <i className="icon-check text-3xl text-success-600" />,
          title: "완료된 행사",
          value: completedEvents.length,
          color: "bg-success-50"
        }];
      default:
        return [
          {
            icon: <i className="icon-calendar text-3xl text-primary-600" />,
            title: "진행중인 행사",
            value: ongoingEvents.length,
            color: "bg-primary-50"
          },
          {
            icon: <i className="icon-calendar-days text-3xl text-warning-600" />,
            title: "예정된 행사",
            value: scheduledEvents.length,
            color: "bg-warning-50"
          },
          {
            icon: <i className="icon-check text-3xl text-success-600" />,
            title: "완료된 행사",
            value: completedEvents.length,
            color: "bg-success-50"
          }
        ];
    }
  };

  const stats = getFilteredStats();

  // 아코디언 상태 관리
  const [openOngoing, setOpenOngoing] = useState(true);
  const [openScheduled, setOpenScheduled] = useState(true);
  const [openCompleted, setOpenCompleted] = useState(true);

  // 행사 등록 모달 상태
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 행사 생성 핸들러
  const handleCreateEvent = (eventData) => {
    // 새 행사에 기본 체크리스트 데이터 추가 (초기화된 상태)
    const eventWithChecklist = {
      ...eventData,
      checklistData: [
        {
          id: 1,
          name: "사전 준비",
          items: []
        },
        {
          id: 2,
          name: "당일 준비",
          items: []
        }
      ]
    };
    
    // EventContext의 addEvent 함수 사용
    addEvent(eventWithChecklist);
    setIsCreateModalOpen(false);
    console.log('새 행사 생성 (체크리스트 초기화):', eventWithChecklist);
  };

  return (
    <>
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">대시보드</h1>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors"
        >
          <i className="icon-plus text-lg" />
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
          {selectedMonth === 'all'
            ? `${currentYear}년 전체`
            : dayjs(selectedMonth + '-01').format('YYYY년 MM월')}
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

      {/* 필터 버튼 */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeFilter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          전체 행사
        </button>
        <button
          onClick={() => setActiveFilter('ongoing')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeFilter === 'ongoing'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          진행중
        </button>
        <button
          onClick={() => setActiveFilter('scheduled')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeFilter === 'scheduled'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          예정
        </button>
        <button
          onClick={() => setActiveFilter('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeFilter === 'completed'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          완료
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* 필터링된 행사 목록 + 최근 활동 2단 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 필터링된 행사 목록 (좌측 3/4) */}
        <div className="lg:col-span-3 space-y-6">
          {/* 필터 적용 시 단일 섹션으로 표시 */}
          {activeFilter !== 'all' ? (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {activeFilter === 'ongoing' ? '진행중인 행사' : 
                   activeFilter === 'scheduled' ? '예정된 행사' : '완료된 행사'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                  {displayEvents.map((event, index) => (
                    <EventCard key={index} event={event} />
                  ))}
                  {displayEvents.length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      {activeFilter === 'ongoing' ? '진행중인 행사가 없습니다.' : 
                       activeFilter === 'scheduled' ? '예정된 행사가 없습니다.' : '완료된 행사가 없습니다.'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* 전체 보기 시 기존 아코디언 구조 유지 */
            <>
          {/* 오늘 진행되는 행사 아코디언 */}
          <div>
            <button
              className="w-full flex items-center justify-between text-xl font-bold text-gray-900 mb-2 px-2 py-3 rounded hover:bg-gray-50 transition"
              onClick={() => setOpenOngoing((prev) => !prev)}
              aria-expanded={openOngoing}
            >
              <span className="flex items-center gap-2">
                <i className="icon-calendar w-6 h-6 text-primary-600" />
                진행중인 행사 ({ongoingEvents.length})
              </span>
              {openOngoing ? <i className="icon-chevron-up w-6 h-6" /> : <i className="icon-chevron-down w-6 h-6" />}
            </button>
            {openOngoing && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 mb-4 animate-fadein">
                {ongoingEvents.map((event, index) => (
                  <EventCard key={index} event={event} />
                ))}
                {ongoingEvents.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    진행중인 행사가 없습니다.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 예정된 행사 아코디언 */}
          <div>
            <button
              className="w-full flex items-center justify-between text-xl font-bold text-gray-900 mb-2 px-2 py-3 rounded hover:bg-gray-50 transition"
              onClick={() => setOpenScheduled((prev) => !prev)}
              aria-expanded={openScheduled}
            >
              <span className="flex items-center gap-2">
                <i className="icon-calendar-days w-6 h-6 text-warning-600" />
                예정된 행사 ({scheduledEvents.length})
              </span>
              {openScheduled ? <i className="icon-chevron-up w-6 h-6" /> : <i className="icon-chevron-down w-6 h-6" />}
            </button>
            {openScheduled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 mb-4 animate-fadein">
                {scheduledEvents.map((event, index) => (
                  <EventCard key={index} event={event} />
                ))}
                {scheduledEvents.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    예정된 행사가 없습니다.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 완료된 행사 아코디언 */}
          <div>
            <button
              className="w-full flex items-center justify-between text-xl font-bold text-gray-900 mb-2 px-2 py-3 rounded hover:bg-gray-50 transition"
              onClick={() => setOpenCompleted((prev) => !prev)}
              aria-expanded={openCompleted}
            >
              <span className="flex items-center gap-2">
                <i className="icon-check w-6 h-6 text-success-600" />
                완료된 행사 ({completedEvents.length})
              </span>
              {openCompleted ? <i className="icon-chevron-up w-6 h-6" /> : <i className="icon-chevron-down w-6 h-6" />}
            </button>
            {openCompleted && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 mb-4 animate-fadein">
                {completedEvents.map((event, index) => (
                  <EventCard key={index} event={event} />
                ))}
                {completedEvents.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    완료된 행사가 없습니다.
                  </div>
                )}
              </div>
            )}
          </div>
            </>
          )}
        </div>

        {/* 최근 활동 (우측 1/4) */}
        <div className="lg:col-span-1 mt-12 lg:mt-0">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">최근 활동</h2>
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
            {recentActivities.map((activity, index) => (
              <RecentActivity key={index} activity={activity} />
            ))}
          </div>
        </div>
      </div>
    </div>
    
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
    
    {/* 행사 등록 모달 */}
    {isCreateModalOpen && (
      <EventCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEvent}
      />
    )}
  </>
  );
};

export default Dashboard; 