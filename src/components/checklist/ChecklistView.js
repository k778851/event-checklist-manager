import React, { useState, useRef } from 'react';
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

const ChecklistView = ({ event, checklistType = 'pre' }) => {
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
  const [editingItemId, setEditingItemId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', assignee: '', note: '' });
  const editInputRef = useRef();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // checklistType에 따라 보여줄 카테고리 필터링
  const filteredCategories = categories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      checklistType === 'pre' ? item.type === '사전' : item.type === '당일'
    )
  })).filter(category => category.items.length > 0);

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
                  ? { ...item, status: newStatus }
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
              items: category.items.map(item =>
                item.id === itemId
                  ? {
                      ...item,
                      subItems: item.subItems.map(subItem =>
                        subItem.id === subItemId
                          ? { ...subItem, status: newStatus }
                          : subItem
                      )
                    }
                  : item
              )
            }
          : category
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '완료': return 'bg-green-100 text-green-600';
      case '진행중': return 'bg-blue-100 text-blue-600';
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
              currentCategory.items.push({
                id: Date.now() + index + 1000,
                title: row['항목명'],
                type: row['구분'] || '사전',
                status: '미진행',
                assignee: row['담당자'] || '',
                note: row['비고'] || '',
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
          '체크일': item.checkDate || ''
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
    setEditForm({ title: item.title, assignee: item.assignee, note: item.note });
    setTimeout(() => { if (editInputRef.current) editInputRef.current.focus(); }, 100);
  };

  // 항목 수정 저장
  const handleEditSave = (categoryId, itemId) => {
    setCategories(prevCategories =>
      prevCategories.map(category =>
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
      )
    );
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

  return (
    <div className="space-y-6">
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
                            item.status === '완료' ? '미진행' : 
                            item.status === '미진행' ? '진행중' : '완료'
                          )}
                          className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                          {getStatusIcon(item.status)}
                          {editingItemId === item.id ? (
                            <input
                              ref={editInputRef}
                              className="border-b border-primary-300 outline-none px-1 text-gray-800 font-medium bg-gray-50"
                              value={editForm.title}
                              onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                              onKeyDown={e => { if (e.key === 'Enter') handleEditSave(category.id, item.id); }}
                            />
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
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MdPerson className="w-4 h-4" />
                          {editingItemId === item.id ? (
                            <input
                              className="border-b border-primary-200 outline-none px-1 bg-gray-50"
                              value={editForm.assignee}
                              onChange={e => setEditForm(f => ({ ...f, assignee: e.target.value }))}
                            />
                          ) : (
                            <span>{item.assignee || '담당자 미지정'}</span>
                          )}
                        </div>
                        {editingItemId === item.id ? (
                          <div className="flex items-center gap-1">
                            <MdNote className="w-4 h-4" />
                            <input
                              className="border-b border-primary-200 outline-none px-1 bg-gray-50"
                              value={editForm.note}
                              onChange={e => setEditForm(f => ({ ...f, note: e.target.value }))}
                            />
                          </div>
                        ) : item.note && (
                          <div className="flex items-center gap-1">
                            <MdNote className="w-4 h-4" />
                            <span>{item.note}</span>
                          </div>
                        )}
                        {item.checkDate && (
                          <div className="flex items-center gap-1">
                            <MdSchedule className="w-4 h-4" />
                            <span>{item.checkDate}</span>
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
                                  subItem.status === '완료' ? '미진행' : 
                                  subItem.status === '미진행' ? '진행중' : '완료'
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

      {/* 통계 정보 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">진행 현황</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {categories.map(category => {
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