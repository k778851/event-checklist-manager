import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { MdAdd, MdUpload, MdDownload } from 'react-icons/md';
import ChecklistView from './ChecklistView';
import TimelineView from '../timeline/TimelineView';
import { useEvents } from '../../contexts/EventContext';
import { useAuth } from '../../contexts/AuthContext';
import * as XLSX from 'xlsx'; // XLSX 라이브러리 추가

const ChecklistTabs = (props) => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const tabFromQuery = searchParams.get('tab');
  const { events, updateEvent, updateEventChecklist } = useEvents();
  const { currentUser, hasPermission, canAccessDepartment } = useAuth();
  
  // event prop이 있으면 그걸 사용, 없으면 id로 EventContext에서 찾음
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
  


  // 체크리스트 데이터에서 타임라인 데이터 생성
  const generateTimelineFromChecklist = (checklistData) => {
    const timelineItems = [];
    let timelineId = 1;
    
    checklistData.forEach((category) => {
      if (category.items && Array.isArray(category.items)) {
        category.items.forEach((mainItem) => {
          // 메인 항목 자체에 시간 정보가 있으면 타임라인에 추가
          if (mainItem.time) {
            // 담당자 정보 우선순위: assignee > 조합된 정보 > 개별 필드
            const assigneeInfo = mainItem.assignee || 
              `${mainItem.region || '본부'} ${mainItem.department || ''} ${mainItem.personInCharge || ''}`.trim() ||
              mainItem.department || '';
            
            const timelineItem = {
              id: timelineId++,
              time: mainItem.time,
              department: mainItem.department || '',
              title: mainItem.item || mainItem.title,
              content: mainItem.details || '',
              status: mainItem.status || '미진행',
              assignee: assigneeInfo,
              checked: mainItem.status === '완료',
              checkedAt: mainItem.status === '완료' ? new Date().toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }) : null,
              category: category.name,
              region: mainItem.region || '본부',
              personInCharge: mainItem.personInCharge || '',
              originalChecklistId: mainItem.id,
              isMainItem: true, // 메인 항목 표시
              subItems: mainItem.subItems || [] // 세부항목 포함
            };
            
            timelineItems.push(timelineItem);
            
            // 메인 항목에 시간이 있으면 모든 세부항목도 타임라인에 추가
            if (mainItem.subItems && Array.isArray(mainItem.subItems)) {
              mainItem.subItems.forEach((subItem) => {
                // 서브항목 담당자 정보 우선순위: assignee > 조합된 정보 > 개별 필드
                const subAssigneeInfo = subItem.assignee || 
                  `${subItem.region || '본부'} ${subItem.department || ''} ${subItem.personInCharge || ''}`.trim() ||
                  subItem.department || '';
                
                const subTimelineItem = {
                  id: timelineId++,
                  time: mainItem.time, // 메인 항목의 시간 사용
                  department: subItem.department || '',
                  title: subItem.title,
                  content: subItem.details || '',
                  status: subItem.status || '미진행',
                  assignee: subAssigneeInfo,
                  checked: subItem.status === '완료' || subItem.checked || false,
                  checkedAt: (subItem.status === '완료' || subItem.checked) ? new Date().toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }) : null,
                  category: mainItem.item, // 대항목명을 카테고리로 사용
                  region: subItem.region || '본부',
                  personInCharge: subItem.personInCharge || '',
                  originalChecklistId: subItem.id, // 원본 체크리스트 항목 ID 참조
                  isSubItem: true, // 세부항목 표시
                  parentId: mainItem.id // 부모 항목 ID
                };
                
                timelineItems.push(subTimelineItem);
              });
            }
          }
          
          // 독립적인 시간을 가진 서브 항목들도 확인 (메인 항목에 시간이 없는 경우)
          if (!mainItem.time && mainItem.subItems && Array.isArray(mainItem.subItems)) {
            mainItem.subItems.forEach((subItem) => {
              // 시간 정보가 있는 서브항목만 타임라인에 추가
              if (subItem.time) {
                // 서브항목 담당자 정보 우선순위: assignee > 조합된 정보 > 개별 필드
                const subAssigneeInfo = subItem.assignee || 
                  `${subItem.region || '본부'} ${subItem.department || ''} ${subItem.personInCharge || ''}`.trim() ||
                  subItem.department || '';
                
                const timelineItem = {
                  id: timelineId++,
                  time: subItem.time,
                  department: subItem.department || '',
                  title: subItem.title,
                  content: subItem.details || '',
                  status: subItem.status || '미진행',
                  assignee: subAssigneeInfo,
                  checked: subItem.status === '완료' || subItem.checked || false,
                  checkedAt: (subItem.status === '완료' || subItem.checked) ? new Date().toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }) : null,
                  category: mainItem.item, // 대항목명을 카테고리로 사용
                  region: subItem.region || '본부',
                  personInCharge: subItem.personInCharge || '',
                  originalChecklistId: subItem.id, // 원본 체크리스트 항목 ID 참조
                  isSubItem: true, // 세부항목 표시
                  parentId: mainItem.id // 부모 항목 ID
                };
                
                timelineItems.push(timelineItem);
              }
            });
          }
        });
      }
    });
    
    // 시간순으로 정렬
    timelineItems.sort((a, b) => {
      const timeA = a.time.replace(':', '');
      const timeB = b.time.replace(':', '');
      return timeA.localeCompare(timeB);
    });
    
    return timelineItems;
  };

  // Excel 업로드 핸들러
  const handleExcelUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          // 셀 병합 정보를 포함하여 데이터 추출 (헤더 없이 배열로)
          const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

          console.log('원본 Excel 데이터:', rawData); // 디버깅용

          // Excel 데이터를 체크리스트 형식으로 변환
          const newCategories = [];
          
          // 현재 활성 탭에 따라 카테고리 결정
          const categoryName = activeTab === 'pre' ? "사전 준비" : "당일 준비";
          const categoryId = activeTab === 'pre' ? 1 : 2;
          
          const newCategory = {
            id: Date.now(),
            name: categoryName,
            items: []
          };

          // 새로운 구조에 맞는 데이터 처리
          let currentMainItem = '';
          let mainItems = new Map(); // 대항목별로 세부항목을 그룹화
          
          rawData.forEach((row, index) => {
            // 첫 번째 행은 헤더이므로 건너뛰기
            if (index === 0) return;
            
            // 대항목명 컬럼 (0번 인덱스) 처리
            if (row[0] && row[0].toString().trim()) {
              currentMainItem = row[0].toString().trim();
              if (!mainItems.has(currentMainItem)) {
                mainItems.set(currentMainItem, []);
              }
            }
            
            // 세부항목명 컬럼 (1번 인덱스)이 있는 행만 처리
            if (row[1] && row[1].toString().trim()) {
              console.log(`처리 중인 행 ${index}:`, row);
              
              // 당일 체크리스트는 시간 컬럼이 있으므로 인덱스 조정
              const isDay = activeTab === 'day';
              const timeIndex = isDay ? 2 : -1;
              const regionIndex = isDay ? 3 : 2;
              const departmentIndex = isDay ? 4 : 3;
              const personIndex = isDay ? 5 : 4;
              const statusIndex = isDay ? 6 : 5;
              
              console.log(`activeTab: ${activeTab}, isDay: ${isDay}`);
              console.log(`컬럼 인덱스 - time: ${timeIndex}, region: ${regionIndex}, department: ${departmentIndex}, person: ${personIndex}, status: ${statusIndex}`);
              
              // 상태 컬럼의 텍스트에 따라 상태와 체크 여부 결정
              const checkText = (row[statusIndex] || '').toString().trim().toLowerCase();
              let status = '미진행';
              let checked = false;
              
              if (checkText === '완료' || checkText === '체크' || checkText === 'v' || checkText === '✓' || checkText === 'o' || checkText === 'ㅇ') {
                status = '완료';
                checked = true;
              } else {
                status = '미진행';
                checked = false;
              }
              
              // 세부항목 정보 (시간 정보 포함)
              const subItem = {
                id: Date.now() + index + 1000,
                title: row[1].toString().trim(),
                status: status,
                checked: checked,
                checkDate: checked ? new Date().toISOString().split('T')[0] : null,
                time: isDay && row[timeIndex] ? row[timeIndex].toString().trim() : '', // 시간 정보 추가
                region: row[regionIndex] ? row[regionIndex].toString().trim() : '본부',
                department: row[departmentIndex] ? row[departmentIndex].toString().trim() : '',
                personInCharge: row[personIndex] ? row[personIndex].toString().trim() : '',
                assignee: `${row[regionIndex] || '본부'} ${row[departmentIndex] || ''} ${row[personIndex] || ''}`.trim()
              };
              
              // 현재 대항목에 세부항목 추가
              if (currentMainItem && mainItems.has(currentMainItem)) {
                mainItems.get(currentMainItem).push(subItem);
              }
            }
          });
          
          // 대항목과 세부항목을 체크리스트 형식으로 변환
          mainItems.forEach((subItems, mainItemName) => {
            if (subItems.length > 0) {
              const mainItem = {
                id: Date.now() + Math.random(),
                index: newCategory.items.length + 1,
                item: mainItemName,
                details: mainItemName,
                time: activeTab === 'day' && subItems.length > 0 ? subItems[0].time : undefined, // 당일 준비의 경우 첫 번째 세부항목의 시간 사용
                department: '', // 대항목은 담당자 없음
                personInCharge: '', // 대항목은 담당자 없음
                status: '미진행',
                assignee: '', // 대항목은 담당자 없음
                region: '', // 대항목은 지역 없음
                assigneeName: '', // 대항목은 담당자 없음
                checkDate: null,
                checked: false,
                subItems: subItems // 세부항목 포함
              };
              
              newCategory.items.push(mainItem);
            }
          });

          // 항목이 있는 경우에만 카테고리 추가
          if (newCategory.items.length > 0) {
            newCategories.push(newCategory);
          }

          // 기존 데이터가 있으면 유지하고, 새로운 데이터로 업데이트
          if (newCategories.length > 0) {
            if (activeTab === 'pre') {
              setPreChecklist(newCategories);
              saveChecklistToContext(newCategories, null);
            } else {
              setDayChecklist(newCategories);
              saveChecklistToContext(null, newCategories);
              
              // 당일 체크리스트 업로드 시 타임라인 데이터도 생성
              if (event) {
                console.log('=== 타임라인 데이터 생성 시작 ===');
                console.log('현재 이벤트:', event);
                console.log('생성된 체크리스트 카테고리:', newCategories);
                
                const timelineData = generateTimelineFromChecklist(newCategories);
                console.log('생성된 타임라인 데이터:', timelineData);
                console.log('생성된 타임라인 항목 수:', timelineData.length);
                
                const updatedEvent = { 
                  ...event, 
                  timelineData: timelineData
                };
                console.log('업데이트할 이벤트 데이터:', updatedEvent);
                
                updateEvent(event.id, updatedEvent);
                console.log('EventContext 업데이트 완료');
                
                // 사용자에게 동기화 완료 알림
                if (timelineData.length > 0) {
                  alert(`Excel 파일이 성공적으로 업로드되었습니다.\n${newCategory.items.length}개 체크리스트 항목과 ${timelineData.length}개 타임라인 항목이 생성되었습니다.`);
                  return; // 중복 alert 방지
                } else {
                  console.warn('타임라인 데이터가 생성되지 않았습니다. 시간 정보가 있는 항목이 없을 수 있습니다.');
                }
              } else {
                console.error('이벤트 정보가 없어서 타임라인 데이터를 생성할 수 없습니다.');
              }
            }
            alert(`Excel 파일이 성공적으로 업로드되었습니다. ${newCategory.items.length}개 항목이 "${categoryName}"에 추가되었습니다.`);
          } else {
            alert('업로드된 Excel 파일에 유효한 항목이 없습니다.');
          }
        } catch (error) {
          alert('Excel 파일 처리 중 오류가 발생했습니다.');
          console.error('Excel upload error:', error);
        }
      };
      reader.readAsBinaryString(file);
      
      // 파일 입력 필드 초기화 (중복 업로드 방지)
      event.target.value = '';
    }
  };

  // Excel 다운로드 핸들러
  const handleExcelDownload = (includeStatus = true) => {
    // 템플릿 다운로드인 경우 사전/당일에 따라 다른 템플릿 데이터 사용
    if (!includeStatus) {
      let templateData = [];
      
      if (activeTab === 'pre') {
        // 사전 체크리스트 템플릿
        templateData = [
          ['대항목명', '세부항목명', '지역', '부서', '담당자명', '상태'],
          ['현장배치도', '부스별 배치도', '본부', '기획부', '콘텐츠기획과', ''],
          ['', '총회장님 단상 배치', '본부', '건설부', '총무', ''],
          ['', '단상 발판 배치', '본부', '건설부', '총무', ''],
          ['', '구즈넥 마이크 배치', '본부', '문화부', '음향과', ''],
          ['', '전자시계 배치', '본부', '문화부', '의전과', ''],
          ['', '성경책 배치', '본부', '문화부', '의전과', ''],
          ['', '물컵/물수건 배치', '본부', '문화부', '의전과', ''],
          ['음향 시스템', '관현악+건반 음향 체크', '본부', '찬양부', '총무', ''],
          ['', '찬양단 리허설', '본부', '찬양부', '총무', ''],
          ['', '찬양대 리허설', '본부', '찬양부', '총무', ''],
          ['', '감사찬송 퍼포먼스 리허설', '본부', '찬양부', '총무', ''],
          ['안내 및 보안', '층별 담당자 교육', '본부', '전도부', '유승호', ''],
          ['', '층별 안내자 교육', '본부', '전도부', '유승호', ''],
          ['', '층별 안내자 배치', '본부', '전도부', '유승호', ''],
          ['', '경호대 집결 및 근무 준비', '본부', '섭외부', '서무', ''],
        ];
      } else {
        // 당일 체크리스트 템플릿 (시간 컬럼 추가)
        templateData = [
          ['대항목명', '세부항목명', '시간', '지역', '부서', '담당자명', '상태'],
          ['행사 시작 전', '음향 시스템 최종 점검', '08:00', '본부', '찬양부', '음향팀', ''],
          ['', '조명 시스템 점검', '08:10', '본부', '문화부', '조명팀', ''],
          ['', '마이크 배터리 확인', '08:20', '본부', '문화부', '음향과', ''],
          ['', '단상 정리정돈', '08:30', '본부', '건설부', '총무', ''],
          ['', '참석자 명단 준비', '08:40', '본부', '행정서무부', '서무과', ''],
          ['', '프로그램 순서지 배치', '08:50', '본부', '기획부', '기획과', ''],
          ['행사 진행 중', '입장 안내 및 질서 유지', '09:00', '본부', '전도부', '안내팀', ''],
          ['', '음향 볼륨 조절', '09:30', '본부', '찬양부', '음향팀', ''],
          ['', '조명 조절', '10:00', '본부', '문화부', '조명팀', ''],
          ['', '응급상황 대응 준비', '09:00', '본부', '보건후생복지부', '의료팀', ''],
          ['', '주차 안내', '08:30', '본부', '봉사교통부', '주차팀', ''],
          ['행사 종료 후', '장비 정리', '12:00', '본부', '문화부', '장비팀', ''],
          ['', '현장 청소', '12:30', '본부', '봉사교통부', '청소팀', ''],
          ['', '참석자 안전 퇴장 안내', '12:00', '본부', '전도부', '안내팀', ''],
          ['', '보고서 작성', '13:00', '본부', '기획부', '기획과', ''],
        ];
      }
      
      // 워크북 생성
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(templateData);
      
      // 컬럼 너비 설정 (당일 체크리스트는 시간 컬럼 포함)
      if (activeTab === 'pre') {
        ws['!cols'] = [
          { wch: 15 }, // 대항목명
          { wch: 25 }, // 세부항목명
          { wch: 10 }, // 지역
          { wch: 15 }, // 부서
          { wch: 12 }, // 담당자명
          { wch: 8 }   // 상태
        ];
      } else {
        ws['!cols'] = [
          { wch: 15 }, // 대항목명
          { wch: 25 }, // 세부항목명
          { wch: 8 },  // 시간
          { wch: 10 }, // 지역
          { wch: 15 }, // 부서
          { wch: 12 }, // 담당자명
          { wch: 8 }   // 상태
        ];
      }
      
      XLSX.utils.book_append_sheet(wb, ws, activeTab === 'pre' ? '사전체크리스트' : '당일체크리스트');
      
      // 파일명을 탭에 따라 구분
      const fileName = activeTab === 'pre' 
        ? `사전체크리스트_템플릿_${new Date().toISOString().split('T')[0]}.xlsx`
        : `당일체크리스트_템플릿_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      XLSX.writeFile(wb, fileName);
      return;
    }
    
    // 상태 포함 다운로드인 경우 현재 체크리스트 데이터 사용
    const data = [];
    const currentChecklist = activeTab === 'pre' ? preChecklist : dayChecklist;
    
    currentChecklist.forEach(category => {
      category.items.forEach(item => {
        // 대항목 추가
        data.push({
          '대항목명': item.item || '',
          '세부항목명': '',
          '지역': '',
          '부서': '',
          '담당자명': '',
          '상태': item.status || ''
        });
        
        // 세부항목들 추가
        if (item.subItems && item.subItems.length > 0) {
          item.subItems.forEach(subItem => {
            data.push({
              '대항목명': '',
              '세부항목명': subItem.title || subItem.item || '',
              '지역': subItem.region || '',
              '부서': subItem.department || '',
              '담당자명': subItem.personInCharge || '',
              '상태': subItem.status || ''
            });
          });
        }
      });
    });
    
    // 워크시트 생성
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '체크리스트');
    
    // 파일명 생성
    const categoryName = activeTab === 'pre' ? '사전준비' : '당일준비';
    const fileName = `${event ? event.title : '이벤트'}_${categoryName}_체크리스트_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // 파일 다운로드
    XLSX.writeFile(workbook, fileName);
  };

  // 각 탭별 체크리스트 상태를 독립적으로 관리
  // 행사에 체크리스트 데이터가 있으면 사용, 없으면 빈 상태로 시작
  const [preChecklist, setPreChecklist] = useState(() => {
    if (event && event.checklistData) {
      const preData = event.checklistData.find(cat => cat.name === "사전 준비");
      return preData ? [preData] : [{
        id: 1,
        name: "사전 준비",
        items: [
          {
            id: 1,
            index: 1,
            item: "행사장 예약",
            details: "대강당 예약 완료",
            department: "기획부",
            personInCharge: "김기획",
            status: "완료",
            assignee: "본부 기획부 김기획",
            region: "본부",
            assigneeName: "김기획",
            checkDate: "2024-01-10",
            checked: true,
            subItems: [
              { id: 11, title: "대강당 예약", status: "완료", assignee: "본부 기획부 김기획" },
              { id: 12, title: "음향시설 확인", status: "진행중", assignee: "본부 기획부 김기획" }
            ]
          },
          {
            id: 2,
            index: 2,
            item: "홍보물 제작",
            details: "포스터 디자인 진행중",
            department: "홍보부",
            personInCharge: "이홍보",
            status: "진행중",
            assignee: "북구 홍보부 이홍보",
            region: "북구",
            assigneeName: "이홍보",
            checkDate: null,
            checked: false,
            subItems: [
              { id: 21, title: "포스터 디자인", status: "진행중", assignee: "북구 홍보부 이홍보" },
              { id: 22, title: "전단지 제작", status: "미진행", assignee: "북구 홍보부 이홍보" }
            ]
          }
        ]
      }];
    }
    return [{
      id: 1,
      name: "사전 준비",
      items: [
        {
          id: 1,
          index: 1,
          item: "행사장 예약",
          details: "대강당 예약 완료",
          department: "기획부",
          personInCharge: "김기획",
          status: "완료",
          assignee: "본부 기획부 김기획",
          region: "본부",
          assigneeName: "김기획",
          checkDate: "2024-01-10",
          checked: true,
          subItems: [
            { id: 11, title: "대강당 예약", status: "완료", assignee: "본부 기획부 김기획" },
            { id: 12, title: "음향시설 확인", status: "진행중", assignee: "본부 기획부 김기획" }
          ]
        },
        {
          id: 2,
          index: 2,
          item: "홍보물 제작",
          details: "포스터 디자인 진행중",
          department: "홍보부",
          personInCharge: "이홍보",
          status: "진행중",
          assignee: "북구 홍보부 이홍보",
          region: "북구",
          assigneeName: "이홍보",
          checkDate: null,
          checked: false,
          subItems: [
            { id: 21, title: "포스터 디자인", status: "진행중", assignee: "북구 홍보부 이홍보" },
            { id: 22, title: "전단지 제작", status: "미진행", assignee: "북구 홍보부 이홍보" }
          ]
        }
      ]
    }];
  });
  
  const [dayChecklist, setDayChecklist] = useState(() => {
    if (event && event.checklistData) {
      const dayData = event.checklistData.find(cat => cat.name === "당일 준비");
      return dayData ? [dayData] : [{
        id: 2,
        name: "당일 준비",
        items: [
          {
            id: 3,
            index: 3,
            item: "행사장 세팅",
            details: "당일 오전 8시 시작",
            time: "08:00",
            department: "기획부",
            personInCharge: "박기획",
            status: "미진행",
            assignee: "광산 기획부 박기획",
            region: "광산",
            assigneeName: "박기획",
            checkDate: null,
            checked: false,
            subItems: [
              { id: 31, title: "의자 배치", status: "미진행", assignee: "광산 기획부 박기획" },
              { id: 32, title: "음향 테스트", status: "미진행", assignee: "광산 기획부 박기획" }
            ]
          }
        ]
      }];
    }
    return [{
      id: 2,
      name: "당일 준비",
      items: [
        {
          id: 3,
          index: 3,
          item: "행사장 세팅",
          details: "당일 오전 8시 시작",
          time: "08:00",
          department: "기획부",
          personInCharge: "박기획",
          status: "미진행",
          assignee: "광산 기획부 박기획",
          region: "광산",
          assigneeName: "박기획",
          checkDate: null,
          checked: false,
          subItems: [
            { id: 31, title: "의자 배치", status: "미진행", assignee: "광산 기획부 박기획" },
            { id: 32, title: "음향 테스트", status: "미진행", assignee: "광산 기획부 박기획" }
          ]
        }
      ]
    }];
  });

  // event가 변경될 때마다 체크리스트 데이터 업데이트
  useEffect(() => {
    if (event && event.checklistData) {
      const preData = event.checklistData.find(cat => cat.name === "사전 준비");
      const dayData = event.checklistData.find(cat => cat.name === "당일 준비");
      
      if (preData) {
        setPreChecklist([preData]);
      }
      if (dayData) {
        setDayChecklist([dayData]);
      }
    }
  }, [event]);

  // 체크리스트 데이터를 EventContext에 저장하는 함수 (진행도 자동 계산 포함)
  const saveChecklistToContext = (newPreData, newDayData) => {
    if (event && updateEventChecklist) {
      const updatedChecklistData = [
        ...(newPreData || preChecklist),
        ...(newDayData || dayChecklist)
      ];
      updateEventChecklist(event.id, updatedChecklistData);
    }
  };

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
            
            {/* 관리 버튼들을 행사 타이틀 옆에 배치 (권한에 따라 표시) */}
            <div className="flex gap-3">
              {/* Excel 업로드 버튼 - 관리자 이상만 표시 */}
              {hasPermission('UPLOAD_EXCEL') && (
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
              )}
              
              {/* Excel 다운로드 버튼 - 관리자 이상만 표시 */}
              {hasPermission('UPLOAD_EXCEL') && (
                <button
                  onClick={() => handleExcelDownload(true)}
                  className="bg-green-200 text-green-800 px-4 py-2 rounded-lg hover:bg-green-300 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <MdDownload className="w-4 h-4" />
                  Excel 다운로드
                </button>
              )}
              
              {/* 템플릿 다운로드 버튼 - 관리자 이상만 표시 */}
              {hasPermission('UPLOAD_EXCEL') && (
                <button
                  onClick={() => handleExcelDownload(false)}
                  className="bg-purple-200 text-purple-800 px-4 py-2 rounded-lg hover:bg-purple-300 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <MdDownload className="w-4 h-4" />
                  {activeTab === 'pre' ? '사전 템플릿' : '당일 템플릿'}
                </button>
              )}
              
              {/* 추가 버튼 - 관리자 이상만 표시 */}
              {hasPermission('ADD_CHECKLIST_ITEMS') && (
                <button
                  onClick={() => setShowManualAddModal(true)}
                  className="px-4 py-2 bg-blue-200 text-blue-800 rounded-lg hover:bg-blue-300 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <MdAdd className="w-4 h-4" />
                  추가
                </button>
              )}
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
            onChecklistChange={(newData) => {
              setPreChecklist(newData);
              // 사전 체크리스트 데이터를 EventContext에 저장
              saveChecklistToContext(newData, null);
            }}
          />
        )}
        {activeTab === 'day' && (
          <ChecklistView
            event={event}
            hideHeader={true}
            categoryFilter="당일 준비"
            checklistData={dayChecklist}
            setChecklistData={setDayChecklist}
            onChecklistChange={(newData) => {
              setDayChecklist(newData);
              // 당일 체크리스트 데이터를 EventContext에 저장
              saveChecklistToContext(null, newData);
              
              // 타임라인 데이터도 함께 생성하여 EventContext에 저장
              if (event) {
                const timelineData = generateTimelineFromChecklist(newData);
                
                const updatedEvent = { 
                  ...event, 
                  timelineData: timelineData,
                  checklistData: [...(event.checklistData?.filter(cat => cat.name !== '당일 준비') || []), ...newData]
                };
                
                updateEvent(event.id, updatedEvent);
              }
            }}
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
            onTimelineUpdate={(updatedChecklist) => {
              // 타임라인에서 체크리스트 상태가 변경되면 업데이트
              setDayChecklist(updatedChecklist);
              // EventContext에도 저장
              saveChecklistToContext(null, updatedChecklist);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ChecklistTabs; 