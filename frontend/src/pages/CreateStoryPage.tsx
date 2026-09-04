import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { storyApi } from '../api/storyApi';


export type StoryFormData = Record<string, string>;

interface StoryFormProps {
  initialTitle?: string;
  initialData?: Partial<StoryFormData>;
  onSubmit: (title: string, data: StoryFormData, action: 'DRAFT' | 'PENDING_REVIEW') => void;
  isEdit?: boolean;
}

export const StoryForm = ({ initialTitle = '', initialData = {}, onSubmit, isEdit = false }: StoryFormProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [formData, setFormData] = useState<StoryFormData>({
    journey: initialData.journey || '',
    teamAndPeople: initialData.teamAndPeople || '',
    achievements: initialData.achievements || '',
    challenges: initialData.challenges || '',
    organizationAndCulture: initialData.organizationAndCulture || '',
    personalSide: initialData.personalSide || '',
    suggestions: initialData.suggestions || ''
  });

  const handleChange = (field: keyof StoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAction = (e: FormEvent, action: 'DRAFT' | 'PENDING_REVIEW') => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a title for your story.");
      return;
    }
    onSubmit(title, formData, action);
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


      <div className="mb-8">
        <label className="block text-[var(--primary-text-color)] font-bold mb-2">
          Story Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. My Incredible Journey at Tricon"
          className="w-full p-4 rounded-md border border-[var(--light-grey-font-color)] bg-[var(--primary-white-color)] text-[var(--font-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-shadow mb-8"
        />

        {renderField('journey', 'Career Journey', 'Describe your career journey and learning experiences...')}
        {renderField('teamAndPeople', 'Team & People', 'How has collaboration and teamwork impacted your experience?')}
        {renderField('achievements', 'Achievements', 'What are your key achievements and memorable professional experiences?')}
        {renderField('challenges', 'Challenges', 'Describe a challenge you faced and how you handled it...')}
        {renderField('organizationAndCulture', 'Organization & Culture', 'How would you describe the organization\'s culture and learning opportunities?')}
        {renderField('personalSide', 'Personal Side', 'What do you enjoy doing outside of work?')}
        {renderField('suggestions', 'Suggestions', 'Do you have any suggestions to improve the employee experience?')}
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
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (title: string, data: StoryFormData, action: 'DRAFT' | 'PENDING_REVIEW') => {
    try {
      setSubmitting(true);
      const story = await storyApi.createStory({ title, content: data, status: 'DRAFT' });
      if (action === 'PENDING_REVIEW') {
        await storyApi.submitStoryForReview(story.id);
      }
      navigate('/app/stories');
    } catch (e) {
      console.error("Failed to create story:", e);
      alert("Failed to create story. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
