import { useEffect, useState } from "react";
import API from "../utils/api";
import Navbar from "../components/Navbar";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg: #000000;
    --surface: #000000;
    --surface2: #10753f;
    --border: #252a35;
    --accent: #0d5640;
    --danger: #ff4d6d;
    --text: #eef0f4;
    --muted: #6b7280;
    --radius: 16px;
    --overlay: rgba(0, 0, 0, 0.85);
  }

  .mj-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    padding-bottom: 80px;
  }

  .cj-hero-tag {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(0,229,160,0.08); border: 1px solid rgba(0,229,160,0.22);
    color: var(--accent); font-size: 0.72rem; font-weight: 600;
    padding: 5px 14px; border-radius: 100px; text-transform: uppercase;
  }

  .mj-header { padding: 60px 20px 40px; text-align: center; }
  .mj-header h1 { font-family: 'Syne', sans-serif; font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; }
  .mj-header span { color: var(--accent); }

  .mj-container { max-width: 900px; margin: 0 auto; padding: 0 20px; display: flex; flex-direction: column; gap: 16px; }

  .mj-job-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 24px 32px;
    transition: all 0.3s ease;
  }
  .mj-job-card:hover { border-color: #353b48; transform: translateY(-2px); }

  .mj-job-title h2 { font-family: 'Syne', sans-serif; font-size: 1.25rem; margin-bottom: 6px; }
  .mj-meta-row { display: flex; flex-wrap: wrap; gap: 12px; color: var(--muted); font-size: 0.85rem; }
  .mj-meta-item { display: flex; align-items: center; gap: 6px; }
  
  /* Buttons */
  .mj-stats-btn {
    background: var(--surface2);
    padding: 10px 18px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid var(--border);
    cursor: pointer;
    color: var(--text);
    transition: 0.2s;
  }
  .mj-stats-btn:hover { background: #202630; border-color: var(--accent); }

  .mj-delete-btn {
    background: rgba(255, 77, 109, 0.05);
    border: 1px solid rgba(255, 77, 109, 0.2);
    color: var(--danger);
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.2s;
  }
  .mj-delete-btn:hover { background: var(--danger); color: white; }

  .mj-badge {
    background: rgba(0, 229, 160, 0.1);
    color: var(--accent);
    padding: 2px 8px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 0.75rem;
  }

  /* Modal */
  .mj-modal-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: var(--overlay); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; padding: 15px;
  }
  .mj-modal {
    background: var(--surface);
    border: 1px solid var(--border);
    width: 100%;
    max-width: 500px;
    border-radius: 24px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    animation: modalSlide 0.3s ease-out;
  }
  @keyframes modalSlide { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  
  .mj-modal-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
  .mj-modal-body { padding: 20px; overflow-y: auto; }
  
  .mj-user-card {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 12px;
  }

  /* Mobile Optimization */
  @media (max-width: 768px) {
    .mj-job-card { padding: 20px; flex-direction: column; align-items: flex-start; gap: 20px; }
    .mj-actions { width: 100%; justify-content: space-between; }
    .mj-stats-btn { flex: 1; justify-content: center; }
    .mj-header { padding: 40px 15px 30px; }
  }
`;

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => { fetchMyJobs(); }, []);

  const fetchMyJobs = async () => {
    try {
      const res = await API.get("/jobs/my-jobs");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Delete this listing permanently?")) return;
    try {
      await API.delete(`/jobs/delete/${jobId}`);
      setJobs(jobs.filter(job => job._id !== jobId));
    } catch (err) {
      alert("Error deleting job");
    }
  };

  return (
    <>
      <style>{style}</style>
      <div className="mj-root">
        <Navbar />


        <div className="mj-header">
          <p className="cj-hero-tag">+ My workes</p>
          <p className="text-secondary small mt-2">அளவறிந்து வாழாதான் வாழ்க்கை உளவரை
உயராது உயர்ந்தது இல்</p>
        </div>

        <div className="mj-container">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-accent"></div></div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-5 text-secondary border border-dashed rounded-4 p-5">
              <i className="bi bi-patch-question h1 d-block mb-3"></i>
              No jobs found.
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="mj-job-card d-flex align-items-center justify-content-between">
                <div className="mj-job-info">
                  <h2>{job.title}</h2>
                  <div className="mj-meta-row">
                    <div className="mj-meta-item"><i className="bi bi-geo-alt text-accent"></i> {job.location}</div>
                    <div className="mj-meta-item"><i className="bi bi-cash-stack text-accent"></i> {job.salary}</div>
                  </div>
                </div>

                <div className="mj-actions d-flex gap-2">
                  <button className="mj-stats-btn" onClick={() => setSelectedJob(job)}>
                    <i className="bi bi-people-fill"></i>
                    <span className="fw-bold small">Candidates <span className="mj-badge ms-1">{job.appliedUsers.length}</span></span>
                  </button>
                  
                  <button className="mj-delete-btn" onClick={() => deleteJob(job._id)}>
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedJob && (
          <div className="mj-modal-overlay" onClick={() => setSelectedJob(null)}>
            <div className="mj-modal" onClick={(e) => e.stopPropagation()}>
              <div className="mj-modal-header">
                <h3 className="m-0 h5 fw-bold">Review Applicants</h3>
                <button className="btn-close btn-close-white" onClick={() => setSelectedJob(null)}></button>
              </div>
              <div className="mj-modal-body">
                <p className="text-secondary small mb-4">Applicants for: <span className="text-white fw-bold">{selectedJob.title}</span></p>
                {selectedJob.appliedUsers.length === 0 ? (
                  <div className="text-center py-4 text-muted">No applications yet.</div>
                ) : (
                  selectedJob.appliedUsers.map((user) => (
                    <div key={user._id} className="mj-user-card shadow-sm">
                      <div className="d-flex align-items-center gap-2 mb-2">
                         <i className="bi bi-person-circle text-accent"></i>
                         <span className="fw-bold text-white">{user.name}</span>
                      </div>
                      <div className="mj-user-info d-flex flex-column gap-1">
                        <span><i className="bi bi-envelope me-2"></i>{user.email}</span>
                        <span><i className="bi bi-telephone me-2"></i>{user.phone}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MyJobs;