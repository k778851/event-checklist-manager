import React, { useState } from 'react';
import { MdEvent, MdChecklist, MdUpdate, MdTrendingUp, MdLock, MdLockOpen, MdSchedule, MdCheckCircle, MdExpandMore, MdExpandLess, MdAssignment, MdToday, MdTimeline } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import sampleEvents from '../sampleEvents';

const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center">
      <div className={`p-2 rounded-lg ${color}`}>
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
  const handleChecklist = (tab) => {
    navigate(`/checklist/pre-event/${event.id}?tab=${tab}`);
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
          event.status === '진행중' ? 'bg-primary-50 text-primary-600' :
          event.status === '예정' ? 'bg-warning-50 text-warning-600' :
          'bg-success-50 text-success-600'
        }`}>
          {event.status}
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
          <MdChecklist className="w-4 h-4" />
          사전 체크리스트
        </button>
        <button
          onClick={() => handleChecklist('day')}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-sm"
        >
          <MdChecklist className="w-4 h-4" />
          당일 체크리스트
        </button>
        <button
          onClick={() => handleChecklist('timeline')}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
        >
          <MdTimeline className="w-4 h-4" />
          타임라인
        </button>
      </div>
    </div>
  );
};

const RecentActivity = ({ activity }) => (
  <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <div className="p-2 bg-gray-100 rounded-full">
      {activity.icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-800">{activity.title}</p>
      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
    </div>
  </div>
);

const Dashboard = () => {
  // 월 선택 상태를 가장 먼저 선언
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));

  // 이번 달 시작일과 종료일 계산
  const monthStart = dayjs(selectedMonth + '-01').startOf('month').format('YYYY.MM.DD');
  const monthEnd = dayjs(selectedMonth + '-01').endOf('month').format('YYYY.MM.DD');

  // 샘플 데이터 (모든 date를 monthStart ~ monthEnd로)
  const events = sampleEvents;

  const recentActivities = [
    {
      icon: <MdUpdate className="w-4 h-4 text-gray-600" />,
      title: "체크리스트 항목 업데이트",
      time: "10분 전"
    },
    {
      icon: <MdEvent className="w-4 h-4 text-gray-600" />,
      title: "새로운 행사 등록",
      time: "1시간 전"
    }
  ];

  // 샘플 카드 데이터 (이번 달, 실제 데이터 없을 때만)
  const sampleOngoing = [
    {
      title: '샘플 행사',
      category: '총회',
      status: '진행중',
      progress: 60
    }
  ];
  const sampleScheduled = [
    {
      title: '샘플 예정 행사',
      category: '지역',
      status: '예정',
      progress: 0
    }
  ];
  const sampleCompleted = [
    {
      title: '샘플 완료 행사',
      category: '지파',
      status: '완료',
      progress: 100
    }
  ];

  // 월 이동 함수
  const handlePrevMonth = () => {
    setSelectedMonth(dayjs(selectedMonth + '-01').subtract(1, 'month').format('YYYY-MM'));
  };
  const handleNextMonth = () => {
    setSelectedMonth(dayjs(selectedMonth + '-01').add(1, 'month').format('YYYY-MM'));
  };

  // 행사 월별 필터링 함수
  const filterByMonth = (event) => {
    if (!event.date) return false;
    const [start, end] = event.date.split(' - ');
    const startMonth = dayjs(start.replace(/\./g, '-')).format('YYYY-MM');
    const endMonth = dayjs(end.replace(/\./g, '-')).format('YYYY-MM');
    return selectedMonth >= startMonth && selectedMonth <= endMonth;
  };

  // 월별 행사 리스트
  const filteredEvents = events.filter(filterByMonth);
  const ongoingEvents = filteredEvents.filter(event => event.status === "진행중");
  const scheduledEvents = filteredEvents.filter(event => event.status === "예정");
  const completedEvents = filteredEvents.filter(event => event.status === "완료");

  // isCurrentMonth: 이번 달인지 여부
  const isCurrentMonth = selectedMonth === dayjs().format('YYYY-MM');

  // 통계 계산
  const stats = [
    {
      icon: <MdEvent className="w-6 h-6 text-primary-600" />,
      title: "진행중인 행사",
      value: ongoingEvents.length,
      color: "bg-primary-50"
    },
    {
      icon: <MdSchedule className="w-6 h-6 text-warning-600" />,
      title: "예정중인 행사",
      value: scheduledEvents.length,
      color: "bg-warning-50"
    },
    {
      icon: <MdCheckCircle className="w-6 h-6 text-success-600" />,
      title: "완료된  행사",
      value: completedEvents.length,
      color: "bg-success-50"
    }
  ];

  // 아코디언 상태 관리
  const [openOngoing, setOpenOngoing] = useState(true);
  const [openScheduled, setOpenScheduled] = useState(false);
  const [openCompleted, setOpenCompleted] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">대시보드</h1>
      
      {/* 월 선택 화살표 네비게이션 */}
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
        <button
          className="p-2 rounded-full hover:bg-gray-100 text-xl"
          onClick={handleNextMonth}
          aria-label="다음 달"
        >
          ▶
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* 상태별 행사 + 최근 활동 2단 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 상태별 행사 아코디언 (좌측 3/4) */}
        <div className="lg:col-span-3 space-y-6">
          {/* 진행중인 행사 아코디언 */}
          <div>
            <button
              className="w-full flex items-center justify-between text-xl font-bold text-gray-900 mb-2 px-2 py-3 rounded hover:bg-gray-50 transition"
              onClick={() => setOpenOngoing((prev) => !prev)}
              aria-expanded={openOngoing}
            >
              <span className="flex items-center gap-2">
                <MdEvent className="w-5 h-5 text-primary-600" />
                진행중인 행사 ({ongoingEvents.length})
              </span>
              {openOngoing ? <MdExpandLess /> : <MdExpandMore />}
            </button>
            {openOngoing && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 mb-4 animate-fadein">
                {ongoingEvents.map((event, index) => (
                  <EventCard key={index} event={event} />
                ))}
                {ongoingEvents.length === 0 && isCurrentMonth && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    진행중인 행사가 없습니다.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 예정행사 아코디언 */}
          <div>
            <button
              className="w-full flex items-center justify-between text-xl font-bold text-gray-900 mb-2 px-2 py-3 rounded hover:bg-gray-50 transition"
              onClick={() => setOpenScheduled((prev) => !prev)}
              aria-expanded={openScheduled}
            >
              <span className="flex items-center gap-2">
                <MdSchedule className="w-5 h-5 text-warning-600" />
                예정중인 행사 ({scheduledEvents.length})
              </span>
              {openScheduled ? <MdExpandLess /> : <MdExpandMore />}
            </button>
            {openScheduled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 mb-4 animate-fadein">
                {scheduledEvents.map((event, index) => (
                  <EventCard key={index} event={event} />
                ))}
                {scheduledEvents.length === 0 && isCurrentMonth && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    예정된 행사가 없습니다.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 완료행사 아코디언 */}
          <div>
            <button
              className="w-full flex items-center justify-between text-xl font-bold text-gray-900 mb-2 px-2 py-3 rounded hover:bg-gray-50 transition"
              onClick={() => setOpenCompleted((prev) => !prev)}
              aria-expanded={openCompleted}
            >
              <span className="flex items-center gap-2">
                <MdCheckCircle className="w-5 h-5 text-success-600" />
                완료된 행사 ({completedEvents.length})
              </span>
              {openCompleted ? <MdExpandLess /> : <MdExpandMore />}
            </button>
            {openCompleted && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 mb-4 animate-fadein">
                {completedEvents.map((event, index) => (
                  <EventCard key={index} event={event} />
                ))}
                {completedEvents.length === 0 && isCurrentMonth && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    완료된 행사가 없습니다.
                  </div>
                )}
              </div>
            )}
          </div>
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
  );
};

export default Dashboard; 