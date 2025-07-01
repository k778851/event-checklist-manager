import React, { useState } from 'react';
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
  categoryFilter
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
  // props로 받은 event가 있으면 그걸 사용, 없으면 기존 방식
  const event = propEvent || events.find(e => String(e.id) === String(id));
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "사전 준비",
      items: [
        {
          id: 1,
          title: "행사장 예약",
          type: "사전",
          status: "완료",
          assignee: "기획부",
          note: "대강당 예약 완료",
          checkDate: "2024-01-10",
          subItems: [
            { id: 11, title: "대강당 예약", status: "완료", assignee: "기획부" },
            { id: 12, title: "음향시설 확인", status: "진행중", assignee: "기획부" }
          ]
        },
        {
          id: 2,
          title: "홍보물 제작",
          type: "사전",
          status: "진행중",
          assignee: "홍보부",
          note: "포스터 디자인 진행중",
          checkDate: null,
          subItems: [
            { id: 21, title: "포스터 디자인", status: "진행중", assignee: "홍보부" },
            { id: 22, title: "전단지 제작", status: "미진행", assignee: "홍보부" }
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
          assignee: "기획부",
          note: "당일 오전 8시 시작",
          checkDate: null,
          subItems: [
            { id: 31, title: "의자 배치", status: "미진행", assignee: "기획부" },
            { id: 32, title: "음향 테스트", status: "미진행", assignee: "기획부" }
          ]
        }
      ]
    }
  ]);

  const [expandedCategories, setExpandedCategories] = useState(new Set([1, 2]));
  const [editingItem, setEditingItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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
    setCategories(prevCategories =>
      prevCategories.map(category =>
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
      )
    );
  };

  const updateSubItemStatus = (categoryId, itemId, subItemId, newStatus) => {
    setCategories(prevCategories =>
      prevCategories.map(category =>
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
      )
    );
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
                note: row['비고'] || '',
                checkDate: null,
                time: isDay ? row['시간'] || '' : undefined,
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
          '시간': item.type === '당일' ? (item.time || '') : ''
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '체크리스트');
    
    const fileName = `${event.title}_체크리스트_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const TitleTag = titleTag;

  // 카테고리 필터링 적용
  const filteredCategories = categoryFilter
    ? categories.filter(category => category.name === categoryFilter)
    : categories;

  return (
    <div className="p-6 md:p-8">
      {!hideHeader && (
        <div className="mb-6 flex items-center gap-4">
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
      )}
      {/* 헤더 및 액션 버튼 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">체크리스트 관리</h2>
          <p className="text-gray-600">사전 항목과 당일 항목을 관리하세요</p>
        </div>
        <div className="flex gap-3">
          <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2">
            <MdUpload className="w-4 h-4" />
            Excel 업로드
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelUpload}
              className="hidden"
            />
          </label>
          <div className="flex gap-1">
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
                          <span className="font-medium text-gray-800">{item.title}</span>
                        </button>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.type === '사전' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {item.type}
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
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setShowEditModal(true);
                          }}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <MdEdit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* 항목 상세 정보 */}
                    <div className="ml-8 space-y-2">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MdPerson className="w-4 h-4" />
                          <span>{item.assignee || '담당자 미지정'}</span>
                        </div>
                        {item.note && (
                          <div className="flex items-center gap-1">
                            <MdNote className="w-4 h-4" />
                            <span>{item.note}</span>
                          </div>
                        )}
                      </div>

                      {/* 하위 항목들 */}
                      {item.subItems && item.subItems.length > 0 && (
                        <div className="ml-4 space-y-2">
                          {item.subItems.map(subItem => (
                            <div key={subItem.id} className="flex items-center gap-3">
                              <button
                                onClick={() => updateSubItemStatus(category.id, item.id, subItem.id,
                                  subItem.status === '완료' ? '미진행' : '완료'
                                )}
                                className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded transition-colors"
                              >
                                {getStatusIcon(subItem.status)}
                                <span className="text-sm text-gray-700">{subItem.title}</span>
                              </button>
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(subItem.status)}`}>
                                {subItem.status}
                              </span>
                              <span className="text-xs text-gray-500">{subItem.assignee}</span>
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
  );
};

export default ChecklistView; 