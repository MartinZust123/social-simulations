import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="nav-logo">Social Simulations</div>
        <div className="nav-buttons">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
            end
          >
            Simulate
          </NavLink>
          <NavLink
            to="/math-behind"
            className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
          >
            Math Behind
          </NavLink>
          <NavLink
            to="/case-studies"
            className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
          >
            Case Studies
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
