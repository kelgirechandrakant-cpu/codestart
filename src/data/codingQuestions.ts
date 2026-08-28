import { Question } from '../types/coding';

export const codingQuestions: Question[] = [
  // Full Coding Challenges (LeetCode / Coddy Style)
  {
    id: 101,
    language: 'Python',
    difficulty: 'Easy',
    topic: 'Algorithms',
    type: 'Full Coding Challenge',
    question: 'Two Sum Problem',
    code: 'def two_sum(nums, target):\n    # Write your code here to return indices of the two numbers such that they add up to target\n    pass\n\n# Test your function\nprint(two_sum([2, 7, 11, 15], 9))',
    options: [],
    correctIndex: -1,
    explanation: 'You can use a dictionary (hash map) to store the difference `target - num` as you iterate through `nums`. If the current number exists in the hash map, return its index and the stored index.',
    hint: 'Try using a hash map where the key is the number and the value is its index in the array.',
    example: 'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].',
    testCases: [
      { input: 'two_sum([2, 7, 11, 15], 9)', expectedOutput: '[0, 1]' },
      { input: 'two_sum([3, 2, 4], 6)', expectedOutput: '[1, 2]' }
    ],
    startingCode: 'def two_sum(nums, target):\n    # Your solution here\n    memo = {}\n    for idx, num in enumerate(nums):\n        diff = target - num\n        if diff in memo:\n            return [memo[diff], idx]\n        memo[num] = idx\n    return []\n\nprint(two_sum([2, 7, 11, 15], 9))'
  },
  {
    id: 102,
    language: 'C',
    difficulty: 'Easy',
    topic: 'Loops',
    type: 'Full Coding Challenge',
    question: 'Factorial of a Number',
    code: '#include <stdio.h>\n\nint factorial(int n) {\n    // Write your logic here\n    return 1;\n}\n\nint main() {\n    printf("%d", factorial(5));\n    return 0;\n}',
    options: [],
    correctIndex: -1,
    explanation: 'Factorial of n is the product of all positive integers less than or equal to n. You can compute this iteratively with a for loop or recursively.',
    hint: 'Initialize a result variable to 1, then loop from 1 to n multiplying result by each number.',
    example: 'Input: n = 5\nOutput: 120 (since 5 * 4 * 3 * 2 * 1 = 120)',
    testCases: [
      { input: 'factorial(5)', expectedOutput: '120' },
      { input: 'factorial(3)', expectedOutput: '6' }
    ],
    startingCode: '#include <stdio.h>\n\nint factorial(int n) {\n    int res = 1;\n    for(int i = 1; i <= n; i++) {\n        res *= i;\n    }\n    return res;\n}\n\nint main() {\n    printf("%d\\n", factorial(5));\n    return 0;\n}'
  },
  // C - Variables
  { id: 1, language: 'C', difficulty: 'Easy', topic: 'Variables', type: 'Output Prediction', question: 'What is the output?', code: 'int x = 5;\nprintf("%d", x);', options: ['5', 'x', '0', 'Error'], correctIndex: 0, explanation: '%d prints the integer value.', hint: 'Look at the value assigned to x.', example: 'int y = 10; printf("%d", y); // 10' },
  { id: 2, language: 'C', difficulty: 'Easy', topic: 'Variables', type: 'Find Syntax Error', question: 'Identify the error.', code: 'int 1stNumber = 10;', options: ['Missing semicolon', 'Invalid variable name', 'Wrong type', 'No error'], correctIndex: 1, explanation: 'Variable names cannot start with a number.', hint: 'Check the variable name rules.', example: 'int firstNumber = 10;' },
  { id: 3, language: 'C', difficulty: 'Medium', topic: 'Variables', type: 'Fill Missing Code', question: 'Complete the code to print a float.', code: 'float pi = 3.14;\nprintf("___", pi);', options: ['%d', '%f', '%c', '%s'], correctIndex: 1, explanation: '%f is used for floats.', hint: 'What is the format specifier for float?', example: 'printf("%f", 2.5);' },
  { id: 4, language: 'C', difficulty: 'Medium', topic: 'Variables', type: 'Output Prediction', question: 'What is the output?', code: 'int a = 5, b = 2;\nprintf("%d", a / b);', options: ['2.5', '2', '3', 'Error'], correctIndex: 1, explanation: 'Integer division truncates the decimal part.', hint: 'Both a and b are integers.', example: '7 / 2 evaluates to 3.' },
  { id: 5, language: 'C', difficulty: 'Medium', topic: 'Variables', type: 'Find Syntax Error', question: 'Identify the error.', code: 'char c = "A";', options: ['Missing semicolon', 'Wrong quotes', 'Wrong type', 'No error'], correctIndex: 1, explanation: 'Characters must use single quotes.', hint: 'Look at the quotes around A.', example: 'char c = \'A\';' },

  // C - Conditions
  { id: 6, language: 'C', difficulty: 'Easy', topic: 'Conditions', type: 'Output Prediction', question: 'What is the output?', code: 'if (5 > 3) printf("Yes");\nelse printf("No");', options: ['Yes', 'No', 'YesNo', 'Error'], correctIndex: 0, explanation: '5 is greater than 3, so the if block executes.', hint: 'Evaluate 5 > 3.', example: 'if (1) printf("True");' },
  { id: 7, language: 'C', difficulty: 'Easy', topic: 'Conditions', type: 'Fill Missing Code', question: 'Complete the condition to check if x is even.', code: 'if (x ___ 2 == 0)', options: ['/', '%', '*', '&'], correctIndex: 1, explanation: 'The modulo operator % returns the remainder.', hint: 'Which operator gives the remainder?', example: '4 % 2 == 0' },
  { id: 8, language: 'C', difficulty: 'Medium', topic: 'Conditions', type: 'Find Syntax Error', question: 'Identify the error.', code: 'if x > 5 {\n  printf("Big");\n}', options: ['Missing parentheses', 'Missing semicolon', 'Wrong brackets', 'No error'], correctIndex: 0, explanation: 'In C, the condition must be enclosed in parentheses.', hint: 'Check the if statement syntax.', example: 'if (x > 5) { ... }' },
  { id: 9, language: 'C', difficulty: 'Medium', topic: 'Conditions', type: 'Output Prediction', question: 'What is the output?', code: 'int x = 0;\nif (x = 5) printf("A");\nelse printf("B");', options: ['A', 'B', 'AB', 'Error'], correctIndex: 0, explanation: 'x = 5 is an assignment, which evaluates to 5 (true).', hint: 'Notice the single = sign.', example: 'if (x == 5) checks equality.' },
  { id: 10, language: 'C', difficulty: 'Medium', topic: 'Conditions', type: 'Fill Missing Code', question: 'Complete the ternary operator.', code: 'int max = (a > b) ___ a : b;', options: ['?', ':', ';', '='], correctIndex: 0, explanation: 'The ternary operator syntax is condition ? true_val : false_val.', hint: 'What symbol comes after the condition?', example: 'int x = (1 > 0) ? 1 : 0;' },

  // C - Loops
  { id: 11, language: 'C', difficulty: 'Easy', topic: 'Loops', type: 'Output Prediction', question: 'How many times does this loop run?', code: 'for(int i=0; i<3; i++) {\n  printf("*");\n}', options: ['2', '3', '4', 'Infinite'], correctIndex: 1, explanation: 'i takes values 0, 1, 2.', hint: 'Count the values of i.', example: 'for(int i=0; i<5; i++) runs 5 times.' },
  { id: 12, language: 'C', difficulty: 'Easy', topic: 'Loops', type: 'Fill Missing Code', question: 'Complete the while loop to run infinitely.', code: 'while(___) {\n  // do something\n}', options: ['0', '1', 'false', 'null'], correctIndex: 1, explanation: '1 represents true in C.', hint: 'What value is always true?', example: 'while(1) { ... }' },
  { id: 13, language: 'C', difficulty: 'Medium', topic: 'Loops', type: 'Find Syntax Error', question: 'Identify the error.', code: 'do {\n  printf("Hi");\n} while (x > 0)', options: ['Missing semicolon', 'Missing parentheses', 'Wrong brackets', 'No error'], correctIndex: 0, explanation: 'A do-while loop must end with a semicolon.', hint: 'Look at the end of the while statement.', example: 'do { ... } while(condition);' },
  { id: 14, language: 'C', difficulty: 'Medium', topic: 'Loops', type: 'Output Prediction', question: 'What is the output?', code: 'for(int i=0; i<5; i++) {\n  if(i==2) break;\n  printf("%d", i);\n}', options: ['012', '01', '01234', 'Error'], correctIndex: 1, explanation: 'The loop breaks when i is 2.', hint: 'What does break do?', example: 'break exits the loop entirely.' },
  { id: 15, language: 'C', difficulty: 'Medium', topic: 'Loops', type: 'Fill Missing Code', question: 'Skip the current iteration if i is 2.', code: 'for(int i=0; i<5; i++) {\n  if(i==2) ___;\n  printf("%d", i);\n}', options: ['break', 'continue', 'return', 'exit'], correctIndex: 1, explanation: 'continue skips to the next iteration.', hint: 'Which keyword skips the rest of the loop body?', example: 'continue;' },

  // C - Functions
  { id: 16, language: 'C', difficulty: 'Easy', topic: 'Functions', type: 'Find Syntax Error', question: 'Identify the error.', code: 'void myFunc() {\n  return 5;\n}', options: ['Missing semicolon', 'Wrong return type', 'Wrong name', 'No error'], correctIndex: 1, explanation: 'A void function cannot return a value.', hint: 'Look at the return type and the return statement.', example: 'int myFunc() { return 5; }' },
  { id: 17, language: 'C', difficulty: 'Easy', topic: 'Functions', type: 'Fill Missing Code', question: 'Complete the function declaration.', code: '___ add(int a, int b) {\n  return a + b;\n}', options: ['void', 'int', 'float', 'char'], correctIndex: 1, explanation: 'The function returns an integer (a + b).', hint: 'What type is a + b?', example: 'int sum(int x, int y)' },
  { id: 18, language: 'C', difficulty: 'Medium', topic: 'Functions', type: 'Output Prediction', question: 'What is the output?', code: 'int f(int x) { return x*2; }\nint main() {\n  printf("%d", f(3));\n}', options: ['3', '6', '9', 'Error'], correctIndex: 1, explanation: 'f(3) returns 3 * 2 = 6.', hint: 'Substitute 3 into the function.', example: 'f(4) would be 8.' },
  { id: 19, language: 'C', difficulty: 'Medium', topic: 'Functions', type: 'Find Syntax Error', question: 'Identify the error.', code: 'int f(int x, y) {\n  return x + y;\n}', options: ['Missing return', 'Missing type for y', 'Wrong brackets', 'No error'], correctIndex: 1, explanation: 'Every parameter must have a type declared.', hint: 'Look at the parameter list.', example: 'int f(int x, int y)' },
  { id: 20, language: 'C', difficulty: 'Medium', topic: 'Functions', type: 'Fill Missing Code', question: 'Call the function printMsg.', code: 'void printMsg() { printf("Hi"); }\nint main() {\n  ___;\n}', options: ['printMsg', 'printMsg()', 'call printMsg()', 'printMsg(void)'], correctIndex: 1, explanation: 'Functions are called with parentheses.', hint: 'Don\'t forget the parentheses.', example: 'myFunc();' },

  // Python - Variables
  { id: 21, language: 'Python', difficulty: 'Easy', topic: 'Variables', type: 'Output Prediction', question: 'What is the output?', code: 'x = 5\nprint(x * 2)', options: ['52', '10', 'x2', 'Error'], correctIndex: 1, explanation: '5 * 2 is 10.', hint: 'It\'s simple multiplication.', example: 'print(3 * 2) # 6' },
  { id: 22, language: 'Python', difficulty: 'Easy', topic: 'Variables', type: 'Find Syntax Error', question: 'Identify the error.', code: '1st_name = "John"', options: ['Missing semicolon', 'Invalid variable name', 'Wrong quotes', 'No error'], correctIndex: 1, explanation: 'Variable names cannot start with a number.', hint: 'Check the variable name rules.', example: 'first_name = "John"' },
  { id: 23, language: 'Python', difficulty: 'Medium', topic: 'Variables', type: 'Fill Missing Code', question: 'Complete the code to get the type of x.', code: 'x = 5\nprint(___(x))', options: ['typeof', 'type', 'class', 'get_type'], correctIndex: 1, explanation: 'The type() function returns the type of an object.', hint: 'It\'s a built-in function.', example: 'type("Hello")' },
  { id: 24, language: 'Python', difficulty: 'Medium', topic: 'Variables', type: 'Output Prediction', question: 'What is the output?', code: 'a = "Hello"\nb = "World"\nprint(a + b)', options: ['Hello World', 'HelloWorld', 'Error', 'None'], correctIndex: 1, explanation: 'The + operator concatenates strings without adding a space.', hint: 'Is there a space in the strings?', example: '"A" + "B" is "AB"' },
  { id: 25, language: 'Python', difficulty: 'Medium', topic: 'Variables', type: 'Find Syntax Error', question: 'Identify the error.', code: 'x = 5\ny = "10"\nprint(x + y)', options: ['Missing semicolon', 'Type mismatch', 'Wrong quotes', 'No error'], correctIndex: 1, explanation: 'You cannot add an integer and a string directly.', hint: 'Look at the types of x and y.', example: 'print(str(x) + y)' },

  // Python - Conditions
  { id: 26, language: 'Python', difficulty: 'Easy', topic: 'Conditions', type: 'Output Prediction', question: 'What is the output?', code: 'if 5 > 3:\n  print("Yes")\nelse:\n  print("No")', options: ['Yes', 'No', 'YesNo', 'Error'], correctIndex: 0, explanation: '5 is greater than 3.', hint: 'Evaluate 5 > 3.', example: 'if True: print("A")' },
  { id: 27, language: 'Python', difficulty: 'Easy', topic: 'Conditions', type: 'Fill Missing Code', question: 'Complete the condition for "else if".', code: 'if x > 5:\n  print("A")\n___ x == 5:\n  print("B")', options: ['else if', 'elseif', 'elif', 'else'], correctIndex: 2, explanation: 'Python uses elif for "else if".', hint: 'It\'s a shortened word.', example: 'elif x < 5:' },
  { id: 28, language: 'Python', difficulty: 'Medium', topic: 'Conditions', type: 'Find Syntax Error', question: 'Identify the error.', code: 'if x > 5\n  print("Big")', options: ['Missing parentheses', 'Missing colon', 'Wrong indentation', 'No error'], correctIndex: 1, explanation: 'If statements must end with a colon.', hint: 'Look at the end of the if line.', example: 'if x > 5:' },
  { id: 29, language: 'Python', difficulty: 'Medium', topic: 'Conditions', type: 'Output Prediction', question: 'What is the output?', code: 'x = [1, 2, 3]\nif 2 in x:\n  print("Found")\nelse:\n  print("Not found")', options: ['Found', 'Not found', 'Error', 'None'], correctIndex: 0, explanation: 'The "in" operator checks if an element exists in a list.', hint: 'Is 2 inside the list?', example: 'if "a" in "cat":' },
  { id: 30, language: 'Python', difficulty: 'Medium', topic: 'Conditions', type: 'Fill Missing Code', question: 'Check if both conditions are true.', code: 'if x > 0 ___ y > 0:\n  print("Positive")', options: ['&&', 'and', '&', 'both'], correctIndex: 1, explanation: 'Python uses the "and" keyword.', hint: 'It\'s an English word.', example: 'if True and True:' },

  // Python - Loops
  { id: 31, language: 'Python', difficulty: 'Easy', topic: 'Loops', type: 'Output Prediction', question: 'How many times does this loop run?', code: 'for i in range(3):\n  print(i)', options: ['2', '3', '4', 'Infinite'], correctIndex: 1, explanation: 'range(3) generates 0, 1, 2.', hint: 'Count the numbers generated.', example: 'range(5) generates 5 numbers.' },
  { id: 32, language: 'Python', difficulty: 'Easy', topic: 'Loops', type: 'Fill Missing Code', question: 'Complete the loop to iterate over a list.', code: 'items = [1, 2]\nfor item ___ items:\n  print(item)', options: ['in', 'of', 'inside', 'on'], correctIndex: 0, explanation: 'The "in" keyword is used to iterate over iterables.', hint: 'It\'s the same keyword used to check membership.', example: 'for char in "abc":' },
  { id: 33, language: 'Python', difficulty: 'Medium', topic: 'Loops', type: 'Find Syntax Error', question: 'Identify the error.', code: 'while x > 0:\nprint(x)\nx -= 1', options: ['Missing colon', 'Wrong indentation', 'Missing parentheses', 'No error'], correctIndex: 1, explanation: 'The body of the loop must be indented.', hint: 'Look at the spaces before print.', example: 'while True:\n  print("Hi")' },
  { id: 34, language: 'Python', difficulty: 'Medium', topic: 'Loops', type: 'Output Prediction', question: 'What is the output?', code: 'for i in range(1, 4):\n  print(i, end="")', options: ['0123', '123', '1234', 'Error'], correctIndex: 1, explanation: 'range(1, 4) generates 1, 2, 3. end="" prevents newlines.', hint: 'The stop value is exclusive.', example: 'range(2, 5) gives 2, 3, 4.' },
  { id: 35, language: 'Python', difficulty: 'Medium', topic: 'Loops', type: 'Fill Missing Code', question: 'Skip the current iteration.', code: 'for i in range(5):\n  if i == 2:\n    ___\n  print(i)', options: ['break', 'continue', 'pass', 'skip'], correctIndex: 1, explanation: 'continue skips to the next iteration.', hint: 'Which keyword skips the rest of the loop body?', example: 'continue' },

  // Python - Functions
  { id: 36, language: 'Python', difficulty: 'Easy', topic: 'Functions', type: 'Find Syntax Error', question: 'Identify the error.', code: 'function greet():\n  print("Hello")', options: ['Missing parameters', 'Wrong keyword', 'Missing return', 'No error'], correctIndex: 1, explanation: 'Python uses "def" to define functions, not "function".', hint: 'How do you define a function in Python?', example: 'def greet():' },
  { id: 37, language: 'Python', difficulty: 'Easy', topic: 'Functions', type: 'Fill Missing Code', question: 'Complete the function definition.', code: '___ add(a, b):\n  return a + b', options: ['def', 'function', 'func', 'define'], correctIndex: 0, explanation: '"def" is the keyword to define a function.', hint: 'Short for define.', example: 'def my_func():' },
  { id: 38, language: 'Python', difficulty: 'Medium', topic: 'Functions', type: 'Output Prediction', question: 'What is the output?', code: 'def f(x=2):\n  return x * 3\nprint(f())', options: ['2', '3', '6', 'Error'], correctIndex: 2, explanation: 'Since no argument is passed, x takes the default value 2. 2 * 3 = 6.', hint: 'What is the default value of x?', example: 'f(4) would return 12.' },
  { id: 39, language: 'Python', difficulty: 'Medium', topic: 'Functions', type: 'Find Syntax Error', question: 'Identify the error.', code: 'def f(a, b=1, c):\n  return a + b + c', options: ['Missing colon', 'Default argument before non-default', 'Missing return type', 'No error'], correctIndex: 1, explanation: 'Non-default arguments cannot follow default arguments.', hint: 'Look at the order of parameters.', example: 'def f(a, c, b=1):' },
  { id: 40, language: 'Python', difficulty: 'Medium', topic: 'Functions', type: 'Fill Missing Code', question: 'Return multiple values.', code: 'def get_coords():\n  ___ 10, 20\nx, y = get_coords()', options: ['return', 'yield', 'give', 'output'], correctIndex: 0, explanation: 'Functions use "return" to output values. Python can return tuples.', hint: 'How do you send a value back?', example: 'return a, b' },

  // C - Hard
  { id: 61, language: 'C', difficulty: 'Hard', topic: 'Basic Syntax', type: 'Output Prediction', question: 'What is the output?', code: '#define SQR(x) (x*x)\nint main() {\n  printf("%d", SQR(2+3));\n  return 0;\n}', options: ['25', '11', '10', 'Error'], correctIndex: 1, explanation: 'Macros are text replacement. SQR(2+3) becomes (2+3*2+3) = 2+6+3 = 11.', hint: 'Macros do not evaluate arguments before substitution.', example: '#define ADD(a,b) a+b' },
  { id: 63, language: 'C', difficulty: 'Hard', topic: 'Variables', type: 'Output Prediction', question: 'What is the output?', code: 'void count() {\n  static int x = 0;\n  x++;\n  printf("%d", x);\n}\nint main() {\n  count(); count();\n}', options: ['11', '12', '22', '00'], correctIndex: 1, explanation: 'Static variables retain their value between function calls.', hint: 'What does the static keyword do?', example: 'static int count = 0;' },
  { id: 66, language: 'C', difficulty: 'Hard', topic: 'Functions', type: 'Output Prediction', question: 'What is the output?', code: 'int f(int n) {\n  if(n <= 1) return 1;\n  return n * f(n-1);\n}\nint main() {\n  printf("%d", f(4));\n}', options: ['4', '10', '24', '16'], correctIndex: 2, explanation: 'This is a recursive function calculating the factorial of 4 (4 * 3 * 2 * 1 = 24).', hint: 'Trace the recursive calls.', example: 'f(3) returns 6.' },

  // Python - Hard
  { id: 67, language: 'Python', difficulty: 'Hard', topic: 'Basic Syntax', type: 'Output Prediction', question: 'What is the output?', code: 'x = [i**2 for i in range(3)]\nprint(x)', options: ['[0, 1, 2]', '[1, 4, 9]', '[0, 1, 4]', 'Error'], correctIndex: 2, explanation: 'This is a list comprehension that squares the numbers 0, 1, and 2.', hint: 'What does i**2 do?', example: '[x for x in range(2)] -> [0, 1]' },
  { id: 69, language: 'Python', difficulty: 'Hard', topic: 'Variables', type: 'Output Prediction', question: 'What is the output?', code: 'x = 10\ndef change():\n  global x\n  x = 5\nchange()\nprint(x)', options: ['10', '5', 'Error', 'None'], correctIndex: 1, explanation: 'The global keyword allows modifying a variable defined outside the current scope.', hint: 'What does global do?', example: 'global count' },
  { id: 72, language: 'Python', difficulty: 'Hard', topic: 'Functions', type: 'Output Prediction', question: 'What is the output?', code: 'f = lambda x, y: x + y\nprint(f(2, 3))', options: ['5', '23', 'Error', 'None'], correctIndex: 0, explanation: 'Lambda functions are anonymous functions. This one adds two arguments.', hint: 'What does lambda do?', example: 'lambda x: x*2' }
];
