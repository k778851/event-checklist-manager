import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdCheckCircle, MdRadioButtonUnchecked, MdSchedule } from 'react-icons/md';
import { useEvents } from '../../contexts/EventContext';

const UserChecklist = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { events } = useEvents();
  
  const type = searchParams.get('type') || 'pre';
  const [myChecklist, setMyChecklist] = useState([]);
  const [event, setEvent] = useState(null);

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
      // 내 담당 항목만 필터링하고, 탭 타입에 따라 카테고리 필터링
      const filteredCategories = currentEvent.categories
        .filter(category => {
          // 탭 타입에 따라 카테고리 필터링
          if (type === 'pre') {
            return category.name === '사전 준비';
          } else if (type === 'day') {
            return category.name === '당일 준비';
          }
          return true; // 기본값은 모든 카테고리
        })
        .map(category => {
          const filteredItems = category.items.filter(item =>
            item.assignee === currentUser.department || item.assignee === currentUser.name
          );
          return {
            ...category,
            items: filteredItems
          };
        }).filter(category => category.items.length > 0);

      setMyChecklist(filteredCategories);
    }
  }, [id, events, currentUser.department, currentUser.name, type]);

  const handleStatusChange = (categoryId, itemId, newStatus) => {
    setMyChecklist(prev => 
      prev.map(category => 
        category.id === categoryId 
          ? {
              ...category,
              items: category.items.map(item =>
                item.id === itemId
                  ? { ...item, status: newStatus, checkDate: newStatus === '완료' ? new Date().toISOString() : null }
                  : item
              )
            }
          : category
      )
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case '완료':
        return <MdCheckCircle className="w-5 h-5 text-green-600" />;
      case '진행중':
        return <MdSchedule className="w-5 h-5 text-yellow-600" />;
      default:
        return <MdRadioButtonUnchecked className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '완료':
        return 'bg-green-100 text-green-800';
      case '진행중':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 통계 계산 - 현재 탭에 표시되는 항목들만 계산
  const stats = {
    total: myChecklist.reduce((sum, category) => sum + category.items.length, 0),
    completed: myChecklist.reduce((sum, category) => 
      sum + category.items.filter(item => item.status === '완료').length, 0
    ),
    inProgress: myChecklist.reduce((sum, category) => 
      sum + category.items.filter(item => item.status === '진행중').length, 0
    ),
    pending: myChecklist.reduce((sum, category) => 
      sum + category.items.filter(item => item.status === '미진행').length, 0
    )
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
            <p className="text-gray-600">
              {type === 'pre' ? '사전 체크리스트' : '당일 체크리스트'}
            </p>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => navigate(`/user/checklist/${id}?type=pre`)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            type === 'pre'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          사전 체크리스트
        </button>
        <button
          onClick={() => navigate(`/user/checklist/${id}?type=day`)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            type === 'day'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          당일 체크리스트
        </button>
        <button
          onClick={() => navigate(`/user/timeline/${id}`)}
          className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          타임라인
        </button>
      </div>

      {/* 통계 요약 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {type === 'pre' ? '사전 준비' : '당일 준비'} 내 담당 항목 현황
        </h3>
        <div className="grid grid-cols-4 gap-4">
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
        </div>
      </div>

      {/* 체크리스트 항목들 */}
      {myChecklist.length > 0 ? (
        <div className="space-y-6">
          {myChecklist.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">{category.name}</h2>
                  <span className="text-sm text-gray-600">{category.items.length}개 항목</span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {category.items.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => handleStatusChange(category.id, item.id, 
                            item.status === '완료' ? '미진행' : '완료'
                          )}
                          className="mt-1"
                        >
                          {getStatusIcon(item.status)}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-900">{item.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </div>
                          {item.note && (
                            <p className="text-sm text-gray-600 mb-2">{item.note}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>담당: {item.assignee}</span>
                            {item.checkDate && (
                              <span>완료일: {new Date(item.checkDate).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusChange(category.id, item.id, '진행중')}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              item.status === '진행중'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-700 hover:bg-yellow-100 hover:text-yellow-800'
                            }`}
                          >
                            진행중
                          </button>
                          <button
                            onClick={() => handleStatusChange(category.id, item.id, '완료')}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              item.status === '완료'
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
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MdCheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">담당 항목이 없습니다</h3>
          <p className="text-gray-500">
            이 행사에서 담당하신 {type === 'pre' ? '사전' : '당일'} 체크리스트 항목이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserChecklist; 