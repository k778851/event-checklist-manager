import React, { createContext, useContext, useState } from 'react';

const EventContext = createContext();

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  // 실제 상태로 관리되는 행사 데이터
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "9월 28일 총회장님 왕림(예시)",
      category: "총회",
      status: "진행중",
      date: "2025.09.28 - 2025.09.28",
      internalDate: "2025-09-28",
      departments: ["기획부", "문화부", "전도부", "부녀회", "섭외부", "청년회", "보건후생복지부", "찬양부"],
      progress: 75,
      totalTasks: 48,
      completedTasks: 36
    },
    {
      id: 2,
      title: "2025 여름 프로모션",
      category: "지역",
      status: "예정",
      date: "2025.07.01 - 2025.07.01",
      internalDate: "2025-07-01",
      departments: ["홍보부", "문화부"],
      progress: 30,
      totalTasks: 24,
      completedTasks: 8
    },
    {
      id: 3,
      title: "2025 청년부 수련회",
      category: "지파",
      status: "완료",
      date: "2025.07.01 - 2025.07.01",
      internalDate: "2025-07-01",
      departments: ["기획부", "청년회"],
      progress: 100,
      totalTasks: 36,
      completedTasks: 36
    }
  ]);

  // 새로운 체크리스트 템플릿
  const getNewChecklistTemplate = () => [
    {
      id: 1,
      name: "사전 체크리스트",
      items: [
        {
          id: 1,
          index: 1,
          item: "현장배치도",
          details: "부스별 배치도 준비",
          department: "기획부",
          personInCharge: "콘텐츠기획과",
          checked: false
        },
        {
          id: 2,
          index: 2,
          item: "총회장님 단상",
          details: "단상 발판 배치 (규격: 2-4단, 1단), 구즈넥 마이크, 수반, 전자시계, 성경책, 물컵/물수건 배치",
          department: "건설부(발판), 문화부(마이크, 수반, 시계, 성경책, 물품)",
          personInCharge: "총무, 음향과, 미술창조과, 의전과",
          checked: false
        },
        {
          id: 3,
          index: 3,
          item: "총회장님 강대상",
          details: "단상 모니터링 TV (2대), 강대상 발판 배치 (규격: 2단, 1단), 서큘레이터 (2대), 높이 조절용 선풍기, 흑판, 티슈, 물컵/물수건, 거울 배치",
          department: "문화부",
          personInCharge: "영상과, 음향과, 의전과",
          checked: false
        },
        {
          id: 4,
          index: 4,
          item: "총회장님 단상 좌석",
          details: "이름표 부착, 아크릴 식순지 배치, 금색 방석 및 발 방석 배치 및 준비",
          department: "문화부",
          personInCharge: "의전과",
          checked: false
        },
        {
          id: 5,
          index: 5,
          item: "총회장님 사진촬영",
          details: "금색 의자 및 의자 보 준비, 총회장님 위치 마킹",
          department: "문화부",
          personInCharge: "의전과",
          checked: false
        },
        {
          id: 6,
          index: 6,
          item: "내부안내",
          details: "층별 담당자 및 안내자 교육 및 배치",
          department: "전도부",
          personInCharge: "유승호",
          checked: false
        },
        {
          id: 7,
          index: 7,
          item: "외부안내",
          details: "구간 담당자 및 안내자 교육 및 배치",
          department: "전도부",
          personInCharge: "곽현민",
          checked: false
        },
        {
          id: 8,
          index: 8,
          item: "다과, 봉송",
          details: "다과 재료 준비, 다과 세팅, 상차림 세팅, 봉송 물품 및 차량 키트 준비",
          department: "부녀회",
          personInCharge: "봉사부장, 총무",
          checked: false
        },
        {
          id: 9,
          index: 9,
          item: "보안 근무",
          details: "경호대 집결 및 근무 준비, 외부도열 보안 근무 및 총회장님 이동 동선 경호 배치",
          department: "섭외부",
          personInCharge: "서무, 부장",
          checked: false
        },
        {
          id: 10,
          index: 10,
          item: "외부 도열",
          details: "스탭 집결 및 자리배치, 스탭 리허설, 광주 지교회 도열단 집결, 수기/모자 불출 및 리허설, 성전 주변 도열 동문 앞 주차장 이동, 지교회 도열단 환송구간 이동 및 귀소 버스 탑승",
          department: "청년회",
          personInCharge: "문화부장",
          checked: false
        },
        {
          id: 11,
          index: 11,
          item: "동문 퍼포먼스",
          details: "남문 앞 -> 동문 앞 이동, 풍선 불출, 퍼포먼스 리허설, 남문 앞 환송구간 이동",
          department: "청년회",
          personInCharge: "문화부장",
          checked: false
        },
        {
          id: 12,
          index: 12,
          item: "의료",
          details: "의료진 스탭 도착, 의료팀 무전기 수신, 성전 층별 의료진 배치 및 의료 물품 세팅, 지교회 응급 구호차량 배치",
          department: "보건후생복지부",
          personInCharge: "서무",
          checked: false
        },
        {
          id: 13,
          index: 13,
          item: "찬양",
          details: "관현악+건반 음향 체크, 찬양단, 찬양대, 감사찬송 퍼포먼스, 감사찬송 4층 성도 리허설, 군악대 환영 도열 배치",
          department: "찬양부",
          personInCharge: "총무, 군악단장",
          checked: false
        }
      ]
    },
    {
      id: 2,
      name: "당일 체크리스트",
      items: []
    }
  ];

  const addEvent = (eventData) => {
    const newEvent = {
      id: Date.now(),
      ...eventData,
      status: "진행중",
      progress: 0,
      totalTasks: 0,
      completedTasks: 0,
      // 새로운 체크리스트 템플릿 사용
      checklistData: eventData.checklistData || getNewChecklistTemplate(),
      // 대시보드용 날짜 형식 추가
      date: eventData.internalDate ? `${eventData.internalDate.replace(/-/g, '.')} - ${eventData.internalDate.replace(/-/g, '.')}` : "",
      internalDate: eventData.internalDate || eventData.date
    };
    
    setEvents(prevEvents => [...prevEvents, newEvent]);
    return newEvent;
  };

  const updateEvent = (eventId, eventData) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { 
              ...event, 
              ...eventData,
              // 대시보드용 날짜 형식 업데이트
              date: eventData.internalDate ? `${eventData.internalDate.replace(/-/g, '.')} - ${eventData.internalDate.replace(/-/g, '.')}` : event.date,
              internalDate: eventData.internalDate || eventData.date || event.internalDate
            }
          : event
      )
    );
  };

  const deleteEvent = (eventId) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  };

  const getEventsByStatus = (status) => {
    return events.filter(event => event.status === status);
  };

  const getEventsByMonth = (yearMonth) => {
    return events.filter(event => {
      if (!event.internalDate) return false;
      
      const eventMonth = event.internalDate.substring(0, 7); // YYYY-MM 형식
      return eventMonth === yearMonth;
    });
  };

  const getEventsByYear = (year) => {
    return events.filter(event => {
      if (!event.internalDate) return false;
      return event.internalDate.startsWith(year + '-');
    });
  };

  const value = {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsByStatus,
    getEventsByMonth,
    getEventsByYear
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}; 