import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API_BASE from '../config';

const ServiceCard = ({ service, isVendorView, onDelete }) => {
  const navigate = useNavigate();

  const handleBook = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to book a service!");
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          vendorId: service.vendorId?._id || service.vendorId,
          products: [{
            productId: service._id,
            name: service.name,
            quantity: 1,
            price: service.price
          }]
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`🎉 Successfully booked ${service.name}!`);
      } else {
        toast.error(data.msg || "Failed to book service");
      }
    } catch (err) {
      console.error("Booking error:", err);
      toast.error("Network error. Make sure your backend is running!");
    }
  };

  const imgSrc = (service.images && service.images.length > 0) ? service.images[0] : "https://via.placeholder.com/300x200?text=No+Image";
  const vendorName = service.vendorId?.name || "Unknown Vendor";
  const categoryLabel = (service.category && service.category !== "Uncategorized") ? service.category.charAt(0).toUpperCase() + service.category.slice(1) : "";

  return (
    <div className="service-card card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ position: 'relative' }}>
        {categoryLabel && (
          <span style={{
            position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.75)', color: '#fff', 
            padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', textTransform: 'uppercase', 
            fontWeight: 600, letterSpacing: 0.5
          }}>
            {categoryLabel}
          </span>
        )}
        <img src={imgSrc} alt={service.name} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: '12px 12px 0 0' }} />
      </div>
      <div className="card-content" style={{ padding: 15, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ margin: '0 0 5px 0' }}>{service.name}</h3>
        {!isVendorView && <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 0 }}>By {vendorName}</p>}
        {service.location && <p style={{ fontSize: '0.8rem', color: '#059669', margin: '0 0 5px 0', fontWeight: 'bold' }}><i className="fa-solid fa-location-dot"></i> {service.location}</p>}
        <p style={{ margin: '10px 0', flex: 1, fontSize: '0.9rem', color: '#64748b' }}>{service.description}</p>
        
        {isVendorView && service.contact && (
          <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#475569' }}>
            <i className="fa-solid fa-phone"></i> {service.contact}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
          <span className="price" style={{ fontWeight: 600, color: '#059669' }}>₹{service.price}</span>
          
          {isVendorView ? (
            <button 
              onClick={() => onDelete(service._id)} 
              className="btn-primary" 
              style={{ background: '#ef4444', padding: '6px 12px', fontSize: '0.85rem' }}
            >
              Delete
            </button>
          ) : (
            <button className="btn-primary" onClick={handleBook} style={{ padding: '8px 16px' }}>
              Book
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
