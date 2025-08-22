import React, { useState, useEffect, useMemo } from 'react';
import { MdSearch, MdFilterList, MdChecklist, MdTimeline, MdWarning, MdSchedule, MdAssignment } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';
import dayjs from 'dayjs';

const UserTasks = () => {
  const navigate = useNavigate();
  const { events } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [myTasks, setMyTasks] = useState([]);

  // 사용자 정보 (실제로는 로그인된 사용자 정보를 사용해야 함)
  const currentUser = useMemo(() => ({
    id: 1,
    name: '김사용자',
    department: '기획부',
    role: 'user'
  }), []);

  useEffect(() => {
    // 모든 행사에서 내 담당 항목들 수집
    const tasks = [];
    
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
                eventCategory: event.category,
                categoryName: category.name,
                isUrgent: item.dueDate && dayjs(item.dueDate).diff(dayjs(), 'day') <= 3
              });
            }
          });
        });
      }
    });

    setMyTasks(tasks);
  }, [events, currentUser.department, currentUser.name]);

  // 필터링
  const filteredTasks = myTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.eventTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    
    const matchesType = filterType === 'all' || 
      (filterType === 'pre' && task.categoryName === '사전 준비') ||
      (filterType === 'day' && task.categoryName === '당일 준비');
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // 통계 계산
  const stats = {
    total: myTasks.length,
    completed: myTasks.filter(task => task.status === '완료').length,
    inProgress: myTasks.filter(task => task.status === '진행중').length,
    pending: myTasks.filter(task => task.status === '미진행').length,
    urgent: myTasks.filter(task => task.isUrgent).length
  };

  const handleViewChecklist = (eventId, type) => {
    navigate(`/user/checklist/${eventId}?type=${type}`);
  };

  const handleViewTimeline = (eventId) => {
    navigate(`/user/timeline/${eventId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '완료':
        return 'bg-green-100 text-green-800';
      case '진행중':
        return 'bg-yellow-100 text-yellow-800';
      case '미진행':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (categoryName) => {
    return categoryName === '사전 준비' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-orange-100 text-orange-800';
  };

  return (
    <div className="p-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">내 담당 항목</h1>
          <p className="text-gray-600 mt-1">모든 행사에서 담당하신 체크리스트 항목들을 확인하세요</p>
        </div>
      </div>

      {/* 통계 요약 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">전체 담당 항목 현황</h3>
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">전체 항목</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">완료</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">진행중</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">대기</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
            <div className="text-sm text-gray-600">긴급</div>
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="항목명 또는 행사명 검색"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">전체 상태</option>
          <option value="완료">완료</option>
          <option value="진행중">진행중</option>
          <option value="미진행">미진행</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">전체 유형</option>
          <option value="pre">사전 준비</option>
          <option value="day">당일 준비</option>
        </select>
      </div>

      {/* 긴급 항목 알림 */}
      {stats.urgent > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <MdWarning className="w-5 h-5 text-red-600 mr-3" />
            <div>
              <h3 className="text-sm font-semibold text-red-800">긴급 알림</h3>
              <p className="text-sm text-red-600">
                {stats.urgent}개의 항목이 마감일이 임박했습니다. 확인해주세요.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 행사별 그룹화된 항목들 */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-6">
          {/* 행사별로 그룹화 */}
          {Array.from(new Set(filteredTasks.map(task => task.eventId))).map(eventId => {
            const eventTasks = filteredTasks.filter(task => task.eventId === eventId);
            const event = events.find(e => e.id === eventId);
            
            return (
              <div key={eventId} className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{event?.title}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">{event?.date}</span>
                        <span className="text-sm text-gray-600">•</span>
                        <span className="text-sm text-gray-600">{event?.category}</span>
                        <span className="text-sm text-gray-600">•</span>
                        <span className="text-sm text-gray-600">{eventTasks.length}개 항목</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {eventTasks.map((task, index) => (
                      <div 
                        key={`${task.eventId}-${task.id}-${index}`} 
                        className={`border border-gray-200 rounded-lg p-4 ${
                          task.isUrgent ? 'border-l-4 border-l-red-500 bg-red-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-gray-900">{task.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(task.categoryName)}`}>
                                {task.categoryName}
                              </span>
                              {task.isUrgent && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  긴급
                                </span>
                              )}
                            </div>
                            {task.note && (
                              <p className="text-sm text-gray-600 mb-2">{task.note}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>담당: {task.assignee}</span>
                              {task.dueDate && (
                                <span>마감일: {task.dueDate}</span>
                              )}
                              {task.checkDate && (
                                <span>완료일: {task.checkDate}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleViewChecklist(task.eventId, task.categoryName === '사전 준비' ? 'pre' : 'day')}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                            >
                              체크리스트 보기
                            </button>
                            <button
                              onClick={() => handleViewTimeline(task.eventId)}
                              className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                            >
                              타임라인 보기
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <MdAssignment className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">담당 항목이 없습니다</h3>
          <p className="text-gray-500">
            {searchTerm || filterStatus !== 'all' || filterType !== 'all' 
              ? '검색 조건에 맞는 담당 항목이 없습니다.' 
              : '현재 담당하신 체크리스트 항목이 없습니다.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserTasks; 