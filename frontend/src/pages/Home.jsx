import { useEffect, useState } from "react";
import API from "../utils/api";
import Navbar from "../components/Navbar";
import Banner from "../assets/banner.jpg";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

  :root {
    --bg: #000000; 
    --surface: #101112; 
    --surface2: #181c24;
    --border: #252a35; 
    --accent: #086e40; 
    --text: #eef0f4;
    --muted: #6b7280; 
    --radius: 16px;
  }

  body { 
    background: var(--bg); 
    color: var(--text); 
    font-family: 'Poppins', sans-serif;
    margin: 0; 
  }
    /* Fixed & Enhanced Banner Styles */
  .hero-banner {
    position: relative;
    width: 100%;
    height: 400px;
    background-color: var(--surface); /* Fallback color */
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hero-banner img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;

  }

  /* Smooth transition for mobile */
  @media (max-width: 768px) {
    .hero-banner {
      height: 200px; /* Increased slightly from 150px for better visibility */
    }
  }


  /* Form & Card Styles */
  .h-input, .h-select {
    font-family: 'Poppins', sans-serif;
    background: var(--surface); 
    border: 1px solid var(--border);
    border-radius: 14px; 
    color: var(--text); 
    padding: 16px; 
    outline: none; 
    transition: 0.2s;
  }
  .h-input:focus, .h-select:focus { 
    border-color: var(--accent); 
    color: white; 
    background: var(--surface2); 
  }

  .h-card { 
    background: var(--surface); 
    border: 1px solid var(--border); 
    border-radius: 24px; 
    padding: 24px; 
    transition: 0.3s; 
    height: 100%;
    font-family: 'Poppins', sans-serif;
  }
  .h-card:hover { 
    transform: translateY(-5px); 
    border-color: var(--accent); 
  }
  .h-card h3 { 
    font-family: 'Poppins', sans-serif; 
    font-size: 1.2rem; 
    font-weight: 700; 
  }

  .progress-circle { 
    --size: 65px; 
    --thickness: 5px; 
    width: var(--size); 
    height: var(--size); 
    border-radius: 50%; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    position: relative; 
    background: conic-gradient(var(--accent) calc(var(--p) * 1%), var(--border) 0); 
  }
  .progress-circle::before { 
    content: ""; 
    position: absolute; 
    width: calc(var(--size) - var(--thickness)); 
    height: calc(var(--size) - var(--thickness)); 
    background: var(--surface); 
    border-radius: 50%; 
  }

  .h-tag { 
    font-family: 'Poppins', sans-serif;
    background: var(--surface2); 
    padding: 6px 12px; 
    border-radius: 10px; 
    font-size: 0.85rem; 
    color: var(--text); 
    display: flex; 
    align-items: center; 
    gap: 6px;
  }
  .h-tag i { color: var(--accent); font-size: 0.9rem; }

  .h-toast {
    font-family: 'Poppins', sans-serif;
    position: fixed; 
    bottom: 20px; 
    left: 50%; 
    transform: translateX(-50%);
    background: var(--accent); 
    color: #fff; 
    padding: 12px 24px; 
    border-radius: 50px; 
    font-weight: 600; 
    z-index: 1000;
  }

  .apply-btn {
    width: 100%; 
    padding: 14px 0; 
    border-radius: 14px; 
    font-weight: 700; 
    font-family: 'Poppins', sans-serif;
    transition: 0.3s; 
    border: none; 
    cursor: pointer;
  }
  .apply-btn:hover:not(:disabled) { 
    opacity: 0.9; 
    transform: scale(1.02); 
  }
`;

function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const applyJob = async (id) => {
    try {
      await API.post(`/jobs/apply/${id}`);
      showToast("Application sent!");
      fetchJobs();
    } catch (err) { showToast(err.response?.data?.msg || "Error applying"); }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const locations = [...new Set(jobs.map((job) => job.location))];
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === "" || job.location === locationFilter;
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="pb-5">
      <style>{style}</style>
      <Navbar />
      
      <div className="hero-banner mb-4">
        <img src={Banner} alt="banner" />
      </div>

      <div className="container" style={{ marginTop: "20px" }}>
        <div className="row g-3 justify-content-center">
          <div className="col-md-7 col-lg-8">
            <input
              className="h-input w-100 ps-4"
              placeholder="Search roles or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-5 col-lg-3">
            <select
              className="h-select w-100"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map((loc, i) => <option key={i} value={loc}>{loc}</option>)}
            </select>
          </div>
        </div>

        <div className="row g-4 mt-4">
          {!loading && filteredJobs.map((job) => {
            const appliedCount = job.appliedUsers?.length || 0;
            const totalNeeded = job.membersNeeded || 1;
            const percentage = Math.min((appliedCount / totalNeeded) * 100, 100);
            const isFull = appliedCount >= totalNeeded;
            const userId = localStorage.getItem("userId");
            const hasApplied = job.appliedUsers?.some(u => (u._id || u) === userId);

            return (
              <div key={job._id} className="col-12 col-md-6 col-lg-4">
                <div className="h-card d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h3 className="m-0">{job.title}</h3>
                      <div className="progress-circle" style={{ "--p": percentage }}>
                        <div className="position-relative text-center" style={{ fontSize: '0.7rem', fontWeight: 800 }}>
                          {appliedCount}/{totalNeeded}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-wrap gap-2 mb-4">
                      <span className="h-tag"><i className="bi bi-geo-alt-fill"></i> {job.location}</span>
                      <span className="h-tag"><i className="bi bi-cash-stack"></i> {job.salary}</span>
                      {job.duration && <span className="h-tag"><i className="bi bi-clock-history"></i> {job.duration}</span>}
                    </div>
                  </div>

                  <button
                    className="apply-btn"
                    style={{ 
                      background: (hasApplied || isFull) ? "var(--border)" : "var(--accent)",
                      color: (hasApplied || isFull) ? "var(--muted)" : "#fff"
                    }}
                    onClick={() => applyJob(job._id)}
                    disabled={hasApplied || isFull}
                  >
                    {hasApplied ? "Already Applied" : isFull ? "Position Full" : "Quick Apply"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {toast && <div className="h-toast shadow-lg">{toast}</div>}
    </div>
  );
}

export default Home;