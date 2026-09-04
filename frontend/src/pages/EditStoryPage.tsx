import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { storyApi, Story } from '../api/storyApi';
import { StoryForm, StoryFormData } from './CreateStoryPage';
import { useAuth } from '../contexts/AuthContext';

export default function EditStoryPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      if (!storyId) return;
      try {
        const data = await storyApi.getStoryById(storyId);
        setStory(data);
      } catch (error) {
        console.error("Failed to fetch story", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [storyId]);

  if (loading) return <div className="p-8 text-center" style={{ color: 'var(--grey-font-color)' }}>Loading...</div>;

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
  if (story.employee_id !== user?.id || (story.status !== 'DRAFT' && story.status !== 'REJECTED')) {
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

  const handleSubmit = async (title: string, data: StoryFormData, action: 'DRAFT' | 'PENDING_REVIEW') => {
    try {
      setSubmitting(true);
      await storyApi.updateStory(story.id, { title, content: data });
      if (action === 'PENDING_REVIEW') {
        await storyApi.submitStoryForReview(story.id);
      }
      navigate(`/app/stories/${story.id}`);
    } catch (e) {
      console.error("Failed to update story:", e);
      alert("Failed to update story. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-16">
      <Link to={`/app/stories/${story.id}`} className="inline-block mb-6 text-sm font-semibold hover:underline" style={{ color: 'var(--primary-color)' }}>
        &larr; Back to Story
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--primary-text-color)' }}>Edit Story</h1>
        <p className="text-[var(--grey-font-color)]">Update your story details below.</p>
      </div>
      <StoryForm 
        initialTitle={story.title}
        initialData={story.content as StoryFormData} 
        onSubmit={handleSubmit}
        isEdit={true}
      />
    </div>
  );
}
