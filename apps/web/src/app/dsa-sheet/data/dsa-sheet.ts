export type DSAQuestion = {
  title: string;
  link: {
    platform:
      | "leetcode"
      | "gfg"
      | "hackerrank"
      | "codeforces"
      | "codechef"
      | "neetcode"
      | "codestudio"
      | "interviewbit"
      | "spoj";
    url: string;
  };
  githubLink: string;
  difficulty: Difficulty;
};

export type DSATopic = {
  topic: string;
  questions: DSAQuestion[];
};

export type DSASheet = {
  id: string;
  name: string;
  description: string;
  route: string;
  credit: {
    name: string;
    profile: string;
  };
  topics: DSATopic[];
  category: "Popular" | "Quick Revision" | "Complete DSA" | "Semester-wise";
  note?: string[];
};

export type Difficulty = "Easy" | "Medium" | "Hard";

export const dsaSheets: DSASheet[] = [
  {
    id: "sde-sheet",
    name: "SDE Sheet",
    category: "Complete DSA",
    description: `The <strong>SDE Sheet</strong> is an extensive, hand-picked collection of <strong>300+</strong> coding problems curated specifically for aspiring <strong>Software Development Engineers</strong>. Covering every major DSA topic from arrays and strings to dynamic programming and system design, this sheet is a roadmap for mastering problem-solving skills essential for cracking interviews at top tech companies like <strong>Google</strong>, <strong>Amazon</strong>, <strong>Microsoft</strong>, <strong>Adobe</strong>, and <strong>Flipkart</strong>.

Whether you're starting your prep or revisiting key concepts, the <strong>SDE Sheet</strong> ensures structured learning through a progression of Easy, Medium, and Hard-level questions across all key areas.`,
    note: [
      "This sheet is perfect for long-term DSA preparation, internship/job hunt, or building strong foundations.",
      "Problems are categorized by topic and difficulty, with relevant links to platforms like LeetCode, GFG, and Codeforces.",
      "The sheet is community-driven and constantly updated to reflect current industry trends.",
    ],
    route: "/dsa-sheet/sde-sheet",
    credit: {
      name: "Harshit Jain",
      profile: "https://www.linkedin.com/in/harshit-jain-1a8583257/",
    },
    topics: [
      {
        topic: "Arrays",
        questions: [
          {
            title: "Largest Element in an Array",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/largest-element-in-array4009/0?utm_source=youtube&utm_medium=collab_striver_ytdescription&utm_campaign=largest-element-in-array",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Maximum of Absolute Value Expression",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/maximum-of-absolute-value-expression/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Leaders In an array",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/leaders-in-an-array-1587115620/1?utm_source=youtube&utm_medium=collab_striver_ytdescription&utm_campaign=leaders-in-an-array",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Linear Search",
            link: {
              platform: "hackerrank",
              url: "https://www.hackerrank.com/contests/17cs1102/challenges/1-a-linear-search",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Second Largest Element in an Array without sorting",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/second-largest3735/1?utm_source=youtube&utm_medium=collab_striver_ytdescription&utm_campaign=second-largest",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "2Sum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/two-sum/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Sort Colors",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/sort-colors/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Single Number",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/single-number/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Missing Number",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/missing-number/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Rearrange Array Elements by Sign",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/rearrange-array-elements-by-sign/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "3sum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/3sum/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Kadane's Algorithm, maximum subarray sum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/maximum-subarray/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Trapping Rain Water",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/trapping-rain-water/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Subarray Sum Equals K",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/subarray-sum-equals-k/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Find the Middle Index in Array",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/find-the-middle-index-in-array/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Maximum prefix sum for a given range",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/maximum-prefix-sum-for-a-given-range0227/1?utm_source=geeksforgeeks&utm_medium=ml_article_practice_tab&utm_campaign=article_practice_tab",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Equal Sums",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/equal-sums4801/1?utm_source=geeksforgeeks&utm_medium=ml_article_practice_tab&utm_campaign=article_practice_tab",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Running Sum of 1d Array",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/running-sum-of-1d-array/description",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Find the Highest Altitude",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/find-the-highest-altitude/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Contiguous Array",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/contiguous-array/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },

          {
            title: "Number of Sub-arrays With Odd Sum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/number-of-sub-arrays-with-odd-sum/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Product of Array Except Self",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/product-of-array-except-self/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Max Sum Subarray of size K",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/max-sum-subarray-of-size-k5313/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "First negative in every window of size k",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/first-negative-integer-in-every-window-of-size-k3345/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Longest Subarray with Sum K",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/longest-sub-array-with-sum-k0809/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Count Occurences of Anagrams",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/count-occurences-of-anagrams5839/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Longest Substring with K Uniques",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/longest-k-unique-characters-substring0853/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Sliding Window Maximum",
            link: {
              platform: "neetcode",
              url: "https://neetcode.io/problems/sliding-window-maximum",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Best Time to Buy and Sell Stock",
            link: {
              platform: "neetcode",
              url: "https://neetcode.io/problems/buy-and-sell-crypto",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Subarray Product Less Than K",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/subarray-product-less-than-k/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Longest Substring Without Repeating Characters",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Length of Longest Subarray With at Most K Frequency",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/length-of-longest-subarray-with-at-most-k-frequency/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Rotate Array",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/rotate-array/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Check if Array Is Sorted and Rotated",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Add arrays",
            link: {
              platform: "codestudio",
              url: "https://www.naukri.com/code360/problems/sum-of-two-arrays_893186?utm_source=youtube&utm_medium=affiliate&utm_campaign=love_babbar_4",
            },
            githubLink: "",
            difficulty: "Easy",
          },
        ],
      },

      {
        topic: "2D Arrays",
        questions: [
          {
            title: "Count Sorted Rows",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/count-sorted-rows2702/1?itm_source=geeksforgeeks&itm_medium=article&itm_campaign=practice_card",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Print a given matrix in spiral form",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/spirally-traversing-a-matrix-1587115621/1?itm_source=geeksforgeeks&itm_medium=article&itm_campaign=practice_card",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Set Matrix Zeroes",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/set-matrix-zeroes/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Rotate a matrix",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/rotate-image/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Print matrix in snake pattern",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/print-matrix-in-snake-pattern-1587115621/1?itm_source=geeksforgeeks&itm_medium=article&itm_campaign=practice_card",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Sorted matrix",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/sorted-matrix2333/1?itm_source=geeksforgeeks&itm_medium=article&itm_campaign=practice_card",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Matrix Boundary Traversal",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/boundary-traversal-of-matrix-1587115620/1?itm_source=geeksforgeeks&itm_medium=article&itm_campaign=practice_card",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Sum of diagonals",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/sum-of-diagonals-1587115621/1?itm_source=geeksforgeeks&itm_medium=article&itm_campaign=practice_card",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Rotate a Matrix by 180 Counterclockwise",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/c-matrix-rotation-by-180-degree0745/1?itm_source=geeksforgeeks&itm_medium=article&itm_campaign=practice_card",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Range Sum Query 2D - Immutable",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/range-sum-query-2d-immutable/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Matrix Block Sum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/matrix-block-sum/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },

      {
        topic: "Recursion",
        questions: [
          {
            title: "Recursively find sum of digits",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/recursively-find-sum-of-digits3558/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Sum of Array",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/sum-of-array2326/1?itm_source=geeksforgeeks&itm_medium=article&itm_campaign=practice_card",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "First n Fibonacci",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/print-first-n-fibonacci-numbers1002/1?itm_source=geeksforgeeks&itm_medium=article&itm_campaign=practice_card",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Generate all binary strings",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/generate-all-binary-strings/1?itm_source=geeksforgeeks&itm_medium=article&itm_campaign=practice_card",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Print N to 1 without loop",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/print-n-to-1-without-loop/1?itm_source=geeksforgeeks&itm_medium=article&itm_campaign=practice_card",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "String to Integer (atoi)",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/string-to-integer-atoi/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Pow(x, n)",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/powx-n/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Factorial",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/factorial5739/1?itm_source=geeksforgeeks&itm_medium=article&itm_campaign=practice_card",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Count Good Numbers",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/count-good-numbers/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Sort a stack using recursion",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/sort-a-stack/1?utm_source=youtube&utm_medium=collab_striver_ytdescription&utm_campaign=sort-a-stack",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },

      {
        topic: "Linked List",
        questions: [
          {
            title: "Count Linked List Nodes",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/count-nodes-of-linked-list/0?utm_source=youtube&utm_medium=collab_striver_ytdescription&utm_campaign=count-nodes-of-linked-list",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Linked List Insertion At End",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/linked-list-insertion-1587115620/0?utm_source=youtube&utm_medium=collab_striver_ytdescription&utm_campaign=linked-list-insertion",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Delete Node in a Linked List",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/delete-node-in-a-linked-list/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Search in Linked List",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/search-in-linked-list-1664434326/1?utm_source=youtube&utm_medium=collab_striver_ytdescription&utm_campaign=search-in-linked-list-1664434326",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Middle of the Linked List",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/middle-of-the-linked-list/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Reverse Linked List",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/reverse-linked-list/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Linked List Cycle",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/linked-list-cycle/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Add Two Numbers",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/add-two-numbers/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Reverse Nodes in k-Group",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/reverse-nodes-in-k-group/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Linked List Cycle II",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/linked-list-cycle-ii/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Find length of Loop",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/find-length-of-loop/1?utm_source=youtube&utm_medium=collab_striver_ytdescription&utm_campaign=find-length-of-loop",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Add 1 to a number represented by LL",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/add-1-to-a-number-represented-as-linked-list/1?utm_source=youtube&utm_medium=collab_striver_ytdescription&utm_campaign=add-1-to-a-number-represented-as-linked-list",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Rotate List",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/rotate-list/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Palindrome Linked List",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/palindrome-linked-list/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Remove Nth Node From End of List",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Copy List with Random Pointer",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/copy-list-with-random-pointer/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },

      {
        topic: "Backtracking",
        questions: [
          {
            title: "Permutations",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/permutations/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Permutations Sequence",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/permutation-sequence/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Permutations-ii",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/permutations-ii/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Letter Tile Possibilities",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/letter-tile-possibilities/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Beautiful Arrangement",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/beautiful-arrangement/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Palindromic Partition",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/palindrome-partitioning/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Unique Paths",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/unique-paths-iii/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Rat in the maze",
            link: {
              platform: "codechef",
              url: "https://www.codechef.com/problems/MM1803",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Rat Maze With Multiple Jumps",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/rat-maze-with-multiple-jumps3852/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Word Search",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/word-search/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Word Boggle",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/word-boggle4143/1",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "N Queens",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/n-queens/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "N Queens 2",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/n-queens-ii/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Soduko Solver",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/sudoku-solver/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
        ],
      },

      {
        topic: "Searching",
        questions: [
          {
            title: "Array Search",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/binary-search/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Search Insert Position",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/search-insert-position/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Find First and Last Position of Element in Sorted Array",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Number of occurrence",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/number-of-occurrence2259/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "First Bad Version",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/first-bad-version/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "The K Weakest Rows",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/the-k-weakest-rows-in-a-matrix/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Search in rotated sorted array",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/search-in-rotated-sorted-array/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Peak Element",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/find-peak-element/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Search in rotated sorted array 2",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Find Minimum in Rotated Sorted Array",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Find in Mountain Array",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/find-in-mountain-array/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Kth smallest in an Array",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/kth-largest-element-in-an-array/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Square Root",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/square-root/0",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Kth Missing positive number",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/kth-missing-positive-number/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Aggressive cows",
            link: {
              platform: "spoj",
              url: "https://www.spoj.com/problems/AGGRCOW/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Magic Powder 1",
            link: {
              platform: "codeforces",
              url: "https://codeforces.com/problemset/problem/670/D1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },

      {
        topic: "Sorting",
        questions: [
          {
            title: "Selection sort",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/selection-sort/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Bubble Sort",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/bubble-sort/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Insertion Sort",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/insertion-sort/0",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Merge Sort",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/merge-sort/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Recursive Bubble sort",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/bubble-sort/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Recursive Insertion sort",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/insertion-sort/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Quick sort",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/quick-sort/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Custom sort",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/custom-sort-string/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Sorting elements of an array by frequency",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/sorting-elements-of-an-array-by-frequency/0",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Car Fleet",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/car-fleet/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Merge Sorted Array",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/merge-sorted-array/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Squares of a sorted array",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/squares-of-a-sorted-array/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Reverse Pairs",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/reverse-pairs/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Count of Smaller numbers after self",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/reverse-pairs/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Sort 0s, 1s and 2s",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },

      {
        topic: "Two Pointer",
        questions: [
          {
            title: "Two Sum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/two-sum/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Intersection of 2 sorted arrays",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/intersection-of-two-arrays/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Remove Element in place",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/remove-element/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Remove Duplicates from sorted array",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "3Sum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/3sum/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "4Sum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/4sum/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Container with most water",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/container-with-most-water/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Subarrays with k difference integers",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/subarrays-with-k-different-integers/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Count number of nice subarrays",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/count-number-of-nice-subarrays/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },

      {
        topic: "Bit Manipulation",
        questions: [
          {
            title: "K-th Bit is Set or Not",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/check-whether-k-th-bit-is-set-or-not-1587115620/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Odd or Even",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/odd-or-even3618/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Power of two",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/power-of-two/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Count total set bits",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/count-total-set-bits-1587115620/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Set the rightmost unset bit",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/set-the-rightmost-unset-bit4436/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Swap two numbers",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/swap-two-numbers3844/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Divide two Integers",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/divide-two-integers/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Minimum Bit Flips to Convert Number",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/minimum-bit-flips-to-convert-number/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Single Number",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/single-number/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "SubSets",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/subsets/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Find XOR of numbers from L to R.",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/find-xor-of-numbers-from-l-to-r/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Two numbers with odd occurrences",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/two-numbers-with-odd-occurrences5846/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Decode XORed Permutation",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/decode-xored-permutation/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },

      {
        topic: "Hashing",
        questions: [
          {
            title: "Subarray with 0 sum",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/find-if-there-is-a-subarray-with-0-sum/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Largest Subarray with 0 sum",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/find-the-largest-subarray-with-0-sum/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Largest Subarray with k sum",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/longest-sub-array-sum-k/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Subarray Sum Equals K",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/subarray-sum-equals-k/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Subarray Sums Divisible by K",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/subarray-sums-divisible-by-k/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "4 Sum 2",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/4sum-ii/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Sonya and Queries",
            link: {
              platform: "codeforces",
              url: "https://codeforces.com/problemset/problem/713/A",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Longest Consecutive Sequence",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/longest-consecutive-sequence/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Contiguous Array",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/contiguous-array/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Max Points on a Line",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/max-points-on-a-line/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Substring with Concatenation of All Words",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/substring-with-concatenation-of-all-words/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Group Anagram",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/group-anagrams/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },

      {
        topic: "Stack & Queue",
        questions: [
          {
            title: "Implement Queue using Arrays",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/implement-queue-using-array/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Implement Stack using Queues",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/implement-stack-using-queues/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Stack using Linked List",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/implement-stack-using-linked-list/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Queue using Linked List",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/implement-queue-using-linked-list/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Valid Parentheses",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/valid-parentheses/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Min Stack",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/min-stack/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Infix to Postfix",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/infix-to-postfix-1587115620/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Prefix to Infix Conversion",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/prefix-to-infix-conversion/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Prefix to Postfix Conversion",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/prefix-to-postfix-conversion/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Postfix to Prefix Conversion",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/postfix-to-prefix-conversion/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Postfix to Infix Conversion",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/postfix-to-infix-conversion/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Next Greater Element I",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/next-greater-element-i/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Next Greater Element II",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/next-greater-element-ii/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Nearest Smaller Element",
            link: {
              platform: "interviewbit",
              url: "https://www.interviewbit.com/problems/nearest-smaller-element/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Number of greater elements to the right",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/number-of-nges-to-the-right/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Trapping Rain Water",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/trapping-rain-water/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          }, // LeetCode 42 :contentReference[oaicite:3]{index=3}
          {
            title: "Sum of Subarray Minimums",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/sum-of-subarray-minimums/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Asteroid Collision",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/asteroid-collision/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Sum of Subarray Ranges",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/sum-of-subarray-ranges/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Remove K Digits",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/remove-k-digits/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Largest Rectangle in Histogram",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/largest-rectangle-in-histogram/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Maximal Rectangle",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/maximal-rectangle/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Sliding Window Maximum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/sliding-window-maximum/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Online Stock Span",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/online-stock-span/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "LRU Cache",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/lru-cache/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "LFU Cache",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/lfu-cache/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
        ],
      },

      {
        topic: "Binary Tree",
        questions: [
          {
            title: "Introduction to Trees",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/introduction-to-trees/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Binary Tree Representation",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/binary-tree-representation/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Tree Traversals",
            link: {
              platform: "codestudio",
              url: "https://www.naukri.com/code360/problems/tree-traversal_981269",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Binary Tree Preorder Traversal",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/binary-tree-preorder-traversal/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Binary Tree Inorder Traversal",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/binary-tree-inorder-traversal/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Binary Tree Postorder Traversal",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/binary-tree-postorder-traversal/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Binary Tree Level Order Traversal",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/binary-tree-level-order-traversal/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Iterative Preorder Traversal of Binary Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/binary-tree-preorder-traversal/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Iterative Inorder Traversal of Binary Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/binary-tree-inorder-traversal/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Post-order Traversal of Binary Tree using 2 stack",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/binary-tree-postorder-traversal/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Post-order Traversal of Binary Tree using 1 stack",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/binary-tree-postorder-traversal/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title:
              "Preorder, Inorder, and Postorder Traversal in one Traversal",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/postorder-traversal-iterative/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Maximum Depth of Binary Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Check if the Binary tree is height-balanced or not",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/balanced-binary-tree/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Diameter of Binary Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/diameter-of-binary-tree/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Binary Tree Maximum Path Sum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Check if two trees are identical or not",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/same-tree/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Zig Zag Traversal of Binary Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Boundary Traversal of Binary Tree",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/boundary-traversal-of-binary-tree/1",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Vertical Order Traversal of a Binary Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Top View of Binary Tree",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/top-view-of-binary-tree/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Bottom View of Binary Tree",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/bottom-view-of-binary-tree/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Binary Tree Right Side View",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/binary-tree-right-side-view/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Symmetric Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/symmetric-tree/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Root to Leaf Paths",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/root-to-leaf-paths/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Lowest Common Ancestor of a Binary Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Maximum Width of Binary Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/maximum-width-of-binary-tree/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Children Sum in a Binary Tree",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/children-sum-parent/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "All Nodes Distance K in Binary Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Minimum time taken to BURN the Binary Tree from a Node",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/burning-tree/1",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Count Complete Tree Nodes",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/count-complete-tree-nodes/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Unique Binary Tree Requirements",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/unique-binary-tree-requirements/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Construct Binary Tree from Preorder and Inorder Traversal",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Construct Binary Tree from Inorder and Postorder Traversal",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Serialize and Deserialize Binary Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Morris Preorder Traversal of a Binary Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/binary-tree-preorder-traversal/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Morris Inorder Traversal of a Binary Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/binary-tree-inorder-traversal/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Flatten Binary Tree to Linked List",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },

      {
        topic: "Binary Search Tree (BST)",
        questions: [
          {
            title: "Binary Search Trees Intro",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/binary-search-trees/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Search in a Binary Search Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/search-in-a-binary-search-tree/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Minimum element in BST",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/minimum-element-in-bst/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Ceil in BST",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/implementing-ceil-in-bst/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Floor in BST",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/floor-in-bst/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Insert into a Binary Search Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/insert-into-a-binary-search-tree/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Delete Node in a BST",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/delete-node-in-a-bst/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Kth Smallest Element in a BST",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Validate Binary Search Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/validate-binary-search-tree/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Lowest Common Ancestor of a Binary Search Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Construct Binary Search Tree from Preorder Traversal",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Inorder Successor in BST",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/inorder-successor-in-bst/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Binary Search Tree Iterator",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/binary-search-tree-iterator/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Two Sum IV - Input is a BST",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/two-sum-iv-input-is-a-bst/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Recover Binary Search Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/recover-binary-search-tree/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Largest BST",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/largest-bst/1",
            },
            githubLink: "",
            difficulty: "Hard",
          },
        ],
      },
      {
        topic: "Heaps",
        questions: [
          {
            title: "Implementation of Priority Queue using Binary Heap",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/implementation-of-priority-queue-using-binary-heap/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Binary Heap Operations",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/operations-on-binary-min-heap/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Does array represent Heap",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/does-array-represent-heap4345/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Convert Min Heap to Max Heap",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/convert-min-heap-to-max-heap-1666385109/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Kth Largest Element in an Array",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/kth-largest-element-in-an-array/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Kth Smallest",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/kth-smallest-element5635/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Merge k Sorted Arrays",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/merge-k-sorted-arrays/1",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Merge k Sorted Lists",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/merge-k-sorted-lists/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Replace elements by its rank in the array",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/replace-elements-by-its-rank-in-the-array/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Task Scheduler",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/task-scheduler/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Hand of Straights",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/hand-of-straights/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Design Twitter",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/design-twitter/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Rod Cutting",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/rod-cutting0840/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Kth Largest Element in a Stream",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Maximum Sum Combination",
            link: {
              platform: "interviewbit",
              url: "https://www.interviewbit.com/problems/maximum-sum-combinations/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Find Median from Data Stream",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/find-median-from-data-stream/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Top K Frequent Elements",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/top-k-frequent-elements/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },
      {
        topic: "Greedy Algorithms",
        questions: [
          {
            title: "Assign Cookies",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/assign-cookies/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Fractional Knapsack",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Coin Change – Minimum Coins to Make Sum",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/find-minimum-number-of-coins-that-make-a-change/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Lemonade Change",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/lemonade-change/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Valid Parenthesis String",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/valid-parenthesis-string/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "N meetings in one room",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Jump Game",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/jump-game/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Jump Game II",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/jump-game-ii/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Minimum Platforms",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/minimum-platforms-1587115620/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Job Sequencing Problem",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Candy",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/candy/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Shortest Job first",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/shortest-job-first/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Page Faults in LRU",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/page-faults-in-lru5603/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Insert Interval",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/insert-interval/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Merge Intervals",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/merge-intervals/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Non-overlapping Intervals",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/non-overlapping-intervals/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },

      {
        topic: "Dynamic Programming (DP)",
        questions: [
          {
            title: "Introduction to DP",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/introduction-to-dp/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Climbing Stairs",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/climbing-stairs/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Frog Jump",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/geek-jump/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Minimal Cost",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/minimal-cost/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "House Robber",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/house-robber/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "House Robber II",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/house-robber-ii/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Geek's Training",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/geeks-training/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Unique Paths",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/unique-paths/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Unique Paths II",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/unique-paths-ii/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Minimum Path Sum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/minimum-path-sum/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Triangle",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/triangle/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Minimum Falling Path Sum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/minimum-falling-path-sum/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Chocolates Pickup",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/chocolates-pickup/1",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Subset Sum Problem",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/subset-sum-problem-1611555638/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Partition Equal Subset Sum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/partition-equal-subset-sum/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Partition Array Into Two Arrays to Minimize Sum Difference",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Perfect Sum Problem",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/perfect-sum-problem5633/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Partitions with Given Difference",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/partitions-with-given-difference/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Assign Cookies",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/partitions-with-given-difference/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Coin Change",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/coin-change/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Target Sum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/target-sum/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Coin Change II",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/coin-change-ii/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Knapsack with Duplicate Items",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/knapsack-with-duplicate-items4201/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Rod Cutting",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/rod-cutting0840/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Longest Common Subsequence",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/longest-common-subsequence/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Print all LCS sequences",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/print-all-lcs-sequences3413/1",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Longest Common Substring",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/longest-common-substring1452/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Longest Palindromic Subsequence",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/longest-palindromic-subsequence/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Minimum Insertion Steps to Make a String Palindrome",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Delete Operation for Two Strings",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/delete-operation-for-two-strings/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Shortest Common Supersequence",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/shortest-common-supersequence/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Distinct Subsequences",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/distinct-subsequences/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Edit Distance",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/edit-distance/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Wildcard Matching",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/wildcard-matching/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Best Time to Buy and Sell Stock",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Best Time to Buy and Sell Stock II",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Best Time to Buy and Sell Stock III",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Best Time to Buy and Sell Stock IV",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Best Time to Buy and Sell Stock with Cooldown",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Best Time to Buy and Sell Stock with Transaction Fee",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Longest Increasing Subsequence",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/longest-increasing-subsequence/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Print Longest Increasing Subsequence",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/printing-longest-increasing-subsequence/1",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Longest Increasing Subsequence",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/longest-increasing-subsequence-1587115620/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Largest Divisible Subset",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/largest-divisible-subset/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Longest String Chain",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/longest-string-chain/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Longest Bitonic subsequence",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/longest-bitonic-subsequence0824/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Number of Longest Increasing Subsequence",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/number-of-longest-increasing-subsequence/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Matrix Chain Multiplication",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Minimum Cost to Cut a Stick",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/minimum-cost-to-cut-a-stick/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Burst Balloons",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/burst-balloons/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Parsing A Boolean Expression",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/parsing-a-boolean-expression/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Palindrome Partitioning II",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/palindrome-partitioning-ii/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Partition Array for Maximum Sum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/partition-array-for-maximum-sum/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Maximal Rectangle",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/maximal-rectangle/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Count Square Submatrices with All Ones",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/count-square-submatrices-with-all-ones/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },
      {
        topic: "Basic Maths",
        questions: [
          {
            title: "Count Digits",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/count-digits5716/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Reverse a Number",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/reverse-integer/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Palindrome Number",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/palindrome-number/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "LCM And GCD",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/lcm-and-gcd4516/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Armstrong Numbers",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/armstrong-numbers2727/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Sum 1 to n Divisors",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/sum-of-all-divisors-from-1-to-n4738/1",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Check for Prime",
            link: {
              platform: "gfg",
              url: "https://www.geeksforgeeks.org/problems/minimum-number-of-jumps-1587115620/1",
            },
            githubLink: "",
            difficulty: "Easy",
          },
        ],
      },
    ],
  },

  {
    id: "neetcode-150",
    name: "NeetCode 150 – Master DSA",
    category: "Popular",
    description: `NeetCode 150 is a thoughtfully curated list of the top 150 coding interview questions, designed to help you build a strong foundation in Data Structures and Algorithms. This roadmap-based sheet covers all essential topics in a structured, progressive order — making it ideal for serious interview preparation. Trusted by thousands of developers and inspired by real-world hiring patterns at companies like <strong>Google</strong>, <strong>Amazon</strong>, <strong>Meta</strong>, and <strong>Microsoft</strong>, this sheet helps you master both concepts and patterns effectively.`,
    note: [
      "The roadmap follows a logical, topic-wise progression designed to gradually increase your understanding and confidence.",
      "All problems are carefully selected for their relevance to real-world interviews and foundational concepts.",
      "We avoid using unofficial or third-party content to ensure the highest standards of originality and legality.",
      "This sheet is integrated into our distraction-free platform to offer a seamless DSA preparation journey.",
    ],
    route: "/dsa-sheet/neetcode-150",
    credit: {
      name: "Ashish Pathania",
      profile: "https://www.linkedin.com/in/ashishpathania2005/",
    },
    topics: [
      {
        topic: "Array & Hashing",
        questions: [
          {
            title: "Contains Duplicate",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/contains-duplicate/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Valid Anagram",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/valid-anagram/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Two Sum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/two-sum/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Group Anagrams",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/group-anagrams/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Top K Frequent Elements",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/top-k-frequent-elements/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Encode and Decode Strings",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/encode-and-decode-strings/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Product of Array Except Self",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/product-of-array-except-self/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Vaild Sudoku",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/valid-sudoku/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Longest Consecutive Sequence",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/longest-consecutive-sequence/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },
      {
        topic: "Two Pointers",
        questions: [
          {
            title: "Valid Palindrome",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/valid-palindrome/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Two Sum II - Input Array Is Sorted",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "3Sum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/3sum/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Container With Most Water",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/container-with-most-water/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Trapping Rain Water",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/trapping-rain-water/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
        ],
      },
      {
        topic: "Sliding Window",
        questions: [
          {
            title: "Best Time to Buy and Sell Stock",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Longest Substring Without Repeating Characters",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Longest Repeating Character Replacement",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/longest-repeating-character-replacement/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Permutation in String",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/permutation-in-string/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Minimum Window Substring",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/minimum-window-substring/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Sliding Window Maximum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/sliding-window-maximum/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
        ],
      },
      {
        topic: "Stack",
        questions: [
          {
            title: "Valid Parentheses",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/valid-parentheses/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Min Stack",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/min-stack/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Evaluate Reverse Polish Notation",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Generate Parentheses",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/generate-parentheses/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Daily Temperatures",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/daily-temperatures/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Car Fleet",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/car-fleet/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Largest Rectangle in Histogram",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/largest-rectangle-in-histogram/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
        ],
      },
      {
        topic: "Binary Search",
        questions: [
          {
            title: "Binary Search",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/binary-search/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Search a 2D Matrix",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/search-a-2d-matrix/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Koko Eating Bananas",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/koko-eating-bananas/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Find Minimum in Rotated Sorted Array",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Search in Rotated Sorted Array",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/search-in-rotated-sorted-array/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Time Based Key-Value Store",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/time-based-key-value-store/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Median of Two Sorted Arrays",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/median-of-two-sorted-arrays/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
        ],
      },
      {
        topic: "Linked List",
        questions: [
          {
            title: "Reverse Linked List",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/reverse-linked-list/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Merge Two Sorted Lists",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/merge-two-sorted-lists/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Linked List Cycle",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/linked-list-cycle/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Reorder List",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/reorder-list/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Remove Nth Node From End of List",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Copy List with Random Pointer",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/copy-list-with-random-pointer/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },

          {
            title: "Add Two Numbers",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/add-two-numbers/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Find the Duplicate Number",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/find-the-duplicate-number/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },

          {
            title: "LRU Cache",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/lru-cache/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Merge k Sorted Lists",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/merge-k-sorted-lists/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Reverse Nodes in k-Group",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/reverse-nodes-in-k-group/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
        ],
      },
      {
        topic: "Trees",
        questions: [
          {
            title: "Invert Binary Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/invert-binary-tree/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Maximum Depth of Binary Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Diameter of Binary Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/diameter-of-binary-tree/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Balanced Binary Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/balanced-binary-tree/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Same Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/same-tree/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Subtree of Another Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/subtree-of-another-tree/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Lowest Common Ancestor of a Binary Search Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Binary Tree Level Order Traversal",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/binary-tree-level-order-traversal/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Binary Tree Right Side View",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/binary-tree-right-side-view/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Count Good Nodes in Binary Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/count-good-nodes-in-binary-tree/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Validate Binary Search Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/validate-binary-search-tree/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Kth Smallest Element in a BST",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Construct Binary Tree from Preorder and Inorder Traversal",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Binary Tree Maximum Path Sum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Serialize and Deserialize Binary Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
        ],
      },
      {
        topic: "Heap / Priority Queue",
        questions: [
          {
            title: "Kth Largest Element in an Array",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/kth-largest-element-in-an-array/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Last Stone Weight",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/last-stone-weight/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "K Closest Points to Origin",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/k-closest-points-to-origin/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Kth Largest Element in an Array",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/kth-largest-element-in-an-array/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Task Scheduler",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/task-scheduler/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Design Twitter",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/design-twitter/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Find Median from Data Stream",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/find-median-from-data-stream/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
        ],
      },
      {
        topic: "Backtracking",
        questions: [
          {
            title: "Subsets",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/subsets/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Combination Sum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/combination-sum/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Combination Sum II",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/combination-sum-ii/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Permutations",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/permutations/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Subset II",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/subsets-ii/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Word Search",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/word-search/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Palindrome Partitioning",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/palindrome-partitioning/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Letter Combinations of a Phone Number",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "N-Queens",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/n-queens/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
        ],
      },
      {
        topic: "Tries",
        questions: [
          {
            title: "Implement Trie (Prefix Tree)",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/implement-trie-prefix-tree/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Design Add and Search Word - Data structure design",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/add-and-search-word-data-structure-design/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Word Search II",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/word-search-ii/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
        ],
      },
      {
        topic: "Graphs",
        questions: [
          {
            title: "Number of Islands",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/number-of-islands/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Max Area of Island",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/max-area-of-island/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Clone Graph",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/clone-graph/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Walls and Gates",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/walls-and-gates/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Rotting Oranges",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/rotting-oranges/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Pacific Atlantic Water Flow",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/pacific-atlantic-water-flow/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Surrounded Regions",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/surrounded-regions/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Course Schedule",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/course-schedule/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Course Schedule II",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/course-schedule-ii/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Graph Valid Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/graph-valid-tree/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Number of Connected Components in an Undirected Graph",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Redundant Connection",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/redundant-connection/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Word Ladder",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/word-ladder/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
        ],
      },
      {
        topic: "Advanced Graphs",
        questions: [
          {
            title: "Network Delay Time",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/network-delay-time/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Reconstruct Itinerary",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/reconstruct-itinerary/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Min Cost to Connect All Points",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/min-cost-to-connect-all-points/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Swim in Rising Water",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/swim-in-rising-water/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Alien Dictionary",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/alien-dictionary/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Cheapest Flights Within K Stops",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
        ],
      },
      {
        topic: "1-Dynamic Programming",
        questions: [
          {
            title: "Climbing Stairs",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/climbing-stairs/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Min Cost Climbing Stairs",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/min-cost-climbing-stairs/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "House Robber",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/house-robber/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "House Robber II",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/house-robber-ii/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Longest Palindromic Substring",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/longest-palindromic-substring/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Palindromic Substrings",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/palindromic-substrings/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Decode Ways",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/decode-ways/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Coin Change",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/coin-change/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Maximum Product Subarray",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/maximum-product-subarray/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Word Break",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/word-break/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Longest Increasing Subsequence",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/longest-increasing-subsequence/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Partition Equal Subset Sum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/partition-equal-subset-sum/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },
      {
        topic: "2-Dynamic Programming",
        questions: [
          {
            title: "Unique Paths",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/unique-paths/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Longest Common Subsequence",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/longest-common-subsequence/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Best Time to Buy and Sell Stock with Cooldown",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Coin Change 2",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/coin-change-2/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Target Sum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/target-sum/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Interleaving String",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/interleaving-string/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Longest Increasing Path in a Matrix",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Distinct Subsequences",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/distinct-subsequences/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Edit Distance",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/edit-distance/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Burst Balloons",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/burst-balloons/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
          {
            title: "Regular Expression Matching",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/regular-expression-matching/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
        ],
      },
      {
        topic: "Greedy",
        questions: [
          {
            title: "Maximum Subarray",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/maximum-subarray/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Jump Game",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/jump-game/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Jump Game II",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/jump-game-ii/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Gas Station",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/gas-station/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Hand of Straights",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/hand-of-straights/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Merge Triplets to Form Target Triplet",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Partition Labels",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/partition-labels/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Valid Palindrome String",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/valid-parenthesis-string/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },
      {
        topic: "Intervals",
        questions: [
          {
            title: "Insert Interval",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/insert-interval/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Merge Intervals",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/merge-intervals/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },

          {
            title: "Non Overlapping Intervals",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/non-overlapping-intervals/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Meeting Rooms",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/meeting-rooms/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Meeting Rooms II",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/meeting-rooms-ii/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Minimum Interval to Include Each Query",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/minimum-interval-to-include-each-query/description/",
            },
            githubLink: "",
            difficulty: "Hard",
          },
        ],
      },
      {
        topic: "Math & Geometry",
        questions: [
          {
            title: "Rotate Image",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/rotate-image/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Spiral Matrix",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/spiral-matrix/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Set Matrix Zeroes",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/set-matrix-zeroes//description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Happy Number",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/happy-number/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Plus One",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/plus-one/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Pow(x, n)",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/powx-n/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Multiply Strings",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/multiply-strings/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Detect Squares",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/detect-squares/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },
      {
        topic: "Bit Manipulation",
        questions: [
          {
            title: "Single Number",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/single-number/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Number of 1 Bits",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/number-of-1-bits/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Counting Bits",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/counting-bits/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Reverse Bits",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/reverse-bits/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Missing Number",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/missing-number/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Sum of Two Integers",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/sum-of-two-integers/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Reverse Integer",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/reverse-integer/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },
    ],
  },

  {
    id: "mini-booster",
    name: "Mini Booster Sheet",
    category: "Quick Revision",
    description: `The Mini Booster Sheet is a high-impact set of 49 carefully selected coding problems designed for quick revision and interview prep. Whether you&#39;re short on time or revising at the last minute, this list ensures maximum value in minimum time. These problems cover the most essential topics and patterns that consistently appear in coding rounds of companies like <strong>Google</strong>, <strong>Amazon</strong>, <strong>Microsoft</strong>, <strong>Flipkart</strong>, and <strong>Adobe</strong>.`,
    note: [
      "This sheet is ideal for a quick brush-up before interviews or as a confidence booster after completing full-length sheets.",
      "All problems are structured for fast learning — focused on concepts, edge cases, and implementation skills.",
      "Some questions may not be available on LeetCode. If so, the LeetCode or GitHub link will show as ''.",
      "This is an original and independent resource — designed to keep things simple, effective, and legal.",
    ],
    route: "/dsa-sheet/mini-booster",
    credit: {
      name: "Ashish Bhati",
      profile: "https://www.linkedin.com/in/ashbhati26/",
    },
    topics: [
      {
        topic: "Array and Hashing",
        questions: [
          {
            title: "Contains Duplicate",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/contains-duplicate/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Valid Anagram",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/valid-anagram/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Two Sum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/two-sum/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Group Anagrams",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/group-anagrams/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Top K Frequent Elements",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/top-k-frequent-elements/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Valid Sudoku",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/valid-sudoku/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Product of Array Except Self",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/product-of-array-except-self/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Longest Consecutive Sequence",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/longest-consecutive-sequence/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },
      {
        topic: "Two Pointers",
        questions: [
          {
            title: "Valid Palindrome",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/valid-palindrome/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Two Sum II - Input Array Is Sorted",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "3Sum",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/3sum/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Container With Most Water",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/container-with-most-water/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },
      {
        topic: "Sliding Window",
        questions: [
          {
            title: "Best Time to Buy and Sell Stock",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/sliding-window/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Longest Substring Without Repeating Characters",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Longest Repeating Character Replacement",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/longest-repeating-character-replacement/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },
      {
        topic: "Stack",
        questions: [
          {
            title: "Valid Parentheses",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/valid-parentheses/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Min Stack",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/min-stack/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Daily Temperatures",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/daily-temperatures/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },
      {
        topic: "Binary Search",
        questions: [
          {
            title: "Binary Search",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/binary-search/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Find Minimum in Rotated Sorted Array",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Search in Rotated Sorted Array",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/search-in-rotated-sorted-array/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },
      {
        topic: "Linked List",
        questions: [
          {
            title: "Reverse Linked List",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/reverse-linked-list/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Merge Two Sorted Lists",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/merge-two-sorted-lists/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Reorder List",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/reorder-list/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Remove Nth Node From End of List",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Linked List Cycle",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/linked-list-cycle/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "LRU Cache",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/lru-cache/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },
      {
        topic: "Trees",
        questions: [
          {
            title: "Invert Binary Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/invert-binary-tree/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Maximum Depth of Binary Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Diameter of Binary Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/diameter-of-binary-tree/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Balanced Binary Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/balanced-binary-tree/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Same Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/same-tree/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Subtree of Another Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/subtree-of-another-tree/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Lowest Common Ancestor of a Binary Search Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Binary Tree Level Order Traversal",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/binary-tree-level-order-traversal/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Binary Tree Right Side View",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/binary-tree-right-size-view/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Count Good Nodes in Binary Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/count-good-nodes-in-binary-tree/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Validate Binary Search Tree",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/validate-binary-search-tree/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Kth Smallest Element in a BST",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },
      {
        topic: "Heap / Priority Queue",
        questions: [
          {
            title: "Kth Largest Element in a Stream",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Last Stone Weight",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/last-stone-weight/description/",
            },
            githubLink: "",
            difficulty: "Easy",
          },
          {
            title: "Kth Largest Element in an Array",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/kth-largest-element-in-an-array/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },
      {
        topic: "Graphs",
        questions: [
          {
            title: "Number of Islands",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/number-of-islands/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Max Area of Island",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/max-area-of-island/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Clone Graph",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/clone-graph/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Pacific Atlantic Water Flow",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/pacific-atlantic-water-flow/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Surrounded Regions",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/surrounded-regions/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Course Schedule",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/course-schedule/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
          {
            title: "Course Schedule II",
            link: {
              platform: "leetcode",
              url: "https://leetcode.com/problems/course-schedule-ii/description/",
            },
            githubLink: "",
            difficulty: "Medium",
          },
        ],
      },
    ],
  },
];
