import { Link } from 'react-router-dom';
import { getStoriesByEmployee, StoryStatus } from '../data/mockStories';

const StatusBadge = ({ status }: { status: StoryStatus }) => {
  switch (status) {
    case 'APPROVED':
      return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">Approved</span>;
    case 'REJECTED':
      return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">Rejected</span>;
    case 'PENDING_REVIEW':
      return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">Pending HR Review</span>;
    case 'DRAFT':
    default:
      return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">Draft</span>;
  }
};

export default function MyStoriesPage() {
  const currentEmployeeId = '3094';
  const myStories = getStoriesByEmployee(currentEmployeeId);

  return (
    <div className="max-w-5xl mx-auto w-full pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--primary-text-color)' }}>My Stories</h1>
          <p className="text-[var(--grey-font-color)]">Create, manage, and share your employee journey.</p>
        </div>
        {myStories.length > 0 && (
          <Link to="/app/stories/new">
            <button className="rt-BaseButton bg-[var(--primary-color)] text-[var(--primary-white-color)] hover:opacity-90 transition-opacity px-6 py-2.5 h-auto rounded-md shadow-sm border-none m-0">
              Write a Story
            </button>
          </Link>
        )}
      </div>

      {myStories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center border border-[var(--light-grey-font-color)] bg-[var(--primary-white-color)] rounded-xl shadow-sm">
          <Link to="/app/stories/new" aria-label="Create a new story">
            <div className="w-20 h-20 rounded-full bg-[var(--primary-color)] text-[var(--primary-white-color)] flex items-center justify-center text-4xl mb-6 hover:opacity-90 transition-opacity shadow-md cursor-pointer">
              +
            </div>
          </Link>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--primary-text-color)' }}>No stories yet</h2>
          <p className="text-[var(--grey-font-color)] max-w-md mx-auto mb-8">
            Your employee journey starts here. Share your experiences, achievements, and learnings.
          </p>
          <Link to="/app/stories/new">
            <button className="rt-BaseButton bg-transparent text-[var(--primary-text-color)] border border-[var(--light-grey-font-color)] hover:bg-[var(--sidebar-bg-color)] transition-colors px-6 py-2.5 h-auto rounded-md font-semibold m-0">
              Create your first story
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {myStories.map(story => (
            <div key={story.id} className="p-6 rounded-xl border border-[var(--light-grey-font-color)] bg-[var(--primary-white-color)] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold" style={{ color: 'var(--primary-text-color)' }}>My Career Journey at Tricon</h3>
                  <StatusBadge status={story.status} />
                </div>
                <p className="text-sm font-medium mb-3" style={{ color: 'var(--primary-color)' }}>{story.employeeName} &bull; {story.designation}</p>
                <p className="text-[var(--grey-font-color)] text-sm leading-relaxed line-clamp-2">
                  {story.journey || 'No content provided yet.'}
                </p>
              </div>
              <div className="shrink-0 flex items-center">
                <Link to={`/app/stories/${story.id}`}>
                  <button className="rt-BaseButton bg-[var(--sidebar-bg-color)] text-[var(--primary-text-color)] border border-[var(--light-grey-font-color)] hover:bg-[var(--light-grey-font-color)] transition-colors px-6 py-2.5 h-auto rounded-md shadow-sm m-0">
                    View Story
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
