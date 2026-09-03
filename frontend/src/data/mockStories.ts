export type StoryStatus = 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

export interface Story {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  status: StoryStatus;
  rejectionReason?: string;
  journey?: string;
  achievements?: string;
  peopleAndRelationships?: string;
  challenges?: string;
  organizationalCulture?: string;
  outsideWork?: string;
  suggestions?: string;
  memorableExperience?: string;
  peopleWhoInfluencedMe?: string;
  biggestChallenge?: string;
  culture?: string;
  personalInterests?: string;
  additionalSuggestion?: string;
}

let stories: Story[] = [
  {
    id: 'story-1',
    employeeId: '2887',
    employeeName: 'Veena Nayak',
    designation: 'Software Engineer',
    status: 'APPROVED',
    journey: 'I joined Tricon in April 2024, and since then, my journey has been a great learning and growth experience. I’ve had opportunities to work on different technologies, take ownership, and grow both technically and professionally. The McGraw Hill project had a big impact on my career, as taking ownership of a complete module for one big release helped me grow both technically and professionally. After joining the company, I learned the importance of taking ownership and continuously improving my skills. I also learned that teamwork and communication are equally important.',
  },
  {
    id: 'story-2',
    employeeId: '3094',
    employeeName: 'Aditya Ranjan',
    designation: 'Platform Engineer II',
    status: 'PENDING_REVIEW',
    journey: 'I joined Tricon in August 2025 as an experienced Infrastructure Engineer and was assigned to the MajorClarity project for Edmentum as an SRE. Since joining, I’ve had the opportunity to build infrastructure and processes from the ground up and take ownership of AWS, CI/CD, Terraform, monitoring, and observability. My current SRE role has had the biggest impact on my career because I joined when the team and processes were still being established. It helped me grow technically while also developing my ownership and decision-making skills. One of the biggest things I learned after joining the company is to be comfortable with ambiguity, take ownership, and build solutions from the ground up rather than always relying on an existing process.',
    achievements: 'Yes, I accomplished several things that were initially challenging. I helped optimize the existing AWS infrastructure and achieved approximately $24K per month in cost savings. I also implemented CI/CD, Terraform/Terragrunt-based provisioning, and monitoring and observability. Seeing the infrastructure evolve from the initial setup into a more stable, automated, and observable platform has been one of my most memorable professional experiences.',
    peopleAndRelationships: 'I value collaboration, knowledge sharing, and the willingness to support each other when solving challenges. Working with a team that is willing to share knowledge and support each other helps us handle challenges more effectively.',
    challenges: 'I was one of the first members of the team, so there were no established processes or clear direction, and I had to help build the infrastructure and ways of working from scratch. I started by understanding the existing environment, identifying priorities, and gradually establishing infrastructure, deployment, monitoring, and operational processes. Through this experience, I learned how to work effectively with ambiguity, prioritize problems, and take end-to-end ownership.',
    organizationalCulture: 'I find Tricon to be supportive and learning-oriented, with opportunities to work with new technologies and take on new responsibilities. The organization encourages learning through exposure to real-world projects and emerging technologies. Recently, I’ve been expanding into AI infrastructure engineering and working with technologies such as vLLM, KServe, KEDA, MLflow, LiteLLM, Kubernetes, and vector databases.',
    outsideWork: 'Outside of work, I enjoy exploring new places, trying different food, and learning about new technologies, especially around cloud, Kubernetes, and AI infrastructure.',
    suggestions: 'I feel that more cross-team knowledge-sharing sessions and opportunities to learn emerging technologies would help employees share experiences, learn from each other, and grow faster.',
    memorableExperience: 'Taking ownership was challenging for me initially, but successfully delivering the work gave me a lot of confidence. Receiving recognition for my contribution was one of my most memorable professional moments. It was rewarding to see my efforts being appreciated.',
    peopleWhoInfluencedMe: 'The people I’ve worked with have had a great influence on my professional journey. Their knowledge, support, and feedback have helped me grow. I value the collaboration and support within the team the most. Everyone is willing to share knowledge and help each other.',
    biggestChallenge: 'One of my biggest challenges was adapting to a new project and understanding a completely new domain. It took time initially, but it helped me become more adaptable and confident in handling new challenges. I approached the challenge by breaking the work into smaller tasks and working through them step by step. I also reached out to my team whenever I needed guidance. From this experience, I learned that challenges become easier when I take ownership and stay willing to learn.',
    culture: 'I would describe the organization’s culture as supportive, collaborative, and focused on growth. There are good opportunities to learn and take on new challenges. The organization provides training programs and opportunities to explore new technologies, which encourages us to continuously upskill.',
    personalInterests: 'I enjoy spending time with my family and friends and travelling outside of work.',
    additionalSuggestion: 'I feel that having more cross-team knowledge-sharing sessions would be helpful and could make the employee experience better.'
  }
];

export const getStories = () => [...stories];

export const getStoriesByEmployee = (employeeId: string) => 
  stories.filter(s => s.employeeId === employeeId);

export const getStoryById = (id: string) => 
  stories.find(s => s.id === id);

export const addStory = (story: Omit<Story, 'id'>) => {
  const newStory = { ...story, id: `story-${Date.now()}` };
  stories = [...stories, newStory];
  return newStory;
};

export const updateStory = (id: string, updates: Partial<Story>) => {
  stories = stories.map(s => s.id === id ? { ...s, ...updates } : s);
  return getStoryById(id);
};
