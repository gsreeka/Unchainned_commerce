import "./header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        {/* Top Row */}
        <div className="header-top">
          <div className="header-logo-section">
            <img
              src="/image.png"
              alt="NEMA Logo"
              className="header-logo"
            />
            <div>
              <div className="header-title">
                The National Electrical Manufacturers Association
              </div>
              {/* <div className="header-subtitle">Powered by Accuris</div> */}
            </div>
          </div>
          <div className="header-links">
            <span>Store Home</span>
            <span>|</span>
            <span>Help & Support</span>
            <span>|</span>
            <span>Sign In</span>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="header-bottom">
          <div className="header-search-section">
            <div className="header-category">SHOP by Category ▼</div>

            <div className="header-search">
              <input
                type="text"
                placeholder="Search NEMA"
                className="header-search-input"
              />
              <select className="header-search-select">
                <option>NEMA Catalog</option>
              </select>
              <button className="header-search-btn">🔍</button>
            </div>
          </div>

          <div className="header-account-section">
            <div className="header-account">MY ACCOUNT ▼</div>
            <div className="header-cart">🛒</div>
          </div>
        </div>
      </div>
    </header>
  );
}
