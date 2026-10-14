export interface ProjectFeature {
  title: string;
  description: string;
}

export interface ProblemSolved {
  problem: string;
  solution: string;
}

export interface Project {
  id: string;
  num: string;
  name: string;
  tagline: string;
  description: string;
  features: ProjectFeature[];
  role: string[];
  techStack: string[];
  problemSolving: ProblemSolved;
  category: 'development' | 'game' | 'research' | 'documents';
  demoType: 'parking' | 'game-jump' | 'battery' | 'guestbook';
  githubUrl?: string;
  reportUrl?: string;
}

export interface Certificate {
  name: string;
  status: 'completed' | 'active' | 'upcoming'; // 취득 완료, 준비 중, 취득 예정
  description: string;
  progressPercent: number; // 0 to 100
}

export interface SkillItem {
  name: string;
  proficiency: number; // 0 to 100
  levelText: string; // 중상, 중, 등
  experiences: string[];
  projectLink: string;
  bgGradient: string;
  iconName: string;
}

export interface CoreValue {
  title: string;
  desc: string;
  iconName: 'zap' | 'wrench' | 'trending-up';
}

export interface TimelineEvent {
  year: string;
  title: string;
  items: string[];
  status: 'done' | 'processing' | 'pending';
}

export interface GuestbookMessage {
  id: string;
  organization: string;
  name: string;
  email: string;
  contact?: string;
  message: string;
  createdAt: string;
}
