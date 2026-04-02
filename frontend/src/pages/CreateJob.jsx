import { useState } from "react";
import API from "../utils/api";
import Navbar from "../components/Navbar";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg: #000000; --surface: #000000; --surface2: #000000;
    --border: #2b2828; --accent: #ffffff; --text: #ffffff;
    --muted: #ffffff; --danger: #ff4d6d; --radius: 14px;
  }

  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }

  .cj-hero-tag {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(0,229,160,0.08); border: 1px solid rgba(0,229,160,0.22);
    color: var(--accent); font-size: 0.72rem; font-weight: 600;
    padding: 5px 14px; border-radius: 100px; text-transform: uppercase;
  }

  .cj-hero h1 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(2rem, 5vw, 3rem); }

  .cj-form {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 40px;
  }

  .cj-section-label {
    font-family: 'Syne', sans-serif; font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted);
    display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
  }
  .cj-section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .cj-label { font-size: 0.8rem; color: var(--muted); display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }

  .cj-input {
    background: var(--surface2); border: 1.5px solid var(--border);
    border-radius: var(--radius); color: var(--text); font-size: 16px;
    padding: 12px 16px; outline: none; transition: 0.2s; width: 100%;
  }
  .cj-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,229,160,0.1); }

  .cj-submit-btn {
    background: var(--accent); color: #000; border: none; border-radius: var(--radius);
    padding: 14px; font-family: 'Syne', sans-serif; font-weight: 700; transition: 0.2s;
  }

  .cj-cancel-btn {
    background: transparent; border: 0px solid var(--border);
    border-radius: var(--radius); color: var(--muted); padding: 14px;
  }

  .cj-toast {
    position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
    background: var(--surface); border: 1px solid var(--border);
    padding: 12px 24px; border-radius: 12px; z-index: 2000; transition: 0.3s;
  }
`;

const icons = {
  briefcase: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  dollar: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  location: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  phone: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  clock: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  users: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  send: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
};

function CreateJob() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", msg: "" });
  const [form, setForm] = useState({
    title: "", salary: "", location: "", phone: "",
    duration: "", membersNeeded: "", hours: ""
  });

  const showToast = (type, msg) => {
    setToast({ show: true, type, msg });
    setTimeout(() => setToast({ show: false, type: "", msg: "" }), 3000);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.title || !form.salary || !form.location) return showToast("error", "Please fill required fields");
    try {
      setLoading(true);
      await API.post("/jobs/create", form);
      showToast("success", "Job published successfully!");
      setForm({ title: "", salary: "", location: "", phone: "", duration: "", membersNeeded: "", hours: "" });
    } catch { showToast("error", "Failed to create job"); } 
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{style}</style>
      <Navbar />
      <div className="container py-5">
        <div className="text-center mb-5">
  <div className="cj-hero-tag mb-3"><span>+</span> Bachelor Base</div>

  <h1 className="mb-2 cj-hero">
    <span className="text-white">Job</span>{" "}
    <span className="text-warning">வாய்ப்பு</span>
  </h1>

  <p className="text-secondary mx-auto" style={{ maxWidth: '450px' }}>    <br />
    தெய்வத்தான் ஆகாது எனினும் முயற்சிதன்
    மெய்வருத்தக் கூலி தரும்
  </p>
</div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="cj-form shadow-lg">
              
              <div className="cj-section-label">Basic Info</div>
              <div className="mb-4">
                <label className="cj-label">{icons.briefcase} Work Title <span className="text-danger">*</span></label>
                <input className="cj-input" name="title" value={form.title} placeholder="e.g. Catring" onChange={handleChange} />
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="cj-label">{icons.dollar} Salary / Rate <span className="text-danger">*</span></label>
                  <input className="cj-input" name="salary" value={form.salary} placeholder="e.g. ₹40,000/mo" onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="cj-label">{icons.location} Location <span className="text-danger">*</span></label>
                  <input className="cj-input" name="location" value={form.location} placeholder="e.g. Chennai / Remote" onChange={handleChange} />
                </div>
              </div>

              <div className="cj-section-label">Contact & Schedule</div>
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label className="cj-label">{icons.phone} Phone</label>
                  <input className="cj-input" name="phone" value={form.phone} placeholder="+91..." onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="cj-label">{icons.clock} Duration</label>
                  <input className="cj-input" name="duration" value={form.duration} placeholder="3 months" onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="cj-label">{icons.clock} Visible (hrs)</label>
                  <input className="cj-input" name="hours" type="number" value={form.hours} placeholder="72" onChange={handleChange} />
                </div>
              </div>

              <div className="cj-section-label">Requirements</div>
              <div className="mb-5">
                <label className="cj-label">{icons.users} Members Needed</label>
                <input className="cj-input" name="membersNeeded" type="number" value={form.membersNeeded} placeholder="5" onChange={handleChange} />
              </div>

              <div className="row g-3">
                <div className="col-md-8">
                  <button className="cj-submit-btn w-100 d-flex align-items-center justify-content-center gap-2" type="button" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Posting..." : <>{icons.send} Post Job</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast.show && (
        <div className="cj-toast shadow-lg">
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}
    </>
  );
}

export default CreateJob;