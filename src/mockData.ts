import { Club, ClubMember, Schedule, Notice, ActivityLog, AttendanceStatus } from './types';

export const initialClubs: Club[] = [
  {
    id: 'c1',
    name: '빽어택 (배구 동아리)',
    description: '경인교육대학교 배구 동아리 빽어택입니다. 배구를 사랑하는 학우들이 모여 정기적인 화요/수요 정기훈련 및 대회 훈련을 진행하고 단합과 실력 향상을 위해 활동하는 동아리입니다.',
    category: '체육',
    colorTheme: 'indigo',
  },
];

export const initialMembers: ClubMember[] = [];

export const initialSchedules: Schedule[] = [
  // Club 1
  {
    id: 's1',
    clubId: 'c1',
    title: '6월 정기 네트워킹 데이 및 성과 발표',
    date: '2026-06-20',
    time: '14:00 - 17:00',
    location: '동아리 전용 세미나실 B호',
    description: '한 학기 동안 진행한 프로젝트 디자인 디자인 원칙 공유 및 개발 파트 합동 데모 시연을 진행합니다.',
    category: '정기훈련',
  },
  {
    id: 's2',
    clubId: 'c1',
    title: '신규 프로젝트 아이디어 브레인스토밍',
    date: '2026-06-25',
    time: '18:30 - 20:30',
    location: '메타버스 게더타운 및 디스코드 온라인',
    description: '여름 방학 해커톤 대비 신규 웹 서비스 테마별 아이디어 기획 및 팀 빌딩 미팅입니다.',
    category: '대회훈련',
  },
];

export const initialNotices: Notice[] = [];

export const initialActivityLogs: ActivityLog[] = [
  // Club 1
  {
    id: 'l1',
    clubId: 'c1',
    title: '',
    date: '2026-06-09',
    description: '여자부 6인제 포지션 훈련 및 전교대 준비',
    participants: ['김태린', '남윤호', '이준우', '한소희'],
    writer: '김태린',
    imageTheme: 'indigo',
    isSubmitted: true,
  },
  {
    id: 'l2',
    clubId: 'c1',
    title: '',
    date: '2026-06-02',
    description: '수연, 공격 연습, 서브캐치',
    participants: ['김태린', '박지민', '최서연', '한소희'],
    writer: '남윤호',
    imageTheme: 'emerald',
    isSubmitted: false,
  },
];

export const initialAttendance: Record<string, Record<string, AttendanceStatus>> = {
  // s1 (for c1)
  s1: {
    m1: 'present',
    m2: 'present',
    m3: 'present',
    m4: 'late',
    m5: 'present',
    m6: 'absent',
    m7: 'present',
  },
  // s2 (for c1)
  s2: {
    m1: 'present',
    m2: 'present',
    m3: 'present',
    m4: 'present',
    m5: 'present',
    m6: 'present',
    m7: 'present',
  },
};
