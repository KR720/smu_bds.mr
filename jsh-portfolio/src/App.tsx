import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, MousePointer, ChevronRight, ChevronLeft, Shield, 
  MapPin, Award, BookOpen, Mail, Phone, ExternalLink, 
  Sparkles, Layers, ArrowUpRight, Compass, ShieldCheck, Flag, CheckCircle,
  Play, Send, FileText
} from 'lucide-react';

// Import local simulation components
import ParkingSimulator from './components/ParkingSimulator';
import JumpMapSimulator from './components/JumpMapSimulator';
import BatteryCoolingSimulator from './components/BatteryCoolingSimulator';
import GuestbookSection from './components/GuestbookSection';
import ScrollReveal from './components/ScrollReveal';

// Import static structured data
import { CORE_VALUES, CERTIFICATES, SKILL_ITEMS, PROJECTS, TIMELINE } from './data';
import { Project } from './types';

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Counter animation values
  const [countProjects, setCountProjects] = useState(0);
  const [countSkills, setCountSkills] = useState(0);
  const [countFields, setCountFields] = useState(0);

  // Horizontal certifications current slide
  const [certSlide, setCertSlide] = useState(0);
  // Active skill catalog state
  const [activeSkillIdx, setActiveSkillIdx] = useState(0);
  // Projects list highlighting index
  const [activeProjHighlight, setActiveProjHighlight] = useState(0);

  // Gallery categorization state
  const [activeGalleryCat, setActiveGalleryCat] = useState<'all' | 'development' | 'game' | 'research' | 'documents'>('all');
  const [selectedGalleryProj, setSelectedGalleryProj] = useState<Project | null>(null);

  // Track window scroll for headers and highlights
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Check sections threshold to highlight active menu item
      const sections = ['home', 'about', 'skills', 'projects', 'gallery', 'growth', 'guestbook'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveMenu(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tick up stats on trigger
  useEffect(() => {
    const projTimer = setInterval(() => {
      setCountProjects(prev => (prev < 4 ? prev + 1 : 4));
    }, 150);
    const skillTimer = setInterval(() => {
      setCountSkills(prev => (prev < 5 ? prev + 1 : 5));
    }, 120);
    const fieldTimer = setInterval(() => {
      setCountFields(prev => (prev < 3 ? prev + 1 : 3));
    }, 200);

    return () => {
      clearInterval(projTimer);
      clearInterval(skillTimer);
      clearInterval(fieldTimer);
    };
  }, []);

  // Navigation jumping
  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Slideshow selectors
  const nextCert = () => {
    setCertSlide(prev => (prev + 1) % CERTIFICATES.length);
  };
  const prevCert = () => {
    setCertSlide(prev => (prev - 1 + CERTIFICATES.length) % CERTIFICATES.length);
  };

  // Download static PDF resume from public folder
  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = '/res.pdf';
    link.download = '주승환_이력서.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const galleryItems = PROJECTS.filter(item => 
    activeGalleryCat === 'all' ? true : item.category === activeGalleryCat
  );

  return (
    <div className="min-h-screen bg-white text-[#171A20] font-sans overflow-x-hidden antialiased">
      
      {/* 1. Header fixed menu bar */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-luxury ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-3.5' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Left Title Logo */}
          <button 
            type="button" 
            onClick={() => scrollTo('home')}
            className="text-[17px] font-display font-extrabold tracking-[2px] text-gray-900 flex items-center gap-2 cursor-pointer"
          >
            JOO SEUNG HWAN <span className="text-[10px] bg-[#3457E5] text-white px-2 py-0.5 rounded font-mono font-bold tracking-normal">PORTFOLIO</span>
          </button>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-semibold text-[#5C5E62]">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About Me' },
              { id: 'skills', label: 'Skills' },
              { id: 'projects', label: 'Projects' },
              { id: 'gallery', label: 'Portfolio' },
              { id: 'growth', label: 'Growth' },
              { id: 'guestbook', label: 'Collaboration' },
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className={`relative py-1 cursor-pointer transition-luxury hover:text-[#3457E5] uppercase tracking-wider ${
                  activeMenu === item.id ? 'text-[#3457E5] font-bold' : ''
                }`}
              >
                {item.label}
                {activeMenu === item.id && (
                  <motion.div 
                    layoutId="header-active-pill" 
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#3457E5]" 
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Trigger Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              type="button"
              onClick={() => scrollTo('guestbook')}
              className="px-5 py-2 rounded-full text-xs font-semibold bg-[#3457E5] text-white hover:bg-blue-700 shadow-sm transition-luxury cursor-pointer"
            >
              인재 채용 제안
            </button>
          </div>

          {/* Mobile responsive toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-gray-800 p-1"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[60px] bg-white z-40 px-6 py-8 flex flex-col gap-6 lg:hidden shadow-lg border-t border-gray-100"
          >
            {['Home', 'About Me', 'Skills', 'Projects', 'Portfolio', 'Growth', 'Collaboration'].map((label, index) => {
              const ids = ['home', 'about', 'skills', 'projects', 'gallery', 'growth', 'guestbook'];
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => scrollTo(ids[index])}
                  className="text-lg font-bold text-gray-800 text-left py-2 border-b border-gray-50 focus:text-[#3457E5]"
                >
                  {label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => scrollTo('guestbook')}
              className="mt-4 bg-[#3457E5] text-white font-bold py-3 px-6 rounded-xl text-center text-sm shadow"
            >
              인재 채용 제안
            </button>
          </motion.div>
        )}
      </AnimatePresence>


      {/* SECTION 01 — Home 메인 화면 (Artistic Flair Theme style) */}
      <section 
        id="home" 
        className="relative min-h-screen lg:h-screen lg:min-h-[850px] bg-white text-[#171A20] overflow-hidden flex flex-col justify-between items-center px-6 pt-32 pb-16 text-center"
      >
        {/* Artistic Background Simulation Layer (Subtle Gradient representing Unreal Engine/Code atmosphere) */}
        <div className="absolute inset-0 z-0 bg-[#F4F4F4]/60 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[600px] bg-gradient-to-br from-[#3457E5]/12 via-transparent to-[#FF7A00]/12 rounded-full blur-[110px]" />
        </div>

        {/* Content Top Spacer */}
        <div />

        {/* Home text content with staggered entrances */}
        <div className="relative z-10 max-w-4xl pt-4">
          {/* Subheader category */}
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block bg-[#3457E5]/10 text-[#3457E5] text-[11px] font-sans font-bold tracking-[2.5px] px-4 py-1.5 rounded-full mb-6 uppercase border border-[#3457E5]/15"
          >
            SOFTWARE DEVELOPER PORTFOLIO
          </motion.span>

          {/* Main big headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl md:text-5xl lg:text-[56px] leading-[1.1] font-display font-extrabold tracking-tight mb-6 text-[#171A20]"
          >
            아이디어를 실제 결과물로 구현하는<br />
            <span className="text-[#3457E5]">소프트웨어 개발자 주승환</span>입니다.
          </motion.h1>

          {/* Subtext paragraphs */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-sm md:text-lg text-[#5C5E62] max-w-2xl mx-auto leading-relaxed font-semibold mb-8"
          >
            Python 프로그램 개발부터 Unreal Engine 5 게임 제작, 
            리눅스 시스템 프로그래밍과 공학 데이터 정밀 분석과 구글 API 연계 연동까지 
            직접 설계하고 예외 상황을 격파하며 성장해 가고 있습니다.
          </motion.p>

          {/* Elegant Artistic Skills Badge Capsule separated by dots as shown in theme */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs md:text-sm font-mono text-[#5C5E62] bg-white/65 py-2 px-6 rounded-full border border-gray-150/80 max-w-2xl mx-auto mb-10 shadow-sm backdrop-blur-sm"
          >
            <span>Python</span>
            <span className="text-gray-300">·</span>
            <span>Java</span>
            <span className="text-gray-300">·</span>
            <span>C</span>
            <span className="text-gray-300">·</span>
            <span>Linux</span>
            <span className="text-gray-300">·</span>
            <span>Unreal Engine 5</span>
            <span className="text-gray-300">·</span>
            <span>GUI Dev</span>
            <span className="text-gray-300">·</span>
            <span>Data Analysis</span>
          </motion.div>

          {/* Action side-by-side buttons like Model 3 page but matching Artistic Theme colors */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="flex flex-col sm:flex-row justify-center gap-4 px-6"
          >
            <a
              href="https://github.com/KR720/lynx"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-64 py-4 bg-[#3457E5] text-white font-bold rounded-full text-sm transition-transform hover:scale-105 shadow-md hover:bg-[#3457E5]/90 cursor-pointer font-sans flex items-center justify-center"
            >
              프로젝트 보기(GitHub)
            </a>
            <button
              type="button"
              onClick={() => scrollTo('gallery')}
              className="w-full sm:w-64 py-4 bg-[#E2E5EA] text-[#171A20] font-bold rounded-full text-sm transition-transform hover:scale-105 shadow-sm hover:bg-[#E2E5EA]/85 cursor-pointer font-sans"
            >
              포트폴리오 보기
            </button>
          </motion.div>
        </div>

        {/* Scroll explorer downward indicator with fine vertical line */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="relative z-10 flex flex-col items-center gap-2 cursor-pointer pb-2"
          onClick={() => scrollTo('summary')}
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#171A20] to-transparent" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#5C5E62]">Scroll to Explore</span>
        </motion.div>
      </section>


      {/* SECTION 02 — 한눈에 보는 나 (Tesla Stats Summary layout) */}
      <section id="summary" className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal variant="grow">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[#3457E5] text-[10px] font-bold uppercase tracking-[2px] block mb-2 font-mono">ACTIVITY SUMMARY</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-extrabold tracking-tight text-gray-900 leading-tight">
                배우는 것에서 멈추지 않고<br />
                <span className="text-[#3457E5]">직접 설계하고 완벽한 결과물</span>로 증명합니다.
              </h2>
              <p className="text-[#5C5E62] text-sm mt-3 leading-relaxed font-semibold">
                소프트웨어 핵심 기반 지식과 게임 기믹 연구, 수동 배수 필터링을 결합하여 실전 기획 능력을 겸비하고 있습니다.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {/* Stat Item 1 */}
            <ScrollReveal variant="zoom-in" delay={0.1}>
              <div className="bg-[#F4F4F4] rounded-2xl p-6 text-center border border-gray-100 hover:shadow-md transition-luxury group h-full">
                <div className="text-4xl lg:text-5xl font-display font-extrabold text-[#3457E5] font-mono mb-2 group-hover:scale-105 transition-luxury">
                  {countProjects}+
                </div>
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-1">핵심 프로젝트</h4>
                <p className="text-[11px] text-gray-400">GUI 프로그램 개발, 3D 기믹 게임 및 공학 다변수 연구</p>
              </div>
            </ScrollReveal>

            {/* Stat Item 2 */}
            <ScrollReveal variant="zoom-in" delay={0.2}>
              <div className="bg-[#F4F4F4] rounded-2xl p-6 text-center border border-gray-100 hover:shadow-md transition-luxury group h-full">
                <div className="text-4xl lg:text-5xl font-display font-extrabold text-[#3457E5] font-mono mb-2 group-hover:scale-105 transition-luxury">
                  {countSkills}+
                </div>
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-1">핵심 활용 기술</h4>
                <p className="text-[11px] text-gray-400">Python, Java, C/Linux, UE5, Data Science</p>
              </div>
            </ScrollReveal>

            {/* Stat Item 3 */}
            <ScrollReveal variant="zoom-in" delay={0.3}>
              <div className="bg-[#F4F4F4] rounded-2xl p-6 text-center border border-gray-100 hover:shadow-md transition-luxury group h-full">
                <div className="text-4xl lg:text-5xl font-display font-extrabold text-[#3457E5] font-mono mb-2 group-hover:scale-105 transition-luxury">
                  {countFields}
                </div>
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-1">핵심 활동 전문 도메인</h4>
                <p className="text-[11px] text-gray-400">통합 데스크톱 애플리케이션, 인게임 충돌, 과학 가시화</p>
              </div>
            </ScrollReveal>

            {/* Stat Item 4 */}
            <ScrollReveal variant="zoom-in" delay={0.4}>
              <div className="bg-[#F4F4F4] rounded-2xl p-6 text-center border border-gray-100 hover:shadow-md transition-luxury group h-full">
                <div className="text-2xl lg:text-3xl font-display font-extrabold text-[#FF7A00] uppercase inline-block mb-3 bg-[#FF7A00]/10 px-3 py-1 rounded-full text-[11px] font-semibold">
                  지속 가동 중
                </div>
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-1">성장 프로세스</h4>
                <p className="text-[11px] text-gray-400">기사 자격증 대비, 프로젝트 최적화, 경진대회 및 채용 준비</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>


      {/* SECTION 03 — About Me layout */}
      <section id="about" className="py-24 bg-[#F4F4F4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Profile Image Wireframe Frame */}
            <ScrollReveal variant="slide-right" className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-[#3457E5]/10 rounded-3xl transform rotate-2 z-0" />
              <div className="relative z-10 bg-white border border-gray-200 p-4 rounded-3xl shadow-sm text-center">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 relative mb-4">
                  <img 
                    src="/dog.png" 
                    alt="주승환 (Joo Seung Hwan)" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none"
                  />
                  {/* Subtle modern overlay grandient for high-end look */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 text-left text-white">
                    <span className="text-[13px] font-bold tracking-wide block">주승환 (Joo Seung Hwan)</span>
                    <span className="text-[11px] text-[#3457E5] font-mono font-bold">Software Engineer Mascot</span>
                  </div>
                </div>

                <div className="flex justify-between items-center px-2 text-xs">
                  <div className="text-left">
                    <span className="text-gray-400 block text-[9px] font-bold">CONTACT DIRECT</span>
                    <span className="font-mono font-bold text-gray-800">j27499643@gmail.com</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 block text-[9px] font-bold">UNIVERSITY</span>
                    <span className="font-bold text-gray-800">상명대학교</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Column details */}
            <ScrollReveal variant="slide-left" delay={0.2} className="lg:col-span-7 text-left">
              <span className="text-[#3457E5] text-[10px] font-bold uppercase tracking-[2px] font-mono block mb-2">ABOUT THE DEVELOPER</span>
              <h3 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-gray-900 leading-tight mb-6">
                문제를 발견하면<br />
                <span className="text-[#3457E5]">해결될 때까지 시도</span>하고 뚫어냅니다.
              </h3>

              <div className="space-y-4 text-sm text-[#5C5E62] leading-relaxed font-semibold">
                <p>
                  저는 상명대학교에서 소프트웨어 관련 전공을 공부하며 Python, Java, C와 리눅스 프로그래밍을 입체적으로 학습하고 있습니다. 
                  단순히 교재의 이론을 암기하거나 예제를 복사 붙여넣기 하는 것보다, 머릿속 아이디어를 직접 빌드해 실행해보고 발생하는 오류들을 하나하나 뜯어 교정해 나가며 배울 때 가장 강한 열정이 피어납니다.
                </p>
                <p>
                  실제로 Tkinter 주차장 관리 시스템을 개발하며 입출차 데이터 불일치를 제어했고, Unreal Engine 5 러너 잼 게임에서는 체크포인트 좌표 구조 연동 누수를 해결하기도 했습니다. 
                  전기차 배터리 냉각 분석에서는 거친 논문 화상 그래픽에서 WebPlotDigitizer로 좌표를 보간 축출하여, 유동 전산과 팬 에너지 소비력 계수를 엑셀 함수로 완벽 유도해냈습니다.
                </p>
                <p>
                  소프트웨어의 가치는 실전에 돌아가는 안정성에 있다는 점을 믿고 있으며, 기능 구성에 그치지 않고 최종 수혜자가 체감하는 편익 수준을 끝없이 검토하는 꼼꼼한 엔지니어로 성장할 것입니다.
                </p>
              </div>

              {/* Bold highlight tag phrase */}
              <div className="my-8 border-l-4 border-[#3457E5] pl-4 py-1">
                <p className="text-base md:text-lg font-bold text-gray-900">
                  “사용자에게 정말로 필요한 기능을 실제 눈앞에 돌아가는 실물 소스 결과물로 구현해 내는 집념의 개발자를 지향합니다.”
                </p>
              </div>

              {/* PDF Resume / Portfolio Download buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="/res1.zip"
                  download="주승환_이력서_Resume.zip"
                  className="bg-[#3457E5] hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center gap-2"
                >
                  <FileText size={14} /> 국문 이력서 PDF 다운로드
                </a>
                <button
                  type="button"
                  onClick={() => scrollTo('guestbook')}
                  className="bg-gray-900 hover:bg-black text-white px-6 py-3.5 rounded-xl text-xs font-bold shadow hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  기제 프로필 및 문의 사항
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo('gallery')}
                  className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 px-6 py-3.5 rounded-xl text-xs font-bold shadow-sm hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  포트폴리오 자세히 목록 확인
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>


      {/* SECTION 04 — 핵심 가치관 */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal variant="grow">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-[#3457E5] text-[10px] font-bold uppercase tracking-[2px] block mb-2 font-mono">CORE VALUES</span>
              <h3 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-gray-900">
                제가 중요하게 생각하는 세 가지 엔지니어링 신념입니다.
              </h3>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {CORE_VALUES.map((val, idx) => (
              <ScrollReveal key={idx} variant="zoom-in" delay={idx * 0.15}>
                <div 
                  className="bg-[#F4F4F4] rounded-2.5xl p-8 text-center border border-gray-100 hover:border-[#3457E5]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-white text-[#3457E5] flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                      {val.iconName === 'zap' && <span className="text-2xl font-bold">⚡</span>}
                      {val.iconName === 'wrench' && <span className="text-2xl font-bold">🛠</span>}
                      {val.iconName === 'trending-up' && <span className="text-2xl font-bold">📈</span>}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3">{val.title}</h4>
                    <p className="text-xs text-[#5C5E62] leading-relaxed font-semibold">
                      {val.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Under-quote emphasis text */}
          <ScrollReveal variant="fade-up" delay={0.3}>
            <div className="mt-16 text-center max-w-3xl mx-auto">
              <p className="text-base md:text-lg font-extrabold text-[#3457E5] bg-[#3457E5]/5 px-6 py-4 rounded-xl border border-dashed border-[#3457E5]/20">
                💡 기능을 단순히 작동시키는 것에서 매듭짓지 않고, 사용자가 일상에서 더 편리하게 활용할 수 있는 UI 감성까지 정정 논의합니다.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>


      {/* SECTION 05 — 자격증 및 학습 성과 (Tesla Horizontal style slide) */}
      <section className="py-24 bg-[#F4F4F4] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal variant="grow">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4 text-left">
              <div>
                <span className="text-[#3457E5] text-[10px] font-bold uppercase tracking-[2px] block mb-2 font-mono">GOVERNMENT / PROFESSIONAL COMPETENCIES</span>
                <h3 className="text-3xl font-display font-extrabold tracking-tight text-gray-900">
                  전공 역량을 정량적인 수준으로 확장하고 있습니다.
                </h3>
                <p className="text-[#5C5E62] text-sm mt-2 font-semibold">
                  자체 실전 프로젝트 빌드와 더불어 개발, 디비, OS, 분석 4대 영역 자격 요건을 취득 진행하고 있습니다.
                </p>
              </div>
              
              {/* Slide control arrows */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevCert}
                  className="p-2.5 rounded-full bg-white hover:bg-gray-100 text-gray-800 shadow-sm border border-gray-200 transition-luxury cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={nextCert}
                  className="p-2.5 rounded-full bg-white hover:bg-gray-100 text-gray-800 shadow-sm border border-gray-200 transition-luxury cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Horizontal list displaying focused certifications */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto overflow-hidden">
            {CERTIFICATES.map((cert, index) => {
              const isSelected = certSlide === index;
              return (
                <ScrollReveal key={index} variant="zoom-in" delay={index * 0.1}>
                  <div
                    className={`bg-white rounded-2xl p-6 text-left border shadow-sm transition-all duration-500 flex flex-col justify-between h-[230px] cursor-pointer ${
                      isSelected 
                        ? 'border-[#3457E5] ring-2 ring-[#3457E5]/10 scale-[1.02] bg-gradient-to-tr from-white to-blue-50/25' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setCertSlide(index)}
                  >
                    <div>
                      {/* Header: Name and Status badge */}
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <h4 className="text-sm font-extrabold text-gray-950 font-sans leading-tight">
                          {cert.name}
                        </h4>
                        
                        {/* Badge status styling */}
                        {cert.status === 'completed' && (
                          <span className="bg-gray-900 text-white text-[8px] font-bold px-2 py-0.5 rounded uppercase font-mono">
                            취득 완료
                          </span>
                        )}
                        {cert.status === 'active' && (
                          <span className="bg-[#3457E5] text-white text-[8px] font-bold px-2 py-0.5 rounded uppercase font-mono animate-pulse">
                            준비 중
                          </span>
                        )}
                        {cert.status === 'upcoming' && (
                          <span className="bg-gray-150 text-[#5C5E62] border border-gray-200 text-[8px] font-bold px-2 py-0.5 rounded uppercase font-mono">
                            취득 예정
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-[#5C5E62] leading-relaxed font-semibold">
                        {cert.description}
                      </p>
                    </div>

                    {/* Progressive bar below item showing completion check */}
                    <div>
                      <div className="flex justify-between items-center text-[9px] text-gray-400 font-mono font-bold mb-1">
                        <span>역량 숙달 지표</span>
                        <span>{cert.progressPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-700 ${
                            cert.status === 'active' ? 'bg-[#3457E5]' :
                            cert.status === 'completed' ? 'bg-gray-900' :
                            'bg-gray-300'
                          }`}
                          style={{ width: `${cert.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>


      {/* SECTION 06 — Skills Catalog Tab Selector */}
      <section id="skills" className="py-24 bg-white border-b border-gray-100 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal variant="grow">
            <div className="max-w-3xl mb-16">
              <span className="text-[#3457E5] text-[10px] font-bold uppercase tracking-[2px] block mb-2 font-mono">TECHNICAL MATRIX</span>
              <h3 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-gray-900 leading-tight">
                실무 툴 이름 나열에서 비약해,<br />
                <span className="text-[#3457E5]">그 코드로 이룩한 성취 핵심</span>을 상세히 논증합니다.
              </h3>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left buttons selection col */}
            <ScrollReveal variant="slide-right" className="lg:col-span-4 space-y-2">
              {SKILL_ITEMS.map((skill, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSkillIdx(idx)}
                  className={`w-full p-4 rounded-xl text-left font-sans transition-all flex items-center justify-between border cursor-pointer ${
                    activeSkillIdx === idx
                      ? 'bg-[#3457E5] border-[#3457E5] text-white shadow-md font-bold'
                      : 'bg-[#F4F4F4] border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-extrabold opacity-60">0{idx + 1}</span>
                    <span className="text-sm font-extrabold">{skill.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                      activeSkillIdx === idx ? 'bg-white/20 text-white' : 'bg-white text-gray-600 border'
                    }`}>
                      숙련: {skill.levelText}
                    </span>
                    <ChevronRight size={14} className="opacity-70" />
                  </div>
                </button>
              ))}
            </ScrollReveal>

            {/* Right Detailed card col with nice motion animation */}
            <ScrollReveal variant="slide-left" delay={0.1} className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSkillIdx}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.35 }}
                  className="bg-[#F4F4F4] border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col justify-between min-h-[440px]"
                >
                  <div>
                    {/* Head row */}
                    <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                      <div>
                        <h4 className="text-2xl font-display font-extrabold text-[#171A20] flex items-center gap-2">
                          {SKILL_ITEMS[activeSkillIdx].name}
                          <span className="text-xs text-[#3457E5] font-mono font-bold bg-[#3457E5]/10 px-2.5 py-0.5 rounded-full">
                            기여 자산 지수: LEVEL {SKILL_ITEMS[activeSkillIdx].levelText}
                          </span>
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-gray-400 block uppercase font-mono">가용 수준</span>
                        <span className="font-mono text-xl font-extrabold text-gray-800">{SKILL_ITEMS[activeSkillIdx].proficiency}%</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${SKILL_ITEMS[activeSkillIdx].proficiency}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="bg-[#3457E5] h-full"
                        />
                      </div>
                    </div>

                    {/* Bullet elements details */}
                    <div>
                      <h5 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-3 font-mono">실제 프로젝트 활용 및 기어 지점 (Experiences)</h5>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {SKILL_ITEMS[activeSkillIdx].experiences.map((exp, expIdx) => (
                          <li key={expIdx} className="bg-white rounded-lg p-3 text-xs text-gray-700 leading-relaxed font-semibold border border-gray-100 flex items-start gap-2 shadow-sm">
                            <span className="text-[#3457E5] font-bold">✔</span>
                            <span>{exp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Relative Project shortcut jump */}
                  <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between items-center text-xs">
                    <span className="text-[#5C5E62] font-semibold">
                      연계 활용 프로젝트: <strong>{SKILL_ITEMS[activeSkillIdx].name} 전용 실전 시뮬레이션</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => scrollTo('projects-display')}
                      className="text-[#3457E5] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      실수 측정 시뮬레이션으로 점프 <ArrowUpRight size={14} />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </ScrollReveal>
          </div>
        </div>
      </section>


      {/* SECTION 07 — Projects 시작 화면 (Dark Slate theme placeholder) */}
      <section className="bg-[#111827] py-24 text-white text-center relative overflow-hidden">
        {/* Abstract vector dots */}
        <div className="absolute inset-0 opacity-[0.05] bg-grid-pattern pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <span className="inline-block bg-[#3457E5] text-white text-[10px] font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest font-mono">
            SECTION 07 — WORKS & MOCKUP DEMOS
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight mb-6">
            직접 기획하고 연산 완성한<br />
            실전 레코드 주요 프로젝트를 안내합니다.
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-semibold mb-12">
            학습 과제 제출 한도를 넘어 실제로 사용자들이 동작 단추를 눌러 피드백을 검증할 수 있는 
            고기능성 시뮬레이터 3종을 아래에서 곧바로 주행하실 수 있습니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
            {[
              { num: '01', name: 'Python 주차 관리 시스템', tech: 'GUI, Datetime' },
              { num: '02', name: 'Unreal점프 기믹 게임', tech: 'Blueprint, Physics' },
              { num: '03', name: 'EV 배터리 가시화 연구', tech: 'CFD, Digitizer' },
            ].map((p, idx) => (
              <div 
                key={idx} 
                className="bg-gray-800/55 rounded-xl p-4 border border-gray-700 hover:border-blue-500 transition-luxury cursor-pointer"
                onClick={() => scrollTo(idx === 0 ? 'p1' : idx === 1 ? 'p2' : 'p3')}
              >
                <span className="text-[#3457E5] font-mono font-bold text-lg block mb-1">{p.num}</span>
                <span className="text-xs font-bold block">{p.name}</span>
                <span className="text-[10px] text-gray-500 font-mono block mt-1">{p.tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Unified container for live projects display with scroll triggers */}
      <div id="projects-display">
        
        {/* SECTION 08 — Project 01: Python 주차장 관리 시스템 */}
        <section id="p1" className="py-24 bg-white border-b border-gray-100 text-left">
          <div className="max-w-7xl mx-auto px-6">
            
            {/* Top Info section */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-[#3457E5] bg-blue-50 px-2 py-0.5 rounded">PROJECT #01</span>
                <span className="text-xs text-gray-400 font-semibold font-mono">1층-3층 통합 배치 모듈</span>
              </div>
              <h2 className="text-3xl font-display font-extrabold text-gray-900 mb-2">
                01. Python 주차장 통합 요금 관리 시스템 (Tkinter GUI Desktop)
              </h2>
              <p className="text-[#5C5E62] text-sm font-semibold max-w-3xl">
                차량 번호판을 기반으로 층별 주차 배치 가용 층을 컬러 리딩하고, 경과 시 분당 가격 계산, 친환경/복지 단축 요율을 적용해 요금 계산 예외 오류를 잡아낸 기획 작품입니다.
              </p>
            </div>

            {/* Custom Interactive Simulator component */}
            <ParkingSimulator />

            {/* Problem Solving Segment below simulator */}
            <div className="mt-12 bg-[#F4F4F4] rounded-2xl p-6 border border-gray-200">
              <h4 className="text-sm font-extrabold uppercase text-gray-400 tracking-wider mb-2 font-mono">핵심 디버그 해결 경험 (Troubleshooting Story)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-red-500 block">원인 분석 (Troubling Leak):</span>
                  <p className="text-xs text-gray-700 leading-relaxed font-semibold mt-1">
                    {PROJECTS[0].problemSolving.problem}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#3457E5] block">우회 수정 패키지 (Solution):</span>
                  <p className="text-xs text-gray-700 leading-relaxed font-semibold mt-1">
                    {PROJECTS[0].problemSolving.solution}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* SECTION 09 — Project 02: Unreal Engine 5 점프맵 게임 */}
        <section id="p2" className="py-24 bg-[#F4F4F4] border-b border-gray-100 text-left">
          <div className="max-w-7xl mx-auto px-6">
            
            {/* Top Info Section */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">PROJECT #02</span>
                <span className="text-xs text-gray-400 font-semibold font-mono">3D Level / Gravity Physics</span>
              </div>
              <h2 className="text-3xl font-display font-extrabold text-gray-900 mb-2">
                02. Unreal Engine 5 러너 점프맵 기믹 게임 (Checkpoint Logic)
              </h2>
              <p className="text-[#5C5E62] text-sm font-semibold max-w-3xl">
                다양한 고속 회전 장애물 기믹의 타임라인 이동 발판을 기획 배치하고, 플레이어 낙사 충돌 시에 초기 시작 위치가 아닌 통과했던 마지막 정밀 체크포인트 좌표로 자동 부활하는 알고리즘을 짰습니다.
              </p>
            </div>

            {/* Custom Interactive Simulator */}
            <JumpMapSimulator />

            {/* Problem Solving block */}
            <div className="mt-12 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h4 className="text-sm font-extrabold uppercase text-gray-400 tracking-wider mb-2 font-mono">핵심 디버그 해결 경험 (Troubleshooting Story)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-red-500 block">원인 분석 (Troubling Leak):</span>
                  <p className="text-xs text-gray-700 leading-relaxed font-semibold mt-1">
                    {PROJECTS[1].problemSolving.problem}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-bold text-orange-600 block">우회 수정 패키지 (Solution):</span>
                  <p className="text-xs text-gray-700 leading-relaxed font-semibold mt-1">
                    {PROJECTS[1].problemSolving.solution}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* SECTION 10 — Project 03: 전기차 배터리 공랭식 냉각 연구 */}
        <section id="p3" className="py-24 bg-white border-b border-gray-100 text-left">
          <div className="max-w-7xl mx-auto px-6">
            
            {/* Top info section */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">PROJECT #03</span>
                <span className="text-xs text-gray-400 font-semibold font-mono">Thermal CFD / Grid Interpolation</span>
              </div>
              <h2 className="text-3xl font-display font-extrabold text-gray-900 mb-2">
                03. EV 배터리 공랭식 냉각 채널 열 균일성 연구 (WebPlotDigitizer)
              </h2>
              <p className="text-[#5C5E62] text-sm font-semibold max-w-3xl">
                배터리 셀 온도의 급격적 임계를 극복하기 위해 다변수 리브 채널 형상을 가설 정의하고, 선행 논문 도판에서 데이터를 캘리브레이션 축출 후 난류 유효성을 엑셀 함수 지표로 완성해낸 융합 연구 성과물입니다.
              </p>
            </div>

            {/* Custom Interactive Simulator */}
            <BatteryCoolingSimulator />

            {/* Problem Solving block */}
            <div className="mt-12 bg-[#F4F4F4] rounded-2xl p-6 border border-gray-200">
              <h4 className="text-sm font-extrabold uppercase text-gray-400 tracking-wider mb-2 font-mono">핵심 디버그 해결 경험 (Troubleshooting Story)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-red-500 block">원인 분석 (Troubling Leak):</span>
                  <p className="text-xs text-gray-700 leading-relaxed font-semibold mt-1">
                    {PROJECTS[2].problemSolving.problem}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-600 block">우회 수정 패키지 (Solution):</span>
                  <p className="text-xs text-gray-700 leading-relaxed font-semibold mt-1">
                    {PROJECTS[2].problemSolving.solution}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>


      {/* SECTION 12 — Portfolio Gallery layout */}
      <section id="gallery" className="py-24 bg-white border-b border-gray-100 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#3457E5] text-[10px] font-bold uppercase tracking-[2px] block mb-2 font-mono">PORTFOLIO ARCHIVE</span>
            <h3 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-gray-900">
              설명보다 실증적 개발 결과물로<br />
              진짜 역량을 당당히 증빙합니다.
            </h3>
            <p className="text-[#5C5E62] text-sm mt-3 font-semibold">
              카테고리 탭 단추를 누르면, 각 기획 분야의 분석 보고서, 동영상 경로 슬롯 및 깃허브 코드 경로 자료의 카드 오퍼링을 보실 수 있습니다.
            </p>
          </div>

          {/* Categorized filter selection tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12 bg-[#F4F4F4] p-1.5 rounded-xl max-w-xl mx-auto border border-gray-200">
            {[
              { id: 'all', label: '전체 도메인 (All)' },
              { id: 'development', label: '프로그램 (Dev)' },
              { id: 'game', label: '게임 맵 (Game)' },
              { id: 'research', label: '공학유동 (CFD)' },
              { id: 'documents', label: '문서화 (Doc)' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveGalleryCat(tab.id as any)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-luxury cursor-pointer ${
                  activeGalleryCat === tab.id
                    ? 'bg-white text-[#3457E5] shadow font-extrabold'
                    : 'text-[#5C5E62] hover:text-[#171A20]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Display grid results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-[#F4F4F4] rounded-2.5xl p-6 border border-gray-150 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left flex flex-col justify-between h-[340px]"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] text-gray-400 font-mono font-extrabold uppercase">
                      NO.{item.num} | {item.category.toUpperCase()}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3457E5]" />
                  </div>
                  <h4 className="text-lg font-extrabold text-gray-900 mb-2 leading-snug">{item.name}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-semibold mb-3">
                    {item.tagline}
                  </p>
                  
                  {/* Scope bullets */}
                  <div className="flex flex-wrap gap-1 mt-2 mb-4">
                    {item.techStack.map((t, tIdx) => (
                      <span key={tIdx} className="bg-white text-gray-600 border text-[9px] font-mono px-2 py-0.5 rounded font-bold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Subfooter details panel */}
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold mb-3">
                     <strong>전담 기여 역할:</strong> {item.role[0].slice(0, 32)}...
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedGalleryProj(item)}
                      className="bg-gray-900 text-white text-[10px] font-bold py-2 px-1 rounded-lg text-center hover:bg-black transition-luxury cursor-pointer"
                    >
                      자세히 정보
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        scrollTo(item.demoType === 'parking' ? 'p1' : item.demoType === 'game-jump' ? 'p2' : 'p3');
                      }}
                      className="bg-white text-gray-800 border text-[10px] font-bold py-2 px-1 rounded-lg text-center hover:bg-gray-100 transition-luxury cursor-pointer"
                    >
                      데모 기믹
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`해당 기무 소스코드 및 상세 정보 리드미 피드백이 준비된 영역입니다.`)}
                      className="bg-white text-[#3457E5] border text-[10px] font-bold py-2 px-1 rounded-lg text-center hover:bg-[#3457E5]/5 transition-luxury cursor-pointer"
                    >
                      수정 기록
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Floating pop up Modal on selected work click */}
        <AnimatePresence>
          {selectedGalleryProj && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar"
              >
                {/* Close Button top */}
                <button
                  type="button"
                  onClick={() => setSelectedGalleryProj(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-luxury cursor-pointer"
                >
                  <X size={16} />
                </button>

                <div className="text-left">
                  <span className="text-[#3457E5] font-mono text-[10px] font-bold uppercase tracking-widest block mb-1">
                    PROJECT ARCHITECTURE DETAILS
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#171A20] leading-tight mb-2">
                    {selectedGalleryProj.name}
                  </h3>
                  <p className="text-xs text-[#3457E5] font-semibold italic mb-6">
                    "{selectedGalleryProj.tagline}"
                  </p>

                  <div className="space-y-6">
                    {/* General outline */}
                    <div>
                      <h4 className="text-xs uppercase font-extrabold text-gray-400 tracking-wider mb-2 font-mono">기획 및 요약 정보 (Description)</h4>
                      <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                        {selectedGalleryProj.description}
                      </p>
                    </div>

                    {/* Features checklist */}
                    <div>
                      <h4 className="text-xs uppercase font-extrabold text-gray-400 tracking-wider mb-2 font-mono">주요 핵심 실현 기체 (Core Features)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedGalleryProj.features.map((feat, fIdx) => (
                          <div key={fIdx} className="bg-[#F4F4F4] rounded-xl p-3 border border-gray-100 text-xs">
                            <span className="font-extrabold text-gray-900 block mb-0.5">✔ {feat.title}</span>
                            <span className="text-[#5C5E62] font-semibold">{feat.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Roles explicitly */}
                    <div>
                      <h4 className="text-xs uppercase font-extrabold text-gray-400 tracking-wider mb-2 font-mono">상세 자격증 취득 과외 및 실주도 역할 (Roles Dedicated)</h4>
                      <ul className="space-y-1.5 text-xs text-gray-600 font-semibold">
                        {selectedGalleryProj.role.map((r, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-1.5">
                            <span className="text-[#3457E5]">▪</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technical tools used */}
                    <div>
                      <h4 className="text-xs uppercase font-extrabold text-gray-400 tracking-wider mb-2 font-mono">가용 테크 패키지 (Tech Stack)</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedGalleryProj.techStack.map((techItem, techIdx) => (
                          <span key={techIdx} className="bg-gray-950 text-white font-mono text-[9px] font-bold px-2.5 py-1 rounded">
                            {techItem}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Image / Video / report showcase area as user asked "space for images/videos in mock details" */}
                    <div className="border border-dashed border-gray-300 rounded-2xl p-4 bg-gray-50">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2 font-mono">소스로 입증한 동화상 및 기획 리포트 배치 슬롯 (Report Area)</span>
                      <div className="aspect-video bg-gray-900 text-white flex flex-col items-center justify-center rounded-xl p-4 relative overflow-hidden group">
                        <Play size={20} className="text-white mb-2 animate-bounce" fill="#ffffff" />
                        <span className="text-xs font-mono font-bold tracking-wider">demo_showreel_view.mp4</span>
                        <span className="text-[10px] text-gray-400 mt-2">* 클릭 시 해당 대외용 캡스톤 보고서 및 발표 팟캐스트 송출 제어 가능</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGalleryProj(null);
                        scrollTo(selectedGalleryProj.demoType === 'parking' ? 'p1' : selectedGalleryProj.demoType === 'game-jump' ? 'p2' : 'p3');
                      }}
                      className="bg-[#3457E5] text-white p-2.5 hover:bg-blue-700 rounded-lg font-bold transition-luxury cursor-pointer"
                    >
                      실행 시뮬레이터 바로가기
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedGalleryProj(null)}
                      className="bg-gray-150 text-gray-800 p-2.5 hover:bg-gray-200 rounded-lg font-bold"
                    >
                      닫기 (Exit)
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </section>


      {/* SECTION 13 — 성장 계획 Timeline */}
      <section id="growth" className="py-24 bg-[#F4F4F4] text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#3457E5] text-[10px] font-bold uppercase tracking-[2px] block mb-2 font-mono">FUTURE ROADMAP</span>
            <h3 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-gray-900">
              현재의 경험을 디딤돌 삼아<br />
              지속 가능한 다음 도약을 설계하고 있습니다.
            </h3>
            <p className="text-[#5C5E62] text-sm mt-3 font-semibold">
              매년 전술적인 자격증, 대회 출품 이정표를 기반으로, 어떤 문제도 이겨낼 수 있는 탄탄한 소프트웨어 스페셜리스트가 되겠습니다.
            </p>
          </div>

          {/* Staggered Vertical/Nested Timeline cards block */}
          <div className="max-w-4xl mx-auto relative border-l-2 border-gray-300 pl-6 space-y-12 py-3">
            {TIMELINE.map((time, idx) => (
              <div key={idx} className="relative text-left">
                
                {/* Node pin indicator */}
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white bg-[#3457E5] z-10" />

                <div className="bg-white rounded-2xl p-6 border border-gray-150 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                    <span className="font-display font-extrabold text-2xl text-[#3457E5] font-mono leading-none">
                      {time.year}
                    </span>
                    <span className="bg-gray-900 text-white font-mono text-[9px] font-bold px-2.5 py-0.5 rounded uppercase">
                      {time.title}
                    </span>
                  </div>

                  <ul className="space-y-2 mt-2">
                    {time.items.map((itPoint, itIdx) => (
                      <li key={itIdx} className="text-xs text-[#5C5E62] leading-relaxed font-semibold flex items-start gap-2">
                        <span className="text-[#3457E5] font-bold">▫</span>
                        <span>{itPoint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center max-w-3xl mx-auto">
            <p className="font-display font-extrabold text-lg md:text-2xl text-gray-900 tracking-tight leading-snug">
              사용자의 문제를 정밀 분석하고 안정적인 프로그램 코드로<br />
              <span className="text-[#3457E5]">신속하게 우회 교정해내는 실무형 풀 스택 파트너</span>로 평생 공헌하겠습니다.
            </p>
          </div>
        </div>
      </section>


      {/* SECTION 13.5 — Real-time Guestbook with GAS */}
      <GuestbookSection />


      {/* Dynamic final quotation accent line */}
      <section className="py-16 bg-[#FAF9F6] text-center border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500 text-xl font-display font-extrabold tracking-tight animate-soft-pulse mb-2">
            "방문해 주셔서 대단히 감사드립니다. 항상 겸허히 경청하고 압도적인 속도로 성장하겠습니다."
          </p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">
            JOO SEUNG HWAN • SHANGMYUNG UNIVERSITY SOFTWARE ENGINEERING
          </p>
        </div>
      </section>


      {/* Unified professional Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12 px-6 text-left relative overflow-hidden text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-white font-display font-bold tracking-widest text-[13px] block mb-2">JOO SEUNG HWAN PORTFOLIO</span>
            <p className="text-gray-500 text-[11px] leading-relaxed font-semibold">
              사용자와 클라이언트의 근본 문제를 실제 눈앞에 돌아가는 가용 프로그램과 정량 데이터로 이룩하고 고쳐냅니다.
            </p>
          </div>
          <div>
            <span className="text-white font-bold uppercase tracking-wider block mb-2 uppercase text-[10px]">대표 기술 스택 도메인</span>
            <p className="text-gray-500 text-[11px] font-mono leading-relaxed font-bold">
              Python • Java • C • Linux • Unreal Engine 5 • Advanced CFD Analysis • Google Apps Script integration
            </p>
          </div>
          <div className="text-left md:text-right">
            <span className="text-white font-bold uppercase tracking-wider block mb-2 text-[10px]">연락처 및 회신처</span>
            <p className="text-[#3457E5] font-mono font-bold hover:underline mb-1">j27499643@gmail.com</p>
            <p className="text-gray-500 text-[11px] font-semibold">상명대학교 테크노대학 캠퍼스 소프트웨어 전공실</p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-gray-900 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-600 font-semibold font-mono">
          <span>Copyright © 2026 Joo Seung Hwan Developer Portfolio. All Rights Reserved.</span>
          <div className="flex gap-4">
            <a href="https://github.com/j27499643" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all flex items-center gap-1">
              GITHUB <ExternalLink size={10} />
            </a>
            <a href="mailto:j27499643@gmail.com" className="hover:text-white transition-all">
              EMAIL DIRECT
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
