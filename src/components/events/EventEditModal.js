import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';

// 고정된 부서 목록 가져오기
const DEPARTMENTS = [
  '총무부', '행정서무부', '자문회', '장년회', '부녀회', '청년회',
  '본부지역', '광산지역', '북구지역', '담양지역', '장성지역', '학생회', '유년회',
  '국제부', '기획부', '재정부', '교육부', '신학부', '해외선교부',
  '전도부', '문화부', '출판부', '정보통신부', '찬양부', '섭외부',
  '국내선교부', '홍보부', '법무부', '건설부', '체육부', '사업부',
  '보건후생복지부', '봉사교통부'
];

const EventEditModal = ({ isOpen, onClose, onSubmit, event, isCompleted }) => {
  const [eventData, setEventData] = useState({
    title: '',
    category: '총회',
    date: '',
    departments: []
  });

  useEffect(() => {
    if (event) {
      setEventData({
        title: event.title,
        category: event.category,
        date: event.date,
        departments: event.departments
      });
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(eventData);
  };

  const handleDepartmentChange = (dept) => {
    setEventData(prev => ({
      ...prev,
      departments: prev.departments.includes(dept)
        ? prev.departments.filter(d => d !== dept)
        : [...prev.departments, dept]
    }));
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">행사 정보 수정</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MdClose className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 행사명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              행사명
            </label>
            <input
              type="text"
              required
              disabled={isCompleted}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
              value={eventData.title}
              onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          {/* 행사 분류 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              행사 분류
            </label>
            <select
              disabled={isCompleted}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
              value={eventData.category}
              onChange={(e) => setEventData(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="총회">총회</option>
              <option value="지파">지파</option>
              <option value="지역">지역</option>
              <option value="24부서/회">24부서/회</option>
            </select>
          </div>

          {/* 행사 날짜 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              행사 날짜
            </label>
            <input
              type="date"
              required
              disabled={isCompleted}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
              value={eventData.date}
              onChange={(e) => setEventData(prev => ({ ...prev, date: e.target.value }))}
            />
            <p className="text-xs text-gray-500 mt-1">
              행사 카드에는 표시되지 않으며, 내부 관리용으로만 사용됩니다.
            </p>
          </div>

          {/* 참여 부서 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              참여 부서
            </label>
            <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto p-2">
              {DEPARTMENTS.map(dept => (
                <label
                  key={dept}
                  className="flex items-center space-x-2 text-sm"
                >
                  <input
                    type="checkbox"
                    disabled={isCompleted}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:bg-gray-100"
                    checked={eventData.departments.includes(dept)}
                    onChange={() => handleDepartmentChange(dept)}
                  />
                  <span className={isCompleted ? 'text-gray-500' : ''}>{dept}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 버튼 */}
          {!isCompleted && (
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                저장
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EventEditModal; 