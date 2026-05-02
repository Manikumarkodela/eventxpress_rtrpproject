import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import API_BASE from '../config';

const VendorDashboard = () => {
  const [services, setServices] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'photography',
    location: 'Hyderabad',
    contact: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadServices();
  }, [navigate]);

  const loadServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/vendor/my-products`, {
        headers: { "Authorization": "Bearer " + token }
      });
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.filter(f => f.type.startsWith('image/')).map(file => ({
      file,
      src: URL.createObjectURL(file)
    }));
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("location", formData.location);
    data.append("contact", formData.contact);

    uploadedImages.forEach(imgObj => {
      data.append("images", imgObj.file);
    });

    try {
      const res = await fetch(`${API_BASE}/vendor/products`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token
        },
        body: data
      });

      if (res.ok) {
        alert("Service added!");
        setFormData({
          name: '', price: '', description: '', category: 'photography', location: 'Hyderabad', contact: ''
        });
        setUploadedImages([]);
        loadServices();
      } else {
        const errData = await res.json();
        alert(errData.msg || "Error adding service");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/vendor/products/${id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
      });
      if (res.ok) {
        loadServices();
      } else {
        const data = await res.json();
        alert(data.msg || "Error deleting service");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="main-content">
      <div className="dashboard-header">
        <h1>Vendor Dashboard</h1>
        <p>Manage your professional listings and attract more clients.</p>
      </div>

      <section className="dashboard-grid">
        <div className="dashboard-panel">
          <h2>Add a Service</h2>
          <form className="vendor-form" onSubmit={handleSubmit}>
            <label>Service Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Wedding Photography" required />

            <label>Base Price (₹)</label>
            <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="500" required />

            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="Tell clients about your expertise..." required></textarea>

            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleInputChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '15px', fontFamily: 'inherit', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }}>
              <option value="photography">Photography</option>
              <option value="decoration">Decoration</option>
              <option value="catering">Catering</option>
              <option value="planning">Event Planning</option>
              <option value="venues">Venues</option>
            </select>

            <label>Location</label>
            <select name="location" value={formData.location} onChange={handleInputChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '15px', fontFamily: 'inherit', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }}>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Warangal">Warangal</option>
            </select>

            <label>Contact Details</label>
            <input type="text" name="contact" value={formData.contact} onChange={handleInputChange} placeholder="Phone number or Email for inquiries" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '15px', fontFamily: 'inherit', fontSize: '1rem', boxSizing: 'border-box' }} />

            <label>Upload Portfolio Images</label>
            <div className="upload-container" id="drop-zone" onClick={() => document.getElementById('file-input').click()}>
              <div className="upload-content">
                <i className="fa-solid fa-images"></i>
                <p>Drag images here or <span>Browse</span></p>
              </div>
              <input type="file" id="file-input" multiple accept="image/*" hidden onChange={handleFiles} />
            </div>
            <div className="preview-grid">
              {uploadedImages.map((img, index) => (
                <div key={index} className="preview-item">
                  <img src={img.src} alt="preview" />
                  <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(index); }}>✕</button>
                </div>
              ))}
            </div>

            <button type="submit" className="submit-btn">Publish Service</button>
          </form>
        </div>

        <div className="dashboard-panel">
          <h2>Live Listings</h2>
          <div className="vendor-grid">
            {services.length === 0 ? (
              <p>No services yet. Add your first listing above!</p>
            ) : (
              services.map(service => (
                <ServiceCard key={service._id} service={service} isVendorView={true} onDelete={deleteService} />
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default VendorDashboard;
