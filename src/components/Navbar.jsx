function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="nav-logo">Social Simulations</div>
        <div className="nav-buttons">
          <button
            className={`nav-button ${activeTab === 'simulate' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulate')}
          >
            Simulate
          </button>
          <button
            className={`nav-button ${activeTab === 'math' ? 'active' : ''}`}
            onClick={() => setActiveTab('math')}
          >
            Math Behind
          </button>
          <button
            className={`nav-button ${activeTab === 'cases' ? 'active' : ''}`}
            onClick={() => setActiveTab('cases')}
          >
            Case Studies
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
