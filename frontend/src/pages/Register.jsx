import { useState, useEffect } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 480);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle window resizing for responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 480);
    window.addEventListener("resize", handleResize);

    const token = localStorage.getItem("token");
    if (token) navigate("/");

    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return alert("Please fill in all fields");
    }

    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match");
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      alert(res.data.msg || "Registered successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <div style={styles.page}>
      {/* Background glow blobs to match Login page */}
      <div style={styles.blobTop} />
      <div style={styles.blobBottom} />

      <div style={{
        ...styles.card,
        width: isMobile ? "92%" : "100%",
        padding: isMobile ? "32px 20px" : "40px",
      }}>
        <div style={styles.header}>
          <div style={styles.logo}>⬡</div>
          <h2 style={styles.title}>Create an account</h2>
          <p style={styles.subtitle}>Get started today</p>
        </div>

        <div style={styles.form}>
          <div style={styles.field}>
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              style={styles.input}
              autoComplete="name"
            />
          </div>

          <div style={styles.field}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              style={styles.input}
              autoComplete="email"
            />
          </div>

          <div style={styles.field}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              style={styles.input}
            />
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p style={styles.loginText}>
            Already have an account?{" "}
            <span style={styles.loginLink} onClick={() => navigate("/login")}>
              Sign in
            </span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0a0a0a",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  blobTop: {
    position: "absolute",
    top: "-120px",
    right: "-100px",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(0,229,204,0.06) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  blobBottom: {
    position: "absolute",
    bottom: "-140px",
    left: "-80px",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(0,229,204,0.04) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    zIndex: 1,
    background: "rgba(20,20,20,0.9)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    maxWidth: "380px",
    boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
    backdropFilter: "blur(12px)",
    animation: "fadeUp 0.4s ease both",
    boxSizing: "border-box",
  },
  header: {
    textAlign: "center",
    marginBottom: "28px",
  },
  logo: {
    fontSize: "32px",
    color: "#00e5cc",
    marginBottom: "12px",
    display: "block",
  },
  title: {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "600",
    margin: "0 0 6px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "#666",
    fontSize: "14px",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    background: "#111",
    border: "1px solid #2e2e2e",
    borderRadius: "10px",
    padding: "12px 14px",
    color: "#fff",
    fontSize: "16px", // Set to 16px to prevent iOS auto-zoom
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  button: {
    marginTop: "8px",
    background: "#00e5cc",
    color: "#000",
    border: "none",
    borderRadius: "10px",
    padding: "14px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.1s, opacity 0.2s",
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  loginText: {
    textAlign: "center",
    color: "#666",
    fontSize: "13px",
    marginTop: "20px",
    margin: 0,
  },
  loginLink: {
    color: "#00e5cc",
    cursor: "pointer",
    fontWeight: "500",
    padding: "4px", // Better tap target
  },
};

export default Register;