export interface Guide {
  slug: string;
  title: string;
  type: 'Article' | 'Video';
  category: string;
  imageUrl: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  publishedDate: string;
  summary: string;
  // --- UPDATE 1: Add a field for the external link ---
  externalUrl: string; 
}

export const careerGuidesData: Guide[] = [
  {
    slug: 'mastering-the-tech-interview',
    title: 'Mastering the Tech Interview: A-Z Guide',
    type: 'Video',
    category: 'Interview Tips',
    imageUrl: 'https://images.unsplash.com/photo-1556742212-5b321f3c261b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    author: {
      name: 'Jane Doe',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
    },
    publishedDate: 'Oct 22, 2023',
    summary: 'Watch a comprehensive vlog on how to ace your next technical interview, from whiteboarding to system design questions.',
    // --- UPDATE 2: Add a real external URL ---
    externalUrl: 'https://www.youtube.com/watch?v=P6X_m6331-w', // Example: TechLead Interview Tips
  },
  {
    slug: 'craft-the-perfect-resume',
    title: 'How to Craft the Perfect ATS-Friendly Resume',
    type: 'Article',
    category: 'Resume Writing',
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    author: {
      name: 'John Smith',
      avatarUrl: 'https://i.pravatar.cc/150?img=2',
    },
    publishedDate: 'Oct 15, 2023',
    summary: 'Learn the secrets to creating a resume that not only impresses recruiters but also gets past the Applicant Tracking Systems (ATS).',
    externalUrl: 'https://www.forbes.com/sites/ashleystahl/2022/12/29/how-to-write-a-resume-thats-actually-ats-friendly/',
  },
  {
    slug: 'negotiating-your-salary',
    title: 'Salary Negotiation: Get Paid What You\'re Worth',
    type: 'Article',
    category: 'Career Growth',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1311&q=80',
    author: {
      name: 'Emily White',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
    },
    publishedDate: 'Oct 10, 2023',
    summary: 'Don\'t leave money on the table. This guide provides actionable steps and scripts for successfully negotiating your salary.',
    externalUrl: 'https://hbr.org/2018/05/10-common-salary-negotiation-mistakes',
  },
  {
    slug: 'building-your-personal-brand',
    title: 'Why Your Personal Brand Matters in 2024',
    type: 'Article',
    category: 'Networking',
    imageUrl: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80',
    author: {
      name: 'Michael Chen',
      avatarUrl: 'https://i.pravatar.cc/150?img=4',
    },
    publishedDate: 'Sep 28, 2023',
    summary: 'Discover how building a strong personal brand online can open doors to new opportunities and make you a magnet for recruiters.',
    externalUrl: 'https://www.themuse.com/advice/the-ultimate-guide-to-personal-branding',
  },
];