import { NavLink, Outlet } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/login', label: 'Login' },
  { to: '/register', label: 'Register' },
  { to: '/cart', label: 'Cart' },
  { to: '/orders', label: 'Orders' },
  { to: '/admin', label: 'Admin' }
];

function AppLayout() {
  const { totalItems } = useCart();

  const linksWithCount = links.map((link) => {
    if (link.to === '/cart') {
      return {
        ...link,
        label: totalItems > 0 ? `Cart (${totalItems})` : 'Cart'
      };
    }
    return link;
  });

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-content">
          <div className="brand-block">
            <h1 className="brand">Grocery Shop</h1>
            <p className="brand-tag">Simple everyday essentials</p>
          </div>
          <nav className="nav-links" aria-label="Main navigation">
            {linksWithCount.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="page-wrap">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-content">© 2026 Kanav Sharma. All Rights Reserved</div>
      </footer>
    </div>
  );
}

export default AppLayout;
