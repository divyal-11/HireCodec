const TOPICS = [
  'arrays', 'hash-map', 'two-pointers', 'stack', 'binary-search',
  'sliding-window', 'linked-list', 'trees', 'tries', 'backtracking',
  'graphs', 'dp', 'intervals', 'greedy', 'math', 'bit-manipulation'
];

function getRandomItems(arr: string[], count: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export const PRACTICE_QUESTIONS = [
  { id: '1',  title: 'Two Sum',              difficulty: 'EASY',   tags: ['arrays', 'hash-map'],    timeEst: '15 min', solveRate: '74%', description: 'Find two numbers in an array that add up to a target.' },
  { id: '2',  title: 'Valid Parentheses',    difficulty: 'EASY',   tags: ['stack', 'string'],       timeEst: '15 min', solveRate: '68%', description: 'Determine if a string of brackets is valid.' },
  { id: '3',  title: 'Reverse Linked List',  difficulty: 'EASY',   tags: ['linked-list'],           timeEst: '20 min', solveRate: '65%', description: 'Reverse a singly linked list in-place.' },
  { id: '51', title: 'LRU Cache',            difficulty: 'MEDIUM', tags: ['design', 'hash-map'],   timeEst: '40 min', solveRate: '38%', description: 'Design a Least Recently Used (LRU) cache in O(1).' },
  { id: '54', title: 'Maximum Subarray',     difficulty: 'MEDIUM', tags: ['dp', 'arrays'],          timeEst: '25 min', solveRate: '50%', description: "Find the contiguous subarray with the largest sum using Kadane's algorithm." },
  { id: '121',title: 'Merge K Sorted Lists', difficulty: 'HARD',   tags: ['heap', 'linked-list'],  timeEst: '45 min', solveRate: '22%', description: 'Merge k sorted linked lists into one sorted list.' },
];

// Generate the remaining to reach exactly 150
for (let i = 4; i <= 150; i++) {
  // Skip the ones we hardcoded
  if ([1, 2, 3, 51, 54, 121].includes(i)) continue;

  const difficulty = Math.random() > 0.7 ? 'HARD' : Math.random() > 0.4 ? 'MEDIUM' : 'EASY';
  const solveRate = difficulty === 'HARD' ? Math.floor(Math.random() * 20 + 15) : difficulty === 'MEDIUM' ? Math.floor(Math.random() * 30 + 35) : Math.floor(Math.random() * 30 + 60);
  const timeEst = difficulty === 'HARD' ? '45 min' : difficulty === 'MEDIUM' ? '30 min' : '15 min';

  PRACTICE_QUESTIONS.push({
    id: i.toString(),
    title: `Practice Problem ${i}`,
    difficulty,
    tags: getRandomItems(TOPICS, Math.floor(Math.random() * 2) + 1),
    timeEst,
    solveRate: `${solveRate}%`,
    description: `This is a generated practice problem designed to test your skills in ${difficulty.toLowerCase()} algorithmic challenges. Optimize your solution for time and space complexity.`
  });
}
