import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="footer-brand mb-3">🛍️ MiniShop</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Mua sắm thông minh, sống chất lượng. Hàng ngàn sản phẩm chính hãng với giá tốt nhất.
            </p>
          </div>
          <div className="col-md-4">
            <h6 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '1rem' }}>Liên kết nhanh</h6>
            <div className="d-flex flex-column gap-2">
              <Link to="/" className="text-decoration-none" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>🏠 Trang chủ</Link>
              <Link to="/products" className="text-decoration-none" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>📦 Sản phẩm</Link>
              <Link to="/cart" className="text-decoration-none" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>🛒 Giỏ hàng</Link>
              <Link to="/orders" className="text-decoration-none" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>📋 Đơn hàng</Link>
            </div>
          </div>
          <div className="col-md-4">
            <h6 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '1rem' }}>Liên hệ</h6>
            <div className="d-flex flex-column gap-2" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span>📧 xuan.nhi@minishop.vn</span>
              <span>📞 0912 345 678</span>
              <span>📍 TP. Hồ Chí Minh, Việt Nam</span>
            </div>
          </div>
        </div>
        <hr style={{ borderColor: 'var(--dark-border)' }} />
        <div className="text-center" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          © 2026 MiniShop by Xuân Nhi. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
