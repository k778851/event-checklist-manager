import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { MdAdd, MdUpload, MdDownload } from 'react-icons/md';
import ChecklistView from './ChecklistView';
import TimelineView from '../timeline/TimelineView';

const ChecklistTabs = (props) => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const tabFromQuery = searchParams.get('tab');
  // 샘플 행사 데이터 (Dashboard.js와 동일하게)
  const events = [
    { id: 1, title: "2024 신년 행사" },
    { id: 2, title: "봄 시즌 프로모션" },
    { id: 3, title: "청년부 수련회" },
    { id: 4, title: "찬양팀 워크샵" },
    { id: 5, title: "2023 성탄절 행사" },
    { id: 6, title: "가을 수확감사절" }
  ];
  // event prop이 있으면 그걸 사용, 없으면 id로 샘플 데이터에서 찾음
  const event = props.event || events.find(e => String(e.id) === String(id));
  
  // 뒤로가기 핸들러 - props로 받은 onBack이 있으면 사용, 없으면 대시보드로 이동
  const handleBack = () => {
    if (props.onBack) {
      props.onBack();
    } else {
      window.history.back();
    }
  };

  const [activeTab, setActiveTab] = useState(tabFromQuery || props.activeTab || 'pre'); // 'pre', 'day', 'timeline'
  const [showManualAddModal, setShowManualAddModal] = useState(false);

  // Excel 업로드 핸들러
  const handleExcelUpload = (event) => {
    // Excel 업로드 로직은 ChecklistView에서 처리되므로 여기서는 모달만 열기
    console.log('Excel 업로드 요청');
  };

  // Excel 다운로드 핸들러
  const handleExcelDownload = (includeStatus = true) => {
    // Excel 다운로드 로직은 ChecklistView에서 처리되므로 여기서는 모달만 열기
    console.log('Excel 다운로드 요청:', includeStatus);
  };

  // 각 탭별 체크리스트 상태를 독립적으로 관리
  const [preChecklist, setPreChecklist] = useState([
    // 기본 사전 준비 항목 (샘플 데이터)
    {
      id: 1,
      name: "사전 준비",
      items: [
        {
          id: 1,
          title: "행사장 예약",
          type: "사전",
          status: "완료",
          assignee: "본부 기획부 김기획",
          region: "본부",
          department: "기획부",
          assigneeName: "김기획",
          note: "대강당 예약 완료",
          checkDate: "2024-01-10",
          subItems: [
            { id: 11, title: "대강당 예약", status: "완료", assignee: "본부 기획부 김기획" },
            { id: 12, title: "음향시설 확인", status: "진행중", assignee: "본부 기획부 김기획" }
          ]
        },
        {
          id: 2,
          title: "홍보물 제작",
          type: "사전",
          status: "진행중",
          assignee: "북구 홍보부 이홍보",
          region: "북구",
          department: "홍보부",
          assigneeName: "이홍보",
          note: "포스터 디자인 진행중",
          checkDate: null,
          subItems: [
            { id: 21, title: "포스터 디자인", status: "진행중", assignee: "북구 홍보부 이홍보" },
            { id: 22, title: "전단지 제작", status: "미진행", assignee: "북구 홍보부 이홍보" }
          ]
        }
      ]
    }
  ]);
  
  const [dayChecklist, setDayChecklist] = useState([
    // 기본 당일 준비 항목 (샘플 데이터)
    {
      id: 2,
      name: "당일 준비",
      items: [
        {
          id: 3,
          title: "행사장 세팅",
          type: "당일",
          status: "미진행",
          assignee: "광산 기획부 박기획",
          region: "광산",
          department: "기획부",
          assigneeName: "박기획",
          note: "당일 오전 8시 시작",
          time: "08:00",
          checkDate: null,
          subItems: [
            { id: 31, title: "의자 배치", status: "미진행", assignee: "광산 기획부 박기획" },
            { id: 32, title: "음향 테스트", status: "미진행", assignee: "광산 기획부 박기획" }
          ]
        }
      ]
    }
  ]);

  // dayChecklist를 타임라인 데이터로 변환
  const timelineData = useMemo(() =>
    dayChecklist.map((item, idx) => ({
      id: item.id || idx,
      time: item.time || '',
      department: item.assignee || '',
      title: item.title,
      content: item.note || '',
      status: item.status,
      assignee: item.assignee || '',
      checked: item.status === '완료',
      checkedAt: null // 필요시 확장
    })),
    [dayChecklist]
  );

  return (
    <div>
      {/* 타이틀(상단 헤더) */}
      <div className="p-6">
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-gray-700 text-sm font-medium mb-4"
          >
            ← 대시보드로 돌아가기
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              {event ? event.title : '행사 정보 없음'} 
            </h1>
            
            {/* 관리 버튼들을 행사 타이틀 옆에 배치 */}
            <div className="flex gap-3">
              {/* Excel 업로드 버튼 - 연한 주황색 */}
              <label className="cursor-pointer bg-orange-200 text-orange-800 px-4 py-2 rounded-lg hover:bg-orange-300 transition-colors flex items-center gap-2 shadow-sm">
                <MdUpload className="w-4 h-4" />
                Excel 업로드
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleExcelUpload}
                  className="hidden"
                />
              </label>
              
              {/* 상태 포함 다운로드 버튼 - 연한 초록색 */}
              <button
                onClick={() => handleExcelDownload(true)}
                className="bg-green-200 text-green-800 px-4 py-2 rounded-lg hover:bg-green-300 transition-colors flex items-center gap-2 shadow-sm"
              >
                <MdDownload className="w-4 h-4" />
                상태 포함 다운로드
              </button>
              
              {/* 템플릿 다운로드 버튼 - 연한 보라색 */}
              <button
                onClick={() => handleExcelDownload(false)}
                className="bg-purple-200 text-purple-800 px-4 py-2 rounded-lg hover:bg-purple-300 transition-colors flex items-center gap-2 shadow-sm"
              >
                <MdDownload className="w-4 h-4" />
                템플릿 다운로드
              </button>
              
              {/* 수동 추가 버튼 - 연한 파란색, 제일 오른쪽 */}
              <button
                onClick={() => setShowManualAddModal(true)}
                className="px-4 py-2 bg-blue-200 text-blue-800 rounded-lg hover:bg-blue-300 transition-colors flex items-center gap-2 shadow-sm"
              >
                <MdAdd className="w-4 h-4" />
                수동 추가
              </button>
            </div>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex gap-2 border-b">
          <button
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === 'pre' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
            onClick={() => setActiveTab('pre')}
          >
            사전 체크리스트
          </button>
          <button
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === 'day' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
            onClick={() => setActiveTab('day')}
          >
            당일 체크리스트
          </button>
          <button
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === 'timeline' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
            onClick={() => setActiveTab('timeline')}
          >
            타임라인
          </button>
        </div>
      </div>
      

      {/* 탭 내용에 여백 추가 */}
      <div className="mb-8">
        {activeTab === 'pre' && (
          <ChecklistView
            event={event}
            hideHeader={true}
            categoryFilter="사전 준비"
            showManualAddModal={showManualAddModal}
            setShowManualAddModal={setShowManualAddModal}
            checklistData={preChecklist}
            setChecklistData={setPreChecklist}
            onChecklistChange={(newData) => setPreChecklist(newData)}
          />
        )}
        {activeTab === 'day' && (
          <ChecklistView
            event={event}
            hideHeader={true}
            categoryFilter="당일 준비"
            checklistData={dayChecklist}
            setChecklistData={setDayChecklist}
            onChecklistChange={(newData) => setDayChecklist(newData)}
            showManualAddModal={showManualAddModal}
            setShowManualAddModal={setShowManualAddModal}
          />
        )}
        {activeTab === 'timeline' && (
          <TimelineView
            event={event}
            dayChecklist={dayChecklist}
            setDayChecklist={setDayChecklist}
            timelineData={timelineData}
            hideHeader={true}
          />
        )}
      </div>
    </div>
  );
};

export default ChecklistTabs; 