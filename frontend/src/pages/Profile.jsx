import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
  const [user, setUser] = useState({ name: '', role: '', initial: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const actualRole = payload.user ? payload.user.role : payload.role;
      const userName = localStorage.getItem('userName') || 'User';
      setUser({
        name: userName,
        role: actualRole === 'vendor' ? 'Vendor Partner' : 'Customer Account',
        initial: userName.charAt(0).toUpperCase()
      });
    } catch (e) {
      console.error("Profile error:", e);
      navigate('/login');
    }
  }, [navigate]);

  return (
    <main className="main-content">
      <div style={{
        maxWidth: 800, margin: 'auto', background: 'white', borderRadius: 20, 
        padding: '3rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', 
        textAlign: 'center', border: '1px solid var(--border)'
      }}>
        <div style={{
          width: 120, height: 120, borderRadius: '50%', background: '#fff8e1', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: '3rem', color: 'var(--primary)', margin: '0 auto 1.5rem', 
          border: '4px solid var(--surface)', boxShadow: '0 4px 15px rgba(255,204,77,0.3)'
        }}>
          <span style={{ fontFamily: 'var(--font-body)' }}>{user.initial}</span>
        </div>
        
        <div>
          <h2 style={{ margin: '0 0 5px', fontSize: '1.8rem' }}>{user.name}</h2>
          <p style={{ color: 'var(--text-light)', margin: '0 0 2rem' }}>Verified Account</p>
          <p style={{ display: 'inline-block', padding: '5px 12px', background: 'var(--bg)', borderRadius: 20, fontSize: '0.85rem', border: '1px solid var(--primary)', color: 'var(--text)', fontWeight: 500 }}>
            {user.role}
          </p>
        </div>
        
        <br /><br />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
          <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 12, border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 5px', fontSize: '1.5rem', color: 'var(--primary)' }}>3</h3>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Active Sessions</span>
          </div>
          <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 12, border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 5px', fontSize: '1.5rem', color: 'var(--primary)' }}>12</h3>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Interactions</span>
          </div>
          <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 12, border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 5px', fontSize: '1.5rem', color: 'var(--primary)' }}>★</h3>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Premium Member</span>
          </div>
        </div>

        <button className="btn-primary" onClick={() => toast('Profile Editor coming soon!', { icon: '🚧' })} style={{ padding: '12px 30px', fontSize: '1rem' }}>
          <i className="fa-solid fa-pen"></i> Edit Profile
        </button>
      </div>
    </main>
  );
};

export default Profile;
