import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create a default organization
  const org = await prisma.organization.upsert({
    where: { slug: 'demo-org' },
    update: {},
    create: {
      name: 'Demo Organization',
      slug: 'demo-org',
      plan: 'pro',
    },
  });

  // Create a demo interviewer account
  const hashedPassword = await bcrypt.hash('password123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'interviewer@demo.com' },
    update: {},
    create: {
      email: 'interviewer@demo.com',
      name: 'Demo Interviewer',
      passwordHash: hashedPassword,
      role: 'INTERVIEWER',
      orgId: org.id,
    },
  });

  // Seed 5 sample questions
  const questions = [
    {
      title: 'Two Sum',
      slug: 'two-sum',
      description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to target.\n\n**Example 1:**\n\`\`\`\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\n\`\`\`\n\n**Constraints:**\n- 2 ≤ nums.length ≤ 10⁴\n- -10⁹ ≤ nums[i] ≤ 10⁹`,
      difficulty: 'EASY' as const,
      tags: ['arrays', 'hash-map'],
      timeLimitMs: 5000,
      memoryLimitMb: 256,
    },
    {
      title: 'Valid Parentheses',
      slug: 'valid-parentheses',
      description: `Given a string \`s\` containing just the characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\` and \`]\`, determine if the input string is valid.\n\n**Example:**\n\`\`\`\nInput: s = "()[]{}"\nOutput: true\n\`\`\``,
      difficulty: 'EASY' as const,
      tags: ['stack', 'strings'],
      timeLimitMs: 5000,
      memoryLimitMb: 256,
    },
    {
      title: 'LRU Cache',
      slug: 'lru-cache',
      description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the \`LRUCache\` class with \`get\` and \`put\` operations, both in O(1) time complexity.`,
      difficulty: 'MEDIUM' as const,
      tags: ['design', 'hash-map', 'linked-list'],
      timeLimitMs: 5000,
      memoryLimitMb: 256,
    },
    {
      title: 'Binary Tree Level Order Traversal',
      slug: 'binary-tree-level-order',
      description: `Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).`,
      difficulty: 'MEDIUM' as const,
      tags: ['trees', 'bfs', 'queue'],
      timeLimitMs: 5000,
      memoryLimitMb: 256,
    },
    {
      title: 'Merge K Sorted Lists',
      slug: 'merge-k-sorted-lists',
      description: `You are given an array of \`k\` linked-lists lists, each linked-list is sorted in ascending order.\nMerge all the linked-lists into one sorted linked-list and return it.`,
      difficulty: 'HARD' as const,
      tags: ['heap', 'linked-list', 'divide-and-conquer'],
      timeLimitMs: 5000,
      memoryLimitMb: 256,
    },
  ];

  for (const q of questions) {
    const question = await prisma.question.upsert({
      where: { slug: q.slug },
      update: {},
      create: {
        ...q,
        type: 'CODING',
        orgId: org.id,
        createdById: user.id,
        isPublic: true,
      },
    });

    // Add Python starter code for each
    await prisma.questionStarter.upsert({
      where: { questionId_language: { questionId: question.id, language: 'python' } },
      update: {},
      create: {
        questionId: question.id,
        language: 'python',
        starterCode: `def solution():\n    # Write your solution here\n    pass\n`,
      },
    });

    // Add JavaScript starter
    await prisma.questionStarter.upsert({
      where: { questionId_language: { questionId: question.id, language: 'javascript' } },
      update: {},
      create: {
        questionId: question.id,
        language: 'javascript',
        starterCode: `function solution() {\n  // Write your solution here\n}\n`,
      },
    });
  }

  console.log('✅ Seed complete');
  console.log(`   org: ${org.slug}`);
  console.log(`   user: interviewer@demo.com / password123`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
