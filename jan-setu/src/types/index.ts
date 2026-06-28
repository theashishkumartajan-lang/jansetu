export type IssueCategory =
  | 'Pothole'
  | 'Garbage'
  | 'Water Leak'
  | 'Broken Streetlight'
  | 'Drainage Issue'
  | 'Graffiti'
  | 'Broken Sidewalk'
  | 'Fallen Tree'
  | 'Public Safety Hazard'
  | 'Traffic Signal Failure'
  | 'Other';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type IssueStatus =
  | 'Submitted'
  | 'AI_Processing'
  | 'Validated'
  | 'Routed'
  | 'Assigned'
  | 'In_Progress'
  | 'Resolved'
  | 'Verified'
  | 'Escalated';

export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface Issue {
  id: string;
  userId: string;
  category: IssueCategory;
  severity: SeverityLevel;
  status: IssueStatus;
  location: GeoLocation;
  description: string;
  aiSummary: string;
  aiConfidence: number;
  imageUrl?: string;
  beforeImage?: string;
  afterImage?: string;
  department: string;
  trustScore: number;
  fraudScore: number;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  escalationLevel: number;
  votes: number;
  assignedTo?: string;
  resolutionNotes?: string;
}

export type UserRole = 'citizen' | 'government' | 'admin';

export type Badge = 'Civic Hero' | 'Road Guardian' | 'Water Warrior' | 'Community Champion' | 'Smart Reporter' | 'First Responder' | 'Clean Street Captain' | 'Night Safety Watch' | 'Drain Defender' | 'Tree Protector' | 'Escalation Expert' | 'Verification Pro' | 'Local Mapper' | 'Civic Streak Master';

export interface User {
  id: string;
  name: string;
  email: string;
  trustScore: number;
  points: number;
  streak: number;
  badges: Badge[];
  role: UserRole;
  avatar?: string;
  area: string;
  reportsCount: number;
  verifiedCount: number;
  joinedAt: Date;
}

export interface AgentResult {
  agent: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  confidence: number;
  output: Record<string, unknown>;
  reasoning?: string;
  timestamp: Date;
}

export interface Prediction {
  id: string;
  lat: number;
  lng: number;
  riskScore: number;
  category: IssueCategory;
  confidence: number;
  reason: string;
  timeframe: string;
}

export interface Department {
  id: string;
  name: string;
  category: IssueCategory;
  assignedIssues: number;
  resolvedIssues: number;
  avgResolutionTime: number;
  efficiency: number;
  staffCount: number;
}

export interface Escalation {
  id: string;
  issueId: string;
  level: number;
  triggeredAt: Date;
  department: string;
  supervisor: string;
  status: 'Active' | 'Resolved';
  notes: string;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar?: string;
  points: number;
  reports: number;
  verified: number;
  area: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'reward' | 'escalation';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface VerificationResult {
  issueId: string;
  status: 'Fixed' | 'Partially Fixed' | 'Not Fixed';
  confidence: number;
  explanation: string;
  beforeImage: string;
  afterImage: string;
  verifiedAt: Date;
}

export interface ReportInput {
  image?: File | string;
  text?: string;
  description?: string;
  voiceText?: string;
  location?: GeoLocation;
  userId: string;
}
