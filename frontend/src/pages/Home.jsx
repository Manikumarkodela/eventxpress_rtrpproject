import { useState, useEffect } from 'react';
import ServiceCard from '../components/ServiceCard';
import API_BASE from '../config';
import birthdeco from '../images/birthdeco.jpg';
import comevent2 from '../images/comevent2.jpg';
import marriage from '../images/marriage.jpg';

const Home = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [0, 1, 2];

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_BASE}/vendor/products`);
      if (res.ok) {
        const data = await res.json();
        setServices(data);
        setFilteredServices(data);
      }
    } catch (err) {
      console.error('Failed to fetch services', err);
    }
  };

  useEffect(() => {
    let result = services;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.description.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== 'All Categories') {
      const c = categoryFilter.toLowerCase();
      result = result.filter(s => {
        if (s.category && s.category !== "Uncategorized") {
          return s.category.toLowerCase() === c;
        }
        return s.name.toLowerCase().includes(c) || s.description.toLowerCase().includes(c);
      });
    }

    if (locationFilter !== 'All Locations') {
      result = result.filter(s => s.location === locationFilter);
    }

    setFilteredServices(result);
  }, [searchTerm, categoryFilter, locationFilter, services]);

  return (
    <main className="main-content">
      <section className="carousel-container">
        <div className="carousel">
          <div className="slides">
            <div className={`slide ${currentSlide === 0 ? 'active' : ''}`}>
              <div className="hero-slide">
                <img src={marriage} alt="Wedding Event" className="hero-img" />
                <div className="hero-content">
                  <h1>Plan Your Dream Event Effortlessly</h1>
                  <p>Discover top-rated vendors and services near you.</p>
                  <button className="btn-primary" onClick={() => document.getElementById('vendors').scrollIntoView()}>Explore Now</button>
                </div>
              </div>
            </div>
            <div className={`slide ${currentSlide === 1 ? 'active' : ''}`}>
              <img src={birthdeco} alt="Birthday Event" />
            </div>
            <div className={`slide ${currentSlide === 2 ? 'active' : ''}`}>
              <img src={comevent2} alt="Corporate Event" />
            </div>
          </div>
          <div className="carousel-controls">
            <button className="prev" onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)}>&#10094;</button>
            <button className="next" onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}>&#10095;</button>
          </div>
          <div className="indicators">
            {slides.map(slide => (
              <span key={slide} className={currentSlide === slide ? 'active' : ''} onClick={() => setCurrentSlide(slide)}></span>
            ))}
          </div>
        </div>
      </section>
      
      <br />

      <section id="events" className="section">
        <div className="section-header">
          <div>
            <h2>Popular Events</h2>
            <p>Choose from our most loved event categories</p>
          </div>
        </div>
        <div className="events-container">
          <div className="card">
            <img src={marriage} alt="Wedding Event" />
            <div className="card-content">
              <h3>Wedding</h3>
              <p>Make your special day unforgettable with our expert planning and premium vendors.</p>
            </div>
          </div>
          <div className="card">
            <img src={birthdeco} alt="Birthday Event" />
            <div className="card-content">
              <h3>Birthday</h3>
              <p>Celebrate your moments with style and create memories that last forever.</p>
            </div>
          </div>
          <div className="card">
            <img src={comevent2} alt="Corporate Event" />
            <div className="card-content">
              <h3>Corporate Event</h3>
              <p>Professional planning for business events, conferences, and team building.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="vendors" className="section">
        <div className="section-header">
          <div>
            <h2>Live Services</h2>
            <p>Browse every vendor service as it arrives</p>
          </div>
        </div>
        
        <div className="vendor-filters">
          <input 
            type="search" 
            placeholder="Search services by name" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All Categories">All Categories</option>
            <option value="Photography">Photography</option>
            <option value="Decoration">Decoration</option>
            <option value="Catering">Catering</option>
            <option value="Event Planning">Event Planning</option>
            <option value="Venues">Venues</option>
          </select>
          <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
            <option value="All Locations">All Locations</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Warangal">Warangal</option>
          </select>
        </div>

        <div className="vendor-grid">
          {filteredServices.length > 0 ? (
            filteredServices.map(service => (
              <ServiceCard key={service._id} service={service} isVendorView={false} />
            ))
          ) : (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#64748b', padding: '2rem' }}>
              No services match your criteria right now. Check back later!
            </p>
          )}
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="section">
        <div className="section-header">
          <div>
            <h2>Event Planning Insights</h2>
            <p>Read our latest blogs, tips &amp; trends</p>
          </div>
        </div>
        
        <div className="blog-grid">
          <div className="blog-card">
            <div className="blog-image">
              <span className="blog-tag">Tips</span>
              <img src={marriage} alt="Wedding Trends" />
            </div>
            <div className="blog-content">
              <h3>Top 10 Wedding Decor Trends in 2026</h3>
              <p>Discover the breathtaking new floral patterns and lighting rigs dominating this season's premium wedding spaces.</p>
              <div className="blog-footer">
                <a href="#" className="read-more">Read Article <i className="fa-solid fa-arrow-right"></i></a>
                <span className="blog-date"><i className="fa-regular fa-clock"></i> 5 min read</span>
              </div>
            </div>
          </div>

          <div className="blog-card">
            <div className="blog-image">
              <span className="blog-tag">Guide</span>
              <img src={comevent2} alt="Corporate" />
            </div>
            <div className="blog-content">
              <h3>Managing Corporate Event Budgets</h3>
              <p>Learn exactly how professional event planners effectively slice their budgets to eliminate venue overspending.</p>
              <div className="blog-footer">
                <a href="#" className="read-more">Read Article <i className="fa-solid fa-arrow-right"></i></a>
                <span className="blog-date"><i className="fa-regular fa-clock"></i> 8 min read</span>
              </div>
            </div>
          </div>

          <div className="blog-card">
            <div className="blog-image">
              <span className="blog-tag">Inspiration</span>
              <img src={birthdeco} alt="Birthday" />
            </div>
            <div className="blog-content">
              <h3>5 Unforgettable Birthday Themes</h3>
              <p>Explore mind-blowing aesthetic themes including Retro Neon and Forest Escape that will leave your guests impressed.</p>
              <div className="blog-footer">
                <a href="#" className="read-more">Read Article <i className="fa-solid fa-arrow-right"></i></a>
                <span className="blog-date"><i className="fa-regular fa-clock"></i> 3 min read</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
