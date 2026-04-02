import { useEffect, useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

/**
 * CUSTOM BRAND STYLING
 * Minimum custom CSS for specific branding requirements.
 */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --brand-green: #08813e;
    --brand-green-hover: #097037;
  }

  body { 
    background-color: #000000; 
    font-family: 'DM Sans', sans-serif; 
    color: #FFFFFF;
  }

  .font-syne { font-family: 'Syne', sans-serif; }
  
  .glass-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.07);
    backdrop-filter: blur(10px);
    border-radius: 16px;
  }

  .btn-brand {
    background-color: var(--brand-green);
    color: #FFFFFF;
    border: none;
  }

  .btn-brand:hover {
    background-color: var(--brand-green-hover);
    color: #FFFFFF;
  }

  .btn-outline-custom {
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
  }

  .btn-outline-custom:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #FFFFFF;
    border-color: rgba(255, 255, 255, 0.2);
  }

  .form-control-dark {
    background-color: #000000;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #FFFFFF;
  }

  .form-control-dark:focus {
    background-color: #000000;
    border-color: var(--brand-green);
    color: #FFFFFF;
    box-shadow: none;
  }

  .avatar-circle {
    width: 52px;
    height: 52px;
    border: 1px solid var(--brand-green);
    color: var(--brand-green);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    font-weight: 700;
  }
`;

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [pw, setPw] = useState({ oldPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchUser(); }, []);

  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data);
      setForm({ name: res.data.name || "", phone: res.data.phone || "" });
    } finally { setLoading(false); }
  };

  const handleUpdate = async () => {
    try {
      const res = await API.put("/auth/update", form);
      setUser(res.data);
      setEditMode(false);
    } catch (err) { alert(err.response?.data?.msg || "Update failed"); }
  };

  const handlePwChange = async () => {
    try {
      await API.put("/auth/change-password", pw);
      alert("Password updated");
      setPw({ oldPassword: "", newPassword: "" });
      setShowPw(false);
    } catch (err) { alert(err.response?.data?.msg || "Error"); }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const deleteAccount = async () => {
    if (!window.confirm("Delete account?")) return;
    try {
      await API.delete("/auth/delete");
      localStorage.removeItem("token");
      navigate("/login");
    } catch { alert("Error deleting account"); }
  };

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="min-vh-100 pb-5">
      <style>{css}</style>
      <Navbar />

      <div className="container mt-5" style={{ maxWidth: '520px' }}>
        <h1 className="font-syne h6 text-uppercase mb-4" style={{ color: 'var(--brand-green)', letterSpacing: '0.18em' }}>
          Account Settings
        </h1>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border spinner-border-sm" style={{ color: 'var(--brand-green)' }}></div>
          </div>
        ) : user && (
          <>
            {/* Profile Header Section */}
            <div className="glass-card p-4 mb-3">
              <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-white border-opacity-10">
                <div className="avatar-circle font-syne">{initials}</div>
                <div>
                  <h2 className="font-syne h6 mb-1 text-white">{user.name || "User"}</h2>
                  <p className="small text-white-50 mb-0">{user.email}</p>
                </div>
              </div>

              {!editMode ? (
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2 rounded  bg-opacity-10 text-success"><i className="bi bi-person"></i></div>
                      <div>
                        <small className="text-uppercase text-white-50 d-block" style={{ fontSize: '10px' }}>Full Name</small>
                        <span className="text-white">{user.name || "—"}</span>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-outline-success border-opacity-25" style={{ fontSize: '12px' }} onClick={() => setEditMode(true)}>Edit</button>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded  text-success"><i className="bi bi-phone"></i></div>
                    <div>
                      <small className="text-uppercase text-white-50 d-block" style={{ fontSize: '10px' }}>Phone Number</small>
                      <span className="text-white">{user.phone || "—"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  <input className="form-control form-control-dark" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full Name" />
                  <input className="form-control form-control-dark" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
                  <div className="row g-2 mt-1">
                    <div className="col"><button className="btn btn-brand w-100 py-2" onClick={handleUpdate}>Save</button></div>
                    <div className="col"><button className="btn btn-outline-custom w-100 py-2" onClick={() => setEditMode(false)}>Cancel</button></div>
                  </div>
                </div>
              )}
            </div>

            {/* Security Section */}
            <div className="glass-card p-4 mb-3">
              <label className="font-syne text-uppercase text-white-50 mb-3" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>Security</label>
              {!showPw ? (
                <button className="btn btn-outline-custom w-100 d-flex align-items-center gap-2 py-2" style={{ color: 'var(--brand-green)' }} onClick={() => setShowPw(true)}>
                  <i className="bi bi-shield-lock"></i> Change Password
                </button>
              ) : (
                <div className="d-flex flex-column gap-2">
                  <input className="form-control form-control-dark" type="password" placeholder="Current Password" onChange={e => setPw({ ...pw, oldPassword: e.target.value })} />
                  <input className="form-control form-control-dark" type="password" placeholder="New Password" onChange={e => setPw({ ...pw, newPassword: e.target.value })} />
                  <div className="row g-2 mt-1">
                    <div className="col"><button className="btn btn-brand w-100 py-2" onClick={handlePwChange}>Update</button></div>
                    <div className="col"><button className="btn btn-outline-custom w-100 py-2" onClick={() => setShowPw(false)}>Cancel</button></div>
                  </div>
                </div>
              )}
            </div>

            {/* Danger Zone Section */}
            <div className="glass-card p-4">
              <label className="font-syne text-uppercase text-white-50 mb-3" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>Sessions</label>
              <div className="d-flex flex-column gap-2">
                <button className="btn text-light w-100 text-start d-flex align-items-center gap-2 py-2" onClick={logout}>
                  <i className="bi bi-box-arrow-right"></i> Log Out
                </button>
                <button className="btn text-danger  w-100 text-start d-flex align-items-center gap-2 py-2" onClick={deleteAccount}>
                  <i className="bi text-danger bi-trash3"></i> Delete Account
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}