import { useMemo, useState } from 'react';

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const samplePosts = [
  { id: 1, title: 'Launch carousel', tags: ['social'], status: 'Draft' },
  { id: 2, title: 'Weekly recap', tags: ['blog'], status: 'Scheduled' },
  { id: 3, title: 'Influencer promo', tags: ['ads'], status: 'Pending' },
  { id: 4, title: 'Story teaser', tags: ['story'], status: 'Live' },
];

type Post = typeof samplePosts[number];

type CalendarEvent = {
  date: string;
  posts: Post[];
};

function buildCalendarMatrix(active: Date) {
  const year = active.getFullYear();
  const month = active.getMonth();
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  const matrix: Date[][] = [];
  for (let week = 0; week < 6; week += 1) {
    const row: Date[] = [];
    for (let day = 0; day < 7; day += 1) {
      row.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + week * 7 + day));
    }
    matrix.push(row);
  }
  return matrix;
}

const initialEvents: CalendarEvent[] = [
  { date: '2026-08-03', posts: [samplePosts[0]] },
  { date: '2026-08-09', posts: [samplePosts[1], samplePosts[2]] },
  { date: '2026-08-15', posts: [samplePosts[3]] },
  { date: '2026-08-18', posts: [samplePosts[2], samplePosts[0]] },
];

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function App() {
  const [activeDate, setActiveDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newStatus, setNewStatus] = useState('Draft');
  const [eventsByDate, setEventsByDate] = useState<Record<string, Post[]>>(
    Object.fromEntries(initialEvents.map((entry) => [entry.date, entry.posts]))
  );

  const calendar = useMemo(() => buildCalendarMatrix(activeDate), [activeDate]);
  const monthLabel = activeDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const selectedKey = selectedDate ? formatDateKey(selectedDate) : formatDateKey(new Date());
  const selectedPosts = selectedDate ? eventsByDate[selectedKey] ?? [] : [];

  const changeMonth = (delta: number) => {
    setActiveDate((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  };

  const openNewPostModal = () => {
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
    setShowNewPostModal(true);
  };

  const resetNewPostForm = () => {
    setNewTitle('');
    setNewTags('');
    setNewStatus('Draft');
  };

  const saveNewPost = () => {
    if (!newTitle.trim() || !selectedDate) {
      return;
    }

    const dateKey = formatDateKey(selectedDate);
    const tags = newTags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const newPost: Post = {
      id: Date.now(),
      title: newTitle.trim(),
      tags: tags.length > 0 ? tags : ['general'],
      status: newStatus as Post['status'],
    };

    setEventsByDate((current) => ({
      ...current,
      [dateKey]: [...(current[dateKey] ?? []), newPost],
    }));
    resetNewPostForm();
    setShowNewPostModal(false);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Post Scheduler</p>
          <h1>Interactive calendar for editorial planning</h1>
        </div>
        <button className="cta-button" onClick={() => setShowSidebar((state) => !state)}>
          {showSidebar ? 'Hide details' : 'Show details'}
        </button>
      </header>

      <main className="layout-grid">
        <section className="calendar-panel glass-card">
          <div className="calendar-header">
            <button onClick={() => changeMonth(-1)} aria-label="Previous month">←</button>
            <h2>{monthLabel}</h2>
            <button onClick={() => changeMonth(1)} aria-label="Next month">→</button>
          </div>

          <div className="weekday-row">
            {weekdayLabels.map((day) => (
              <div key={day} className="weekday-cell">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-grid">
            {calendar.flat().map((day) => {
              const key = formatDateKey(day);
              const dayPosts = eventsByDate[key] ?? [];
              const isToday = formatDateKey(day) === formatDateKey(new Date());
              const isCurrentMonth = day.getMonth() === activeDate.getMonth();
              const isSelected = selectedDate && formatDateKey(day) === formatDateKey(selectedDate);

              return (
                <button
                  key={key}
                  className={`calendar-cell ${isCurrentMonth ? '' : 'muted'} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(day)}
                >
                  <span className="date-number">{day.getDate()}</span>
                  {dayPosts.length > 0 && (
                    <div className="event-pill">
                      <span>{dayPosts.length}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="legend-card">
            <div className="legend-item">
              <span className="legend-dot accent"></span> Scheduled posts
            </div>
            <div className="legend-item">
              <span className="legend-dot neutral"></span> No post
            </div>
          </div>
        </section>

        {showSidebar && (
          <aside className="details-panel glass-card">
            <div className="detail-header">
              <div>
                <p className="eyebrow">Details</p>
                <h3>{selectedDate ? selectedDate.toDateString() : 'Select a date'}</h3>
              </div>
            </div>

            <div className="post-list">
              {selectedPosts.length === 0 ? (
                <div className="empty-state">
                  <p>No scheduled posts for this date.</p>
                  <p>Tap a day to view or add posts.</p>
                </div>
              ) : (
                selectedPosts.map((post) => (
                  <article key={post.id} className="post-card">
                    <div className="post-card-top">
                      <h4>{post.title}</h4>
                      <span className={`status-chip ${post.status.toLowerCase()}`}>{post.status}</span>
                    </div>
                    <div className="tags-row">
                      {post.tags.map((tag) => (
                        <span key={tag} className="tag-pill">#{tag}</span>
                      ))}
                    </div>
                  </article>
                ))
              )}
            </div>

            <div className="action-panel">
              <button className="primary-button" onClick={openNewPostModal}>
                Create new post
              </button>
              <button className="secondary-button">Sync calendar</button>
            </div>
          </aside>
        )}
      </main>

      {showNewPostModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <p className="eyebrow">New post</p>
                <h3>Add a post for {selectedDate?.toDateString()}</h3>
              </div>
              <button className="close-button" onClick={() => setShowNewPostModal(false)}>
                ✕
              </button>
            </div>

            <label className="field-label">
              Title
              <input
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                placeholder="Enter post title"
              />
            </label>
            <label className="field-label">
              Tags
              <input
                value={newTags}
                onChange={(event) => setNewTags(event.target.value)}
                placeholder="social, blog, story"
              />
            </label>
            <label className="field-label">
              Status
              <select value={newStatus} onChange={(event) => setNewStatus(event.target.value)}>
                <option>Draft</option>
                <option>Scheduled</option>
                <option>Pending</option>
                <option>Live</option>
              </select>
            </label>

            <div className="modal-actions">
              <button className="primary-button" onClick={saveNewPost}>
                Save post
              </button>
              <button className="secondary-button" onClick={() => setShowNewPostModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
