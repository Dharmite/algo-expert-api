const QUESTIONS_API_BASE_URL = "https://www.algoexpert.io/api/fe/questions";
const SUBMISSIONS_API_ENDPOINT = "https://www.algoexpert.io/api/fe/submissions";
interface Question {
  id: string;
  name: string;
  category: string;
}

interface Submission {
  questionId: string;
  status: string;
}

const questionsData: Array<Question> = [
  { id: "sign-up-form", name: "Sign-Up Form", category: "HTML" },
  { id: "item-cart", name: "Item Cart", category: "HTML" },
  { id: "spaghetti-recipe", name: "Spaghetti Recipe", category: "HTML" },
  { id: "blog-post", name: "Blog Post", category: "HTML" },
  { id: "rainbow-circles", name: "Rainbow Circles", category: "CSS" },
  { id: "navbar", name: "Navbar", category: "CSS" },
  { id: "pig-emoji", name: "Pig Emoji", category: "CSS" },
  { id: "purchase-form", name: "Purchase Form", category: "CSS" },
  { id: "algoexpert-products", name: "AlgoExpert Products", category: "CSS" },
  {
    id: "testing-framework",
    name: "Testing Framework",
    category: "JavaScript",
  },
  { id: "array-methods", name: "Array Methods", category: "JavaScript" },
  { id: "event-target", name: "Event Target", category: "JavaScript" },
  { id: "debounce", name: "Debounce", category: "JavaScript" },
  { id: "this-binding", name: "This Binding", category: "JavaScript" },
  { id: "promisify", name: "Promisify", category: "JavaScript" },
  { id: "throttle", name: "Throttle", category: "JavaScript" },
  { id: "curry", name: "Curry", category: "JavaScript" },
  {
    id: "infinite-scroll",
    name: "Infinite Scroll",
    category: "DOM Manipulation",
  },
  { id: "stopwatch", name: "Stopwatch", category: "DOM Manipulation" },
  { id: "tic-tac-toe", name: "Tic Tac Toe", category: "DOM Manipulation" },
  { id: "todo-list", name: "Todo List", category: "DOM Manipulation" },
  { id: "typeahead", name: "Typeahead", category: "DOM Manipulation" },
  { id: "tier-list", name: "Tier List", category: "DOM Manipulation" },
  { id: "toasts", name: "Toasts", category: "DOM Manipulation" },
  { id: "sudoku", name: "Sudoku", category: "DOM Manipulation" },
  {
    id: "questions-list",
    name: "Questions List",
    category: "DOM Manipulation",
  },
];

const submissionsData: Array<Submission> = [
  { questionId: "blog-post", status: "CORRECT" },
  { questionId: "throttle", status: "INCORRECT" },
  { questionId: "stopwatch", status: "PARTIALLY_CORRECT" },
  { questionId: "pig-emoji", status: "CORRECT" },
  { questionId: "todo-list", status: "CORRECT" },
  { questionId: "testing-framework", status: "CORRECT" },
  { questionId: "array-methods", status: "INCORRECT" },
  { questionId: "spaghetti-recipe", status: "PARTIALLY_CORRECT" },
  { questionId: "algoexpert-products", status: "PARTIALLY_CORRECT" },
  { questionId: "curry", status: "CORRECT" },
  { questionId: "toasts", status: "INCORRECT" },
  { questionId: "tic-tac-toe", status: "CORRECT" },
  { questionId: "event-target", status: "CORRECT" },
  { questionId: "debounce", status: "PARTIALLY_CORRECT" },
  { questionId: "item-cart", status: "CORRECT" },
  { questionId: "typeahead", status: "CORRECT" },
  { questionId: "tier-list", status: "PARTIALLY_CORRECT" },
  { questionId: "sudoku", status: "CORRECT" },
  { questionId: "rainbow-circles", status: "INCORRECT" },
  { questionId: "infinite-scroll", status: "CORRECT" },
  { questionId: "navbar", status: "PARTIALLY_CORRECT" },
];

const fetchQuestionsAndSubmissions = (): [Array<Question>, Array<Submission>] => {
  return [questionsData, submissionsData];
}

// Can't make api calls from browser due to CORS policy
/* const fetchQuestionsAndSubmissions = async () => {
  const [questionsResponse, submissionsResponse] = await Promise.all([
    fetch(QUESTIONS_API_BASE_URL),
    fetch(SUBMISSIONS_API_ENDPOINT)
  ]);
  console.log(questionsData, submissionsData);

  const questionsData = await questionsResponse.json();
  const submissionsData = await submissionsResponse.json();

  return [questionsData, submissionsData];
} */

const mapQuestionsData = (questionsData: Question[]): Record<string, Question[]> => {
  console.log(questionsData);
  return questionsData.reduce((acc: Record<string, Question[]>, question: Question) => {
    if (!acc[question.category]) {
      acc[question.category] = [question];
    } else {
      acc[question.category].push(question);
    }
    return acc;
  }, {});
}

const mapSubmissionsData = (submissionsData: Submission[]): Record<string, Submission[]> => {
  return submissionsData.reduce((acc: Record<string, Submission[]>, submission: Submission) => {
    if (!acc[submission.questionId]) {
      acc[submission.questionId] = [submission];
    } else {
      acc[submission.questionId].push(submission);
    }
    return acc;
  }, {});
}

const createCategory = (categoryName: string, questions: Record<string, Question[]>, submissions: Record<string, Submission[]>): HTMLElement => {
  const category = document.createElement('div');
  category.classList.add('category');
  
  const categoryTitle = document.createElement('h2');


  let correctAnswers = 0;

  questions[categoryName].forEach((question: Question) => {
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');

    const status = document.createElement('div');
    status.classList.add('status');

    const submission = submissions[question.id];

    const statusText = document.createElement('span');
    statusText.textContent = submission?.[0].status ?? "Not Attempted";
    status.appendChild(statusText);

    if(submission?.[0].status === "CORRECT") {
      correctAnswers++;
    }

    questionDiv.appendChild(status);

    const h3 = document.createElement('h3');
    h3.textContent = question.name;

    questionDiv.appendChild(h3);

    category.appendChild(questionDiv);
  });

  categoryTitle.textContent = `${categoryName} (${correctAnswers} - ${questions[categoryName].length})`;

  category.prepend(categoryTitle);

    
  return category;
}

const fetchAndAppendCategories = async () => {
  const [questionsData, submissionsData] = fetchQuestionsAndSubmissions();
  console.log(questionsData, submissionsData);
  const questions = mapQuestionsData(questionsData);
  const submissions = mapSubmissionsData(submissionsData);

  const categories = Object.keys(questions);

  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('wrapper');

  categories.forEach(category => {
    const categoryElement = createCategory(category, questions, submissions);
    wrapperDiv.appendChild(categoryElement);
  });

  document.body.appendChild(wrapperDiv);
}

fetchAndAppendCategories();

