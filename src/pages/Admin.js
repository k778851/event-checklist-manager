import React, { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSave, MdClose } from 'react-icons/md';

const Admin = () => {
  // 고정된 부서 목록
  const DEPARTMENTS = [
    '총무부', '행정서무부', '자문회', '장년회', '부녀회', '청년회',
    '본부지역', '광산지역', '북구지역', '담양지역', '장성지역', '학생회', '유년회',
    '국제부', '기획부', '재정부', '교육부', '신학부', '해외선교부',
    '전도부', '문화부', '출판부', '정보통신부', '찬양부', '섭외부',
    '국내선교부', '홍보부', '법무부', '건설부', '체육부', '사업부',
    '보건후생복지부', '봉사교통부'
  ];

  // 사용자 관리 상태
  const [users, setUsers] = useState([
    { id: 1, name: '김관리', email: 'admin@example.com', department: '기획부', role: '총괄부서 관리자' },
    { id: 2, name: '이담당', email: 'hong@example.com', department: '홍보부', role: '부서 관리자' },
    { id: 3, name: '박실무', email: 'op@example.com', department: '전도부', role: '부서 관리자' }
  ]);

  // 사용자 수정 모드 상태
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    department: '',
    role: '부서 관리자'
  });

  // 사용자 관리 함수들
  const handleAddUser = () => {
    if (newUser.name.trim() === '' || newUser.email.trim() === '' || newUser.department === '') return;
    
    setUsers(prev => [...prev, {
      id: Date.now(),
      ...newUser
    }]);
    setNewUser({
      name: '',
      email: '',
      department: '',
      role: '부서 관리자'
    });
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleUpdateUser = () => {
    setUsers(prev => prev.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));
    setEditingUser(null);
  };

  const handleDeleteUser = (id) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">사용자 관리</h1>
      
      {/* 새 사용자 추가 */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="이름"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={newUser.name}
            onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
          />
          <input
            type="email"
            placeholder="이메일"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={newUser.email}
            onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
          />
          <select
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={newUser.department}
            onChange={(e) => setNewUser(prev => ({ ...prev, department: e.target.value }))}
          >
            <option value="">부서 선택</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={newUser.role}
            onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
          >
            <option value="부서 관리자">부서 관리자</option>
            <option value="총괄부서 관리자">총괄부서 관리자</option>
          </select>
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <MdAdd className="w-5 h-5" />
            사용자 추가
          </button>
        </div>
      </div>

      {/* 사용자 목록 */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 font-medium text-gray-600">
          <div className="col-span-2">이름</div>
          <div className="col-span-3">이메일</div>
          <div className="col-span-3">부서</div>
          <div className="col-span-2">권한</div>
          <div className="col-span-2">관리</div>
        </div>
        {users.map(user => (
          <div key={user.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 items-center">
            {editingUser?.id === user.id ? (
              <>
                <div className="col-span-2">
                  <input
                    type="text"
                    className="w-full px-3 py-1 border border-gray-200 rounded-lg"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="email"
                    className="w-full px-3 py-1 border border-gray-200 rounded-lg"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="col-span-3">
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
                  <select
                    className="w-full px-3 py-1 border border-gray-200 rounded-lg"
                    value={editingUser.role}
                    onChange={(e) => setEditingUser(prev => ({ ...prev, role: e.target.value }))}
                  >
                    <option value="부서 관리자">부서 관리자</option>
                    <option value="총괄부서 관리자">총괄부서 관리자</option>
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
                <div className="col-span-2">{user.name}</div>
                <div className="col-span-3">{user.email}</div>
                <div className="col-span-3">{user.department}</div>
                <div className="col-span-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === '총괄부서 관리자' 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <div className="col-span-2 flex gap-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="p-1 text-primary-600 hover:bg-primary-50 rounded-full"
                  >
                    <MdEdit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <MdDelete className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin; 