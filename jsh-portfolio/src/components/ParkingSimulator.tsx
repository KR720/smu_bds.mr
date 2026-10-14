import React, { useState } from 'react';
import { Play, LogIn, LogOut, Search, Activity, FileText, Image, Film } from 'lucide-react';

interface Car {
  plateNumber: string;
  entryTime: Date;
  floor: number;
  spotId: number;
  ticketType: 'regular' | 'discount' | 'commuter';
}

export default function ParkingSimulator() {
  const [activeFloor, setActiveFloor] = useState<number>(1);
  const [plateInput, setPlateInput] = useState<string>('');
  const [ticketType, setTicketType] = useState<'regular' | 'discount' | 'commuter'>('regular');
  
  // Initialize slot maps (6 spots per floor, total 3 floors)
  const [parkingSlots, setParkingSlots] = useState<{ [key: string]: Car | null }>({
    '1-1': { plateNumber: '55가 1234', entryTime: new Date(Date.now() - 3.5 * 60 * 60 * 1000), floor: 1, spotId: 1, ticketType: 'regular' },
    '1-3': { plateNumber: '11나 9876', entryTime: new Date(Date.now() - 1.2 * 60 * 60 * 1000), floor: 1, spotId: 3, ticketType: 'commuter' },
    '2-2': { plateNumber: '77다 4321', entryTime: new Date(Date.now() - 6.8 * 60 * 60 * 1000), floor: 2, spotId: 2, ticketType: 'discount' },
  });

  const [searchPlate, setSearchPlate] = useState<string>('');
  const [searchResult, setSearchResult] = useState<string>('');
  const [simLog, setSimLog] = useState<string[]>(['시스템이 초기화되었습니다.', '기본 샘플 차량 3대가 주차 상태입니다.']);
  const [dailyRevenue, setDailyRevenue] = useState<number>(34000);
  const [selectedSlotForCheckout, setSelectedSlotForCheckout] = useState<string | null>(null);

  // Calculate bill
  const calculateBill = (car: Car) => {
    const elapsedMinutes = Math.max(1, Math.floor((Date.now() - car.entryTime.getTime()) / (1000 * 60) * 120)); // Amplified speed for demo
    const hourlyRate = 3000;
    const baseMinutes = 30;
    const baseRate = 1500;
    
    if (car.ticketType === 'commuter') return { minutes: elapsedMinutes, cost: 0, discount: '정기권 차량 무료' };
    
    let cost = baseRate;
    if (elapsedMinutes > baseMinutes) {
      cost += Math.ceil((elapsedMinutes - baseMinutes) / 10) * 500;
    }
    
    let discountText = '없음';
    if (car.ticketType === 'discount') {
      cost = cost * 0.5;
      discountText = '50% 친환경/복지 할인';
    }
    
    return { minutes: elapsedMinutes, cost: Math.floor(cost), discount: discountText };
  };

  const handleRegisterCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateInput.trim()) return;

    // Check duplication
    const duplicate = (Object.values(parkingSlots) as (Car | null)[]).find(c => c && c.plateNumber === plateInput.trim());
    if (duplicate) {
      setSearchResult(`경고: 차량 ${plateInput}은(는) 이미 주차 중입니다.`);
      addLog(`❌ 등록 실패: 중복 차량 번호 (${plateInput})`);
      return;
    }

    // Find empty spot on active floor first, else any floor
    let foundKey = '';
    for (let cSpot = 1; cSpot <= 6; cSpot++) {
      const k = `${activeFloor}-${cSpot}`;
      if (!parkingSlots[k]) {
        foundKey = k;
        break;
      }
    }

    if (!foundKey) {
      // Find on other floors
      for (let f = 1; f <= 3; f++) {
        for (let s = 1; s <= 6; s++) {
          const k = `${f}-${s}`;
          if (!parkingSlots[k]) {
            foundKey = k;
            break;
          }
        }
        if (foundKey) break;
      }
    }

    if (!foundKey) {
      addLog('❌ 만차 상태: 현재 이용 가능한 주차 구획이 없습니다.');
      alert('주차장이 침묵 상태입니다. 만차!');
      return;
    }

    const [floorStr, spotStr] = foundKey.split('-');
    const fNum = parseInt(floorStr);
    const sNum = parseInt(spotStr);

    const newCar: Car = {
      plateNumber: plateInput.trim(),
      entryTime: new Date(),
      floor: fNum,
      spotId: sNum,
      ticketType
    };

    setParkingSlots(prev => ({ ...prev, [foundKey]: newCar }));
    addLog(`🚗 차량 ${plateInput}이(가) ${fNum}층 ${sNum}번 구획에 입차 처리되었습니다.`);
    setPlateInput('');
  };

  const handleCheckoutSpot = (key: string) => {
    const car = parkingSlots[key];
    if (!car) return;
    
    const bill = calculateBill(car);
    setParkingSlots(prev => ({ ...prev, [key]: null }));
    setDailyRevenue(prev => prev + bill.cost);
    addLog(`💸 차량 ${car.plateNumber} 출차 정산:이용시간 ${bill.minutes}분, 요금 ₩${bill.cost.toLocaleString()}원 결제 완료.`);
    setSelectedSlotForCheckout(null);
  };

  const handleSearch = () => {
    if (!searchPlate.trim()) return;
    const found = (Object.entries(parkingSlots) as [string, Car | null][]).find(([k, car]) => car && car.plateNumber.includes(searchPlate));
    if (found) {
      const [key, car] = found as [string, Car];
      setSearchResult(`조회 성공: ${car.floor}층 ${car.spotId}번 구획 주차 중 (티켓: ${car.ticketType})`);
      setActiveFloor(car.floor);
    } else {
      setSearchResult('조회 실패: 주차된 동일 차량 정보가 없습니다.');
    }
  };

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString('ko-KR', { hour12: false });
    setSimLog(prev => [`[${time}] ${msg}`, ...prev.slice(0, 8)]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-[#171A20] antialiased">
      {/* Simulation Window (representing Tkinter mock-up) */}
      <div className="lg:col-span-7 bg-[#F4F4F4] rounded-2xl border border-gray-200 p-6 shadow-sm overflow-hidden flex flex-col">
        {/* Tkinter Window Header bar */}
        <div className="flex items-center justify-between border-b border-gray-300 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-xs font-mono font-semibold text-gray-500 ml-2">ParkingManager_v1.0.py (Tkinter GUI)</span>
          </div>
          <div className="bg-[#3457E5]/10 px-2 py-0.5 rounded text-[10px] font-mono text-[#3457E5] font-semibold flex items-center gap-1">
            <Activity size={10} className="animate-pulse" /> LIVE SIMULATOR
          </div>
        </div>

        {/* Dashboard top row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">당일 누적 정산액</div>
            <div className="text-lg font-bold text-[#3457E5] font-mono">₩{dailyRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">주차 점유율</div>
            <div className="text-lg font-bold text-gray-800 font-mono">
              {Math.round((Object.values(parkingSlots).filter(Boolean).length / 18) * 100)}%
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">남은 빈 구획</div>
            <div className="text-lg font-bold text-emerald-600 font-mono">
              {18 - Object.values(parkingSlots).filter(Boolean).length} / 18
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Parking Yard Grid */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] font-mono font-bold text-[#171A20] uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#3457E5]" /> {activeFloor}층 주차 주획 레이아웃
            </div>
            {/* Floor Selector Tab bar */}
            <div className="flex bg-[#F4F4F4] p-1 rounded-lg gap-1 border border-gray-200">
              {[1, 2, 3].map(floor => (
                <button
                  key={floor}
                  type="button"
                  onClick={() => setActiveFloor(floor)}
                  className={`px-3 py-1 text-xs rounded transition-all font-mono font-bold ${
                    activeFloor === floor
                      ? 'bg-white text-[#3457E5] shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {floor}F
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 my-2">
            {[1, 2, 3, 4, 5, 6].map(slot => {
              const key = `${activeFloor}-${slot}`;
              const car = parkingSlots[key];
              
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => car && setSelectedSlotForCheckout(key)}
                  className={`h-20 rounded-lg p-2.5 flex flex-col justify-between border transition-all text-left relative overflow-hidden ${
                    car
                      ? 'bg-[#3457E5]/5 border-[#3457E5] hover:bg-[#3457E5]/10 cursor-pointer'
                      : 'bg-gray-50 border-gray-200 border-dashed hover:bg-gray-100 cursor-default'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[10px] font-mono text-gray-400 font-bold">{slot}번 구획</span>
                    {car && (
                      <span className={`text-[8px] px-1 rounded font-bold uppercase ${
                        car.ticketType === 'commuter' ? 'bg-purple-100 text-purple-700' :
                        car.ticketType === 'discount' ? 'bg-[#FF7A00]/10 text-[#FF7A00]' :
                        'bg-blue-100 text-[#3457E5]'
                      }`}>
                        {car.ticketType === 'commuter' ? '정기' : car.ticketType === 'discount' ? '할인' : '일반'}
                      </span>
                    )}
                  </div>
                  
                  {car ? (
                    <div className="animate-fade-in">
                      <div className="text-xs font-mono font-bold text-gray-900 tracking-wider">
                        {car.plateNumber}
                      </div>
                      <span className="text-[9px] text-[#3457E5] font-mono block mt-0.5">
                        {car.entryTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 주차중
                      </span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-gray-400 font-sans italic self-center my-auto">
                      비었음
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick billing drawer info */}
          {selectedSlotForCheckout && parkingSlots[selectedSlotForCheckout] && (
            <div className="bg-[#3457E5]/5 border border-[#3457E5]/30 rounded-lg p-3 my-2 animate-fade-in flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs">
              <div>
                <span className="font-bold text-[#3457E5] text-[13px]">{parkingSlots[selectedSlotForCheckout]?.plateNumber}</span>
                <span className="text-gray-500 ml-2">({parkingSlots[selectedSlotForCheckout]?.floor}층 {parkingSlots[selectedSlotForCheckout]?.spotId}번 구획)</span>
                <div className="text-[11px] text-gray-500 mt-1">
                  요율 경과: {calculateBill(parkingSlots[selectedSlotForCheckout]!).minutes}분 | 감면 혜택: {calculateBill(parkingSlots[selectedSlotForCheckout]!).discount}
                </div>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto self-end md:self-auto">
                <div className="font-mono font-bold text-base text-[#3457E5] mr-2">
                  ₩{calculateBill(parkingSlots[selectedSlotForCheckout]!).cost.toLocaleString()}
                </div>
                <button
                  type="button"
                  onClick={() => handleCheckoutSpot(selectedSlotForCheckout)}
                  className="bg-[#3457E5] hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded text-xs flex items-center gap-1 transition-all"
                >
                  <LogOut size={12} /> 출차 요금 수납
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSlotForCheckout(null)}
                  className="bg-white hover:bg-gray-100 text-gray-500 border border-gray-300 py-1.5 px-2.5 rounded text-xs"
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Interactive Controls Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Form to insert */}
          <form onSubmit={handleRegisterCar} className="bg-white rounded-xl p-3 border border-gray-200">
            <div className="text-[10px] font-bold text-gray-400 mb-2 flex items-center gap-1 uppercase">
              <LogIn size={11} className="text-[#3457E5]" /> 신규 입차 등록 시스템
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="차량번호 (예: 12가3456)"
                value={plateInput}
                onChange={e => setPlateInput(e.target.value)}
                className="bg-[#F4F4F4] text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 flex-1 focus:outline-[#3457E5] font-bold font-mono text-gray-800"
              />
              <button
                type="submit"
                className="bg-[#3457E5] hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 shrink-0"
              >
                입차하기
              </button>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-[9px] text-gray-400">할인종류:</span>
              <div className="flex items-center gap-3">
                {(['regular', 'discount', 'commuter'] as const).map(type => (
                  <label key={type} className="flex items-center gap-1 text-[10px] font-bold text-gray-500 cursor-pointer">
                    <input
                      type="radio"
                      name="ticketTypeSim"
                      checked={ticketType === type}
                      onChange={() => setTicketType(type)}
                      className="accent-[#3457E5] w-3 h-3"
                    />
                    {type === 'regular' ? '일반' : type === 'discount' ? '할인' : '정기'}
                  </label>
                ))}
              </div>
            </div>
          </form>

          {/* Search tool mock */}
          <div className="bg-white rounded-xl p-3 border border-gray-200 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-bold text-gray-400 mb-2 flex items-center gap-1 uppercase">
                <Search size={11} className="text-gray-500" /> 차량 유치 위치 검색
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="조회할 차량번호 입력"
                  value={searchPlate}
                  onChange={e => setSearchPlate(e.target.value)}
                  className="bg-[#F4F4F4] text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 flex-1 focus:outline-[#3457E5] font-mono text-gray-800"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="bg-gray-800 hover:bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg font-mono transition-all"
                >
                  검색
                </button>
              </div>
            </div>
            {searchResult && (
              <p className="text-[10px] text-gray-600 font-mono font-semibold mt-2 px-1 text-center bg-gray-50 py-1 rounded">
                💡 {searchResult}
              </p>
            )}
          </div>
        </div>

        {/* Py Output Logs resembling a Console Terminal */}
        <div className="mt-4 bg-[#111827] rounded-xl p-3 border border-gray-800 text-left">
          <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-mono font-semibold mb-2 border-b border-gray-800 pb-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> shell_output_log ()
          </div>
          <div className="font-mono text-[10px] text-gray-300 space-y-1.5 h-24 overflow-y-auto no-scrollbar">
            {simLog.map((log, index) => (
              <div key={index} className={log.includes('❌') ? 'text-red-400' : log.includes('💸') ? 'text-emerald-400' : 'text-gray-300'}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Static Media Showcase & Requirements (The asked "space for images/videos") */}
      <div className="lg:col-span-5 flex flex-col justify-between gap-6 text-left">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col justify-between">
          <div>
            <span className="inline-block bg-[#3457E5]/10 text-[#3457E5] text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 uppercase tracking-wider">
              미디어 쇼케이스 공간 (Demo Media Slot)
            </span>
            <h4 className="text-base font-bold text-gray-900 mb-2">실제 프로그램 이미지 및 영상 영역</h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              아래의 미디어 슬롯은 해당 파이썬 프로그램의 실제 구동 화면이나 데모 이미지, 동화상을 배치할 수 있는 전용 영역입니다.
            </p>

            {/* Beautiful real image displaying car.png */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 bg-slate-50 shadow-md group">
              <img 
                src="/car.png" 
                alt="Python Parking System GUI Screen" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain select-none transition-transform duration-500 group-hover:scale-102"
              />
              {/* Subtle tech styled tag overlay */}
              <div className="absolute top-2 right-2 bg-[#3457E5] text-white text-[8px] font-sans font-bold px-2 py-0.5 rounded shadow">
                실제 프로그램 구동화면
              </div>
              <div className="absolute bottom-2 left-2 flex gap-1.5">
                <span className="bg-black/60 backdrop-blur-sm text-white text-[8px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Image size={8} /> car.png
                </span>
                <span className="bg-black/60 backdrop-blur-sm text-white text-[8px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                  Tkinter GUI
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">파이썬 GUI 프로그램 코어 포인트</h5>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-1.5">
                <span className="text-[#3457E5] mt-0.5">✔</span>
                <span>Tkinter 기반 그리드 격자 배치를 활용한 시각적 주차 맵 빌드</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#3457E5] mt-0.5">✔</span>
                <span>Datetime 계산 패키지 연계 차등 시간별 가중치 수식 연산</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#3457E5] mt-0.5">✔</span>
                <span>차량 소멸 시 백그라운드 주차 가용 맵 락 풀기 트랜잭션 동기화</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
