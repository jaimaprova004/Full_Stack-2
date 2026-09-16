import "./App.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { addPost, deletePost } from "./features/posts/postSlice";
import { selectAllPosts, selectPostCount } from "./selectors/postSelectors";
import {
  login,
  logout,
  selectAuthUsers,
  selectCurrentUser,
} from "./features/auth/authSlice";

function RequireAuth() {
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

function RequirePermission({ permission, children }) {
  const user = useSelector(selectCurrentUser);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.permissions.includes(permission)) {
    return <Navigate to="/no-access" replace />;
  }

  return children;
}

function AppLayout({ user, onLogout }) {
  return (
    <div className="app-shell">
      <header className="hero-panel">
        <span className="header-icon">🌈</span>
        <div>
          <h1 className="hero-title">Colorful Access Control</h1>
          <p className="hero-copy">
            Secure routes with user roles, permissions, and glowing neon UI.
          </p>
        </div>
      </header>

      <div className="app-nav">
        <NavLink to="/" className={({ isActive }) => (isActive ? "nav-pill active" : "nav-pill")}>Dashboard</NavLink>
        <NavLink to="/posts" className={({ isActive }) => (isActive ? "nav-pill active" : "nav-pill")}>Posts</NavLink>
        {user?.permissions.includes("admin:enter") && (
          <NavLink to="/admin" className={({ isActive }) => (isActive ? "nav-pill active" : "nav-pill")}>Admin</NavLink>
        )}
        <button className="nav-pill logout-pill" onClick={onLogout} type="button">
          Sign out
        </button>
      </div>

      <div className="permission-strip">
        <span className="role-chip">{user.role}</span>
        <span className="permission-copy">Signed in as {user.name}</span>
      </div>

      <Outlet />
    </div>
  );
}

function LoginPage({ users, onLogin }) {
  const [selectedUser, setSelectedUser] = useState(users[0]?.id || "");

  return (
    <div className="app-shell page-card">
      <header className="hero-panel">
        <span className="header-icon">🔐</span>
        <div>
          <h1 className="hero-title">Pick an experimental role</h1>
          <p className="hero-copy">
            Try admin, editor, or viewer to see how RBAC changes route access.
          </p>
        </div>
      </header>

      <div className="role-grid">
        {users.map((profile) => (
          <button
            key={profile.id}
            type="button"
            className={`role-card ${selectedUser === profile.id ? "role-card-selected" : ""}`}
            onClick={() => setSelectedUser(profile.id)}
          >
            <span className="role-emoji">{profile.badge}</span>
            <div>
              <h2>{profile.name}</h2>
              <p className="role-meta">{profile.role}</p>
              <div className="permission-list">
                {profile.permissions.map((permission) => (
                  <span key={permission} className="permission-chip small">
                    {permission.replace(":", "/")}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      <button className="gradient-btn large" type="button" onClick={() => onLogin(selectedUser)}>
        Launch session
      </button>
    </div>
  );
}

function DashboardPage({ user, totalPosts }) {
  return (
    <section className="page-card">
      <div className="dashboard-grid">
        <div className="status-card">
          <h2>Welcome back, {user.name}</h2>
          <p>Role-based routes make every visit feel personalized and secure.</p>
        </div>

        <div className="status-card accent">
          <h3>Available posts</h3>
          <p className="stats-value">{totalPosts}</p>
        </div>

        <div className="status-card">
          <h3>Active permissions</h3>
          <div className="permission-stack">
            {user.permissions.map((permission) => (
              <span key={permission} className="permission-chip">
                {permission}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PostsPage({ posts, user, onAddPost, onDeletePost }) {
  const [text, setText] = useState("");
  const canEdit = user.permissions.includes("posts:edit");
  const canDelete = user.permissions.includes("posts:delete");

  const handleSubmit = () => {
    if (!text.trim() || !canEdit) return;
    onAddPost(text.trim());
    setText("");
  };

  return (
    <section className="page-card">
      <div className="section-header">
        <h2>Neon Post Board</h2>
        <p>View, create, or delete posts according to your permissions.</p>
      </div>

      <div className="form-row">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={
            canEdit
              ? "Create a new permission-aware post..."
              : "Read-only mode: only admins and editors can add posts"
          }
          className="text-input"
          disabled={!canEdit}
        />
        <button
          type="button"
          onClick={handleSubmit}
          className={`gradient-btn ${!canEdit ? "disabled" : ""}`}
          disabled={!canEdit}
        >
          Add
        </button>
      </div>

      <div className="posts-list">
        {posts.map((post) => (
          <article key={post.id} className="post-card">
            <div className="post-color" style={{ background: post.color }} />
            <div className="post-badge">{post.category}</div>
            <h3>{post.title}</h3>
            <p>{post.text}</p>
            <div className="post-footer">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              {canDelete && (
                <button type="button" className="delete-btn" onClick={() => onDeletePost(post.id)}>
                  Delete
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AdminPage({ user }) {
  return (
    <section className="page-card">
      <div className="section-header">
        <h2>Admin Control Room</h2>
        <p>Only admins can access this route. It is protected by a strict permission guard.</p>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-card accent">
          <h3>Superuser details</h3>
          <p>{user.name} is assigned to the <strong>{user.role}</strong> profile.</p>
        </div>

        <div className="admin-panel-card">
          <h3>Permissions</h3>
          <div className="permission-stack">
            {user.permissions.map((permission) => (
              <span key={permission} className="permission-chip">
                {permission}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function NoAccessPage() {
  return (
    <section className="page-card empty-state">
      <h2>Access Denied</h2>
      <p>Your current role does not permit entry to this page.</p>
      <p className="muted">Try a different role or return to the dashboard.</p>
    </section>
  );
}

function NotFoundPage() {
  return (
    <section className="page-card empty-state">
      <h2>404 — Route Not Found</h2>
      <p>That path doesn't exist. Use the navigation above to continue.</p>
    </section>
  );
}

function AppRoutes() {
  const dispatch = useDispatch();
  const users = useSelector(selectAuthUsers);
  const currentUser = useSelector(selectCurrentUser);
  const totalPosts = useSelector(selectPostCount);
  const posts = useSelector(selectAllPosts);
  const navigate = useNavigate();

  const handleLogin = (userId) => {
    const profile = users.find((item) => item.id === userId);
    if (profile) {
      dispatch(login(profile));
      navigate("/");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate to="/" replace />
          ) : (
            <LoginPage users={users} onLogin={handleLogin} />
          )
        }
      />
      <Route path="/no-access" element={<NoAccessPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout user={currentUser} onLogout={handleLogout} />}>
          <Route index element={<DashboardPage user={currentUser} totalPosts={totalPosts} />} />
          <Route
            path="posts"
            element={
              <RequirePermission permission="posts:view">
                <PostsPage posts={posts} user={currentUser} onAddPost={(text) => dispatch(addPost({ title: text, text, category: "Ideas", tags: ["RBAC"] }))} onDeletePost={(id) => dispatch(deletePost(id))} />
              </RequirePermission>
            }
          />
          <Route path="admin" element={<RequirePermission permission="admin:enter"><AdminPage user={currentUser} /></RequirePermission>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
