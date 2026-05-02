import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);

  // Re-check auth on every route change (handles login redirect via window.location)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    if (token && userName) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Check if token is expired
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          setUser(null);
          return;
        }
        const actualRole = payload.user ? payload.user.role : payload.role;
        setUser({ name: userName, role: actualRole });
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setUser(null);
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar" aria-label="Primary navigation">
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="logo">eventXpress</Link>
        </div>
        
        <div className={`nav-center ${isOpen ? 'active' : ''}`} id="navCenter">
          <ul className="nav-links" id="navLinks">
            <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
            <li><a href="/#events" onClick={() => setIsOpen(false)}>Categories</a></li>
            <li><a href="/#vendors" onClick={() => setIsOpen(false)}>Services</a></li>
            <li><a href="/#blog" onClick={() => setIsOpen(false)}>Blog</a></li>
          </ul>
        </div>

        <div className="nav-right">
          <div className="search-box" role="search">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            <input type="text" placeholder="Search services..." aria-label="Search services" />
          </div>

          {!user ? (
            <div id="auth-buttons">
              <Link to="/login">
                <button className="btn-primary login-btn">Login</button>
              </Link>
            </div>
          ) : (
            <div 
              id="user-menu" 
              className={`user-menu ${isUserMenuOpen ? 'open' : ''}`} 
              aria-haspopup="true"
              ref={userMenuRef}
            >
              <button 
                id="user-trigger" 
                className="user-trigger" 
                aria-expanded={isUserMenuOpen}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <span id="user-name" className="user-label">{user.name}</span>
                <i className={`fa-solid fa-chevron-${isUserMenuOpen ? 'up' : 'down'}`}></i>
              </button>

              {isUserMenuOpen && (
                <div id="user-dropdown" className="user-dropdown" style={{ display: 'flex' }}>
                  {user.role === 'vendor' ? (
                    <>
                      <Link to="/vendor-dashboard" onClick={() => setIsUserMenuOpen(false)}>
                        <i className="fa-solid fa-chart-line"></i> Dashboard
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/profile" onClick={() => setIsUserMenuOpen(false)}>
                        <i className="fa-solid fa-user"></i> Profile
                      </Link>
                      <Link to="/bookings" onClick={() => setIsUserMenuOpen(false)}>
                        <i className="fa-solid fa-calendar-check"></i> Bookings
                      </Link>
                    </>
                  )}
                  <button className="logout-btn" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          <button 
            className="menu-toggle" 
            id="menuToggle" 
            aria-label="Toggle navigation" 
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`} aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
