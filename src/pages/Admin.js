import React, { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSave, MdClose, MdInfo, MdSearch, MdSecurity } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';

const Admin = () => {
  const { currentUser, hasPermission, ROLES } = useAuth();
  
  // 고정된 지역 목록
  const REGIONS = ['본부', '북구', '광산', '담양', '장성'];
  
  // 고정된 부서 목록
  const DEPARTMENTS = [
    '총무부', '행정서무부', '자문회', '장년회', '부녀회', '청년회',
    '본부지역', '광산지역', '북구지역', '담양지역', '장성지역', '학생회', '유년회',
    '국제부', '기획부', '재정부', '교육부', '신학부', '해외선교부',
    '전도부', '문화부', '출판부', '정보통신부', '찬양부', '섭외부',
    '국내선교부', '홍보부', '법무부', '건설부', '체육부', '사업부',
    '보건후생복지부', '봉사교통부'
  ];

  // 권한에 따른 역할 라벨
  const getRoleLabel = (role) => {
    switch (role) {
      case ROLES.SUPER_ADMIN: return '총괄관리자';
      case ROLES.ADMIN: return '관리자';
      case ROLES.USER: return '사용자';
      default: return '알 수 없음';
    }
  };

  // 고유번호 생성 함수
  function generateUniqueId() {
    // 8자리-5자리 랜덤
    const part1 = Math.random().toString().slice(2, 10).padEnd(8, '0');
    const part2 = Math.random().toString().slice(2, 7).padEnd(5, '0');
    return `${part1}-${part2}`;
  }

  // 사용자 관리 상태
  const [users, setUsers] = useState([
    { id: 1, name: '김총괄', region: '본부', department: '본부', role: ROLES.SUPER_ADMIN, uniqueId: '00420000-00123' },
    { id: 2, name: '이관리', region: '본부', department: '기획부', role: ROLES.ADMIN, uniqueId: '00420000-00124' },
    { id: 3, name: '박홍보', region: '북구', department: '홍보부', role: ROLES.ADMIN, uniqueId: '00420000-00125' },
    { id: 4, name: '최찬양', region: '광산', department: '찬양부', role: ROLES.USER, uniqueId: '00420000-00126' },
    { id: 5, name: '정전도', region: '서구', department: '전도부', role: ROLES.USER, uniqueId: '00420000-00127' }
  ]);

  // 사용자 수정 모드 상태
  const [editingUser, setEditingUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    region: '',
    department: '',
    role: ROLES.USER,
    uniqueId: ''
  });

  // 검색 및 필터링 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  // 권한 확인 함수들
  const isSuperAdmin = () => currentUser?.role === ROLES.SUPER_ADMIN;
  const canEditRole = () => hasPermission('MANAGE_USERS');
  const canEditUser = (user) => {
    if (!currentUser) return false;
    
    // 총괄관리자는 모든 사용자 편집 가능
    if (currentUser.role === ROLES.SUPER_ADMIN) return true;
    
    // 관리자는 자신의 부서 내 사용자만 편집 가능 (단, 다른 관리자나 총괄관리자는 편집 불가)
    if (currentUser.role === ROLES.ADMIN) {
      return user.department === currentUser.department && user.role === ROLES.USER;
    }
    
    return false;
  };

  // 필터링된 사용자 목록
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.uniqueId.includes(searchTerm);
    
    const matchesRegion = selectedRegion === '' || user.region === selectedRegion;
    const matchesDepartment = selectedDepartment === '' || user.department === selectedDepartment;
    const matchesRole = selectedRole === '' || user.role === selectedRole;
    
    return matchesSearch && matchesRegion && matchesDepartment && matchesRole;
  });

  // 사용자 관리 함수들
  const handleAddUser = () => {
    if (newUser.name.trim() === '' || newUser.region === '' || newUser.department === '' || newUser.uniqueId.trim() === '') {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    
    // 고유번호 형식 검증 (8자리-5자리)
    const uniqueIdPattern = /^\d{8}-\d{5}$/;
    if (!uniqueIdPattern.test(newUser.uniqueId)) {
      alert('고유번호는 8자리-5자리 형식(예: 00371210-00149)으로 입력해주세요.');
      return;
    }
    
    // 중복 고유번호 확인
    const isDuplicate = users.some(user => user.uniqueId === newUser.uniqueId);
    if (isDuplicate) {
      alert('이미 존재하는 고유번호입니다.');
      return;
    }
    
    // 권한 수정 제한
    if (!canEditRole() && newUser.role !== '사용자') {
      alert('권한 수정은 총괄관리자만 가능합니다.');
      return;
    }
    
    setUsers(prev => [...prev, {
      id: Date.now(),
      ...newUser
    }]);
    
    // 모달 닫기 및 폼 초기화
    setShowAddModal(false);
    setNewUser({
      name: '',
      region: '',
      department: '',
      role: '사용자',
      uniqueId: ''
    });
  };

  const handleEditUser = (user) => {
    if (!canEditUser(user)) {
      alert('해당 사용자를 수정할 권한이 없습니다.');
      return;
    }
    setEditingUser(user);
  };

  const handleUpdateUser = () => {
    // 권한 수정 제한
    if (!canEditRole() && editingUser.role !== users.find(u => u.id === editingUser.id)?.role) {
      alert('권한 수정은 총괄관리자만 가능합니다.');
      return;
    }
    
    setUsers(prev => prev.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));
    setEditingUser(null);
  };

  const handleDeleteUser = (id) => {
    const userToDelete = users.find(u => u.id === id);
    if (!canEditUser(userToDelete)) {
      alert('해당 사용자를 삭제할 권한이 없습니다.');
      return;
    }
    
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setUsers(prev => prev.filter(user => user.id !== id));
    }
  };

  // 검색 초기화
  const resetSearch = () => {
    setSearchTerm('');
    setSelectedRegion('');
    setSelectedDepartment('');
    setSelectedRole('');
  };

  return (
    <div className="p-8">
      {/* 타이틀과 사용자 추가 버튼을 한 줄에 배치 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">사용자 관리</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <MdAdd className="w-5 h-5" />
          사용자 추가
        </button>
      </div>
      
      {/* 현재 사용자 정보 표시 */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4 flex items-center gap-2">
        <MdSecurity className="w-5 h-5 text-blue-600" />
        <span className="text-blue-800 text-sm">
          현재 로그인: <b>{currentUser?.name}</b> ({currentUser?.department}) - <b>{getRoleLabel(currentUser?.role)}</b>
        </span>
      </div>
      
      <p className="text-gray-600 mb-6 text-sm flex items-center gap-2">
        <MdInfo className="w-5 h-5 text-primary-500" />
        권한 안내: <b>총괄관리자</b>는 모든 부서를 관리할 수 있고, <b>관리자</b>는 자신의 부서만 관리할 수 있으며, <b>사용자</b>는 기본 권한을 가집니다.
        {!canEditRole() && <span className="text-red-600 font-medium">권한 수정은 총괄관리자만 가능합니다.</span>}
      </p>

      {/* 검색 및 필터링 */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 flex-1 min-w-64">
            <MdSearch className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="이름 또는 고유번호로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">전체 지역</option>
            {REGIONS.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">전체 부서</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">전체 권한</option>
            <option value="총괄관리자">총괄관리자</option>
            <option value="관리자">관리자</option>
            <option value="사용자">사용자</option>
          </select>
          
          <button
            onClick={resetSearch}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            초기화
          </button>
        </div>
      </div>

      {/* 사용자 목록 */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 font-medium text-gray-600">
          <div className="col-span-2">지역</div>
          <div className="col-span-2">부서</div>
          <div className="col-span-2">이름</div>
          <div className="col-span-2">고유번호</div>
          <div className="col-span-2">권한</div>
          <div className="col-span-2">편집</div>
        </div>
        {filteredUsers.map(user => (
          <div key={user.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 items-center">
            {editingUser?.id === user.id ? (
              <>
                <div className="col-span-2">
                  <select
                    className="w-full px-3 py-1 border border-gray-200 rounded-lg"
                    value={editingUser.region}
                    onChange={(e) => setEditingUser(prev => ({ ...prev, region: e.target.value }))}
                  >
                    {REGIONS.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <select
                    className="w-full px-3 py-1 border border-gray-200 rounded-lg"
                    value={editingUser.department}
                    onChange={(e) => setEditingUser(prev => ({ ...prev, department: e.target.value }))}
                  >
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    className="w-full px-3 py-1 border border-gray-200 rounded-lg"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    className="w-full px-3 py-1 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
                    value={editingUser.uniqueId}
                    disabled
                  />
                </div>
                <div className="col-span-2">
                  <select
                    className={`w-full px-3 py-1 border border-gray-200 rounded-lg ${
                      !canEditRole() ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    value={editingUser.role}
                    onChange={(e) => setEditingUser(prev => ({ ...prev, role: e.target.value }))}
                    disabled={!canEditRole()}
                  >
                    <option value="사용자">사용자</option>
                    {canEditRole() && <option value="관리자">관리자</option>}
                    {canEditRole() && <option value="총괄관리자">총괄관리자</option>}
                  </select>
                </div>
                <div className="col-span-2 flex gap-2">
                  <button
                    onClick={handleUpdateUser}
                    className="p-1 text-primary-600 hover:bg-primary-50 rounded-full"
                  >
                    <MdSave className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"
                  >
                    <MdClose className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="col-span-2">{user.region}</div>
                <div className="col-span-2">{user.department}</div>
                <div className="col-span-2">{user.name}</div>
                <div className="col-span-2 font-mono tracking-wider">{user.uniqueId}</div>
                <div className="col-span-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === '총괄관리자' 
                      ? 'bg-primary-50 text-primary-600' 
                      : user.role === '관리자'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <div className="col-span-2 flex gap-2">
                  {canEditUser(user) && (
                    <button
                      onClick={() => handleEditUser(user)}
                      className="p-1 text-primary-600 hover:bg-primary-50 rounded-full"
                    >
                      <MdEdit className="w-5 h-5" />
                    </button>
                  )}
                  {canEditUser(user) && (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  )}
                  {!canEditUser(user) && (
                    <span className="text-xs text-gray-400 px-2">권한 없음</span>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* 사용자 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">새 사용자 추가</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  지역 *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={newUser.region}
                  onChange={(e) => setNewUser(prev => ({ ...prev, region: e.target.value }))}
                  required
                >
                  <option value="">지역을 선택하세요</option>
                  {REGIONS.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  부서 *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={newUser.department}
                  onChange={(e) => setNewUser(prev => ({ ...prev, department: e.target.value }))}
                  required
                >
                  <option value="">부서를 선택하세요</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이름 *
                </label>
                <input
                  type="text"
                  placeholder="이름을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  고유번호 *
                </label>
                <input
                  type="text"
                  placeholder="예: 00371210-00149"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                  value={newUser.uniqueId}
                  onChange={(e) => setNewUser(prev => ({ ...prev, uniqueId: e.target.value }))}
                  pattern="[0-9]{8}-[0-9]{5}"
                  maxLength={14}
                  required
                />
                <div className="mt-1 text-xs text-gray-500">
                  하이픈(-)을 포함하여 8자리-5자리 형식으로 입력
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  권한 *
                </label>
                <select
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    !canEditRole() ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                  disabled={!canEditRole()}
                  required
                >
                  <option value="사용자">사용자</option>
                  {canEditRole() && <option value="관리자">관리자</option>}
                  {canEditRole() && <option value="총괄관리자">총괄관리자</option>}
                </select>
                {!canEditRole() && (
                  <div className="mt-1 text-xs text-red-500">
                    권한 수정은 총괄관리자만 가능합니다
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin; 