const sampleEvents = [
  {
    id: 1,
    title: "2025 여름 행사",
    category: "총회",
    status: "진행중",
    date: "2025-07-15",
    departments: ["기획부", "홍보부", "전도부"],
    assignees: ["기획부", "홍보부"],
    progress: 75,
    totalTasks: 48,
    completedTasks: 36,
    categories: [
      {
        id: 1,
        name: "사전 준비",
        items: [
          {
            id: 1,
            title: "행사 기획안 작성",
            status: "완료",
            assignee: "기획부",
            dueDate: "2025-07-10",
            note: "행사 전체 기획안 및 일정표 작성",
            checkDate: "2025-07-08"
          },
          {
            id: 2,
            title: "예산 계획 수립",
            status: "진행중",
            assignee: "기획부",
            dueDate: "2025-07-12",
            note: "행사 예산 계획 및 승인"
          },
          {
            id: 3,
            title: "홍보물 제작",
            status: "완료",
            assignee: "홍보부",
            dueDate: "2025-07-08",
            note: "포스터, 전단지 제작",
            checkDate: "2025-07-07"
          },
          {
            id: 4,
            title: "참가자 명단 확정",
            status: "미진행",
            assignee: "전도부",
            dueDate: "2025-07-14",
            note: "참가자 등록 및 명단 확정"
          }
        ]
      },
      {
        id: 2,
        name: "당일 준비",
        items: [
          {
            id: 5,
            title: "행사장 준비",
            status: "진행중",
            assignee: "기획부",
            time: "08:00",
            duration: "2시간",
            note: "행사장 배치 및 장비 설치"
          },
          {
            id: 6,
            title: "참가자 등록",
            status: "미진행",
            assignee: "전도부",
            time: "09:00",
            duration: "1시간",
            note: "참가자 체크인 및 명찰 배부"
          },
          {
            id: 7,
            title: "개회식 진행",
            status: "미진행",
            assignee: "기획부",
            time: "10:00",
            duration: "30분",
            note: "개회식 및 환영사"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "2025 여름 프로모션",
    category: "지역",
    status: "예정",
    date: "2025-07-20",
    departments: ["홍보부", "문화부"],
    assignees: ["홍보부"],
    progress: 30,
    totalTasks: 24,
    completedTasks: 8,
    categories: [
      {
        id: 3,
        name: "사전 준비",
        items: [
          {
            id: 8,
            title: "프로모션 기획",
            status: "진행중",
            assignee: "홍보부",
            dueDate: "2025-07-15",
            note: "여름 시즌 프로모션 기획안 작성"
          },
          {
            id: 9,
            title: "예산 확정",
            status: "미진행",
            assignee: "홍보부",
            dueDate: "2025-07-18",
            note: "프로모션 예산 확정"
          },
          {
            id: 10,
            title: "문화 프로그램 기획",
            status: "완료",
            assignee: "문화부",
            dueDate: "2025-07-10",
            note: "여름 테마 문화 프로그램 기획",
            checkDate: "2025-07-08"
          }
        ]
      },
      {
        id: 4,
        name: "당일 준비",
        items: [
          {
            id: 11,
            title: "부스 설치",
            status: "미진행",
            assignee: "홍보부",
            time: "08:30",
            duration: "1시간",
            note: "프로모션 부스 설치"
          },
          {
            id: 12,
            title: "문화 공연 준비",
            status: "미진행",
            assignee: "문화부",
            time: "09:30",
            duration: "30분",
            note: "문화 공연 장비 및 무대 준비"
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "2025 청년부 수련회",
    category: "지파",
    status: "완료",
    date: "2025-07-01",
    departments: ["기획부", "청년회"],
    assignees: ["기획부"],
    progress: 100,
    totalTasks: 36,
    completedTasks: 36,
    categories: [
      {
        id: 5,
        name: "사전 준비",
        items: [
          {
            id: 13,
            title: "수련회 기획",
            status: "완료",
            assignee: "기획부",
            dueDate: "2025-06-25",
            note: "청년부 수련회 전체 기획",
            checkDate: "2025-06-23"
          },
          {
            id: 14,
            title: "숙소 예약",
            status: "완료",
            assignee: "기획부",
            dueDate: "2025-06-28",
            note: "수련회 숙소 예약 및 확정",
            checkDate: "2025-06-26"
          },
          {
            id: 15,
            title: "참가자 모집",
            status: "완료",
            assignee: "청년회",
            dueDate: "2025-06-30",
            note: "청년부원 참가자 모집",
            checkDate: "2025-06-29"
          }
        ]
      },
      {
        id: 6,
        name: "당일 준비",
        items: [
          {
            id: 16,
            title: "출발 준비",
            status: "완료",
            assignee: "기획부",
            time: "07:00",
            duration: "30분",
            note: "버스 탑승 및 출발 준비",
            checkDate: "2025-07-01T07:15:00"
          },
          {
            id: 17,
            title: "수련회 진행",
            status: "완료",
            assignee: "기획부",
            time: "10:00",
            duration: "8시간",
            note: "수련회 프로그램 진행",
            checkDate: "2025-07-01T10:05:00"
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "찬양팀 워크샵",
    category: "부서",
    status: "예정",
    date: "2025-07-25",
    departments: ["찬양부"],
    assignees: [],
    progress: 15,
    totalTasks: 10,
    completedTasks: 1,
    categories: [
      {
        id: 7,
        name: "사전 준비",
        items: [
          {
            id: 18,
            title: "워크샵 기획",
            status: "진행중",
            assignee: "찬양부",
            dueDate: "2025-07-20",
            note: "찬양팀 워크샵 기획안 작성"
          },
          {
            id: 19,
            title: "강사 섭외",
            status: "미진행",
            assignee: "찬양부",
            dueDate: "2025-07-15",
            note: "워크샵 강사 섭외 및 확정"
          }
        ]
      },
      {
        id: 8,
        name: "당일 준비",
        items: [
          {
            id: 20,
            title: "장비 준비",
            status: "미진행",
            assignee: "찬양부",
            time: "08:00",
            duration: "1시간",
            note: "음향 장비 및 악기 준비"
          }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "2024 성탄절 행사",
    category: "총회",
    status: "완료",
    date: "2024-12-25",
    departments: ["기획부", "홍보부"],
    assignees: ["기획부", "홍보부"],
    progress: 100,
    totalTasks: 40,
    completedTasks: 40,
    categories: [
      {
        id: 9,
        name: "사전 준비",
        items: [
          {
            id: 21,
            title: "성탄절 기획",
            status: "완료",
            assignee: "기획부",
            dueDate: "2024-12-20",
            note: "성탄절 행사 전체 기획",
            checkDate: "2024-12-18"
          },
          {
            id: 22,
            title: "홍보물 제작",
            status: "완료",
            assignee: "홍보부",
            dueDate: "2024-12-22",
            note: "성탄절 홍보물 제작",
            checkDate: "2024-12-20"
          }
        ]
      },
      {
        id: 10,
        name: "당일 준비",
        items: [
          {
            id: 23,
            title: "행사장 준비",
            status: "완료",
            assignee: "기획부",
            time: "16:00",
            duration: "2시간",
            note: "성탄절 행사장 준비",
            checkDate: "2024-12-25T16:30:00"
          },
          {
            id: 24,
            title: "성탄절 예배",
            status: "완료",
            assignee: "기획부",
            time: "18:00",
            duration: "2시간",
            note: "성탄절 예배 진행",
            checkDate: "2024-12-25T18:05:00"
          }
        ]
      }
    ]
  },
  {
    id: 6,
    title: "가을 수확감사절",
    category: "지역",
    status: "완료",
    date: "2024-10-10",
    departments: ["기획부", "문화부"],
    assignees: ["기획부"],
    progress: 100,
    totalTasks: 20,
    completedTasks: 20,
    categories: [
      {
        id: 11,
        name: "사전 준비",
        items: [
          {
            id: 25,
            title: "감사절 기획",
            status: "완료",
            assignee: "기획부",
            dueDate: "2024-10-05",
            note: "가을 수확감사절 기획",
            checkDate: "2024-10-03"
          },
          {
            id: 26,
            title: "문화 프로그램",
            status: "완료",
            assignee: "문화부",
            dueDate: "2024-10-08",
            note: "감사절 문화 프로그램 준비",
            checkDate: "2024-10-06"
          }
        ]
      },
      {
        id: 12,
        name: "당일 준비",
        items: [
          {
            id: 27,
            title: "감사절 예배",
            status: "완료",
            assignee: "기획부",
            time: "10:00",
            duration: "2시간",
            note: "가을 수확감사절 예배",
            checkDate: "2024-10-10T10:05:00"
          }
        ]
      }
    ]
  }
];

export default sampleEvents; 