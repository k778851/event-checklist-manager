import React, { useState, useEffect, useMemo } from 'react';
import { MdCheckCircle, MdSchedule, MdWarning, MdPerson, MdEvent, MdAssignment } from 'react-icons/md';
import { useEvents } from '../contexts/EventContext';
import dayjs from 'dayjs';

const UserDashboard = () => {
  const { events } = useEvents();
  const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM'));
  const [myTasks, setMyTasks] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);

  // 사용자 정보 (실제로는 로그인된 사용자 정보를 사용해야 함)
  const currentUser = useMemo(() => ({
    id: 1,
    name: '김사용자',
    department: '기획부',
    role: 'user'
  }), []);

  useEffect(() => {
    // 내 담당 항목들 필터링
    const tasks = [];
    const userEvents = [];

    events.forEach(event => {
      if (event.categories) {
        event.categories.forEach(category => {
          category.items.forEach(item => {
            if (item.assignee === currentUser.department || item.assignee === currentUser.name) {
              tasks.push({
                ...item,
                eventId: event.id,
                eventTitle: event.title,
                eventDate: event.date,
                category: category.name
              });
            }
          });
        });
      }

      // 내가 담당하는 행사들
      if (event.assignees && event.assignees.includes(currentUser.department)) {
        userEvents.push(event);
      }
    });

    setMyTasks(tasks);
    setMyEvents(userEvents);
  }, [events, currentUser.department, currentUser.name]);

  // 통계 계산
  const stats = {
    totalTasks: myTasks.length,
    completedTasks: myTasks.filter(task => task.status === '완료').length,
    inProgressTasks: myTasks.filter(task => task.status === '진행중').length,
    pendingTasks: myTasks.filter(task => task.status === '미진행').length,
    urgentTasks: myTasks.filter(task => {
      if (task.status === '미진행' && task.dueDate) {
        const dueDate = dayjs(task.dueDate);
        const now = dayjs();
        return dueDate.diff(now, 'day') <= 3;
      }
      return false;
    }).length
  };

  // 이번 달 행사들
  const currentMonthEvents = myEvents.filter(event => {
    const eventDate = dayjs(event.date);
    const selectedMonth = dayjs(currentMonth);
    return eventDate.format('YYYY-MM') === selectedMonth.format('YYYY-MM');
  });

  const handleMonthChange = (direction) => {
    const newMonth = dayjs(currentMonth).add(direction, 'month');
    setCurrentMonth(newMonth.format('YYYY-MM'));
  };

  return (
    <>
    <div className="p-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          안녕하세요, {currentUser.name}님!
        </h1>
        <p className="text-gray-600">
          오늘도 체크리스트를 확인하고 행사를 준비해보세요.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <MdAssignment className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">전체 항목</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <MdCheckCircle className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">완료</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <MdSchedule className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">진행중</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgressTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gray-100 text-gray-600">
              <MdPerson className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">대기</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <MdWarning className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">긴급</p>
              <p className="text-2xl font-bold text-gray-900">{stats.urgentTasks}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 내 담당 항목 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">내 담당 항목</h2>
            <p className="text-gray-600 text-sm mt-1">최근 업데이트된 항목들</p>
          </div>
          <div className="p-6">
            {myTasks.length > 0 ? (
              <div className="space-y-4">
                {myTasks.slice(0, 5).map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === '완료' ? 'bg-green-100 text-green-800' :
                          task.status === '진행중' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status}
                        </span>
                        <span className="text-xs text-gray-500">{task.category}</span>
                      </div>
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-600">{task.eventTitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{task.eventDate}</p>
                    </div>
                  </div>
                ))}
                {myTasks.length > 5 && (
                  <div className="text-center pt-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      더 보기 ({myTasks.length - 5}개 더)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <MdAssignment className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">담당하신 항목이 없습니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* 이번 달 행사 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">이번 달 행사</h2>
                <p className="text-gray-600 text-sm mt-1">{dayjs(currentMonth).format('YYYY년 MM월')}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleMonthChange(-1)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  ◀
                </button>
                
                {/* 달력 선택 버튼 */}
                <button
                  className="px-3 py-1 rounded border bg-white text-blue-600 border-blue-600 hover:bg-blue-50 transition-colors"
                  onClick={() => setShowCalendarPicker(true)}
                  title="달력에서 월 선택"
                >
                  📅
                </button>
                
                <button
                  onClick={() => handleMonthChange(1)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            {currentMonthEvents.length > 0 ? (
              <div className="space-y-4">
                {currentMonthEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{event.date}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === '진행중' ? 'bg-blue-100 text-blue-800' :
                        event.status === '예정' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MdEvent className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">이번 달 담당 행사가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 긴급 항목 알림 */}
      {stats.urgentTasks > 0 && (
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <MdWarning className="w-6 h-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">긴급 알림</h3>
              <p className="text-red-600">
                {stats.urgentTasks}개의 항목이 마감일이 임박했습니다. 확인해주세요.
              </p>
            </div>
          </div>
        </div>
      )}
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
              const isSelected = currentMonth === month;
              
              return (
                <button
                  key={month}
                  onClick={() => {
                    setCurrentMonth(month);
                    setShowCalendarPicker(false);
                  }}
                  className={`p-3 rounded-lg border transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600'
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
  </>
  );
};

export default UserDashboard; 