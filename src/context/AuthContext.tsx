import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, Student } from '../types';
import { StorageService } from '../services/storage';

interface AuthContextType {
  userRole: Role | null;
  currentStudent: Student | null;
  adminUser: { email: string; name: string } | null;
  login: (email: string, pass: string, roleHint?: Role) => { success: boolean; message: string };
  quickDemoLogin: (role: Role) => void;
  registerStudent: (data: Omit<Student, 'id' | 'placementStatus' | 'createdAt'>) => { success: boolean; message: string };
  updateCurrentStudent: (updated: Partial<Student>) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [adminUser, setAdminUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    StorageService.init();

    const savedRole = localStorage.getItem('spms_session_role') as Role | null;
    const savedUserId = localStorage.getItem('spms_session_user_id');

    if (savedRole === 'student' && savedUserId) {
      const student = StorageService.getStudentById(savedUserId);
      if (student) {
        setUserRole('student');
        setCurrentStudent(student);
      }
    } else if (savedRole === 'admin') {
      setUserRole('admin');
      setAdminUser({ email: 'admin@example.com', name: 'Placement Dean / Admin' });
    }
  }, []);

  const login = (email: string, pass: string, roleHint?: Role) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (roleHint === 'admin' || cleanEmail === 'admin@example.com') {
      if (cleanEmail === 'admin@example.com' && cleanPass === 'admin123') {
        setUserRole('admin');
        setAdminUser({ email: 'admin@example.com', name: 'Placement Dean / Admin' });
        setCurrentStudent(null);
        localStorage.setItem('spms_session_role', 'admin');
        localStorage.removeItem('spms_session_user_id');
        return { success: true, message: 'Logged in successfully as Administrator' };
      }
      return { success: false, message: 'Invalid Admin credentials. Try admin@example.com / admin123' };
    }

    const allStudents = StorageService.getStudents();
    const foundStudent = allStudents.find((s) => s.email.trim().toLowerCase() === cleanEmail);

    if (foundStudent) {
      if (foundStudent.password === cleanPass || cleanPass === 'student123') {
        setUserRole('student');
        setCurrentStudent(foundStudent);
        setAdminUser(null);
        localStorage.setItem('spms_session_role', 'student');
        localStorage.setItem('spms_session_user_id', foundStudent.id);
        return { success: true, message: `Welcome back, ${foundStudent.fullName}!` };
      }
      return { success: false, message: 'Incorrect password. (Demo password: student123)' };
    }

    return {
      success: false,
      message: 'No student account found with this email. Please register or use demo credentials.',
    };
  };

  const quickDemoLogin = (role: Role) => {
    if (role === 'admin') {
      login('admin@example.com', 'admin123', 'admin');
    } else {
      login('student@example.com', 'student123', 'student');
    }
  };

  const registerStudent = (data: Omit<Student, 'id' | 'placementStatus' | 'createdAt'>) => {
    const existing = StorageService.getStudentByEmail(data.email);
    if (existing) {
      return { success: false, message: 'An account with this email already exists!' };
    }

    const newStudent: Student = {
      ...data,
      id: `std-${Date.now()}`,
      placementStatus: 'In Process',
      createdAt: new Date().toISOString().split('T')[0],
      resumeName: data.resumeName || 'Student_Resume.pdf',
    };

    StorageService.saveStudent(newStudent);
    setUserRole('student');
    setCurrentStudent(newStudent);
    localStorage.setItem('spms_session_role', 'student');
    localStorage.setItem('spms_session_user_id', newStudent.id);

    StorageService.createNotification({
      targetUser: 'admin',
      title: 'New Student Registered',
      message: `${newStudent.fullName} (${newStudent.department}, CGPA: ${newStudent.cgpa}) created an account.`,
      type: 'info',
      linkTab: 'students',
    });

    return { success: true, message: 'Account created successfully!' };
  };

  const updateCurrentStudent = (updated: Partial<Student>) => {
    if (!currentStudent) return;
    const modified: Student = { ...currentStudent, ...updated };
    setCurrentStudent(modified);
    StorageService.saveStudent(modified);
  };

  const logout = () => {
    setUserRole(null);
    setCurrentStudent(null);
    setAdminUser(null);
    localStorage.removeItem('spms_session_role');
    localStorage.removeItem('spms_session_user_id');
  };

  return (
    <AuthContext.Provider
      value={{
        userRole,
        currentStudent,
        adminUser,
        login,
        quickDemoLogin,
        registerStudent,
        updateCurrentStudent,
        logout,
        isAuthenticated: !!userRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
