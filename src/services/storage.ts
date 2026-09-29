import {
  Student,
  Company,
  Job,
  Application,
  Assessment,
  Interview,
  PreparationCategory,
  NotificationItem,
  EligibilityResult,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_COMPANIES,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
  INITIAL_ASSESSMENTS,
  INITIAL_INTERVIEWS,
  INITIAL_PREPARATION_CATEGORIES,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';

const STORAGE_KEYS = {
  STUDENTS: 'spms_students_v1',
  COMPANIES: 'spms_companies_v1',
  JOBS: 'spms_jobs_v1',
  APPLICATIONS: 'spms_applications_v1',
  ASSESSMENTS: 'spms_assessments_v1',
  INTERVIEWS: 'spms_interviews_v1',
  PREPARATION: 'spms_preparation_v1',
  NOTIFICATIONS: 'spms_notifications_v1',
  CURRENT_USER: 'spms_current_user_v1',
};

// Safe JSON parser
function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Dispatch custom event for reactive updates in the app
    window.dispatchEvent(new Event('spms_storage_updated'));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

export const StorageService = {
  // Initialize storage with sample data if first time
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      safeSet(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMPANIES)) {
      safeSet(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.JOBS)) {
      safeSet(STORAGE_KEYS.JOBS, INITIAL_JOBS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
      safeSet(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ASSESSMENTS)) {
      safeSet(STORAGE_KEYS.ASSESSMENTS, INITIAL_ASSESSMENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.INTERVIEWS)) {
      safeSet(STORAGE_KEYS.INTERVIEWS, INITIAL_INTERVIEWS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PREPARATION)) {
      safeSet(STORAGE_KEYS.PREPARATION, INITIAL_PREPARATION_CATEGORIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      safeSet(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    }
  },

  // Reset entire system to fresh sample dataset
  resetToSampleData() {
    safeSet(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    safeSet(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
    safeSet(STORAGE_KEYS.JOBS, INITIAL_JOBS);
    safeSet(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    safeSet(STORAGE_KEYS.ASSESSMENTS, INITIAL_ASSESSMENTS);
    safeSet(STORAGE_KEYS.INTERVIEWS, INITIAL_INTERVIEWS);
    safeSet(STORAGE_KEYS.PREPARATION, INITIAL_PREPARATION_CATEGORIES);
    safeSet(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },

  // --- Students ---
  getStudents(): Student[] {
    return safeGet<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  },
  getStudentById(id: string): Student | undefined {
    return this.getStudents().find((s) => s.id === id);
  },
  getStudentByEmail(email: string): Student | undefined {
    return this.getStudents().find(
      (s) => s.email.trim().toLowerCase() === email.trim().toLowerCase()
    );
  },
  saveStudent(student: Student): void {
    const list = this.getStudents();
    const index = list.findIndex((s) => s.id === student.id);
    if (index >= 0) {
      list[index] = student;
    } else {
      list.unshift(student);
    }
    safeSet(STORAGE_KEYS.STUDENTS, list);
  },

  // --- Companies ---
  getCompanies(): Company[] {
    return safeGet<Company[]>(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
  },
  saveCompany(company: Company): void {
    const list = this.getCompanies();
    const index = list.findIndex((c) => c.id === company.id);
    if (index >= 0) {
      list[index] = company;
    } else {
      list.unshift(company);
    }
    safeSet(STORAGE_KEYS.COMPANIES, list);
  },
  deleteCompany(companyId: string): void {
    const list = this.getCompanies().filter((c) => c.id !== companyId);
    safeSet(STORAGE_KEYS.COMPANIES, list);
  },

  // --- Jobs ---
  getJobs(): Job[] {
    return safeGet<Job[]>(STORAGE_KEYS.JOBS, INITIAL_JOBS);
  },
  getJobById(id: string): Job | undefined {
    return this.getJobs().find((j) => j.id === id);
  },
  saveJob(job: Job): void {
    const list = this.getJobs();
    const index = list.findIndex((j) => j.id === job.id);
    if (index >= 0) {
      list[index] = job;
    } else {
      list.unshift(job);
    }
    safeSet(STORAGE_KEYS.JOBS, list);
  },
  deleteJob(jobId: string): void {
    const list = this.getJobs().filter((j) => j.id !== jobId);
    safeSet(STORAGE_KEYS.JOBS, list);
  },

  // --- Applications ---
  getApplications(): Application[] {
    return safeGet<Application[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  },
  getApplicationsByStudent(studentId: string): Application[] {
    return this.getApplications().filter((a) => a.studentId === studentId);
  },
  hasStudentApplied(studentId: string, jobId: string): boolean {
    return this.getApplications().some(
      (a) => a.studentId === studentId && a.jobId === jobId
    );
  },
  createApplication(app: Omit<Application, 'id' | 'appliedDate' | 'status' | 'nextStep'>): Application {
    const newApp: Application = {
      ...app,
      id: `app-${Date.now()}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      nextStep: 'Application submitted & undergoing initial eligibility verification',
    };
    const list = this.getApplications();
    list.unshift(newApp);
    safeSet(STORAGE_KEYS.APPLICATIONS, list);

    // Also push a notification for the student
    this.createNotification({
      targetUser: app.studentId,
      title: `Application Submitted: ${app.companyName}`,
      message: `You applied for ${app.role} at ${app.companyName}. Track progress in My Applications.`,
      type: 'status',
      linkTab: 'applications',
    });

    return newApp;
  },
  updateApplicationStatus(appId: string, newStatus: Application['status'], notes?: string): void {
    const list = this.getApplications();
    const target = list.find((a) => a.id === appId);
    if (target) {
      target.status = newStatus;
      if (notes) target.notes = notes;

      if (newStatus === 'Shortlisted') {
        target.nextStep = 'Shortlisted! Prepare for technical coding assessment.';
      } else if (newStatus === 'Assessment') {
        target.nextStep = 'Online assessment link dispatched. Check your schedule.';
      } else if (newStatus === 'Interview') {
        target.nextStep = 'Interview round scheduled. Review interview tracker.';
      } else if (newStatus === 'Selected') {
        target.nextStep = 'Congratulations! Selected. Offer letter in dispatch process.';
      } else if (newStatus === 'Rejected') {
        target.nextStep = 'Process completed. Thank you for participating.';
      }

      safeSet(STORAGE_KEYS.APPLICATIONS, list);

      // Auto notify the student
      this.createNotification({
        targetUser: target.studentId,
        title: `Status Update: ${target.companyName} (${target.role})`,
        message: `Your application status has been updated to "${newStatus}". Next step: ${target.nextStep}`,
        type: newStatus === 'Interview' ? 'interview' : newStatus === 'Assessment' ? 'assessment' : 'status',
        linkTab: 'applications',
      });
    }
  },

  // --- Assessments ---
  getAssessments(): Assessment[] {
    return safeGet<Assessment[]>(STORAGE_KEYS.ASSESSMENTS, INITIAL_ASSESSMENTS);
  },
  saveAssessment(assessment: Assessment): void {
    const list = this.getAssessments();
    const index = list.findIndex((a) => a.id === assessment.id);
    if (index >= 0) {
      list[index] = assessment;
    } else {
      list.unshift(assessment);
    }
    safeSet(STORAGE_KEYS.ASSESSMENTS, list);
  },
  markAssessmentCompleted(id: string, score: string = 'Completed'): void {
    const list = this.getAssessments();
    const target = list.find((a) => a.id === id);
    if (target) {
      target.status = 'Completed';
      target.score = score;
      safeSet(STORAGE_KEYS.ASSESSMENTS, list);
    }
  },

  // --- Interviews ---
  getInterviews(): Interview[] {
    return safeGet<Interview[]>(STORAGE_KEYS.INTERVIEWS, INITIAL_INTERVIEWS);
  },
  saveInterview(interview: Interview): void {
    const list = this.getInterviews();
    const index = list.findIndex((i) => i.id === interview.id);
    if (index >= 0) {
      list[index] = interview;
    } else {
      list.unshift(interview);
    }
    safeSet(STORAGE_KEYS.INTERVIEWS, list);

    if (interview.studentId) {
      this.createNotification({
        targetUser: interview.studentId,
        title: `Interview Scheduled: ${interview.companyName}`,
        message: `${interview.interviewRound} for ${interview.role} on ${interview.date} at ${interview.time} (${interview.mode}).`,
        type: 'interview',
        linkTab: 'interviews',
      });
    }
  },

  // --- Preparation ---
  getPreparationCategories(): PreparationCategory[] {
    return safeGet<PreparationCategory[]>(
      STORAGE_KEYS.PREPARATION,
      INITIAL_PREPARATION_CATEGORIES
    );
  },
  toggleTopicCompletion(categoryId: string, topicId: string): PreparationCategory[] {
    const categories = this.getPreparationCategories();
    const cat = categories.find((c) => c.id === categoryId);
    if (cat) {
      const topic = cat.topics.find((t) => t.id === topicId);
      if (topic) {
        topic.completed = !topic.completed;
        safeSet(STORAGE_KEYS.PREPARATION, categories);
      }
    }
    return categories;
  },

  // --- Notifications ---
  getNotifications(userId: string = 'std-101', role: 'student' | 'admin' = 'student'): NotificationItem[] {
    const all = safeGet<NotificationItem[]>(
      STORAGE_KEYS.NOTIFICATIONS,
      INITIAL_NOTIFICATIONS
    );
    if (role === 'admin') {
      return all.filter((n) => n.targetUser === 'admin' || n.targetUser === 'all');
    }
    return all.filter((n) => n.targetUser === 'all' || n.targetUser === userId);
  },
  createNotification(notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): void {
    const full: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: 'Just now',
      read: false,
    };
    const list = safeGet<NotificationItem[]>(
      STORAGE_KEYS.NOTIFICATIONS,
      INITIAL_NOTIFICATIONS
    );
    list.unshift(full);
    safeSet(STORAGE_KEYS.NOTIFICATIONS, list);
  },
  markNotificationAsRead(id: string): void {
    const list = safeGet<NotificationItem[]>(
      STORAGE_KEYS.NOTIFICATIONS,
      INITIAL_NOTIFICATIONS
    );
    const target = list.find((n) => n.id === id);
    if (target) {
      target.read = true;
      safeSet(STORAGE_KEYS.NOTIFICATIONS, list);
    }
  },
  markAllNotificationsRead(userId: string): void {
    const list = safeGet<NotificationItem[]>(
      STORAGE_KEYS.NOTIFICATIONS,
      INITIAL_NOTIFICATIONS
    );
    list.forEach((n) => {
      if (n.targetUser === 'all' || n.targetUser === userId || n.targetUser === 'admin') {
        n.read = true;
      }
    });
    safeSet(STORAGE_KEYS.NOTIFICATIONS, list);
  },

  // Calculate profile completion percentage based on field weights
  calculateProfileCompletion(student: Student): number {
    let score = 0;
    if (student.fullName && student.fullName.trim().length > 0) score += 10;
    if (student.email && student.email.trim().length > 0) score += 10;
    if (student.phone && student.phone.trim().length > 0) score += 10;
    if (student.location && student.location.trim().length > 0) score += 10;
    if (student.collegeName && student.collegeName.trim().length > 0) score += 10;
    if (student.department && student.department.trim().length > 0) score += 10;
    if (student.graduationYear && student.graduationYear > 0) score += 10;
    if (student.cgpa && student.cgpa > 0) score += 10;
    if (student.skills && student.skills.length >= 3) score += 10;
    else if (student.skills && student.skills.length > 0) score += 5;
    if (student.resumeName && student.resumeName.trim().length > 0) score += 10;

    return Math.min(100, score);
  },

  // Smart Eligibility Check engine
  checkEligibility(student: Student, job: Job): EligibilityResult {
    const reasons: string[] = [];
    const missingSkills: string[] = [];

    // 1. CGPA check
    const cgpaPassed = student.cgpa >= job.minCgpa;
    if (!cgpaPassed) {
      reasons.push(
        `Minimum CGPA required: ${job.minCgpa.toFixed(2)} (Your CGPA: ${student.cgpa.toFixed(2)})`
      );
    }

    // 2. Department check
    const studentDeptNorm = (student.department || '').toLowerCase().trim();
    const deptPassed =
      job.eligibleDepartments.length === 0 ||
      job.eligibleDepartments.some((d) =>
        d.toLowerCase().includes(studentDeptNorm) || studentDeptNorm.includes(d.toLowerCase())
      );
    if (!deptPassed) {
      reasons.push(
        `Department restriction: Eligible branches are [${job.eligibleDepartments.join(', ')}]. Your branch: ${student.department}`
      );
    }

    // 3. Graduation Year check
    const gradYearPassed =
      !job.graduationYear ||
      job.graduationYear.length === 0 ||
      job.graduationYear.includes(student.graduationYear);
    if (!gradYearPassed) {
      reasons.push(
        `Graduation year batch must be ${job.graduationYear.join('/')} (Your batch: ${student.graduationYear})`
      );
    }

    // 4. Skills match check
    const studentSkillsLower = (student.skills || []).map((s) => s.toLowerCase().trim());
    if (job.requiredSkills && job.requiredSkills.length > 0) {
      for (const reqSkill of job.requiredSkills) {
        const found = studentSkillsLower.some(
          (s) => s.includes(reqSkill.toLowerCase().trim()) || reqSkill.toLowerCase().trim().includes(s)
        );
        if (!found) {
          missingSkills.push(reqSkill);
        }
      }
    }

    if (missingSkills.length > 0) {
      reasons.push(`Missing key skill(s): ${missingSkills.join(', ')}`);
    }

    const isEligible = cgpaPassed && deptPassed && gradYearPassed;

    return {
      isEligible,
      reasons,
      missingSkills,
      cgpaPassed,
      deptPassed,
      gradYearPassed,
    };
  },
};
