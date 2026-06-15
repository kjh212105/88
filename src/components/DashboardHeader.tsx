import React, { useState } from 'react';
import { Users, Calendar, Megaphone, Clock, Plus, FolderHeart, GraduationCap, X, Check, Dumbbell, Film } from 'lucide-react';
import { Club, ClubMember, Schedule, Notice } from '../types';
// @ts-ignore
import ronaldoAvatar from '../assets/images/ronaldo_avatar_1781521850947.jpg';

interface DashboardHeaderProps {
  clubs: Club[];
  activeClubId: string;
  onSelectClub: (clubId: string) => void;
  onAddClub: (club: Omit<Club, 'id'>) => void;
  members: ClubMember[];
  schedules: Schedule[];
  notices: Notice[];
  totalAttendanceRate: number;
}

export default function DashboardHeader({
  clubs,
  activeClubId,
  onSelectClub,
  onAddClub,
  members,
  schedules,
  notices,
  totalAttendanceRate,
}: DashboardHeaderProps) {
  const [isOpenAddForm, setIsOpenAddForm] = useState(false);
  const [newClubName, setNewClubName] = useState('');
  const [newClubDesc, setNewClubDesc] = useState('');
  const [newClubCat, setNewClubCat] = useState('학술/IT');
  const [newClubTheme, setNewClubTheme] = useState<'indigo' | 'emerald' | 'amber' | 'rose' | 'sky'>('indigo');
  const [error, setError] = useState('');

  const activeClub = clubs.find((c) => c.id === activeClubId) || clubs[0];

  // Helper for dynamic logo initials
  const getInitials = (name: string) => {
    const clean = name.replace(/[^a-zA-Z0-9가-힣]/g, '');
    return clean.substring(0, 2);
  };

  const handleSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClubName.trim() || !newClubDesc.trim() || !newClubCat.trim()) {
      setError('모든 빈 칸을 실속 있게 입력해 주세요!');
      return;
    }
    onAddClub({
      name: newClubName,
      description: newClubDesc,
      category: newClubCat,
      colorTheme: newClubTheme,
    });
    setNewClubName('');
    setNewClubDesc('');
    setError('');
    setIsOpenAddForm(false);
  };

  const getThemeClass = (theme: string) => {
    switch (theme) {
      case 'emerald': return 'bg-emerald-600 shadow-emerald-100';
      case 'amber': return 'bg-amber-500 shadow-amber-100';
      case 'rose': return 'bg-rose-600 shadow-rose-100';
      case 'sky': return 'bg-sky-500 shadow-sky-100';
      case 'indigo':
      default: return 'bg-indigo-650 shadow-indigo-100';
    }
  };

  return (
    <header id="app-header" className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm/50 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          
          {/* Logo & Headline with Dynamic Multi-Club Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            
            {/* Dynamic themed logo */}
            <a
              href="https://namu.wiki/w/%EC%9C%A0%EB%B2%A4%ED%84%B0%EC%8A%A4%20FC%20%EC%BD%94%EB%A6%AC%EC%95%84%20%ED%99%85%EB%8C%80%20%EB%85%BC%EB%9E%80"
              target="_blank"
              rel="noopener noreferrer"
              id="header-logo-icon"
              title="유벤투스 FC 코리아 홀대 논란 (노쇼 사태) 나무위키 이동"
              className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-lg border border-slate-150 shrink-0 hover:scale-105 active:scale-95 transition-all duration-200 block"
            >
              <img
                src={ronaldoAvatar}
                alt="Cristiano Ronaldo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </a>

            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  노쇼
                </span>
                <span className="text-[10px] bg-slate-900 text-white font-extrabold px-1.5 py-0.5 rounded-md uppercase">
                  Multi-Group Hub v2.0
                </span>
              </div>
              
              {/* Active Club and Dropdown Selector Block */}
              <div className="flex flex-wrap items-center gap-2.5">
                <label htmlFor="club-selector-dropdown" className="text-xs font-bold text-slate-400">현재 담당 동아리:</label>
                <div className="relative">
                  <select
                    id="club-selector-dropdown"
                    value={activeClubId}
                    onChange={(e) => onSelectClub(e.target.value)}
                    className="bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-xs font-extrabold rounded-xl pl-3.5 pr-8 py-1.5 outline-none focus:ring-2 focus:ring-slate-800/20 appearance-none cursor-pointer transition-all min-w-[200px]"
                  >
                    {clubs.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.category})
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
                    ▼
                  </span>
                </div>

                {/* Add new club button trigger */}
                <button
                  id="btn-trigger-add-club"
                  onClick={() => setIsOpenAddForm(!isOpenAddForm)}
                  className={`flex items-center justify-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-xl border transition-all ${
                    isOpenAddForm
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {isOpenAddForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  동아리 신규 등록
                </button>
              </div>
            </div>

          </div>

          {/* Active Club Core Dynamic Stat Counters */}
          <div id="stats-grid" className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 md:min-w-[480px]">
            {/* Total Members for Active Club */}
            <div id="stat-members" className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">액티브 부원</p>
                <p className="text-sm font-bold text-slate-800">{members.length}명</p>
              </div>
            </div>

            {/* Schedules for Active Club */}
            <div id="stat-schedules" className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">활동 예정 일정</p>
                <p className="text-sm font-bold text-slate-800">{schedules.length}개</p>
              </div>
            </div>

            {/* Notices for Active Club */}
            <div id="stat-notices" className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 flex items-center gap-3">
              <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">주요 긴급 소식</p>
                <p className="text-sm font-bold text-slate-800">
                  {notices.filter(n => n.isImportant).length}건
                </p>
              </div>
            </div>

            {/* Attendance Rate for Active Club */}
            <div id="stat-attendance-rate" className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">평균 출석률</p>
                <p className="text-sm font-bold text-slate-800">{totalAttendanceRate}%</p>
              </div>
            </div>
          </div>

        </div>

        {/* Collapsible Form for registering a new club */}
        {isOpenAddForm && (
          <div id="add-club-collapsible-panel" className="mt-4 bg-slate-50 border border-slate-200/80 p-5 rounded-2xl shadow-inner animate-slideDown">
            <div className="border-b border-slate-200 pb-2 mb-4 flex justify-between items-center">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                <FolderHeart className="w-4 h-4 text-slate-650" />
                신규 모임 동아리 위탁 등록
              </h3>
              <span className="text-[10px] text-slate-400">교내 정직 단체에 한해 승인됩니다</span>
            </div>

            <form onSubmit={handleSub} className="space-y-4">
              {error && (
                <div className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg font-medium border border-rose-100">
                  ⚠️ {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* Name */}
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">동아리 명칭</label>
                  <input
                    type="text"
                    placeholder="예) 오아시스 (밴드부)"
                    value={newClubName}
                    onChange={(e) => setNewClubName(e.target.value)}
                    className="w-full bg-white px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-slate-800"
                  />
                </div>

                {/* Category */}
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">동아리 유형</label>
                  <select
                    value={newClubCat}
                    onChange={(e) => setNewClubCat(e.target.value)}
                    className="w-full bg-white px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-slate-800"
                  >
                    <option value="학술/IT">학술/IT</option>
                    <option value="체육/친목">체육/친목</option>
                    <option value="문화/예술">문화/예술</option>
                    <option value="봉사/사회">봉사/사회</option>
                    <option value="종교/기타">종교/기타</option>
                  </select>
                </div>

                {/* Theme selection */}
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">위젯 시그니처 테마</label>
                  <div className="flex gap-1.5 py-1">
                    {(['indigo', 'emerald', 'amber', 'rose', 'sky'] as const).map((t) => {
                      const colorMap = {
                        indigo: 'bg-indigo-600',
                        emerald: 'bg-emerald-500',
                        amber: 'bg-amber-400',
                        rose: 'bg-rose-500',
                        sky: 'bg-sky-400',
                      };
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setNewClubTheme(t)}
                          className={`w-6 h-6 rounded-full ${colorMap[t]} border-2 transition-all flex items-center justify-center`}
                          style={{ borderColor: newClubTheme === t ? '#1e293b' : 'transparent' }}
                        >
                          {newClubTheme === t && <Check className="w-3 h-3 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">구체적 소개</label>
                  <input
                    type="text"
                    placeholder="동아리의 목적이 무엇인가요?"
                    value={newClubDesc}
                    onChange={(e) => setNewClubDesc(e.target.value)}
                    className="w-full bg-white px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-slate-800"
                  />
                </div>

              </div>

              <div className="text-right flex justify-end gap-2 border-t border-slate-200 pt-3 mt-1">
                <button
                  type="button"
                  onClick={() => setIsOpenAddForm(false)}
                  className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-lg"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-850 text-white text-[11px] font-bold rounded-lg"
                >
                  등록 완수 &rarr;
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Detailed Active Club Summary card under header */}
        {activeClub && (
          <div id="active-club-card" className="mt-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md bg-white border border-slate-200/80`}>
                  {activeClub.category}
                </span>
                <h2 className="text-sm font-extrabold text-slate-800">
                  {activeClub.name}
                </h2>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                {activeClub.description}
              </p>
            </div>
            
            {/* Display category matching icon decoration */}
            <div className="hidden md:flex p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 shrink-0 select-none">
              {activeClub.category.includes('체육') ? (
                <Dumbbell className="w-5 h-5 text-orange-500" />
              ) : activeClub.category.includes('예술') || activeClub.category.includes('문화') ? (
                <Film className="w-5 h-5 text-rose-500" />
              ) : (
                <GraduationCap className="w-5 h-5 text-indigo-500" />
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
