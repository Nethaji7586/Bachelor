import { useNavigate, useLocation, Link } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAuthenticated = !!localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const closeMenu = () => {
    const menu = document.getElementById("navbarNav");
    if (menu && menu.classList.contains("show")) {
      menu.classList.remove("show");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black sticky-top shadow">
      <div className="container-fluid px-4">
        
        {/* Logo - Stays on the Left */}
        <Link className="navbar-brand fw-bold text-success" to="/" onClick={closeMenu}>
          Bachelor<span className="text-white">.</span>
        </Link>

        <button 
          className="navbar-toggler border-0 shadow-none" 
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"   
          aria-label="Toggle navigation"
        >
          <i className="bi bi-chevron-down fs-3"></i>
        </button>

        {/* Menu Container */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Changed me-auto to ms-auto to push items to the right */}
          <ul className="navbar-nav ms-auto gap-2 align-items-center">
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/") ? "active text-success" : ""}`}
                to="/"
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/create-job") ? "active text-success" : ""}`}
                    to="/create-job"
                    onClick={closeMenu}
                  >
                    Post Job
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/my-jobs") ? "active text-success" : ""}`}
                    to="/my-jobs"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/profile") ? "active text-success" : ""}`}
                    to="/profile"
                    onClick={closeMenu}
                  >
                    Profile
                  </Link>
                </li>

                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger btn-sm ms-lg-3 px-3"
                    onClick={() => { logout(); closeMenu(); }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={closeMenu}>Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-success btn-sm ms-lg-2" to="/register" onClick={closeMenu}>Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;