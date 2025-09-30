import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 권한 레벨
export const ROLES = {
  SUPER_ADMIN: 'super_admin',    // 총괄관리자
  ADMIN: 'admin',                // 관리자
  USER: 'user'                   // 사용자
};

// 권한별 기능
export const PERMISSIONS = {
  // 전체 접근 권한
  VIEW_ALL_EVENTS: [ROLES.SUPER_ADMIN],
  VIEW_ALL_CHECKLISTS: [ROLES.SUPER_ADMIN],
  
  // 관리 기능
  MANAGE_EVENTS: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  UPLOAD_EXCEL: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  ADD_CHECKLIST_ITEMS: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  EDIT_CHECKLIST_CONTENT: [ROLES.SUPER_ADMIN, ROLES.ADMIN], // 내용 수정/삭제
  DELETE_CHECKLIST_ITEMS: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  
  // 사용자 관리
  MANAGE_USERS: [ROLES.SUPER_ADMIN],
  
  // 기본 접근
  VIEW_OWN_DEPARTMENT: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.USER],
  UPDATE_CHECKLIST_STATUS: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.USER]
};

export const AuthProvider = ({ children }) => {
  // 현재 로그인한 사용자 정보
  const [currentUser, setCurrentUser] = useState(() => {
    // localStorage에서 사용자 정보 복원
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    
    // 기본값: 총괄관리자로 설정 (개발용)
    return {
      id: 1,
      name: '김총괄',
      email: 'admin@example.com',
      role: ROLES.SUPER_ADMIN,
      department: '본부',
      region: '본부'
    };
  });

  // 사용자 정보 변경 시 localStorage에 저장
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // 권한 확인 함수
  const hasPermission = (permission) => {
    if (!currentUser || !PERMISSIONS[permission]) {
      return false;
    }
    return PERMISSIONS[permission].includes(currentUser.role);
  };

  // 부서별 접근 권한 확인
  const canAccessDepartment = (department) => {
    if (!currentUser) return false;
    
    // 총괄관리자는 모든 부서 접근 가능
    if (currentUser.role === ROLES.SUPER_ADMIN) {
      return true;
    }
    
    // 관리자와 사용자는 자신의 부서만 접근 가능
    return currentUser.department === department;
  };

  // 지역별 접근 권한 확인
  const canAccessRegion = (region) => {
    if (!currentUser) return false;
    
    // 총괄관리자는 모든 지역 접근 가능
    if (currentUser.role === ROLES.SUPER_ADMIN) {
      return true;
    }
    
    // 관리자와 사용자는 자신의 지역만 접근 가능
    return currentUser.region === region;
  };

  // 로그인 함수
  const login = (userData) => {
    setCurrentUser(userData);
  };

  // 로그아웃 함수
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // 사용자 권한 변경 (개발/테스트용)
  const switchRole = (newRole, department = '본부', region = '본부') => {
    const updatedUser = {
      ...currentUser,
      role: newRole,
      department,
      region
    };
    setCurrentUser(updatedUser);
  };

  const value = {
    currentUser,
    login,
    logout,
    switchRole,
    hasPermission,
    canAccessDepartment,
    canAccessRegion,
    ROLES,
    PERMISSIONS
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
