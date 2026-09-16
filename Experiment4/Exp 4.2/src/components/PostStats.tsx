type Props = {
  totalPosts: number;
  recentPostTime: string | null;
};

export const PostStats = ({ totalPosts, recentPostTime }: Props) => (
  <div className="stats-grid">
    <div className="stat-card">
      <span className="stat-label">Total posts</span>
      <strong>{totalPosts}</strong>
    </div>
    <div className="stat-card">
      <span className="stat-label">Latest publish</span>
      <strong>{recentPostTime ?? 'No content yet'}</strong>
    </div>
  </div>
);
