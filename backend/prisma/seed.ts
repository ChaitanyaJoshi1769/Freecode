import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample problems
  const sampleProblems = [
    {
      title: 'Two Sum',
      slug: 'two-sum',
      description: `<h2>Problem</h2>
<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return the indices of the two numbers that add up to target.</p>
<p>You may assume that each input has exactly one solution, and you may not use the same element twice.</p>
<p>You can return the answer in any order.</p>`,
      difficulty: 'EASY' as Difficulty,
      topics: ['Array', 'Hash Table'],
      companies: ['Google', 'Amazon', 'Facebook'],
      examples: JSON.stringify([
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
        { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' }
      ]),
      constraints: '<ul><li>2 ≤ nums.length ≤ 10<sup>4</sup></li><li>-10<sup>9</sup> ≤ nums[i] ≤ 10<sup>9</sup></li><li>-10<sup>9</sup> ≤ target ≤ 10<sup>9</sup></li></ul>',
      hints: [
        'A really brute force way would be to search for all pairs that sum to the target.',
        'Try a two-pointer approach. Start with one pointer at the beginning and one at the end.',
        'Use a hash table to store values you have seen.'
      ],
      acceptanceRate: 48.5,
      isPublished: true,
      testCases: [
        { input: '[2,7,11,15]\n9', output: '[0,1]', isPublic: true },
        { input: '[3,2,4]\n6', output: '[1,2]', isPublic: true },
        { input: '[3,3]\n6', output: '[0,1]', isPublic: false }
      ]
    },
    {
      title: 'Reverse String',
      slug: 'reverse-string',
      description: `<h2>Problem</h2>
<p>Write a function that reverses a string. The input string is given as an array of characters <code>s</code>.</p>
<p>You must do this by modifying the input array <a href="https://en.wikipedia.org/wiki/In-place_algorithm" target="_blank">in-place</a> with O(1) extra memory.</p>`,
      difficulty: 'EASY' as Difficulty,
      topics: ['String', 'Two Pointers'],
      companies: ['Microsoft', 'Apple'],
      examples: JSON.stringify([
        { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
        { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' }
      ]),
      constraints: '<ul><li>1 ≤ s.length ≤ 10<sup>5</sup></li><li>s[i] is a printable ascii character.</li></ul>',
      hints: ['The entire string reverses.', 'Two pointer approach.'],
      acceptanceRate: 87.2,
      isPublished: true,
      testCases: [
        { input: '[\"h\",\"e\",\"l\",\"l\",\"o\"]', output: '[\"o\",\"l\",\"l\",\"e\",\"h\"]', isPublic: true }
      ]
    },
    {
      title: 'Median of Two Sorted Arrays',
      slug: 'median-of-two-sorted-arrays',
      description: `<h2>Problem</h2>
<p>Given two sorted arrays <code>nums1</code> and <code>nums2</code> of size <code>m</code> and <code>n</code> respectively, return the median of the two sorted arrays.</p>
<p>The overall run time complexity should be O(log (m+n)).</p>`,
      difficulty: 'HARD' as Difficulty,
      topics: ['Array', 'Binary Search', 'Divide and Conquer'],
      companies: ['Google', 'Amazon'],
      examples: JSON.stringify([
        { input: 'nums1 = [1,3], nums2 = [2]', output: '2.00000' },
        { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.50000' }
      ]),
      constraints: '<ul><li>nums1.length == m</li><li>nums2.length == n</li><li>0 ≤ m ≤ 1000</li><li>0 ≤ n ≤ 1000</li></ul>',
      hints: ['Binary search on the shorter array.'],
      acceptanceRate: 32.1,
      isPublished: true,
      testCases: [
        { input: '[1,3]\n[2]', output: '2.00000', isPublic: true }
      ]
    }
  ];

  for (const problemData of sampleProblems) {
    const { testCases: testCasesData, ...problemInput } = problemData;

    try {
      const problem = await prisma.problem.create({
        data: {
          ...problemInput,
          testCases: {
            create: testCasesData
          }
        }
      });
      console.log(`✓ Created problem: ${problem.title}`);
    } catch (error) {
      console.log(`⚠️  Problem "${problemData.title}" might already exist or has an error`);
    }
  }

  console.log('✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
