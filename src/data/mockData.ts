import { Conversation, Participant } from '../types/chat';

// Import generated authentic assets
import ariaAvatar from '../assets/images/avatar_aria_ai_1791442387968.jpg';
import ayaAvatar from '../assets/images/avatar_aya_company_bot_1791443057084.jpg';
import marcusAvatar from '../assets/images/avatar_marcus_dev_1791442399928.jpg';
import elenaAvatar from '../assets/images/avatar_elena_design_1791442410395.jpg';
import sharedPhoto from '../assets/images/chat_shared_photo_1791442421129.jpg';

export const CURRENT_USER: Participant = {
  id: 'user_me',
  name: 'Alex Rivera',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'Principal Staff Engineer',
  isAI: false,
  status: 'online',
  statusText: 'Focusing on distributed cache refactoring',
  bio: 'Building resilient cloud-native architectures.',
  email: 'alex.rivera@emerald.dev',
};

export const AYA_PARTICIPANT: Participant = {
  id: 'bot_aya',
  name: 'Aya',
  avatar: ayaAvatar,
  role: 'Online Company Intelligence & KRA Auditor',
  isAI: true,
  category: 'Company & KRA',
  status: 'online',
  statusText: 'AI Chat Bot Online • 18,450 Companies Tracked (KRA 98.4%)',
  bio: 'Specialized enterprise intelligence bot tracking registered online companies, auditing active corporate accounts, and verifying KRA statutory filings.',
  model: 'Gemini Enterprise Intelligence',
  temperature: 0.2,
  capabilities: [
    'Live Online Company Counter (18,450+ Verified)',
    'KRA Corporate Compliance & Tax Audit Verification',
    'Sector & Regional Account Breakdown',
    'Enterprise Active Revenue & Growth Index',
  ],
  promptStarters: [
    'Count all active online companies & KRA status',
    'Show sector breakdown: FinTech, SaaS & eCommerce',
    'Audit KRA compliance rate for online firms',
    'Count new companies registered this quarter',
  ],
};

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_aya_bot',
    participant: AYA_PARTICIPANT,
    lastMessage: 'Live count: 18,450 online companies verified across 5 sectors (KRA compliance: 98.4%).',
    lastTimestamp: '10:48 AM',
    unreadCount: 0,
    isPinned: true,
    isFavorite: true,
    isMuted: false,
    messages: [
      {
        id: 'msg_aya_1',
        senderId: 'user_me',
        text: 'Aya, count all online companies registered on the platform and check their KRA compliance status.',
        timestamp: '10:45 AM',
        isOutgoing: true,
        status: 'read',
      },
      {
        id: 'msg_aya_2',
        senderId: 'bot_aya',
        senderName: 'Aya',
        text: 'Hello Alex! I have executed a live telemetry audit across the enterprise registry.\n\n📊 Total Online Companies: 18,450\n🏢 Active Corporate Accounts: 42,890\n📑 KRA Compliance Rate: 98.4% (18,154 verified)\n📈 Monthly Company Growth: +8.2% (+1,420 new companies)\n\nHere is the real-time breakdown of all online companies and verified corporate accounts:',
        timestamp: '10:48 AM',
        isOutgoing: false,
        status: 'read',
        isAI: true,
        aiBadge: 'Company & KRA',
        companyStats: {
          totalCompanies: 18450,
          activeAccounts: 42890,
          kraCompliantPercent: 98.4,
          monthlyGrowth: '+8.2%',
          sectors: [
            { name: 'SaaS & Cloud Tech', count: 5640, percentage: 30.6, color: '#128C7E' },
            { name: 'E-Commerce & Retail', count: 4930, percentage: 26.7, color: '#25D366' },
            { name: 'FinTech & Payments', count: 4820, percentage: 26.1, color: '#008376' },
            { name: 'AI & Autonomous', count: 2110, percentage: 11.4, color: '#075E54' },
            { name: 'Logistics & Supply', count: 950, percentage: 5.2, color: '#388075' },
          ],
          featuredCompanies: [
            { name: 'NovaPay Global', sector: 'FinTech', kraStatus: 'Compliant', country: 'United States', accountsCount: 1420, revenueEst: '$42M' },
            { name: 'Aether Cloud Systems', sector: 'SaaS & Cloud', kraStatus: 'Compliant', country: 'Germany', accountsCount: 2890, revenueEst: '$88M' },
            { name: 'Verdant Retail Labs', sector: 'E-Commerce', kraStatus: 'Compliant', country: 'United Kingdom', accountsCount: 840, revenueEst: '$19M' },
            { name: 'Apex Logistics Corp', sector: 'Logistics', kraStatus: 'Audited', country: 'Singapore', accountsCount: 510, revenueEst: '$65M' },
          ],
        },
        suggestions: [
          'Count companies by country',
          'Show pending KRA audits',
          'Export company accounts ledger',
        ],
        reactions: [
          { emoji: '🔥', count: 3, reactedByMe: true },
          { emoji: '⚡', count: 2, reactedByMe: false },
        ],
      },
    ],
  },
  {
    id: 'conv_aria_ai',
    participant: {
      id: 'bot_aria',
      name: 'Aria',
      avatar: ariaAvatar,
      role: 'Lead AI Systems Architect',
      isAI: true,
      category: 'Architecture',
      status: 'online',
      statusText: 'AI Assistant • Ultra-low latency engine ready',
      bio: 'Enterprise systems architect with expertise in high-concurrency event loops, distributed caching, and reactive UI pipelines.',
      model: 'Gemini 2.5 Flash Enterprise',
      temperature: 0.2,
      capabilities: [
        'Real-time Cloud Architecture Analysis',
        'TypeScript & Go Code Review',
        'Schema Optimization & Latency Audits',
        'Automated Test Matrix Synthesis',
      ],
      promptStarters: [
        'Analyze distributed Redis cache invalidation strategies',
        'Draft an event-driven pub/sub architecture diagram in Mermaid',
        'Benchmark SQLite vs PostgreSQL for local-first sync',
        'Review our rate-limiting sliding window implementation',
      ],
    },
    lastMessage: 'I have validated the schema and partitioned the cache keys for peak throughput.',
    lastTimestamp: '10:42 AM',
    unreadCount: 0,
    isPinned: true,
    isFavorite: true,
    isMuted: false,
    messages: [
      {
        id: 'msg_aria_1',
        senderId: 'user_me',
        text: 'Morning Aria! Could you review our current WebSocket gateway design for the messaging cluster? We need to handle 50k concurrent connection spikes without buffer bloat.',
        timestamp: '10:35 AM',
        isOutgoing: true,
        status: 'read',
      },
      {
        id: 'msg_aria_2',
        senderId: 'bot_aria',
        senderName: 'Aria',
        text: 'Good morning Alex. I audited your connection pool. When handling 50k concurrent connections, node socket descriptors will thrash unless backpressure buffering and worker fan-out are decoupled.\n\nHere is the recommended resilient architecture pattern:',
        timestamp: '10:37 AM',
        isOutgoing: false,
        status: 'read',
        isAI: true,
        aiBadge: 'Architecture',
        codeBlock: {
          language: 'typescript',
          filename: 'gateway-cluster.ts',
          code: `// Resilient connection distributor with backpressure draining
import { createServer } from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';

export class ResilientGatewayCluster {
  private readonly maxBacklog = 2048;
  private readonly drainWatermark = 512;

  handleClientStream(socket: WebSocket) {
    socket.binaryType = 'arraybuffer';
    
    // Guard against socket memory bloating during high bursts
    if (socket.bufferedAmount > this.maxBacklog) {
      socket.pause?.();
      socket.once('drain', () => socket.resume?.());
    }
  }
}`,
        },
        suggestions: [
          'Generate Redis Pub/Sub backplane setup',
          'Add exponential backoff jitter specs',
          'Export benchmark scripts',
        ],
        reactions: [
          { emoji: '⚡', count: 2, reactedByMe: true },
          { emoji: '🙌', count: 1, reactedByMe: false },
        ],
      },
      {
        id: 'msg_aria_3',
        senderId: 'user_me',
        text: 'The backpressure drain listener is exactly what was missing. What about the partitioned key scheme for Redis?',
        timestamp: '10:40 AM',
        isOutgoing: true,
        status: 'read',
      },
      {
        id: 'msg_aria_4',
        senderId: 'bot_aria',
        senderName: 'Aria',
        text: 'I have validated the schema and partitioned the cache keys for peak throughput. Hash slots using `{tenant_id:channel_id}` ensure zero cross-cluster node migration penalties during re-sharding.',
        timestamp: '10:42 AM',
        isOutgoing: false,
        status: 'read',
        isAI: true,
        aiBadge: 'Architecture',
        suggestions: [
          'Run distributed sync simulation',
          'Check failover latency budget',
          'Draft runbook checklist',
        ],
      },
    ],
  },
  {
    id: 'conv_marcus',
    participant: {
      id: 'user_marcus',
      name: 'Marcus Chen',
      avatar: marcusAvatar,
      role: 'Staff Backend Infrastructure',
      isAI: false,
      category: 'Team Member',
      status: 'online',
      statusText: 'At desk • Reviewing PR #409',
      bio: 'Focused on distributed databases, zero-downtime migrations, and latency budgets.',
      phone: '+1 (555) 392-8819',
      email: 'marcus.chen@emerald.dev',
    },
    lastMessage: 'Voice message (0:24)',
    lastTimestamp: '10:28 AM',
    unreadCount: 1,
    isPinned: true,
    isFavorite: true,
    isMuted: false,
    messages: [
      {
        id: 'msg_marcus_1',
        senderId: 'user_marcus',
        senderName: 'Marcus Chen',
        text: 'Alex, the migration script passed staging tests with 0 replica lag. We are ready for the maintenance window tonight.',
        timestamp: '10:15 AM',
        isOutgoing: false,
        status: 'read',
      },
      {
        id: 'msg_marcus_2',
        senderId: 'user_me',
        text: 'Brilliant news Marcus. Did the foreign key constraint check finish without holding a table lock?',
        timestamp: '10:18 AM',
        isOutgoing: true,
        status: 'read',
      },
      {
        id: 'msg_marcus_3',
        senderId: 'user_marcus',
        senderName: 'Marcus Chen',
        text: 'Yes! Used `NOT VALID` followed by asynchronous validation in the background. Here is a quick voice rundown of the dry run telemetry:',
        timestamp: '10:28 AM',
        isOutgoing: false,
        status: 'read',
        voiceNote: {
          durationSec: 24,
          waveform: [15, 28, 45, 60, 32, 50, 75, 90, 80, 65, 40, 25, 60, 85, 70, 55, 45, 30, 20, 35, 65, 50, 25, 10],
        },
      },
    ],
  },
  {
    id: 'conv_elena',
    participant: {
      id: 'user_elena',
      name: 'Elena Rostova',
      avatar: elenaAvatar,
      role: 'Design Director',
      isAI: false,
      category: 'Design & UX',
      status: 'online',
      statusText: 'Crafting the 2026 design token system',
      bio: 'Lead product designer passionate about tactile micro-interactions, responsive ergonomics, and zero-pill typographic balance.',
      phone: '+1 (555) 741-9230',
      email: 'elena.rostova@emerald.dev',
    },
    lastMessage: 'Check out the new design studio mockups for the tablet split view!',
    lastTimestamp: '9:50 AM',
    unreadCount: 0,
    isPinned: false,
    isFavorite: true,
    isMuted: false,
    messages: [
      {
        id: 'msg_elena_1',
        senderId: 'user_elena',
        senderName: 'Elena Rostova',
        text: 'Hey Alex! Just finalized the tactile canvas styling for the slate & emerald messaging app.',
        timestamp: '9:45 AM',
        isOutgoing: false,
        status: 'read',
      },
      {
        id: 'msg_elena_2',
        senderId: 'user_elena',
        senderName: 'Elena Rostova',
        text: 'Check out the new design studio mockups for the tablet split view! Notice how the asymmetric bubble corners give intuitive physical directional cues:',
        timestamp: '9:50 AM',
        isOutgoing: false,
        status: 'read',
        attachment: {
          id: 'att_photo_1',
          type: 'image',
          url: sharedPhoto,
          title: 'Design Studio Workspace & Natural Textures',
          fileSize: '2.4 MB',
          dimensions: '1920 × 1440',
        },
        reactions: [
          { emoji: '🔥', count: 3, reactedByMe: true },
          { emoji: '😍', count: 2, reactedByMe: false },
        ],
      },
      {
        id: 'msg_elena_3',
        senderId: 'user_me',
        text: 'The warm paper-like canvas tint (#ECE5DD) paired with the deep teal (#128C7E) header looks incredibly polished and calm. Great work!',
        timestamp: '9:52 AM',
        isOutgoing: true,
        status: 'read',
      },
    ],
  },
  {
    id: 'conv_turing_ai',
    participant: {
      id: 'bot_turing',
      name: 'Turing',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      role: 'Automated PR & Code Quality Bot',
      isAI: true,
      category: 'Code Review',
      status: 'online',
      statusText: 'AI Agent • Static analysis & memory leak auditor',
      bio: 'Analyzes pull requests, flags anti-patterns, evaluates time-complexity, and ensures TypeScript strict compliance.',
      model: 'Gemini Code Specialist v2',
      temperature: 0.1,
      capabilities: [
        'Automated Cyclomatic Complexity Analysis',
        'Zero-Allocation Loop Auditing',
        'Security AST Vulnerability Scanning',
        'Idiomatic TypeScript Refactoring',
      ],
      promptStarters: [
        'Review this React hook for redundant re-renders',
        'Convert this recursive tree walk to an iterative stack',
        'Find memory leaks in this RxJS subscription pipeline',
      ],
    },
    lastMessage: 'PR #108 passed all linter and bundle size budgets. Ready for merge.',
    lastTimestamp: 'Yesterday',
    unreadCount: 0,
    isPinned: false,
    isFavorite: false,
    isMuted: false,
    messages: [
      {
        id: 'msg_turing_1',
        senderId: 'bot_turing',
        senderName: 'Turing',
        text: 'PR #108 passed all linter and bundle size budgets. Ready for merge. Zero memory leaks detected across 1,000 synthetic rendering cycles.',
        timestamp: 'Yesterday 4:15 PM',
        isOutgoing: false,
        status: 'read',
        isAI: true,
        aiBadge: 'Code Review',
        suggestions: [
          'Trigger staging deployment',
          'View bundle breakdown',
          'Generate release changelog',
        ],
      },
    ],
  },
  {
    id: 'conv_design_guild',
    participant: {
      id: 'group_guild',
      name: 'Core Architecture Guild',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
      role: '5 Engineers & 2 AI Agents',
      isAI: false,
      category: 'Team Member',
      status: 'online',
      statusText: 'Marcus, Elena, Aria, Turing, David',
      bio: 'Weekly syncs on distributed systems, frontend performance, and AI agent orchestration.',
      email: 'guild@emerald.dev',
    },
    lastMessage: 'Interactive Poll: Choose next sprint focus',
    lastTimestamp: 'Yesterday',
    unreadCount: 2,
    isPinned: false,
    isFavorite: false,
    isMuted: false,
    messages: [
      {
        id: 'msg_guild_1',
        senderId: 'user_marcus',
        senderName: 'Marcus Chen',
        text: 'Team, please cast your vote for our Q4 engineering priority before our Thursday retrospective.',
        timestamp: 'Yesterday 2:30 PM',
        isOutgoing: false,
        status: 'read',
      },
      {
        id: 'msg_guild_2',
        senderId: 'user_marcus',
        senderName: 'Marcus Chen',
        text: 'Engineering Priority Ballot:',
        timestamp: 'Yesterday 2:31 PM',
        isOutgoing: false,
        status: 'read',
        poll: {
          id: 'poll_q4_priority',
          question: 'What is our primary infrastructure milestone for next sprint?',
          totalVotes: 7,
          options: [
            { id: 'opt_1', text: 'Local-first offline sync engine', votes: 4, votedByMe: true },
            { id: 'opt_2', text: 'End-to-end encrypted message store', votes: 2, votedByMe: false },
            { id: 'opt_3', text: 'Sub-50ms AI agent streaming latency', votes: 1, votedByMe: false },
          ],
        },
      },
    ],
  },
];

export const AI_BOT_DIRECTORY: Participant[] = [
  AYA_PARTICIPANT, // Aya (Online Company & KRA Auditor)
  INITIAL_CONVERSATIONS[1].participant, // Aria
  INITIAL_CONVERSATIONS[4].participant, // Turing
  {
    id: 'bot_maya',
    name: 'Maya',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Editorial & UX Writer Bot',
    isAI: true,
    category: 'Writing',
    status: 'online',
    statusText: 'AI Agent • Tone of voice & microcopy strategist',
    bio: 'Crafts crisp, human-centered microcopy, user onboarding sequences, and technical documentation.',
    model: 'Gemini Pro Creative',
    temperature: 0.6,
    capabilities: [
      'Microcopy & Error Message Refining',
      'API Reference Doc Generation',
      'Localized Multi-Language Transcreation',
    ],
    promptStarters: [
      'Rewrite this technical error modal to be friendly and actionable',
      'Create 3 variants of onboarding empty states',
    ],
  },
  {
    id: 'bot_atlas',
    name: 'Atlas',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'SQL & Database Optimization Agent',
    isAI: true,
    category: 'Data & SQL',
    status: 'online',
    statusText: 'AI Agent • Query execution plan analyzer',
    bio: 'Diagnoses slow queries, designs normalized relational schemas, and configures composite B-Tree indexes.',
    model: 'Gemini Data Tuner',
    temperature: 0.1,
    capabilities: [
      'PostgreSQL EXPLAIN ANALYZE Parsing',
      'Index Bloat Detection',
      'Partitioning Strategy Synthesis',
    ],
    promptStarters: [
      'Tune this composite index for high-cardinality timestamps',
      'Explain query plan bottleneck for JOIN on 10M rows',
    ],
  },
];
