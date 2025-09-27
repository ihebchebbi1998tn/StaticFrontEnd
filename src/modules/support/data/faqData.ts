import type { FAQ } from '../types';

// Mock FAQ data for Customer Support module
export const faqData: FAQ[] = [
  {
    id: 1,
    question: "How do I reset my password?",
    answer: "Go to Settings > Account > Reset Password and follow the instructions.",
    tags: ['account', 'password'],
    updatedAt: '2025-01-10'
  },
  {
    id: 2,
    question: "How can I contact support?",
    answer: "You can create a new support ticket or use the chat assistant for instant help.",
    tags: ['support', 'contact'],
    updatedAt: '2025-03-05'
  },
  {
    id: 3,
    question: "Where can I view my previous tickets?",
    answer: "Navigate to the Tickets page to see all your support requests.",
    tags: ['tickets'],
    updatedAt: '2025-04-20'
  }
];
