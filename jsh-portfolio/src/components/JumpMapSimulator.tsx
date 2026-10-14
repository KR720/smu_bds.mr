import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, ShieldCheck, Flag, Zap, Compass, Info, Image, Film } from 'lucide-react';

interface GameStep {
  id: number;
  name: string;
  type: 'start' | 'obstacle' | 'checkpoint' | 'finish';
  isCleared: boolean;
  isUnlocked: boolean;
  xOffset: number; // For rendering
}

export default function JumpMapSimulator() {
  const [attempts, setAttempts] = useState<number>(3);
  const [playerIndex, setPlayerIndex] = useState<number>(0); // Current block index 
  const [lastCheckpoint, setLastCheckpoint] = useState<number>(0); // Last visited checkpoint index
  const [gameState, setGameState] = useState<'idle' | 'running' | 'gameover' | 'cleared'>('idle');
  const [gameLog, setGameLog] = useState<string[]>(['게임 준비 완료', '체크포인트 메커니즘을 테스트해 보세요.']);
  const [rotatingDegree, setRotatingDegree] = useState<number>(0);

  // Define obstacle statuses
  const [steps, setSteps] = useState<GameStep[]>([
    { id: 0, name: '스타트 지점', type: 'start', isCleared: true, isUnlocked: true, xOffset: 5 },
    { id: 1, name: '1단계: 왕복 움직이는 발판', type: 'obstacle', isCleared: false, isUnlocked: true, xOffset: 20 },
    { id: 2, name: '체크포인트 A 세이브', type: 'checkpoint', isCleared: false, isUnlocked: false, xOffset: 35 },
    { id: 3, name: '2단계: 고속 회전 장애물', type: 'obstacle', isCleared: false, isUnlocked: false, xOffset: 55 },
    { id: 4, name: '체크포인트 B 세이브', type: 'checkpoint', isCleared: false, isUnlocked: false, xOffset: 70 },
    { id: 5, name: '최종 단계: 낭떠러지 점프구간', type: 'obstacle', isCleared: false, isUnlocked: false, xOffset: 85 },
    { id: 6, name: '결과 목적지 골인!', type: 'finish', isCleared: false, isUnlocked: false, xOffset: 95 }
  ]);

  // Simulate rotating obstacle angle
  useEffect(() => {
    const timer = setInterval(() => {
      setRotatingDegree(prev => (prev + 8) % 360);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const resetGame = () => {
    setAttempts(3);
    setPlayerIndex(0);
    setLastCheckpoint(0);
    setGameState('idle');
    setSteps(prev => prev.map((s, idx) => ({
      ...s,
      isCleared: idx === 0,
      isUnlocked: idx === 0 || idx === 1
    })));
    setGameLog(['게임 리셋 완료', '캐릭터가 안전 구역(스타트)에 리스폰되었습니다.']);
  };

  const handleAttemptJump = () => {
    if (gameState === 'gameover' || gameState === 'cleared') return;
    
    setGameState('running');
    const nextIdx = playerIndex + 1;
    const targetStep = steps[nextIdx];

    addLog(`🏃 ${steps[playerIndex].name}에서 점프 시도 중...`);

    // Simulate standard jump probability with Unreal Engine mechanics
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% success chance

      if (isSuccess) {
        // Success
        setPlayerIndex(nextIdx);
        setSteps(prev => prev.map((s, idx) => {
          if (idx <= nextIdx) return { ...s, isCleared: true, isUnlocked: true };
          if (idx === nextIdx + 1) return { ...s, isUnlocked: true };
          return s;
        }));

        if (targetStep.type === 'checkpoint') {
          setLastCheckpoint(nextIdx);
          addLog(`💾 [체크포인트 도달] "${targetStep.name}" 저장 완료! 사망 시 여기서 부활합니다.`);
        } else if (targetStep.type === 'finish') {
          setGameState('cleared');
          addLog('🎉 [성공] 골인 지점에 완벽하게 안착! 점프맵 정복 완료!');
        } else {
          addLog(`✔ ${targetStep.name} 기믹 패스 성공!`);
        }
      } else {
        // Fail -> TRIGGER RESPAWN 
        const prevCheckpointIdx = lastCheckpoint;
        setAttempts(p => {
          const remain = p - 1;
          if (remain <= 0) {
            setGameState('gameover');
            addLog('💀 [GAME OVER] 모든 리스폰 횟수를 소진했습니다.');
          } else {
            addLog(`💔 [사망] 낙사했거나 장애물 충돌! 체크포인트(${steps[prevCheckpointIdx].name})에서 다시 시작합니다.`);
          }
          return remain;
        });

        if (attempts > 1) {
          // Send back to checkpoint index
          setPlayerIndex(prevCheckpointIdx);
          // Unlock step after checkpoint
          setSteps(prev => prev.map((s, idx) => {
            if (idx <= prevCheckpointIdx) return { ...s, isCleared: true, isUnlocked: true };
            if (idx === prevCheckpointIdx + 1) return { ...s, isCleared: false, isUnlocked: true };
            return { ...s, isCleared: false, isUnlocked: false };
          }));
        }
      }
    }, 600);
  };

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString('ko-KR', { hour12: false });
    setGameLog(prev => [`[${time}] ${msg}`, ...prev.slice(0, 8)]);
  };

  // State for active media tab inside showcase
  const [activeMediaTab, setActiveMediaTab] = useState<'map' | 'jump' | 'blue'>('map');

  const mediaAssets = {
    map: {
      src: '/map.png',
      title: '전체 3D 레벨 맵 레이아웃',
      desc: '언리얼 엔진 5 빌드 환경에서 구성한 복합 공중 장애물 레이아웃 도면입니다. 시작 지점부터 골인 지점까지의 기믹 배치를 조망합니다.',
      tag: 'Level Design'
    },
    jump: {
      src: '/jump.png',
      title: '이단 점프 & 장애물 이동 기믹',
      desc: '타임라인 왕복 이동 기믹 발판과 회전 물리 충돌을 처리하는 구조입니다. 캐릭터의 부드러운 공중 움직임과 가속을 책임집니다.',
      tag: 'Gameplay Gimmick'
    },
    blue: {
      src: '/blue.png',
      title: '체크포인트 블루프린트 세이브 로직',
      desc: '사망 시 마지막 상호작용한 지점으로 좌표를 안전하게 전송하는 핵심 비주얼 노드입니다. 형변환 오류 없이 부활 좌표를 관리합니다.',
      tag: 'Blueprint Logic'
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-[#171A20] antialiased">
      {/* 3D Wireframe Game Simulator Viewport replaced with pristine screenshot-only view */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-150 p-4 flex flex-col justify-center items-center shadow-sm relative overflow-hidden">
        {/* Play Screen Image Frame */}
        <div className="relative w-full h-full min-h-[320px] md:min-h-[420px] rounded-xl overflow-hidden border border-gray-100 bg-[#171A20] flex items-center justify-center">
          <img 
            src="/play.png" 
            alt="UE5 Editor Active Play Mode" 
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback placeholder with generic info graphic in case play.png fails to load
              (e.target as HTMLElement).style.display = 'none';
              const sib = (e.target as HTMLElement).nextSibling as HTMLElement;
              if (sib) sib.style.display = 'flex';
            }}
            className="w-full h-full object-cover"
          />
          {/* Subtle minimal elegant corner tag matching Artistic Flair visual style */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[#171A20] text-[10px] font-mono font-bold px-3 py-1 rounded-full shadow-sm tracking-wider border border-gray-200/50">
            UE5_RUNNER_LEVEL_PLAY.PNG
          </div>
          <div className="absolute bottom-4 right-4 bg-orange-500 text-white text-[10px] font-mono font-bold px-3 py-1 rounded-full shadow-md tracking-wider">
            MAIN SCREENMODE
          </div>
        </div>
      </div>

      {/* Static Media Showcase & Blueprint Description */}
      <div className="lg:col-span-5 flex flex-col justify-between gap-6 text-left">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col justify-between">
          <div>
            <span className="inline-block bg-orange-500/10 text-orange-600 text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 uppercase tracking-wider">
              에디터 캡처 및 설계 도면 (Visuals Showcase)
            </span>
            <h4 className="text-base font-bold text-gray-900 mb-1">인게임 스크린샷 및 기획 가이드</h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              아래의 탭 버튼을 클릭하면 실제 언리얼 엔진 5 환경에서 백업하고 연동해 둔 세부 모니터링 이미지를 투명하게 열어볼 수 있습니다.
            </p>

            {/* Interactive Image Showcase Frame */}
            <div className="relative aspect-video rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden group">
              <div className="absolute inset-0 opacity-[0.02] bg-radial bg-[size:16px_16px] bg-black z-0" />
              
              {/* Main Image Layer */}
              <img 
                src={mediaAssets[activeMediaTab].src}
                alt={mediaAssets[activeMediaTab].title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback visual in case png file is completely empty or hasn't loaded yet
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const sibling = target.nextSibling as HTMLElement;
                  if (sibling) sibling.style.display = 'flex';
                }}
                className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-500 group-hover:scale-105"
              />

              {/* Fallback Placeholder (when image is still loading or empty) */}
              <div 
                className="absolute inset-0 hidden flex-col items-center justify-center p-4 text-center bg-gray-950 text-white z-20"
                style={{ display: 'none' }}
              >
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mb-2 font-bold font-mono text-sm border border-orange-500/25">
                  {activeMediaTab === 'map' ? 'MAP' : activeMediaTab === 'jump' ? 'JUMP' : 'BP'}
                </div>
                <div className="text-xs font-bold font-mono text-gray-200">
                  {mediaAssets[activeMediaTab].src}
                </div>
                <p className="text-[10px] text-gray-400 max-w-[240px] mt-1 leading-normal font-medium">
                  {mediaAssets[activeMediaTab].title} 이미지 수신 대기 중
                </p>
              </div>

              {/* Tag indicator */}
              <div className="absolute top-2 right-2 bg-[#3457E5] text-white text-[8px] font-sans font-bold px-2.5 py-0.5 rounded-full z-30 shadow">
                {mediaAssets[activeMediaTab].tag}
              </div>
            </div>

            {/* Elegant Image switcher tabs */}
            <div className="grid grid-cols-3 gap-1.5 mt-3">
              {(Object.keys(mediaAssets) as ('map' | 'jump' | 'blue')[]).map((key) => {
                const isActive = activeMediaTab === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveMediaTab(key)}
                    className={`text-[9.5px] font-bold py-2 px-1 rounded-lg border text-center transition-all cursor-pointer truncate ${
                      isActive 
                        ? 'bg-orange-500 border-orange-500 text-white shadow-sm font-extrabold'
                        : 'bg-[#F4F4F4] hover:bg-gray-200 border-gray-200 text-gray-700 font-semibold'
                    }`}
                    title={key === 'map' ? '맵 레이아웃' : key === 'jump' ? '점프 기믹' : '세이브 로직'}
                  >
                    {key === 'map' && '🗺️ 맵 레이아웃'}
                    {key === 'jump' && '🏃 점프 기믹'}
                    {key === 'blue' && '⛓️ 세이브 로직'}
                  </button>
                );
              })}
            </div>

            {/* active tab descriptive details */}
            <div className="mt-4 bg-[#F4F4F4] rounded-lg p-3 border border-gray-150">
              <h5 className="text-[11px] font-extrabold text-gray-800 mb-1">
                {mediaAssets[activeMediaTab].title}
              </h5>
              <p className="text-[10px] text-[#5C5E62] leading-relaxed font-semibold">
                {mediaAssets[activeMediaTab].desc}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">언리얼 기믹 액터 가치</h5>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-1.5">
                <span className="text-orange-500 mt-0.5">✔</span>
                <span>형변환(Cast To) 액티비티를 배격하고, 액터 자체 참조 세이브</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-orange-500 mt-0.5">✔</span>
                <span>세이브 스테이지의 구조적 정립을 통한 메모리 리크 제어 완료</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-orange-500 mt-0.5">✔</span>
                <span>타임라인 델타 프레임에 종속 없이 균등 속도 충돌 트리거 보정</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
