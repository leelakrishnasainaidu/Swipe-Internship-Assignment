// Resume parsing utilities for PDF and DOCX files

// Mock AI service for demonstration - replace with actual AI API
const mockAIService = {
  async extractResumeData(text) {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Enhanced extraction patterns
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Extract name - look for first line with proper name format or common name patterns
    let name = null;
    const namePatterns = [
      /^([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/,  // First Last or First Middle Last
      /^([A-Z][A-Z\s]+)$/,  // ALL CAPS names
      /Name:\s*([A-Z][a-z]+ [A-Z][a-z]+)/i,  // "Name: John Doe"
    ];
    
    for (const line of lines.slice(0, 5)) { // Check first 5 lines
      for (const pattern of namePatterns) {
        const match = line.match(pattern);
        if (match && match[1].length > 3 && match[1].length < 50) {
          name = match[1].trim();
          break;
        }
      }
      if (name) break;
    }
    
    // Extract email with multiple patterns
    const emailPatterns = [
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
      /Email:\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi,
      /E-mail:\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi,
    ];
    
    let email = null;
    for (const pattern of emailPatterns) {
      const match = text.match(pattern);
      if (match) {
        email = match[1] || match[0];
        break;
      }
    }
    
    // Extract phone with multiple patterns
    const phonePatterns = [
      /(\+?1?[-\.\s]?\(?[0-9]{3}\)?[-\.\s]?[0-9]{3}[-\.\s]?[0-9]{4})/g,
      /Phone:\s*(\+?1?[-\.\s]?\(?[0-9]{3}\)?[-\.\s]?[0-9]{3}[-\.\s]?[0-9]{4})/gi,
      /Mobile:\s*(\+?1?[-\.\s]?\(?[0-9]{3}\)?[-\.\s]?[0-9]{3}[-\.\s]?[0-9]{4})/gi,
      /Tel:\s*(\+?1?[-\.\s]?\(?[0-9]{3}\)?[-\.\s]?[0-9]{3}[-\.\s]?[0-9]{4})/gi,
      /(\d{3}[-\.\s]?\d{3}[-\.\s]?\d{4})/g,
    ];
    
    let phone = null;
    for (const pattern of phonePatterns) {
      const match = text.match(pattern);
      if (match) {
        phone = match[1] || match[0];
        // Clean up phone number
        phone = phone.replace(/[^\d+]/g, '').replace(/^1/, '');
        if (phone.length >= 10) {
          phone = phone.slice(0, 10);
          phone = `+1-${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
          break;
        }
      }
    }
    
    return {
      name: name || '',
      email: email || '',
      phone: phone || ''
    };
  },

  async generateInterviewQuestions() {
    // Mock questions for full-stack React/Node role
    return [
      {
        id: 1,
        difficulty: 'easy',
        question: 'What is React and what are its main advantages?',
        timeLimit: 20,
        expectedAnswer: 'React is a JavaScript library for building user interfaces...'
      },
      {
        id: 2,
        difficulty: 'easy', 
        question: 'Explain the difference between let, const, and var in JavaScript.',
        timeLimit: 20,
        expectedAnswer: 'var has function scope, let and const have block scope...'
      },
      {
        id: 3,
        difficulty: 'medium',
        question: 'How do you handle state management in a React application?',
        timeLimit: 60,
        expectedAnswer: 'State management can be handled using useState, useReducer, Context API, or external libraries like Redux...'
      },
      {
        id: 4,
        difficulty: 'medium',
        question: 'Explain how you would implement authentication in a Node.js application.',
        timeLimit: 60,
        expectedAnswer: 'Authentication can be implemented using JWT tokens, sessions, or OAuth...'
      },
      {
        id: 5,
        difficulty: 'hard',
        question: 'Design a scalable architecture for a real-time chat application using React and Node.js.',
        timeLimit: 120,
        expectedAnswer: 'A scalable chat application would use WebSockets, message queues, database optimization...'
      },
      {
        id: 6,
        difficulty: 'hard',
        question: 'How would you optimize the performance of a React application with large datasets?',
        timeLimit: 120,
        expectedAnswer: 'Performance optimization includes virtualization, memoization, code splitting, lazy loading...'
      }
    ];
  },

  async scoreAnswer(question, answer, difficulty) {
    // Mock scoring algorithm
    const answerLength = answer.trim().length;
    const hasKeywords = this.checkKeywords(question, answer);
    
    let baseScore = 0;
    if (answerLength > 50) baseScore += 3;
    if (answerLength > 100) baseScore += 2;
    if (hasKeywords) baseScore += 3;
    
    // Adjust for difficulty
    const difficultyMultiplier = {
      'easy': 1,
      'medium': 1.2,
      'hard': 1.5
    };
    
    const score = Math.min(10, Math.round(baseScore * difficultyMultiplier[difficulty]));
    return {
      score,
      feedback: this.generateFeedback(score, difficulty)
    };
  },

  checkKeywords(question, answer) {
    const questionLower = question.toLowerCase();
    const answerLower = answer.toLowerCase();
    
    const keywordMap = {
      'react': ['component', 'jsx', 'props', 'state', 'hook'],
      'javascript': ['function', 'variable', 'scope', 'closure'],
      'node': ['server', 'express', 'api', 'middleware'],
      'authentication': ['jwt', 'token', 'session', 'password'],
      'performance': ['optimization', 'cache', 'lazy', 'memo']
    };
    
    for (const [topic, keywords] of Object.entries(keywordMap)) {
      if (questionLower.includes(topic)) {
        return keywords.some(keyword => answerLower.includes(keyword));
      }
    }
    
    return false;
  },

  generateFeedback(score, difficulty) {
    if (score >= 8) return `Excellent answer for a ${difficulty} question!`;
    if (score >= 6) return `Good answer, but could be more detailed for a ${difficulty} question.`;
    if (score >= 4) return `Adequate answer, but missing key concepts for a ${difficulty} question.`;
    return `Answer needs improvement. Consider studying more about this ${difficulty} topic.`;
  },

  async generateFinalSummary(answers, scores) {
    const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
    const averageScore = (totalScore / scores.length).toFixed(1);
    
    let performance = 'Poor';
    if (averageScore >= 8) performance = 'Excellent';
    else if (averageScore >= 6) performance = 'Good';
    else if (averageScore >= 4) performance = 'Average';
    
    return {
      totalScore,
      averageScore,
      performance,
      summary: `Candidate demonstrated ${performance.toLowerCase()} knowledge of full-stack development. Average score: ${averageScore}/10. ${this.getRecommendation(averageScore)}`
    };
  },

  getRecommendation(averageScore) {
    if (averageScore >= 8) return 'Strong candidate, recommended for next round.';
    if (averageScore >= 6) return 'Good candidate with some areas for improvement.';
    if (averageScore >= 4) return 'Average candidate, may need additional training.';
    return 'Candidate needs significant improvement before being considered.';
  }
};

// File parsing functions
export const parseResume = async (file) => {
  try {
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size must be less than 10MB.');
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // According to the requirements, we should NOT extract data automatically
    // Instead, return empty fields to force manual input
    return {
      name: '',
      email: '',
      phone: '',
      resumeProcessed: true,
      fileName: file.name
    };
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw error;
  }
};

const parsePDF = async (file) => {
  try {
    // Use FileReader to read the file as text (basic extraction)
    const text = await readFileAsText(file);
    return text;
  } catch (error) {
    // Fallback to mock data with more realistic extraction
    console.log('Using fallback PDF parsing');
    return generateMockResumeText();
  }
};

const parseDOCX = async (file) => {
  try {
    // Use FileReader to read the file as text (basic extraction)
    const text = await readFileAsText(file);
    return text;
  } catch (error) {
    // Fallback to mock data
    console.log('Using fallback DOCX parsing');
    return generateMockResumeText();
  }
};

const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsText(file);
  });
};

const generateMockResumeText = () => {
  const names = ['Alex Johnson', 'Sarah Chen', 'Michael Rodriguez', 'Emily Davis', 'David Kim', 'Jessica Brown'];
  const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'company.com'];
  
  const randomName = names[Math.floor(Math.random() * names.length)];
  const firstName = randomName.split(' ')[0].toLowerCase();
  const lastName = randomName.split(' ')[1].toLowerCase();
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const email = `${firstName}.${lastName}@${domain}`;
  
  const phoneNumbers = [
    '+1-555-123-4567',
    '+1-555-987-6543',
    '+1-555-456-7890',
    '+1-555-321-9876'
  ];
  const phone = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];

  return `${randomName}
Full Stack Developer
${email}
${phone}

Professional Experience:
- Senior Developer at Tech Solutions Inc (2022-2024)
- Frontend Developer at Digital Innovations (2020-2022)
- Junior Developer at StartupXYZ (2019-2020)

Technical Skills:
- React, JavaScript, TypeScript, Node.js
- HTML5, CSS3, Tailwind CSS, Bootstrap
- MongoDB, PostgreSQL, MySQL
- Git, Docker, AWS, Azure
- REST APIs, GraphQL, Microservices

Education:
- Bachelor of Science in Computer Science
- University of Technology (2015-2019)

Projects:
- E-commerce Platform using React and Node.js
- Real-time Chat Application with Socket.io
- Task Management System with MERN Stack`;
};

export const generateQuestions = mockAIService.generateInterviewQuestions;
export const scoreAnswer = mockAIService.scoreAnswer.bind(mockAIService);
export const generateSummary = mockAIService.generateFinalSummary.bind(mockAIService);
