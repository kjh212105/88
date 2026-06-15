import React, { useState } from 'react';
import { ShieldCheck, Sparkles, UserCheck2, Plus, X, Award, GraduationCap, User } from 'lucide-react';
import { ClubMember } from '../types';

interface TeamSectionProps {
  members: ClubMember[];
  onAddMember: (member: Omit<ClubMember, 'id' | 'clubId'>) => void;
}

export default function TeamSection({ members, onAddMember }: TeamSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState(''); // Stores position
  const [email, setEmail] = useState(''); // Stores department
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !email.trim()) {
      setError('모든 항목을 입력해주세요.');
      return;
    }

    onAddMember({
      name,
      role,
      email,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
    });

    setName('');
    setRole('');
    setEmail('');
    setIsAdding(false);
    setError('');
  };

  return (
    <div id="team-section-container" className="space-y-6">
      
      {/* Member Directory Directory Panel */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <UserCheck2 className="w-4 h-4 text-slate-400" />
              정식 부원 디렉토리
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">선택된 동아리에 등록되어 활동중인 소중한 부원들입니다.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all select-none"
            >
              {isAdding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              신규 부원 추가
            </button>
            <span className="text-xs bg-slate-200/85 text-slate-700 px-2.5 py-1.5 rounded-lg font-bold">부원 {members.length}명</span>
          </div>
        </div>

        {/* Adding Member Form */}
        {isAdding && (
          <div className="p-5 bg-slate-50/50 border-b border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Award className="w-4 h-4 text-indigo-500" />
                신규 귀속 부원 가입 연동
              </h4>
              {error && <p className="text-xs text-rose-500">⚠️ {error}</p>}
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">성명</label>
                  <input
                    type="text"
                    placeholder="홍길동"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500 text-slate-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">학과</label>
                  <input
                    type="text"
                    placeholder="예) 체육교육과"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500 text-slate-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">포지션</label>
                  <input
                    type="text"
                    placeholder="예) 세터 / 레프트"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-white px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500 text-slate-700 font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 text-right">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3.5 py-1.5 border border-slate-200 text-slate-600 text-[11px] font-semibold rounded-lg hover:bg-white"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg"
                >
                  부원 가입 승인
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Members Directory Grid */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-400 text-xs">
              등록된 부원이 없습니다. 위의 버튼을 눌러 첫 부원을 영입해 보세요!
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="bg-slate-50/50 border border-slate-150/70 p-4 rounded-xl flex items-start gap-3 hover:bg-white hover:border-slate-300 hover:shadow-md hover:shadow-slate-100/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-150 text-indigo-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                  {member.name.substring(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{member.name}</span>
                    <span className="text-[9px] bg-slate-200 text-slate-500 font-extrabold px-1.5 py-0.5 rounded uppercase">
                      ID: {member.id}
                    </span>
                  </div>
                  
                  {/* Department & Position */}
                  <div className="space-y-1 mt-2">
                    <p className="text-xs text-slate-650 font-medium flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{member.email}</span>
                    </p>
                    <p className="text-xs text-slate-650 font-medium flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{member.role}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
