import { useState, useEffect } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 480);
  const navigate = useNavigate();

  // Handle window resizing for responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 480);
    window.addEventListener("resize", handleResize);
    
    // Check for existing token
    const token = localStorage.getItem("token");
    if (token) navigate("/");

    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={styles.page}>
      <div style={styles.blobTop} />
      <div style={styles.blobBottom} />

      <div style={{
        ...styles.card,
        width: isMobile ? "90%" : "100%",
        padding: isMobile ? "32px 24px" : "44px 40px 36px",
      }}>
        <div style={styles.logoWrap}>
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
            <polygon
              points="19,2 35,10.5 35,27.5 19,36 3,27.5 3,10.5"
              stroke="#00e5cc"
              strokeWidth="1.5"
              fill="none"
            />
            <polygon
              points="19,9 28,14 28,24 19,29 10,24 10,14"
              fill="#00e5cc"
              opacity="0.15"
            />
            <circle cx="19" cy="19" r="3.5" fill="#00e5cc" />
          </svg>
        </div>

        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.subtitle}>Sign in to continue</p>

        <div style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              style={{
                ...styles.input,
                ...(focused === "email" ? styles.inputFocused : {}),
              }}
              autoComplete="email"
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              style={{
                ...styles.input,
                ...(focused === "password" ? styles.inputFocused : {}),
              }}
              autoComplete="current-password"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonLoading : {}),
            }}
          >
            {loading ? (
              <span style={styles.spinnerRow}>
                <span style={styles.spinner} /> Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </div>

        <p style={styles.footerText}>
          New here?{" "}
          <span style={styles.footerLink} onClick={() => navigate("/register")}>
            Create an account
          </span>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        
        /* Reset for input zoom on iOS */
        input { font-size: 16px !important; } 

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
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
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  blobTop: {
    position: "absolute",
    top: "-120px",
    right: "-100px",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(0,229,204,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  blobBottom: {
    position: "absolute",
    bottom: "-140px",
    left: "-80px",
    width: "380px",
    height: "380px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(0,229,204,0.05) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    zIndex: 1,
    background: "rgba(20,20,20,0.9)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "20px",
    maxWidth: "380px",
    boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
    animation: "fadeUp 0.4s ease both",
    boxSizing: "border-box",
  },
  logoWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  title: {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "600",
    margin: "0 0 6px",
    textAlign: "center",
    letterSpacing: "-0.3px",
  },
  subtitle: {
    color: "#555",
    fontSize: "13.5px",
    margin: "0 0 32px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },
  label: {
    color: "#888",
    fontSize: "12.5px",
    fontWeight: "500",
    letterSpacing: "0.3px",
  },
  input: {
    background: "#111",
    border: "1px solid #252525",
    borderRadius: "10px",
    padding: "12px 14px",
    color: "#f0f0f0",
    fontSize: "16px", // Set to 16px to prevent iOS auto-zoom
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    width: "100%",
    boxSizing: "border-box",
  },
  inputFocused: {
    borderColor: "#00e5cc",
    boxShadow: "0 0 0 3px rgba(0,229,204,0.1)",
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
    transition: "opacity 0.2s, transform 0.1s",
    letterSpacing: "0.2px",
    width: "100%",
  },
  buttonLoading: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  spinnerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    display: "inline-block",
    width: "13px",
    height: "13px",
    border: "2px solid rgba(0,0,0,0.2)",
    borderTopColor: "#000",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  footerText: {
    color: "#4a4a4a",
    fontSize: "13px",
    textAlign: "center",
    marginTop: "24px",
    marginBottom: 0,
  },
  footerLink: {
    color: "#00e5cc",
    cursor: "pointer",
    fontWeight: "500",
    textDecoration: "none",
    display: "inline-block",
    padding: "4px", // Increase tap target size
  },
};

export default Login;