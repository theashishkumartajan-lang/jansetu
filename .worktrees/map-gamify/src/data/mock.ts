import { Issue, User, Prediction, Department, Escalation, LeaderboardEntry, Notification, VerificationResult } from '@/types';

export const CATEGORIES = [
  'Pothole', 'Garbage', 'Water Leak', 'Broken Streetlight',
  'Drainage Issue', 'Graffiti', 'Broken Sidewalk', 'Fallen Tree',
  'Public Safety Hazard', 'Traffic Signal Failure', 'Other'
] as const;

export const DEPARTMENTS = [
  { id: 'dpw', name: 'Public Works', category: 'Pothole' as const, assignedIssues: 45, resolvedIssues: 120, avgResolutionTime: 3.2, efficiency: 87, staffCount: 24 },
  { id: 'dsan', name: 'Sanitation Dept', category: 'Garbage' as const, assignedIssues: 32, resolvedIssues: 98, avgResolutionTime: 1.5, efficiency: 92, staffCount: 18 },
  { id: 'dwater', name: 'Water Board', category: 'Water Leak' as const, assignedIssues: 28, resolvedIssues: 85, avgResolutionTime: 4.1, efficiency: 78, staffCount: 15 },
  { id: 'delec', name: 'Electrical Dept', category: 'Broken Streetlight' as const, assignedIssues: 19, resolvedIssues: 76, avgResolutionTime: 2.8, efficiency: 91, staffCount: 12 },
  { id: 'ddrain', name: 'Drainage Board', category: 'Drainage Issue' as const, assignedIssues: 15, resolvedIssues: 62, avgResolutionTime: 5.2, efficiency: 72, staffCount: 10 },
  { id: 'dtraffic', name: 'Traffic Police', category: 'Traffic Signal Failure' as const, assignedIssues: 8, resolvedIssues: 45, avgResolutionTime: 1.2, efficiency: 95, staffCount: 8 },
  { id: 'dparks', name: 'Parks & Gardens', category: 'Fallen Tree' as const, assignedIssues: 12, resolvedIssues: 38, avgResolutionTime: 2.5, efficiency: 85, staffCount: 6 },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Amit Sharma', email: 'amit@example.com', trustScore: 94, points: 2450, streak: 12, badges: ['Civic Hero', 'Road Guardian', 'Community Champion'], role: 'citizen', avatar: 'https://i.pravatar.cc/150?u=u1', area: 'Andheri West', reportsCount: 48, verifiedCount: 32, joinedAt: new Date('2024-01-15') },
  { id: 'u2', name: 'Priya Patel', email: 'priya@example.com', trustScore: 88, points: 1890, streak: 8, badges: ['Water Warrior', 'AI Reporter'], role: 'citizen', avatar: 'https://i.pravatar.cc/150?u=u2', area: 'Bandra East', reportsCount: 35, verifiedCount: 22, joinedAt: new Date('2024-02-10') },
  { id: 'u3', name: 'Rahul Kumar', email: 'rahul@example.com', trustScore: 76, points: 1200, streak: 4, badges: ['First Responder'], role: 'citizen', avatar: 'https://i.pravatar.cc/150?u=u3', area: 'Dadar', reportsCount: 24, verifiedCount: 15, joinedAt: new Date('2024-03-05') },
  { id: 'gov1', name: 'Officer Singh', email: 'singh@mh.gov.in', trustScore: 100, points: 0, streak: 0, badges: [], role: 'government', avatar: 'https://i.pravatar.cc/150?u=gov1', area: 'Mumbai', reportsCount: 0, verifiedCount: 0, joinedAt: new Date('2023-06-01') },
];

export const MOCK_ISSUES: Issue[] = [
  { id: 'ISS-001', userId: 'u1', category: 'Pothole', severity: 'Critical', status: 'In_Progress', location: { lat: 19.0760, lng: 72.8777, address: 'Andheri West, Near Metro Station' }, description: 'Large pothole causing traffic accidents', aiSummary: 'Large road pothole occupying 40% of lane width, 6-inch depth, high accident risk', aiConfidence: 97, imageUrl: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=400', department: 'Public Works', trustScore: 94, fraudScore: 2, createdAt: new Date('2024-06-20'), updatedAt: new Date('2024-06-21'), resolvedAt: undefined, escalationLevel: 0, votes: 12, assignedTo: 'Ramesh Pawar' },
  { id: 'ISS-002', userId: 'u2', category: 'Garbage', severity: 'High', status: 'Assigned', location: { lat: 19.0600, lng: 72.8350, address: 'Bandra East, BKC Road' }, description: 'Garbage pile not collected for 5 days', aiSummary: 'Unsanctioned garbage accumulation, 2.5m x 3m, health hazard', aiConfidence: 95, imageUrl: 'https://images.unsplash.com/photo-1591193686104-fddba4d0e4d8?w=400', department: 'Sanitation Dept', trustScore: 88, fraudScore: 5, createdAt: new Date('2024-06-22'), updatedAt: new Date('2024-06-22'), resolvedAt: undefined, escalationLevel: 0, votes: 8 },
  { id: 'ISS-003', userId: 'u3', category: 'Water Leak', severity: 'High', status: 'Resolved', location: { lat: 19.0178, lng: 72.8478, address: 'Dadar, Shivaji Park' }, description: 'Water pipe burst flooding the street', aiSummary: 'Major water pipe rupture, significant water loss, traffic disruption', aiConfidence: 98, imageUrl: 'https://images.unsplash.com/photo-1565206071124-1e7f6a5f8a7e?w=400', beforeImage: 'https://images.unsplash.com/photo-1565206071124-1e7f6a5f8a7e?w=400', afterImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400', department: 'Water Board', trustScore: 76, fraudScore: 3, createdAt: new Date('2024-06-18'), updatedAt: new Date('2024-06-20'), resolvedAt: new Date('2024-06-20'), escalationLevel: 0, votes: 15, assignedTo: 'Suresh Desai', resolutionNotes: 'Pipe replaced, road resurfaced' },
  { id: 'ISS-004', userId: 'u1', category: 'Broken Streetlight', severity: 'Medium', status: 'Routed', location: { lat: 19.0896, lng: 72.8656, address: 'Juhu, Juhu Tara Road' }, description: 'Streetlight not working for 3 days', aiSummary: 'Non-functional streetlight, dark spot on pedestrian path, safety concern', aiConfidence: 92, imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400', department: 'Electrical Dept', trustScore: 94, fraudScore: 1, createdAt: new Date('2024-06-23'), updatedAt: new Date('2024-06-23'), resolvedAt: undefined, escalationLevel: 0, votes: 5 },
  { id: 'ISS-005', userId: 'u2', category: 'Public Safety Hazard', severity: 'Critical', status: 'Escalated', location: { lat: 19.0558, lng: 72.8679, address: 'Worli, Sea Face' }, description: 'Open manhole without cover', aiSummary: 'Uncovered manhole, 2ft diameter, immediate danger to pedestrians and vehicles', aiConfidence: 99, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400', department: 'Public Works', trustScore: 88, fraudScore: 1, createdAt: new Date('2024-06-15'), updatedAt: new Date('2024-06-24'), resolvedAt: undefined, escalationLevel: 3, votes: 22, assignedTo: 'Regional Officer' },
  { id: 'ISS-006', userId: 'u3', category: 'Traffic Signal Failure', severity: 'High', status: 'In_Progress', location: { lat: 19.1136, lng: 72.8691, address: 'Goregaon, Western Express Highway' }, description: 'Traffic signal completely dead during rush hour', aiSummary: 'Complete signal failure, 4-way intersection, peak hour congestion', aiConfidence: 96, imageUrl: 'https://images.unsplash.com/photo-1565802526559-97b733a6a8a5?w=400', department: 'Traffic Police', trustScore: 76, fraudScore: 4, createdAt: new Date('2024-06-21'), updatedAt: new Date('2024-06-22'), resolvedAt: undefined, escalationLevel: 1, votes: 18, assignedTo: 'Constable Sharma' },
  { id: 'ISS-007', userId: 'u1', category: 'Drainage Issue', severity: 'Medium', status: 'Validated', location: { lat: 19.0300, lng: 72.8900, address: 'Sion, Sion Circle' }, description: 'Clogged drainage causing bad smell', aiSummary: 'Drainage blockage, stagnant water, potential mosquito breeding ground', aiConfidence: 91, imageUrl: 'https://images.unsplash.com/photo-1594142021823-19d4696e9e2e?w=400', department: 'Drainage Board', trustScore: 94, fraudScore: 3, createdAt: new Date('2024-06-23'), updatedAt: new Date('2024-06-23'), resolvedAt: undefined, escalationLevel: 0, votes: 6 },
  { id: 'ISS-008', userId: 'u2', category: 'Graffiti', severity: 'Low', status: 'Resolved', location: { lat: 19.0700, lng: 72.9000, address: 'Kurla, LBS Marg' }, description: 'Graffiti on public wall', aiSummary: 'Unauthorized graffiti on public property, 5m x 2m area', aiConfidence: 89, imageUrl: 'https://images.unsplash.com/photo-1581337204873-ef36aa155c85?w=400', beforeImage: 'https://images.unsplash.com/photo-1581337204873-ef36aa155c85?w=400', afterImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', department: 'Public Works', trustScore: 88, fraudScore: 6, createdAt: new Date('2024-06-10'), updatedAt: new Date('2024-06-17'), resolvedAt: new Date('2024-06-17'), escalationLevel: 0, votes: 3, assignedTo: 'Municipal Worker', resolutionNotes: 'Wall cleaned and repainted' },
  { id: 'ISS-009', userId: 'u3', category: 'Fallen Tree', severity: 'Critical', status: 'Assigned', location: { lat: 19.0500, lng: 72.8200, address: 'Mahim, Mahim Causeway' }, description: 'Large tree fallen blocking the road', aiSummary: 'Tree trunk obstructing roadway, 15m length, emergency clearance needed', aiConfidence: 98, imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400', department: 'Parks & Gardens', trustScore: 76, fraudScore: 2, createdAt: new Date('2024-06-24'), updatedAt: new Date('2024-06-24'), resolvedAt: undefined, escalationLevel: 0, votes: 14, assignedTo: 'Tree Crew Team A' },
  { id: 'ISS-010', userId: 'u1', category: 'Broken Sidewalk', severity: 'Medium', status: 'Submitted', location: { lat: 19.1000, lng: 72.8500, address: 'Vile Parle, SV Road' }, description: 'Broken sidewalk tiles causing tripping hazard', aiSummary: 'Multiple cracked tiles, tripping risk for elderly pedestrians', aiConfidence: 90, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400', department: 'Public Works', trustScore: 94, fraudScore: 3, createdAt: new Date('2024-06-24'), updatedAt: new Date('2024-06-24'), resolvedAt: undefined, escalationLevel: 0, votes: 4 },
];

export const MOCK_PREDICTIONS: Prediction[] = [
  { id: 'pred-1', lat: 19.0760, lng: 72.8777, riskScore: 85, category: 'Pothole', confidence: 82, reason: 'Heavy monsoon traffic + existing road damage reports in 1km radius', timeframe: 'Next 7 days' },
  { id: 'pred-2', lat: 19.0600, lng: 72.8350, riskScore: 72, category: 'Garbage', confidence: 76, reason: 'Weekly collection skipped + festival season waste accumulation pattern', timeframe: 'Next 3 days' },
  { id: 'pred-3', lat: 19.0178, lng: 72.8478, riskScore: 68, category: 'Water Leak', confidence: 71, reason: 'Ageing pipeline network + previous burst history', timeframe: 'Next 14 days' },
  { id: 'pred-4', lat: 19.1136, lng: 72.8691, riskScore: 91, category: 'Traffic Signal Failure', confidence: 88, reason: 'Electrical load spike expected + equipment maintenance overdue', timeframe: 'Next 2 days' },
  { id: 'pred-5', lat: 19.0300, lng: 72.8900, riskScore: 55, category: 'Drainage Issue', confidence: 63, reason: 'Pre-monsoon drainage capacity test results indicate blockages', timeframe: 'Next 30 days' },
];

export const MOCK_ESCALATIONS: Escalation[] = [
  { id: 'esc-1', issueId: 'ISS-005', level: 3, triggeredAt: new Date('2024-06-24'), department: 'Public Works', supervisor: 'Regional Officer Deshmukh', status: 'Active', notes: 'Critical safety hazard. Immediate action required.' },
  { id: 'esc-2', issueId: 'ISS-006', level: 1, triggeredAt: new Date('2024-06-24'), department: 'Traffic Police', supervisor: 'Inspector Kulkarni', status: 'Active', notes: '3 days elapsed. Signal still non-functional.' },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { userId: 'u1', name: 'Amit Sharma', avatar: 'https://i.pravatar.cc/150?u=u1', points: 2450, reports: 48, verified: 32, area: 'Andheri West' },
  { userId: 'u2', name: 'Priya Patel', avatar: 'https://i.pravatar.cc/150?u=u2', points: 1890, reports: 35, verified: 22, area: 'Bandra East' },
  { userId: 'u3', name: 'Rahul Kumar', avatar: 'https://i.pravatar.cc/150?u=u3', points: 1200, reports: 24, verified: 15, area: 'Dadar' },
  { userId: 'u4', name: 'Sneha Gupta', avatar: 'https://i.pravatar.cc/150?u=u4', points: 1150, reports: 22, verified: 14, area: 'Juhu' },
  { userId: 'u5', name: 'Vikram Rao', avatar: 'https://i.pravatar.cc/150?u=u5', points: 980, reports: 19, verified: 12, area: 'Worli' },
  { userId: 'u6', name: 'Neha Desai', avatar: 'https://i.pravatar.cc/150?u=u6', points: 870, reports: 17, verified: 10, area: 'Goregaon' },
  { userId: 'u7', name: 'Arjun Mehta', avatar: 'https://i.pravatar.cc/150?u=u7', points: 760, reports: 15, verified: 9, area: 'Sion' },
  { userId: 'u8', name: 'Kavya Iyer', avatar: 'https://i.pravatar.cc/150?u=u8', points: 650, reports: 13, verified: 8, area: 'Kurla' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'u1', title: 'Issue Verified!', message: 'Your pothole report (ISS-001) has been verified by AI and assigned to Public Works.', type: 'success', read: false, createdAt: new Date('2024-06-21'), actionUrl: '/citizen' },
  { id: 'n2', userId: 'u1', title: 'Points Earned!', message: 'You earned 25 points for a verified issue. Your streak is now 12 days!', type: 'reward', read: false, createdAt: new Date('2024-06-21'), actionUrl: '/community' },
  { id: 'n3', userId: 'u1', title: 'Resolution Complete', message: 'Water leak at Dadar (ISS-003) has been resolved. Verify the fix?', type: 'info', read: true, createdAt: new Date('2024-06-20'), actionUrl: '/citizen' },
  { id: 'n4', userId: 'u1', title: 'New Badge!', message: 'You earned the "Community Champion" badge for 30+ verified reports!', type: 'reward', read: false, createdAt: new Date('2024-06-19'), actionUrl: '/community' },
  { id: 'n5', userId: 'u1', title: 'Escalation Alert', message: 'Your report on open manhole (ISS-005) has been escalated to Regional Officer.', type: 'escalation', read: false, createdAt: new Date('2024-06-24'), actionUrl: '/citizen' },
];

export const MOCK_VERIFICATIONS: VerificationResult[] = [
  { issueId: 'ISS-003', status: 'Fixed', confidence: 94, explanation: 'Water pipe has been replaced and road surface restored. No visible leak or water pooling.', beforeImage: 'https://images.unsplash.com/photo-1565206071124-1e7f6a5f8a7e?w=400', afterImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400', verifiedAt: new Date('2024-06-20') },
  { issueId: 'ISS-008', status: 'Fixed', confidence: 91, explanation: 'Wall has been cleaned and repainted. No graffiti remains visible.', beforeImage: 'https://images.unsplash.com/photo-1581337204873-ef36aa155c85?w=400', afterImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', verifiedAt: new Date('2024-06-17') },
];

export const BADGE_INFO: Record<string, { icon: string; description: string; requirement: string; color: string }> = {
  'Civic Hero': { icon: 'Shield', description: 'Top 1% trusted reporter', requirement: 'Trust score > 90', color: 'from-blue-500 to-indigo-600' },
  'Road Guardian': { icon: 'Car', description: 'Resolved 10+ road issues', requirement: '10 road reports verified', color: 'from-gray-500 to-slate-600' },
  'Water Warrior': { icon: 'Droplets', description: 'Reported 5+ water issues', requirement: '5 water reports verified', color: 'from-cyan-500 to-blue-600' },
  'Community Champion': { icon: 'Trophy', description: '30+ verified reports', requirement: '30 verified reports', color: 'from-yellow-500 to-amber-600' },
  'AI Reporter': { icon: 'Brain', description: 'First AI-assisted report', requirement: 'Submit 1 AI-analyzed report', color: 'from-purple-500 to-violet-600' },
  'First Responder': { icon: 'Zap', description: 'Reported within 1 hour of incident', requirement: '1 rapid report', color: 'from-red-500 to-rose-600' },
};

export const POINTS = {
  REPORT_ISSUE: 10,
  VERIFIED_ISSUE: 25,
  RESOLUTION_PROOF: 50,
  DAILY_STREAK: 5,
  VERIFICATION_CONFIRM: 15,
};

export const SEVERITY_COLORS: Record<string, string> = {
  Low: 'bg-green-100 text-green-700 border-green-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  High: 'bg-orange-100 text-orange-700 border-orange-200',
  Critical: 'bg-red-100 text-red-700 border-red-200',
};

export const STATUS_COLORS: Record<string, string> = {
  Submitted: 'bg-gray-100 text-gray-700',
  AI_Processing: 'bg-purple-100 text-purple-700',
  Validated: 'bg-blue-100 text-blue-700',
  Routed: 'bg-indigo-100 text-indigo-700',
  Assigned: 'bg-cyan-100 text-cyan-700',
  In_Progress: 'bg-yellow-100 text-yellow-700',
  Resolved: 'bg-green-100 text-green-700',
  Verified: 'bg-teal-100 text-teal-700',
  Escalated: 'bg-red-100 text-red-700',
};

export const CATEGORY_ICONS: Record<string, string> = {
  Pothole: 'Car',
  Garbage: 'Trash2',
  'Water Leak': 'Droplets',
  'Broken Streetlight': 'Lightbulb',
  'Drainage Issue': 'Waves',
  Graffiti: 'Palette',
  'Broken Sidewalk': 'Footprints',
  'Fallen Tree': 'TreePine',
  'Public Safety Hazard': 'AlertTriangle',
  'Traffic Signal Failure': 'TrafficCone',
  Other: 'FileQuestion',
};

export const CATEGORY_DEPT: Record<string, string> = {
  Pothole: 'Public Works',
  Garbage: 'Sanitation Dept',
  'Water Leak': 'Water Board',
  'Broken Streetlight': 'Electrical Dept',
  'Drainage Issue': 'Drainage Board',
  Graffiti: 'Public Works',
  'Broken Sidewalk': 'Public Works',
  'Fallen Tree': 'Parks & Gardens',
  'Public Safety Hazard': 'Public Works',
  'Traffic Signal Failure': 'Traffic Police',
  Other: 'Public Works',
};
