import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storyApi, Story } from '../api/storyApi';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  const [publishedStories, setPublishedStories] = useState<Story[]>([]);
  const [myStories, setMyStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const [published, mine] = await Promise.all([
          storyApi.getPublishedStories(),
          storyApi.getMyStories()
        ]);
        setPublishedStories(published);
        setMyStories(mine);
      } catch (error) {
        console.error("Failed to fetch stories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const myActiveStory = myStories[0];

  if (loading) {
    return <div className="p-8 text-center" style={{ color: 'var(--grey-font-color)' }}>Loading dashboard...</div>;
  }

  return (
    <div className="flex flex-col gap-10 max-w-5xl mx-auto pb-12 w-full">
      {/* Welcome Section */}
      {/* <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-xl shadow-sm border border-[var(--light-grey-font-color)] bg-[var(--primary-white-color)]">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold bg-[var(--light-grey-font-color)] text-[var(--primary-text-color)] shrink-0">
            AR
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--primary-text-color)' }}>
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-lg font-medium" style={{ color: 'var(--primary-color)' }}>
              {currentUser.designation}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--grey-font-color)' }}>
              Employee ID: {currentUser.employeeId}
            </p>
          </div>
        </div>
        <div>
          <Link to="/app/stories/new">
            <button
              className="rt-BaseButton bg-[var(--primary-color)] text-[var(--primary-white-color)] hover:opacity-90 transition-opacity px-6 py-2.5 h-auto rounded-md shadow-sm border-none"
              style={{ marginLeft: 0, marginRight: 0 }}
            >
              Write a Story
            </button>
          </Link>
        </div>
      </section> */}

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--primary-text-color)' }}>Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/app/stories/new" className="block p-5 rounded-lg border border-[var(--light-grey-font-color)] bg-[var(--primary-white-color)] hover:bg-[var(--sidebar-bg-color)] transition-colors">
            <h3 className="font-semibold text-[var(--primary-text-color)] mb-2">Write a Story</h3>
            <p className="text-sm text-[var(--grey-font-color)]">Share your experience and journey.</p>
          </Link>
          <Link to="/app/stories" className="block p-5 rounded-lg border border-[var(--light-grey-font-color)] bg-[var(--primary-white-color)] hover:bg-[var(--sidebar-bg-color)] transition-colors">
            <h3 className="font-semibold text-[var(--primary-text-color)] mb-2">My Stories</h3>
            <p className="text-sm text-[var(--grey-font-color)]">View and manage your stories.</p>
          </Link>
          <Link to="/app/discover" className="block p-5 rounded-lg border border-[var(--light-grey-font-color)] bg-[var(--primary-white-color)] hover:bg-[var(--sidebar-bg-color)] transition-colors">
            <h3 className="font-semibold text-[var(--primary-text-color)] mb-2">Discover Stories</h3>
            <p className="text-sm text-[var(--grey-font-color)]">Explore stories shared by employees.</p>
          </Link>

        </div>
      </section>

      {/* My Story Section */}
      {myActiveStory && (
      <section>
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--primary-text-color)' }}>My Story</h2>
        <div className="p-6 rounded-xl border border-[var(--light-grey-font-color)] bg-[var(--primary-white-color)] shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--primary-text-color)' }}>My Career Journey at Tricon</h3>
              <p className="text-sm font-medium" style={{ color: 'var(--primary-color)' }}>{user?.name}</p>
            </div>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
              {myActiveStory.status}
            </span>
          </div>
          <p className="text-[var(--grey-font-color)] text-sm leading-relaxed mb-6 line-clamp-3">
            {myActiveStory.content?.journey || "No journey content yet."}
          </p>
          <Link to={`/app/stories/${myActiveStory.id}`}>
            <button className="text-sm font-semibold hover:underline" style={{ color: 'var(--primary-color)' }}>
              View My Story &rarr;
            </button>
          </Link>
        </div>
      </section>
      )}

      {/* Discover Stories Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ color: 'var(--primary-text-color)' }}>Discover Stories</h2>
          <Link to="/app/discover" className="text-sm font-semibold hover:underline" style={{ color: 'var(--primary-color)' }}>
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publishedStories.map((story) => (
            <div key={story.id} className="flex flex-col p-6 rounded-xl border border-[var(--light-grey-font-color)] bg-[var(--primary-white-color)] shadow-sm">
              <div className="mb-3">
                <h3 className="text-base font-bold" style={{ color: 'var(--primary-text-color)' }}>{story.author?.full_name || 'Anonymous'}</h3>
              </div>
              <p className="text-[var(--grey-font-color)] text-sm leading-relaxed mb-5 line-clamp-3 flex-1">
                "{story.content?.journey || 'No content'}"
              </p>
              <Link to={`/app/stories/${story.id}`}>
                <button className="text-sm font-semibold hover:underline" style={{ color: 'var(--primary-color)' }}>
                  View Story &rarr;
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
