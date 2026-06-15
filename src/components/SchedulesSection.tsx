import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Plus, Search, Tag, X, FileText, CheckCircle2 } from 'lucide-react';
import { Schedule } from '../types';

interface SchedulesSectionProps {
  schedules: Schedule[];
  onAddSchedule: (schedule: Omit<Schedule, 'id' | 'clubId'>) => void;
  onSelectScheduleForAttendance: (scheduleId: string) => void;
}

export default function SchedulesSection({
  schedules,
  onAddSchedule,
  onSelectScheduleForAttendance,
}: SchedulesSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<Schedule['category']>('교류전');
  const [description, setDescription] = useState('');

  const [error, setError] = useState('');

  const categories: { label: string; value: string; color: string }[] = [
    { label: '전체', value: 'all', color: 'bg-slate-100 text-slate-700' },
    { label: '정기훈련', value: '정기훈련', color: 'bg-indigo-50 text-indigo-700' },
    { label: '대회훈련', value: '대회훈련', color: 'bg-sky-50 text-sky-700' },
    { label: '교류전', value: '교류전', color: 'bg-emerald-50 text-emerald-700' },
    { label: '대회', value: '대회', color: 'bg-rose-50 text-rose-700' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isSpecialCategory = category === '교류전' || category === '대회';
    
    if (!title.trim() || !date || (!isSpecialCategory && (!time.trim() || !location.trim()))) {
      setError('모든 항목을 입력해주세요.');
      return;
    }

    onAddSchedule({
      title,
      date,
      time: isSpecialCategory ? '' : time,
      location: isSpecialCategory ? '' : location,
      category,
      description,
    });

    // Reset Form
    setTitle('');
    setDate('');
    setTime('');
    setLocation('');
    setDescription('');
    setCategory('교류전');
    setError('');
    setIsAdding(false);
  };

  const filteredSchedules = schedules.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryTheme = (cat: Schedule['category']) => {
    switch (cat) {
      case '정기훈련':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case '대회훈련':
        return 'bg-sky-50 text-sky-700 border-sky-100';
      case '교류전':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case '대회':
        return 'bg-rose-50 text-rose-700 border-rose-100';
    }
  };

  return (
    <div id="schedules-wrapper" className="space-y-6">
      
      {/* Search & Actions Bar */}
      <div id="schedules-control-bar" className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-white p-4 rounded-xl border border-slate-100">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="schedule-search-input"
            type="text"
            placeholder="일정 이름, 장소, 내용 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 hover:bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            id="btn-toggle-add-schedule"
            onClick={() => setIsAdding(!isAdding)}
            className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all shadow-sm ${
              isAdding
                ? 'bg-slate-800 hover:bg-slate-900 text-white'
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
                <Plus className="w-4 h-4" />
                새 일정 추가
              </>
            )}
          </button>
        </div>
      </div>

      {/* Adding Schedule Form (Collapsible) */}
      {isAdding && (
        <div id="add-schedule-form-container" className="bg-white border-2 border-indigo-500/10 rounded-xl p-5 shadow-lg shadow-indigo-500/5 transition-all duration-300">
          <div className="border-b border-slate-100 pb-3 mb-4 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
              신규 동아리 모임 일정 생성
            </h3>
            <span className="text-xs text-slate-400">* 모든 항목을 성실히 입력해 주세요</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-xs text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-lg font-medium">
                ⚠️ {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">일정 제목</label>
                  <input
                    id="form-schedule-title"
                    type="text"
                    placeholder="예) 6월 2차 기획팀 리브리프 미팅"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                  />
                </div>

                <div className={category === '교류전' || category === '대회' ? "space-y-4" : "grid grid-cols-2 gap-3"}>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">활동 날짜</label>
                    <input
                      id="form-schedule-date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                    />
                  </div>
                  {category !== '교류전' && category !== '대회' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">활동 시간</label>
                      <input
                        id="form-schedule-time"
                        type="text"
                        placeholder="예) 18:00 - 20:00"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                      />
                    </div>
                  )}
                </div>

                {category !== '교류전' && category !== '대회' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">장소 및 플랫폼</label>
                    <input
                      id="form-schedule-location"
                      type="text"
                      placeholder="예) 동아리방 B홀 / 디스코드 온라인"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                    />
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">카테고리</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['교류전', '대회'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`py-2 text-xs font-medium rounded-lg border text-center transition-all ${
                          category === cat
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-800 leading-relaxed font-light">
                    📌 <strong>정기 훈련</strong>(매주 화요일, 수요일) 및 <strong>대회 훈련</strong>(매주 금요일, 토요일)은 고정 일정으로 자동 제공되므로 수동 추가가 필요하지 않고 교류전/대회만 추가가 가능합니다.
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">상세 내용 및 비고</label>
                  <textarea
                    id="form-schedule-description"
                    placeholder="활동 목적 및 사전 준비물 등을 적어주세요."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg transition-all"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm shadow-indigo-100 transition-all"
              >
                일정 추가 저장
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Filter Chips */}
      <div id="category-filter-bar" className="flex flex-wrap gap-1.5 items-center bg-slate-50 p-1.5 rounded-lg border border-slate-100/50 w-fit">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              selectedCategory === cat.value
                ? 'bg-white text-indigo-700 font-semibold shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Schedules List Grid */}
      {filteredSchedules.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">검색 결과 또는 등록된 모임 일정이 없습니다.</p>
          <button
            onClick={() => setIsAdding(true)}
            className="text-xs font-bold text-indigo-600 mt-2 hover:underline"
          >
            첫 동아리 일정 등록하러 가기 &rarr;
          </button>
        </div>
      ) : (
        <div id="schedules-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-white border border-slate-150/70 p-5 rounded-2xl hover:border-indigo-250 hover:shadow-xl hover:shadow-indigo-500/[0.015] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Card Header & Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-md border ${getCategoryTheme(schedule.category)}`}>
                    {schedule.category}
                  </span>
                  <div className="text-xs font-mono text-indigo-600 font-semibold bg-indigo-50/50 px-2 py-0.5 rounded-md">
                    {schedule.date}
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-base font-bold text-slate-950 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {schedule.title}
                </h4>

                {/* Sub details */}
                {schedule.category !== '교류전' && schedule.category !== '대회' && (
                  <div className="space-y-1.5 mt-3 text-slate-500 text-xs">
                    <p className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{schedule.time}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{schedule.location}</span>
                    </p>
                  </div>
                )}

                {/* Description */}
                {schedule.description && (
                  <p className="text-xs text-slate-500 mt-3.5 line-clamp-2 bg-slate-50/75 p-2.5 rounded-lg border border-slate-100/50 leading-relaxed font-light">
                    {schedule.description}
                  </p>
                )}
              </div>

              {/* Card Footer / Action */}
              <div className="border-t border-slate-100 pt-4 mt-5 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  ID: {schedule.id}
                </span>

                <button
                  onClick={() => onSelectScheduleForAttendance(schedule.id)}
                  className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  출석 관리
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
