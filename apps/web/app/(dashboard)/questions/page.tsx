'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Search, FileQuestion, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, getDifficultyColor } from '@/lib/utils';

/* ─── 150 Questions ─────────────────────────────────────── */
const ALL_QUESTIONS = [
  // ── EASY (50) ──────────────────────────────────────────
  { id:'1',  title:'Two Sum',                       difficulty:'EASY',   type:'CODING',        tags:['arrays','hash-map'] },
  { id:'2',  title:'Valid Parentheses',             difficulty:'EASY',   type:'CODING',        tags:['stack','string'] },
  { id:'3',  title:'Reverse Linked List',           difficulty:'EASY',   type:'CODING',        tags:['linked-list'] },
  { id:'4',  title:'Climbing Stairs',               difficulty:'EASY',   type:'CODING',        tags:['dynamic-programming'] },
  { id:'5',  title:'Binary Search',                 difficulty:'EASY',   type:'CODING',        tags:['binary-search'] },
  { id:'6',  title:'Best Time to Buy and Sell Stock', difficulty:'EASY', type:'CODING',        tags:['arrays','sliding-window'] },
  { id:'7',  title:'Maximum Depth of Binary Tree',  difficulty:'EASY',   type:'CODING',        tags:['tree','dfs'] },
  { id:'8',  title:'Merge Two Sorted Lists',        difficulty:'EASY',   type:'CODING',        tags:['linked-list'] },
  { id:'9',  title:'Single Number',                 difficulty:'EASY',   type:'CODING',        tags:['bit-manipulation'] },
  { id:'10', title:'Palindrome Number',             difficulty:'EASY',   type:'CODING',        tags:['math'] },
  { id:'11', title:'Contains Duplicate',            difficulty:'EASY',   type:'CODING',        tags:['arrays','hash-map'] },
  { id:'12', title:'Missing Number',                difficulty:'EASY',   type:'CODING',        tags:['arrays','math'] },
  { id:'13', title:'Move Zeroes',                   difficulty:'EASY',   type:'CODING',        tags:['arrays','two-pointers'] },
  { id:'14', title:'Symmetric Tree',                difficulty:'EASY',   type:'CODING',        tags:['tree','recursion'] },
  { id:'15', title:'Flood Fill',                    difficulty:'EASY',   type:'CODING',        tags:['matrix','dfs'] },
  { id:'16', title:'Invert Binary Tree',            difficulty:'EASY',   type:'CODING',        tags:['tree','recursion'] },
  { id:'17', title:'Linked List Cycle',             difficulty:'EASY',   type:'CODING',        tags:['linked-list','two-pointers'] },
  { id:'18', title:'Majority Element',              difficulty:'EASY',   type:'CODING',        tags:['arrays','hash-map'] },
  { id:'19', title:'Roman to Integer',              difficulty:'EASY',   type:'CODING',        tags:['string','math'] },
  { id:'20', title:'Count and Say',                 difficulty:'EASY',   type:'CODING',        tags:['string'] },
  { id:'21', title:'Excel Sheet Column Number',     difficulty:'EASY',   type:'CODING',        tags:['math'] },
  { id:'22', title:'Happy Number',                  difficulty:'EASY',   type:'CODING',        tags:['math','hash-set'] },
  { id:'23', title:'Power of Two',                  difficulty:'EASY',   type:'CODING',        tags:['bit-manipulation','math'] },
  { id:'24', title:'Squares of a Sorted Array',    difficulty:'EASY',   type:'CODING',        tags:['arrays','two-pointers'] },
  { id:'25', title:'Running Sum of 1D Array',      difficulty:'EASY',   type:'CODING',        tags:['arrays','prefix-sum'] },
  { id:'26', title:'Fibonacci Number',             difficulty:'EASY',   type:'CODING',        tags:['recursion','dynamic-programming'] },
  { id:'27', title:'Is Subsequence',               difficulty:'EASY',   type:'CODING',        tags:['string','two-pointers'] },
  { id:'28', title:'Number of 1 Bits',             difficulty:'EASY',   type:'CODING',        tags:['bit-manipulation'] },
  { id:'29', title:'Reverse Bits',                 difficulty:'EASY',   type:'CODING',        tags:['bit-manipulation'] },
  { id:'30', title:'Remove Duplicates from Sorted Array', difficulty:'EASY', type:'CODING',   tags:['arrays','two-pointers'] },
  { id:'31', title:'Pascal\'s Triangle',           difficulty:'EASY',   type:'CODING',        tags:['arrays','dynamic-programming'] },
  { id:'32', title:'Intersection of Two Arrays',  difficulty:'EASY',   type:'CODING',        tags:['arrays','hash-set'] },
  { id:'33', title:'Add Strings',                  difficulty:'EASY',   type:'CODING',        tags:['string','math'] },
  { id:'34', title:'Longest Common Prefix',        difficulty:'EASY',   type:'CODING',        tags:['string'] },
  { id:'35', title:'Valid Anagram',                difficulty:'EASY',   type:'CODING',        tags:['string','hash-map'] },
  { id:'36', title:'First Bad Version',            difficulty:'EASY',   type:'CODING',        tags:['binary-search'] },
  { id:'37', title:'Guess Number Higher or Lower', difficulty:'EASY',   type:'CODING',        tags:['binary-search'] },
  { id:'38', title:'Balanced Binary Tree',         difficulty:'EASY',   type:'CODING',        tags:['tree','dfs'] },
  { id:'39', title:'Path Sum',                     difficulty:'EASY',   type:'CODING',        tags:['tree','dfs'] },
  { id:'40', title:'Find the Difference',          difficulty:'EASY',   type:'CODING',        tags:['string','bit-manipulation'] },
  { id:'41', title:'Third Maximum Number',         difficulty:'EASY',   type:'CODING',        tags:['arrays','sorting'] },
  { id:'42', title:'Minimum Depth of Binary Tree', difficulty:'EASY',   type:'CODING',        tags:['tree','bfs'] },
  { id:'43', title:'Sum of Left Leaves',           difficulty:'EASY',   type:'CODING',        tags:['tree','dfs'] },
  { id:'44', title:'Reverse String',               difficulty:'EASY',   type:'CODING',        tags:['string','two-pointers'] },
  { id:'45', title:'Length of Last Word',          difficulty:'EASY',   type:'CODING',        tags:['string'] },
  { id:'46', title:'Plus One',                     difficulty:'EASY',   type:'CODING',        tags:['arrays','math'] },
  { id:'47', title:'Implement strStr()',           difficulty:'EASY',   type:'CODING',        tags:['string'] },
  { id:'48', title:'Search Insert Position',       difficulty:'EASY',   type:'CODING',        tags:['binary-search','arrays'] },
  { id:'49', title:'Remove Element',               difficulty:'EASY',   type:'CODING',        tags:['arrays','two-pointers'] },
  { id:'50', title:'Sqrt(x)',                      difficulty:'EASY',   type:'CODING',        tags:['binary-search','math'] },

  // ── MEDIUM (70) ────────────────────────────────────────
  { id:'51',  title:'Two Sum II',                       difficulty:'MEDIUM', type:'CODING',        tags:['arrays','two-pointers'] },
  { id:'52',  title:'LRU Cache',                        difficulty:'MEDIUM', type:'CODING',        tags:['design','hash-map','linked-list'] },
  { id:'53',  title:'Binary Tree Level Order Traversal',difficulty:'MEDIUM', type:'CODING',        tags:['tree','bfs'] },
  { id:'54',  title:'Maximum Subarray',                 difficulty:'MEDIUM', type:'CODING',        tags:['dynamic-programming','arrays'] },
  { id:'55',  title:'Longest Palindromic Substring',   difficulty:'MEDIUM', type:'CODING',        tags:['string','dynamic-programming'] },
  { id:'56',  title:'Number of Islands',               difficulty:'MEDIUM', type:'CODING',        tags:['graph','dfs','bfs'] },
  { id:'57',  title:'Word Search',                     difficulty:'MEDIUM', type:'CODING',        tags:['backtracking','matrix'] },
  { id:'58',  title:'Course Schedule',                 difficulty:'MEDIUM', type:'CODING',        tags:['graph','topological-sort'] },
  { id:'59',  title:'Coin Change',                     difficulty:'MEDIUM', type:'CODING',        tags:['dynamic-programming'] },
  { id:'60',  title:'Product of Array Except Self',    difficulty:'MEDIUM', type:'CODING',        tags:['arrays','prefix-sum'] },
  { id:'61',  title:'Subsets',                         difficulty:'MEDIUM', type:'CODING',        tags:['backtracking'] },
  { id:'62',  title:'Permutations',                    difficulty:'MEDIUM', type:'CODING',        tags:['backtracking'] },
  { id:'63',  title:'Combinations',                    difficulty:'MEDIUM', type:'CODING',        tags:['backtracking'] },
  { id:'64',  title:'Rotate Array',                    difficulty:'MEDIUM', type:'CODING',        tags:['arrays','two-pointers'] },
  { id:'65',  title:'Group Anagrams',                  difficulty:'MEDIUM', type:'CODING',        tags:['string','hash-map'] },
  { id:'66',  title:'Top K Frequent Elements',         difficulty:'MEDIUM', type:'CODING',        tags:['arrays','heap'] },
  { id:'67',  title:'Encode and Decode Strings',       difficulty:'MEDIUM', type:'CODING',        tags:['string','design'] },
  { id:'68',  title:'Longest Consecutive Sequence',    difficulty:'MEDIUM', type:'CODING',        tags:['arrays','hash-set'] },
  { id:'69',  title:'3Sum',                            difficulty:'MEDIUM', type:'CODING',        tags:['arrays','two-pointers'] },
  { id:'70',  title:'Container With Most Water',       difficulty:'MEDIUM', type:'CODING',        tags:['arrays','two-pointers'] },
  { id:'71',  title:'Min Stack',                       difficulty:'MEDIUM', type:'CODING',        tags:['stack','design'] },
  { id:'72',  title:'Evaluate Reverse Polish Notation',difficulty:'MEDIUM', type:'CODING',        tags:['stack'] },
  { id:'73',  title:'Daily Temperatures',              difficulty:'MEDIUM', type:'CODING',        tags:['stack','arrays'] },
  { id:'74',  title:'Car Fleet',                       difficulty:'MEDIUM', type:'CODING',        tags:['stack','sorting'] },
  { id:'75',  title:'Find Minimum in Rotated Sorted Array', difficulty:'MEDIUM', type:'CODING',   tags:['binary-search'] },
  { id:'76',  title:'Search a 2D Matrix',              difficulty:'MEDIUM', type:'CODING',        tags:['binary-search','matrix'] },
  { id:'77',  title:'Kth Largest Element in an Array', difficulty:'MEDIUM', type:'CODING',        tags:['heap','sorting'] },
  { id:'78',  title:'Task Scheduler',                  difficulty:'MEDIUM', type:'CODING',        tags:['heap','greedy'] },
  { id:'79',  title:'Design Twitter',                  difficulty:'MEDIUM', type:'SYSTEM_DESIGN', tags:['system-design','oop'] },
  { id:'80',  title:'Design URL Shortener',            difficulty:'MEDIUM', type:'SYSTEM_DESIGN', tags:['system-design'] },
  { id:'81',  title:'Invert Binary Tree',              difficulty:'MEDIUM', type:'CODING',        tags:['tree','bfs'] },
  { id:'82',  title:'Maximum Depth Binary Tree',       difficulty:'MEDIUM', type:'CODING',        tags:['tree','dfs'] },
  { id:'83',  title:'Diameter of Binary Tree',        difficulty:'MEDIUM', type:'CODING',        tags:['tree','dfs'] },
  { id:'84',  title:'Lowest Common Ancestor BST',     difficulty:'MEDIUM', type:'CODING',        tags:['tree','bst'] },
  { id:'85',  title:'Binary Tree Right Side View',    difficulty:'MEDIUM', type:'CODING',        tags:['tree','bfs'] },
  { id:'86',  title:'Count Good Nodes in Binary Tree',difficulty:'MEDIUM', type:'CODING',        tags:['tree','dfs'] },
  { id:'87',  title:'Validate Binary Search Tree',    difficulty:'MEDIUM', type:'CODING',        tags:['tree','bst'] },
  { id:'88',  title:'Kth Smallest Element in BST',   difficulty:'MEDIUM', type:'CODING',        tags:['tree','bst'] },
  { id:'89',  title:'Construct Binary Tree from Preorder and Inorder', difficulty:'MEDIUM', type:'CODING', tags:['tree','recursion'] },
  { id:'90',  title:'Clone Graph',                    difficulty:'MEDIUM', type:'CODING',        tags:['graph','dfs'] },
  { id:'91',  title:'Pacific Atlantic Water Flow',    difficulty:'MEDIUM', type:'CODING',        tags:['graph','dfs'] },
  { id:'92',  title:'Rotting Oranges',                difficulty:'MEDIUM', type:'CODING',        tags:['graph','bfs'] },
  { id:'93',  title:'Walls and Gates',                difficulty:'MEDIUM', type:'CODING',        tags:['graph','bfs'] },
  { id:'94',  title:'House Robber',                   difficulty:'MEDIUM', type:'CODING',        tags:['dynamic-programming'] },
  { id:'95',  title:'House Robber II',                difficulty:'MEDIUM', type:'CODING',        tags:['dynamic-programming'] },
  { id:'96',  title:'Longest Palindromic Subsequence',difficulty:'MEDIUM', type:'CODING',        tags:['dynamic-programming','string'] },
  { id:'97',  title:'Decode Ways',                    difficulty:'MEDIUM', type:'CODING',        tags:['dynamic-programming','string'] },
  { id:'98',  title:'Unique Paths',                   difficulty:'MEDIUM', type:'CODING',        tags:['dynamic-programming','matrix'] },
  { id:'99',  title:'Jump Game',                      difficulty:'MEDIUM', type:'CODING',        tags:['greedy','dynamic-programming'] },
  { id:'100', title:'Jump Game II',                   difficulty:'MEDIUM', type:'CODING',        tags:['greedy','dynamic-programming'] },
  { id:'101', title:'Partition Equal Subset Sum',     difficulty:'MEDIUM', type:'CODING',        tags:['dynamic-programming'] },
  { id:'102', title:'Longest Increasing Subsequence', difficulty:'MEDIUM', type:'CODING',        tags:['dynamic-programming','binary-search'] },
  { id:'103', title:'Spiral Matrix',                  difficulty:'MEDIUM', type:'CODING',        tags:['matrix','simulation'] },
  { id:'104', title:'Set Matrix Zeroes',              difficulty:'MEDIUM', type:'CODING',        tags:['matrix'] },
  { id:'105', title:'Rotate Image',                   difficulty:'MEDIUM', type:'CODING',        tags:['matrix','arrays'] },
  { id:'106', title:'Design Parking System',          difficulty:'MEDIUM', type:'SYSTEM_DESIGN', tags:['system-design','oop'] },
  { id:'107', title:'Design HashMap',                 difficulty:'MEDIUM', type:'CODING',        tags:['design','hash-map'] },
  { id:'108', title:'Design a Stack with Increment Operation', difficulty:'MEDIUM', type:'CODING', tags:['design','stack'] },
  { id:'109', title:'Longest Substring Without Repeating Characters', difficulty:'MEDIUM', type:'CODING', tags:['sliding-window','string'] },
  { id:'110', title:'Minimum Window Substring',       difficulty:'MEDIUM', type:'CODING',        tags:['sliding-window','string'] },
  { id:'111', title:'Sliding Window Maximum',         difficulty:'MEDIUM', type:'CODING',        tags:['sliding-window','deque'] },
  { id:'112', title:'Permutation in String',          difficulty:'MEDIUM', type:'CODING',        tags:['sliding-window','string'] },
  { id:'113', title:'Fruit Into Baskets',             difficulty:'MEDIUM', type:'CODING',        tags:['sliding-window','hash-map'] },
  { id:'114', title:'Merge Intervals',                difficulty:'MEDIUM', type:'CODING',        tags:['intervals','sorting'] },
  { id:'115', title:'Insert Interval',                difficulty:'MEDIUM', type:'CODING',        tags:['intervals'] },
  { id:'116', title:'Non-Overlapping Intervals',      difficulty:'MEDIUM', type:'CODING',        tags:['intervals','greedy'] },
  { id:'117', title:'Meeting Rooms II',               difficulty:'MEDIUM', type:'CODING',        tags:['intervals','heap'] },
  { id:'118', title:'Minimum Interval to Include Each Query', difficulty:'MEDIUM', type:'CODING', tags:['intervals','heap'] },
  { id:'119', title:'Next Permutation',               difficulty:'MEDIUM', type:'CODING',        tags:['arrays','two-pointers'] },
  { id:'120', title:'Sort Colors',                    difficulty:'MEDIUM', type:'CODING',        tags:['arrays','two-pointers','sorting'] },

  // ── HARD (30) ──────────────────────────────────────────
  { id:'121', title:'Merge K Sorted Lists',           difficulty:'HARD',   type:'CODING',        tags:['heap','linked-list'] },
  { id:'122', title:'Trapping Rain Water',            difficulty:'HARD',   type:'CODING',        tags:['two-pointers','arrays'] },
  { id:'123', title:'Median of Two Sorted Arrays',   difficulty:'HARD',   type:'CODING',        tags:['binary-search','arrays'] },
  { id:'124', title:'N-Queens',                       difficulty:'HARD',   type:'CODING',        tags:['backtracking'] },
  { id:'125', title:'Word Ladder',                    difficulty:'HARD',   type:'CODING',        tags:['graph','bfs'] },
  { id:'126', title:'Alien Dictionary',              difficulty:'HARD',   type:'CODING',        tags:['graph','topological-sort'] },
  { id:'127', title:'Serialize and Deserialize Binary Tree', difficulty:'HARD', type:'CODING',   tags:['tree','dfs'] },
  { id:'128', title:'Binary Tree Maximum Path Sum',  difficulty:'HARD',   type:'CODING',        tags:['tree','dfs'] },
  { id:'129', title:'Find Median from Data Stream',  difficulty:'HARD',   type:'CODING',        tags:['heap','design'] },
  { id:'130', title:'Largest Rectangle in Histogram',difficulty:'HARD',   type:'CODING',        tags:['stack','arrays'] },
  { id:'131', title:'Sliding Window Maximum – Hard', difficulty:'HARD',   type:'CODING',        tags:['deque','sliding-window'] },
  { id:'132', title:'Word Search II',                difficulty:'HARD',   type:'CODING',        tags:['backtracking','trie'] },
  { id:'133', title:'Regular Expression Matching',  difficulty:'HARD',   type:'CODING',        tags:['dynamic-programming','string'] },
  { id:'134', title:'Edit Distance',                difficulty:'HARD',   type:'CODING',        tags:['dynamic-programming','string'] },
  { id:'135', title:'Burst Balloons',               difficulty:'HARD',   type:'CODING',        tags:['dynamic-programming'] },
  { id:'136', title:'Distinct Subsequences',        difficulty:'HARD',   type:'CODING',        tags:['dynamic-programming','string'] },
  { id:'137', title:'Interleaving String',          difficulty:'HARD',   type:'CODING',        tags:['dynamic-programming','string'] },
  { id:'138', title:'Maximal Rectangle',            difficulty:'HARD',   type:'CODING',        tags:['matrix','stack'] },
  { id:'139', title:'The Skyline Problem',          difficulty:'HARD',   type:'CODING',        tags:['heap','divide-and-conquer'] },
  { id:'140', title:'Count of Smaller Numbers After Self', difficulty:'HARD', type:'CODING',   tags:['binary-indexed-tree','sorting'] },
  { id:'141', title:'Design Rate Limiter',          difficulty:'HARD',   type:'SYSTEM_DESIGN', tags:['system-design'] },
  { id:'142', title:'Design Distributed Cache',     difficulty:'HARD',   type:'SYSTEM_DESIGN', tags:['system-design'] },
  { id:'143', title:'Design Search Autocomplete',   difficulty:'HARD',   type:'SYSTEM_DESIGN', tags:['system-design','trie'] },
  { id:'144', title:'Design Facebook Newsfeed',     difficulty:'HARD',   type:'SYSTEM_DESIGN', tags:['system-design'] },
  { id:'145', title:'Design Uber/Lyft',             difficulty:'HARD',   type:'SYSTEM_DESIGN', tags:['system-design'] },
  { id:'146', title:'Minimum Window Substring – Hard', difficulty:'HARD', type:'CODING',       tags:['sliding-window','string'] },
  { id:'147', title:'LFU Cache',                   difficulty:'HARD',   type:'CODING',        tags:['design','hash-map'] },
  { id:'148', title:'Swim in Rising Water',         difficulty:'HARD',   type:'CODING',        tags:['graph','binary-search'] },
  { id:'149', title:'Smallest Range Covering Elements from K Lists', difficulty:'HARD', type:'CODING', tags:['heap','sliding-window'] },
  { id:'150', title:'Minimum Cost to Hire K Workers', difficulty:'HARD', type:'CODING',        tags:['heap','greedy'] },
].map((q, i) => ({ ...q, testCases: Math.floor(Math.random() * 8) + 3, usedCount: Math.floor(Math.random() * 20) }));

const PER_PAGE = 18;

export default function QuestionsPage() {
  const [search, setSearch]               = useState('');
  const [difficulty, setDifficulty]       = useState('all');
  const [type, setType]                   = useState('all');
  const [page, setPage]                   = useState(1);

  const filtered = useMemo(() => {
    return ALL_QUESTIONS.filter(q => {
      const s = search.toLowerCase();
      return (
        (difficulty === 'all' || q.difficulty === difficulty) &&
        (type === 'all'       || q.type === type) &&
        (q.title.toLowerCase().includes(s) || q.tags.some(t => t.includes(s)))
      );
    });
  }, [search, difficulty, type]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageItems  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const resetPage = () => setPage(1);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dash-text dark:text-editor-text">Question Bank</h1>
          <p className="text-sm text-dash-muted dark:text-editor-comment mt-1">
            {ALL_QUESTIONS.length} total · {filtered.length} matching
          </p>
        </div>
        <Link href="/questions/new" className="btn-primary btn-md">
          <Plus className="w-4 h-4" /> New Question
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dash-muted dark:text-editor-comment" />
          <input value={search} onChange={e => { setSearch(e.target.value); resetPage(); }} placeholder="Search questions or tags…" className="input pl-10" />
        </div>

        {/* Difficulty */}
        <div className="flex gap-1.5 flex-wrap">
          {[
            { val: 'all',    label: 'All',    color: '' },
            { val: 'EASY',   label: 'Easy',   color: 'data-[active=true]:bg-emerald-500 data-[active=true]:text-white data-[active=true]:border-emerald-500' },
            { val: 'MEDIUM', label: 'Medium', color: 'data-[active=true]:bg-amber-500 data-[active=true]:text-white data-[active=true]:border-amber-500' },
            { val: 'HARD',   label: 'Hard',   color: 'data-[active=true]:bg-red-500 data-[active=true]:text-white data-[active=true]:border-red-500' },
          ].map(d => (
            <button key={d.val} data-active={difficulty === d.val} onClick={() => { setDifficulty(d.val); resetPage(); }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                difficulty === d.val
                  ? d.val === 'all' ? 'bg-brand-primary text-white border-brand-primary'
                    : d.val === 'EASY' ? 'bg-emerald-500 text-white border-emerald-500'
                    : d.val === 'MEDIUM' ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-red-500 text-white border-red-500'
                  : 'bg-white dark:bg-editor-surface border-dash-border dark:border-editor-border text-dash-muted dark:text-editor-comment hover:border-brand-primary/50'
              )}>
              {d.label}
            </button>
          ))}
        </div>

        {/* Type */}
        <div className="flex gap-1.5">
          {[
            { val: 'all',           label: 'All Types' },
            { val: 'CODING',        label: 'Coding' },
            { val: 'SYSTEM_DESIGN', label: 'System Design' },
          ].map(t => (
            <button key={t.val} onClick={() => { setType(t.val); resetPage(); }}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                type === t.val
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-editor-surface border-dash-border dark:border-editor-border text-dash-muted dark:text-editor-comment hover:border-indigo-400/50'
              )}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {pageItems.length === 0 ? (
        <div className="text-center py-20">
          <FileQuestion className="w-12 h-12 text-dash-muted dark:text-editor-comment mx-auto mb-3 opacity-50" />
          <p className="text-sm text-dash-muted dark:text-editor-comment">No questions match your filters.</p>
          <button onClick={() => { setSearch(''); setDifficulty('all'); setType('all'); setPage(1); }}
            className="mt-3 text-xs text-brand-primary hover:underline font-medium">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pageItems.map((q, i) => (
            <motion.div key={q.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
              <Link href={`/questions/${q.id}`} className="block card p-5 h-full group">
                {/* Top */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                      <FileQuestion className="w-3.5 h-3.5 text-brand-primary" />
                    </div>
                    <span className={cn('badge text-[10px]', getDifficultyColor(q.difficulty))}>{q.difficulty}</span>
                  </div>
                  <span className="text-[10px] uppercase font-medium px-2 py-0.5 rounded-md bg-gray-100 dark:bg-editor-surface text-dash-muted dark:text-editor-comment">
                    {q.type === 'SYSTEM_DESIGN' ? 'System Design' : 'Coding'}
                  </span>
                </div>
                {/* Title */}
                <h3 className="text-sm font-semibold text-dash-text dark:text-editor-text mb-2 group-hover:text-brand-primary transition-colors line-clamp-2">
                  {q.title}
                </h3>
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {q.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-editor-surface text-[10px] text-dash-muted dark:text-editor-comment">
                      {tag}
                    </span>
                  ))}
                  {q.tags.length > 3 && (
                    <span className="text-[10px] text-dash-muted dark:text-editor-comment">+{q.tags.length - 3}</span>
                  )}
                </div>
                {/* Footer */}
                <div className="flex items-center justify-between text-[11px] text-dash-muted dark:text-editor-comment pt-3 border-t border-dash-border dark:border-editor-border">
                  <span>{q.testCases} test cases</span>
                  <span>Used {q.usedCount}×</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-dash-border dark:border-editor-border">
          <p className="text-xs text-dash-muted dark:text-editor-comment">
            Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-lg border border-dash-border dark:border-editor-border text-dash-muted dark:text-editor-comment hover:bg-gray-100 dark:hover:bg-editor-surface disabled:opacity-40 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = i + 1;
              return (
                <button key={p} onClick={() => setPage(p)}
                  className={cn('w-8 h-8 rounded-lg text-xs font-semibold transition-all',
                    page === p ? 'bg-brand-primary text-white' : 'border border-dash-border dark:border-editor-border text-dash-muted dark:text-editor-comment hover:bg-gray-100 dark:hover:bg-editor-surface'
                  )}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 rounded-lg border border-dash-border dark:border-editor-border text-dash-muted dark:text-editor-comment hover:bg-gray-100 dark:hover:bg-editor-surface disabled:opacity-40 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
