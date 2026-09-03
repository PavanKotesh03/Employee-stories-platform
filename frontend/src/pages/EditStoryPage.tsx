import { useParams, useNavigate, Link } from 'react-router-dom';
import { getStoryById, updateStory } from '../data/mockStories';
import { StoryForm, StoryFormData } from './CreateStoryPage';

export default function EditStoryPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const story = getStoryById(storyId || '');
  const currentEmployeeId = '3094';

  if (!story) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Story Not Found</h1>
        <Link to="/app/stories" className="text-[var(--primary-color)] hover:underline">
          &larr; Back to My Stories
        </Link>
      </div>
    );
  }

  // Ensure only the owner can edit, and only if DRAFT or REJECTED
  if (story.employeeId !== currentEmployeeId || (story.status !== 'DRAFT' && story.status !== 'REJECTED')) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Cannot Edit Story</h1>
        <p className="text-[var(--grey-font-color)] mb-4">This story is either currently under review, already approved, or you do not have permission to edit it.</p>
        <Link to={`/app/stories/${story.id}`} className="text-[var(--primary-color)] hover:underline">
          &larr; Back to Story
        </Link>
      </div>
    );
  }

  const handleSubmit = (data: StoryFormData, action: 'DRAFT' | 'PENDING_REVIEW') => {
    updateStory(story.id, {
      ...data,
      status: action
    });
    navigate(`/app/stories/${story.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-16">
      <Link to={`/app/stories/${story.id}`} className="inline-block mb-6 text-sm font-semibold hover:underline" style={{ color: 'var(--primary-color)' }}>
        &larr; Back to Story
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--primary-text-color)' }}>Edit Your Story</h1>
        <p className="text-[var(--grey-font-color)]">Update your journey, experiences, and learnings.</p>
      </div>
      <StoryForm initialData={story} onSubmit={handleSubmit} isEdit={true} />
    </div>
  );
}
