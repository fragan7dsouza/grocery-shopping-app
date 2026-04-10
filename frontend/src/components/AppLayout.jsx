import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function AppLayout() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { user, token, clearSession } = useAuth();

  const links = [{ to: '/', label: 'Home' }];

  if (!token) {
    links.push({ to: '/login', label: 'Login' }, { to: '/register', label: 'Register' });
  }

  if (user?.role === 'customer') {
    links.push(
      { to: '/cart', label: totalItems > 0 ? `Cart (${totalItems})` : 'Cart' },
      { to: '/orders', label: 'Orders' }
    );
  }

  if (user?.role === 'admin') {
    links.push({ to: '/admin', label: 'Admin' });
  }

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-content">
          <div className="brand-block">
            <h1 className="brand">Grocery Shop</h1>
            <p className="brand-tag">Simple everyday essentials</p>
          </div>
          <div className="nav-group">
            <nav className="nav-links" aria-label="Main navigation">
              {links.map((link) => (
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
            {token ? (
              <button type="button" className="nav-logout" onClick={handleLogout}>
                Logout
              </button>
            ) : null}
          </div>
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
