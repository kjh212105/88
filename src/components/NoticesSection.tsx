import React, { useState } from 'react';
import { Megaphone, Pin, Plus, Search, Calendar, User, Eye, X, Tag, BookOpen, AlertCircle } from 'lucide-react';
import { Notice } from '../types';

interface NoticesSectionProps {
  notices: Notice[];
  onAddNotice: (notice: Omit<Notice, 'id' | 'clubId'>) => void;
}

export default function NoticesSection({ notices, onAddNotice }: NoticesSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [writer, setWriter] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [category, setCategory] = useState<Notice['category']>('공지');
  const [error, setError] = useState('');

  const handleAddNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !writer.trim()) {
      setError('모든 항목을 정확히 입력해주세요.');
      return;
    }

    const todayString = new Date().toISOString().split('T')[0];

    onAddNotice({
      title,
      content,
      writer,
      isImportant,
      category,
      date: todayString,
    });

    // Reset Form
    setTitle('');
    setContent('');
    setIsImportant(false);
    setCategory('공지');
    setError('');
    setIsAdding(false);
  };

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.writer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort: Important Pinned notices come first!
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.isImportant && !b.isImportant) return -1;
    if (!a.isImportant && b.isImportant) return 1;
    return b.date.localeCompare(a.date); // Latest first
  });

  const getCategoryColor = (cat: Notice['category']) => {
    switch (cat) {
      case '필독':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case '공지':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case '이벤트':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case '전달':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="notices-wrapper" className="space-y-6">
      
      {/* Search & Actions Bar */}
      <div id="notices-control-bar" className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-white p-4 rounded-xl border border-slate-100">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="notice-search-input"
            type="text"
            placeholder="공지사항 제목, 작성자, 본문 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 hover:bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            id="btn-toggle-add-notice"
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
                공지사항 쓰기
              </>
            )}
          </button>
        </div>
      </div>

      {/* Adding Notice Form */}
      {isAdding && (
        <div id="add-notice-form-container" className="bg-white border-2 border-indigo-500/10 rounded-xl p-5 shadow-lg shadow-indigo-500/5 transition-all duration-350">
          <div className="border-b border-slate-100 pb-3 mb-4 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-indigo-600" />
              신규 공지사항 게시물 작성
            </h3>
            <span className="text-xs text-slate-400">* 공지 등록 시 전체 부원 대상 전파</span>
          </div>

          <form onSubmit={handleAddNoticeSubmit} className="space-y-4">
            {error && (
              <div className="text-xs text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-lg font-medium">
                ⚠️ {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Left Form Area */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">공지 제목</label>
                  <input
                    id="form-notice-title"
                    type="text"
                    placeholder="부원들의 관심을 끌 수 있는 명확한 정보를 기재하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">상세 내용</label>
                  <textarea
                    id="form-notice-content"
                    placeholder="공지 및 전달할 구체적인 세부 내용을 자유롭게 작성할 수 있습니다."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all resize-none font-sans"
                  ></textarea>
                </div>
              </div>

              {/* Right Settings Area */}
              <div className="md:col-span-1 space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">공시 유형</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['필독', '공지', '이벤트', '전달'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`py-1.5 text-xs font-medium rounded-lg border text-center transition-all ${
                          category === cat
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">작성자 정보</label>
                  <input
                    id="form-notice-writer"
                    type="text"
                    value={writer}
                    onChange={(e) => setWriter(e.target.value)}
                    placeholder="작성자 이름 및 직함"
                    className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all font-medium"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200/55">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isImportant}
                      onChange={(e) => setIsImportant(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-700">중요 상단 교정 (Pin)</span>
                      <p className="text-[10px] text-slate-400">리스트 최상단에 고정 표시됩니다.</p>
                    </div>
                  </label>
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
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm shadow-indigo-100 transition-all flex items-center gap-1.5"
              >
                공지사항 포스팅 &rarr;
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Notice Board (Forum Style) */}
      <div id="notice-board-container" className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Table/List Header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 bg-slate-50 border-b border-slate-100 px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-2">카테고리</div>
          <div className="col-span-6">제목</div>
          <div className="col-span-2 text-center">작성자</div>
          <div className="col-span-2 text-right">등록일</div>
        </div>

        {sortedNotices.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">검색 기준에 맞는 공지사항이 발견되지 않았습니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sortedNotices.map((notice) => {
              const isExpanded = expandedNoticeId === notice.id;

              return (
                <div
                  key={notice.id}
                  className={`transition-colors duration-150 ${
                    notice.isImportant ? 'bg-amber-500/[0.02]/55 hover:bg-slate-50/50' : 'hover:bg-slate-50/35'
                  }`}
                >
                  {/* Notice Basic row wrapper */}
                  <div
                    onClick={() => setExpandedNoticeId(isExpanded ? null : notice.id)}
                    className="px-4 sm:px-6 py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center cursor-pointer select-none"
                  >
                    
                    {/* Category Label */}
                    <div className="sm:col-span-2 flex items-center gap-2">
                      {notice.isImportant && (
                        <Pin className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
                      )}
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border text-center ${getCategoryColor(notice.category)}`}>
                        {notice.category}
                      </span>
                    </div>

                    {/* Title */}
                    <div className="sm:col-span-6">
                      <span className={`text-sm tracking-tight hover:text-indigo-600 block transition-all ${
                        notice.isImportant ? 'font-bold text-slate-900' : 'font-medium text-slate-700'
                      }`}>
                        {notice.title}
                      </span>
                    </div>

                    {/* Writer */}
                    <div className="sm:col-span-2 text-left sm:text-center text-xs text-slate-500 font-medium flex sm:inline-flex items-center gap-1 sm:justify-center">
                      <User className="w-3 h-3 text-slate-400 sm:hidden" />
                      {notice.writer}
                    </div>

                    {/* Date */}
                    <div className="sm:col-span-2 text-left sm:text-right text-xs text-slate-400 font-mono">
                      <span className="sm:hidden text-slate-400 font-bold mr-1">등록일: </span>
                      {notice.date}
                    </div>

                  </div>

                  {/* Expanded Body content panel */}
                  {isExpanded && (
                    <div className="px-6 py-5 bg-slate-50/60 border-t border-slate-100 flex flex-col gap-4 text-sm leading-relaxed text-slate-600 animate-slideDown">
                      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-150/70 shadow-sm whitespace-pre-wrap font-sans text-slate-800 leading-relaxed">
                        {notice.content}
                      </div>

                      {/* Small signature block */}
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          본 공지사항과 관련된 문의는 담당자에게 문의해 주세요.
                        </span>
                        <button
                          onClick={() => setExpandedNoticeId(null)}
                          className="text-indigo-600 hover:underline font-bold"
                        >
                          본문 접기 &uarr;
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
