import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { addStory, Story, StoryStatus } from '../data/mockStories';

export type StoryFormData = Omit<Story, 'id' | 'employeeId' | 'employeeName' | 'designation' | 'status' | 'rejectionReason'>;

interface StoryFormProps {
  initialData?: Partial<StoryFormData>;
  onSubmit: (data: StoryFormData, action: 'DRAFT' | 'PENDING_REVIEW') => void;
  isEdit?: boolean;
}

export const StoryForm = ({ initialData = {}, onSubmit, isEdit = false }: StoryFormProps) => {
  const [formData, setFormData] = useState<StoryFormData>({
    journey: initialData.journey || '',
    achievements: initialData.achievements || '',
    peopleAndRelationships: initialData.peopleAndRelationships || '',
    challenges: initialData.challenges || '',
    organizationalCulture: initialData.organizationalCulture || '',
    outsideWork: initialData.outsideWork || '',
    suggestions: initialData.suggestions || '',
    memorableExperience: initialData.memorableExperience || '',
    peopleWhoInfluencedMe: initialData.peopleWhoInfluencedMe || '',
    biggestChallenge: initialData.biggestChallenge || '',
    culture: initialData.culture || '',
    personalInterests: initialData.personalInterests || '',
    additionalSuggestion: initialData.additionalSuggestion || ''
  });

  const handleChange = (field: keyof StoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAction = (e: FormEvent, action: 'DRAFT' | 'PENDING_REVIEW') => {
    e.preventDefault();
    onSubmit(formData, action);
  };

  const renderField = (name: keyof StoryFormData, label: string, placeholder: string) => (
    <div className="mb-8">
      <label className="block text-[var(--primary-text-color)] font-bold mb-2">
        {label}
      </label>
      <textarea
        value={formData[name] || ''}
        onChange={(e) => handleChange(name, e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[120px] p-4 rounded-md border border-[var(--light-grey-font-color)] bg-[var(--primary-white-color)] text-[var(--font-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-shadow resize-y"
      />
    </div>
  );

  return (
    <form className="bg-[var(--primary-white-color)] p-8 md:p-12 rounded-xl shadow-sm border border-[var(--light-grey-font-color)]">
      <div className="mb-10 p-6 bg-[var(--sidebar-bg-color)] rounded-lg border border-[var(--light-grey-font-color)]">
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--primary-text-color)' }}>Employee Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="block text-xs font-semibold text-[var(--grey-font-color)] uppercase tracking-wider mb-1">Name</span>
            <span className="font-medium text-[var(--primary-text-color)]">Aditya Ranjan</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-[var(--grey-font-color)] uppercase tracking-wider mb-1">Designation</span>
            <span className="font-medium text-[var(--primary-text-color)]">Platform Engineer II</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-[var(--grey-font-color)] uppercase tracking-wider mb-1">Employee ID</span>
            <span className="font-medium text-[var(--primary-text-color)]">3094</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-6 border-b border-[var(--light-grey-font-color)] pb-2" style={{ color: 'var(--primary-text-color)' }}>
          Story Sections
        </h3>
        
        {renderField('journey', 'Journey', 'Describe your career journey and learning experiences...')}
        {renderField('achievements', 'Achievements', 'What are your key achievements and memorable professional experiences?')}
        {renderField('peopleAndRelationships', 'People & Relationships', 'How has collaboration and teamwork impacted your experience?')}
        {renderField('challenges', 'Challenges', 'Describe a challenge you faced and how you handled it...')}
        {renderField('organizationalCulture', 'Organizational Culture', 'How would you describe the organization\'s culture and learning opportunities?')}
        {renderField('outsideWork', 'Outside Work', 'What do you enjoy doing outside of work?')}
        {renderField('suggestions', 'Suggestions', 'Do you have any suggestions to improve the employee experience?')}
        {renderField('memorableExperience', 'Memorable Experience', 'Describe a memorable professional moment...')}
        {renderField('peopleWhoInfluencedMe', 'People Who Influenced Me', 'Who has influenced your professional journey?')}
        {renderField('biggestChallenge', 'Biggest Challenge', 'What was your biggest challenge and what did you learn from it?')}
        {renderField('culture', 'Culture', 'How do you perceive the overall company culture?')}
        {renderField('personalInterests', 'Personal Interests', 'What are your personal interests and hobbies?')}
        {renderField('additionalSuggestion', 'Additional Suggestion', 'Any other thoughts or suggestions?')}
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-10 pt-6 border-t border-[var(--light-grey-font-color)]">
        <button 
          type="button" 
          onClick={(e) => handleAction(e, 'DRAFT')}
          className="rt-BaseButton bg-[var(--sidebar-bg-color)] text-[var(--primary-text-color)] border border-[var(--light-grey-font-color)] hover:bg-[var(--light-grey-font-color)] transition-colors px-8 py-3 h-auto rounded-md shadow-sm m-0 font-semibold"
        >
          {isEdit ? 'Save Changes' : 'Save as Draft'}
        </button>
        <button 
          type="button" 
          onClick={(e) => handleAction(e, 'PENDING_REVIEW')}
          className="rt-BaseButton bg-[var(--primary-color)] text-[var(--primary-white-color)] hover:opacity-90 transition-opacity px-8 py-3 h-auto rounded-md shadow-sm border-none m-0 font-semibold"
        >
          {isEdit ? 'Resubmit for HR Review' : 'Submit for HR Review'}
        </button>
      </div>
    </form>
  );
};

export default function CreateStoryPage() {
  const navigate = useNavigate();
  const currentEmployeeId = '3094';
  const currentEmployeeName = 'Aditya Ranjan';
  const currentDesignation = 'Platform Engineer II';

  const handleSubmit = (data: StoryFormData, action: 'DRAFT' | 'PENDING_REVIEW') => {
    addStory({
      employeeId: currentEmployeeId,
      employeeName: currentEmployeeName,
      designation: currentDesignation,
      status: action,
      ...data
    });
    navigate('/app/stories');
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--primary-text-color)' }}>Write Your Story</h1>
        <p className="text-[var(--grey-font-color)]">Share your journey, experiences, and learnings with the organization.</p>
      </div>
      <StoryForm onSubmit={handleSubmit} />
    </div>
  );
}
