export interface Participant {
  id: string;
  name: string;
  avatar: string;
  role: string;
  isAI: boolean;
  category?: 'Architecture' | 'Code Review' | 'Design & UX' | 'Data & SQL' | 'Writing' | 'Company & KRA' | 'Team Member';
  status: 'online' | 'offline' | 'typing' | 'away';
  statusText?: string;
  bio: string;
  capabilities?: string[];
  promptStarters?: string[];
  phone?: string;
  email?: string;
  model?: string;
  temperature?: number;
}

export interface SectorCount {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface CompanyRecord {
  name: string;
  sector: string;
  kraStatus: 'Compliant' | 'Audited' | 'Pending';
  country: string;
  accountsCount: number;
  revenueEst: string;
}

export interface CompanyCountData {
  totalCompanies: number;
  activeAccounts: number;
  kraCompliantPercent: number;
  monthlyGrowth: string;
  sectors: SectorCount[];
  featuredCompanies: CompanyRecord[];
}

export interface VoiceNote {
  durationSec: number;
  waveform: number[];
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  votedByMe: boolean;
}

export interface PollData {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
}

export interface Attachment {
  id: string;
  type: 'image' | 'document' | 'audio';
  url: string;
  title: string;
  fileSize?: string;
  dimensions?: string;
}

export interface CodeBlock {
  language: string;
  code: string;
  filename?: string;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  reactedByMe: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  text: string;
  timestamp: string;
  isOutgoing: boolean;
  status: 'sent' | 'delivered' | 'read';
  isAI?: boolean;
  aiBadge?: string;
  suggestions?: string[];
  codeBlock?: CodeBlock;
  companyStats?: CompanyCountData;
  attachment?: Attachment;
  voiceNote?: VoiceNote;
  poll?: PollData;
  reactions?: MessageReaction[];
  replyToId?: string;
}

export interface Conversation {
  id: string;
  participant: Participant;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  isPinned: boolean;
  isFavorite: boolean;
  isMuted: boolean;
  messages: Message[];
  draftText?: string;
}

export type ChatFilter = 'all' | 'unread' | 'ai' | 'teams' | 'favorites';

export interface CallState {
  isActive: boolean;
  type: 'voice' | 'video';
  participant: Participant | null;
  status: 'connecting' | 'connected' | 'ended';
  durationSeconds: number;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isSpeakerOn: boolean;
}
