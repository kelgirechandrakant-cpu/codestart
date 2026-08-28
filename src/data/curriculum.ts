// Curriculum — Maps existing coding problems into a guided learning path
// Each chapter groups problems by topic in a logical order for beginners

export interface Lesson {
  id: string; // e.g. "ch1-l1"
  title: string;
  concept: string; // Brief explanation shown before the problem
  problemIds: number[]; // IDs from codingQuestions.ts
  xpReward: number;
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
  emoji: string;
  lessons: Lesson[];
  unlockAfter?: number; // chapter ID that must be completed first
}

export const curriculum: Chapter[] = [
  {
    id: 1,
    title: "Hello, Code!",
    description: "Learn what variables are and how computers store data. No prior experience needed.",
    emoji: "🐣",
    lessons: [
      {
        id: "ch1-l1",
        title: "Your First Variable",
        concept: "A variable is like a labeled box. You put a value in it (like a number), give it a name, and use it later. In C: `int x = 5;` creates a box named 'x' with the number 5 inside.",
        problemIds: [1], // C Variables - Output Prediction (Easy)
        xpReward: 10,
      },
      {
        id: "ch1-l2",
        title: "Naming Rules",
        concept: "Variable names have rules: they can't start with a number, can't have spaces, and are case-sensitive. `myAge` is different from `myage`.",
        problemIds: [2], // C Variables - Find Syntax Error (Easy)
        xpReward: 10,
      },
      {
        id: "ch1-l3",
        title: "Number Types",
        concept: "Computers store whole numbers (integers) and decimal numbers (floats) differently. `int` for whole numbers like 42, `float` for decimals like 3.14.",
        problemIds: [3], // C Variables - Fill Missing Code (Medium)
        xpReward: 15,
      },
      {
        id: "ch1-l4",
        title: "Math with Variables",
        concept: "You can do math with variables! But watch out: dividing two integers drops the decimal part. `5 / 2` gives `2`, not `2.5`.",
        problemIds: [4], // C Variables - Output Prediction (Medium)
        xpReward: 15,
      },
      {
        id: "ch1-l5",
        title: "Characters & Quotes",
        concept: "A single character (like 'A') uses single quotes. A string (like \"Hello\") uses double quotes. Mixing them up is a common beginner mistake!",
        problemIds: [5], // C Variables - Find Syntax Error (Medium)
        xpReward: 15,
      },
    ],
  },
  {
    id: 2,
    title: "Making Decisions",
    description: "Teach your code to think! Learn if/else conditions so your program can make choices.",
    emoji: "🔀",
    lessons: [
      {
        id: "ch2-l1",
        title: "Your First If Statement",
        concept: "An `if` statement checks if something is true. If yes, it runs the code inside. Think of it like: 'IF it's raining, THEN take an umbrella.'",
        problemIds: [6], // C Conditions - Output Prediction (Easy)
        xpReward: 10,
      },
      {
        id: "ch2-l2",
        title: "The Modulo Trick",
        concept: "The `%` operator gives you the remainder after division. `10 % 3 = 1` because 10 ÷ 3 = 3 remainder 1. It's the secret weapon for checking even/odd numbers!",
        problemIds: [7], // C Conditions - Fill Missing Code (Easy)
        xpReward: 10,
      },
      {
        id: "ch2-l3",
        title: "Syntax Matters",
        concept: "In C, `if` conditions MUST be wrapped in parentheses: `if (x > 5)`. Forgetting them is one of the most common errors.",
        problemIds: [8], // C Conditions - Find Syntax Error (Medium)
        xpReward: 15,
      },
      {
        id: "ch2-l4",
        title: "= vs == (The Trap!)",
        concept: "The #1 beginner trap: `=` means ASSIGN (put a value in a box), `==` means COMPARE (check if two things are equal). `if (x = 5)` is ALWAYS true!",
        problemIds: [9], // C Conditions - Output Prediction (Medium)
        xpReward: 15,
      },
      {
        id: "ch2-l5",
        title: "The Ternary Shortcut",
        concept: "The ternary operator `? :` is a one-line if/else. `max = (a > b) ? a : b` means: if a > b, max = a, otherwise max = b. Compact but powerful!",
        problemIds: [10], // C Conditions - Fill Missing Code (Medium)
        xpReward: 15,
      },
    ],
  },
  {
    id: 3,
    title: "Loops & Repetition",
    description: "Why write the same code 100 times when a loop can do it for you? Master for, while, and do-while.",
    emoji: "🔄",
    unlockAfter: 2,
    lessons: [
      {
        id: "ch3-l1",
        title: "The For Loop",
        concept: "A `for` loop repeats code a specific number of times. `for(int i=0; i<3; i++)` means: start at 0, keep going while i < 3, add 1 each time. That's 3 loops!",
        problemIds: [11], // C Loops - Output Prediction (Easy)
        xpReward: 10,
      },
      {
        id: "ch3-l2",
        title: "Infinite Loops",
        concept: "A `while(1)` loop runs forever because 1 is always 'true'. You'd use `break` to escape. Every video game uses an infinite loop: update, draw, repeat!",
        problemIds: [12], // C Loops - Fill Missing Code (Easy)
        xpReward: 10,
      },
      {
        id: "ch3-l3",
        title: "Do-While (Run First, Ask Later)",
        concept: "A `do-while` loop runs the code FIRST, then checks the condition. Unlike `while`, it always runs at least once. Don't forget the semicolon at the end!",
        problemIds: [13], // C Loops - Find Syntax Error (Medium)
        xpReward: 15,
      },
      {
        id: "ch3-l4",
        title: "Loop Counter Tricks",
        concept: "Watch your loop boundaries carefully! `i < 5` vs `i <= 5` is the difference between 5 loops and 6 loops. This is called an 'off-by-one' error.",
        problemIds: [14, 15], // C Loops - Medium problems
        xpReward: 20,
      },
    ],
  },
  {
    id: 4,
    title: "Functions",
    description: "Break your code into reusable pieces. Functions are the building blocks of every program.",
    emoji: "🧩",
    unlockAfter: 3,
    lessons: [
      {
        id: "ch4-l1",
        title: "What is a Function?",
        concept: "A function is a named recipe. You define it once, then 'call' it whenever you need it. Like a math formula: f(x) = x + 1. In code: `int add(int a, int b) { return a + b; }`",
        problemIds: [16], // C Functions (Easy)
        xpReward: 10,
      },
      {
        id: "ch4-l2",
        title: "Parameters & Return",
        concept: "Functions take inputs (parameters) and give back an output (return value). `return` sends a value back to whoever called the function.",
        problemIds: [17, 18], // C Functions (Medium)
        xpReward: 20,
      },
      {
        id: "ch4-l3",
        title: "Your First Project: Factorial",
        concept: "Time to combine everything! Write a function that calculates factorial: 5! = 5 × 4 × 3 × 2 × 1 = 120. Use a loop inside a function.",
        problemIds: [102], // Full Coding Challenge - Factorial
        xpReward: 30,
      },
    ],
  },
  {
    id: 5,
    title: "Python Basics",
    description: "Switch gears to Python — the world's most beginner-friendly language. Same concepts, cleaner syntax.",
    emoji: "🐍",
    unlockAfter: 2,
    lessons: [
      {
        id: "ch5-l1",
        title: "Python Variables",
        concept: "Python is simpler than C: no type declarations needed! Just write `x = 5` and Python figures out it's a number. No semicolons either!",
        problemIds: [21, 22], // Python Variables
        xpReward: 15,
      },
      {
        id: "ch5-l2",
        title: "Python Conditions",
        concept: "Python uses `if`, `elif` (not else if!), and `else`. No parentheses or braces needed — Python uses indentation to group code.",
        problemIds: [26, 27], // Python Conditions
        xpReward: 15,
      },
      {
        id: "ch5-l3",
        title: "Python Loops",
        concept: "Python's `for` loop is different from C: `for i in range(5)` loops through 0,1,2,3,4. And `range()` is your best friend for number sequences!",
        problemIds: [31, 32], // Python Loops
        xpReward: 15,
      },
      {
        id: "ch5-l4",
        title: "Python Functions & List Magic",
        concept: "Python functions use `def`. Lists are like arrays but more powerful: `nums = [1, 2, 3]`. Use `append()` to add, `len()` to count, and list comprehensions for magic.",
        problemIds: [36, 37], // Python Functions + Data Types
        xpReward: 20,
      },
    ],
  },
  {
    id: 6,
    title: "Data Structures",
    description: "Level up! Learn arrays, linked lists, stacks, and queues — the tools every developer needs.",
    emoji: "📦",
    unlockAfter: 4,
    lessons: [
      {
        id: "ch6-l1",
        title: "Arrays",
        concept: "An array stores multiple values in a row, accessed by index (position). `int arr[5]` creates space for 5 numbers. Index starts at 0, not 1!",
        problemIds: [41, 42], // Data Structures
        xpReward: 20,
      },
      {
        id: "ch6-l2",
        title: "Stacks & Queues",
        concept: "A stack is Last-In-First-Out (like a stack of plates). A queue is First-In-First-Out (like a line at a store). Both are built on arrays.",
        problemIds: [43, 44], // Data Structures
        xpReward: 20,
      },
      {
        id: "ch6-l3",
        title: "The Two Sum Challenge",
        concept: "Your first real algorithm challenge! Given numbers and a target, find two that add up to it. Use a hash map for O(n) speed instead of brute-force O(n²).",
        problemIds: [101], // Full Coding Challenge - Two Sum
        xpReward: 50,
      },
    ],
  },
  {
    id: 7,
    title: "Algorithms",
    description: "Think like a computer scientist. Learn sorting, searching, and problem-solving patterns.",
    emoji: "⚡",
    unlockAfter: 6,
    lessons: [
      {
        id: "ch7-l1",
        title: "Searching",
        concept: "Linear search checks every element one by one: O(n). Binary search cuts the list in half each time: O(log n). But binary search needs a sorted list!",
        problemIds: [46, 47], // Algorithms
        xpReward: 25,
      },
      {
        id: "ch7-l2",
        title: "Sorting",
        concept: "Bubble sort compares neighbors and swaps. Simple but slow: O(n²). For interviews, learn merge sort O(n log n) — divide, sort halves, merge back.",
        problemIds: [48], // Algorithms
        xpReward: 25,
      },
    ],
  },
];

// Helper to get total lessons count
export const getTotalLessons = (): number => {
  return curriculum.reduce((acc, ch) => acc + ch.lessons.length, 0);
};

// Helper to get a lesson by its ID
export const getLessonById = (lessonId: string): { chapter: Chapter; lesson: Lesson } | null => {
  for (const chapter of curriculum) {
    const lesson = chapter.lessons.find(l => l.id === lessonId);
    if (lesson) return { chapter, lesson };
  }
  return null;
};

// Helper to get next lesson
export const getNextLesson = (currentLessonId: string): { chapter: Chapter; lesson: Lesson } | null => {
  let foundCurrent = false;
  for (const chapter of curriculum) {
    for (const lesson of chapter.lessons) {
      if (foundCurrent) return { chapter, lesson };
      if (lesson.id === currentLessonId) foundCurrent = true;
    }
  }
  return null;
};

// Helper to check if a chapter is unlocked
export const isChapterUnlocked = (chapterId: number, completedLessons: string[]): boolean => {
  const chapter = curriculum.find(c => c.id === chapterId);
  if (!chapter) return false;
  if (!chapter.unlockAfter) return true;

  const prerequisite = curriculum.find(c => c.id === chapter.unlockAfter);
  if (!prerequisite) return true;

  return prerequisite.lessons.every(l => completedLessons.includes(l.id));
};
