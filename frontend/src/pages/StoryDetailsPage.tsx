import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storyApi, Story } from '../api/storyApi';
import { useAuth } from '../contexts/AuthContext';

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'APPROVED':
      return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">Approved</span>;
    case 'REJECTED':
      return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">Rejected</span>;
    case 'PENDING_REVIEW':
      return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">Pending HR Review</span>;
    case 'DRAFT':
    default:
      return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">Draft</span>;
  }
};

export default function StoryDetailsPage() {
  const { storyId } = useParams();
  const { user } = useAuth();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="p-8 text-center" style={{ color: 'var(--grey-font-color)' }}>Loading story...</div>;
  }

  if (!story) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary-text-color)' }}>Story Not Found</h1>
        <Link to="/app/stories" className="text-[var(--primary-color)] hover:underline">
          &larr; Back to My Stories
        </Link>
      </div>
    );
  }

  const isOwner = story.employee_id === user?.id;
  const canEdit = isOwner && (story.status === 'DRAFT' || story.status === 'REJECTED');

  const renderSection = (title: string, content?: string) => {
    if (!content) return null;
    return (
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4 border-b border-[var(--light-grey-font-color)] pb-2" style={{ color: 'var(--primary-text-color)' }}>
          {title}
        </h2>
        <p className="text-[var(--font-color)] leading-relaxed whitespace-pre-wrap text-base">
          {content}
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-16">
      <Link to="/app/stories" className="inline-block mb-6 text-sm font-semibold hover:underline" style={{ color: 'var(--primary-color)' }}>
        &larr; Back
      </Link>

      <div className="p-8 md:p-12 bg-[var(--primary-white-color)] border border-[var(--light-grey-font-color)] rounded-xl shadow-sm mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--primary-text-color)' }}>
              {story.title}
            </h1>
            <p className="text-sm text-[var(--grey-font-color)] mb-1">
              By: {story.author?.full_name || 'Anonymous'}
            </p>
          </div>
          <div className="flex flex-col items-end gap-4">
            <StatusBadge status={story.status} />
            {canEdit && (
              <Link to={`/app/stories/${story.id}/edit`}>
                <button className="rt-BaseButton bg-[var(--sidebar-bg-color)] text-[var(--primary-text-color)] border border-[var(--light-grey-font-color)] hover:bg-[var(--light-grey-font-color)] transition-colors px-6 py-2 h-auto rounded-md shadow-sm m-0">
                  Edit Story
                </button>
              </Link>
            )}
          </div>
        </div>

        {story.status === 'REJECTED' && story.review_comment && (
          <div className="mb-10 p-5 rounded-lg bg-red-50 border border-red-200 text-red-900">
            <h3 className="font-bold mb-2">HR Feedback</h3>
            <p className="text-sm">{story.review_comment}</p>
          </div>
        )}

        <div className="story-content">
          {renderSection('Career Journey', story.content?.journey)}
          {renderSection('Team & People', story.content?.teamAndPeople)}
          {renderSection('Achievements', story.content?.achievements)}
          {renderSection('Challenges', story.content?.challenges)}
          {renderSection('Organization & Culture', story.content?.organizationAndCulture)}
          {renderSection('Personal Side', story.content?.personalSide)}
          {renderSection('Suggestions', story.content?.suggestions)}
        </div>
      </div>
    </div>
  );
}
