import { Project, Certificate, SkillItem, CoreValue, TimelineEvent } from './types';

export const CORE_VALUES: CoreValue[] = [
  {
    title: '실행',
    desc: '아이디어에 머무르지 않고 직접 프로그램으로 구현합니다.',
    iconName: 'zap'
  },
  {
    title: '문제 해결',
    desc: '오류의 원인을 단계적으로 분석하고 해결될 때까지 수정합니다.',
    iconName: 'wrench'
  },
  {
    title: '성장',
    desc: '새로운 기술을 배우고 실제 프로젝트에 적용합니다.',
    iconName: 'trending-up'
  }
];

export const CERTIFICATES: Certificate[] = [
  {
    name: '정보처리기사',
    status: 'active', // 준비 중
    description: '소프트웨어 개발 과정, 데이터베이스, 운영체제와 정보 시스템 전반의 깊은 이해를 강화하고 있습니다.',
    progressPercent: 75
  },
  {
    name: 'SQLD',
    status: 'completed', // 취득 완료
    description: '데이터베이스 설계와 SQL 활용 능력을 정교하게 숙지하고 실무 공인 자격을 취득하였습니다.',
    progressPercent: 100
  },
  {
    name: '리눅스마스터',
    status: 'upcoming', // 취득 예정
    description: 'Linux 운영체제 코어 명령어 및 사용 권한, 시스템 전반의 관리자 제어 지식을 습득하고 자격을 검증할 계획입니다.',
    progressPercent: 20
  },
  {
    name: 'ADsP (데이터분석준전문가)',
    status: 'upcoming', // 취득 예정
    description: '수치적 공학 데이터 및 프로젝트 데이터 세트를 전문적으로 전처리하고 통계 분석하는 능력을 갖춰나갈 예정입니다.',
    progressPercent: 15
  }
];

export const SKILL_ITEMS: SkillItem[] = [
  {
    name: 'Python',
    proficiency: 85,
    levelText: '중상',
    experiences: [
      'Tkinter 기반 GUI 프로그램 개발',
      '클래스와 객체를 활용한 데이터 구조 설계',
      '리스트와 딕셔너리를 활용한 정보 저장 및 갱신',
      'JSON/텍스트 정적 파일 입출력 및 예외 처리',
      '차량 입출차 관리 배치 및 요금 실시간 연산',
      '설문 및 공학 계산 자동화 프로그램 제작'
    ],
    projectLink: 'parking-system',
    bgGradient: 'from-blue-500 to-indigo-600',
    iconName: 'Code2'
  },
  {
    name: 'Java',
    proficiency: 65,
    levelText: '중',
    experiences: [
      '객체지향 프로그래밍(OOP) 핵심 원리 활용',
      '클래스 설계, 생성자 및 인스턴스 핸들링',
      '상속과 메소드 오버라이딩을 활용한 모듈화',
      '추상 클래스 및 인터페이스 기반의 다형성 구현',
      'Collection Framework (List, Map, Set) 활용',
      '복합 비즈니스 로직 예외 처리 및 관리'
    ],
    projectLink: 'oop-practice',
    bgGradient: 'from-emerald-500 to-teal-600',
    iconName: 'Coffee'
  },
  {
    name: 'C / Linux',
    proficiency: 70,
    levelText: '중',
    experiences: [
      '포인터와 구조체를 활용한 메모리 자원 관리',
      '표준 파일 입출력 및 디바이스 스트림 제어',
      'Linux 시스템 호출 (open, read, write, close)',
      '파일 시스템 노드 디렉터리 탐색 및 제어',
      'fork, exec 계열 기반 다중 프로세스 관리',
      'gcc 수동 빌드 및 Makefile 기반 자동화 빌드',
      '정적(.a) 및 공유(.so) 라이브러리 직접 컴파일'
    ],
    projectLink: 'linux-programming',
    bgGradient: 'from-gray-700 to-slate-900',
    iconName: 'Terminal'
  },
  {
    name: 'Unreal Engine 5',
    proficiency: 60,
    levelText: '중',
    experiences: [
      'Blueprint 비주얼 스크립팅 기반 핵심 액터 구현',
      '캐릭터 이동 속성 관리 및 공중 이단 점프 제어',
      'Collision 충돌 판정과 Overlap 트리거 설계',
      '체크포인트 저장 및 플레이어 사망 시 리스폰',
      'Timeline 및 Lerp 기반의 동적 이동 발판 제작',
      '회전 장애물 배치 및 물리 회전 속도 최적화',
      'Widget UI를 활용한 인게임 스코어판 및 메시지 전시'
    ],
    projectLink: 'jumpmap-game',
    bgGradient: 'from-orange-500 to-amber-600',
    iconName: 'Gamepad2'
  },
  {
    name: 'Data Analysis',
    proficiency: 65,
    levelText: '중',
    experiences: [
      '국내외 선행 공학 논문 및 학술 연구 분석',
      'WebPlotDigitizer를 활용한 그래프 이미지 내 실좌표 추출',
      '엑셀 및 스프레드시트 기반 대용량 데이터 전처리',
      '유량 균일성 지수 및 구간별 압력강하 연산',
      '종합 냉각 성능 및 팬 동력 손실량 도출',
      '차년도 설계안 제안용 다변수 비교 그래프 작성',
      '연구 결과 요약 보고서 및 프리젠테이션 제작'
    ],
    projectLink: 'battery-cooling',
    bgGradient: 'from-purple-500 to-pink-600',
    iconName: 'BarChart3'
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'parking-system',
    num: '01',
    name: 'Python 주차장 관리 시스템',
    tagline: '차량 입차부터 주차 요금 계산까지 하나의 프로그램으로 통합했습니다.',
    description: '차량 입차, 주차 위치 배정, 실시간 시간 추적, 자동 요금 계산 및 출차 기록 통계를 안전하게 수행하는 데스크톱 전용 GUI 프로그램입니다.',
    demoType: 'parking',
    category: 'development',
    features: [
      {
        title: '차량 입출차 관리',
        description: '차량 번호를 등록하고 입차 시 빈 공간을 1층부터 3층까지 자율 배정합니다.'
      },
      {
        title: '공간 모니터링',
        description: '전체 3개 층의 가용 주차 상태를 직관적인 컬러 셀로 실시간 표시합니다.'
      },
      {
        title: '요금 자동 연산',
        description: '경과 시간에서 무료 시간, 정기권, 할인율을 종합 반영하여 최종 요금을 연산합니다.'
      },
      {
        title: '운영 데이터 통계',
        description: '누적 입출차 내역과 일별/월별 매출 총합을 그래프 형태로 요약해 줍니다.'
      }
    ],
    role: [
      'Tkinter 컴포넌트 커스터마이징 및 메인 대시보드 빌드',
      '파이썬 객체지향 클래스 기반의 차량 및 공간 상태 구조 설계',
      '할인율, 주차 무료 혜택 예외 처리가 반영된 수식 연산 개발',
      '사용 편의 최적화 및 중복 번호 차량 예외 프로세스 수립'
    ],
    techStack: ['Python', 'Tkinter', 'OOP Class', 'Dictionary', 'File I/O', 'Datetime'],
    problemSolving: {
      problem: '차량이 출차한 뒤에도 주차 공간 상태가 즉각 업데이트되지 않거나, 동일한 차량 번호가 관리 중복 오류를 발생시켰습니다.',
      solution: '출차 모듈에 트랜잭션 함수를 구성하여 차량 DB 인덱스 제거와 공간 맵의 플래그 변경이 유기적으로 동기화되게 수정하고, 입차 검증 룰러를 사전에 추가 배치했습니다.'
    }
  },
  {
    id: 'unreal-runner',
    num: '02',
    name: 'Unreal점프 기믹 게임',
    tagline: '정교한 콜리전 물리와 속도각 기믹이 살아있는 정통 점프 어드벤처입니다.',
    description: 'Unreal Engine 5에서 Blueprint 가혹 물리 및 다양한 속도 레벨 변수를 튜닝하여, 플레이어가 정밀 제어 감각으로 장애물 트랙을 완파하는 3D 러너 어드벤처 게임입니다.',
    demoType: 'game-jump',
    category: 'game',
    features: [
      {
        title: '3D 속도각 액터 기믹',
        description: '움직이는 레일 장애물, 일정 속도 조절 패딩 등 점프 감도를 극대화하는 다양한 레벨 어트랙션을 탑재했습니다.'
      },
      {
        title: '리스폰 세이브 체크포인트',
        description: '체크포인트 오버랩 판정을 정조준 설계하여 추락 시 가장 최근 세이브 위치에서 부활하는 안전 시스템을 완성했습니다.'
      }
    ],
    role: [
      'UE5 Blueprint 구조 설계 및 충돌 오버랩 볼륨 세팅',
      'Timeline 노드를 활용한 다양한 가속 및 회전 장애물 모션 구현',
      '리스폰 트랜스폼 연산 및 레벨 흐름 전체 기획 주도'
    ],
    techStack: ['Unreal Engine 5', 'Blueprint', 'Collision', 'Timeline', 'Vector Lerp', 'Widget UI'],
    problemSolving: {
      problem: '캐릭터가 물리 낙하 판정을 받았을 때, 체크포인트를 통과했음에도 불구하고 무조건 초기 시작 지점(0,0,0)으로 환원되는 상태 오작동이 기록되었습니다.',
      solution: '체크포인트 액터 오버랩 시 충돌한 캐릭터를 형변환해 캐릭터 내부 전역 변수(ActiveRespawnLocation)를 해당 체크포인트 기둥 좌표로 주입하는 방식으로 즉시 정상화했습니다.'
    }
  },
  {
    id: 'battery-cooling',
    num: '03',
    name: '전기차 배터리 공랭식 냉각 연구',
    tagline: '데이터 변수를 완벽히 정량화하여 배터리 설계의 새로운 열 방출 지표를 제시했습니다.',
    description: '배터리 팩 채널 형상, 리브 추가, 공기 흡입 매니폴드 배치에 관한 국내외 선행 연구 결과를 활용하여, 채널별 열전도 성능 및 가용 유동 저항을 전산 분석한 연구 프로젝트입니다.',
    demoType: 'battery',
    category: 'research',
    features: [
      {
        title: '논문 이미지 내 좌표 정보 역산',
        description: 'WebPlotDigitizer를 정조준 캘리브레이션하여 화질이 흐린 논문 그래프 이미지에서 오차 0.8% 미만의 실 수치 배열을 데이터화했습니다.'
      },
      {
        title: '단면 채널별 유량 균일성 비교',
        description: '배터리 팩 내 병렬 흐름 분석 시 발생하는 입차구 압력 편차에 따른 개별 연도 분석 그래프를 취합 분석했습니다.'
      },
      {
        title: '팬 열에너지 경제성 분석',
        description: '채널 리브 배치 증가에 비례해 생기는 유동 저항(압력 강하)과 이에 따른 블로어 팬 동력 손실율을 정합 연산했습니다.'
      }
    ],
    role: [
      '논문 레퍼런스 발굴, 가설 및 전산 데이터 기하 구조 조건 검토',
      'WebPlotDigitizer 좌표 변환 및 전처리 정형화 추출',
      '엑셀 대조 함수 매핑을 통한 최저 온도 지수 대비 최고 온도 균등 편차 비교 매트릭스 설계',
      '미래 설계 가속화용 냉각 효율 밸런스 프레임워크 전제 제안 및 요약 프레젠테이션 작성'
    ],
    techStack: ['WebPlotDigitizer', 'Excel Data Analysis', 'Heat Analysis Research', 'Data Visualization'],
    problemSolving: {
      problem: '논문 그래프 이미지가 밀도가 높고 겹쳐있어 단순 눈 대중으로는 변수별 정확한 유량 흐름 비율을 파독하여 성능 평판을 만들기 불가능했습니다.',
      solution: 'WebPlotDigitizer에서 고정 마크 4곳을 선정한 뒤 수동 조밀 포인팅 작업을 3회 중복 시행해 데이터 평탄화를 진행, 엑셀 1차 선형 보간 분석을 입혀 분석해 냈습니다.'
    }
  }
];

export const TIMELINE: TimelineEvent[] = [
  {
    year: '2026',
    title: '포트폴리오 고도화 및 첫 도약',
    status: 'processing',
    items: [
      '포트폴리오 웹사이트 완성 및 피드백 개선',
      'Unreal Engine 5 게임 프로젝트 씬 튜닝 및 기믹 개선',
      'GitHub에 전산 소스코드 상세 리드미 오픈해 가 독성 극대화',
      '정보처리기사 동차 필기 실기 합격 대비 전공 지식 완전 체득'
    ]
  },
  {
    year: '2027',
    title: '실전 협업 및 전문성 대세 입증',
    status: 'pending',
    items: [
      'SQLD 및 리눅스마스터 자격 취득을 통한 검증 인텔리전스 확대',
      '캡스톤디자인 연계 다목적 IoT 스마트 공간 프로젝트 착수 및 연계',
      '교내외 프로그래밍 공모전 출품 및 우수 구현작 시상 도전',
      '도메인에 특화된 실무 역량 강성화를 위한 개발 인턴십 가용 매진'
    ]
  },
  {
    year: 'VISION',
    title: '사용자 문제를 해결하는 실전 소프트웨어 엔지니어',
    status: 'pending',
    items: [
      '기획에서 멈추지 않고, 최신의 효율성 높은 프로토타입을 주저 없이 실물 소스로 뽑아내는 개발자',
      '시스템 에러가 있을 때 포기하는 대신 디버깅 트레이스 오염원을 완벽 추적해내는 문제해결가',
      '변화를 두려워하지 않고, Python, Java, Unreal 기획 등 복합 도구를 유연히 넘나드는 에이스'
    ]
  }
];
