import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout, isAdmin, isAuthenticated } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar-custom">
      <div className="container h-100">
        <div className="d-flex align-items-center justify-content-between h-100">
          {/* Brand */}
          <Link to="/" className="navbar-brand-custom text-decoration-none">
            🛍️ MiniShop
          </Link>

          {/* Desktop Nav */}
          <div className="d-none d-md-flex align-items-center gap-2">
            <Link to="/" className="nav-link-custom text-decoration-none">Trang Chủ</Link>
            <Link to="/products" className="nav-link-custom text-decoration-none">Sản Phẩm</Link>
            {isAdmin() && (
              <>
                <Link to="/admin/products" className="nav-link-custom text-decoration-none">Quản Lý SP</Link>
                <Link to="/admin/orders" className="nav-link-custom text-decoration-none">Đơn Hàng</Link>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="d-flex align-items-center gap-3">
            {/* Cart */}
            <Link to="/cart" className="nav-link-custom text-decoration-none d-flex align-items-center gap-1">
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {/* Auth */}
            {isAuthenticated() ? (
              <div className="dropdown">
                <button
                  className="btn-outline-custom d-flex align-items-center gap-2"
                  onClick={() => setMenuOpen(!menuOpen)}
                  style={{ fontSize: '0.875rem' }}
                >
                  👤 {user?.username}
                </button>
                {menuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      background: 'var(--dark-card)',
                      border: '1px solid var(--dark-border)',
                      borderRadius: '12px',
                      padding: '0.5rem',
                      minWidth: '180px',
                      zIndex: 9999,
                      boxShadow: 'var(--shadow-lg)'
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Link to="/orders" className="d-block px-3 py-2 text-decoration-none nav-link-custom rounded">
                      📦 Đơn hàng của tôi
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="d-block w-100 text-start px-3 py-2 border-0 bg-transparent nav-link-custom rounded"
                      style={{ color: 'var(--secondary)' }}
                    >
                      🚪 Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login">
                  <button className="btn-outline-custom" style={{ fontSize: '0.875rem', padding: '8px 16px' }}>
                    Đăng nhập
                  </button>
                </Link>
                <Link to="/register" className="d-none d-md-block">
                  <button className="btn-primary-custom" style={{ fontSize: '0.875rem', padding: '8px 16px' }}>
                    Đăng ký
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
