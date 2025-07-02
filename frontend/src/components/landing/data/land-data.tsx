import { UserPlus, UploadCloud, Search, CheckSquare } from 'lucide-react';

export const statsData = [
  { value: '1,75,324', label: 'Live Jobs' },
  { value: '97,354', label: 'Companies', featured: true },
  { value: '38,47,154', label: 'Candidates' },
  { value: '7,532', label: 'New Jobs' },
];

export const popularVacanciesData = [
  'Anesthesiologists', 'Surgeons', 'Obstetricians-Gynecologists', 'Orthodontists', 
  'Maxillofacial Surgeons', 'Software Developer', 'Psychiatrists', 'Data Scientist', 
  'Financial Manager', 'Management Analysis', 'IT Manager', 'Operations Research Analysis'
];

export const howItWorksData = [
  { icon: UserPlus, title: 'Create account' },
  { icon: UploadCloud, title: 'Upload CV/Resume' },
  { icon: Search, title: 'Find suitable job' },
  { icon: CheckSquare, title: 'Apply job' },
];

export const featuredJobsData = [
  { logo: '/logos/up-logo.jpg', title: "Senior UX Designer", location: "Australia", salary: "$90K–$130K", featured: false },
  { logo: '/logos/se-logo.jpg', title: "Software Engineer", location: "China", salary: "$60K–$90K", featured: true },
  { logo: '/logos/gd-logo.jpg', title: "Junior Graphic Designer", location: "Canada", salary: "$25K–$50K", featured: false },
  { logo: '/logos/Id-logo.jpg', title: "Interaction Designer", location: "France", salary: "$35K–$70K", featured: false },
];

export const topCompaniesData = [
  { name: "Dribbble", logo: "/logos/dribbble-logo.png", featured: true },
  { name: "Upwork", logo: "/logos/upwork-logo.png" },
  { name: "Slack", logo: "/logos/slack-logo.png", featured: true },
  { name: "Freepik", logo: "/logos/freepik-logo.png" },
];

export const testimonialsData = [
  { name: "Robert Fox", role: "UX Designer", message: "This platform helped me land my dream job within days. Super smooth and intuitive!" },
  { name: "Bessie Cooper", role: "Project Manager", message: "Posting jobs and tracking applications is effortless. Great for growing teams." },
  { name: "Jane Cooper", role: "Frontend Developer", message: "I love how clean and fast the interface is. The job matches were spot-on!" },
];

export const callToActionData = [
  {
    title: "Become a Candidate",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras cursus a dolor convallis convallis.",
    link: "/register?role=candidate",
    buttonStyle: "btn btn-outline btn-primary mt-6",
    cardStyle: "card bg-gray-100 text-center items-center p-10 rounded-lg text-gray-800",
    buttonText: "Register Now →",
  },
  {
    title: "Become a Recruiter",
    description: "Cras in massa pellentesque, mollis ligula non, luctus dui. Morbi sed efficitur dolor. Pelque augue risus.",
    link: "/register?role=recruiter",
    buttonStyle: "btn bg-white text-[#4633FF] hover:bg-gray-200 mt-6",
    cardStyle: "card text-white text-center items-center p-10 rounded-lg",
    backgroundColor: "#4633FF",
    descriptionColor: "#c5c8ff",
    buttonText: "Register Now →",
  },
];
