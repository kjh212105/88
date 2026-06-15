import React, { useState } from 'react';
import { PencilLine, Plus, Search, Calendar, User, Users, Tag, X, Check, FileText } from 'lucide-react';
import { ActivityLog } from '../types';

interface ActivityLogsSectionProps {
  logs: ActivityLog[];
  onAddLog: (log: Omit<ActivityLog, 'id' | 'clubId'>) => void;
  onToggleSubmission: (id: string) => void;
  availableParticipants: string[];
}

export default function ActivityLogsSection({
  logs,
  onAddLog,
  onToggleSubmission,
  availableParticipants,
}: ActivityLogsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [writer, setWriter] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [imageTheme, setImageTheme] = useState<string>('indigo');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const themes = [
    { name: '인디고 블루 (Tech)', value: 'indigo', bg: 'bg-indigo-50 border-indigo-100 text-indigo-700' },
    { name: '에메랄드 그린 (Eco/Cozy)', value: 'emerald', bg: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
    { name: '엠버 골드 (Warm/Daily)', value: 'amber', bg: 'bg-amber-50 border-amber-100 text-amber-700' },
    { name: '로즈 핑크 (Fun/Event)', value: 'rose', bg: 'bg-rose-50 border-rose-100 text-rose-700' },
    { name: '스카이 블루 (Bright)', value: 'sky', bg: 'bg-sky-50 border-sky-100 text-sky-700' },
  ];

  const handleAddLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !writer.trim()) {
      setError('모든 항목을 입력해주세요.');
      return;
    }

    onAddLog({
      title,
      date,
      description,
      writer,
      participants: [],
      imageTheme,
      isSubmitted,
    });

    // Reset Form
    setTitle('');
    setDate('');
    setDescription('');
    setSelectedParticipants([]);
    setImageTheme('indigo');
    setIsSubmitted(false);
    setError('');
    setIsAdding(false);
  };

  const filteredLogs = logs.filter((l) => {
    return (
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.writer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalLogsCount = filteredLogs.length;
  const submittedCount = filteredLogs.filter((l) => l.isSubmitted).length;
  const pendingCount = totalLogsCount - submittedCount;

  const getThemeStyles = (themeValue: string) => {
    switch (themeValue) {
      case 'indigo':
        return {
          cardBorder: 'hover:border-indigo-300',
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-100',
          dot: 'bg-indigo-600',
          decoBar: 'bg-gradient-to-r from-indigo-500 to-violet-500',
        };
      case 'emerald':
        return {
          cardBorder: 'hover:border-emerald-300',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          dot: 'bg-emerald-600',
          decoBar: 'bg-gradient-to-r from-emerald-500 to-teal-500',
        };
      case 'amber':
        return {
          cardBorder: 'hover:border-amber-300',
          badge: 'bg-amber-50 text-amber-700 border-amber-100',
          dot: 'bg-amber-600',
          decoBar: 'bg-gradient-to-r from-amber-500 to-orange-500',
        };
      case 'rose':
        return {
          cardBorder: 'hover:border-rose-300',
          badge: 'bg-rose-50 text-rose-700 border-rose-100',
          dot: 'bg-rose-600',
          decoBar: 'bg-gradient-to-r from-rose-500 to-pink-500',
        };
      case 'sky':
        return {
          cardBorder: 'hover:border-sky-300',
          badge: 'bg-sky-50 text-sky-700 border-sky-100',
          dot: 'bg-sky-600',
          decoBar: 'bg-gradient-to-r from-sky-400 to-blue-500',
        };
      default:
        return {
          cardBorder: 'hover:border-slate-300',
          badge: 'bg-slate-50 text-slate-700 border-slate-100',
          dot: 'bg-slate-600',
          decoBar: 'bg-slate-300',
        };
    }
  };

  return (
    <div id="volleyball-logs-wrapper" className="space-y-6 animate-fadeIn">
      
      {/* Search & Actions Bar with Stats */}
      <div id="logs-control-bar" className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="log-search-input"
            type="text"
            placeholder="일지 명칭, 기록자 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50/50 hover:bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
          />
        </div>

        {/* Stats segment & add button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
          <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-150 p-1.5 px-3 rounded-lg font-medium text-slate-600">
            <span className="flex items-center gap-1 font-bold">
              총 일지: <strong className="text-slate-905">{totalLogsCount}</strong>개
            </span>
            <span className="text-slate-200">|</span>
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              제출 완료: <strong>{submittedCount}</strong>
            </span>
            <span className="text-slate-200">|</span>
            <span className="flex items-center gap-1 text-amber-600 font-bold">
              미제출: <strong>{pendingCount}</strong>
            </span>
          </div>

          <button
            id="btn-toggle-add-log"
            onClick={() => setIsAdding(!isAdding)}
            className={`flex items-center justify-center gap-2 px-4.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm shrink-0 uppercase tracking-wide cursor-pointer ${
              isAdding
                ? 'bg-slate-850 hover:bg-slate-900 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
            }`}
          >
            {isAdding ? (
              <>
                <X className="w-4 h-4" />
                닫기
              </>
            ) : (
              <>
                <PencilLine className="w-4 h-4" />
                배구 일지 기록하기
              </>
            )}
          </button>
        </div>
      </div>

      {/* Adding Log Form */}
      {isAdding && (
        <div id="add-log-form-container" className="bg-white border-2 border-indigo-500/15 rounded-2xl p-6 shadow-xl shadow-slate-100 transition-all font-sans max-w-xl mx-auto">
          <div className="border-b border-slate-100 pb-3.5 mb-5 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
              <FileText className="w-4.5 h-4.5 text-indigo-600 animate-pulse" />
              신규 배구 일지 작성
            </h3>
            <span className="text-xs text-slate-400">배구 일지 제출을 위한 기본 정보를 등록합니다.</span>
          </div>

          <form onSubmit={handleAddLogSubmit} className="space-y-5">
            {error && (
              <div className="text-xs text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-xl font-semibold">
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">일지/훈련 명칭</label>
                <input
                  id="form-log-title"
                  type="text"
                  placeholder="예) 수공격 루트 전술 시연 및 디그 보강 특전 훈련"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">훈련 상세 내용</label>
                <textarea
                  id="form-log-description"
                  placeholder="훈련 세션 및 디그, 연계 등 진행 상황에 대해 기재해 주세요."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all resize-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">훈련/기록 날짜</label>
                  <input
                    id="form-log-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">기록 작성자</label>
                  <input
                    id="form-log-writer"
                    type="text"
                    placeholder="작성자 이름"
                    value={writer}
                    onChange={(e) => setWriter(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submitting status check inside form */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-slate-700 block">회계/동아리 일지 즉시 제출</label>
                  <p className="text-[10px] text-slate-400 font-light">작성 즉시 제출 완료 상태로 보관합니다.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(!isSubmitted)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    isSubmitted
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-100'
                      : 'bg-white border-slate-250 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {isSubmitted ? '제출 완료 상태' : '미제출 (체결 대기)'}
                </button>
              </div>

              {/* Theme selection */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">일지 카드 테마</label>
                <div className="flex flex-wrap gap-2">
                  {themes.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setImageTheme(t.value)}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        imageTheme === t.value
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-white border-slate-250 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-5 mt-3">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4.5 py-2.5 border border-slate-200 hover:bg-slate-55 hover:text-slate-800 text-slate-600 text-xs font-bold rounded-xl transition-all"
              >
                작성 취소
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-indigo-100 transition-all cursor-pointer"
              >
                배구 일지 등록
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Volleyball Logs Cards Grid */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 p-8 shadow-sm">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-bold">기록된 배구 일지가 존재하지 않습니다.</p>
          <span className="text-xs text-slate-450 mt-1 block">신규 일지도 쉽게 추가해서 제출 대장 관리를 시도해 보세요.</span>
        </div>
      ) : (
        <div id="activity-logs-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLogs.map((log) => {
            const styles = getThemeStyles(log.imageTheme);

            return (
              <div
                key={log.id}
                className={`bg-white border border-slate-150 p-0 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-0.5 transition-all flex flex-col justify-between group ${styles.cardBorder}`}
              >
                {/* Deco and Main Content Area */}
                <div className="flex-1 flex flex-col justify-between">
                  {/* Card Graphic Header representing Volleyball themes */}
                  <div className={`h-2 text-xs flex items-center ${styles.decoBar}`}></div>
                  
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      {/* Sub-info layout */}
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-400 font-mono flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-350" />
                          {log.date}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-md">
                          기록자: {log.writer}
                        </span>
                      </div>

                      {/* Main Volleyball Log Title */}
                      {log.title && (
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                          {log.title}
                        </h4>
                      )}

                      {/* Log Description / Content */}
                      {log.description && (
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2.5 bg-slate-50 border border-slate-100 p-3 rounded-xl whitespace-pre-wrap">
                          {log.description}
                        </p>
                      )}
                    </div>

                  </div>
                </div>

                {/* Submission status section with toggle (Requested Check Feature!) */}
                <div className="bg-slate-50/80 px-4.5 py-3 border-t border-slate-100 flex items-center justify-between text-xs font-sans">
                  <span className="text-slate-500 font-bold">일지 제출 여부</span>
                  <button
                    onClick={() => onToggleSubmission(log.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all border shadow-sm cursor-pointer ${
                      log.isSubmitted
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    {log.isSubmitted ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-605" />
                        제출 완료
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span>
                        미제출 (로그 클릭 제출)
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
