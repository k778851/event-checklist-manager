import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MdAdd,
  MdExpandMore,
  MdExpandLess,
  MdEdit,
  MdDelete,
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdSchedule,
  MdUpload,
  MdDownload,
  MdPerson,
  MdNote
} from 'react-icons/md';
import * as XLSX from 'xlsx';

const ChecklistView = ({
  event: propEvent,
  hideHeader,
  backButtonText = "← 행사 목록으로 돌아가기",
  onBack,
  titleSuffix = "",
  titleTag = "span",
  categoryFilter,
  onTimelineUpdate, // 타임라인 상태 업데이트를 위한 콜백
  onChecklistChange, // 체크리스트 변경 시 부모 컴포넌트에 알리는 콜백
  showManualAddModal: externalShowModal, // 외부에서 제어하는 모달 상태
  setShowManualAddModal: externalSetShowModal, // 외부에서 제어하는 모달 상태 설정 함수
  checklistData, // 체크리스트 데이터 (탭별로 독립적)
  setChecklistData, // 체크리스트 업데이트 함수 (탭별로 독립적)
  onChecklistChange: externalOnChecklistChange // 외부 체크리스트 변경 콜백
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  // 샘플 행사 데이터 (Dashboard.js와 동일하게)
  const events = [
    { id: 1, title: "2024 신년 행사" },
    { id: 2, title: "봄 시즌 프로모션" },
    { id: 3, title: "청년부 수련회" },
    { id: 4, title: "찬양팀 워크샵" },
    { id: 5, title: "2023 성탄절 행사" },
    { id: 6, title: "가을 수확감사절" }
  ];
  
  // 지역 데이터
  const regions = ['본부', '북구', '광산', '담양', '장성'];
  
  // 부서 데이터 (Admin.js와 동일하게)
  const departments = [
    '총무부', '행정서무부', '자문회', '장년회', '부녀회', '청년회',
    '본부지역', '광산지역', '북구지역', '담양지역', '장성지역', '학생회', '유년회',
    '국제부', '기획부', '재정부', '교육부', '신학부', '해외선교부',
    '전도부', '문화부', '출판부', '정보통신부', '찬양부', '섭외부',
    '국내선교부', '홍보부', '법무부', '건설부', '체육부', '사업부',
    '보건후생복지부', '봉사교통부'
  ];
  
  // 지역별 부서 데이터 (모든 지역에서 본부와 동일한 부서 사용)
  const regionDepartments = {
    '본부': [
      '총무부', '행정서무부', '자문회', '장년회', '부녀회', '청년회',
      '본부지역', '학생회', '유년회', '국제부', '기획부', '재정부', '교육부', '신학부', '해외선교부',
      '전도부', '문화부', '출판부', '정보통신부', '찬양부', '섭외부',
      '국내선교부', '홍보부', '법무부', '건설부', '체육부', '사업부',
      '보건후생복지부', '봉사교통부'
    ],
    '북구': [
      '총무부', '행정서무부', '자문회', '장년회', '부녀회', '청년회',
      '북구지역', '학생회', '유년회', '국제부', '기획부', '재정부', '교육부', '신학부', '해외선교부',
      '전도부', '문화부', '출판부', '정보통신부', '찬양부', '섭외부',
      '국내선교부', '홍보부', '법무부', '건설부', '체육부', '사업부',
      '보건후생복지부', '봉사교통부'
    ],
    '광산': [
      '총무부', '행정서무부', '자문회', '장년회', '부녀회', '청년회',
      '광산지역', '학생회', '유년회', '국제부', '기획부', '재정부', '교육부', '신학부', '해외선교부',
      '전도부', '문화부', '출판부', '정보통신부', '찬양부', '섭외부',
      '국내선교부', '홍보부', '법무부', '건설부', '체육부', '사업부',
      '보건후생복지부', '봉사교통부'
    ],
    '담양': [
      '총무부', '행정서무부', '자문회', '장년회', '부녀회', '청년회',
      '담양지역', '학생회', '유년회', '국제부', '기획부', '재정부', '교육부', '신학부', '해외선교부',
      '전도부', '문화부', '출판부', '정보통신부', '찬양부', '섭외부',
      '국내선교부', '홍보부', '법무부', '건설부', '체육부', '사업부',
      '보건후생복지부', '봉사교통부'
    ],
    '장성': [
      '총무부', '행정서무부', '자문회', '장년회', '부녀회', '청년회',
      '장성지역', '학생회', '유년회', '국제부', '기획부', '재정부', '교육부', '신학부', '해외선교부',
      '전도부', '문화부', '출판부', '정보통신부', '찬양부', '섭외부',
      '국내선교부', '홍보부', '법무부', '건설부', '체육부', '사업부',
      '보건후생복지부', '봉사교통부'
    ]
  };
  
  // props로 받은 event가 있으면 그걸 사용, 없으면 기존 방식
  const event = propEvent || events.find(e => String(e.id) === String(id));

  // 체크리스트 상태 변경 시 부모 컴포넌트에 알리는 함수
  const notifyChecklistChange = (newCategories) => {
    console.log('ChecklistView: Notifying parent of changes:', newCategories);
    
    // 외부 체크리스트 변경 콜백 호출
    if (externalOnChecklistChange) {
      externalOnChecklistChange(newCategories);
    }
    
    // 내부 체크리스트 상태 업데이트
    if (setChecklistData) {
      setChecklistData(newCategories);
    }
    
    // 기존 onChecklistChange 콜백도 유지
    if (onChecklistChange) {
      onChecklistChange(newCategories);
    }
  };

  // 기본 체크리스트 데이터
  const defaultCategories = [
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
    },
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
  ];

  // 외부에서 전달받은 데이터가 있으면 사용, 없으면 기본값 사용
  const [categories, setCategories] = useState(
    checklistData && checklistData.length > 0 ? checklistData : defaultCategories
  );

  const [expandedCategories, setExpandedCategories] = useState(new Set([1, 2]));
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingSubItemId, setEditingSubItemId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', assignee: '', note: '', time: '' });
  const [editSubItemForm, setEditSubItemForm] = useState({ title: '', assignee: '' });
  const editInputRef = useRef();
  const editSubItemInputRef = useRef();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  // 외부에서 모달 상태를 제어하는 경우와 내부에서 제어하는 경우를 구분
  const [internalShowModal, setInternalShowModal] = useState(false);
  const showManualAddModal = externalShowModal !== undefined ? externalShowModal : internalShowModal;
  const setShowManualAddModal = externalSetShowModal || setInternalShowModal;
  const [newItemForm, setNewItemForm] = useState({
    title: '',
    type: '당일',
    department: '총무부',
    name: '',
    region: '본부',
    note: '',
    time: '',
    categoryId: 2, // 기본값: 당일 준비
    subItems: [] // 세부항목 추가
  });

  // 세부항목 관리 상태
  const [newSubItemTitle, setNewSubItemTitle] = useState('');

  // 새 항목에 세부항목 추가
  const addSubItemToNewItem = () => {
    if (!newSubItemTitle.trim()) {
      alert('세부항목 제목을 입력하세요.');
      return;
    }

    const newSubItem = {
      id: Date.now(),
      title: newSubItemTitle,
      status: '미진행',
      assignee: `${newItemForm.region} ${newItemForm.department} ${newItemForm.name}`
    };

    setNewItemForm(f => ({
      ...f,
      subItems: [...f.subItems, newSubItem]
    }));

    setNewSubItemTitle('');
  };

  // 새 항목에서 세부항목 삭제
  const removeSubItemFromNewItem = (subItemId) => {
    setNewItemForm(f => ({
      ...f,
      subItems: f.subItems.filter(subItem => subItem.id !== subItemId)
    }));
  };

  // 지역 변경 시 부서 자동 설정
  const handleRegionChange = (newRegion) => {
    const availableDepartments = regionDepartments[newRegion] || [];
    setNewItemForm(f => ({
      ...f,
      region: newRegion,
      department: availableDepartments[0] || '총무부'
    }));
  };

  // 카테고리 변경 시 유형 자동 설정
  const handleCategoryChange = (categoryId) => {
    const selectedCategory = categories.find(cat => cat.id === Number(categoryId));
    let defaultType = '사전';
    
    if (selectedCategory) {
      // 카테고리 이름에 따라 기본 유형 설정
      if (selectedCategory.name.includes('당일')) {
        defaultType = '당일';
      } else if (selectedCategory.name.includes('사전')) {
        defaultType = '사전';
      }
    }

    setNewItemForm(f => ({
      ...f,
      categoryId: Number(categoryId),
      type: defaultType
    }));
  };

  // 컴포넌트가 마운트될 때 초기 체크리스트 데이터를 부모에게 전달
  useEffect(() => {
    console.log('ChecklistView: Component mounted, sending initial data to parent');
    notifyChecklistChange(categories);
  }, []); // 빈 의존성 배열로 마운트 시에만 실행

  // checklistData가 변경될 때 categories 업데이트
  useEffect(() => {
    if (checklistData && checklistData.length > 0) {
      console.log('ChecklistView: Updating categories from external data:', checklistData);
      setCategories(checklistData);
    }
  }, [checklistData]);

  // 수동으로 새로운 항목 추가
  const handleManualAdd = () => {
    if (!newItemForm.title.trim() || !newItemForm.name.trim()) {
      alert('제목과 이름은 필수 입력 항목입니다.');
      return;
    }

    const newItem = {
      id: Date.now(),
      title: newItemForm.title,
      type: newItemForm.type,
      status: '미진행',
      assignee: `${newItemForm.region} ${newItemForm.department} ${newItemForm.name}`,
      region: newItemForm.region,
      department: newItemForm.department, // 부서 정보를 별도로 저장
      assigneeName: newItemForm.name, // 담당자 이름을 별도로 저장
      note: newItemForm.note,
      time: newItemForm.type === '당일' ? newItemForm.time : null,
      checkDate: null,
      subItems: newItemForm.subItems || [] // 세부항목 포함
    };

    setCategories(prevCategories => {
      const newCategories = prevCategories.map(category =>
        category.id === newItemForm.categoryId
          ? {
              ...category,
              items: [...category.items, newItem]
            }
          : category
      );

      // 부모 컴포넌트에 체크리스트 변경 알림
      notifyChecklistChange(newCategories);
      
      return newCategories;
    });

    // 폼 초기화
    setNewItemForm({
      title: '',
      type: '당일',
      department: '총무부',
      name: '',
      region: '본부',
      note: '',
      time: '',
      categoryId: 2,
      subItems: []
    });

    setNewSubItemTitle('');
    setShowManualAddModal(false);
  };

  // 카테고리 필터링 적용
  const filteredCategories = categoryFilter
    ? categories.filter(category => category.name === categoryFilter)
    : categories;

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const updateItemStatus = (categoryId, itemId, newStatus) => {
    setCategories(prevCategories => {
      const newCategories = prevCategories.map(category =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map(item =>
                item.id === itemId
                  ? {
                      ...item,
                      status: newStatus,
                      subItems: item.subItems.map(subItem => ({
                        ...subItem,
                        status: newStatus
                      }))
                    }
                  : item
              )
            }
          : category
      );

      // 타임라인 업데이트 콜백 호출
      if (onTimelineUpdate) {
        const category = newCategories.find(c => c.id === categoryId);
        const item = category?.items.find(i => i.id === itemId);
        if (item && item.type === '당일') {
          onTimelineUpdate(categoryId, itemId, newStatus);
        }
      }

      // 부모 컴포넌트에 체크리스트 변경 알림
      notifyChecklistChange(newCategories);
      
      return newCategories;
    });
  };

  const updateSubItemStatus = (categoryId, itemId, subItemId, newStatus) => {
    setCategories(prevCategories => {
      const newCategories = prevCategories.map(category =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map(item => {
                if (item.id === itemId) {
                  // 하위 항목 상태 변경
                  const newSubItems = item.subItems.map(subItem =>
                    subItem.id === subItemId
                      ? { ...subItem, status: newStatus }
                      : subItem
                  );
                  // 하위 항목이 모두 완료면 상위 항목도 완료, 아니면 미진행
                  const allDone = newSubItems.length > 0 && newSubItems.every(subItem => subItem.status === '완료');
                  return {
                    ...item,
                    subItems: newSubItems,
                    status: allDone ? '완료' : '미진행',
                  };
                }
                return item;
              })
            }
          : category
      );

      // 부모 컴포넌트에 체크리스트 변경 알림
      notifyChecklistChange(newCategories);
      
      return newCategories;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '완료': return 'bg-green-100 text-green-600';
      case '미진행': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case '완료': return <MdCheckCircle className="w-5 h-5 text-green-600" />;
      case '진행중': return <MdSchedule className="w-5 h-5 text-blue-600" />;
      case '미진행': return <MdRadioButtonUnchecked className="w-5 h-5 text-gray-400" />;
      default: return <MdRadioButtonUnchecked className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);

          // Excel 데이터를 체크리스트 형식으로 변환
          const newCategories = [];
          let currentCategory = null;

          data.forEach((row, index) => {
            if (row['카테고리']) {
              if (currentCategory) {
                newCategories.push(currentCategory);
              }
              currentCategory = {
                id: Date.now() + index,
                name: row['카테고리'],
                items: []
              };
            } else if (row['항목명'] && currentCategory) {
              const isDay = row['구분'] === '당일';
              currentCategory.items.push({
                id: Date.now() + index + 1000,
                title: row['항목명'],
                type: row['구분'] || '사전',
                status: '미진행',
                assignee: row['담당자'] || '',
                region: row['지역'] || '본부',
                note: row['비고'] || '',
                time: isDay ? row['시간'] || '' : undefined,
                checkDate: null,
                subItems: []
              });
            }
          });

          if (currentCategory) {
            newCategories.push(currentCategory);
          }

          setCategories(newCategories);
          alert('Excel 파일이 성공적으로 업로드되었습니다.');
        } catch (error) {
          alert('Excel 파일 처리 중 오류가 발생했습니다.');
          console.error('Excel upload error:', error);
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleExcelDownload = (includeStatus = true) => {
    const data = [];
    
    categories.forEach(category => {
      category.items.forEach(item => {
        data.push({
          '카테고리': category.name,
          '항목명': item.title,
          '구분': item.type,
          '상태': includeStatus ? item.status : '',
          '담당자': item.assignee,
          '비고': item.note,
          '체크일': item.checkDate || '',
          '시간': item.type === '당일' ? (item.time || '') : '',
          '지역': item.region
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '체크리스트');
    
    const fileName = `${event.title}_체크리스트_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // 항목 수정 시작
  const handleEditStart = (categoryId, item) => {
    setEditingItemId(item.id);
    setEditForm({ title: item.title, assignee: item.assignee, note: item.note, time: item.time });
    setTimeout(() => { if (editInputRef.current) editInputRef.current.focus(); }, 100);
  };

  // 항목 수정 저장
  const handleEditSave = (categoryId, itemId) => {
    setCategories(prevCategories => {
      const newCategories = prevCategories.map(category =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map(item =>
                item.id === itemId
                  ? { ...item, ...editForm }
                  : item
              )
            }
          : category
      );

      // 부모 컴포넌트에 체크리스트 변경 알림
      notifyChecklistChange(newCategories);
      
      return newCategories;
    });
    
    setEditingItemId(null);
  };

  // 항목 삭제
  const handleDeleteItem = (categoryId, itemId) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setCategories(prevCategories =>
        prevCategories.map(category =>
          category.id === categoryId
            ? {
                ...category,
                items: category.items.filter(item => item.id !== itemId)
              }
            : category
        )
      );
    }
  };

  // 하위 항목 수정 시작
  const handleEditSubItemStart = (categoryId, itemId, subItem) => {
    setEditingSubItemId(subItem.id);
    setEditSubItemForm({ title: subItem.title, assignee: subItem.assignee });
    setTimeout(() => { if (editSubItemInputRef.current) editSubItemInputRef.current.focus(); }, 100);
  };

  // 하위 항목 수정 저장
  const handleEditSubItemSave = (categoryId, itemId, subItemId) => {
    setCategories(prevCategories => {
      const newCategories = prevCategories.map(category =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map(item => {
                if (item.id === itemId) {
                  const newSubItems = item.subItems.map(subItem =>
                    subItem.id === subItemId
                      ? { ...subItem, ...editSubItemForm }
                      : subItem
                  );
                  return { ...item, subItems: newSubItems };
                }
                return item;
              })
            }
          : category
      );

      // 부모 컴포넌트에 체크리스트 변경 알림
      notifyChecklistChange(newCategories);
      
      return newCategories;
    });
    
    setEditingSubItemId(null);
  };

  // 하위 항목 삭제
  const handleDeleteSubItem = (categoryId, itemId, subItemId) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setCategories(prevCategories =>
        prevCategories.map(category =>
          category.id === categoryId
            ? {
                ...category,
                items: category.items.map(item => {
                  if (item.id === itemId) {
                    const newSubItems = item.subItems.filter(subItem => subItem.id !== subItemId);
                    return { ...item, subItems: newSubItems };
                  }
                  return item;
                })
              }
            : category
        )
      );
    }
  };

  const TitleTag = titleTag;

  return (
    <div className="p-6 md:p-8">
      {!hideHeader && (
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack ? onBack : () => navigate('/events')}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-gray-700 text-sm font-medium"
            >
              {backButtonText}
            </button>
            <TitleTag className="text-2xl font-bold text-gray-800">
              {event ? event.title : '행사 정보 없음'}{titleSuffix}
            </TitleTag>
          </div>
          
          {/* 관리 버튼들을 타이틀 옆으로 이동 */}
          <div className="flex gap-3">
            {/* 수동 추가 버튼 */}
            <button
              onClick={() => setShowManualAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <MdAdd className="w-4 h-4" />
              수동 추가
            </button>
            
            <label className="cursor-pointer bg-gray-50 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
              <MdUpload className="w-4 h-4" />
              Excel 업로드
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={() => handleExcelDownload(true)}
              className="bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2"
            >
              <MdDownload className="w-4 h-4" />
              상태 포함 다운로드
            </button>
            <button
              onClick={() => handleExcelDownload(false)}
              className="bg-gray-50 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <MdDownload className="w-4 h-4" />
              템플릿 다운로드
            </button>
          </div>
        </div>
      )}
      {/* 체크리스트 관리 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-800">체크리스트 관리</h2>
            <p className="text-gray-600">사전 항목과 당일 항목을 관리하세요</p>
          </div>
        </div>

        {/* 체크리스트 카테고리 */}
        <div className="space-y-4">
          {filteredCategories.map(category => (
            <div key={category.id} className="bg-white rounded-lg border border-gray-200">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center gap-3">
                  {expandedCategories.has(category.id) ? (
                    <MdExpandLess className="w-5 h-5 text-gray-500" />
                  ) : (
                    <MdExpandMore className="w-5 h-5 text-gray-500" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                  <span className="text-sm text-gray-500">
                    ({category.items.length}개 항목)
                  </span>
                </div>
              </div>

              {expandedCategories.has(category.id) && (
                <div className="border-t border-gray-200">
                  {category.items.map(item => (
                    <div key={item.id} className="p-4 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateItemStatus(category.id, item.id, 
                              item.status === '완료' ? '미진행' : '완료'
                            )}
                            className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                          >
                            {getStatusIcon(item.status)}
                            {editingItemId === item.id ? (
                              <div className="flex flex-col gap-2">
                                <input
                                  ref={editInputRef}
                                  className="border-b border-primary-300 outline-none px-1 text-gray-800 font-medium bg-gray-50"
                                  value={editForm.title}
                                  onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                                  onKeyDown={e => { if (e.key === 'Enter') handleEditSave(category.id, item.id); }}
                                  placeholder="항목명"
                                />
                                {item.type === '당일' && (
                                  <input
                                    type="time"
                                    className="border-b border-primary-200 outline-none px-1 text-sm text-gray-600 bg-gray-50"
                                    value={editForm.time || ''}
                                    onChange={e => setEditForm(f => ({ ...f, time: e.target.value }))}
                                    placeholder="시간"
                                  />
                                )}
                              </div>
                            ) : (
                              <span className="font-medium text-gray-800">{item.title}</span>
                            )}
                          </button>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.type === '사전' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                          }`}>
                            {item.type}
                          </span>
                          {/* 당일 항목일 경우 시간 표시 */}
                          {item.type === '당일' && item.time && (
                            <span className="px-2 py-1 rounded-full text-xs bg-purple-50 text-purple-600 flex items-center gap-1">
                              <MdSchedule className="w-3 h-3" />
                              {item.time}
                            </span>
                          )}
                          {/* 하위 항목 진행률 표시 */}
                          {item.subItems && item.subItems.length > 0 && (
                            (() => {
                              const total = item.subItems.length;
                              const done = item.subItems.filter(sub => sub.status === '완료').length;
                              const percent = Math.round((done / total) * 100);
                              return (
                                <span className="ml-2 text-xs text-gray-500">{done}/{total} 완료 ({percent}%)</span>
                              );
                            })()
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {editingItemId === item.id ? (
                            <>
                              <button onClick={() => handleEditSave(category.id, item.id)} className="text-green-600 px-2">저장</button>
                              <button onClick={() => setEditingItemId(null)} className="text-gray-400 px-2">취소</button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditStart(category.id, item)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <MdEdit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(category.id, item.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <MdDelete className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* 항목 상세 정보 */}
                      <div className="ml-8 space-y-2">            
                        {/* 하위 항목들 */}
                        {item.subItems && item.subItems.length > 0 && (
                          <div className="space-y-2">
                            {item.subItems.map(subItem => (
                              <div key={subItem.id} className="flex items-center justify-between hover:bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => updateSubItemStatus(category.id, item.id, subItem.id,
                                      subItem.status === '완료' ? '미진행' : '완료'
                                    )}
                                    className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded transition-colors"
                                  >
                                    {getStatusIcon(subItem.status)}
                                    {editingSubItemId === subItem.id ? (
                                      <input
                                        ref={editSubItemInputRef}
                                        className="border-b border-primary-300 outline-none px-1 text-sm text-gray-700 bg-gray-50"
                                        value={editSubItemForm.title}
                                        onChange={e => setEditSubItemForm(f => ({ ...f, title: e.target.value }))}
                                        onKeyDown={e => { if (e.key === 'Enter') handleEditSubItemSave(category.id, item.id, subItem.id); }}
                                      />
                                    ) : (
                                      <span className="text-sm text-gray-700">{subItem.title}</span>
                                    )}
                                  </button>
                                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(subItem.status)}`}>
                                    {subItem.status}
                                  </span>
                                  {editingSubItemId === subItem.id ? (
                                    <input
                                      className="border-b border-primary-200 outline-none px-1 text-xs bg-gray-50"
                                      value={editSubItemForm.assignee}
                                      onChange={e => setEditSubItemForm(f => ({ ...f, assignee: e.target.value }))}
                                      placeholder="담당자"
                                    />
                                  ) : (
                                    <span className="text-xs text-gray-500">{subItem.assignee}</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {editingSubItemId === subItem.id ? (
                                    <>
                                      <button 
                                        onClick={() => handleEditSubItemSave(category.id, item.id, subItem.id)} 
                                        className="text-green-600 px-2 text-xs"
                                      >
                                        저장
                                      </button>
                                      <button 
                                        onClick={() => setEditingSubItemId(null)} 
                                        className="text-gray-400 px-2 text-xs"
                                      >
                                        취소
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => handleEditSubItemStart(category.id, item.id, subItem)}
                                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                                        title="하위 항목 수정"
                                      >
                                        <MdEdit className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteSubItem(category.id, item.id, subItem.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors"
                                        title="하위 항목 삭제"
                                      >
                                        <MdDelete className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 진행 현황 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mt-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">진행 현황</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {filteredCategories.map(category => {
              const totalItems = category.items.length;
              const completedItems = category.items.filter(item => item.status === '완료').length;
              const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

              return (
                <div key={category.id} className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{progress}%</div>
                  <div className="text-sm text-gray-600">{category.name}</div>
                  <div className="text-xs text-gray-500">{completedItems}/{totalItems} 완료</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 수동 추가 모달 */}
      {showManualAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">새 항목 추가</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                <select
                  value={newItemForm.categoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
                <select
                  value={newItemForm.region}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">항목명 *</label>
                <input
                  type="text"
                  value={newItemForm.title}
                  onChange={(e) => setNewItemForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="항목명을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">유형</label>
                <select
                  value={newItemForm.type}
                  onChange={(e) => setNewItemForm(f => ({ ...f, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="사전">사전</option>
                  <option value="당일">당일</option>
                </select>
              </div>

              {newItemForm.type === '당일' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">시간</label>
                  <input
                    type="time"
                    value={newItemForm.time}
                    onChange={(e) => setNewItemForm(f => ({ ...f, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">담당자 *</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">부서</label>
                    <select
                      value={newItemForm.department}
                      onChange={(e) => setNewItemForm(f => ({ ...f, department: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      {regionDepartments[newItemForm.region]?.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      )) || []}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">이름</label>
                    <input
                      type="text"
                      value={newItemForm.name}
                      onChange={(e) => setNewItemForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="이름"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">비고</label>
                <textarea
                  value={newItemForm.note}
                  onChange={(e) => setNewItemForm(f => ({ ...f, note: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="추가 설명을 입력하세요"
                />
              </div>

              {/* 세부항목 섹션 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">세부항목</label>
                
                {/* 기존 세부항목 목록 */}
                {newItemForm.subItems.length > 0 && (
                  <div className="mb-3 space-y-2">
                    {newItemForm.subItems.map((subItem, index) => (
                      <div key={subItem.id} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                        <span className="text-sm text-gray-700">{index + 1}. {subItem.title}</span>
                        <button
                          type="button"
                          onClick={() => removeSubItemFromNewItem(subItem.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          <MdDelete className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 새 세부항목 추가 */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubItemTitle}
                    onChange={(e) => setNewSubItemTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSubItemToNewItem(); } }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="세부항목 제목을 입력하세요"
                  />
                  <button
                    type="button"
                    onClick={addSubItemToNewItem}
                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors text-sm flex items-center gap-1"
                  >
                    <MdAdd className="w-4 h-4" />
                    추가
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  세부항목을 추가하면 더 세밀한 작업 관리가 가능합니다.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleManualAdd}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                추가
              </button>
              <button
                onClick={() => setShowManualAddModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChecklistView; 