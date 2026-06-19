import { PrismaClient, Difficulty } from '@prisma/client';
import * as slugify from 'slugify';

const prisma = new PrismaClient();

// Sample problem templates for generating many problems
const problemTemplates = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.',
    difficulty: 'EASY' as Difficulty,
    topics: ['Array', 'Hash Table'],
    companies: ['Google', 'Amazon', 'Facebook']
  },
  {
    title: 'Reverse String',
    description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
    difficulty: 'EASY' as Difficulty,
    topics: ['String', 'Two Pointers'],
    companies: ['Microsoft', 'Apple']
  },
  {
    title: 'Maximum Subarray',
    description: 'Given an integer array nums, find the contiguous subarray within an array which has the largest sum and return its sum.',
    difficulty: 'MEDIUM' as Difficulty,
    topics: ['Array', 'Divide and Conquer', 'Dynamic Programming'],
    companies: ['Google', 'LinkedIn']
  },
  {
    title: 'Binary Tree Traversal',
    description: 'Given the root of a binary tree, return the level order traversal of its nodes values.',
    difficulty: 'MEDIUM' as Difficulty,
    topics: ['Tree', 'BFS', 'Queue'],
    companies: ['Google', 'Apple', 'Amazon']
  },
  {
    title: 'Merge K Sorted Lists',
    description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list.',
    difficulty: 'HARD' as Difficulty,
    topics: ['Linked List', 'Divide and Conquer', 'Heap'],
    companies: ['Google', 'Amazon', 'Facebook']
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    difficulty: 'MEDIUM' as Difficulty,
    topics: ['String', 'Hash Table', 'Sliding Window'],
    companies: ['Google', 'Amazon', 'Microsoft']
  },
  {
    title: 'Word Ladder',
    description: 'Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence.',
    difficulty: 'HARD' as Difficulty,
    topics: ['BFS', 'Graph', 'String'],
    companies: ['Google', 'Facebook', 'Amazon']
  },
  {
    title: 'Median of Two Sorted Arrays',
    description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
    difficulty: 'HARD' as Difficulty,
    topics: ['Array', 'Binary Search', 'Divide and Conquer'],
    companies: ['Google', 'Amazon', 'Microsoft']
  },
  {
    title: 'Palindrome Partitioning',
    description: 'Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of s.',
    difficulty: 'MEDIUM' as Difficulty,
    topics: ['String', 'Backtracking', 'Dynamic Programming'],
    companies: ['Google', 'Facebook']
  },
  {
    title: 'LRU Cache',
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
    difficulty: 'MEDIUM' as Difficulty,
    topics: ['Design', 'Hash Table', 'Linked List'],
    companies: ['Google', 'Amazon', 'Facebook', 'Microsoft']
  }
];

async function generateProblems() {
  console.log('🌱 Generating 100 sample problems...');

  const difficulties: Difficulty[] = ['EASY', 'MEDIUM', 'HARD'];
  const allTopics = ['Array', 'String', 'Hash Table', 'Linked List', 'Stack', 'Queue', 'Tree', 'Graph', 'Dynamic Programming', 'Greedy', 'Binary Search', 'Sorting', 'BFS', 'DFS', 'Two Pointers', 'Sliding Window', 'Backtracking'];
  const allCompanies = ['Google', 'Amazon', 'Microsoft', 'Facebook', 'Apple', 'LinkedIn', 'Netflix', 'Uber', 'Tesla', 'Twitter'];

  let createdCount = 0;

  for (let i = 0; i < 100; i++) {
    const template = problemTemplates[i % problemTemplates.length];
    const difficulty = difficulties[i % difficulties.length];
    const randomTopics = allTopics.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1);
    const randomCompanies = allCompanies.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 4) + 1);

    const title = `${template.title} ${i > 0 ? `(${i})` : ''}`;
    const slug = slugify(title, { lower: true, strict: true });
    const acceptanceRate = Math.random() * 60 + 20; // 20-80%
    const totalSubmissions = Math.floor(Math.random() * 10000) + 1000;

    try {
      const problem = await prisma.problem.create({
        data: {
          title,
          slug,
          description: template.description,
          difficulty,
          topics: randomTopics,
          companies: randomCompanies,
          examples: JSON.stringify([
            { input: 'Example 1', output: 'Result 1', explanation: 'This is an example' },
            { input: 'Example 2', output: 'Result 2', explanation: 'Another example' }
          ]),
          constraints: '<ul><li>Constraint 1</li><li>Constraint 2</li></ul>',
          hints: ['Hint 1', 'Hint 2', 'Hint 3'],
          acceptanceRate,
          totalSubmissions,
          isPublished: true,
          testCases: {
            create: [
              { input: 'test1', output: 'expected1', isPublic: true },
              { input: 'test2', output: 'expected2', isPublic: true },
              { input: 'test3', output: 'expected3', isPublic: false }
            ]
          }
        }
      });
      createdCount++;
      if (createdCount % 10 === 0) {
        console.log(`✓ Created ${createdCount} problems...`);
      }
    } catch (error) {
      console.log(`⚠️  Problem "${title}" already exists or has an error`);
    }
  }

  console.log(`✅ Generated ${createdCount} problems!`);
}

generateProblems()
  .catch((e) => {
    console.error('❌ Generation failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
