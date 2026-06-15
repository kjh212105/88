export interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  colorTheme: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky';
}

export interface ClubMember {
  id: string;
  clubId: string;
  name: string;
  role: string;
  email: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface Schedule {
  id: string;
  clubId: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: '정기훈련' | '대회훈련' | '교류전' | '대회';
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  memberId: string;
  memberName: string;
  status: AttendanceStatus;
  updatedAt: string;
}

export interface ScheduleAttendance {
  scheduleId: string;
  records: Record<string, AttendanceStatus>; // memberId -> status
}

export interface Notice {
  id: string;
  clubId: string;
  title: string;
  content: string;
  date: string;
  writer: string;
  isImportant: boolean;
  category: '공지' | '이벤트' | '전달' | '필독';
}

export interface ActivityLog {
  id: string;
  clubId: string;
  title: string;
  date: string;
  description: string;
  participants: string[];
  writer: string;
  imageTheme: string; // Tailwind color theme for card highlight
  isSubmitted?: boolean; // Submission status check for volleyball logs
}
