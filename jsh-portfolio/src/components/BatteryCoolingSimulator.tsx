import React, { useState } from 'react';
import { BarChart3, Wind, Thermometer, ChevronsRight, Shield, Zap, RefreshCw, Image, Film } from 'lucide-react';

interface ChannelConfig {
  name: string;
  maxTemp: number;
  tempGradient: number[]; // Temperature for 5 cells
  flowUniformity: number; // 0 to 1 (higher is better)
  pressureDrop: number; // in Pascals
  fanEnergyPct: number; // in %
  optimaBal: string;
  notes: string;
}

export default function BatteryCoolingSimulator() {
  const configs: { [key: string]: ChannelConfig } = {
    straight: {
      name: '기본 일자형 평행 채널 (Straight)',
      maxTemp: 48.5,
      tempGradient: [22.4, 28.1, 35.2, 42.6, 48.5],
      flowUniformity: 0.63,
      pressureDrop: 12.5,
      fanEnergyPct: 15,
      optimaBal: '압력 저항은 최적이나 냉각 불균일 심각',
      notes: '공기가 출차구로 갈수록 온도가 가파르게 올라가며, 마지막 5번 셀의 열폭주 리스크가 가장 큽니다.'
    },
    zigzag: {
      name: '지그재그 Rib 채널 (Optimal)',
      maxTemp: 35.8,
      tempGradient: [22.4, 25.4, 29.1, 32.8, 35.8],
      flowUniformity: 0.89,
      pressureDrop: 32.8,
      fanEnergyPct: 45,
      optimaBal: '냉각 성능과 소모 동력의 가장 이상적인 균형점',
      notes: '지그재그 형태로 배치된 리브가 와류를 유발하여 난류 촉진 효과를 만듭니다. 가장 추천되는 효율 채널입니다.'
    },
    mesh: {
      name: '익스팬디드 메쉬 채널 (Mesh Grid)',
      maxTemp: 31.2,
      tempGradient: [22.4, 23.8, 26.5, 29.0, 31.2],
      flowUniformity: 0.95,
      pressureDrop: 84.6,
      fanEnergyPct: 92,
      optimaBal: '최상의 주위 평균 온도는 확보하나 과다 소모전력 유발',
      notes: '유동 저항이 너무 강력하여 팬 모터 동력이 6배 이상 발생합니다. 냉각 성능은 정점이지만 경제성이 낮습니다.'
    }
  };

  const [activeChannel, setActiveChannel] = useState<string>('zigzag');
  const current = configs[activeChannel];

  // Helper for thermal colors (cell temperatures)
  const getCellColorClass = (temp: number) => {
    if (temp <= 25) return 'bg-cyan-500 border-cyan-400 text-white';
    if (temp <= 30) return 'bg-emerald-500 border-emerald-400 text-white';
    if (temp <= 36) return 'bg-yellow-500 border-yellow-400 text-gray-900';
    if (temp <= 44) return 'bg-orange-500 border-orange-400 text-white';
    return 'bg-red-500 border-red-400 text-white animate-pulse';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-[#171A20] antialiased">
      {/* Simulation Heat Map Graphics */}
      <div className="lg:col-span-5 bg-[#F4F4F4] rounded-2xl border border-gray-200 p-6 shadow-sm overflow-hidden flex flex-col justify-between">
        {/* Header toolbar */}
        <div className="flex items-center justify-between border-b border-gray-300 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-xs font-mono font-bold text-gray-500">battery_cool_flow_solver.cpp</span>
          </div>
          <div className="bg-[#3457E5]/10 px-2 py-0.5 rounded text-[10px] font-mono text-[#3457E5] font-semibold flex items-center gap-1">
            <RefreshCw size={10} className="animate-spin" /> CFD MOCKUP SOLVER
          </div>
        </div>

        {/* Configurations Toggle switcher */}
        <div className="mb-4">
          <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-2 font-mono">가상 주차 채널 형상 설계안 선택 (Choose Channel Structure)</label>
          <div className="grid grid-cols-3 gap-2 bg-white p-1 rounded-xl border border-gray-200">
            {Object.keys(configs).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveChannel(key)}
                className={`py-2 px-3 text-xs font-bold rounded-lg transition-luxury ${
                  activeChannel === key
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'text-[#5C5E62] hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {key === 'straight' ? '일자형' : key === 'zigzag' ? '지그재그형' : '메쉬형'}
              </button>
            ))}
          </div>
        </div>

        {/* Visualized Temperature Gradient over Battery Cell Pack */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 flex-1 flex flex-col justify-between my-2">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">
                실내 채널 가습 온도 분석 상태(Thermal Distribution Map)
              </span>
              <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded">
                {configs[activeChannel].name}
              </span>
            </div>

            {/* 5 Battery Cells block row */}
            <div className="grid grid-cols-5 gap-3 my-6 relative">
              {/* Cold inlet arrow */}
              <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-1">
                <Wind size={18} className="text-blue-500 animate-pulse" />
                <span className="text-[8px] font-mono font-bold text-blue-500">입구 22℃</span>
              </div>

              {configs[activeChannel].tempGradient.map((temp, index) => (
                <div
                  key={index}
                  className={`aspect-[3/4] rounded-lg border-2 flex flex-col justify-between p-2 shadow-sm transition-all duration-300 ${getCellColorClass(temp)}`}
                >
                  <div className="text-[9px] uppercase tracking-wider font-semibold opacity-70">CELL {index + 1}</div>
                  <div className="text-center my-auto">
                    <span className="text-[13px] font-mono font-extrabold">{temp.toFixed(1)}</span>
                    <span className="text-[9px]">℃</span>
                  </div>
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-white h-full" style={{ width: `${(temp / 50) * 100}%` }} />
                  </div>
                </div>
              ))}

              {/* Hot outlet arrow */}
              <div className="absolute -right-10 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-1">
                <ChevronsRight size={18} className="text-red-500 animate-bounce" />
                <span className="text-[8px] font-mono font-bold text-red-500">방막 출구</span>
              </div>
            </div>
          </div>

          {/* Color Temperature scale legend */}
          <div className="flex justify-between text-[9px] bg-gray-50 border border-gray-100 p-2 rounded-lg font-mono font-semibold text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-cyan-500 rounded" /> 안전체 (≤25℃)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded" /> 최적지 (≤30℃)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-yellow-500 rounded" /> 양호구 (≤36℃)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-orange-500 rounded" /> 주의 구역 (≤44℃)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-500 rounded" /> 임계 위험 (≥45℃)</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">선해 연구 분석 특성화 계수 (Analysis Values)</h5>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#5C5E62] flex items-center gap-1"><Thermometer size={12} /> 최고 임계 온도:</span>
                <span className="font-mono font-bold text-red-500">{current.maxTemp} ℃</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#5C5E62] flex items-center gap-1"><Wind size={12} /> 유동 균일 지수:</span>
                <span className="font-mono font-bold text-[#3457E5]">{current.flowUniformity * 100}%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#5C5E62] flex items-center gap-1"><Shield size={12} /> 채널 내 압력강하(ΔP):</span>
                <span className="font-mono font-bold text-gray-800">{current.pressureDrop} Pa</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-1">
                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Blower Fan 팬 과방 모터 동력 (Fan Energy Consumption)</h5>
                <span className="text-[10px] font-mono text-[#3457E5] font-bold">{current.fanEnergyPct}%</span>
              </div>
              {/* Power range bar */}
              <div className="w-full bg-[#F4F4F4] h-2 rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full transition-all duration-550 ${
                    current.fanEnergyPct > 80 ? 'bg-red-500' :
                    current.fanEnergyPct > 40 ? 'bg-amber-500' :
                    'bg-[#3457E5]'
                  }`}
                  style={{ width: `${current.fanEnergyPct}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400 font-bold italic leading-tight">
                * {current.optimaBal}
              </p>
            </div>
            <p className="text-[10px] text-gray-500 leading-normal border-t border-gray-100 pt-2 mt-2">
              <strong>분석소망:</strong> {current.notes}
            </p>
          </div>
        </div>
      </div>

      {/* Static Media Showcase & CFD Study Details */}
      <div className="lg:col-span-7 flex flex-col justify-between gap-6 text-left">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col justify-between">
          <div>
            <span className="inline-block bg-[#3457E5]/10 text-[#3457E5] text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 uppercase tracking-wider">
              열 유동 수치적 컴퓨터 과학 시뮬레이션 비디오
            </span>
            <h4 className="text-base font-bold text-gray-900 mb-2">공학 연구 CFD 해석 및 양방향 시연 비디오</h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              선행 논문의 배터리 팩 내부 리브 유동 및 구조 열응력 해석 연구 데이터와 기둥 유량의 실 배치를 분석한 참고 자료 영상입니다.
            </p>

            {/* Responsive Embedded YouTube video with high fidelity parameters */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-black shadow-md">
              <iframe
                id="battery-cfd-video"
                src="https://www.youtube.com/embed/r_Wx_eFGa7k?start=80"
                title="EV Battery Air Cooling CFD Analysis Study"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">공학 분석 연구 핵심</h5>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-1.5">
                <span className="text-[#3457E5] mt-0.5">✔</span>
                <span>WebPlotDigitizer 역 연산 좌표 정밀 캘리브레이션 획득</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#3457E5] mt-0.5">✔</span>
                <span>유량 불균등을 보완하기 위한 난류 생성 리브 배치 가설 확인</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#3457E5] mt-0.5">✔</span>
                <span>통기 팬의 마력 소모 비율까지 감안한 경제형 구조 설계안 정비</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
