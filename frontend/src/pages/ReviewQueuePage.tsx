import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hrApi } from '../api/hrApi';
import { Story } from '../api/storyApi';

export default function ReviewQueuePage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingStories = async () => {
      try {
        const data = await hrApi.getPendingStories();
        setStories(data);
      } catch (error) {
        console.error("Failed to fetch pending stories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingStories();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-[var(--grey-font-color)]">Loading review queue...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-[var(--primary-text-color)]">Review Queue</h1>
          <p className="text-[var(--grey-font-color)]">Stories pending HR approval.</p>
        </div>
      </div>

      {stories.length === 0 ? (
        <div className="text-center p-12 bg-[var(--primary-white-color)] rounded-xl border border-[var(--light-grey-font-color)]">
          <p className="text-[var(--grey-font-color)] text-lg">No stories pending review!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col md:flex-row p-6 rounded-xl border border-[var(--light-grey-font-color)] bg-[var(--primary-white-color)] shadow-sm justify-between items-center gap-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--primary-text-color)] mb-2">{story.title || 'Untitled Story'}</h3>
                <p className="text-sm font-medium text-[var(--primary-color)] mb-1">By: {story.author?.full_name}</p>
                <p className="text-sm text-[var(--grey-font-color)]">Submitted: {new Date(story.updated_at).toLocaleDateString()}</p>
              </div>
              <Link to={`/app/stories/${story.id}`}>
                <button className="rt-BaseButton bg-[var(--sidebar-bg-color)] text-[var(--primary-text-color)] border border-[var(--light-grey-font-color)] hover:bg-[var(--light-grey-font-color)] transition-colors px-6 py-2 rounded-md shadow-sm">
                  Review Story &rarr;
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
