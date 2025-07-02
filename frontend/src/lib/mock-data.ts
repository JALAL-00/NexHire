// src/lib/mock-data.ts
// Used these mock data for the Orbit Feed component.

export const mockFeedData = [
  {
    type: 'article',
    id: 1,
    author: {
      name: 'TechCrunch',
      avatarUrl: 'https://i.pravatar.cc/150?u=techcrunch',
      headline: 'Leading Tech News Source',
    },
    content: "The Rise of AI in Software Development: A comprehensive look at how artificial intelligence is changing the way we code, test, and deploy software. From GitHub Copilot to automated QA, the future is now.",
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-26fc76334419?q=80&w=2070&auto=format&fit=crop',
    tags: ['#AI', '#DevOps', '#FutureOfWork'],
    likes: 1200,
    commentsCount: 89,
  },
  {
    type: 'job',
    id: 2,
    title: 'Senior Frontend Engineer',
    company: 'NextGen Solutions',
    location: 'Remote',
    skills: ['React', 'Next.js', 'TypeScript'],
    description: 'We are looking for a skilled Frontend Engineer to join our dynamic team. You will be responsible for building the client-side of our web applications...',
  },
  {
    type: 'engagement',
    id: 3,
    author: {
      name: 'Jane Doe',
      avatarUrl: 'https://i.pravatar.cc/150?u=janedoe',
      headline: 'Product Manager @InnovateCorp',
    },
    content: "Thrilled to announce that I've been promoted to Senior Product Manager! It's been an incredible journey here at InnovateCorp, and I'm so grateful for the team and mentors who have supported me. Looking forward to the new challenges ahead! #Promotion #CareerMilestone",
    likes: 452,
    comments: [
      { id: 1, author: { name: 'John Smith', avatarUrl: 'https://i.pravatar.cc/150?u=johnsmith' }, text: 'Huge congratulations, Jane! Well deserved.' },
      { id: 2, author: { name: 'InnovateCorp Careers', avatarUrl: 'https://i.pravatar.cc/150?u=innovatecorp' }, text: 'Congratulations from the whole team! We are proud to have you.' },
    ],
  },
  {
    type: 'companyUpdate',
    id: 4,
    author: {
      name: 'DataVinci',
      avatarUrl: 'https://i.pravatar.cc/150?u=datavinci',
      headline: 'Official Company Page',
    },
    content: "We're hiring! DataVinci is expanding its engineering team. We have open roles for Backend Developers (NestJS, PostgreSQL) and Data Scientists. If you're passionate about data and want to make an impact, apply now!",
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2232&auto=format&fit=crop',
    tags: ['#Hiring', '#TechJobs', '#NestJS'],
    likes: 734,
    commentsCount: 45,
  }
];