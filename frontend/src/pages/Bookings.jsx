import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API_BASE from '../config';

const Bookings = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOrders(token);
  }, [navigate]);

  const fetchOrders = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/order`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else if (res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        navigate('/login');
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    toast((t) => (
      <div>
        <p style={{ margin: '0 0 10px', fontWeight: 600 }}>Cancel this booking?</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              const token = localStorage.getItem('token');
              try {
                const res = await fetch(`${API_BASE}/order/${id}`, {
                  method: 'DELETE',
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                  toast.success("Booking cancelled");
                  fetchOrders(token);
                } else {
                  const data = await res.json();
                  toast.error(data.msg || "Failed to cancel");
                }
              } catch (err) {
                toast.error("Network error");
              }
            }}
            style={{ background: '#ef4444', color: 'white', padding: '5px 10px', border: 'none', borderRadius: 5, cursor: 'pointer' }}
          >
            Yes, Cancel
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)}
            style={{ background: '#e2e8f0', color: 'black', padding: '5px 10px', border: 'none', borderRadius: 5, cursor: 'pointer' }}
          >
            No, Keep it
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const totalSpent = orders.reduce((sum, order) => {
    return sum + order.products.reduce((s, p) => s + (p.price * p.quantity), 0);
  }, 0);

  return (
    <main className="main-content">
      <div className="dashboard-header">
        <h1>My Bookings</h1>
        <p>View and track all your booked event services.</p>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem', marginBottom: '2.5rem' 
      }}>
        <div style={{ 
          background: '#fff', padding: '1.5rem', borderRadius: 16, 
          border: '1px solid var(--border)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' 
        }}>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: 5 }}>Total Bookings</p>
          <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary)' }}>{orders.length}</h2>
        </div>
        <div style={{ 
          background: '#fff', padding: '1.5rem', borderRadius: 16, 
          border: '1px solid var(--border)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' 
        }}>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: 5 }}>Total Spent</p>
          <h2 style={{ margin: 0, fontSize: '2rem', color: '#059669' }}>₹{totalSpent.toLocaleString()}</h2>
        </div>
        <div style={{ 
          background: '#fff', padding: '1.5rem', borderRadius: 16, 
          border: '1px solid var(--border)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' 
        }}>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: 5 }}>Services Booked</p>
          <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--text)' }}>
            {orders.reduce((sum, o) => sum + o.products.length, 0)}
          </h2>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block' }}></i>
          Loading your bookings...
        </div>
      ) : orders.length === 0 ? (
        <div style={{ 
          textAlign: 'center', padding: '4rem 2rem', background: '#fff', 
          borderRadius: 20, border: '1px solid var(--border)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
        }}>
          <i className="fa-solid fa-calendar-xmark" style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '1rem', display: 'block' }}></i>
          <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text)' }}>No Bookings Yet</h3>
          <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
            You haven't booked any services yet. Start exploring!
          </p>
          <button className="btn-primary" onClick={() => navigate('/')} style={{ padding: '12px 28px' }}>
            Browse Services
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order._id} style={{ 
              background: '#fff', borderRadius: 16, overflow: 'hidden',
              border: '1px solid var(--border)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              {/* Order Header */}
              <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid var(--border)',
                flexWrap: 'wrap', gap: '0.5rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>ORDER ID</span>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', fontFamily: 'monospace' }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>VENDOR</span>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>
                    {order.vendorId?.name || 'Unknown Vendor'}
                  </p>
                </div>
                <div>
                  <span style={{ 
                    background: '#dcfce7', color: '#166534', padding: '4px 12px', 
                    borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 
                  }}>
                    <i className="fa-solid fa-check-circle"></i> Confirmed
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ padding: '1.5rem' }}>
                {order.products.map((product, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.75rem 0', borderBottom: idx < order.products.length - 1 ? '1px solid #f1f5f9' : 'none'
                  }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600 }}>{product.name}</p>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>
                        Qty: {product.quantity}
                      </p>
                    </div>
                    <span style={{ fontWeight: 600, color: '#059669', fontSize: '1.1rem' }}>
                      ₹{(product.price * product.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1rem 1.5rem', background: '#fffbeb', borderTop: '1px solid #fde68a'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    <i className="fa-regular fa-clock"></i>{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                      day: 'numeric', month: 'short', year: 'numeric' 
                    })}
                  </span>
                  <button 
                    onClick={() => cancelBooking(order._id)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', padding: 0, textAlign: 'left', fontWeight: 600 }}
                  >
                    Cancel Booking
                  </button>
                </div>
                <span style={{ fontWeight: 700, fontSize: '1.15rem' }}>
                  Total: ₹{order.products.reduce((s, p) => s + p.price * p.quantity, 0).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Bookings;
