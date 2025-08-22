import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdCheckCircle, MdRadioButtonUnchecked, MdSchedule, MdWarning, MdAccessTime } from 'react-icons/md';
import { useEvents } from '../../contexts/EventContext';
import dayjs from 'dayjs';

const UserTimeline = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events } = useEvents();
  
  const [myTimeline, setMyTimeline] = useState([]);
  const [event, setEvent] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 사용자 정보 (실제로는 로그인된 사용자 정보를 사용해야 함)
  const currentUser = useMemo(() => ({
    id: 1,
    name: '김사용자',
    department: '기획부',
    role: 'user'
  }), []);

  useEffect(() => {
    const currentEvent = events.find(e => String(e.id) === String(id));
    setEvent(currentEvent);

    if (currentEvent && currentEvent.categories) {
      // 당일 준비 카테고리에서 내 담당 항목만 필터링
      const dayCategory = currentEvent.categories.find(cat => cat.name === '당일 준비');
      if (dayCategory) {
        const myItems = dayCategory.items.filter(item =>
          item.assignee === currentUser.department || item.assignee === currentUser.name
        ).map((item, index) => ({
          id: item.id || index,
          time: item.time || '',
          title: item.title,
          description: item.note || '',
          status: item.status || 'pending',
          assignee: item.assignee || '',
          duration: item.duration || '30분',
          checked: item.status === '완료',
          checkedAt: item.checkDate || null
        }));
        setMyTimeline(myItems);
      }
    }
  }, [id, events, currentUser.department, currentUser.name]);

  // 현재 시간 업데이트 (1분마다)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleStatusChange = (itemId, newStatus) => {
    setMyTimeline(prev =>
      prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              status: newStatus,
              checked: newStatus === 'completed',
              checkedAt: newStatus === 'completed' ? new Date().toISOString() : null
            }
          : item
      )
    );
  };

  const isOverdue = (time) => {
    if (!time) return false;
    const [hours, minutes] = time.split(':').map(Number);
    const itemTime = new Date();
    itemTime.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    const currentTimeOnly = new Date();
    currentTimeOnly.setHours(now.getHours(), now.getMinutes(), 0, 0);
    
    return itemTime < currentTimeOnly;
  };

  const isUpcoming = (time) => {
    if (!time) return false;
    const [hours, minutes] = time.split(':').map(Number);
    const itemTime = new Date();
    itemTime.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    const currentTimeOnly = new Date();
    currentTimeOnly.setHours(now.getHours(), now.getMinutes(), 0, 0);
    
    const diffMinutes = (itemTime - currentTimeOnly) / (1000 * 60);
    return diffMinutes > 0 && diffMinutes <= 30; // 30분 이내
  };

  const getStatusIcon = (status, time) => {
    if (status === 'completed') return <MdCheckCircle className="w-5 h-5 text-green-600" />;
    if (isOverdue(time)) return <MdWarning className="w-5 h-5 text-red-600" />;
    if (isUpcoming(time)) return <MdSchedule className="w-5 h-5 text-yellow-600" />;
    return <MdRadioButtonUnchecked className="w-5 h-5 text-gray-400" />;
  };

  const getStatusColor = (status, time) => {
    if (status === 'completed') return 'bg-green-100 text-green-800';
    if (isOverdue(time)) return 'bg-red-100 text-red-800';
    if (isUpcoming(time)) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  // 통계 계산
  const stats = {
    total: myTimeline.length,
    completed: myTimeline.filter(item => item.status === 'completed').length,
    inProgress: myTimeline.filter(item => item.status === 'in-progress').length,
    pending: myTimeline.filter(item => item.status === 'pending').length,
    overdue: myTimeline.filter(item => isOverdue(item.time)).length
  };

  if (!event) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">행사를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/user/events')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700"
          >
            <MdArrowBack className="w-4 h-4" />
            행사 목록으로
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{event.title}</h1>
            <p className="text-gray-600">타임라인</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">현재 시간</div>
          <div className="text-lg font-semibold text-gray-800">
            {currentTime.toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => navigate(`/user/checklist/${id}?type=pre`)}
          className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          사전 체크리스트
        </button>
        <button
          onClick={() => navigate(`/user/checklist/${id}?type=day`)}
          className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          당일 체크리스트
        </button>
        <button
          className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white"
        >
          타임라인
        </button>
      </div>

      {/* 통계 요약 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">내 담당 타임라인 현황</h3>
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
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-gray-600">지연</div>
          </div>
        </div>
      </div>

      {/* 타임라인 목록 */}
      {myTimeline.length > 0 ? (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">타임라인</h2>
            <p className="text-gray-600 text-sm mt-1">시간순으로 정렬된 담당 항목들</p>
          </div>
          <div className="divide-y divide-gray-200">
            {myTimeline.map((item, index) => (
              <div
                key={item.id}
                className={`p-6 ${
                  isOverdue(item.time) ? 'bg-red-50 border-l-4 border-red-500' :
                  isUpcoming(item.time) ? 'bg-yellow-50 border-l-4 border-yellow-500' :
                  'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-20 text-center">
                    <div className="text-lg font-semibold text-gray-800">{item.time}</div>
                    <div className="text-sm text-gray-500">{item.duration}</div>
                  </div>
                  
                  <button
                    onClick={() => handleStatusChange(item.id, 
                      item.status === 'completed' ? 'pending' : 'completed'
                    )}
                    className="mt-1"
                  >
                    {getStatusIcon(item.status, item.time)}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status, item.time)}`}>
                        {item.status === 'completed' ? '완료' :
                         item.status === 'in-progress' ? '진행중' : '대기'}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-gray-600 mb-2">{item.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>담당: {item.assignee}</span>
                      {item.checkedAt && (
                        <span>완료시간: {new Date(item.checkedAt).toLocaleTimeString()}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(item.id, 'in-progress')}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        item.status === 'in-progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-yellow-100 hover:text-yellow-800'
                      }`}
                    >
                      진행중
                    </button>
                    <button
                      onClick={() => handleStatusChange(item.id, 'completed')}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        item.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-800'
                      }`}
                    >
                      완료
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <MdAccessTime className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">담당 타임라인 항목이 없습니다</h3>
          <p className="text-gray-500">
            이 행사에서 담당하신 타임라인 항목이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserTimeline; 