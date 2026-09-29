// Core TypeScript Data Models for Smart Placement Portal
export type Role = 'student' | 'admin';

export type PlacementStatus = 'Not Placed' | 'In Process' | 'Placed' | 'Multiple Offers';

export type ApplicationStatus =
  | 'Applied'
  | 'Shortlisted'
  | 'Assessment'
  | 'Interview'
  | 'Selected'
  | 'Rejected';

export interface Student {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  phone: string;
  location: string;
  collegeName: string;
  degree: string;
  department: string;
  graduationYear: number;
  cgpa: number;
  skills: string[];
  resumeName?: string;
  resumeUrl?: string;
  resumeUpdatedDate?: string;
  placementStatus: PlacementStatus;
  placedCompany?: string;
  placedPackage?: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  website: string;
  description: string;
  packageRange: string;
  minCgpa: number;
  requiredSkills: string[];
  activeJobsCount: number;
  logoColor?: string;
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  role: string;
  package: string;
  location: string;
  jobType: 'Full Time' | 'Internship' | 'Intern + FTE';
  minCgpa: number;
  eligibleDepartments: string[];
  graduationYear: number[];
  requiredSkills: string[];
  deadline: string;
  description: string;
  openings: number;
  selectionRounds: string[];
  postedDate: string;
}

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentDepartment: string;
  studentCgpa: number;
  jobId: string;
  companyName: string;
  role: string;
  appliedDate: string;
  status: ApplicationStatus;
  nextStep: string;
  notes?: string;
}

export interface Assessment {
  id: string;
  companyName: string;
  jobId?: string;
  assessmentName: string;
  date: string;
  time: string;
  duration: string;
  platform: string;
  status: 'Upcoming' | 'In Progress' | 'Completed';
  score?: string;
  topicsCovered: string[];
  totalQuestions?: number;
}

export interface Interview {
  id: string;
  applicationId?: string;
  studentId?: string;
  studentName?: string;
  companyName: string;
  role: string;
  interviewRound: 'HR Round' | 'Technical Round' | 'Managerial Round';
  date: string;
  time: string;
  mode: 'Online (Google Meet)' | 'In-Person (Campus Block B)' | 'Video Conference';
  status: 'Scheduled' | 'Completed' | 'Selected for Next Round' | 'Passed';
  meetingLink?: string;
  interviewer?: string;
}

export interface PrepTopicItem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
  notes?: string;
}

export interface PreparationCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  topics: PrepTopicItem[];
}

export interface NotificationItem {
  id: string;
  targetUser: 'all' | 'admin' | string;
  title: string;
  message: string;
  timestamp: string;
  type: 'job' | 'status' | 'interview' | 'assessment' | 'info';
  read: boolean;
  linkTab?: string;
}

export interface EligibilityResult {
  isEligible: boolean;
  reasons: string[];
  missingSkills: string[];
  cgpaPassed: boolean;
  deptPassed: boolean;
  gradYearPassed: boolean;
}
