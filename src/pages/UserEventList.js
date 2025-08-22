import React, { useState, useEffect, useMemo } from 'react';
import { MdSearch, MdFilterList, MdChecklist, MdTimeline, MdPerson } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';
import dayjs from 'dayjs';

const UserEventList = () => {
  const navigate = useNavigate();
  const { events } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));
  const [myEvents, setMyEvents] = useState([]);

  // 사용자 정보 (실제로는 로그인된 사용자 정보를 사용해야 함)
  const currentUser = useMemo(() => ({
    id: 1,
    name: '김사용자',
    department: '기획부',
    role: 'user'
  }), []);

  useEffect(() => {
    // 내 담당 항목이 있는 행사들 필터링
    const userEvents = events.filter(event => {
      if (event.categories) {
        return event.categories.some(category =>
          category.items.some(item =>
            item.assignee === currentUser.department || item.assignee === currentUser.name
          )
        );
      }
      return false;
    }).map(event => {
      // 각 행사에서 내 담당 항목 수 계산
      let myTaskCount = 0;
      if (event.categories) {
        event.categories.forEach(category => {
          category.items.forEach(item => {
            if (item.assignee === currentUser.department || item.assignee === currentUser.name) {
              myTaskCount++;
            }
          });
        });
      }
      return { ...event, myTaskCount };
    });

    setMyEvents(userEvents);
  }, [events, currentUser.department, currentUser.name]);

  // 월별 필터링
  const filteredByMonth = myEvents.filter(event => {
    if (selectedMonth === 'all') return true;
    const eventDate = dayjs(event.date);
    const selectedMonthDate = dayjs(selectedMonth);
    return eventDate.format('YYYY-MM') === selectedMonthDate.format('YYYY-MM');
  });

  // 검색 및 상태 필터링
  const filteredEvents = filteredByMonth.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
      (filterType === 'ongoing' && event.status === '진행중') ||
      (filterType === 'upcoming' && event.status === '예정') ||
      (filterType === 'completed' && event.status === '완료');
    
    return matchesSearch && matchesFilter;
  });

  const handleMonthChange = (direction) => {
    if (selectedMonth === 'all') {
      setSelectedMonth(dayjs().format('YYYY-MM'));
    } else {
      const newMonth = dayjs(selectedMonth).add(direction, 'month');
      setSelectedMonth(newMonth.format('YYYY-MM'));
    }
  };

  const handleViewAll = () => {
    setSelectedMonth('all');
  };

  const handleViewCurrent = () => {
    setSelectedMonth(dayjs().format('YYYY-MM'));
  };

  const handleViewChecklist = (eventId, type = 'pre') => {
    navigate(`/user/checklist/${eventId}?type=${type}`);
  };

  const handleViewTimeline = (eventId) => {
    navigate(`/user/timeline/${eventId}`);
  };

  return (
    <div className="p-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">사용자 행사 목록</h1>
          <p className="text-gray-600 mt-1">담당하신 행사의 체크리스트를 확인하고 관리하세요</p>
        </div>
      </div>

      {/* 월 선택 네비게이션 */}
      <div className="mb-6 flex items-center gap-4">
        <button
          className="p-2 rounded-full hover:bg-gray-100 text-xl"
          onClick={() => handleMonthChange(-1)}
          disabled={selectedMonth === 'all'}
        >
          ◀
        </button>
        <span className="font-semibold text-lg text-gray-800 min-w-[120px] text-center">
          {selectedMonth === 'all'
            ? `${dayjs().format('YYYY')}년 전체`
            : dayjs(selectedMonth).format('YYYY년 MM월')}
        </span>
        <button
          className="p-2 rounded-full hover:bg-gray-100 text-xl"
          onClick={() => handleMonthChange(1)}
          disabled={selectedMonth === 'all'}
        >
          ▶
        </button>
        {selectedMonth !== 'all' ? (
          <button
            className="ml-2 px-3 py-1 rounded border bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
            onClick={handleViewAll}
          >
            올해 전체
          </button>
        ) : (
          <button
            className="ml-2 px-3 py-1 rounded border bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
            onClick={handleViewCurrent}
          >
            이번 달
          </button>
        )}
      </div>

      {/* 검색 및 필터 */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="행사명 검색"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">전체 상태</option>
          <option value="ongoing">진행중</option>
          <option value="upcoming">예정</option>
          <option value="completed">완료</option>
        </select>
      </div>

      {/* 행사 카드들 */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              {/* 담당 항목 배지 */}
              {event.myTaskCount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {event.myTaskCount}
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === '진행중' ? 'bg-blue-100 text-blue-800' :
                        event.status === '예정' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {event.status}
                      </span>
                      <span className="text-sm text-gray-600">{event.category}</span>
                    </div>
                    <p className="text-sm text-gray-500">{event.date}</p>
                  </div>
                </div>

                {/* 진행률 */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>진행률</span>
                    <span>{event.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${event.progress || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewChecklist(event.id, 'pre')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <MdChecklist className="w-4 h-4" />
                    사전 체크리스트
                  </button>
                  <button
                    onClick={() => handleViewChecklist(event.id, 'day')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    <MdChecklist className="w-4 h-4" />
                    당일 체크리스트
                  </button>
                  <button
                    onClick={() => handleViewTimeline(event.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <MdTimeline className="w-4 h-4" />
                    타임라인
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MdPerson className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">담당 행사가 없습니다</h3>
          <p className="text-gray-500">
            {selectedMonth === 'all' ? '올해' : dayjs(selectedMonth).format('YYYY년 MM월')}에 담당하신 행사가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserEventList; 