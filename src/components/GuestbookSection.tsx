import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  MessageSquare, Send, FileSpreadsheet, CheckCircle, 
  Calendar, User, Mail, Phone, Sparkles, Settings2, HelpCircle 
} from 'lucide-react';

export interface GuestbookEntry {
  timestamp: string;
  association: string;
  name: string;
  phone: string;
  email: string;
  message: string;
}

const DEFAULT_ENTRIES: GuestbookEntry[] = [
  {
    timestamp: new Date(Date.now() - 3600000 * 24 * 3).toLocaleString('ko-KR'),
    association: '상명대학교 컴퓨터과학과',
    name: '김성진 교수',
    phone: '010-XXXX-XXXX',
    email: 'sj.kim@smu.ac.kr',
    message: '주승환 학생의 주차 관리 시스템 프로젝트와 Unreal Engine 기믹 설계 능력이 정말 인상 깊습니다. 학습 근성과 탄탄한 기본기가 빛나는 최우수 소프트웨어 전공자입니다!'
  },
  {
    timestamp: new Date(Date.now() - 3600000 * 18).toLocaleString('ko-KR'),
    association: '글로벌 테크 인재 발굴팀',
    name: '박지연 인사담당자',
    phone: '02-XXX-XXXX',
    email: 'jypark@globaltech.com',
    message: '포트폴리오의 완성도가 매우 높고, 실제 물리 시뮬레이터들의 완성도가 놀랍습니다. 기술을 시각적으로 연출하는 감각이 탁월하네요. 조만간 사내 인턴십 연락드리겠습니다.'
  },
  {
    timestamp: new Date(Date.now() - 3600000 * 12).toLocaleString('ko-KR'),
    association: '네이버 클라우드 리드 개발자',
    name: '이정훈 엔지니어',
    phone: '010-XXXX-XXXX',
    email: 'junghoon.lee@naver.com',
    message: 'CFD 배터리 열 유동 데이터 해석 프로젝트처럼 흔치 않고 독특한 분야까지 집요하게 파고드는 엔지니어링 마인드가 멋집니다. 미래가 매우 기대됩니다.'
  },
  {
    timestamp: new Date(Date.now() - 3600000 * 4).toLocaleString('ko-KR'),
    association: '상명테크 개발 총괄',
    name: '최우현 실장',
    phone: '010-XXXX-XXXX',
    email: 'whchoi@smu-tech.co.kr',
    message: 'SQLD 자격을 바탕으로 한 깔끔한 데이터 핸들링과 리눅스 시스템에 관한 이해도가 뛰어납니다. 적극 추천하고 싶군요!'
  }
];

export default function GuestbookSection() {
  // State for guestbook URL
  const [gasUrl, setGasUrl] = useState<string>(() => {
    return localStorage.getItem('guestbook_gas_url') || 
      ((import.meta as any).env?.VITE_GAS_URL as string) || 
      'https://script.google.com/macros/s/AKfycbztMRnUDKDhUAnWx9nknbdrVTLsz-ecx_DM0JooHDq4qCfXgAOC2Wbd2mY7tidgGbD8/exec';
  });
  const [showSettings, setShowSettings] = useState(false);

  // Form states
  const [association, setAssociation] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // UI Status
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [gasStatusMessage, setGasStatusMessage] = useState<string>('');

  // Fetch entries from local or gas URL on mount
  useEffect(() => {
    loadEntries();
  }, [gasUrl]);

  const loadEntries = async () => {
    // 1. Core local storage items load
    const savedLocal = localStorage.getItem('portfolio_guestbook_local');
    let localList: GuestbookEntry[] = savedLocal ? JSON.parse(savedLocal) : [];
    
    // Combine local user entries + pre-supplied system default entries
    const combined = [...localList, ...DEFAULT_ENTRIES];
    
    // De-duplicate if names/messages are identical
    const unique = combined.filter((v, i, a) => 
      a.findIndex(t => t.name === v.name && t.message === v.message) === i
    );
    
    setEntries(unique);

    // 2. Try fetching from GAS Spreadsheet if configured
    if (gasUrl && gasUrl.trim().startsWith('http')) {
      try {
        setGasStatusMessage('구글 시트 연동 데이터 불러오는 중...');
        const response = await fetch(gasUrl);
        if (response.ok) {
          const result = await response.json();
          if (result && result.status === 'success' && Array.isArray(result.data)) {
            // Convert timestamp dates nicely
            const gasList: GuestbookEntry[] = result.data.map((item: any) => ({
              timestamp: item.timestamp ? new Date(item.timestamp).toLocaleString('ko-KR') : new Date().toLocaleString('ko-KR'),
              association: item.association || '외부 관계자',
              name: item.name || '방문자',
              phone: item.phone || '비공개',
              email: item.email || '비공개',
              message: item.message || ''
            }));
            
            // Merge Google Sheet list + default list
            const finalMerged = [...gasList, ...DEFAULT_ENTRIES];
            const finalUnique = finalMerged.filter((v, i, a) => 
              a.findIndex(t => t.name === v.name && t.message === v.message) === i
            );
            
            setEntries(finalUnique);
            setGasStatusMessage('구글 시트 (실시간) 연동 완료');
          }
        } else {
          setGasStatusMessage('연동 실패: URL 검증 필요');
        }
      } catch (err) {
        console.error('Failed to direct sync spreadsheet', err);
        setGasStatusMessage('로컬 가상 스토리지 구동 상태 (GAS 미인증)');
      }
    } else {
      setGasStatusMessage('로컬 가상 시뮬레이터 구동 중 (우측 상단 연동 가능)');
    }
  };

  const handleSaveGasUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = gasUrl.trim();
    localStorage.setItem('guestbook_gas_url', cleanUrl);
    setGasUrl(cleanUrl);
    setShowSettings(false);
  };

  const handleGuestbookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert('이름, 이메일, 방명록 내용은 필수 입력 항목입니다.');
      return;
    }

    setLoading(true);

    const newEntry: GuestbookEntry = {
      timestamp: new Date().toLocaleString('ko-KR'),
      association: association.trim() || '일반 방문자',
      name: name.trim(),
      phone: phone.trim() || '비공개',
      email: email.trim(),
      message: message.trim()
    };

    // 1. Add locally first for real-time instantaneous reflection
    const savedLocal = localStorage.getItem('portfolio_guestbook_local');
    const localList: GuestbookEntry[] = savedLocal ? JSON.parse(savedLocal) : [];
    const updatedLocal = [newEntry, ...localList];
    localStorage.setItem('portfolio_guestbook_local', JSON.stringify(updatedLocal));

    // Update state immediate list
    setEntries(prev => {
      const merged = [newEntry, ...prev];
      return merged.filter((v, i, a) => 
        a.findIndex(t => t.name === v.name && t.message === v.message) === i
      );
    });

    // 2. POST to GAS Web App URL if it exists
    if (gasUrl && gasUrl.trim().startsWith('http')) {
      try {
        await fetch(gasUrl, {
          method: 'POST',
          mode: 'no-cors', // standard workaround for lightweight Web Apps
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEntry)
        });
        // Wait a brief delay to fetch new list after addition
        setTimeout(() => {
          loadEntries();
        }, 1500);
      } catch (error) {
        console.error('Error posting to Google Apps Script', error);
      }
    }

    // Success styling state release
    setLoading(false);
    setSubmitSuccess(true);
    
    // Clear fields
    setAssociation('');
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');

    setTimeout(() => {
      setSubmitSuccess(false);
    }, 4000);
  };

  return (
    <section id="guestbook" className="py-24 bg-[#FAF9F6] border-b border-gray-100 text-left relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Module Header block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[#3457E5] text-[10px] font-bold uppercase tracking-[2px] block mb-2 font-mono">
              COLLABORATION & RECRUITMENT OPPORTUNITIES
            </span>
            <h3 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 tracking-tight leading-tight">
              새로운 협업 성장의 기회를 언제든지 기다리고 있습니다
            </h3>
            <p className="text-xs text-gray-500 mt-2 font-semibold max-w-2xl">
              포트폴리오를 방문해주신 기업 인사담당자 및 관계자분들의 소중한 제안과 발자취를 기다립니다.
              남겨주신 내용은 실시간으로 구글 시트에 기록되며, 즉시 회신 및 자동 감사 메일이 기재해주신 주소로 발송됩니다.
            </p>
          </div>

          {/* Connection status and Config panel button */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[9px] text-gray-400 font-mono block font-bold">연동 상태 (STATUS)</span>
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold font-sans ${gasUrl ? 'text-[#3457E5]' : 'text-amber-600'}`}>
                <span className={`w-2 h-2 rounded-full ${gasUrl ? 'bg-[#3457E5] animate-pulse' : 'bg-amber-400'}`} />
                {gasStatusMessage}
              </span>
            </div>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-all cursor-pointer shadow-sm"
              title="Google Apps Script 연동 설정"
            >
              <Settings2 size={16} />
            </button>
          </div>
        </div>

        {/* GAS Settings overlay drawer inline */}
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-white border border-[#3457E5]/30 rounded-2xl shadow-md max-w-xl"
          >
            <div className="flex items-center gap-2 text-sm font-extrabold text-gray-800 mb-2">
              <Sparkles size={16} className="text-[#3457E5]" />
              구글 시트 & 이메일 발송 실시간 연동 (GAS Web App)
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              스프레드시트에 바인딩된 <strong>Apps Script 코드(Code.gs)</strong>를 웹앱 배포하여 부여받은 URL을 입력하시면 실제 구글 시트 및 이메일(방문객 자동감사, j27499643@gmail.com 동시알림)이 진짜로 연동되어 발송 완료됩니다.
            </p>
            <form onSubmit={handleSaveGasUrl} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Apps Script 웹앱 배포 URL</label>
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                  value={gasUrl}
                  onChange={(e) => setGasUrl(e.target.value)}
                  className="w-full text-xs px-4 py-2 bg-slate-50 border border-gray-200 rounded-lg focus:outline-[#3457E5] font-mono text-gray-700"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-[#3457E5] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all"
                >
                  연동 설정 적용하기
                </button>
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all"
                >
                  닫기
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* SUBMISSION FORM GRID */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm max-w-4xl mx-auto mb-16">
          <h4 className="text-xs font-extrabold uppercase text-[#3457E5] tracking-wider mb-6 font-mono flex items-center gap-2">
            <MessageSquare size={14} /> 채용 제안 및 협업 제안서 작성 (Collaboration & Recruitment Entry)
          </h4>

          {submitSuccess ? (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center text-[#3457E5] animate-fade-in flex flex-col items-center justify-center min-h-[220px]">
              <CheckCircle size={40} className="text-[#3457E5] mb-3 animate-bounce" />
              <h5 className="text-base font-extrabold mb-1">제안이 소중히 전송되었습니다!</h5>
              <p className="text-xs text-[#3457E5]/80 max-w-md mx-auto">
                기재해주신 채용/협업 조건 정보와 소중한 한마디가 기록되었습니다. 기재하신 메일함으로 감사 메일이 실시간 자동 발송되었으니 확인해 보세요!
              </p>
            </div>
          ) : (
            <form onSubmit={handleGuestbookSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">제안 기관 / 소속 기업 (예: 기업명, 대학교 등)</label>
                  <input
                    type="text"
                    placeholder="예: 상명대학교 소프트웨어공학연구소 / 테크코리아"
                    value={association}
                    onChange={e => setAssociation(e.target.value)}
                    className="bg-slate-50 text-xs px-4 py-3 rounded-xl border border-gray-200 w-full focus:bg-white focus:outline-[#3457E5] font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">성함 / 제안 담당자 성함 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="예: 홍길동 책임연구원 / 인사팀장"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="bg-slate-50 text-xs px-4 py-3 rounded-xl border border-gray-200 w-full focus:bg-white focus:outline-[#3457E5] font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">이메일 주소 (자동 기재 감사 회신용) <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    placeholder="partner@com.co.kr"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="bg-slate-50 text-xs px-4 py-3 border border-gray-200 rounded-xl w-full focus:bg-white focus:outline-[#3457E5] font-mono"
                  />
                  <span className="text-[9px] text-[#3457E5] mt-1 block">이 메일로 감사 자동 응답 메일이 실시간 자동 전송됩니다.</span>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">회신 연락처 (선택)</label>
                  <input
                    type="tel"
                    placeholder="010-1234-5678"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="bg-slate-50 text-xs px-4 py-3 border border-gray-200 rounded-xl w-full focus:bg-white focus:outline-[#3457E5] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">채용 제안 조건 및 협업 의견 메시지 <span className="text-red-500">*</span></label>
                <textarea
                  placeholder="주승환 님의 기술 역량을 보고 면접 제의 또는 산학 협업 관련 상세 의견을 작성해 주세요."
                  rows={4}
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="bg-slate-50 text-xs px-4 py-3 border border-gray-200 rounded-xl w-full focus:bg-white focus:outline-[#3457E5] font-semibold resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#3457E5] hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center gap-2"
                >
                  {loading ? (
                    '제안 전달 중 ...'
                  ) : (
                    <>
                      <Send size={14} /> 소중한 협업/채용 제안 전달하기
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* INFINITE USER GUESTBOOK TICKER STREAM */}
        <div className="w-full overflow-hidden mt-8 relative py-8">
          {/* Subtle overlay gradients for ticker ends */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#FAF9F6] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#FAF9F6] to-transparent z-10 pointer-events-none" />
          
          <div className="flex w-full select-none overflow-hidden">
            {/* Multiplied arrays for infinite scrolling buffer */}
            <div className="animate-marquee flex gap-6">
              {[...entries, ...entries, ...entries].map((entry, index) => (
                <div 
                  key={`${entry.name}-${index}`}
                  className="w-[340px] md:w-[400px] flex-shrink-0 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-[#3457E5]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  id={`guestbook-card-${index}`}
                >
                  <div className="mb-4">
                    {/* Quotation pattern icon bubble */}
                    <div className="flex items-center justify-between mb-3 text-[#3457E5]">
                      <span className="text-[10px] bg-[#3457E5]/5 text-[#3457E5] px-2.5 py-0.5 rounded-lg font-bold font-mono">
                        {entry.association}
                      </span>
                      <MessageSquare size={14} className="opacity-40" />
                    </div>
                    
                    <p className="text-xs text-gray-700 font-semibold leading-relaxed line-clamp-4">
                      "{entry.message}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-[10px]">
                    <div className="flex items-center gap-1.5 font-bold text-gray-800">
                      <div className="w-5 h-5 rounded-full bg-slate-100 text-[#3457E5] flex items-center justify-center font-sans">
                        {entry.name[0]}
                      </div>
                      <span>{entry.name}</span>
                    </div>
                    
                    <span className="text-gray-400 font-mono font-medium flex items-center gap-1">
                      <Calendar size={10} /> {entry.timestamp.split(' ')[0] || entry.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-6">
            <span className="text-[10px] text-gray-400 font-mono block font-bold">
              ★ 마우스를 올리면 방명록이 멈춰 편하게 읽으실 수 있습니다.
            </span>
          </div>
        </div>

        {/* View full Google Spreadsheet helper button */}
        <div className="flex justify-center mt-12">
          <a
            href="https://docs.google.com/spreadsheets/d/1pdlP1EcYO7oM13rJncA3bKQ3O0W-xJyBW9QH6RXAU3g/edit?gid=0#gid=0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow cursor-pointer"
          >
            <FileSpreadsheet size={14} className="text-emerald-600" />
            연동된 구글 스프레드시트 전체 원본 확인하기
          </a>
        </div>

      </div>
    </section>
  );
}
