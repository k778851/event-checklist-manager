import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  MdAdd,
  MdExpandMore,
  MdExpandLess,
  MdEdit,
  MdDelete,
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdUpload,
  MdPerson,
  MdNote,
  MdAccessTime
} from 'react-icons/md';


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
  setChecklistData: externalSetChecklistData, // 체크리스트 업데이트 함수 (탭별로 독립적)
  onChecklistChange: externalOnChecklistChange // 외부 체크리스트 변경 콜백
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser, hasPermission, canAccessDepartment } = useAuth();
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
    
    // 외부 체크리스트 변경 콜백만 호출 (중복 방지)
    if (externalOnChecklistChange) {
      externalOnChecklistChange(newCategories);
    }
    // 외부 콜백이 없는 경우에만 내부 상태 업데이트
    else if (externalSetChecklistData) {
      externalSetChecklistData(newCategories);
    }
    // 기존 체크리스트 변경 콜백 호출 (하위 호환성)
    else if (onChecklistChange) {
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
    },
    {
      id: 2,
      name: "당일 준비",
             items: [
        {
          id: 3,
          index: 3,
          item: "행사장 세팅",
          details: "당일 오전 8시 시작",
          time: "08:00", // 시간 정보 추가
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
    }
  ];

  // 외부에서 전달받은 데이터를 직접 사용하거나 기본값 사용
  const categories = (checklistData && checklistData.length > 0) ? checklistData : defaultCategories;

  // 모든 카테고리를 기본적으로 열어두기
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  
  // 카테고리가 변경될 때마다 모든 카테고리를 열어두기
  useEffect(() => {
    const allCategoryIds = categories.map(category => category.id);
    setExpandedCategories(new Set(allCategoryIds));
  }, [categories]);

  const [editingItemId, setEditingItemId] = useState(null);
  const [editingSubItemId, setEditingSubItemId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', assignee: '' });
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
    categoryId: categoryFilter === '사전 준비' ? 1 : 2, // categoryFilter에 따라 적절한 ID 설정
    time: '09:00', // 시간 필드 추가
    subItems: [] // 세부항목 추가
  });

  // 세부항목 관리 상태
  const [newSubItemTitle, setNewSubItemTitle] = useState('');
  const [newSubItemForm, setNewSubItemForm] = useState({
    department: '총무부',
    name: '',
    region: '본부'
  });


  // 기존 항목에 세부항목 추가를 위한 상태
  const [addingSubItemToItem, setAddingSubItemToItem] = useState(null);
  const [newSubItemForExisting, setNewSubItemForExisting] = useState({
    title: '',
    department: '총무부',
    name: '',
    region: '본부'
  });

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
      assignee: `${newSubItemForm.region} ${newSubItemForm.department} ${newSubItemForm.name}`,
      department: newSubItemForm.department,
      personInCharge: newSubItemForm.name,
      region: newSubItemForm.region
    };

    setNewItemForm(f => ({
      ...f,
      subItems: [...f.subItems, newSubItem]
    }));

    setNewSubItemTitle('');
    // 세부항목 폼 초기화
    setNewSubItemForm({
      department: '총무부',
      name: '',
      region: '본부'
    });
  };

  // 새 항목에서 세부항목 삭제
  const removeSubItemFromNewItem = (subItemId) => {
    setNewItemForm(f => ({
      ...f,
      subItems: f.subItems.filter(subItem => subItem.id !== subItemId)
    }));
  };



  // 세부항목 지역 변경 시 부서 자동 설정
  const handleSubItemRegionChange = (newRegion) => {
    const availableDepartments = regionDepartments[newRegion] || [];
    setNewSubItemForm(f => ({
      ...f,
      region: newRegion,
      department: availableDepartments[0] || '총무부'
    }));
  };

  // 기존 세부항목에 세부항목 추가 시 지역 변경 시 부서 자동 설정
  const handleExistingSubItemRegionChange = (newRegion) => {
    const availableDepartments = regionDepartments[newRegion] || [];
    setNewSubItemForExisting(prev => ({
      ...prev,
      region: newRegion,
      department: availableDepartments[0] || '총무부'
    }));
  };

  // 카테고리 변경 시 처리
  const handleCategoryChange = (categoryId) => {
    setNewItemForm(f => ({
      ...f,
      categoryId: Number(categoryId)
    }));
  };


  // 기존 항목에 세부항목 추가
  const addSubItemToExistingItem = (categoryId, itemId) => {
    if (!newSubItemForExisting.title.trim()) {
      alert('세부항목 제목을 입력하세요.');
      return;
    }

    const newSubItem = {
      id: Date.now(),
      title: newSubItemForExisting.title,
      status: '미진행',
      assignee: `${newSubItemForExisting.region} ${newSubItemForExisting.department} ${newSubItemForExisting.name}`,
      department: newSubItemForExisting.department,
      personInCharge: newSubItemForExisting.name,
      region: newSubItemForExisting.region
    };

    const newCategories = categories.map(category =>
      category.id === categoryId
        ? {
            ...category,
            items: category.items.map(item =>
              item.id === itemId
                ? {
                    ...item,
                    subItems: [...item.subItems, newSubItem]
                  }
                : item
            )
          }
        : category
    );

    // 부모 컴포넌트에 체크리스트 변경 알림
    notifyChecklistChange(newCategories);

    setAddingSubItemToItem(null);
    setNewSubItemForExisting({ title: '', department: '총무부', name: '', region: '본부' });
  };

  // 세부항목 추가 취소
  const cancelAddSubItem = () => {
    setAddingSubItemToItem(null);
    setNewSubItemForExisting({ title: '', department: '총무부', name: '', region: '본부' });
  };


  // 초기 데이터 전달은 부모 컴포넌트에서 처리하므로 제거



  // 수동으로 새로운 항목 추가
  const handleManualAdd = () => {
    if (!newItemForm.title.trim()) {
      alert('항목명은 필수 입력 항목입니다.');
      return;
    }

    // 첫 번째 세부항목의 담당자 정보를 메인 항목에 설정
    const firstSubItem = newItemForm.subItems && newItemForm.subItems.length > 0 ? newItemForm.subItems[0] : null;
    
    const newItem = {
      id: Date.now(),
      index: Date.now(),
      item: newItemForm.title,
      details: newItemForm.title,
      time: newItemForm.time, // 시간 필드 추가
      department: firstSubItem ? firstSubItem.department : '',
      personInCharge: firstSubItem ? firstSubItem.personInCharge : '',
      status: '미진행',
      assignee: firstSubItem ? firstSubItem.assignee : '',
      region: firstSubItem ? firstSubItem.region : '본부',
      assigneeName: firstSubItem ? firstSubItem.personInCharge : '',
      checkDate: null,
      checked: false,
      subItems: newItemForm.subItems || [] // 세부항목 포함
    };

    const newCategories = categories.map(category =>
      category.id === newItemForm.categoryId
        ? {
            ...category,
            items: [...category.items, newItem]
          }
        : category
    );

    // 부모 컴포넌트에 체크리스트 변경 알림
    notifyChecklistChange(newCategories);

    // 폼 초기화
    setNewItemForm({
      title: '',
      categoryId: categoryFilter === '사전 준비' ? 1 : 2, // categoryFilter에 따라 적절한 ID 설정
      time: '09:00',
      subItems: []
    });

    setNewSubItemTitle('');
    setShowManualAddModal(false);
  };

  // 카테고리 및 부서별 필터링 적용
  const filteredCategories = useMemo(() => {
    let filtered = categoryFilter
      ? categories.filter(category => category.name === categoryFilter)
      : categories;

    // 권한에 따른 부서별 필터링 - 총괄관리자가 아닌 경우 자신의 부서 항목만 표시
    if (currentUser && currentUser.role !== 'super_admin') {
      filtered = filtered.map(category => ({
        ...category,
        items: category.items.filter(item => {
          // 자신의 부서 항목만 표시
          return canAccessDepartment(item.department) || 
                 (item.assignee && item.assignee.includes(currentUser.department));
        })
      }));
    }

    return filtered;
  }, [categories, categoryFilter, currentUser, canAccessDepartment]);

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
    // 이미 필터링된 항목들이므로 권한 체크 불필요
    // 모든 표시된 항목은 사용자가 상태 변경할 수 있는 항목

    const newCategories = categories.map(category =>
      category.id === categoryId
        ? {
            ...category,
            items: category.items.map(item =>
              item.id === itemId
                ? {
                   ...item,
                   status: newStatus,
                   checked: newStatus === '완료',
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
      if (item) {
        onTimelineUpdate(categoryId, itemId, newStatus);
      }
    }

    // 부모 컴포넌트에 체크리스트 변경 알림
    notifyChecklistChange(newCategories);
  };

  const updateSubItemStatus = (categoryId, itemId, subItemId, newStatus) => {
    const newCategories = categories.map(category =>
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
                  checked: allDone,
                };
              }
              return item;
            })
          }
        : category
    );

    // 부모 컴포넌트에 체크리스트 변경 알림
    notifyChecklistChange(newCategories);
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
      case '미진행': return <MdRadioButtonUnchecked className="w-5 h-5 text-gray-400" />;
      default: return <MdRadioButtonUnchecked className="w-5 h-5 text-gray-400" />;
    }
  };





  // 항목 수정 시작
  const handleEditStart = (categoryId, item) => {
    setEditingItemId(item.id);
    setEditForm({ title: item.item || item.title, assignee: item.assignee });
    setTimeout(() => { if (editInputRef.current) editInputRef.current.focus(); }, 100);
  };

  // 항목 수정 저장
  const handleEditSave = (categoryId, itemId) => {
    const newCategories = categories.map(category =>
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
    
    setEditingItemId(null);
  };

  // 항목 삭제
  const handleDeleteItem = (categoryId, itemId) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const newCategories = categories.map(category =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.filter(item => item.id !== itemId)
            }
          : category
      );
      
      // 부모 컴포넌트에 체크리스트 변경 알림
      notifyChecklistChange(newCategories);
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
    const newCategories = categories.map(category =>
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
    
    setEditingSubItemId(null);
  };

  // 하위 항목 삭제
  const handleDeleteSubItem = (categoryId, itemId, subItemId) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const newCategories = categories.map(category =>
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
      );
      
      // 부모 컴포넌트에 체크리스트 변경 알림
      notifyChecklistChange(newCategories);
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
            <div>
              <TitleTag className="text-2xl font-bold text-gray-800">
                {event ? event.title : '행사 정보 없음'}{titleSuffix}
              </TitleTag>
              {currentUser && currentUser.role !== 'super_admin' && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">{currentUser.department}</span> 부서 담당 항목만 표시
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {currentUser.role === 'admin' ? '관리자' : '사용자'}
                  </span>
                </p>
              )}
            </div>
          </div>
          
          {/* 관리 버튼들을 타이틀 옆으로 이동 */}
          <div className="flex gap-3">
            {/* 수동 추가 버튼 - 관리자 이상만 표시 */}
            {hasPermission('ADD_CHECKLIST_ITEMS') && (
              <button
                onClick={() => setShowManualAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <MdAdd className="w-4 h-4" />
                수동 추가
              </button>
            )}
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
                  {category.items.map(item => {
                    // 이미 필터링된 항목들이므로 모두 사용자가 접근할 수 있는 항목
                    // 체크박스(상태 변경) 권한: 모든 사용자 가능 (이미 자신의 부서 항목만 표시됨)
                    const canCheck = true;
                    
                    // 내용 수정/삭제 권한: 관리자 이상만 가능
                    const canEditContent = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';
                    
                    return (
                    <div key={item.id} className="p-4 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateItemStatus(category.id, item.id, 
                              item.status === '완료' ? '미진행' : '완료'
                            )}
                            className="flex items-center gap-2 p-2 rounded-lg transition-colors hover:bg-gray-50 cursor-pointer"
                            title="상태 변경"
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

                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-800">{item.item || item.title}</span>
                                
                                {/* 부서 정보 표시 */}
                                {item.department && (
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    canEditContent 
                                      ? 'bg-blue-100 text-blue-700' 
                                      : 'bg-green-100 text-green-700'
                                  }`}>
                                    {item.department}
                                    {canEditContent && <span className="ml-1">✏️</span>}
                                  </span>
                                )}
                                
                                {/* 당일 준비 카테고리이고 시간 정보가 있을 때 표시 */}
                                {category.id === 2 && item.time && (
                                  <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded flex items-center gap-1">
                                    <MdAccessTime className="w-3 h-3" />
                                    {item.time}
                                  </span>
                                )}
                              </div>
                            )}
                          </button>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>

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
                                onClick={() => setAddingSubItemToItem(item.id)}
                                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-gray-100 rounded-full transition-colors"
                                title="세부항목 추가"
                              >
                                <MdAdd className="w-4 h-4" />
                              </button>
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

                        {/* 세부항목 추가 폼 */}
                        {addingSubItemToItem === item.id && (
                          <div className="bg-gray-50 p-3 rounded border mt-3">
                            <div className="space-y-3">
                              <div>
                                <input
                                  type="text"
                                  value={newSubItemForExisting.title}
                                  onChange={(e) => setNewSubItemForExisting(prev => ({ ...prev, title: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="세부항목 제목을 입력하세요"
                                  autoFocus
                                />
                              </div>
                              
                              <div className="grid grid-cols-3 gap-2">
                                <select
                                  value={newSubItemForExisting.region}
                                  onChange={(e) => handleExistingSubItemRegionChange(e.target.value)}
                                  className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                  {regions.map(region => (
                                    <option key={region} value={region}>{region}</option>
                                  ))}
                                </select>
                                
                                <select
                                  value={newSubItemForExisting.department}
                                  onChange={(e) => setNewSubItemForExisting(prev => ({ ...prev, department: e.target.value }))}
                                  className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                  {regionDepartments[newSubItemForExisting.region]?.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                  )) || []}
                                </select>
                                
                                <input
                                  type="text"
                                  value={newSubItemForExisting.name}
                                  onChange={(e) => setNewSubItemForExisting(prev => ({ ...prev, name: e.target.value }))}
                                  className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  placeholder="이름"
                                />
                              </div>
                              
                              <div className="flex gap-2">
                                <button
                                  onClick={() => addSubItemToExistingItem(category.id, item.id)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                                >
                                  추가
                                </button>
                                <button
                                  onClick={cancelAddSubItem}
                                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 transition-colors"
                                >
                                  취소
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    );
                  })}
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
               const completedItems = category.items.filter(item => item.checked || item.status === '완료').length;
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
                  {filteredCategories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
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

              {/* 당일 준비 카테고리일 때만 시간 설정 표시 */}
              {newItemForm.categoryId === 2 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MdAccessTime className="inline w-4 h-4 mr-1" />
                    시간
                  </label>
                  <input
                    type="time"
                    value={newItemForm.time}
                    onChange={(e) => setNewItemForm(f => ({ ...f, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}








              {/* 세부항목 섹션 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">세부항목</label>
                
                {/* 기존 세부항목 목록 */}
                {newItemForm.subItems.length > 0 && (
                  <div className="mb-3 space-y-2">
                    {newItemForm.subItems.map((subItem, index) => (
                      <div key={subItem.id} className="flex items-center justify-between bg-gray-50 p-3 rounded border">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700 mb-1">
                            {index + 1}. {subItem.title}
                          </div>
                          {subItem.assignee && (
                            <div className="text-xs text-gray-500">
                              담당: {subItem.assignee}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSubItemFromNewItem(subItem.id)}
                          className="text-red-500 hover:text-red-700 text-sm ml-2"
                        >
                          <MdDelete className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 새 세부항목 추가 */}
                <div className="space-y-3 p-3 bg-gray-50 rounded border">
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
                      className="px-3 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors text-sm flex items-center gap-1"
                  >
                    <MdAdd className="w-4 h-4" />
                    추가
                  </button>
                </div>
                  
                  {/* 세부항목 담당자 설정 */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">지역</label>
                    <select
                      value={newSubItemForm.region}
                      onChange={(e) => handleSubItemRegionChange(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">부서</label>
                      <select
                        value={newSubItemForm.department}
                        onChange={(e) => setNewSubItemForm(f => ({ ...f, department: e.target.value }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {regionDepartments[newSubItemForm.region]?.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        )) || []}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">이름</label>
                      <input
                        type="text"
                        value={newSubItemForm.name}
                        onChange={(e) => setNewSubItemForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="이름"
                      />
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  세부항목을 추가하면 더 세밀한 작업 관리가 가능합니다. 각 세부항목마다 개별 담당자를 설정할 수 있습니다.
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