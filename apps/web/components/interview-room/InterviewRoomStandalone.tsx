'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Editor from '@monaco-editor/react';
import Link from 'next/link';
import {
  Play, Send, Timer, PhoneOff, Code2, BookOpen,
  Mic, MicOff, Video, VideoOff, Copy, CheckCircle2,
  ChevronDown, User, MessageSquare, Tag, Eye, PenLine,
  ClipboardList, Star, ThumbsUp, ThumbsDown, Lock,
  Monitor, MonitorOff, ChevronRight, X, ArrowRight,
} from 'lucide-react';
import { cn, getDifficultyColor } from '@/lib/utils';

/* ─── Question data ─────────────────────────────────────── */
const QUESTIONS: Record<string, any> = {
  '1': { title: 'Two Sum', difficulty: 'EASY', tags: ['arrays', 'hash-map'], description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.`, starterCode: `def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []`, examples: [{ input: 'nums=[2,7,11,15], target=9', output: '[0,1]', explanation: 'nums[0]+nums[1]==9' }, { input: 'nums=[3,2,4], target=6', output: '[1,2]', explanation: '' }], constraints: ['2 ≤ nums.length ≤ 10⁴', 'Only one valid answer exists.'] },
  '2': { title: 'Valid Parentheses', difficulty: 'EASY', tags: ['stack', 'string'], description: `Given a string \`s\` containing just the characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\` and \`]\`, determine if the input string is valid.\n\nOpen brackets must be closed by the same type and in the correct order.`, starterCode: `def isValid(s):\n    stack = []\n    mapping = {')':'(', '}':'{', ']':'['}\n    for char in s:\n        if char in mapping:\n            if not stack or stack[-1] != mapping[char]:\n                return False\n            stack.pop()\n        else:\n            stack.append(char)\n    return not stack`, examples: [{ input: 's="()"', output: 'true', explanation: '' }, { input: 's="()[]{}"', output: 'true', explanation: '' }], constraints: ['1 ≤ s.length ≤ 10⁴'] },
  '3': { title: 'Reverse Linked List', difficulty: 'EASY', tags: ['linked-list'], description: `Given the \`head\` of a singly linked list, reverse it and return the reversed list.`, starterCode: `def reverseList(head):\n    prev = None\n    curr = head\n    while curr:\n        next_node = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_node\n    return prev`, examples: [{ input: 'head=[1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: '' }], constraints: ['0 ≤ Number of nodes ≤ 5000'] },
  '51': { title: 'LRU Cache', difficulty: 'MEDIUM', tags: ['design', 'hash-map'], description: `Design a data structure that follows the **Least Recently Used (LRU)** cache constraints.\n\nImplement \`get(key)\` and \`put(key, value)\` — both must run in O(1) time.`, starterCode: `class LRUCache:\n    def __init__(self, capacity):\n        pass\n    def get(self, key):\n        pass\n    def put(self, key, value):\n        pass`, examples: [{ input: 'LRUCache(2), put(1,1), put(2,2), get(1)', output: '1', explanation: '' }], constraints: ['1 ≤ capacity ≤ 3000'] },
  '54': { title: 'Maximum Subarray', difficulty: 'MEDIUM', tags: ['dp', 'arrays'], description: `Given an integer array \`nums\`, find the subarray with the largest sum and return its sum.\n\nA **subarray** is a contiguous non-empty sequence of elements.`, starterCode: `def maxSubArray(nums):\n    max_sum = nums[0]\n    curr = nums[0]\n    for n in nums[1:]:\n        curr = max(n, curr + n)\n        max_sum = max(max_sum, curr)\n    return max_sum`, examples: [{ input: 'nums=[-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1] has sum 6' }], constraints: ['-10⁴ ≤ nums[i] ≤ 10⁴'] },
  '121': { title: 'Merge K Sorted Lists', difficulty: 'HARD', tags: ['heap', 'linked-list'], description: `You are given an array of \`k\` sorted linked-lists. Merge all of them into one sorted linked-list.`, starterCode: `import heapq\ndef mergeKLists(lists):\n    heap = []\n    for i, node in enumerate(lists):\n        if node:\n            heapq.heappush(heap, (node.val, i, node))\n    dummy = ListNode(0); curr = dummy\n    while heap:\n        val, i, node = heapq.heappop(heap)\n        curr.next = node; curr = curr.next\n        if node.next:\n            heapq.heappush(heap, (node.next.val, i, node.next))\n    return dummy.next`, examples: [{ input: 'lists=[[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]', explanation: '' }], constraints: ['k == lists.length', '0 ≤ k ≤ 10⁴'] },
};
const DEFAULT_Q = QUESTIONS['1'];
const LANGS = ['Python 3.12', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Go', 'Rust'];

function renderText(text: string) {
  return text.split('\n').map((line, i) => (
    <p key={i} className="text-sm text-editor-text/90 leading-relaxed mb-1.5 last:mb-0">
      {line.split(/(`[^`]+`)/).map((part, j) =>
        part.startsWith('`') && part.endsWith('`')
          ? <code key={j} className="px-1 py-0.5 rounded bg-editor-bg text-brand-accent text-xs font-mono">{part.slice(1, -1)}</code>
          : part.split(/(\*\*[^*]+\*\*)/).map((p, k) =>
            p.startsWith('**') && p.endsWith('**')
              ? <strong key={k} className="font-semibold text-editor-text">{p.slice(2, -2)}</strong>
              : <span key={k}>{p}</span>
          )
      )}
    </p>
  ));
}

/* ─── Props ─────────────────────────────────────────────── */
interface Props { roomId: string; token: string; userName: string; role: string; questionId: string; isPractice?: boolean; }

export function InterviewRoomStandalone({ roomId, token, userName, role, questionId, isPractice = false }: Props) {
  const isCandidate = role === 'candidate';
  const isInterviewer = role === 'interviewer';

  /* ── State ── */
  // Next question + end interview + screen share — declared first so `q` can reference `currentQId`
  const [currentQId, setCurrentQId] = useState(questionId);
  const [showNextQ, setShowNextQ] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Derive current question from state (single source of truth)
  const q = QUESTIONS[currentQId] || DEFAULT_Q;

  // Candidate starts blank; interviewer sees starter code as read-only reference
  const [code, setCode] = useState(isCandidate ? '' : q.starterCode);
  const [showStarterHint, setShowStarterHint] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef<any>(null);
  const [language, setLanguage] = useState('Python 3.12');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState<{ id: string; from: string; text: string; t: string; role: string }[]>([]);
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [camError, setCamError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [interviewerNotes, setNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [decision, setDecision] = useState<'none' | 'yes' | 'no'>('none');
  const [rightTab, setRightTab] = useState<'video' | 'notes'>('video');
  const [cheatLog, setCheatLog] = useState<{ t: string; event: string; severity: 'warn' | 'alert' }[]>([]);
  const [cheatCount, setCheatCount] = useState(0);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const timerRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  /* ── Socket.io: real-time sync across devices ── */
  useEffect(() => {
    fetch(`/api/rooms/${roomId}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Room API returned ${r.status}`);
        return r.json();
      })
      .then((config) => {
        const wsUrl = config.wsUrl || process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
        const wsToken = config.wsToken || 'dev-token';

        const s = io(wsUrl, {
          auth: { token: wsToken },
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 1000,
        });

        socketRef.current = s;

        // Initialize WebRTC Peer Connection
        const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        peerRef.current = pc;

        pc.onnegotiationneeded = async () => {
          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            const toRole = role === 'interviewer' ? 'candidate' : 'interviewer';
            s.emit('signal:offer', { roomId, sdp: pc.localDescription, to: toRole });

          } catch (e) { }
        };

        pc.onicecandidate = (e) => {
          if (e.candidate) {
            const toRole = role === 'interviewer' ? 'candidate' : 'interviewer';
            s.emit('signal:ice', { roomId, candidate: e.candidate, to: toRole });

          }
        };

        pc.ontrack = (e) => {
          setRemoteStream(e.streams[0]);
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
        };

        s.on('connect', () => {
          s.emit('room:join', { roomId, token: wsToken, userName });
        });

        s.on('room:joined', () => {
          setMessages([{
            id: 'sys-' + Date.now(),
            from: 'System',
            text: isInterviewer
              ? `Room ${roomId} ready. Copy and send the candidate link.`
              : `You joined room ${roomId}. Good luck! 🍀`,
            t: 'now',
            role: 'system',
          }]);
        });

        s.on('chat:message', (payload: any) => {
          setMessages((prev) =>
            prev.some((m) => m.id === payload.id) ? prev : [...prev, payload]
          );
        });

        s.on('interview:timer_update', (data: any) => {
          if (isCandidate) {
            setElapsed(data.elapsed ?? 0);
            setTimerRunning(data.state === 'running');
          }
        });

        s.on('code:synced', (data: any) => {
          if (isInterviewer) {
            setCode(data.code);
            setIsTyping(true);
            clearTimeout(typingTimerRef.current);
            typingTimerRef.current = setTimeout(() => setIsTyping(false), 1500);
          }
        });

        s.on('output:synced', (data: any) => {
          if (isInterviewer) {
            setOutput(data.output);
            setRunning(false);
            setSubmitted(data.submitted || false);
          }
        });

        s.on('cheat:event', (data: any) => {
          if (isInterviewer) {
            setCheatLog((prev) => [data, ...prev]);
            setCheatCount((c) => c + 1);
            setRightTab('notes');
          }
        });

        s.on('signal:offer', ({ from, sdp }: any) => {
          const pc = peerRef.current;
          if (!pc) return;
          pc.setRemoteDescription(new RTCSessionDescription(sdp))
            .then(() => pc.createAnswer())
            .then((ans) => pc.setLocalDescription(ans))
            .then(() => {
              s.emit('signal:answer', { to: from, sdp: pc.localDescription });
            }).catch(() => { });
        });

        s.on('signal:answer', ({ sdp }: any) => {
          peerRef.current?.setRemoteDescription(new RTCSessionDescription(sdp)).catch(() => { });
        });

        s.on('signal:ice', ({ candidate }: any) => {
          peerRef.current?.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => { });
        });

        s.on('room:participant_left', () => {
          setRemoteStream(null);
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        });

        s.on('disconnect', () => console.log('[Socket] Disconnected'));
      })
      .catch((err) => {
        console.error('[Socket] Connection failed:', err);
      });

    return () => {
      socketRef.current?.emit('room:leave', { roomId });
      socketRef.current?.disconnect();
      socketRef.current = null;
      peerRef.current?.close();
      peerRef.current = null;
    };
  }, [roomId, isCandidate, isInterviewer, userName]);

  /* ── Broadcast: send next question (interviewer only) ── */
  const sendNextQuestion = (qid: string) => {
    if (!isInterviewer) return;
    const payload = { questionId: qid };
    socketRef.current?.emit('interview:set_question', { roomId, ...payload });

    setCurrentQId(qid);
    setCode(QUESTIONS[qid]?.starterCode || '');
    setOutput('');
    setSubmitted(false);
    setShowNextQ(false);
  };

  /* ── End interview ── */
  const endInterview = () => {
    socketRef.current?.emit('interview:end', { roomId });

    setTimeout(() => { window.location.href = '/'; }, 800);
  };

  /* ── Screen Share ── */
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      screenStreamRef.current?.getTracks().forEach(t => t.stop());
      screenStreamRef.current = null;
      setIsScreenSharing(false);
      if (cam && streamRef.current && peerRef.current) {
        const pc = peerRef.current;
        pc.getSenders().forEach(s => { try { pc.removeTrack(s); } catch (_) { } });
        streamRef.current.getTracks().forEach(t => pc.addTrack(t, streamRef.current!));
      }
      return;
    }
    try {
      const screen = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      screenStreamRef.current = screen;
      setIsScreenSharing(true);
      if (localVideoRef.current) localVideoRef.current.srcObject = screen;
      if (peerRef.current) {
        const pc = peerRef.current;
        pc.getSenders().forEach(s => { try { pc.removeTrack(s); } catch (_) { } });
        screen.getTracks().forEach(t => pc.addTrack(t, screen));
      }
      screen.getVideoTracks()[0].onended = () => {
        setIsScreenSharing(false);
        screenStreamRef.current = null;
      };
    } catch (err) {
      console.warn('Screen share cancelled or denied');
    }
  };

  /* ── Timer ── */
  useEffect(() => {
    if (timerRunning && isInterviewer) {
      timerRef.current = setInterval(() => {
        setElapsed(e => {
          const next = e + 1;
          socketRef.current?.emit('interview:timer_start', { roomId, durationSec: next });
          return next;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      if (isInterviewer) {
        socketRef.current?.emit('interview:timer_pause', { roomId });
      }
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, isInterviewer]);

  /* ── Anti-cheat ── */
  useEffect(() => {
    if (!isCandidate) return;

    const broadcast = (event: string, severity: 'warn' | 'alert') => {
      const entry = {
        t: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        event,
        severity,
      };
      socketRef.current?.emit('integrity:event', { roomId, ...entry });

    };

    const onVisibility = () => {
      if (document.hidden) broadcast('🚨 Tab switched / window minimized', 'alert');
    };
    const onBlur = () => broadcast('⚠️ Window lost focus', 'warn');
    const onPaste = (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData('text') || '';
      if (text.length > 20) {
        broadcast(`📋 Large paste detected (${text.length} chars)`, 'alert');
      } else if (text.length > 0) {
        broadcast(`📋 Paste detected (${text.length} chars)`, 'warn');
      }
    };
    const onContextMenu = () => broadcast('🖱️ Right-click context menu opened', 'warn');

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);
    document.addEventListener('paste', onPaste);
    document.addEventListener('contextmenu', onContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('paste', onPaste);
      document.removeEventListener('contextmenu', onContextMenu);
    };
  }, [isCandidate]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  /* ── Run code ── */
  const handleRun = async () => {
    if (!isCandidate) return;
    if (!code.trim()) {
      setOutput('Write some code before running.');
      return;
    }
    setRunning(true);
    setOutput('');
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: language.toLowerCase().split(' ')[0] }),
      });
      const data = await res.json();
      const result =
        data.status === 'ACCEPTED'
          ? `✓ Executed successfully\n\n${data.stdout || '(no output)'}\n\nTime: ${data.timeMs}ms`
          : data.status === 'RUNTIME_ERROR'
          ? `✗ Runtime Error\n\n${data.stderr || data.stdout || 'Unknown error'}`
          : data.status === 'TIME_LIMIT_EXCEEDED'
          ? '✗ Time Limit Exceeded (> 10 seconds)'
          : `✗ ${data.status}\n\n${data.stderr || data.stdout || ''}`;
      setOutput(result);
      socketRef.current?.emit('output:sync', { roomId, output: result, submitted: false });

    } catch {
      setOutput('✗ Failed to reach execution server. Is Docker running?');
    } finally {
      setRunning(false);
    }
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!isCandidate) return;
    if (!code.trim()) {
      setOutput('Cannot submit empty code.');
      return;
    }
    setRunning(true);
    setOutput('');
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: language.toLowerCase().split(' ')[0] }),
      });
      const data = await res.json();
      const passed = data.status === 'ACCEPTED';
      const result = passed
        ? `🚀 Submission accepted\n\n${data.stdout || ''}\n\nTime: ${data.timeMs}ms`
        : `✗ Submission failed — ${data.status}\n\n${data.stderr || data.stdout || ''}`;
      setSubmitted(passed);
      setOutput(result);
      socketRef.current?.emit('output:sync', { roomId, output: result, submitted: passed });

    } catch {
      setOutput('✗ Failed to reach execution server.');
    } finally {
      setRunning(false);
    }
  };

  /* ── Camera / Mic ── */
  useEffect(() => {
    if (!cam) {
      streamRef.current?.getVideoTracks().forEach(t => t.stop());
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      return;
    }
    setCamError(null);
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        streamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        if (peerRef.current) {
          stream.getTracks().forEach(t => peerRef.current!.addTrack(t, stream));
        }
      })
      .catch(err => {
        setCamError(err.name === 'NotAllowedError'
          ? 'Camera permission denied. Click the 🔒 icon in your address bar to allow.'
          : `Camera error: ${err.message}`);
        setCam(false);
      });
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()); };
  }, [cam]);

  useEffect(() => {
    streamRef.current?.getAudioTracks().forEach(t => { t.enabled = mic; });
  }, [mic]);

  /* ── WebRTC ── */
  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    peerRef.current = pc;

    pc.ontrack = (e) => {
      if (!e.streams[0]) return;
      setRemoteStream(e.streams[0]);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current?.emit('signal:ice', { roomId, candidate: e.candidate.toJSON() });
      }
    };

    pc.onnegotiationneeded = async () => {
      try {
        await pc.setLocalDescription(await pc.createOffer());
        socketRef.current?.emit('signal:offer', { roomId, sdp: pc.localDescription });
      } catch (_) { }
    };

    return () => pc.close();
  }, [roomId, role]);

  useEffect(() => {
    const pc = peerRef.current;
    const stream = streamRef.current;
    if (!pc || !stream || !cam) return;
    pc.getSenders().forEach(s => { try { pc.removeTrack(s); } catch (_) { } });
    stream.getTracks().forEach(t => pc.addTrack(t, stream));
  }, [cam]);

  /* ── Live code sync ── */
  const handleCodeChange = useCallback((newCode: string) => {
    if (!isCandidate) return;
    setCode(newCode);
    socketRef.current?.emit('code:sync', { roomId, code: newCode });
  }, [isCandidate, roomId]);

  /* ── Chat ── */
  const sendMsg = useCallback(() => {
    if (!chatMsg.trim()) return;
    const msg = {
      id: `${Date.now()}-${Math.random()}`,
      from: userName,
      text: chatMsg.trim(),
      role,
      t: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, msg]);
    socketRef.current?.emit('chat:message', { roomId, ...msg });
    setChatMsg('');
  }, [chatMsg, userName, role]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  /* ── Copy invite ── */
  const inviteUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/room/${roomId}?role=candidate&name=Candidate&qid=${questionId}`
    : '';
  const copyInvite = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  };

  /* ── Role badge ── */
  const roleBadge = isCandidate
    ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 uppercase tracking-wider">Candidate</span>
    : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-primary/20 text-brand-primary uppercase tracking-wider">Interviewer</span>;

  return (
    <div className="h-screen flex flex-col bg-editor-bg overflow-hidden">

      {/* ── Role Banner (Hidden in Practice) ── */}
      {!isPractice && isInterviewer && (
        <div className="flex items-center justify-center gap-2 py-1.5 bg-brand-primary/10 border-b border-brand-primary/20 text-brand-primary text-[11px] font-medium shrink-0">
          <Eye className="w-3.5 h-3.5" />
          You are the <strong>Interviewer</strong> — you can read the candidate&apos;s code but <strong>cannot</strong> edit or run it.
          <button onClick={copyInvite} className="ml-2 flex items-center gap-1 underline underline-offset-2 hover:text-white transition-colors">
            {copied ? <><CheckCircle2 className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy candidate link</>}
          </button>
        </div>
      )}
      {!isPractice && isCandidate && (
        <div className="flex items-center justify-center gap-2 py-1.5 bg-amber-500/10 border-b border-amber-500/20 text-amber-400 text-[11px] font-medium shrink-0">
          <PenLine className="w-3.5 h-3.5" />
          You are the <strong>Candidate</strong> — write your solution in the editor and click <strong>Run</strong> or <strong>Submit</strong>.
        </div>
      )}

      {/* ── Top Toolbar ── */}
      <div className="flex items-center justify-between px-4 h-12 bg-editor-surface border-b border-editor-border shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
              <Code2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-bold text-white">Hire<span className="text-brand-primary">Codec</span></span>
          </Link>
          <span className="text-editor-border">|</span>
          <span className="text-xs text-editor-comment font-mono bg-editor-bg px-2 py-0.5 rounded">{roomId}</span>
          {!isPractice && roleBadge}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={cn('text-sm font-mono', elapsed > 3600 ? 'text-red-400' : elapsed > 2400 ? 'text-amber-400' : 'text-editor-text')}>{fmt(elapsed)}</span>
            {isInterviewer && (
              <button onClick={() => setTimerRunning(t => !t)}
                className={cn('text-xs px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1',
                  timerRunning ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'
                )}>
                <Timer className="w-3 h-3" />
                {timerRunning ? 'Pause' : 'Start Timer'}
              </button>
            )}
          </div>

          <div className="relative">
            <button onClick={() => isCandidate && setShowLangMenu(v => !v)}
              className={cn('flex items-center gap-1.5 text-xs bg-editor-bg border border-editor-border text-editor-text px-3 py-1.5 rounded-lg transition-colors',
                isCandidate ? 'hover:border-brand-primary/50 cursor-pointer' : 'opacity-60 cursor-not-allowed'
              )}>
              {language} {isCandidate && <ChevronDown className="w-3 h-3 text-editor-comment" />}
              {isInterviewer && <Lock className="w-3 h-3 text-editor-comment" />}
            </button>
            {showLangMenu && isCandidate && (
              <div className="absolute top-full right-0 mt-1 bg-editor-surface border border-editor-border rounded-xl shadow-xl z-50 py-1 min-w-[160px]">
                {LANGS.map(l => (
                  <button key={l} onClick={() => { setLanguage(l); setShowLangMenu(false); }}
                    className={cn('w-full text-left px-4 py-2 text-xs hover:bg-editor-bg transition-colors', l === language ? 'text-brand-primary font-semibold' : 'text-editor-text')}>
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* End Button (Hidden in Practice) */}
          {!isPractice ? (
            <Link href="/"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors font-medium"
              onClick={(e) => { e.preventDefault(); setShowEndModal(true); }}>
              <PhoneOff className="w-3.5 h-3.5" /> End
            </Link>
          ) : (
            <Link href="/practice" className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-editor-bg border border-editor-border text-editor-text hover:bg-editor-surface transition-colors font-medium">
              Exit
            </Link>
          )}
        </div>
      </div>

      {/* ── Main ── */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full">

          {/* ── Question Panel ── */}
          <Panel defaultSize={26} minSize={18} maxSize={40}>
            <div className="flex flex-col h-full bg-editor-surface border-r border-editor-border">
              <div className="px-4 py-3 border-b border-editor-border bg-editor-bg shrink-0">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-brand-primary" />
                  <span className="text-xs font-bold text-editor-text truncate">{q.title}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn('badge text-[10px]', getDifficultyColor(q.difficulty))}>{q.difficulty}</span>
                  {q.tags.slice(0, 2).map((t: string) => (
                    <span key={t} className="flex items-center gap-0.5 text-[10px] text-editor-comment">
                      <Tag className="w-2.5 h-2.5" />{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="px-4 pt-4 pb-3">
                  <div className="space-y-1">{renderText(q.description)}</div>
                </div>

                <div className="px-4 pb-3">
                  <p className="text-[10px] font-bold text-editor-comment uppercase tracking-wider mb-2">Examples</p>
                  <div className="space-y-2">
                    {q.examples.map((ex: any, i: number) => (
                      <div key={i} className="rounded-xl bg-editor-bg border border-editor-border p-3">
                        <p className="text-[10px] font-bold text-brand-primary mb-2 uppercase tracking-wider">Example {i + 1}</p>
                        <p className="text-xs mb-1">
                          <span className="text-editor-comment font-semibold">Input: </span>
                          <code className="font-mono text-editor-string">{ex.input}</code>
                        </p>
                        <p className="text-xs mb-1">
                          <span className="text-editor-comment font-semibold">Output: </span>
                          <code className="font-mono text-brand-success">{ex.output}</code>
                        </p>
                        {ex.explanation && <p className="text-xs text-editor-comment">{ex.explanation}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-4 pb-4">
                  <p className="text-[10px] font-bold text-editor-comment uppercase tracking-wider mb-2">Constraints</p>
                  <ul className="space-y-1.5">
                    {q.constraints.map((c: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-editor-comment">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                        <code className="font-mono text-editor-text/80">{c}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 bg-editor-border hover:bg-brand-primary/50 transition-colors cursor-col-resize" />

          {/* ── Editor + Output ── */}
          <Panel defaultSize={isPractice ? 74 : 49} minSize={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={65} minSize={35}>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between px-3 py-2 bg-editor-surface border-b border-editor-border shrink-0">
                    {isCandidate ? (
                      <div className="flex items-center gap-2">
                        <button onClick={handleRun} disabled={running || submitted}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 text-xs font-semibold transition-colors disabled:opacity-40">
                          <Play className="w-3.5 h-3.5" />
                          {running ? 'Running…' : 'Run'}
                        </button>
                        <button onClick={handleSubmit} disabled={running || submitted}
                          className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40',
                            submitted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-brand-primary/15 text-brand-primary hover:bg-brand-primary/25'
                          )}>
                          {submitted ? <><CheckCircle2 className="w-3.5 h-3.5" /> Submitted!</> : <><Send className="w-3.5 h-3.5" /> Submit</>}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-xs text-editor-comment">
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-brand-primary" />
                          <span>Watching candidate&apos;s code <span className="text-brand-primary font-semibold">(read-only)</span></span>
                        </div>
                        {isTyping && (
                          <span className="flex items-center gap-1 text-emerald-400 font-semibold animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                            Typing…
                          </span>
                        )}
                        {!isTyping && code !== '' && code !== q.starterCode && (
                          <span className="flex items-center gap-1 text-editor-comment/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-editor-comment/30 inline-block" />
                            Idle
                          </span>
                        )}
                        {submitted && (
                          <button onClick={() => setShowNextQ(true)}
                            className="ml-2 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-primary/15 text-brand-primary hover:bg-brand-primary/25 text-xs font-semibold transition-colors animate-pulse">
                            <ArrowRight className="w-3 h-3" /> Send Next Question
                          </button>
                        )}
                      </div>
                    )}
                    {isCandidate && submitted && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Submitted — waiting for next question…
                      </span>
                    )}

                    <span className="text-[10px] text-editor-comment font-mono">{language}</span>
                  </div>

                  <div className="relative flex-1">
                    <Editor
                      height="100%"
                      language={
                        language.toLowerCase().includes('python') ? 'python' :
                        language.toLowerCase().includes('c++') ? 'cpp' :
                        language.toLowerCase().includes('java') ? 'java' :
                        language.toLowerCase().includes('go') ? 'go' :
                        language.toLowerCase().includes('rust') ? 'rust' :
                        language.toLowerCase().includes('typescript') ? 'typescript' :
                        'javascript'
                      }
                      theme="vs-dark"
                      value={code}
                      onChange={(val) => handleCodeChange(val || '')}
                      options={{
                        readOnly: !isCandidate,
                        minimap: { enabled: false },
                        fontSize: 14,
                        padding: { top: 16 },
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        fontFamily: 'var(--font-mono), monospace',
                        lineNumbersMinChars: 3,
                        renderLineHighlight: isCandidate ? 'all' : 'none',
                      }}
                      loading={<div className="flex items-center justify-center h-full text-xs text-editor-comment">Loading editor...</div>}
                    />
                    {isInterviewer && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-editor-surface/80 border border-editor-border text-[10px] text-editor-comment pointer-events-none">
                        <Lock className="w-3 h-3" /> Read-only
                      </div>
                    )}
                    {isCandidate && code === '' && (
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                        <button
                          onClick={() => setShowStarterHint(v => !v)}
                          className="pointer-events-auto flex items-center gap-1.5 text-[11px] text-editor-comment/50 hover:text-editor-comment transition-colors"
                        >
                          <Code2 className="w-3 h-3" />
                          {showStarterHint ? 'Hide' : 'Need a template? Load starter code'}
                        </button>
                      </div>
                    )}
                    {isCandidate && showStarterHint && code === '' && (
                      <div className="absolute bottom-12 left-4 right-4 bg-editor-surface border border-editor-border rounded-xl shadow-xl overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-editor-border">
                          <span className="text-[10px] font-bold text-editor-comment uppercase tracking-wider">Starter Template</span>
                          <div className="flex gap-2">
                            <button onClick={() => { setCode(q.starterCode); setShowStarterHint(false); }}
                              className="text-[11px] font-semibold text-brand-primary hover:text-white transition-colors">
                              Load into editor
                            </button>
                            <button onClick={() => setShowStarterHint(false)} className="text-[11px] text-editor-comment hover:text-editor-text transition-colors">✕</button>
                          </div>
                        </div>
                        <pre className="p-3 text-xs font-mono text-editor-text/70 max-h-36 overflow-y-auto">{q.starterCode}</pre>
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-1 bg-editor-border hover:bg-brand-primary/50 transition-colors cursor-row-resize" />

              <Panel defaultSize={35} minSize={15}>
                <div className="flex flex-col h-full bg-editor-surface">
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-editor-border shrink-0">
                    <span className="text-xs font-bold text-editor-comment uppercase tracking-wider">Output</span>
                    {running && <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                    {submitted && <span className="text-[10px] text-emerald-400 font-semibold">● Submitted</span>}
                  </div>
                  <pre className="flex-1 overflow-auto p-4 text-xs font-mono leading-relaxed whitespace-pre-wrap">
                    {running
                      ? <span className="text-editor-comment animate-pulse">Running…</span>
                      : output
                        ? <span className={submitted ? 'text-emerald-400' : 'text-editor-text'}>{output}</span>
                        : <span className="text-editor-comment opacity-40">
                          {isCandidate ? 'Click Run to test your code.' : 'Output will appear here when candidate runs code.'}
                        </span>
                    }
                  </pre>
                </div>
              </Panel>
            </PanelGroup>
          </Panel>

          {!isPractice && (
            <>
              <PanelResizeHandle className="w-1 bg-editor-border hover:bg-brand-primary/50 transition-colors cursor-col-resize" />

              {/* ── Right Panel ── */}
              <Panel defaultSize={25} minSize={18} maxSize={35}>
                <PanelGroup direction="vertical">

                  <Panel defaultSize={42} minSize={20}>
                    <div className="flex flex-col h-full bg-editor-surface border-b border-editor-border">
                      <div className="flex-1 flex flex-col gap-1 p-2 min-h-0">
                        <div className="flex-1 relative rounded-xl overflow-hidden border border-editor-border bg-editor-bg min-h-0">
                          {remoteStream ? (
                            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                              <div className={cn('w-10 h-10 rounded-full flex items-center justify-center mb-1.5 shadow-md',
                                isCandidate ? 'bg-gradient-to-br from-brand-primary to-brand-accent' : 'bg-gradient-to-br from-amber-500 to-orange-600'
                              )}>
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <p className="text-[11px] font-semibold text-editor-text">{isCandidate ? 'Interviewer' : 'Candidate'}</p>
                              <p className="text-[10px] text-editor-comment/50 mt-0.5">Waiting for camera…</p>
                            </div>
                          )}
                          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/50 text-[9px] text-white font-semibold">
                            {isCandidate ? 'Interviewer' : 'Candidate'}
                          </div>
                        </div>

                        <div className="relative h-24 rounded-xl overflow-hidden border border-editor-border bg-editor-bg shrink-0">
                          {cam && !camError ? (
                            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center mb-1',
                                isCandidate ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-brand-primary to-brand-accent'
                              )}>
                                <User className="w-4 h-4 text-white" />
                              </div>
                              <p className="text-[10px] text-editor-comment">{cam ? '' : 'Camera off'}</p>
                            </div>
                          )}
                          <div className="absolute top-1 left-1.5 px-1.5 py-0.5 rounded-md bg-black/50 text-[9px] text-white font-semibold">
                            You
                          </div>
                          {!mic && (
                            <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 flex items-center justify-center">
                              <MicOff className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>

                      {camError && (
                        <div className="mx-2 mb-1 px-2 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                          <p className="text-[10px] text-red-400 leading-relaxed">{camError}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-center gap-2 py-2 border-t border-editor-border shrink-0">
                        <button
                          onClick={() => setMic(v => !v)}
                          title={mic ? 'Mute microphone' : 'Unmute microphone'}
                          className={cn('w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                            mic ? 'bg-editor-bg hover:bg-editor-border text-editor-text' : 'bg-red-500/20 text-red-400'
                          )}>
                          {mic ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => setCam(v => !v)}
                          title={cam ? 'Turn off camera' : 'Turn on camera'}
                          className={cn('w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                            cam ? 'bg-editor-bg hover:bg-editor-border text-editor-text' : 'bg-red-500/20 text-red-400'
                          )}>
                          {cam ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={toggleScreenShare}
                          title={isScreenSharing ? 'Stop sharing screen' : 'Share your screen'}
                          className={cn('w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                            isScreenSharing ? 'bg-brand-primary/20 text-brand-primary animate-pulse' : 'bg-editor-bg hover:bg-editor-border text-editor-comment'
                          )}>
                          {isScreenSharing ? <MonitorOff className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </Panel>

                  <PanelResizeHandle className="h-1 bg-editor-border hover:bg-brand-primary/50 transition-colors cursor-row-resize" />

                  <Panel defaultSize={62} minSize={30}>
                    <div className="flex flex-col h-full">
                      <div className="flex border-b border-editor-border shrink-0">
                        <button onClick={() => setRightTab('video')}
                          className={cn('flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold transition-colors',
                            rightTab === 'video' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-editor-comment hover:text-editor-text'
                          )}>
                          <MessageSquare className="w-3 h-3" /> Chat
                        </button>
                        {isInterviewer && (
                          <button onClick={() => setRightTab('notes')}
                            className={cn('flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold transition-colors relative',
                              rightTab === 'notes' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-editor-comment hover:text-editor-text'
                            )}>
                            <ClipboardList className="w-3 h-3" /> Notes
                            {cheatCount > 0 && (
                              <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                                {cheatCount > 9 ? '9+' : cheatCount}
                              </span>
                            )}
                          </button>
                        )}
                      </div>

                      {rightTab === 'video' && (
                        <>
                          <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {messages.map((m, i) => (
                              <div key={i} className={cn('text-xs', m.role === 'system' ? 'text-center' : '')}>
                                {m.role === 'system'
                                  ? <span className="text-editor-comment/60 text-[10px] italic">{m.text}</span>
                                  : <>
                                    <div className="flex items-center gap-1 mb-0.5">
                                      <span className={cn('font-semibold text-[11px]', m.role === 'candidate' ? 'text-amber-400' : 'text-brand-primary')}>{m.from}</span>
                                      <span className="text-[10px] text-editor-comment">{m.t}</span>
                                    </div>
                                    <p className="text-editor-text bg-editor-bg rounded-lg px-2.5 py-1.5 text-xs">{m.text}</p>
                                  </>
                                }
                              </div>
                            ))}
                            <div ref={chatEndRef} />
                          </div>
                          <div className="flex gap-2 p-2 border-t border-editor-border shrink-0">
                            <input value={chatMsg} onChange={e => setChatMsg(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMsg()}
                              placeholder="Type a message…"
                              className="flex-1 bg-editor-bg text-editor-text text-xs rounded-lg px-3 py-2 border border-editor-border focus:outline-none focus:border-brand-primary/50 placeholder:text-editor-comment/50" />
                            <button onClick={sendMsg} className="w-8 h-8 rounded-lg bg-brand-primary/15 text-brand-primary hover:bg-brand-primary/25 flex items-center justify-center transition-colors">
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}

                      {rightTab === 'notes' && isInterviewer && (
                        <div className="flex flex-col flex-1 overflow-hidden">
                          {cheatLog.length > 0 && (
                            <div className="border-b border-red-500/20 bg-red-500/5 shrink-0">
                              <div className="flex items-center justify-between px-3 py-1.5">
                                <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider">⚠ Cheat Alerts ({cheatLog.length})</p>
                                <button onClick={() => { setCheatLog([]); setCheatCount(0); }} className="text-[10px] text-editor-comment hover:text-red-400 transition-colors">Clear</button>
                              </div>
                              <div className="max-h-28 overflow-y-auto">
                                {cheatLog.map((e, i) => (
                                  <div key={i} className={cn('flex items-start gap-2 px-3 py-1 border-t border-red-500/10',
                                    e.severity === 'alert' ? 'bg-red-500/10' : 'bg-amber-500/5'
                                  )}>
                                    <span className={cn('text-[9px] font-bold px-1 py-0.5 rounded shrink-0 mt-0.5',
                                      e.severity === 'alert' ? 'bg-red-500/30 text-red-300' : 'bg-amber-500/30 text-amber-300'
                                    )}>{e.severity.toUpperCase()}</span>
                                    <div className="min-w-0">
                                      <p className="text-[11px] text-editor-text leading-tight">{e.event}</p>
                                      <p className="text-[10px] text-editor-comment">{e.t}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="p-3 border-b border-editor-border shrink-0">
                            <p className="text-[10px] text-editor-comment uppercase font-semibold tracking-wider mb-2">Rating</p>
                            <div className="flex gap-1 mb-3">
                              {[1, 2, 3, 4, 5].map(n => (
                                <button key={n} onClick={() => setRating(n)}
                                  className={cn('w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                                    n <= rating ? 'text-amber-400 bg-amber-500/20' : 'text-editor-comment hover:text-amber-400'
                                  )}>
                                  <Star className="w-4 h-4" fill={n <= rating ? 'currentColor' : 'none'} />
                                </button>
                              ))}
                              <span className="ml-1 text-xs text-editor-comment self-center">{rating > 0 ? `${rating}/5` : ''}</span>
                            </div>
                            <p className="text-[10px] text-editor-comment uppercase font-semibold tracking-wider mb-2">Decision</p>
                            <div className="flex gap-2">
                              <button onClick={() => setDecision('yes')}
                                className={cn('flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold transition-colors',
                                  decision === 'yes' ? 'bg-emerald-500/25 text-emerald-400 border border-emerald-500/40' : 'bg-editor-bg text-editor-comment hover:text-emerald-400 border border-editor-border'
                                )}>
                                <ThumbsUp className="w-3.5 h-3.5" /> Hire
                              </button>
                              <button onClick={() => setDecision('no')}
                                className={cn('flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold transition-colors',
                                  decision === 'no' ? 'bg-red-500/25 text-red-400 border border-red-500/40' : 'bg-editor-bg text-editor-comment hover:text-red-400 border border-editor-border'
                                )}>
                                <ThumbsDown className="w-3.5 h-3.5" /> Reject
                              </button>
                            </div>
                          </div>

                          <div className="flex-1 p-3 flex flex-col overflow-hidden">
                            <p className="text-[10px] text-editor-comment uppercase font-semibold tracking-wider mb-2">Notes</p>
                            <textarea value={interviewerNotes} onChange={e => setNotes(e.target.value)}
                              placeholder="Observations, hints given, red flags…"
                              className="flex-1 bg-editor-bg text-editor-text text-xs font-mono rounded-lg p-3 border border-editor-border focus:outline-none focus:border-brand-primary/50 placeholder:text-editor-comment/40 resize-none" />
                          </div>
                        </div>
                      )}
                    </div>
                  </Panel>

                </PanelGroup>
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>

      {/* ── Next Question Picker ── */}
      {showNextQ && isInterviewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-editor-surface border border-editor-border rounded-2xl shadow-2xl w-[480px] max-w-[90vw] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-editor-border">
              <div>
                <h2 className="text-sm font-bold text-editor-text">Send Next Question</h2>
                <p className="text-xs text-editor-comment mt-0.5">Pick a question — candidate's editor will reset</p>
              </div>
              <button onClick={() => setShowNextQ(false)} className="text-editor-comment hover:text-editor-text transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
              {Object.entries(QUESTIONS).map(([id, q]: any) => (
                <button key={id} onClick={() => sendNextQuestion(id)}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-xl border transition-all group',
                    currentQId === id
                      ? 'border-brand-primary/40 bg-brand-primary/10 cursor-default'
                      : 'border-editor-border bg-editor-bg hover:border-brand-primary/40 hover:bg-brand-primary/5'
                  )}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-editor-text">{q.title}</span>
                    <div className="flex items-center gap-2">
                      <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', getDifficultyColor(q.difficulty))}>{q.difficulty}</span>
                      {currentQId === id
                        ? <span className="text-[10px] text-brand-primary font-semibold">Current</span>
                        : <ChevronRight className="w-3.5 h-3.5 text-editor-comment group-hover:text-brand-primary transition-colors" />}
                    </div>
                  </div>
                  <div className="flex gap-1 mt-1.5">
                    {q.tags.slice(0, 3).map((t: string) => (
                      <span key={t} className="text-[10px] text-editor-comment bg-editor-surface px-1.5 py-0.5 rounded-md">{t}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── End Interview Modal ── */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-editor-surface border border-editor-border rounded-2xl shadow-2xl w-[380px] max-w-[90vw] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <PhoneOff className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-editor-text">End Interview?</h2>
                <p className="text-xs text-editor-comment mt-0.5">This will disconnect both the candidate and interviewer.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowEndModal(false)}
                className="flex-1 py-2 rounded-xl text-sm font-semibold border border-editor-border text-editor-comment hover:text-editor-text transition-colors">
                Cancel
              </button>
              <button onClick={endInterview}
                className="flex-1 py-2 rounded-xl text-sm font-semibold bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-colors">
                End Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}