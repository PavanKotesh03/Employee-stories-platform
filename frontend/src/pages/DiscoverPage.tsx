import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storyApi, Story } from '../api/storyApi';

export default function DiscoverPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const published = await storyApi.getPublishedStories();
        setStories(published);
      } catch (error) {
        console.error("Failed to fetch stories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-[var(--grey-font-color)]">Loading stories...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto pb-12 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--primary-text-color)' }}>Discover Stories</h1>
        <p className="text-[var(--grey-font-color)]">Explore the journeys, achievements, and experiences of your colleagues.</p>
      </div>

      {stories.length === 0 ? (
        <div className="p-12 text-center border border-[var(--light-grey-font-color)] bg-[var(--primary-white-color)] rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--primary-text-color)' }}>No stories yet</h2>
          <p className="text-[var(--grey-font-color)]">Check back later for new employee stories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col p-6 rounded-xl border border-[var(--light-grey-font-color)] bg-[var(--primary-white-color)] shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-3">
                <h3 className="text-lg font-bold" style={{ color: 'var(--primary-text-color)' }}>{story.title || 'Untitled Story'}</h3>
                <p className="text-sm font-medium" style={{ color: 'var(--primary-color)' }}>By: {story.author?.full_name || 'Anonymous'}</p>
              </div>
              <p className="text-[var(--grey-font-color)] text-sm leading-relaxed mb-5 line-clamp-3 flex-1">
                {story.content?.journey || 'No content provided.'}
              </p>
              <Link to={`/app/stories/${story.id}`}>
                <button className="text-sm font-semibold hover:underline" style={{ color: 'var(--primary-color)' }}>
                  Read Full Story &rarr;
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
