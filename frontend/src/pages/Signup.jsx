import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE from '../config';

const Signup = () => {
  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Registration failed");
        setIsLoading(false);
        return;
      }

      alert("🎉 Account created successfully! Please login.");
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className={`auth-card ${role === 'vendor' ? 'vendor-mode' : ''}`}>
        <div className="text-center">
          <div className="logo">eventXpress</div>
          <h4>Create Your Account</h4>
          <p className="subtitle-text">
            {role === 'customer' ? 'Join as a customer to discover amazing vendors' : 'Register as a vendor to showcase your services'}
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

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
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
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
              minLength={6}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Creating Account..." : (role === 'vendor' ? "Register as Vendor" : "Create Account")}
          </button>
        </form>

        <div className="signup-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
