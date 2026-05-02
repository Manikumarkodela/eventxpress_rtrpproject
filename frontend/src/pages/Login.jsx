import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE from '../config';

const Login = () => {
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Login failed");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.user.name);

      let payload;
      try {
        payload = JSON.parse(atob(data.token.split('.')[1]));
      } catch {
        alert("Invalid token received");
        setIsLoading(false);
        return;
      }

      if (payload.role !== role) {
        alert(`You logged in as ${payload.role}, but selected ${role}`);
      }

      // Instead of forcing a hard reload, we can use navigate and trigger a state update
      // or simply rely on window.location to force a full re-render of Navbar state
      window.location.href = payload.role === "vendor" ? "/vendor-dashboard" : "/";
    } catch (err) {
      console.error(err);
      alert("Server error");
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className={`auth-card ${role === 'vendor' ? 'vendor-mode' : ''}`}>
        <div className="text-center">
          <div className="logo">eventXpress</div>
          <h4>Welcome Back</h4>
          <p className="subtitle-text">
            {role === 'customer' ? 'Access your customer dashboard' : 'Access your vendor workspace'}
          </p>
        </div>

        <div className="role-switcher">
          <button 
            className={`role-btn ${role === 'customer' ? 'active' : ''}`} 
            onClick={() => setRole('customer')}
          >
            Customer
          </button>
          <button 
            className={`role-btn ${role === 'vendor' ? 'active' : ''}`} 
            onClick={() => setRole('vendor')}
          >
            Vendor
          </button>
        </div>

        <div className="divider">OR USE EMAIL</div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="name@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-footer">
            <label className="checkbox-wrapper">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Authenticating..." : (role === 'vendor' ? "Vendor Sign In" : "Sign In")}
          </button>
        </form>

        <div className="signup-link">
          Don't have an account? <Link to="/signup">Create one for free</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
