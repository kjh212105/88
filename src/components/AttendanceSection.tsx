import { useState } from 'react';
import { Check, X, AlertTriangle, HelpCircle, Calendar, Users, Award, ShieldCheck, RefreshCw, GraduationCap, User } from 'lucide-react';
import { ClubMember, Schedule, AttendanceStatus } from '../types';

interface AttendanceSectionProps {
  members: ClubMember[];
  schedules: Schedule[];
  attendance: Record<string, Record<string, AttendanceStatus>>;
  onUpdateAttendance: (scheduleId: string, memberId: string, status: AttendanceStatus) => void;
  onResetAttendance: (scheduleId: string) => void;
}

export default function AttendanceSection({
  members,
  schedules,
  attendance,
  onUpdateAttendance,
  onResetAttendance,
}: AttendanceSectionProps) {
  // Select first schedule as default, or empty if none exist
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(
    schedules.length > 0 ? schedules[0].id : ''
  );

  // Fallback if some schedules were deleted or added
  const activeScheduleId = schedules.find(s => s.id === selectedScheduleId)
    ? selectedScheduleId
    : (schedules.length > 0 ? schedules[0].id : '');

  const currentSchedule = schedules.find((s) => s.id === activeScheduleId);
  const currentAttendance = activeScheduleId ? (attendance[activeScheduleId] || {}) : {};

  // Stat Counter for current attendance
  const getStats = () => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;
    let unrecorded = 0;

    members.forEach((m) => {
      const status = currentAttendance[m.id];
      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'late') late++;
      else if (status === 'excused') excused++;
      else unrecorded++;
    });

    const recordedCount = present + absent + late + excused;
    const rate = recordedCount > 0 ? Math.round((present / members.length) * 100) : 0;

    return { present, absent, late, excused, unrecorded, rate };
  };

  const stats = getStats();

  const getStatusBadge = (status: AttendanceStatus | undefined) => {
    switch (status) {
      case 'present':
        return { label: '출석', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: Check };
      case 'absent':
        return { label: '결석', color: 'bg-rose-50 text-rose-700 border-rose-100', icon: X };
      case 'late':
        return { label: '지각', color: 'bg-amber-50 text-amber-700 border-amber-100', icon: AlertTriangle };
      case 'excused':
        return { label: '공결', color: 'bg-sky-50 text-sky-700 border-sky-100', icon: HelpCircle };
      default:
        return { label: '미지정', color: 'bg-slate-50 text-slate-400 border-slate-100', icon: HelpCircle };
    }
  };

  return (
    <div id="attendance-wrapper" className="space-y-6">
      
      {/* Schedule Selection Panel */}
      <div id="attendance-select-card" className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3 h-3 text-indigo-500" />
            출석 대상 모임 선택
          </label>
          <div className="relative">
            {schedules.length === 0 ? (
              <p className="text-sm font-semibold text-rose-500">등록된 동아리 일정이 없습니다. 일정 먼저 추가해 주세요.</p>
            ) : (
              <select
                id="attendance-schedule-select"
                value={activeScheduleId}
                onChange={(e) => setSelectedScheduleId(e.target.value)}
                className="w-full md:w-[320px] bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold rounded-lg px-3 py-2 pr-8 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 appearance-none cursor-pointer"
              >
                {schedules.map((s) => (
                  <option key={s.id} value={s.id} className="font-sans">
                    [{s.date}] {s.title}
                  </option>
                ))}
              </select>
            )}
            {schedules.length > 0 && (
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 font-bold text-xs">
                ▼
              </div>
            )}
          </div>
        </div>

        {/* Selected schedule small description */}
        {currentSchedule && (
          <div id="selected-schedule-brief" className="hidden lg:block bg-slate-50 p-3 rounded-xl border border-slate-100 max-w-md text-xs text-slate-500">
            <p className="font-semibold text-slate-700">{currentSchedule.title}</p>
            {currentSchedule.category !== '교류전' && currentSchedule.category !== '대회' && (
              <p className="mt-1 flex items-center gap-2">
                <span>장소: {currentSchedule.location}</span>
                <span className="text-slate-350">|</span>
                <span>시간: {currentSchedule.time}</span>
              </p>
            )}
          </div>
        )}

        {/* Refresh Reset Trigger */}
        {activeScheduleId && (
          <button
            onClick={() => {
              if (window.confirm('선택된 일정의 모든 출석 상태를 리셋하시겠습니까?')) {
                onResetAttendance(activeScheduleId);
              }
            }}
            className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-700 rounded-lg transition-all self-end md:self-center"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            전체 리셋
          </button>
        )}
      </div>

      {!activeScheduleId ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">활동 일정을 선택하여 출석 현황을 관리해보세요.</p>
        </div>
      ) : (
        <div id="attendance-detail-layout" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Stats Summary & Status Dashboard Column (Left) */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Live Counter Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 opacity-10">
                <Users className="w-32 h-32" />
              </div>
              
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">실시간 출석 통계</h4>
              <p className="text-sm font-medium text-slate-300 mb-4">{currentSchedule?.title}</p>
              
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-extrabold text-white tracking-tight">{stats.rate}%</span>
                <span className="text-xs text-slate-400 font-medium">(정상 출석 기준)</span>
              </div>

              {/* Custom styled dynamic progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden mb-5">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${stats.rate}%` }}
                ></div>
              </div>

              {/* Counts Grid */}
              <div className="grid grid-cols-2 gap-3.5 mt-2">
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block font-medium">출석 (Present)</span>
                  <span className="text-xl font-bold text-emerald-400">{stats.present}명</span>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block font-medium">결석 (Absent)</span>
                  <span className="text-xl font-bold text-rose-400">{stats.absent}명</span>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block font-medium">지각 (Late)</span>
                  <span className="text-xl font-bold text-amber-400">{stats.late}명</span>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block font-medium">공결 (Excused)</span>
                  <span className="text-xl font-bold text-sky-400">{stats.excused}명</span>
                </div>
              </div>

              {stats.unrecorded > 0 && (
                <div className="mt-4 bg-amber-500/10 border border-amber-5000/20 text-amber-300 text-[11px] p-2 rounded-lg text-center font-medium flex items-center justify-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  미지정 인원 {stats.unrecorded}명이 존재합니다.
                </div>
              )}
            </div>

            {/* Quick Helper Tips */}
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 text-xs text-indigo-800 space-y-2">
              <p className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                출석 확인 시스템 안내
              </p>
              <ul className="list-disc pl-4 space-y-1 text-indigo-700/95 font-light">
                <li>우측 부원 리스트에서 각각의 상태 박스를 클릭하여 변경하세요.</li>
                <li>변경된 내용은 별도의 저장 과정 없이 로컬에 즉시 기록됩니다.</li>
                <li>[출석률]은 (전체 부원 대비 출석 상태인 부원)의 비율로 자동 연산됩니다.</li>
              </ul>
            </div>
          </div>

          {/* Members Attendance Assignment List (Right) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="border border-slate-100 bg-white rounded-2xl overflow-hidden shadow-sm">
              
              {/* Header inside list */}
              <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  동아리 회원별 출결 현황 체크리스트
                </h4>
                <span className="text-xs text-slate-400">총 {members.length}명</span>
              </div>

              {/* Members Rows */}
              <div className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto">
                {members.map((member) => {
                  const status = currentAttendance[member.id];
                  const badge = getStatusBadge(status);
                  const Icon = badge.icon;

                  return (
                    <div
                      key={member.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Name, Department & Position */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-xs text-indigo-700 border border-indigo-100 shrink-0">
                          {member.name.substring(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800 text-sm">{member.name}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                              <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              {member.email}
                            </span>
                            <span className="text-slate-250 select-none text-xs">|</span>
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              {member.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Selector Buttons */}
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit self-end sm:self-auto">
                        {/* Present Button */}
                        <button
                          onClick={() => onUpdateAttendance(activeScheduleId, member.id, 'present')}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                            status === 'present'
                              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-100'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          출석
                        </button>
                        
                        {/* Absent Button */}
                        <button
                          onClick={() => onUpdateAttendance(activeScheduleId, member.id, 'absent')}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                            status === 'absent'
                              ? 'bg-rose-600 text-white shadow-sm shadow-rose-100'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          결석
                        </button>

                        {/* Late Button */}
                        <button
                          onClick={() => onUpdateAttendance(activeScheduleId, member.id, 'late')}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                            status === 'late'
                              ? 'bg-amber-500 text-white shadow-sm shadow-amber-100'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          지각
                        </button>

                        {/* Excused Button */}
                        <button
                          onClick={() => onUpdateAttendance(activeScheduleId, member.id, 'excused')}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                            status === 'excused'
                              ? 'bg-sky-600 text-white shadow-sm shadow-sky-100'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          공결
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
