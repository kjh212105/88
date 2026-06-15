import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, CheckSquare, Megaphone, FileText, Sparkles, Heart } from 'lucide-react';

import { Club, ClubMember, Schedule, Notice, ActivityLog, AttendanceStatus } from './types';
import {
  initialClubs,
  initialMembers,
  initialSchedules,
  initialNotices,
  initialActivityLogs,
  initialAttendance,
} from './mockData';

import DashboardHeader from './components/DashboardHeader';
import SchedulesSection from './components/SchedulesSection';
import AttendanceSection from './components/AttendanceSection';
import NoticesSection from './components/NoticesSection';
import ActivityLogsSection from './components/ActivityLogsSection';
import TeamSection from './components/TeamSection';

export default function App() {
  // --- Persistent LocalState Hooks for Multi-Club System ---
  const [clubs, setClubs] = useState<Club[]>(() => {
    const local = localStorage.getItem('club_manager_clubs');
    if (local) {
      try {
        const parsed = JSON.parse(local) as Club[];
        const filtered = parsed.filter(c => c.id === 'c1');
        if (filtered.length > 0) {
          filtered[0].name = '빽어택 (배구 동아리)';
          filtered[0].description = '경인교육대학교 배구 동아리 빽어택입니다. 배구를 사랑하는 학우들이 모여 정기적인 화요/수요 정기훈련 및 대회 훈련을 진행하고 단합과 실력 향상을 위해 활동하는 동아리입니다.';
          filtered[0].category = '체육';
          return filtered;
        }
      } catch (e) {
        // Fallback
      }
    }
    return initialClubs;
  });

  const [activeClubId, setActiveClubId] = useState<string>(() => {
    const local = localStorage.getItem('club_manager_active_id');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (parsed === 'c1') return 'c1';
      } catch (e) {
        // Fallback
      }
    }
    return 'c1';
  });

  const [members, setMembers] = useState<ClubMember[]>(() => {
    const local = localStorage.getItem('club_manager_members');
    if (local) {
      try {
        const parsed = JSON.parse(local) as ClubMember[];
        const filtered = parsed.filter(
          (m) => m.clubId === 'c1' && !['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'].includes(m.id)
        );
        return filtered;
      } catch (e) {
        // Fallback
      }
    }
    return initialMembers;
  });

  const [schedules, setSchedules] = useState<Schedule[]>(() => {
    const local = localStorage.getItem('club_manager_schedules');
    if (local) {
      try {
        const parsed = JSON.parse(local) as Schedule[];
        const filtered = parsed.filter(s => s.clubId === 'c1' && s.id !== 's3');
        if (filtered.length > 0) return filtered;
      } catch (e) {
        // Fallback
      }
    }
    return initialSchedules;
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const local = localStorage.getItem('club_manager_notices');
    if (local) {
      try {
        const parsed = JSON.parse(local) as Notice[];
        const filtered = parsed.filter(
          (n) => n.clubId === 'c1' && !['n1', 'n2'].includes(n.id)
        );
        return filtered;
      } catch (e) {
        // Fallback
      }
    }
    return initialNotices;
  });

  const [attendance, setAttendance] = useState<Record<string, Record<string, AttendanceStatus>>>(() => {
    const local = localStorage.getItem('club_manager_attendance');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        const clean: Record<string, Record<string, AttendanceStatus>> = {};
        if (parsed.s1) clean.s1 = parsed.s1;
        if (parsed.s2) clean.s2 = parsed.s2;
        return clean;
      } catch (e) {
        // Fallback
      }
    }
    return initialAttendance;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const local = localStorage.getItem('club_manager_activity_logs');
    if (local) {
      try {
        const parsed = JSON.parse(local) as ActivityLog[];
        const filtered = parsed.filter(l => l.clubId === 'c1');
        if (filtered.length > 0) {
          return filtered.map(log => {
            if (log.id === 'l1') return { ...log, writer: '김태린' };
            if (log.id === 'l2') return { ...log, writer: '남윤호' };
            return log;
          });
        }
      } catch (e) {
        // Fallback
      }
    }
    return initialActivityLogs;
  });

  const [activeTab, setActiveTab] = useState<'schedules' | 'attendance' | 'notices' | 'logs' | 'team'>('schedules');

  // --- Sync State to LocalStorage ---
  useEffect(() => {
    localStorage.setItem('club_manager_clubs', JSON.stringify(clubs));
  }, [clubs]);

  useEffect(() => {
    localStorage.setItem('club_manager_active_id', JSON.stringify(activeClubId));
  }, [activeClubId]);

  useEffect(() => {
    localStorage.setItem('club_manager_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('club_manager_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('club_manager_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('club_manager_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('club_manager_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  // --- Filtered Sub-States for currently selected Club ---
  const activeMembers = members.filter((m) => m.clubId === activeClubId);
  const activeNotices = notices.filter((n) => n.clubId === activeClubId);
  const activeLogs = activityLogs.filter((l) => l.clubId === activeClubId);

  // Filter out manual '정기훈련' and '대회훈련' schedules from user-added state
  const userSchedules = schedules.filter(
    (s) => s.clubId === activeClubId && s.category !== '정기훈련' && s.category !== '대회훈련'
  );

  // Define four fixed schedules for this active club
  const fixedSchedulesForActiveClub: Schedule[] = [
    {
      id: `fixed-tue-${activeClubId}`,
      clubId: activeClubId,
      title: '정기훈련 (화요일)',
      date: '화요일 (매주)',
      time: '19:00 - 22:00',
      location: '경캠 체육관',
      category: '정기훈련',
      description: '',
    },
    {
      id: `fixed-wed-${activeClubId}`,
      clubId: activeClubId,
      title: '정기훈련 (수요일)',
      date: '수요일 (매주)',
      time: '19:00 - 22:00',
      location: '인캠 체육관',
      category: '정기훈련',
      description: '',
    },
    {
      id: `fixed-fri-${activeClubId}`,
      clubId: activeClubId,
      title: '대회훈련 (금요일)',
      date: '금요일 (매주)',
      time: '19:00 - 22:00',
      location: '인캠 체육관',
      category: '대회훈련',
      description: '',
    },
    {
      id: `fixed-sat-${activeClubId}`,
      clubId: activeClubId,
      title: '대회훈련 (토요일)',
      date: '토요일 (매주)',
      time: '09:00 - 13:00',
      location: '경캠 체육관',
      category: '대회훈련',
      description: '',
    },
  ];

  // Combine fixed weekly schedules with user-added custom ones
  const activeSchedules = [...fixedSchedulesForActiveClub, ...userSchedules];

  // --- Handlers & Mutators ---
  const handleAddClub = (newClub: Omit<Club, 'id'>) => {
    const id = `c${Date.now()}`;
    const club: Club = { id, ...newClub };
    setClubs((prev) => [...prev, club]);
    setActiveClubId(id); // Auto-focus transition to newly created club
  };

  const handleAddSchedule = (newSchedule: Omit<Schedule, 'id' | 'clubId'>) => {
    const id = `s${Date.now()}`;
    const schedule: Schedule = { id, clubId: activeClubId, ...newSchedule };
    setSchedules((prev) => [schedule, ...prev]);

    // Initialize default attendance records for this new schedule
    setAttendance((prev) => ({
      ...prev,
      [id]: activeMembers.reduce((acc, m) => {
        acc[m.id] = 'present'; // Default to present as starting template
        return acc;
      }, {} as Record<string, AttendanceStatus>),
    }));
  };

  const handleUpdateAttendance = (scheduleId: string, memberId: string, status: AttendanceStatus) => {
    setAttendance((prev) => {
      const scheduleRecords = prev[scheduleId] ? { ...prev[scheduleId] } : {};
      scheduleRecords[memberId] = status;
      return {
        ...prev,
        [scheduleId]: scheduleRecords,
      };
    });
  };

  const handleResetAttendance = (scheduleId: string) => {
    setAttendance((prev) => {
      const scheduleRecords = prev[scheduleId] ? { ...prev[scheduleId] } : {};
      activeMembers.forEach((m) => {
        scheduleRecords[m.id] = 'present';
      });
      return {
        ...prev,
        [scheduleId]: scheduleRecords,
      };
    });
  };

  const handleAddNotice = (newNotice: Omit<Notice, 'id' | 'clubId'>) => {
    const id = `n${Date.now()}`;
    const notice: Notice = { id, clubId: activeClubId, ...newNotice };
    setNotices((prev) => [notice, ...prev]);
  };

  const handleAddLog = (newLog: Omit<ActivityLog, 'id' | 'clubId'>) => {
    const id = `l${Date.now()}`;
    const log: ActivityLog = { id, clubId: activeClubId, isSubmitted: false, ...newLog };
    setActivityLogs((prev) => [log, ...prev]);
  };

  const handleToggleLogSubmission = (logId: string) => {
    setActivityLogs((prev) =>
      prev.map((log) => (log.id === logId ? { ...log, isSubmitted: !log.isSubmitted } : log))
    );
  };

  const handleAddMember = (newM: Omit<ClubMember, 'id' | 'clubId'>) => {
    const mId = `m${Date.now()}`;
    const member: ClubMember = { id: mId, clubId: activeClubId, ...newM };
    setMembers((prev) => [...prev, member]);
  };

  // Helper: switch to Attendance and focus on that specific schedule
  const handleSelectScheduleForAttendance = (scheduleId: string) => {
    setActiveTab('attendance');
  };

  // Helper global attendance rate computation for active club
  const calculateTotalAttendanceRate = () => {
    if (activeSchedules.length === 0) return 0;
    
    let totalPresent = 0;
    let totalPossible = 0;

    activeSchedules.forEach((s) => {
      const recs = attendance[s.id] || {};
      activeMembers.forEach((m) => {
        const uStatus = recs[m.id];
        if (uStatus === 'present' || uStatus === 'late') {
          totalPresent++;
        }
        totalPossible++;
      });
    });

    return totalPossible > 0 ? Math.round((totalPresent / totalPossible) * 100) : 0;
  };

  const totalRate = calculateTotalAttendanceRate();

  const tabItems = [
    { id: 'schedules', label: '활동 일정', icon: Calendar },
    { id: 'attendance', label: '출석 관리', icon: CheckSquare },
    { id: 'notices', label: '공지사항', icon: Megaphone },
    { id: 'logs', label: '배구 일지', icon: FileText },
    { id: 'team', label: '동아리 부원록', icon: Sparkles },
  ] as const;

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-50/60 font-sans text-slate-800 flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 1. Elegant Header with Multi-Club Hub capabilities */}
      <DashboardHeader
        clubs={clubs}
        activeClubId={activeClubId}
        onSelectClub={setActiveClubId}
        onAddClub={handleAddClub}
        members={activeMembers}
        schedules={activeSchedules}
        notices={activeNotices}
        totalAttendanceRate={totalRate}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-6">
        
        {/* 2. Interactive Navigation Core Tabs */}
        <div id="navigation-tabs-container" className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-100/80 shadow-sm">
          {tabItems.map((tab) => {
            const IconComponent = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Render dynamic content areas with elegant motion animation */}
        <div id="tab-content-panel" className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="focus:outline-none"
            >
              {activeTab === 'schedules' && (
                <SchedulesSection
                  schedules={activeSchedules}
                  onAddSchedule={handleAddSchedule}
                  onSelectScheduleForAttendance={handleSelectScheduleForAttendance}
                />
              )}

              {activeTab === 'attendance' && (
                <AttendanceSection
                  members={activeMembers}
                  schedules={activeSchedules}
                  attendance={attendance}
                  onUpdateAttendance={handleUpdateAttendance}
                  onResetAttendance={handleResetAttendance}
                />
              )}

              {activeTab === 'notices' && (
                <NoticesSection
                  notices={activeNotices}
                  onAddNotice={handleAddNotice}
                />
              )}

              {activeTab === 'logs' && (
                <ActivityLogsSection
                  logs={activeLogs}
                  onAddLog={handleAddLog}
                  onToggleSubmission={handleToggleLogSubmission}
                  availableParticipants={activeMembers.map((m) => m.name)}
                />
              )}

              {activeTab === 'team' && (
                <TeamSection
                  members={activeMembers}
                  onAddMember={handleAddMember}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>

      {/* 4. Elegant Footer matching design tone */}
      <footer id="app-footer" className="bg-white border-t border-slate-100 py-6 text-xs text-slate-400 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-light">
          <p>© 2026 노쇼 (NoShow). All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> for All Clubs
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
