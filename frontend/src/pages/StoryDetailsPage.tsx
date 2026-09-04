import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storyApi, Story } from '../api/storyApi';
import { hrApi } from '../api/hrApi';
import { useAuth } from '../contexts/AuthContext';

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'approved':
      return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">Approved</span>;
    case 'rejected':
      return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">Rejected</span>;
    case 'pending':
      return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">Pending HR Review</span>;
    case 'draft':
    default:
      return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">Draft</span>;
  }
};

export default function StoryDetailsPage() {
  const { storyId } = useParams();
  const { user, role } = useAuth();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [reviewComment, setReviewComment] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);

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
  const canEdit = isOwner && (story.status === 'draft' || story.status === 'rejected');

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

  const handleReview = async (status: 'approved' | 'rejected') => {
    if (status === 'rejected' && !reviewComment.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    
    try {
      setIsReviewing(true);
      const updated = await hrApi.reviewStory(story.id, { 
        status, 
        review_comment: status === 'rejected' ? reviewComment : undefined 
      });
      setStory(updated);
      setShowRejectForm(false);
    } catch (error) {
      alert("Failed to submit review");
    } finally {
      setIsReviewing(false);
    }
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

        {story.status === 'rejected' && story.review_comment && (
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

        {story.status === 'pending' && (role === 'hr' || role === 'admin') && (
          <div className="mt-12 p-8 bg-[var(--primary-white-color)] border-2 border-[var(--primary-color)] rounded-xl shadow-sm">
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary-text-color)' }}>HR Review</h3>
            <p className="text-[var(--font-color)] mb-6">Review this story and decide whether to publish it or send it back for changes.</p>
            
            {showRejectForm ? (
              <div>
                <label className="block text-sm font-semibold mb-2">Rejection Reason</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full p-4 border border-[var(--light-grey-font-color)] rounded-md mb-4 outline-none focus:ring-2 focus:ring-[var(--primary-color)] min-h-[120px]"
                  placeholder="Explain what needs to be changed..."
                />
                <div className="flex gap-4 items-center">
                  <button 
                    onClick={() => handleReview('rejected')}
                    disabled={isReviewing}
                    className="rt-BaseButton bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-semibold disabled:opacity-50"
                  >
                    Confirm Rejection
                  </button>
                  <button 
                    onClick={() => setShowRejectForm(false)}
                    className="text-[var(--font-color)] hover:underline px-4 py-2 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => handleReview('approved')}
                  disabled={isReviewing}
                  className="rt-BaseButton bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md font-bold shadow-sm disabled:opacity-50 transition-colors"
                >
                  Approve & Publish
                </button>
                <button 
                  onClick={() => setShowRejectForm(true)}
                  className="rt-BaseButton bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 rounded-md font-bold shadow-sm transition-colors"
                >
                  Request Changes
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
